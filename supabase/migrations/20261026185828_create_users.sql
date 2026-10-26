-- Migration pattern (spec 08-crear-tabla-users):
-- 1. Author the SQL here, versioned in git (source of truth).
-- 2. Apply it on the remote DB via MCP apply_migration (name: create_users).
-- 3. Rename this file to the <version> assigned by the server.
-- Schema source: 07-DB-Schema dictionary, section 2 (public.users).

-- Enums de dominio (valores en inglés; la UI traduce).
create type public.user_role   as enum ('staff', 'parent', 'admin');
create type public.user_status as enum ('pending', 'active');

create table public.users (
  id                    uuid                primary key default gen_random_uuid(),
  daycare_id            uuid                not null references public.daycares(id) on delete restrict,
  role                  public.user_role    not null,
  status                public.user_status  not null default 'active',
  full_name             text                not null,
  avatar_url            text,
  notify_on_post        boolean             not null default true,
  daily_summary_enabled boolean             not null default true,
  created_at            timestamptz         not null default now(),
  updated_at            timestamptz         not null default now()
);

comment on column public.users.id is
  'Convención: mismo UUID que auth.users.id. FK pendiente hasta el spec de auth.';

create index users_daycare_id_idx on public.users (daycare_id);

-- Esquema no expuesto en la Data API: helpers para las policies sin recursión de RLS.
create schema if not exists private;

-- SECURITY DEFINER rompe la recursión de una policy que consulta su propia tabla.
-- SET search_path = '' obliga a calificar todo esquemáticamente.
create function private.current_daycare_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select daycare_id
  from public.users
  where id = (select auth.uid())
  limit 1;
$$;

create function private.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = ''
as $$
  select role
  from public.users
  where id = (select auth.uid())
  limit 1;
$$;

-- Trigger reutilizable: el cliente no tiene grant sobre updated_at, lo escribe el servidor.
create function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at
  before update on public.users
  for each row
  execute function private.set_updated_at();

-- RLS: fila propia + staff/admin del mismo daycare; update solo de la propia fila.
alter table public.users enable row level security;

create policy users_select_own on public.users
  for select to authenticated
  using (id = (select auth.uid()));

create policy users_select_same_daycare_staff on public.users
  for select to authenticated
  using (
    (select private.current_user_role()) in ('staff', 'admin')
    and daycare_id = (select private.current_daycare_id())
  );

create policy users_update_own on public.users
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- Grants mínimos: sin INSERT/DELETE (el alta la hará el trigger de signup del spec de auth).
revoke all on public.users from anon, authenticated;
grant select on public.users to authenticated;
grant update (full_name, avatar_url, notify_on_post, daily_summary_enabled)
  on public.users to authenticated;

grant usage on type public.user_role, public.user_status to authenticated;
grant usage on schema private to authenticated;
grant execute on function private.current_daycare_id(), private.current_user_role()
  to authenticated;

-- service_role conserva sus grants por defecto y bypassa RLS (usado por el seed).
