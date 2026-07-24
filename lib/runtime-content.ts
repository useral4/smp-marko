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

type JsonRecord = Record<string, unknown>;

export type CmsSiteContent = {
  phones: CmsPhone[];
  socials: CmsSocial[];
  email: string;
  address: string;
  contactMap: string;
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
    };
  } catch {
    return {
      phones: [],
      socials: [],
      email: "",
      address: "",
      contactMap: "",
    };
  }
}
