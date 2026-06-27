---
name: tessera-protocol-author
description: Authors the deeply personalized 5-domain protocol (Nutrition, Training, Recovery & Sleep, Supplements, Mind & Wellness) from the fired rules + phenotype + root-cause graph + safety-cleared interventions + client constraints. Produces protocol.json with concrete actions (not categories), the 12-week coach cadence, and a marker-by-marker retest plan. Step 8 of tessera-pipeline.
---

# Tessera Protocol Author

This is where the personalization happens. Reads everything upstream + the client's constraints, and authors a concrete, specific 5-domain protocol — not "eat more protein" but "30g protein at breakfast: 3 boiled eggs + 200g Greek yogurt + 1 cup methi-paneer."

## Inputs

- `biomarkers.json` (with derived indices)
- `panel-completeness.json`
- `intake.json`
- `rule-evaluation.json`
- `phenotype.json` + `rootcause.json`
- `safety.json`
- `wearable.json` (optional)
- `genetics.json` (optional)

Plus libs: `lib/evidence-tiers.md`, `lib/phenotypes.md` (for voice + emphasis).

## Workflow

### Step 1 — Read phenotype voice + emphasis

From `phenotype.json`, extract `protocol_voice`, `lead_domains`, `deprioritize`. This shapes everything downstream.

### Step 2 — Root-cause-first ordering

From `rootcause.json`, get the 2-3 root nodes. The protocol's *narrative* leads with these as **pillars**. Leaf findings get a brief acknowledgment but are NOT primary intervention targets.

### Step 3 — Build the 5 domain cards

For each of N / T / R / S / M:

1. Start with the **union** of all fired-rule `domain_interventions` for that domain.
2. **Filter through `safety.json`** — drop blocked items, surface warnings.
3. **Deduplicate** — when two rules suggest the same intervention (e.g., omega-3 from inflammation + lipids), surface once with both rationales.
4. **Personalize** for constraints from `intake.constraints`:
   - Nutrition: regional cuisine + religious calendar + cooking skill + budget + household size → produces 7-day weekly menu
   - Training: equipment access + schedule shape + time available + injury hx → produces 12-week periodized plan
   - Recovery: AQI + sleep environment + work shifts → produces chronotype-tuned schedule
   - Supplements: monthly budget + Indian SKU availability → produces ranked priority list (must / should / nice-to-have) with monthly cost
   - Mind: PSS-4 + PHQ-2 + GAD-2 + preferences → matches modality (meditation app / breathwork / journaling / cold exposure / nature)

5. **Tag evidence tier** on each rec from `lib/evidence-tiers.md`. Display as `[E1]`, `[E2]`, etc.

6. **Phenotype emphasis**: if `lead_domains` includes a domain, that domain card gets more depth + comes first in the report. If `deprioritize` lists categories, those become 1-line acknowledgments (not full prescriptions).

### Step 4 — Author the 12-week plan

Habit stack capped at **≤6 habits total across all 12 weeks**. More than that and adherence collapses.

- **Weeks 1-2 (Foundation)**: 2 anchor habits — pick from sleep timing + AM sunlight (lowest-friction)
- **Weeks 3-6 (Build)**: add 2 more — typically supplements + protein/breakfast change
- **Weeks 7-10 (Deepen)**: add 1-2 more — training progression or mind/wellness practice
- **Weeks 11-13 (Peak + Retest Prep)**: maintain; pre-retest preparation

**Each block also gets a `coach_check_in_days` + `coach_check_in_focus` pair** (see schema). The check-in days map to the bi-weekly call cadence from `journey.html` (Day 14 / Day 28+42 / Day 56+70 / Day 84+90). The focus string is 1-2 sentences telling the coach exactly what to ask in that block's call — specific to the habits installed, the client's likely friction points (drawn from intake constraints: weekend social patterns, AQI, work shifts, training background), and the rule-driven hypotheses for that block. Avoid generic prompts like "check adherence" — name the specific question.

### Step 4b — Compute biological-age trajectory

