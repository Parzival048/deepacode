'use server';

import { createClient } from '@/lib/supabase/server';
import type { SubscriptionPlan } from '@/types/database';

export async function getCurrentPlan(): Promise<SubscriptionPlan> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return 'free';

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('subscription_plan')
    .eq('id', user.id)
    .single();

  if (!error && profile?.subscription_plan) {
    const p = profile.subscription_plan as string;
    if (p === 'enterprise' || p === 'pro') return p as SubscriptionPlan;
  }

  const { data: payments } = await supabase
    .from('payments')
    .select('plan')
    .eq('user_id', user.id)
    .eq('status', 'succeeded')
    .order('created_at', { ascending: false })
    .limit(1);
  const latestPlan = payments?.[0]?.plan as string | undefined;
  if (latestPlan === 'enterprise' || latestPlan === 'pro') return latestPlan as SubscriptionPlan;
  return 'free';
}

/** Call after checkout redirect so the user’s plan is set even if checkout didn’t persist it. */
export async function setPlanAfterCheckout(plan: string): Promise<{ ok: boolean; error?: string }> {
  if (plan !== 'pro' && plan !== 'enterprise') return { ok: false, error: 'Invalid plan' };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: 'Unauthorized' };

  const { data: existing } = await supabase.from('profiles').select('id').eq('id', user.id).single();
  if (existing) {
    const { error } = await supabase.from('profiles').update({ subscription_plan: plan }).eq('id', user.id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { error } = await supabase.from('profiles').insert({
      id: user.id,
      name: (user.user_metadata?.full_name as string) || 'User',
      role: 'user',
      subscription_plan: plan,
    });
    if (error) return { ok: false, error: error.message };
  }
  return { ok: true };
}
