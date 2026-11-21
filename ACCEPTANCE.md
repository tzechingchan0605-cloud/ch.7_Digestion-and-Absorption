# Verification

- `node --test tests/model.test.cjs` passes five tests covering enzyme specificity, graded lipid digestion, absorption routes, journey boundaries, and the effects of selected conditions.
- `node tests/browser.cjs` covers the meal journey, 2D anatomy close-ups, language-state preservation, all seven practicals, notebook CSV, practice and five-question quiz, mobile viewport, and absence of page errors and third-party requests.
- `python3 tools/package.py` builds the standalone HTML and the ZIP. The browser suite opens the standalone HTML in an offline browser context. `python3 -m zipfile -t dist/digestion-offline.zip` checks archive integrity.

Traditional Chinese names and the school-level descriptions for the alimentary canal, digestion, absorption and egestion were reviewed against the supplied textbook's Chapter 7. The SVG diagrams are original. Model quantities do not represent measurements from patients or real experiments.
