import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { UiIcon } from "../components/SiteShell";
import { pageText, readPage, readServices } from "../../lib/runtime-content";
import { pageThemeStyle } from "../../lib/page-builder";

export const metadata: Metadata = {
  title: "Услуги — СМП МАРКО Москва",
  description:
    "Проектирование, производство, монтаж и реконструкция перекрытий МАРКО.",
};

export default async function ServicesPage() {
  const [services, page] = await Promise.all([
    readServices(),
    readPage("services"),
  ]);

  return (
    <main id="top" className="page-managed" style={pageThemeStyle(page)}>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Главная</Link>
            <span>—</span>
            Услуги
          </div>
          <div className="page-hero-grid">
            <h1>{pageText(page, "heading", "Услуги полного цикла")}</h1>
            <p>
              {pageText(
                page,
                "lead",
                "От монтажной схемы до готового перекрытия. Выберите отдельный этап или доверьте нам весь комплекс работ.",
              )}
            </p>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container mp-service-grid">
          {services.map((service, index) => (
            <Link
              href={`/services/${service.slug}`}
              className="mp-service-card"
              key={service.slug}
            >
              <div className="mp-service-img">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width:800px) 100vw,50vw"
                />
              </div>
              <div className="mp-service-body">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h2>{service.title}</h2>
                <p>{service.short}</p>
                <b>
                  Подробнее <UiIcon name="arrow" />
                </b>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
