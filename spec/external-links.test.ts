import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// External sources (see CLAUDE.md): every linked source must actually
// resolve. This needs network access at check time — accepted tradeoff,
// since catching a dead link in CI beats finding one after shipping. It can
// only catch a link that's dead, not one that's alive but irrelevant or
// fabricated-but-real-looking; that's still a human read before it's
// committed.

interface IndexNode {
  id: string;
}

interface CourseIndex {
  nodes: IndexNode[];
}

interface ApiNode {
  id: string;
  links?: { label: string; url: string }[];
}

// The aggregate dist/api/index.json never carries a `links` field (see
// astro-course-university's generateIndexJson) — only each node's own
// dist/api/<id>.json does (generateNodeJson). So the index is only used here
// to enumerate node ids; the actual link data comes from the per-node files.
const index = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseIndex;

const urlToNodes = new Map<string, string[]>();
for (const { id } of index.nodes) {
  const nodePath = resolve(`dist/api/${id}.json`);
  let node: ApiNode;
  try {
    node = JSON.parse(readFileSync(nodePath, "utf8")) as ApiNode;
  } catch {
    continue;
  }
  for (const link of node.links ?? []) {
    urlToNodes.set(link.url, [...(urlToNodes.get(link.url) ?? []), id]);
  }
}

async function resolves(url: string): Promise<{ ok: boolean; detail: string }> {
  const attempt = async (method: "HEAD" | "GET"): Promise<Response> =>
    fetch(url, { method, redirect: "follow", signal: AbortSignal.timeout(10_000) });

  try {
    let response = await attempt("HEAD");
    if (response.status === 405 || response.status === 501) {
      response = await attempt("GET");
    }
    return { ok: response.ok, detail: `HTTP ${response.status}` };
  } catch (error) {
    return { ok: false, detail: error instanceof Error ? error.message : String(error) };
  }
}

describe("every external source link resolves", () => {
  if (urlToNodes.size === 0) {
    it.skip("no links to check yet", () => {});
  }

  for (const [url, nodeIds] of urlToNodes) {
    it(
      `${url} (linked from ${nodeIds.join(", ")})`,
      async () => {
        const result = await resolves(url);
        expect(result.ok, `${url} did not resolve: ${result.detail}`).toBe(true);
      },
      15_000,
    );
  }
});
