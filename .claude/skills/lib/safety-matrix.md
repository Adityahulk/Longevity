# Safety Matrix — Drug × Supplement × Condition × Allergen × Pregnancy

Every recommendation in `protocol.json` passes through `tessera-safety-screen`, which loads this file + `intake.json` and emits `safety.json` with three sections:

- `blockers` — combinations that prohibit the recommendation. The protocol-author MUST drop the rec.
- `warnings` — combinations that need monitoring or physician sign-off. The rec stays but with a clear caveat.
- `cleared` — explicit confirmation list (so the report can show "verified safe vs your medications/conditions/allergens").

If a recommendation has no entry in this file, it's treated as `cleared` by default — but the safety screen still annotates "no known interactions checked."

---

## Drug × Supplement interactions

| Drug class | Supplement | Severity | Action | Reason |
|---|---|---|---|---|
| Warfarin / coumadin | Vitamin K (any form) | BLOCKER | Drop | Antagonizes anticoagulation |
| Warfarin / coumadin | Fish oil / omega-3 (>2g/day) | WARNING | Reduce to ≤1g + monitor INR | Bleeding risk |
| Warfarin / coumadin | Ginkgo biloba | BLOCKER | Drop | Bleeding risk |
| Warfarin / coumadin | Garlic (high-dose extract) | WARNING | Drop or culinary only | Bleeding risk |
| Warfarin / coumadin | Vitamin E (>400 IU) | WARNING | Drop high-dose | Bleeding risk |
| Warfarin / coumadin | Curcumin | WARNING | ≤500 mg/day + monitor INR | Mild bleeding risk |
| Warfarin / coumadin | Ashwagandha | WARNING | Physician sign-off | Possible interaction |
| Antiplatelets (clopidogrel, aspirin) | Ginkgo / high-dose fish oil / high-dose garlic | WARNING | Reduce / physician sign-off | Bleeding risk |
| Statins | Red yeast rice | BLOCKER | Drop | Contains lovastatin — additive toxicity |
| Statins | Grapefruit (>1 fruit/day) | WARNING | Avoid for atorvastatin/simvastatin | Inhibits CYP3A4 → ↑ statin levels |
| Statins | CoQ10 | CLEARED | Recommend | Often beneficial; supports muscle / energy |
| Metformin | Berberine | WARNING | Physician sign-off + dose adjustment | Additive glucose-lowering — hypoglycemia risk |
| Insulin (any) | Berberine / cinnamon (high-dose) / bitter melon | WARNING | Physician sign-off | Additive hypoglycemia |
| Sulfonylureas | Berberine / ALA | WARNING | Physician sign-off | Hypoglycemia |
| SSRIs / SNRIs | St. John's Wort | BLOCKER | Drop | Serotonin syndrome risk |
| SSRIs / SNRIs | 5-HTP / tryptophan | BLOCKER | Drop | Serotonin syndrome risk |
| SSRIs / SNRIs | Ashwagandha | WARNING | Physician sign-off | Possible additive serotonergic |
| SSRIs / SNRIs | Curcumin | CLEARED | Recommend | No known interaction |
| MAOIs | Tyramine-rich foods / ashwagandha | BLOCKER | Drop | Hypertensive crisis |
| Benzodiazepines | Melatonin / valerian / kava | WARNING | Physician sign-off | Additive sedation |
| Benzodiazepines | Magnesium glycinate (bedtime) | WARNING | Low-dose acceptable | Mild additive |
| Levothyroxine | Calcium / iron / Vit D high-dose | WARNING | Separate by 4 hours | Reduces absorption |
| Levothyroxine | Ashwagandha | WARNING | Monitor TSH after 6 weeks | May ↑ T4 levels |
| Levothyroxine | Soy / high-fiber meal | WARNING | Take T4 30 min before meal | Reduces absorption |
| ACE inhibitors / ARBs | Potassium supplements | BLOCKER | Drop | Hyperkalemia risk |
| ACE inhibitors / ARBs | High-potassium foods (extreme) | WARNING | Monitor K | Hyperkalemia risk |
| Diuretics (thiazide) | Licorice | BLOCKER | Drop | Hypokalemia + hypertension |
| Diuretics (loop) | Magnesium / potassium | WARNING | Often beneficial; physician guides dose | Loop diuretics deplete both |
| NSAIDs (daily) | Fish oil high-dose | WARNING | Reduce or stop NSAID if chronic | Additive GI bleeding |
| NSAIDs (daily) | Ginkgo | WARNING | Drop | Bleeding |
| Lithium | NSAIDs / ACE-I / diuretics | WARNING | Physician sign-off | ↑ lithium levels |
| Thyroid agents | Iodine (high-dose) | WARNING | Physician sign-off | Can destabilize thyroid |
| Antiplatelet + anticoagulant combos | Most herbal blood thinners | BLOCKER | Drop | Bleeding |
| Immunosuppressants | Echinacea / astragalus / cordyceps | BLOCKER | Drop | Immune stimulation interferes |

## Condition × Supplement contraindications

