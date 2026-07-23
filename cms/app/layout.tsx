import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Управление сайтом — СМП МАРКО",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
