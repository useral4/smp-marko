import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadButton, UiIcon } from "../../components/SiteShell";
import { newsItems } from "../../data";

export function generateStaticParams(){return newsItems.map((item)=>({slug:item.slug}))}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const item=newsItems.find((news)=>news.slug===slug);return {title:item?`${item.title} — СМП МАРКО`:"Новость — СМП МАРКО",description:item?.excerpt}}

export default async function NewsItemPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const item=newsItems.find((news)=>news.slug===slug);if(!item)notFound();return <main id="top"><section className="publication-hero news-publication-hero"><div className="container publication-heading"><div className="breadcrumbs"><Link href="/">Главная</Link><span>—</span><Link href="/news">Новости</Link></div><small>{item.date}</small><h1>{item.title}</h1><p>{item.excerpt}</p></div></section><article className="section publication"><div className="container publication-body">{item.paragraphs.map((paragraph)=><p className="publication-lead" key={paragraph}>{paragraph}</p>)}<div className="publication-facts">{item.facts.map((fact,index)=><div key={fact}><span>{String(index+1).padStart(2,"0")}</span><b>{fact}</b></div>)}</div><a className="source-link" href={item.sourceHref} target="_blank" rel="noreferrer">Оригинал публикации в Telegram <UiIcon name="arrow" size={17}/></a></div></article><section className="section compact-cta"><div className="container"><div><div className="eyebrow"><span/>Похожая задача?</div><h2>Подберём систему<br/>по вашему плану</h2></div><LeadButton>Получить расчёт <UiIcon name="arrow"/></LeadButton></div></section></main>}
