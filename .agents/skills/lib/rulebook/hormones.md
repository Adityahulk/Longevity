# Rulebook — Hormones

## R-HOR-01 — Low Testosterone (M)
- **trigger**: `testosterone_total < 400` (M)
- **tier**: 2
- **root_cause_hypothesis**: visceral fat, sleep debt, alcohol, insulin resistance, low resistance training.
- **N**: protein 1.6g/kg · adequate fat (don't drop below 25% calories) · zinc-rich foods (pumpkin seeds, oysters).
- **T**: heavy compound resistance 3×/wk (squats, deadlifts, pulls) · short rest · 8–12 reps.
- **R**: 8h sleep — T production happens in deep sleep.
- **S**: Vitamin D >50 ng/mL · zinc 25mg/day if deficient · magnesium 400mg/day · ashwagandha 600mg/day KSM-66 [E2 — modest T ↑].
- **M**: stress reduction (chronic cortisol suppresses T).
- **retest_signal**: total T ↑ 100–200 ng/dL in 90 days achievable.
- **evidence_tier**: E2

## R-HOR-02 — Severely low Testosterone — **TIER 1**
- **trigger**: `testosterone_total < 250` (M)
- **tier**: 1
- Endocrinology consult — rule out primary vs. secondary hypogonadism. Do not start TRT casually.
- **evidence_tier**: E1

## R-HOR-03 — Elevated AM cortisol
- **trigger**: `cortisol_am > 23 μg/dL` OR (`cortisol_am 15–23` AND intake `stress_level ≥ 7` OR PHQ-2+GAD-2 elevated)
- **tier**: 2 if >23; 3 if 15–23 with stress signal
- **root_cause_hypothesis**: chronic stress → HPA-axis dysregulation; or sample collection >9 AM (false high).
- **R**: sleep hygiene · phone out of bedroom · no caffeine after noon · screen curfew 60 min before bed.
- **M**: 10-min daily meditation (Headspace/Waking Up/Sam Harris) · 5-min slow-breath (6 breaths/min — physiological sigh / 4-7-8 / box) · weekly nature exposure.
- **N**: stable meals · avoid intermittent fasting beyond 14:10 during high-stress periods · don't skip breakfast.
- **S**: ashwagandha 600mg/day KSM-66 [E2 — cortisol ↓ 15–30%] · phosphatidylserine 100mg evening (if PM cortisol high) [E3].
- **retest_signal**: cortisol AM ↓ 3–6 μg/dL in 90 days; HRV ↑ 10–20%.
- **evidence_tier**: E2

## R-HOR-04 — Relative-low Testosterone (NEW — Tessera-optimal gap)
- **trigger**: `testosterone_total 400–599 ng/dL` in M aged 18–50 (i.e., above clinical-low cutoff 400 but below Tessera-optimal 600)
- **tier**: 3
- **root_cause_hypothesis**: not pathological but suboptimal for healthspan/body composition/mood/libido at this age — typically lifestyle-driven (insufficient resistance training, sleep debt, low Vit D, marginal nutrient status, stress).
- All R-HOR-01 interventions but framed as **optimization**, not treatment.
- **retest_signal**: T ↑ to 600–800 in 90 days achievable for most lean young men with full protocol adherence.
- **evidence_tier**: E2

## R-HOR-05 — Low DHEA-S
- **trigger**: `dhea_s < 100 μg/dL` (M) OR `< 60 μg/dL` (F)
- **tier**: 2
- **root_cause_hypothesis**: HPA-axis fatigue ("adrenal exhaustion"); chronic stress; aging.
- Pair recommendations with R-HOR-03 (cortisol) protocols.
- **S**: discuss DHEA 25–50mg/day with physician [E2 in middle-aged adults with confirmed deficiency]. Do not self-prescribe.
- **evidence_tier**: E2

## R-HOR-06 — Low estradiol in pre-menopausal female
- **trigger**: `estradiol < 30 pg/mL` in F during follicular/luteal phase
- **tier**: 2
- Suggests HPO-axis dysfunction (RED-S, hypothalamic amenorrhea, PCOS variant).
- Refer to OB-GYN; pause aggressive caloric restriction; ensure body fat ≥ 18%.
- **evidence_tier**: E1
