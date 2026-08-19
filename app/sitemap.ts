import type { MetadataRoute } from "next";
import { readArticles, readNewsItems, readPages, readProjects, readServices } from "../lib/runtime-content";

const origin = "https://smp-marko.ru";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles, news, pages, projects, services] = await Promise.all([
    readArticles(), readNewsItems(), readPages(), readProjects(), readServices(),
  ]);
  const fixed = ["", "/about", "/articles", "/contacts", "/designers", "/news", "/objects", "/prices", "/privacy", "/reconstruction", "/services", "/technology"];
  const custom = pages.map((page) => page.route || `/${page.slug}`);
  const routes = [
    ...fixed,
    ...custom,
    ...articles.map((item) => `/articles/${item.slug}`),
    ...news.map((item) => `/news/${item.slug}`),
    ...projects.map((item) => `/objects/${item.slug}`),
    ...services.map((item) => `/services/${item.slug}`),
  ];
  const now = new Date();
  return [...new Set(routes)].filter((route) => !route.startsWith("/admin") && route !== "/thanks").map((route) => ({
    url: `${origin}${route === "/" ? "" : route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route.split("/").filter(Boolean).length === 1 ? 0.8 : 0.6,
  }));
}
