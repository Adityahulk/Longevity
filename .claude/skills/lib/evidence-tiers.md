# Evidence Tiers — Strength of Recommendation Grading

Every protocol recommendation in `protocol.json` and every rule in `rulebook/` is tagged with one of these evidence tiers. The tier shows up in the report next to the recommendation so the reader can calibrate trust.

## The 5 tiers

| Tier | Label | Definition | Example |
|---|---|---|---|
| **E1** | Strong (RCT + meta-analysis) | Multiple high-quality randomized controlled trials AND/OR meta-analyses converging. Mainstream guideline-level. | Statin → ApoB reduction; resistance training → muscle hypertrophy; Vit D supplementation in deficient adults |
| **E2** | Moderate (RCT) | At least one large well-designed RCT, or several smaller RCTs. Defensible but not guideline-level. | Berberine for HbA1c; ashwagandha KSM-66 for cortisol/T; psyllium for LDL |
| **E3** | Limited (cohort / mechanistic) | Strong observational cohort evidence + plausible mechanism, but no large RCT yet. | Omega-3 index → CV outcomes; HRV biofeedback → stress; cold exposure → mood |
| **E4** | Emerging (small studies / case reports) | Single small RCT, animal data, or case-series with mechanism. Not yet defensible to default to. | NMN/NR for biological age; metformin for healthspan (non-diabetics); rapamycin (off-label) |
| **E5** | Anecdotal / wellness-tradition | Long use in traditional medicine or community wisdom but minimal modern evidence. Often safe, low-stakes — but framed honestly. | Tongkat ali for T; ginseng for energy; specific herbal blends |

## Display in the report

Each protocol bullet ends with a small tag: `[E1]`, `[E2]`, etc. The reader can scan and see at a glance whether they're getting RCT-backed advice or experimental.

## Drug interaction & safety evidence is always E1

Drug-supplement and drug-drug interactions in `safety-matrix.md` are ALL treated as **E1** regardless of when the underlying study was done — pharmacological mechanism is well-established and the cost of a false negative (i.e. missing a real interaction) is high.

## Tier 1 medical referrals override evidence tier

If a finding triggers a **Tier 1 referral** (e.g., LDL ≥ 190, eGFR < 60), the recommendation "see your physician" is **E1 + mandatory**, even if downstream lifestyle interventions are E3 or E4.

## When in doubt, downgrade

If two tiers seem plausible, pick the lower one. The point is to be honest about uncertainty.

## Citation conventions

- E1 / E2 recommendations: include the lead PMID or DOI when first introducing the rec
- E3: optional citation; minimum is "longitudinal cohort evidence + mechanism"
- E4 / E5: must include disclaimer "limited evidence; consider trial-and-track"

Citations live in the rules they support, not in a centralized bibliography. Format: `[citation: PMID 12345678]` or `[citation: doi:10.xxxx/yyyyy]`.
