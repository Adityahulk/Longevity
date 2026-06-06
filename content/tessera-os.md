# Tessera OS — the multi-modal thesis (internal)

> Working doc for the investor/YC narrative and our own clarity. Not a public page.
> The public surfaces express only what's deliverable today; this doc states where it goes.

## One line

Tessera is the **modality-agnostic longevity data + reasoning layer**. Blood is the first ingestion module, the consumer program is the first app on top, and licensing the engine to clinics is the endgame.

## Why this is the real shape of the company

The moat was never "blood-test company." A tech longevity company's defensibility is the **normalization layer + the reasoning on top + the longitudinal record that compounds** — not owning MRI machines. As an AI-engineering team, we are positioned for exactly that, and not for buying scanners.

The architecture is already 80% of the way there: the engine consumes typed JSON artifacts from pluggable ingest agents, and is modality-blind. Wearable + genetics ingest stubs already exist in the pipeline.

## The spine: one record, many modules

Every data type is an **ingestion module** that normalizes into a single **Tessera Health Record (THR)**. The reasoning engine reads the record, not the source.

```
ingestion modules            unified record           reasoning            output
─────────────────            ──────────────           ─────────            ──────
blood  ───────────┐
genome ───────────┤
DEXA   ───────────┼──►   Tessera Health Record  ──►   9-agent engine  ──►  protocol + report
wearable / CGM ───┤        (longitudinal,             (rulebook,            (+ retest loop)
MRI report ───────┤         per-person)                safety gates)
intake ───────────┘
```

THR schema (sketch): each record is a per-person, append-only timeline of typed observations:
`{ person_id, source_module, observed_at, type, value, unit, ref_range, provenance, run_id }`. Blood writes biomarkers; genome writes variants; DEXA writes body-comp + bone density; an MRI report writes structured findings; wearables write rolling trends. Same shape, different `source_module`.

## Packages = which modules are switched on

| Package | Modules | Availability | Note |
|---|---|---|---|
| Essential | blood + intake | live now | the volume tier |
| Deep | + genome (one-time) + wearable/CGM | via partner | genome enriches every future cycle |
| Comprehensive | + DEXA + coronary-calcium (referral) | by consultation | partner imaging, on indication |

Same engine, same THR, same protocol generator. The package is a module toggle set. Economics: the genome is bought once and personalizes every subsequent cycle, so module value compounds on the same record.

## Compounding: which modalities grow the moat

| Modality | Compounds? | Why |
|---|---|---|
| Blood (paired Day-1/Day-90) | Strongly | movement data on a known intervention — the core moat |
| Wearable / CGM | Strongly | continuous, paired with intervention |
| Genome | Weakly (enriches) | one-time read; deepens each row, doesn't grow per client |
| DEXA / CCTA | Weakly | snapshot diagnostic, rarely repeated |

Sequencing for moat-compounding: blood → wearable → genome (enrichment) → imaging (referral). Imaging is the last thing to add, not the first.

## The endgame: Tessera for Clinics (B2B2B)

Every longevity clinic, premium gym, and corporate-wellness program has the same gap: they can *collect* data (some own scanners) but have **no reasoning layer and no protocol engine** — they generate PDFs that get filed and forgotten (the exact failure of Apollo/Max executive checkups).

Tessera becomes the **data + reasoning + protocol infrastructure** any longevity space runs its members through. They bring the bodies (and optionally the scans); Tessera is the brain, the longitudinal record, and the branded report. Revenue: per-seat / per-record licensing on top of consumer program fees.

This is the "digital infrastructure for longevity clinics" thesis. White space in India; no serious player owns it.

## Discipline (the part that keeps this honest)

**Architecture/narrative multi-modal now. Go-to-market blood-only now.** Not in tension:
- The engine treats blood as "module 1 of N" today — nearly free, mostly already built.
- We sell blood-only, consumer, SA, until the engine has proven it moves markers on real clients.
- Nothing on the public site sells a scan/genome/clinic product we can't deliver well today. Everything beyond blood is labelled "via partner / by consultation / where this is going."

## Staged roadmap

| When | Move | CapEx |
|---|---|---|
| Now → ~200 clients | Blood + intake (+ wearable, near-free) | ~0 |
| Month 9–12 | Genome add-on (MedGenome / Strand partner) | ~0, partner |
| Month 12–18 | DEXA / CCTA by referral (partner imaging) | ~0, partner |
| Series A | "Tessera for Clinics" pilot, 2–3 partners | funded |
| Series B | Owned imaging, only if science + economics justify | funded |

## Where each idea appears on the site

- **Homepage** — one multi-modal line in "what's different" ("One record, many inputs"). No platform label.
- **/packages** — the three module-tiers + modality matrix + honest availability. Consumer expression.
- **/engine** — "one record, many modules" architecture + a forward-looking "Tessera for Clinics" note.
- **/strategy** — the full OS + B2B2B thesis (platform language fully earned here).
- **This doc** — the internal source of truth.
