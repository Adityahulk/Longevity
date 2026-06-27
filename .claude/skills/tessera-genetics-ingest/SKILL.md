---
name: tessera-genetics-ingest
description: Ingest a whole-genome or consumer-array export (23andMe / AncestryDNA / MyHeritage raw text, or a provided variant list) and extract the longevity- and pharmacogenomically-relevant SNPs catalogued in lib/genomics-canonical.md (APOE, Lp(a), 9p21, TCF7L2, FTO, FOXO3, CYP1A2, SLCO1B1, CYP2C19, MTHFR C677T/A1298C, COMT, ACTN3, VDR, BDNF). Emits genetics.json with interpretations, South-Asian context, and the Risk/Pharmacogenomic/Methylation/Nutrition-Training groupings for the Genomic Filter. Used by the Deep (Tier-2) pipeline.
---

# Tessera Genetics Ingest

Reads a DNA export and produces `genetics.json` — the variant list, interpretations, and groupings the
Deep-tier pipeline (rule-evaluate → rootcause → protocol → report) consumes. The canonical SNP catalog,
genotype interpretations, South-Asian context, and the `modifies` engine hooks all live in
**`lib/genomics-canonical.md`** — this skill never invents an effect size or a variant not listed there.

## Inputs

- A raw DNA export (23andMe `genome_*.txt`, AncestryDNA `.txt`, MyHeritage CSV — all tab/comma tables of
  `rsid · chromosome · position · genotype`) **or** a pre-extracted variant list.
- Patient context: ancestry (for SA-context flags) — optional but improves interpretation.

## Workflow

### Step 1 — Parse the export
Read the table; build a lookup of `rsid → genotype`. These exports are plain text — use `python3` to
read line by line (skip `#` comment headers). For APOE, the genotype is defined by the **pair**
rs429358 + rs7412; resolve the ε-haplotype (ε2/ε3/ε4) from the two calls per `genomics-canonical.md`.

### Step 2 — Extract catalogued variants
For each `key` in `lib/genomics-canonical.md`, look up its `rsid`(s). When found, record the genotype,
attach the matching interpretation string, the `effect_size_caveat`, and the `sa_context`. Group by the
entry's `category` (risk / pharmacogenomic / methylation / nutrition_training).

### Step 3 — Resolve convergence flags
Some entries are confirmed by the blood panel, not the array alone — e.g. `lpa_genetic` is reported as a
`carrier` flag here, but its clinical weight comes from the measured serum `lp_a` downstream. Mark these
so `tessera-rule-evaluate` can require the convergence (genotype AND biomarker) before firing.

### Step 4 — Privacy reduction
**Only the catalogued variant list goes into `genetics.json`.** The raw export (millions of calls) is
never copied into the run folder or transmitted to any API. Record `source` and a one-line provenance,
not the file contents. Any export variant not in the catalog is dropped (or, if explicitly requested,
stored uninterpreted under `variants.other`).

