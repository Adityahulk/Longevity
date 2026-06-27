# Genomics Canonical — SNP Catalog & Interpretation Map

Single source of truth for the longevity- and pharmacogenomically-relevant variants Antiaging Labs
reads from a whole-genome or consumer-array export. Consumed by `tessera-genetics-ingest` (to build
`genetics.json`) and by `lib/rulebook/genomics.md` (whose `R-GEN-*` rules trigger on these
genotypes). The `genetics.json` shape this maps to is defined in `tessera-genetics-ingest/SKILL.md`.

## Hard framing (carried into every downstream surface)

- **Research-grade, not diagnostic.** Single common variants carry *modest* effect sizes. A genotype
  is a lifelong probability shift, never a diagnosis. Never let a variant override an observed
  biomarker trend; the genome explains *predisposition*, the blood shows *what is actually happening*.
- **South-Asian context.** Most polygenic/odds-ratio estimates were trained on European-ancestry
  cohorts. Flag where SA ancestry changes interpretation (Lp(a), TCF7L2, 9p21, MTHFR all have
  SA-specific prevalence/effect notes below). State the caveat; never invent an SA-specific number.
- **APOE is sensitive.** ε4 carriage touches dementia risk. Disclose it factually, pair it with the
  large modifiable upside (it is one of the most lifestyle-responsive risk genes), and always offer a
  genetic-counseling conversation. Never alarmist, never deterministic.

## Catalog format

Each entry:

```yaml
key: <snake_case id used in genetics.json.variants>
gene: <gene symbol>
rsid: <rs number(s)>
category: risk | pharmacogenomic | methylation | nutrition_training
risk_allele: <allele or genotype that carries the effect>
genotypes:
  <genotype>: <plain interpretation>
effect_size_caveat: <how strong / weak this single variant is>
sa_context: <South-Asian-specific note, or "—">
modifies: <which downstream rule / target / dose this variant changes — the engine hook>
evidence_tier: E1 | E2 | E3
```

---

## Category: RISK (lifetime predisposition)

### apoe
- **gene**: APOE · **rsid**: rs429358 + rs7412 (the pair defines ε2/ε3/ε4)
- **category**: risk
- **risk_allele**: ε4 (rs429358-C on the ε-haplotype)
- **genotypes**:
  - `ε3/ε3`: most common; baseline risk.
  - `ε3/ε4`: one ε4 copy — ~2–3× Alzheimer's odds vs ε3/ε3; heightened LDL/ApoB response to saturated fat; somewhat higher CVD risk.
  - `ε4/ε4`: two copies — substantially higher AD odds; manage as high-priority modifiable risk.
  - `ε2/ε3`, `ε2/ε2`: ε2 is generally protective for AD but raises type-III hyperlipidemia risk.
- **effect_size_caveat**: ε4 is the single largest common-variant AD risk factor, *and* among the most
  lifestyle-modifiable — exercise, sleep, lipid control and metabolic health meaningfully attenuate it.
- **sa_context**: ε4 frequency is somewhat lower in South Asian populations than in Europeans, but
  cardiometabolic risk stacks on top of it; interpret alongside the (typically higher) SA CVD baseline.
- **modifies**: fires `R-GEN-APOE-01` → tightens any fired ApoB/LDL target (e.g. `R-LIP-01` → ApoB <70),
  raises lipid-rule tier emphasis, adds Mediterranean fat profile, prioritizes Zone-2 + deep sleep
  (glymphatic clearance), and flags a genetic-counseling offer.
- **evidence_tier**: E1

### lpa_genetic
- **gene**: LPA · **rsid**: rs10455872 / rs3798220 (proxies; Lp(a) mass is the clinical readout)
- **category**: risk
- **risk_allele**: minor allele → higher Lp(a) particle number
- **genotypes**:
  - `carrier`: genetically elevated Lp(a); confirm with the measured serum Lp(a) on the blood panel.
