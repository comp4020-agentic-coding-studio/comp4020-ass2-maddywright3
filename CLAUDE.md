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

## Interactive mechanics

SLOP1241 has one thesis, but the twelve weeks don't share one interactive
template — each week's mechanic is chosen to fit what that week's domain
argument actually needs.

- Week 6 (manufacturing): a cost-curve slider — drag completion from 90% to
  100% and watch cost rise steeply near the end. Demonstrates the thesis
  directly, not a static chart.
- Weeks 1, 2, 3, 4, 7: a clickable process diagram of that week's domain.
  Clicking each stage reveals whether it's the last-mile risk point, with a
  one-line explanation of why.
- Weeks 5, 9, 10: a last-mile calculator. The visitor enters a percent
  complete and it estimates remaining cost/effort/risk from that week's own
  domain-specific curve (legal filing risk, construction sign-off, aerospace
  landing risk-by-phase) — only built where a real curve exists, not
  invented to fit the template.
- Week 8 (startups): a bespoke "moving goalpost" widget. The visitor drags
  progress toward a completion target; each time they close in, the target
  itself jumps further away, with a running count of attempts. This week's
  last-mile cost isn't a steep curve, it's a target that moves as fast as
  you approach it — a fixed cost-curve or risk-diagram would misstate the
  argument, so this domain gets its own mechanic instead.
- Week 11 (overbuilding): a bespoke "polish curve" dial. As the visitor adds
  increments of polish to a hypothetical shipped feature, engineering cost
  keeps rising but user value rises, flattens, then turns negative —
  showing the point past which continued finishing actively subtracts
  value. This is the week that argues against the thesis's naive reading
  ("always finish more"), so its mechanic has to be able to go negative,
  which a plain cost-curve calculator can't do.
- Week 12 (synthesis): a reflective quiz, not a case-study mechanic — which
  of the eleven domains' last-mile problem have you personally hit? Scored
  against the eleven domains, with a one-line message per result.

Every mechanic must change what it shows in response to interaction in a way
tied to that week's specific claim — decoration that doesn't move when
touched doesn't count.

Enforced by:
- `src/content.config.ts` — `mechanic` is a required enum on the `lectures`
  schema (`diagram`, `calculator`, `cost-curve`, `quiz`, `other`). The two
  bespoke weeks still declare `other`, so the contract is uniform even where
  the implementation isn't.
- `spec/lecture-mechanics.test.ts` — checks the built API that every lecture
  declares a mechanic, and checks the built HTML that the page actually
  ships an element carrying `data-last-mile-mechanic` matching it. This
  catches a declared-but-unbuilt mechanic; it can't tell you the mechanic is
  actually good, or actually interactive — that's a browser check, same as
  slide legibility already is.

## Stateful mechanics need a way back to the start

A mechanic that accumulates state across interactions (attempts, a moving
target, anything that isn't purely a function of the current slider value)
can drift into a state its own input control can no longer reach — and then
it goes quietly, permanently unresponsive for the rest of that pageview,
with no error and nothing visibly wrong in the markup or the event wiring.

This actually happened: the week 8 moving-goalpost widget grew its target by
a fixed jump every time it was caught (`target = target + jumpAmount`), but
the range input driving it was capped at 100. With week 8's real numbers
(start 90, jump 8), the target passed 100 after just two catches, and from
then on no drag position could ever satisfy "progress >= target" again. The
event listener was never the problem — it stayed attached and kept firing
correctly. The bug was that the value it compared against had walked outside
the range the control could ever produce. It looked exactly like "stopped
responding after the first use, and scrolling away and back doesn't fix it"
— because scrolling was never involved; the state doesn't reset just because
the element leaves and re-enters the viewport, so once it's stuck, it stays
stuck until the page reloads.

- Any mechanic where interacting can move a comparison value (a target, a
  threshold, a counter) has to either keep that value inside the range its
  own input can reach, or give the visitor an explicit, visible way back to
  the start (a reset control) once it doesn't. Don't rely on a full page
  reload as the only escape hatch.
- When state does reach an end condition the input can't undo, say so in the
  live-updating text, rather than leaving the visitor to guess whether it's
  broken or finished.
- This is a reason to actually operate each stateful mechanic through several
  cycles by hand (not just click once and confirm it moved) before trusting
  it — a single interaction won't surface a state a few steps down the line.

## External sources

- Every lecture needs at least one `links:` entry pointing at a real,
  verifiable, relevant external source (a real case, article, or study)
  connected to that week's specific claim. Never invent or approximate one
  — if a genuine source can't be found for a week's claim, that's flagged
  for a decision, not filled in with a plausible-sounding guess.
- A link's URL shape being valid doesn't mean the source is real or
  relevant — that's still a human read before it's committed.
- Every `links` entry must point to a primary or authoritative source: a
  peer-reviewed paper, a primary organisation's own publication (NASA,
  Boeing, the ABA, the Council of Graduate Schools, etc.), an original
  essay or talk by its actual author, or similarly citable material. Do
  not use Wikipedia, or any other collaboratively or easily user-edited
  reference site, as a source anywhere on the site.
