---
title: Cost of Quality, by Catch Point
description:
  An analytical lab — calculate cost-of-quality at different inspection
  points using real multiplier data, and justify an inspection budget
week: 6
date: 2027-03-29
teachers:
  - idris-fenn
spec:
  - uses the Boehm and Basili replicated multiplier (not the debunked "IBM
    Systems Sciences Institute" chart) as the basis for the calculation,
    and says so
  - calculates total expected cost under at least two different inspection
    budgets, not just one
  - recommends a specific inspection spend and justifies it against the
    numbers calculated, not against a vibe
related:
  - lectures/week-06
---

Pairs. You're given a fictional production run with a known defect
injection rate and a choice of how much to spend on inspection at each of
three stages (design, implementation, testing). Using the peer-reviewed
multiplier week 6's lecture surfaces — roughly 100x more expensive to fix
post-release than at design, dropping closer to 5:1 on small non-critical
work — calculate total expected cost under a low-inspection and a
high-inspection budget, and recommend one.

## Before the lab

Read week 6's lecture carefully — it spends real effort distinguishing a
number that replicates from one that doesn't, and this lab is graded on
using the right one.

## In the lab

Work the numbers as a pair, then write a short justification: which
inspection budget you'd actually recommend, and why the multiplier alone
doesn't answer that question (inspection has its own cost, so more
isn't automatically better — the lecture's whole complication was that
skipping it doesn't remove cost, it relocates it, not that inspection is
free).

## Submitting

The worked calculation for both budgets and the recommendation, from the
pair. Due Wednesday 31 March, 5pm — earlier than this course's usual Friday
lab deadline, deliberately, so it doesn't collide with Assignment 1's
Friday due date the same week.

Pairs of two.
