-- =============================================================================
-- Voltride :: Seed an admin user
-- =============================================================================
-- Run this in your Supabase SQL editor *after* the user has signed up via the
-- /auth page (so they exist in auth.users). It promotes that account to admin.
--
-- Default test admin credentials (created by the bundled migration):
--     email:    admin@voltride.com
--     password: Admin123!
--
-- To promote a *different* user, replace the email below.
-- =============================================================================

WITH target AS (
  SELECT id FROM auth.users WHERE email = 'admin@voltride.com' LIMIT 1
)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM target
ON CONFLICT (user_id, role) DO NOTHING;

-- Optional: also drop a friendly profile row so the dashboard greets them by name
WITH target AS (
  SELECT id FROM auth.users WHERE email = 'admin@voltride.com' LIMIT 1
)
INSERT INTO public.profiles (id, full_name)
SELECT id, 'Voltride Admin' FROM target
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- Verify
SELECT u.email, r.role
FROM auth.users u
JOIN public.user_roles r ON r.user_id = u.id
WHERE r.role = 'admin';