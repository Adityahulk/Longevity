# Module F — HPI (History of Present Illness) / Current Symptoms

15 questions. Most are 0-10 severity or yes/no with a follow-up. Reads quickly. **This module is the single most important new addition** — biomarkers are meaningless without symptom context.

Ask in this order. Skip follow-ups when the primary is 0/none.

1. **Fatigue** — 0 (none) to 10 (debilitating). If ≥ 4: pattern (morning / afternoon / evening / persistent), since when, identified triggers.
2. **Brain fog / cognitive cloudiness** — 0-10. If ≥4: when worst (post-meal / morning / afternoon), affects work?
3. **Headaches** — frequency/week. If ≥2: type (tension / migraine / cluster / sinus / unsure), known triggers.
4. **Joint or muscle pain** — locations, pattern (AM stiffness >1h / activity-related / persistent). AM stiffness = inflammatory; activity-related = mechanical.
5. **GI symptoms** — list: bloating / reflux / belching / constipation / diarrhea / alternating / pain after meals / blood in stool (red flag — pursue immediately).
6. **Rhinitis (nasal congestion / runny nose / sneezing)** — present? Pattern (seasonal / perennial / triggered by dust/pollen/pets). Severity 0-10.
7. **Asthma** — diagnosed? Currently using inhaler? Control level (well / partly / uncontrolled / SOB on exertion).
8. **Eczema / atopic dermatitis** — present? Severity 0-10, areas, current treatment.
9. **Chronic urticaria / hives** — episodes >6 weeks in last year?
10. **Known food allergies / intolerances** — list (separate from religious avoidance).
11. **Recent travel to endemic areas** — last 6 months — South/Central Asia rural, Africa, South America. Any GI symptoms post-travel?
12. **Libido / sexual function** — change in last 6 months (improved / stable / decreased / not applicable). 0-10 self-rated.
13. **Mood overall** — 0 (severely low) to 10 (excellent), last 2 weeks. (Cross-references with PHQ-2 in mental-health module.)
14. **Hair / skin / nails** — recent changes? (hair loss, brittle nails, dry skin, acne flare). These often signal nutrient deficiency or hormone shift.
15. **Recent infections (last 3 months)** — count + type (URI / UTI / GI / skin / dental). Frequent infections → immune dysregulation signal (often Vit D / sleep / stress).

## Sensitive items deferred to in-program conversation

Do NOT ask in initial intake unless flagged by another signal:
- Detailed sexual function / erectile function (sensitive; bring up if intake suggests low T or anxiety)
- Suicidal ideation (only ask if PHQ-2 positive; then use PHQ-9 item 9; if positive, hand off to clinical care)
- Substance use (alcohol is in diet module; ask about cannabis / tobacco / recreational only if patient initiates)

## Output to `intake.json` under `hpi`:

All 15 items + any follow-ups, structured. Yes/no items use boolean. Severity items use 0-10 integer.
