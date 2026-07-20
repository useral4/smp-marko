import type { Metadata } from "next";
import Link from "next/link";
import { UiIcon } from "../components/SiteShell";
import { articles } from "../data";

export const metadata:Metadata={title:"Статьи о перекрытиях МАРКО",description:"Практические материалы о проектировании, монтаже и реконструкции сборно-монолитных перекрытий."};

export default function ArticlesPage(){return <main id="top"><section className="page-hero"><div className="container"><div className="breadcrumbs"><Link href="/">Главная</Link><span>—</span>Статьи</div><div className="page-hero-grid"><h1>Статьи о перекрытиях</h1><p>Материалы для заказчиков, строителей и проектировщиков. Новая статья добавляется одной записью в каталоге контента.</p></div></div></section><section className="section"><div className="container article-grid">{articles.map((article,index)=><a href={article.href} target="_blank" rel="noreferrer" key={article.title}><span>0{index+1}</span><small>{article.tag}</small><h2>{article.title}</h2><p>{article.excerpt}</p><b>Читать статью <UiIcon name="arrow" size={18}/></b></a>)}</div></section></main>}
