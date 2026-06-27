# Wearable Metrics Canonical — Ranges & Trend Logic

Single source of truth for the wearable telemetry Antiaging Labs ingests (Whoop / Oura / Apple Health /
Garmin / Fitbit). Consumed by `tessera-wearable-ingest` (to build `wearable.json`) and by
`lib/rulebook/wearables.md` (whose `R-WBL-*` rules trigger on these metrics + trends). The
`wearable.json` rolling-metrics shape is defined in `tessera-wearable-ingest/SKILL.md`.

## Framing

- Wearable data is **contextual, continuous, and relative-to-self.** A single night means little; the
  signal is the *rolling trend* and the *anomaly correlated to a behaviour*. Population ranges below are
  orientation only — a person's own 90-day baseline is the real reference.
- Wearables **confirm** mechanisms the blood + intake already suggest (HRV↓ confirming HPA activation,
  RHR↑ confirming under-recovery); they rarely originate a Tier-1 finding. Most `R-WBL-*` rules are
  Tier 3 ("watch") and feed the Autopilot, not the medical-advisory section.
- Never diagnose from wearables (e.g. never call low HRV "a heart condition"). Surface trends and the
  behaviours driving them.

## Metric catalog

Each entry gives population orientation ranges by adult band; the engine always *also* computes the
self-relative trend. Format per metric: `optimal` / `watch` / `off` + what raises/lowers it.

### hrv_rmssd_ms — Heart-rate variability (RMSSD, ms)
- **optimal**: highly individual; higher is generally better. Orientation for 35–45y: >50 strong,
  35–50 moderate, <30 low. Interpret against the person's own 90-day mean, not the population band.
- **watch**: 7-day mean 10–20% below the 90-day mean.
- **off**: 7-day mean >20% below 90-day mean (sustained suppression).
- **raised by**: aerobic fitness, sleep, recovery days, low alcohol/caffeine. **lowered by**: stress,
  sleep debt, late caffeine/alcohol, acute illness, training overreach.

### rhr_bpm — Resting heart rate (bpm)
- **optimal**: 35–45y roughly 48–58. **watch**: 59–65 or rising trend. **off**: >65 or a sustained
  +4 bpm rise over the 90-day baseline.
- **raised by**: under-recovery, poor sleep, alcohol, dehydration, stress, detraining.
  **lowered by**: aerobic base, recovery, sleep.

### sleep_hours — Total sleep (h/night, rolling)
- **optimal**: 7.0–8.5. **watch**: 6.0–6.9. **off**: <6.0 sustained.

### sleep_efficiency_pct — Time asleep / time in bed (%)
- **optimal**: ≥88. **watch**: 82–87. **off**: <82.

### deep_pct — Deep (slow-wave) sleep (% of sleep)
- **optimal**: ≥16. **watch**: 12–15. **off**: <12. (Low deep % tracks with poor physical recovery,
  alcohol, late caffeine, and short total sleep.)

### rem_pct — REM sleep (% of sleep)
- **optimal**: ≥20. **watch**: 16–19. **off**: <16. (REM is suppressed by alcohol and short sleep.)

### steps — Daily steps (rolling mean)
- **optimal**: ≥8,000. **watch**: 5,000–7,999. **off**: <5,000 (sedentary).

### vo2max_estimate — Estimated VO₂max (ml/kg/min)
- **optimal (35–45M)**: ≥45. **watch**: 38–44. **off**: <38 or a declining trend. The single best
  wearable-visible longevity/cardiorespiratory-fitness proxy.

### training_load_acwr — Acute:chronic workload ratio
- **optimal**: 0.8–1.3 ("sweet spot"). **watch**: 0.6–0.79 (under-stimulus) or 1.3–1.5 (rising load).
- **off**: <0.6 (detrained / exercise-poor) or >1.5 (overreach / injury-risk spike). Note: an executive
  can be simultaneously *stress-rich and exercise-poor* — low ACWR alongside low HRV.

## Trend logic (how a 7d/30d/90d triple becomes a label)

For each metric the ingest computes `last_7d_mean`, `last_30d_mean`, `last_90d_mean`, then a `trend`:

- **improving** — the 7d mean is ≥5% better than the 90d mean (direction depends on the metric:
  higher-is-better for HRV/sleep/deep/REM/steps/VO₂max; lower-is-better for RHR).
- **declining** — the 7d mean is ≥5% worse than the 90d mean.
- **stable** — within ±5%.

"Better/worse" respects each metric's polarity (a *falling* RHR is *improving*; a *falling* HRV is
*declining*).

## Anomaly detection (powers the Autopilot intercepts)

An **anomaly** is a single day where a metric deviates strongly from the person's rolling baseline
(z-score ≤ −2 for higher-is-better metrics, ≥ +2 for RHR), tagged with a probable behavioural cause
read from the same day's context (late caffeine, alcohol, high strain, travel, short sleep). Anomaly
rows are what `R-WBL-05` (HRV-anomaly-correlation) consumes to generate a next-morning protocol patch:

```
{ "date": "...", "metric": "hrv_rmssd", "value": 24, "z_score": -2.3,
  "context": "espresso logged 16:10; CYP1A2 slow metabolizer" }
```

The Autopilot line is the join of the anomaly (wearable) + the genomic/biomarker reason (genome/blood) +
the patch (protocol): *"HRV 24ms, −40% vs baseline; last night's 4pm espresso is still clearing (you're
a CYP1A2 slow metabolizer) → skip the AM espresso, 20-min Zone-2 walk in daylight, hold the hard
session to tomorrow."*

## How the engine consumes this file

1. `tessera-wearable-ingest` parses the device export into the rolling-metrics + anomalies shape,
   labels each `trend` per the logic above, and classifies each metric optimal/watch/off.
2. `tessera-rule-evaluate` reads `lib/rulebook/wearables.md`; each `R-WBL-*` rule references metrics +
   trends here.
3. `tessera-rootcause-phenotype` uses HRV↓ / RHR↑ / deep↓ as *confirmation edges* on mechanisms
   `M-01` (HPA activation) and `M-04` (insulin resistance) — never as the sole root.
4. `tessera-protocol-author` reads trends + anomalies to author the Autopilot Protocol Sync feed.

Never invent telemetry. If a device export lacks a metric (e.g. no VO₂max), omit it rather than
estimating.
