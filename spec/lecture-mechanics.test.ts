import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Interactive mechanics (see CLAUDE.md): every lecture declares which
// mechanic it ships, and the built page actually carries an element of that
// kind. This can't judge whether the mechanic is good, or actually
// interactive — that's a browser check, same as slide legibility already is.

const MECHANICS = ["diagram", "calculator", "cost-curve", "quiz", "other"] as const;

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

interface CourseApi {
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
const lectures = api.nodes.filter((node) => node.type === "lectures");

const slugOf = (id: string): string => id.replace(/^lectures\//, "");

describe("every lecture declares and ships an interactive mechanic", () => {
  it("has at least one lecture", () => {
    expect(lectures.length).toBeGreaterThan(0);
  });

  for (const lecture of lectures) {
    it(`${lecture.id} declares a recognised mechanic`, () => {
      const mechanic = lecture.meta?.mechanic;
      expect(typeof mechanic, `${lecture.id} has no mechanic`).toBe("string");
      expect(
        MECHANICS.includes(mechanic as (typeof MECHANICS)[number]),
        `${lecture.id}'s mechanic "${String(mechanic)}" isn't one of ${MECHANICS.join(", ")}`,
      ).toBe(true);
    });

    it(`${lecture.id}'s page ships an element for its declared mechanic`, () => {
      const mechanic = lecture.meta?.mechanic;
      if (typeof mechanic !== "string") return;

      const pagePath = resolve("dist", "lectures", slugOf(lecture.id), "index.html");
      expect(existsSync(pagePath), `${lecture.id} doesn't build to a page`).toBe(true);

      const html = readFileSync(pagePath, "utf8");
      expect(
        html.includes(`data-last-mile-mechanic="${mechanic}"`),
        `${lecture.id} declares mechanic "${mechanic}" but its page has no ` +
          `element carrying data-last-mile-mechanic="${mechanic}"`,
      ).toBe(true);
    });
  }
});
