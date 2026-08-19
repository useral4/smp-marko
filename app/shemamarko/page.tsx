import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LeadButton, UiIcon } from "../components/SiteShell";

export const metadata: Metadata = {
  title: "Заказать разработку монтажной схемы перекрытия МАРКО бесплатно",
  description:
    "Получите профессиональную монтажную схему перекрытия МАРКО бесплатно. Правильный и безопасный монтаж с учётом особенностей вашего проекта.",
};

const gallery = ["/shemamarko/02.png", "/shemamarko/03.png", "/shemamarko/04.png", "/shemamarko/05.png"];

export default function ShemaMarkoPage() {
  return (
    <main id="top">
      <section className="object-detail-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Главная</Link><span>—</span><span>Монтажная схема перекрытия</span>
          </div>
          <div className="object-detail-heading">
            <div>
              <small>Проектирование</small>
              <h1>Монтажная схема перекрытия МАРКО</h1>
              <p>
                Выполним расчёт и подготовим чертежи по исходным данным вашего
                объекта до начала монтажа перекрытия.
              </p>
              <LeadButton>Заказать схему бесплатно <UiIcon name="arrow" /></LeadButton>
            </div>
            <div className="object-detail-main-image">
              <Image
                src="/shemamarko/01.jpg"
                alt="Монтажная схема перекрытия МАРКО"
                fill
                priority
                sizes="(max-width: 900px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section object-detail-content">
        <div className="container section-grid">
          <div>
            <div className="section-index">Перед монтажом</div>
            <h2>Расчёт и рабочие чертежи</h2>
          </div>
          <div className="custom-template-copy">
            <p>
              Прежде чем приступить к монтажу перекрытия МАРКО, необходимо
              выполнить расчёт и разработать чертежи по исходным данным объекта.
              Схема определяет раскладку балок и блоков, расположение проёмов,
              опирание элементов и узлы армирования.
            </p>
            <p>
              Минимальная полезная нагрузка на перекрытие МАРКО составляет
              400 кг/м². Несущую способность можно увеличить — окончательные
              параметры зависят от требований проекта и расчётных нагрузок.
            </p>
          </div>
        </div>
      </section>

      <section className="section object-detail-content">
        <div className="container section-grid">
          <div>
            <div className="section-index">Срок и стоимость</div>
            <h2>Схема за 24 часа — бесплатно</h2>
          </div>
          <div className="custom-template-copy">
            <p>
              Монтажная схема разрабатывается в течение 24 часов после получения
              корректных исходных данных по объекту строительства. Разработка
              монтажной схемы перекрытия МАРКО выполняется бесплатно.
            </p>
            <p>
              Для начала работы передайте планы, размеры пролётов, материал стен,
              расположение лестниц и инженерных проёмов, а также предполагаемые
              нагрузки на перекрытие.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><div className="section-index">Примеры</div><h2>Монтажные схемы и чертежи</h2></div>
          </div>
          <div className="object-detail-gallery">
            {gallery.map((src, index) => (
              <div key={src}>
                <Image
                  src={src}
                  alt={`Монтажная схема перекрытия МАРКО, лист ${index + 1}`}
                  fill
                  sizes="(max-width: 700px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section compact-cta">
        <div className="container">
          <div><div className="eyebrow"><span />Есть планы объекта?</div><h2>Подготовим монтажную схему<br />в течение одного дня</h2></div>
          <LeadButton>Отправить исходные данные <UiIcon name="arrow" /></LeadButton>
        </div>
      </section>
    </main>
  );
}
