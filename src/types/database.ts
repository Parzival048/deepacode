export type UserRole = 'user' | 'admin';

export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';

export interface Profile {
  id: string;
  name: string | null;
  phone: string | null;
  role: UserRole;
  subscription_plan?: SubscriptionPlan;
  created_at: string;
}

export interface Requirement {
  id: string;
  user_id: string;
  prompt_input: string | null;
  questionnaire_data: QuestionnaireData;
  created_at: string;
}

export interface QuestionnaireData {
  monthly_users?: number;
  storage_gb?: number;
  compute_workload?: string;
  budget_range?: string;
  region?: string;
  security_level?: string;
  [key: string]: unknown;
}

export interface CloudService {
  id: string;
  provider: 'aws' | 'azure' | 'gcp';
  category: string;
  service_name: string;
  description: string | null;
  pricing_model: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface Recommendation {
  id: string;
  requirement_id: string;
  provider: string;
  services: RecommendedService[];
  cost_estimation: CostEstimation;
  roadmap: RoadmapStep[];
  architecture_suggestion: string | null;
  created_at: string;
}

export interface RecommendedService {
  name: string;
  tier?: string;
  estimated_cost_monthly?: number;
  description?: string;
}

export interface CostEstimation {
  total_monthly?: number;
  currency?: string;
  breakdown?: { service: string; cost: number }[];
}

export interface RoadmapStep {
  step: number;
  title: string;
  description: string;
}

export interface Case {
  id: string;
  industry: string | null;
  requirement_tags: string[];
  problems_faced: string | null;
  solutions: string | null;
  best_practices: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount_cents: number;
  plan: string;
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  stripe_payment_id: string | null;
  created_at: string;
}

export interface AnalyticsEvent {
  id: string;
  event_type: string;
  user_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}
