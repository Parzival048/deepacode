/**
 * One-time script to create an admin user.
 * Run: node --env-file=.env.local scripts/create-admin.mjs
 * Or set NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY before running.
 */

import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Use --env-file=.env.local');
  process.exit(1);
}

const ADMIN_EMAIL = 'admin@smartcloudadvisor.com';
const ADMIN_PASSWORD = 'Admin@Cloud2025!'; // change after first login

const supabase = createClient(url, serviceRoleKey, { auth: { autoRefreshToken: false, persistSession: false } });

async function main() {
  const { data: user, error: createError } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: 'Admin' },
  });

  if (createError) {
    if (createError.message?.includes('already been registered')) {
      console.log('Admin user already exists. Updating profile to admin...');
      const { data: existing } = await supabase.auth.admin.listUsers();
      const adminUser = existing?.users?.find((u) => u.email === ADMIN_EMAIL);
      if (adminUser) {
        const restUrl = url.replace(/\/$/, '');
        const profileRes = await fetch(`${restUrl}/rest/v1/profiles`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: serviceRoleKey,
            Authorization: `Bearer ${serviceRoleKey}`,
            Prefer: 'resolution=merge-duplicates',
          },
          body: JSON.stringify({ id: adminUser.id, name: 'Admin', role: 'admin' }),
        });
        if (!profileRes.ok) {
          await fetch(`${restUrl}/rest/v1/profiles?id=eq.${adminUser.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', apikey: serviceRoleKey, Authorization: `Bearer ${serviceRoleKey}` },
            body: JSON.stringify({ name: 'Admin', role: 'admin' }),
          });
        }
        console.log('Profile updated to admin.');
        console.log('\n--- Admin credentials ---');
        console.log('Email:', ADMIN_EMAIL);
        console.log('Password: (set on first creation: ' + ADMIN_PASSWORD + ' — or reset in Supabase Dashboard)');
        return;
      }
    }
    console.error('Create user error:', createError.message);
    process.exit(1);
  }

  if (!user?.user?.id) {
    console.error('No user returned');
    process.exit(1);
  }

  const userId = user.user.id;

  // Insert profile via REST API (avoids schema cache issues with service role client)
  const profileRes = await fetch(`${url}/rest/v1/profiles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ id: userId, name: 'Admin', role: 'admin' }),
  });

  if (!profileRes.ok) {
    const updateRes = await fetch(`${url}/rest/v1/profiles?id=eq.${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ name: 'Admin', role: 'admin' }),
    });
    if (!updateRes.ok) {
      console.error('Profile insert/update failed. Manually run in Supabase SQL:');
      console.error(`INSERT INTO public.profiles (id, name, role) VALUES ('${userId}', 'Admin', 'admin') ON CONFLICT (id) DO UPDATE SET role = 'admin';`);
    }
  }

  console.log('Admin user created successfully.\n');
  console.log('--- Admin credentials ---');
  console.log('Email:', ADMIN_EMAIL);
  console.log('Password:', ADMIN_PASSWORD);
  console.log('\nChange the password after first login.');
}

main();
