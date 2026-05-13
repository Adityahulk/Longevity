# Tessera Lifestyle Questionnaire

Distilled from the full 127-question intake to the ~35 questions that most change protocol output. If a user skips a question, the report can proceed with reasonable defaults; if they answer all, the protocol gets meaningfully more personalized.

For each question:
- **Field name** — used in `intake.md`
- **Required?** — Yes / No
- **Rationale** — what this question changes in the report

---

## A. Identity & goals (required)

| Field | Required | Rationale |
|---|---|---|
| `name` | Yes | Personalization in the report (first name on cover) |
| `chronological_age` | Yes | PhenoAge input |
| `sex_at_birth` (M / F) | Yes | Reference range selection, hormone protocol branching |
| `city` | No | Lab/clinic logistics (Hyderabad, Bangalore etc.) |
| `primary_goal` | Yes | Lead the protocol's framing. Options: lose fat, build muscle, lower disease risk, more energy, better sleep, mental clarity, longevity span |
| `motivation_1_to_10` | No | If ≤ 6, lean into simpler 3-habit plan; if 8+, can push complexity |
| `time_available_daily_minutes` | Yes | Caps training volume — be realistic |

## B. Body & medical (required)

| Field | Required | Rationale |
|---|---|---|
| `weight_kg` | Yes | Protein g/kg, drug-dose discussions |
| `height_cm` | Yes | BMI, body composition framing |
| `waist_cm` | No | Stronger metabolic-risk signal than BMI in Indians |
| `vegetarian_status` (omni / lacto-ovo / lacto / vegan / eggetarian) | Yes | Nutrition + supplement recommendations branch |
| `current_medications` | Yes | Drug-supplement interaction screen, contraindications |
| `known_conditions` | Yes | Existing diagnoses (HTN, T2D, PCOS, hypothyroid, etc.) — informs Tier 1 routing |
| `family_history_cardio` (Y/N + relation) | No | Lp(a) workup decision, ApoB target |
| `family_history_diabetes` (Y/N + relation) | No | Glucose/insulin framing |
| `allergies_intolerances` | Yes | Food list pruning |

## C. Diet (5 questions)

| Field | Required | Rationale |
|---|---|---|
| `typical_breakfast` | Yes | Glycemic profile of morning carbs |
| `typical_lunch` | Yes | Largest meal in most Indian diets — major lever |
| `typical_dinner_and_time` | Yes | Late dinner = poor glucose / sleep |
| `eating_window_hours` (number) | Yes | TRE feasibility |
| `weekly_alcohol_drinks` | Yes | Liver, triglycerides, sleep, ApoB |
| `daily_caffeine_mg` (cups × 100mg) | No | Sleep / cortisol / HRV |
| `processed_food_score_1_to_10` | No | 10 = mostly home-cooked, 1 = mostly packaged/restaurant |
| `sugar_intake_score_1_to_10` | No | 10 = none, 1 = daily added sugar |
| `current_supplements` | Yes | De-duplicate recommendations, flag overlaps |

## D. Exercise (5 questions)

| Field | Required | Rationale |
|---|---|---|
| `cardio_min_per_week` | Yes | Zone 2 baseline |
| `strength_sessions_per_week` | Yes | Sarcopenia risk, T optimization |
| `daily_step_count_avg` | No | Sedentary signal |
| `max_hr_known` (or self-perceived intensity) | No | Zone 2 prescription accuracy |
| `current_exercise_types` (walk/run/cycle/lift/yoga/sport) | Yes | Build on what they already do |

## E. Sleep & stress (5 questions)

| Field | Required | Rationale |
|---|---|---|
| `bedtime` (HH:MM) | Yes | Circadian alignment |
| `wake_time` (HH:MM) | Yes | Total sleep + anchor wake |
| `sleep_quality_1_to_10` | Yes | Triages sleep protocol |
| `time_to_fall_asleep_min` | No | Onset latency — anxiety vs hygiene issue |
| `stress_level_1_to_10` | Yes | Cortisol overlay |
| `stress_management_current` | No | What they already do — build on it |

## F. Wearable data (4 questions — optional but powerful)

| Field | Required | Rationale |
|---|---|---|
| `wearable_device` (Apple Watch / Whoop / Oura / Fitbit / Mi / Garmin / none) | No | What data we can pull |
| `avg_hrv_ms_last_7_days` | No | Stress & training-load signal |
| `avg_resting_hr_last_7_days` | No | Cardiovascular fitness signal |
| `avg_sleep_hours_last_7_days` | No | Real sleep, not self-reported |

## G. Past attempts (2 questions — optional)

| Field | Required | Rationale |
|---|---|---|
| `prior_diet_attempts` | No | What worked / what didn't |
| `prior_protocol_failures` | No | Adherence anti-patterns to avoid |

---

## Defaults if optional fields are skipped

- `motivation_1_to_10` → 7
- `time_available_daily_minutes` → 45
- `daily_caffeine_mg` → 200 (2 cups)
- `processed_food_score_1_to_10` → 5
- `sugar_intake_score_1_to_10` → 5
- `wearable_device` → "none"
- HRV / RHR / wearable sleep → not used in protocol if missing

## What this questionnaire deliberately does NOT capture (in v1)

- Full 24-hour diet recall (too long, too noisy)
- Mood / depression screening (PHQ-9 etc. — needs clinical handling)
- Sexual function / libido (sensitive; deferred to in-program conversation)
- Detailed financial / employer / insurance info (not needed for protocol)
- Specific past procedures, surgeries unless flagged in `known_conditions`

These can be added in a deeper intake if/when needed.
