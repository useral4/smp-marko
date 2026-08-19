import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { UiIcon } from "../components/SiteShell";
import { readArticles } from "../../lib/runtime-content";

export const metadata:Metadata={title:"Статьи о перекрытиях МАРКО",description:"Практические материалы о проектировании, монтаже и реконструкции сборно-монолитных перекрытий.",alternates:{canonical:"/articles"}};

export default async function ArticlesPage(){const articles=await readArticles();return <main id="top"><section className="page-hero"><div className="container"><div className="breadcrumbs"><Link href="/">Главная</Link><span>—</span>Статьи</div><div className="page-hero-grid"><h1>Статьи о перекрытиях</h1><p>Практические материалы СМП МАРКО для заказчиков, строителей, конструкторов и проектировщиков.</p></div></div></section><section className="section"><div className="container article-grid">{articles.map((article,index)=><Link href={`/articles/${article.slug}`} key={article.title}>{article.image&&<div className="article-card-image"><Image src={article.image} alt="" fill sizes="(max-width:600px) 100vw,(max-width:900px) 50vw,33vw"/></div>}<div className="article-card-body"><span>0{index+1}</span><small>{article.tag}</small><h2>{article.title}</h2><p>{article.excerpt}</p><b>Читать статью <UiIcon name="arrow" size={18}/></b></div></Link>)}</div></section></main>}
