import type { Metadata } from "next";
import Link from "next/link";
import { LeadButton, UiIcon } from "../components/SiteShell";
import {
  pageText,
  readDocuments,
  readPage,
} from "../../lib/runtime-content";
import { pageThemeStyle } from "../../lib/page-builder";

export const metadata: Metadata = {
  title: "Проектировщикам и конструкторам — СМП МАРКО",
  description:
    "BIM-модели, сертификаты, протоколы испытаний, технические материалы и инструкция по монтажу перекрытий МАРКО.",
};

export default async function DesignersPage() {
  const [page, documents] = await Promise.all([
    readPage("designers"),
    readDocuments(),
  ]);

  return (
    <main id="top" className="page-managed" style={pageThemeStyle(page)}>
      <section className="page-hero designers-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Главная</Link>
            <span>—</span>
            <Link href="/technology">Технология</Link>
            <span>—</span>
            Проектировщикам
          </div>
          <div className="page-hero-grid">
            <h1>
              {pageText(
                page,
                "heading",
                "Конструкторам и проектировщикам",
              )}
            </h1>
            <p>
              {pageText(
                page,
                "lead",
                "Исходные данные для расчёта, BIM-модель, протоколы испытаний и материалы для разработки проектной документации.",
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="section designer-basics">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-index">Исходные параметры</div>
              <h2>
                {pageText(page, "basicsHeading", "Система в проекте")}
              </h2>
            </div>
            <p>
              {pageText(
                page,
                "basicsText",
                "Типоразмер и узлы опирания выбираются по расчёту с учётом схемы здания и нагрузок.",
              )}
            </p>
          </div>
          <div className="designer-stats">
            <div>
              <strong>150–300 мм</strong>
              <span>четыре типоразмера</span>
            </div>
            <div>
              <strong>750 мм</strong>
              <span>типовой шаг балок</span>
            </div>
            <div>
              <strong>от B20</strong>
              <span>класс бетона</span>
            </div>
            <div>
              <strong>от 400 кг/м²</strong>
              <span>несущая способность</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section documents-section">
        <div className="container">
          <div className="section-head">
            <div>
              <div className="section-index light">Документы</div>
              <h2>
                {pageText(
                  page,
                  "documentsHeading",
                  "Техническая библиотека",
                )}
              </h2>
            </div>
            <p>
              {pageText(
                page,
                "documentsText",
                "BIM-модели, сертификаты, протоколы испытаний, альбомы решений и инструкции по монтажу.",
              )}
            </p>
          </div>
          <div className="document-grid">
            {documents.map((document) => (
              <a
                href={document.href}
                key={document.slug}
                target={document.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  document.href.startsWith("http") ? "noreferrer" : undefined
                }
              >
                <small>{document.category}</small>
                <h3>{document.title}</h3>
                <p>{document.note}</p>
                <b>
                  Открыть <UiIcon name="arrow" size={18} />
                </b>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section designer-request">
        <div className="container section-grid">
          <div>
            <div className="section-index">Инженерное сопровождение</div>
            <h2>
              {pageText(
                page,
                "requestHeading",
                "Запросите альбом решений и консультацию",
              )}
            </h2>
          </div>
          <div className="intro-content">
            <p className="lead">
              {pageText(
                page,
                "requestText",
                "Передайте планы, расчётные нагрузки и материал несущих стен. Инженер поможет подобрать схему и подготовить исходные данные.",
              )}
            </p>
            <LeadButton>
              {pageText(
                page,
                "requestButton",
                "Связаться с техническим специалистом",
              )}{" "}
              <UiIcon name="arrow" />
            </LeadButton>
          </div>
        </div>
      </section>
    </main>
  );
}
