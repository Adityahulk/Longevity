---
name: tessera-rootcause-phenotype
description: Classifies the client into a Tessera phenotype (from ~8 in lib/phenotypes.md) AND identifies the top 2-3 root-cause nodes from the encoded causal graph (lib/rootcause-graph.md) given the fired rules. Reduces a list of 5-10 independent rule fires to a small set of causal mechanisms to attack. Outputs phenotype.json + rootcause.json. Step 6 of tessera-pipeline.
---

# Tessera Root-cause + Phenotype

The reasoning upgrade. Two outputs:

1. **Phenotype label** — what kind of client is this? Drives the *voice* and *emphasis* of the report.
2. **Root-cause graph** — given 5-10 fired rules, what are the 2-3 *root drivers* to attack vs the leaf findings?

## Inputs

- `rule-evaluation.json`
- `biomarkers.json`
- `intake.json`
- `wearable.json` (may be null)
- `genetics.json` (may be null)

Plus the shared libs:
- `lib/phenotypes.md` — atlas of ~8 phenotypes
- `lib/rootcause-graph.md` — encoded ~30 longevity mechanisms

## Workflow

### Step 1 — Phenotype classification

Read `lib/phenotypes.md`. For each phenotype:

1. Check the **diagnostic pattern** against `biomarkers.json` + `intake.json`. Score: how many diagnostic features match?
2. The phenotype with the highest match score is the **primary phenotype**.
3. Then check overlay phenotypes (P-04 Stress, P-05 Inflammatory, P-06 Atopic, P-07 Hormone-suppressed). Add overlays where ≥2 diagnostic features match.

Output `phenotype.json`:

```json
{
  "classified_at_utc": "2026-05-14T10:38:00Z",
  "primary_phenotype": {
    "code": "P-01",
    "label": "Lean Metabolically Excellent",
    "match_score": 0.92,
    "diagnostic_features_met": [
      "BMI 22.1 (in 18-24)",
      "HOMA-IR 0.74 (<1.2)",
      "HbA1c 4.8 (<5.4)",
      "lipids optimal",
      "ApoB 70 (<80)",
      "insulin 3.8 (<7)",
      "ALT 17 (<25)",
      "no metabolic syndrome features"
    ]
  },
  "overlays": [
    {
      "code": "P-04",
      "label": "Stress / Cortisol-Dominant",
      "match_score": 0.65,
      "diagnostic_features_met": [
        "cortisol_am 20.0 (near top of 5.27-22.45)",
        "PSS-4 9 (moderate)",
        "sleep <7h on intake"
      ]
    },
    {
      "code": "P-06",
      "label": "Atopic / Allergic Overlay",
      "match_score": 0.70,
      "diagnostic_features_met": [
        "eosinophils 9.4% (>6%)",
        "HPI: rhinitis present"
      ]
    }
  ],
  "full_label": "Lean-metabolically-excellent with stress + atopic overlay",
  "protocol_voice": "peer, future-focused; foundations-first for stress + atopic workup; optimization framing — you are already in excellent metabolic shape",
  "lead_domains": ["Mind", "Recovery", "Supplements (precision)"],
  "deprioritize": ["aggressive metabolic interventions", "caloric restriction"]
}
```

### Step 2 — Root-cause graph traversal

Read `lib/rootcause-graph.md`. For each fired rule's triggering marker:

1. Find every mechanism in the graph whose `downstream_effects` lists this marker.
2. Build a candidate set of mechanism IDs.
3. **Score** each candidate mechanism by:
   - Count of fired markers it explains (weighted by edge strength: strong=1.0, moderate=0.6, weak=0.3)
   - Boost by 0.5 if any `intake_signals` for that mechanism match the patient's `intake.json`
4. Select the **top 2-3 highest-scoring mechanisms** as root nodes.
5. For each root node, list the fired rules it "covers" (so we can show the leaf-to-root reduction).

Output `rootcause.json`:

