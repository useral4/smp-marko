import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LeadButton, UiIcon } from "../components/SiteShell";

export const metadata: Metadata = {
  title: "Монтаж теплоэффективного перекрытия МАРКО-ТЕРМО. Тепло и выгодно!",
  description:
    "Монтаж теплоэффективного перекрытия МАРКО-ТЕРМО на ленточный фундамент быстро и качественно. Узнайте, как сделать дом теплее и экономичнее.",
};

const gallery = Array.from({ length: 6 }, (_, index) =>
  `/montazh/${String(index + 2).padStart(2, "0")}.png`,
);

export default function MontazhPage() {
  return (
    <main id="top">
      <section className="object-detail-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Главная</Link><span>—</span><span>Монтаж перекрытия МАРКО-ТЕРМО</span>
          </div>
          <div className="object-detail-heading">
            <div>
              <small>Реализованный объект</small>
              <h1>Монтаж перекрытия МАРКО-ТЕРМО</h1>
              <p>
                Утеплённое сборно-монолитное перекрытие на ленточном фундаменте:
                монтаж без крана и защита монолитных балок слоем теплоизоляции.
              </p>
              <LeadButton>Рассчитать стоимость <UiIcon name="arrow" /></LeadButton>
            </div>
            <div className="object-detail-main-image">
              <Image
                src="/montazh/01.png"
                alt="Монтаж перекрытия МАРКО-ТЕРМО"
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
            <h2>Утеплённое перекрытие на ленточном фундаменте</h2>
          </div>
          <div className="custom-template-copy">
            <p>
              Требовалось смонтировать теплоэффективное перекрытие МАРКО-ТЕРМО
              на ленточный фундамент с учётом того, что временную деревянную
              опорную систему после бетонирования снять невозможно.
            </p>
            <p>
              В качестве заполнения применены блоки ППС 35. Главное отличие
              МАРКО-ТЕРМО от МАРКО-Газобетон — отсутствие точки росы в зоне
              монолитной балки: балка защищена слоем ППС толщиной 100 мм.
            </p>
          </div>
        </div>
      </section>

      <section className="section object-detail-content">
        <div className="container section-grid">
          <div>
            <div className="section-index">Результат</div>
            <h2>Монтаж выполнен за три дня</h2>
          </div>
          <div className="custom-template-copy">
            <p>
              В первый день установили временную деревянную опорную систему,
              уложили балки сборно-монолитного перекрытия МАРКО и блоки-заполнители
              из ППС 35. После сборки выполнили армирование и бетонирование.
            </p>
            <p>
              Получилось прочное и теплоэффективное перекрытие, рассчитанное на
              эксплуатацию над холодной зоной здания и подходящее для дальнейшего
              строительства дома.
            </p>
            <a
              className="source-link"
              href="https://www.youtube.com/watch?v=a6G85QTJU2M&t=89s"
              target="_blank"
              rel="noreferrer"
            >
              Смотреть видео с объекта <UiIcon name="arrow" size={17} />
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><div className="section-index">Фотогалерея</div><h2>Этапы монтажа МАРКО-ТЕРМО</h2></div>
          </div>
          <div className="object-detail-gallery">
            {gallery.map((src, index) => (
              <div key={src}>
                <Image
                  src={src}
                  alt={`Монтаж перекрытия МАРКО-ТЕРМО, фото ${index + 1}`}
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
          <div><div className="eyebrow"><span />Нужно тёплое перекрытие?</div><h2>Подберём систему МАРКО-ТЕРМО<br />для вашего дома</h2></div>
          <LeadButton>Получить расчёт <UiIcon name="arrow" /></LeadButton>
        </div>
      </section>
    </main>
  );
}
