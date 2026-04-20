CREATE TABLE public.margin_calculations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  label TEXT NOT NULL DEFAULT 'Sans titre',
  inputs JSONB NOT NULL DEFAULT '{}'::jsonb,
  results JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.margin_calculations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own margin calculations"
ON public.margin_calculations FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own margin calculations"
ON public.margin_calculations FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own margin calculations"
ON public.margin_calculations FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own margin calculations"
ON public.margin_calculations FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX idx_margin_calculations_user_created ON public.margin_calculations(user_id, created_at DESC);

CREATE TRIGGER update_margin_calculations_updated_at
BEFORE UPDATE ON public.margin_calculations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();