'use server';

import { createClient } from '@/lib/supabase/server';
import { generateRecommendation } from '@/lib/recommendation-engine';
import { trackEvent } from '@/lib/actions/analytics';
import type { QuestionnaireData } from '@/types/database';

const isSchemaCacheError = (msg: string) =>
  msg?.includes('schema cache') || msg?.includes('PGRST204');

async function fetchRequirementsViaRest(userId: string): Promise<{ data: unknown[]; error: string | null }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { data: [], error: 'Missing Supabase config' };
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? key;
  const res = await fetch(
    `${url}/rest/v1/requirements?user_id=eq.${userId}&select=id,prompt_input,questionnaire_data,created_at&order=created_at.desc`,
    {
      headers: {
        apikey: key,
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
  if (!res.ok) return { data: [], error: await res.text() };
  const data = (await res.json()) as unknown[];
  return { data: Array.isArray(data) ? data : [], error: null };
}

export async function createRequirement(promptInput: string | null, questionnaireData: QuestionnaireData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized', id: null };

  const payload = {
    user_id: user.id,
    prompt_input: promptInput || null,
    questionnaire_data: questionnaireData,
  };

  const { data: req, error: reqError } = await supabase
    .from('requirements')
    .insert(payload)
    .select('id')
    .single();

  if (reqError && isSchemaCacheError(reqError.message)) {
    const created = await createRequirementViaRest(user.id, promptInput, questionnaireData);
    return created;
  }
  if (reqError || !req?.id) return { error: reqError?.message ?? 'Failed to create requirement', id: null };

  const result = generateRecommendation(questionnaireData);
  const recPayload = {
    requirement_id: req.id,
    provider: result.provider,
    services: result.services,
    cost_estimation: result.cost_estimation,
    roadmap: result.roadmap,
    architecture_suggestion: result.architecture_suggestion,
  };
  const { error: recError } = await supabase.from('recommendations').insert(recPayload);

  if (recError && isSchemaCacheError(recError.message)) {
    await insertRecommendationViaRest(req.id, result);
  } else if (recError) {
    return { error: recError.message, id: req.id };
  }
  await trackEvent('requirement_created', { requirement_id: req.id });
  return { id: req.id, error: null };
}

async function createRequirementViaRest(
  userId: string,
  promptInput: string | null,
  questionnaireData: QuestionnaireData
): Promise<{ id: string | null; error: string | null }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { id: null, error: 'Missing Supabase config' };
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? key;
  const res = await fetch(`${url}/rest/v1/requirements`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: JSON.stringify({
      user_id: userId,
      prompt_input: promptInput || null,
      questionnaire_data: questionnaireData,
    }),
  });
  if (!res.ok) return { id: null, error: await res.text() };
  const created = (await res.json()) as { id?: string }[];
  const id = Array.isArray(created) && created[0]?.id ? created[0].id : null;
  if (!id) return { id: null, error: 'No id returned' };
  const result = generateRecommendation(questionnaireData);
  await insertRecommendationViaRest(id, result);
  await trackEvent('requirement_created', { requirement_id: id });
  return { id, error: null };
}

async function insertRecommendationViaRest(
  requirementId: string,
  result: { provider: string; services: unknown; cost_estimation: unknown; roadmap: unknown; architecture_suggestion: string }
): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return;
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? key;
  await fetch(`${url}/rest/v1/recommendations`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      requirement_id: requirementId,
      provider: result.provider,
      services: result.services,
      cost_estimation: result.cost_estimation,
      roadmap: result.roadmap,
      architecture_suggestion: result.architecture_suggestion,
    }),
  });
}

export async function getMyRequirements() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: [], error: 'Unauthorized' };

  const { data, error } = await supabase
    .from('requirements')
    .select('id, prompt_input, questionnaire_data, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error && isSchemaCacheError(error.message)) {
    return fetchRequirementsViaRest(user.id);
  }
  return { data: data ?? [], error: error?.message ?? null };
}

async function fetchRequirementWithRecViaRest(
  requirementId: string,
  userId: string
): Promise<{ data: { requirement: unknown; recommendation: unknown } | null; error: string | null }> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return { data: null, error: 'Missing Supabase config' };
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token ?? key;
  const headers = { apikey: key, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  const [reqRes, recRes] = await Promise.all([
    fetch(`${url}/rest/v1/requirements?id=eq.${requirementId}&user_id=eq.${userId}&select=*`, { headers }),
    fetch(`${url}/rest/v1/recommendations?requirement_id=eq.${requirementId}&select=*`, { headers }),
  ]);
  if (!reqRes.ok) return { data: null, error: await reqRes.text() };
  const reqList = (await reqRes.json()) as unknown[];
  const req = reqList?.[0] ?? null;
  if (!req) return { data: null, error: 'Not found' };
  const recList = recRes.ok ? ((await recRes.json()) as unknown[]) : [];
  const rec = recList?.[0] ?? null;
  return { data: { requirement: req, recommendation: rec }, error: null };
}

export async function getRequirementWithRecommendation(requirementId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { data: null, error: 'Unauthorized' };

  const { data: req, error: reqError } = await supabase
    .from('requirements')
    .select('*')
    .eq('id', requirementId)
    .eq('user_id', user.id)
    .single();

  if (reqError && isSchemaCacheError(reqError.message)) {
    return fetchRequirementWithRecViaRest(requirementId, user.id);
  }
  if (reqError || !req) return { data: null, error: reqError?.message ?? 'Not found' };

  const { data: rec } = await supabase
    .from('recommendations')
    .select('*')
    .eq('requirement_id', requirementId)
    .single();

  return { data: { requirement: req, recommendation: rec }, error: null };
}
