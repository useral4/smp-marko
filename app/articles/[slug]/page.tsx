import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadButton, UiIcon } from "../../components/SiteShell";
import { articles } from "../../data";

export function generateStaticParams(){return articles.map((article)=>({slug:article.slug}))}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const article=articles.find((item)=>item.slug===slug);return {title:article?`${article.title} — СМП МАРКО`:"Статья — СМП МАРКО",description:article?.excerpt}}

export default async function ArticlePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const article=articles.find((item)=>item.slug===slug);if(!article)notFound();return <main id="top"><section className="publication-hero"><div className="container publication-heading"><div className="breadcrumbs"><Link href="/">Главная</Link><span>—</span><Link href="/articles">Статьи</Link></div><small>{article.tag}</small><h1>{article.title}</h1><p>{article.lead}</p></div></section><article className="section publication"><div className="container publication-body">{article.sections.map((section)=><section key={section.title}><h2>{section.title}</h2>{section.paragraphs?.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}{section.bullets&&<ul>{section.bullets.map((bullet)=><li key={bullet}>{bullet}</li>)}</ul>}</section>)}<div className="publication-note"><b>Важно</b><p>Материал носит информационный характер. Армирование, опирание и состав перекрытия для конкретного объекта определяются проектом и расчётом конструктора.</p></div><a className="source-link" href={article.sourceHref} target="_blank" rel="noreferrer">Источник: основной сайт СМП МАРКО <UiIcon name="arrow" size={17}/></a></div></article><section className="section compact-cta"><div className="container"><div><div className="eyebrow"><span/>Следующий шаг</div><h2>Отправьте план перекрытия<br/>для расчёта инженером</h2></div><LeadButton>Получить расчёт <UiIcon name="arrow"/></LeadButton></div></section></main>}
