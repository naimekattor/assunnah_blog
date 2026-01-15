-- Migration: Add Password Reset System
-- Description: Creates password_reset_tokens table for secure password recovery

-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON public.password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON public.password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON public.password_reset_tokens(expires_at);

-- Enable Row Level Security
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for password_reset_tokens
-- Users can only see their own tokens
CREATE POLICY "password_reset_tokens_select_own"
  ON public.password_reset_tokens FOR SELECT
  USING (user_id = auth.uid());

-- Anyone can insert tokens (for forgot password flow)
CREATE POLICY "password_reset_tokens_insert_all"
  ON public.password_reset_tokens FOR INSERT
  WITH CHECK (true);

-- Users can update their own tokens (to mark as used)
CREATE POLICY "password_reset_tokens_update_own"
  ON public.password_reset_tokens FOR UPDATE
  USING (user_id = auth.uid());

-- Admins can delete any token
CREATE POLICY "password_reset_tokens_delete_admin"
  ON public.password_reset_tokens FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Function to cleanup expired tokens (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_password_reset_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM public.password_reset_tokens
  WHERE expires_at < NOW() AND used = TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled job to cleanup expired tokens (requires pg_cron extension)
-- Note: This is optional and requires pg_cron extension to be enabled
-- Alternatively, you can run this manually or via a cron job
-- SELECT cron.schedule('cleanup-password-reset-tokens', '0 0 * * *', 'SELECT cleanup_expired_password_reset_tokens()');
