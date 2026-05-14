---
name: tessera-report
description: Generate a Tessera-branded personalized longevity report from a blood test PDF and a short lifestyle intake. Now routes to the multi-skill tessera-pipeline (lab-parse → intake-v2 → rule-evaluate → rootcause-phenotype → safety-screen → protocol-author → report-compose) for deeper reasoning (root-cause graph, phenotype classification, drug-supplement safety screen, panel-completeness flag). Use this when the user asks for a longevity report, biological-age report, biomarker analysis, personalized protocol, or wants to generate a sharable report for a client.
---

# Tessera Report — Thin Alias

**This skill now routes to the [tessera-pipeline](../tessera-pipeline/SKILL.md) orchestrator.**

The Phase A+B refactor decomposed the monolithic `tessera-report` skill into eight composable skills:

1. [tessera-lab-parse](../tessera-lab-parse/SKILL.md) — PDF → `biomarkers.json` + `panel-completeness.json` (with derived indices)
2. [tessera-intake-v2](../tessera-intake-v2/SKILL.md) — deep intake (base + HPI + family + constraints + environment + mental-health screen) → `intake.json`
3. [tessera-wearable-ingest](../tessera-wearable-ingest/SKILL.md) — STUB (Phase D)
4. [tessera-genetics-ingest](../tessera-genetics-ingest/SKILL.md) — STUB (Phase D)
5. [tessera-rule-evaluate](../tessera-rule-evaluate/SKILL.md) — deterministic rulebook fire → `rule-evaluation.json` + PhenoAge
6. [tessera-rootcause-phenotype](../tessera-rootcause-phenotype/SKILL.md) — phenotype label + 2-3 root-cause nodes
7. [tessera-safety-screen](../tessera-safety-screen/SKILL.md) — drug × supp × condition × allergen × pregnancy
8. [tessera-protocol-author](../tessera-protocol-author/SKILL.md) — 5-domain personalized protocol
9. [tessera-report-compose](../tessera-report-compose/SKILL.md) — final HTML + PDF

The orchestrator is [tessera-pipeline](../tessera-pipeline/SKILL.md). Invoke that instead — or invoke this alias, which simply routes to it.

## What's still here

The render pipeline + design system live here for compatibility:

- `templates/report-template.html` — Tessera-branded HTML template (used by `tessera-report-compose`)
- `scripts/render-pdf.sh` — headless Chrome HTML→PDF (used by `tessera-report-compose`)
- `intake/intake-template.md` + `intake/lifestyle-questionnaire.md` — preserved for reference; `tessera-intake-v2` extends but doesn't replace
- `reference/phenoage.md` + `reference/biomarker-ranges.md` + `reference/rulebook.md` — preserved for reference; canonical versions live in `.claude/skills/lib/`

## How to invoke

Just say "generate a Tessera report from [path]." The harness will route to `tessera-pipeline`, which orchestrates the full chain.

For migrated content / canonical knowledge see `.claude/skills/lib/`.
