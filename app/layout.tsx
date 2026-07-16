import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "СМП МАРКО — монолитные перекрытия в Москве",
  description:
    "Проектирование, производство и монтаж сборно-монолитных перекрытий МАРКО в Москве и Московской области.",
  keywords: [
    "перекрытия МАРКО",
    "сборно-монолитные перекрытия",
    "монолитные перекрытия Москва",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
