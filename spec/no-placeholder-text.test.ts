import { readFileSync, readdirSync, statSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

const SRC_ROOT = resolve("src");
const TEXT_EXTENSIONS = new Set([".astro", ".mdx", ".ts", ".tsx"]);

function collectFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) return collectFiles(path);
    return TEXT_EXTENSIONS.has(extname(path)) ? [path] : [];
  });
}

describe("no leftover scaffold placeholders", () => {
  it("has no STARTER_CONTENT marker left in src/", () => {
    const offenders = collectFiles(SRC_ROOT)
      .filter((path) => readFileSync(path, "utf8").includes("STARTER_CONTENT"))
      .map((path) => relative(process.cwd(), path));

    expect(offenders, "STARTER_CONTENT marks scaffold content that still needs replacing (and the marker itself removing) before it ships").toEqual([]);
  });
});
