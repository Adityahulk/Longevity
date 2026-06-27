# Tessera Rulebook — Index & Stacking Conventions

The rulebook is split across organ-system files. Each rule has a stable code in the format `R-<SYS>-<NN>` (e.g., `R-MET-01`, `R-VIT-D-02`). Codes are immutable once published so `rule-evaluation.json` is replayable.

## Files

- [metabolic.md](metabolic.md) — `R-MET-*` (insulin resistance, prediabetes, diabetes, uric acid, fatty-liver-driven metabolic syndrome)
- [lipids.md](lipids.md) — `R-LIP-*` (ApoB, LDL, HDL, triglycerides, Lp(a), Castelli, AIP)
- [hormones.md](hormones.md) — `R-HOR-*` (testosterone, cortisol AM, DHEA-S, thyroid hormones beyond TSH)
- [inflammation.md](inflammation.md) — `R-INF-*` (hsCRP, homocysteine, GlycA, NLR, MHR)
- [hematology.md](hematology.md) — `R-HEM-*` (RDW, anemia, neutrophilia, monocytosis)
- [vitamins.md](vitamins.md) — `R-VIT-*` (Vit D, B12, folate, iron studies)
- [kidney.md](kidney.md) — `R-KID-*` (eGFR, creatinine, uric acid, electrolytes)
- [liver.md](liver.md) — `R-LIV-*` (ALT/AST/GGT/ALP, albumin, FIB-4)
- [thyroid.md](thyroid.md) — `R-THY-*` (TSH, anti-TPO, Free T3/T4)
- [allergic-atopic.md](allergic-atopic.md) — `R-ATO-*` (eosinophils, IgE, basophils, monocytes; HPI-correlated)

Multi-omic (Deep tier — read alongside the organ files):

- [genomics.md](genomics.md) — `R-GEN-*` (APOE, Lp(a)/9p21/TCF7L2 CAD-T2D risk, CYP1A2/SLCO1B1/CYP2C19 pharmacogenomics, MTHFR methylation, FTO/ACTN3/COMT). Catalog: [../genomics-canonical.md](../genomics-canonical.md). Rules are dual-purpose: standalone findings AND **modifiers** of biomarker rules (e.g. ApoE ε4 tightens the `R-LIP-01` ApoB target).
- [wearables.md](wearables.md) — `R-WBL-*` (HRV/RHR trends, deep/short sleep, detraining, HRV-anomaly Autopilot trigger). Catalog: [../wearable-metrics.md](../wearable-metrics.md). Mostly Tier 3; confirm mechanisms + feed the Autopilot, never diagnose.

Cross-cutting (NOT in the per-organ files):

- Sleep/recovery, training, nutrition overlays are kept in the `tessera-protocol-author` skill (they're shaped by intake, not biomarkers).

## Rule format

Every rule has exactly six fields:

```yaml
code: R-XXX-NN
trigger: (biomarker pattern + optional intake conditions)
tier: 1 | 2 | 3 | 4
root_cause_hypothesis: (1–2 sentences)
domain_interventions:
  N: (nutrition)
  T: (training)
  R: (recovery & sleep)
  S: (supplements)
  M: (mind & wellness)
retest_signal: (what to expect to move at Day 90)
evidence_tier: E1 | E2 | E3 | E4 | E5
```

## Tier semantics

- **Tier 1** — Refer to physician. Surface in dedicated callout. Tessera protocol may run in parallel but does NOT replace medical care.
- **Tier 2** — Primary intervention target. Lead the protocol with these.
- **Tier 3** — Secondary target / watch. Light nudge in the protocol.
- **Tier 4** — Optimal. Celebrate in the report; reinforce maintenance habits.

## Rule stacking — how to combine multiple fires

When multiple rules fire for a single client:

1. List **Tier 1** findings first with the physician referral.
2. Hand off to `tessera-rootcause-phenotype` to deduplicate the *causes* into 2–3 root nodes (not the *symptoms*, which is what the rules fire on).
3. Build the 5-domain protocol cards from the **union** of triggered-rule interventions, deduplicated. When two rules suggest the same intervention (e.g., omega-3 appears in `R-LIP-03` and `R-INF-01`), surface it once with both rationales.
4. Keep the **90-day plan** focused on ≤ 6 habits total across all 12 weeks. More than that and adherence collapses.

## Conflict resolution

If two rules disagree (e.g., one says "increase protein," another says "reduce protein"), the doctor-gated path applies — flag the conflict in `rule-evaluation.json` and surface for medical review.

## Versioning

Each rulebook commit stamps a `rulebook_version` (semver) and `rulebook_hash` (SHA-256 of all rulebook files concatenated). Both are stored in `run-manifest.json` so any past report is replayable on the same rulebook.

## Adding new rules

1. Pick the right organ file. If the rule spans multiple, write it in the most central system.
2. Use the next available `R-<SYS>-<NN>` code.
3. Cite evidence tier; provide a PMID/DOI for E1/E2/E3.
4. Bump the rulebook minor version.

## Removing rules

Never delete a rule code. Mark it `deprecated: true` with a `deprecated_at` date and `superseded_by` pointer. This keeps past `rule-evaluation.json` files interpretable.
