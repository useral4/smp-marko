"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { applyVisualOverride, type VisualOverride } from "../components/PageVisualOverrides";

type Section = {
  title: string;
  paragraphs: string[];
  bullets: string[];
};
type Phone = { city: string; display: string; href: string };
type Social = { name: string; href: string; icon: string };
type ContentData = Record<string, unknown>;
type Item = { slug: string; data: ContentData };
type SectionKey =
  | "pages"
  | "services"
  | "objects"
  | "articles"
  | "news"
  | "documents"
  | "leads"
  | "site";

const sections: Array<{
  key: SectionKey;
  title: string;
  single?: boolean;
  fixed?: boolean;
}> = [
  { key: "pages", title: "Главная и страницы", fixed: true },
  { key: "services", title: "Услуги" },
  { key: "objects", title: "Объекты" },
  { key: "articles", title: "Статьи" },
  { key: "news", title: "Новости" },
  { key: "documents", title: "Технические документы" },
  { key: "leads", title: "Заявки с сайта", fixed: true },
  { key: "site", title: "Контакты и ссылки", single: true },
];

const emptyData: Record<SectionKey, ContentData> = {
  pages: {
    title: "",
    route: "",
    published: true,
    order: 100,
    heading: "",
    lead: "",
  },
  services: {
    title: "",
    published: true,
    order: 100,
    short: "",
    image: "",
    lead: "",
    bullets: [],
  },
  objects: {
    title: "",
    published: true,
    order: 100,
    featured: false,
    category: "",
    description: "",
    location: "",
    area: "",
    system: "",
    year: "",
    latitude: "",
    longitude: "",
    source: "",
    image: "",
    gallery: [],
  },
  articles: {
    title: "",
    published: true,
    order: 100,
    tag: "",
    excerpt: "",
    lead: "",
    sourceHref: "",
    sections: [],
  },
  news: {
    title: "",
    published: true,
    order: 100,
    date: "",
    excerpt: "",
    sourceHref: "",
    paragraphs: [],
    facts: [],
  },
  documents: {
    title: "",
    published: true,
    order: 100,
    category: "",
    note: "",
    href: "",
  },
  leads: {},
  site: { phones: [], email: "", address: "", contactMap: "", socials: [] },
};

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}
function number(value: unknown) {
  return typeof value === "number" ? value : Number(value) || 0;
}
function checked(value: unknown) {
  return value === true;
}
function strings(value: unknown) {
  return Array.isArray(value) ? value.map(String) : [];
}
function records(value: unknown) {
  return Array.isArray(value)
    ? value.filter((item): item is ContentData => Boolean(item) && typeof item === "object")
    : [];
}
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
function makeSlug(value: string) {
  const translit: Record<string, string> = {
    а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh",
    з: "z", и: "i", й: "i", к: "k", л: "l", м: "m", н: "n", о: "o",
    п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c",
    ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu",
    я: "ya",
  };
  return value
    .toLowerCase()
    .split("")
    .map((char) => translit[char] ?? char)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

async function jsonRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...(init?.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...(init?.headers || {}),
    },
  });
  const result = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(result.error || "Ошибка запроса");
  return result;
}

