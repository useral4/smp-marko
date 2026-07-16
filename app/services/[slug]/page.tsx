import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadButton, UiIcon } from "../../components/SiteShell";
import { services } from "../../data";

export function generateStaticParams(){return services.map(s=>({slug:s.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const s=services.find(x=>x.slug===slug);return {title:s?`${s.title} — СМП МАРКО`:"Услуга — СМП МАРКО",description:s?.short}}

export default async function ServicePage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const s=services.find(x=>x.slug===slug);if(!s)notFound();return <main id="top"><section className="detail-hero"><div className="container detail-grid"><div><div className="breadcrumbs"><Link href="/">Главная</Link><span>—</span><Link href="/services">Услуги</Link></div><div className="section-index">Услуга СМП МАРКО</div><h1>{s.title}</h1><p>{s.lead}</p><LeadButton>Обсудить проект <UiIcon name="arrow"/></LeadButton></div><div className="detail-image"><Image src={s.image} alt={s.title} fill priority sizes="50vw"/></div></div></section><section className="section"><div className="container detail-content"><div><div className="section-index">Что входит</div><h2>Последовательная работа с понятным результатом</h2></div><ol>{s.bullets.map((b,i)=><li key={b}><span>0{i+1}</span><b>{b}</b></li>)}</ol></div></section><section className="section detail-next"><div className="container"><div><div className="section-index light">Следующий шаг</div><h2>Получите расчёт под ваш объект</h2></div><LeadButton>Оставить заявку <UiIcon name="arrow"/></LeadButton></div></section></main>}
