
-- 1. Lock down products: only users with active access can read
DROP POLICY IF EXISTS "Anyone can read products" ON public.products;

CREATE POLICY "Active subscribers can read products"
ON public.products
FOR SELECT
TO authenticated
USING (public.has_active_access(auth.uid()));

-- 2. Tighten favorites: require active access in addition to ownership
DROP POLICY IF EXISTS "Users can read own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can update own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON public.favorites;

CREATE POLICY "Active subscribers can read own favorites"
ON public.favorites FOR SELECT TO authenticated
USING (auth.uid() = user_id AND public.has_active_access(auth.uid()));

CREATE POLICY "Active subscribers can insert own favorites"
ON public.favorites FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND public.has_active_access(auth.uid()));

CREATE POLICY "Active subscribers can update own favorites"
ON public.favorites FOR UPDATE TO authenticated
USING (auth.uid() = user_id AND public.has_active_access(auth.uid()));

CREATE POLICY "Active subscribers can delete own favorites"
ON public.favorites FOR DELETE TO authenticated
USING (auth.uid() = user_id AND public.has_active_access(auth.uid()));

-- 3. Tighten margin_calculations the same way
DROP POLICY IF EXISTS "Users can read own margin calculations" ON public.margin_calculations;
DROP POLICY IF EXISTS "Users can insert own margin calculations" ON public.margin_calculations;
DROP POLICY IF EXISTS "Users can update own margin calculations" ON public.margin_calculations;
DROP POLICY IF EXISTS "Users can delete own margin calculations" ON public.margin_calculations;

CREATE POLICY "Active subscribers can read own margin calculations"
ON public.margin_calculations FOR SELECT TO authenticated
USING (auth.uid() = user_id AND public.has_active_access(auth.uid()));

CREATE POLICY "Active subscribers can insert own margin calculations"
ON public.margin_calculations FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id AND public.has_active_access(auth.uid()));

CREATE POLICY "Active subscribers can update own margin calculations"
ON public.margin_calculations FOR UPDATE TO authenticated
USING (auth.uid() = user_id AND public.has_active_access(auth.uid()));

CREATE POLICY "Active subscribers can delete own margin calculations"
ON public.margin_calculations FOR DELETE TO authenticated
USING (auth.uid() = user_id AND public.has_active_access(auth.uid()));
