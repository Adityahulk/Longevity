---
name: tessera-report-compose
description: Composes the client-facing HTML + PDF report from the upstream JSON artifacts (biomarkers, intake, rules, phenotype, rootcause, safety, protocol). Uses the Tessera-branded report template, fills the slots, then renders to PDF via headless Chrome. Single artifact in Phase A+B (5-artifact split deferred to Phase C). Step 9 of tessera-pipeline.
---

# Tessera Report Compose (slim)

The final-mile skill. Reads every upstream JSON, populates the Tessera report template with rich personalized content, and renders to PDF.

In Phase A+B this produces a **single** client `report.html` + `report.pdf`. Phase C will expand this into 5 artifacts (doctor letter, coach pack, weekly menu, shopping list, WhatsApp 1-pager).

## Inputs

- `biomarkers.json` + `panel-completeness.json`
- `intake.json`
- `rule-evaluation.json`
- `phenotype.json` + `rootcause.json`
- `safety.json`
- `protocol.json`
- `run-manifest.json` (versions, timestamps)

## Workflow

### Step 1 — Load the template

Read `.Codex/skills/tessera-report/templates/report-template.html`. This contains the structural skeleton + Tessera design system (cream/paper backgrounds, Fraunces serif headlines, Inter body, JetBrains Mono data, burnt-orange accent #B85426). DO NOT rewrite the CSS.

The template has placeholder slots `{{...}}` for content. Phase A+B extends the template with new cards:

- **Phenotype card** — primary phenotype + overlays + voice statement
- **Root-cause graph card** — 2-3 root nodes with "covers fired rules + markers" trace
- **Panel-completeness card** — missing markers tiered by clinical leverage + recommended Day-90 add-ons
- **Safety-cleared supplements card** — per-supplement verdict + checks-passed list

### Step 2 — Fill the cover

- Client first name
- Report date
- Headline: phenotype label + "Your biological age: **X.X** — Y.Y years [younger | older] than your calendar age."
- Tier 1 callout if any (red banner, "Please discuss with your physician")

### Step 3 — Fill executive summary

4–6 bullet findings, ranked:

1. Tier 1 findings first (if any) — with physician callout
2. Top 2-3 Tier 2 + Tier 3 in importance order
3. Top 1-2 Tier 4 wins (what's already great — celebratory)

### Step 4 — Fill biological age section

- Headline bio-age + delta + 1-paragraph plain-English explanation
- **Trajectory line** — render `protocol.biological_age_trajectory` into the three slots `{{biological_age_day_1}}`, `{{biological_age_day_30_estimate}}`, `{{biological_age_day_90_target}}`. This positions PhenoAge as a moving target the coach holds the client to, not a one-shot verdict. Lead headline should read "Your biological age is X — and we're moving it toward Y by Day 90," not "Your biological age is X."
- Table of the 9 PhenoAge inputs (canonical + display values)
- The "movable, not destiny" framing — explicitly reference that the Day 90 target assumes 80%+ adherence on the 6-habit stack

If PhenoAge not computable, lead with the top fired finding + "biological age not available — missing marker X". Omit the trajectory line if Day 1 is null.

### Step 5 — Fill biomarker analysis (by panel)

Group by category: CBC · Glucose & Insulin · Lipids · Liver · Kidney · Inflammation · Thyroid · Vitamins · Hormones · Minerals · Derived Indices.

For each marker: value · unit · optimal range · status badge (OPTIMAL/WATCH/OFF-TARGET/REFER) · 1-3 sentence interpretation written specifically for this person's intake context.

Use the `marker-row` component already styled in the template.

### Step 6 — Fill phenotype card (NEW)

From `phenotype.json`:

```html
<section class="card phenotype-card">
  <div class="card-eyebrow">Your phenotype</div>
  <h2>{{phenotype.full_label}}</h2>
  <p class="phenotype-voice">{{phenotype.protocol_voice}}</p>
  <div class="phenotype-features">
    <h4>Why we read it this way</h4>
    <ul>
      {{#each phenotype.primary_phenotype.diagnostic_features_met}}
        <li>{{this}}</li>
      {{/each}}
    </ul>
  </div>
  {{#if phenotype.overlays}}
    <div class="phenotype-overlays">
      <h4>Overlays</h4>
      {{#each phenotype.overlays}}
        <div class="overlay">
          <strong>{{label}}</strong> — {{diagnostic_features_met.join(', ')}}
        </div>
      {{/each}}
    </div>
  {{/if}}
</section>
```

### Step 7 — Fill root-cause graph card (NEW)

From `rootcause.json`:

```html
<section class="card rootcause-card">
  <div class="card-eyebrow">What's actually driving this</div>
  <h2>2 root causes — not 5 separate problems</h2>
  <p>You'll see findings across Vit D, cortisol, eosinophils, testosterone, RDW. Rather than treating each as separate, we trace them back to a small set of root drivers. Attack the roots, the leaves resolve.</p>
  {{#each rootcause.root_nodes}}
    <div class="root-node">
      <h3>{{name}}</h3>
      <div class="root-driver">{{root_driver}}</div>
      <div class="covers">
        <strong>Explains:</strong> {{covers_markers.length}} markers + {{covers_fired_rules.length}} fired rules
        <ul class="markers-trace">
          {{#each covers_markers}}
            <li><code>{{code}}</code> ({{value}}) — {{explanation}}</li>
          {{/each}}
        </ul>
      </div>
      <div class="intake-confirm">
        <strong>Lifestyle signals that confirm:</strong>
        <ul>{{#each intake_confirming_signals}}<li>{{this}}</li>{{/each}}</ul>
      </div>
      <div class="intervention-class">→ Attack via: {{intervention_class}}</div>
    </div>
  {{/each}}
</section>
```

### Step 8 — Fill panel-completeness card (NEW)

From `panel-completeness.json`:

```html
<section class="card panel-completeness-card">
  <div class="card-eyebrow">Your panel coverage</div>
  <h2>Markers we wish you'd added</h2>
  <p>Your current panel covers the metabolic + cardiometabolic + endocrine foundation. To reach a complete longevity panel, consider adding these at your Day-90 retest. They're ranked by what would most change interpretation of your current findings.</p>
  <div class="missing-tiers">
    <div class="missing-tier-1">
      <h4>Must-add (would change interpretation of current findings)</h4>
      <ul>
        {{#each recommended_add_ons_for_retest where tier_priority=1}}
          <li><code>{{marker}}</code> — {{rationale}}</li>
        {{/each}}
      </ul>
    </div>
    <div class="missing-tier-2">
      <h4>Should-add (next-layer specificity)</h4>
      ...
    </div>
    <div class="missing-tier-3">
      <h4>Nice-to-add (research-grade optimization)</h4>
      ...
    </div>
  </div>
</section>
```

### Step 9 — Fill the personalized protocol section

From `protocol.json`:

- Root-attack pillars (2-3) lead the section
- 5 domain cards (Nutrition · Training · Recovery & Sleep · Supplements · Mind & Wellness) ordered by `phenotype.lead_domains`
- Each domain card uses the existing styling; supplements card includes the new Safety-cleared list

### Step 10 — Fill safety-cleared supplements card (NEW)

From `safety.json` (inside the Supplements domain card):

```html
<div class="safety-cleared">
  <h4>Safety-cleared</h4>
  <p class="muted">Every supplement below was checked against your medications, conditions, allergens, and current life stage.</p>
  <table class="safety-table">
    {{#each safety.items where verdict=cleared}}
      <tr>
        <td><strong>{{name}}</strong> — {{dose}}</td>
        <td class="verdict cleared">CLEARED</td>
        <td class="checks">{{checks_passed.length}} checks passed</td>
      </tr>
    {{/each}}
  </table>
</div>
```

### Step 11 — Fill 90-day plan + retest plan

Existing template structure + protocol.json's `ninety_day_habit_stack` + `retest_plan`.

**Per habit-block, render the coach check-in line** at the bottom of each timeline-content block. Source from `ninety_day_habit_stack[i].coach_check_in_days` + `coach_check_in_focus`. Use the `coach-check-in` + `coach-check-in-label` CSS classes already defined in the template stylesheet. The label uses the days string (e.g., "Coach check-in · Day 14 ·"), then the focus string follows in italic. This aligns the client and coach on what each bi-weekly call from `journey.html` is about — without bloating the report with a separate coach section.

**Reframe the retest section as adherence-gated commitment**, not passive projection. The template's section title is already updated to "Hit 80%+ on the habits. This is what the retest will look like." Keep that framing intact when filling `{{retest_expectations}}` — each line is a concrete delta the coach holds the client to, not an aspiration.

### Step 12 — Fill disclaimers

Standard "not a diagnosis", "discuss with physician", "biomarker-moving not anti-aging" language — already in template, do not weaken.

### Step 13 — Save HTML + render PDF

1. Save populated HTML to `<run-folder>/report.html`.
2. Run `.Codex/skills/tessera-report/scripts/render-pdf.sh` on it (reused unchanged from old skill).
3. Print the absolute paths.

### Step 14 — Reply

Reply with the hand-off summary (orchestrated by `tessera-pipeline` step 11).

## Hard rules

- **DO NOT rewrite the CSS / design system.** Only fill `{{slots}}`. New cards use the existing CSS tokens (`--cream`, `--paper`, `--ink`, `--accent`, `--leaf`, `--gold`, etc.).
- **Indian-cuisine + vegetarian-aware content** per existing template constraints.
- **Tessera voice** — confident, warm, specific, evidence-anchored. No emojis. No exclamation points unless quoting the user.
- **Phenotype + root-cause on the cover** (alongside bio-age) — not buried mid-report.
- **Tier 1 banner first** — physician-referral language never hidden.
- **Safety-cleared visible** — clients should see the checks were done, not assume.

## Future TS consumer

The composed `report.html` is the deliverable artifact. The schema for `protocol.json` mirrors future `packages/protocol-drafter` output. When PWA build starts, this skill becomes a thin Next.js page component fed the same JSON.
