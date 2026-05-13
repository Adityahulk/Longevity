# Tessera Intake — fill this in

Copy this file next to your blood test PDF (e.g., `inputs/intake.md`). Fill in what you know. Fields marked `[required]` must be present. Leave any optional field as `--` if you don't know — defaults apply.

```yaml
# ── A. Identity & goals ───────────────────────────────
name: " "                              # [required]
chronological_age: 0                   # [required] years
sex_at_birth: " "                      # [required] M / F
city: " "                              # optional
primary_goal: " "                      # [required] one of: lose_fat, build_muscle, lower_disease_risk, more_energy, better_sleep, mental_clarity, longevity
motivation_1_to_10: 7                  # optional
time_available_daily_minutes: 45       # [required]

# ── B. Body & medical ─────────────────────────────────
weight_kg: 0                           # [required]
height_cm: 0                           # [required]
waist_cm: --                           # optional
vegetarian_status: " "                 # [required] omni / lacto-ovo / lacto / vegan / eggetarian
current_medications: " "               # [required] free text; "none" if applicable
known_conditions: " "                  # [required] free text; "none" if applicable
family_history_cardio: "--"            # optional; e.g., "father, heart attack at 55"
family_history_diabetes: "--"          # optional
allergies_intolerances: " "            # [required] "none" if applicable

# ── C. Diet ───────────────────────────────────────────
typical_breakfast: " "                 # [required] free text
typical_lunch: " "                     # [required]
typical_dinner_and_time: " "           # [required] include time, e.g., "dal-rice-sabzi at 9pm"
eating_window_hours: 12                # [required] hours between first and last calorie
weekly_alcohol_drinks: 0               # [required] standard drinks/week
daily_caffeine_mg: 200                 # optional
processed_food_score_1_to_10: 5        # optional   (10 = mostly home-cooked, 1 = mostly packaged)
sugar_intake_score_1_to_10: 5          # optional   (10 = none, 1 = daily added sugar)
current_supplements: " "               # [required] list everything, doses if known; "none" if applicable

# ── D. Exercise ───────────────────────────────────────
cardio_min_per_week: 0                 # [required]
strength_sessions_per_week: 0          # [required]
daily_step_count_avg: --               # optional
max_hr_known: --                       # optional
current_exercise_types: " "            # [required] walk / run / cycle / lift / yoga / sport / none

# ── E. Sleep & stress ─────────────────────────────────
bedtime: "23:00"                       # [required] HH:MM
wake_time: "07:00"                     # [required] HH:MM
sleep_quality_1_to_10: 7               # [required]
time_to_fall_asleep_min: 15            # optional
stress_level_1_to_10: 5                # [required]
stress_management_current: " "         # optional

# ── F. Wearable (optional but powerful) ───────────────
wearable_device: "none"                # optional
avg_hrv_ms_last_7_days: --             # optional
avg_resting_hr_last_7_days: --         # optional
avg_sleep_hours_last_7_days: --        # optional

# ── G. Past attempts (optional) ───────────────────────
prior_diet_attempts: " "
prior_protocol_failures: " "
```

## How to use

1. Copy this entire file to your run folder as `intake.md`.
2. Replace every `" "`, `0`, or `--` with your real answer.
3. Save.
4. Tell Claude: *"Generate my Tessera report using my blood test at `path/to/blood-test.pdf` and intake at `path/to/intake.md`"* — or just put both in the same folder and say *"generate the report from this folder"*.

Don't worry about formatting perfectly — Claude will read the YAML loosely and ask for clarification on any field that's ambiguous.
