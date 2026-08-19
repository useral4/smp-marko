import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadButton, UiIcon } from "../../components/SiteShell";
import { readServices } from "../../../lib/runtime-content";

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
  const service = (await readServices()).find((item) => item.slug === slug);
  if (!service) notFound();

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
    </main>
  );
}