- **effect_size_caveat**: Lp(a) is ~80–90% genetically determined and lifelong; lifestyle does not move
  it. It is an independent, causal CVD/aortic-stenosis risk amplifier.
- **sa_context**: Elevated Lp(a) is common in South Asians and under-tested; a frequent hidden driver
  of premature CAD in the cohort.
- **modifies**: converges with the measured `lp_a` to fire `R-GEN-LPA-01`; the strategy is to crush
  *every other* ApoB-mediated risk (LDL <70) since Lp(a) itself is fixed → reinforces `R-LIP-05`.
- **evidence_tier**: E1

### cad_9p21
- **gene**: CDKN2B-AS1 (9p21.3 locus) · **rsid**: rs1333049 (proxy rs10757278)
- **category**: risk
- **risk_allele**: C (rs1333049)
- **genotypes**:
  - `GG`: baseline. `CG`: one risk copy. `CC`: two copies — the most replicated common CAD-risk locus, acting largely independent of lipids.
- **effect_size_caveat**: Modest per-allele odds increase (~1.2–1.3× for homozygotes); robustly
  replicated across ancestries. One input to a polygenic CAD picture, not a standalone verdict.
- **sa_context**: Replicates in South Asian cohorts; pairs with the high SA CAD baseline.
- **modifies**: fires `R-GEN-9P21-01`; adds weight to early, aggressive ApoB control and earlier
  imaging/clinician discussion when stacked with Lp(a)/ApoE.
- **evidence_tier**: E1

### t2d_tcf7l2
- **gene**: TCF7L2 · **rsid**: rs7903146
- **category**: risk
- **risk_allele**: T
- **genotypes**:
  - `CC`: baseline. `CT`: one risk copy. `TT`: two copies — the strongest common T2D-risk variant, acting via impaired insulin secretion.
- **effect_size_caveat**: Per-T-allele T2D odds ~1.4×; meaningful but not destiny — overwhelmed by
  weight, fitness and fiber.
- **sa_context**: South Asians carry elevated baseline T2D risk at lower BMI ("thin-fat"); a T-allele
  on top sharpens the case for early insulin-sensitivity work.
- **modifies**: fires `R-GEN-TCF7L2-01`; when a metabolic rule (`R-MET-01` early IR) is already firing,
  raises its protocol priority and the case for tighter glycemic targets + earlier retest.
- **evidence_tier**: E1

### fto
- **gene**: FTO · **rsid**: rs9939609
- **category**: risk
- **risk_allele**: A
- **genotypes**:
  - `TT`: baseline. `AT`/`AA`: modestly higher appetite/adiposity tendency, fully responsive to protein, fiber and training.
- **effect_size_caveat**: Small per-allele weight effect (~1–1.5 kg); behaviour dominates.
- **sa_context**: —
- **modifies**: fires `R-GEN-FTO-01` (tier 4 nudge) → reinforce protein/fiber satiety strategy already
  in the nutrition lever; never a standalone finding.
- **evidence_tier**: E2

### foxo3
- **gene**: FOXO3 · **rsid**: rs2802292
- **category**: risk
- **risk_allele**: G (longevity-associated, protective)
- **genotypes**:
  - `GG`/`TG`: carries the longevity-associated allele (replicated in long-lived cohorts). `TT`: baseline.
- **effect_size_caveat**: Association only; informational, not actionable. Frame as context, not a claim.
- **sa_context**: —
- **modifies**: no rule fires; informational card in the Genomic Filter only.
- **evidence_tier**: E3

---

## Category: PHARMACOGENOMIC (how the body handles drugs / stimulants)

### cyp1a2
- **gene**: CYP1A2 · **rsid**: rs762551 (*1F)
- **category**: pharmacogenomic
- **risk_allele**: C (slow-metabolizer allele)
- **genotypes**:
  - `AA`: fast caffeine metabolizer. `AC`: intermediate. `CC`: slow — caffeine clears slowly; afternoon
    intake measurably degrades that night's sleep and HRV, and slow metabolizers show a less favorable
    (or adverse) cardiovascular response to high caffeine intake.
