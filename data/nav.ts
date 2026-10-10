export type IconName =
  | "home"
  | "children"
  | "bell"
  | "user"
  | "plus"
  | "camera"
  | "heart"
  | "comment"
  | "megaphone"
  | "logout"
  | "menu"
  | "close"
  | "sun"
  | "image"
  | "search"
  | "chevron-left"
  | "chevron-right"
  | "alert";

export type NavItem = { href: string; label: string; icon: IconName };

export const navItems: NavItem[] = [
  { href: "/", label: "Feed", icon: "home" },
  { href: "/kids", label: "Niños", icon: "children" },
  { href: "/avisos", label: "Avisos", icon: "bell" },
  { href: "/mi-cuenta", label: "Mi cuenta", icon: "user" },
];
