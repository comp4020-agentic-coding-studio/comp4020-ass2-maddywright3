# Course harness — SLOP1241: The Last Mile

Rules the agent holds itself to while building this course's content and
checks. Added as they're decided, not all at once.

## The thesis test

SLOP1241's argument, held across all twelve weeks: "Finishing is a different
skill from building, and it's the one almost everyone is worse at." Each week
looks at that gap in a different domain (software that's basically done but
never ships, a thesis missing its conclusion, a restaurant that nails the food
and neglects the bathroom, and so on).

Every `lectures` entry must make that argument in its own domain, not just
pick a topic that happens to be about finishing. Concretely:

- Every lecture's frontmatter carries a required `angle:` field — one
  sentence, in the instructor's argumentative voice, stating *that week's*
  case for the thesis in *that week's* domain. Specific enough that moving it
  to a different week's lecture would read as wrong.
- `sessions` entries don't carry `angle:` — sessions are logistics
  (what to bring, what happens, what leaves), not domain content, so the
  thesis test doesn't apply to them.
- Write the angle first, before the lecture body. The body is the argument
  worked out in detail; the angle is the argument stated in one sentence.
- Don't reuse the thesis sentence itself as the angle, and don't reuse one
  week's angle for another — each is checked for this mechanically (see
  below), so a placeholder or copy-pasted angle fails the build/spec on
  purpose.

Enforced by:
- `src/content.config.ts` — `angle` is a required, length-bounded string on
  the `lectures` schema. A lecture with no angle, or a too-short one, fails
  the build.
- `spec/thesis-angle.test.ts` — checks the built API: every lecture has an
  angle, no two lectures share one, and none is a near-verbatim copy of the
  course thesis sentence.

## Further content rules

- Every week must name the specific "last mile" cost in its domain — what
  makes the final stretch *expensive*, not merely slow. "It takes a while" is
  not an answer; "the fix touches the thing everyone else already built on"
  is.
- No week may be just a case study with no argument. Each week has to extend
  or complicate the thesis — sharpen it, find its limit, show where it
  predicts something surprising — not just supply another example that
  illustrates the same claim again.
- The register stays personal and opinionated throughout: written with
  conviction, like someone who has been burned by unfinished things before.
  No neutral, encyclopaedia-style paragraphs — if a paragraph could be lifted
  into a textbook unchanged, rewrite it.
- The assessment must ask students to apply the framework to a real
  unfinished thing (theirs, or one they go find), not to summarise the
  lectures back.
