const {test}=require('node:test');const assert=require('node:assert/strict');const M=require('../model.js');
test('bile emulsifies without hydrolysis; lipase alone works; finite shared yield',()=>{
 for(const t of [0,1,10,60,1000]){const v=M.vessels(t);assert.equal(v[0].product,0);assert.equal(v[1].product,0);assert.equal(v[1].remaining,100);assert(v[1].radius<v[0].radius);assert(v[1].area>v[0].area);v.forEach(x=>{assert(x.product>=0&&x.product<=100);assert(Math.abs(x.product+x.remaining-100)<1e-8);});if(t>0){assert(v[2].product>0);assert(v[3].product>=v[2].product);}}
 const end=M.vessels(1000);assert(Math.abs(end[2].product-end[3].product)<1e-8);
});
test('correct amylase products and gastric enzyme boundary',()=>{for(const t of [0,5,60]){const mouth=M.pathway('mouth',t);assert.equal(mouth.glucose,0);assert.equal(mouth.amino,0);assert.equal(mouth.lipidProducts,0);const stomach=M.pathway('stomach',t);assert.equal(stomach.starch,100);assert.equal(stomach.maltose,0);assert.equal(stomach.glucose,0);assert.equal(M.pathway('stomach',t,true,false).peptides,0);}assert(M.pathway('mouth',10).maltose>0);assert(M.pathway('stomach',10).peptides>0);});
test('physical digestion does not change molecule identity; intestinal sequence conserves pool',()=>{const noEnzyme=M.pathway('mouth',10,true,false);assert(noEnzyme.pieceSize<1);assert.equal(noEnzyme.starch,100);assert.equal(noEnzyme.maltose,0);assert.equal(M.pathway('oesophagus',10).pieceSize,1);assert.equal(M.pathway('oesophagus',10).starch,100);assert.equal(M.pathway('oesophagus',10).protein,100);for(const t of [0,1,10,60]){const v=M.pathway('intestine',t);assert(Math.abs(v.starch+v.maltose+v.glucose-100)<1e-8);}assert(M.pathway('intestine',10).amino>0);assert(M.pathway('intestine',10).lipidProducts>0);});
test('blood and lymph remain distinct; intact macromolecules blocked',()=>{assert.equal(M.routes.glucose,'blood');assert.equal(M.routes.amino,'blood');assert.equal(M.routes.fat,'lymph');assert.equal(M.routes.starch,'blocked');assert.equal(M.routes.protein,'blocked');});

test('meal stages and absorbable food respond to the selected model condition', () => {
  const standard = M.journey('chew', 'normal');
  const end = standard.reduce((a, b) => a + b, 0);
  assert.deepEqual(M.stageAt(standard, 0), { index: 0, fraction: 0 });
  assert.deepEqual(M.stageAt(standard, 100), { index: 3, fraction: (100 - .33 - .04 - .12) / 120 });
  assert.deepEqual(M.stageAt(standard, end), { index: 8, fraction: 1 });
  assert(M.journey('gulp', 'normal')[0] < standard[0]);
  assert(M.journey('chew', 'constipation')[6] > standard[6]);
  const meal = [4, 8, 12, 16, 88];
  const finalStage = { index: 8, fraction: 1 };
  const ordinary = M.mealReading(meal, finalStage, 'normal', 'milk');
  assert(M.mealReading(meal, finalStage, 'gallstones', 'milk')[2] < ordinary[2]);
  assert(M.mealReading(meal, finalStage, 'lactose', 'milk')[3] < ordinary[3]);
  assert(M.mealReading(meal, finalStage, 'diarrhoea', 'milk')[4] < ordinary[4]);
  assert(M.amylaseActivity(7, 37) > M.amylaseActivity(3, 37));
  assert(M.amylaseActivity(7, 37) > M.amylaseActivity(7, 75));
});
