import assert from "node:assert/strict";

const base = (process.env.SMP_AUDIT_BASE_URL || "https://smp-marko.ru").replace(/\/$/, "");
async function html(route) {
  const response = await fetch(base + route, { signal: AbortSignal.timeout(20_000) });
  assert.equal(response.status, 200, route);
  return response.text();
}

const redirect = await fetch(base + "/novosti/balki-marko", {
  redirect: "manual",
  signal: AbortSignal.timeout(20_000),
});
await redirect.arrayBuffer();
assert.equal(redirect.status, 301);
assert.equal(new URL(redirect.headers.get("location"), base).pathname, "/news/balki-marko");
const news = await html("/news/balki-marko");
assert(news.includes("/news/balki-marko"));
const sitemap = await html("/sitemap.xml");
assert(!sitemap.includes("/novosti/balki-marko"));
assert.equal(sitemap.split("https://smp-marko.ru/news/balki-marko</loc>").length - 1, 1);
const restoration = await html("/uslugi/vosstanovlenie-perekrytij");
assert(!restoration.includes('href="/uslugi"'));
assert(restoration.includes('href="/services"'));
for (const route of ["/", "/about", "/services", "/services/installation"]) {
  const page = await html(route);
  assert(page.includes('src="/images/service-install-1600.webp"'), route);
  assert(page.includes("480.webp 480w"), route);
  assert(page.includes("768.webp 768w"), route);
  assert(!page.includes('src="/service-install.jpeg"'), route);
}
for (const width of [480, 768, 1280, 1600]) {
  const response = await fetch(base + `/images/service-install-${width}.webp`);
  assert.equal(response.status, 200);
  const bytes = await response.arrayBuffer();
  console.log(`Image ${width}: ${bytes.byteLength} bytes`);
}
for (const slug of ["balaev-house", "ispolkomskaya-scheme", "krasnodar-console", "marko-termo"]) {
  const page = await html("/objects/" + slug);
  for (const heading of ["Задача", "Ход работ и решение", "Результат"]) {
    assert(page.includes(`<h2>${heading}</h2>`), slug + ": " + heading);
  }
}
console.log("All four SEO audit checks passed:", base);
