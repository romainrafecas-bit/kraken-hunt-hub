-- Subscriptions table
CREATE TABLE public.subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'trialing',
  trial_ends_at timestamptz,
  current_period_start timestamptz,
  current_period_end timestamptz,
  cancel_at_period_end boolean DEFAULT false,
  stripe_subscription_id text UNIQUE,
  stripe_customer_id text,
  product_id text,
  price_id text,
  environment text NOT NULL DEFAULT 'sandbox',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_sub_id ON public.subscriptions(stripe_subscription_id);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription"
  ON public.subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role manages subscriptions"
  ON public.subscriptions FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Extend handle_new_user to also create subscription row
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  is_owner boolean;
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, split_part(NEW.email, '@', 1));

  is_owner := lower(NEW.email) = 'romain.rafecas@gmail.com';

  INSERT INTO public.subscriptions (user_id, status, trial_ends_at, current_period_end)
  VALUES (
    NEW.id,
    CASE WHEN is_owner THEN 'active' ELSE 'trialing' END,
    CASE WHEN is_owner THEN NULL ELSE now() + INTERVAL '14 days' END,
    CASE WHEN is_owner THEN now() + INTERVAL '100 years' ELSE NULL END
  );

  RETURN NEW;
END;
$function$;

-- Backfill existing users (give them a 14d trial from now; owner gets active)
INSERT INTO public.subscriptions (user_id, status, trial_ends_at, current_period_end)
SELECT
  u.id,
  CASE WHEN lower(u.email) = 'romain.rafecas@gmail.com' THEN 'active' ELSE 'trialing' END,
  CASE WHEN lower(u.email) = 'romain.rafecas@gmail.com' THEN NULL ELSE now() + INTERVAL '14 days' END,
  CASE WHEN lower(u.email) = 'romain.rafecas@gmail.com' THEN now() + INTERVAL '100 years' ELSE NULL END
FROM auth.users u
LEFT JOIN public.subscriptions s ON s.user_id = u.id
WHERE s.id IS NULL;

-- Access check function
CREATE OR REPLACE FUNCTION public.has_active_access(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE user_id = user_uuid
    AND (
      (status = 'trialing' AND trial_ends_at > now())
      OR (status IN ('active', 'past_due') AND (current_period_end IS NULL OR current_period_end > now()))
      OR (status = 'canceled' AND current_period_end > now())
    )
  );
$$;