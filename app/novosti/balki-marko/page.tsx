import type { Metadata } from "next";
import Link from "next/link";
import { LeadButton, UiIcon } from "../../components/SiteShell";
import { readNewsItems } from "../../../lib/runtime-content";

export const metadata: Metadata = {
  title: "Балки для перекрытий МАРКО",
  description: "История развития балок для сборно-монолитных перекрытий и современные решения МАРКО-ПРОФИЛЬ.",
};

export default async function ArchiveNewsPage() {
  const items = await readNewsItems();
  const item = items.find((news) => news.slug === "balki-marko");
  if (!item) return null;
  return <main id="top">
    <section className="publication-hero news-publication-hero"><div className="container publication-heading">
      <div className="breadcrumbs"><Link href="/">Главная</Link><span>—</span><Link href="/news">Новости</Link></div>
      <small>{item.date}</small><h1>{item.title}</h1><p>{item.excerpt}</p>
    </div></section>
    <article className="section publication"><div className="container publication-body">
      {item.paragraphs.map((paragraph)=><p className="publication-lead" key={paragraph}>{paragraph}</p>)}
      <a className="source-link" href={item.sourceHref} target="_blank" rel="noreferrer">Архивная версия <UiIcon name="arrow" size={17}/></a>
    </div></article>
    <section className="section compact-cta"><div className="container"><div><div className="eyebrow"><span/>Похожая задача?</div><h2>Подберём систему<br/>по вашему плану</h2></div><LeadButton>Получить расчёт <UiIcon name="arrow"/></LeadButton></div></section>
  </main>;
}
