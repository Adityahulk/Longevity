// Antiaging Labs — Instagram Carousel (10 slides, 10.8" × 10.8" square)
// Mitochondrial aging blog post repurpose
// Run: NODE_PATH=/Users/serverport/.nvm/versions/node/v24.14.1/lib/node_modules node make-carousel.js

const pptxgen = require("pptxgenjs");

const OUT = "/Users/serverport/Longevity/assets/instagram-mitochondria-carousel.pptx";

// ── PALETTE (no # prefix) ──────────────────────────────────────────────────
const NAVY   = "0E1B2C";
const CREAM  = "F5F1E8";
const ORANGE = "B85426";
const ORANGE2= "D17244";
const SAGE   = "5E7E6B";
const GREY   = "4A5668";
const WHITE  = "FFFFFF";
const SAND   = "EDE7D9";
const NAVY2  = "152338";  // slightly lighter navy for panels

// ── HELPERS ───────────────────────────────────────────────────────────────
function tag(slide, text, x, y, color = ORANGE) {
  slide.addText(text, {
    x, y, w: 9.8, h: 0.28,
    fontFace: "Calibri", fontSize: 10, bold: true,
    color, charSpacing: 4, align: "left", margin: 0
  });
}

function branding(slide, dark = true) {
  slide.addText("ANTIAGING LABS", {
    x: 0.45, y: 10.3, w: 4, h: 0.28,
    fontFace: "Calibri", fontSize: 9, bold: true,
    color: dark ? "FFFFFF" : NAVY, charSpacing: 3,
    align: "left", margin: 0, transparency: dark ? 45 : 55
  });
  slide.addText("antiaging-labs.com", {
    x: 6.35, y: 10.3, w: 4, h: 0.28,
    fontFace: "Calibri", fontSize: 9,
    color: dark ? CREAM : GREY,
    align: "right", margin: 0, transparency: dark ? 40 : 50
  });
}

// ── PRESENTATION SETUP ────────────────────────────────────────────────────
const pres = new pptxgen();
pres.defineLayout({ name: "SQUARE", width: 10.8, height: 10.8 });
pres.layout = "SQUARE";
pres.title = "Mitochondrial Aging — Antiaging Labs Field Notes";
pres.author = "Antiaging Labs";


// ══════════════════════════════════════════════════════════════════════════
// SLIDE 1 — HOOK (dark)
// ══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: NAVY };

  // Decorative orange accent bar left edge
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.18, h: 10.8,
    fill: { color: ORANGE }, line: { color: ORANGE }
  });

  // Tag
  tag(s, "LONGEVITY SCIENCE  ·  FIELD NOTES", 0.55, 0.52, ORANGE2);

  // Big headline
  s.addText("Your antioxidant\nstack is solving\nthe wrong problem.", {
    x: 0.55, y: 1.1, w: 9.7, h: 4.8,
    fontFace: "Calibri", fontSize: 68, bold: true,
    color: WHITE, align: "left", valign: "top",
    lineSpacingMultiple: 1.05, margin: 0
  });

  // Sub
  s.addText("A Nature study of 750,000 people just rewrote\nhow we understand aging.", {
    x: 0.55, y: 6.3, w: 9.2, h: 1.4,
    fontFace: "Calibri", fontSize: 24,
    color: CREAM, align: "left", margin: 0, lineSpacingMultiple: 1.3
  });

  // Bottom CTA strip
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 9.6, w: 10.8, h: 0.9,
    fill: { color: ORANGE }, line: { color: ORANGE }
  });
  s.addText("Swipe to find out what actually happens  →", {
    x: 0.55, y: 9.62, w: 10, h: 0.86,
    fontFace: "Calibri", fontSize: 16, bold: true,
    color: WHITE, align: "left", valign: "middle", margin: 0
  });

  branding(s, true);
}


