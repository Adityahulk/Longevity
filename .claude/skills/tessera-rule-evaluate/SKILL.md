---
name: tessera-rule-evaluate
description: Pure deterministic rule evaluator. Reads biomarkers.json + intake.json (+ optional wearable.json / genetics.json), fires every triggered rule from the versioned Tessera rulebook (lib/rulebook/*), and emits rule-evaluation.json with the ranked findings (Tier 1 → 4), each with evidence trail and rulebook_hash for replay. Computes PhenoAge biological age. Authors no prose — this is the deterministic kernel of the pipeline.
---

# Tessera Rule Evaluate

Pure deterministic evaluator. Step 5 of `tessera-pipeline`. Does NOT author prose, narrative, or recommendations — just evaluates rules and ranks findings.

## Inputs

- `biomarkers.json` (from `tessera-lab-parse`)
- `intake.json` (from `tessera-intake-v2`)
- `wearable.json` (optional, from `tessera-wearable-ingest`) — may be null
- `genetics.json` (optional, from `tessera-genetics-ingest`) — may be null

## Workflow

### Step 1 — Compute PhenoAge

If `biomarkers.phenoage_inputs_complete = true`, run the Levine 2018 formula from `lib/phenoage.md`. Apply the unit conversions (albumin × 10, creatinine × 88.4, glucose × 0.05551, etc.). Compute `xb`, `mortScore`, `bioAge`, `delta`.

If any of the 9 inputs is missing, set `phenoage = "not_available"` and list which marker(s) are missing.

### Step 2 — Iterate rulebook

For each rule file in `lib/rulebook/*.md`:

For each rule (`R-XXX-NN`):

1. Parse its `trigger` expression.
2. Evaluate against the patient's `biomarkers.json` + `intake.json` + `wearable.json` + `genetics.json`.
3. If the trigger evaluates true, emit a `fired_rule` entry with:
   - `code` (e.g., `R-VIT-D-02`)
   - `tier` (1-4)
   - `triggering_markers` (which marker values + their tier classification triggered)
   - `intake_context` (any intake conditions that gated firing — e.g., "stress_level=7 AND PSS-4=12 triggered R-HOR-03")
   - `root_cause_hypothesis` (verbatim from rule)
   - `domain_interventions` (verbatim — N/T/R/S/M)
   - `retest_signal` (verbatim)
   - `evidence_tier` (E1-E5 from the rule)
4. Skip rules tagged `deprecated: true`.

The rulebook glob now includes `lib/rulebook/genomics.md` (`R-GEN-*`) and `lib/rulebook/wearables.md`
(`R-WBL-*`), so they are iterated here automatically when `genetics.json` / `wearable.json` have
`available: true`. When either is `available: false`, its rules simply don't fire — no error, no
misleading "confirmed by wearable" language downstream.

### Step 2b — Apply genomic modifiers + convergence gates

Genomic rules are dual-purpose (see `lib/rulebook/genomics.md`). After the standalone fires:

1. **Convergence gating** — a rule with a `confirm_with_biomarker` (e.g. `lpa_genetic` needs measured
   `lp_a` elevated; `R-GEN-TCF7L2-01` needs an early-IR marker) only fires when both the genotype AND
   the biomarker condition hold. A genotype with clean corresponding biomarkers stays informational and
   does not fire an action rule.
2. **Modifier application** — for each fired genomic rule with a `modifier_of`, adjust the named
   biomarker rule in place rather than adding a duplicate finding:
   - `R-GEN-APOE-01` → on the fired `R-LIP-01`, set `apo_b_target = "<70"` and raise its protocol
     priority (record `modified_by: ["R-GEN-APOE-01"]` on that fired rule).
   - `R-GEN-MTHFR-01` → on the fired homocysteine rule, set `b_vitamin_form = "methylated"`.
   - `R-GEN-CYP1A2-01` → set `caffeine_cutoff = "10:00"` on the recovery overlay.
   Emit a `modifiers_applied[]` array so the report can show "your DNA changed this target."

`R-WBL-*` fires are tagged with their `confirms` link (mechanism / biomarker rule) for the root-cause
step to use as a confidence boost. Both new rulebook files are already part of `rulebook_hash` (Step 6
hashes all of `lib/rulebook/*.md`).

### Step 3 — Compute per-marker tier classifications

For every marker in `biomarkers.json` (raw + derived), classify into Tier 1/2/3/4 per `lib/reference-ranges.md` using the patient's sex. This generates the **per-marker status badges** that the report shows next to each value.

This is separate from the rules — a marker can be Tier 4 (optimal) without firing any rule, OR fire a Tier 2 rule without being individually "off-target" if the rule is interaction-based.

### Step 4 — Identify Tier 1 callouts

Scan fired rules for any with `tier: 1`. List them prominently in the output for the report to surface in the dedicated "Medical-Advisory Findings" section.

### Step 5 — Conflict detection

If two fired rules give contradicting interventions (e.g., one says "increase protein" via R-LIV-03 low albumin, another caps protein at 0.8g/kg via R-KID-02 low eGFR), flag in `conflicts` array. Downstream skills handle resolution.

### Step 6 — Stamp version + hash

Compute `rulebook_hash` = SHA-256 of all `lib/rulebook/*.md` files concatenated (sorted by path). Record `rulebook_version` (read from `lib/rulebook/README.md` front-matter once added — for now, version `0.2.0-phase-A-B`).

### Step 7 — Write `rule-evaluation.json`

### Step 8 — Reply

Reply with a one-line summary: "X rules fired, Y Tier-1, Z Tier-2, [phenoage bio_age=W, delta=±V]." No prose.

## rule-evaluation.json schema

```json
{
  "evaluated_at_utc": "2026-05-14T10:35:00Z",
  "evaluator_version": "0.1.0",
  "rulebook_version": "0.2.0-phase-A-B",
  "rulebook_hash": "<sha256>",

  "phenoage": {
    "computable": true,
    "bio_age": 24.3,
    "chronological_age": 25,
    "delta_years": -0.7,
    "xb": -7.821,
    "mort_score": 0.0001234,
    "inputs_used": {
      "albumin_g_per_L": 50.0,
      "creatinine_umol_per_L": 90.17,
      "glucose_mmol_per_L": 4.39,
      "hs_crp_mg_per_L": 0.90,
      "lymphocytes_pct": 39.1,
      "mcv_fL": 89.0,
      "rdw_cv_pct": 14.1,
      "alp_U_per_L": 90,
      "wbc_K_per_uL": 5.29,
      "age": 25
    },
    "missing_inputs": []
  },

  "fired_rules": [
    {
      "code": "R-VIT-D-02",
      "tier": 1,
      "triggering_markers": [
        {"code": "vitamin_d_25oh", "value": 15.0, "unit": "ng/mL", "threshold": "<20"}
      ],
      "intake_context": null,
      "root_cause_hypothesis": "Severe Vit D deficiency cascade — driver of immune dysregulation, atopic bias, T support, Ca absorption, mood, sleep.",
      "domain_interventions": {
        "N": "fatty fish 2×/week · egg yolks · AM sunlight 15 min/day (Hyderabad latitude, before 11am).",
        "T": null,
        "R": null,
        "S": "Physician-supervised loading: 60,000 IU/week × 8-12 weeks · K2 MK-7 100mcg/day · Mg glycinate 300-400mg/day. Retest at week 12.",
        "M": null
      },
      "retest_signal": "Vit D ↑ to 40-60 ng/mL in 12 weeks",
      "evidence_tier": "E1",
      "physician_referral_required": true
    },
    {
      "code": "R-HOR-04",
      "tier": 3,
      "triggering_markers": [
        {"code": "testosterone_total", "value": 502, "unit": "ng/dL", "threshold": "400-599 (M 18-50)"}
      ],
      ...
    }
    // ...
  ],

  "per_marker_tiers": [
    {"code": "hemoglobin", "value": 15.8, "tier": 4, "status_badge": "OPTIMAL"},
    {"code": "vitamin_d_25oh", "value": 15.0, "tier": 1, "status_badge": "REFER"},
    {"code": "testosterone_total", "value": 502, "tier": 3, "status_badge": "WATCH"},
    // ... every marker
  ],

  "tier_summary": {
    "tier_1_count": 1,
    "tier_2_count": 0,
    "tier_3_count": 4,
    "tier_4_count": 25
  },

  "conflicts": [],

  "warnings": []
}
```

## Hard rules

- **No prose narration in fired rules.** The `root_cause_hypothesis` and `domain_interventions` are verbatim from the rulebook. Personalization happens in `tessera-protocol-author`, not here.
- **Tier comes from the RULE, not the marker.** A single marker can fire multiple rules at different tiers (e.g., Vit D 15 fires R-VIT-D-02 at Tier 1).
- **Hash the rulebook.** If the user re-runs the same panel + intake in 6 months, the rule-evaluation must be reproducible against the same rulebook version.
- **Never invent rules.** If a finding has no rule, list it under `unrules_findings` for human review — don't make up advice.

## Future TS consumer

`rule-evaluation.json` shape mirrors the future `packages/rules-engine` TS package output. The PhenoAge formula is identical to the TS port.
