import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// External sources (see CLAUDE.md): every linked source must actually
// resolve. This needs network access at check time — accepted tradeoff,
// since catching a dead link in CI beats finding one after shipping. It can
// only catch a link that's dead, not one that's alive but irrelevant or
// fabricated-but-real-looking; that's still a human read before it's
// committed.

interface ApiNode {
  id: string;
  links: { label: string; url: string }[];
}

interface CourseApi {
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;

const urlToNodes = new Map<string, string[]>();
for (const node of api.nodes) {
  for (const link of node.links ?? []) {
    urlToNodes.set(link.url, [...(urlToNodes.get(link.url) ?? []), node.id]);
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
    it(`${url} (linked from ${nodeIds.join(", ")})`, async () => {
      const result = await resolves(url);
      expect(result.ok, `${url} did not resolve: ${result.detail}`).toBe(true);
    });
  }
});
