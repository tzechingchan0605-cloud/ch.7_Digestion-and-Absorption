const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const { readFileSync, existsSync } = require('node:fs');
const { resolve } = require('node:path');

async function main() {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox']
  });
  try {
    const origin = process.env.DIGESTION_TEST_ORIGIN || 'http://127.0.0.1:8000';
    const page = await browser.newPage({ acceptDownloads: true, viewport: { width: 1440, height: 1000 } });
    const errors = [];
    const external = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => {
      if (new URL(request.url()).origin !== origin) external.push(request.url());
    });
    const action = (name, value) => page.locator(`button[data-action="${name}"]${value === undefined ? '' : `[data-value="${value}"]`}`).first();
    const heading = () => page.locator('#selection-heading').innerText();
    const step = (value) => action('step', value).click();

    await page.goto(origin);
    assert.equal(await page.locator('html').getAttribute('lang'), 'en-GB');
    assert.equal(await heading(), 'Mouth cavity');
    await page.screenshot({ path: '/tmp/digestion-desktop.png', fullPage: true });
    const canal = page.locator('#canal-options');
    assert.equal(await canal.getByRole('button', { name: 'Appendix' }).count(), 0);
    await page.locator('#accessory-options').getByRole('button', { name: 'Appendix' }).click();
    assert.match(await page.locator('#selection').innerText(), /Food does not normally pass through it/);
    assert.equal(await page.locator('#food-marker').evaluate(marker => getComputedStyle(marker).visibility), 'hidden');
    await action('reset').click();
    await step(1);
    assert.equal(await heading(), 'Pharynx');
    await step(1);
    assert.equal(await heading(), 'Oesophagus');
    for (const expected of ['Stomach', 'Duodenum', 'Ileum', 'Caecum', 'Colon']) {
      await step(1);
      assert.equal(await heading(), expected);
    }
    for (let i = 0; i < 5; i++) await step(-1);
    await page.locator('#language').click();
    assert.equal(await page.locator('html').getAttribute('lang'), 'zh-HK');
    assert.equal(await heading(), '食道');
    await page.locator('button[data-action="organ"][data-value="ileum"]').click();
    await page.locator('#inside').check();
    assert.match(await page.locator('#cutaway').innerText(), /乳糜管/);
    await action('observation', 'molecules').click();
    assert.match(await page.locator('#selection').innerText(), /胰澱粉酶|麥芽糖酶/);
    await action('view', '3d').click();
    const canvas = page.locator('#body-canvas');
    const before = await canvas.evaluate(el => el.toDataURL());
    await page.locator('#angle').focus();
    await page.locator('#angle').press('End');
    assert.notEqual(await canvas.evaluate(el => el.toDataURL()), before);

    await action('observation', 'meal').click();
    await page.locator('#meal').selectOption('milk');
    await page.locator('#condition').selectOption('lactose');
    assert.match(await page.locator('#condition-description').innerText(), /乳糖/);
    await page.locator('#speed').selectOption('60');
    await action('play').click();
    await page.waitForFunction(() => document.getElementById('progress').value > 25);
    await action('play').click();
    await action('observation', 'graph').click();
    assert.equal(await page.locator('svg.graph').count(), 1);
    await action('observation', 'meal').click();
    await action('record').click();

    await action('mode', 'experiment').click();
    await page.locator('#lab-identify').selectOption('stomach');
    await action('run').click();
    assert.match(await page.locator('#lab-reading').innerText(), /正確/);
    await action('lab','foodTests').click();
    await page.locator('#lab-predict').selectOption('yes');
    await action('run').click();
    assert.match(await page.locator('#lab-reading').innerText(), /藍黑色/);
    assert.match(await page.locator('#lab-reading [role=status]').innerText(), /正確/);
    await action('record').click();

    await action('lab','acidity').click();
    await page.locator('#lab-pH').selectOption('3');
    await action('tick').click();
    const acidic = await page.locator('#lab-reading dd').nth(1).innerText();
    await page.locator('#lab-pH').selectOption('7');
    await action('tick').click();
    const neutral = await page.locator('#lab-reading dd').nth(1).innerText();
    assert(parseFloat(acidic) > parseFloat(neutral));
    await action('lab','temperature').click();
    await page.locator('#lab-temperature').selectOption('75');
    await action('tick').click();
    assert(parseFloat(await page.locator('#lab-reading dd').nth(1).innerText()) > parseFloat(neutral));

    await action('lab','bile').click();
    await action('tick').click();
    const lipidResults = (await page.locator('#lab-reading dd').allInnerTexts()).slice(1).map(parseFloat);
    assert.deepEqual(lipidResults.slice(0,2), [0,0]);
    assert(lipidResults[3] > lipidResults[2]);
    await action('lab','dialysis').click();
    for (let i=0; i<4; i++) await action('tick').click();
    assert.deepEqual((await page.locator('#lab-reading dd').allInnerTexts()).slice(1), ['沒有','有']);
    await action('lab','surface').click();
    await page.locator('#lab-count').selectOption('0');
    await action('run').click();
    assert.equal(await page.locator('#lab-reading dd').last().innerText(), '1×');
    await page.locator('#lab-count').selectOption('8');
    await action('run').click();
    assert(parseFloat(await page.locator('#lab-reading dd').last().innerText()) > 1);
    await action('record').click();

    const downloading = page.waitForEvent('download');
    await action('export').click();
    const download = await downloading;
    const csv = readFileSync(await download.path(), 'utf8');
    assert.match(csv, /本立德|碘液試驗/);
    assert.match(csv, /小腸的表面積/);

    await action('mode','quiz').click();
    await page.locator('#topic').selectOption('enzymes');
    await page.getByRole('radio', { name: '麥芽糖' }).check();
    await action('grade').click();
    assert.match(await page.locator('.quiz [role=status]').innerText(), /正確/);
    await action('quiz-kind','round').click();
    await action('start-round').click();
    const prompts = new Set();
    for (let i=0; i<5; i++) {
      prompts.add(await page.locator('#quiz-question').innerText());
      await page.getByRole('radio').first().check();
      await action('grade').click();
      await action('advance-quiz').click();
    }
    assert.equal(prompts.size, 5);
    assert.match(await page.locator('.quiz').innerText(), /測驗完成.*\/ 5/);

    await page.setViewportSize({ width: 390, height: 844 });
    await action('mode', 'simulate').click();
    await action('view', '2d').click();
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await page.screenshot({ path: '/tmp/digestion-mobile.png', fullPage: true });
    await page.reload();
    assert.equal(await page.locator('html').getAttribute('lang'), 'zh-HK');
    assert.equal(await heading(), '口腔');
    assert.deepEqual(errors, []);
    assert.deepEqual(external, []);

    const standalone = resolve('dist/digestion-offline.html');
    if (existsSync(standalone)) {
      const offline = await browser.newContext({ offline: true });
      const page = await offline.newPage();
      await page.setContent(readFileSync(standalone, 'utf8'));
      await page.getByRole('button', { name: '繁體中文' }).click();
      assert.equal(await page.locator('#selection-heading').innerText(), '口腔');
      await offline.close();
    }
    console.log('PASS: journey, anatomy, rotation, language, seven practicals, CSV, practice and scored quiz, mobile, offline.');
  } finally {
    await browser.close();
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
