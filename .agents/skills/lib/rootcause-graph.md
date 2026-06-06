# Root-Cause Graph — Encoded Longevity Mechanisms

This file is consumed by `tessera-rootcause-phenotype`. It encodes ~30 well-established mechanisms in longevity / metabolic / endocrine / immune biology as a directed graph: each node is a *state* or *driver*, each edge is a *causal influence* with a polarity (`+` = increases, `−` = decreases).

The skill traverses backward from the fired rules' triggering markers to find **root nodes** — drivers that have *outgoing* influence on multiple findings but no *incoming* drivers among the fired set. Those are the leverage points.

---

## Graph format

Each mechanism block:

```yaml
id: M-<NN>
name: <human-readable mechanism name>
root_driver: <upstream state / behavior / nutrient — what to attack>
downstream_effects:
  - <fired marker / phenotype effect>: <polarity> <strength: weak | moderate | strong>
intake_signals: <what to look for in intake.json that confirms this mechanism is active>
intervention_class: <Nutrition / Training / Recovery / Supplements / Mind / Medical>
notes: <brief mechanism explanation>
```

---

## M-01 — Chronic HPA-axis activation (chronic stress)

- **root_driver**: psychological + physiological stress load (work, sleep debt, over-training, caffeine, alcohol, life events) → sustained cortisol elevation → HPA dysregulation
- **downstream_effects**:
  - cortisol_am ↑ (strong)
  - testosterone_total ↓ (moderate, in M) — cortisol blocks GnRH pulsatility
  - hs_crp ↑ (moderate) — cortisol is biphasic; chronic = pro-inflammatory
  - insulin_fasting ↑ (moderate) — cortisol antagonizes insulin
  - HRV ↓ (strong, from wearable)
  - sleep_quality ↓ (strong, from intake)
  - hba1c ↑ (weak)
  - immune competence ↓ → atopic flares + viral susceptibility
- **intake_signals**: stress_level ≥ 7, PSS-4 elevated, PHQ-2/GAD-2 ≥ 3, recent life events, work hours >50, sleep < 7h
- **intervention_class**: Mind, Recovery, sometimes Medical (anxiety/depression treatment)
- **notes**: Foundational root for many "stress-overlay" phenotypes. Cortisol AM near top of range (15–23 μg/dL) with intake stress signals = high-confidence M-01 fire.

## M-02 — Vitamin D deficiency cascade

- **root_driver**: low 25(OH)D from inadequate UVB + low fatty-fish intake + sunscreen use + dark skin + indoor lifestyle
- **downstream_effects**:
  - vitamin_d_25oh ↓ (definitional)
  - immune dysregulation → eosinophils ↑, atopic flares, recurrent infections, autoimmune tendency
  - testosterone_total ↓ (moderate) — Vit D is steroidogenic cofactor
  - calcium absorption ↓ → secondary hyperparathyroidism → bone loss
  - mood ↓ → depression risk
  - insulin sensitivity ↓ (weak)
  - muscle strength ↓ (moderate)
- **intake_signals**: low fatty-fish intake, indoor work, sunscreen >SPF 30 daily, dark complexion + tropical latitude, recurrent infections
- **intervention_class**: Supplements (loading), Nutrition, Recovery (AM sunlight)
- **notes**: One of the most common root drivers in urban Indians (>70% deficient). Severe deficiency (<20 ng/mL) cascades widely.

## M-03 — Sleep debt

- **root_driver**: chronic sleep <7h or low sleep efficiency
- **downstream_effects**:
  - cortisol_am ↑ (moderate)
  - testosterone_total ↓ (strong — T peaks in REM/deep sleep)
  - growth hormone ↓ (strong)
  - insulin sensitivity ↓ (strong — 1 week of 4-5h sleep mimics IR)
  - hba1c ↑ (weak)
  - hs_crp ↑ (moderate)
  - appetite hormones dysregulated (leptin ↓, ghrelin ↑)
  - HRV ↓
