# Tessera logo assets

The mark is a concentric pair: a dark ring around a burnt-orange disc. The wordmark is "Tessera" in **Fraunces**, weight 500, letter-spacing −0.02em. Colors: ink `#0E1B2C`, accent `#B85426`, cream `#F5F1E8`.

## What's in here

### SVG (source of truth — use these whenever possible)

| File | Use |
|---|---|
| `tessera-mark.svg` | Square mark only, light backgrounds |
| `tessera-mark-inverse.svg` | Square mark only, dark backgrounds (cream ring, orange disc) |
| `tessera-lockup.svg` | Horizontal lockup (mark + "Tessera") for headers, footers, signatures |
| `tessera-lockup-inverse.svg` | Horizontal lockup on dark backgrounds |
| `tessera-lockup-stacked.svg` | Stacked lockup (mark above wordmark) for square contexts (avatar, business card) |
| `favicon.svg` | Slightly thickened mark, optimised for 16/32px favicons |
| `tessera-og.svg` | 1200×630 open-graph / social-share card (cream bg, mark + wordmark + tagline) |

### PNG (rendered from the SVGs above — for places SVG isn't accepted)

Under `png/`:

| File | Where to use it |
|---|---|
| `tessera-mark-{64,128,256,512,1024}.png` | App icons, sticker exports, slides, anywhere a square icon is needed |
| `tessera-mark-inverse-{256,512}.png` | Same, on dark backgrounds |
| `tessera-lockup-{640x160,1280x320}.png` | Email signatures, slide titles, header images for blog posts published elsewhere |
| `tessera-lockup-inverse-1280x320.png` | Same, for dark slides / dark email signatures |
| `tessera-lockup-stacked-{512,1024}.png` | Square avatars, profile pics, business cards |
| `favicon-32.png` | Browser favicon fallback (PNG) |
| `favicon-48.png` | Windows tile / general PNG favicon |
| `favicon-180.png` | iOS apple-touch-icon (180×180) |
| `tessera-og-1200x630.png` | OG image / Twitter card preview — already wired in `index.html` |

## Re-rendering PNGs

Whenever you change an SVG, regenerate every PNG with:

```bash
bash assets/logo/render-pngs.sh
```

Requires Chrome (uses `/Applications/Google Chrome.app` headless). No other dependencies.

## How they're wired into the site

`<head>` of `index.html`:

```html
<link rel="icon" type="image/svg+xml" href="/assets/logo/favicon.svg">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/logo/png/favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/assets/logo/png/favicon-180.png">

<meta property="og:image" content="https://tessera.kalman-labs.com/assets/logo/png/tessera-og-1200x630.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
```

Every other main page (`/engine`, `/learn`, `/research`, `/tessera-rulebook`, etc.) carries the favicon block only. The OG card lives on the homepage.

## Geometry / reproducibility notes

The mark is built on a 64-unit viewBox. The ring + disc proportions match the live CSS logo on the site exactly:

- Outer ring: `cx=32, cy=32, r=27.6, stroke-width=4.36`
- Inner disc:  `cx=32, cy=32, r=17.45`

Ratios mirror the original CSS (`1.5px stroke / 22px box`, `5px inset → 12px inner circle`). If you ever change the brand mark, change the SVGs first and re-render PNGs from them.

## What's NOT here (yet)

- `.ico` favicon — modern browsers all accept SVG / PNG favicons. Add a multi-resolution `.ico` only if you need legacy IE support.
- Animated GIF / WebP — not required for current use.
- Print-only Pantone spec — defer until the first physical print job.
