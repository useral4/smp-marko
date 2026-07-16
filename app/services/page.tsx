import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { UiIcon } from "../components/SiteShell";
import { services } from "../data";

export const metadata: Metadata = { title: "Услуги — СМП МАРКО Москва", description: "Проектирование, производство, монтаж и реконструкция перекрытий МАРКО." };

export default function ServicesPage(){return <main id="top"><section className="page-hero"><div className="container"><div className="breadcrumbs"><Link href="/">Главная</Link><span>—</span>Услуги</div><div className="page-hero-grid"><h1>Услуги полного цикла</h1><p>От монтажной схемы до готового перекрытия. Выберите отдельный этап или доверьте нам весь комплекс работ.</p></div></div></section><section className="section"><div className="container mp-service-grid">{services.map((s,i)=><Link href={`/services/${s.slug}`} className="mp-service-card" key={s.slug}><div className="mp-service-img"><Image src={s.image} alt={s.title} fill sizes="(max-width:800px) 100vw,50vw"/></div><div className="mp-service-body"><span>0{i+1}</span><h2>{s.title}</h2><p>{s.short}</p><b>Подробнее <UiIcon name="arrow"/></b></div></Link>)}</div></section></main>}