// ══════════════════════════════════════════════════════════════════════════
// SLIDE 2 — THE OLD THEORY (light)
// ══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: CREAM };

  tag(s, "THE THEORY EVERYONE BELIEVED", 0.5, 0.5, ORANGE);

  s.addText("Your cells were\nrusting from the\ninside.", {
    x: 0.5, y: 1.0, w: 9.8, h: 3.6,
    fontFace: "Calibri", fontSize: 56, bold: true,
    color: NAVY, align: "left", valign: "top",
    lineSpacingMultiple: 1.05, margin: 0
  });

  s.addText("The mitochondrial theory said: energy production creates toxic exhaust (ROS), which damages your mitochondrial DNA, which drives aging. Clean, intuitive — and the foundation of a multi-billion dollar antioxidant industry.", {
    x: 0.5, y: 4.85, w: 9.8, h: 1.9,
    fontFace: "Calibri", fontSize: 17,
    color: GREY, align: "left", lineSpacingMultiple: 1.45, margin: 0
  });

  // Flow diagram boxes
  const boxes = [
    { label: "ATP", x: 0.5 },
    { label: "ROS", x: 2.7 },
    { label: "mtDNA\nDamage", x: 4.9 },
    { label: "Aging", x: 7.7 },
  ];
  const bw = 1.95, bh = 0.88, by = 7.1;
  boxes.forEach(b => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: b.x, y: by, w: bw, h: bh,
      fill: { color: NAVY }, line: { color: NAVY }
    });
    s.addText(b.label, {
      x: b.x, y: by, w: bw, h: bh,
      fontFace: "Calibri", fontSize: 15, bold: true,
      color: WHITE, align: "center", valign: "middle", margin: 0
    });
  });
  // Arrows between boxes
  [[2.45, 7.54], [4.65, 7.54], [6.85, 7.54]].forEach(([ax, ay]) => {
    s.addText("→", {
      x: ax, y: ay, w: 0.35, h: 0.36,
      fontFace: "Calibri", fontSize: 18, bold: true,
      color: ORANGE, align: "center", margin: 0
    });
  });

  s.addText("It's beautiful. It's also incomplete.", {
    x: 0.5, y: 8.35, w: 9.8, h: 0.5,
    fontFace: "Calibri", fontSize: 16, bold: true, italic: true,
    color: ORANGE, align: "left", margin: 0
  });

  branding(s, false);
}


// ══════════════════════════════════════════════════════════════════════════
// SLIDE 3 — THE STUDY (dark)
// ══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: NAVY };

  // top accent bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 10.8, h: 0.14,
    fill: { color: ORANGE }, line: { color: ORANGE }
  });

  tag(s, "GUPTA ET AL.  ·  NATURE, 2026", 0.5, 0.46, ORANGE2);

  // Giant number
  s.addText("736,038", {
    x: 0.4, y: 1.1, w: 9.8, h: 2.8,
    fontFace: "Calibri", fontSize: 110, bold: true,
    color: ORANGE, align: "left", valign: "middle", margin: 0
  });

  s.addText("people.", {
    x: 0.5, y: 4.1, w: 9.8, h: 0.8,
    fontFace: "Calibri", fontSize: 38, bold: true,
    color: WHITE, align: "left", margin: 0
  });

  s.addText("One of the largest mitochondrial genetics studies\never run.", {
    x: 0.5, y: 5.0, w: 9.8, h: 1.1,
    fontFace: "Calibri", fontSize: 22,
    color: CREAM, align: "left", margin: 0, lineSpacingMultiple: 1.35
  });

  s.addText("They sequenced whole genomes from the UK Biobank + All of Us cohorts, looking for the oxidative fingerprints the classic theory predicted.", {
    x: 0.5, y: 6.5, w: 9.5, h: 1.6,
    fontFace: "Calibri", fontSize: 17,
    color: CREAM, align: "left", margin: 0, lineSpacingMultiple: 1.45,
    transparency: 25
  });

  // Bottom panel
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 9.52, w: 10.8, h: 0.98,
    fill: { color: ORANGE2 }, line: { color: ORANGE2 }
  });
  s.addText("What they found was completely different.", {
    x: 0.55, y: 9.54, w: 9.8, h: 0.94,
    fontFace: "Calibri", fontSize: 17, bold: true,
    color: WHITE, align: "left", valign: "middle", margin: 0
  });

  branding(s, true);
}


