import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "./database.types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const PUBLIC_PATHS = ["/login", "/activar-cuenta"];

export const createClient = async (request: NextRequest) => {
  // Creamos una respuesta "en blanco" que luego puede ser reemplazada por setAll
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
  let sessionHeaders: Record<string, string> = {};

  const supabase = createServerClient<Database>(
    supabaseUrl!,
    supabaseKey!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          sessionHeaders = headers;
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
  const { data } = await supabase.auth.getClaims();
  const hasSession = !!data?.claims;

  const { pathname } = request.nextUrl;
  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  // Un redirect debe conservar lo que dejó setAll. No se copian todos los headers
  // de supabaseResponse: x-middleware-next y x-middleware-request-* no van acá.
  const redirectTo = (destination: string) => {
    const url = request.nextUrl.clone();
    url.pathname = destination;
    url.search = "";
    const response = NextResponse.redirect(url);
    supabaseResponse.cookies
      .getAll()
      .forEach((cookie) => response.cookies.set(cookie));
    Object.entries(sessionHeaders).forEach(([key, value]) =>
      response.headers.set(key, value)
    );
    return response;
  };

  if (isPublicPath && hasSession) {
    return redirectTo("/");
  }

  if (!isPublicPath && !hasSession) {
    return redirectTo("/login");
  }

  return supabaseResponse;
};
