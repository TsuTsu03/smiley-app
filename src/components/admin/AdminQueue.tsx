'use client';

import { useState, useEffect } from 'react';
import { ListChecks, Clock, CheckCircle2, X, ArrowRight } from 'lucide-react';
import { Card, Badge, StatCard, SectionHeader, Btn, EmptyState } from '@/components/ui';
import { useAuth } from '@/lib/auth';

const today = () => new Date().toISOString().slice(0, 10);
const isWaiting = (s: string) => s === 'pending' || s === 'confirmed';

export default function AdminQueue() {
  const { user } = useAuth();
  const [appts, setAppts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const load = () => {
    if (!user?.clinicId) return;
    fetch(`/api/appointments?clinicId=${user.clinicId}`)
      .then((r) => r.json())
      .then((a) => setAppts(Array.isArray(a) ? a : []))
      .finally(() => setLoading(false));
  };

  useEffect(load, [user?.clinicId]);

  const setStatus = async (id: string, status: string) => {
    setBusy(id);
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      load();
    } finally {
      setBusy(null);
    }
  };

  const todays = appts
    .filter((a) => a.date === today())
    .sort((a, b) => a.time.localeCompare(b.time));

  const waiting = todays.filter((a) => isWaiting(a.status));
  const done = todays.filter((a) => a.status === 'completed');
  const nextId = waiting[0]?.id; // earliest waiting = "now serving / up next"

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-sky-50 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Today's Queue"
        sub={new Date().toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric' })}
        action={<Btn variant="secondary" size="sm" onClick={load}>Refresh</Btn>}
      />

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <StatCard icon={<ListChecks size={18} />} color="blue" label="Today" value={todays.length} />
        <StatCard icon={<Clock size={18} />} color="amber" label="Waiting" value={waiting.length} />
        <StatCard icon={<CheckCircle2 size={18} />} color="teal" label="Completed" value={done.length} />
      </div>

      <Card>
        {todays.length === 0 ? (
          <EmptyState icon={<ListChecks size={28} />} title="No appointments today" desc="Bookings for today will appear here in time order." />
        ) : (
          <div className="divide-y divide-sky-50">
            {todays.map((a) => {
              const upNext = a.id === nextId;
              const waitingNow = isWaiting(a.status);
              return (
                <div
                  key={a.id}
                  className={`flex flex-col sm:flex-row sm:items-center gap-3 px-4 sm:px-5 py-3.5 transition-colors ${
                    upNext ? 'bg-teal-50/50' : 'hover:bg-sky-50/30'
                  }`}
                >
                  {/* time */}
                  <div className="w-16 shrink-0">
                    <div className="font-display text-base text-sky-900 leading-none">{a.time}</div>
                    {upNext && <div className="text-[10px] font-bold text-teal-600 uppercase mt-1">Up next</div>}
                  </div>

                  {/* patient */}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sky-800 text-sm truncate">{a.patientName}</div>
                    <div className="text-xs text-sky-400 truncate">{a.type} · {a.dentistName}</div>
                  </div>

                  {/* status */}
                  <Badge status={a.status} />

                  {/* actions */}
                  {waitingNow && (
                    <div className="flex gap-2 shrink-0">
                      <Btn size="sm" disabled={busy === a.id} onClick={() => setStatus(a.id, 'completed')}>
                        <CheckCircle2 size={13} /> Done
                      </Btn>
                      <Btn variant="danger" size="sm" disabled={busy === a.id} onClick={() => setStatus(a.id, 'cancelled')}>
                        <X size={13} /> No-show
                      </Btn>
                    </div>
                  )}
                  {a.status === 'completed' && (
                    <span className="text-xs text-teal-600 font-medium flex items-center gap-1 shrink-0">
                      <CheckCircle2 size={13} /> Served
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {waiting.length > 0 && (
        <p className="text-center text-xs text-sky-400">
          {waiting.length} patient{waiting.length > 1 ? 's' : ''} still waiting
          <ArrowRight size={11} className="inline mx-1" />
          mark each <strong className="text-sky-600">Done</strong> as they finish.
        </p>
      )}
    </div>
  );
}