- **effect_size_caveat**: Well-characterized for caffeine kinetics; the sleep/HRV link is robust and
  directly observable in the same person's wearable data.
- **sa_context**: —
- **modifies**: fires `R-GEN-CYP1A2-01` → caffeine cutoff 10:00 and ≤1–2 cups/day; this is the genomic
  half of the Autopilot "your 4pm espresso is still clearing" intercept (the wearable HRV anomaly is the
  other half, via `R-WBL-05`).
- **evidence_tier**: E1

### slco1b1
- **gene**: SLCO1B1 · **rsid**: rs4149056 (*5)
- **category**: pharmacogenomic
- **risk_allele**: C
- **genotypes**:
  - `TT`: normal transporter function. `TC`: intermediate — modestly higher statin myopathy risk.
    `CC`: reduced function — meaningfully higher simvastatin-myopathy risk; informs statin choice/dose.
- **effect_size_caveat**: CPIC-guideline-level evidence specifically for simvastatin; advisory for the
  prescribing physician, never a self-start signal.
- **sa_context**: —
- **modifies**: fires `R-GEN-SLCO1B1-01` as a **physician advisory** attached to any lipid referral —
  if a statin is considered (likely here given ApoE ε4 + Lp(a) + ApoB), this variant favors a
  non-simvastatin choice or lower dose. The engine never prescribes; it hands the note to the doctor.
- **evidence_tier**: E1

### cyp2c19
- **gene**: CYP2C19 · **rsid**: rs4244285 (*2)
- **category**: pharmacogenomic
- **risk_allele**: A (loss-of-function)
- **genotypes**:
  - `GG`: normal. `GA`: intermediate metabolizer. `AA`: poor metabolizer — reduced activation of
    clopidogrel (antiplatelet) and altered PPI metabolism.
- **effect_size_caveat**: CPIC-guideline evidence for clopidogrel; relevant only if such drugs are ever
  prescribed — carried as a forward-looking advisory.
- **sa_context**: Loss-of-function alleles are relatively common in South/East Asian populations.
- **modifies**: fires `R-GEN-CYP2C19-01` as a dormant physician advisory (surfaces in safety screen if
  clopidogrel/PPI appear on a medication list); no protocol action otherwise.
- **evidence_tier**: E1

---

## Category: METHYLATION

### mthfr_c677t
- **gene**: MTHFR · **rsid**: rs1801133 (C677T)
- **category**: methylation
- **risk_allele**: T
- **genotypes**:
  - `CC`: normal enzyme activity. `CT`: ~65% activity (heterozygous). `TT`: ~30% activity (homozygous) —
    reduced conversion of folate to its active methyl form; can raise homocysteine, especially with low
    folate/B12 intake.
- **effect_size_caveat**: The genotype matters mainly *in combination with* measured homocysteine and
  folate status — a TT with normal homocysteine and good folate intake needs no special action.
- **sa_context**: Folate intake patterns and high vegetarian prevalence make the B12/folate axis worth
  checking regardless; interpret with the measured homocysteine.
- **modifies**: fires `R-GEN-MTHFR-01` *only when* homocysteine >10 or folate is low → switches the
  B-vitamin recommendation from folic acid to methylfolate + methyl-B12, and upgrades it from optional
  to default. Reinforces mechanism `M-19`.
- **evidence_tier**: E2

### mthfr_a1298c
- **gene**: MTHFR · **rsid**: rs1801131 (A1298C)
- **category**: methylation
- **risk_allele**: C
- **genotypes**:
  - `AA`: baseline. `AC`/`CC`: mild activity reduction; clinically relevant mainly when compound-het with C677T.
- **effect_size_caveat**: Weak alone; matters in compound-heterozygous context with C677T.
- **sa_context**: —
- **modifies**: contributes to `R-GEN-MTHFR-01` scoring; not a standalone fire.
- **evidence_tier**: E3

