---
name: tessera-report
description: Generate a Tessera-branded personalized longevity report from a blood test PDF and a short lifestyle intake. Computes PhenoAge biological age, evaluates the Tessera rulebook against the user's biomarkers, and produces a long-form HTML report (Tessera design system) plus a print-ready PDF covering biological age, biomarker analysis (by panel), tier-stratified findings, and personalized protocols across Nutrition, Training, Recovery/Sleep, Supplements, and Mind. Use this when the user asks for a longevity report, biological-age report, biomarker analysis, personalized protocol, or wants to generate a sharable report for a client.
---

# Tessera Personalized Longevity Report — Skill

You are generating a high-end longevity report for a paying client of Tessera (urban-Indian, 90-day healthspan program). The deliverable is a single beautiful HTML file (Tessera-branded) plus a PDF render of the same file. The report must be **rigorous, specific, evidence-anchored, and warm** — never generic wellness fluff. Indian-cuisine-aware. Vegetarian-aware. Never makes medical diagnoses; flags Tier 1 findings for doctor review.

## Inputs

The user provides exactly two things:

1. **A blood test PDF** (Thyrocare, Redcliffe, Apollo, etc.). Path is given in the user's message, or sits in `inputs/` next to the skill folder.
2. **A filled-in lifestyle intake** — typically `intake.md` in the working folder, copied from [intake/intake-template.md](intake/intake-template.md). If the file is missing or has blank required fields, ask the user to fill it (or, if they prefer, ask the questions inline).

If either input is missing, stop and ask. Do not generate a partial report.

## Workflow

Execute these steps in order. Use TodoWrite for any run with more than 3 steps.

### Step 1 — Parse the blood test PDF

Read the PDF using the Read tool (Read supports PDF). Extract every biomarker value with its unit and the lab's reference range. Normalize units per [reference/phenoage.md](reference/phenoage.md) and [reference/biomarker-ranges.md](reference/biomarker-ranges.md). Write the parsed values into a working JSON file `parsed-biomarkers.json` in the run folder so we can audit later.

If the PDF is a scan and Read returns garbled text, fall back to asking the user to paste the values, or ask for a clearer copy.

### Step 2 — Read the intake

Read the user's filled `intake.md`. Validate required fields are present (chronological age, sex at birth, vegetarian status, primary goal). Fill any gaps by asking — never make up answers.

### Step 3 — Compute PhenoAge biological age

Follow [reference/phenoage.md](reference/phenoage.md) exactly. Use the 9 required markers + chronological age. Show the intermediate `xb` and `MortScore` values in the parsed JSON for transparency. Round biological age to 1 decimal.

If any of the 9 PhenoAge markers are missing from the panel, **do not invent values**. Compute PhenoAge as "not available" and explain in the report which marker is missing; still produce the rest of the analysis. Common missing markers: hsCRP, RDW, ALP.

### Step 4 — Evaluate the rulebook

For every biomarker in the panel, look up the rule in [reference/rulebook.md](reference/rulebook.md). Stratify findings into:

- **Tier 1** — refer to doctor (e.g., HbA1c ≥ 6.5, LDL > 190, eGFR < 60, hemoglobin < 10, severe thyroid abnormality). These must be surfaced prominently with a "Please discuss with your physician" callout.
- **Tier 2** — primary intervention target (clearly off-optimal).
- **Tier 3** — secondary target (borderline / minor deviation).
- **Tier 4** — maintain (in optimal range).

Cross-reference intake answers — e.g., elevated HOMA-IR + sedentary work = stronger Zone 2 push; elevated hsCRP + low omega-3 dietary intake = omega-3 supplementation.

### Step 5 — Compose the report

Open [templates/report-template.html](templates/report-template.html). This is the structural and stylistic skeleton — do **not** rewrite the CSS. Fill in the placeholder slots `{{...}}` with rich, personalized content. Each section's content guidance:

