-- Fix foreign key constraint issue for Stack Auth integration
-- Remove the foreign key constraint that references auth.users since we're using Stack Auth

-- Drop the foreign key constraint
ALTER TABLE public.users DROP CONSTRAINT users_id_fkey;

-- Change the id column to not reference auth.users
ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;

-- Update the trigger to handle Stack Auth users instead of Supabase auth users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create a new function that can be called manually for Stack Auth users
CREATE OR REPLACE FUNCTION public.create_stack_user(
    p_id UUID,
    p_email TEXT,
    p_name TEXT DEFAULT NULL,
    p_avatar_url TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.users (id, email, name, avatar_url)
    VALUES (
        p_id,
        p_email,
        COALESCE(p_name, p_email),
        p_avatar_url
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        name = COALESCE(EXCLUDED.name, users.name),
        avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;