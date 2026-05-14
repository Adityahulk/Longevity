---
name: tessera-lab-parse
description: Parse any Indian lab PDF (Thyrocare/Redcliffe/Apollo/SRL/Dr. Lal/Tata 1mg/Healthians/MFine) into canonical biomarker JSON. Normalizes units, computes derived indices (HOMA-IR, TG:HDL, AIP, Castelli, eGFR, FIB-4, NLR, MHR, ApoB:ApoA1), and emits a panel-completeness report flagging missing Tessera-longevity-panel markers tiered by clinical leverage. Use when you have a lab PDF and need a structured JSON of all extracted biomarkers.
---

# Tessera Lab Parse

Parse an Indian blood-test PDF into `biomarkers.json` + `panel-completeness.json`.

## Inputs

- Path to a PDF (typically lab report from Thyrocare, Redcliffe, Apollo, SRL, Dr. Lal, Tata 1mg, Healthians, MFine).
- Patient context: age + sex_at_birth (from intake; needed for sex-specific ranges + eGFR computation).

## Workflow

### Step 1 — Extract text

Use `python3` with PyMuPDF (`fitz`) to extract per-page text from the PDF. If PyMuPDF is not available, fall back to the Read tool's built-in PDF support. If the PDF is a scan and text extraction returns garbled output, stop and ask the user to either provide a text-PDF or paste values inline.

```python
import fitz
doc = fitz.open(path)
text_by_page = [doc[i].get_text() for i in range(len(doc))]
```

### Step 2 — Identify the lab vendor

Vendor fingerprints (look in any page text):

- **Thyrocare**: "Thyrocare" header, "Aarogyam" panel name
- **Redcliffe**: "Redcliffe Labs", "RCL"
- **Apollo**: "Apollo Diagnostics", "Apollo Hospitals"
- **SRL**: "SRL Limited", "SRL Diagnostics"
- **Dr. Lal**: "Dr Lal PathLabs", "LPL"
- **Tata 1mg**: "Tata 1mg" or "Tata1mg" header, "HAEMATOLOGY" / "BIOCHEMISTRY" panel headers, "Mr.<NAME>" customer line
- **Healthians**: "Healthians"
- **MFine**: "MFine"

Vendor is informational — parse rules are vendor-agnostic and rely on `lib/biomarker-canonical.md` aliases.

### Step 3 — Extract every biomarker

For each known canonical code in `.claude/skills/lib/biomarker-canonical.md`:

1. For each of its `aliases`, do a **case-insensitive substring search** across all page text.
2. When found, locate the *value* (next number) and the *unit* (token immediately after).
3. Also capture the *reference range* if present on the same line (formats: `13.0 - 17.0`, `<= 199.9`, `>= 39.5`, `0 - 4`, `Deficiency: <20, Insufficiency: 20-29, Sufficiency: 30-100`).
4. Apply unit conversion per `lib/units-conversion.md`.
5. Store canonical value + canonical unit + raw_value + raw_unit (for audit).
6. Compute `tier` (1/2/3/4) per `lib/reference-ranges.md` using the patient's sex.
7. Set `confidence`: `high` if value + unit + range all found; `medium` if value + unit only; `low` if value only.

If a marker has multiple matches in the PDF (e.g., it appears in both a summary and a detail page), prefer the **detail** page value (usually more decimal places) and flag if they disagree.

### Step 4 — Compute derived indices

After raw markers are normalized, compute these (per `lib/biomarker-canonical.md` "Derived" section):

- `homa_ir = (glucose_fasting × insulin_fasting) / 405` — if both present
- `tg_hdl_ratio = triglycerides / hdl` — if both present
- `aip = log10(triglycerides / hdl)` — if both present (use natural-log if log10 not available, then divide by ln(10))
- `castelli_1 = cholesterol_total / hdl`
- `castelli_2 = ldl / hdl`
- `non_hdl_derived = cholesterol_total - hdl` — only if `non_hdl` was not directly reported
- `egfr_ckdepi_2021` — compute CKD-EPI 2021 if `egfr` not directly reported. Formula:
  ```
  Female: 142 × min(creat/0.7, 1)^-0.241 × max(creat/0.7, 1)^-1.200 × 0.9938^age × 1.012
  Male:   142 × min(creat/0.9, 1)^-0.302 × max(creat/0.9, 1)^-1.200 × 0.9938^age
  ```
- `fib_4 = (age × AST) / (platelets × sqrt(ALT))` — if all four present
- `nlr = neutrophils_abs / lymphocytes_abs` — if both present; if only percentages given, compute from `(neutrophils_pct/100 × wbc) / (lymphocytes_pct/100 × wbc) = neutrophils_pct / lymphocytes_pct`
- `mhr = monocytes_abs / hdl` — if both present
- `apo_b_a1_ratio = apo_b / apo_a1` — if `apo_b_a1_ratio` was not directly reported
- `transferrin_saturation = (iron_serum / tibc) × 100` — if not directly reported

