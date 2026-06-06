---
name: tessera-pipeline
description: Top-level orchestrator for the Tessera personalized longevity protocol. Chains the full pipeline — parse a blood-test PDF, run the deep intake, evaluate the rulebook, classify phenotype + root causes, screen for drug/supplement safety, author the 5-domain protocol, and compose a beautiful Tessera-branded HTML+PDF report. Use this whenever a user asks for a longevity report, biological age, personalized protocol, biomarker analysis, or "best personalized longevity plan." This is the new entry point that replaces the monolithic tessera-report skill.
---

# Tessera Pipeline — Orchestrator

You are running the **end-to-end Tessera longevity protocol pipeline**. The deliverable is a single beautiful Tessera-branded `report.html` + `report.pdf`, produced by chaining 7 specialist skills + 1 shared knowledge library.

## What this skill does (10,000-ft view)

```
blood-test.pdf  ─►  tessera-lab-parse        ─►  biomarkers.json + panel-completeness.json
                                                 │
intake answers  ─►  tessera-intake-v2        ─►  intake.json
                                                 │
(optional)       ─►  tessera-wearable-ingest ─►  wearable.json
(optional)       ─►  tessera-genetics-ingest ─►  genetics.json
                                                 │
                                                 ▼
                    tessera-rule-evaluate     ─►  rule-evaluation.json
                                                 │
                                                 ▼
                    tessera-rootcause-phenotype ─► phenotype.json + rootcause.json
                                                 │
                                                 ▼
                    tessera-safety-screen     ─►  safety.json
                                                 │
                                                 ▼
                    tessera-protocol-author   ─►  protocol.json
                                                 │
                                                 ▼
                    tessera-report-compose    ─►  report.html + report.pdf
                                                 │
                                                 ▼
                    run-manifest.json (versions, hashes, timestamps)
```

## Inputs (from the user)

The user must provide:

1. **A blood-test PDF** — Indian lab format (Thyrocare / Redcliffe / Apollo / SRL / Dr. Lal / Tata 1mg / Healthians / MFine). Path given in their message or in `inputs/blood-test.pdf` next to the working folder.
2. **Identity & intake answers** — collected by `tessera-intake-v2` inline if not provided as `intake.md`.

Optional:

3. **Wearable export** — Apple Health XML / Oura CSV / Whoop CSV / Garmin TCX (Phase D — currently stub-only, pipeline accepts `wearable: null`).
4. **Genetics export** — 23andMe / MyHeritage raw text (Phase D — currently stub-only, pipeline accepts `genetics: null`).

## Workflow

Execute these steps strictly in order. Use TodoWrite to track if more than 3 steps. Save every intermediate JSON to the run folder for auditability.

### Step 1 — Set up the run folder

Create `<run-folder>/` (e.g., `examples/aditya-2026-05/`). All JSON artifacts and the final report live here. If the user gave a folder path, use it; else default to `examples/<first-name>-<YYYY-MM>/`.

### Step 2 — Parse the lab PDF

Invoke the **tessera-lab-parse** workflow on the user's PDF. Read `.Codex/skills/tessera-lab-parse/SKILL.md` for the parse contract. Output: `biomarkers.json` + `panel-completeness.json`.

If the PDF is unparseable (image-only scan, corruption), fall back to asking the user to paste values. Never invent values.

### Step 3 — Run intake-v2

Invoke the **tessera-intake-v2** workflow. Read `.Codex/skills/tessera-intake-v2/SKILL.md`. The intake-v2 has 5 modules (base + HPI + family-depth + constraints + environment + mental-health-screen). If `intake.md` is provided, parse it; if not, ask each module's questions inline.

Output: `intake.json`. Required modules: base identity, body & medical, diet, exercise, sleep & stress, HPI, family, constraints. Environment + mental-health screen recommended; can be skipped if user opts out.

### Step 4 — Wearable + genetics (optional, Phase D stubs)

If the user has wearable / genetics data, invoke `tessera-wearable-ingest` / `tessera-genetics-ingest`. Otherwise set `wearable: null` and `genetics: null` and proceed.

### Step 5 — Evaluate rules

Invoke **tessera-rule-evaluate**. Read `.Codex/skills/tessera-rule-evaluate/SKILL.md`. This is a deterministic pass — it does not author prose. Output: `rule-evaluation.json` listing every fired rule, its tier, its triggering markers, and the rulebook hash.

### Step 6 — Classify phenotype + root causes

Invoke **tessera-rootcause-phenotype**. Read `.Codex/skills/tessera-rootcause-phenotype/SKILL.md`. Output: `phenotype.json` + `rootcause.json`. The phenotype label drives report voice; the root-cause graph names 2–3 mechanisms to attack.

### Step 7 — Safety screen

