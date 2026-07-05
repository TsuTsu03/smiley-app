'use client';

import { useState } from 'react';
import { Bell, MessageSquare, Mail, Send, CheckCircle2, AlertTriangle, Calendar } from 'lucide-react';
import { Card, SectionHeader, Btn } from '@/components/ui';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, getUpcomingAdjustments, getDentistById, fmtDate, fmtShortDate } from '@/lib/data';

type ComposeTarget =
  | { kind: 'adjustment'; patientId: string; type: 'sms' | 'email' }
  | { kind: 'booking'; appointmentId: string; type: 'sms' | 'email' };

export default function AdminReminders() {
  const [sent, setSent]       = useState<Record<string, boolean>>({});
  const [compose, setCompose] = useState<ComposeTarget | null>(null);
  const [msgText, setMsgText] = useState('');
  const [sending, setSending] = useState(false);

  const today       = new Date().toISOString().split('T')[0];
  const upcoming7   = getUpcomingAdjustments(7);
  const upcoming14  = getUpcomingAdjustments(14).filter(p => !upcoming7.find(u => u.id === p.id));
  const upcomingApts = MOCK_APPOINTMENTS.filter(
    a => a.date >= today && (a.status === 'confirmed' || a.status === 'pending')
  ).sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const sendReminder = async () => {
    if (!compose) return;
    setSending(true);
    await new Promise(r => setTimeout(r, 900));
    const key = compose.kind === 'adjustment'
      ? `adj-${compose.patientId}-${compose.type}`
      : `apt-${compose.appointmentId}-${compose.type}`;
    setSent(s => ({ ...s, [key]: true }));
    setSending(false);
    setCompose(null);
    setMsgText('');
  };

  const openAdjustmentCompose = (patientId: string, type: 'sms' | 'email') => {
    const patient = MOCK_PATIENTS.find(p => p.id === patientId);
    const msg = type === 'sms'
      ? `Hi ${patient?.fullName.split(' ')[0]}! This is a reminder from BrightSmile Dental Clinic. Your orthodontic adjustment is scheduled on ${fmtShortDate(patient?.nextAdjustmentDate || '')}. Please call (02) 8123-4567 to confirm. Thank you!`
      : `Dear ${patient?.fullName},\n\nThis is a friendly reminder that your orthodontic adjustment is scheduled on ${fmtDate(patient?.nextAdjustmentDate || '')}.\n\nPlease confirm your appointment by replying to this email or calling us at (02) 8123-4567.\n\nSee you soon!\n\nBrightSmile Dental Clinic`;
    setMsgText(msg);
    setCompose({ kind: 'adjustment', patientId, type });
  };

  const openBookingCompose = (appointmentId: string, type: 'sms' | 'email') => {
    const apt     = MOCK_APPOINTMENTS.find(a => a.id === appointmentId);
    const patient = MOCK_PATIENTS.find(p => p.id === apt?.patientId);
    const dentist = getDentistById(apt?.dentistId || '');
    const msg = type === 'sms'
      ? `Hi ${patient?.fullName.split(' ')[0]}! Reminder from BrightSmile Dental Clinic: your ${apt?.type} with ${dentist?.fullName} is on ${fmtShortDate(apt?.date || '')} at ${apt?.time}. Call (02) 8123-4567 to confirm. Thank you!`
      : `Dear ${patient?.fullName},\n\nThis is a reminder for your upcoming appointment:\n\nProcedure: ${apt?.type}\nDentist: ${dentist?.fullName}\nDate: ${fmtDate(apt?.date || '')}\nTime: ${apt?.time}\n\nPlease confirm by replying to this email or calling (02) 8123-4567.\n\nSee you soon!\n\nBrightSmile Dental Clinic`;
    setMsgText(msg);
    setCompose({ kind: 'booking', appointmentId, type });
  };

  const ReminderButtons = ({ smsKey, emailKey, onSms, onEmail }: { smsKey: string; emailKey: string; onSms: () => void; onEmail: () => void }) => (
    <div className="flex gap-2 flex-shrink-0 mt-2 sm:mt-0">
      <button
        onClick={onSms}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${sent[smsKey] ? 'bg-sky-50 text-sky-400 cursor-default' : 'bg-sky-100 text-sky-700 hover:bg-sky-200'}`}
      >
        {sent[smsKey] ? <CheckCircle2 size={12} /> : <MessageSquare size={12} />}
        SMS
      </button>
      <button
        onClick={onEmail}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${sent[emailKey] ? 'bg-sky-50 text-sky-400 cursor-default' : 'bg-sky-100 text-sky-700 hover:bg-sky-200'}`}
      >
        {sent[emailKey] ? <CheckCircle2 size={12} /> : <Mail size={12} />}
        Email
      </button>
    </div>
  );

  const PatientAdjustmentRow = ({ patient, urgent = false }: { patient: typeof MOCK_PATIENTS[0]; urgent?: boolean }) => {
    const daysLeft = Math.ceil((new Date(patient.nextAdjustmentDate!).getTime() - Date.now()) / 86400000);
    return (
      <div className={`flex flex-wrap sm:flex-nowrap items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-xl border ${urgent ? 'bg-amber-50 border-amber-100' : 'bg-white border-sky-50'}`}>
        {urgent && <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5 sm:mt-0 hidden sm:block" />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            {urgent && <AlertTriangle size={14} className="text-amber-500 sm:hidden" />}
            <div className="font-medium text-sky-800">{patient.fullName}</div>
          </div>
          <div className="text-xs text-sky-500">{patient.phone} · {patient.email}</div>
          <div className={`text-xs font-semibold mt-0.5 ${urgent ? 'text-amber-600' : 'text-sky-600'}`}>
            Adjustment: {fmtShortDate(patient.nextAdjustmentDate!)} ({daysLeft} days)
          </div>
        </div>
        <ReminderButtons
          smsKey={`adj-${patient.id}-sms`}
          emailKey={`adj-${patient.id}-email`}
          onSms={() => !sent[`adj-${patient.id}-sms`] && openAdjustmentCompose(patient.id, 'sms')}
          onEmail={() => !sent[`adj-${patient.id}-email`] && openAdjustmentCompose(patient.id, 'email')}
        />
      </div>
    );
  };

  const BookingReminderRow = ({ apt }: { apt: typeof MOCK_APPOINTMENTS[0] }) => {
    const patient  = MOCK_PATIENTS.find(p => p.id === apt.patientId);
    const dentist  = getDentistById(apt.dentistId);
    const daysLeft = Math.ceil((new Date(apt.date).getTime() - Date.now()) / 86400000);
    return (
      <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center gap-3 sm:gap-4 p-4 rounded-xl border bg-white border-sky-50">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sky-800">{patient?.fullName}</div>
          <div className="text-xs text-sky-500">{patient?.phone} · {patient?.email}</div>
          <div className="text-xs text-sky-600 font-semibold mt-0.5 flex flex-wrap items-center gap-1">
            <span>{apt.type}</span>
            <span className="text-sky-400">·</span>
            <span>{fmtShortDate(apt.date)} at {apt.time}</span>
            <span className="text-sky-400">·</span>
            <span>{dentist?.fullName}</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] ${apt.status === 'confirmed' ? 'bg-sky-100 text-sky-600' : 'bg-amber-100 text-amber-600'}`}>
              {apt.status}
            </span>
            <span className="text-sky-400">({daysLeft}d)</span>
          </div>
        </div>
        <ReminderButtons
          smsKey={`apt-${apt.id}-sms`}
          emailKey={`apt-${apt.id}-email`}
          onSms={() => !sent[`apt-${apt.id}-sms`] && openBookingCompose(apt.id, 'sms')}
          onEmail={() => !sent[`apt-${apt.id}-email`] && openBookingCompose(apt.id, 'email')}
        />
      </div>
    );
  };

  const composePatient = compose?.kind === 'adjustment'
    ? MOCK_PATIENTS.find(p => p.id === compose.patientId)
    : MOCK_PATIENTS.find(p => p.id === MOCK_APPOINTMENTS.find(a => a.id === (compose as { appointmentId: string })?.appointmentId)?.patientId);

  return (
    <div className="space-y-6 max-w-2xl">
      <SectionHeader title="Reminders" sub="Send SMS or email reminders to patients about their bookings and adjustments" />

      {/* Booking reminders */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={16} className="text-sky-500" />
          <h3 className="font-semibold text-sky-700">Booking Reminders: Upcoming Appointments ({upcomingApts.length})</h3>
        </div>
        {upcomingApts.length === 0 ? (
          <div className="text-sm text-sky-400 py-4 text-center">No upcoming appointments</div>
        ) : (
          <div className="space-y-2">
            {upcomingApts.map(apt => <BookingReminderRow key={apt.id} apt={apt} />)}
          </div>
        )}
      </Card>

      {/* Adjustment reminders */}
      {upcoming7.length > 0 && (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-amber-500" />
            <h3 className="font-semibold text-amber-700">Orthodontic Adjustments: Urgent Within 7 Days ({upcoming7.length})</h3>
          </div>
          <div className="space-y-2">
            {upcoming7.map(p => <PatientAdjustmentRow key={p.id} patient={p} urgent />)}
          </div>
        </Card>
      )}

      {upcoming14.length > 0 && (
        <Card className="p-5">
          <h3 className="font-semibold text-sky-700 mb-4">Orthodontic Adjustments: 7–14 Days ({upcoming14.length})</h3>
          <div className="space-y-2">
            {upcoming14.map(p => <PatientAdjustmentRow key={p.id} patient={p} />)}
          </div>
        </Card>
      )}

      {upcomingApts.length === 0 && upcoming7.length === 0 && upcoming14.length === 0 && (
        <Card className="p-10 text-center">
          <Bell size={36} className="text-sky-200 mx-auto mb-3" />
          <div className="font-medium text-sky-400">No reminders needed</div>
          <div className="text-sm text-sky-300 mt-1">No upcoming appointments or adjustments</div>
        </Card>
      )}

      {/* Compose overlay */}
      {compose && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-sky-950/25 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-hover w-full max-w-lg animate-slide-up overflow-hidden">
            <div className="bg-gradient-to-r from-sky-600 to-sky-500 px-6 py-5 text-white">
              <div className="flex items-center gap-2">
                {compose.type === 'sms' ? <MessageSquare size={18} /> : <Mail size={18} />}
                <h3 className="font-semibold">Compose {compose.type === 'sms' ? 'SMS' : 'Email'} Reminder</h3>
              </div>
              <p className="text-white/70 text-xs mt-1">To: {composePatient?.fullName}</p>
            </div>
            <div className="p-6 space-y-4">
              <textarea
                value={msgText}
                onChange={e => setMsgText(e.target.value)}
                rows={compose.type === 'email' ? 8 : 4}
                className="w-full px-4 py-3 rounded-xl border border-sky-100 bg-sky-50/30 text-sky-900 text-sm resize-none focus:border-sky-400 transition-colors"
              />
              <div className="flex gap-3">
                <Btn variant="secondary" onClick={() => setCompose(null)} className="flex-1">Cancel</Btn>
                <Btn onClick={sendReminder} disabled={sending} className="flex-1 justify-center">
                  {sending ? 'Sending...' : <><Send size={14} /> Send {compose.type === 'sms' ? 'SMS' : 'Email'}</>}
                </Btn>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
