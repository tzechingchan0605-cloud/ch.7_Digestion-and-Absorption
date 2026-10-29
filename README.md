# 消化與吸收實驗室 · Digestion & absorption lab

A self-contained Traditional Chinese / UK English educational simulation for Hong Kong senior secondary Biology, based on the supplied Chapter 7 digestion and absorption specification. No account, framework, package install, paid API or runtime third-party requests. All diagrams are original.

## Run

From this checkout:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Open the local server in a browser during development. Any static hosting service can serve `index.html`, `style.css`, `terms.js`, `model.js` and `app.js` unchanged, including GitHub Pages if enabled by the repository owner. Publishing the Git repository does not itself enable Pages.

## Use

- Explore the canal and select a region for a molecular close-up. Physical digestion and enzyme switches support matched comparisons. Changing region starts a separate local demonstration, not a numerical whole-body digestion model.
- Predict initial rates in four lipid vessels, play or single-step, then save a comparison. Saved records snapshot predictions, conditions, time, results and the full time series. Download CSV exports those snapshots in the selected language; reset/replay preserves records. Records are in-memory for the current session; download before closing the page.
- Rotate the actual 3D villus geometry with the slider or buttons, switch cutaway and surface structure, and trace a selected substance. Large molecules are blocked; blood and lymph routes remain distinct.
- Guided mode provides six prediction/observation/explanation tasks with optional staged hints and explicit reference-answer reveal. It does not grade free text.
- Language switching retains time, running state, recordings, predictions, selected substance/site, angle and responses. Language preference is saved locally. Reset restarts the active model with its current settings; replay also starts playback. Playback rate is a viewing control only. Reduced-motion users start paused and can single-step. No drag-only actions exist.

## Files and model assumptions

`terms.js` is the bilingual dictionary with stable content IDs and the exact supplied glossary. `model.js` contains deterministic, independently testable models. `app.js` renders original SVG diagrams, a Canvas-projected 3D surface of revolution, model-driven particles and graphs.

The vessel model uses `L(t) = 100 exp(-0.045 A t)` with lipase, and `L(t) = 100` without it. Relative area A is 1 without bile salts and 4 with them at equal lipid volume (radius 1 versus 0.25). Product is `100 - L`, in **hydrolysed-lipid equivalent units**, not a measured mass or molecule count. Actual droplet radii shrink as remaining volume decreases; displayed relative area compares equal amounts of lipid. The effective first-order rate coefficient assumes constant emulsification benefit; it is not a detailed changing-surface kinetic law. Droplet breakup is represented as an initial condition on adding bile salts. Animation droplets are schematic samples, not a count used to calculate total volume.

All vessel pH and temperature conditions are equal and suitable for lipase; no numerical physiological values are invented. Both lipase conditions asymptotically approach the same maximum yield. The graph and droplet/product animation use the same state. Coloured lines also use symbols and dash patterns.

For the illustrative starch sequence, with `a = exp(-0.12 t)`, starch = `100a`, maltose = `100(a-a²)`, glucose = `100(1-a)²`. Thus the pool is conserved and there is no direct salivary glucose production. Other enzyme reactions use a simple finite exponential substrate pool. Each food pool has its own initial 100%; pools cannot be summed as physical masses. Chewing/mixing changes piece size separately from molecule identity. Acid is a condition for pepsin, never an enzyme. No active gastric salivary-amylase pathway is shown. Oesophageal peristalsis transports food without breaking it into smaller pieces.

The villus is a qualitative model, not a patient measurement. Nutrient routes and school-level lipid recombination are specified in both languages; no micelles, chylomicrons, named transporters, activation cascades or advanced lipid biochemistry are included. Suitable vitamins/minerals are grouped only to show they do not require prior enzyme digestion; individual routes are not modelled. Transport labels are conditional rather than attributing one universal mechanism to every substance. Assimilation is described separately from absorption.

## Source limitations

Only the user's textual specification was supplied, **not** `te_07_c(1).pdf` / `te_07_c.pdf`. Printed pages 7-11–7-28, particularly 7-20, 7-22, 7-24–7-26, cannot be verified. Exact alignment with the current EDB compulsory curriculum and applicable supplementary document has not been independently checked against those primary documents. A teacher should review the tool against these missing sources before classroom use. No textbook artwork was reproduced. Rates and geometry are educational assumptions, not measured human or experimental data.

## Validation

```sh
node --test tests/model.test.cjs
# With Playwright and Chromium available; server must already be running:
node tests/browser.cjs
```

The browser test uses `/usr/bin/chromium` by default; set `CHROMIUM_PATH` for another installation. Playwright is a test-only tool, not an app dependency. See [ACCEPTANCE.md](ACCEPTANCE.md) for executed checks and limitations.

## Offline edition / 離線版

Download `digestion-offline.zip` from this repository's Releases, extract **all files into one folder**, then open `index.html` directly in a modern browser. Internet access and installation are not required. The language preference uses local storage where the browser permits it; the app still works if storage is unavailable. CSV exports remain local to your device. / 下載 Releases 內的 ZIP，將全部檔案解壓至同一資料夾，直接開啟 `index.html`，即可離線操作。

`.github/workflows/offline-release.yml` runs the model tests and publishes a new ZIP release automatically on each push to `main` (or manual workflow dispatch). This requires GitHub Actions to be enabled and the workflow to have permission to create releases; an organisation policy may restrict this. No web-hosting setup is required for the offline edition.

For a single-file offline edition, download `digestion-offline.html` from Releases and open it directly. To reproduce both offline artifacts locally run `python3 tools/package.py`; outputs go into ignored `dist/`. The standalone HTML embeds all styles, translations and model code. / 單一檔案版：下載 `digestion-offline.html` 後直接開啟。
