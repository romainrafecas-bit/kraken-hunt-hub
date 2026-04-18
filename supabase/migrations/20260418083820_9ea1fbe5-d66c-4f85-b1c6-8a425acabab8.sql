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

  is_owner := lower(NEW.email) IN ('romain.rafecas@gmail.com', 'bouska1@outlook.fr');

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