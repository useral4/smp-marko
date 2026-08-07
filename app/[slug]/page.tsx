import { notFound } from "next/navigation";
import { pageThemeStyle } from "../../lib/page-builder";
import { pageText, readPage } from "../../lib/runtime-content";
import { LeadButton, UiIcon } from "../components/SiteShell";

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await readPage(slug);
  if (!page || page.template !== "custom" || page.route !== `/${slug}`) notFound();

  return <main id="top" className="page-managed custom-template-page" style={pageThemeStyle(page)}>
    <section className="page-hero">
      <div className="container page-hero-grid">
        <div>
          <div className="breadcrumbs"><a href="/">Главная</a><span>—</span><span>{pageText(page, "title", "Страница")}</span></div>
          <h1>{pageText(page, "heading", pageText(page, "title", "Новая страница"))}</h1>
        </div>
        <p>{pageText(page, "lead", "Добавьте описание страницы в редакторе.")}</p>
      </div>
    </section>
    <section className="section custom-template-intro">
      <div className="container section-grid">
        <div><div className="section-index">Информация</div><h2>{pageText(page, "bodyHeading", "О странице")}</h2></div>
        <div className="custom-template-copy">
          <p>{pageText(page, "bodyText", "Добавьте основной текст страницы.")}</p>
          <LeadButton>{pageText(page, "buttonText", "Получить консультацию")} <UiIcon name="arrow" /></LeadButton>
        </div>
      </div>
    </section>
  </main>;
}
