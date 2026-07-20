import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "./components/SiteShell";

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body><SiteShell>{children}</SiteShell></body>
    </html>
  );
}
