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
    title: service ? `${service.title} — СМП МАРКО` : "Услуга — СМП МАРКО",
    description: service?.short,
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
