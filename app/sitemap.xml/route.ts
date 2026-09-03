import { readArticles, readNewsItems, readPages, readProjects, readServices } from "../../lib/runtime-content";

const origin = "https://smp-marko.ru";

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&apos;" })[character] || character);
}

export const dynamic = "force-dynamic";

export async function GET() {
  const [articles, news, pages, projects, services] = await Promise.all([
    readArticles(), readNewsItems(), readPages(), readProjects(), readServices(),
  ]);
  const fixed = ["", "/about", "/articles", "/contacts", "/designers", "/news", "/objects", "/prices", "/privacy", "/reconstruction", "/services", "/technology"];
  const routes = [
    ...fixed,
    ...pages.map((page) => page.route || `/${page.slug}`),
    ...articles.map((item) => `/articles/${item.slug}`),
    ...news.map((item) => `/news/${item.slug}`),
    ...projects.map((item) => `/objects/${item.slug}`),
    ...services.map((item) => `/services/${item.slug}`),
  ];
  const lastModified = new Date().toISOString();
  const urls = [...new Set(routes)]
    .filter((route) => !route.startsWith("/admin") && route !== "/thanks")
    .map((route) => {
      const priority = route === "" ? "1.0" : route.split("/").filter(Boolean).length === 1 ? "0.8" : "0.6";
      return `<url><loc>${escapeXml(`${origin}${route}`)}</loc><lastmod>${lastModified}</lastmod><changefreq>${route === "" ? "weekly" : "monthly"}</changefreq><priority>${priority}</priority></url>`;
    })
    .join("");
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
