import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ObjectsMap from "../components/ObjectsMap";
import { LeadButton, UiIcon } from "../components/SiteShell";
import { readProjects } from "../../lib/runtime-content";

export const metadata: Metadata = {
  title: "Объекты СМП МАРКО",
  description: "Карта и карточки реализованных объектов со сборно-монолитными перекрытиями МАРКО.",
};

export default async function ObjectsPage() {
  const cmsProjects = await readProjects();
  return <main id="top">
    <section className="page-hero">
      <div className="container">
        <div className="breadcrumbs"><Link href="/">Главная</Link><span>—</span>Объекты</div>
        <div className="page-hero-grid">
          <h1>Реализованные объекты</h1>
          <p>Монтажи, реконструкции и проектные решения с применением сборно-монолитных перекрытий МАРКО.</p>
        </div>
      </div>
    </section>

    <section className="section object-projects">
      <div className="container">
        <div className="section-head">
          <div><h2>Примеры выполненных работ</h2></div>
          <p>Реальные фотографии, монтажные решения и адреса объектов.</p>
        </div>
        <div className="object-project-grid">
          {cmsProjects.map((project) => <a
            className={`object-project-card ${project.featured ? "object-project-featured" : ""}`}
            href={`/objects/${project.slug}`}
            key={project.title}
          >
            <div className="object-project-image">
              <Image src={project.image} alt={project.title} fill sizes={project.featured ? "(max-width:900px) 100vw,58vw" : "(max-width:900px) 100vw,50vw"} />
            </div>
            <div className="object-project-body">
              <span>{project.category}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <small>{project.location}</small>
              {(project.area || project.system || project.year) && <dl className="object-project-meta">
                {project.area && <div><dt>Площадь</dt><dd>{project.area}</dd></div>}
                {project.system && <div><dt>Система</dt><dd>{project.system}</dd></div>}
                {project.year && <div><dt>Год</dt><dd>{project.year}</dd></div>}
              </dl>}
              <b>Подробнее об объекте <UiIcon name="arrow" size={18} /></b>
            </div>
          </a>)}
        </div>
      </div>
    </section>

    <section className="objects-map-section map-page-section">
      <div className="container map-heading">
        <div><h2>География работ</h2></div>
        <p>Приближайте карту и открывайте метки объектов.</p>
      </div>
      <div className="map-frame"><ObjectsMap projects={cmsProjects} /></div>
    </section>

    <section className="section compact-cta">
      <div className="container">
        <div>
          <div className="eyebrow"><span />Есть похожая задача?</div>
          <h2>Покажем подходящие решения<br />и подготовим расчёт</h2>
        </div>
        <LeadButton>Отправить план объекта <UiIcon name="arrow" /></LeadButton>
      </div>
    </section>
  </main>;
}
