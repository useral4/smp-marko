export const phones = [
  { city: "Москва", display: "+7 (495) 551-00-00", href: "tel:+74955510000" },
  { city: "Санкт-Петербург", display: "+7 (812) 438-13-61", href: "tel:+78124381361" },
];

export const phoneDisplay = phones[0].display;
export const phoneHref = phones[0].href;
export const contactEmail = "info@kolumb.ru";
export const contactAddress = "197720, г. Санкт-Петербург, Невский проспект, дом 170, офис 29";

export const socials = [
  { name: "Telegram", href: "https://t.me/smpmarkospb", icon: "telegram" },
  { name: "WhatsApp", href: "https://wa.me/79213041361", icon: "whatsapp" },
  { name: "MAX", href: "https://max.ru/u/f9LHodD0cOIjLwJR6atfu40wiJN8axb16_-nTKxZKFqodOU3VrRFffIzFcI", icon: "max" },
  { name: "ВКонтакте", href: "https://vk.ru/smpmarko", icon: "vk" },
  { name: "RUTUBE", href: "https://rutube.ru/channel/43546826/", icon: "rutube" },
];

export const services = [
  {
    slug: "supply",
    title: "Изготовление и поставка",
    short: "Производим балки, каркасы и комплектуем перекрытие под конкретный объект.",
    image: "/service-supply.png",
    lead: "Готовый комплект перекрытия МАРКО с точной спецификацией и доставкой на объект.",
    bullets: ["Расчёт состава комплекта", "Производство несущих балок", "Комплектация блоками и арматурой", "Организация доставки"],
  },
  {
    slug: "design",
    title: "Проектирование и схемы",
    short: "Разрабатываем монтажные схемы с учётом геометрии, нагрузок и материала стен.",
    image: "/service-design.jpg",
    lead: "Инженерная документация, по которой удобно заказывать, собирать и принимать перекрытие.",
    bullets: ["Анализ архитектурного проекта", "Расчёт нагрузок и пролётов", "Монтажная схема", "Спецификация материалов"],
  },
  {
    slug: "installation",
    title: "Монтаж при новом строительстве",
    short: "Собираем перекрытие без крана и готовим конструкцию к бетонированию.",
    image: "/service-install.jpeg",
    lead: "Полный цикл монтажа плит перекрытия для частного дома или коммерческого объекта.",
    bullets: ["Доставка и разгрузка", "Установка оснастки", "Сборка балок и блоков", "Армирование и бетонирование"],
  },
  {
    slug: "replacement",
    title: "Замена межэтажных перекрытий",
    short: "Меняем деревянные и ветхие перекрытия в существующих зданиях.",
    image: "/service-replace.jpg",
    lead: "Лёгкая технология для реконструкции, когда тяжёлая техника и демонтаж крыши невозможны.",
    bullets: ["Обследование объекта", "Демонтаж старых конструкций", "Подача элементов вручную", "Новое монолитное перекрытие"],
  },
  {
    slug: "reconstruction",
    title: "Реконструкция зданий",
    short: "Усиливаем и восстанавливаем перекрытия в зданиях сложной конфигурации.",
    image: "/service-reconstruction.jpg",
    lead: "Комплексные решения для исторических, жилых и производственных объектов.",
    bullets: ["Замеры и обследование", "Рабочая документация", "Подъём комплектующих", "Монтаж в стеснённых условиях"],
  },
  {
    slug: "supervision",
    title: "Шеф-монтаж",
    short: "Инженер контролирует самостоятельную сборку и отвечает на вопросы бригады.",
    image: "/service-supervision.png",
    lead: "Оптимальный формат, если у вас есть собственная бригада, но нужен контроль технологии.",
    bullets: ["Инструктаж бригады", "Проверка опор и оснастки", "Контроль сборки", "Приёмка перед бетонированием"],
  },
];

