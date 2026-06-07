import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { paymongoFetch, planAmount } from '@/lib/paymongo';

/**
 * Creates a PayMongo Checkout Session for the signed-in admin's clinic.
 * Body: { plan: 'starter' | 'growth' | 'multi-clinic' }
 * Returns { url } — redirect the browser there.
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Not signed in' }, { status: 401 });

  const { plan } = await request.json();
  const priced = planAmount(plan ?? '');
  if (!priced) return NextResponse.json({ error: 'Unknown plan' }, { status: 400 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('clinic_id, email, role')
    .eq('id', user.id)
    .single();
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Only clinic admins can manage billing' }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data: clinic } = await admin
    .from('clinics')
    .select('id, name, email')
    .eq('id', profile.clinic_id)
    .single();
  if (!clinic) return NextResponse.json({ error: 'Clinic not found' }, { status: 404 });

  const origin = request.headers.get('origin') ?? process.env.NEXT_PUBLIC_APP_URL ?? '';

  const session = await paymongoFetch('/checkout_sessions', 'POST', {
    data: {
      attributes: {
        line_items: [
          { currency: 'PHP', amount: priced.amount, name: priced.name, quantity: 1 },
        ],
        payment_method_types: ['card', 'gcash', 'paymaya', 'grab_pay'],
        description: `${priced.name} — monthly subscription (${clinic.name})`,
        success_url: `${origin}/?billing=success`,
        cancel_url: `${origin}/?billing=cancelled`,
        send_email_receipt: true,
        metadata: { clinic_id: clinic.id, plan },
      },
    },
  });

  const checkoutUrl = session?.data?.attributes?.checkout_url;
  // Stash the reference so we can reconcile on webhook
  await admin
    .from('clinics')
    .update({ paymongo_reference: session?.data?.id ?? null })
    .eq('id', clinic.id);

  return NextResponse.json({ url: checkoutUrl });
}
