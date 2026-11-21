'use strict';

const M = DigestionModel;
let language = 'en';
try {
  if (localStorage.getItem('digestion.language') === 'zh') language = 'zh';
} catch {}

const state = {
  mode: 'simulate',
  organ: 'mouth',
  closeup: false,
  follow: false,
  inside: false,
  labels: true,
  acidity: false,
  foodMarker: true,
  chewing: 'chew',
  condition: 'normal',
  observation: 'organ',
  speed: 'auto',
  elapsed: 0,
  playing: false,
  lab: 'identify',
  labTime: 0,
  labRunning: false,
  labRun: false,
  labSettings: { identify: '', sample: 'bread', test: 'iodine', predict: '', pH: 7, temperature: 37, amylase: 'yes', count: 8, height: 2, radius: .5 },
  identifyIndex: 0,
  records: [],
  quizKind: 'practice',
  topic: 'all',
  questionIndex: 0,
  quizChoice: null,
  optionOrder: [],
  quizChecked: false,
  quizReveal: false,
  score: 0,
  attempted: 0,
  round: [],
  roundIndex: 0,
  roundComplete: false
};

const byId = id => document.getElementById(id);
const text = value => value[language === 'zh' ? 1 : 0];
const tr = key => text(COPY[key]);
const organName = id => text(STRUCTURES[id].name);
const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
const fmt = (value, digits = 1) => Number(value).toLocaleString(language === 'zh' ? 'zh-HK' : 'en-GB', { maximumFractionDigits: digits });
const button = (label, action, value = '', attrs = '') => `<button type="button" data-action="${action}" data-value="${escape(value)}" ${attrs}>${label}</button>`;
const toggle = (label, action, value, selected) => button(label, action, value, `aria-pressed="${selected}"`);
const checkbox = (key, label) => `<label><input id="${key}" type="checkbox" data-setting="${key}" ${state[key] ? 'checked' : ''}> ${label}</label>`;
const option = (value, label, current) => `<option value="${value}" ${String(value) === String(current) ? 'selected' : ''}>${label}</option>`;
const select = (key, label, values, current = state[key]) => `<label>${label}<select id="${key}" data-setting="${key}">${values.map(([value, title]) => option(value, title, current)).join('')}</select></label>`;
const localisedOptions = dictionary => Object.entries(dictionary).map(([id, title]) => [id, text(title)]);
const organOptions = ids => ids.map(id => toggle(organName(id), 'organ', id, state.organ === id)).join('');

function journey() {
  const durations = M.journey(state.chewing, state.condition);
  return { ...M.stageAt(durations, state.elapsed), durations, end: durations.reduce((sum, value) => sum + value, 0) };
}

