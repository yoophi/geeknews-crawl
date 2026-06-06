#!/usr/bin/env bash
# Run N parallel `pnpm crawl ids` workers in a tmux grid.
#
# Usage:
#   scripts/crawl-parallel.sh                 # workers=8, lo=1, hi=auto (max vault id)
#   scripts/crawl-parallel.sh 4               # workers=4
#   scripts/crawl-parallel.sh 8 1 29798       # workers, lo, hi
#   WORKERS=8 LO=1 HI=29798 scripts/crawl-parallel.sh
#
# Env:
#   SESSION=crawl                # tmux session name
#   INTERVAL_MS=2000             # per-worker throttle (2s × 8 ≈ 4 req/sec total)
#   EXTRA="--refresh"            # extra flags forwarded to `pnpm crawl ids`
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

WORKERS="${1:-${WORKERS:-8}}"
LO="${2:-${LO:-1}}"
HI="${3:-${HI:-}}"
SESSION="${SESSION:-crawl}"
INTERVAL_MS="${INTERVAL_MS:-2000}"
EXTRA="${EXTRA:-}"

if [[ -z "$HI" ]]; then
  HI=$(find vault/topics -name '*.md' 2>/dev/null | sed 's|.*/||;s|-.*||' | sort -n | tail -1)
  HI="${HI:-1}"
fi

RANGE=$(( HI - LO + 1 ))
CHUNK=$(( (RANGE + WORKERS - 1) / WORKERS ))
echo "workers=$WORKERS  range=$LO..$HI ($RANGE ids)  chunk=$CHUNK  interval=${INTERVAL_MS}ms"

if tmux has-session -t "$SESSION" 2>/dev/null; then
  echo "session '$SESSION' already exists — kill it first: tmux kill-session -t $SESSION" >&2
  exit 1
fi

tmux new-session -d -s "$SESSION" -n crawl -c "$ROOT"

for i in $(seq 0 $((WORKERS - 1))); do
  WLO=$(( LO + i * CHUNK ))
  WHI=$(( WLO + CHUNK - 1 ))
  if (( WHI > HI )); then WHI=$HI; fi
  if (( WLO > HI )); then break; fi

  CMD="REQUEST_INTERVAL_MS=$INTERVAL_MS pnpm crawl ids ${WLO}-${WHI} ${EXTRA}"
  if (( i > 0 )); then
    tmux split-window -t "$SESSION:0" -c "$ROOT"
  fi
  tmux send-keys -t "$SESSION:0" "$CMD" C-m
  tmux select-layout -t "$SESSION:0" tiled >/dev/null
done

echo
echo "attach with:  tmux attach -t $SESSION"
echo "kill with  :  tmux kill-session -t $SESSION"
