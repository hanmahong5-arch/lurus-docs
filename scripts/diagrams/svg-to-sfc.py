#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
把各产品仓 README 用的静态架构 SVG 转成文档站的主题跟随版 Vue 组件。

为什么要转而不是重画：README 版的每条边都在上一轮被独立核查过（逐边回代码
求证，推翻了 6 个仓的画法）。重画等于把已经付过的核查成本再付一遍，还会让
README 和文档站讲两个版本的故事。这里做的是**纯机械的语义换肤**：
把写死的 hex 换成 diagrams.css 里的 `--lurus-dg-*`，图形与文字一个字不动。

  README 版：写死浅色 + 写死深色两份 + 系统字体回退栈（GitHub 不加载外链字体）
  站内版  ：一份，颜色接 CSS 变量，字体接站点变量 —— 明暗自动跟随

用法:
  python svg-to-sfc.py <source-svg> <out.vue> <id-prefix>

校验（转换失败必须报错退出，不能静默产出半成品）：
  - 输出里不得残留任何 6 位 hex 或 rgba(...)：残留=有颜色没被换肤，暗色下会瞎
  - 输出里不得残留写死的 font-family 栈
  - 每个 id 都必须被前缀化，且 url(#...) 引用同步改名
"""
import re
import sys
import os

# 语义角色映射 —— 键是 diagram-design 的 Lurus skin 明色值，值是文档站变量。
# 大小写不敏感匹配，但输出统一小写变量名。
HEX_MAP = {
    '#f5f2e8': 'var(--lurus-dg-paper)',       # paper
    '#e8e4d6': 'var(--lurus-dg-paper-2)',     # paper-2
    '#14130f': 'var(--lurus-dg-ink)',         # ink
    '#3d3b33': 'var(--lurus-dg-muted)',       # muted
    '#6b6860': 'var(--lurus-dg-soft)',        # soft
    '#d6d2c2': 'var(--lurus-dg-rule-solid)',  # rule-solid
    '#ff5d1f': 'var(--lurus-dg-accent)',      # accent
    '#2d4a8a': 'var(--lurus-dg-link)',        # link
    '#ffffff': 'var(--lurus-dg-node)',        # backend 节点填充
    '#fff':    'var(--lurus-dg-node)',
}

# rgba(R,G,B,A) 的 RGB 前缀 → 对应变量。alpha 用 color-mix 保留，
# 这样暗色下 ink 一翻，所有半透明派生色跟着翻，不用手写第二套。
RGBA_MAP = {
    (20, 19, 15):   'var(--lurus-dg-ink)',
    (255, 93, 31):  'var(--lurus-dg-accent)',
    (45, 74, 138):  'var(--lurus-dg-link)',
    (61, 59, 51):   'var(--lurus-dg-muted)',
    (107, 104, 96): 'var(--lurus-dg-soft)',
}

# 按**首选字族**匹配，而不是整条栈 —— 各仓的图是不同轮次生成的，
# 回退栈写法不完全一致（有的带 PingFang SC，有的不带），只认第一个族名。
FONT_MAP = [
    ("'Inter Tight'",    'var(--vp-font-family-base)'),
    ("'JetBrains Mono'", 'var(--vp-font-family-mono)'),
    ("'Fraunces'",       'var(--lurus-dg-serif)'),
    ("'Georgia'",        'var(--lurus-dg-serif)'),   # switch 那张图的标题栈以 Georgia 起头
]


def convert(svg: str, prefix: str) -> str:
    # -1) 砍掉 <svg 之前的一切。有的源图带 `<?xml ... ?>` 声明，
    #     Vue 模板编译器会直接报 "'<?' is allowed only in XML context"。
    i = svg.find('<svg')
    if i < 0:
        raise SystemExit('源文件里找不到 <svg 起始标签')
    svg = svg[i:]

    # 0) 数字实体转字面量。`&#183;`(·) 会被下面的 hex 正则误当成颜色 #183，
    #    而且 UTF-8 源文件里本来就没必要留实体。
    svg = re.sub(r'&#(\d+);', lambda m: chr(int(m.group(1))), svg)

    # 1) hex → var()。只在属性值位置替换（fill="#xxx" / stroke="#xxx" / stop-color=...），
    #    不做全文替换，避免误伤正文里的井号。
    def hex_sub(m):
        v = m.group(1).lower()
        if v not in HEX_MAP:
            raise SystemExit('未登记的 hex 颜色 %s —— 先决定它属于哪个语义角色，'
                             '不要让它带着写死的值进站内版' % m.group(1))
        return '="%s"' % HEX_MAP[v]

    svg = re.sub(r'="(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3})"', hex_sub, svg)

    # 2) rgba() → color-mix()，alpha 转成百分比
    def rgba_sub(m):
        r, g, b = int(m.group(1)), int(m.group(2)), int(m.group(3))
        a = float(m.group(4))
        key = (r, g, b)
        if key not in RGBA_MAP:
            raise SystemExit('未登记的 rgba 基色 rgb(%d,%d,%d)' % key)
        pct = a * 100
        pct_s = ('%g' % pct)
        return 'color-mix(in srgb, %s %s%%, transparent)' % (RGBA_MAP[key], pct_s)

    svg = re.sub(r'rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([0-9.]+)\s*\)',
                 rgba_sub, svg)

    # 3) 字体栈 → 站点变量
    def font_sub(m):
        stack = m.group(1)
        for first, var in FONT_MAP:
            if stack.startswith(first):
                return 'font-family="%s"' % var
        raise SystemExit('未登记的字体栈首选族: %s' % stack)

    svg = re.sub(r'font-family="([^"]*)"', font_sub, svg)

    # 4) id 前缀化 —— 同一页可能出现两张图，marker id 撞车会让其中一张的箭头消失
    ids = set(re.findall(r'\bid="([^"]+)"', svg))
    for i in sorted(ids, key=len, reverse=True):
        if i.startswith(prefix + '-'):
            continue
        new = '%s-%s' % (prefix, i)
        svg = svg.replace('id="%s"' % i, 'id="%s"' % new)
        svg = svg.replace('url(#%s)' % i, 'url(#%s)' % new)
        svg = re.sub(r'(aria-labelledby="[^"]*)\b%s\b' % re.escape(i),
                     lambda m: m.group(1) + new, svg)
    return svg


def check(svg: str, prefix: str) -> None:
    # 先摘掉 url(#id) 里的 #，否则形如 #abc-def 的 id 会被当成颜色误报
    leftover_hex = re.findall(r'="(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3})"', svg)
    if leftover_hex:
        raise SystemExit('仍有写死颜色: %s' % sorted(set(leftover_hex)))
    if 'rgba(' in svg:
        raise SystemExit('仍有 rgba()')
    if re.search(r"font-family=\"'", svg):
        raise SystemExit('仍有写死字体栈')
    for i in re.findall(r'\bid="([^"]+)"', svg):
        if not i.startswith(prefix + '-'):
            raise SystemExit('id 未前缀化: %s' % i)


def main():
    if len(sys.argv) != 4:
        raise SystemExit(__doc__)
    src, out, prefix = sys.argv[1], sys.argv[2], sys.argv[3]
    with open(src, 'r', encoding='utf-8') as f:
        svg = f.read().strip()
    svg = convert(svg, prefix)
    check(svg, prefix)

    body = '\n'.join('  ' + ln if ln.strip() else '' for ln in svg.split('\n'))
    rel = os.path.basename(src)
    sfc = (
        '<!--\n'
        '  自动生成，请勿手改 —— 改图请改产品仓的 docs/diagrams/%s，\n'
        '  再跑 `bun run diagrams` 重新生成。手改这里会在下次生成时被覆盖。\n'
        '\n'
        '  颜色/字体已换成 theme/diagrams.css 的 --lurus-dg-* 与站点字体变量，\n'
        '  所以这一份 SVG 明暗两色都能用；图形与文案与 README 版逐字一致。\n'
        '-->\n'
        '<template>\n%s\n</template>\n'
    ) % (rel, body)

    os.makedirs(os.path.dirname(out), exist_ok=True)
    with open(out, 'w', encoding='utf-8', newline='\n') as f:
        f.write(sfc)
    print('OK %s -> %s (%d bytes)' % (src, out, len(sfc)))


if __name__ == '__main__':
    main()