```json
{
  "analyzed_at_utc": "2026-05-14T10:39:00Z",
  "root_nodes": [
    {
      "mechanism_id": "M-02",
      "name": "Vitamin D deficiency cascade",
      "score": 4.8,
      "root_driver": "low 25(OH)D from inadequate UVB + low fatty-fish intake + indoor lifestyle",
      "covers_fired_rules": ["R-VIT-D-02"],
      "covers_markers": [
        {"code": "vitamin_d_25oh", "value": 15.0, "explanation": "definitional"},
        {"code": "eosinophils_pct", "value": 9.4, "explanation": "Vit D regulates Th1/Th2 balance; deficiency biases toward Th2/atopic"},
        {"code": "testosterone_total", "value": 502, "explanation": "Vit D is steroidogenic cofactor; deficiency suppresses T"}
      ],
      "intake_confirming_signals": [
        "indoor work (desk job, 9-6)",
        "minimal fatty-fish intake (vegetarian)",
        "Hyderabad latitude — adequate UVB available year-round but with sunscreen/clothing barriers"
      ],
      "intervention_class": "Supplements (loading), Nutrition (fatty fish + eggs), Recovery (AM sunlight)",
      "confidence": "high"
    },
    {
      "mechanism_id": "M-01",
      "name": "Chronic HPA-axis activation (chronic stress)",
      "score": 3.6,
      "root_driver": "psychological + physiological stress load → sustained cortisol elevation → HPA dysregulation",
      "covers_fired_rules": ["R-HOR-03"],
      "covers_markers": [
        {"code": "cortisol_am", "value": 20.0, "explanation": "near top of range — fires when paired with stress intake"},
        {"code": "testosterone_total", "value": 502, "explanation": "chronic cortisol blocks GnRH pulsatility → suppresses T"},
        {"code": "rdw_cv", "value": 14.1, "explanation": "low-grade systemic stress increases RBC turnover heterogeneity"}
      ],
      "intake_confirming_signals": [
        "stress_level 7/10",
        "PSS-4 9 (moderate)",
        "sleep <7h",
        "work hours 50+"
      ],
      "intervention_class": "Mind (meditation, breathwork), Recovery (sleep), Supplements (ashwagandha)",
      "confidence": "moderate-high"
    }
  ],

  "leaf_findings_explained": {
    "eosinophils_9.4%": "leaf of M-02 (Vit D deficiency → Th2 bias) — NOT a primary attack point; address Vit D first, monitor at retest. If HPI confirms symptomatic atopy, separate workup track (specific-IgE).",
    "testosterone_502": "leaf of M-01 (cortisol) + M-02 (Vit D) + M-03 (sleep) — NOT a primary attack point; T should rise as roots resolve. Don't add T-direct interventions.",
    "rdw_14.1%": "leaf of M-01 (low-grade systemic stress) — monitor at retest.",
    "monocytes_10.1%": "leaf of either post-viral residue OR M-01 — monitor at retest; if persistent + symptomatic, escalate."
  },

  "unexplained_findings": [],

  "interaction_notes": [
    "Vit D deficiency + chronic stress is a common Indian-urban combination. Attack both simultaneously — they reinforce each other if untreated."
  ]
}
```

### Step 2c — Multi-omic mechanism mapping (Deep tier)

When `genetics.available` / `wearable.available` are true:

- **Genetic mechanisms.** Map fired `R-GEN-*` rules to mechanisms: `R-GEN-APOE-01` + `R-GEN-LPA-01` +
  `R-GEN-9P21-01` (± `R-GEN-TCF7L2-01`) collapse into a single root node **M-12 (cardiometabolic genetic
  load)**; `R-GEN-MTHFR-01`/`R-GEN-COMT-01` → **M-19**; the brain arm of `R-GEN-APOE-01` → **M-20**.
  Record these as `genetic_overlays` on the phenotype so the report can carry "APOE ε4 carrier" etc.
- **Wearable confirmation.** Apply `R-WBL-*` fires as **confidence boosts** on already-scored mechanisms
  per the "Wearable confirmation edges" section of `lib/rootcause-graph.md` (HRV↓→M-01/M-03, RHR↑→M-01/
  M-04, deep↓→M-03, low VO₂max→M-04/M-12). Only assert "blood + DNA + wearable all point here" when all
  three actually corroborate the node; otherwise note which layers agree.

### Step 3 — Reply

One-line summary: "Phenotype: [X] with [overlay] overlay. Root causes: 1) [M-XX name], 2) [M-YY name]. Leaf findings reduced from N to 2 attack points."

## Hard rules

- **Phenotype is a label, not a diagnosis.** Frame as "where you are right now," re-classifiable at every retest.
- **Root causes ARE leverage points.** The protocol should attack roots, not leaves. If something is a leaf (e.g., T 502 downstream of cortisol + Vit D), the protocol should NOT recommend a direct intervention for that leaf — it should attack the root and re-check the leaf at retest.
- **Show your work.** Every root must list (a) the rules it covers, (b) the markers it explains, (c) the intake signals that confirm it.
- **Confidence levels matter.** A mechanism scoring high on markers but with no intake confirmation is `moderate` confidence; scoring high on both is `high`.
