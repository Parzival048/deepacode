-- Add subscription plan to profiles for Free / Pro / Enterprise
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS subscription_plan TEXT NOT NULL DEFAULT 'free'
  CHECK (subscription_plan IN ('free', 'pro', 'enterprise'));

COMMENT ON COLUMN public.profiles.subscription_plan IS 'Current plan: free, pro, or enterprise';

NOTIFY pgrst, 'reload schema';
