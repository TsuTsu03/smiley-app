'use client';

import { useRef, useState } from 'react';
import { Upload, FileDown, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Modal, Btn } from '@/components/ui';
import { IMPORT_COLUMNS } from '@/lib/patientImport';

/**
 * Admin-only CSV patient import. Two-step: the file is first previewed (a
 * dry-run POST that validates without writing), then committed. Per-row errors
 * are surfaced so the admin can fix the file and retry. Matching is by email,
 * so re-importing updates existing patients instead of duplicating them.
 */

interface ImportResult {
  committed: boolean;
  inserted: number;
  updated: number;
  failed: number;
  errors: { row: number; errors: string[] }[];
}

const TEMPLATE_HEADER = IMPORT_COLUMNS.join(',');
const TEMPLATE_EXAMPLE =
  'Jane Cruz,1990-04-12,female,09171234567,jane@example.com,"123 Mabini St, Manila",O+,Penicillin;Latex,Juan Cruz,09170000000';

function downloadTemplate() {
  const blob = new Blob([`${TEMPLATE_HEADER}\n${TEMPLATE_EXAMPLE}\n`], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'smiley-patient-import-template.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export default function PatientImport({ onClose, onImported }: { onClose: () => void; onImported: () => void }) {
  const [csv, setCsv] = useState('');
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState<ImportResult | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  async function post(commit: boolean): Promise<ImportResult | null> {
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/patients/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv, commit }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? 'Import failed');
        return null;
      }
      return json as ImportResult;
    } catch {
      setError('Network error — please try again');
      return null;
    } finally {
      setBusy(false);
    }
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setResult(null);
    setPreview(null);
    const reader = new FileReader();
    reader.onload = () => setCsv(String(reader.result ?? ''));
    reader.readAsText(file);
  }

  async function doPreview() {
    const r = await post(false);
    if (r) setPreview(r);
  }

  async function doCommit() {
    const r = await post(true);
    if (r) {
      setResult(r);
      onImported();
    }
  }

  const totalValid = preview ? preview.inserted + preview.updated : 0;

  return (
    <Modal title="Import patients from CSV" onClose={onClose} wide>
      {result ? (
        // ── Done ──────────────────────────────────────────────────────────
        <div className="space-y-4">
          <div className="flex items-center gap-3 rounded-xl bg-accent/10 text-accent px-4 py-3">
            <CheckCircle2 size={20} />
            <div className="text-sm font-medium text-fg">
              Imported {result.inserted} new and updated {result.updated} existing patient
              {result.inserted + result.updated !== 1 ? 's' : ''}.
              {result.failed > 0 && ` ${result.failed} row${result.failed !== 1 ? 's' : ''} skipped.`}
            </div>
          </div>
          {result.errors.length > 0 && <ErrorList errors={result.errors} />}
          <div className="flex justify-end">
            <Btn onClick={onClose}>Done</Btn>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <p className="text-sm text-muted">
            Upload a CSV with the required columns. Patients are matched by email — existing
            records are updated, new ones are added. Need the format?{' '}
            <button onClick={downloadTemplate} className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
              <FileDown size={13} /> Download template
            </button>
          </p>

          {/* File picker */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileRef.current?.click()}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fileRef.current?.click(); } }}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-line-strong py-10 text-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70"
          >
            <Upload size={24} className="text-muted" />
            <div className="text-sm font-medium text-fg">{fileName || 'Choose a CSV file'}</div>
            <div className="text-xs text-subtle">or click to browse</div>
            <input ref={fileRef} type="file" accept=".csv,text/csv" className="hidden" onChange={onFile} />
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-danger/10 text-danger px-4 py-3 text-sm">
              <AlertTriangle size={16} /> {error}
            </div>
          )}

          {preview && (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2 text-xs">
                <Stat label="To add" value={preview.inserted} tone="accent" />
                <Stat label="To update" value={preview.updated} tone="primary" />
                <Stat label="Errors" value={preview.failed} tone={preview.failed ? 'danger' : 'muted'} />
              </div>
              {preview.errors.length > 0 && <ErrorList errors={preview.errors} />}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Btn variant="secondary" onClick={onClose} disabled={busy}>Cancel</Btn>
            {preview ? (
              <Btn onClick={doCommit} loading={busy} disabled={totalValid === 0}>
                Import {totalValid} patient{totalValid !== 1 ? 's' : ''}
              </Btn>
            ) : (
              <Btn onClick={doPreview} loading={busy} disabled={!csv.trim()}>Preview</Btn>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone: 'accent' | 'primary' | 'danger' | 'muted' }) {
  const tones = {
    accent: 'bg-accent/10 text-accent',
    primary: 'bg-primary/10 text-primary',
    danger: 'bg-danger/10 text-danger',
    muted: 'bg-muted/10 text-muted',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-semibold ${tones[tone]}`}>
      <span className="tabular-nums">{value}</span> {label}
    </span>
  );
}

function ErrorList({ errors }: { errors: { row: number; errors: string[] }[] }) {
  return (
    <div className="max-h-40 overflow-y-auto rounded-xl border border-line bg-bg p-3 text-xs">
      <div className="mb-1.5 font-semibold text-danger">Rows that could not be imported</div>
      <ul className="space-y-1">
        {errors.map((e, i) => (
          <li key={i} className="text-muted">
            <span className="font-medium text-fg">{e.row === 0 ? 'File' : `Row ${e.row}`}:</span>{' '}
            {e.errors.join(', ')}
          </li>
        ))}
      </ul>
    </div>
  );
}
