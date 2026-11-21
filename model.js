/* Deterministic school-level models; arbitrary relative quantities, not human data. */
(function(root){
const vesselTypes=[{bile:false,lipase:false},{bile:true,lipase:false},{bile:false,lipase:true},{bile:true,lipase:true}];
function vessels(t){return vesselTypes.map(v=>{const radius=v.bile?.25:1;const area=1/radius;const remaining=v.lipase?100*Math.exp(-.045*area*t):100;return {...v,radius,area,remaining,product:100-remaining};});}
function pathway(site,t,physical=true,enzyme=true){const f=enzyme&&site!=='oesophagus'?1-Math.exp(-t*.12):0;return {site,time:t,pieceSize:physical&&site!=='oesophagus'?Math.max(.25,1-t*.035):1,starch:site==='stomach'?100:100*(1-f),maltose:site==='mouth'?100*f:site==='intestine'?100*(Math.exp(-t*.12)-Math.exp(-t*.24)):0,glucose:site==='intestine'?100*(1-2*Math.exp(-t*.12)+Math.exp(-t*.24)):0,protein:100*(1-(site==='mouth'?0:f)),peptides:site==='stomach'?100*f:0,amino:site==='intestine'?100*f:0,lipid:site==='intestine'?100*(1-f):100,lipidProducts:site==='intestine'?100*f:0};}
const routes={glucose:'blood',amino:'blood',water:'blood',minerals:'blood',vitamins:'blood',fat:'lymph',starch:'blocked',protein:'blocked'};
function journey(chewing, condition) {
  const colonMinutes = { constipation: 1680, diarrhoea: 240 };
  return [chewing === 'gulp' ? .08 : .33, .04, .12, 120, 25, 150, colonMinutes[condition] ?? 840, 45, 2];
}
function stageAt(durations, elapsed) {
  let time = Math.max(0, elapsed);
  for (let index = 0; index < durations.length; index++) {
    if (time < durations[index]) return { index, fraction: time / durations[index] };
    time -= durations[index];
  }
  return { index: durations.length - 1, fraction: 1 };
}
function mealReading(amount, stage, condition, food) {
  const position = stage.index + stage.fraction;
  const intestinal = Math.min(1, Math.max(0, (position - 4) / 2));
  const colonic = Math.min(1, Math.max(0, position - 6));
  const absorptionFactor = condition === 'coeliac' ? .6 : 1;
  const enzymeFactor = condition === 'pancreas' ? .55 : 1;
  const bileFactor = condition === 'gallstones' ? .48 : 1;
  const lactoseFactor = condition === 'lactose' && ['milk', 'iceCream'].includes(food) ? .35 : 1;
  return amount.map((value, index) => {
    const fraction = [
      intestinal * enzymeFactor * absorptionFactor,
      intestinal * enzymeFactor * absorptionFactor,
      intestinal * enzymeFactor * bileFactor * absorptionFactor,
      intestinal * lactoseFactor * absorptionFactor,
      intestinal * .8 + colonic * (condition === 'diarrhoea' ? .06 : .16)
    ][index];
    return value * fraction;
  });
}
function amylaseActivity(pH, temperature) {
  return Math.exp(-((pH - 7) ** 2) / 3) * Math.exp(-((temperature - 37) ** 2) / (temperature > 37 ? 180 : 620));
}
const api={vessels,pathway,routes,journey,stageAt,mealReading,amylaseActivity};root.DigestionModel=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
