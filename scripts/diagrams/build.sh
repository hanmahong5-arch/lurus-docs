#!/usr/bin/env bash
# 按 manifest.tsv 重新生成全部站内架构图组件。
#
# 图的真源在**各产品仓**的 docs/diagrams/architecture.svg（README 用的就是它）。
# 这里只做换肤，不改图形，所以文档站和 GitHub 上永远是同一张图 —— 不会出现
# 「README 修好了但文档站还画着旧拓扑」这种双源漂移。
#
# 用法: bun run diagrams   (或 bash scripts/diagrams/build.sh)
set -uo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/../.." && pwd)"      # 2l-bs-docs
LURUS="$(cd "$ROOT/.." && pwd)"        # monorepo 根
OUT="$ROOT/docs/.vitepress/theme/components/diagrams"

ok=0; miss=0; fail=0
# 用 FD 3 读清单，给循环体内的命令留出干净的 stdin
while IFS=$'\t' read -r repo comp prefix page <&3; do
  [ -n "${repo:-}" ] || continue
  case "$repo" in \#*) continue;; esac

  src="$LURUS/$repo/docs/diagrams/architecture.svg"
  if [ ! -f "$src" ]; then
    echo "[缺图] $repo — $src 不存在"; miss=$((miss+1)); continue
  fi
  if PYTHONIOENCODING=utf-8 python "$HERE/svg-to-sfc.py" "$src" "$OUT/$comp.vue" "$prefix"; then
    ok=$((ok+1))
  else
    fail=$((fail+1))
  fi
done 3< "$HERE/manifest.tsv"

echo
echo "===== 生成 $ok · 缺源图 $miss · 失败 $fail ====="
[ "$fail" -eq 0 ] || exit 1