Author `biological_age_trajectory` with three values: Day 1 (current PhenoAge), Day 30 estimate (apply early-mover `retest_signal` deltas — cortisol AM, eosinophils partial, hsCRP if applicable — to PhenoAge inputs), and Day 90 target (apply all fired-rule `retest_signal` deltas across the 9 PhenoAge inputs). Round to one decimal. Assume 80%+ adherence on the 6-habit stack. If the Day 1 PhenoAge is already ≤ chronological age, the Day 90 target should reflect modest additional gain only (do not over-promise).

### Step 5 — Retest plan (per-marker cadence)

NOT a generic Day-90 retest. Per-marker cadence based on biological turnover + intervention timeline:

- **2-week recheck**: hsCRP if >10 (acute), or any marker requiring fast confirmation
- **30-day**: cortisol AM (stress interventions show fastest), insulin/glucose for major dietary changes
- **60-day**: lipids (turnover ~6 weeks), liver enzymes, RBC indices (RBC lifespan 120d so RDW partial)
- **90-day** (Day-90 retest): full panel including HbA1c (90d glycation), ferritin, B12, testosterone, full thyroid
- **12-week** (Vit D specific): Vit D 25-OH after loading
- **6-month**: deep reassessment with research-grade adds (GlycA, omega-3 index, Anti-TPO, Free T, SHBG, DHEA-S, IGF-1, Cystatin C as flagged in panel-completeness)

### Step 6 — Outcome expectations

For each fired rule, surface the `retest_signal` (verbatim) so the client knows what to expect. e.g., "Vit D ↑ to 40-60 ng/mL in 12 weeks", "Cortisol AM ↓ 3-6 μg/dL in 90 days", "HRV ↑ 10-20%".

### Step 7 — Panel-completeness recommendation

From `panel-completeness.json`, surface the Day-90 retest add-on panel. Tier the additions: **must-add** (changes interpretation of current findings), **should-add** (next-layer specificity), **nice-to-add** (research-grade optimization).

### Step 7b — Multi-omic authoring (Deep tier — when genetics/wearable available)

- **Genome into the levers.** Read `rule-evaluation.json`'s `modifiers_applied[]` and the fired
  `R-GEN-*` rules. Bake the genomic targets into the concrete protocol: ApoB target `<70` (ApoE ε4),
  methylfolate + methyl-B12 instead of folic acid (MTHFR + homocysteine), caffeine cutoff 10:00
  (CYP1A2 slow), Zone-2 as the lead training stimulus (heart + brain for ε4). For each, write a short
  **`genomic_filter[]`** entry: `{variant, finding, how_it_changed_the_protocol}` — this is the
  "how your DNA changed this protocol" content the report's Genomic Filter renders. Keep the SLCO1B1 /
  CYP2C19 items as physician-facing advisories (they belong in `safety.json` / referrals, not the
  client supplement list).
- **Wearable into the Autopilot.** From the `R-WBL-05` anomalies (joined with the genomic/biomarker
  reason), author an **`autopilot_feed[]`**: each entry `{time, telemetry, reason, patch}` — a
  next-morning protocol patch tied to a real telemetry event (e.g. HRV crash after late espresso in a
  CYP1A2 slow metabolizer → skip AM espresso, Zone-2 walk, hold the hard session). Use the wearable
  `trend`s to set the training/recovery levers (e.g. low ACWR + declining VO₂max → build Zone-2 base).
  Every patch is advisory and adaptive, never a medical instruction.

### Step 8 — Write `protocol.json`

### Step 9 — Reply

Reply with tight summary: "Protocol authored. N=[N rules covered], Pillars: [root 1] + [root 2]. 5 domains drafted. 6-habit 12-week plan. Retest cadence: [marker → date]."

## protocol.json schema (abbreviated)

