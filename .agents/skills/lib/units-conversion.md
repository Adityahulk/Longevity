# Unit Conversion — Indian Labs → Tessera Canonical Units

The `tessera-lab-parse` skill applies these conversions when normalizing values from Thyrocare / Redcliffe / Apollo / SRL / Dr. Lal / Tata 1mg / Healthians / MFine into canonical units used by the rulebook and PhenoAge formula.

## Rule of operation

1. Read the value AND the unit string from the PDF. **Never assume the unit** — always verify.
2. Look up the row in this file matching `marker_code + reported_unit`.
3. Apply the multiplier.
4. Store the canonical value + canonical unit. Keep the original (`raw_value`, `raw_unit`) for audit.

If you encounter a unit not listed here, do not silently convert — emit an `unknown_unit` warning in `biomarkers.json` and ask the user.

---

## Glucose / Insulin

| marker | from | to (canonical) | multiplier |
|---|---|---|---|
| `glucose_fasting` | mg/dL | mg/dL | × 1 |
| `glucose_fasting` | mmol/L | mg/dL | × 18.0182 |
| `insulin_fasting` | μU/mL | μU/mL | × 1 |
| `insulin_fasting` | μIU/mL | μU/mL | × 1 (same thing) |
| `insulin_fasting` | pmol/L | μU/mL | ÷ 6.945 |
| `hba1c` | % | % | × 1 |
| `hba1c` | mmol/mol (IFCC) | % | NGSP conversion: NGSP% = (0.09148 × IFCC) + 2.152 |

## Lipids

| marker | from | to | multiplier |
|---|---|---|---|
| `cholesterol_total`, `hdl`, `ldl`, `non_hdl`, `vldl`, `triglycerides` | mg/dL | mg/dL | × 1 |
| `cholesterol_total`, `hdl`, `ldl`, `non_hdl`, `vldl` | mmol/L | mg/dL | × 38.67 |
| `triglycerides` | mmol/L | mg/dL | × 88.57 |
| `apo_a1`, `apo_b` | mg/dL | mg/dL | × 1 |
| `apo_a1`, `apo_b` | g/L | mg/dL | × 100 |
| `lp_a` | mg/dL | mg/dL | × 1 |
| `lp_a` | nmol/L | mg/dL | ÷ 2.5 (approximate; particle-size-dependent — note in parser warning) |

## Albumin / Proteins

| marker | from | to | multiplier |
|---|---|---|---|
| `albumin` | g/dL | g/dL | × 1 |
| `albumin` | g/L | g/dL | ÷ 10 |
| `protein_total`, `globulin` | g/dL | g/dL | × 1 |
| `protein_total`, `globulin` | g/L | g/dL | ÷ 10 |
| `bilirubin_total`, `bilirubin_direct` | mg/dL | mg/dL | × 1 |
| `bilirubin_total`, `bilirubin_direct` | μmol/L | mg/dL | ÷ 17.1 |

## Liver enzymes

| marker | from | to | multiplier |
|---|---|---|---|
| `alt`, `ast`, `alp`, `ggt` | U/L (= IU/L) | U/L | × 1 |

## Kidney

| marker | from | to | multiplier |
|---|---|---|---|
| `creatinine` | mg/dL | mg/dL | × 1 |
| `creatinine` | μmol/L | mg/dL | ÷ 88.4 |
| `urea` | mg/dL | mg/dL | × 1 |
| `urea` | mmol/L | mg/dL | × 6.006 |
| `bun` | mg/dL | (urea mg/dL) | × 2.14 (BUN × 2.14 ≈ urea) |
| `uric_acid` | mg/dL | mg/dL | × 1 |
| `uric_acid` | μmol/L | mg/dL | ÷ 59.48 |
| `sodium`, `potassium`, `chloride` | mmol/L (= mEq/L) | mmol/L | × 1 |
| `calcium` | mg/dL | mg/dL | × 1 |
| `calcium` | mmol/L | mg/dL | × 4.008 |
| `phosphorus` | mg/dL | mg/dL | × 1 |
| `phosphorus` | mmol/L | mg/dL | × 3.097 |
| `cystatin_c` | mg/L | mg/L | × 1 |

## CBC

| marker | from | to | multiplier |
|---|---|---|---|
| `hemoglobin` | g/dL | g/dL | × 1 |
| `hemoglobin` | g/L | g/dL | ÷ 10 |
| `rbc` | 10⁶/μL (= ×10⁶/cu.mm = M/μL) | 10⁶/μL | × 1 |
| `rbc` | ×10¹²/L | 10⁶/μL | × 1 (same magnitude) |
| `wbc` | 10³/μL (= K/μL = ×10³/cu.mm) | 10³/μL | × 1 |
| `wbc` | cells/μL | 10³/μL | ÷ 1000 |
| `wbc` | ×10⁹/L | 10³/μL | × 1 |
| `platelets` | 10³/μL | 10³/μL | × 1 |
| `platelets` | lakhs/μL (Indian colloquial — rare in modern labs) | 10³/μL | × 100 |
| `mcv` | fL | fL | × 1 |
| `rdw_cv` | % | % | × 1 |
| `mch` | pg | pg | × 1 |
| `mchc` | g/dL | g/dL | × 1 |
| `esr` | mm/hr | mm/hr | × 1 |

## Inflammation

| marker | from | to | multiplier |
|---|---|---|---|
| `hs_crp`, `crp` | mg/L | mg/L | × 1 |
| `hs_crp`, `crp` | mg/dL | mg/L | × 10 |
| `homocysteine` | μmol/L | μmol/L | × 1 |
| `ige_total` | IU/mL (= kU/L) | IU/mL | × 1 |

