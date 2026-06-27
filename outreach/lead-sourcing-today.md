# Get 50 Qualified Leads — Today (≈2.5 hrs)

Goal: end today with **50 in-ICP names in `pipeline.csv`**, each with a personalization hook, warmest
first. You find the names (you're logged into your own accounts); I qualify, log, and personalize.

Target mix (warm converts best, so it's front-loaded):
- **20 warm** — people who already know you
- **5 referral targets** — warm contacts who *know* fits
- **20 LinkedIn** — searched + qualified
- **5 community** — harvested from where the ICP hangs out

ICP reminder (the 20-second test for every name): data-literate, ~28-50, can spend ₹28K+, already
tracks health (Oura/Whoop/Apple Watch), and has felt the limits of a "your reports are normal"
checkup. Indian metros: Bengaluru, Mumbai, Delhi/Gurgaon, Hyderabad, Pune.

How to capture names: open `outreach/leads-intake.csv` and type one row per person (or just paste a
list into chat). Don't over-think columns — name + where you'd reach them + a one-line hook is
enough. I'll clean, qualify, and load them into the tracker.

---

## Step 1 — Warm brain-dump · 30 min · target 20

Don't judge, just dump. Go through your phone contacts and WhatsApp top chats and answer these
jogs — each usually surfaces a few names:
- Who's the most health-obsessed person you know? Who has the Whoop/Oura and a bloodwork spreadsheet?
- Which founder/operator friends track their sleep, training, or fasting?
- Who just turned 40 (or is about to) and got a bit spooked about health?
- Who's complained that their "reports are normal" but they still feel off?
- Which doctor / fitness-coach / CrossFit or running friends would *get* this instantly?
- Who did you already casually tell about Antiaging Labs who said "oh interesting"?

Put each in the intake sheet, `segment = warm`, with the hook (e.g. "does Hyrox, always posting PRs").

## Step 2 — Referral targets · 10 min · target 5

Now flip it: 5 people who may not be the user themselves but *know* a cluster of fits — the
personal trainer, the gym owner, the doctor friend, the founder who knows every other founder.
Mark them `segment = referral`, hook = "knows the Bangalore running crowd." You'll ask these for an
intro, not a sale.

## Step 3 — LinkedIn · 45 min · target 20

Raw keyword People-search is the *weakest* way to do this — it matches the keyword in company names
("Studio Oura") and job descriptions, and floods you with 3rd-degree people you can't message. Skip
it. Do these instead, in order of yield:

**3a · Your own connections (15 min, highest yield).** Go to **My Network → Connections**, then use
the search/filter box (location + a keyword like "founder", "fitness", "doctor"). You already know
these people and can message them directly — this is the richest seam and everyone skips it. Grab
anyone in-ICP; log `segment = warm` (they're a warm connection, not a cold lead).

**3b · Engagement mining (20 min, best cold method).** Open recent posts by creators your ICP
follows — Peter Attia, Andrew Huberman, and Indian fitness/longevity voices — plus any of your own
relevant posts. Read the **likers and commenters**. Someone arguing about ApoB or Zone 2 has shown
real intent and is often 2nd-degree via the creator. Grab 10-12; `segment = linkedin`, hook = what
they commented.

**3c · Posts search, not People (10 min).** In LinkedIn search, switch the tab to **Posts** (not
People) and search `"biological age"`, `"got my bloodwork"`, `"VO2 max test"`, `"Zone 2"`, filtered
to India. The *authors* are real enthusiasts. Grab a few.

If you do fall back to People search: set connections filter to **2nd only**, one metro, and use the
**mutual connections** it shows to line up a warm intro. Always open the profile and re-check the
ICP — discard studios, coaches selling *to* you, and keyword collisions.

Log with the profile URL in the intake sheet so I can personalize.

## Step 4 — Communities · 20 min · target 5

Find 2-3 places your ICP already gathers and grab 5 names of people posting good health questions:
- Indian fitness/longevity subreddits and Discords (search Reddit for "India longevity",
  "India biohacking", your city's fitness sub).
- Your city's **running club / CrossFit box / Hyrox** group (Instagram + WhatsApp communities).
- Founder/operator Slack & WhatsApp groups you're already in.
- Quantified-self / Huberman-fan India groups.

`segment = community`, hook = the thing they posted. (Don't cold-DM yet — Step is just to capture
names; the playbook says be useful in these first.)

## Step 5 — Qualify & sort · 15 min

Hand me the sheet (or paste it). I will:
- tag each row **in / maybe / out** against the ICP,
- make sure every kept row has a hook (flag the ones that need one),
- load the in + maybe rows into `pipeline.csv`,
- and hand back the list **sorted warmest-first** so you know exactly who to message first tomorrow.

---

## The tracker commands you'll actually use

```bash
T=".claude/skills/founding-cohort-outreach/scripts/tracker.py"
python3 $T list --path outreach/pipeline.csv            # see everyone
python3 $T followups --path outreach/pipeline.csv       # who needs a touch today
python3 $T stats --path outreach/pipeline.csv           # reply / show / close rates vs goal of 15
# I'll handle the bulk add when you give me the names.
```

## Reality check on the number

50 leads ≈ the right *starting* list. Per the funnel, ~30 warm + ~120 LinkedIn → ~15-20 booked →
~10-15 members, so you'll keep adding LinkedIn names over the next 2 weeks. Today is about getting
the first 50 logged and the warm 25 ready to message tomorrow morning.
