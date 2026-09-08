import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadButton, UiIcon } from "../../components/SiteShell";
import { readArticles } from "../../../lib/runtime-content";

function compactSeoTitle(title:string){
  if(title.length<=47)return `${title} — СМП МАРКО`;
  const topic=title.split(":",1)[0].trim();
  if(topic.length>=20&&topic.length<=47)return `${topic} — СМП МАРКО`;
  const shortened=title.slice(0,58).replace(/\s+\S*$/u,"").replace(/[,:;—-]+$/u,"").trim();
  return `${shortened || title.slice(0,57).trim()}…`;
}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const articles=await readArticles();const article=articles.find((item)=>item.slug===slug);return {title:article?compactSeoTitle(article.title):"Статья — СМП МАРКО",description:article?.excerpt,alternates:article?{canonical:`/articles/${article.slug}`}:undefined}}

export default async function ArticlePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const articles=await readArticles();const article=articles.find((item)=>item.slug===slug);if(!article)notFound();const serviceHref=article.tag==="Реконструкция"?"/services/replacement":article.tag==="Проектирование"?"/services/design":article.tag==="Монтаж"?"/services/installation":"/technology";return <main id="top"><section className="publication-hero"><div className="container publication-heading"><div className="breadcrumbs"><Link href="/">Главная</Link><span>—</span><Link href="/articles">Статьи</Link></div><small>{article.tag}</small><h1>{article.title}</h1><p>{article.lead}</p>{article.image&&<div className="publication-cover"><Image src={article.image} alt={`Иллюстрация к статье «${article.title}»`} fill priority sizes="(max-width:900px) 100vw,1180px"/></div>}</div></section><article className="section publication"><div className="container publication-body">{article.sections.map((section)=><section key={section.title}><h2>{section.title}</h2>{section.paragraphs?.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}{section.bullets&&<ul>{section.bullets.map((bullet)=><li key={bullet}>{bullet}</li>)}</ul>}{section.image&&<figure className="publication-section-image"><Image src={section.image} alt={section.imageAlt||section.title} width={1600} height={900} sizes="(max-width:900px) 100vw,820px"/></figure>}</section>)}<div className="publication-note"><b>Важно</b><p>Материал носит информационный характер. Армирование, опирание и состав перекрытия для конкретного объекта определяются проектом и расчётом конструктора.</p></div>{article.sourceHref&&<a className="source-link" href={article.sourceHref} target="_blank" rel="noreferrer">Дополнительные материалы <UiIcon name="arrow" size={17}/></a>}<nav className="publication-related" aria-label="Материалы по теме"><b>Продолжить изучение</b><Link href={serviceHref}>Подходящая услуга <UiIcon name="arrow" size={16}/></Link><Link href="/objects">Реализованные объекты <UiIcon name="arrow" size={16}/></Link><Link href="/prices">Цены и характеристики <UiIcon name="arrow" size={16}/></Link></nav></div></article><section className="section compact-cta"><div className="container"><div><div className="eyebrow"><span/>Следующий шаг</div><h2>Отправьте план перекрытия<br/>для расчёта инженером</h2></div><LeadButton>Получить расчёт <UiIcon name="arrow"/></LeadButton></div></section></main>}
