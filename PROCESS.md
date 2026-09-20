# Process overview

## What I built

A good course should make its subject visible in the reader's own life, and
honest when its own argument breaks. SLOP1241 argues that finishing is a
different skill from building, and most are worse at it. Everyone has lived
through their own version of this. The test was never whether a week held
attention alone. It was whether the whole thing held together as one idea,
recognisable from a domain a reader would never have connected to their own
life.

## How I got here

My process settled into a clear shape once I noticed it. Let the agent
generate, then run a separate pass, mine, that catches what generation alone
would let through. Every CLAUDE.md rule exists because that pass found
something worth making permanent. Before any lecture existed, I required a
distinct angle per week, stating that week's case for the thesis, checked
mechanically so no two weeks repeated one another. I read all twelve myself,
and sent two back for feeling too similar even though the words differed
([`2f15477`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-maddywright3/commit/2f15477a213c76f4646be3030ae327eb45bc6dfd)).

Interactive mechanics got the same discipline. A first pass proposed one
shared template across all twelve weeks. I rejected that for weeks 8 and 11,
since neither domain's argument fit a cost curve or a single risk-point
diagram, and forcing one on would have added an interaction without adding to
the explanation. Bespoke builds went in instead. A mechanic must prove the
thesis or it doesn't belong, became a standing rule, which is why week 11
alone gets a mechanic that runs negative, since that week argues the thesis's
own limit
([`912bddc`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-maddywright3/commit/912bddc0d7325520d597aaa54ac16cc723ad8be5)).

The moment that changed how I worked for the rest of the build was week 6.
Early content leaned on an official-sounding defect-cost chart, attributed to
an "IBM Systems Sciences Institute." It read exactly right, so it would have
been easy to just believe it. I had it traced properly, and it dead-ended in
unreferenced 1981 internal notes with no public dataset behind them
([`87e1353`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-maddywright3/commit/87e13536b8d2668a530778411d65ce5cc0b52b27)).
I could have quietly swapped in a better number and moved on. Instead the
lecture argues the correction itself, since a course about finishing things
properly has no business citing a statistic that never finished being
checked. That near-miss changed how I sourced everything after. I re-verified
every citation across weeks 2 to 12 myself, then wrote a rule against
Wikipedia and similarly easily-edited sources, so the standard didn't depend
on luck twice
([`a8fc7c1`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-maddywright3/commit/a8fc7c1eba06052bc210ab64bdac7bafbfebf0b0)).

Not everything my second pass caught was content. A widget could get
permanently stuck, because its internal target could quietly grow past the
range input's cap, reachable through normal play, with no sign it had
happened. The fix became a guardrail: any stateful mechanic needs a visible
way back to its start, so the next thing I build by hand doesn't fail the
same way silently
([`e02ff61`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-maddywright3/commit/e02ff61c4b0998a09c3919eabc55da6f292c74a3)).

The citation discipline became something worth showing, not just enforcing
quietly. I added a page listing every source used, each tagged with the
reason it counts as primary, checked against the same test as the mechanics:
does this demonstrate the argument, or is it just a list nobody reads
([`3945ac8`](https://github.com/comp4020-agentic-coding-studio/comp4020-ass2-maddywright3/commit/3945ac85d63a72315935f57f67d4438d11a6d3e3)).

What I left unenforced, on purpose: whether the assessment is compelling, and
whether each interactive element earns its space. A check can confirm the
arithmetic and confirm a mechanic renders, neither tells me whether a slider
or a video changes what a reader understands, or is just filling a page. I
went through every one myself and cut anything that answered no. That
judgement stayed mine, since whether anyone would want to take this course
has to be decided by a person, not a script.
