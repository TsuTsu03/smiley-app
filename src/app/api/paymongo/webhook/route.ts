import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhook } from '@/lib/paymongo';
import { createAdminClient } from '@/lib/supabase/admin';

export const runtime = 'nodejs';

/**
 * PayMongo webhook. Verifies the signature, then activates/updates the clinic's
 * subscription when a payment succeeds (or marks it past_due on failure).
 * Create the webhook in PayMongo pointing at: /api/paymongo/webhook
 */
export async function POST(request: NextRequest) {
  const raw = await request.text();
  const sig = request.headers.get('paymongo-signature');

  if (!verifyWebhook(raw, sig)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const event = JSON.parse(raw);
  const type: string = event?.data?.attributes?.type ?? '';
  // The resource that triggered the event (payment / checkout_session)
  const resource = event?.data?.attributes?.data?.attributes ?? {};
  const metadata = resource?.metadata ?? {};
  const clinicId: string | undefined = metadata.clinic_id;
  const plan: string = metadata.plan ?? 'growth';

  const admin = createAdminClient();

  const activate = async () => {
    if (!clinicId) return;
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);
    await admin
      .from('clinics')
      .update({
        plan,
        subscription_status: 'active',
        current_period_end: periodEnd.toISOString(),
      })
      .eq('id', clinicId);
  };

  switch (type) {
    case 'checkout_session.payment.paid':
    case 'payment.paid':
      await activate();
      break;
    case 'payment.failed':
      if (clinicId) {
        await admin.from('clinics').update({ subscription_status: 'past_due' }).eq('id', clinicId);
      }
      break;
  }

  return NextResponse.json({ received: true });
}
