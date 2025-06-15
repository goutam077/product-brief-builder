
-- Create a table to store PRDs
CREATE TABLE public.prds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add comments to the table and columns
COMMENT ON TABLE public.prds IS 'Stores Product Requirements Documents content.';
COMMENT ON COLUMN public.prds.user_id IS 'Links PRD to a user.';
COMMENT ON COLUMN public.prds.content IS 'The JSON content of the PRD.';

-- Enable Row Level Security (RLS) for the prds table
ALTER TABLE public.prds ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own PRDs
CREATE POLICY "Users can view their own PRDs"
  ON public.prds FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can create their own PRDs
CREATE POLICY "Users can insert their own PRDs"
  ON public.prds FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own PRDs
CREATE POLICY "Users can update their own PRDs"
  ON public.prds FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own PRDs
CREATE POLICY "Users can delete their own PRDs"
  ON public.prds FOR DELETE
  USING (auth.uid() = user_id);

-- Create a function to automatically update the 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.handle_prd_update()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to execute the function before any update on the prds table
CREATE TRIGGER on_prd_update
  BEFORE UPDATE ON public.prds
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_prd_update();
