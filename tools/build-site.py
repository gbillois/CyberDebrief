#!/usr/bin/env python3
"""Stage only public presentation files for Cloudflare Pages."""
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parent.parent
DEST = ROOT / 'dist'
if DEST.exists():
    shutil.rmtree(DEST)
DEST.mkdir()
for page in ROOT.glob('*.html'):
    if page.name != 'testr.html':
        shutil.copy2(page, DEST / page.name)
for directory in ('assets', 'design-system'):
    shutil.copytree(ROOT / directory, DEST / directory,
                    ignore=shutil.ignore_patterns('.DS_Store', '*.md', '*.py'))
for name in ('_redirects', '_headers', '404.html'):
    if (ROOT / name).exists():
        shutil.copy2(ROOT / name, DEST / name)
print(f'Staged {sum(p.is_file() for p in DEST.rglob("*"))} public files in dist/')