- When proposing a source, state in one line why it counts as primary or
  authoritative under this rule — the reasoning has to be visible
  alongside the citation, not left implicit.
- If no primary source can be found for a claim, say so and ask whether to
  soften the claim or drop it, rather than falling back to a secondary or
  easily-edited source.

Enforced by:
- `src/content.config.ts` — `links` is required, at least one entry, on the
  `lectures` schema, overriding the platform default of an optional,
  possibly-empty list.
- `spec/external-links.test.ts` — fetches every lecture's linked URL and
  fails if any doesn't resolve (a non-error HTTP status). This test depends
  on network access at check time — an accepted tradeoff, since catching a
  dead link in CI beats finding one after shipping. It can only catch a link
  that's dead, not one that's alive but irrelevant or fabricated-but-real-
  looking.

## Slide decks

Weeks 1, 6, and 12 ship a slide deck: week 1 for the synchronous,
presenter-led framing session that sets up the whole course's argument,
week 6 for the claim/debunk/surviving-finding narrative around the
defect-cost multiplier, and week 12 for the per-domain callback slides that
build to the synthesis statement. Other weeks' framing lives on the page
next to that week's interactive mechanic, and don't need a deck unless a
similar synchronous, presenter-led case for one comes up. The published spec
only requires at least one lecture to link a deck that builds
(`spec/assignment-2.test.ts`); which weeks get a deck beyond that one is a
scope decision, not a spec requirement, so it doesn't get its own mechanical
check.

## Attachments and slides must be PDF

Any downloadable attachment or slide file linked from course content — a
guest speaker's slides, a handout, anything that isn't itself a page on the
site — must be a PDF, never a proprietary format (`.pptx`, `.key`, `.doc`)
that requires specific software to open. This doesn't apply to the
in-browser Reveal.js decks under `src/decks/`, which are pages, not
attachments.

## Verify links before referencing them

Before adding any URL anywhere on the site — a `links:` entry, an inline
body link, a QR code target — actually check that it resolves (a real
fetch, not just a plausible-looking URL shape). If a link can't be
confirmed as working, say so and ask rather than referencing it anyway or
swapping in a different, unverified source silently. This is the authoring-
time version of what `spec/external-links.test.ts` already checks at build
time (see External sources, above); doing it before the link is committed
catches the problem before it ever reaches CI.

## No placeholder text

Nothing scaffold-generated ships on a real page: no "Course Title Goes
Here", no "replace me" tag pill, no lorem ipsum, no `STARTER_CONTENT`
comment left dangling because the real copy went in next to it but the
marker never got deleted. If a value still reads like an instruction to
whoever is setting up the course, rather than actual course content, it
hasn't shipped yet — it's still scaffolding.

- Replacing the content a `STARTER_CONTENT` comment points at means
  deleting the comment itself in the same edit, not leaving it behind as
  a stale note once the real copy is in.
- This applies sitewide, not just to `lectures` entries — the home page,
  nav labels, tags, and course metadata (`src/course-config.ts`) all
  count.

Enforced by:
- `spec/no-placeholder-text.test.ts` — greps every source file under
  `src/` for the literal `STARTER_CONTENT` scaffold marker and fails if
  any survive. It can only catch a placeholder that carried that marker
  — an invented tag or a vague sentence with no marker on it is still a
  human read.
