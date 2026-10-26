// Seed re-ejecutable del usuario staff de prueba (spec 08-crear-tabla-users).
// Crea o reutiliza el usuario de Auth vía Admin API y hace upsert del perfil en
// public.users por REST (service_role bypasea RLS). Uso: npm run seed:staff

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const STAFF_EMAIL = 'fmjoaquin@gmail.com';
const STAFF_PASSWORD = '123456';
const STAFF_FULL_NAME = 'Staff de Prueba';
const DAYCARE_NAME = 'Guardería Sala Soles';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Faltan NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en .env');
  process.exit(1);
}

const authHeaders = {
  apikey: SERVICE_ROLE_KEY,
  Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
  'Content-Type': 'application/json',
};

async function request(path, options = {}) {
  const res = await fetch(`${SUPABASE_URL}${path}`, {
    ...options,
    headers: { ...authHeaders, ...options.headers },
  });
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`${options.method ?? 'GET'} ${path} → ${res.status}: ${body}`);
  }
  return body ? JSON.parse(body) : null;
}

async function findAuthUser() {
  const data = await request('/auth/v1/admin/users?page=1&per_page=1000');
  return data.users.find((u) => u.email?.toLowerCase() === STAFF_EMAIL.toLowerCase()) ?? null;
}

async function ensureAuthUser() {
  const existing = await findAuthUser();
  if (existing) {
    if (existing.email_confirmed_at) {
      console.log(`Usuario Auth existente reutilizado: ${STAFF_EMAIL}`);
    } else {
      await request(`/auth/v1/admin/users/${existing.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ email_confirm: true }),
      });
      console.log(`Usuario Auth existente confirmado: ${STAFF_EMAIL}`);
    }
    return existing;
  }
  const created = await request('/auth/v1/admin/users', {
    method: 'POST',
    body: JSON.stringify({
      email: STAFF_EMAIL,
      password: STAFF_PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: STAFF_FULL_NAME },
    }),
  });
  console.log(`Usuario Auth creado y confirmado: ${STAFF_EMAIL}`);
  return created;
}

async function resolveDaycareId() {
  const data = await request(
    `/rest/v1/daycares?name=eq.${encodeURIComponent(DAYCARE_NAME)}&select=id`
  );
  const matches = data ?? [];
  if (matches.length !== 1) {
    throw new Error(
      `Se esperaba exactamente 1 guardería "${DAYCARE_NAME}" y se encontraron ${matches.length}. ` +
        'Corregí los duplicados/renombres antes de correr el seed.'
    );
  }
  return matches[0].id;
}

async function upsertProfile(authUser, daycareId) {
  await request('/rest/v1/users', {
    method: 'POST',
    headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({
      id: authUser.id,
      daycare_id: daycareId,
      role: 'staff',
      status: 'active',
      full_name: STAFF_FULL_NAME,
      avatar_url: null,
      notify_on_post: true,
      daily_summary_enabled: true,
    }),
  });
  console.log(`Perfil staff ${authUser.id} upsert en "${DAYCARE_NAME}"`);
}

const authUser = await ensureAuthUser();
const daycareId = await resolveDaycareId();
await upsertProfile(authUser, daycareId);
console.log('Seed completado.');
