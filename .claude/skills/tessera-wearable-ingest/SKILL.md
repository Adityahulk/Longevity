---
name: tessera-wearable-ingest
description: Stub for wearable data ingestion. Phase D will fully implement Apple Health XML / Google Fit CSV / Oura CSV / Whoop CSV / Garmin TCX parsing into normalized 7/30/90-day rolling means for HRV, RHR, sleep stages, steps, VO2max estimate. In Phase A+B, this skill is a no-op that emits wearable.json with null and the pipeline proceeds gracefully without it.
---

# Tessera Wearable Ingest (Phase D — STUB)

## Phase A+B behavior

This skill is a **no-op** in Phase A+B. The `tessera-pipeline` orchestrator calls it; this skill writes `wearable.json` with `available: false` and returns.

```json
{
  "ingested_at_utc": "<timestamp>",
  "available": false,
  "reason": "Phase A+B stub — full wearable ingestion deferred to Phase D",
  "source": null,
  "rolling_metrics": null
}
```

The downstream skills (`tessera-rule-evaluate`, `tessera-rootcause-phenotype`) handle `available: false` gracefully — they only use wearable signals when `available: true`.

## Phase D — planned `wearable.json` shape (design contract preserved)

```json
{
  "ingested_at_utc": "...",
  "available": true,
  "source": "oura | whoop | apple_health | garmin | fitbit | google_fit",
  "device_model": "...",
  "ingested_file_path": "...",
  "date_range": {"start": "YYYY-MM-DD", "end": "YYYY-MM-DD"},

  "rolling_metrics": {
    "hrv_rmssd_ms": {
      "last_7d_mean": 38,
      "last_30d_mean": 35,
      "last_90d_mean": 33,
      "trend": "improving | stable | declining"
    },
    "rhr_bpm": {
      "last_7d_mean": 58,
      "last_30d_mean": 60,
      "last_90d_mean": 61,
      "trend": "..."
    },
    "sleep": {
      "last_7d_avg_hours": 7.2,
      "last_7d_efficiency_pct": 88,
      "last_7d_deep_pct": 18,
      "last_7d_rem_pct": 22,
      "last_30d_avg_hours": 7.0,
      ...
    },
    "steps": {
      "last_7d_mean": 9500,
      "last_30d_mean": 8800
    },
    "vo2max_estimate": {
      "latest": 48,
      "trend": "improving"
    },
    "training_load_acwr": 1.1
  },

  "anomalies": [
    {"date": "2026-05-10", "metric": "hrv_rmssd", "value": 18, "z_score": -2.4, "context": "alcohol intake night before per food_log"}
  ]
}
```

## Phase D — planned source parsers

- **Apple Health XML** — extract HKQuantityTypeIdentifierHeartRateVariabilitySDNN, HKQuantityTypeIdentifierRestingHeartRate, HKCategoryTypeIdentifierSleepAnalysis, HKQuantityTypeIdentifierStepCount, HKQuantityTypeIdentifierVO2Max
- **Oura CSV** — `daily.csv` and `sleep.csv` exports
- **Whoop CSV** — `recovery.csv`, `sleep.csv`, `workouts.csv`
- **Garmin TCX / GPX** — workout-level data + Garmin Connect CSV exports
- **Fitbit JSON** — Fitbit data export request format
- **Google Fit CSV** — `Daily Aggregations.csv`

## How downstream skills handle the stub today

- `tessera-rule-evaluate`: rules that *only* trigger on wearable (`R-SLP-02` low HRV) don't fire if `wearable.available = false`.
- `tessera-rootcause-phenotype`: mechanism scoring uses biomarker + intake signals only when no wearable; "wearable confirmation" is just absent rather than misleading.
- `tessera-protocol-author`: training prescriptions use self-reported intake fields (cardio_min_per_week, current_exercise_types, max_hr_known) instead of wearable-driven personalization.

## Why stub now and not later?

Designing the schema contract now (and committing it) means the TS port in `packages/schema` can plan `WearableMetric` types alongside the rest, and future native-app (HealthKit / Health Connect) integration emits the same JSON shape — no rework needed.
