---
name: tessera-wearable-ingest
description: Ingest a wearable export (Whoop / Oura / Apple Health / Garmin / Fitbit / Google Fit) into normalized 7/30/90-day rolling means for HRV (RMSSD), resting heart rate, sleep duration/efficiency/deep%/REM%, steps, VO2max estimate, and training-load ACWR — plus behaviour-correlated anomalies. Classifies each metric (optimal/watch/off) and its trend (improving/stable/declining) per lib/wearable-metrics.md, and emits wearable.json. Powers the Autopilot Protocol Sync feed in the Deep (Tier-2) pipeline.
---

# Tessera Wearable Ingest

Reads a wearable export and produces `wearable.json` — the rolling metrics, trends, and anomalies the
Deep-tier pipeline consumes (rule-evaluate fires `R-WBL-*`; protocol-author authors the Autopilot feed).
Ranges, trend logic, and anomaly detection all live in **`lib/wearable-metrics.md`** — this skill never
invents telemetry; if a device lacks a metric, it omits it rather than estimating.

## Inputs

- A device export: Whoop CSV (`recovery.csv`, `sleep.csv`, `workouts.csv`), Oura CSV (`daily.csv`,
  `sleep.csv`), Apple Health `export.xml`, Garmin TCX + Connect CSV, Fitbit JSON, or Google Fit CSV.
- Optional same-day context (food/caffeine/alcohol log, travel) to tag anomalies.

## Workflow

### Step 1 — Parse the export to a per-day table
Use `python3`. Normalize device-specific fields to the canonical metrics: HRV RMSSD (ms), RHR (bpm),
sleep hours / efficiency % / deep % / REM %, steps, VO₂max estimate, and a training-load series for ACWR.
(Whoop "recovery" already exposes RMSSD + RHR; Apple Health uses `HKQuantityTypeIdentifier…SDNN` etc.)

### Step 2 — Compute rolling means + trends
For each metric compute `last_7d_mean`, `last_30d_mean`, `last_90d_mean`, then label the `trend`
(`improving | stable | declining`) per the polarity-aware ±5% logic in `lib/wearable-metrics.md`
(falling RHR = improving; falling HRV = declining). Classify each metric optimal/watch/off against the
orientation ranges there, while noting the person's own baseline is the real reference.

### Step 3 — Detect anomalies (Autopilot fuel)
Flag single days where a metric deviates ≥2 SD from the rolling baseline (z ≤ −2 for higher-is-better,
≥ +2 for RHR) and tag a probable behavioural cause from the same-day context. These rows are what
`R-WBL-05` turns into next-morning protocol patches.

### Step 4 — Compute ACWR
`training_load_acwr` = acute (7-day) load ÷ chronic (28-day) load; flag the band (detrained <0.6,
sweet-spot 0.8–1.3, overreach >1.5).

### Step 5 — Write `wearable.json` (`available: true`) and reply
Reply with the headline trends ("HRV declining −18% vs 90d, RHR +4bpm, deep sleep 12%, ACWR 0.6") and
the count of behaviour-correlated anomalies.

## Phase A+B fallback

If no wearable export is provided, this skill is a no-op writing `available: false`; downstream skills
fall back to self-reported intake (no `R-WBL-*` rules fire, no Autopilot feed):

```json
{ "ingested_at_utc": "<ts>", "available": false,
  "reason": "no wearable export provided", "source": null, "rolling_metrics": null }
```

## `wearable.json` shape

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

## Source parsers

- **Apple Health XML** — extract HKQuantityTypeIdentifierHeartRateVariabilitySDNN, HKQuantityTypeIdentifierRestingHeartRate, HKCategoryTypeIdentifierSleepAnalysis, HKQuantityTypeIdentifierStepCount, HKQuantityTypeIdentifierVO2Max
- **Oura CSV** — `daily.csv` and `sleep.csv` exports
- **Whoop CSV** — `recovery.csv`, `sleep.csv`, `workouts.csv`
- **Garmin TCX / GPX** — workout-level data + Garmin Connect CSV exports
- **Fitbit JSON** — Fitbit data export request format
- **Google Fit CSV** — `Daily Aggregations.csv`

## How downstream skills consume `wearable.json` (live)

- `tessera-rule-evaluate`: fires `lib/rulebook/wearables.md` (`R-WBL-*`) from the rolling metrics +
  anomalies; rules that only trigger on wearable simply don't fire when `available: false`.
- `tessera-rootcause-phenotype`: applies wearable signals as **confirmation edges** that raise the
  confidence of mechanisms already scored from blood + intake (HRV↓→M-01/M-03, RHR↑→M-01/M-04,
  deep↓→M-03, low VO₂max→M-04/M-12) — never as a standalone root. Absent wearable = absent confirmation,
  not a misleading claim.
- `tessera-protocol-author`: reads trends to set the training/recovery levers and reads `R-WBL-05`
  anomalies (joined with genomic/biomarker context) to author the **Autopilot Protocol Sync** feed. When
  `available: false`, training prescriptions fall back to self-reported intake fields.

## Forward compatibility

The `wearable.json` shape is the same one the future TS `packages/schema` `WearableMetric` types and the
native-app (HealthKit / Health Connect) integration emit — file ingestion now, API/webhook streaming
(Terra / Vital) later, no schema rework.
