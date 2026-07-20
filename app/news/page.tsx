import type { Metadata } from "next";
import Link from "next/link";
import { UiIcon } from "../components/SiteShell";
import { newsItems, socials } from "../data";

export const metadata:Metadata={title:"Новости СМП МАРКО",description:"Новости компании, новые объекты, монтажи и технические материалы СМП МАРКО."};

export default function NewsPage(){const max=SocialLink("MAX");return <main id="top"><section className="page-hero"><div className="container"><div className="breadcrumbs"><Link href="/">Главная</Link><span>—</span>Новости</div><div className="page-hero-grid"><h1>Новости компании</h1><p>Новые объекты, монтажи, технические решения и обновления СМП МАРКО.</p></div></div></section><section className="section"><div className="container"><div className="news-grid news-page-grid">{newsItems.map((item)=><a key={item.title} href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined} rel={item.href.startsWith("http") ? "noreferrer" : undefined}><small>{item.date}</small><h2>{item.title}</h2><p>{item.excerpt}</p><b>Подробнее <UiIcon name="arrow" size={18}/></b></a>)}</div><div className="news-channel"><div><div className="section-index">Официальный канал</div><h2>Больше публикаций в MAX</h2><p>Пока новости добавляются в каталог вручную. Автоматическую синхронизацию можно подключить после получения доступа к каналу и API.</p></div>{max&&<a className="button" href={max.href} target="_blank" rel="noreferrer">Открыть канал MAX <UiIcon name="arrow"/></a>}</div></div></section></main>}

function SocialLink(name:string){return socials.find((social)=>social.name===name)}