- **Cover** — Client first name, report date, headline biological age (e.g., "Your biological age: **34.2** — 3.8 years younger than your calendar age."). If PhenoAge couldn't be computed, lead with the top finding instead.
- **Executive summary** — 4–6 bullet findings, ranked by importance. Lead with Tier 1 (if any), then Tier 2 wins (what to fix), then Tier 4 wins (what's already great).
- **Biological age** — Explain PhenoAge, show the 9 inputs in a table, show the delta. Tone: clear, non-clinical, hopeful but honest.
- **Biomarker analysis** — Group by panel (CBC, Glucose & Insulin, Lipids, Liver, Kidney, Inflammation, Thyroid, Vitamins, Hormones, Minerals). For each marker: value · unit · optimal range · status (Optimal/Borderline/Off-target/Tier 1) · 1–3 sentence interpretation written specifically for this person's intake context. Use the `marker-row` component already styled in the template.
- **Tier 1 findings** (only if any) — A clearly-marked section with the medical-advisory callout. Specify exactly what to ask the doctor about.
- **Your personalized protocol** — Five domains, each its own card:
  1. **Nutrition** — daily protein target (g/kg), carb strategy (timing + quality), fat quality, eating window, fiber target, hydration, alcohol guidance, **Indian-cuisine-specific food list** (foods to emphasize / foods to deprioritize). 2 sample days (1 veg / 1 non-veg only if applicable).
  2. **Training** — weekly Zone 2 minutes, VO₂max sessions/week, resistance split (full body / upper-lower / push-pull-legs), mobility daily, MAF heart rate ceiling (180 − age), example week.
  3. **Recovery & Sleep** — target bedtime/waketime, wind-down protocol, morning sunlight, caffeine cutoff, alcohol guidance, breathing practice (physiological sigh / 4-7-8 / box), NSDR.
  4. **Supplements** — Only what biomarkers + intake support. Format: name · form · dose · timing · why (which biomarker / lifestyle reason). Always include a "discuss with your physician before starting" line. Never recommend anything beyond Tier-1/Tier-2 evidence-based supplements unless biomarkers specifically call for it.
  5. **Mind & Wellness** — Meditation cadence, journaling prompt, cold exposure (if appropriate), social/connection nudge, gratitude practice.
- **Your 90-day plan** — Week-by-week structure (Weeks 1–2: foundation, Weeks 3–6: build, Weeks 7–10: deepen, Weeks 11–13: peak + retest prep). Each block: 2–3 focus habits.
- **Re-test schedule** — Day 90 retest with the same panel under the same conditions (fasted 10–12h, 7–10 AM). What to expect to improve.
- **Disclaimers** — Standard "not a diagnosis", "discuss with physician", "biomarker-moving, not anti-aging" language. Already in the template — do not weaken it.

### Step 6 — Save and render

1. Save the populated HTML to `<run-folder>/report.html`.
2. Run [scripts/render-pdf.sh](scripts/render-pdf.sh) on it to produce `report.pdf` in the same folder.
3. Print the absolute paths of both files for the user.

### Step 7 — Hand-off summary

Reply to the user with:
- Headline biological age + delta (or top finding if PhenoAge incomplete)
- 3 key Tier 2 targets (one line each)
- Tier 1 findings count (if any) with the recommendation to see a doctor
- File paths to `report.html` and `report.pdf`

Keep this summary tight — under 12 lines. The report itself is the main artifact.

## Hard rules

- **Never invent a biomarker value.** If you cannot read it from the PDF, mark it "Not measured" in the report.
- **Never give medical advice that requires a physician** (dose changes to prescribed medications, contraindication overrides, diagnosis). Always escalate to "discuss with your physician."
- **Never claim anti-aging, life-extension, or reversal of aging.** Frame all language as "moving biomarkers" and "improving healthspan."
- **Never store PII outside the run folder.** No external API logs, no third-party tools.
- **Match the Tessera voice** — confident, warm, specific, evidence-anchored. No emojis. No exclamation points unless quoting the user. Inline mention of mechanism (e.g., "Zone 2 builds mitochondrial density, which improves insulin sensitivity") is encouraged where it earns its place.
- **Indian context** — meals, foods, supplements, lab brands, cultural framing. Vegetarian assumed unless intake says otherwise.

## Folder layout

```
.claude/skills/tessera-report/
├── SKILL.md                          ← you are here
├── README.md                         ← how the user runs this
├── reference/
│   ├── phenoage.md                   ← the Levine 2018 formula + unit conversions
│   ├── biomarker-ranges.md           ← optimal vs normal ranges
│   └── rulebook.md                   ← biomarker → tier → 5-domain interventions
├── intake/
│   ├── lifestyle-questionnaire.md    ← the full question set with rationale
│   └── intake-template.md            ← the blank form the user fills
├── templates/
│   └── report-template.html          ← Tessera-branded HTML (structure + CSS)
├── scripts/
│   └── render-pdf.sh                 ← Chrome headless HTML → PDF
└── examples/
    └── (generated runs are stored here per client)
```
