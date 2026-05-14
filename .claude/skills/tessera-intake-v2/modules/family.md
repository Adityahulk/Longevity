# Module G — Family History Depth

The original intake had 2 fields (cardio, diabetes). This module captures the depth needed to:
- Stratify cardiometabolic risk (premature CV in 1st-degree relative changes ApoB target).
- Trigger age-appropriate screening prompts (colonoscopy, mammography, dexa, low-dose CT).
- Identify autoimmune-tendency clients (Hashimoto / RA / SLE / IBD / psoriasis cluster in family).
- Estimate longevity-outlier baseline.

## Questions

For each, capture: relation (parent / sibling / grandparent / aunt-uncle), age of onset (if known), and side (paternal / maternal).

1. **Cardiovascular** — heart attack, stroke, sudden cardiac death, arrhythmia, peripheral vascular disease, angioplasty/CABG. Note: 1st-degree premature event (M <55 / F <65) is a strong risk-modifier.
2. **Diabetes** — Type 2 (most common), Type 1, gestational. Note: 1st-degree T2D doubles risk; multiple relatives = strong familial signature.
3. **Cancers** — type (breast, colon, prostate, lung, pancreatic, ovarian, hematologic), age of onset, side. Note: 1st-degree relative under 50 = screening starts earlier.
4. **Dementia / Alzheimer's** — relation + age of onset. APOE ε4 inherited; family hx changes Vit D / sleep / exercise prioritization.
5. **Autoimmune** — Hashimoto's, Graves', RA, SLE, IBD (Crohn's / UC), psoriasis, MS, type 1 diabetes, celiac. Family clustering predicts client risk.
6. **Thyroid disease** (any form, including nodules).
7. **Kidney disease** — CKD, dialysis, transplant, polycystic kidney disease (PKD — genetic).
8. **Liver disease** — cirrhosis, hepatitis (chronic), hemochromatosis (genetic iron overload).
9. **Mental health** — depression (severe), bipolar, schizophrenia, suicide. Helps inform whether to use St. John's Wort / 5-HTP / ashwagandha (all bipolar-contraindicated).
10. **Premature death under 60** — any cause + age. Strong signal.
11. **Longevity outliers** — grandparents (or parents) who lived past 85 — count.

## Output to `intake.json` under `family`:

Structured list of conditions with relation + age + side.

## How this affects protocol

- 1st-degree premature CV → ApoB target tightened to <80 (or <60 if Lp(a) elevated)
- 1st-degree T2D under 50 → aggressive HOMA-IR target <1.0, eating-window emphasis
- 1st-degree colon cancer → colonoscopy recommendation at age 40 (or 10y before relative's onset)
- 1st-degree breast cancer → mammography earlier, consider iodine + Vit D
- Family hx Hashimoto → anti-TPO recommended at retest
- Family hx Alzheimer's → APOE genotype (if comfortable), Vit D priority, sleep priority
- Multiple longevity outliers (grandparents >85) → celebrate the genetic baseline; lifestyle is the lever
