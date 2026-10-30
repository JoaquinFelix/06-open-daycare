import { type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";

// En Next.js 16 el archivo middleware.ts fue renombrado a proxy.ts
export async function proxy(request: NextRequest) {
  return await createClient(request);
}

export const config = {
  matcher: [
    /*
     * Corre en todas las rutas excepto:
     * - _next/static, _next/image (assets)
     * - favicon.ico
     * Un asset nuevo de public/ que deba verse sin sesión hay que sumarlo acá.
     */
    "/((?!_next/static/|_next/image$|favicon\\.ico$).*)",
  ],
};
