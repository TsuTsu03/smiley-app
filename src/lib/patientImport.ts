/**
 * Pure CSV → patient-record logic for bulk import — extracted from the import
 * API route so it can be unit-tested in isolation (same pattern as billing.ts).
 *
 * Nothing here touches the network or the database. The route parses the file,
 * runs it through these helpers to get a validated plan (insert vs update vs
 * error, per row), then applies it.
 */

/** Columns accepted in the import CSV. Header row is required and case-insensitive. */
export const IMPORT_COLUMNS = [
  'fullName',
  'dateOfBirth',
  'gender',
  'phone',
  'email',
  'address',
  'bloodType',
  'allergies',
  'emergencyContact',
  'emergencyPhone',
] as const;

/** Columns that must be present and non-empty on every row. */
const REQUIRED_COLUMNS = [
  'fullName',
  'dateOfBirth',
  'gender',
  'phone',
  'email',
  'address',
  'emergencyContact',
  'emergencyPhone',
] as const;

export interface PatientRecord {
  fullName: string;
  dateOfBirth: string; // ISO date, YYYY-MM-DD
  gender: 'male' | 'female' | 'other';
  phone: string;
  email: string;
  address: string;
  bloodType: string | null;
  allergies: string[];
  emergencyContact: string;
  emergencyPhone: string;
}

export interface RowError {
  row: number; // 1-based data row number (header excluded)
  errors: string[];
}

export interface ImportPlan {
  toInsert: PatientRecord[];
  toUpdate: PatientRecord[]; // email already exists in the clinic
  errors: RowError[];
  validCount: number;
}

/**
 * Minimal RFC-4180-ish CSV parser: handles quoted fields, escaped quotes (""),
 * commas and newlines inside quotes, and trailing/BOM whitespace. Returns rows
 * of raw string cells. Blank lines are skipped.
 */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let field = '';
  let row: string[] = [];
  let inQuotes = false;
  // Strip UTF-8 BOM if present.
  const s = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (inQuotes) {
      if (c === '"') {
        if (s[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field); field = '';
    } else if (c === '\r') {
      // ignore; handled by \n
    } else if (c === '\n') {
      row.push(field); field = '';
      if (row.some((cell) => cell.trim() !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  // flush last field/row
  row.push(field);
  if (row.some((cell) => cell.trim() !== '')) rows.push(row);
  return rows;
}

const GENDERS = new Set(['male', 'female', 'other']);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Validate + normalize one record (keyed by column name). */
export function validateRecord(rec: Record<string, string>): { value?: PatientRecord; errors: string[] } {
  const errors: string[] = [];
  const get = (k: string) => (rec[k] ?? '').trim();

  for (const col of REQUIRED_COLUMNS) {
    if (!get(col)) errors.push(`${col} is required`);
  }

  const dob = get('dateOfBirth');
  if (dob && !DATE_RE.test(dob)) errors.push('dateOfBirth must be YYYY-MM-DD');

  const gender = get('gender').toLowerCase();
  if (gender && !GENDERS.has(gender)) errors.push('gender must be male, female, or other');

  const email = get('email').toLowerCase();
  if (email && !EMAIL_RE.test(email)) errors.push('email is not a valid address');

  if (errors.length) return { errors };

  return {
    errors: [],
    value: {
      fullName: get('fullName'),
      dateOfBirth: dob,
      gender: gender as PatientRecord['gender'],
      phone: get('phone'),
      email,
      address: get('address'),
      bloodType: get('bloodType') || null,
      allergies: get('allergies')
        ? get('allergies').split(/[;|]/).map((a) => a.trim()).filter(Boolean)
        : [],
      emergencyContact: get('emergencyContact'),
      emergencyPhone: get('emergencyPhone'),
    },
  };
}

/**
 * Turn parsed CSV cells into an import plan. `existingEmails` is the set of
 * lower-cased emails already in the target clinic — matching rows are routed to
 * `toUpdate` (upsert) instead of `toInsert`, so re-importing never duplicates.
 * Duplicate emails within the same file are flagged as errors on later rows.
 */
export function buildImportPlan(rows: string[][], existingEmails: Set<string>): ImportPlan {
  const plan: ImportPlan = { toInsert: [], toUpdate: [], errors: [], validCount: 0 };
  if (rows.length === 0) {
    plan.errors.push({ row: 0, errors: ['file is empty'] });
    return plan;
  }

  const header = rows[0].map((h) => h.trim());
  const missingHeaders = REQUIRED_COLUMNS.filter(
    (c) => !header.some((h) => h.toLowerCase() === c.toLowerCase())
  );
  if (missingHeaders.length) {
    plan.errors.push({ row: 0, errors: [`missing columns: ${missingHeaders.join(', ')}`] });
    return plan;
  }

  const seenEmails = new Set<string>();

  for (let r = 1; r < rows.length; r++) {
    const cells = rows[r];
    const rec: Record<string, string> = {};
    header.forEach((h, idx) => {
      const key = IMPORT_COLUMNS.find((c) => c.toLowerCase() === h.toLowerCase());
      if (key) rec[key] = cells[idx] ?? '';
    });

    const { value, errors } = validateRecord(rec);
    if (errors.length || !value) {
      plan.errors.push({ row: r, errors });
      continue;
    }
    if (seenEmails.has(value.email)) {
      plan.errors.push({ row: r, errors: [`duplicate email in file: ${value.email}`] });
      continue;
    }
    seenEmails.add(value.email);
    plan.validCount++;
    if (existingEmails.has(value.email)) plan.toUpdate.push(value);
    else plan.toInsert.push(value);
  }

  return plan;
}