function languageBar() {
  document.documentElement.lang = language === 'zh' ? 'zh-HK' : 'en-GB';
  document.title = tr('title');
  for (const key of ['chapter', 'title', 'intro', 'source']) byId(key).textContent = tr(key);
  const otherLanguage = language === 'en' ? '繁體中文' : 'English';
  byId('language').innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></svg><span lang="${language === 'en' ? 'zh-HK' : 'en-GB'}">${otherLanguage}</span>`;
  byId('modes').innerHTML = ['simulate', 'experiment', 'quiz'].map(id => toggle(tr(id), 'mode', id, state.mode === id)).join('');
}

function render() {
  const active = document.activeElement;
  const selector = active?.id ? '#' + CSS.escape(active.id) :
    active?.dataset.action ? `[data-action="${active.dataset.action}"][data-value="${CSS.escape(active.dataset.value)}"]` : '';
  const keepScroll = selector && window.scrollY;
  languageBar();
  byId('app').innerHTML = (state.mode === 'simulate' ? simulation() : state.mode === 'experiment' ? experiments() : quizzes()) + notebook();
  if (state.mode === 'simulate') {
    paintJourney(true);
  } else if (state.mode === 'experiment') {
    paintPractical();
  }
  if (selector) {
    document.querySelector(selector)?.focus({ preventScroll: true });
    if (keepScroll) window.scrollTo(0, keepScroll);
  }
}

function simulation() {
  return `<div class="workbench">
    <div class="stack">
      <section class="card stage-card" aria-labelledby="anatomy-heading">
        <div class="card-head"><h2 id="anatomy-heading">${tr('diagram')}</h2>
        </div>
        <div class="stage">
          ${AnatomicalDrawing.svg(organName, tr('diagram'))}
          <div id="cutaway" hidden></div>
        </div>
        <div class="stage-controls">
          ${checkbox('labels', tr('labels'))}${checkbox('inside', tr('inside'))}${checkbox('acidity', tr('acidity'))}${checkbox('foodMarker', tr('foodMarker'))}
          <span class="stage-note">${tr('schematic')}</span>
        </div>
        <div class="journey">
          <div class="actions">
            ${button(tr('play'), 'play', '', 'id="play" class="primary"')}
            ${button(tr('previous'), 'step', -1, 'id="previous"')}
            ${button(tr('next'), 'step', 1, 'id="next"')}
            ${button(tr(state.follow || state.closeup ? 'whole' : 'focus'), 'camera', '', 'id="camera"')}
            ${button(tr('reset'), 'reset')}
          </div>
          <progress id="progress" max="100" value="0" aria-label="${tr('progress')}"></progress>
        </div>
      </section>
      <section class="card pad">
        <h2>${tr('playbackSettings')}</h2>
        <div class="controls">
          ${select('chewing', tr('chewing'), ['chew','gulp'].map(id => [id,tr(id)]))}
          ${select('condition', tr('condition'), localisedOptions(CONDITIONS))}
          ${select('speed', tr('speed'), [['auto',tr('auto')],['1','1 '+tr('minuteSecond')],['10','10 '+tr('minuteSecond')],['60','1 '+tr('hourSecond')]])}
        </div>
        <p class="muted" id="condition-description"></p>
        <p class="muted">${tr('illustrative')}</p>
      </section>
    </div>
    <div class="stack">
      <section class="card pad study" aria-labelledby="selection-heading">
        <div class="options">${['organ','molecules'].map(id => toggle(tr(id), 'observation', id, state.observation === id)).join('')}</div>
        <div id="selection"></div>
      </section>
      <section class="card pad anatomy-index">
        <h2>${tr('route')}</h2>
        <h3>${tr('canal')}</h3><div class="options" id="canal-options">${organOptions(FOOD_PATH)}</div>
      </section>
      <section class="card pad anatomy-index">
        <h2>${tr('accessory')}</h2><div class="options" id="accessory-options">${organOptions(ASSOCIATED)}</div>
      </section>
    </div>
  </div>`;
}

function paintJourney(updateOrgan = false) {
  const current = journey();
  const svg = byId('anatomy-svg');
  const marker = byId('food-marker');
  const segment = byId('food-segment-' + current.index);
  const point = segment.getPointAtLength(segment.getTotalLength() * current.fraction);
  const focus = state.closeup || state.follow ? state.organ : null;
  const showMarker = state.foodMarker && focus !== 'appendix';
  marker.setAttribute('cx', point.x);
  marker.setAttribute('cy', point.y);
  marker.style.visibility = showMarker ? 'visible' : 'hidden';
  byId('progress').value = 100 * (current.index + current.fraction) / FOOD_PATH.length;
  byId('play').textContent = tr(state.playing ? 'pause' : current.fraction === 1 ? 'replay' : state.elapsed ? 'resume' : 'play');
  byId('previous').disabled = !current.index;
  byId('next').disabled = current.index >= FOOD_PATH.length - 1;
  byId('camera').textContent = tr(focus ? 'whole' : 'focus');

  if (updateOrgan) {
    byId('condition-description').textContent = state.condition === 'normal' ? '' : text(CONDITION_NOTES[state.condition]);
    svg.querySelectorAll('.organ-hit').forEach(group => {
      const selected = group.dataset.organ === state.organ;
      group.setAttribute('aria-pressed', String(selected));
      group.dataset.dim = Boolean(focus && !selected);
      group.querySelector('.organ-label').style.display = state.labels ? '' : 'none';
    });
    if (focus) {
      const bounds = svg.querySelector(`[data-organ="${focus}"] .organ`).getBBox();
      const cx = bounds.x + bounds.width / 2, cy = bounds.y + bounds.height / 2;
      svg.setAttribute('viewBox', `${Math.max(0,Math.min(188,cx - 156))} ${Math.max(12,Math.min(220,cy - 165))} 312 330`);
    } else {
      svg.setAttribute('viewBox', '0 12 500 530');
    }
    document.querySelectorAll('button[data-action="organ"]').forEach(control => control.setAttribute('aria-pressed', String(control.dataset.value === state.organ)));
    const cutaway = byId('cutaway');
    cutaway.hidden = !state.inside || !['stomach', 'ileum'].includes(state.organ);
    if (!cutaway.hidden) cutaway.innerHTML = organCutaway(state.organ);
    byId('selection').innerHTML = observation();
  }
}

function organCutaway(id) {
  const stomach = id === 'stomach';
  const heading = stomach ? organName(id) : tr('villus');
  const labelOne = stomach ? (language === 'zh' ? '胃壁' : 'Stomach wall') : tr('epithelium');
  const labelTwo = stomach ? (language === 'zh' ? '食糜' : 'Chyme') : tr('blood');
  const labelThree = stomach ? (language === 'zh' ? '幽門括約肌' : 'Pyloric sphincter') : tr('lacteal');
  const paths = stomach
    ? '<path d="M82 7V44C94 50 103 26 122 33C144 42 145 91 124 108C110 120 82 118 64 104L44 110L40 98L62 91C73 87 75 70 70 54V7Z" fill="#edc2a8" stroke="#a65b53" stroke-width="5"/><path d="M73 82Q98 94 133 79Q135 103 111 111Q84 115 68 98Z" fill="#c99548"/><path d="M84 53q12 9 22 1m-22 13q18 11 37 1" fill="none" stroke="#bf7c64" stroke-width="3"/><circle cx="62" cy="99" r="5" fill="#794946"/>'
    : '<path d="M42 144Q36 96 52 38Q62 9 79 13Q98 17 104 41Q116 77 116 144Z" fill="#f2bea6" stroke="#a65b53" stroke-width="3"/><path d="M55 147Q49 92 66 41Q78 17 89 43Q103 85 104 147M56 102Q76 93 100 107M61 60Q80 52 93 65" fill="none" stroke="#ba5148" stroke-width="4"/><path d="M80 145Q73 103 78 63" fill="none" stroke="#719b62" stroke-width="9" stroke-linecap="round"/>';
  return `<div class="cutaway-panel"><h3>${heading}</h3><svg viewBox="0 0 290 155" role="img" aria-label="${heading}">${paths}
    <path d="M${stomach ? '126 46' : '103 42'}L154 38H165 M${stomach ? '120 95' : '103 101'}L154 81H165 M${stomach ? '61 99' : '80 122'}L154 126H165" stroke="#526b62" fill="none"/>
    <text x="169" y="42">${labelOne}</text><text x="169" y="85">${labelTwo}</text><text x="169" y="130">${labelThree}</text>
  </svg></div>`;
}

function observation() {
  const data = STRUCTURES[state.organ];
  const acidity = { mouth: 'pH 6–7', stomach: 'pH 1–3', duodenum: 'pH 6–8', ileum: 'pH 7–8' };
  if (state.observation === 'organ') {
    return `<div class="study-copy"><p class="badge">${text(data.role)}${state.acidity && acidity[state.organ] ? ' · ' + acidity[state.organ] : ''}</p>
      <h2 id="selection-heading">${organName(state.organ)}</h2><p>${text(data.summary)}</p>
      ${data.facts ? `<h3>${tr('keyProcesses')}</h3><ul class="facts">${data.facts.map(item => `<li>${text(item)}</li>`).join('')}</ul>` : ''}
      ${data.related ? `<h3>${tr('related')}</h3><div class="options">${organOptions(data.related)}</div>` : ''}
    </div>`;
  }
  const site = ['duodenum', 'ileum'].includes(state.organ) ? 'smallIntestine' : state.organ;
  const reactions = MOLECULAR[site];
  return `<div class="study-copy"><p class="badge">${organName(state.organ)}</p><h2 id="selection-heading">${tr('molecules')}</h2>
    ${reactions ? reactionTable(reactions, site === 'smallIntestine' ? tr(site) : organName(site)) : `<p>${text(data.summary)}</p>`}</div>`;
}

function reactionTable(reactions, siteName) {
  return `<table class="reaction-table">
    <caption>${siteName}</caption>
    <thead><tr>${REACTION_CATEGORIES.map(category => `<th scope="col">${text(category)}</th>`).join('')}</tr></thead>
    <tbody><tr>${reactions.map(reaction => `<td>${reaction
      ? `<div class="reaction-chain">
          <strong>${text(reaction.start)}</strong>
          ${reaction.steps.map(([process, product]) => `
            <div class="reaction-arrow"><span>${text(process)}</span><span aria-hidden="true">↓</span></div>
            <strong>${text(product)}</strong>`).join('')}
        </div>`
      : `<span aria-label="${tr('noReaction')}">—</span>`}</td>`).join('')}</tr></tbody>
  </table>`;
}

function graph(samples, labels, max, axis, elapsed) {
  const palette = ['#08746a', '#a74a27', '#5853a1', '#986315', '#226c9a'];
  const x = i => 46 + (samples.length === 1 ? 0 : i / (samples.length - 1)) * 389;
  const y = v => 134 - v / max * 105;
  return `<svg class="graph" viewBox="0 0 470 168" role="img" aria-label="${labels.join(', ')}">
    ${[0, 25, 50, 75, 100].map(value => `<path d="M46 ${y(value)}H435" stroke="#d7e3e0"/><text x="38" y="${y(value)+4}" text-anchor="end">${value}</text>`).join('')}
    <text x="46" y="154">0</text><text x="435" y="154" text-anchor="end">${fmt(elapsed,1)}</text>
    <text x="235" y="163" text-anchor="middle">${axis}</text>
    ${labels.map((_, index) => `<polyline points="${samples.map((sample, i) => `${x(i)},${y(sample[index])}`).join(' ')}" fill="none" stroke="${palette[index]}" stroke-width="2.5" stroke-dasharray="${['0','7 3','3 4','10 4 2 4','2 3'][index]}"/>`).join('')}
    </svg><div class="legend">${labels.map((label,i) => `<span style="--series:${palette[i]}">${label}</span>`).join('')}</div>`;
}

function chooseOrgan(id) {
  if (id === 'appendix') state.playing = false;
  state.organ = id;
  state.closeup = true;
  state.follow = false;
  state.observation = 'organ';
  render();
}

const timedLabs = ['acidity','temperature','bile','dialysis'];
const identifyOrder = ['stomach','colon','salivary','ileum','liver','oesophagus','duodenum','gallbladder','pancreas','caecum'];
const labLimit = () => state.lab === 'dialysis' ? 60 : 120;
const labSelect = (key, label, values) => select('lab-' + key, label, values, state.labSettings[key]);
const numbers = values => values.map(value => [value, value]);
function experiments() {
  const id = state.lab;
  const definition = PRACTICALS[id];
  const yesNo = [['yes',tr('predictionPositive')], ['no',tr('predictionNegative')]];
  const selectors = {
    identify: () => labSelect('identify', tr('selected'), [['','—'], ...identifyOrder.map(key => [key,organName(key)])]),
    foodTests: () => labSelect('sample', tr('sample'), Object.keys(TEST_SAMPLES).map(key => [key, text(MEALS[key].name)])) +
      labSelect('test', tr('test'), Object.entries(TESTS).map(([key, test]) => [key,text(test.name)])) +
      labSelect('predict', tr('predict'), [['','—'], ...yesNo]),
    acidity: () => labSelect('pH', 'pH', numbers([3,4,5,6,7,8,9,10])),
    temperature: () => labSelect('temperature', tr('temperature') + ' (°C)', numbers([5,15,25,37,45,55,65,75])),
    bile: () => '',
    dialysis: () => labSelect('amylase', tr('addAmylase'), yesNo),
    surface: () => labSelect('count', tr('villusCount'), numbers([0,4,8,12,16,20])) +
      labSelect('height', tr('villusHeight'), numbers([1,2,3,4])) +
      labSelect('radius', tr('villusRadius'), numbers([.25,.5,.75,1]))
  };
  return `<div class="experiment-layout">
    <nav class="card pad lab-menu" aria-label="${tr('experiment')}">${Object.entries(PRACTICALS).map(([key, lab]) => toggle(text(lab.name), 'lab', key, key === id)).join('')}</nav>
    <section class="card pad">
      <h2>${text(definition.name)}</h2><h3>${tr('method')}</h3><p>${text(definition.method)}</p>
      ${id === 'identify' ? `<div class="stage lab-diagram">${AnatomicalDrawing.svg(organName, tr('diagram'))}</div>` : ''}
      <div class="controls">${selectors[id]()}</div>
      <div class="actions">
        ${button(tr(id === 'identify' ? 'check' : 'run'), 'run', '', 'id="run-lab" class="primary"')}
        ${id === 'identify' ? button(tr('another'), 'next-organ') : ''}
        ${timedLabs.includes(id) ? button(tr('tick'), 'tick', '', 'id="tick-lab"') : ''}
        ${id !== 'identify' ? button(tr('record'), 'record', '', 'id="record"') : ''}
      </div>
      <div id="lab-reading"></div>
    </section>
  </div>`;
}

function practicalResult() {
  const settings = state.labSettings;
  const id = state.lab;
  const seconds = state.labTime;
  const when = `${fmt(seconds,0)} ${tr('seconds')}`;
  if (id === 'identify') {
    return { rows: [[tr('result'), tr(settings.identify === identifyOrder[state.identifyIndex] ? 'correct' : 'incorrect')]] };
  }
  if (id === 'foodTests') {
    const test = TESTS[settings.test];
    const positive = ActivityModels.foodTest(settings.sample, settings.test);
    return { rows: [[text(test.name), text(positive ? test.positive : test.negative)]],
      colour: test.colours[positive ? 0 : 1], setting: text(MEALS[settings.sample].name),
      prediction: settings.predict ? tr((settings.predict === 'yes') === positive ? 'correct' : 'incorrect') : '' };
  }
  if (id === 'acidity' || id === 'temperature') {
    const pH = id === 'acidity' ? Number(settings.pH) : 7;
    const temperature = id === 'temperature' ? Number(settings.temperature) : 37;
    const remaining = ActivityModels.starch(pH, temperature, seconds);
    const detected = remaining > 8;
    return { rows: [[tr('time'), when], [tr('remaining'), fmt(remaining) + '%'], [text(TESTS.iodine.name), text(detected ? TESTS.iodine.positive : TESTS.iodine.negative)]],
      colour: TESTS.iodine.colours[detected ? 0 : 1], setting: `pH ${pH}, ${temperature} °C`,
      plot: { samples: Array.from({length:25}, (_, i) => [ActivityModels.starch(pH,temperature,seconds*i/24)]), labels: [tr('remaining')] } };
  }
  if (id === 'bile') {
    const labels = ['neither','bileOnly','lipaseOnly','both'].map(tr);
    return { rows: [[tr('time'), when], ...M.vessels(seconds).map((v,i) => [labels[i], fmt(v.product) + '%'])],
      setting: tr('lipidProducts'), plot: { samples: Array.from({length:25},(_,i) => M.vessels(seconds*i/24).map(v => v.product)), labels } };
  }
  if (id === 'dialysis') {
    const result = ActivityModels.dialysis(settings.amylase === 'yes', seconds);
    return { rows: [[tr('time'), when], ...Object.keys(result).map(key => [tr(key), tr(result[key] ? 'predictionPositive' : 'predictionNegative')])],
      setting: tr('addAmylase') + ' · ' + tr(settings.amylase === 'yes' ? 'predictionPositive' : 'predictionNegative') };
  }
  const result = ActivityModels.surface(Number(settings.count), Number(settings.height), Number(settings.radius));
  return { rows: [[tr('flat'), fmt(result.flat) + ' mm²'], [tr('totalArea'), fmt(result.area) + ' mm²'], [tr('multiplier'), fmt(result.ratio,2) + '×']],
    setting: `n = ${settings.count}, h = ${settings.height} mm, r = ${settings.radius} mm`,
    diagram: surfaceDiagram(Number(settings.count), Number(settings.height), Number(settings.radius)) };
}

function surfaceDiagram(count, height, radius) {
  const columns = 10;
  return `<svg class="area-diagram" viewBox="0 0 340 102" role="img" aria-label="${tr('totalArea')}">
    <path d="M14 62H297L324 86H40Z" fill="#f1d7bf" stroke="#a26b55"/>
    ${Array.from({length:count}, (_, index) => {
      const row = index >= columns ? 0 : 1;
      const x = 40 + index%columns*26 + row*12;
      const y = 65 + row*14;
      const r = 4 + radius*4;
      const h = height*10;
      return `<path d="M${x-r} ${y-h}V${y}q${r} 6 ${r*2} 0V${y-h}Z" fill="#cf8f70" stroke="#a26b55"/><ellipse cx="${x}" cy="${y-h}" rx="${r}" ry="3" fill="#f3c2a6" stroke="#a26b55"/>`;
    }).join('')}</svg>`;
}

function paintPractical() {
  const id = state.lab;
  const reading = byId('lab-reading');
  const timed = timedLabs.includes(id);
  if (timed) {
    byId('run-lab').textContent = tr(state.labRunning ? 'pause' : state.labTime >= labLimit() ? 'replay' : state.labRun ? 'resume' : 'run');
    byId('tick-lab').disabled = state.labTime >= labLimit();
  }
  if (id === 'identify') {
    byId('run-lab').disabled = !state.labSettings.identify;
    byId('food-marker').style.visibility = 'hidden';
    const answer = identifyOrder[state.identifyIndex];
    document.querySelectorAll('.organ-hit').forEach(group => {
      group.dataset.dim = group.dataset.organ !== answer;
      group.removeAttribute('tabindex');
      group.setAttribute('aria-hidden', 'true');
      group.querySelector('.organ-label').style.display = 'none';
    });
    byId('anatomy-svg').setAttribute('aria-label', tr('selected'));
  } else {
    byId('record').disabled = !state.labRun;
  }
  if (!state.labRun) {
    reading.innerHTML = '';
    return;
  }
  const result = practicalResult();
  reading.innerHTML = `<div class="observation"><h3>${tr('observation')}</h3>
    <div class="${result.colour ? 'specimen' : ''}">${result.colour ? `<div class="sample-colour" style="background-color:${result.colour}" aria-hidden="true"></div>` : ''}
    <dl class="status-grid">${result.rows.map(([key,value]) => `<dt>${key}</dt><dd>${value}</dd>`).join('')}</dl></div>
    ${result.prediction ? `<p role="status">${result.prediction}</p>` : ''}
    ${result.plot ? graph(result.plot.samples, result.plot.labels, 100, tr('time') + ' (' + tr('seconds') + ')', state.labTime) : ''}
    ${result.diagram || ''}
    ${id === 'surface' ? '<p class="muted">A = 100 mm² + n × 2πrh</p>' : ''}
  </div>`;
}

function questionPool() {
  return QUESTIONS.flatMap((question, index) => state.topic === 'all' || question.topic === state.topic ? [index] : []);
}

function chooseQuestion(index) {
  state.questionIndex = index;
  state.quizChoice = null;
  state.quizChecked = false;
  state.quizReveal = false;
  const options = QUESTIONS[index].options;
  state.optionOrder = options.map((_, i) => i);
  for (let i = options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [state.optionOrder[i], state.optionOrder[j]] = [state.optionOrder[j], state.optionOrder[i]];
  }
}

function quizzes() {
  const practice = state.quizKind === 'practice';
  const showQuestion = practice || state.round.length && !state.roundComplete;
  const question = QUESTIONS[state.questionIndex];
  return `<section class="card pad quiz">
    <div class="card-head"><h2>${tr('quiz')}</h2><div class="segment">${['practice','round'].map(id => toggle(tr(id), 'quiz-kind', id, state.quizKind === id)).join('')}</div></div>
    ${practice ? `<div class="controls">${select('topic', tr('topic'), [['all',tr('all')], ...localisedOptions(QUIZ_TOPICS)])}</div>` : ''}
    ${showQuestion ? `<fieldset><legend>${practice ? text(QUIZ_TOPICS[question.topic]) : (state.roundIndex+1) + ' / 5'}</legend><h3 id="quiz-question">${text(question.prompt)}</h3>
      <div class="radio-list">${state.optionOrder.map(i => `<label><input type="radio" name="answer" value="${i}" ${state.quizChoice === i ? 'checked' : ''} ${state.quizChecked ? 'disabled' : ''}> ${text(question.options[i])}</label>`).join('')}</div>
    </fieldset><div class="actions">
      ${state.quizChecked && !practice ? button(tr('quizNext'), 'advance-quiz', '', 'class="primary"') :
        button(tr(practice ? 'check' : 'submit'), 'grade', '', `id="grade" class="primary" ${state.quizChoice === null || state.quizChecked ? 'disabled' : ''}`)}
      ${practice ? button(tr('show'), 'reveal') + button(tr('another'), 'new-question') : ''}</div>
      ${state.quizChecked && practice ? `<p role="status">${tr(state.quizChoice === question.answer ? 'correct' : 'incorrect')}</p>` : ''}
      ${state.quizReveal || practice && state.quizChecked ? `<p class="explanation">${text(question.options[question.answer])} · ${text(question.why)}</p>` : ''}`
      : `<div class="actions">${state.roundComplete ? `<strong>${tr('quizFinish')} · ${state.score} / 5</strong>` : ''}${button(tr('start'), 'start-round', '', 'class="primary"')}</div>`}
    ${practice ? `<p class="muted">${tr('score')} ${state.score} / ${state.attempted}</p>` : ''}
  </section>`;
}

function notebook() {
  return `<section class="card pad notebook" aria-labelledby="notebook-title">
    <div class="card-head"><h2 id="notebook-title">${tr('notebook')}</h2>
      <div class="actions no-print">${button(tr('csv'), 'export', '', state.records.length ? '' : 'disabled')}${button(tr('print'), 'print', '', state.records.length ? '' : 'disabled')}${button(tr('clear'), 'clear', '', state.records.length ? '' : 'disabled')}</div>
    </div>
    ${state.records.length ? `<div class="table-scroll"><table><thead><tr><th>${tr('activity')}</th><th>${tr('setting')}</th><th>${tr('result')}</th></tr></thead><tbody>
      ${state.records.map(item => `<tr><td>${escape(item.activity)}</td><td>${escape(item.setting)}</td><td>${escape(item.result)}</td></tr>`).join('')}
    </tbody></table></div>
    <div class="report-fields">
      <p>${tr('name')}: __________________________　${tr('class')}: __________________________</p>
      <p>${tr('conclusion')}: __________________________________________________________</p>
    </div>` : `<p class="muted">${tr('noRecords')}</p>`}
  </section>`;
}

function saveRecord() {
  if (state.mode !== 'experiment' || !state.labRun || state.lab === 'identify') return;
  const result = practicalResult();
  state.records.push({
    activity: text(PRACTICALS[state.lab].name),
    setting: result.setting || '',
    result: result.rows.map(([key,value]) => `${key} ${value}`).join(' · ')
  });
  render();
}

function exportRecords() {
  const csv = [ ['activity','setting','result'].map(tr), ...state.records.map(record => [record.activity,record.setting,record.result]) ]
    .map(row => row.map(value => '"' + String(value).replaceAll('"','""') + '"').join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'digestion-notebook.csv';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function resetMeal() {
  state.elapsed = 0;
  state.playing = false;
  state.organ = 'mouth';
  state.closeup = false;
  state.follow = false;
}

function resetTrial() {
  state.labTime = 0;
  state.labRunning = false;
  state.labRun = false;
}

function setStage(index) {
  const durations = journey().durations;
  const clamped = Math.max(0, Math.min(index, FOOD_PATH.length-1));
  state.elapsed = durations.slice(0,clamped).reduce((sum,value) => sum+value,0) + 1e-8;
  state.organ = FOOD_PATH[clamped];
  state.playing = false;
  paintJourney(true);
}

function tickLab(amount) {
  state.labRun = true;
  state.labTime = Math.min(labLimit(),state.labTime + amount);
  if (state.labTime >= labLimit()) state.labRunning = false;
  paintPractical();
}

const actions = {
  mode(value) {
    state.mode = value;
    state.playing = false;
    state.labRunning = false;
    render();
  },
  organ: chooseOrgan,
  observation(value) { state.observation = value; render(); },
  play() {
    if (journey().fraction === 1) resetMeal();
    state.playing = !state.playing;
    if (state.playing) state.organ = FOOD_PATH[journey().index];
    paintJourney(true);
  },
  step(value) { setStage(journey().index + Number(value)); },
  camera() {
    state.follow = !state.follow && !state.closeup;
    state.closeup = false;
    if (state.follow) state.organ = FOOD_PATH[journey().index];
    paintJourney(true);
  },
  reset() { resetMeal(); paintJourney(true); },
  lab(value) {
    state.lab = value;
    resetTrial();
    render();
  },
  'next-organ'() {
    state.identifyIndex = (state.identifyIndex+1) % identifyOrder.length;
    state.labSettings.identify = '';
    resetTrial();
    render();
  },
  run() {
    if (timedLabs.includes(state.lab)) {
      if (state.labTime >= labLimit()) resetTrial();
      state.labRunning = !state.labRunning;
    }
    state.labRun = true;
    paintPractical();
  },
  tick() { state.labRunning = false; tickLab(15); },
  record: saveRecord,
  export: exportRecords,
  print() { window.print(); },
  clear() { state.records = []; render(); },
  'quiz-kind'(value) {
    if (state.quizKind === value) return;
    state.quizKind = value;
    state.round = [];
    state.roundComplete = false;
    state.score = 0;
    state.attempted = 0;
    chooseQuestion(questionPool()[0]);
    render();
  },
  'new-question'() {
    const pool = questionPool();
    chooseQuestion(pool[(pool.indexOf(state.questionIndex)+1) % pool.length]);
    render();
  },
  'start-round'() {
    const candidates = QUESTIONS.map((_,index) => index);
    state.round = Array.from({length:5}, () => candidates.splice(Math.floor(Math.random()*candidates.length),1)[0]);
    state.roundIndex = 0;
    state.roundComplete = false;
    state.score = 0;
    state.attempted = 0;
    chooseQuestion(state.round[0]);
    render();
  },
  grade() {
    if (state.quizChoice === null || state.quizChecked) return;
    state.quizChecked = true;
    state.attempted++;
    if (state.quizChoice === QUESTIONS[state.questionIndex].answer) state.score++;
    render();
  },
  reveal() { state.quizReveal = true; render(); },
  'advance-quiz'() {
    if (state.roundIndex >= 4) state.roundComplete = true;
    else chooseQuestion(state.round[++state.roundIndex]);
    render();
  }
};

document.addEventListener('click', event => {
  const control = event.target.closest('[data-action]');
  if (control) {
    actions[control.dataset.action](control.dataset.value);
    return;
  }
  const organ = event.target.closest('.organ-hit');
  if (state.mode === 'simulate' && organ) chooseOrgan(organ.dataset.organ);
});

document.addEventListener('keydown', event => {
  const organ = event.target.closest('.organ-hit');
  if (state.mode !== 'simulate' || !organ || !['Enter',' '].includes(event.key)) return;
  event.preventDefault();
  chooseOrgan(organ.dataset.organ);
});

document.addEventListener('change', event => {
  const control = event.target;
  if (control.name === 'answer') {
    state.quizChoice = Number(control.value);
    byId('grade').disabled = false;
    return;
  }
  const key = control.dataset.setting;
  if (!key) return;
  if (key.startsWith('lab-')) {
    state.labSettings[key.slice(4)] = control.value;
    if (key !== 'lab-predict') resetTrial();
    paintPractical();
    return;
  }
  state[key] = control.type === 'checkbox' ? control.checked : control.value;
  if (key === 'topic') { chooseQuestion(questionPool()[0]); render(); return; }
  if (['chewing','condition'].includes(key)) resetMeal();
  paintJourney(true);
});

byId('language').addEventListener('click', () => {
  language = language === 'en' ? 'zh' : 'en';
  try { localStorage.setItem('digestion.language', language); } catch {}
  render();
});

let lastFrame = 0;
function frame(timestamp) {
  const seconds = Math.min(.15, (timestamp-lastFrame)/1000);
  if (seconds >= .065 || !lastFrame) {
    lastFrame = timestamp;
    if (state.mode === 'simulate' && state.playing) {
      const before = journey();
      const speed = state.speed === 'auto' ? before.durations[before.index]/(before.index === 0 ? 4 : 3.2) : Number(state.speed);
      state.elapsed = Math.min(before.end, state.elapsed + seconds*speed);
      const after = journey();
      state.organ = FOOD_PATH[after.index];
      if (state.elapsed >= after.end) state.playing = false;
      paintJourney(before.index !== after.index || !state.playing);
    } else if (state.mode === 'experiment' && state.labRunning) {
      tickLab(seconds*6);
    }
  }
  requestAnimationFrame(frame);
}

chooseQuestion(0);
render();
requestAnimationFrame(frame);
