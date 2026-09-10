import { promises as fs } from "node:fs";
import path from "node:path";

const bundledContentRoot = path.join(process.cwd(), "cms", "content");
const isServerProduction =
  process.platform !== "win32" && process.env.NODE_ENV === "production";

export const usesPersistentServerStorage =
  process.env.CMS_STORAGE === "local" ||
  (isServerProduction && process.env.CMS_STORAGE !== "github");

export const contentRoot = usesPersistentServerStorage
  ? process.env.CMS_CONTENT_DIR || "/opt/smp-marko/shared/cms-content"
  : bundledContentRoot;

export const uploadRoot = usesPersistentServerStorage
  ? process.env.CMS_UPLOAD_DIR || "/opt/smp-marko/shared/uploads"
  : path.join(process.cwd(), "public", "uploads");

let contentInitialization: Promise<void> | null = null;

async function initializeContentRoot() {
  if (contentRoot === bundledContentRoot) return;

  await fs.mkdir(contentRoot, { recursive: true });
  // Репозиторий остаётся источником начального наполнения. Уже созданные или
  // изменённые в админке файлы никогда не перезаписываются при публикации кода.
  await fs.cp(bundledContentRoot, contentRoot, {
    recursive: true,
    force: false,
    errorOnExist: false,
  });
}

export function ensureContentRoot() {
  contentInitialization ||= initializeContentRoot().catch((error) => {
    contentInitialization = null;
    throw error;
  });
  return contentInitialization;
}

export async function ensureUploadRoot() {
  await fs.mkdir(uploadRoot, { recursive: true });
}