### Step 5 — Write `genetics.json` (`available: true`) and reply
Reply with: count of catalogued variants found, the headline findings by category (e.g. "APOE ε3/ε4
carrier; CYP1A2 slow; MTHFR C677T het"), and any sensitive flag (APOE ε4 → note the counseling offer).

## Phase A+B fallback

If no DNA export is provided, this skill is a no-op that writes `available: false` and the pipeline
proceeds on blood + intake only (no `R-GEN-*` rules fire):

```json
{ "ingested_at_utc": "<ts>", "available": false,
  "reason": "no DNA export provided", "source": null, "variants": null }
```

## `genetics.json` shape

```json
{
  "ingested_at_utc": "...",
  "available": true,
  "source": "23andme | myheritage | ancestrydna | tellmegen | other",
  "source_file_path": "...",
  "panel_version": "23andme_v5",

  "variants": {
    "apoe": {"rsids": ["rs429358", "rs7412"], "genotype": "ε3/ε4", "category": "risk",
      "interpretation": "ε4 heterozygote — higher lifetime Alzheimer's + CVD risk; LDL/ApoB more sensitive to saturated fat. Among the most lifestyle-modifiable risk genes.",
      "sa_context": "ε4 frequency somewhat lower in South Asians, but stacks on a higher CVD baseline.",
      "modifies": "R-LIP-01 → ApoB target <70", "sensitive": true},
    "lpa_genetic": {"rsids": ["rs10455872", "rs3798220"], "genotype": "carrier", "category": "risk",
      "interpretation": "Genetically elevated Lp(a); confirm with measured serum Lp(a). Lifelong, lifestyle-fixed CVD amplifier.",
      "sa_context": "Elevated Lp(a) common and under-tested in South Asians — a frequent hidden driver of premature CAD.",
      "confirm_with_biomarker": "lp_a"},
    "cad_9p21": {"rsid": "rs1333049", "genotype": "CC", "category": "risk",
      "interpretation": "Most replicated common CAD-risk locus, largely lipid-independent."},
    "t2d_tcf7l2": {"rsid": "rs7903146", "genotype": "CT", "category": "risk",
      "interpretation": "Strongest common T2D-risk variant (impaired insulin secretion).",
      "sa_context": "Adds to elevated SA 'thin-fat' T2D risk at lower BMI."},
    "fto": {"rsid": "rs9939609", "genotype": "AT", "category": "risk",
      "interpretation": "Modestly higher appetite/adiposity tendency; behaviour dominates."},
    "foxo3": {"rsid": "rs2802292", "genotype": "TG", "category": "risk",
      "interpretation": "Carries a longevity-associated allele (informational, not actionable)."},
    "cyp1a2": {"rsid": "rs762551", "genotype": "CC", "category": "pharmacogenomic",
      "interpretation": "Slow caffeine metabolizer — afternoon caffeine degrades that night's sleep + HRV.",
      "modifies": "R-GEN-CYP1A2-01 → caffeine cutoff 10:00"},
    "slco1b1": {"rsid": "rs4149056", "genotype": "TC", "category": "pharmacogenomic",
      "interpretation": "Intermediate transporter function — modestly higher statin-myopathy risk; physician advisory if a statin is considered.",
      "modifies": "R-GEN-SLCO1B1-01 (physician note)"},
    "cyp2c19": {"rsid": "rs4244285", "genotype": "GA", "category": "pharmacogenomic",
      "interpretation": "Intermediate metabolizer — relevant only if clopidogrel/PPI prescribed.",
      "sa_context": "LoF alleles relatively common in South/East Asians."},
    "mthfr_c677t": {"rsid": "rs1801133", "genotype": "CT", "category": "methylation",
      "interpretation": "Heterozygous — ~65% enzyme activity. Methylated B forms preferred when homocysteine is elevated.",
      "modifies": "R-GEN-MTHFR-01 (gated on homocysteine >10)"},
    "mthfr_a1298c": {"rsid": "rs1801131", "genotype": "AA", "category": "methylation",
      "interpretation": "No additional reduction (matters mainly compound-het with C677T)."},
    "comt": {"rsid": "rs4680", "genotype": "AG", "category": "methylation",
      "interpretation": "Val/Met intermediate dopamine clearance — tunes stress-modality choice."},
    "actn3": {"rsid": "rs1815739", "genotype": "CT", "category": "nutrition_training",
      "interpretation": "Mixed power/endurance fiber profile."},
    "vdr": {"rsid": "rs2228570", "genotype": "Ff", "category": "nutrition_training",
      "interpretation": "Modest VDR efficiency difference; measured 25(OH)D governs dosing."},
    "bdnf": {"rsid": "rs6265", "genotype": "GA", "category": "nutrition_training",
      "interpretation": "Met carrier — aerobic exercise + sleep especially worthwhile for BDNF."}
  },

  "groupings": {
    "risk": ["apoe", "lpa_genetic", "cad_9p21", "t2d_tcf7l2", "fto", "foxo3"],
    "pharmacogenomic": ["cyp1a2", "slco1b1", "cyp2c19"],
    "methylation": ["mthfr_c677t", "mthfr_a1298c", "comt"],
    "nutrition_training": ["actn3", "vdr", "bdnf"]
  },

  "polygenic_scores": null,

  "caveats": [
    "Research-grade — not for clinical diagnosis.",
    "Single common variants carry modest effect sizes; a genotype is a probability shift, not a destiny.",
    "Variant interpretations never override an observed biomarker trend.",
    "Polygenic/odds estimates are mostly European-trained; South-Asian context flags are noted per variant.",
    "APOE ε4 is disclosed factually with a genetic-counseling offer, never deterministically."
  ]
}
```

## Use in downstream skills (live)

- **rule-evaluate**: evaluates `lib/rulebook/genomics.md`. Genomic rules fire standalone (Genomic
  Filter cards) AND apply their `modifies` hook to already-fired biomarker rules — e.g. ApoE ε4
  (`R-GEN-APOE-01`) tightens the `R-LIP-01` ApoB target to <70; MTHFR (`R-GEN-MTHFR-01`) switches the
  B-vitamin form when homocysteine >10; CYP1A2 (`R-GEN-CYP1A2-01`) sets the caffeine cutoff.
- **rootcause-phenotype**: APOE ε4 → mechanism M-20; MTHFR/COMT → M-19; APOE+Lp(a)+9p21+TCF7L2 collapse
  into M-12 (cardiometabolic genetic load).
- **safety-screen**: reads the pharmacogenomic entries (SLCO1B1 statin advisory, CYP2C19) for the
  physician-facing notes.
- **protocol-author**: reads genomic targets (ApoB <70, methylfolate, caffeine cutoff) and writes the
  Genomic Filter "how your DNA changed this protocol" lines + the COMT-matched stress modality.

## Privacy note

Genetics data is high-sensitivity. The skill keeps the raw export OUT of the report; only the small variant list goes into `genetics.json`. The variant list is stored in the run folder, never transmitted to any external API.

## Why design the contract now?

Same rationale as wearable-ingest — schema-first means future TS `packages/schema` can plan `GeneticsVariant` types, and the eventual integration with consumer genetics APIs (Tellmegen, Color, etc.) emits the same JSON shape.
