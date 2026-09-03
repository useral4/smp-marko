const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/
Disallow: /thanks

Host: smp-marko.ru
Sitemap: https://smp-marko.ru/sitemap.xml
`;

export const dynamic = "force-dynamic";

export function GET() {
  return new Response(robots, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
