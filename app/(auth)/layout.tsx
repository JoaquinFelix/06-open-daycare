import type { ReactNode } from "react";

// Los mockups de auth usan #FBF4EC, distinto del token --color-cream (#F6ECDF).
export default function AuthLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-[#FBF4EC]">{children}</div>;
}
