# Tessera — End-to-End App Implementation Plan

## Context

Tessera is an urban-Indian, 90-day longevity program (Hyderabad-first; Bangalore Q3 2026). Today the operating model lives in HTML strategy/rulebook docs and is run via Notion + Sheets + WhatsApp + manual lab handoff. The goal of this plan is to ship a single product surface — a **mobile-first PWA** — that absorbs the entire client journey end-to-end:

1. Book a free 30-min consultation, pay for a tier, schedule a home blood draw.
2. Complete a 127-question lifestyle intake; sync (or upload) wearable + lifestyle data.
3. Receive a **PhenoAge-based biological age** + a personalized 5-domain protocol (Nutrition, Training, Recovery/Sleep, Supplements, Mind) generated from the rulebook, drafted by Claude, edited by a practitioner, and gated by a doctor on Tier 1 findings.
4. Execute the protocol for 90 days with daily habit check-ins, coach chat (human in Phase 1, AI-augmented in Phase 2), and food / wearable inputs.
5. Re-test on Day 90 and review the outcome report (before/after biomarker delta + biological age delta).

Compliance must match what `privacy.html` already promises publicly: DPDP Act 2023 + IT Act 2000, India data residency, 15-day deletion SLA, no employer/insurer sharing, no marketing pixels on health pages, NABL-accredited labs, revocable consent per scope.

## Locked decisions (from clarifying round)

| Decision | Choice |
|---|---|
| Platform v1 | **PWA / mobile web first** (Next.js installable PWA). Native RN app deferred to Phase 3. |
| AI chat at launch | **Coach-in-the-loop only** in Phase 1. Full tool-use agent ships in Phase 2 behind a feature flag with mandatory coach review of the first ~100 conversations. |
| Doctor scope | **Protocol-approval gate only** for Tier 1 / cardio / endocrine / supplement-contraindication findings. No telemed visits in-app at launch. |
| Lab flow | **Manual ops handoff in Phase 1.** User books a slot, ops places the order with Thyrocare/Redcliffe, PDF results uploaded by ops, parsed by Claude, verified by a practitioner. Direct lab API in Phase 2. |

## Tech stack

