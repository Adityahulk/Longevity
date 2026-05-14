# Rulebook — Allergic / Atopic

NEW organ-system file. Triggered primarily by elevated eosinophils + IgE patterns, correlated with HPI for actual symptom burden.

## R-ATO-01 — Elevated eosinophils — NEW
- **trigger**: `eosinophils_pct > 6%` OR `eosinophils_abs > 0.5 × 10³/μL`
- **tier**: 2 if HPI confirms atopic symptoms (rhinitis / asthma / eczema / chronic urticaria / known food allergy); else **3** (watch — recheck in 6–8 weeks)
- **root_cause_hypothesis**: atopic / allergic / parasitic (the 3 A's) — rhinitis, asthma, eczema, food allergy, drug reaction, parasitic infestation (still common in tropical India), chronic urticaria, eosinophilic esophagitis. Less commonly: hematologic, hypereosinophilic syndrome, autoimmune.
- **N**: 4-week elimination trial of likely triggers if HPI suggests (dairy/wheat/eggs/nuts/soy/seafood are most common Indian-relevant allergens; nightshade-sensitivity in subset). Reintroduce one at a time after 4 weeks.
- **T**: avoid pollen-heavy outdoor cardio in pollen seasons (March–April N. India; year-round S. India).
- **R**: HEPA filter in bedroom; hot-wash bedding weekly (dust mites); shower before bed during high-pollen seasons.
- **S**: quercetin 500mg × 2/day [E3 mast-cell stabilization] · omega-3 2g/day [E2] · Vitamin D >40 ng/mL [E2 immune-regulatory] · probiotics targeted to atopic strains (L. rhamnosus GG, B. infantis) [E3].
- **M**: stress mediates atopic flares; breathwork + sleep are non-negotiable.
- **physician_referral_trigger**: if HPI confirms moderate-severe asthma/rhinitis (impacting daily function), refer to allergist for specific-IgE panel + spirometry. If recent travel to endemic areas or GI symptoms, refer for stool ova-and-parasite testing.
- **retest_signal**: eosinophils ↓ to <4% in 90 days with trigger avoidance + protocol.
- **evidence_tier**: E2 (overall management); E3 (specific supplements)

## R-ATO-02 — Severely elevated eosinophils — **TIER 1**
- **trigger**: `eosinophils_abs > 1.5 × 10³/μL` (i.e., >1500 absolute)
- **tier**: 1
- Hematology / Internal Medicine referral. Workup for hypereosinophilic syndrome, parasitic load, drug reactions, eosinophilic GI disease.
- **evidence_tier**: E1

## R-ATO-03 — Elevated total IgE
- **trigger**: `ige_total ≥ 100 IU/mL` AND HPI positive for atopy
- **tier**: 2
- Confirms allergic phenotype. If asthma/rhinitis is symptomatic, refer to allergist for specific-IgE panel (food + aeroallergens).
- Combine R-ATO-01 protocols.
- **evidence_tier**: E1

## R-ATO-04 — Asymptomatic IgE elevation
- **trigger**: `ige_total ≥ 100 IU/mL` AND HPI negative
- **tier**: 3
- Atopic predisposition without active expression. Monitor; preserve gut barrier (omega-3, fiber, fermented foods); proactive Vit D/Mg sufficiency.
- **evidence_tier**: E3
