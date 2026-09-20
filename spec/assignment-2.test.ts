import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

// Assignment 2's published spec (comp4020-ass2), turned into checks for the
// lines a test can hold. See spec/README.md for the ones left to the crit.

interface ApiNode {
  id: string;
  type: string;
  meta?: Record<string, unknown>;
}

interface CourseApi {
  course: { code: string };
  nodes: ApiNode[];
}

const api = JSON.parse(readFileSync(resolve("dist/api/index.json"), "utf8")) as CourseApi;

// The three digits provisioning assigned this repo are recorded nowhere but
// the initial commit's message ("course code: SLOPxxxx"), so read them from
// history rather than hardcoding a value that could silently go stale.
function provisionedCodeSuffix(): string {
  const log = execFileSync("git", ["log", "--all", "--grep=^course code: SLOP", "--format=%s"], {
    encoding: "utf8",
  });
  const match = log.match(/^course code: SLOP\d(\d{3})$/m);
  if (!match) throw new Error("no 'course code: SLOPxxx' commit found in history");
  return match[1];
}

describe("SLOP course code", () => {
  it("keeps the three digits the repo was provisioned with", () => {
    expect(api.course.code).toMatch(new RegExp(`^SLOP[1234 68]${provisionedCodeSuffix()}$`));
  });
});

describe("twelve dated teaching weeks", () => {
  it("has a session or lecture dated in every week 1-12", () => {
    const weeks = new Set(
      api.nodes
        .filter((node) => node.type === "sessions" || node.type === "lectures")
        .map((node) => node.meta?.week),
    );
    for (let week = 1; week <= 12; week++) {
      expect(weeks.has(week), `no session or lecture for week ${week}`).toBe(true);
    }
  });
});

describe("a real deck", () => {
  it("has at least one lecture linking to a deck that actually built", () => {
    const decks = api.nodes
      .filter((node) => node.type === "lectures")
      .map((node) => node.meta?.slides)
      .filter((slides): slides is string => typeof slides === "string");

    expect(decks.length, "no lecture has a slides: link").toBeGreaterThan(0);

    for (const slides of decks) {
      const deckPage = resolve("dist", slides.replace(/^\//, ""), "index.html");
      expect(existsSync(deckPage), `${slides} doesn't build to a page`).toBe(true);
    }
  });
});

describe("assessment weights", () => {
  it("add up to 100%", () => {
    const total = api.nodes
      .filter((node) => node.type === "assessments")
      .reduce((sum, node) => sum + (Number(node.meta?.weight) || 0), 0);
    expect(total).toBe(100);
  });
});
