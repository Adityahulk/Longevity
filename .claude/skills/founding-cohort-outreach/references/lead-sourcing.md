# Lead Sourcing — building a ~100-name qualified list

Use this when the founder needs *people to reach out to* and the immediate network feels thin. The
goal isn't a giant scraped list — it's ~80-120 genuinely in-ICP names you can personalize to. At
15-users scale, quality and a real personalization hook beat volume every time, so sourcing and
qualifying happen together: a name with no angle is not a lead yet.

**A hard line on how to source:** never scrape platforms, buy lists, or use automation that
violates LinkedIn/WhatsApp terms — it produces junk leads and risks the founder's accounts and
reputation. Everything here is manual-but-fast: surfacing people the founder can reach legitimately
and warmly. Claude helps *organize and qualify*, the founder (or their own logged-in browsing)
supplies the raw names.

## Tier the sources by trust (work them in this order)

Warm converts far better than cold, so exhaust the top of this list before the bottom.

1. **First-degree network.** The founder's phone contacts, WhatsApp, past colleagues, college/MBA
   batch, gym friends, anyone who's ever asked them a health question. Prompt the founder with
   jogs: "who's the most health-obsessed person you know? who just turned 40 and got spooked? which
   founder friends track their sleep?" This alone often yields 20-30.
2. **Second-degree / referrals.** For every warm contact who isn't a fit, ask who they know who is.
   Referral leads arrive pre-trusted and are the cheapest consults you'll get — bake the ask in.
3. **LinkedIn (the scalable middle) — but keyword People-search is the *weakest* method here.**
   On free LinkedIn, a raw Boolean People search matches the keyword anywhere (company names like
   "Studio Oura", a job description that happens to say "biological"), and it floods you with
   3rd-degree people you can't even message. Expect noise. Use these in order of yield instead:

   - **(a) Mine your own 1st-degree connections first.** Go to *My Network → Connections*, then
     filter/search by location and a keyword. These people already accepted you, so they're warm
     and directly messageable — far higher yield than any cold search. This is usually the single
     best LinkedIn source and gets skipped because it's unglamorous.
   - **(b) Engagement mining (best cold method).** Open recent posts by longevity/fitness creators
     the Indian ICP follows (Peter Attia, Andrew Huberman, plus Indian fitness/longevity voices)
     and *your own* relevant posts, and read the **likers and commenters**. Someone arguing about
     ApoB or Zone 2 in the comments is pre-qualified and has shown intent — far better signal than
     a profile keyword. Many will be 2nd-degree via the creator.
   - **(c) Search Posts, not People.** Use the search **Content/Posts** tab (not People) for phrases
     like `"biological age"`, `"got my bloodwork"`, `"VO2 max test"`, `"Zone 2"` and filter to
     India. The *authors* of those posts are real enthusiasts, not keyword false-positives.
   - **(d) Filter hard when you do use People search.** Set connections to **2nd** only (so there's
     a warm-intro path and you can see mutual connections), location to one metro, and lean on the
     **mutual connections** shown — an intro through a mutual beats a cold DM every time. Treat
     gadget keywords (Whoop/Oura/VO2) as weak hints, and always re-qualify against the ICP by
     actually reading the profile; discard the studios, coaches-selling-to-you, and pure
     keyword-collisions.
   - Reasonable People-search filters when needed: titles Founder / Co-founder / CTO / VP / Product
     / Partner / MD / Director at tech, startups, VC/PE, consulting, medicine; metros Bengaluru,
     Mumbai, Delhi-NCR, Hyderabad, Pune.

   Bottom line: spend your LinkedIn time on (a) your own connections and (b) engagement mining;
   treat raw keyword People-search as a last resort, because for a buyer like this it mostly
   returns noise.
4. **Communities the ICP already lives in.** Indian fitness/longevity subreddits and Discords,
   quantified-self groups, running clubs (e.g. city marathon groups), CrossFit boxes' member
   communities, founder/operator Slack and WhatsApp groups, alumni networks. Be useful there first
   (see playbook); harvest names from people who post good health questions.
5. **Local/in-person nodes.** Premium gyms, CrossFit boxes, run clubs, sports-med/physio clinics,
   functional-medicine doctors — both as direct ICP pools and as *partners* who can refer.

## Qualify fast, then log

For each name, do a 20-second ICP check before it earns a spot in the pipeline. A lead is
"qualified" when you can answer two things: **is this person plausibly in-ICP** (data-literate,
~28-50, can spend ₹28K+, already tracks health), and **what's the personalization hook** (a post, a
race, a mutual, a job change). No hook yet means status `to_contact` with a note to find one before
writing — not a message blasted into the void.

Drop anyone who's clearly out (wants quick aesthetics, no behaviour-change appetite, needs primary
clinical care) so the founder never wastes a personalized message on a non-fit. Disqualifying early
protects consult quality, which is the actual goal.

Log every qualified name into the tracker (`scripts/tracker.py add ...`) with `segment` (warm /
referral / linkedin / community / local) and the hook in `notes`. The segment matters because it
drives sequencing — warm and referral go out first.

## Processing a list the founder already has

If the founder pastes or exports a list (contacts, a LinkedIn connections CSV, event attendees,
newsletter signups), don't just dump it into outreach. Run it through the same qualify step: tag
each row in-ICP / maybe / out, attach a hook where you can spot one, and load the in-ICP + maybe
rows into the tracker. Then propose the first batch to message, warmest first. Turning a raw 200-row
export into a clean, ranked, hook-annotated shortlist is exactly the kind of grunt work to automate
here — just stop short of writing to people without the founder's review.

## How many names for 15 consults

Per the funnel math (`funnel-and-tracker.md`), plan on roughly **30 warm + ~120 LinkedIn prospects
+ steady community presence** to land 15 consults with conservative cold rates. So a healthy
starting list is ~150 names total, front-loaded with every warm contact you can surface. You will
almost always need fewer if warm network and referrals over-deliver — re-forecast from real reply
rates after the first ~40 sends rather than grinding the full cold list on faith.
