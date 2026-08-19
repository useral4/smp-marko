import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LeadButton, UiIcon } from "../components/SiteShell";

export const metadata: Metadata = {
  title: "Блок с пазо-гребневой конструкцией — Балаев Блок. Официальный сайт СМП МАРКО",
  description:
    "Совместно с производителем «Балаев Блок» разработан керамзитобетонный блок с декоративным фасадом. Используется для возведения перегородок и устройства перекрытий.",
};

const gallery = Array.from({ length: 10 }, (_, index) =>
  `/balaev/${String(index + 2).padStart(2, "0")}.png`,
);

export default function BalaevPage() {
  return (
    <main id="top">
      <section className="object-detail-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Главная</Link><span>—</span><span>СМП Марко-Балаев Блок</span>
          </div>
          <div className="object-detail-heading">
            <div>
              <small>Реализованный объект</small>
              <h1>СМП Марко-Балаев Блок</h1>
              <p>
                Монтаж межэтажного перекрытия МАРКО с блоками из капсулированного
                керамзита и готовым декоративным фасадом.
              </p>
              <LeadButton>Рассчитать стоимость <UiIcon name="arrow" /></LeadButton>
            </div>
            <div className="object-detail-main-image">
              <Image
                src="/balaev/01.png"
                alt="Перекрытие СМП Марко-Балаев Блок"
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
            <h2>Совместить систему МАРКО и «Балаев Блок»</h2>
          </div>
          <div className="custom-template-copy">
            <p>
              Совместно с производителем блоков из капсулированного керамзита с
              декоративным фасадом был разработан керамзитобетонный блок, который
              применяется как для перегородок, так и для устройства перекрытия.
            </p>
            <p>
              С этим блоком собирают перекрытия СМП МАРКО-БАЛАЕВ толщиной 200–250 мм
              и МАРКО-БАЛАЕВ 150. В комплект материалов для загородного дома входят
              несущие стены с готовым фасадом, межэтажные перекрытия и перегородочные
              блоки. Балки МАРКО служат несущим элементом, а блоки — несъёмной опалубкой.
            </p>
          </div>
        </div>
      </section>

      <section className="section object-detail-content">
        <div className="container section-grid">
          <div>
            <div className="section-index">Результат</div>
            <h2>60 м² перекрытия смонтировано за три дня</h2>
          </div>
          <div className="custom-template-copy">
            <p>
              На четвёртый день уложили бетон. Перед бетонированием блоки смочили
              водой. Монолитный пояс выполнили в составе перекрытия, а доборный блок
              «Балаев Блок» использовали как опалубку по периметру.
            </p>
            <p>
              Через три дня после бетонирования строительство второго этажа было
              продолжено. Технология МАРКО позволяет использовать разные типы блоков
              в качестве несъёмной опалубки.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div><div className="section-index">Фотогалерея</div><h2>Система в работе</h2></div>
          </div>
          <div className="object-detail-gallery">
            {gallery.map((src, index) => (
              <div key={src}>
                <Image
                  src={src}
                  alt={`Монтаж перекрытия Марко-Балаев Блок, фото ${index + 1}`}
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
          <div><div className="eyebrow"><span />Есть похожая задача?</div><h2>Рассчитаем перекрытие<br />для вашего объекта</h2></div>
          <LeadButton>Получить расчёт <UiIcon name="arrow" /></LeadButton>
        </div>
      </section>
    </main>
  );
}
