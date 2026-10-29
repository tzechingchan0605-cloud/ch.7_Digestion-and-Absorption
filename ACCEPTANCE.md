# Chapter-specific acceptance checks

## Executed model checks

`node --test tests/model.test.cjs`: **4 tests passed**, no failures, skips or disabled tests.

1. **Bile salts alone**: tested at t = 0, 1, 10, 60, 1000; remaining lipid stays 100 and products stay zero; radius decreases and equal-volume area increases.
2. **Lipase alone and common maximum**: lipase alone produces products at positive times; both additions are faster initially; remaining + products = 100 in every vessel. At t = 1000 the two lipase conditions reach the same maximum within numerical tolerance.
3. **Amylase specificity**: mouth produces maltose and no glucose; stomach retains starch and produces no maltose/glucose. Pepsin products require the enzyme toggle. Intestinal two-step carbohydrate pool is conserved.
4. **Absorption routes**: intact starch/protein map to blocked; glucose/amino acids map to blood; fatty acids/glycerol map to lymph. Physical digestion changes piece size without molecule conversion. Oesophageal transport does not reduce piece size.

## Browser checks

See `tests/browser.cjs` for reproducible Chromium checks of language switching and persistence, time and selections, saved predictions and immutable trial snapshots, CSV content, rotation angle, distinct absorption routes, blocked macromolecules, guided responses and hints, mobile overflow, runtime exceptions, and third-party requests.

## Diagram and scope review

- Original canal path connects mouth → oesophagus → stomach → duodenum → remaining small intestine. The food marker interpolates only along this path; no accessory gland coordinates enter the food path. Liver, gall bladder, pancreas and ducts are shown separately.
- Mouth, stomach and intestine have separate reaction descriptions and model states; no direct starch-to-glucose label is used for salivary amylase.
- Fatty acids/glycerol enter epithelium, recombine, enter the lacteal/lymph, and eventually join blood. Glucose enters capillaries. Both languages use separate route descriptions.
- 3D villus mesh vertices are rotated and projected mathematically; the model is not a flat image. Microvilli, thin epithelial surface, capillary loop and lacteal are represented. Cutaway and smooth-surface comparisons are qualitative.
- Molecules, food pieces and droplets are explicitly different scales. Relative units, model seconds, simplifying assumptions, and source limitations are visible in the app.
- Reference explanations are hidden until attempt/reveal. Student explanations are retained and never keyword-graded.

## Remaining source checks (not passed or implied)

The textbook PDF and authoritative EDB curriculum/supplementary documents were not supplied or independently verified. Printed-page fidelity and full curriculum alignment therefore remain a teacher/source-review task. The software and explicit supplied scientific rules can be tested independently of that missing source review. No physiological rate validation or patient-data validation is claimed.

Chromium browser run: **passed** all scripted interactions above, with no page errors or third-party requests. Mobile viewport checked at 390 × 844, desktop at 1440 × 1000. CSV download was read back and verified to contain translated headers and actual saved time-series rows. Desktop villus rendering was also visually inspected.

Direct `file://` navigation could not be tested in this managed cloud Chromium because its administrator policy blocks the file scheme (`ERR_BLOCKED_BY_ADMINISTRATOR`). This is a browser policy limitation, not a successful file-opening test. The standalone file is additionally checked by loading its embedded HTML into a browser with networking disabled. It contains no runtime file or network dependencies.