| Condition | Supplement | Severity | Action | Reason |
|---|---|---|---|---|
| CKD (eGFR <60) | Creatine | WARNING | Avoid; physician sign-off | Loads kidney creatinine |
| CKD (eGFR <60) | High-dose Vit D | WARNING | Monitor Ca / P / PTH | Calcium-phosphorus dysregulation |
| CKD (eGFR <60) | High-dose protein (>1.2 g/kg) | WARNING | Cap at 0.8–1.0 g/kg | Kidney load |
| CKD (eGFR <60) | NSAIDs | BLOCKER | Drop | Accelerates CKD |
| Active liver disease (ALT >3× ULN) | Niacin / Vit A high-dose / kava / pennyroyal | BLOCKER | Drop | Hepatotoxic |
| Active liver disease | Curcumin (rare cases) | WARNING | Monitor LFTs | Rare hepatotoxicity reports |
| Bleeding diathesis | Ginkgo / high-dose fish oil / garlic high-dose / ginseng | BLOCKER | Drop | Bleeding |
| Pregnancy | Vit A retinol (>10,000 IU) | BLOCKER | Drop | Teratogenic |
| Pregnancy | Ashwagandha / shatavari high-dose | BLOCKER | Drop | Uterine activity |
| Pregnancy | High-dose Vit D / fish oil | CLEARED | Recommended | Both supportive |
| Pregnancy | Berberine | BLOCKER | Drop | Crosses placenta; jaundice risk |
| Lactation | Ashwagandha / shatavari | WARNING | Physician sign-off | Limited safety data |
| Bipolar disorder | St. John's Wort | BLOCKER | Drop | Mania risk |
| Bipolar disorder | 5-HTP | WARNING | Physician sign-off | Mood destabilization |
| Hypotension | Ashwagandha / hawthorn / arjuna high-dose | WARNING | BP monitoring | Can lower BP further |
| Hypertension | Licorice / yohimbe / ephedra | BLOCKER | Drop | Raises BP |
| Diabetes (any) | Bitter melon / high-dose cinnamon / berberine | WARNING | Physician sign-off + glucose monitoring | Hypoglycemia |
| Hashimoto's / autoimmune thyroid | High-dose iodine | WARNING | Physician sign-off | Can flare |
| Autoimmune disease (any) | Echinacea / cordyceps / astragalus / AHCC | WARNING | Physician sign-off | Immune stimulation may flare |
| Gout / hyperuricemia | Niacin high-dose | WARNING | Drop high-dose | Raises uric acid |
| Iron overload / hemochromatosis | Iron supplements / Vit C high-dose | BLOCKER | Drop | Iron loading |
| G6PD deficiency | Vit C very high-dose (>10g/day) / fava beans | WARNING | Avoid IV / extreme | Hemolysis |
| History of kidney stones (calcium oxalate) | Vit C very high-dose | WARNING | Cap at 1g/day | Oxalate load |
| Mastocytosis / MCAS | Niacin (flushing) | WARNING | Use non-flush form | Triggers flush |
| Surgery (within 2 weeks) | Fish oil / ginkgo / garlic / curcumin / Vit E | BLOCKER | Stop 7–14 days before | Bleeding |

## Allergen cross-references

| Allergen in intake | Affected supplements | Action |
|---|---|---|
| Fish allergy | Fish oil | Switch to algae-based omega-3 (DHA/EPA from algae) |
| Shellfish allergy | Glucosamine (some forms) | Use vegetarian glucosamine |
| Soy allergy | Soy-based isoflavones, lecithin in some softgels | Verify supplement carrier |
| Dairy allergy / lactose intolerance | Whey protein, casein | Switch to plant protein (pea, hemp, rice blend) |
| Egg allergy | Some choline supplements | Verify source (sunflower lecithin is alternative) |
| Tree-nut allergy | Almond / walnut foods, some carrier oils | Avoid named nut sources |
| Sulfa allergy | Glucosamine sulfate (rare cross-reactivity) | Use HCl form |

## Pregnancy / breastfeeding flags

If intake `pregnancy_status` = pregnant or trying-to-conceive or breastfeeding:

- Default to OB-GYN sign-off on every supplement.
- Cleared by default: prenatal multivitamin, methylfolate (400–800mcg), Vit D (1000–2000 IU), DHA omega-3 (1g), iron if deficient, choline (450 mg).
- Block by default: high-dose Vit A retinol (>10k IU), ashwagandha, berberine, most herbal extracts, kava, valerian high-dose, melatonin chronic use, St. John's Wort.

## Dose-by-weight sanity checks

Where dose scales by body weight, the safety screen flags out-of-range:

- Protein: 1.2–1.6 g/kg lean (or total if BMI <25), cap at 2.0 g/kg, floor at 0.8 g/kg
- Creatine: 0.07 g/kg/day, typically 3–5g
- Caffeine: <6 mg/kg/day total, last dose ≥10h before sleep
- Magnesium oral: <6 mg/kg, typically 200–400 mg
- Vit D maintenance: 30–60 IU/kg/day after loading, typically 2000–4000 IU
- Iron: 25–50 mg elemental, every-other-day

---

## How `tessera-safety-screen` uses this file

For each recommended supplement / intervention in the draft `protocol.json`:

1. Check intake `current_medications` against drug-supplement table.
2. Check intake `known_conditions` against condition-supplement table.
3. Check intake `allergies_intolerances` against allergen cross-references.
4. Check intake `pregnancy_status` against pregnancy flags.
5. Check dose-by-weight sanity.
6. Output: per-supplement verdict (`blocked` / `warning` / `cleared`) with the specific rule that triggered.

Final report includes a **"Safety-cleared supplements"** card showing each supplement + the specific checks that passed (e.g., "Ashwagandha 600mg KSM-66 — no thyroid meds confirmed, no SSRIs confirmed, no pregnancy, no autoimmune flare history → cleared").

For any blockers, the protocol-author MUST drop the recommendation and substitute with an alternative if available, OR leave the rule's intervention as a "discuss with physician" note in the report.
