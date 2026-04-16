
-- Products table
CREATE TABLE public.products (
  url TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  price NUMERIC,
  image_url TEXT,
  rating NUMERIC,
  review_count INTEGER DEFAULT 0,
  sellers_count INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  recurrences INTEGER DEFAULT 0,
  dates_seen TEXT[],
  last_seen TIMESTAMP WITH TIME ZONE,
  added_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  enriched BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Anyone can read products
CREATE POLICY "Anyone can read products"
  ON public.products FOR SELECT
  TO public
  USING (true);

-- Favorites table
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_url TEXT REFERENCES public.products(url) ON DELETE CASCADE NOT NULL,
  collection TEXT DEFAULT 'À sourcer',
  note TEXT DEFAULT '',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, product_url)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- Users can read their own favorites
CREATE POLICY "Users can read own favorites"
  ON public.favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert their own favorites
CREATE POLICY "Users can insert own favorites"
  ON public.favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own favorites
CREATE POLICY "Users can update own favorites"
  ON public.favorites FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete own favorites"
  ON public.favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
