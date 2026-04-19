#!/bin/bash
# audit.sh — Fetch raw signal for an LLM crawl audit target.
# Usage: ./audit.sh https://briantighe.design/essays/2026/prototype-led-positioning
# Outputs JSON-ish summary to stdout; raw responses saved to /tmp/llm-audit-cache-<timestamp>/

set -u

URL="${1:-}"
if [ -z "$URL" ]; then
  echo '{"error": "Usage: audit.sh <url>"}'
  exit 1
fi

ORIGIN=$(echo "$URL" | awk -F/ '{print $1"//"$3}')
TS=$(date +%Y%m%d-%H%M%S)
CACHE="/tmp/llm-audit-cache-$TS"
mkdir -p "$CACHE"

fetch_one() {
  local url="$1"
  local slug="$2"
  local status
  local bytes
  local ttfb
  status=$(/usr/bin/curl -s -o "$CACHE/$slug.body" -w "%{http_code}" "$url")
  bytes=$(wc -c < "$CACHE/$slug.body" | tr -d ' ')
  ttfb=$(/usr/bin/curl -s -o /dev/null -w "%{time_starttransfer}" "$url")
  /usr/bin/curl -sI "$url" > "$CACHE/$slug.headers"
  printf '{"url": "%s", "status": %s, "bytes": %s, "ttfb_sec": %s, "headers_file": "%s", "body_file": "%s"}' \
    "$url" "$status" "$bytes" "$ttfb" "$CACHE/$slug.headers" "$CACHE/$slug.body"
}

echo "{"
echo '  "target": '"$(fetch_one "$URL" target)"','
echo '  "robots": '"$(fetch_one "$ORIGIN/robots.txt" robots)"','
echo '  "sitemap": '"$(fetch_one "$ORIGIN/sitemap.xml" sitemap)"','
echo '  "feed": '"$(fetch_one "$ORIGIN/feed.xml" feed)"','
echo '  "cache_dir": "'"$CACHE"'"'
echo "}"
