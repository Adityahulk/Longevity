# Module I — Environment

Captures exposure & ambient factors that shape protocol. Especially important for urban India where AQI, heat, and home/office environment materially affect cardio prescriptions and sleep.

## Questions

1. **City AQI exposure** — capture city; the skill infers AQI tier:
   - Delhi NCR, Patna, Lucknow, Kanpur, Gaya → **severe** (often >200, episodically >400)
   - Kolkata, Mumbai (winter), Pune, Ahmedabad, Hyderabad (winter) → **high**
   - Hyderabad (most of year), Bengaluru, Chennai, Coimbatore → **moderate**
   - Mysuru, Munnar, hill stations → **low**
   Use this to shape: Zone-2 outdoor vs indoor; HEPA filter recommendation; AM-sun timing.

2. **Occupational hazards** — pick all: chemicals (paints, solvents, pesticides) / dust (construction, factory) / radiation (lab, medical) / shift work (specify nights) / noise >85dB / heat / cold / sitting >8h. Drives recovery + cardio recommendations.

3. **Sleep environment** —
   - **Room temperature** — cool (AC, <22°C) / moderate (22-25°C) / warm (>25°C, no AC). Warm = poor sleep architecture, esp. in Hyderabad summers.
   - **Light** — fully dark / some streetlight / bright. Bright = melatonin suppression.
   - **Noise** — quiet / some traffic / loud. Loud = sleep fragmentation.

4. **Commute** — minutes each way; mode (car / 2-wheeler / public transit / WFH).

5. **Daily screen time hours** — total (work + personal + entertainment). Blue light + posture + cognitive load all factor.

6. **Pollution protection currently** — HEPA at home (yes/no) / mask outdoor (sometimes/always/never) / car has cabin filter (yes/no).

7. **Home — recent mold or water damage?** — yes/no/unsure. Mold exposure drives chronic eosinophilic inflammation in susceptible.

8. **Pets at home** — none / dog / cat / other. If yes + allergic in HPI module → flag.

## How this shapes protocol

- **Severe AQI (Delhi-tier)**: outdoor cardio discouraged year-round; indoor Zone 2 (treadmill, cycle); HEPA filter mandatory; mask N95 outdoor; consider NAC supplement for oxidative-stress mitigation.
- **High AQI (Mumbai/Hyderabad winter)**: outdoor cardio AM only (before 10am) or evening (post-4pm); check IQAir daily, indoor backup on AQI >150 days.
- **Moderate AQI (Hyderabad most of year)**: outdoor cardio fine in cool hours; HEPA still beneficial for sleep.
- **Warm sleep environment**: prioritize AC fix / fan / cooling mattress topper; recommend Mg glycinate for sleep onset; consider melatonin 0.3mg only if onset latency >30min.
- **Shift work**: chronotype protocols change entirely — Day-Night-Day shift workers need anchored sleep schedule + dark room + melatonin timing.
- **Mold exposure**: refer for IgE testing; consider remediation; cannot reverse eosinophilia until source is addressed.
- **Pet allergies**: HEPA + bedroom-pet-free policy.

## Output to `intake.json` under `environment`:

All 8 fields structured. AQI tier is derived from city.
