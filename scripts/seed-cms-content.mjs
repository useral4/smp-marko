import { copyFile, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const cmsRoot = path.join(root, "cms", "content");
const force = process.argv.includes("--force");

async function directoryHasFiles(directory) {
  try {
    return (await readdir(directory)).length > 0;
  } catch {
    return false;
  }
}

if (!force && await directoryHasFiles(cmsRoot)) {
  throw new Error("cms/content уже заполнен. Для осознанной перезаписи используйте --force.");
}

const source = await readFile(path.join(root, "app", "data.ts"), "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
  },
}).outputText;
const data = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);

const projects = [
  {
    slug: "nevsky-reconstruction",
    title: "Реконструкция на Невском проспекте",
    description: "Монтаж нового перекрытия поверх существующих конструкций.",
    location: "Санкт-Петербург, Невский проспект, 12",
    category: "Реконструкция",
    imageSource: "public/objects/nevsky-reconstruction.webp",
    source: "https://smp-marko.com/montazh2",
    featured: true,
  },
  {
    slug: "balaev-house",
    title: "Перекрытие МАРКО — Балаев блок",
    description: "Сборно-монолитное перекрытие для объекта нового строительства.",
    location: "Новое строительство",
    category: "Новое строительство",
    imageSource: "public/objects/balaev-house.webp",
    source: "https://smp-marko.com/balaev",
  },
  {
    slug: "marko-termo",
    title: "Монтаж перекрытия МАРКО-ТЕРМО",
    description: "Монтаж несущих балок и элементов системы МАРКО-ТЕРМО.",
    location: "Новое строительство",
    category: "Новое строительство",
    imageSource: "public/objects/marko-termo.webp",
    source: "https://smp-marko.com/montazh",
  },
  {
    slug: "krasnodar-console",
    title: "Консоль, второй свет и лестничный проём",
    description: "Перекрытие сложной геометрии с консолью и проёмами.",
    location: "Октябрьский, Краснодарский край, ул. Парадная, 43",
    category: "Новое строительство",
    imageSource: "public/objects/krasnodar-console.webp",
    source: "https://smp-marko.com/konsol",
  },
  {
    slug: "ispolkomskaya-scheme",
    title: "Монтажная схема перекрытия",
    description: "Проектная схема раскладки элементов перекрытия МАРКО.",
    location: "Санкт-Петербург, ул. Исполкомская, 2",
    category: "Проектирование",
    imageSource: "public/objects/ispolkomskaya-scheme.webp",
    source: "https://smp-marko.com/shemamarko",
  },
];

async function writeJson(relativePath, value) {
  const destination = path.join(cmsRoot, relativePath);
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

for (const [index, article] of data.articles.entries()) {
  await writeJson(`articles/${article.slug}.json`, {
    title: article.title,
    published: true,
    order: (index + 1) * 10,
    tag: article.tag,
    excerpt: article.excerpt,
    lead: article.lead,
    sourceHref: article.sourceHref ?? "",
    sections: article.sections.map((section) => ({
      title: section.title,
      paragraphs: section.paragraphs ?? [],
      bullets: section.bullets ?? [],
    })),
  });
}

for (const [index, news] of data.newsItems.entries()) {
  await writeJson(`news/${news.slug}.json`, {
    title: news.title,
    published: true,
    order: (index + 1) * 10,
    date: news.date,
    excerpt: news.excerpt,
    sourceHref: news.sourceHref ?? "",
    paragraphs: news.paragraphs ?? [],
    facts: news.facts ?? [],
  });
}

for (const [index, project] of projects.entries()) {
  const extension = path.extname(project.imageSource);
  const imageRelative = `/uploads/objects/${project.slug}/image${extension}`;
  const imageDestination = path.join(root, "public", imageRelative.replace(/^\//, ""));
  const cmsImageDestination = path.join(root, "cms", "public", imageRelative.replace(/^\//, ""));
  await mkdir(path.dirname(imageDestination), { recursive: true });
  await mkdir(path.dirname(cmsImageDestination), { recursive: true });
  await copyFile(path.join(root, project.imageSource), imageDestination);
  await copyFile(path.join(root, project.imageSource), cmsImageDestination);

  await writeJson(`objects/${project.slug}.json`, {
    title: project.title,
    published: true,
    order: (index + 1) * 10,
    featured: project.featured ?? false,
    category: project.category,
    description: project.description,
    location: project.location,
    area: "",
    system: "",
    year: "",
    source: project.source,
    image: imageRelative,
    gallery: [],
  });
}

await writeJson("site/index.json", {
  phones: data.phones,
  email: data.contactEmail,
  address: data.contactAddress,
  contactMap: data.contactMap,
  socials: data.socials,
});

console.log(`CMS seed готов: ${data.articles.length} статей, ${data.newsItems.length} новостей, ${projects.length} объектов.`);