## Thyroid

| marker | from | to | multiplier |
|---|---|---|---|
| `tsh` | μIU/mL (= mIU/L) | μIU/mL | × 1 |
| `t3_total` | ng/mL | ng/mL | × 1 |
| `t3_total` | ng/dL | ng/mL | ÷ 100 |
| `t3_total` | nmol/L | ng/mL | ÷ 1.54 |
| `t4_total` | μg/dL | μg/dL | × 1 |
| `t4_total` | nmol/L | μg/dL | ÷ 12.87 |
| `free_t3` | pg/mL | pg/mL | × 1 |
| `free_t3` | pmol/L | pg/mL | ÷ 1.536 |
| `free_t4` | ng/dL | ng/dL | × 1 |
| `free_t4` | pmol/L | ng/dL | ÷ 12.87 |
| `anti_tpo`, `anti_tg` | IU/mL | IU/mL | × 1 |

## Vitamins / Iron

| marker | from | to | multiplier |
|---|---|---|---|
| `vitamin_d_25oh` | ng/mL | ng/mL | × 1 |
| `vitamin_d_25oh` | nmol/L | ng/mL | ÷ 2.5 |
| `vitamin_b12` | pg/mL | pg/mL | × 1 |
| `vitamin_b12` | pmol/L | pg/mL | × 1.355 |
| `folate` | ng/mL | ng/mL | × 1 |
| `folate` | nmol/L | ng/mL | ÷ 2.266 |
| `ferritin` | ng/mL (= μg/L) | ng/mL | × 1 |
| `iron_serum` | μg/dL | μg/dL | × 1 |
| `iron_serum` | μmol/L | μg/dL | × 5.585 |
| `tibc` | μg/dL | μg/dL | × 1 |
| `tibc` | μmol/L | μg/dL | × 5.585 |
| `transferrin_saturation` | % | % | × 1 |

## Hormones

| marker | from | to | multiplier |
|---|---|---|---|
| `testosterone_total` | ng/dL | ng/dL | × 1 |
| `testosterone_total` | nmol/L | ng/dL | × 28.84 |
| `testosterone_free` | pg/mL | pg/mL | × 1 |
| `testosterone_free` | pmol/L | pg/mL | × 0.288 |
| `shbg` | nmol/L | nmol/L | × 1 |
| `estradiol` | pg/mL | pg/mL | × 1 |
| `estradiol` | pmol/L | pg/mL | ÷ 3.671 |
| `cortisol_am`, `cortisol_pm` | μg/dL | μg/dL | × 1 |
| `cortisol_am`, `cortisol_pm` | nmol/L | μg/dL | ÷ 27.59 |
| `dhea_s` | μg/dL | μg/dL | × 1 |
| `dhea_s` | μmol/L | μg/dL | × 36.8 |
| `igf_1` | ng/mL | ng/mL | × 1 |
| `igf_1` | nmol/L | ng/mL | × 7.65 |
| `psa_total` | ng/mL | ng/mL | × 1 |

## Minerals

| marker | from | to | multiplier |
|---|---|---|---|
| `magnesium` | mg/dL | mg/dL | × 1 |
| `magnesium` | mmol/L | mg/dL | × 2.43 |
| `magnesium` | mEq/L | mg/dL | × 1.22 |
| `zinc` | μg/dL | μg/dL | × 1 |
| `zinc` | μmol/L | μg/dL | × 6.535 |

---

## PhenoAge-specific (additional conversions for the 9-marker formula)

The PhenoAge formula expects different units than the Tessera canonical ones. The conversions below apply **only when feeding values into `phenoage.md` formula**, not for the rulebook or report display.

| PhenoAge input | Tessera canonical | PhenoAge unit | multiplier |
|---|---|---|---|
| Albumin | g/dL | g/L | × 10 |
| Creatinine | mg/dL | μmol/L | × 88.4 |
| Glucose (fasting) | mg/dL | mmol/L | ÷ 18.0182 |
| hsCRP | mg/L | mg/L | × 1 |
| Lymphocyte % | % | % | × 1 |
| MCV | fL | fL | × 1 |
| RDW (CV) | % | % | × 1 |
| ALP | U/L | U/L | × 1 |
| WBC | 10³/μL | 10³/μL | × 1 |

These are applied inside the `tessera-rule-evaluate` skill at the point of PhenoAge computation.

---

## Notes on Indian lab quirks

- **Tata 1mg** uses non-ASCII micro symbols (`Âµ` instead of `µ` — encoding artifact). Treat any of `µ`, `μ`, `u`, `Âµ` as identical for unit parsing.
- **Thyrocare** reports HbA1c with `%` AND eAG in mg/dL — use `%` as authoritative.
- **Redcliffe** sometimes uses `cu.mm` interchangeably with `μL` (they are the same: 1 cu.mm = 1 μL).
- **Apollo / SRL** TIBC sometimes given as `μmol/L` — multiply by 5.585 to get μg/dL.
- **Dr. Lal** Lp(a) reported in `nmol/L` by some panels (NMR-derived) — divide by ~2.5 to approximate mg/dL but emit a warning since the conversion is particle-size-dependent.
- **Fasting status** is often not enforced for walk-in collection. If the lab note says "non-fasting," flag glucose and triglycerides as `fasting: false` in `biomarkers.json` and the report should call this out — do not silently treat as fasted.