Each derived marker gets `source: derived` and a `computed_from: [...]` array listing the inputs used.

### Step 5 — Panel completeness

Read `lib/biomarker-canonical.md` → "Tessera Longevity Panel" section. For each tier (core / advanced / research-grade), check which markers are missing. Emit `panel-completeness.json`:

```json
{
  "panel_complete": false,
  "core_missing": [],
  "advanced_missing": ["free_t", "shbg", ...],
  "research_missing": ["glyca", "omega_3_index", ...],
  "recommended_add_ons_for_retest": [
    {"marker": "free_t", "rationale": "Required to interpret total T context", "tier_priority": 1},
    {"marker": "shbg", "rationale": "Required for bioavailable T calculation", "tier_priority": 1},
    ...
  ]
}
```

`recommended_add_ons_for_retest` is sorted by clinical leverage given the *fired patterns* (e.g., if testosterone is borderline-low, push Free T + SHBG; if eosinophils high, push Anti-TPO + specific-IgE; if cardiac signals, push GlycA + omega-3 index + Lp(a) confirmation).

### Step 6 — Write outputs

Write to the run folder:

- `biomarkers.json` — see schema below
- `panel-completeness.json`

### Step 7 — Reply

Reply with:

- Count of markers extracted (high / medium / low confidence)
- Any markers that couldn't be parsed
- Panel-completeness summary (X core, Y advanced, Z research-grade missing)
- Notable Tier-1 findings (early surface, full evaluation happens in `tessera-rule-evaluate`)

## biomarkers.json schema

```json
{
  "parsed_at_utc": "2026-05-14T10:30:00Z",
  "parser_version": "0.1.0",
  "source_pdf": "/abs/path/to/blood-test.pdf",
  "source_pdf_sha256": "<hex>",
  "lab_vendor": "tata_1mg",
  "patient": {
    "first_name": "Aditya",
    "age": 25,
    "sex_at_birth": "M",
    "draw_date": "2026-05-12",
    "fasting_status": "fasted_overnight_10h | non_fasting | unknown"
  },
  "markers": [
    {
      "code": "hemoglobin",
      "display_name": "Hemoglobin",
      "category": "cbc",
      "value": 15.8,
      "unit": "g/dL",
      "raw_value": "15.8",
      "raw_unit": "g/dL",
      "lab_ref_low": 13.0,
      "lab_ref_high": 17.0,
      "tier": 4,
      "status_badge": "OPTIMAL",
      "tessera_optimal_low": 14.0,
      "tessera_optimal_high": 16.0,
      "tessera_acceptable_low": 13.0,
      "tessera_acceptable_high": 17.5,
      "source": "lab",
      "confidence": "high",
      "page": 8,
      "notes": null
    },
    {
      "code": "homa_ir",
      "display_name": "HOMA-IR",
      "category": "derived",
      "value": 0.74,
      "unit": "index",
      "tier": 4,
      "status_badge": "OPTIMAL",
      "tessera_optimal_high": 1.0,
      "source": "derived",
      "computed_from": ["glucose_fasting", "insulin_fasting"],
      "computation": "(79 × 3.80) / 405 = 0.74",
      "confidence": "high"
    }
    // ... one entry per extracted marker, including derived
  ],
  "phenoage_inputs_complete": true,
  "phenoage_inputs": {
    "albumin_g_per_dL": 5.00,
    "creatinine_mg_per_dL": 1.02,
    "glucose_mg_per_dL": 79,
    "hs_crp_mg_per_L": 0.90,
    "lymphocytes_pct": 39.1,
    "mcv_fL": 89.0,
    "rdw_cv_pct": 14.1,
    "alp_U_per_L": 90,
    "wbc_K_per_uL": 5.29,
    "age": 25
  },
  "warnings": [
    "Lp(a) reported in mg/dL — direct use OK (no nmol/L conversion needed)"
  ]
}
```

## Hard rules

- **Never invent a value.** If a marker isn't found in the PDF, simply don't include it. Don't synthesize.
- **Always preserve raw_value + raw_unit** so the conversion is auditable.
- **Tier 1 surfaces happen here for SAFETY** (e.g., HbA1c ≥ 6.5 → mention in reply) but the full rulebook evaluation lives in `tessera-rule-evaluate`.
- **Confidence rules**: high requires all three (value, unit, range). Lower-confidence values are still usable but flagged.

## Future TS consumer

This skill's `biomarkers.json` output shape mirrors the future `packages/lab-parser` TypeScript package types (`BloodworkPanel`, `BiomarkerValue` in [IMPLEMENTATION_PLAN.md](../../../IMPLEMENTATION_PLAN.md)). When the TS port happens, no schema changes are needed.
