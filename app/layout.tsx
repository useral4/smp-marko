import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "./components/SiteShell";
import { readSiteContent } from "../lib/runtime-content";

// Content is edited through /admin and deployed automatically.
// Always serve the active release instead of keeping stale page HTML.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "СМП МАРКО — сборно-монолитные перекрытия",
  description:
    "Проектирование, производство и монтаж сборно-монолитных перекрытий МАРКО в Москве, Санкт-Петербурге и регионах.",
  keywords: [
    "перекрытия МАРКО",
    "сборно-монолитные перекрытия",
    "монолитные перекрытия Москва и Санкт-Петербург",
  ],
  icons: { icon: "/icon.jpg", shortcut: "/icon.jpg", apple: "/icon.jpg" },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const siteContent = await readSiteContent();
  return (
    <html lang="ru">
      <body><SiteShell siteContent={siteContent}>{children}</SiteShell></body>
    </html>
  );
}
