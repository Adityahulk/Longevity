#!/usr/bin/env bash
# render-pdf.sh — Render a Tessera report HTML to a print-ready PDF
# Usage:  ./render-pdf.sh path/to/report.html [path/to/report.pdf]
#
# Strategy:
#   1. Try Google Chrome / Chromium / Brave / Edge headless (best fidelity, prints CSS @page rules)
#   2. Fall back to `chromium-headless-shell` if installed via npx
#   3. Last-resort fallback: print clear instructions for the user

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 path/to/report.html [path/to/report.pdf]"
  exit 1
fi

INPUT="$1"
if [ ! -f "$INPUT" ]; then
  echo "Error: input file not found: $INPUT"
  exit 1
fi

# Resolve absolute path (macOS + Linux compatible)
case "$INPUT" in
  /*) ABS_INPUT="$INPUT" ;;
  *)  ABS_INPUT="$(cd "$(dirname "$INPUT")" && pwd)/$(basename "$INPUT")" ;;
esac

OUTPUT="${2:-${ABS_INPUT%.html}.pdf}"
case "$OUTPUT" in
  /*) ABS_OUTPUT="$OUTPUT" ;;
  *)  ABS_OUTPUT="$(cd "$(dirname "$OUTPUT")" 2>/dev/null && pwd || pwd)/$(basename "$OUTPUT")" ;;
esac

URL="file://$ABS_INPUT"

# Find a Chrome-family binary
CHROME=""
CANDIDATES=(
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary"
  "/Applications/Chromium.app/Contents/MacOS/Chromium"
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser"
  "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
  "/Applications/Arc.app/Contents/MacOS/Arc"
  "google-chrome"
  "chromium"
  "chromium-browser"
  "brave-browser"
  "microsoft-edge"
)

for c in "${CANDIDATES[@]}"; do
  if [ -x "$c" ]; then
    CHROME="$c"; break
  fi
  if command -v "$c" >/dev/null 2>&1; then
    CHROME="$(command -v "$c")"; break
  fi
done

if [ -z "$CHROME" ]; then
  cat <<EOF
No Chrome/Chromium binary found. Two options:

1) Install Google Chrome (easiest):
     https://www.google.com/chrome/

2) Print to PDF manually:
     - Open this URL in any modern browser:  $URL
     - File > Print > Save as PDF
     - Recommended settings: A4, margins "Default", Background graphics ON
EOF
  exit 2
fi

echo "Rendering with: $CHROME"
echo "Input:  $ABS_INPUT"
echo "Output: $ABS_OUTPUT"

# Headless print. --no-pdf-header-footer hides the URL/page-number chrome strips
# --virtual-time-budget waits for fonts/network to settle before printing
"$CHROME" \
  --headless=new \
  --disable-gpu \
  --no-sandbox \
  --hide-scrollbars \
  --no-pdf-header-footer \
  --print-to-pdf-no-header \
  --virtual-time-budget=10000 \
  --run-all-compositor-stages-before-draw \
  --print-to-pdf="$ABS_OUTPUT" \
  "$URL" 2>/dev/null || {
    # Some older Chrome builds don't accept --headless=new; retry with legacy headless
    echo "Retrying with legacy --headless flag..."
    "$CHROME" \
      --headless \
      --disable-gpu \
      --no-sandbox \
      --hide-scrollbars \
      --print-to-pdf-no-header \
      --virtual-time-budget=10000 \
      --print-to-pdf="$ABS_OUTPUT" \
      "$URL"
  }

if [ -f "$ABS_OUTPUT" ]; then
  SIZE=$(ls -lh "$ABS_OUTPUT" | awk '{print $5}')
  echo "✓ PDF rendered ($SIZE):  $ABS_OUTPUT"
else
  echo "✗ Render appears to have failed — no output file at $ABS_OUTPUT"
  exit 3
fi