- **intake_signals**: sleep_hours <7, sleep_quality <6, time_to_fall_asleep >30 min, late dinner >9pm, screens before bed
- **intervention_class**: Recovery (sleep hygiene)
- **notes**: Sleep is the single highest-leverage recovery lever. Always attack before adding supplements/medications.

## M-04 — Insulin resistance / metabolic syndrome cascade

- **root_driver**: visceral adiposity + refined-carb load + sedentary lifestyle + low muscle mass
- **downstream_effects**:
  - homa_ir ↑ (definitional)
  - hba1c ↑
  - triglycerides ↑, hdl ↓
  - apo_b ↑ (modest)
  - alt ↑ (NAFLD)
  - hs_crp ↑
  - testosterone_total ↓ (in M) — visceral fat aromatizes T to E2
  - blood pressure ↑
- **intake_signals**: waist >90cm (M) / >80cm (F), eating window >14h, low protein, low fiber, low cardio, low strength
- **intervention_class**: Nutrition, Training (Zone 2 + resistance), sometimes Medical (metformin)
- **notes**: The classic Indian "thin-fat" phenotype — normal BMI but visceral adiposity drives M-04.

## M-05 — Subclinical inflammation (chronic low-grade)

- **root_driver**: ultra-processed food + seed-oil excess + sleep debt + visceral fat + gut dysbiosis + periodontal disease + low omega-3:6 ratio
- **downstream_effects**:
  - hs_crp ↑
  - homocysteine ↑ (indirect, via B-vitamin demand)
  - apo_b ↑ (modest, via hepatic VLDL)
  - hba1c ↑ (modest)
  - nlr ↑
  - testosterone_total ↓
- **intake_signals**: processed_food_score ≤5, frequent eating out, low fatty-fish, no dental care in 12 months, oral health issues
- **intervention_class**: Nutrition (whole-food shift), Supplements (omega-3), Medical (dental)
- **notes**: Frequently downstream of M-04 (IR) and M-03 (sleep debt). Address those first.

## M-06 — B-vitamin / methylation insufficiency

- **root_driver**: low folate / B12 / B6 + MTHFR polymorphism + alcohol + kidney function
- **downstream_effects**:
  - homocysteine ↑
  - rdw_cv ↑ (mixed-cell-size signal)
  - mood ↓ / cognitive fog (weak)
  - peripheral neuropathy risk (if severe B12 deficiency)
- **intake_signals**: vegetarian/vegan without supplementation, alcohol >7 drinks/week, GI symptoms
- **intervention_class**: Supplements (methylated B-complex), Nutrition (leafy greens, eggs)
- **notes**: Vegetarian Indians are at structurally elevated risk. Always check B12 + folate + homocysteine together.

## M-07 — Sarcopenia / low lean mass

- **root_driver**: insufficient resistance training + insufficient dietary protein + low Vit D + chronic inflammation + aging
- **downstream_effects**:
  - muscle mass ↓ → metabolic rate ↓
  - homa_ir ↑ (muscle is largest glucose-disposal organ)
  - albumin ↓ (if severe)
  - creatinine ↓ (artifactually low — clue to low muscle)
  - falls / fragility risk ↑ (older adults)
- **intake_signals**: protein <1.0 g/kg, strength_sessions <2/wk, age >35, weight loss without resistance training
- **intervention_class**: Training (resistance compound lifts), Nutrition (protein 1.4–1.6 g/kg)
- **notes**: Highest-leverage intervention for healthspan past 35.

## M-08 — Gut dysbiosis / leaky gut

- **root_driver**: low fiber + ultra-processed food + frequent antibiotics + low fermented-food intake + chronic stress
- **downstream_effects**:
  - hs_crp ↑ (weak-moderate)
  - atopic / autoimmune tendency ↑
  - mood / BDNF effects (gut-brain axis)
  - nutrient malabsorption (B12, iron)
- **intake_signals**: low fiber (<25g), no fermented foods, IBS-pattern GI symptoms, recurrent antibiotics
- **intervention_class**: Nutrition (fiber + fermented foods), sometimes Supplements (specific probiotics)
- **notes**: Hard to measure directly; inferred from intake + downstream signals.

