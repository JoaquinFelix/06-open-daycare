import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenDayCare",
  description:
    "Sala Soles: logros, actividades y avisos diarios de tus peques en la guardería.",
};

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&display=swap";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="flex min-h-full flex-col">
        {/* React 19 los eleva al <head>; evitamos escribir <head> a mano en App Router */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link rel="stylesheet" href={FONT_HREF} />
        {children}
      </body>
    </html>
  );
}
