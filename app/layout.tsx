import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "./components/SiteShell";
import { readPages, readSiteContent } from "../lib/runtime-content";

// Content is edited through /admin and deployed automatically.
// Always serve the active release instead of keeping stale page HTML.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  metadataBase: new URL("https://smp-marko.ru"),
  title: "СМП МАРКО — сборно-монолитные перекрытия",
  description:
    "Проектирование, производство и монтаж сборно-монолитных перекрытий МАРКО в Москве, Санкт-Петербурге и регионах.",
  keywords: [
    "перекрытия МАРКО",
    "сборно-монолитные перекрытия",
    "монолитные перекрытия Москва и Санкт-Петербург",
  ],
  icons: { icon: "/icon.jpg", shortcut: "/icon.jpg", apple: "/icon.jpg" },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "СМП МАРКО",
    url: "https://smp-marko.ru",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [siteContent, pages] = await Promise.all([readSiteContent(), readPages()]);
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://smp-marko.ru/#organization",
        name: "СМП МАРКО",
        url: "https://smp-marko.ru/",
        logo: "https://smp-marko.ru/marko-logo.jpg",
        email: siteContent.email,
        telephone: siteContent.phones.map((phone) => phone.display),
        address: {
          "@type": "PostalAddress",
          streetAddress: siteContent.address,
          addressCountry: "RU",
        },
        sameAs: siteContent.socials.map((social) => social.href),
      },
      {
        "@type": "WebSite",
        "@id": "https://smp-marko.ru/#website",
        url: "https://smp-marko.ru/",
        name: "СМП МАРКО",
        inLanguage: "ru-RU",
        publisher: { "@id": "https://smp-marko.ru/#organization" },
      },
    ],
  };
  return (
    <html lang="ru">
      <body><SiteShell siteContent={siteContent} pages={pages}>{children}</SiteShell><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}/></body>
    </html>
  );
}
