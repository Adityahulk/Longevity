# Biomarker Canonical Codes & Per-Lab Aliases

Every biomarker in the Tessera pipeline is referenced by a **canonical code** (`snake_case`, no spaces). Indian labs (Thyrocare, Redcliffe, Apollo, SRL, Dr. Lal, Tata 1mg, Healthians, MFine) all use slightly different names for the same marker. This table is the single source of truth — every parser, evaluator, and report-renderer reads from here.

Schema for each row:
- `code` — canonical identifier (used everywhere in JSON)
- `display_name` — what shows on the client report
- `category` — panel grouping (CBC / glucose_insulin / lipids / liver / kidney / inflammation / thyroid / vitamins / hormones / minerals / urine / derived)
- `unit_canonical` — what the rulebook and PhenoAge formula expect (after unit-conversion.md)
- `aliases` — strings to match in lab PDFs (case-insensitive, substring-tolerant)

---

## CBC

| code | display_name | unit_canonical | aliases |
|---|---|---|---|
| `hemoglobin` | Hemoglobin | g/dL | "hemoglobin", "haemoglobin", "Hb", "HGB" |
| `rbc` | Red Blood Cells | 10⁶/μL | "RBC", "red blood cell", "red cell count", "erythrocyte count" |
| `hct` | Hematocrit / PCV | % | "HCT", "hematocrit", "haematocrit", "PCV", "packed cell volume" |
| `mcv` | Mean Corpuscular Volume | fL | "MCV", "mean corpuscular volume", "mean cell volume" |
| `mch` | Mean Corpuscular Hemoglobin | pg | "MCH", "mean corpuscular hemoglobin" |
| `mchc` | MCH Concentration | g/dL | "MCHC", "mean corpuscular hemoglobin concentration" |
| `rdw_cv` | Red Cell Distribution Width | % | "RDW-CV", "RDW CV", "RDW (CV)", "red cell distribution width" |
| `rdw_sd` | RDW-SD (informational only) | fL | "RDW-SD", "RDW SD" — **not accepted by PhenoAge; prefer rdw_cv** |
| `wbc` | Total Leucocyte Count | 10³/μL | "WBC", "total leucocyte count", "TLC", "white blood cell count", "total leukocyte count" |
| `neutrophils_pct` | Neutrophils | % | "neutrophils", "neutrophil %", "polymorphs", "PMN" (when given as %) |
| `lymphocytes_pct` | Lymphocytes | % | "lymphocytes", "lymphocyte %", "lymph%" |
| `monocytes_pct` | Monocytes | % | "monocytes", "monocyte %" |
| `eosinophils_pct` | Eosinophils | % | "eosinophils", "eosinophil %", "eos%" |
| `basophils_pct` | Basophils | % | "basophils", "basophil %" |
| `neutrophils_abs` | Absolute Neutrophil Count | 10³/μL | "absolute neutrophil count", "ANC" |
| `lymphocytes_abs` | Absolute Lymphocyte Count | 10³/μL | "absolute lymphocyte count", "ALC" |
| `monocytes_abs` | Absolute Monocyte Count | 10³/μL | "absolute monocyte count" |
| `eosinophils_abs` | Absolute Eosinophil Count | 10³/μL | "absolute eosinophil count", "AEC" |
| `basophils_abs` | Absolute Basophil Count | 10³/μL | "absolute basophil count" |
| `platelets` | Platelet Count | 10³/μL | "platelet count", "platelets", "PLT" |
| `mpv` | Mean Platelet Volume | fL | "MPV", "mean platelet volume" |
| `pdw` | Platelet Distribution Width | fL | "PDW", "platelet distribution width" |
| `esr` | Erythrocyte Sedimentation Rate | mm/hr | "ESR", "erythrocyte sedimentation rate", "sed rate" |

## Glucose & Insulin

| code | display_name | unit_canonical | aliases |
|---|---|---|---|
| `glucose_fasting` | Fasting Glucose | mg/dL | "glucose - fasting", "fasting glucose", "FBS", "glucose fasting", "blood sugar fasting" |
| `glucose_pp` | Post-prandial Glucose | mg/dL | "glucose - postprandial", "PPBS", "glucose 2h", "glucose - PP" |
| `hba1c` | HbA1c | % | "HbA1c", "glycosylated hemoglobin", "glycated hemoglobin", "A1c" |
| `eag` | Estimated Average Glucose | mg/dL | "eAG", "estimated average glucose" — informational only |
| `insulin_fasting` | Fasting Insulin | μU/mL | "insulin - fasting", "fasting insulin", "insulin, fasting" |
| `c_peptide` | C-Peptide | ng/mL | "C-peptide", "C peptide" |

