import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export const createClient = async (request: NextRequest) => {
  // Creamos una respuesta "en blanco" que luego puede ser reemplazada por setAll
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient<Database>(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          // Sin estos headers un CDN podría cachear la respuesta con el
          // Set-Cookie y servir la sesión de un usuario a otro.
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        },
      },
    },
  );

  // IMPORTANTE: no correr código entre createServerClient y getClaims().
  // getClaims valida la sesión y, si el token está por vencer, lo refresca
  // (disparando setAll). Sin esta llamada las sesiones nunca se renuevan.
  await supabase.auth.getClaims();

  return supabaseResponse;
};
