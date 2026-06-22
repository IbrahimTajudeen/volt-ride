-- Lock down SECURITY DEFINER functions from anon
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated, service_role;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Tighten contact_messages: validate input
drop policy if exists "contact anyone insert" on public.contact_messages;
create policy "contact anyone insert" on public.contact_messages for insert to anon, authenticated
  with check (
    length(name) between 1 and 120
    and length(email) between 3 and 200
    and email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and length(message) between 1 and 5000
  );