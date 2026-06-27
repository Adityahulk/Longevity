---
name: tessera-safety-screen
description: Screens every supplement and intervention from the rule-evaluation against the safety matrix using the client's medications, known conditions, allergens, and pregnancy status. Emits safety.json with blockers, warnings, and cleared items so the protocol-author can drop blocked recs and surface warnings. Step 7 of tessera-pipeline.
---

# Tessera Safety Screen

Cross-checks every proposed supplement / intervention against the client's medications, conditions, allergens, pregnancy status, and dose-by-weight sanity. Outputs `safety.json`.

## Inputs

- `rule-evaluation.json` (lists every proposed intervention)
- `intake.json` (medications, conditions, allergies, pregnancy status, weight)
- `lib/safety-matrix.md` (the matrix)

## Workflow

### Step 1 — Collect all proposed supplements / interventions

From `rule-evaluation.json`, gather every supplement or behavioral intervention mentioned in `domain_interventions.S` (supplements) and `domain_interventions.N` (when nutrition is intervention-like, e.g., "drop alcohol"). Deduplicate.

### Step 2 — For each item, run all 5 safety checks

For each candidate supplement / intervention:

1. **Drug × Supplement** — for each medication in `intake.body_medical.current_medications`, check the safety matrix.
2. **Condition × Supplement** — for each diagnosed condition in `intake.body_medical.known_conditions`, check the matrix.
3. **Allergen cross-reference** — check `intake.body_medical.allergies_intolerances`.
4. **Pregnancy / lactation** — if `intake.body_medical.pregnancy_status` in `pregnant | trying | breastfeeding`, apply pregnancy rules.
5. **Dose-by-weight sanity** — for dose-scalable items (protein, creatine, caffeine, Mg, Vit D maintenance, iron), compute the recommended dose against `intake.body_medical.weight_kg`.

### Step 2b — Pharmacogenomic advisories (Deep tier — when genetics available)

Read the pharmacogenomic variants from `genetics.json` and emit physician-facing advisories (these are
NOT supplement verdicts — they ride along with referrals, and the engine never prescribes):

- **SLCO1B1** intermediate/reduced (`R-GEN-SLCO1B1-01`): if a lipid referral is active (ApoB/LDL/Lp(a)
  firing) and a statin may be considered, add an advisory favoring a non-simvastatin choice / lower dose
  for the prescribing physician.
- **CYP2C19** intermediate/poor (`R-GEN-CYP2C19-01`): dormant; surface only if clopidogrel or a PPI is on
  the medication list, then add the metabolism advisory.

Record these under a `pharmacogenomic_advisories[]` array in `safety.json`.

### Step 3 — Verdict per item

For each item, the worst verdict across all 5 checks wins:

- **BLOCKED** — at least one BLOCKER hit. Protocol-author MUST drop. Suggest alternative if available.
- **WARNING** — at least one WARNING hit (and no blockers). Protocol-author keeps the rec but surfaces the warning prominently with "physician sign-off" or "monitor X" language.
- **CLEARED** — no hits in any check.

### Step 4 — Write `safety.json`

### Step 5 — Reply

One-line: "X cleared, Y warnings, Z blocked."

## safety.json schema

```json
{
  "screened_at_utc": "2026-05-14T10:40:00Z",
  "safety_matrix_version": "0.1.0",
  "items": [
    {
      "name": "Vitamin D3 60,000 IU/week",
      "form": "cholecalciferol",
      "dose": "60,000 IU/week × 8-12 weeks",
      "rationale": "from R-VIT-D-02",
      "verdict": "cleared",
      "checks_passed": [
        "Drug interactions: client on no medications → cleared",
        "Conditions: no CKD / liver / hemochromatosis → cleared",
        "Allergens: no fish allergy (D3 is wool-derived; cholecalciferol-D3 OK) → cleared",
        "Pregnancy: not applicable (M) → cleared",
        "Dose: 60,000 IU/week is within physician-supervised loading range for severe deficiency → cleared"
      ],
      "checks_warnings": [],
      "checks_blockers": [],
      "alternative_if_blocked": null
    },
    {
      "name": "Ashwagandha 600mg/day KSM-66",
      "form": "root extract (KSM-66 standardized)",
      "dose": "600mg/day, AM",
      "rationale": "from R-HOR-03 (cortisol AM 20) + R-HOR-04 (relative-low T optimization)",
      "verdict": "cleared",
      "checks_passed": [
        "Drug interactions: no thyroid meds (would warn) / no SSRIs (would warn) / no benzos (would warn) → cleared",
        "Conditions: no autoimmune thyroid / no autoimmune flare history → cleared",
        "Allergens: nightshade family — verify with client",
        "Pregnancy: not applicable (M) → cleared",
        "Dose: 600mg standard adult dose → cleared"
      ],
      "checks_warnings": [],
      "checks_blockers": []
    },
    {
      "name": "Magnesium glycinate 300mg bedtime",
      "verdict": "cleared",
      "..."
    },
    {
      "name": "Omega-3 fish oil 2g EPA+DHA/day",
      "verdict": "warning",
      "checks_warnings": [
        "Fish source — verify no fish allergy (intake says none → likely OK). If fish allergy emerges, switch to algal DHA/EPA."
      ],
      "alternative_if_blocked": "Algal omega-3 (DHA+EPA) — 500mg DHA + 250mg EPA from algae"
    }
  ],
  "blocked_items": [],
  "summary": {
    "cleared_count": 4,
    "warning_count": 1,
    "blocked_count": 0
  }
}
```

## Hard rules

- **Conservative bias.** Unknown interaction = treat as warning. Never assume safe by default for new combinations.
- **Surface, don't hide.** Even cleared items show *which checks passed* — this becomes the "Safety-cleared supplements" card in the report.
- **Suggest alternatives.** When something is blocked, propose the next-best substitute (e.g., fish oil → algal omega-3; whey → pea/hemp; ginkgo → CDP-choline).
- **No supplement is automatically safe.** Every item gets the full 5-check run.