### comt
- **gene**: COMT · **rsid**: rs4680 (Val158Met)
- **category**: methylation
- **risk_allele**: — (trait, not risk)
- **genotypes**:
  - `GG (Val/Val)`: fast dopamine clearance ("warrior" — steadier under stress, lower baseline tone).
  - `AG (Val/Met)`: intermediate.
  - `AA (Met/Met)`: slow clearance ("worrier" — higher dopamine tone, can be more stress-reactive).
- **effect_size_caveat**: Behavioural-genetics association; use only to *shape the modality* of stress
  work, never to label the person.
- **sa_context**: —
- **modifies**: fires `R-GEN-COMT-01` (tier 4) → tunes the Mind & Wellness lever (e.g. Met/Met favors
  steady down-regulation: breathwork, Zone-2, caffeine moderation — which already aligns with CYP1A2).
- **evidence_tier**: E3

---

## Category: NUTRITION / TRAINING (personalization)

### actn3
- **gene**: ACTN3 · **rsid**: rs1815739 (R577X)
- **category**: nutrition_training
- **risk_allele**: — (trait)
- **genotypes**:
  - `CC (RR)`: power/sprint-biased fast-twitch profile. `CT (RX)`: mixed. `TT (XX)`: endurance-biased.
- **effect_size_caveat**: Real but small; programming should still follow goals and the wearable, not
  the gene. Use as a tie-breaker / framing detail.
- **sa_context**: —
- **modifies**: fires `R-GEN-ACTN3-01` (tier 4) → framing note in the Training lever; never overrides
  the Zone-2 cardiovascular priority that ApoE/Lp(a) demand.
- **evidence_tier**: E2

### vdr
- **gene**: VDR · **rsid**: rs2228570 (FokI)
- **category**: nutrition_training
- **risk_allele**: — (modulates vitamin-D response)
- **genotypes**:
  - `FF`/`Ff`/`ff`: variant forms associate with differences in vitamin-D receptor efficiency; some
    carriers may need higher 25(OH)D to reach the same effect.
- **effect_size_caveat**: Modest; the measured 25(OH)D level governs dosing, the genotype only nuances it.
- **sa_context**: SA populations are widely vitamin-D insufficient regardless of genotype.
- **modifies**: contributes context to the existing vitamin-D rule (`R-VIT-D-*`); no independent target
  change beyond "confirm repletion by retest."
- **evidence_tier**: E3

### bdnf
- **gene**: BDNF · **rsid**: rs6265 (Val66Met)
- **category**: nutrition_training
- **risk_allele**: A (Met)
- **genotypes**:
  - `GG (Val/Val)`: baseline activity-dependent BDNF secretion. `GA`/`AA` (Met carriers): somewhat lower
    activity-dependent secretion; aerobic exercise and sleep are especially worthwhile.
- **effect_size_caveat**: Association-level; reinforces, never originates, the exercise/sleep priority.
- **sa_context**: —
- **modifies**: informational; adds a "why cardio + sleep matter even more for you" line to the brain/
  recovery narrative already driven by ApoE.
- **evidence_tier**: E3

---

## How the engine consumes this file

1. `tessera-genetics-ingest` matches each export variant to a `key` above, attaches the genotype
   interpretation + `sa_context`, and groups by `category` for the Genomic Filter.
2. `tessera-rule-evaluate` reads `lib/rulebook/genomics.md`; each `R-GEN-*` rule references one `key`
   here and uses the `modifies` hook to either fire standalone or adjust an already-fired biomarker rule.
3. `tessera-rootcause-phenotype` maps risk/methylation variants onto mechanisms `M-12`, `M-19`, `M-20`.
4. `tessera-safety-screen` reads the pharmacogenomic entries (SLCO1B1, CYP2C19) for drug advisories.

Never invent a variant or an effect size not listed here. If an export contains a variant not in this
catalog, record it raw under `genetics.json.variants.other` without interpretation.
