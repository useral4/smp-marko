import { existsSync } from "node:fs";

if (!existsSync("out/index.html")) {
  throw new Error("Next.js static export was not created");
}