// ══════════════════════════════════════════════════════════════════════════
// SLIDE 4 — THE DISCOVERY (light)
// ══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: CREAM };

  tag(s, "THE FINDING", 0.5, 0.5, ORANGE);

  s.addText("Not rust.\nTypos.", {
    x: 0.5, y: 1.0, w: 9.8, h: 2.6,
    fontFace: "Calibri", fontSize: 76, bold: true,
    color: NAVY, align: "left", valign: "top",
    lineSpacingMultiple: 1.0, margin: 0
  });

  s.addText("The mutations didn't match oxidative damage signatures at all. They matched the pattern of random copy-paste errors — made when DNA replicates, not when it gets attacked by free radicals.", {
    x: 0.5, y: 3.9, w: 9.8, h: 1.8,
    fontFace: "Calibri", fontSize: 18,
    color: GREY, align: "left", lineSpacingMultiple: 1.45, margin: 0
  });

  // Comparison boxes
  // Left — EXPECTED (red tint)
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 6.0, w: 4.6, h: 3.1,
    fill: { color: "FAE8E3" }, line: { color: "E8BFB3", width: 1 }
  });
  s.addText("EXPECTED", {
    x: 0.7, y: 6.15, w: 4.2, h: 0.32,
    fontFace: "Calibri", fontSize: 10, bold: true, charSpacing: 3,
    color: "C0392B", align: "left", margin: 0
  });
  s.addText("Oxidative damage\nfingerprint\n(C>A transversions)", {
    x: 0.7, y: 6.6, w: 4.1, h: 2.0,
    fontFace: "Calibri", fontSize: 16,
    color: NAVY, align: "left", lineSpacingMultiple: 1.4, margin: 0
  });

  // Right — FOUND (sage tint)
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.7, y: 6.0, w: 4.6, h: 3.1,
    fill: { color: "E3EEE7" }, line: { color: "A8C9B4", width: 1 }
  });
  s.addText("FOUND", {
    x: 5.9, y: 6.15, w: 4.2, h: 0.32,
    fontFace: "Calibri", fontSize: 10, bold: true, charSpacing: 3,
    color: SAGE, align: "left", margin: 0
  });
  s.addText("Replication error\nfingerprint\n(C>T transitions)", {
    x: 5.9, y: 6.6, w: 4.1, h: 2.0,
    fontFace: "Calibri", fontSize: 16,
    color: NAVY, align: "left", lineSpacingMultiple: 1.4, margin: 0
  });

  s.addText("They found the exact opposite of what the theory predicted.", {
    x: 0.5, y: 9.28, w: 9.8, h: 0.5,
    fontFace: "Calibri", fontSize: 15, bold: true, italic: true,
    color: ORANGE, align: "left", margin: 0
  });

  branding(s, false);
}


// ══════════════════════════════════════════════════════════════════════════
// SLIDE 5 — AGE-60 CLIFF (dark)
// ══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: NAVY };

  tag(s, "DISCOVERY  1 OF 2", 0.5, 0.5, ORANGE2);

  s.addText("Mutations don't\nbuild up slowly.\nThey explode at 60.", {
    x: 0.5, y: 1.0, w: 9.8, h: 3.6,
    fontFace: "Calibri", fontSize: 50, bold: true,
    color: WHITE, align: "left", valign: "top",
    lineSpacingMultiple: 1.1, margin: 0
  });

  s.addText("If aging were steady daily wear-and-tear, mutations would rise linearly. Instead they stay modest all your life — then shoot off a cliff around age 60.", {
    x: 0.5, y: 4.8, w: 9.5, h: 1.6,
    fontFace: "Calibri", fontSize: 18,
    color: CREAM, align: "left", lineSpacingMultiple: 1.45, margin: 0, transparency: 15
  });

  // Simplified chart: flat line then sharp rise
  // Axes
  s.addShape(pres.shapes.LINE, {
    x: 0.9, y: 6.7, w: 0, h: 2.4,
    line: { color: CREAM, width: 1.5, transparency: 40 }
  });
  s.addShape(pres.shapes.LINE, {
    x: 0.9, y: 9.1, w: 8.8, h: 0,
    line: { color: CREAM, width: 1.5, transparency: 40 }
  });

  // Flat segment (age 20–60)
  s.addShape(pres.shapes.LINE, {
    x: 1.1, y: 8.8, w: 5.4, h: 0,
    line: { color: ORANGE, width: 3 }
  });
  // Rising segment (age 60–75)
  s.addShape(pres.shapes.LINE, {
    x: 6.5, y: 8.8, w: 1.8, h: -1.9,
    line: { color: ORANGE, width: 3 }
  });

  // Axis labels
  s.addText("20", { x: 0.95, y: 9.12, w: 0.4, h: 0.28, fontFace: "Calibri", fontSize: 11, color: CREAM, align: "center", margin: 0, transparency: 40 });
  s.addText("60", { x: 6.3, y: 9.12, w: 0.4, h: 0.28, fontFace: "Calibri", fontSize: 11, color: ORANGE, bold: true, align: "center", margin: 0 });
  s.addText("AGE →", { x: 8.5, y: 9.1, w: 1.4, h: 0.28, fontFace: "Calibri", fontSize: 10, color: CREAM, align: "left", margin: 0, transparency: 40 });
  s.addText("MUTATIONS", { x: 0.12, y: 6.7, w: 0.8, h: 2.2, fontFace: "Calibri", fontSize: 9, color: CREAM, align: "center", margin: 0, transparency: 40, rotate: 270 });

  // Swipe nudge
  s.addText("Swipe for the answer  →", {
    x: 0.5, y: 9.55, w: 9.8, h: 0.4,
    fontFace: "Calibri", fontSize: 13, bold: true, italic: true,
    color: ORANGE2, align: "left", margin: 0
  });

  branding(s, true);
}


