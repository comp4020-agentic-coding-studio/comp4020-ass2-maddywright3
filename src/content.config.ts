import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { courseNodeSchema } from "astro-course-university/schemas";

const weekSchema = z.coerce.number().int().min(1).max(12);
const courseNodeLoader = (dir: string) =>
  glob({ pattern: ["**/*.{md,mdx}", "!**/CLAUDE.md"], base: `src/content/${dir}` });
const teacherRefs = z.array(reference("people")).min(1);

const weightedMarking = z
  .object({
    mode: z.literal("weighted"),
    criteria: z
      .array(z.object({ name: z.string().trim().min(1), weight: z.number().positive() }))
      .min(1),
  })
  .superRefine((marking, ctx) => {
    const total = marking.criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
    if (total !== 100) {
      ctx.addIssue({
        code: "custom",
        path: ["criteria"],
        message: `criterion weights sum to ${total}, not 100`,
      });
    }
  });

const holisticMarking = z.object({
  mode: z.literal("holistic"),
  description: z.string().trim().min(40),
});

export const collections = {
  sessions: defineCollection({
    loader: courseNodeLoader("sessions"),
    schema: courseNodeSchema
      .extend({
        week: weekSchema,
        date: z.coerce.date(),
        teachers: teacherRefs.optional(),
      })
      .loose(),
  }),

  assessments: defineCollection({
    loader: courseNodeLoader("assessments"),
    schema: courseNodeSchema
      .extend({
        week: weekSchema,
        due: z.coerce.date(),
        weight: z.coerce.number().positive().max(100),
        marking: z.discriminatedUnion("mode", [weightedMarking, holisticMarking]).optional(),
      })
      .loose(),
  }),

  lectures: defineCollection({
    loader: courseNodeLoader("lectures"),
    schema: courseNodeSchema
      .extend({
        week: weekSchema,
        date: z.coerce.date(),
        teachers: teacherRefs.optional(),
        slides: z
          .string()
          .regex(/^\/decks\/[a-z0-9-]+\/$/)
          .optional(),
        // The thesis test (see CLAUDE.md): this week's one-sentence case for
        // the course thesis, in this week's domain.
        angle: z.string().trim().min(40).max(200),
        // Interactive mechanics (see CLAUDE.md): which mechanic this week's
        // page ships. "other" covers the two bespoke, domain-forced builds
        // (moving goalpost, polish curve) rather than mis-fitting them into
        // diagram/calculator/cost-curve.
        mechanic: z.enum(["diagram", "calculator", "cost-curve", "quiz", "other"]),
        // External sources (see CLAUDE.md): overrides the platform default
        // of an optional, possibly-empty list — a lecture needs at least one
        // real, verified source connected to its specific claim. sourceType
        // mirrors CLAUDE.md's own four categories for what counts as primary
        // or authoritative, plus "secondary" as an honest escape hatch for
        // the handful of already-chosen sources that don't actually clear
        // that bar — the citation ledger (/citations/) surfaces those
        // plainly rather than mislabelling them to force a clean answer.
        links: z
          .array(
            z.object({
              label: z.string(),
              url: z.url(),
              sourceType: z.enum([
                "peer-reviewed",
                "primary-org",
                "original-work",
                "citable-other",
                "secondary",
              ]),
              why: z.string().trim().min(20),
            }),
          )
          .min(1),
        // Cost/risk curve backing that week's own CostCurveSlider or
        // LastMileCalculator mechanic. Frontmatter is the single source of
        // truth: the mechanic component and the /lectures/ syllabus timeline
        // (SyllabusTimeline.astro) both read it via `frontmatter.costCurve`
        // rather than each keeping its own copy. Only weeks 5, 6, 9, 10 have
        // one — see CLAUDE.md's "only built where a real curve exists" rule.
        costCurve: z
          .object({
            unit: z.string(),
            points: z.array(z.object({ percent: z.number(), cost: z.number() })).min(2),
          })
          .optional(),
        // Week 11's polish-curve dial plots two series against a different
        // axis (polish increments, not percent complete), so it needs its
        // own shape rather than being forced into costCurve's.
        polishCurve: z
          .object({
            points: z
              .array(
                z.object({
                  polish: z.number(),
                  engineeringCost: z.number(),
                  userValue: z.number(),
                }),
              )
              .min(2),
          })
          .optional(),
      })
      .loose(),
  }),

  people: defineCollection({
    loader: courseNodeLoader("people"),
    schema: ({ image }) =>
      z
        .object({
          title: z.string().trim().min(1),
          description: z.string().trim().min(40),
          role: z.string().trim().min(1),
          contact: z.string().trim().min(1).optional(),
          affiliation: z.string().trim().min(1).optional(),
          email: z.email().optional(),
          url: z.url().optional(),
          photo: image().optional(),
          photoAlt: z.string().trim().optional(),
          published: z.coerce.boolean().default(true),
        })
        .superRefine((person, ctx) => {
          if (person.photo && !person.photoAlt) {
            ctx.addIssue({
              code: "custom",
              path: ["photoAlt"],
              message: "describe the photo when one is supplied",
            });
          }
        }),
  }),
};
