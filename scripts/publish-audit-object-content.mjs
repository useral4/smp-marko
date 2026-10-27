import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const base = "https://smp-marko.ru";
const password = process.env.SMP_ADMIN_PASSWORD;
if (!password) throw new Error("Set SMP_ADMIN_PASSWORD before running this script");
const login = await fetch(base + "/api/admin/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ password }),
});
if (!login.ok) throw new Error("Admin login failed: " + login.status);
const cookie = login.headers.getSetCookie().map((value) => value.split(";")[0]).join("; ");
const headers = { Cookie: cookie };
const response = await fetch(base + "/api/admin/content?type=objects", { headers });
if (!response.ok) throw new Error("Cannot read live objects: " + response.status);
const { items } = await response.json();
const slugs = ["balaev-house", "ispolkomskaya-scheme", "krasnodar-console", "marko-termo"];
const changes = [];
for (const slug of slugs) {
  const live = items.find((item) => item.slug === slug);
  if (!live) throw new Error("Object missing: " + slug);
  const desired = JSON.parse(await readFile(path.join("cms/content/objects", slug + ".json"), "utf8"));
  const patch = {};
  for (const key of ["task", "workDescription", "result", "area", "system"]) {
    if (!desired[key] || live.data[key] === desired[key]) continue;
    if (live.data[key]) throw new Error("Review existing field before overwriting: " + slug + "." + key);
    patch[key] = desired[key];
  }
  if (Object.keys(patch).length) changes.push({ slug, before: live.data, patch });
}
const backupDirectory = path.join("server-recovery", "seo-audit-2026-10-26");
await mkdir(backupDirectory, { recursive: true });
await writeFile(path.join(backupDirectory, "objects-before-" + Date.now() + ".json"), JSON.stringify(changes, null, 2));
for (const change of changes) {
  // Refetch each item to avoid overwriting changes made in the admin meanwhile.
  const currentResponse = await fetch(base + "/api/admin/content?type=objects", { headers });
  if (!currentResponse.ok) throw new Error("Cannot re-read objects");
  const current = (await currentResponse.json()).items.find((item) => item.slug === change.slug);
  if (!current || JSON.stringify(current.data) !== JSON.stringify(change.before)) {
    throw new Error("Object changed during publication: " + change.slug);
  }
  const update = await fetch(base + "/api/admin/content", {
    method: "PUT",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ type: "objects", slug: change.slug, data: { ...current.data, ...change.patch } }),
  });
  if (!update.ok) throw new Error("Update failed: " + change.slug + " " + update.status);
  console.log("Updated " + change.slug + ": " + Object.keys(change.patch).join(", "));
}
console.log("Updated objects: " + changes.length);
