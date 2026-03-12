import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const PLAN_AMOUNTS: Record<string, number> = { pro: 2900, enterprise: 9900 };

export async function GET(request: NextRequest) {
  const plan = request.nextUrl.searchParams.get('plan');
  if (!plan || !['pro', 'enterprise'].includes(plan)) {
    return NextResponse.redirect(new URL('/payment', request.url));
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Ensure profile exists then set subscription_plan (update affects 0 rows if no profile row)
  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('id', user.id)
    .single();

  if (existingProfile) {
    await supabase.from('profiles').update({ subscription_plan: plan }).eq('id', user.id);
  } else {
    await supabase.from('profiles').insert({
      id: user.id,
      name: (user.user_metadata?.full_name as string) || (user.user_metadata?.name as string) || 'User',
      role: 'user',
      subscription_plan: plan,
    });
  }

  await supabase.from('payments').insert({
    user_id: user.id,
    plan,
    amount_cents: PLAN_AMOUNTS[plan] ?? 0,
    status: 'succeeded',
    stripe_payment_id: `placeholder_${Date.now()}`,
  });

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? request.nextUrl.origin;
  return NextResponse.redirect(new URL(`/payment/success?plan=${plan}`, baseUrl));
}
