import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadButton, UiIcon } from "../../components/SiteShell";
import { projects } from "../../generated-content";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return {
    title: project ? `${project.title} — СМП МАРКО` : "Объект — СМП МАРКО",
    description: project?.description,
  };
}

export default async function ObjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  const facts = [
    ["Площадь", project.area],
    ["Система", project.system],
    ["Год", project.year],
    ["Место", project.location],
  ].filter((fact): fact is [string, string] => Boolean(fact[1]));

  return <main id="top">
    <section className="object-detail-hero">
      <div className="container">
        <div className="breadcrumbs">
          <Link href="/">Главная</Link><span>—</span><Link href="/objects">Объекты</Link>
        </div>
        <div className="object-detail-heading">
          <div>
            <small>{project.category}</small>
            <h1>{project.title}</h1>
            <p>{project.description}</p>
          </div>
          <div className="object-detail-main-image">
            <Image src={project.image} alt={project.title} fill priority sizes="(max-width:900px) 100vw,50vw" />
          </div>
        </div>
      </div>
    </section>

    <section className="section object-detail-content">
      <div className="container">
        {facts.length > 0 && <dl className="object-detail-facts">
          {facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        </dl>}

        {project.gallery.length > 0 && <div className="object-detail-gallery">
          {project.gallery.map((image, index) => <div key={image}>
            <Image src={image} alt={`${project.title}, фото ${index + 1}`} fill sizes="(max-width:700px) 100vw,50vw" />
          </div>)}
        </div>}

        {project.source && <a className="source-link" href={project.source} target="_blank" rel="noreferrer">
          Дополнительные материалы об объекте <UiIcon name="arrow" size={17} />
        </a>}
      </div>
    </section>

    <section className="section compact-cta">
      <div className="container">
        <div>
          <div className="eyebrow"><span />Есть похожая задача?</div>
          <h2>Отправьте план объекта<br />для расчёта инженером</h2>
        </div>
        <LeadButton>Получить расчёт <UiIcon name="arrow" /></LeadButton>
      </div>
    </section>
  </main>;
}
