import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LeadButton, UiIcon } from "../components/SiteShell";

export const metadata: Metadata = {
  title: "Устройство сборно-монолитного перекрытия МАРКО в Москве и СПб",
  description:
    "Монтаж СМП МАРКО-ГЛАВСТРОЙБЛОК 200 с консолью, вторым светом и лестничным проёмом на объекте в Краснодарском крае.",
};

const gallery = Array.from({ length: 5 }, (_, index) =>
  `/konsol/${String(index + 2).padStart(2, "0")}.png`,
);

export default function KonsolPage() {
  return (
    <main id="top">
      <section className="object-detail-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Главная</Link><span>—</span><span>Консоль, второй свет и лестничный проём</span>
          </div>
          <div className="object-detail-heading">
            <div>
              <small>Реализованный объект</small>
              <h1>Консоль, второй свет, лестничный проём</h1>
              <p>
                Устройство сборно-монолитного перекрытия МАРКО сложной геометрии
                на объекте в Краснодарском крае.
              </p>
              <LeadButton>Рассчитать стоимость <UiIcon name="arrow" /></LeadButton>
            </div>
            <div className="object-detail-main-image">
              <Image
                src="/konsol/01.png"
                alt="Перекрытие МАРКО с консолью и вторым светом"
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
            <div className="section-index">Задача</div>
            <h2>СМП МАРКО-ГЛАВСТРОЙБЛОК 200</h2>
          </div>
          <div className="custom-template-copy">
            <p>
              Требовалось выполнить сборно-монолитное перекрытие с консольным
              участком, зоной второго света и проёмом под лестницу. Сложная
              геометрия была учтена в монтажной схеме и раскладке несущих балок.
            </p>
            <p>
              Адрес объекта: ул. Парадная, 43, Октябрьский, Краснодарский край,
              Россия, 35032.
            </p>
          </div>
        </div>
      </section>

      <section className="section object-detail-content">
        <div className="container section-grid">
          <div>
            <div className="section-index">Решение</div>
            <h2>Свободная планировка без типовых ограничений</h2>
          </div>
          <div className="custom-template-copy">
            <p>
              Балки и блоки заполнения разместили с учётом консоли и проёмов,
              после чего конструкцию армировали и подготовили к бетонированию.
              Система МАРКО позволила собрать перекрытие сложной формы без
              применения тяжёлой подъёмной техники.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><div className="section-index">Фотогалерея</div><h2>Перекрытие сложной геометрии</h2></div>
          </div>
          <div className="object-detail-gallery">
            {gallery.map((src, index) => (
              <div key={src}>
                <Image
                  src={src}
                  alt={`Монтаж перекрытия МАРКО с консолью, фото ${index + 1}`}
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
          <div><div className="eyebrow"><span />Сложная геометрия?</div><h2>Подготовим монтажную схему<br />под ваш объект</h2></div>
          <LeadButton>Получить расчёт <UiIcon name="arrow" /></LeadButton>
        </div>
      </section>
    </main>
  );
}
