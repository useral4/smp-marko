import { promises as fs } from "node:fs";
import path from "node:path";
import {
  contentRoot,
  ensureContentRoot,
  ensureUploadRoot,
  uploadRoot,
  usesPersistentServerStorage,
} from "./content-paths";

export const contentTypes = [
  "objects",
  "articles",
  "news",
  "pages",
  "services",
  "documents",
  "site",
] as const;
export type ContentType = (typeof contentTypes)[number];

const repo = process.env.GITHUB_CONTENT_REPO || "useral4/smp-marko";
const branch = process.env.GITHUB_CONTENT_BRANCH || "main";
const token = process.env.GITHUB_CONTENT_TOKEN;
const githubStorageEnabled =
  !usesPersistentServerStorage && process.env.RENDER === "true";
const hostedWithoutStorage = githubStorageEnabled && !token;
const localStorageEnabled = !githubStorageEnabled;
const apiBase = `https://api.github.com/repos/${repo}`;

function assertType(value: string): asserts value is ContentType {
  if (!contentTypes.includes(value as ContentType)) {
    throw new Error("Неизвестный раздел");
  }
}

export function safeSlug(value: string) {
  const slug = value.trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]{0,79}$/.test(slug)) {
    throw new Error("Адрес должен состоять из латинских букв, цифр и дефисов");
  }
  return slug;
}

function relativeFile(type: ContentType, slug: string) {
  return `cms/content/${type}/${type === "site" ? "index" : safeSlug(slug)}.json`;
}

function headers() {
  return {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${token}`,
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "smp-marko-admin",
  };
}

async function githubRequest(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: { ...headers(), ...(init?.headers || {}) },
    cache: "no-store",
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      response.status === 401 || response.status === 403
        ? "Нет доступа к хранилищу сайта"
        : `GitHub вернул ошибку ${response.status}: ${detail.slice(0, 160)}`,
    );
  }
  return response;
}

async function githubFile(pathname: string) {
  const url = `${apiBase}/contents/${pathname}?ref=${encodeURIComponent(branch)}`;
  const response = await fetch(url, { headers: headers(), cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Не удалось прочитать ${pathname}`);
  }
  return response.json() as Promise<{ content: string; sha: string }>;
}

async function putGitHubFile(
  pathname: string,
  bytes: Uint8Array,
  message: string,
) {
  if (!token) throw new Error("Сохранение ещё не подключено");
  const current = await githubFile(pathname);
  await githubRequest(`${apiBase}/contents/${pathname}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      branch,
      content: Buffer.from(bytes).toString("base64"),
      ...(current?.sha ? { sha: current.sha } : {}),
    }),
  });
}

async function deleteGitHubFile(pathname: string, message: string) {
  if (!token) throw new Error("Сохранение ещё не подключено");
  const current = await githubFile(pathname);
  if (!current) return;
  await githubRequest(`${apiBase}/contents/${pathname}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, branch, sha: current.sha }),
  });
}

export async function listContent(rawType: string) {
  assertType(rawType);
  const type = rawType;
  if (githubStorageEnabled && token) {
    const directory = `cms/content/${type}`;
    const response = await githubRequest(
      `${apiBase}/contents/${directory}?ref=${encodeURIComponent(branch)}`,
    );
    const entries = (await response.json()) as Array<{
      name: string;
      path: string;
      type: string;
    }>;
    const files = entries.filter(
      (entry) => entry.type === "file" && entry.name.endsWith(".json"),
    );
    return Promise.all(
      files.map(async (entry) => {
        const file = await githubFile(entry.path);
        if (!file) throw new Error(`Не найден ${entry.path}`);
        return {
          slug: entry.name.replace(/\.json$/, ""),
          data: JSON.parse(
            Buffer.from(file.content.replace(/\n/g, ""), "base64").toString(
              "utf8",
            ),
          ),
        };
      }),
    );
  }

  await ensureContentRoot();
  const directory = path.join(contentRoot, type);
  const names = (await fs.readdir(directory)).filter((name) =>
    name.endsWith(".json"),
  );
  return Promise.all(
    names.map(async (name) => ({
      slug: name.replace(/\.json$/, ""),
      data: JSON.parse(await fs.readFile(path.join(directory, name), "utf8")),
    })),
  );
}

export async function saveContent(input: {
  type: string;
  slug: string;
  previousSlug?: string;
  data: unknown;
}) {
  if (hostedWithoutStorage) {
    throw new Error("Сохранение ещё подключается. Повторите немного позже.");
  }
  assertType(input.type);
  const type = input.type;
  const slug = type === "site" ? "index" : safeSlug(input.slug);
  const previousSlug =
    type === "site"
      ? "index"
      : input.previousSlug
        ? safeSlug(input.previousSlug)
        : slug;
  const contents = `${JSON.stringify(input.data, null, 2)}\n`;
  const target = relativeFile(type, slug);

  if (githubStorageEnabled && token) {
    await putGitHubFile(
      target,
      new TextEncoder().encode(contents),
      `Обновление: ${type}/${slug}`,
    );
    if (previousSlug !== slug) {
      await deleteGitHubFile(
        relativeFile(type, previousSlug),
        `Удаление старого адреса: ${type}/${previousSlug}`,
      );
    }
  }
  if (localStorageEnabled) {
    await ensureContentRoot();
    const targetPath = path.join(contentRoot, type, `${slug}.json`);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, contents, "utf8");
    if (previousSlug !== slug) {
      await fs.rm(path.join(contentRoot, type, `${previousSlug}.json`), {
        force: true,
      });
    }
  }
  return { slug };
}

export async function deleteContent(rawType: string, rawSlug: string) {
  if (hostedWithoutStorage) {
    throw new Error("Сохранение ещё подключается. Повторите немного позже.");
  }
  assertType(rawType);
  if (rawType === "site") throw new Error("Настройки сайта нельзя удалить");
  const slug = safeSlug(rawSlug);
  const pathname = relativeFile(rawType, slug);
  if (githubStorageEnabled && token) {
    await deleteGitHubFile(pathname, `Удаление: ${rawType}/${slug}`);
  }
  if (localStorageEnabled) {
    await ensureContentRoot();
    await fs.rm(path.join(contentRoot, rawType, `${slug}.json`), { force: true });
  }
}

export async function saveUpload(input: {
  type: string;
  slug: string;
  name: string;
  bytes: Uint8Array;
}) {
  if (hostedWithoutStorage) {
    throw new Error("Загрузка фотографий ещё подключается.");
  }
  if (!["objects", "services", "pages", "articles"].includes(input.type)) {
    throw new Error("Загрузка файлов разрешена только для объектов, услуг, страниц и статей");
  }
  const slug = safeSlug(input.slug);
  const extension = path.extname(input.name).toLowerCase();
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(extension)) {
    throw new Error("Разрешены JPG, PNG и WEBP");
  }
  if (input.bytes.byteLength > 8 * 1024 * 1024) {
    throw new Error("Файл больше 8 МБ");
  }
  const base = path
    .basename(input.name, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const filename = `${Date.now()}-${base || "photo"}${extension}`;
  const pathname = `public/uploads/${input.type}/${slug}/${filename}`;
  if (githubStorageEnabled && token) {
    await putGitHubFile(pathname, input.bytes, `Фото объекта: ${slug}`);
  }
  if (localStorageEnabled) {
    await ensureUploadRoot();
    const target = path.join(uploadRoot, input.type, slug, filename);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, input.bytes);
    if (usesPersistentServerStorage) {
      return `/media/${input.type}/${slug}/${filename}`;
    }
  }
  return `/uploads/${input.type}/${slug}/${filename}`;
}
