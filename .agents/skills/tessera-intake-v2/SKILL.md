---
name: tessera-intake-v2
description: Run the deep Tessera intake — base demographics + body/medical + diet + exercise + sleep/stress, PLUS five new modules (HPI/current-symptoms, family-history-depth, constraints, environmental exposures, mental-health micro-screen). Emits intake.json. Use this as Step 3 of the tessera-pipeline whenever a longevity report is being generated.
---

# Tessera Intake v2

Deep intake — extends the original 35-question lifestyle intake with five new modules required for true personalization.

## Inputs

Either:
- An existing `intake.md` (filled-in template) in the run folder, OR
- Nothing — in which case ask each question inline.

If `intake.md` is provided, parse it loosely (YAML or numbered free-form). Validate required fields. If anything required is missing or ambiguous, ask inline.

## Workflow

### Step 1 — Base intake (existing modules — preserve)

The five existing modules from the original intake-template:

- **A. Identity & goals** — name, chronological_age, sex_at_birth, city, primary_goal, motivation_1_to_10, time_available_daily_minutes
- **B. Body & medical** — weight_kg, height_cm, waist_cm, vegetarian_status, current_medications, known_conditions, family_history_cardio, family_history_diabetes, allergies_intolerances
- **C. Diet** — typical_breakfast, typical_lunch, typical_dinner_and_time, eating_window_hours, weekly_alcohol_drinks, daily_caffeine_mg, processed_food_score_1_to_10, sugar_intake_score_1_to_10, current_supplements
- **D. Exercise** — cardio_min_per_week, strength_sessions_per_week, daily_step_count_avg, max_hr_known, current_exercise_types
- **E. Sleep & stress** — bedtime, wake_time, sleep_quality_1_to_10, time_to_fall_asleep_min, stress_level_1_to_10, stress_management_current

### Step 2 — NEW Module F: HPI / current symptoms

Read `modules/hpi.md`. Walk through the 15-question symptom screen. This is the highest-leverage new module — biomarkers are meaningless without symptom context.

Key fields written to `intake.json` under `hpi`:

- `fatigue_severity_0_to_10`, `fatigue_pattern` (morning / afternoon / evening / persistent)
- `brain_fog_0_to_10`
- `headaches_frequency_per_week`, `headache_type` (tension / migraine / cluster / sinus)
- `joint_pain_locations`, `joint_pain_pattern` (AM stiffness / activity-related / persistent)
- `gi_symptoms` (bloating / reflux / constipation / diarrhea / IBS-pattern)
- `rhinitis_present` (yes/no), `rhinitis_pattern` (seasonal / perennial / triggered)
- `asthma_present`, `asthma_control` (well-controlled / partly / uncontrolled)
- `eczema_present`, `eczema_severity_0_to_10`
- `chronic_urticaria_present`
- `food_allergies_known` (list)
- `recent_travel_endemic_areas` (yes/no + where + when)
- `libido_changes` (improved / stable / decreased / not applicable)
- `mood_overall_0_to_10`
- `hair_skin_nail_changes` (list)
- `recent_infections_3_months` (count + types)
- `sexual_function_concerns` (yes/no — sensitive; deferred to in-program if no)

### Step 3 — NEW Module G: Family history depth

Read `modules/family.md`. Beyond cardio + diabetes, capture:

- `family_hx_cardio_first_degree` (parent or sibling — age of onset, type — MI / stroke / sudden death / arrhythmia)
- `family_hx_diabetes_first_degree`
- `family_hx_cancers` (type, age of onset, parent or grandparent)
- `family_hx_dementia` (parent or grandparent + age of onset)
- `family_hx_autoimmune` (type — Hashimoto / RA / SLE / IBD / psoriasis)
- `family_hx_thyroid`
- `family_hx_kidney_disease`
- `longevity_outliers` (grandparents who lived >85 — count + their cause of death if known)
- `family_hx_premature_death_under_60` (cause)

This shapes age-appropriate screening recommendations (colonoscopy, mammography, dexa, low-dose CT for smokers, etc.) and risk-stratifies recommendations (e.g., aggressive ApoB target if family hx premature CV).

### Step 4 — NEW Module H: Constraints

Read `modules/constraints.md`. Required to author a *real* protocol:

