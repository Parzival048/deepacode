'use server';

import { createClient } from '@/lib/supabase/server';

export async function trackEvent(eventType: string, metadata: Record<string, unknown> = {}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase.from('analytics_events').insert({
    event_type: eventType,
    user_id: user?.id ?? null,
    metadata,
  });
}
