/**
 * Create an Enterprise plan user (auth + profile + payment record).
 * Run: node --env-file=.env.local scripts/create-enterprise-user.mjs
 */

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Use --env-file=.env.local');
  process.exit(1);
}

const ENTERPRISE_EMAIL = 'enterprise@smartcloudadvisor.com';
const ENTERPRISE_PASSWORD = 'Enterprise@Cloud2025!';

const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });

async function upsertProfile(uid, name, subscription_plan) {
  const res = await fetch(`${url}/rest/v1/profiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify({
      id: uid,
      name: name || 'Enterprise User',
      role: 'user',
      subscription_plan: subscription_plan || 'enterprise',
    }),
  });
  if (!res.ok) {
    await fetch(`${url}/rest/v1/profiles?id=eq.${uid}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
      body: JSON.stringify({ name: name || 'Enterprise User', subscription_plan: subscription_plan || 'enterprise' }),
    });
  }
}

async function recordPayment(uid, plan, amountCents) {
  await fetch(`${url}/rest/v1/payments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
    },
    body: JSON.stringify({
      user_id: uid,
      plan,
      amount_cents: amountCents,
      status: 'succeeded',
      stripe_payment_id: 'script_enterprise_setup',
    }),
  });
}

async function main() {
  const { data: user, error: createError } = await supabase.auth.admin.createUser({
    email: ENTERPRISE_EMAIL,
    password: ENTERPRISE_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: 'Enterprise User' },
  });

  let userId;
  if (createError) {
    if (createError.message?.includes('already been registered')) {
      console.log('Enterprise user already exists. Upgrading to Enterprise plan...');
      const { data: list } = await supabase.auth.admin.listUsers();
      const existing = list?.users?.find((u) => u.email === ENTERPRISE_EMAIL);
      if (!existing) {
        console.error('Could not find existing user.');
        process.exit(1);
      }
      userId = existing.id;
    } else {
      console.error('Create user error:', createError.message);
      process.exit(1);
    }
  } else {
    userId = user?.user?.id;
  }

  if (!userId) {
    console.error('No user id');
    process.exit(1);
  }

  await upsertProfile(userId, 'Enterprise User', 'enterprise');
  await recordPayment(userId, 'enterprise', 9900); // $99

  console.log('Enterprise user ready.\n');
  console.log('--- Enterprise credentials ---');
  console.log('Email:', ENTERPRISE_EMAIL);
  console.log('Password:', ENTERPRISE_PASSWORD);
  console.log('\nFeatures: Full architecture design, Migration plan, Priority support.');
  console.log('Change the password after first login.');
}

main();
