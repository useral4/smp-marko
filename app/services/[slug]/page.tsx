import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadButton, UiIcon } from "../../components/SiteShell";
import { readArticles, readProjects, readServices } from "../../../lib/runtime-content";
import { serviceDetails } from "../../../lib/service-details";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = (await readServices()).find((item) => item.slug === slug);
  return {
    title: service ? service.seoTitle || `${service.title} — СМП МАРКО` : "Услуга — СМП МАРКО",
    description: service?.seoDescription || service?.short,
    alternates: service ? { canonical: `/services/${service.slug}` } : undefined,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [services, articles, projects] = await Promise.all([readServices(), readArticles(), readProjects()]);
  const service = services.find((item) => item.slug === slug);
  if (!service) notFound();
  const detail = serviceDetails[slug];
  const relatedArticles = detail ? detail.articleSlugs.map((articleSlug) => articles.find((item) => item.slug === articleSlug)).filter((item) => Boolean(item)) : [];
  const relatedServices = services.filter((item) => item.slug !== slug).slice(0, 3);
  const faqSchema = detail ? {"@context":"https://schema.org","@type":"FAQPage",mainEntity:detail.faq.map((item)=>({"@type":"Question",name:item.question,acceptedAnswer:{"@type":"Answer",text:item.answer}}))} : null;

  return (
    <main id="top">
      <section className="detail-hero">
        <div className="container detail-grid">
          <div>
            <div className="breadcrumbs">
              <Link href="/">Главная</Link>
              <span>—</span>
              <Link href="/services">Услуги</Link>
            </div>
            <div className="section-index">Услуга СМП МАРКО</div>
            <h1>{service.title}</h1>
            <p>{service.lead}</p>
            <LeadButton>
              Обсудить проект <UiIcon name="arrow" />
            </LeadButton>
          </div>
          <div className="detail-image">
            <Image
              src={service.image}
              alt={service.title}
              fill
              priority
              sizes="50vw"
            />
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container detail-content">
          <div>
            <div className="section-index">Что входит</div>
            <h2>Последовательная работа с понятным результатом</h2>
          </div>
          <ol>
            {service.bullets.map((bullet, index) => (
              <li key={bullet}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <b>{bullet}</b>
              </li>
            ))}
          </ol>
        </div>
      </section>
      {service.body.length > 0 && <section className="section service-seo-content"><div className="container"><div className="section-index">Подробнее об услуге</div><h2>{service.title}: порядок работ и результат</h2>{service.image2 && <div className="service-seo-image"><Image src={service.image2} alt={`${service.title} — пример конструкции`} fill sizes="(max-width:900px) 100vw,1180px"/></div>}<div className="service-seo-columns">{service.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div></div></section>}
      {detail && <><section className="section service-commercial"><div className="container"><div className="section-head"><div><div className="section-index">Результат и стоимость</div><h2>Что получает заказчик</h2></div><p>Состав предложения фиксируется до начала работ. Цена рассчитывается по исходным данным конкретного объекта.</p></div><div className="service-commercial-grid"><div><h3>В результате</h3><ul>{detail.result.map((item)=><li key={item}><UiIcon name="check" size={18}/><span>{item}</span></li>)}</ul></div><div><h3>Что влияет на цену</h3><ul>{detail.priceFactors.map((item)=><li key={item}><UiIcon name="arrow" size={18}/><span>{item}</span></li>)}</ul></div></div></div></section><section className="section service-faq"><div className="container"><div className="section-index">Ответы инженера</div><h2>Частые вопросы</h2><div className="service-faq-list">{detail.faq.map((item,index)=><details key={item.question} open={index===0}><summary>{item.question}<span>+</span></summary><p>{item.answer}</p></details>)}</div></div></section></>}
      <section className="section service-related"><div className="container"><div className="section-head"><div><div className="section-index">Полезные материалы</div><h2>По теме услуги</h2></div><Link className="text-link" href="/articles">Все статьи <UiIcon name="arrow" size={18}/></Link></div><div className="service-related-grid">{relatedArticles.map((article)=><Link href={`/articles/${article!.slug}`} key={article!.slug}><small>{article!.tag}</small><h3>{article!.title}</h3><span>Читать статью <UiIcon name="arrow" size={16}/></span></Link>)}</div><div className="service-related-links"><b>Связанные разделы:</b>{relatedServices.map((item)=><Link href={`/services/${item.slug}`} key={item.slug}>{item.title}</Link>)}{projects.length>0&&<Link href="/objects">Реализованные объекты</Link>}<Link href="/prices">Цены и характеристики</Link></div></div></section>
      <section className="section detail-next">
        <div className="container">
          <div>
            <div className="section-index light">Следующий шаг</div>
            <h2>Получите расчёт под ваш объект</h2>
          </div>
          <LeadButton>
            Оставить заявку <UiIcon name="arrow" />
          </LeadButton>
        </div>
      </section>
      {faqSchema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(faqSchema).replace(/</g,"\\u003c")}}/>}
    </main>
  );
}
