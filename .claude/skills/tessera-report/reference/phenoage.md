# PhenoAge — Levine 2018 Biological Age Formula

Source: Levine ME et al., "An epigenetic biomarker of aging for lifespan and healthspan," *Aging* (Albany NY), 2018. The "phenotypic age" (PhenoAge) version is a 9-marker blood-chemistry model trained on NHANES IV mortality data.

## Required inputs (10 values)

All 10 must be present. If any one is missing, PhenoAge cannot be computed — report "biological age not available" and explain which marker is absent.

| # | Marker | Required unit |
|---|---|---|
| 1 | Albumin | g/L |
| 2 | Creatinine | μmol/L |
| 3 | Glucose (fasting) | mmol/L |
| 4 | C-Reactive Protein (hsCRP preferred) | mg/L |
| 5 | Lymphocyte percent | % |
| 6 | Mean Corpuscular Volume (MCV) | fL |
| 7 | Red Cell Distribution Width (RDW) | % |
| 8 | Alkaline Phosphatase (ALP) | U/L |
| 9 | White Blood Cell count (WBC) | 10³ cells/μL (= K/μL) |
| 10 | Chronological age | years |

## Unit conversions (Indian labs)

Indian lab PDFs (Thyrocare, Redcliffe, Apollo, SRL, Dr. Lal) almost always report in different units than the PhenoAge model. Convert before plugging into the formula.

| From (Indian lab) | To (PhenoAge) | Multiplier |
|---|---|---|
| Albumin g/dL | g/L | × 10 |
| Creatinine mg/dL | μmol/L | × 88.4 |
| Glucose mg/dL | mmol/L | × 0.05551 (or ÷ 18.0182) |
| hsCRP mg/dL (rare) | mg/L | × 10 |
| hsCRP mg/L | mg/L | × 1 (no change) |
| Lymphocyte % | % | × 1 |
| MCV fL | fL | × 1 |
| RDW-CV % | % | × 1 |
| RDW-SD fL | — | **not accepted**; use RDW-CV % |
| ALP U/L (= IU/L) | U/L | × 1 |
| WBC ×10³/μL (= K/μL) | 10³/μL | × 1 |
| WBC cells/μL | 10³/μL | ÷ 1000 |

If a lab reports CRP (not hs-CRP) and the value is < 0.5 mg/L, treat as 0.5 mg/L floor (the regular CRP assay isn't sensitive below ~3 mg/L; this is conservative). Note this in the report.

## Formula

### Step 1 — Linear combination

```
xb = -19.907
   + (-0.0336  × Albumin_g_per_L)
   + ( 0.0095  × Creatinine_umol_per_L)
   + ( 0.1953  × Glucose_mmol_per_L)
   + ( 0.0954  × ln(CRP_mg_per_L))
   + (-0.0120  × Lymphocyte_percent)
   + ( 0.0268  × MCV_fL)
   + ( 0.3306  × RDW_percent)
   + ( 0.00188 × ALP_U_per_L)
   + ( 0.0554  × WBC_10e3_per_uL)
   + ( 0.0804  × Chronological_age_years)
```

(`ln` = natural log. If hsCRP is ≤ 0, clamp to 0.01 mg/L before taking the log — a value that low typically means "below detection limit.")

### Step 2 — 10-year mortality score

```
gamma = 0.0076927
MortScore = 1 - exp( -exp(xb) × (exp(gamma × 120) - 1) / gamma )
```

### Step 3 — PhenoAge

```
PhenoAge = 141.50225 + ln( -0.00553 × ln(1 - MortScore) ) / 0.090165
```

Round to one decimal place for display.

### Step 4 — Delta vs. chronological

```
Delta = PhenoAge - Chronological_age
```

- **Delta < 0** — biologically younger than calendar age. Frame as a win.
- **Delta ≈ 0** — biological age tracking calendar age.
- **Delta > 0** — biologically older than calendar age. Frame as the headline opportunity (this is what the program is built to move).

A typical adult 25–55 with reasonable health lands within ±5 years of chronological. Deltas beyond ±10 years deserve scrutiny — re-check unit conversions before reporting.

## Reference test cases (use to sanity-check your implementation)

| Case | Age | Alb (g/dL) | Creat (mg/dL) | Gluc (mg/dL) | CRP (mg/L) | Lymph % | MCV | RDW | ALP | WBC (K/μL) | Expected PhenoAge |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Healthy 30M | 30 | 4.6 | 0.9 | 85 | 0.4 | 32 | 88 | 12.8 | 65 | 5.4 | ~24–27 |
| Average 45M | 45 | 4.2 | 1.0 | 95 | 1.2 | 28 | 90 | 13.3 | 78 | 6.8 | ~43–47 |
| Metabolic-stressed 38F | 38 | 4.0 | 0.8 | 108 | 3.5 | 24 | 92 | 14.2 | 95 | 8.2 | ~46–52 |

Your implementation should land within ~2 years of these targets. If you're off by more, recheck unit conversions (most common: forgetting to multiply albumin by 10, or using mg/dL for glucose instead of mmol/L).

## Implementation note (TypeScript reference)

```ts
type PhenoAgeInput = {
  age: number;
  albumin_g_per_L: number;
  creatinine_umol_per_L: number;
  glucose_mmol_per_L: number;
  crp_mg_per_L: number;
  lymph_pct: number;
  mcv_fL: number;
  rdw_pct: number;
  alp_U_per_L: number;
  wbc_K_per_uL: number;
};

export function phenoAge(i: PhenoAgeInput): { bioAge: number; delta: number; xb: number; mortScore: number } {
  const crp = Math.max(i.crp_mg_per_L, 0.01);
  const xb =
    -19.907
    + -0.0336  * i.albumin_g_per_L
    +  0.0095  * i.creatinine_umol_per_L
    +  0.1953  * i.glucose_mmol_per_L
    +  0.0954  * Math.log(crp)
    + -0.0120  * i.lymph_pct
    +  0.0268  * i.mcv_fL
    +  0.3306  * i.rdw_pct
    +  0.00188 * i.alp_U_per_L
    +  0.0554  * i.wbc_K_per_uL
    +  0.0804  * i.age;
  const gamma = 0.0076927;
  const mortScore = 1 - Math.exp( -Math.exp(xb) * (Math.exp(gamma * 120) - 1) / gamma );
  const bioAge = 141.50225 + Math.log(-0.00553 * Math.log(1 - mortScore)) / 0.090165;
  return { bioAge: Math.round(bioAge * 10) / 10, delta: Math.round((bioAge - i.age) * 10) / 10, xb, mortScore };
}
```

## In the report

Always show:
- The headline biological age and delta on the cover.
- A table of the 9 input markers with their normalized PhenoAge values (so a careful reader can audit).
- A 1-paragraph plain-English explanation: "PhenoAge is a validated blood-chemistry estimate of how your body is aging, trained on long-term mortality data from US adults. It is not a diagnosis or a destiny — it's a snapshot, and it is movable. Tessera's program is designed specifically to move it."
- The mortality_score is computed but **never shown to the user.** Internal use only.
