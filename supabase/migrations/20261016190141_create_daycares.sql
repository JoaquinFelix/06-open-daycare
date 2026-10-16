-- Migration pattern (spec 07-crear-tabla-daycares):
-- 1. Author the SQL here, versioned in git (source of truth).
-- 2. Apply it on the remote DB via MCP apply_migration (name: create_daycares).
-- 3. Rename this file to the <version> assigned by the server.
-- Schema source: 07-DB-Schema dictionary, section 1 (public.daycares).

create table public.daycares (
  id uuid not null default gen_random_uuid(),
  name text not null,
  address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_active boolean not null default true,
  constraint daycares_pkey primary key (id)
);

-- RLS habilitado sin policies (aún no hay auth): nadie lee ni escribe vía Data API.
alter table public.daycares enable row level security;

-- Semilla: 4 guarderías activas; uuid, created_at, updated_at e is_active usan sus defaults.
insert into public.daycares (name, address) values
  ('Guardería Sala Soles', 'Av. Siempreviva 742, Springfield'),
  ('Guardería Los Girasoles', 'Av. Primavera 1230'),
  ('Jardín Infantil Arcoíris', 'Calle del Sol 45'),
  ('Guardería Pequeños Pasos', 'Blvr. de los Niños 789');
