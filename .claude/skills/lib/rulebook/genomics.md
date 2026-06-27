# Rulebook — Genomics (`R-GEN-*`)

Genomic rules read genotypes from `genetics.json` (catalog: `lib/genomics-canonical.md`). They are
**dual-purpose**:

1. **Standalone finding** — a card in the Genomic Filter explaining a lifelong predisposition and what
   the protocol does about it.
2. **Modifier** — a genomic rule can change an *already-fired* biomarker rule rather than stand alone:
   it can **raise the tier/priority** of a biomarker rule, or **tighten a target** (e.g. ApoE ε4 pulls
   the ApoB target from <80 to <70). The `modifier_of` field names the biomarker rule it adjusts.

This keeps the genome from overriding the blood: a variant only sharpens action on a signal the
bloodwork is *already* showing. A genotype with clean corresponding biomarkers stays informational.

All genomics findings are **research-grade, not diagnostic**, and carry South-Asian-context caveats
where `genomics-canonical.md` specifies. APOE disclosure is sensitive (offer counseling, never alarmist).

## Rule format

Same six-field contract as the organ rulebooks, plus two optional genomic fields:

```yaml
code: R-GEN-XXX-NN
trigger: (genotype condition + optional biomarker/intake gate)
tier: 1 | 2 | 3 | 4
modifier_of: (biomarker rule code this adjusts, or "—" if standalone)
root_cause_hypothesis: ...
domain_interventions: { N, T, R, S, M }
retest_signal: (genome doesn't move; this is the downstream marker to watch)
evidence_tier: E1–E5
physician_referral_required: true | false
```

---

## R-GEN-APOE-01 — APOE ε4 carrier
- **trigger**: `apoe.genotype ∈ {ε3/ε4, ε4/ε4}`
- **tier**: 2 (ε4/ε4 → escalate emphasis, still managed via modifiable risk + clinician)
- **modifier_of**: `R-LIP-01` (high ApoB/LDL) — tightens the ApoB target to **<70 mg/dL** and raises
  the lipid lever to lead-priority. Also reinforces `R-LIP-05` (Lp(a)) strategy.
- **root_cause_hypothesis**: ε4 carriage raises lifetime Alzheimer's and CVD risk and sharpens the
  LDL/ApoB response to saturated fat. It is among the most *lifestyle-modifiable* risk genes — exercise,
  sleep, lipid control and metabolic health meaningfully attenuate it.
- **N**: Mediterranean-leaning fat profile (olive oil, nuts, fatty fish; minimise saturated fat — ghee,
  fatty red meat, butter); fiber 30g+; keep refined carbs low (metabolic health protects the brain too).
- **T**: prioritise Zone-2 aerobic work (cerebrovascular + ApoB lever) and keep VO₂max trending up.
- **R**: protect deep sleep — glymphatic clearance of amyloid is sleep-dependent; this is a brain-health
  lever, not just recovery.
- **S**: omega-3 (algal or fish) for ApoB/brain; vitamin D to sufficiency; no nootropic claims.
- **M**: stress + sleep are cognitive-reserve levers; cardiovascular risk-factor control is the
  evidence-backed dementia-risk-reduction route.
- **retest_signal**: ApoB toward <70 by Day 90; the genome itself never changes — track the modifiable
  markers it amplifies.
- **evidence_tier**: E1
- **physician_referral_required**: true (lipid/risk review; **offer genetic counseling** — disclose ε4
  factually, pair with the modifiable upside, never deterministic).

## R-GEN-LPA-01 — Genetic Lp(a) elevation (gene + measured convergence)
- **trigger**: `lpa_genetic.carrier = true` AND measured `lp_a ≥ 50 mg/dL (or ≥ 125 nmol/L)`
- **tier**: 2 (with clinician)
- **modifier_of**: `R-LIP-05` (elevated Lp(a)) — confirms the genetic basis and hardens the "crush
  every *other* ApoB-mediated risk" strategy (LDL/ApoB <70).
- **root_cause_hypothesis**: Lp(a) is ~80–90% genetic and lifelong; it is an independent causal CVD/
  aortic-stenosis amplifier that lifestyle cannot move. The leverage is everything else.
- **N/T/S**: all `R-LIP-01` ApoB-lowering interventions, run harder; **M/Medical**: clinician discussion
  of aggressive ApoB targets and first-degree family Lp(a) screening (it is heritable).
