'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Users, CalendarCheck, Percent, Wallet } from 'lucide-react';
import { Card, StatCard, SectionHeader } from '@/components/ui';
import { useAuth } from '@/lib/auth';

const peso = (n: number) => `₱${Number(n || 0).toLocaleString('en-PH')}`;
const monthKey = (d: string) => (d || '').slice(0, 7); // YYYY-MM
const monthLabel = (key: string) => {
  const [y, m] = key.split('-');
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString('en-PH', { month: 'short' });
};

export default function AdminAnalytics() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [appts, setAppts] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.clinicId) return;
    Promise.all([
      fetch(`/api/patients?clinicId=${user.clinicId}`).then((r) => r.json()),
      fetch(`/api/appointments?clinicId=${user.clinicId}`).then((r) => r.json()),
      fetch(`/api/invoices?clinicId=${user.clinicId}`).then((r) => r.json()).catch(() => []),
    ]).then(([p, a, inv]) => {
      setPatients(Array.isArray(p) ? p : []);
      setAppts(Array.isArray(a) ? a : []);
      setInvoices(Array.isArray(inv) ? inv : []);
    }).finally(() => setLoading(false));
  }, [user?.clinicId]);

  if (loading) return <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-24 bg-sky-50 rounded-2xl animate-pulse" />)}</div>;

  const thisMonth = new Date().toISOString().slice(0, 7);
  const newThisMonth = patients.filter((p) => monthKey(p.registeredAt) === thisMonth).length;
  const apptsThisMonth = appts.filter((a) => monthKey(a.date) === thisMonth).length;

  const finished = appts.filter((a) => a.status === 'completed' || a.status === 'cancelled');
  const cancelled = appts.filter((a) => a.status === 'cancelled').length;
  const noShowRate = finished.length ? Math.round((cancelled / finished.length) * 100) : 0;
  const revenue = invoices.reduce((s, i) => s + Number(i.amountPaid || 0), 0);

  // New patients per month (last 6 months)
  const months: string[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    months.push(d.toISOString().slice(0, 7));
  }
  const perMonth = months.map((m) => patients.filter((p) => monthKey(p.registeredAt) === m).length);
  const maxMonth = Math.max(1, ...perMonth);

  // Top procedures
  const counts: Record<string, number> = {};
  appts.forEach((a) => { if (a.type) counts[a.type] = (counts[a.type] || 0) + 1; });
  const topProcedures = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxProc = Math.max(1, ...topProcedures.map(([, n]) => n));

  return (
    <div className="space-y-6">
      <SectionHeader title="Analytics" sub="Clinic performance at a glance" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard icon={<Users size={18} />} color="blue" label="Total Patients" value={patients.length} sub={`+${newThisMonth} this month`} />
        <StatCard icon={<CalendarCheck size={18} />} color="teal" label="Appointments (mo)" value={apptsThisMonth} />
        <StatCard icon={<Percent size={18} />} color="amber" label="No-show Rate" value={`${noShowRate}%`} />
        <StatCard icon={<Wallet size={18} />} color="teal" label="Revenue Collected" value={peso(revenue)} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* New patients trend */}
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-sky-500" />
            <h3 className="font-semibold text-sky-900 text-sm">New patients · last 6 months</h3>
          </div>
          <div className="flex items-end justify-between gap-2 h-40">
            {perMonth.map((n, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="text-[11px] font-semibold text-sky-700">{n}</div>
                <div className="w-full rounded-t-lg bg-gradient-to-t from-sky-500 to-teal-400 transition-all" style={{ height: `${(n / maxMonth) * 100}%`, minHeight: n ? 6 : 2 }} />
                <div className="text-[10px] text-sky-400">{monthLabel(months[i])}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top procedures */}
        <Card className="p-5">
          <h3 className="font-semibold text-sky-900 text-sm mb-4">Top procedures</h3>
          {topProcedures.length === 0 ? (
            <div className="text-sm text-sky-400 py-8 text-center">No appointment data yet.</div>
          ) : (
            <div className="space-y-3">
              {topProcedures.map(([name, n]) => (
                <div key={name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-sky-700 font-medium">{name}</span>
                    <span className="text-sky-400">{n}</span>
                  </div>
                  <div className="h-2 rounded-full bg-sky-100 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-sky-500 to-teal-400" style={{ width: `${(n / maxProc) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <p className="text-center text-xs text-sky-400">
        Revenue is computed from recorded invoice payments. Add invoices in the Billing tab to populate it.
      </p>
    </div>
  );
}