// ══════════════════════════════════════════════════════════════════════════
// SLIDE 6 — CLONAL HEMATOPOIESIS (light)
// ══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: CREAM };

  tag(s, "DISCOVERY  2 OF 2", 0.5, 0.5, ORANGE);

  s.addText("One cell wins the\nrace. And copies\nits typo billions\nof times.", {
    x: 0.5, y: 0.95, w: 9.8, h: 3.9,
    fontFace: "Calibri", fontSize: 42, bold: true,
    color: NAVY, align: "left", valign: "top",
    lineSpacingMultiple: 1.08, margin: 0
  });

  s.addText("Bone marrow stem cells compete to build your blood supply. One mutant cell occasionally gets a survival advantage — it takes over, dragging its tiny DNA typo into billions of descendants.", {
    x: 0.5, y: 5.05, w: 9.5, h: 1.75,
    fontFace: "Calibri", fontSize: 17,
    color: GREY, align: "left", lineSpacingMultiple: 1.45, margin: 0
  });

  // 3-step flow
  const steps = [
    { n: "01", t: "Random typo in\none stem cell" },
    { n: "02", t: "That cell wins\nthe bone marrow\nrace" },
    { n: "03", t: "Its typo copied\nacross billions\nof blood cells" },
  ];
  const sw = 2.8, sh = 2.0, sy = 7.15;
  const xs = [0.5, 3.85, 7.2];
  steps.forEach((st, i) => {
    s.addShape(pres.shapes.RECTANGLE, {
      x: xs[i], y: sy, w: sw, h: sh,
      fill: { color: NAVY }, line: { color: NAVY }
    });
    s.addText(st.n, {
      x: xs[i] + 0.18, y: sy + 0.18, w: 0.5, h: 0.34,
      fontFace: "Calibri", fontSize: 10, bold: true,
      color: ORANGE, align: "left", margin: 0
    });
    s.addText(st.t, {
      x: xs[i] + 0.18, y: sy + 0.6, w: sw - 0.36, h: 1.2,
      fontFace: "Calibri", fontSize: 15, bold: true,
      color: WHITE, align: "left", margin: 0, lineSpacingMultiple: 1.3
    });
    if (i < 2) {
      s.addText("→", {
        x: xs[i] + sw + 0.02, y: sy + 0.75, w: 0.32, h: 0.5,
        fontFace: "Calibri", fontSize: 20, bold: true,
        color: ORANGE, align: "center", margin: 0
      });
    }
  });

  s.addText("That's the age-60 cliff explained.", {
    x: 0.5, y: 9.48, w: 9.8, h: 0.42,
    fontFace: "Calibri", fontSize: 15, bold: true, italic: true,
    color: ORANGE, align: "left", margin: 0
  });

  branding(s, false);
}


