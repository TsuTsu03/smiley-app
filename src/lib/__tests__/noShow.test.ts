import { describe, it, expect } from 'vitest';
import { scoreNoShowRisk, type NoShowApptRow } from '../noShow';

const TODAY = '2026-06-10';

function appt(p: Partial<NoShowApptRow>): NoShowApptRow {
  return {
    id: 'x',
    patient_id: 'p1',
    date: '2026-06-12',
    time: '9:00',
    type: 'Cleaning',
    status: 'pending',
    reminder_sent_at: null,
    patientName: 'Juan',
    ...p,
  };
}

describe('scoreNoShowRisk', () => {
  it('scores a brand-new patient at baseline 35, +8 with no reminder = Medium', () => {
    const res = scoreNoShowRisk([appt({ id: 'a', reminder_sent_at: null })], TODAY);
    expect(res).toHaveLength(1);
    expect(res[0].riskPct).toBe(43);
    expect(res[0].level).toBe('Medium');
  });

  it('scores a new patient with a reminder already sent as Low (35)', () => {
    const res = scoreNoShowRisk([appt({ id: 'a', reminder_sent_at: '2026-06-11' })], TODAY);
    expect(res[0].riskPct).toBe(35);
    expect(res[0].level).toBe('Low');
  });

  it('rates a patient with a high cancellation history as High', () => {
    const rows: NoShowApptRow[] = [
      appt({ id: 'h1', date: '2026-06-01', status: 'cancelled' }),
      appt({ id: 'h2', date: '2026-06-02', status: 'cancelled' }),
      appt({ id: 'h3', date: '2026-06-03', status: 'cancelled' }),
      appt({ id: 'h4', date: '2026-06-04', status: 'completed' }),
      appt({ id: 'up', date: '2026-06-12', status: 'pending', reminder_sent_at: '2026-06-11' }),
    ];
    const res = scoreNoShowRisk(rows, TODAY);
    const up = res.find((r) => r.appointmentId === 'up')!;
    // cancelRate 3/4 = 0.75 → round(15 + 52.5) = 68, reminder sent so no +8
    expect(up.riskPct).toBe(68);
    expect(up.level).toBe('High');
  });

  it('excludes cancelled/completed and past appointments from the output', () => {
    const rows: NoShowApptRow[] = [
      appt({ id: 'past', date: '2026-06-01', status: 'pending' }),
      appt({ id: 'cancelled', status: 'cancelled' }),
      appt({ id: 'completed', status: 'completed' }),
      appt({ id: 'valid', status: 'pending', reminder_sent_at: '2026-06-11' }),
    ];
    const res = scoreNoShowRisk(rows, TODAY);
    expect(res.map((r) => r.appointmentId)).toEqual(['valid']);
  });

  it('sorts results by descending risk', () => {
    const rows: NoShowApptRow[] = [
      // low-risk patient (history of showing up)
      appt({ id: 'lh1', patient_id: 'low', date: '2026-06-01', status: 'completed' }),
      appt({ id: 'lh2', patient_id: 'low', date: '2026-06-02', status: 'completed' }),
      appt({ id: 'low-up', patient_id: 'low', status: 'pending', reminder_sent_at: '2026-06-11' }),
      // high-risk new patient, no reminder
      appt({ id: 'high-up', patient_id: 'new', reminder_sent_at: null }),
    ];
    const res = scoreNoShowRisk(rows, TODAY);
    expect(res[0].appointmentId).toBe('high-up');
    expect(res[0].riskPct).toBeGreaterThan(res[1].riskPct);
  });

  it('clamps and labels low-history patients correctly', () => {
    // patient who always shows up → cancelRate 0 → 15, +8 no reminder = 23 → Low
    const rows: NoShowApptRow[] = [
      appt({ id: 'p1', patient_id: 'g', date: '2026-06-01', status: 'completed' }),
      appt({ id: 'p2', patient_id: 'g', date: '2026-06-02', status: 'completed' }),
      appt({ id: 'up', patient_id: 'g', status: 'pending', reminder_sent_at: null }),
    ];
    const up = scoreNoShowRisk(rows, TODAY).find((r) => r.appointmentId === 'up')!;
    expect(up.riskPct).toBe(23);
    expect(up.level).toBe('Low');
  });

  it('falls back to "Unknown" when patientName is missing', () => {
    const res = scoreNoShowRisk([appt({ id: 'a', patientName: null })], TODAY);
    expect(res[0].patientName).toBe('Unknown');
  });
});
