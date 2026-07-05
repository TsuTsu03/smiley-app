import { describe, it, expect } from 'vitest';
import { parseCsv, validateRecord, buildImportPlan } from '../patientImport';

const HEADER =
  'fullName,dateOfBirth,gender,phone,email,address,bloodType,allergies,emergencyContact,emergencyPhone';
const GOOD_ROW =
  'Jane Cruz,1990-04-12,female,09171234567,jane@example.com,"123 Mabini St, Manila",O+,Penicillin;Latex,Juan Cruz,09170000000';

describe('parseCsv', () => {
  it('parses simple rows into cells', () => {
    expect(parseCsv('a,b,c\n1,2,3')).toEqual([
      ['a', 'b', 'c'],
      ['1', '2', '3'],
    ]);
  });

  it('keeps commas and newlines inside quoted fields', () => {
    const rows = parseCsv('name,addr\n"Cruz, J","1 A St\nManila"');
    expect(rows[1]).toEqual(['Cruz, J', '1 A St\nManila']);
  });

  it('unescapes doubled quotes and strips a BOM', () => {
    const rows = parseCsv('﻿a\n"say ""hi"""');
    expect(rows).toEqual([['a'], ['say "hi"']]);
  });

  it('skips blank lines', () => {
    expect(parseCsv('a\n\n\nb')).toEqual([['a'], ['b']]);
  });
});

describe('validateRecord', () => {
  const base = {
    fullName: 'Jane Cruz',
    dateOfBirth: '1990-04-12',
    gender: 'Female',
    phone: '09171234567',
    email: 'JANE@Example.com',
    address: '123 Mabini St',
    bloodType: 'O+',
    allergies: 'Penicillin; Latex',
    emergencyContact: 'Juan Cruz',
    emergencyPhone: '09170000000',
  };

  it('normalizes gender/email casing and splits allergies', () => {
    const { value, errors } = validateRecord(base);
    expect(errors).toEqual([]);
    expect(value).toMatchObject({
      gender: 'female',
      email: 'jane@example.com',
      allergies: ['Penicillin', 'Latex'],
      bloodType: 'O+',
    });
  });

  it('flags every missing required field', () => {
    const { errors } = validateRecord({});
    expect(errors).toContain('fullName is required');
    expect(errors).toContain('email is required');
    expect(errors.length).toBeGreaterThanOrEqual(8);
  });

  it('rejects a bad date, gender, and email', () => {
    const { errors } = validateRecord({
      ...base,
      dateOfBirth: '04/12/1990',
      gender: 'unknown',
      email: 'not-an-email',
    });
    expect(errors).toContain('dateOfBirth must be YYYY-MM-DD');
    expect(errors).toContain('gender must be male, female, or other');
    expect(errors).toContain('email is not a valid address');
  });

  it('treats optional blood type and allergies as empty', () => {
    const { value } = validateRecord({ ...base, bloodType: '', allergies: '' });
    expect(value?.bloodType).toBeNull();
    expect(value?.allergies).toEqual([]);
  });
});

describe('buildImportPlan', () => {
  it('routes new emails to insert and existing ones to update', () => {
    const rows = parseCsv(
      `${HEADER}\n${GOOD_ROW}\nBob Reyes,1985-01-01,male,0917,bob@example.com,1 St,,,"Ana R",0918`
    );
    const plan = buildImportPlan(rows, new Set(['bob@example.com']));
    expect(plan.validCount).toBe(2);
    expect(plan.toInsert.map((p) => p.email)).toEqual(['jane@example.com']);
    expect(plan.toUpdate.map((p) => p.email)).toEqual(['bob@example.com']);
    expect(plan.errors).toEqual([]);
  });

  it('reports missing required columns and stops', () => {
    const plan = buildImportPlan(parseCsv('fullName,email\nJane,jane@example.com'), new Set());
    expect(plan.errors[0].errors[0]).toMatch(/missing columns/);
    expect(plan.validCount).toBe(0);
  });

  it('flags a duplicate email within the same file', () => {
    const dup = `${HEADER}\n${GOOD_ROW}\nJane Two,1991-01-01,female,0917,jane@example.com,2 St,,,"K",0918`;
    const plan = buildImportPlan(parseCsv(dup), new Set());
    expect(plan.validCount).toBe(1);
    expect(plan.errors).toHaveLength(1);
    expect(plan.errors[0].errors[0]).toMatch(/duplicate email/);
  });

  it('collects per-row validation errors with row numbers', () => {
    const bad = `${HEADER}\nNoEmail,1990-01-01,female,0917,,1 St,,,"K",0918`;
    const plan = buildImportPlan(parseCsv(bad), new Set());
    expect(plan.errors[0].row).toBe(1);
    expect(plan.errors[0].errors).toContain('email is required');
  });
});
