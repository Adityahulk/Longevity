# Biomarker Reference Ranges — Optimal vs Acceptable vs Off-target

Single source of truth for ranges. Every rule, every report row, every status badge reads from here.

For each marker, three ranges:

- **Optimal** — Tessera's target window (associated with lowest all-cause mortality / best healthspan signal in long-term cohort data and consensus among the Attia / Patel / Inspire-Health / Longevity-Medicine communities).
- **Acceptable** — within standard lab "normal," still inside the population reference interval.
- **Off-target** — outside acceptable; flagged as Tier 2 (single deviation) or Tier 1 (clinically significant) per [rulebook/](rulebook/).

Sex-specific ranges marked **(M)** and **(F)**. Indian lab convention used throughout (canonical units from `units-conversion.md`).

---

## 1. CBC

| Marker | Unit | Optimal | Acceptable | Off-target |
|---|---|---|---|---|
| `hemoglobin` (M) | g/dL | 14.0–16.0 | 13.0–17.5 | <13 or >18 |
| `hemoglobin` (F) | g/dL | 13.0–15.0 | 12.0–15.5 | <11.5 or >16 |
| `hct` (M) | % | 42–48 | 40–52 | <38 or >54 |
| `hct` (F) | % | 38–44 | 36–47 | <34 or >48 |
| `rbc` (M) | 10⁶/μL | 4.7–5.3 | 4.5–5.9 | <4.2 or >6.0 |
| `rbc` (F) | 10⁶/μL | 4.2–4.8 | 4.0–5.2 | <3.8 or >5.4 |
| `mcv` | fL | 85–92 | 80–100 | <80 or >100 |
| `mch` | pg | 28–32 | 27–34 | outside |
| `mchc` | g/dL | 33–35 | 32–36 | outside |
| `rdw_cv` | % | <13.0 | 11.5–14.5 | >14.5 (accelerated-aging signal) or 13.5–14.5 (Tier 3 watch) |
| `wbc` | 10³/μL | 4.5–6.5 | 4.0–11.0 | <3.5 or >9.0 (Tessera-optimal upper tighter than lab) |
| `neutrophils_pct` | % | 50–60 | 40–70 | outside |
| `lymphocytes_pct` | % | 28–40 | 20–45 | <20 (immunosenescence signal) |
| `monocytes_pct` | % | 3–7 | 2–10 | >10 (chronic inflammation signal) |
| `eosinophils_pct` | % | 1–3 | 1–6 | >6 (allergy/parasite/atopic signal — needs HPI) |
| `basophils_pct` | % | 0–1 | 0–2 | outside |
| `platelets` | 10³/μL | 200–350 | 150–410 | <150 or >450 |
| `pdw` | fL | 9–14 | 9–17 | >17 (mild platelet anisocytosis; usually benign in isolation) |
| `mpv` | fL | 7.5–10 | 6.5–12 | outside |
| `esr` | mm/hr | <10 | 0–15 (M) / 0–20 (F) | elevated → see rulebook/inflammation.md |

## 2. Glucose & Insulin

| Marker | Unit | Optimal | Acceptable | Off-target |
|---|---|---|---|---|
| `glucose_fasting` | mg/dL | 75–88 | 70–99 | ≥100 (impaired); ≥126 → **Tier 1** |
| `insulin_fasting` | μU/mL | 2–6 | 2–10 | >10 (early IR); >25 → **Tier 1** |
| `hba1c` | % | <5.3 | 5.4–5.6 | 5.7–6.4 (prediabetes); ≥6.5 → **Tier 1** |
| `homa_ir` (derived) | index | <1.0 | 1.0–1.5 | >1.5 (IR); >2.5 → **Tier 1** |
| `tg_hdl_ratio` (derived, mg/dL inputs) | ratio | <1.5 | 1.5–2.5 | >2.5 (IR proxy in Indians) |

**Derived formulas** — computed by `tessera-lab-parse`:
- `homa_ir = (glucose_fasting × insulin_fasting) / 405`
- `tg_hdl_ratio = triglycerides / hdl`

## 3. Lipids

