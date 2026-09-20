import type { CourseMetaInput } from "astro-course-university";
import { z } from "astro/zod";

// The level digits ANU uses: 1000--4000 undergraduate, 6000 and 8000
// postgraduate. Both the code pattern and the level field derive from this.
const LEVELS = [1, 2, 3, 4, 6, 8] as const;
const allowedCode = new RegExp(`^SLOP[${LEVELS.join("")}]\\d{3}$`);

export const slopCourseMetaSchema = z
  .strictObject({
    code: z.string().regex(allowedCode, {
      message: "use SLOP plus a 1000–4000, 6000 or 8000 level code",
    }),
    title: z.string().trim().min(1).max(100),
    session: z.string().trim().min(1).max(40),
    year: z.number().int().min(2026).max(2200),
    level: z.literal(LEVELS),
    startDate: z.iso.date(),
    endDate: z.iso.date(),
    // Doubles as the SEO meta description and the homepage's lead
    // paragraph (see ContentLayout), so the upper bound is generous
    // enough for a real opening argument, not just a one-line summary.
    description: z.string().trim().min(80).max(800),
    tags: z.array(z.string().trim().min(2).max(24)).min(1).max(3),
  })
  .superRefine((course, ctx) => {
    const codeLevel = Number(course.code.at(4));
    if (course.level !== codeLevel) {
      ctx.addIssue({
        code: "custom",
        path: ["level"],
        message: `must match ${course.code}'s first digit (${codeLevel})`,
      });
    }
    if (course.startDate > course.endDate) {
      ctx.addIssue({
        code: "custom",
        path: ["startDate"],
        message: "must not be after endDate",
      });
    }
  });

// The single source of truth for the course record. The generated homepage,
// navigation label and /api/index.json all read this object.
//
// The code's last three digits were assigned to this repo when it was
// provisioned, and no other course in the cohort has them. Change the first
// digit to your course's level (and `level` to match); keep the other three.
export const courseMeta = slopCourseMetaSchema.parse({
  code: "SLOP1241",
  title: "The Last Mile",
  session: "Semester 1",
  year: 2027,
  level: 1,
  startDate: "2027-02-22",
  endDate: "2027-05-28",
  description:
    "Every project you've ever finished had a moment where it was 90% done " +
    "and somehow still cost half its budget to close out. SLOP1241 is built on " +
    "a single argument: finishing is a different skill from building, and " +
    "almost everyone is worse at it. Across twelve weeks we chase that argument " +
    "through eleven unrelated domains, why a rural broadband connection's last " +
    "customer costs as much as all the others combined, why a peer-reviewed " +
    "defect-cost multiplier gets misattributed to a study that never existed, " +
    "why 98% of a building is legally a different object to 100% of one, and " +
    "we end up with something more useful than a slogan: a working theory of " +
    "where your own last mile is hiding, and why you keep underestimating it.",
  tags: ["Case-based", "Cross-domain"],
}) satisfies CourseMetaInput;
