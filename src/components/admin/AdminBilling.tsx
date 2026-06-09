'use client';

import { useState, useEffect } from 'react';
import { Receipt, Plus, Trash2, Wallet } from 'lucide-react';
import { Card, StatCard, SectionHeader, Modal, Input, Select, Btn, EmptyState } from '@/components/ui';
import { useAuth } from '@/lib/auth';
import { fmtDate } from '@/lib/data';

const peso = (n: number) => `₱${Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const STATUS_STYLE: Record<string, string> = {
  unpaid: 'bg-red-50 text-red-600 border-red-100',
  partial: 'bg-amber-50 text-amber-700 border-amber-100',
  paid: 'bg-teal-50 text-teal-700 border-teal-100',
  void: 'bg-slate-50 text-slate-400 border-slate-100',
};
const Pill = ({ status }: { status: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize border ${STATUS_STYLE[status] ?? STATUS_STYLE.unpaid}`}>{status}</span>
);

export default function AdminBilling() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [payFor, setPayFor] = useState<any | null>(null);

  const load = () => {
    if (!user?.clinicId) return;
    Promise.all([
      fetch(`/api/invoices?clinicId=${user.clinicId}`).then((r) => r.json()),
      fetch(`/api/patients?clinicId=${user.clinicId}`).then((r) => r.json()),
    ]).then(([inv, p]) => {
      setInvoices(Array.isArray(inv) ? inv : []);
      setPatients(Array.isArray(p) ? p : []);
    }).finally(() => setLoading(false));
  };
  useEffect(load, [user?.clinicId]);

  const billed = invoices.reduce((s, i) => s + (i.status === 'void' ? 0 : i.total), 0);
  const collected = invoices.reduce((s, i) => s + i.amountPaid, 0);
  const outstanding = Math.max(0, billed - collected);

  if (loading) return <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="h-16 bg-sky-50 rounded-2xl animate-pulse" />)}</div>;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Billing & Invoicing"
        sub={`${invoices.length} invoice${invoices.length === 1 ? '' : 's'}`}
        action={<Btn onClick={() => setShowAdd(true)}><Plus size={15} /> New Invoice</Btn>}
      />

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <StatCard icon={<Receipt size={18} />} color="blue" label="Billed" value={peso(billed)} />
        <StatCard icon={<Wallet size={18} />} color="teal" label="Collected" value={peso(collected)} />
        <StatCard icon={<Receipt size={18} />} color="amber" label="Outstanding" value={peso(outstanding)} />
      </div>

      <Card>
        {invoices.length === 0 ? (
          <EmptyState icon={<Receipt size={28} />} title="No invoices yet" desc="Create an invoice for a patient's treatment." />
        ) : (
          <div className="divide-y divide-sky-50">
            {invoices.map((inv) => (
              <div key={inv.id} className="flex flex-col sm:flex-row sm:items-center gap-2 px-4 sm:px-5 py-3.5 hover:bg-sky-50/30 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sky-800 text-sm">{inv.invoiceNumber}</div>
                  <div className="text-xs text-sky-400 truncate">{inv.patientName} · {fmtDate(inv.createdAt)}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-semibold text-sky-900 text-sm">{peso(inv.total)}</div>
                  {inv.amountPaid > 0 && inv.status !== 'paid' && <div className="text-[11px] text-sky-400">{peso(inv.amountPaid)} paid</div>}
                </div>
                <Pill status={inv.status} />
                {inv.status !== 'paid' && inv.status !== 'void' && (
                  <Btn size="sm" variant="secondary" onClick={() => setPayFor(inv)}>Record payment</Btn>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {showAdd && <NewInvoiceModal patients={patients} clinicId={user?.clinicId ?? ''} onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load(); }} />}
      {payFor && <PaymentModal invoice={payFor} onClose={() => setPayFor(null)} onSaved={() => { setPayFor(null); load(); }} />}
    </div>
  );
}

function NewInvoiceModal({ patients, clinicId, onClose, onSaved }: { patients: any[]; clinicId: string; onClose: () => void; onSaved: () => void }) {
  const [patientId, setPatientId] = useState('');
  const [items, setItems] = useState([{ desc: '', qty: 1, price: 0 }]);
  const [discount, setDiscount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const subtotal = items.reduce((s, it) => s + Number(it.qty || 0) * Number(it.price || 0), 0);
  const total = Math.max(0, subtotal - Number(discount || 0));

  const setItem = (i: number, k: string, v: string) =>
    setItems((arr) => arr.map((it, idx) => (idx === i ? { ...it, [k]: k === 'desc' ? v : Number(v) } : it)));

  const save = async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/invoices', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, clinicId, items: items.filter((it) => it.desc), discount }),
      });
      const json = await res.json();
      if (res.ok) onSaved(); else setError(json.error ?? 'Failed to create invoice.');
    } catch { setError('Network error.'); } finally { setLoading(false); }
  };

  const peso = (n: number) => `₱${Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

  return (
    <Modal title="New Invoice" onClose={onClose} wide>
      <div className="space-y-4">
        <Select label="Patient" value={patientId} onChange={(e) => setPatientId(e.target.value)}>
          <option value="">Select patient...</option>
          {patients.map((p) => <option key={p.id} value={p.id}>{p.fullName}</option>)}
        </Select>

        <div>
          <label className="block text-sm font-medium text-sky-800 mb-1.5">Line items</label>
          <div className="space-y-2">
            {items.map((it, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input value={it.desc} onChange={(e) => setItem(i, 'desc', e.target.value)} placeholder="Procedure / item"
                  className="flex-1 px-3 py-2 rounded-lg border border-sky-100 bg-sky-50/30 text-sm text-sky-900" />
                <input type="number" value={it.qty} onChange={(e) => setItem(i, 'qty', e.target.value)} min={1}
                  className="w-14 px-2 py-2 rounded-lg border border-sky-100 bg-sky-50/30 text-sm text-center" />
                <input type="number" value={it.price} onChange={(e) => setItem(i, 'price', e.target.value)} placeholder="₱"
                  className="w-24 px-2 py-2 rounded-lg border border-sky-100 bg-sky-50/30 text-sm text-right" />
                <button onClick={() => setItems((a) => a.filter((_, idx) => idx !== i))} className="text-sky-300 hover:text-red-500 shrink-0" disabled={items.length === 1}>
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={() => setItems((a) => [...a, { desc: '', qty: 1, price: 0 }])} className="text-xs font-semibold text-sky-600 hover:text-sky-800 mt-2">
            + Add item
          </button>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Input label="Discount (₱)" type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} />
          <div className="text-right pt-5">
            <div className="text-xs text-sky-400">Subtotal {peso(subtotal)}</div>
            <div className="font-display text-2xl text-sky-950">Total {peso(total)}</div>
          </div>
        </div>

        {error && <div className="text-sm text-red-500">{error}</div>}
        <div className="flex gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose} className="flex-1">Cancel</Btn>
          <Btn onClick={save} disabled={loading || !patientId || !items.some((it) => it.desc)} className="flex-1">
            {loading ? 'Saving…' : 'Create Invoice'}
          </Btn>
        </div>
      </div>
    </Modal>
  );
}

function PaymentModal({ invoice, onClose, onSaved }: { invoice: any; onClose: () => void; onSaved: () => void }) {
  const due = Math.max(0, invoice.total - invoice.amountPaid);
  const [amount, setAmount] = useState(due);
  const [loading, setLoading] = useState(false);
  const peso = (n: number) => `₱${Number(n || 0).toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;

  const save = async () => {
    setLoading(true);
    try {
      await fetch(`/api/invoices/${invoice.id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ addPayment: Number(amount) }),
      });
      onSaved();
    } finally { setLoading(false); }
  };

  return (
    <Modal title={`Record Payment · ${invoice.invoiceNumber}`} onClose={onClose}>
      <div className="space-y-4">
        <div className="bg-sky-50 rounded-xl px-4 py-3 text-sm flex justify-between">
          <span className="text-sky-500">Balance due</span>
          <span className="font-semibold text-sky-900">{peso(due)}</span>
        </div>
        <Input label="Payment amount (₱)" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
        <div className="flex gap-3 pt-2">
          <Btn variant="secondary" onClick={onClose} className="flex-1">Cancel</Btn>
          <Btn onClick={save} disabled={loading || amount <= 0} className="flex-1">{loading ? 'Saving…' : 'Record Payment'}</Btn>
        </div>
      </div>
    </Modal>
  );
}
