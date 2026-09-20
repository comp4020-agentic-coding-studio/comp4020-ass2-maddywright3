import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// The thesis test (see CLAUDE.md): every lecture must state its own
// domain-specific case for the course thesis, not the thesis slogan itself
// and not another week's angle.

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

interface CourseApi {
  nodes: ApiNode[];
}

const THESIS =
  "Finishing is a different skill from building, and it's the one almost everyone is worse at.";

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;
const lectures = api.nodes.filter((node) => node.type === "lectures");

const normalize = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .trim();

const words = (text: string): Set<string> => new Set(normalize(text).split(/\s+/).filter(Boolean));

function overlapRatio(a: string, b: string): number {
  const wordsA = words(a);
  const wordsB = words(b);
  const shared = [...wordsA].filter((word) => wordsB.has(word));
  return shared.length / wordsB.size;
}

describe("every lecture states its own angle on the thesis", () => {
  it("has at least one lecture", () => {
    expect(lectures.length).toBeGreaterThan(0);
  });

  for (const lecture of lectures) {
    it(`${lecture.id} has an angle`, () => {
      const angle = lecture.meta?.angle;
      expect(typeof angle, `${lecture.id} has no angle`).toBe("string");
      expect((angle as string).trim().length, `${lecture.id}'s angle is too short`).toBeGreaterThanOrEqual(40);
    });

    it(`${lecture.id}'s angle isn't the thesis sentence restated`, () => {
      const angle = lecture.meta?.angle as string | undefined;
      if (!angle) return;
      const ratio = overlapRatio(angle, THESIS);
      expect(
        ratio,
        `${lecture.id}'s angle shares ${Math.round(ratio * 100)}% of its words with the course thesis — ` +
          "restate the thesis in this week's domain, not the thesis itself",
      ).toBeLessThan(0.6);
    });
  }

  it("gives every lecture a distinct angle", () => {
    const angles = lectures
      .map((lecture) => lecture.meta?.angle)
      .filter((angle): angle is string => typeof angle === "string");

    const seen = new Map<string, string>();
    for (const [index, angle] of angles.entries()) {
      const key = normalize(angle);
      const duplicateOf = seen.get(key);
      expect(duplicateOf, `${lectures[index]?.id}'s angle duplicates ${duplicateOf}'s`).toBeUndefined();
      seen.set(key, lectures[index]?.id ?? `lecture ${index}`);
    }
  });
});
