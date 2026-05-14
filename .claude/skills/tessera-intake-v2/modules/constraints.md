# Module H — Constraints

Required to author a *real* protocol (weekly menu, training calendar, supplement schedule). Without these, the protocol is generic advice rather than a usable plan.

## Questions

1. **Monthly supplement budget (INR)** — pick a tier: ₹0 (none) / ₹500 / ₹1500 / ₹3000 / ₹5000+ / unlimited. Affects which supplements get recommended (e.g., NMN is out at ₹500; ashwagandha + Vit D + Mg fits ₹1500).
2. **Kitchen access** — full (own kitchen, can cook) / shared (PG, hostel) / minimal (hotel, restaurant-dependent) / staff-cooked (cook prepares meals).
3. **Cooking skill self-rated** — 1 (cannot) to 10 (chef-level). Affects menu complexity.
4. **Household & who cooks** — e.g., "self + spouse + 2 kids, partner cooks main meal; I cook breakfast" — protocol authors menu to the actual cooking situation.
5. **Eating out frequency** — meals per week eaten outside home (restaurants, office cafeteria, ordered-in). Affects how much of the menu can be controlled.
6. **Equipment access** — pick: none / dumbbells only at home / resistance bands / kettlebells / full home gym (rack + barbell) / commercial gym access / outdoor parks only / yoga studio. Drives the training program.
7. **Weekly schedule shape** — pick: M-F 9-6 desk job / M-F 9-9 long hours / shift work (specify) / WFH flexible / travel-heavy / variable. Drives training session timing + meal timing.
8. **Religious / cultural dietary constraints** — pick all that apply: vegetarian-by-tradition / Jain (no root vegetables) / Hindu fasting days (Ekadashi, Karva Chauth, Navratri) / Ramadan-observant (M-Ramadan window) / no beef / no pork / no fish. Affects menu calendar.
9. **Regional cuisine preference** — pick all: south-indian / north-indian / bengali / gujarati / punjabi / maharashtrian / tamil / telugu / kerala / continental / pan-asian / mixed. Menu adapts.
10. **Strict allergens or foods to never recommend** — list (separate from cultural — e.g., "hate mushrooms," "allergic to peanuts," "don't tolerate dairy").
11. **Realistic time available for protocol (minutes/day)** — not aspirational. Includes prep + workout + reading + supplements. 30 / 45 / 60 / 90 / 120+. Drives the depth of the 90-day plan.

## Notes on regional cuisines

Used by `tessera-protocol-author` to adapt the menu:

- **South Indian** — dosa/idli/sambar emphasized; coconut acceptable; curd-rice end-of-meal; ghee in moderation.
- **North Indian** — roti/sabzi base; dal/rajma/chana cycle; paneer for veg, chicken for non-veg.
- **Bengali** — fish-heavy (great for omega-3); rice base; mustard oil tradition (good monounsaturated).
- **Gujarati** — vegetarian, dal-rice-rotli, often higher sugar in dishes (audit).
- **Punjabi** — paneer / mixed dals / chicken; ghee tradition (cap at 1-2 tsp/day).
- **Maharashtrian** — bhakri (millet), thalipeeth, fish in coastal regions.
- **Tamil** — millet-rich (ragi, jowar, bajra), curd-rice, fish-heavy in coastal areas.
- **Telugu (Andhra/Telangana)** — rice base, gunpowder (high-fat-tradition), pulihora; high spice tolerance.
- **Kerala** — fish-heavy (excellent for omega-3), coconut, banana, parboiled red rice.

## Output to `intake.json` under `constraints`:

All 11 fields structured. Free-text for "strict allergens" and "household" and "schedule shape"; pick-list for others.