- `monthly_supplement_budget_inr` (₹0 / ₹500 / ₹1500 / ₹3000 / ₹5000+ / unlimited)
- `kitchen_access` (full / shared / minimal / hotel-stay)
- `cooking_skill_1_to_10`
- `household_size_and_cook_for` (e.g., "self + spouse + 2 kids, partner cooks main meal")
- `eating_out_frequency_per_week`
- `equipment` (none / dumbbells_at_home / full_home_gym / commercial_gym_access / outdoor_only)
- `weekly_schedule_shape` (M-F 9-6 desk / shift work / travel-heavy / WFH / etc.)
- `religious_dietary_constraints` (none / vegetarian-by-tradition / Jain / Ramadan-observant / Ekadashi-observant / etc.)
- `cuisine_preference_regional` (south-indian / north-indian / bengali / gujarati / punjabi / tamil / telugu / continental / mixed)
- `strict_allergens_or_dislikes` (foods to never include)
- `time_for_protocol_minutes_per_day` (realistic, not aspirational)

### Step 5 — NEW Module I: Environment

Read `modules/environment.md`:

- `city_aqi_avg` (or city name → look up known AQI tier; Hyderabad/Bengaluru = moderate-high; Delhi/Kolkata = severe; Mumbai = high)
- `occupational_hazards` (chemicals / dust / radiation / shift work / noise / heat / cold)
- `sleep_environment_room_temp` (cool / moderate / warm) — Hyderabad summers without AC affect sleep
- `sleep_environment_light_noise` (dark+quiet / some / very disruptive)
- `commute_minutes_each_way`
- `daily_screen_time_hours`
- `pollution_protection_current` (HEPA at home / N95 outdoor / nothing)
- `recent_mold_water_damage_home`
- `pets_at_home` (and whether allergic)

### Step 6 — NEW Module J: Mental-health micro-screen

Read `modules/mental-health.md`. NOT a diagnostic — a triage. Five quick checks:

- **PHQ-2** (2 questions, scored 0-6): "Little interest or pleasure in doing things? Feeling down, depressed, or hopeless?" — each over 2 weeks, 0=not at all → 3=nearly every day. Score ≥3 = positive screen.
- **GAD-2** (2 questions, scored 0-6): "Feeling nervous, anxious, or on edge? Not being able to stop or control worrying?" — same scale. Score ≥3 = positive screen.
- **PSS-4** (4 questions perceived-stress scale): "In the last month, how often have you felt unable to control important things in life / confident about your ability to handle problems (reverse) / felt things were going your way (reverse) / felt difficulties piling up so high you could not overcome them?" — 0-16.
- **Cognition 2Q**: self-rated memory (0-10), self-rated focus (0-10).
- **Sleep onset/quality already in module E** — cross-reference.

If PHQ-2 or GAD-2 positive → recommend conversation with PCP or therapist (NOT a diagnosis; surface as "screening positive — consider professional consultation").

### Step 7 — Validate and write

Validate required fields are non-empty. For any field missing, ask the user inline before proceeding. Then write `intake.json`.

### Step 8 — Reply

Reply with a tight summary:

- Filled modules: A ✓ B ✓ C ✓ D ✓ E ✓ F ✓ G ✓ H ✓ I ✓ J ✓
- Notable signals: e.g., "PHQ-2 score 4 — positive depression screen, surfacing in protocol"
- Open questions deferred (if any)

## intake.json schema

```json
{
  "collected_at_utc": "2026-05-14T10:32:00Z",
  "intake_version": "v2.0.0",
  "identity": { "first_name": "...", "age": 25, "sex_at_birth": "M", "city": "...", "primary_goal": "...", "motivation_1_to_10": 7, "time_available_daily_minutes": 45 },
  "body_medical": { "weight_kg": 70, "height_cm": 178, "waist_cm": null, "vegetarian_status": "omni", "current_medications": "none", "known_conditions": "none", "family_history_cardio": "father, HTN at 60", "family_history_diabetes": "none", "allergies_intolerances": "none", "pregnancy_status": null },
  "diet": { /* ... */ },
  "exercise": { /* ... */ },
  "sleep_stress": { /* ... */ },
  "hpi": { /* module F */ },
  "family": { /* module G */ },
  "constraints": { /* module H */ },
  "environment": { /* module I */ },
  "mental_health": {
    "phq_2_score": 1, "phq_2_positive": false,
    "gad_2_score": 2, "gad_2_positive": false,
    "pss_4_score": 8, "pss_4_band": "moderate",
    "memory_self_rated_0_to_10": 8,
    "focus_self_rated_0_to_10": 7
  }
}
```

## Folder layout

```
.Codex/skills/tessera-intake-v2/
├── SKILL.md         (you are here)
└── modules/
    ├── hpi.md
    ├── family.md
    ├── constraints.md
    ├── environment.md
    └── mental-health.md
```