## M-09 — Iron / ferritin insufficiency

- **root_driver**: low iron intake (vegetarian) + heavy menses (F) + GI loss + impaired absorption (PPI use, low stomach acid)
- **downstream_effects**:
  - ferritin ↓
  - hemoglobin ↓ (if severe)
  - mcv ↓ (microcytic if severe)
  - rdw_cv ↑
  - fatigue, hair loss, restless legs, cold intolerance
- **intake_signals**: vegetarian, female pre-menopause, GI symptoms, PPI use, tea/coffee with meals
- **intervention_class**: Supplements (iron bisglycinate every-other-day), Nutrition
- **notes**: Most common nutrient deficiency globally + in Indian women.

## M-10 — Atopic / Th2-skewed immune phenotype

- **root_driver**: genetic predisposition (often) + Vit D deficiency + gut dysbiosis + chronic allergen exposure (dust mites, pollen, mold) + Th2-skewing infections (parasites, helminths)
- **downstream_effects**:
  - eosinophils ↑
  - ige_total ↑
  - rhinitis / asthma / eczema flares
  - chronic urticaria
- **intake_signals**: HPI positive for rhinitis/eczema/asthma/food allergy, family hx atopy, recent travel to endemic areas
- **intervention_class**: Supplements (Vit D, omega-3, quercetin), Nutrition (elimination trial), Recovery (allergen avoidance), Medical (allergist if symptomatic)
- **notes**: Eosinophilia in isolation is not diagnostic — always pair with HPI before tier-2 action.

## M-11 — Thyroid dysfunction (autoimmune or nutrient)

