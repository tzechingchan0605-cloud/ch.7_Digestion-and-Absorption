'use strict';

const AnatomicalDrawing = (() => {
  const organs = {
    mouth: { colour: '#c46a6b', shape: 'M204 90Q217 85 227 91L254 97Q260 104 251 111L222 110Q213 102 204 102Z', volume: [230, 101, 14, 25, 10, 11], label: [102, 87] },
    salivary: { colour: '#d99c60', shape: 'M257 76Q273 73 276 86Q275 96 263 96Q253 94 257 76Z', volume: [265, 85, 4, 10, 11, 10], label: [325, 76] },
    pharynx: { colour: '#ad6665', tube: 'M250 101Q260 103 258 119Q257 126 255 130', width: 12, z: 5, label: [102, 120] },
    oesophagus: { colour: '#ce837a', tube: 'M255 130C247 162 260 190 263 219Q263 225 269 238', width: 17, z: 0, label: [102, 171] },
    liver: { colour: '#98504e', shape: 'M169 219Q173 207 194 201Q215 194 241 203Q256 210 274 214Q289 220 280 231Q261 249 238 254Q205 272 177 265Q168 254 169 219Z', volume: [220, 230, 18, 54, 32, 26], label: [103, 229] },
    gallbladder: { colour: '#78a66c', shape: 'M213 255C210 240 226 239 229 251C228 264 222 276 217 271Z', volume: [219, 257, 28, 8, 14, 8], label: [101, 256] },
    bileDuct: { colour: '#588751', tube: 'M226 252Q232 264 226 273Q219 282 232 299', width: 5, z: 20, label: [101, 283] },
    pancreas: { colour: '#d19b5e', shape: 'M227 294Q236 280 258 281Q278 278 306 270Q329 268 326 279Q315 291 284 297L247 306Q232 310 227 294Z', volume: [275, 289, -11, 49, 12, 12], label: [377, 303] },
    pancreaticDuct: { colour: '#835b37', tube: 'M321 279Q298 285 277 290Q254 295 232 299', width: 4, z: 5, label: [377, 329] },
    stomach: { colour: '#dd8b83', shape: 'M265 231Q275 238 285 222C298 203 321 215 328 239C336 270 313 288 286 289C266 292 256 284 246 281Q237 275 232 279L222 268Q229 259 242 265Q268 267 266 244Z', volume: [286, 255, 18, 43, 33, 24], label: [376, 234] },
    duodenum: { colour: '#e5ab77', tube: 'M228 273C205 275 204 304 228 312Q246 318 259 306Q272 297 289 307', width: 15, z: 9, label: [101, 313] },
    ileum: { colour: '#e7ad8b', tube: 'M289 307C323 320 321 336 279 337C242 337 204 333 203 351C202 369 263 352 302 359C329 365 322 381 294 382C262 385 200 376 204 395C207 413 274 388 307 402C323 411 303 427 276 421C241 417 209 415 201 433L182 435', width: 16, z: 3, label: [377, 393] },
    caecum: { colour: '#bd7669', shape: 'M167 423Q180 418 190 435L191 448Q189 460 178 459Q161 457 163 443Z', volume: [177, 441, 9, 13, 19, 13], label: [101, 426] },
    colon: { colour: '#bd7669', tube: 'M176 441C174 420 170 392 172 366L173 339Q174 319 192 320Q257 328 321 318Q339 318 342 336C348 360 340 395 344 418Q347 447 327 454Q314 458 294 450Q273 443 266 466', width: 23, z: 13, label: [376, 353] },
    appendix: { colour: '#ac635e', tube: 'M175 452Q168 462 178 474', width: 7, z: 8, label: [101, 473] },
    rectum: { colour: '#b56f65', tube: 'M266 466Q259 481 265 500', width: 16, z: 8, label: [352, 476] },
    anus: { colour: '#99605d', shape: 'M257 498Q266 494 273 499L271 508Q266 513 259 508Z', volume: [265, 503, 8, 8, 6, 8], label: [352, 512] }
  };
  const routeSegments = [
    'M214 98Q236 97 250 103', organs.pharynx.tube, organs.oesophagus.tube,
    'M269 238C294 228 316 239 308 259C300 284 254 280 228 273',
    organs.duodenum.tube, organs.ileum.tube, 'M182 435Q179 443 176 441',
    organs.colon.tube, organs.rectum.tube, 'M265 500L265 510'
  ];
  const body = '<path d="M205 88Q201 83 208 78Q202 53 219 37Q241 14 272 25Q305 30 307 68Q308 86 291 113L286 140Q304 150 332 157Q372 164 381 194L403 329Q405 353 393 360Q384 362 377 337L356 261Q351 290 363 340Q373 392 357 457L350 526H285L271 510L251 526H165L154 461Q133 408 144 353Q155 300 151 267L127 337Q121 358 110 354Q101 350 106 329L128 202Q134 168 173 158Q205 150 216 134L223 116Q212 115 210 107L200 102Z" fill="#f8faf7" stroke="#c0d2c7" stroke-width="1.6"/>';
  const layerOrder = ['pharynx', 'mouth', 'salivary', 'oesophagus', 'liver', 'gallbladder', 'bileDuct', 'pancreas', 'pancreaticDuct', 'stomach', 'duodenum', 'ileum', 'appendix', 'caecum', 'colon', 'rectum', 'anus'];

  function svg(name, label) {
    return `<svg id="anatomy-svg" viewBox="0 12 500 530" aria-label="${label}">${body}
      ${layerOrder.map(id => {
        const o = organs[id];
        const centre = o.volume ? o.volume.slice(0, 2) : ({pharynx:[256,117],oesophagus:[255,170],bileDuct:[225,279],pancreaticDuct:[276,291],duodenum:[212,294],ileum:[274,372],colon:[343,356],appendix:[174,468],rectum:[266,492]})[id];
        const [x, y] = o.label;
        const anchor = x < 250 ? 'end' : 'start';
        const graphic = o.tube
          ? `<path d="${o.tube}" fill="none" stroke="#754c49" stroke-opacity=".55" stroke-width="${o.width + 2}" stroke-linecap="round"/><path class="tube-core" d="${o.tube}" fill="none" stroke="${o.colour}" stroke-width="${o.width}" stroke-linecap="round"/>`
          : `<path d="${o.shape}" fill="${o.colour}" stroke="#754c49" stroke-opacity=".6" stroke-width="1.4"/>`;
        return `<g class="organ-hit" role="button" tabindex="0" data-organ="${id}" aria-label="${name(id)}" aria-pressed="false">
          <g class="organ">${graphic}</g>
          <g class="organ-label"><line x1="${x + (x < 250 ? 7 : -7)}" y1="${y-4}" x2="${centre[0]}" y2="${centre[1]}"/><text x="${x}" y="${y}" text-anchor="${anchor}">${name(id)}</text></g>
        </g>`;
      }).join('')}
      <g hidden>${routeSegments.map((d, index) => `<path id="food-segment-${index}" d="${d}"/>`).join('')}</g>
      <circle id="food-marker" r="6" fill="#fbd365" stroke="#492e22" stroke-width="2" pointer-events="none"/>
    </svg>`;
  }

  function rectangles(organsById, root) {
    return Object.entries(organsById).flatMap(([id, organ]) => {
      if (organ.volume) return [{ id, colour: organ.colour, dimensions: organ.volume }];
      const path = root.querySelector(`[data-organ="${id}"] .tube-core`);
      const length = path.getTotalLength();
      const radius = organ.width / 2;
      const count = Math.ceil(length / (radius * 1.4));
      return Array.from({ length: count + 1 }, (_, i) => {
        const p = path.getPointAtLength(length * i / count);
        return { id, colour: organ.colour, dimensions: [p.x, p.y, organ.z, radius, radius, radius] };
      });
    });
  }

  function renderer(canvas, svgRoot, name) {
    const context = canvas.getContext('2d');
    const shapes = rectangles(organs, svgRoot);
    let hitMap = [];

    function draw({ angle, selected, inside, focus, labels, foodPoint }) {
      const theta = angle * Math.PI / 180;
      const cos = Math.cos(theta), sin = Math.sin(theta);
      const zoom = focus ? 1.52 : 1;
      const target = shapes.find(shape => shape.id === focus);
      const cx = target ? target.dimensions[0] : 255;
      const cy = target ? target.dimensions[1] : 277;
      function project([x, y, z]) {
        return [250 + zoom * ((x-cx)*cos + z*sin), 260 + zoom*(y-cy), -(x-cx)*sin + z*cos];
      }
      hitMap = shapes.map(shape => {
        const [x, y, z, rx, ry, rz] = shape.dimensions;
        return { ...shape, screen: project([x, y, z]), rx: zoom * Math.hypot(rx*cos, rz*sin), ry: zoom * ry };
      }).sort((a, b) => a.screen[2] - b.screen[2]);
      context.clearRect(0, 0, 500, 520);
      hitMap.forEach(({ id, screen: [x, y], rx, ry, colour }) => {
        context.globalAlpha = focus && focus !== id ? .2 : inside && id === selected ? .5 : 1;
        const gradient = context.createRadialGradient(x-rx*.28, y-ry*.25, 0, x, y, Math.max(rx, ry));
        gradient.addColorStop(0, colour);
        gradient.addColorStop(.72, colour);
        gradient.addColorStop(1, '#795052');
        context.fillStyle = gradient;
        context.beginPath();
        context.ellipse(x, y, rx, ry, 0, 0, Math.PI*2);
        context.fill();
      });
      context.globalAlpha = 1;
      if (labels && selected) {
        const pos = hitMap.find(shape => shape.id === selected).screen;
        context.font = 'bold 16px system-ui';
        context.lineWidth = 5;
        context.strokeStyle = '#eaf2ee';
        context.fillStyle = '#152f38';
        const x = Math.max(12, Math.min(355, pos[0]+14));
        const y = Math.max(25, Math.min(495, pos[1]-19));
        context.strokeText(name(selected), x, y);
        context.fillText(name(selected), x, y);
      }
      if (foodPoint) {
        const [x,y] = project([foodPoint.x, foodPoint.y, 22]);
        context.beginPath();
        context.arc(x, y, 6, 0, Math.PI*2);
        context.fillStyle = '#fbd365';
        context.fill();
        context.lineWidth = 2;
        context.strokeStyle = '#492e22';
        context.stroke();
      }
    }

    function pick(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      const x = (clientX-rect.left)*500/rect.width, y = (clientY-rect.top)*520/rect.height;
      return hitMap.findLast(shape => ((x-shape.screen[0])/shape.rx)**2 + ((y-shape.screen[1])/shape.ry)**2 <= 1)?.id;
    }
    return { draw, pick };
  }
  return { svg, renderer, routeSegments };
})();
