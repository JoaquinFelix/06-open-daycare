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
     * - api (route handlers)
     * - _next/static, _next/image (assets)
     * - archivos con extensión (favicon.ico, sitemap.xml, robots.txt, etc.)
     */
    "/((?!api|_next/static|_next/image|.*\\..*).*)",
  ],
};