Invoke **tessera-safety-screen**. Read `.Codex/skills/tessera-safety-screen/SKILL.md`. Cross-checks every supplement / intervention from the rule-evaluation against the safety matrix using intake's medications / conditions / allergens / pregnancy. Output: `safety.json` with blockers, warnings, cleared.

### Step 8 — Author the 5-domain protocol

Invoke **tessera-protocol-author**. Read `.Codex/skills/tessera-protocol-author/SKILL.md`. Consumes everything above and produces `protocol.json` — the 5 domain cards (Nutrition, Training, Recovery, Supplements, Mind), the 90-day plan, and the marker-by-marker retest cadence.

### Step 9 — Compose the report

Invoke **tessera-report-compose**. Read `.Codex/skills/tessera-report-compose/SKILL.md`. Composes the populated HTML using the Tessera design system, then renders to PDF via headless Chrome. Output: `report.html` + `report.pdf`.

### Step 10 — Stamp the run manifest

Write `run-manifest.json` with:

```json
{
  "client_first_name": "...",
  "report_date": "YYYY-MM-DD",
  "blood_draw_date": "YYYY-MM-DD",
  "pipeline_version": "0.2.0-phase-A-B",
  "rulebook_version": "<from rule-evaluation.json>",
  "rulebook_hash": "<sha256>",
  "phenoage_formula_version": "Levine-2018",
  "skills_used": ["tessera-lab-parse@0.1", "tessera-intake-v2@0.1", "tessera-rule-evaluate@0.1", "tessera-rootcause-phenotype@0.1", "tessera-safety-screen@0.1", "tessera-protocol-author@0.1", "tessera-report-compose@0.1"],
  "input_hashes": {
    "blood_test_pdf_sha256": "...",
    "intake_md_sha256": "..."
  },
  "outputs": {
    "report_html": "<absolute path>",
    "report_pdf": "<absolute path>"
  },
  "generated_at_utc": "<ISO-8601>"
}
```

### Step 11 — Hand-off summary

Reply to the user with (under 15 lines):

- Phenotype label + bio-age + delta
- Tier 1 findings count (with physician referral language)
- Top 3 root-cause attack points
- Top 3 Tier 2 protocol moves (one line each)
- Missing-markers recommendation (if any)
- Absolute paths to `report.html` and `report.pdf`

Keep tight. The report itself is the main artifact.

## Hard rules

- **Never invent a biomarker value.** If lab-parse couldn't extract it, mark "Not measured" and proceed.
- **Never give medical advice that requires a physician.** Always escalate to "discuss with your physician" for Tier 1, prescription changes, and supplement contraindications.
- **Never claim anti-aging, life-extension, or reversal of aging.** Frame as "moving biomarkers" and "improving healthspan."
- **Never store PII outside the run folder.** No external API logs.
- **Match the Tessera voice** — confident, warm, specific, evidence-anchored. No emojis. No exclamation points unless quoting the user. Inline mechanism mention is encouraged where it earns its place.
- **Indian context throughout** — meals, supplements, lab brands, cultural framing. Vegetarian by default unless intake says otherwise.
- **Save every intermediate JSON.** The run folder is the audit trail.

## Folder layout

```
.Codex/skills/tessera-pipeline/
└── SKILL.md          ← you are here (orchestrator)

.Codex/skills/tessera-lab-parse/       ← step 2
.Codex/skills/tessera-intake-v2/       ← step 3
.Codex/skills/tessera-wearable-ingest/ ← step 4 (stub)
.Codex/skills/tessera-genetics-ingest/ ← step 4 (stub)
.Codex/skills/tessera-rule-evaluate/   ← step 5
.Codex/skills/tessera-rootcause-phenotype/ ← step 6
.Codex/skills/tessera-safety-screen/   ← step 7
.Codex/skills/tessera-protocol-author/ ← step 8
.Codex/skills/tessera-report-compose/  ← step 9

.Codex/skills/lib/        ← shared knowledge (rulebook, ranges, mechanisms, phenotypes, safety matrix)
.Codex/skills/tessera-report/  ← legacy alias, routes here
```

## Run folder layout (output)

```
<run-folder>/
├── blood-test.pdf
├── intake.md                  ← optional, if provided up-front
├── biomarkers.json            ← step 2
├── panel-completeness.json    ← step 2
├── intake.json                ← step 3
├── wearable.json              ← step 4 (or null)
├── genetics.json              ← step 4 (or null)
├── rule-evaluation.json       ← step 5
├── phenotype.json             ← step 6
├── rootcause.json             ← step 6
├── safety.json                ← step 7
├── protocol.json              ← step 8
├── report.html                ← step 9
├── report.pdf                 ← step 9
└── run-manifest.json          ← step 10
```