```json
{
  "authored_at_utc": "2026-05-14T10:42:00Z",
  "author_version": "0.1.0",

  "headline": {
    "phenotype_label": "Lean-metabolically-excellent with stress + atopic overlay",
    "bio_age": 24.3,
    "delta_years": -0.7,
    "voice": "peer, future-focused; foundations-first for stress + atopic; optimization framing"
  },

  "biological_age_trajectory": {
    "day_1": 24.3,
    "day_30_estimate": 23.8,
    "day_90_target": 23.0,
    "adherence_assumed": "80%+ on the 6-habit stack",
    "method": "Day 30: apply early-mover retest_signals (cortisol AM, eos partial, hsCRP if applicable) to PhenoAge inputs. Day 90: apply full fired-rule retest_signals across all 9 PhenoAge inputs."
  },

  "root_attack_pillars": [
    {
      "name": "Vitamin D restoration",
      "root_mechanism": "M-02",
      "anchor_interventions": ["Vit D 60k/wk × 8wk + K2 100µg/d + Mg 300mg/d", "AM sunlight 15 min Hyderabad-appropriate timing"],
      "expected_to_shift": ["vitamin_d_25oh", "eosinophils_pct (downstream)", "testosterone_total (downstream)"]
    },
    {
      "name": "Stress de-escalation",
      "root_mechanism": "M-01",
      "anchor_interventions": ["10-min daily breathwork", "ashwagandha 600mg KSM-66 AM", "sleep anchor wake-time + screen curfew", "phone out of bedroom"],
      "expected_to_shift": ["cortisol_am", "HRV (wearable)", "RDW (downstream)"]
    }
  ],

  "domains": {
    "nutrition": {
      "leading_principles": [...],
      "daily_targets": {"protein_g": 95, "fiber_g": 35, "eating_window_hours": 12},
      "weekly_menu": [
        {"day": "Monday", "breakfast": "3 boiled eggs + bowl of cooked palak with garlic + 1 ragi roti", "lunch": "...", "dinner": "..."},
        // ... 7 days
      ],
      "shopping_list_weekly": [...],
      "foods_to_emphasize": [...],
      "foods_to_deprioritize": [...],
      "alcohol_caffeine_guidance": "...",
      "evidence_tags": ["E1", "E2"]
    },
    "training": {
      "weekly_structure": {"zone_2_minutes": 150, "vo2max_sessions": 1, "resistance_sessions": 3, "mobility": "daily 10min"},
      "twelve_week_plan": [
        {"week": "1-2", "focus": "...", "training_schedule": [...]},
        // ...
      ],
      "equipment_assumption": "from intake.constraints.equipment",
      "aqi_aware": true,
      "evidence_tags": ["E1"]
    },
    "recovery_sleep": {
      "target_bedtime": "23:00", "target_wake": "07:00",
      "anchored_wake_priority": true,
      "wind_down_protocol": "...",
      "AM_sunlight_minutes": 15,
      "caffeine_cutoff_hours_before_bed": 10,
      "environment_fixes": ["AC settings 22-24°C in Hyderabad summer", "blackout curtains", "phone outside bedroom"]
    },
    "supplements": {
      "stack": [
        {"name": "Vit D3", "dose": "60,000 IU/week × 8 wk", "form": "softgel", "timing": "Sun AM with fatty meal", "rationale": "R-VIT-D-02 + M-02 root", "evidence_tier": "E1", "monthly_cost_inr": 300, "indian_sku_examples": ["HK Vitals D3 60k", "Carbamide Forte D3 60k"], "safety_cleared": true},
        // ...
      ],
      "monthly_cost_total_inr": 2150,
      "schedule_morning": [...], "schedule_evening": [...], "schedule_with_meals": [...],
      "evidence_tags_summary": "Strong (E1-E2) for all 4 core supplements"
    },
    "mind_wellness": {
      "daily_practice": "10-min slow breathing (4-7-8 or physiological sigh) before screen time",
      "weekly_practice": "1 hour nature walk (parks or weekend hike)",
      "monthly_practice": "Half-day digital detox",
      "phq_2_gad_2_followup": "Negative screens; protocol is preventive, not therapeutic",
      "evidence_tags": ["E2-E3"]
    }
  },

  "ninety_day_habit_stack": [
    {
      "weeks": "1-2",
      "habits": ["Anchor wake time 7:00 daily (incl. weekends)", "15-min AM sunlight before 11am"],
      "coach_check_in_days": "Day 14",
      "coach_check_in_focus": "How is the 7am wake holding on weekends? Any AM-sunlight friction (balcony AQI, work calls)? Are anchor habits feeling forced or settling?"
    },
    {
      "weeks": "3-6",
      "habits": ["+ Vit D 60k weekly Sunday AM with breakfast", "+ 30g protein at breakfast"],
      "coach_check_in_days": "Day 28 + Day 42",
      "coach_check_in_focus": "Supplement adherence (Sunday Vit D taken with fat? GI tolerance?). Protein at breakfast — feasible or rushed? Energy at 7am — better, same, worse?"
    },
    {
      "weeks": "7-10",
      "habits": ["+ 10-min daily breathwork before screen time", "+ 3× resistance training/week"],
      "coach_check_in_days": "Day 56 + Day 70",
      "coach_check_in_focus": "Training adherence — sessions completed vs. planned. Subjective stress + breathwork stickiness. Any unintended drops in earlier habits?"
    },
    {
      "weeks": "11-13",
      "habits": ["Maintain all 6; pre-retest week — fast 12h, no caffeine 24h, no alcohol 72h"],
      "coach_check_in_days": "Day 84 + Day 90 review",
      "coach_check_in_focus": "Confirm retest fasting window, caffeine 24h cutoff, alcohol 72h cutoff, no heavy training 48h prior. Same lab, same morning slot as Day 1."
    }
  ],

  "retest_plan": {
    "day_30": [{"marker": "cortisol_am", "expected": "↓ 2-4 μg/dL"}, ...],
    "day_60": [{"marker": "lipid_panel", "expected": "stable, already optimal"}],
    "day_90": {
      "core_panel": "full repeat",
      "add_ons_recommended": [
        {"marker": "free_t", "tier_priority": 1, "rationale": "completes T context", "estimated_cost_inr": 800},
        {"marker": "shbg", "tier_priority": 1, "estimated_cost_inr": 700},
        {"marker": "anti_tpo", "tier_priority": 1, "rationale": "screens for atopic-autoimmune overlap", "estimated_cost_inr": 800},
        {"marker": "dhea_s", "tier_priority": 2, "estimated_cost_inr": 800},
        ...
      ]
    },
    "week_12_vit_d_specific": {"marker": "vitamin_d_25oh", "expected": "40-60 ng/mL"},
    "six_month": ["GlycA", "omega_3_index"]
  },

  "outcome_expectations": [
    {"rule": "R-VIT-D-02", "expectation": "Vit D ↑ to 40-60 ng/mL in 12 weeks"},
    {"rule": "R-HOR-03", "expectation": "Cortisol AM ↓ 3-6 μg/dL; HRV ↑ 10-20%; subjective stress ↓ 2-3 points in 90 days"},
    ...
  ],

  "physician_referrals_required": [
    {"reason": "Tier 1 — Severe Vit D deficiency (15 ng/mL)", "specialty": "Primary care or Endocrinology", "letter_id": "auto-doctor-letter-001"}
  ]
}
```

## Hard rules

- **No fluff.** Every recommendation must have a specific dose / timing / quantity. "Eat more vegetables" is unacceptable; "2 cups cooked palak + lemon at lunch and dinner, 4×/week" is acceptable.
- **Honor safety verdicts.** Drop blocked items. Surface warnings prominently.
- **Honor phenotype emphasis.** If phenotype is P-04 (stress-dominant), the Mind + Recovery cards lead; Nutrition is brief. If P-01 (already excellent metabolic), don't pile on metabolic interventions they don't need.
- **Honor constraints.** A weekly menu must use foods the client actually eats. Equipment must match.
- **Evidence tags.** Every rec ends with [E1]–[E5]. Reader sees confidence at a glance.
- **Indian context.** SKUs, brands, prices in INR. Regional cuisine. Vegetarian-aware.
- **Habit stack ≤6.** More than 6 habits → adherence collapses; pull the rec into "consider after Day-90" rather than the 12-week stack.
