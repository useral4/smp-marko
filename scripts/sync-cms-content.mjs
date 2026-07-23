import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const contentRoot = path.join(root, "cms", "content");
const outputPath = path.join(root, "app", "generated-content.ts");

async function readCollection(name) {
  const directory = path.join(contentRoot, name);
  let files = [];
  try {
    files = (await readdir(directory)).filter((file) => file.endsWith(".json"));
  } catch {
    return [];
  }

  const entries = await Promise.all(files.map(async (file) => {
    const entry = JSON.parse(await readFile(path.join(directory, file), "utf8"));
    return { slug: path.basename(file, ".json"), ...entry };
  }));

  return entries
    .filter((entry) => entry.published !== false)
    .sort((a, b) => (a.order ?? 100) - (b.order ?? 100));
}

async function readSite() {
  try {
    return JSON.parse(await readFile(path.join(contentRoot, "site", "index.json"), "utf8"));
  } catch {
    return {
      phones: [],
      email: "",
      address: "",
      contactMap: "",
      socials: [],
    };
  }
}

const [rawArticles, rawNewsItems, rawProjects, site] = await Promise.all([
  readCollection("articles"),
  readCollection("news"),
  readCollection("objects"),
  readSite(),
]);

const articles = rawArticles.map((article) => ({
  sourceHref: "",
  sections: [],
  ...article,
  sections: (article.sections ?? []).map((section) => ({
    title: section.title ?? "",
    paragraphs: section.paragraphs ?? [],
    bullets: section.bullets ?? [],
  })),
}));
const newsItems = rawNewsItems.map((item) => ({
  sourceHref: "",
  paragraphs: [],
  facts: [],
  ...item,
}));
const projects = rawProjects.map((project) => ({
  area: "",
  system: "",
  year: "",
  latitude: "",
  longitude: "",
  source: "",
  gallery: [],
  featured: false,
  ...project,
}));

const generated = `// Этот файл создаётся командой pnpm content:sync из cms/content.
// Не редактируйте его вручную — изменения будут перезаписаны при сборке.

export type CmsArticleSection = {
  title: string;
  paragraphs: string[];
  bullets: string[];
};

export type CmsArticle = {
  slug: string;
  title: string;
  tag: string;
  excerpt: string;
  lead: string;
  sourceHref: string;
  sections: CmsArticleSection[];
  order: number;
  published: boolean;
};

export type CmsNewsItem = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  sourceHref: string;
  paragraphs: string[];
  facts: string[];
  order: number;
  published: boolean;
};

export type CmsProject = {
  slug: string;
  title: string;
  description: string;
  location: string;
  category: string;
  area: string;
  system: string;
  year: string;
  latitude: string;
  longitude: string;
  source: string;
  image: string;
  gallery: string[];
  featured: boolean;
  order: number;
  published: boolean;
};

export type CmsPhone = { city: string; display: string; href: string };
export type CmsSocial = { name: string; href: string; icon: string };

export const articles: CmsArticle[] = ${JSON.stringify(articles, null, 2)};
export const newsItems: CmsNewsItem[] = ${JSON.stringify(newsItems, null, 2)};
export const projects: CmsProject[] = ${JSON.stringify(projects, null, 2)};
export const phones: CmsPhone[] = ${JSON.stringify(site.phones ?? [], null, 2)};
export const socials: CmsSocial[] = ${JSON.stringify(site.socials ?? [], null, 2)};
export const contactEmail = ${JSON.stringify(site.email ?? "")};
export const contactAddress = ${JSON.stringify(site.address ?? "")};
export const contactMap = ${JSON.stringify(site.contactMap ?? "")};
export const phoneDisplay = phones[0]?.display ?? "";
export const phoneHref = phones[0]?.href ?? "";
`;

await mkdir(path.dirname(outputPath), { recursive: true });
let previous = "";
try {
  previous = await readFile(outputPath, "utf8");
} catch {}
if (previous !== generated) {
  await writeFile(outputPath, generated, "utf8");
  console.log(`Контент синхронизирован: ${articles.length} статей, ${newsItems.length} новостей, ${projects.length} объектов.`);
} else {
  console.log("Контент уже синхронизирован.");
}
