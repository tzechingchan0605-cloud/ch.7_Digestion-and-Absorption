"""Build a dependency-free standalone HTML and ZIP; no source mutations."""
from pathlib import Path
import zipfile
root = Path(__file__).resolve().parent.parent
out = root / 'dist'
out.mkdir(exist_ok=True)
html = (root / 'index.html').read_text()
html = html.replace('<link rel="stylesheet" href="style.css">', '<style>' + (root / 'style.css').read_text() + '</style>')
for name in ('terms.js', 'model.js', 'app.js'):
    html = html.replace(f'<script src="{name}"></script>', '<script>' + (root / name).read_text() + '</script>')
(out / 'digestion-offline.html').write_text(html)
with zipfile.ZipFile(out / 'digestion-offline.zip', 'w', zipfile.ZIP_DEFLATED) as z:
    for name in ('index.html', 'style.css', 'terms.js', 'model.js', 'app.js', 'README.md', 'ACCEPTANCE.md'):
        z.write(root / name, name)
    z.write(out / 'digestion-offline.html', 'digestion-offline.html')
print('Built dist/digestion-offline.html and dist/digestion-offline.zip')
