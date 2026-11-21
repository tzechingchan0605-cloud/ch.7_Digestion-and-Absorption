"""Build a dependency-free standalone HTML and ZIP; no source mutations."""
from pathlib import Path
import zipfile
root = Path(__file__).resolve().parent.parent
out = root / 'dist'
out.mkdir(exist_ok=True)
scripts = ('terms.js', 'model.js', 'anatomy.js', 'activities.js', 'app.js')
html = (root / 'index.html').read_text(encoding='utf-8')
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>' + (root / 'style.css').read_text(encoding='utf-8') + '</style>')
for name in scripts:
    html = html.replace(f'<script src="{name}"></script>', '<script>' + (root / name).read_text(encoding='utf-8') + '</script>')
(out / 'digestion-offline.html').write_text(html, encoding='utf-8')
with zipfile.ZipFile(out / 'digestion-offline.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for name in ('index.html', 'style.css', *scripts, 'README.md', 'ACCEPTANCE.md'):
        z.write(root / name, name)
    z.write(out / 'digestion-offline.html', 'digestion-offline.html')
print('Built dist/digestion-offline.html and dist/digestion-offline.zip')
