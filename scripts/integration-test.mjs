/**
 * Smiley — API integration tests.
 * Runs real end-to-end flows against a live server + Supabase, then cleans up.
 * Usage: node scripts/integration-test.mjs   (server must be on BASE / :3000)
 */
import fs from 'node:fs';
import { createClient } from '@supabase/supabase-js';

const BASE = process.env.BASE || 'http://localhost:3000';
const env = fs.readFileSync('.env.local', 'utf8');
const g = (k) => {
  const m = env.match(new RegExp('^' + k + '=(.*)$', 'm'));
  return m ? m[1].trim().split(/\s+#/)[0].trim().replace(/^["']|["']$/g, '') : null;
};
const admin = createClient(g('NEXT_PUBLIC_SUPABASE_URL'), g('SUPABASE_SERVICE_ROLE_KEY'), {
  auth: { persistSession: false },
});

// ── tiny test harness ──
let pass = 0, fail = 0, skip = 0;
const ok = (name, cond, info = '') => {
  if (cond) { pass++; console.log(`  ✅ ${name}`); }
  else { fail++; console.log(`  ❌ ${name}${info ? ' — ' + info : ''}`); }
};
const skipped = (name, why) => { skip++; console.log(`  ⏭️  ${name} — ${why}`); };

// ── cookie-aware fetch ──
function jar() {
  let cookie = '';
  return async (path, opts = {}) => {
    const res = await fetch(BASE + path, {
      ...opts,
      headers: { 'Content-Type': 'application/json', ...(cookie ? { Cookie: cookie } : {}), 'x-forwarded-for': '203.0.113.' + Math.floor(Math.random() * 250), ...(opts.headers || {}) },
    });
    const sc = res.headers.getSetCookie?.() || [];
    if (sc.length) cookie = sc.map((c) => c.split(';')[0]).join('; ');
    let body = null;
    try { body = await res.json(); } catch {}
    return { status: res.status, body };
  };
}

const ts = Date.now();
const slugs = [`itest${ts}a`, `itest${ts}b`];

async function cleanup() {
  // delete auth users
  const { data: list } = await admin.auth.admin.listUsers();
  for (const u of list?.users || []) {
    if (u.email?.includes(`+itest${ts}`)) await admin.auth.admin.deleteUser(u.id);
  }
  // delete clinics + children
  const { data: clinics } = await admin.from('clinics').select('id').in('slug', slugs);
  for (const c of clinics || []) {
    for (const t of ['audit_log', 'invoices', 'insurance_claims', 'consent_forms', 'notifications', 'medical_records', 'appointments', 'patients', 'dentist_schedules', 'dentists', 'profiles']) {
      await admin.from(t).delete().eq('clinic_id', c.id).then(() => {}, () => {});
    }
    await admin.from('clinics').delete().eq('id', c.id);
  }
}

async function run() {
  console.log(`\n🔬 Integration tests against ${BASE}\n`);

  // 1) Clinic signup (schema + service role + audit)
  const a = jar();
  const reg = await a('/api/clinics', { method: 'POST', body: JSON.stringify({
    clinicName: `ITest A ${ts}`, slug: slugs[0], address: 'Addr', phone: '0917', email: `clinic+itest${ts}a@example.com`,
    adminName: 'Admin A', adminEmail: `admin+itest${ts}a@example.com`, password: 'TestPass123!',
  }) });
  ok('Clinic signup → 201', reg.status === 201, `got ${reg.status}`);

  // 2) Login as admin A
  const login = await a('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: `admin+itest${ts}a@example.com`, password: 'TestPass123!' }) });
  ok('Admin login → 200 + role admin', login.status === 200 && login.body?.user?.role === 'admin', `got ${login.status}`);
  const clinicA = login.body?.user?.clinicId;

  // 3) Session check
  const me = await a('/api/auth/me');
  ok('Session persists (/api/auth/me)', me.status === 200 && me.body?.user?.clinicId === clinicA);

  // 3b) Subscription gating — all the states a clinic can be in.
  // Fresh signup → on a 14-day trial → has access.
  ok('Fresh clinic is on an active trial (subscriptionActive=true)', me.body?.clinic?.subscriptionActive === true,
    `got ${me.body?.clinic?.subscriptionActive}`);

  // Expired trial → access revoked.
  await admin.from('clinics').update({
    subscription_status: 'trialing',
    trial_ends_at: new Date(Date.now() - 86_400_000).toISOString(),
    current_period_end: null,
  }).eq('id', clinicA);
  const meExpired = await a('/api/auth/me');
  ok('Expired trial revokes access (subscriptionActive=false)', meExpired.body?.clinic?.subscriptionActive === false,
    `got ${meExpired.body?.clinic?.subscriptionActive}`);

  // Paid & active with a future period → access restored (simulates a successful payment).
  await admin.from('clinics').update({
    subscription_status: 'active',
    current_period_end: new Date(Date.now() + 30 * 86_400_000).toISOString(),
  }).eq('id', clinicA);
  const mePaid = await a('/api/auth/me');
  ok('Active paid plan restores access (subscriptionActive=true)', mePaid.body?.clinic?.subscriptionActive === true,
    `got ${mePaid.body?.clinic?.subscriptionActive}`);

  // Lapsed paid period → access revoked again.
  await admin.from('clinics').update({
    subscription_status: 'active',
    current_period_end: new Date(Date.now() - 86_400_000).toISOString(),
  }).eq('id', clinicA);
  const meLapsed = await a('/api/auth/me');
  ok('Lapsed paid period revokes access (subscriptionActive=false)', meLapsed.body?.clinic?.subscriptionActive === false,
    `got ${meLapsed.body?.clinic?.subscriptionActive}`);

  // Restore the trial so the remaining steps run against a clinic with access.
  await admin.from('clinics').update({
    subscription_status: 'trialing',
    trial_ends_at: new Date(Date.now() + 14 * 86_400_000).toISOString(),
    current_period_end: null,
  }).eq('id', clinicA);

  // 4) Create patient
  const pat = await a('/api/patients', { method: 'POST', body: JSON.stringify({
    fullName: `ITest Patient ${ts}`, dateOfBirth: '1990-01-01', gender: 'male', phone: '0917', email: 'p@x.com',
    address: 'Addr', emergencyContact: 'EC', emergencyPhone: '0918', clinicId: clinicA,
  }) });
  ok('Create patient → 201', pat.status === 201, `got ${pat.status}`);
  const patientId = pat.body?.id;

  // dentist (needed for appointments) — via service role
  const { data: dentist } = await admin.from('dentists').insert({ full_name: 'ITest Dr', specialization: 'General', email: 'd@x.com', phone: '0917', clinic_id: clinicA }).select().single();

  // 5) Create appointment
  const apt = await a('/api/appointments', { method: 'POST', body: JSON.stringify({
    patientId, dentistId: dentist.id, clinicId: clinicA, date: '2026-12-01', time: '10:00', type: 'Cleaning',
  }) });
  ok('Create appointment → 201', apt.status === 201, `got ${apt.status}`);

  // 6) Conflict detection (same dentist/date/time)
  const clash = await a('/api/appointments', { method: 'POST', body: JSON.stringify({
    patientId, dentistId: dentist.id, clinicId: clinicA, date: '2026-12-01', time: '10:00', type: 'Filling',
  }) });
  ok('Double-booking blocked → 409', clash.status === 409, `got ${clash.status}`);

  // 7) Billing (if migrated)
  const inv = await a('/api/invoices', { method: 'POST', body: JSON.stringify({
    patientId, clinicId: clinicA, items: [{ desc: 'Cleaning', qty: 1, price: 1500 }, { desc: 'X-ray', qty: 2, price: 500 }], discount: 500,
  }) });
  if (inv.status === 201) {
    ok('Create invoice → 201', true);
    const list = await a(`/api/invoices?clinicId=${clinicA}`);
    const created = list.body?.find((x) => x.id === inv.body.id);
    ok('Invoice total computed (2500 - 500 = 2000)', created?.total === 2000, `total=${created?.total}`);
    const payRes = await a(`/api/invoices/${inv.body.id}`, { method: 'PUT', body: JSON.stringify({ addPayment: 2000 }) });
    const after = await a(`/api/invoices?clinicId=${clinicA}`);
    const paid = after.body?.find((x) => x.id === inv.body.id);
    ok('Record full payment → status "paid"', payRes.status === 200 && paid?.status === 'paid', `status=${paid?.status}`);
  } else if (inv.body?.error?.includes('Could not find the table')) {
    skipped('Billing/Invoicing', 'invoices table not migrated on this DB (run 04_billing_insurance.sql)');
  } else {
    ok('Create invoice → 201', false, `got ${inv.status}`);
  }

  // 8) Consent (if migrated)
  const con = await a('/api/consents', { method: 'POST', body: JSON.stringify({ patientId, clinicId: clinicA, title: 'Data Privacy Consent (RA 10173)', status: 'signed' }) });
  if (con.status === 201) ok('Create consent → 201', true);
  else if (con.body?.error?.includes('Could not find the table')) skipped('Consent forms', 'consent_forms table not migrated (run 03_consent_forms.sql)');
  else ok('Create consent → 201', false, `got ${con.status}`);

  // 9) Insurance (if migrated)
  const claim = await a('/api/insurance', { method: 'POST', body: JSON.stringify({ patientId, clinicId: clinicA, provider: 'Maxicare', claimAmount: 1000 }) });
  if (claim.status === 201) ok('Create insurance claim → 201', true);
  else if (claim.body?.error?.includes('Could not find the table')) skipped('Insurance claims', 'insurance_claims table not migrated (run 04_billing_insurance.sql)');
  else ok('Create insurance claim → 201', false, `got ${claim.status}`);

  // 10) RLS isolation — clinic B cannot see clinic A's patient
  const b = jar();
  await b('/api/clinics', { method: 'POST', body: JSON.stringify({
    clinicName: `ITest B ${ts}`, slug: slugs[1], address: 'Addr', phone: '0917', email: `clinic+itest${ts}b@example.com`,
    adminName: 'Admin B', adminEmail: `admin+itest${ts}b@example.com`, password: 'TestPass123!',
  }) });
  await b('/api/auth/login', { method: 'POST', body: JSON.stringify({ email: `admin+itest${ts}b@example.com`, password: 'TestPass123!' }) });
  const bSeesA = await b(`/api/patients?clinicId=${clinicA}`);
  ok('RLS isolation: clinic B cannot read clinic A patients', Array.isArray(bSeesA.body) && bSeesA.body.length === 0, `saw ${bSeesA.body?.length}`);

  // 11) Rate limiting on login (>10/min)
  const r = jar();
  let got429 = false;
  for (let i = 0; i < 13; i++) {
    const res = await r('/api/auth/login', { method: 'POST', headers: { 'x-forwarded-for': '198.51.100.77' }, body: JSON.stringify({ email: 'nope@x.com', password: 'x' }) });
    if (res.status === 429) got429 = true;
  }
  ok('Rate limiting kicks in (429 after 10 attempts)', got429);
}

(async () => {
  try {
    await cleanup(); // clear any leftovers from a previous run
    await run();
  } catch (e) {
    console.log('  ❌ FATAL:', e.message);
    fail++;
  } finally {
    await cleanup();
    console.log(`\n──────────────────────────────`);
    console.log(`  ${pass} passed · ${fail} failed · ${skip} skipped`);
    console.log(`──────────────────────────────\n`);
    process.exit(fail > 0 ? 1 : 0);
  }
})();
