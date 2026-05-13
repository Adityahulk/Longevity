# Tessera Report Skill — How to use

A Claude skill that turns a blood test PDF + a short lifestyle intake into a beautiful Tessera-branded longevity report (HTML you can host on the site, plus a print-ready PDF).

## The 3-step workflow

### 1. Set up a run folder

Create a folder for the client (anywhere — keep them outside the repo if they contain PII you don't want in git). Inside, place exactly two files:

```
my-clients/aditya-2026-05/
├── blood-test.pdf       ← the lab PDF from Thyrocare / Redcliffe / etc.
└── intake.md            ← copy of intake-template.md, filled in
```

To get a blank intake, copy [intake/intake-template.md](intake/intake-template.md) into your run folder and rename it to `intake.md`. Fill in the required fields (marked `[required]`). Leave optional ones as `--` if you don't know.

### 2. Tell Claude to generate the report

In a Claude Code session running in this repo, say:

> *"Generate a Tessera report from `my-clients/aditya-2026-05/`."*

(or whatever path you used). Claude will:

1. Read the blood test PDF and extract biomarker values.
2. Read `intake.md` and validate required fields.
3. Compute PhenoAge biological age.
4. Evaluate every triggered rule from the Tessera rulebook.
5. Compose the personalized HTML report.
6. Render it to a PDF via headless Chrome.
7. Reply with file paths + a tight summary.

If the intake is missing fields, Claude will ask you to fill them in or paste the answers in chat.

### 3. Share the report

The run folder will now contain:

```
my-clients/aditya-2026-05/
├── blood-test.pdf
├── intake.md
├── parsed-biomarkers.json    ← audit trail of what was read from the PDF
├── report.html               ← share / host on the site
└── report.pdf                ← attach to email / WhatsApp
```

Drop `report.html` into the `Longevity/` repo (e.g. as `reports/aditya-2026-05.html`) or onto any static host. Send the PDF in WhatsApp / email.

## What's inside the skill

```
.claude/skills/tessera-report/
├── SKILL.md                          ← instructions Claude follows
├── README.md                         ← this file
├── reference/
│   ├── phenoage.md                   ← Levine 2018 formula + unit conversions
│   ├── biomarker-ranges.md           ← optimal vs normal ranges
│   └── rulebook.md                   ← biomarker → tier → 5-domain interventions
├── intake/
│   ├── lifestyle-questionnaire.md    ← full question set with rationale
│   └── intake-template.md            ← the blank form to copy
├── templates/
│   └── report-template.html          ← Tessera-branded HTML + print CSS
├── scripts/
│   └── render-pdf.sh                 ← Chrome headless HTML→PDF
└── examples/                         ← (your generated runs)
```

## What the report contains

A long-form, magazine-style report with these sections:

1. **Cover** — name, date, headline biological age vs. chronological
2. **Executive summary** — 4–6 ranked findings
3. **Medical-advisory findings** (only if Tier 1 markers are present) — physician-referral callouts
4. **Biological age** — PhenoAge with the 9 inputs shown
5. **Biomarker analysis** — full panel grouped (CBC · Glucose & Insulin · Lipids · Liver · Kidney · Inflammation · Thyroid · Vitamins · Hormones · Minerals), each marker with value, optimal range, status badge, and a written interpretation specific to this person
6. **Your protocol** — five domain cards: Nutrition, Training, Recovery & Sleep, Supplements, Mind & Wellness
7. **The 90-day plan** — week-by-week cadence
8. **The Day-90 re-test** — what to retest, what to expect
9. **Important notes** — medical disclaimers, DPDP privacy

## Customizing the look

Brand and design are baked into `templates/report-template.html`. Change colors / fonts there once; every future report inherits the change.

Key tokens (top of the file):

```
--cream / --paper       backgrounds
--ink / --ink-soft      body text
--accent                #B85426 burnt orange (the headline color)
--leaf / --gold         secondary status colors
--serif                 Fraunces (headlines)
--sans                  Inter (body)
--mono                  JetBrains Mono (data + labels)
```

## Troubleshooting

**The PDF render script fails.** You need a Chrome-family browser installed (Chrome, Chromium, Brave, or Edge). Or just open `report.html` in any browser and print → save as PDF.

**Claude can't read the PDF.** If the lab gave you a scanned (image) PDF rather than a text PDF, the parse may fail. Two options: (a) ask the lab for the text version, (b) paste the biomarker values into chat and Claude will use those.

**A biomarker is missing.** The report will mark it "Not measured" and proceed. If one of the 9 PhenoAge inputs is missing (most common: hsCRP, RDW, or ALP), biological age cannot be computed and the report will say so — the rest of the analysis still runs.

**The intake isn't getting captured well.** Edit `intake/lifestyle-questionnaire.md` to add/remove questions, and update `intake/intake-template.md` to match.

**You want a different rule applied.** Edit `reference/rulebook.md`. Rules are written in plain language; add new ones in the same `R-<DOMAIN>-<NN>` format and they'll be picked up next run.

## Privacy reminder

Blood test reports + intake answers are personal health data. Store run folders outside the public git repo, or `.gitignore` them. Don't commit a client's `report.html` or PDF to a public repo without their written consent.
