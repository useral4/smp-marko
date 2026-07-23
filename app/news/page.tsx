import type { Metadata } from "next";
import Link from "next/link";
import { UiIcon } from "../components/SiteShell";
import { newsItems, socials } from "../generated-content";

export const metadata:Metadata={title:"Новости СМП МАРКО",description:"Новости компании, новые объекты, монтажи и технические материалы СМП МАРКО."};

export default function NewsPage(){const max=SocialLink("MAX");return <main id="top"><section className="page-hero"><div className="container"><div className="breadcrumbs"><Link href="/">Главная</Link><span>—</span>Новости</div><div className="page-hero-grid"><h1>Новости компании</h1><p>Новые объекты, монтажи, разработки и события СМП МАРКО.</p></div></div></section><section className="section"><div className="container"><div className="news-grid news-page-grid">{newsItems.map((item)=><Link key={item.title} href={`/news/${item.slug}`}><small>{item.date}</small><h2>{item.title}</h2><p>{item.excerpt}</p><b>Подробнее <UiIcon name="arrow" size={18}/></b></Link>)}</div><div className="news-channel"><div><div className="section-index">Официальный канал</div><h2>Больше публикаций в MAX</h2><p>Подписывайтесь на публичный канал СМП МАРКО, чтобы первыми видеть новости компании и материалы с объектов.</p></div>{max&&<a className="button" href={max.href} target="_blank" rel="noreferrer">Открыть канал MAX <UiIcon name="arrow"/></a>}</div></div></section></main>}

function SocialLink(name:string){return socials.find((social)=>social.name===name)}
