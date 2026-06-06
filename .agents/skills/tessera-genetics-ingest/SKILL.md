---
name: tessera-genetics-ingest
description: Stub for genetics data ingestion. Phase D will parse 23andMe / MyHeritage raw text exports and extract ~15 longevity-relevant SNPs (APOE, MTHFR, FTO, PPARG, ACTN3, ACE, BDNF, COMT, VDR, MC1R, CYP1A2, FOXO3, IL6, TNFA). In Phase A+B, this skill is a no-op emitting genetics.json with null.
---

# Tessera Genetics Ingest (Phase D — STUB)

## Phase A+B behavior

No-op. Writes `genetics.json` with `available: false`:

```json
{
  "ingested_at_utc": "<timestamp>",
  "available": false,
  "reason": "Phase A+B stub — full genetics ingestion deferred to Phase D",
  "source": null,
  "variants": null
}
```

## Phase D — planned `genetics.json` shape

```json
{
  "ingested_at_utc": "...",
  "available": true,
  "source": "23andme | myheritage | ancestrydna | tellmegen | other",
  "source_file_path": "...",
  "panel_version": "23andme_v5",

  "variants": {
    "apoe": {
      "rs429358": "C/T",
      "rs7412": "C/T",
      "genotype": "ε3/ε4",
      "interpretation": "ε4 heterozygote — moderate Alzheimer's risk; ApoB-sensitive to saturated fat"
    },
    "mthfr_c677t": {
      "rsid": "rs1801133",
      "genotype": "CT",
      "interpretation": "heterozygous — ~30% reduced enzyme activity; methylated B-complex recommended"
    },
    "mthfr_a1298c": {"rsid": "rs1801131", "genotype": "..."},
    "fto": {"rsid": "rs9939609", "genotype": "..."},
    "ppargc1a": {"rsid": "rs8192678", "genotype": "..."},
    "actn3": {"rsid": "rs1815739", "genotype": "...", "interpretation": "power vs endurance phenotype"},
    "ace": {"rsid": "rs4646994", "genotype": "..."},
    "bdnf": {"rsid": "rs6265", "genotype": "..."},
    "comt": {"rsid": "rs4680", "genotype": "...", "interpretation": "warrior vs worrier"},
    "vdr_fokI": {"rsid": "rs2228570", "genotype": "..."},
    "vdr_bsmI": {"rsid": "rs1544410", "genotype": "..."},
    "mc1r": {"rsid": "rs1805007", "genotype": "..."},
    "cyp1a2": {"rsid": "rs762551", "genotype": "...", "interpretation": "fast vs slow caffeine metabolizer"},
    "foxo3": {"rsid": "rs2802292", "genotype": "...", "interpretation": "longevity allele"},
    "il6": {"rsid": "rs1800795", "genotype": "..."},
    "tnfa": {"rsid": "rs1800629", "genotype": "..."}
  },

  "polygenic_scores": null,

  "caveats": [
    "Research-grade — not for clinical decisions",
    "Single-SNP interpretations should not override observed biomarker trends",
    "Many longevity outcomes are polygenic; single variants give modest effect sizes"
  ]
}
```

## Phase D — planned use in downstream skills

- **rule-evaluate**: a small number of rules become aware of variants:
  - `R-INF-03 (homocysteine)`: methylated B-complex recommendation upgraded from optional to default if MTHFR variant present
  - `R-LIP-01 (high ApoB)`: ApoE ε4 carrier → tighter ApoB target (<70 vs <80)
  - Caffeine guidance: CYP1A2 slow metabolizer → cutoff 12h before bed instead of 10h
- **rootcause-phenotype**: APOE ε4 adds to "M-20" mechanism scoring
- **protocol-author**: COMT warrior/worrier shapes stress-management modality choice

## Privacy note

Genetics data is high-sensitivity. The skill keeps the raw export OUT of the report; only the small variant list goes into `genetics.json`. The variant list is stored in the run folder, never transmitted to any external API.

## Why design the contract now?

Same rationale as wearable-ingest — schema-first means future TS `packages/schema` can plan `GeneticsVariant` types, and the eventual integration with consumer genetics APIs (Tellmegen, Color, etc.) emits the same JSON shape.
