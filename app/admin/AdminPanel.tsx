"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Section = {
  title: string;
  paragraphs: string[];
  bullets: string[];
};
type Phone = { city: string; display: string; href: string };
type Social = { name: string; href: string; icon: string };
type ContentData = Record<string, unknown>;
type Item = { slug: string; data: ContentData };
type SectionKey = "objects" | "articles" | "news" | "site";

const sections: Array<{ key: SectionKey; title: string; single?: boolean }> = [
  { key: "objects", title: "Объекты" },
  { key: "articles", title: "Статьи" },
  { key: "news", title: "Новости" },
  { key: "site", title: "Контакты и ссылки", single: true },
];

const emptyData: Record<SectionKey, ContentData> = {
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
        <p>Введите пароль администратора. GitHub и другие сервисы открывать не нужно.</p>
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
  const [section, setSection] = useState<SectionKey>("objects");
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

  const load = async (nextSection = section) => {
    setLoading(true);
    setError("");
    setNotice("");
    try {
      const result = await jsonRequest<{ items: Item[] }>(
        `/api/admin/content?type=${nextSection}`,
      );
      const ordered = result.items.sort(
        (a, b) => number(a.data.order) - number(b.data.order),
      );
      setItems(ordered);
      if (nextSection === "site") {
        const item = ordered[0] || { slug: "index", data: clone(emptyData.site) };
        setSelected(clone(item));
        setPreviousSlug(item.slug);
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
      await load(section);
      setNotice("Сохранено. Изменения появятся на сайте после автоматического обновления.");
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : "Не удалось сохранить");
    } finally {
      setSaving(false);
    }
  };
  const remove = async () => {
    if (!selected || section === "site") return;
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
          {!currentSection.single && !selected && (
            <button type="button" className="admin-primary-button" onClick={create}>
              Добавить
            </button>
          )}
        </header>

        {error && <div className="admin-message admin-message-error">{error}</div>}
        {notice && <div className="admin-message admin-message-success">{notice}</div>}

        {loading ? (
          <div className="admin-empty">Загружаем данные…</div>
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
                {section !== "site" && previousSlug && (
                  <button type="button" className="admin-danger-button" disabled={saving} onClick={() => void remove()}>
                    Удалить
                  </button>
                )}
              </div>
            </div>
            {section !== "site" && (
              <Field
                label="Адрес страницы"
                value={selected.slug}
                onChange={(value) => setSelected({ ...selected, slug: makeSlug(value) })}
                hint="Латиницей, без пробелов. Можно сформировать из названия."
              />
            )}
            {section === "objects" && <ObjectFields data={selected.data} set={setData} slug={selected.slug || makeSlug(text(selected.data.title))} />}
            {section === "articles" && <ArticleFields data={selected.data} set={setData} />}
            {section === "news" && <NewsFields data={selected.data} set={setData} />}
            {section === "site" && <SiteFields data={selected.data} set={setData} />}
            <div className="admin-editor-footer">
              <button type="button" className="admin-primary-button" disabled={saving} onClick={() => void save()}>
                {saving ? "Сохраняем…" : "Сохранить изменения"}
              </button>
              <span>После сохранения сайт обновится автоматически.</span>
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