// ══════════════════════════════════════════════════════════════════════════
// SLIDE 7 — PARADIGM SHIFT (dark)
// ══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: NAVY };

  tag(s, "THE NEW MENTAL MODEL", 0.5, 0.5, ORANGE2);

  s.addText("Aging isn't rust.\nIt's a cellular\nelection.", {
    x: 0.5, y: 1.0, w: 9.8, h: 3.2,
    fontFace: "Calibri", fontSize: 54, bold: true,
    color: WHITE, align: "left", valign: "top",
    lineSpacingMultiple: 1.05, margin: 0
  });

  // Two-column comparison
  // OLD
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0.5, y: 4.55, w: 4.5, h: 4.8,
    fill: { color: NAVY2 }, line: { color: "2A3F5A", width: 1 }
  });
  s.addText("OLD MODEL", {
    x: 0.7, y: 4.7, w: 4.1, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true, charSpacing: 3,
    color: "7A8FA6", align: "left", margin: 0
  });
  // faded X mark
  s.addText("✕", { x: 3.8, y: 4.65, w: 0.9, h: 0.36, fontFace: "Calibri", fontSize: 16, color: "7A8FA6", align: "right", margin: 0 });
  [
    "How much damage\nhas accumulated?",
    "Protect cells from\nmetabolic exhaust",
    "Mega-dose\nantioxidants",
  ].forEach((t, i) => {
    s.addText(t, {
      x: 0.7, y: 5.25 + i * 1.2, w: 4.1, h: 1.0,
      fontFace: "Calibri", fontSize: 15,
      color: "6A7F96", align: "left", margin: 0, lineSpacingMultiple: 1.3
    });
  });

  // NEW
  s.addShape(pres.shapes.RECTANGLE, {
    x: 5.8, y: 4.55, w: 4.5, h: 4.8,
    fill: { color: ORANGE }, line: { color: ORANGE }
  });
  s.addText("NEW MODEL", {
    x: 6.0, y: 4.7, w: 4.1, h: 0.3,
    fontFace: "Calibri", fontSize: 10, bold: true, charSpacing: 3,
    color: WHITE, align: "left", margin: 0
  });
  s.addText("✓", { x: 9.2, y: 4.65, w: 0.9, h: 0.36, fontFace: "Calibri", fontSize: 16, bold: true, color: WHITE, align: "right", margin: 0 });
  [
    "Which cell clones\nhave taken over?",
    "Keep the stem cell\nenvironment fair",
    "Trigger mitophagy,\nfight inflammation",
  ].forEach((t, i) => {
    s.addText(t, {
      x: 6.0, y: 5.25 + i * 1.2, w: 4.1, h: 1.0,
      fontFace: "Calibri", fontSize: 15, bold: true,
      color: WHITE, align: "left", margin: 0, lineSpacingMultiple: 1.3
    });
  });

  branding(s, true);
}


// ══════════════════════════════════════════════════════════════════════════
// SLIDE 8 — WHAT TO DO (light)
// ══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: CREAM };

  tag(s, "YOUR UPDATED LONGEVITY STRATEGY", 0.5, 0.5, ORANGE);

  s.addText("4 things worth\ndoing differently.", {
    x: 0.5, y: 0.95, w: 9.8, h: 2.2,
    fontFace: "Calibri", fontSize: 56, bold: true,
    color: NAVY, align: "left", valign: "top",
    lineSpacingMultiple: 1.05, margin: 0
  });

  const items = [
    { n: "1", t: "Stop mega-dosing antioxidants", sub: "The mechanism to stop mtDNA typos isn't there." },
    { n: "2", t: "Trigger mitophagy", sub: "HIIT, prolonged fasting, Urolithin A clear broken mitochondria." },
    { n: "3", t: "Protect your stem cell environment", sub: "Low-glycemic diet, omega-3s, deep sleep reduce inflammation." },
    { n: "4", t: "Track what actually matters", sub: "Biomarkers that reflect metabolic + immune health, not guesswork." },
  ];

  const iy = [3.45, 5.05, 6.65, 8.2];
  items.forEach((it, i) => {
    // Number
    s.addText(it.n, {
      x: 0.5, y: iy[i], w: 0.55, h: 0.88,
      fontFace: "Calibri", fontSize: 30, bold: true,
      color: ORANGE, align: "left", valign: "middle", margin: 0
    });
    // Title
    s.addText(it.t, {
      x: 1.2, y: iy[i], w: 9.1, h: 0.42,
      fontFace: "Calibri", fontSize: 18, bold: true,
      color: NAVY, align: "left", margin: 0
    });
    // Sub
    s.addText(it.sub, {
      x: 1.2, y: iy[i] + 0.44, w: 9.1, h: 0.4,
      fontFace: "Calibri", fontSize: 14,
      color: GREY, align: "left", margin: 0
    });
    // Divider
    if (i < 3) {
      s.addShape(pres.shapes.LINE, {
        x: 0.5, y: iy[i] + 1.1, w: 9.8, h: 0,
        line: { color: SAND, width: 1 }
      });
    }
  });

  branding(s, false);
}


