/**
 * Pure no-show risk scoring — extracted from the API route so it can be
 * unit-tested in isolation. Transparent heuristic based on each patient's
 * own cancellation history plus whether a reminder has been sent yet.
 */
export interface NoShowApptRow {
  id: string;
  patient_id: string;
  date: string; // YYYY-MM-DD
  time: string;
  type: string;
  status: string;
  reminder_sent_at: string | null;
  patientName?: string | null;
}

export interface NoShowResult {
  appointmentId: string;
  patientName: string;
  date: string;
  time: string;
  type: string;
  riskPct: number;
  level: 'High' | 'Medium' | 'Low';
}

export function scoreNoShowRisk(rows: NoShowApptRow[], today: string): NoShowResult[] {
  // Build per-patient history from PAST appointments
  const hist: Record<string, { cancelled: number; completed: number; total: number }> = {};
  for (const a of rows) {
    if (a.date >= today) continue;
    const h = (hist[a.patient_id] ||= { cancelled: 0, completed: 0, total: 0 });
    h.total++;
    if (a.status === 'cancelled') h.cancelled++;
    if (a.status === 'completed') h.completed++;
  }

  return rows
    .filter((a) => a.date >= today && a.status !== 'cancelled' && a.status !== 'completed')
    .map((a) => {
      const h = hist[a.patient_id];
      let score: number;
      if (!h || h.total === 0) {
        score = 35; // new patient — unknown, slightly elevated
      } else {
        const cancelRate = h.cancelled / h.total;
        score = Math.round(15 + cancelRate * 70); // 15–85 from history
      }
      if (!a.reminder_sent_at) score += 8; // no reminder yet → higher risk
      score = Math.max(5, Math.min(95, score));
      const level: NoShowResult['level'] = score >= 65 ? 'High' : score >= 40 ? 'Medium' : 'Low';
      return {
        appointmentId: a.id,
        patientName: a.patientName ?? 'Unknown',
        date: a.date,
        time: a.time,
        type: a.type,
        riskPct: score,
        level,
      };
    })
    .sort((x, y) => y.riskPct - x.riskPct);
}