export const products = [
  { name: "МАРКО-ГАЗОБЕТОН 150", image: "/marko-150.webp", thickness: "150 мм", span: "5,25 м", capacity: "от 400 кг/м²", weight: "200 кг/м²", concrete: "0,066 м³/м²", price: "от 2 100 ₽/м²", priceValue: 2100, scenario: "Частные дома и небольшие пролёты" },
  { name: "МАРКО-ГАЗОБЕТОН 200", image: "/marko-200.webp", thickness: "200 мм", span: "6,25 м", capacity: "от 400 кг/м²", weight: "240 кг/м²", concrete: "0,075 м³/м²", price: "от 2 100 ₽/м²", priceValue: 2100, scenario: "Жилые этажи и универсальные решения" },
  { name: "МАРКО-ГАЗОБЕТОН 250", image: "/marko-250.webp", thickness: "250 мм", span: "7,25 м, до 8,5 м по расчёту", capacity: "от 400 кг/м²", weight: "280 кг/м²", concrete: "0,085 м³/м²", price: "от 2 200 ₽/м²", priceValue: 2200, scenario: "Большие комнаты и свободная планировка" },
  { name: "МАРКО-ГАЗОБЕТОН 300", image: "/marko-300.webp", thickness: "300 мм", span: "9,25 м", capacity: "от 400 кг/м²", weight: "330 кг/м²", concrete: "0,095 м³/м²", price: "от 2 240 ₽/м²", priceValue: 2240, scenario: "Максимальные пролёты и сложные объекты" },
];

export const technicalDocuments = [
  { category: "BIM", title: "BIM-модель перекрытий МАРКО", note: "Revit 2022, четыре типоразмера 150–300 мм", href: "https://3dbim.pro/Biblioteka/_47632.html" },
  { category: "Испытания", title: "Протокол определения несущей способности", note: "Испытания ВНИИЖБ", href: "https://drive.google.com/file/d/1oHJl790Ks94hLUTvc8u_Kwq8husUOPq5/view" },
  { category: "Испытания", title: "Протокол звукоизоляции", note: "Воздушный и ударный шум", href: "https://drive.google.com/file/d/18gLH-keU3KkAPjxZsnOvOgQmW9VuUxHU/view" },
  { category: "Сертификаты", title: "Протокол огнестойкости", note: "Испытания ВНИИПО МЧС", href: "https://drive.google.com/file/d/1oD9d8ePv5aiRFyo2WJTDDkBtg-al8Q4G/view" },
  { category: "Монтаж", title: "Инструкция по монтажу СМП МАРКО", note: "Порядок сборки и подготовки к бетонированию", href: "https://drive.google.com/file/d/1ypnjOfw1RG_Kmz92QmenBCRrlGZngf7U/view" },
  { category: "Альбом решений", title: "Альбом технических решений и СТО", note: "Предоставляются проектировщикам по запросу", href: "mailto:info@kolumb.ru?subject=Запрос%20альбома%20технических%20решений%20МАРКО" },
];

export const articles = [
  { title: "Армирование монолитного перекрытия: фундаментальные правила", excerpt: "На что обратить внимание в проекте и при контроле арматурного каркаса до бетонирования.", href: "https://smp-marko.com/armirovanie-monolitnogo-perekritiya-fundamentalnie-pravila", tag: "Проектирование" },
  { title: "Ошибки при заливке монолита", excerpt: "Практический разбор причин трещин и контрольных точек при бетонировании перекрытия.", href: "https://smp-marko.com/articles/oshibki-pri-zalivke-monolita", tag: "Монтаж" },
  { title: "Замена деревянных перекрытий", excerpt: "Как заменить ветхую конструкцию в существующем здании без тяжёлой техники и демонтажа крыши.", href: "https://smp-marko.com/uslugi/vosstanovlenie-perekrytij", tag: "Реконструкция" },
];

export const newsItems = [
  { date: "20 июля 2026", title: "Обновляем сайт СМП МАРКО", excerpt: "Добавляем калькулятор, технический раздел, объекты, статьи и удобные каналы связи.", href: "/news" },
  { date: "Материалы из канала", title: "Новости компании в MAX", excerpt: "Анонсы объектов, монтажей и технических решений публикуются в официальном канале.", href: "https://max.ru/u/f9LHodD0cOIjLwJR6atfu40wiJN8axb16_-nTKxZKFqodOU3VrRFffIzFcI" },
];

export const objectMap = "https://yandex.ru/map-widget/v1/?lang=ru_RU&scroll=true&source=constructor-api&um=constructor%3Ac0b6ca4b558d99038f75522ca52114ae846a1755e2bb20c7fd51040e5d6799cc";
export const contactMap = "https://yandex.ru/map-widget/v1/?lang=ru_RU&scroll=true&source=constructor-api&um=constructor%3Ad60e97bbbf72a7ebc3073e0c074d5020cbbb1d0cd32e5a847a2cd5ac96a798d6";
