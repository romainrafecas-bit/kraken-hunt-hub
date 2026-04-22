UPDATE public.subscriptions
SET trial_ends_at = now() - interval '1 day',
    status = 'trialing'
WHERE user_id = '1638f05a-775e-47c4-af12-0dfdb82272e7';