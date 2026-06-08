import { describe, it, expect } from 'vitest';
import {
  MOCK_PATIENTS,
  MOCK_DENTISTS,
  getPatientById,
  getDentistById,
  getAppointmentsForPatient,
  getAppointmentsForDentist,
  getRecordsForPatient,
  getUpcomingAdjustments,
  calcAge,
  fmtDate,
  fmtShortDate,
  PROCEDURE_TYPES,
} from '../data';

describe('data lookups', () => {
  it('finds a patient / dentist by id, and returns undefined for unknown ids', () => {
    const p = MOCK_PATIENTS[0];
    expect(getPatientById(p.id)?.id).toBe(p.id);
    expect(getPatientById('nope')).toBeUndefined();

    const d = MOCK_DENTISTS[0];
    expect(getDentistById(d.id)?.id).toBe(d.id);
    expect(getDentistById('nope')).toBeUndefined();
  });

  it('returns appointments/records filtered by owner', () => {
    const p = MOCK_PATIENTS[0];
    expect(getAppointmentsForPatient(p.id).every((a) => a.patientId === p.id)).toBe(true);
    expect(getRecordsForPatient(p.id).every((r) => r.patientId === p.id)).toBe(true);

    const d = MOCK_DENTISTS[0];
    expect(getAppointmentsForDentist(d.id).every((a) => a.dentistId === d.id)).toBe(true);
  });

  it('returns an array of upcoming adjustments', () => {
    expect(Array.isArray(getUpcomingAdjustments())).toBe(true);
    expect(Array.isArray(getUpcomingAdjustments(30))).toBe(true);
  });
});

describe('formatting helpers', () => {
  it('calcAge computes a sensible age', () => {
    expect(calcAge('2000-06-15')).toBeGreaterThanOrEqual(25);
    expect(typeof calcAge('1990-01-01')).toBe('number');
  });

  it('fmtDate / fmtShortDate return "" for empty input', () => {
    expect(fmtDate('')).toBe('');
    expect(fmtShortDate('')).toBe('');
  });

  it('fmtDate / fmtShortDate format a real date including the year', () => {
    expect(fmtDate('2026-06-15')).toContain('2026');
    expect(fmtShortDate('2026-06-15')).toContain('2026');
  });

  it('exposes a non-empty list of procedure types', () => {
    expect(Array.isArray(PROCEDURE_TYPES)).toBe(true);
    expect(PROCEDURE_TYPES.length).toBeGreaterThan(0);
  });
});
