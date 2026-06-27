# Rulebook — Wearables (`R-WBL-*`)

Wearable rules read rolling metrics + anomalies from `wearable.json` (catalog + ranges + trend logic:
`lib/wearable-metrics.md`). They are mostly **Tier 3 ("watch")** and exist to (a) *confirm* a
mechanism the blood + intake already suggest, and (b) *feed the Autopilot Protocol Sync* with daily
adaptive patches. A wearable rule rarely originates a Tier-1 medical finding — it surfaces trends and
the behaviours driving them, never a diagnosis.

If `wearable.available = false`, none of these rules fire and the protocol falls back to self-reported
intake — gracefully, with no misleading "wearable confirmation" language.

## Rule format

Same six-field contract as the organ rulebooks, plus an optional `confirms` field naming the mechanism
or biomarker rule this telemetry corroborates.

```yaml
code: R-WBL-NN
trigger: (metric + trend condition from wearable-metrics.md)
tier: 1 | 2 | 3 | 4
confirms: (mechanism M-xx or biomarker rule it corroborates, or "—")
root_cause_hypothesis: ...
domain_interventions: { N, T, R, S, M }
retest_signal: (wearable metric expected to move)
evidence_tier: E1–E5
```

---

## R-WBL-01 — Declining HRV trend
- **trigger**: `hrv_rmssd_ms.trend = declining` OR 7-day mean >20% below 90-day mean
- **tier**: 3
- **confirms**: `M-01` (HPA-axis activation) and `M-03` (sleep debt) — wearable corroboration of stress/
  under-recovery the blood (cortisol, hsCRP) and intake (stress, sleep) already suggest.
- **root_cause_hypothesis**: Falling HRV reflects accumulating autonomic load — stress, sleep debt, late
  caffeine/alcohol, or training overreach outrunning recovery.
- **R**: protect sleep (duration + timing); insert recovery days; address caffeine timing (see
  `R-GEN-CYP1A2-01`). **T**: bias toward Zone-2; cap intensity until the trend turns. **M**: daily
  down-regulation (breathwork). 
- **retest_signal**: HRV 7-day mean rising back toward the 90-day baseline within 2–4 weeks.
- **evidence_tier**: E2

## R-WBL-02 — Rising resting heart rate
- **trigger**: `rhr_bpm.trend = declining` (i.e. RHR rising — worse) OR sustained +4 bpm over 90-day baseline
- **tier**: 3
- **confirms**: `M-01`, `M-04` (under-recovery / metabolic load)
- **root_cause_hypothesis**: A rising RHR baseline signals under-recovery, poor sleep, alcohol, or
  detraining.
- **T**: build aerobic base (Zone-2 lowers RHR more than anything). **R**: sleep + alcohol moderation. 
- **retest_signal**: RHR baseline down 2–4 bpm over 8–12 weeks of aerobic base + recovery.
- **evidence_tier**: E2

## R-WBL-03 — Low deep sleep / short sleep
- **trigger**: `deep_pct = off (<12%)` OR `sleep_hours = off (<6.0)` OR `sleep_efficiency = off (<82%)`
- **tier**: 3
- **confirms**: `M-03` (sleep debt) → which feeds `M-04` (IR), low testosterone, hsCRP
- **root_cause_hypothesis**: Insufficient or low-quality sleep is upstream of insulin resistance, low
  testosterone, inflammation and poor next-day HRV — the highest-leverage recovery lever.
- **R**: fixed wake time, wind-down, screens-off, cool dark room, caffeine cutoff, alcohol moderation;
  late-meal timing. **M**: evening down-regulation. 
- **retest_signal**: deep-sleep % and total sleep up within 2–3 weeks; downstream HRV follows.
- **evidence_tier**: E1

## R-WBL-04 — Detrained / exercise-poor (low ACWR + low VO₂max)
- **trigger**: `training_load_acwr < 0.6` OR `vo2max_estimate = off (<38 or declining)`
- **tier**: 3
- **confirms**: `M-04` (insulin resistance), cardiovascular-risk levers (`R-LIP-01`, `R-LIP-04` low HDL)
- **root_cause_hypothesis**: Stress-rich but exercise-poor — low aerobic stimulus is letting VO₂max (a
  strong fitness/longevity proxy), HDL and insulin sensitivity drift the wrong way.
- **T**: build a Zone-2 base (3–4×/week) and progress VO₂max work; add resistance for glucose disposal.
- **retest_signal**: VO₂max trend up; ACWR into the 0.8–1.3 band; HDL/HOMA-IR follow on the blood retest.
- **evidence_tier**: E1

## R-WBL-05 — HRV anomaly correlated to a behaviour (Autopilot trigger)
- **trigger**: an `anomalies[]` entry with `metric = hrv_rmssd`, `z_score ≤ −2`, and a `context` tag
  (late caffeine / alcohol / high strain / travel / short sleep)
- **tier**: 3
- **confirms**: the specific behaviour → joins with the genomic/biomarker reason for the Autopilot line
- **root_cause_hypothesis**: A single-night HRV crash tied to a logged behaviour is the cleanest teaching
  signal the product has — it makes cause and effect personal and same-day.
- **R/M/T**: emit a **next-morning protocol patch** (the Autopilot intercept) — e.g. for a late-espresso
  crash in a CYP1A2 slow metabolizer: *skip the AM espresso, 20-min Zone-2 walk in daylight, hold the
  hard session to tomorrow.* The patch is advisory and adaptive, never a medical instruction.
- **retest_signal**: fewer such anomalies as the upstream behaviour (caffeine timing, alcohol, strain)
  is corrected.
- **evidence_tier**: E2

---

## How these feed downstream

- `tessera-rule-evaluate` fires `R-WBL-*` from `wearable.json` and tags each with its `confirms` link.
- `tessera-rootcause-phenotype` treats `R-WBL-01/02/03/04` as **confirmation edges** that *raise the
  confidence* of an already-scored mechanism (M-01, M-03, M-04) — never as a standalone root.
- `tessera-protocol-author` reads `R-WBL-05` anomalies + the genomic/biomarker context to author the
  **Autopilot Protocol Sync** feed, and reads the trends to set the training/recovery levers.
