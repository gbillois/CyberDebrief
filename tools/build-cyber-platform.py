#!/usr/bin/env python3
"""Build cyber-ai-platform-standalone.html: the Cyber AI Platform demo in one
file (styles, scripts and fonts inlined) to run offline, from a USB stick.

Edit the sources (cyber-ai-platform.html, assets/cyber-platform/), then run:
    python3 tools/build-cyber-platform.py
"""
from pathlib import Path
import base64
import re

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'cyber-ai-platform.html'
OUT = ROOT / 'cyber-ai-platform-standalone.html'


def inline_fonts(css: str, base: Path) -> str:
    def repl(m):
        font = base / m.group(1)
        data = base64.b64encode(font.read_bytes()).decode('ascii')
        return f"url(data:font/woff2;base64,{data})"
    return re.sub(r"url\(([^)]+\.woff2)\)", repl, css)


def main():
    html = SRC.read_text(encoding='utf-8')

    def css_link(m):
        href = m.group(1)
        path = ROOT / href
        css = path.read_text(encoding='utf-8')
        if 'fonts' in href:
            css = inline_fonts(css, path.parent)
        return f'<style>\n{css}\n</style>'
    html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', css_link, html)

    def script(m):
        js = (ROOT / m.group(1)).read_text(encoding='utf-8')
        return '<script>\n' + js.replace('</script', '<\\/script') + '\n</script>'
    html = re.sub(r'<script src="([^"]+)"></script>', script, html)
    html = html.replace('<a href="./">← CyberDebrief</a>', '<a href="https://debrief.cybersecwatcher.com/">← CyberDebrief</a>')
    OUT.write_text(html, encoding='utf-8')
    print(f'Wrote {OUT.name} ({OUT.stat().st_size // 1024} KB)')


if __name__ == '__main__':
    main()
