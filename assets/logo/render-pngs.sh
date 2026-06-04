#!/usr/bin/env bash
# Render every Tessera logo SVG to PNG at standard sizes.
# Uses headless Chrome (already installed at /Applications/Google Chrome.app).
# Re-run any time the SVGs change.

set -euo pipefail
cd "$(dirname "$0")"

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
[ -x "$CHROME" ] || { echo "Chrome not found at $CHROME"; exit 1; }

# Render one SVG to PNG at a given pixel size (square unless WxH given).
# args: svg-file out.png width [height]
render() {
  local svg="$1" out="$2" w="$3" h="${4:-$3}"
  local tmp="/tmp/tessera-render-$$.html"
  # Inline the SVG into a wrapper HTML at exact pixel size; transparent background.
  cat > "$tmp" <<EOF
<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;background:transparent;}
  body{width:${w}px;height:${h}px;}
  svg{display:block;width:100%;height:100%;}
</style></head><body>$(cat "$svg")</body></html>
EOF
  "$CHROME" \
    --headless=new \
    --disable-gpu \
    --hide-scrollbars \
    --default-background-color=00000000 \
    --window-size="${w},${h}" \
    --screenshot="$PWD/$out" \
    "file://$tmp" >/dev/null 2>&1
  rm -f "$tmp"
  printf "  ✓ %s (%sx%s)\n" "$out" "$w" "$h"
}

# Render one SVG to PNG with a SOLID background (for og card etc.)
render_solid() {
  local svg="$1" out="$2" w="$3" h="$4" bg="$5"
  local tmp="/tmp/tessera-render-$$.html"
  cat > "$tmp" <<EOF
<!DOCTYPE html><html><head><meta charset="utf-8"><style>
  html,body{margin:0;padding:0;background:${bg};}
  body{width:${w}px;height:${h}px;}
  svg{display:block;width:100%;height:100%;}
</style></head><body>$(cat "$svg")</body></html>
EOF
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars \
    --window-size="${w},${h}" --screenshot="$PWD/$out" "file://$tmp" >/dev/null 2>&1
  rm -f "$tmp"
  printf "  ✓ %s (%sx%s, %s bg)\n" "$out" "$w" "$h" "$bg"
}

mkdir -p png

echo "→ Square mark"
render tessera-mark.svg          png/tessera-mark-64.png       64
render tessera-mark.svg          png/tessera-mark-128.png     128
render tessera-mark.svg          png/tessera-mark-256.png     256
render tessera-mark.svg          png/tessera-mark-512.png     512
render tessera-mark.svg          png/tessera-mark-1024.png   1024

echo "→ Inverse mark (for dark bgs)"
render tessera-mark-inverse.svg  png/tessera-mark-inverse-256.png  256
render tessera-mark-inverse.svg  png/tessera-mark-inverse-512.png  512

echo "→ Horizontal lockup (320x80 viewBox @ 4:1)"
render tessera-lockup.svg          png/tessera-lockup-640x160.png    640 160
render tessera-lockup.svg          png/tessera-lockup-1280x320.png  1280 320
render tessera-lockup-inverse.svg  png/tessera-lockup-inverse-1280x320.png 1280 320

echo "→ Stacked lockup (240x240 viewBox)"
render tessera-lockup-stacked.svg  png/tessera-lockup-stacked-512.png   512
render tessera-lockup-stacked.svg  png/tessera-lockup-stacked-1024.png 1024

echo "→ Favicon variants"
render favicon.svg  png/favicon-32.png   32
render favicon.svg  png/favicon-48.png   48
render favicon.svg  png/favicon-180.png 180   # apple-touch-icon

echo "→ Open Graph / social card"
render_solid tessera-og.svg  png/tessera-og-1200x630.png  1200 630  "#F5F1E8"

echo "Done."