| Marker | Unit | Optimal | Acceptable | Off-target |
|---|---|---|---|---|
| `cholesterol_total` | mg/dL | 150–200 | 200–239 | ≥240 |
| `ldl` | mg/dL | <100 (<70 if cardiac risk) | 100–129 | ≥130 (Tier 2); ≥190 → **Tier 1** |
| `hdl` (M) | mg/dL | >45 | 40–60 | <40 |
| `hdl` (F) | mg/dL | >55 | 50–60 | <50 |
| `triglycerides` | mg/dL | <90 | 90–149 | ≥150 (Tier 2); ≥500 → **Tier 1** |
| `non_hdl` | mg/dL | <130 | 130–159 | ≥160 |
| `apo_b` | mg/dL | <80 (<60 if high risk) | 80–100 | ≥100 (Tier 2); ≥130 → **Tier 1** |
| `apo_a1` | mg/dL | >130 (M), >140 (F) | 95–186 | <95 |
| `apo_b_a1_ratio` | ratio | <0.6 | 0.6–0.8 | >0.8 |
| `lp_a` | mg/dL | <30 | 30–50 | ≥50 → **Tier 2** (lifelong CV risk; doctor consult) |
| `aip` (derived) | log10(TG/HDL) | <0.11 (low risk) | 0.11–0.21 | >0.21 |
| `castelli_1` (Total/HDL) | ratio | <3.5 | 3.5–5.0 | >5.0 |
| `castelli_2` (LDL/HDL) | ratio | <2.5 | 2.5–3.5 | >3.5 |

ApoB is the single most predictive lipid marker — emphasize in the report.

## 4. Liver

| Marker | Unit | Optimal | Acceptable | Off-target |
|---|---|---|---|---|
| `alt` (M) | U/L | <25 | <40 | ≥40 (Tier 2 NAFLD signal); ≥3× ULN → **Tier 1** |
| `alt` (F) | U/L | <20 | <33 | ≥33 |
| `ast` | U/L | <25 | <40 | ≥40 |
| AST:ALT ratio | — | 0.8–1.3 | — | >2 (alcohol pattern); <0.8 + high ALT (NAFLD pattern) |
| `ggt` (M) | U/L | <30 | <60 | ≥60 (Tier 2 — alcohol / hepatic stress) |
| `ggt` (F) | U/L | <20 | <38 | ≥38 |
| `alp` | U/L | 50–100 | 40–129 | outside |
| `bilirubin_total` | mg/dL | 0.4–1.0 | 0.3–1.2 | outside |
| `protein_total` | g/dL | 6.6–8.0 | 6.0–8.3 | outside |
| `albumin` | g/dL | 4.3–5.0 | 3.5–5.2 | <3.8 (Tier 2 — sarcopenia/inflammation/kidney loss) |
| `fib_4` (derived, age + AST + platelets + ALT) | index | <1.30 | 1.30–2.67 | >2.67 (advanced fibrosis screen) |

## 5. Kidney

| Marker | Unit | Optimal | Acceptable | Off-target |
|---|---|---|---|---|
| `creatinine` (M) | mg/dL | 0.8–1.0 | 0.7–1.2 | >1.3 |
| `creatinine` (F) | mg/dL | 0.6–0.9 | 0.5–1.0 | >1.1 |
| `egfr` (CKD-EPI 2021) | mL/min/1.73m² | >90 | 60–89 (mild) | <60 → **Tier 1** |
| `urea` (BUN ×2.14) | mg/dL | 10–18 | 7–20 | outside |
| `uric_acid` (M) | mg/dL | 3.5–5.5 | 3.4–7.0 | ≥6.5 (gout/metabolic) |
| `uric_acid` (F) | mg/dL | 3.0–5.0 | 2.4–6.0 | ≥5.5 |
| `sodium` | mmol/L | 138–142 | 135–145 | outside |
| `potassium` | mmol/L | 4.0–4.5 | 3.5–5.1 | outside (Tier 1 if <3.0 or >5.5) |
| `calcium` | mg/dL | 9.4–10.0 | 8.6–10.2 | outside |
| `phosphorus` | mg/dL | 2.8–4.0 | 2.5–4.5 | >4.5 (renal/Vit-D/sample artifact) |
| `cystatin_c` | mg/L | 0.6–0.95 | 0.6–1.0 | >1.0 (alternative kidney marker) |

## 6. Inflammation

| Marker | Unit | Optimal | Acceptable | Off-target |
|---|---|---|---|---|
| `hs_crp` | mg/L | <0.5 | 0.5–1.0 | 1.0–3.0 (Tier 2 chronic); >3.0 (Tier 2); >10 → **Tier 1** (repeat in 2 weeks) |
| `homocysteine` | μmol/L | <7 | 7–10 | >10 (Tier 2 B-vitamin); >15 → **Tier 1** |
| `glyca` (NMR) | μmol/L | <340 | 340–400 | >400 (research-grade chronic-inflammation) |
| `nlr` (derived) | ratio | 1.0–2.0 | 1.0–3.0 | >3.0 (inflammation/stress signal) |
| `mhr` (derived, abs Mono / HDL) | ratio | <0.01 | <0.013 | >0.013 (CV/inflammation signal) |

## 7. Thyroid