// ══════════════════════════════════════════════════════════════════════════
// SLIDE 9 — BIG PICTURE QUOTE (dark)
// ══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: NAVY };

  // Left orange bar
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 0, w: 0.22, h: 10.8,
    fill: { color: ORANGE }, line: { color: ORANGE }
  });

  tag(s, "TAKEAWAY", 0.55, 0.52, ORANGE2);

  s.addText('"', {
    x: 0.5, y: 1.2, w: 1.5, h: 1.6,
    fontFace: "Calibri", fontSize: 120, bold: true,
    color: ORANGE, align: "left", margin: 0
  });

  s.addText("The future of longevity\nisn't about protecting\nyour cells from everyday\nlife. It's about keeping\nyour internal cellular\necosystem fit, competitive,\nand clean.", {
    x: 0.55, y: 2.4, w: 9.75, h: 6.5,
    fontFace: "Calibri", fontSize: 38, bold: true,
    color: WHITE, align: "left", valign: "top",
    lineSpacingMultiple: 1.12, margin: 0
  });

  s.addText("— Antiaging Labs Field Notes", {
    x: 0.55, y: 9.1, w: 9.8, h: 0.36,
    fontFace: "Calibri", fontSize: 14, italic: true,
    color: ORANGE2, align: "left", margin: 0
  });

  s.addText("Source: Gupta et al., Nature (2026)  ·  link in bio", {
    x: 0.55, y: 9.52, w: 9.8, h: 0.3,
    fontFace: "Calibri", fontSize: 11,
    color: CREAM, align: "left", margin: 0, transparency: 40
  });

  branding(s, true);
}


// ══════════════════════════════════════════════════════════════════════════
// SLIDE 10 — CTA (light + orange block)
// ══════════════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: CREAM };

  tag(s, "READ THE FULL BREAKDOWN", 0.5, 0.5, ORANGE);

  s.addText("Want the full\nbreakdown?", {
    x: 0.5, y: 1.0, w: 9.8, h: 2.8,
    fontFace: "Calibri", fontSize: 64, bold: true,
    color: NAVY, align: "left", valign: "top",
    lineSpacingMultiple: 1.05, margin: 0
  });

  s.addText("We decoded the full study — methodology, what it means for your protocol, and the 3 biomarkers worth tracking now.", {
    x: 0.5, y: 4.05, w: 9.5, h: 1.5,
    fontFace: "Calibri", fontSize: 19,
    color: GREY, align: "left", lineSpacingMultiple: 1.45, margin: 0
  });

  // Divider
  s.addShape(pres.shapes.LINE, {
    x: 0.5, y: 5.9, w: 9.8, h: 0,
    line: { color: SAND, width: 1.5 }
  });

  // Orange CTA block
  s.addShape(pres.shapes.RECTANGLE, {
    x: 0, y: 6.3, w: 10.8, h: 4.5,
    fill: { color: ORANGE }, line: { color: ORANGE }
  });

  s.addText("antiaging-labs.com/learn", {
    x: 0.55, y: 6.75, w: 9.8, h: 0.9,
    fontFace: "Calibri", fontSize: 36, bold: true,
    color: WHITE, align: "left", margin: 0
  });

  s.addText("Subscribe for weekly longevity research,\ndecoded without the hype.", {
    x: 0.55, y: 7.85, w: 9.5, h: 1.2,
    fontFace: "Calibri", fontSize: 22,
    color: WHITE, align: "left", lineSpacingMultiple: 1.35, margin: 0
  });

  s.addText("Free  ·  No spam  ·  Unsubscribe anytime", {
    x: 0.55, y: 9.3, w: 9.8, h: 0.38,
    fontFace: "Calibri", fontSize: 13,
    color: WHITE, align: "left", margin: 0, transparency: 30
  });

  // Branding on orange
  s.addText("ANTIAGING LABS", {
    x: 0.55, y: 10.3, w: 4, h: 0.28,
    fontFace: "Calibri", fontSize: 9, bold: true,
    color: WHITE, charSpacing: 3,
    align: "left", margin: 0, transparency: 40
  });
  s.addText("Field Notes", {
    x: 6.35, y: 10.3, w: 4, h: 0.28,
    fontFace: "Calibri", fontSize: 9, italic: true,
    color: WHITE,
    align: "right", margin: 0, transparency: 40
  });
}


// ── WRITE FILE ─────────────────────────────────────────────────────────────
pres.writeFile({ fileName: OUT }).then(() => {
  console.log("✅  Saved:", OUT);
}).catch(err => {
  console.error("❌  Error:", err);
  process.exit(1);
});
