-- Fix RLS policies for Stack Auth integration
-- Since we're using Stack Auth instead of Supabase Auth, auth.uid() doesn't work
-- For now, we'll allow public access and rely on application-level security

-- Drop existing video_ideas policies
DROP POLICY IF EXISTS "Users can view own video ideas" ON public.video_ideas;
DROP POLICY IF EXISTS "Users can insert own video ideas" ON public.video_ideas;
DROP POLICY IF EXISTS "Users can update own video ideas" ON public.video_ideas;
DROP POLICY IF EXISTS "Users can delete own video ideas" ON public.video_ideas;

-- Create more permissive policies that work with anon key
-- Note: This is less secure but necessary for Stack Auth integration
CREATE POLICY "Allow public access to video_ideas" ON public.video_ideas
    FOR ALL USING (true);

-- Alternative: You can also disable RLS entirely for video_ideas
-- ALTER TABLE public.video_ideas DISABLE ROW LEVEL SECURITY;