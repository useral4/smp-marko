"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";

const Icon = ({ name, size = 20 }: { name: string; size?: number }) => {
  const paths: Record<string, React.ReactNode> = {
    arrow: <><path d="M5 12h14"/><path d="m13 6 6 6-6 6"/></>,
    phone: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.34 1.78.65 2.62a2 2 0 0 1-.45 2.11L8.04 9.72a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.84.31 1.72.53 2.62.65A2 2 0 0 1 22 16.92z"/>,
    message: <><path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/><path d="M8 9h8M8 13h5"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    ruler: <><path d="M3 6v12h18V6z"/><path d="M7 6v4m4-4v2m4-2v4m4-4v2"/></>,
    cube: <><path d="m12 2 9 5-9 5-9-5z"/><path d="m3 7 9 5 9-5v10l-9 5-9-5z"/><path d="M12 12v10"/></>,
    shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    map: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    close: <><path d="m6 6 12 12M18 6 6 18"/></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
    vk: <path d="M4 7c.2 8.4 4.4 13.4 11.7 13.4h.4v-4.8c2.7.3 4.7 2.2 5.5 4.8H25c-1-3.9-3.7-5.9-5.4-6.7 1.7-1 4.1-3.4 4.7-6.7h-3.1c-.8 2.7-3 5.1-5.1 5.4V7H13v9.5C10.8 16 8 13.4 7.9 7z"/>,
    tg: <path d="m22 4-3 16-6-4-3 3 .4-5.2L18 7l-9.5 5.7L4 11z"/>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

const services = [
  { n: "01", title: "Новое строительство", text: "Перекрытия для частных домов, таунхаусов и коммерческих объектов без применения крана.", image: "/floor-system.png" },
  { n: "02", title: "Реконструкция", text: "Замена деревянных и ветхих перекрытий в существующих зданиях с точным расчётом нагрузок.", image: "/assembly.png" },
  { n: "03", title: "Второй свет", text: "Антресоли и дополнительные уровни в готовых помещениях с аккуратным монтажом.", image: "/gasbeton-200.png" },
];

const faqs = [
  ["Можно ли смонтировать перекрытие без крана?", "Да. Элементы системы имеют небольшой вес и подаются вручную. Это особенно удобно на участках с ограниченным подъездом и при реконструкции."],
  ["Что входит в расчёт стоимости?", "Мы учитываем геометрию объекта, пролёты, проектные нагрузки, тип стен, комплект материалов, доставку и выбранный формат монтажа."],
  ["Какой максимальный пролёт возможен?", "В зависимости от типа системы и расчётной нагрузки пролёт может достигать 9 метров. Точное решение определяет инженер после изучения проекта."],
  ["Работаете ли вы по Москве и области?", "Да, выполняем расчёты, поставки и монтаж на объектах в Москве и Московской области."],
  ["Можно заказать только материалы?", "Да. Доступны комплект материалов, шеф-монтаж или полный цикл работ под ключ."],
];

function Logo() {
  return <a className="logo" href="#top" aria-label="СМП МАРКО — на главную"><span className="logo-mark"><i></i><i></i><i></i></span><span><b>МАРКО</b><small>стройматериалы · Москва</small></span></a>;
}

export default function Home() {
  const [menu, setMenu] = useState(false);
  const [faq, setFaq] = useState(0);
  const [cookie, setCookie] = useState(false);
  const [modal, setModal] = useState<"form" | "privacy" | null>(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    setCookie(localStorage.getItem("marko-cookie") !== "accepted");
  }, []);

  useEffect(() => {
    document.body.style.overflow = menu || modal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu, modal]);

  const closeMenu = () => setMenu(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => { setSent(false); setModal(null); }, 2600);
  };

  return <main id="top">
    <header className="header">
      <div className="container header-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Основная навигация">
          <a href="#solutions">Решения</a><a href="#advantages">Преимущества</a><a href="#process">Этапы</a><a href="#faq">FAQ</a><a href="#contacts">Контакты</a>
        </nav>
        <div className="header-actions">
          <a className="header-phone" href="tel:+74955500000"><Icon name="phone" size={17}/><span>+7 (495) 550-00-00</span></a>
          <button className="button button-small" onClick={() => setModal("form")}>Получить расчёт</button>
          <button className="burger" onClick={() => setMenu(true)} aria-label="Открыть меню"><Icon name="menu" size={24}/></button>
        </div>
      </div>
    </header>

    <div className={`mobile-menu ${menu ? "is-open" : ""}`} aria-hidden={!menu}>
      <div className="mobile-menu-head"><Logo/><button onClick={closeMenu} aria-label="Закрыть меню"><Icon name="close"/></button></div>
      <nav><a onClick={closeMenu} href="#solutions">Решения <span>01</span></a><a onClick={closeMenu} href="#advantages">Преимущества <span>02</span></a><a onClick={closeMenu} href="#process">Этапы <span>03</span></a><a onClick={closeMenu} href="#faq">Вопросы <span>04</span></a><a onClick={closeMenu} href="#contacts">Контакты <span>05</span></a></nav>
      <div className="mobile-menu-bottom"><a href="tel:+74955500000">+7 (495) 550-00-00</a><button className="button" onClick={() => { closeMenu(); setModal("form"); }}>Обсудить проект</button></div>
    </div>

    <section className="hero">
      <div className="hero-grid"></div>
      <div className="container hero-inner">
        <div className="hero-copy reveal">
          <div className="eyebrow"><span></span>Москва и Московская область</div>
          <h1>Сборно-монолитные<br/>перекрытия <em>МАРКО</em></h1>
          <p>Проектируем, производим и монтируем надёжные перекрытия для нового строительства и реконструкции.</p>
          <div className="hero-buttons"><button className="button" onClick={() => setModal("form")}>Рассчитать стоимость <Icon name="arrow"/></button><a className="text-link" href="#solutions">Посмотреть решения <Icon name="arrow" size={18}/></a></div>
        </div>
        <div className="hero-visual reveal delay-1">
          <div className="visual-orbit orbit-one"></div><div className="visual-orbit orbit-two"></div>
          <Image src="/floor-system.png" alt="Конструкция сборно-монолитного перекрытия МАРКО" fill priority sizes="(max-width: 900px) 100vw, 52vw" />
          <div className="visual-note note-one"><b>до 9 м</b><span>длина пролёта</span></div>
          <div className="visual-note note-two"><b>без крана</b><span>ручной монтаж</span></div>
        </div>
      </div>
      <div className="container hero-stats">
        <div><strong>10+</strong><span>лет опыта</span></div><div><strong>2 000+</strong><span>реализованных проектов</span></div><div><strong>400 кг/м²</strong><span>несущая способность</span></div><div><strong>100 лет</strong><span>расчётный срок службы</span></div>
      </div>
    </section>

    <section className="section intro" id="advantages">
      <div className="container section-grid">
        <div><div className="section-index">01 — О системе</div><h2>Легче монолита.<br/>Надёжнее дерева.</h2></div>
        <div className="intro-content"><p className="lead">МАРКО — технологичная сборно-монолитная система, которая объединяет стальные балки, лёгкие блоки и армированный бетон.</p><p>Она снижает вес конструкции и расход бетона, не требует тяжёлой техники и подходит для стен из газобетона, кирпича, керамических блоков и монолита.</p><div className="feature-row"><div><Icon name="ruler"/><span>Точный инженерный расчёт</span></div><div><Icon name="cube"/><span>Комплект под ваш объект</span></div><div><Icon name="shield"/><span>Соответствует нормам</span></div></div></div>
      </div>
    </section>

    <section className="section solutions" id="solutions">
      <div className="container">
        <div className="section-head"><div><div className="section-index light">02 — Решения</div><h2>Для строительства<br/>и реконструкции</h2></div><p>Подбираем состав системы под геометрию, нагрузки и условия конкретного объекта.</p></div>
        <div className="service-grid">{services.map((item) => <article className="service-card" key={item.n}><div className="service-image"><Image src={item.image} alt={item.title} fill sizes="(max-width: 760px) 100vw, 33vw"/></div><div className="service-content"><span>{item.n}</span><h3>{item.title}</h3><p>{item.text}</p><button onClick={() => setModal("form")} aria-label={`Узнать подробнее: ${item.title}`}><Icon name="arrow"/></button></div></article>)}</div>
      </div>
    </section>

    <section className="section product">
      <div className="container product-grid">
        <div className="product-image"><Image src="/assembly.png" alt="Сборка перекрытия МАРКО" fill sizes="(max-width: 850px) 100vw, 50vw"/><div className="image-label">Система в сборе</div></div>
        <div className="product-copy"><div className="section-index">03 — Преимущества</div><h2>Разумная конструкция в каждой детали</h2><p>Получаете готовое инженерное решение с понятной спецификацией и прогнозируемой стоимостью.</p><ul><li><span>01</span><div><b>Экономия материалов</b><small>До 50% меньше бетона по сравнению с классическим монолитом.</small></div></li><li><span>02</span><div><b>Свободная планировка</b><small>Пролёты до 9 метров и возможность сложной геометрии.</small></div></li><li><span>03</span><div><b>Простой монтаж</b><small>Без крана, съёмной опалубки и тяжёлой техники.</small></div></li><li><span>04</span><div><b>Один ответственный</b><small>От расчёта и производства до доставки и монтажа.</small></div></li></ul></div>
      </div>
    </section>

    <section className="section process" id="process">
      <div className="container"><div className="section-head dark"><div><div className="section-index light">04 — Как работаем</div><h2>От проекта<br/>до готового перекрытия</h2></div><p>Ведём объект последовательно и держим вас в курсе на каждом этапе.</p></div>
        <div className="steps"><div><span>01</span><Icon name="message"/><h3>Заявка</h3><p>Изучаем планы и уточняем задачу.</p></div><div><span>02</span><Icon name="ruler"/><h3>Расчёт</h3><p>Готовим схему, спецификацию и смету.</p></div><div><span>03</span><Icon name="cube"/><h3>Производство</h3><p>Изготавливаем комплект под объект.</p></div><div><span>04</span><Icon name="check"/><h3>Монтаж</h3><p>Доставляем, собираем и принимаем работу.</p></div></div>
      </div>
    </section>

    <section className="section numbers"><div className="container"><div className="numbers-top"><span>СМП МАРКО · МОСКВА</span><p>Инженерный подход к каждому проекту</p></div><div className="numbers-grid"><div><strong>5</strong><span>дней в среднем<br/>на сборку 100 м²</span></div><div><strong>20–30%</strong><span>экономии бюджета<br/>на перекрытие</span></div><div><strong>1</strong><span>машина материалов<br/>для площади до 200 м²</span></div></div></div></section>

    <section className="section faq" id="faq"><div className="container faq-grid"><div className="faq-title"><div className="section-index">05 — FAQ</div><h2>Частые вопросы</h2><p>Если не нашли ответ — напишите нам. Инженер проконсультирует по вашему объекту.</p><button className="text-link" onClick={() => setModal("form")}>Задать свой вопрос <Icon name="arrow"/></button></div><div className="accordion">{faqs.map((item, i) => <div className={`faq-item ${faq === i ? "open" : ""}`} key={item[0]}><button onClick={() => setFaq(faq === i ? -1 : i)}><span>{String(i+1).padStart(2,"0")}</span><b>{item[0]}</b><i><Icon name={faq === i ? "close" : "plus"}/></i></button><div className="faq-answer"><p>{item[1]}</p></div></div>)}</div></div></section>

    <section className="section contact" id="contacts"><div className="container contact-wrap"><div className="contact-copy"><div className="section-index light">06 — Контакты</div><h2>Обсудим ваш проект?</h2><p>Пришлите план объекта — подготовим предварительный расчёт и предложим подходящий вариант перекрытия.</p><div className="contact-list"><a href="tel:+74955500000"><Icon name="phone"/><span><small>Телефон</small>+7 (495) 550-00-00</span></a><a href="mailto:msk@smp-marko.ru"><Icon name="mail"/><span><small>Электронная почта</small>msk@smp-marko.ru</span></a><div><Icon name="map"/><span><small>Адрес</small>Московская обл., г. Дзержинский,<br/>ул. Спортивная, д. 6</span></div></div></div><form className="contact-form" onSubmit={submit}><h3>Получить расчёт</h3><label><span>Ваше имя</span><input name="name" placeholder="Александр" required/></label><label><span>Телефон</span><input name="phone" type="tel" placeholder="+7 (___) ___-__-__" required/></label><label><span>Комментарий</span><textarea name="message" placeholder="Площадь, тип объекта, город" rows={3}/></label><label className="checkbox"><input type="checkbox" required/><i><Icon name="check" size={14}/></i><span>Я согласен на обработку персональных данных в соответствии с <button type="button" onClick={() => setModal("privacy")}>политикой конфиденциальности</button></span></label><button className="button button-white" type="submit">{sent ? "Заявка отправлена" : <>Отправить заявку <Icon name="arrow"/></>}</button></form></div></section>

    <section className="map-section"><iframe title="Карта: офис СМП МАРКО в Дзержинском" src="https://www.openstreetmap.org/export/embed.html?bbox=37.817%2C55.611%2C37.882%2C55.649&layer=mapnik&marker=55.630%2C37.849" loading="lazy"></iframe><div className="map-card"><span>Офис и производство</span><b>г. Дзержинский,<br/>ул. Спортивная, д. 6</b><a href="https://yandex.ru/maps/?text=%D0%94%D0%B7%D0%B5%D1%80%D0%B6%D0%B8%D0%BD%D1%81%D0%BA%D0%B8%D0%B9%2C%20%D0%A1%D0%BF%D0%BE%D1%80%D1%82%D0%B8%D0%B2%D0%BD%D0%B0%D1%8F%2C%206" target="_blank" rel="noreferrer">Построить маршрут <Icon name="arrow" size={17}/></a></div></section>

    <footer><div className="container footer-top"><Logo/><p>Надёжное решение для строительства<br/>и реконструкции в Москве и области.</p><div className="socials"><a href="https://vk.com/markomoscow" target="_blank" rel="noreferrer" aria-label="ВКонтакте"><Icon name="vk"/></a><a href="https://t.me/smpmarkospb" target="_blank" rel="noreferrer" aria-label="Telegram"><Icon name="tg"/></a></div></div><div className="container footer-bottom"><span>© 2026 Марко Стройматериалы</span><button onClick={() => setModal("privacy")}>Политика конфиденциальности</button><a href="#top">Наверх ↑</a></div></footer>

    <div className="floating-actions"><a className="float-call" href="tel:+74955500000" aria-label="Позвонить"><Icon name="phone"/></a><button className="float-message" onClick={() => setModal("form")}><Icon name="message"/><span>Напишите нам</span></button></div>

    {cookie && <div className="cookie"><div><b>Мы используем cookie</b><p>Они помогают сайту работать корректно. Продолжая, вы соглашаетесь с обработкой данных.</p></div><button onClick={() => { localStorage.setItem("marko-cookie", "accepted"); setCookie(false); }}>Хорошо</button><button className="cookie-close" onClick={() => setCookie(false)} aria-label="Закрыть"><Icon name="close" size={18}/></button></div>}

    {modal && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setModal(null); }}><div className={`modal ${modal === "privacy" ? "privacy-modal" : ""}`}><button className="modal-close" onClick={() => setModal(null)} aria-label="Закрыть"><Icon name="close"/></button>{modal === "form" ? <><div className="eyebrow"><span></span>Бесплатная консультация</div><h2>Рассчитаем перекрытие для вашего объекта</h2><p>Оставьте контакты — инженер перезвонит и уточнит исходные данные.</p><form onSubmit={submit}><label><span>Ваше имя</span><input required placeholder="Как к вам обращаться?"/></label><label><span>Телефон</span><input required type="tel" placeholder="+7 (___) ___-__-__"/></label><label className="checkbox"><input type="checkbox" required/><i><Icon name="check" size={14}/></i><span>Согласен на обработку персональных данных</span></label><button className="button" type="submit">{sent ? "Спасибо! Свяжемся с вами" : <>Получить расчёт <Icon name="arrow"/></>}</button></form></> : <><h2>Политика конфиденциальности</h2><div className="privacy-text"><p><b>1. Общие положения</b></p><p>Настоящая политика составлена в соответствии с Федеральным законом №152‑ФЗ «О персональных данных» и определяет порядок обработки персональных данных пользователей сайта.</p><p><b>2. Обрабатываемые данные</b></p><p>Оператор может обрабатывать имя, номер телефона, адрес электронной почты, сведения об объекте, а также технические данные, передаваемые браузером.</p><p><b>3. Цели обработки</b></p><p>Данные используются для ответа на запрос, подготовки расчёта, исполнения договорных обязательств и улучшения работы сайта. Данные не передаются третьим лицам, кроме случаев, предусмотренных законом.</p><p><b>4. Согласие и отзыв</b></p><p>Отправляя форму, пользователь выражает согласие на обработку данных. Отозвать согласие можно письмом на msk@smp-marko.ru.</p><p><b>5. Cookie</b></p><p>Сайт использует cookie, необходимые для корректной работы и анализа обезличенной статистики.</p></div></>}</div></div>}
  </main>;
}
