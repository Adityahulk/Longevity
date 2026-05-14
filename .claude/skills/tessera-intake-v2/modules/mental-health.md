# Module J — Mental-Health Micro-Screen

**NOT a diagnostic.** A triage — designed to take <2 minutes. If positive on any sub-screen, surface for "consider professional consultation" — never label/diagnose in the report.

## PHQ-2 (depression screen)

Over the **last 2 weeks**, how often have you been bothered by:

1. Little interest or pleasure in doing things?
2. Feeling down, depressed, or hopeless?

Each: 0 = not at all, 1 = several days, 2 = more than half the days, 3 = nearly every day.

- **Score 0-2** = negative screen.
- **Score 3-6** = positive screen — surface recommendation to discuss with PCP / therapist.
- **Score 5-6** = strong signal — flag in protocol.

## GAD-2 (anxiety screen)

Over the **last 2 weeks**, how often have you been bothered by:

1. Feeling nervous, anxious, or on edge?
2. Not being able to stop or control worrying?

Same scoring as PHQ-2.

- **Score 0-2** = negative.
- **Score 3-6** = positive — surface for professional consultation.

## PSS-4 (perceived-stress, last month)

Each scored 0 (never) to 4 (very often):

1. In the last month, how often have you felt that you were **unable to control** the important things in your life?
2. In the last month, how often have you felt **confident about your ability to handle** your personal problems? *(reverse-scored: 4 minus answer)*
3. In the last month, how often have you felt that things were **going your way**? *(reverse-scored)*
4. In the last month, how often have you felt **difficulties were piling up so high** that you could not overcome them?

Sum: 0-16.

- **0-5** = low stress
- **6-9** = moderate
- **10-13** = high
- **14-16** = very high

PSS-4 is the workhorse — most clients land in 6-13. The protocol's recovery + mind emphasis scales with the band.

## Cognition 2-Q (self-rated)

1. **Memory self-rated** — 0 (struggling) to 10 (excellent). Reference: last 6 months.
2. **Focus / attention self-rated** — 0 (very poor) to 10 (excellent), same reference.

If either ≤4, surface as "subjective cognitive complaint" — pair with HPI brain-fog + sleep + nutrients + B-vitamin status assessment. Not a diagnosis of MCI.

## Output to `intake.json` under `mental_health`:

```json
{
  "phq_2_score": 1,
  "phq_2_positive": false,
  "gad_2_score": 2,
  "gad_2_positive": false,
  "pss_4_score": 8,
  "pss_4_band": "moderate",
  "memory_self_rated_0_to_10": 8,
  "focus_self_rated_0_to_10": 7
}
```

## How this shapes protocol

- **PHQ-2 positive**: surface for professional consultation; protocol emphasizes Mind domain (10-min daily meditation, journaling, social connection nudge); supplements unchanged except St. John's Wort / 5-HTP / ashwagandha may be contraindicated if SSRI prescribed.
- **GAD-2 positive**: similar; add breathwork (4-7-8, physiological sigh) as daily anchor; consider L-theanine 200mg if anxious sleep onset (cleared via safety-screen).
- **PSS-4 high/very-high**: shapes the "Stress/Cortisol-Dominant" phenotype (P-04). Cortisol AM finding in lab becomes more clinically meaningful.
- **Cognitive complaints**: ensure B-vitamin status optimized (B12 >500, folate >10, homocysteine <8); Vit D >40; sleep audit; hydration; consider mild creatine 3-5g for cognitive support [E2].

## Sensitive flag

If PHQ-2 score 6 OR client mentions suicidal ideation spontaneously: stop the standard flow and direct to: **iCall (9152987821) for free counseling, India** + recommend immediate professional consultation. Tessera protocol can run in parallel but never substitutes for mental-health care.
