# Funnel Math, Weekly Plan & Tracker

Use this when the founder wants a plan ("how do I actually get 15"), a weekly schedule, or pipeline
tracking. The point of the math is honesty: 15 booked consults is a *volume* problem as much as a
copy problem, and the founder needs to see how many real conversations that takes so they don't
quit after 20 DMs.

## Funnel math (plan with conservative numbers, then beat them)

Work backwards from the goal. These rates are deliberately conservative for cold-ish outreach by a
founder with a real product and a sharp wedge; warm network converts far better, which is why it
goes first.

```
Goal: 15 booked consults

Warm network (do this first — much higher conversion):
  ~30 warm/referral messages → ~40% reply → ~50% of those book   ≈ 6 consults

Targeted LinkedIn (the scalable engine):
  ~120 connection requests → ~40% accept (≈48) 
  → DM all 48 → ~30% reply (≈14) → ~50% book                     ≈ 7 consults

Communities / inbound from content:
  Useful public participation + a few posts                      ≈ 2 consults
                                                                  ----------
                                                          Total ≈ 15 consults
```

Translation: roughly **30 warm touches + ~120 LinkedIn connects + ~50 LinkedIn DMs + steady
community presence** over 2-3 weeks. Adjust the numbers as real reply rates come in — after the
first ~40 sends you'll have actual rates, and you should re-forecast from those, not these
defaults. If warm network over-delivers (it often does), you need far less cold volume.

**The funnel doesn't end at "booked."** 15 *booked* consults is not 15 users — two more stages
decide whether the work pays off, and both are fixable:

```
15 booked consults
  → confirmations/reminders sent  → ~70-80% show up      ≈ 11-12 calls happen
  → honest, well-prepped calls    → ~50-70% become members ≈ 6-8 members
```

So if the real goal is ~10-15 *members*, plan to **book ~20-25 consults**, not 15 — because some
ghost and not every good call closes. Two levers protect this back half: reminder messages that cut
no-shows (see playbook's "Confirmations & no-show reduction"), and consult preparation + honest
objection handling that lifts close rate (see `consult-conversion.md`). A founder who only optimizes
the front of the funnel (more DMs) while leaking 50% at the call is pushing on the wrong lever.

The most important lever is **not** clever copy — it's whether the people are actually in-ICP and
whether the first line is personalized. A tight list of 80 real fits beats a sloppy 300.

## Two-to-three week plan

Front-load the warm network (fast wins, momentum, and referrals that feed later weeks), run
LinkedIn as the steady engine, and let content compound underneath.

**Week 0 (half a day, setup):**
- Tune the founder's LinkedIn headline/about so it says what Antiaging Labs is (the profile *is*
  the landing page when someone gets a DM).
- Build the first target list: brain-dump 30 warm contacts + 40-50 LinkedIn prospects against the
  ICP rubric. Use `scripts/tracker.py` to start the pipeline file.
- Draft the first build-in-public post.

**Week 1 — warm + ignite:**
- Send all ~30 warm/referral messages (spread across the week, personalized).
- Post the build-in-public piece; reply to every comment.
- Start LinkedIn: ~20 connection requests/day with notes.
- Log every send and reply in the tracker; book consults as they come.

**Week 2 — scale LinkedIn + communities:**
- DM everyone who accepted last week.
- Keep ~20 connects/day going.
- Post one educational piece; spend 20-30 min/day being useful in 2-3 communities.
- One value-add follow-up to non-repliers from Week 1 (the sample report).

**Week 3 — convert + referrals:**
- Work the follow-ups, fill remaining consult slots.
- Ask everyone who booked (and everyone warm) for one referral — referrals are the cheapest
  consults you'll get and they compound past the first 15.

**Daily quota during active weeks (≈45-60 min):** 20 LinkedIn connects · DM yesterday's accepts ·
5 warm/referral touches · 20-30 min useful community presence · update tracker. Small and daily
beats a heroic batch once a week.

## Pipeline tracker

A founder juggling three channels will lose people without a list. Keep one CSV as the single
source of truth: who, channel, status, last touch, next action. Use `scripts/tracker.py` to create
it and append/update rows so you're never hand-formatting CSV.

**Columns:** `name, channel, segment, profile_or_contact, status, last_contacted, next_action,
notes`

**Status values (a simple pipeline):**
`to_contact → contacted → replied → consult_booked → consult_done → member` plus `no_show`
(booked then ghosted — send the reschedule nudge) and `passed` (not a fit / declined) so the
founder can stop chasing dead leads. `stats` reports reply rate, booking rate, show rate, and
close rate, so you can see *which* stage is leaking and push the right lever.

**How to use it in a session:** when you draft outreach for someone, also emit/append their tracker
row (status `contacted`, `next_action` = "await reply, follow up in 3d"). When the founder reports
back ("Priya replied", "Arjun booked"), update the row. At any point the founder can ask "who do I
need to follow up with today?" and you read the tracker and answer.

Default tracker location: `outreach/pipeline.csv` under the project (create the folder if needed).
Confirm the path with the founder the first time.

## Reporting progress

When asked "where am I," summarize from the tracker, not from vibes: counts by status (e.g. "62
contacted, 19 replied, 8 consults booked, 5 done, 2 members"), the implied reply/booking rates so
far, and the 3-5 highest-value next actions for today. Honest numbers tell the founder whether to
push more volume, tighten the list, or fix the copy.
