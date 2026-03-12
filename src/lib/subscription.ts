import type { SubscriptionPlan } from '@/types/database';

export const PLAN_FEATURES: Record<SubscriptionPlan, string[]> = {
  free: ['Basic recommendation', 'Cost estimate', 'Roadmap'],
  pro: ['Everything in Free', 'Detailed advisory report', 'Architecture review', 'Email support'],
  enterprise: ['Everything in Pro', 'Full architecture design', 'Migration plan', 'Priority support'],
};

export function hasFeature(plan: SubscriptionPlan, feature: string): boolean {
  const features = PLAN_FEATURES[plan] ?? [];
  if (features.includes(feature)) return true;
  if (plan === 'enterprise') return true;
  if (plan === 'pro' && PLAN_FEATURES.free.includes(feature)) return true;
  return false;
}

export function canAccessFullArchitecture(plan: SubscriptionPlan): boolean {
  return plan === 'enterprise';
}

export function canAccessMigrationPlan(plan: SubscriptionPlan): boolean {
  return plan === 'enterprise';
}

export function hasPrioritySupport(plan: SubscriptionPlan): boolean {
  return plan === 'enterprise';
}