- **retest_signal**: Lp(a) is checked once and not chased; ApoB is the moving target.
- **evidence_tier**: E1
- **physician_referral_required**: true (lipidology — pairs with `R-GEN-SLCO1B1-01` if a statin is weighed).

## R-GEN-9P21-01 — 9p21 CAD risk locus
- **trigger**: `cad_9p21.genotype ∈ {CG, CC}`
- **tier**: 3 (4 if isolated with clean lipids; escalates when stacked)
- **modifier_of**: `R-LIP-01` — adds weight to early, aggressive ApoB control; when stacked with ApoE ε4
  and/or Lp(a), strengthens the case for an earlier clinician + imaging discussion.
- **root_cause_hypothesis**: The most replicated common CAD-risk locus, acting largely independent of
  lipids. One input to a polygenic picture, not a standalone verdict.
- **interventions**: no new behaviours of its own — it raises the priority of the cardiovascular lever
  already firing from blood.
- **retest_signal**: ApoB trend; coronary-risk discussion outcome with clinician.
- **evidence_tier**: E1
- **physician_referral_required**: false (folds into the lipid referral).

## R-GEN-TCF7L2-01 — TCF7L2 type-2-diabetes risk (gene + early-IR convergence)
- **trigger**: `t2d_tcf7l2.genotype ∈ {CT, TT}` AND (`homa_ir > 1.8` OR `hba1c ≥ 5.5` OR intake waist
  >90cm)
- **tier**: 3
- **modifier_of**: `R-MET-01` (early insulin resistance) — raises its protocol priority and the case for
  tighter glycemic targets + an earlier metabolic retest.
- **root_cause_hypothesis**: The strongest common T2D-risk variant (impaired insulin secretion); on the
  South-Asian "thin-fat" background it sharpens the case for early insulin-sensitivity work — but weight,
  fitness and fiber dominate outcome.
- **N**: protein + soluble fiber, lower refined-carb/glycemic load. **T**: Zone-2 + resistance (muscle =
  glucose sink). **R**: sleep (short sleep mimics IR). 
- **retest_signal**: HOMA-IR ↓, HbA1c stable/↓ by Day 90.
- **evidence_tier**: E1
- **physician_referral_required**: false (metabolic referral only if a Tier-1 glucose rule also fires).

## R-GEN-CYP1A2-01 — CYP1A2 slow caffeine metabolizer
- **trigger**: `cyp1a2.genotype ∈ {AC, CC}` (CC = clearly slow; AC = intermediate, apply if HRV/sleep
  telemetry shows caffeine sensitivity)
- **tier**: 3
- **modifier_of**: — (standalone; pairs with `R-WBL-05` HRV-anomaly to power the Autopilot)
- **root_cause_hypothesis**: Slow caffeine clearance means afternoon caffeine measurably degrades that
  night's sleep and HRV, and high intake is less cardiovascularly favorable for slow metabolizers.
