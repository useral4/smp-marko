import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LeadButton, UiIcon } from "../components/SiteShell";
import {
  pageStrings,
  pageText,
  readPage,
} from "../../lib/runtime-content";

export const metadata: Metadata = {
  title: "Технология перекрытий МАРКО",
  description:
    "Устройство, преимущества и проектные материалы сборно-монолитной системы МАРКО.",
};

const montageImages = [
  {
    src: "/archive/ring-beam-layout.jpg",
    title: "Опорный пояс",
    text: "Подготовка стен и армирование опорного контура.",
  },
  {
    src: "/archive/ring-beam-detail.jpg",
    title: "Узел армирования",
    text: "Связь перекрытия с наружными и внутренними стенами.",
  },
  {
    src: "/archive/reinforcement-mesh-stage.jpg",
    title: "Арматурная сетка",
    text: "Подготовка системы к бетонированию.",
  },
  {
    src: "/archive/slab-formwork-stage.jpg",
    title: "Собранное перекрытие",
    text: "Временные опоры сохраняются до набора прочности бетона.",
  },
];

const defaultSystemItems = [
  "Стальные профильные балки с арматурным каркасом",
  "Стеновые или перегородочные блоки из газобетона",
  "Арматурная сетка с ячейкой 100×100 мм",
  "Слой монолитного бетона не ниже B20",
];

export default async function TechnologyPage() {
  const page = await readPage("technology");
  const systemItems = pageStrings(page, "systemItems", defaultSystemItems);

  return (
    <main id="top">
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Главная</Link>
            <span>—</span>
            Технология
          </div>
          <div className="page-hero-grid">
            <h1>{pageText(page, "heading", "Как устроено перекрытие МАРКО")}</h1>
            <p>
              {pageText(
                page,
                "lead",
                "Стальные балки, лёгкие газобетонные блоки, арматурная сетка и монолитный бетон работают как единая конструкция.",
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="section tech-scheme">
        <div className="container tech-scheme-grid">
          <div className="scheme-image">
            <Image
              src="/archive/marko-beam-detail.jpg"
              alt="Несущая балка перекрытия МАРКО"
              fill
              sizes="60vw"
            />
          </div>
          <div>
            <div className="section-index">Состав системы</div>
            <h2>
              {pageText(
                page,
                "systemHeading",
                "Прочность монолита при меньшем весе",
              )}
            </h2>
            <ul>
              {systemItems.map((item, index) => (
                <li key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section montage-gallery">
        <div className="container">
          <div className="section-head">
            <div>
              <h2>
                {pageText(page, "galleryHeading", "Монтаж в деталях")}
              </h2>
            </div>
            <p>
              {pageText(
                page,
                "galleryText",
                "Последовательность устройства сборно-монолитного перекрытия — от опорного пояса до готовой плиты.",
              )}
            </p>
          </div>
          <div className="montage-grid">
            {montageImages.map((item, index) => (
              <article
                key={item.src}
                className={index === 0 ? "montage-wide" : ""}
              >
                <div>
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    sizes={
                      index === 0
                        ? "(max-width:900px) 100vw, 66vw"
                        : "(max-width:900px) 100vw, 33vw"
                    }
                  />
                </div>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section slab-section">
        <div className="container slab-section-grid">
          <div>
            <Image
              src="/archive/marko-slab-section-b.jpg"
              alt="Разрез сборно-монолитного перекрытия МАРКО"
              fill
              sizes="(max-width:900px) 100vw,55vw"
            />
          </div>
          <div>
            <h2>
              {pageText(page, "slabHeading", "Все элементы работают вместе")}
            </h2>
            <p>
              {pageText(
                page,
                "slabText",
                "После бетонирования балки, блоки, арматурная сетка и бетон образуют единую несущую конструкцию.",
              )}
            </p>
            <Link className="text-link" href="/prices">
              Сравнить типы перекрытий <UiIcon name="arrow" size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section className="section tech-benefits">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-index light">Преимущества</div>
              <h2>
                {pageText(
                  page,
                  "benefitsHeading",
                  "Подходит для сложных задач",
                )}
              </h2>
            </div>
          </div>
          <div className="benefit-cards">
            <div>
              <b>Без крана</b>
              <p>Элементы подаются и собираются вручную.</p>
            </div>
            <div>
              <b>Большие пролёты</b>
              <p>До 9,25 м для типовых систем, по инженерному расчёту.</p>
            </div>
            <div>
              <b>Меньше бетона</b>
              <p>Сокращение расхода по сравнению со сплошной плитой.</p>
            </div>
            <div>
              <b>Любая геометрия</b>
              <p>Эркеры, проёмы, консоли и второй свет.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section technology-designers">
        <div className="container designer-callout">
          <div>
            <div className="section-index">Для специалистов</div>
            <h2>
              {pageText(
                page,
                "designersHeading",
                "Раздел для конструкторов и проектировщиков",
              )}
            </h2>
            <p>
              {pageText(
                page,
                "designersText",
                "BIM-модель, исходные параметры, сертификаты, протоколы испытаний, альбомы решений и инструкция по монтажу — в одном месте.",
              )}
            </p>
            <div className="designer-tags">
              <span>BIM / Revit</span>
              <span>Сертификаты</span>
              <span>Альбом решений</span>
              <span>Протоколы</span>
              <span>Монтаж</span>
            </div>
          </div>
          <Link className="button" href="/designers">
            {pageText(
              page,
              "designersButton",
              "Открыть технический раздел",
            )}{" "}
            <UiIcon name="arrow" />
          </Link>
        </div>
      </section>

      <section className="section compact-cta">
        <div className="container">
          <h2>
            {pageText(
              page,
              "ctaHeading",
              "Подберём систему под ваш проект",
            )}
          </h2>
          <LeadButton>
            {pageText(page, "ctaButton", "Отправить план перекрытия")}{" "}
            <UiIcon name="arrow" />
          </LeadButton>
        </div>
      </section>
    </main>
  );
}