## Lipids

| code | display_name | unit_canonical | aliases |
|---|---|---|---|
| `cholesterol_total` | Total Cholesterol | mg/dL | "cholesterol - total", "total cholesterol", "cholesterol total" |
| `triglycerides` | Triglycerides | mg/dL | "triglycerides", "TG", "triglyceride" |
| `hdl` | HDL Cholesterol | mg/dL | "cholesterol - HDL", "HDL cholesterol", "HDL-C", "high density lipoprotein" |
| `ldl` | LDL Cholesterol | mg/dL | "cholesterol - LDL", "LDL cholesterol", "LDL-C", "low density lipoprotein" |
| `non_hdl` | Non-HDL Cholesterol | mg/dL | "non HDL cholesterol", "non-HDL", "non HDL chol" |
| `vldl` | VLDL Cholesterol | mg/dL | "VLDL", "VLDL cholesterol" |
| `apo_a1` | Apolipoprotein A1 | mg/dL | "apolipoprotein A1", "Apo A1", "ApoA1", "apolipoprotein - A1" |
| `apo_b` | Apolipoprotein B | mg/dL | "apolipoprotein B", "Apo B", "ApoB", "apolipoprotein - B" |
| `apo_b_a1_ratio` | ApoB:ApoA1 Ratio | ratio | "Apo B/A1 ratio", "ApoB:ApoA1", "apolipoprotein B/A1 ratio" |
| `lp_a` | Lipoprotein(a) | mg/dL | "lipoprotein (a)", "Lp(a)", "lipoprotein-a" — may report in nmol/L; divide by ~2.5 to approximate mg/dL |

## Inflammation

| code | display_name | unit_canonical | aliases |
|---|---|---|---|
| `hs_crp` | High-Sensitivity CRP | mg/L | "high sensitivity CRP", "hs-CRP", "hsCRP", "high-sensitivity C-reactive protein" |
| `crp` | C-Reactive Protein (regular) | mg/L | "C-reactive protein (quantitative)", "CRP", "C-reactive protein" — if value < 0.5 mg/L, floor at 0.5 for PhenoAge |
| `homocysteine` | Homocysteine | μmol/L | "homocysteine" |
| `glyca` | GlycA (NMR) | μmol/L | "GlycA", "glycoprotein acetylation" — research-grade |
| `ferritin_inflammation_use` | Ferritin (also inflammation) | ng/mL | (same as `ferritin` below; cross-referenced) |
| `rheumatoid_factor` | Rheumatoid Factor | IU/mL | "rheumatoid factor", "RF" |
| `ana` | ANA | titer | "ANA", "anti-nuclear antibody" |

## Liver

| code | display_name | unit_canonical | aliases |
|---|---|---|---|
| `alt` | ALT (SGPT) | U/L | "alanine transaminase", "ALT", "SGPT", "alanine transaminase (SGPT)" |
| `ast` | AST (SGOT) | U/L | "aspartate transaminase", "AST", "SGOT", "aspartate transaminase (SGOT)" |
| `alp` | Alkaline Phosphatase | U/L | "alkaline phosphatase", "ALP" |
| `ggt` | Gamma-Glutamyl Transferase | U/L | "gamma glutamyltransferase", "GGT", "gamma-GT" |
| `bilirubin_total` | Total Bilirubin | mg/dL | "bilirubin - total", "total bilirubin" |
| `bilirubin_direct` | Direct Bilirubin | mg/dL | "bilirubin - direct", "direct bilirubin", "conjugated bilirubin" |
| `protein_total` | Total Protein | g/dL | "protein, total", "total protein" |
| `albumin` | Albumin | g/dL | "albumin" |
| `globulin` | Globulin | g/dL | "globulin" |
| `ag_ratio` | A:G Ratio | ratio | "A/G ratio", "albumin/globulin ratio" |

## Kidney

