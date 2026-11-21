# 人的消化系統 · Human digestive system

An interactive, offline-capable learning tool for Hong Kong secondary Biology. The top-right button switches between UK English and Traditional Chinese without resetting the activity. Traditional Chinese terms follow Chapter 7 of the supplied Hong Kong textbook, 《人的營養》.

- **Explore** follows a meal from the mouth cavity to the anus. Select structures, switch between the original 2D anatomy and a rotatable schematic 3D model, and view organ notes, molecular reactions, absorption graphs and model readings.
- **Practicals** covers anatomy identification, food tests, amylase and pH, amylase and temperature, bile salts and lipase, dialysis tubing, and intestinal surface area.
- **Quiz** has topic-based practice with explanations and a scored five-question round.
- **Lab notebook** records observations during the session. Export CSV or use the browser's print dialog to save a PDF.

The diagrams and calculations are educational models. Meal quantities, transit times, enzyme curves and condition effects are illustrative. The textbook PDF is used as a terminology and biology reference and is not included in the site.

## Use online or offline

Open [GitHub Pages](https://tzechingchan0605-cloud.github.io/ch.7_Digestion-and-Absorption/) or download `digestion-offline.html` from the repository's Releases and open it directly. To use the ZIP edition, extract its contents together and open `index.html`. No account, application dependencies, or runtime third-party requests are required.

## Develop and verify

In the existing checkout, run:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Then, in another shell:

```sh
node --test tests/model.test.cjs
python3 tools/package.py
python3 -m zipfile -t dist/digestion-offline.zip
node tests/browser.cjs
```

The browser test requires Playwright and Chromium. Set `CHROMIUM_PATH` if Chromium is installed outside `/usr/bin/chromium`. The offline release workflow builds both artifacts from `main`.
