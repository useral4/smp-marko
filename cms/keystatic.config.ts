import { collection, config, fields, singleton } from "@keystatic/core";

const useGitHub = process.env.KEYSTATIC_STORAGE === "github";
const contentRoot = useGitHub ? "cms/content" : "content";
const imageDirectory = "public/uploads";

const text = (label: string, description?: string) =>
  fields.text({ label, description });
const multiline = (label: string, description?: string) =>
  fields.text({ label, description, multiline: true });
const optionalText = (label: string, description?: string) =>
  fields.text({
    label,
    description,
    validation: { isRequired: false },
  });
const listOfText = (label: string) =>
  fields.array(multiline("Текст"), {
    label,
    itemLabel: (props) => props.value || "Новая строка",
  });
const titleSlug = fields.slug({
  name: { label: "Заголовок" },
  slug: {
    label: "Адрес страницы",
    description: "Латиницей, без пробелов. После публикации лучше не менять.",
  },
});
const published = fields.checkbox({
  label: "Опубликовано",
  description: "Снимите флажок, чтобы скрыть материал с сайта.",
  defaultValue: true,
});
const sortOrder = fields.integer({
  label: "Порядок",
  description: "Чем меньше число, тем выше материал на странице.",
  defaultValue: 100,
  validation: { min: 0 },
});

const articleSection = fields.object(
  {
    title: text("Подзаголовок"),
    paragraphs: listOfText("Абзацы"),
    bullets: listOfText("Пункты списка"),
  },
  { label: "Раздел статьи" },
);

const socialLink = fields.object(
  {
    name: text("Название"),
    href: text("Ссылка"),
    icon: text("Код иконки", "telegram, whatsapp, max, vk или rutube"),
  },
  { label: "Социальная сеть" },
);

export default config({
  locale: "ru-RU",
  storage: useGitHub
    ? {
        kind: "github",
        repo: "useral4/smp-marko",
      }
    : { kind: "local" },
  ui: {
    brand: { name: "СМП МАРКО" },
    navigation: {
      "Регулярное наполнение": ["objects", "articles", "news"],
      "Настройки сайта": ["site"],
    },
  },
  collections: {
    objects: collection({
      label: "Объекты",
      slugField: "title",
      path: `${contentRoot}/objects/*`,
      format: { data: "json" },
      columns: ["title", "location", "year", "published"],
      schema: {
        title: titleSlug,
        published,
        order: sortOrder,
        featured: fields.checkbox({
          label: "Большая карточка",
          description: "Показывать первой карточкой увеличенного размера.",
          defaultValue: false,
        }),
        category: text("Категория", "Например: Реконструкция или Новое строительство"),
        description: multiline("Краткое описание"),
        location: text("Город / адрес"),
        area: optionalText("Площадь", "Например: 350 м²"),
        system: optionalText("Система перекрытия", "Например: МАРКО-ГАЗОБЕТОН 250"),
        year: optionalText("Год работ"),
        latitude: optionalText("Широта для карты", "Например: 55.751244"),
        longitude: optionalText("Долгота для карты", "Например: 37.618423"),
        source: optionalText("Дополнительная ссылка"),
        image: fields.image({
          label: "Главная фотография",
          directory: `${imageDirectory}/objects`,
          publicPath: "/uploads/objects/",
          validation: { isRequired: true },
        }),
        gallery: fields.array(
          fields.image({
            label: "Фотография",
            directory: `${imageDirectory}/objects`,
            publicPath: "/uploads/objects/",
          }),
          { label: "Галерея до / после" },
        ),
      },
    }),
    articles: collection({
      label: "Статьи",
      slugField: "title",
      path: `${contentRoot}/articles/*`,
      format: { data: "json" },
      columns: ["title", "tag", "published"],
      schema: {
        title: titleSlug,
        published,
        order: sortOrder,
        tag: text("Рубрика"),
        excerpt: multiline("Анонс", "Показывается в карточке статьи."),
        lead: multiline("Вводный текст"),
        sourceHref: optionalText("Ссылка на источник"),
        sections: fields.array(articleSection, {
          label: "Разделы статьи",
          itemLabel: (props) => props.fields.title.value || "Новый раздел",
        }),
      },
    }),
    news: collection({
      label: "Новости",
      slugField: "title",
      path: `${contentRoot}/news/*`,
      format: { data: "json" },
      columns: ["title", "date", "published"],
      schema: {
        title: titleSlug,
        published,
        order: sortOrder,
        date: text("Дата", "Например: 23 июля 2026"),
        excerpt: multiline("Анонс"),
        sourceHref: optionalText("Ссылка на исходную публикацию"),
        paragraphs: listOfText("Абзацы новости"),
        facts: listOfText("Ключевые факты"),
      },
    }),
  },
  singletons: {
    site: singleton({
      label: "Контакты и ссылки",
      path: `${contentRoot}/site/`,
      format: { data: "json" },
      schema: {
        phones: fields.array(
          fields.object({
            city: text("Город"),
            display: text("Номер для показа"),
            href: text("Ссылка", "В формате tel:+74955510000"),
          }),
          {
            label: "Телефоны",
            itemLabel: (props) => props.fields.display.value || "Телефон",
          },
        ),
        email: text("Электронная почта"),
        address: multiline("Адрес"),
        contactMap: multiline("Ссылка на карту офиса"),
        socials: fields.array(socialLink, {
          label: "Социальные сети и мессенджеры",
          itemLabel: (props) => props.fields.name.value || "Ссылка",
        }),
      },
    }),
  },
});