- **R**: caffeine cutoff **10:00**, ≤1–2 cups/day; this protects deep sleep and next-day HRV.
- **M**: pair with non-caffeine afternoon energy strategy (daylight walk, hydration).
- **retest_signal**: wearable HRV 7-day mean ↑ and deep-sleep % ↑ within 2–3 weeks of moving caffeine
  earlier (directly observable in the same person's telemetry).
- **evidence_tier**: E1
- **physician_referral_required**: false

## R-GEN-MTHFR-01 — MTHFR variant + elevated homocysteine
- **trigger**: `mthfr_c677t.genotype ∈ {CT, TT}` (or A1298C compound-het) AND `homocysteine > 10 µmol/L`
- **tier**: 3
- **modifier_of**: `R-INF-*` homocysteine rule — switches the B-vitamin recommendation from folic acid
  to **methylfolate + methyl-B12** and upgrades it from optional to default.
- **root_cause_hypothesis**: Reduced MTHFR enzyme activity impairs folate→methyl-folate conversion;
  combined with measured high homocysteine, the active (methylated) B forms are the appropriate choice.
  (Genotype alone, with normal homocysteine and good folate intake, needs no action.)
- **N**: leafy greens, eggs, legumes (folate/B12 food sources). **S**: methylfolate (e.g. 400–800 µg)
  + methyl-B12; B6 as indicated. 
- **retest_signal**: homocysteine ↓ toward <9 by Day 90.
- **evidence_tier**: E2
- **physician_referral_required**: false

## R-GEN-SLCO1B1-01 — SLCO1B1 statin-myopathy pharmacogenomic advisory
- **trigger**: `slco1b1.genotype ∈ {TC, CC}` AND a lipid referral is active (ApoB/LDL/Lp(a) rules firing)
- **tier**: 2 (physician advisory — never a self-start)
- **modifier_of**: attaches to the lipid referral (`R-LIP-01` / `R-LIP-05` / `R-GEN-APOE-01`)
- **root_cause_hypothesis**: Reduced SLCO1B1 transporter function raises simvastatin-myopathy risk; if a
  statin is considered (likely given ApoE ε4 + Lp(a) + elevated ApoB), this variant favors a
  non-simvastatin choice or a lower dose.
- **interventions**: none by the protocol. This is a **note handed to the prescribing physician** — the
  engine never prescribes, doses, or starts a statin.
- **retest_signal**: —
- **evidence_tier**: E1
- **physician_referral_required**: true (the advisory rides along with the lipid referral)

## R-GEN-CYP2C19-01 — CYP2C19 reduced-function (dormant advisory)
- **trigger**: `cyp2c19.genotype ∈ {GA, AA}` AND (clopidogrel OR PPI on the medication list)
- **tier**: 3 (advisory; dormant unless the drug is present)
- **modifier_of**: surfaces inside `tessera-safety-screen`
- **root_cause_hypothesis**: Reduced CYP2C19 activity lowers clopidogrel activation and alters PPI
  metabolism; relevant only if those drugs are prescribed.
- **interventions**: none; physician note if the drug appears.
- **retest_signal**: —
- **evidence_tier**: E1
- **physician_referral_required**: false (unless the drug is active)

## R-GEN-FTO-01 — FTO appetite/adiposity tendency
- **trigger**: `fto.genotype ∈ {AT, AA}`
- **tier**: 4 (nudge)
- **modifier_of**: reinforces the nutrition lever's satiety strategy
- **root_cause_hypothesis**: Modestly higher appetite/adiposity tendency, fully responsive to protein,
  fiber and training. Behaviour dominates.
- **N**: protein-forward meals + soluble fiber for satiety (already in the plan). 
- **retest_signal**: waist / body-composition trend.
- **evidence_tier**: E2
- **physician_referral_required**: false

## R-GEN-ACTN3-01 — ACTN3 muscle-fiber profile
- **trigger**: any `actn3.genotype`
- **tier**: 4 (framing only)
- **modifier_of**: training lever framing
- **root_cause_hypothesis**: Power-vs-endurance fiber bias; a small tie-breaker, never overriding the
  Zone-2 cardiovascular priority ApoE/Lp(a) demand.
- **T**: frame programming around it (e.g. XX endurance bias → leans into the Zone-2 base anyway).
- **retest_signal**: —
- **evidence_tier**: E2
- **physician_referral_required**: false

## R-GEN-COMT-01 — COMT stress-modality tuning
- **trigger**: any `comt.genotype` (acts when a stress/recovery rule is also firing)
- **tier**: 4
- **modifier_of**: Mind & Wellness lever modality
- **root_cause_hypothesis**: Dopamine-clearance trait shaping how stress work lands; Met/Met ("worrier")
  favors steady down-regulation (breathwork, Zone-2, caffeine moderation — already aligned with CYP1A2).
- **M**: select the stress-management modality to fit the trait; never label the person.
- **retest_signal**: subjective stress / wearable HRV.
- **evidence_tier**: E3
- **physician_referral_required**: false

---

## Stacking note for `tessera-rootcause-phenotype`

When `R-GEN-APOE-01` + `R-GEN-LPA-01` + `R-GEN-9P21-01` (± `R-GEN-TCF7L2-01`) co-fire, they collapse into
mechanism **M-12 (cardiometabolic genetic load)** as a single root node — "the genome has loaded the
cardiometabolic dice." The protocol attacks it through the one modifiable lever the genome amplifies:
ApoB, driven down hard via Zone-2, fiber, fat-quality, and (clinician-decided) pharmacotherapy.
`R-GEN-MTHFR-01` maps to **M-19**; `R-GEN-APOE-01`'s brain arm maps to **M-20**.