- **root_driver**: anti-TPO antibodies (Hashimoto's), iodine deficiency/excess, selenium deficiency, severe Vit D deficiency, chronic stress
- **downstream_effects**:
  - tsh ↑, free t4 ↓ (overt) or normal (subclinical)
  - basal metabolic rate ↓
  - cold intolerance, hair loss, constipation, fatigue
  - lipids ↑ (LDL especially)
- **intake_signals**: cold intolerance, fatigue, weight gain without diet change, hair thinning, family hx thyroid
- **intervention_class**: Medical (endocrinology if overt), Supplements (Vit D, selenium, iodine if deficient)

## M-12 — Cardiometabolic genetic load (Lp(a), ApoE, family hx CV)

- **root_driver**: genetic — Lp(a) elevation, ApoE4 carriage, family history premature CV
- **downstream_effects**:
  - lp_a ↑ (definitional if elevated)
  - lifelong ApoB-mediated CV risk ↑
- **intake_signals**: family_history_cardio positive, especially first-degree <55 (M) / <65 (F)
- **intervention_class**: Medical (cardiologist), aggressive control of EVERY OTHER lipid (LDL <70 if Lp(a) elevated)
- **notes**: Can't move lifestyle-wise. Strategy is to crush every other risk factor.

## M-13 — Environmental toxin / pollution load

- **root_driver**: chronic exposure to PM2.5 (urban India AQI), occupational chemicals, mold, indoor air quality
- **downstream_effects**:
  - hs_crp ↑ (weak-moderate)
  - cardiovascular event risk ↑
  - respiratory: asthma exacerbation, COPD
- **intake_signals**: city = Delhi/Mumbai/Hyderabad/Bengaluru/Chennai (high AQI), commute >45min, no HEPA at home, no mask in pollution
- **intervention_class**: Recovery (HEPA filter, mask, indoor cardio on high-AQI days), Supplements (NAC, glutathione)
- **notes**: Often underweighted in Indian protocols.

## M-14 — Alcohol load

- **root_driver**: >7 drinks/wk or any binge pattern
- **downstream_effects**:
  - alt, ggt ↑
  - triglycerides ↑
  - HDL ↑ (paradoxical short-term; long-term net negative)
  - sleep architecture ↓ (REM suppression)
  - cortisol dysregulation
  - cancer risk ↑ (breast, colon, liver, esophageal — even at moderate intake)
- **intake_signals**: weekly_alcohol_drinks >7, or any single-occasion >4
- **intervention_class**: Nutrition (drop)
- **notes**: Alcohol is the most under-recognized longevity-killer in middle-class Indians.

## M-15 — Caloric oversupply (overweight/obese phenotype)

- **root_driver**: chronic caloric surplus → adiposity
- **downstream_effects**: same cascade as M-04 (insulin resistance) but with explicit body-composition layer
- **intake_signals**: BMI >25, waist >90cm M / >80cm F
- **intervention_class**: Nutrition (caloric audit), Training
- **notes**: BMI is imperfect in Indians (visceral fat at lower BMI); waist or DEXA preferred.

## M-16 — Caloric undersupply / RED-S

- **root_driver**: chronic caloric deficit + over-training
- **downstream_effects**:
  - testosterone ↓ (M)
  - estradiol ↓ (F → hypothalamic amenorrhea)
  - cortisol_am ↑
  - free_t3 ↓
  - bone density ↓
- **intake_signals**: high training volume + low food intake + weight loss + amenorrhea
- **intervention_class**: Nutrition (caloric availability), Training (deload), Medical (endo)

## M-17 — Sex-hormone insufficiency (M, lifestyle-driven)

- Synthesis of M-01 + M-02 + M-03 + M-04: when chronic stress + sleep debt + Vit D deficiency + insulin resistance stack, testosterone is suppressed even without primary endocrine disease.
- **intervention_class**: address each upstream root. T optimization is downstream, not upstream.

## M-18 — Oral health / periodontitis driver

- **root_driver**: gingivitis / periodontitis (very common, often silent)
- **downstream_effects**: hs_crp ↑ (moderate), CV risk ↑, glycemic control ↓
- **intake_signals**: no dental care 12+ months, gum bleeding, halitosis
- **intervention_class**: Medical (dental cleaning)
- **notes**: Underrecognized cause of "idiopathic" elevated hsCRP.

## M-19 — Methylation polymorphism (MTHFR / COMT — research-grade)

- **root_driver**: genetic
- **downstream_effects**: homocysteine ↑, B-vitamin metabolism altered, neurotransmitter clearance affected (COMT)
- **intake_signals**: genetics.json (if available)
- **intervention_class**: Supplements (methylated B forms)

## M-20 — APOE ε4 carriage (research-grade)

- **root_driver**: genetic
- **downstream_effects**: Alzheimer's risk ↑, ApoB sensitivity to saturated fat ↑
- **intervention_class**: Lifestyle (Mediterranean / lower sat-fat diet), aggressive ApoB control, cardiovascular training, sleep priority for glymphatic clearance

## M-21 through M-30 (placeholders — extended in Phase D)

- M-21: thyroid autoimmune cascade
- M-22: liver fibrosis acceleration (NAFLD → NASH)
- M-23: kidney function decline
- M-24: chronic infection load (H. pylori, periodontitis, latent viruses)
- M-25: heavy metal exposure (lead, mercury — niche)
- M-26: muscle / fascia chronic injury (movement dysfunction)
- M-27: circadian misalignment (shift work, jet lag)
- M-28: social isolation / loneliness (real longevity driver per cohort data)
- M-29: purpose / meaning deficit (Blue Zones literature)
- M-30: muscle disuse atrophy (post-injury, post-illness)

---

## How `tessera-rootcause-phenotype` uses this file

1. Reads `rule-evaluation.json` (fired rules + triggering markers).
2. For each fired rule, queries this file: "which mechanism IDs list this marker in `downstream_effects`?"
3. Builds a candidate set of mechanism IDs.
4. **Scores** each mechanism by how many of the fired markers it explains, weighted by edge strength.
5. Selects the **top 2–3 highest-scoring mechanisms** as root nodes.
6. Cross-references with `intake.json` for confirming `intake_signals` — boosts confidence.
7. Returns `rootcause.json` with: root mechanism IDs, explained markers per mechanism, confidence score, suggested intervention class.

The protocol then attacks at the root, not at every leaf — fewer habits, higher leverage.