| code | display_name | unit_canonical | aliases |
|---|---|---|---|
| `creatinine` | Serum Creatinine | mg/dL | "creatinine", "serum creatinine" |
| `urea` | Blood Urea | mg/dL | "urea", "blood urea", "BUN" (multiply BUN mg/dL × 2.14 = urea mg/dL) |
| `bun` | Blood Urea Nitrogen | mg/dL | "BUN", "blood urea nitrogen" |
| `uric_acid` | Uric Acid | mg/dL | "uric acid", "serum uric acid" |
| `egfr` | eGFR (CKD-EPI 2021) | mL/min/1.73m² | "eGFR", "estimated GFR", "GFR" — if missing, compute from creatinine + age + sex |
| `cystatin_c` | Cystatin C | mg/L | "cystatin C" — research-grade alt kidney marker |
| `sodium` | Sodium | mmol/L | "sodium", "Na" |
| `potassium` | Potassium | mmol/L | "potassium", "K" |
| `chloride` | Chloride | mmol/L | "chloride", "Cl" |
| `calcium` | Calcium | mg/dL | "calcium", "total calcium" |
| `phosphorus` | Phosphorus | mg/dL | "phosphorus", "phosphate" |

## Thyroid

| code | display_name | unit_canonical | aliases |
|---|---|---|---|
| `tsh` | TSH | μIU/mL | "thyroid stimulating hormone", "TSH", "TSH - ultra sensitive", "TSH ultra-sensitive" |
| `t3_total` | Total T3 | ng/mL | "T3, total", "total T3", "T3 total" |
| `t4_total` | Total T4 | μg/dL | "T4, total", "total T4", "T4 total" |
| `free_t3` | Free T3 | pg/mL | "free T3", "FT3" |
| `free_t4` | Free T4 | ng/dL | "free T4", "FT4" |
| `anti_tpo` | Anti-TPO antibodies | IU/mL | "anti-TPO", "anti thyroid peroxidase", "anti-thyroid peroxidase antibodies", "TPO antibodies" |
| `anti_tg` | Anti-Thyroglobulin | IU/mL | "anti-thyroglobulin", "anti-Tg", "Tg antibodies" |

## Vitamins & Iron

| code | display_name | unit_canonical | aliases |
|---|---|---|---|
| `vitamin_d_25oh` | Vitamin D (25-OH) | ng/mL | "vitamin D (25-OH)", "25-hydroxy vitamin D", "25-OH vitamin D", "vitamin D 25 hydroxy" |
| `vitamin_b12` | Vitamin B12 | pg/mL | "vitamin B12", "B12", "cobalamin" |
| `folate` | Folate (B9) | ng/mL | "vitamin B9", "folate", "folic acid", "vitamin B9 (folic acid)" |
| `iron_serum` | Serum Iron | μg/dL | "iron serum", "serum iron", "iron - serum" |
| `tibc` | Total Iron Binding Capacity | μg/dL | "total iron binding capacity", "TIBC" |
| `transferrin_saturation` | Transferrin Saturation | % | "transferrin saturation", "TSAT" — if missing, compute = iron_serum / TIBC × 100 |
| `ferritin` | Ferritin | ng/mL | "ferritin" |

## Hormones

| code | display_name | unit_canonical | aliases |
|---|---|---|---|
| `testosterone_total` | Total Testosterone | ng/dL | "testosterone, total", "total testosterone", "testosterone total" |
| `testosterone_free` | Free Testosterone | pg/mL | "free testosterone", "testosterone, free" |
| `shbg` | SHBG | nmol/L | "SHBG", "sex hormone binding globulin" |
| `dhea_s` | DHEA-S | μg/dL | "DHEA-S", "DHEA sulphate", "dehydroepiandrosterone sulfate" |
| `estradiol` | Estradiol | pg/mL | "estradiol", "E2" |
| `progesterone` | Progesterone | ng/mL | "progesterone" |
| `lh` | LH | mIU/mL | "LH", "luteinizing hormone" |
| `fsh` | FSH | mIU/mL | "FSH", "follicle stimulating hormone" |
| `prolactin` | Prolactin | ng/mL | "prolactin" |
| `cortisol_am` | Cortisol (AM) | μg/dL | "cortisol (morning sample)", "cortisol AM", "cortisol, serum (morning sample)", "cortisol - morning" |
| `cortisol_pm` | Cortisol (PM) | μg/dL | "cortisol (evening sample)", "cortisol PM", "cortisol - evening" |
| `igf_1` | IGF-1 | ng/mL | "IGF-1", "insulin-like growth factor 1", "IGF1" |
| `psa_total` | Total PSA | ng/mL | "prostate specific antigen, total", "PSA total", "PSA" |

## Minerals

