import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/thanks"],
    },
    sitemap: "https://smp-marko.ru/sitemap.xml",
    host: "https://smp-marko.ru",
  };
}