| Marker | Unit | Optimal | Acceptable | Off-target |
|---|---|---|---|---|
| `tsh` | μIU/mL | 1.0–2.0 | 0.4–4.0 | >4.0 (Tier 2 subclinical hypothyroid); >10 → **Tier 1** |
| `free_t3` | pg/mL | 3.0–3.8 | 2.0–4.4 | outside |
| `free_t4` | ng/dL | 1.1–1.4 | 0.8–1.8 | outside |
| `anti_tpo` | IU/mL | <9 | <34 | ≥34 (Hashimoto's signal — Tier 2, endo referral) |
| `anti_tg` | IU/mL | <20 | <40 | ≥40 |

## 8. Vitamins & Iron

| Marker | Unit | Optimal | Acceptable | Off-target |
|---|---|---|---|---|
| `vitamin_d_25oh` | ng/mL | 40–60 | 30–80 | <30 (Tier 2 deficient); <20 → **Tier 1** (severe) |
| `vitamin_b12` | pg/mL | 500–900 | 300–900 | <300 (Tier 2); <200 → **Tier 1** |
| `folate` | ng/mL | >10 | 4–17 | <4 |
| `ferritin` (M) | ng/mL | 75–150 | 30–400 | <30 (deficient); >300 (inflammation/iron overload) |
| `ferritin` (F, pre-menopause) | ng/mL | 50–120 | 15–150 | <15 (deficient); >200 (inflammation) |
| `iron_serum` | μg/dL | 80–130 | 60–170 | outside |
| `tibc` | μg/dL | 250–350 | 240–450 | outside |
| `transferrin_saturation` | % | 25–35 | 20–50 | outside |

## 9. Hormones

| Marker | Unit | Optimal | Acceptable | Off-target |
|---|---|---|---|---|
| `testosterone_total` (M, 18–50) | ng/dL | 600–900 | 300–1000 | 400–599 → **Tier 3** (relative-low — optimize); <400 → **Tier 2** (workup); <250 → **Tier 1** |
| `testosterone_total` (F) | ng/dL | 25–60 | 15–70 | outside |
| `testosterone_free` (M) | pg/mL | 15–25 | 7–30 | <8 |
| `shbg` (M) | nmol/L | 20–45 | 13–71 | outside |
| `dhea_s` (M, 30–50) | μg/dL | 200–400 | 120–520 | <100 |
| `dhea_s` (F, 30–50) | μg/dL | 100–250 | 60–340 | <60 |
| `cortisol_am` | μg/dL | 8–15 | 5–23 | 15–23 (Tier 3 stress signal); >23 (Tier 2 chronic stress); <5 → **Tier 1** (adrenal) |
| `igf_1` (age-adjusted) | ng/mL | 50th–75th centile for age | outside | extremes → endocrine workup |
| `estradiol` (M) | pg/mL | 15–35 | 10–40 | outside |
| `psa_total` (M, <50yr) | ng/mL | <1.0 | <4.0 | ≥4.0 → urology referral |

## 10. Minerals

| Marker | Unit | Optimal | Acceptable | Off-target |
|---|---|---|---|---|
| `magnesium` (serum) | mg/dL | 2.0–2.4 | 1.7–2.4 | <1.8 (Tier 2 supplementation indicated). Note: serum Mg is poor; RBC-Mg or symptomatic threshold often more useful. |
| `zinc` | μg/dL | 90–120 | 70–150 | <70 |
| `selenium` | μg/L | 120–150 | 70–150 | outside |

## 11. Allergy

| Marker | Unit | Optimal | Acceptable | Off-target |
|---|---|---|---|---|
| `ige_total` | IU/mL | <50 | <100 | ≥100 (atopic signal — correlate with HPI) |

---

## Tier assignment algorithm

For each marker in `biomarkers.json`:

1. Look up the value against this file's ranges for the marker's `category` + sex.
2. If value falls in **Optimal** → **Tier 4** (maintain — celebratory framing).
3. If value falls in **Acceptable** but outside Optimal → **Tier 3** (secondary target — light nudge).
4. If value is **Off-target** AND triggers an explicit Tier-1 threshold (e.g., `vitamin_d_25oh < 20`, `ldl ≥ 190`, `hba1c ≥ 6.5`, `tsh > 10`, `egfr < 60`) → **Tier 1** (refer to physician).
5. Otherwise off-target → **Tier 2** (primary intervention target).

A panel with mostly Tier 4 markers gets a **celebratory framing**; one with multiple Tier 2 markers gets a **serious, action-oriented framing**. Tier 1 always gets the **medical-advisory callout first**.

## Status badges (used in the report)

| Tier | Badge label | Color token |
|---|---|---|
| 1 | "REFER" | `--accent` (burnt orange — attention) |
| 2 | "OFF-TARGET" | `--gold` (amber — action) |
| 3 | "WATCH" | `--ink-soft` (muted) |
| 4 | "OPTIMAL" | `--leaf` (green — celebration) |