| code | display_name | unit_canonical | aliases |
|---|---|---|---|
| `magnesium` | Magnesium (serum) | mg/dL | "magnesium" — note: serum Mg is poor marker; RBC Mg is better but rarely run |
| `zinc` | Zinc | μg/dL | "zinc" |
| `selenium` | Selenium | μg/L | "selenium" |
| `copper` | Copper | μg/dL | "copper" |
| `iodine_urine` | Urine Iodine | μg/L | "urine iodine", "iodine - urinary" |

## Cardiac (advanced)

| code | display_name | unit_canonical | aliases |
|---|---|---|---|
| `hs_troponin` | High-Sensitivity Troponin | ng/L | "hs-troponin", "hs-cTn", "high-sensitivity troponin" — research-grade |
| `nt_probnp` | NT-proBNP | pg/mL | "NT-proBNP", "BNP" |
| `omega_3_index` | Omega-3 Index | % | "omega-3 index" — research-grade |

## Allergy

| code | display_name | unit_canonical | aliases |
|---|---|---|---|
| `ige_total` | Total IgE | IU/mL | "immunoglobulin E (IgE) total", "total IgE", "IgE total", "serum IgE" |

## Pancreas

| code | display_name | unit_canonical | aliases |
|---|---|---|---|
| `lipase` | Lipase | U/L | "lipase" |
| `amylase` | Amylase | U/L | "amylase" |

## Derived (computed by tessera-lab-parse, never raw from lab)

| code | display_name | unit_canonical | computed from |
|---|---|---|---|
| `homa_ir` | HOMA-IR | index | `(glucose_fasting × insulin_fasting) / 405` |
| `tg_hdl_ratio` | TG:HDL Ratio | ratio | `triglycerides / hdl` |
| `aip` | Atherogenic Index of Plasma | index | `log10(triglycerides / hdl)` |
| `castelli_1` | Castelli Index I | ratio | `cholesterol_total / hdl` |
| `castelli_2` | Castelli Index II | ratio | `ldl / hdl` |
| `non_hdl_derived` | Non-HDL (derived) | mg/dL | `cholesterol_total - hdl` (if not given) |
| `egfr_ckdepi_2021` | eGFR (CKD-EPI 2021) | mL/min/1.73m² | CKD-EPI 2021 formula from creatinine + age + sex (no race coefficient) |
| `fib_4` | FIB-4 Index | index | `(age × AST) / (platelets × √ALT)` — liver fibrosis screen |
| `nlr` | Neutrophil:Lymphocyte Ratio | ratio | `neutrophils_abs / lymphocytes_abs` |
| `mhr` | Monocyte:HDL Ratio | ratio | `monocytes_abs / hdl` — inflammation/CV signal |
| `apo_b_a1_ratio_derived` | ApoB:ApoA1 (derived) | ratio | `apo_b / apo_a1` (if not given) |

---

## Tessera Longevity Panel — what "complete" means

A complete Tessera longevity panel covers these markers. The `tessera-lab-parse` skill emits a `panel-completeness` block grouping any missing ones into three tiers:

### Core (panel is incomplete without these — Tier 1 missing)

CBC (`hemoglobin`, `mcv`, `rdw_cv`, `wbc`, `lymphocytes_pct`, `neutrophils_pct`, `eosinophils_pct`, `platelets`), Lipids (`cholesterol_total`, `triglycerides`, `hdl`, `ldl`, `apo_b`), Glucose-Insulin (`glucose_fasting`, `hba1c`, `insulin_fasting`), Liver (`alt`, `ast`, `alp`, `albumin`), Kidney (`creatinine`, `uric_acid`), Inflammation (`hs_crp`, `homocysteine`), Thyroid (`tsh`), Vitamins (`vitamin_d_25oh`, `vitamin_b12`, `ferritin`).

### Advanced (recommended add-on at retest — Tier 2 missing)

`lp_a`, `apo_a1`, `free_t3`, `free_t4`, `anti_tpo`, `testosterone_total`, `testosterone_free`, `shbg`, `dhea_s`, `cortisol_am`, `igf_1`, `cystatin_c`, `folate`, `magnesium`.

For females also: `estradiol`, `progesterone`, `lh`, `fsh`.

### Research-grade (nice-to-have, longevity-optimization layer — Tier 3 missing)

`glyca`, `omega_3_index`, `hs_troponin`, `nt_probnp`, `zinc`, `selenium`, `iodine_urine`.