function Field({
  label,
  value,
  onChange,
  multiline = false,
  hint,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  multiline?: boolean;
  hint?: string;
  type?: "text" | "number" | "url" | "email";
}) {
  return (
    <label className={`admin-field ${multiline ? "admin-field-wide" : ""}`}>
      <span>{label}</span>
      {multiline ? (
        <textarea
          value={value}
          rows={4}
          onChange={(event) => onChange(event.target.value)}
        />
      ) : (
        <input
          value={value}
          type={type}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {hint && <small>{hint}</small>}
    </label>
  );
}

function LinesField({
  label,
  value,
  onChange,
  hint = "Каждый пункт — с новой строки",
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  hint?: string;
}) {
  return (
    <Field
      label={label}
      value={value.join("\n")}
      multiline
      hint={hint}
      onChange={(next) =>
        onChange(
          next
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
        )
      }
    />
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="admin-toggle">
      <input
        type="checkbox"
        checked={value}
        onChange={(event) => onChange(event.target.checked)}
      />
      <i />
      <span>{label}</span>
    </label>
  );
}

type PageFieldSpec = {
  key: string;
  label: string;
  multiline?: boolean;
  lines?: boolean;
};

const pageFieldSchemas: Record<string, PageFieldSpec[]> = {
  home: [
    { key: "eyebrow", label: "Надзаголовок первого экрана" },
    { key: "heading", label: "Главный заголовок" },
    { key: "accent", label: "Выделенное слово" },
    { key: "lead", label: "Описание первого экрана", multiline: true },
    { key: "buttonText", label: "Текст главной кнопки" },
    { key: "fileNote", label: "Подсказка о файлах" },
    { key: "introHeading", label: "Заголовок «Возможности»" },
    { key: "introText", label: "Текст «Возможности»", multiline: true },
    { key: "servicesHeading", label: "Заголовок блока услуг" },
    { key: "productsHeading", label: "Заголовок сравнения систем" },
    { key: "productsText", label: "Пояснение к сравнению", multiline: true },
    { key: "objectsHeading", label: "Заголовок карты объектов" },
    { key: "objectsText", label: "Пояснение к карте", multiline: true },
    { key: "formHeading", label: "Заголовок формы" },
    { key: "formText", label: "Описание формы", multiline: true },
    { key: "newsHeading", label: "Заголовок новостей" },
    { key: "ctaHeading", label: "Финальный призыв", multiline: true },
    { key: "ctaButton", label: "Кнопка финального призыва" },
  ],
  services: [
    { key: "heading", label: "Заголовок страницы" },
    { key: "lead", label: "Вводный текст", multiline: true },
  ],
  technology: [
    { key: "heading", label: "Заголовок страницы" },
    { key: "lead", label: "Вводный текст", multiline: true },
    { key: "systemHeading", label: "Заголовок состава системы" },
    { key: "systemItems", label: "Элементы системы", lines: true },
    { key: "galleryHeading", label: "Заголовок блока монтажа" },
    { key: "galleryText", label: "Описание блока монтажа", multiline: true },
    { key: "slabHeading", label: "Заголовок блока о конструкции" },
    { key: "slabText", label: "Текст блока о конструкции", multiline: true },
    { key: "benefitsHeading", label: "Заголовок преимуществ" },
    { key: "designersHeading", label: "Заголовок блока для специалистов" },
    { key: "designersText", label: "Описание блока для специалистов", multiline: true },
    { key: "designersButton", label: "Кнопка раздела специалистов" },
    { key: "ctaHeading", label: "Финальный призыв" },
    { key: "ctaButton", label: "Кнопка финального призыва" },
  ],
  designers: [
    { key: "heading", label: "Заголовок страницы" },
    { key: "lead", label: "Вводный текст", multiline: true },
    { key: "basicsHeading", label: "Заголовок исходных параметров" },
    { key: "basicsText", label: "Описание исходных параметров", multiline: true },
    { key: "documentsHeading", label: "Заголовок библиотеки" },
    { key: "documentsText", label: "Описание библиотеки", multiline: true },
    { key: "requestHeading", label: "Заголовок консультации" },
    { key: "requestText", label: "Описание консультации", multiline: true },
    { key: "requestButton", label: "Кнопка консультации" },
  ],
  reconstruction: [
    { key: "heading", label: "Заголовок страницы" },
    { key: "lead", label: "Вводный текст", multiline: true },
    { key: "buttonText", label: "Главная кнопка" },
    { key: "sectionHeading", label: "Заголовок области применения" },
    { key: "processHeading", label: "Заголовок этапов" },
    { key: "ctaHeading", label: "Финальный призыв", multiline: true },
    { key: "ctaButton", label: "Кнопка финального призыва" },
  ],
  prices: [
    { key: "heading", label: "Заголовок страницы" },
    { key: "lead", label: "Вводный текст", multiline: true },
    { key: "worksHeading", label: "Заголовок стоимости работ" },
  ],
  about: [
    { key: "heading", label: "Заголовок страницы" },
    { key: "lead", label: "Вводный текст", multiline: true },
    { key: "sectionHeading", label: "Заголовок о компании" },
    { key: "sectionText", label: "Текст о компании", multiline: true },
    { key: "ctaHeading", label: "Финальный призыв" },
    { key: "ctaButton", label: "Кнопка финального призыва" },
  ],
};

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  const safe = /^#[0-9a-f]{6}$/i.test(value) ? value : "#ffffff";
  return <label className="admin-field admin-color-field"><span>{label}</span><div><input type="color" value={safe} onChange={(event) => onChange(event.target.value)} /><input value={value} onChange={(event) => onChange(event.target.value)} /></div></label>;
}

function ImageUpload({ label, value, slug, onChange }: { label: string; value: string; slug: string; onChange: (value: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const upload = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.set("type", "pages");
      form.set("slug", slug);
      form.set("file", file);
      const result = await jsonRequest<{ path: string }>("/api/admin/upload", { method: "POST", body: form });
      onChange(result.path);
    } finally { setUploading(false); }
  };
  return <div className="admin-upload-box admin-builder-upload"><div><b>{label}</b><span>{value || "Изображение не выбрано"}</span></div><div>{value && <button type="button" className="admin-link-button" onClick={() => onChange("")}>Убрать</button>}<label className="admin-secondary-button">{uploading ? "Загрузка…" : "Загрузить"}<input hidden type="file" accept=".jpg,.jpeg,.png,.webp" disabled={uploading} onChange={(event) => { const file=event.target.files?.[0]; if(file) void upload(file); }} /></label></div></div>;
}

function StoryEditor({ data, set, slug }: { data: ContentData; set: (key: string, value: unknown) => void; slug: string }) {
  const frames = records(data.storyFrames);
  const update = (index: number, key: string, value: unknown) => set("storyFrames", frames.map((frame, itemIndex) => itemIndex === index ? { ...frame, [key]: value } : frame));
  return <>
    <div className="admin-form-grid">
      <Field label="Заголовок блока" value={text(data.storyHeading)} onChange={(value) => set("storyHeading", value)} />
      <Field label="Скругление карточки" value={number(data.storyCardRadius) || 18} type="number" onChange={(value) => set("storyCardRadius", Number(value))} />
      <ColorField label="Фон блока" value={text(data.storyBackground) || "#0b222c"} onChange={(value) => set("storyBackground", value)} />
      <ColorField label="Цвет текста" value={text(data.storyTextColor) || "#ffffff"} onChange={(value) => set("storyTextColor", value)} />
      <ColorField label="Фон карточки с фото" value={text(data.storyCardBackground) || "#ffffff"} onChange={(value) => set("storyCardBackground", value)} />
    </div>
    <div className="admin-subhead"><div><b>Этапы монтажа</b><span>Меняйте текст, фотографии и порядок этапов.</span></div><button type="button" className="admin-secondary-button" onClick={() => set("storyFrames", [...frames, { title:"Новый этап", text:"Описание этапа", image:"" }])}>Добавить этап</button></div>
    {frames.map((frame,index)=><div className="admin-nested-card" key={String(frame.id || index)}><div className="admin-nested-head"><b>{String(index+1).padStart(2,"0")} · {text(frame.title) || "Без названия"}</b><div><button type="button" disabled={index===0} onClick={() => { const next=[...frames]; [next[index-1],next[index]]=[next[index],next[index-1]]; set("storyFrames",next); }}>↑</button><button type="button" disabled={index===frames.length-1} onClick={() => { const next=[...frames]; [next[index+1],next[index]]=[next[index],next[index+1]]; set("storyFrames",next); }}>↓</button><button type="button" onClick={() => set("storyFrames",frames.filter((_,itemIndex)=>itemIndex!==index))}>Удалить</button></div></div><div className="admin-form-grid"><Field label="Название этапа" value={text(frame.title)} onChange={(value)=>update(index,"title",value)} /><Field label="Описание" value={text(frame.text)} multiline onChange={(value)=>update(index,"text",value)} /></div><ImageUpload label="Фотография этапа" value={text(frame.image)} slug={slug} onChange={(value)=>update(index,"image",value)} /></div>)}
  </>;
}

function BlocksEditor({ data, set, slug }: { data: ContentData; set: (key: string, value: unknown) => void; slug: string }) {
  const blocks = records(data.customBlocks);
  const update = (index:number,key:string,value:unknown) => set("customBlocks",blocks.map((block,itemIndex)=>itemIndex===index?{...block,[key]:value}:block));
  const add = () => set("customBlocks",[...blocks,{id:`block-${Date.now()}`,type:"text",eyebrow:"Новый раздел",heading:"Заголовок блока",text:"Добавьте текст блока.",image:"",buttonText:"",buttonHref:"",background:"#ffffff",textColor:"#11232c",borderColor:"#dbe3e5",radius:18}]);
  return <><div className="admin-subhead"><div><b>Дополнительные блоки</b><span>Добавляются внизу выбранной страницы. Блоки можно переставлять.</span></div><button type="button" className="admin-primary-button" onClick={add}>Добавить блок</button></div>{blocks.length===0&&<div className="admin-empty admin-empty-compact">Дополнительных блоков пока нет.</div>}{blocks.map((block,index)=><div className="admin-nested-card" key={text(block.id)||index}><div className="admin-nested-head"><b>{String(index+1).padStart(2,"0")} · {text(block.heading)||"Без названия"}</b><div><button type="button" disabled={index===0} onClick={()=>{const next=[...blocks];[next[index-1],next[index]]=[next[index],next[index-1]];set("customBlocks",next)}}>↑</button><button type="button" disabled={index===blocks.length-1} onClick={()=>{const next=[...blocks];[next[index+1],next[index]]=[next[index],next[index+1]];set("customBlocks",next)}}>↓</button><button type="button" onClick={()=>set("customBlocks",blocks.filter((_,itemIndex)=>itemIndex!==index))}>Удалить</button></div></div><div className="admin-form-grid"><label className="admin-field"><span>Макет</span><select value={text(block.type)||"text"} onChange={(event)=>update(index,"type",event.target.value)}><option value="text">Текст</option><option value="image-left">Фото слева</option><option value="image-right">Фото справа</option><option value="cta">Призыв к действию</option></select></label><Field label="Надзаголовок" value={text(block.eyebrow)} onChange={(value)=>update(index,"eyebrow",value)} /><Field label="Заголовок" value={text(block.heading)} onChange={(value)=>update(index,"heading",value)} /><Field label="Текст" value={text(block.text)} multiline onChange={(value)=>update(index,"text",value)} /><Field label="Текст кнопки" value={text(block.buttonText)} onChange={(value)=>update(index,"buttonText",value)} /><Field label="Ссылка кнопки" value={text(block.buttonHref)} onChange={(value)=>update(index,"buttonHref",value)} /></div>{text(block.type).startsWith("image")&&<ImageUpload label="Изображение блока" value={text(block.image)} slug={slug} onChange={(value)=>update(index,"image",value)} />}<div className="admin-form-grid"><ColorField label="Фон" value={text(block.background)||"#ffffff"} onChange={(value)=>update(index,"background",value)} /><ColorField label="Цвет текста" value={text(block.textColor)||"#11232c"} onChange={(value)=>update(index,"textColor",value)} /><ColorField label="Цвет рамки" value={text(block.borderColor)||"#dbe3e5"} onChange={(value)=>update(index,"borderColor",value)} /><Field label="Скругление" value={number(block.radius)} type="number" onChange={(value)=>update(index,"radius",Number(value))} /></div></div>)}</>;
}

type SelectedVisualElement = {
  selector: string;
  label: string;
  tag: string;
  text: string;
  canEditText: boolean;
  isImage: boolean;
  isLink: boolean;
  background: string;
  color: string;
  borderColor: string;
  borderRadius: number;
  paddingTop: number;
  paddingBottom: number;
  href: string;
  image: string;
};

function directElementText(element: HTMLElement) {
  const direct = Array.from(element.childNodes)
    .filter((node) => node.nodeType === 3)
    .map((node) => node.textContent?.trim() || "")
    .filter(Boolean)
    .join(" ");
  return direct || (element.children.length === 0 ? element.textContent?.trim() || "" : "");
}

function stableElementSelector(element: HTMLElement, root: HTMLElement) {
  if (element.id) {
    const byId = `#${CSS.escape(element.id)}`;
    if (root.querySelectorAll(byId).length === 1) return byId;
  }
  const parts: string[] = [];
  let current: HTMLElement | null = element;
  while (current && current !== root) {
    let part = current.tagName.toLowerCase();
    const classes = Array.from(current.classList)
      .filter((name) => !name.startsWith("admin-visual-") && !["active", "reveal", "delay-1"].includes(name))
      .slice(0, 3);
    if (classes.length) part += classes.map((name) => `.${CSS.escape(name)}`).join("");
    const parent: HTMLElement | null = current.parentElement;
    if (parent) {
      const sameTag = Array.from(parent.children).filter((child) => child.tagName === current?.tagName);
      if (sameTag.length > 1) part += `:nth-of-type(${sameTag.indexOf(current) + 1})`;
    }
    parts.unshift(part);
    const selector = parts.join(" > ");
    try {
      if (root.querySelectorAll(selector).length === 1) return selector;
    } catch {}
    current = parent;
  }
  return parts.join(" > ");
}

function visualElementLabel(element: HTMLElement) {
  const names: Record<string, string> = {
    SECTION: "Секция",
    ARTICLE: "Карточка",
    DIV: "Блок",
    H1: "Главный заголовок",
    H2: "Заголовок",
    H3: "Подзаголовок",
    H4: "Подзаголовок",
    P: "Текст",
    A: "Ссылка",
    BUTTON: "Кнопка",
    IMG: "Изображение",
    LI: "Пункт списка",
    SPAN: "Надпись",
    STRONG: "Выделенный текст",
    SMALL: "Подпись",
    EM: "Акцентный текст",
    FORM: "Форма",
  };
  const className = Array.from(element.classList).filter((name) => !name.startsWith("admin-visual-")).slice(0, 2).join(" · ");
  return `${names[element.tagName] || "Элемент"}${className ? ` · ${className}` : ""}`;
}

function VisualPageEditor({ data, set, slug, route }: { data: ContentData; set: (key: string, value: unknown) => void; slug: string; route: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const selectedRef = useRef<HTMLElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [selected, setSelected] = useState<SelectedVisualElement | null>(null);
  const [previewVersion, setPreviewVersion] = useState(0);
  const overrides = records(data.visualOverrides) as VisualOverride[];
  const current = selected ? overrides.find((item) => item.selector === selected.selector) : undefined;

  const applyCurrentPreview = (override: VisualOverride) => {
    const frameRoot = iframeRef.current?.contentDocument?.querySelector<HTMLElement>("[data-managed-page]");
    if (frameRoot) applyVisualOverride(frameRoot, override);
  };

  const update = (key: keyof VisualOverride, value: unknown) => {
    if (!selected) return;
    const index = overrides.findIndex((item) => item.selector === selected.selector);
    const nextOverride = { ...(index >= 0 ? overrides[index] : { selector: selected.selector, label: selected.label }), [key]: value } as VisualOverride;
    const next = index >= 0
      ? overrides.map((item, itemIndex) => itemIndex === index ? nextOverride : item)
      : [...overrides, nextOverride];
    set("visualOverrides", next);
    window.setTimeout(() => applyCurrentPreview(nextOverride), 0);
  };

  const prepareFrame = () => {
    cleanupRef.current?.();
    const document = iframeRef.current?.contentDocument;
    const root = document?.querySelector<HTMLElement>("[data-managed-page]");
    if (!document || !root) return;
    document.body.classList.add("admin-visual-editing");
    const style = document.createElement("style");
    style.textContent = `.admin-visual-editing [data-managed-page] *{cursor:pointer!important}.admin-visual-hover{outline:2px dashed #0e8ba6!important;outline-offset:-2px}.admin-visual-selected{outline:3px solid #0e8ba6!important;outline-offset:-3px;box-shadow:0 0 0 4px rgba(14,139,166,.18)!important}`;
    document.head.appendChild(style);
    overrides.forEach((override) => applyVisualOverride(root, override));

    const normalize = (target: EventTarget | null) => {
      const element = target && typeof target === "object" && "nodeType" in target && (target as Node).nodeType === 1
        ? target as HTMLElement
        : null;
      if (!element || !root.contains(element)) return null;
      return element.closest<HTMLElement>("a,button,img,h1,h2,h3,h4,p,li,section,article,form,span,strong,small,em,div");
    };
    const over = (event: MouseEvent) => {
      const element = normalize(event.target);
      if (element && element !== selectedRef.current) element.classList.add("admin-visual-hover");
    };
    const out = (event: MouseEvent) => normalize(event.target)?.classList.remove("admin-visual-hover");
    const click = (event: MouseEvent) => {
      const element = normalize(event.target);
      if (!element) return;
      event.preventDefault();
      event.stopPropagation();
      selectedRef.current?.classList.remove("admin-visual-selected");
      element.classList.remove("admin-visual-hover");
      element.classList.add("admin-visual-selected");
      selectedRef.current = element;
      const view = document.defaultView;
      const computed = view?.getComputedStyle(element);
      const tag = element.tagName;
      const editableTags = ["H1", "H2", "H3", "H4", "P", "A", "BUTTON", "LI", "SPAN", "STRONG", "SMALL", "EM"];
      setSelected({
        selector: stableElementSelector(element, root),
        label: visualElementLabel(element),
        tag,
        text: directElementText(element),
        canEditText: editableTags.includes(tag),
        isImage: tag === "IMG",
        isLink: tag === "A",
        background: computed?.backgroundColor || "#ffffff",
        color: computed?.color || "#11232c",
        borderColor: computed?.borderColor || "#dbe3e5",
        borderRadius: Number.parseFloat(computed?.borderRadius || "0") || 0,
        paddingTop: Number.parseFloat(computed?.paddingTop || "0") || 0,
        paddingBottom: Number.parseFloat(computed?.paddingBottom || "0") || 0,
        href: tag === "A" ? element.getAttribute("href") || "" : "",
        image: tag === "IMG" ? element.getAttribute("src") || "" : "",
      });
    };
    root.addEventListener("mouseover", over, true);
    root.addEventListener("mouseout", out, true);
    root.addEventListener("click", click, true);
    cleanupRef.current = () => {
      root.removeEventListener("mouseover", over, true);
      root.removeEventListener("mouseout", out, true);
      root.removeEventListener("click", click, true);
      style.remove();
    };
  };

  useEffect(() => () => cleanupRef.current?.(), []);

  return <div className="admin-visual-editor">
    <section className="admin-visual-canvas">
      <div className="admin-visual-toolbar">
        <div><b>Редактируйте прямо на странице</b><span>Наведите курсор и нажмите на текст, кнопку, картинку, карточку или секцию.</span></div>
        <div><button type="button" className="admin-secondary-button" onClick={() => { setSelected(null); selectedRef.current = null; setPreviewVersion(Date.now()); }}>Обновить</button><a className="admin-secondary-button" href={route} target="_blank">Открыть страницу ↗</a></div>
      </div>
      <iframe ref={iframeRef} key={previewVersion} src={`${route}?admin-preview=${previewVersion}`} title={`Визуальный редактор ${text(data.title)}`} onLoad={prepareFrame} />
    </section>
    <aside className="admin-visual-inspector">
      {!selected ? <div className="admin-visual-empty"><i>↖</i><b>Выберите элемент</b><p>Кликните по нужному месту в предпросмотре. Здесь появятся его текст, цвета, отступы, изображение или ссылка.</p></div> : <>
        <div className="admin-inspector-head"><span>Выбранный элемент</span><h3>{selected.label}</h3><small>{selected.selector}</small></div>
        {selected.canEditText && <Field label={selected.tag === "BUTTON" ? "Текст кнопки" : selected.isLink ? "Текст ссылки" : "Текст"} value={typeof current?.text === "string" ? current.text : selected.text} multiline={selected.tag === "P"} onChange={(value) => update("text", value)} />}
        {selected.isLink && <Field label="Адрес ссылки" value={typeof current?.href === "string" ? current.href : selected.href} hint="Например: /contacts, https://…, tel:…" onChange={(value) => update("href", value)} />}
        {selected.isImage && <ImageUpload label="Изображение" value={typeof current?.image === "string" ? current.image : selected.image} slug={slug} onChange={(value) => update("image", value)} />}
        <div className="admin-inspector-section"><b>Цвета элемента</b><ColorField label="Фон" value={typeof current?.background === "string" ? current.background : selected.background} onChange={(value) => update("background", value)} /><ColorField label="Цвет текста" value={typeof current?.color === "string" ? current.color : selected.color} onChange={(value) => update("color", value)} /><ColorField label="Цвет рамки" value={typeof current?.borderColor === "string" ? current.borderColor : selected.borderColor} onChange={(value) => update("borderColor", value)} /></div>
        <div className="admin-inspector-section"><b>Размеры элемента</b><div className="admin-inspector-numbers"><Field label="Скругление, px" type="number" value={typeof current?.borderRadius === "number" ? current.borderRadius : selected.borderRadius} onChange={(value) => update("borderRadius", Number(value))} /><Field label="Отступ сверху, px" type="number" value={typeof current?.paddingTop === "number" ? current.paddingTop : selected.paddingTop} onChange={(value) => update("paddingTop", Number(value))} /><Field label="Отступ снизу, px" type="number" value={typeof current?.paddingBottom === "number" ? current.paddingBottom : selected.paddingBottom} onChange={(value) => update("paddingBottom", Number(value))} /></div></div>
        {current && <button type="button" className="admin-reset-element" onClick={() => { set("visualOverrides", overrides.filter((item) => item.selector !== selected.selector)); setPreviewVersion(Date.now()); setSelected(null); selectedRef.current = null; }}>Сбросить изменения этого элемента</button>}
      </>}
    </aside>
  </div>;
}

function PageFields({
  data,
  set,
  slug,
}: {
  data: ContentData;
  set: (key: string, value: unknown) => void;
  slug: string;
}) {
  const [tab, setTab] = useState<"visual"|"content"|"design"|"story"|"blocks">("visual");
  const route = text(data.route);
  const schema = pageFieldSchemas[slug] || [
    { key: "heading", label: "Заголовок страницы" },
    { key: "lead", label: "Вводный текст", multiline: true },
  ];
  return (
    <div className="admin-page-builder">
      <div className="admin-builder-workspace">
      <div className="admin-upload-box admin-builder-bar">
        <div>
          <b>Страница на сайте</b>
          <span>{route || "Адрес не указан"}</span>
        </div>
        {route && (
          <a className="admin-secondary-button" href={route} target="_blank">Открыть страницу ↗</a>
        )}
      </div>
      <div className="admin-builder-tabs"><button type="button" className={tab==="visual"?"active":""} onClick={()=>setTab("visual")}>Визуальный редактор</button><button type="button" className={tab==="content"?"active":""} onClick={()=>setTab("content")}>Тексты страницы</button><button type="button" className={tab==="design"?"active":""} onClick={()=>setTab("design")}>Общие настройки</button>{slug==="home"&&<button type="button" className={tab==="story"?"active":""} onClick={()=>setTab("story")}>Монтаж по этапам</button>}<button type="button" className={tab==="blocks"?"active":""} onClick={()=>setTab("blocks")}>Доп. блоки</button></div>
      {tab==="visual"&&route&&<VisualPageEditor data={data} set={set} slug={slug} route={route} />}
      {tab==="content"&&<><div className="admin-form-grid">
        <Field label="Название в админке" value={text(data.title)} onChange={(v) => set("title", v)} />
        <Field label="Порядок в списке" value={number(data.order)} onChange={(v) => set("order", Number(v))} type="number" />
        {schema.map((field) =>
          field.lines ? (
            <LinesField
              key={field.key}
              label={field.label}
              value={strings(data[field.key])}
              onChange={(value) => set(field.key, value)}
            />
          ) : (
            <Field
              key={field.key}
              label={field.label}
              value={text(data[field.key])}
              onChange={(value) => set(field.key, value)}
              multiline={field.multiline}
            />
          ),
        )}
      </div><Toggle label="Показывать страницу на сайте" value={checked(data.published)} onChange={(v) => set("published", v)} /></>}
      {tab==="design"&&<><div className="admin-form-grid"><ColorField label="Фон страницы" value={text(data.pageBackground)||"#ffffff"} onChange={(v)=>set("pageBackground",v)} /><ColorField label="Фон первого экрана" value={text(data.heroBackground)||"#edf5f6"} onChange={(v)=>set("heroBackground",v)} /><ColorField label="Цвет текста первого экрана" value={text(data.heroTextColor)||"#11232c"} onChange={(v)=>set("heroTextColor",v)} /><ColorField label="Акцентный цвет" value={text(data.accentColor)||"#087e9b"} onChange={(v)=>set("accentColor",v)} /><Field label="Скругление карточек, px" value={number(data.cardRadius)||18} type="number" onChange={(v)=>set("cardRadius",Number(v))} /><Field label="Отступы секций, px" value={number(data.sectionSpacing)||110} type="number" onChange={(v)=>set("sectionSpacing",Number(v))} /><Field label="Затемнение фонового фото, 0–1" value={typeof data.heroOverlay==="number"?data.heroOverlay:0.82} type="number" onChange={(v)=>set("heroOverlay",Number(v))} /><label className="admin-field"><span>Положение фонового фото</span><select value={text(data.heroImagePosition)||"center"} onChange={(e)=>set("heroImagePosition",e.target.value)}><option value="center">По центру</option><option value="left center">Слева</option><option value="right center">Справа</option><option value="center top">Сверху</option><option value="center bottom">Снизу</option></select></label></div><ImageUpload label="Фоновое изображение первого экрана" value={text(data.heroBackgroundImage)} slug={slug} onChange={(v)=>set("heroBackgroundImage",v)} /></>}
      {tab==="story"&&slug==="home"&&<StoryEditor data={data} set={set} slug={slug} />}
      {tab==="blocks"&&<BlocksEditor data={data} set={set} slug={slug} />}
      </div>
    </div>
  );
}

function ServiceFields({
  data,
  set,
  slug,
}: {
  data: ContentData;
  set: (key: string, value: unknown) => void;
  slug: string;
}) {
  const [uploading, setUploading] = useState(false);
  const upload = async (file: File) => {
    if (!slug) throw new Error("Сначала укажите адрес страницы");
    setUploading(true);
    try {
      const form = new FormData();
      form.set("type", "services");
      form.set("slug", slug);
      form.set("file", file);
      const result = await jsonRequest<{ path: string }>("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      set("image", result.path);
    } finally {
      setUploading(false);
    }
  };
  return (
    <>
      <div className="admin-form-grid">
        <Field label="Название услуги" value={text(data.title)} onChange={(v) => set("title", v)} />
        <Field label="Порядок" value={number(data.order)} onChange={(v) => set("order", Number(v))} type="number" />
        <Field label="Краткое описание для карточки" value={text(data.short)} onChange={(v) => set("short", v)} multiline />
        <Field label="Вводный текст страницы услуги" value={text(data.lead)} onChange={(v) => set("lead", v)} multiline />
        <LinesField label="Что входит в услугу" value={strings(data.bullets)} onChange={(v) => set("bullets", v)} />
      </div>
      <Toggle label="Показывать на сайте" value={checked(data.published)} onChange={(v) => set("published", v)} />
      <div className="admin-upload-box">
        <div>
          <b>Фотография услуги</b>
          <span>{text(data.image) || "Фотография не выбрана"}</span>
        </div>
        <label className="admin-secondary-button">
          {uploading ? "Загрузка…" : "Загрузить фото"}
          <input
            hidden
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
            }}
          />
        </label>
      </div>
    </>
  );
}

function DocumentFields({
  data,
  set,
}: {
  data: ContentData;
  set: (key: string, value: unknown) => void;
}) {
  return (
    <>
      <div className="admin-form-grid">
        <Field label="Название документа" value={text(data.title)} onChange={(v) => set("title", v)} />
        <Field label="Категория" value={text(data.category)} onChange={(v) => set("category", v)} />
        <Field label="Ссылка на документ" value={text(data.href)} onChange={(v) => set("href", v)} />
        <Field label="Порядок" value={number(data.order)} onChange={(v) => set("order", Number(v))} type="number" />
        <Field label="Краткое пояснение" value={text(data.note)} onChange={(v) => set("note", v)} multiline />
      </div>
      <Toggle label="Показывать в технической библиотеке" value={checked(data.published)} onChange={(v) => set("published", v)} />
    </>
  );
}

function ObjectFields({
  data,
  set,
  slug,
}: {
  data: ContentData;
  set: (key: string, value: unknown) => void;
  slug: string;
}) {
  const [uploading, setUploading] = useState(false);
  const upload = async (file: File, gallery: boolean) => {
    if (!slug) throw new Error("Сначала укажите адрес страницы");
    setUploading(true);
    try {
      const form = new FormData();
      form.set("type", "objects");
      form.set("slug", slug);
      form.set("file", file);
      const result = await jsonRequest<{ path: string }>("/api/admin/upload", {
        method: "POST",
        body: form,
      });
      set(
        gallery ? "gallery" : "image",
        gallery ? [...strings(data.gallery), result.path] : result.path,
      );
    } finally {
      setUploading(false);
    }
  };
  return (
    <>
      <div className="admin-form-grid">
        <Field label="Название объекта" value={text(data.title)} onChange={(v) => set("title", v)} />
        <Field label="Категория" value={text(data.category)} onChange={(v) => set("category", v)} />
        <Field label="Город / адрес" value={text(data.location)} onChange={(v) => set("location", v)} />
        <Field label="Площадь" value={text(data.area)} onChange={(v) => set("area", v)} hint="Например: 350 м²" />
        <Field label="Система перекрытия" value={text(data.system)} onChange={(v) => set("system", v)} />
        <Field label="Год работ" value={text(data.year)} onChange={(v) => set("year", v)} />
        <Field label="Широта" value={text(data.latitude)} onChange={(v) => set("latitude", v)} />
        <Field label="Долгота" value={text(data.longitude)} onChange={(v) => set("longitude", v)} />
        <Field label="Ссылка на источник" value={text(data.source)} onChange={(v) => set("source", v)} type="url" />
        <Field label="Порядок" value={number(data.order)} onChange={(v) => set("order", Number(v))} type="number" />
        <Field label="Краткое описание" value={text(data.description)} onChange={(v) => set("description", v)} multiline />
      </div>
      <div className="admin-checks">
        <Toggle label="Показывать на сайте" value={checked(data.published)} onChange={(v) => set("published", v)} />
        <Toggle label="Большая карточка" value={checked(data.featured)} onChange={(v) => set("featured", v)} />
      </div>
      <div className="admin-upload-box">
        <div>
          <b>Главная фотография</b>
          <span>{text(data.image) || "Фотография не выбрана"}</span>
        </div>
        <label className="admin-secondary-button">
          {uploading ? "Загрузка…" : "Загрузить фото"}
          <input
            hidden
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file, false);
            }}
          />
        </label>
      </div>
      <div className="admin-upload-box">
        <div>
          <b>Галерея</b>
          <span>{strings(data.gallery).length} фотографий</span>
        </div>
        <label className="admin-secondary-button">
          {uploading ? "Загрузка…" : "Добавить фото"}
          <input
            hidden
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            disabled={uploading}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file, true);
            }}
          />
        </label>
      </div>
      {strings(data.gallery).length > 0 && (
        <div className="admin-gallery-list">
          {strings(data.gallery).map((image, index) => (
            <div key={`${image}-${index}`}>
              <span>{image}</span>
              <button
                type="button"
                onClick={() =>
                  set(
                    "gallery",
                    strings(data.gallery).filter((_, itemIndex) => itemIndex !== index),
                  )
                }
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function ArticleFields({
  data,
  set,
}: {
  data: ContentData;
  set: (key: string, value: unknown) => void;
}) {
  const articleSections = Array.isArray(data.sections)
    ? (data.sections as Section[])
    : [];
  const updateSection = (index: number, patch: Partial<Section>) => {
    set(
      "sections",
      articleSections.map((section, itemIndex) =>
        itemIndex === index ? { ...section, ...patch } : section,
      ),
    );
  };
  return (
    <>
      <div className="admin-form-grid">
        <Field label="Заголовок" value={text(data.title)} onChange={(v) => set("title", v)} />
        <Field label="Рубрика" value={text(data.tag)} onChange={(v) => set("tag", v)} />
        <Field label="Ссылка на источник" value={text(data.sourceHref)} onChange={(v) => set("sourceHref", v)} type="url" />
        <Field label="Порядок" value={number(data.order)} onChange={(v) => set("order", Number(v))} type="number" />
        <Field label="Анонс" value={text(data.excerpt)} onChange={(v) => set("excerpt", v)} multiline />
        <Field label="Вводный текст" value={text(data.lead)} onChange={(v) => set("lead", v)} multiline />
      </div>
      <Toggle label="Показывать на сайте" value={checked(data.published)} onChange={(v) => set("published", v)} />
      <div className="admin-subhead">
        <div><b>Разделы статьи</b><span>Текст и списки внутри статьи</span></div>
        <button
          type="button"
          className="admin-secondary-button"
          onClick={() =>
            set("sections", [...articleSections, { title: "", paragraphs: [], bullets: [] }])
          }
        >
          Добавить раздел
        </button>
      </div>
      {articleSections.map((section, index) => (
        <div className="admin-nested-card" key={index}>
          <div className="admin-nested-head">
            <b>Раздел {index + 1}</b>
            <button
              type="button"
              onClick={() =>
                set("sections", articleSections.filter((_, itemIndex) => itemIndex !== index))
              }
            >
              Удалить
            </button>
          </div>
          <Field label="Подзаголовок" value={text(section.title)} onChange={(v) => updateSection(index, { title: v })} />
          <LinesField label="Абзацы" value={strings(section.paragraphs)} onChange={(v) => updateSection(index, { paragraphs: v })} hint="Один абзац — одна строка" />
          <LinesField label="Пункты списка" value={strings(section.bullets)} onChange={(v) => updateSection(index, { bullets: v })} />
        </div>
      ))}
    </>
  );
}

function NewsFields({
  data,
  set,
}: {
  data: ContentData;
  set: (key: string, value: unknown) => void;
}) {
  return (
    <>
      <div className="admin-form-grid">
        <Field label="Заголовок" value={text(data.title)} onChange={(v) => set("title", v)} />
        <Field label="Дата" value={text(data.date)} onChange={(v) => set("date", v)} hint="Например: 23 июля 2026" />
        <Field label="Ссылка на исходную публикацию" value={text(data.sourceHref)} onChange={(v) => set("sourceHref", v)} type="url" />
        <Field label="Порядок" value={number(data.order)} onChange={(v) => set("order", Number(v))} type="number" />
        <Field label="Анонс" value={text(data.excerpt)} onChange={(v) => set("excerpt", v)} multiline />
        <LinesField label="Текст новости" value={strings(data.paragraphs)} onChange={(v) => set("paragraphs", v)} hint="Один абзац — одна строка" />
        <LinesField label="Ключевые факты" value={strings(data.facts)} onChange={(v) => set("facts", v)} />
      </div>
      <Toggle label="Показывать на сайте" value={checked(data.published)} onChange={(v) => set("published", v)} />
    </>
  );
}

function SiteFields({
  data,
  set,
}: {
  data: ContentData;
  set: (key: string, value: unknown) => void;
}) {
  const phones = Array.isArray(data.phones) ? (data.phones as Phone[]) : [];
  const socials = Array.isArray(data.socials) ? (data.socials as Social[]) : [];
  return (
    <>
      <div className="admin-form-grid">
        <Field label="Электронная почта" value={text(data.email)} onChange={(v) => set("email", v)} type="email" />
        <Field label="Адрес" value={text(data.address)} onChange={(v) => set("address", v)} multiline />
        <Field label="Ссылка на карту" value={text(data.contactMap)} onChange={(v) => set("contactMap", v)} multiline />
      </div>
      <div className="admin-subhead">
        <div><b>Телефоны</b></div>
        <button type="button" className="admin-secondary-button" onClick={() => set("phones", [...phones, { city: "", display: "", href: "tel:+" }])}>Добавить телефон</button>
      </div>
      {phones.map((phone, index) => (
        <div className="admin-row-card" key={index}>
          <Field label="Город" value={phone.city} onChange={(v) => set("phones", phones.map((p, i) => i === index ? { ...p, city: v } : p))} />
          <Field label="Номер" value={phone.display} onChange={(v) => set("phones", phones.map((p, i) => i === index ? { ...p, display: v } : p))} />
          <Field label="Ссылка для звонка" value={phone.href} onChange={(v) => set("phones", phones.map((p, i) => i === index ? { ...p, href: v } : p))} />
          <button type="button" onClick={() => set("phones", phones.filter((_, i) => i !== index))}>Удалить</button>
        </div>
      ))}
      <div className="admin-subhead">
        <div><b>Социальные сети и мессенджеры</b></div>
        <button type="button" className="admin-secondary-button" onClick={() => set("socials", [...socials, { name: "", href: "", icon: "telegram" }])}>Добавить ссылку</button>
      </div>
      {socials.map((social, index) => (
        <div className="admin-row-card" key={index}>
          <Field label="Название" value={social.name} onChange={(v) => set("socials", socials.map((p, i) => i === index ? { ...p, name: v } : p))} />
          <Field label="Ссылка" value={social.href} onChange={(v) => set("socials", socials.map((p, i) => i === index ? { ...p, href: v } : p))} />
          <label className="admin-field">
            <span>Иконка</span>
            <select value={social.icon} onChange={(event) => set("socials", socials.map((p, i) => i === index ? { ...p, icon: event.target.value } : p))}>
              <option value="telegram">Telegram</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="max">MAX</option>
              <option value="vk">ВКонтакте</option>
              <option value="rutube">RUTUBE</option>
            </select>
          </label>
          <button type="button" onClick={() => set("socials", socials.filter((_, i) => i !== index))}>Удалить</button>
        </div>
      ))}
    </>
  );
}

function LeadsList({ items }: { items: Item[] }) {
  return <section className="admin-leads">{items.length===0?<div className="admin-empty"><b>Заявок пока нет</b><span>Новые заявки появятся здесь сразу после отправки формы.</span></div>:items.map((item)=>{const lead=item.data;const date=new Date(text(lead.createdAt));return <article className="admin-lead-card" key={item.slug}><div className="admin-lead-head"><div><span>{Number.isNaN(date.getTime())?text(lead.createdAt):date.toLocaleString("ru-RU")}</span><h2>{text(lead.name)}</h2></div><strong className={`admin-mail-status admin-mail-${text(lead.emailStatus)}`}>{text(lead.emailStatus)==="sent"?"Отправлено на почту":text(lead.emailStatus)==="failed"?"Ошибка почты":"Сохранено в админке"}</strong></div><div className="admin-lead-grid"><div><small>Телефон</small><a href={`tel:${text(lead.phone)}`}>{text(lead.phone)}</a></div><div><small>Город / регион</small><b>{text(lead.region)}</b></div><div><small>Тип объекта</small><b>{text(lead.objectType)}</b></div><div><small>Страница</small><b>{text(lead.page)}</b></div></div>{text(lead.comment)&&<div className="admin-lead-comment"><small>Комментарий</small><p>{text(lead.comment)}</p></div>}{text(lead.fileName)&&<a className="admin-secondary-button" href={`/api/admin/leads/${item.slug}/file`}>Скачать файл · {text(lead.fileName)}</a>}{text(lead.emailError)&&<p className="admin-lead-error">Почта: {text(lead.emailError)}</p>}</article>})}</section>;
}

function Login({
  configured,
  onSuccess,
}: {
  configured: boolean;
  onSuccess: () => void;
}) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await jsonRequest("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ password }),
      });
      onSuccess();
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="admin-login-shell">
      <form className="admin-login" onSubmit={submit}>
        <a href="/" className="admin-brand">СМП МАРКО</a>
        <span>Управление сайтом</span>
        <h1>Вход в личный кабинет</h1>
        <p>Введите пароль администратора.</p>
        <label>
          <span>Пароль</span>
          <input
            type="password"
            value={password}
            autoFocus
            autoComplete="current-password"
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {!configured && <div className="admin-error">Пароль ещё не настроен на сервере.</div>}
        {error && <div className="admin-error">{error}</div>}
        <button type="submit" disabled={loading || !configured}>
          {loading ? "Входим…" : "Войти"}
        </button>
      </form>
    </main>
  );
}

export default function AdminPanel() {
  const [session, setSession] = useState<"loading" | "guest" | "user">("loading");
  const [configured, setConfigured] = useState(true);
  const [section, setSection] = useState<SectionKey>("pages");
  const [items, setItems] = useState<Item[]>([]);
  const [selected, setSelected] = useState<Item | null>(null);
  const [previousSlug, setPreviousSlug] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const currentSection = useMemo(
    () => sections.find((item) => item.key === section) || sections[0],
    [section],
  );

  const checkSession = async () => {
    try {
      const result = await jsonRequest<{ authenticated: boolean; configured: boolean }>(
        "/api/admin/session",
      );
      setConfigured(result.configured);
      setSession(result.authenticated ? "user" : "guest");
    } catch {
      setSession("guest");
    }
  };

  useEffect(() => {
    void checkSession();
  }, []);

  const load = async (nextSection = section, keepSlug = "") => {
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const result = await jsonRequest<{ items: Item[] }>(
        nextSection === "leads" ? "/api/admin/leads" : `/api/admin/content?type=${nextSection}`,
      );
      const ordered = result.items.sort(
        (a, b) => number(a.data.order) - number(b.data.order),
      );
      setItems(ordered);
      if (nextSection === "site") {
        const item = ordered[0] || { slug: "index", data: clone(emptyData.site) };
        setSelected(clone(item));
        setPreviousSlug(item.slug);
      } else if (keepSlug) {
        const item = ordered.find((entry) => entry.slug === keepSlug);
        setSelected(item ? clone(item) : null);
        setPreviousSlug(item?.slug || "");
      } else {
        setSelected(null);
        setPreviousSlug("");
      }
    } catch (nextError) {
      if (nextError instanceof Error && nextError.message === "Требуется вход") {
        setSession("guest");
      } else {
        setError(nextError instanceof Error ? nextError.message : "Ошибка загрузки");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session === "user") void load(section);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, section]);

  const selectSection = (nextSection: SectionKey) => {
    setSection(nextSection);
  };
  const edit = (item: Item) => {
    setSelected(clone(item));
    setPreviousSlug(item.slug);
    setNotice("");
    setError("");
  };
  const create = () => {
    setSelected({ slug: "", data: clone(emptyData[section]) });
    setPreviousSlug("");
    setNotice("");
    setError("");
  };
  const setData = (key: string, value: unknown) => {
    setSelected((current) =>
      current ? { ...current, data: { ...current.data, [key]: value } } : current,
    );
  };
  const save = async () => {
    if (!selected) return;
    const slug = section === "site" ? "index" : selected.slug || makeSlug(text(selected.data.title));
    if (!slug) {
      setError("Укажите название и адрес страницы");
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const result = await jsonRequest<{ slug: string }>("/api/admin/content", {
        method: "PUT",
        body: JSON.stringify({
          type: section,
          slug,
          previousSlug,
          data: selected.data,
        }),
      });
      setSelected({ ...selected, slug: result.slug });
      setPreviousSlug(result.slug);
      await load(section, result.slug);
      setNotice("Сохранено. Изменения уже доступны на сайте.");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };
  const remove = async () => {
    if (!selected || section === "site" || currentSection.fixed) return;
    if (!window.confirm(`Удалить «${text(selected.data.title)}»?`)) return;
    setSaving(true);
    try {
      await jsonRequest("/api/admin/content", {
        method: "DELETE",
        body: JSON.stringify({ type: section, slug: selected.slug }),
      });
      setSelected(null);
      setNotice("Материал удалён.");
      await load(section);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Не удалось удалить");
    } finally {
      setSaving(false);
    }
  };
  const logout = async () => {
    await jsonRequest("/api/admin/logout", { method: "POST" });
    setSession("guest");
  };

  if (session === "loading") {
    return <div className="admin-loading">Загрузка кабинета…</div>;
  }
  if (session === "guest") {
    return <Login configured={configured} onSuccess={() => setSession("user")} />;
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a href="/" className="admin-brand">СМП МАРКО</a>
        <span className="admin-caption">Управление сайтом</span>
        <nav>
          {sections.map((item) => (
            <button
              type="button"
              key={item.key}
              className={section === item.key ? "active" : ""}
              onClick={() => selectSection(item.key)}
            >
              {item.title}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <a href="/" target="_blank">Открыть сайт ↗</a>
          <button type="button" onClick={() => void logout()}>Выйти</button>
        </div>
      </aside>
      <main className="admin-main">
        <header className="admin-topbar">
          <div>
            <span>Раздел</span>
            <h1>{currentSection.title}</h1>
          </div>
          {!currentSection.single && !currentSection.fixed && !selected && (
            <button type="button" className="admin-primary-button" onClick={create}>
              Добавить
            </button>
          )}
        </header>

        {error && <div className="admin-message admin-message-error">{error}</div>}
        {notice && <div className="admin-message admin-message-success">{notice}</div>}

        {loading ? (
          <div className="admin-empty">Загружаем данные…</div>
        ) : section === "leads" ? (
          <LeadsList items={items} />
        ) : selected ? (
          <section className="admin-editor">
            <div className="admin-editor-head">
              <button type="button" className="admin-back" onClick={() => section === "site" ? undefined : setSelected(null)}>
                {section === "site" ? "Настройки сайта" : "← Назад к списку"}
              </button>
              <div>
                <button type="button" className="admin-primary-button" disabled={saving} onClick={() => void save()}>
                  {saving ? "Сохраняем…" : "Сохранить"}
                </button>
                {section !== "site" && !currentSection.fixed && previousSlug && (
                  <button type="button" className="admin-danger-button" disabled={saving} onClick={() => void remove()}>
                    Удалить
                  </button>
                )}
              </div>
            </div>
            {section !== "site" && section !== "pages" && (
              <Field
                label="Адрес страницы"
                value={selected.slug}
                onChange={(value) => setSelected({ ...selected, slug: makeSlug(value) })}
                hint="Латиницей, без пробелов. Можно сформировать из названия."
              />
            )}
            {section === "pages" && <PageFields data={selected.data} set={setData} slug={selected.slug} />}
            {section === "services" && <ServiceFields data={selected.data} set={setData} slug={selected.slug || makeSlug(text(selected.data.title))} />}
            {section === "objects" && <ObjectFields data={selected.data} set={setData} slug={selected.slug || makeSlug(text(selected.data.title))} />}
            {section === "articles" && <ArticleFields data={selected.data} set={setData} />}
            {section === "news" && <NewsFields data={selected.data} set={setData} />}
            {section === "documents" && <DocumentFields data={selected.data} set={setData} />}
            {section === "site" && <SiteFields data={selected.data} set={setData} />}
            <div className="admin-editor-footer">
              <button type="button" className="admin-primary-button" disabled={saving} onClick={() => void save()}>
                {saving ? "Сохраняем…" : "Сохранить изменения"}
              </button>
              <span>После сохранения изменения сразу доступны на сайте.</span>
            </div>
          </section>
        ) : (
          <section className="admin-list">
            {items.length === 0 ? (
              <div className="admin-empty">
                <b>В этом разделе пока ничего нет</b>
                <button type="button" className="admin-primary-button" onClick={create}>Добавить первый материал</button>
              </div>
            ) : (
              items.map((item) => (
                <button type="button" className="admin-list-item" key={item.slug} onClick={() => edit(item)}>
                  <div>
                    <b>{text(item.data.title) || "Без названия"}</b>
                    <span>{item.slug}</span>
                  </div>
                  <div>
                    <span className={checked(item.data.published) ? "admin-status-live" : "admin-status-hidden"}>
                      {checked(item.data.published) ? "На сайте" : "Скрыто"}
                    </span>
                    <strong>Редактировать →</strong>
                  </div>
                </button>
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
}