| Slot | Pick | Why |
|---|---|---|
| User PWA + practitioner/admin console + marketing | **Next.js 15 App Router on Vercel**, installable PWA via `next-pwa` (service worker, manifest, offline-cached protocol view) | Single codebase, RSC + server actions for admin, marketing pages already on Vercel (`vercel.json`). iOS 16.4+ supports web push for installed PWAs. |
| Styling / UI | **Tailwind + shadcn/ui + Radix primitives + Framer Motion** | Premium feel, accessible primitives, fast |
| State / data | **TanStack Query** + **Zustand** for transient UI state; **Zod** schemas shared client/server | Type-safe end-to-end |
| Backend | **NestJS (TypeScript) on Fly.io Mumbai (`bom1`)**; migrate to AWS ECS `ap-south-1` at scale | Same language as frontend, mature SDKs for every vendor here. Mumbai region for DPDP residency. |
| DB | **Postgres on Neon (Mumbai)** with **Drizzle ORM**; **pgvector** for the rulebook RAG index | Branching DBs for staging, RLS per `client_id`, logical replication for analytics |
| Auth | **Supabase Auth self-hosted in `ap-south-1`** | Phone-OTP first (Indian default), email backup, Postgres-native RLS, JWT verified by NestJS |
| File storage | **AWS S3 `ap-south-1`** with SSE-KMS, private buckets, signed URLs | Lab PDFs, consent forms, video recordings |
| Payments | **Razorpay** (UPI, cards, EMI) + Payment Links for sales-led closes | ₹-native, GST invoicing |
| Video | **100ms.live** web SDK | Mumbai SFU, recording + transcripts, cheaper than Twilio |
| Calendar | **Cal.com self-hosted** alongside the API | Open source, embeddable, round-robin for multi-coach teams, owns the data |
| Wearables (Phase 1) | **Manual file upload** — Apple Health Export `.xml`, Google Fit CSV, Oura/Whoop CSV — parsed into normalized `wearable_metric` rows | No native APIs available on PWA; Phase 3 native app picks up HealthKit / Health Connect / OAuth |
| AI | **Anthropic Claude Opus 4.7** for protocol drafting + Phase 2 chat reasoning, **Haiku 4.7** for cheap classification (Tier-1 detection, intent routing, claims/PII filter). Prompt caching on the rulebook + per-user snapshot; zero-retention tier. |
| Lab PDF parsing | **Claude Files API** with strict JSON schema + Tesseract fallback for poor scans | One vendor, handles lab format quirks |
| Notifications | **Web Push (VAPID)** + **WhatsApp Business Cloud API via Gupshup / 360dialog (India BSP)** + **Resend** for transactional email | Daily check-in nudges push to web + WhatsApp; keeps existing WhatsApp habit |
| Observability | **Sentry** (errors), **PostHog self-hosted** (product analytics, no GA/Meta on auth'd pages), **Better Stack** (logs/uptime) | Compliance posture per `privacy.html` |
| CI/CD | **GitHub Actions** → Vercel preview deploys + Fly deploys; **Drizzle migrations** versioned in repo | |

## Repo layout

Monorepo (`pnpm` + `turbo`):

- `apps/web` — Next.js PWA (user) + admin (`/admin`) + marketing (existing HTML migrated to Next pages)
- `apps/api` — NestJS HTTP + worker process
- `packages/rules-engine` — pure TS library: PhenoAge formula, rulebook evaluation, protocol skeleton generation. Zero I/O. Versioned with semver.
- `packages/schema` — shared Zod schemas + Drizzle table definitions
- `packages/protocol-drafter` — Claude-powered protocol drafter (consumes rules-engine output, returns `protocol_draft`)
- `packages/lab-parser` — Claude Files API client + JSON validation
- `packages/ui` — shared shadcn components

## Data model (core tables)

All PII tables have `created_at`, `updated_at`, `deleted_at` (soft-delete), and **RLS policies keyed on `client_id`**. PII columns AES-encrypted via app-layer envelope encryption with AWS KMS.

- `client` — phone, email, name (enc), dob, sex_at_birth, chronological_age (derived), city, tier_purchased, status
- `consent_record` — client_id, scope (`lab_share` / `whatsapp` / `video_recording` / `marketing` / `research`), version, granted_at, revoked_at, ip, evidence_blob_url — **append-only**
- `lab_order` — client_id, lab_vendor, panel_code, scheduled_at, collected_at, status, vendor_order_id
- `bloodwork_panel` — client_id, lab_order_id, drawn_at, source_pdf_s3_key, parser_version, raw_parsed_json, verified_by_user_id, verified_at
- `biomarker_value` — panel_id, marker_code, value, unit, ref_low, ref_high, optimal_low, optimal_high, flag
- `phenoage_result` — panel_id, chronological_age, biological_age, delta, formula_version, computed_at
- `intake_response` — client_id, question_code, answer_json, intake_version
- `rule_set` — version, published_at, source_doc_hash — versioned snapshot of the rulebook
- `rule_evaluation` — panel_id, rule_set_id, rule_code, tier (1–4), marker_code, triggered, evidence_json
- `protocol_draft` — client_id, panel_id, rule_set_id, ai_model, ai_input_hash, draft_json, created_by (ai / user_id)
- `protocol` — client_id, draft_id, version, status (draft / practitioner_approved / doctor_approved / published / superseded), published_at, expires_at
- `protocol_domain` — protocol_id, domain (`nutrition` / `training` / `recovery` / `supplement` / `mind`), content_json, rationale_md
- `appointment` — client_id, kind (consult / checkin / retest_review), provider_user_id, scheduled_at, video_room_id, recording_s3_key, consent_recording
- `checkin` — client_id, date, mood, energy, sleep_hours, notes, source (app / whatsapp)
- `habit_log` — client_id, habit_code, date, completed, value
- `wearable_metric` — client_id, source, metric_code (hrv / rhr / steps / sleep_deep), date, value, unit, raw_payload_jsonb
- `food_log` — client_id, eaten_at, items_json, photo_s3_key, macros_json
- `chat_thread` / `chat_message` — client_id, role, content, tool_calls_json, grounding_refs_json, model, latency_ms, redacted, reviewed_by_user_id (Phase 2 review queue)
- `payment` — client_id, razorpay_order_id, razorpay_payment_id, amount_paise, tier, gst_invoice_s3_key, status
- `audit_log` — actor_user_id, action, target_table, target_id, before_jsonb, after_jsonb, ip, ts — **append-only**
- `deletion_request` — client_id, requested_at, scheduled_purge_at, executed_at, evidence_json (15-day DPDP SLA)
- `user` (staff) — role (coach / doctor / admin), email, phone, region_scope

## Rules engine + biological age (the deterministic core)

Lives in `packages/rules-engine` as a pure-function TS library. Inputs: validated `biomarker_value[]` + `intake_response[]` + a `rule_set` version. Outputs: `phenoage_result`, `rule_evaluation[]`, and a `protocol_skeleton` (Tier 1 referrals + Tier 2/3 targets per domain).

**PhenoAge** is the Levine 2018 linear model on 9 markers (albumin, creatinine, glucose, hsCRP, lymphocyte %, MCV, RDW, ALP, WBC) + chronological age — implemented as a deterministic formula, formula_version stored on every result so historical scores stay reproducible if the formula is ever updated.

**Rulebook ingestion (one-time seed):** parse `tessera-rulebook.html` into structured JSON (markers, thresholds, tier, recommendations per domain, prose rationale). Commit the JSON to `packages/rules-engine` under `rules/v1/`. Future rule updates are PRs against this directory; merging publishes a new `rule_set` version. Prose chapters also chunked + embedded into pgvector for the Phase 2 chat agent.

**End-to-end flow when results arrive:**

1. Ops uploads PDF to admin → `parse-lab` worker (Claude Files API) writes `bloodwork_panel.raw_parsed_json` + `biomarker_value` rows.
2. Practitioner verifies parsed values against the PDF in admin (one-click confirm or per-row edit). No protocol generated until verified.
3. `rules-engine.evaluate(panel, intake, rule_set_v)` runs → writes `phenoage_result`, `rule_evaluation`.
4. `protocol-drafter` calls Claude Opus with the rule skeleton + intake → produces `protocol_draft` (5 domains).
5. Practitioner reviews/edits in admin → status `practitioner_approved`.
6. If any Tier 1 finding or cardio/endocrine/supplement-contraindication flag is triggered → route to **doctor approval queue**; else publish straight.
7. Doctor approves → `protocol` published, user PWA pulls v1, web push + WhatsApp notification fire.

Every edit lands in `audit_log` with a JSON diff. Re-runs after a rulebook version bump produce a new `rule_evaluation` set but never overwrite history.

## AI chat architecture (Phase 2)

A tool-use agent, **not** pure RAG. Claude Opus 4.7 with these tools:

- `get_user_profile()` — age, sex, tier, allergies, dietary prefs from intake
- `get_latest_biomarkers()` — marker_code, value, flag, optimal range
- `get_active_protocol()` — 5-domain content + rationale
- `lookup_rule(marker_code)` — `rule_evaluation` rows joined with rulebook copy
- `get_recent_checkins(days)`, `get_wearable_summary(days)`
- `search_food_database(query)` — Indian-cuisine-aware portion + macros for "is dosa OK on my plan?"
- `escalate_to_coach(reason, urgent)` — creates a task in coach inbox

Small **pgvector RAG index** layered alongside for the rulebook's prose chapters (the "why") and the food/Indian-cuisine reference.

**System-prompt guardrails:**

- Identity: Tessera assistant, not a doctor.
- Refuse: diagnoses, Rx changes, dosage changes to practitioner-set supplements, anti-aging claims.
- Red-flag list (chest pain, suicidal ideation, severe symptoms, pregnancy + medication) → call `escalate_to_coach(urgent=true)` + surface helpline numbers.
- Any active `rule_evaluation.tier=1` must be mentioned with a "your coach/doctor is covering this" framing.
- Output passed through a **Haiku claims-filter** before sending — blocks anti-aging language and PII leakage.

**Prompt caching** on the rulebook system prompt + per-user biomarker/protocol snapshot (refreshed daily or on protocol change) — expected 60–80% cache hit on multi-turn chats.

**Audit & review queue:** every `chat_message` stores `tool_calls_json` + `grounding_refs_json` + full request/response (encrypted, 90-day retention). First ~100 conversations behind a feature flag; coach reviews each before chat is opened to the next cohort.

## Compliance & security

- **Residency**: all PII + clinical data in `ap-south-1` (Mumbai). AI inference uses Anthropic's zero-retention tier — documented in the DPIA and surfaced in consent.
- **Encryption**: TLS 1.3 in transit; AES-256 at rest via KMS; column-level envelope encryption for name/phone/email/dob/address.
- **Consent**: in-app screen per scope at onboarding (`lab_share`, `whatsapp`, `video_recording`, `marketing`, `research`), versioned; revocation in Settings flips `consent_record.revoked_at` and triggers downstream effects (e.g., stop WhatsApp sends).
- **Right-to-deletion**: in-app self-serve → `deletion_request` → 15-day purge job per DPDP SLA. Outcome stats anonymized via separate `research` consent.
- **Audit**: append-only `audit_log`; staff actions on client data require fresh re-auth for sensitive ops (publishing protocols, exporting data).
- **Lab PDFs**: retained 7 years for medical-practice evidence (encrypted, access-logged).
- **WhatsApp safety**: outbound WhatsApp messages **never** include biomarker values or full names with reports — always "your report is ready, open the app." Per the public commitment in `privacy.html`.
- **No analytics SDKs** on authenticated pages — PostHog only, self-hosted, with health-data-pages opted out of all event capture.
- **Human-review-on-request**: an explicit UI affordance ("Request human review") on any AI-generated content, per the public commitment.

## Phased rollout

### Phase 0 — Foundation (2 weeks)

Repos, monorepo scaffolding, CI/CD, Mumbai infra provisioned (Fly + Neon + S3 + Supabase Auth), base schema migrations, consent screen, design system, marketing pages migrated from HTML to Next.js routes. Practitioner can log in to empty admin. **Success:** a coach can create a dummy client end-to-end in admin.

### Phase 1 — Paid MVP (6–8 weeks)

Goal: onboard the first 50 paying clients without Notion/Sheets. Sell **one tier (Performance ₹35K)** until the flow is proven.

In scope:
- Marketing → free-consult booking (Cal.com embed) → Razorpay checkout → onboarding + 127-Q intake → consent capture
- Lab order placement (manual ops handoff to Thyrocare/Redcliffe)
- Admin: PDF upload → Claude parse → practitioner verify → rules-engine eval → Claude draft → practitioner edit → doctor approval (when triggered) → publish
- User PWA: protocol view (5 domains, offline-cached), biological-age screen, 3-habit daily check-in (push to app + WhatsApp), manual wearable + food log (free-text in v1)
- **Coach chat (human only)** in-app, mirrored to WhatsApp
- Day-90 re-test flow → outcome report with before/after deltas
- Audit log, deletion request flow, consent revocation

Deferred to Phase 2: AI user chat, wearable file parsing, in-app video calls, food log with photo/AI macros, all 3 tiers, referral, lab API.

**Success criteria:** 50 clients complete onboarding → protocol → at least one bi-weekly check-in. NPS ≥ 50. Zero compliance incidents. Median time from PDF upload → published protocol ≤ 48 hours.

### Phase 2 — Real product (6–8 weeks)

- **AI chat agent** (tool-use, feature-flagged to first 20 users, mandatory coach review of first 100 conversations, then graduated rollout)
- Wearable file parsing (Apple Health Export `.xml`, Google Fit, Oura/Whoop CSV) into normalized `wearable_metric`
- In-app video calls via 100ms (consult, check-in, outcome review) with consented recording
- Food log with photo upload → Claude vision → macro estimation
- All 3 tiers live (Foundations / Performance / Continuum)
- Direct lab API integration with Thyrocare (and Redcliffe if signed) — auto order placement, webhook on results
- Referral codes + alumni mode
- Coach mobile-web view (responsive admin)

**Success:** 80% of active clients DAU on the app, 60% have wearable data flowing, AI chat CSAT ≥ 4/5, retest rate ≥ 75%.

### Phase 3 — Depth & flywheel (ongoing)

- **React Native (Expo) wrapper** for HealthKit + Health Connect + native push (the real wearable loop)
- Whoop OAuth, CGM (Abbott / Levels-India when available)
- Outcome dashboard (cohort PhenoAge deltas, with research consent)
- In-app community (alumni Circle-style)
- English / Hindi / Hinglish in chat
- Internal RAG over Tessera's own anonymized outcomes for "people like you" insights
- B2B portal for employer / clinic distribution (separate codebase — consent model fundamentally different)

## Critical files to read / modify

- `tessera-rulebook.html` — source of truth for `rules-engine` seed JSON and Phase 2 RAG corpus
- `tessera-strategy.html` — tier definitions, pricing, vendor short-list (Razorpay, NABL labs)
- `tessera_60_day_roadmap.html` — sanity-check launch sequencing against what was already committed
- `privacy.html` — DPDP commitments the app **must** match (15-day deletion, no employer share, human-review-on-request, NABL labs, no marketing pixels on auth'd pages)
- `journey.html` — user-flow narrative the PWA must deliver against
- `blood-test.html` — exact panel composition, fasting protocol, lab handoff details
- `index.html` — design language + brand voice to carry into the PWA
- `vercel.json` — existing deploy config; PWA will extend it

## Verification (Phase 1 acceptance)

End-to-end smoke test on staging before opening to paying clients:

1. New user lands on marketing → books consult → coach holds call → coach issues a Razorpay Payment Link → user pays.
2. User completes onboarding + consent + 127-Q intake on the PWA.
3. Ops places lab order (Thyrocare portal), draw happens, ops uploads PDF to admin.
4. Practitioner verifies parsed biomarkers; `rules-engine` eval produces a Tier 1 finding (use a seeded test panel with elevated hsCRP + low B12 + a borderline cardio marker).
5. Claude drafts a 5-domain protocol; practitioner edits the nutrition domain; doctor approves (Tier 1 routes to doctor).
6. Protocol publishes; user receives web push + WhatsApp "report ready"; user views biological-age screen and protocol offline.
7. User logs 3 daily habits for a week; coach replies in chat; messages mirror to WhatsApp.
8. Trigger a Day-90 re-test flow with a second seeded panel; outcome report renders before/after deltas.
9. User requests "Delete my data" → 15-day purge job runs on a fast-forwarded clock → confirm all PII columns nulled, `audit_log` retained, `consent_record` retained.
10. Re-auth gate confirmed on protocol publish + data export.

Automated checks running in CI:
- Unit tests on `rules-engine` against a 30-case golden fixture (each known biomarker pattern → expected tier + recommendations).
- PhenoAge formula validated against Levine 2018 reference cases (≤0.1y deviation).
- Drizzle migration replays on a clean DB; RLS policy tests confirm cross-client data is unreachable.
- Lab-parser regression suite on 20 anonymized PDF samples (Thyrocare + Redcliffe formats).

## Open items to revisit before / during build

1. **Doctor licensing scope clarification with counsel** — confirm "protocol approval only" stays outside the telemed-regulation perimeter under current Indian guidelines.
2. **Lab partner contracts** — confirm Thyrocare/Redcliffe will sign a data-sharing agreement that supports the manual handoff in Phase 1 and an API in Phase 2.
3. **WhatsApp BSP selection** — Gupshup vs. 360dialog; pricing + DPDP posture differ.
4. **Pricing of AI inference at scale** — Opus on every chat turn at scale gets expensive; Haiku routing + caching projected at ~₹6–10 per active user/month, but needs a budget sign-off when Phase 2 lands.
5. **GST invoicing** for ₹35K+ tickets — Razorpay handles; confirm internal accounting flow.
6. **Research consent** — capture at signup even though the outcome dashboard ships in Phase 3, so we don't have to back-fill consent later.
