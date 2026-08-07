import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import type {
  CmsArticle,
  CmsNewsItem,
  CmsPhone,
  CmsProject,
  CmsSocial,
} from "../app/generated-content";
import type { VisualOverride } from "../app/components/PageVisualOverrides";

type JsonRecord = Record<string, unknown>;

export type CmsSiteContent = {
  phones: CmsPhone[];
  socials: CmsSocial[];
  email: string;
  address: string;
  contactMap: string;
  navigation: Array<{ title: string; href: string }>;
  headerOverrides: VisualOverride[];
};

export type CmsPage = {
  slug: string;
  title: string;
  route: string;
  published: boolean;
  order: number;
  [key: string]: unknown;
};

export type CmsService = {
  slug: string;
  title: string;
  short: string;
  image: string;
  lead: string;
  bullets: string[];
  published: boolean;
  order: number;
};

export type CmsDocument = {
  slug: string;
  title: string;
  category: string;
  note: string;
  href: string;
  published: boolean;
  order: number;
};

const contentRoot = path.join(process.cwd(), "cms", "content");

async function readCollection(name: string) {
  const directory = path.join(contentRoot, name);
  const files = (await fs.readdir(directory)).filter((file) =>
    file.endsWith(".json"),
  );
  const entries = await Promise.all(
    files.map(
      async (file): Promise<JsonRecord & { slug: string }> => ({
        slug: path.basename(file, ".json"),
        ...(JSON.parse(
          await fs.readFile(path.join(directory, file), "utf8"),
        ) as JsonRecord),
      }),
    ),
  );

  return entries
    .filter((entry) => entry.published !== false)
    .sort(
      (a, b) =>
        (Number(a.order) || 100) - (Number(b.order) || 100),
    );
}

export async function readArticles(): Promise<CmsArticle[]> {
  const entries = await readCollection("articles");
  return entries.map(
    (article) =>
      ({
        sourceHref: "",
        ...article,
        sections: Array.isArray(article.sections)
          ? article.sections.map((section) => {
              const value = section as JsonRecord;
              return {
                title: String(value.title || ""),
                paragraphs: Array.isArray(value.paragraphs)
                  ? value.paragraphs.map(String)
                  : [],
                bullets: Array.isArray(value.bullets)
                  ? value.bullets.map(String)
                  : [],
              };
            })
          : [],
      }) as CmsArticle,
  );
}

export async function readNewsItems(): Promise<CmsNewsItem[]> {
  const entries = await readCollection("news");
  return entries.map(
    (item) =>
      ({
        sourceHref: "",
        paragraphs: [],
        facts: [],
        ...item,
      }) as unknown as CmsNewsItem,
  );
}

export async function readProjects(): Promise<CmsProject[]> {
  const entries = await readCollection("objects");
  return entries.map(
    (project) =>
      ({
        area: "",
        system: "",
        year: "",
        latitude: "",
        longitude: "",
        source: "",
        gallery: [],
        featured: false,
        ...project,
      }) as unknown as CmsProject,
  );
}

export async function readPages(): Promise<CmsPage[]> {
  return (await readCollection("pages")) as unknown as CmsPage[];
}

export async function readPage(slug: string): Promise<CmsPage | null> {
  const pages = await readPages();
  return pages.find((page) => page.slug === slug) || null;
}

export function pageText(
  page: CmsPage | null,
  key: string,
  fallback: string,
) {
  return typeof page?.[key] === "string" ? (page[key] as string) : fallback;
}

export function pageStrings(
  page: CmsPage | null,
  key: string,
  fallback: string[],
) {
  return Array.isArray(page?.[key])
    ? (page[key] as unknown[]).map(String)
    : fallback;
}

export async function readServices(): Promise<CmsService[]> {
  const entries = await readCollection("services");
  return entries.map(
    (service) =>
      ({
        short: "",
        image: "",
        lead: "",
        bullets: [],
        ...service,
      }) as unknown as CmsService,
  );
}

export async function readDocuments(): Promise<CmsDocument[]> {
  const entries = await readCollection("documents");
  return entries.map(
    (document) =>
      ({
        category: "",
        note: "",
        href: "",
        ...document,
      }) as unknown as CmsDocument,
  );
}

export async function readSiteContent(): Promise<CmsSiteContent> {
  try {
    const site = JSON.parse(
      await fs.readFile(path.join(contentRoot, "site", "index.json"), "utf8"),
    ) as JsonRecord;
    return {
      phones: Array.isArray(site.phones) ? (site.phones as CmsPhone[]) : [],
      socials: Array.isArray(site.socials)
        ? (site.socials as CmsSocial[])
        : [],
      email: String(site.email || ""),
      address: String(site.address || ""),
      contactMap: String(site.contactMap || ""),
      navigation: Array.isArray(site.navigation)
        ? site.navigation.map((item) => {
            const value = item && typeof item === "object" ? item as JsonRecord : {};
            return { title: String(value.title || ""), href: String(value.href || "") };
          }).filter((item) => item.title && item.href)
        : [],
      headerOverrides: Array.isArray(site.headerOverrides)
        ? site.headerOverrides as VisualOverride[]
        : [],
    };
  } catch {
    return {
      phones: [],
      socials: [],
      email: "",
      address: "",
      contactMap: "",
      navigation: [],
      headerOverrides: [],
    };
  }
}
