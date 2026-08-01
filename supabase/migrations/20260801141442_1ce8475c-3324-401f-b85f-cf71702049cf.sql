CREATE TABLE IF NOT EXISTS public.products_stats_cache (
  id integer PRIMARY KEY DEFAULT 1,
  payload jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT products_stats_cache_singleton CHECK (id = 1)
);

GRANT SELECT ON public.products_stats_cache TO authenticated;
GRANT ALL ON public.products_stats_cache TO service_role;

ALTER TABLE public.products_stats_cache ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read stats cache" ON public.products_stats_cache;
CREATE POLICY "Authenticated users can read stats cache"
  ON public.products_stats_cache
  FOR SELECT
  TO authenticated
  USING (public.has_active_access(auth.uid()));