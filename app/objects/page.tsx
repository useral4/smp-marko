import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import ObjectsMap from "../components/ObjectsMap";
import { LeadButton, UiIcon } from "../components/SiteShell";

export const metadata: Metadata = {
  title: "Объекты СМП МАРКО",
  description: "Карта и карточки реализованных объектов со сборно-монолитными перекрытиями МАРКО.",
};

const projects = [
  {
    title: "Реконструкция на Невском проспекте",
    description: "Монтаж нового перекрытия поверх существующих конструкций.",
    location: "Санкт-Петербург, Невский проспект, 12",
    image: "/objects/nevsky-reconstruction.webp",
    source: "https://smp-marko.com/montazh2",
  },
  {
    title: "Перекрытие МАРКО — Балаев блок",
    description: "Сборно-монолитное перекрытие для объекта нового строительства.",
    location: "Новое строительство",
    image: "/objects/balaev-house.webp",
    source: "https://smp-marko.com/balaev",
  },
  {
    title: "Монтаж перекрытия МАРКО-ТЕРМО",
    description: "Монтаж несущих балок и элементов системы МАРКО-ТЕРМО.",
    location: "Новое строительство",
    image: "/objects/marko-termo.webp",
    source: "https://smp-marko.com/montazh",
  },
  {
    title: "Консоль, второй свет и лестничный проём",
    description: "Перекрытие сложной геометрии с консолью и проёмами.",
    location: "Октябрьский, Краснодарский край, ул. Парадная, 43",
    image: "/objects/krasnodar-console.webp",
    source: "https://smp-marko.com/konsol",
  },
  {
    title: "Монтажная схема перекрытия",
    description: "Проектная схема раскладки элементов перекрытия МАРКО.",
    location: "Санкт-Петербург, ул. Исполкомская, 2",
    image: "/objects/ispolkomskaya-scheme.webp",
    source: "https://smp-marko.com/shemamarko",
  },
];

export default function ObjectsPage() {
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

    <section className="objects-map-section map-page-section">
      <div className="container map-heading">
        <div><h2>География работ</h2></div>
        <p>Приближайте карту и открывайте метки объектов.</p>
      </div>
      <div className="map-frame"><ObjectsMap /></div>
    </section>

    <section className="section object-projects">
      <div className="container">
        <div className="section-head">
          <div><h2>Примеры выполненных работ</h2></div>
          <p>Реальные фотографии, монтажные решения и адреса объектов.</p>
        </div>
        <div className="object-project-grid">
          {projects.map((project, index) => <a
            className={`object-project-card ${index === 0 ? "object-project-featured" : ""}`}
            href={project.source}
            key={project.title}
            target="_blank"
            rel="noreferrer"
          >
            <div className="object-project-image">
              <Image src={project.image} alt={project.title} fill sizes={index === 0 ? "(max-width:900px) 100vw,58vw" : "(max-width:900px) 100vw,50vw"} />
            </div>
            <div className="object-project-body">
              <span>{index === 0 ? "Реконструкция" : "Новое строительство"}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <small>{project.location}</small>
              <b>Подробнее об объекте <UiIcon name="arrow" size={18} /></b>
            </div>
          </a>)}
        </div>
      </div>
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
