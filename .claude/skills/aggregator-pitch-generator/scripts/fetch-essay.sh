#!/bin/bash
# fetch-essay.sh — Retrieves essay content from briantighe.design for distribution generation
#
# Usage: ./fetch-essay.sh <essay-url>
# Example: ./fetch-essay.sh https://briantighe.design/essays/prototype-led-positioning
#
# Outputs to stdout:
#   - Essay title (from <h1> or <title>)
#   - Essay subtitle (from .subtitle class or meta description)
#   - Essay publication date (from <time datetime=""> or JSON-LD)
#   - Essay primary framework (from .framework-tag class)
#   - Full essay body text (plain text, no HTML)
#   - Detected epigraph (if present)
#   - Word count

set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "ERROR: No essay URL provided" >&2
  echo "Usage: ./fetch-essay.sh <essay-url>" >&2
  exit 1
fi

URL="$1"

if [[ ! "$URL" =~ ^https://briantighe\.design/essays/ ]]; then
  echo "ERROR: URL must be a briantighe.design essay URL" >&2
  echo "Provided: $URL" >&2
  exit 1
fi

HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL")
if [ "$HTTP_STATUS" != "200" ]; then
  echo "ERROR: Essay URL returned HTTP $HTTP_STATUS" >&2
  echo "URL: $URL" >&2
  exit 2
fi

HTML_CONTENT=$(curl -s -A "DistributionGenerator/1.0" "$URL")

echo "=== ESSAY METADATA ==="
echo "URL: $URL"
echo ""

TITLE=$(echo "$HTML_CONTENT" | grep -oE '<h1[^>]*>[^<]+</h1>' | head -1 | sed -e 's/<[^>]*>//g')
echo "Title: $TITLE"

SUBTITLE=$(echo "$HTML_CONTENT" | grep -oE '<p class="subtitle"[^>]*>[^<]+</p>' | head -1 | sed -e 's/<[^>]*>//g')
if [ -n "$SUBTITLE" ]; then
  echo "Subtitle: $SUBTITLE"
fi

PUB_DATE=$(echo "$HTML_CONTENT" | grep -oE '<time[^>]*datetime="[^"]+"' | head -1 | grep -oE 'datetime="[^"]+"' | sed 's/datetime="//' | sed 's/"//')
if [ -n "$PUB_DATE" ]; then
  echo "Published: $PUB_DATE"
fi

FRAMEWORK=$(echo "$HTML_CONTENT" | grep -oE '<span class="framework-tag"[^>]*>[^<]+</span>' | head -1 | sed -e 's/<[^>]*>//g')
if [ -n "$FRAMEWORK" ]; then
  echo "Primary framework: $FRAMEWORK"
fi

echo ""
echo "=== EPIGRAPH ==="
EPIGRAPH=$(echo "$HTML_CONTENT" | grep -oE '<blockquote class="epigraph"[^>]*>.*?</blockquote>' | head -1 | sed -e 's/<[^>]*>//g' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
if [ -n "$EPIGRAPH" ]; then
  echo "$EPIGRAPH"
else
  echo "(No epigraph detected)"
fi

echo ""
echo "=== ESSAY BODY ==="
BODY=$(echo "$HTML_CONTENT" | \
  sed -n '/<article/,/<\/article>/p' | \
  sed -e 's/<script[^>]*>.*<\/script>//g' \
      -e 's/<style[^>]*>.*<\/style>//g' \
      -e 's/<[^>]*>//g' | \
  tr -s '[:space:]' ' ' | \
  sed 's/^[[:space:]]*//;s/[[:space:]]*$//')

echo "$BODY"

echo ""
echo "=== STATISTICS ==="
WORD_COUNT=$(echo "$BODY" | wc -w | tr -d ' ')
echo "Word count: $WORD_COUNT"

exit 0
