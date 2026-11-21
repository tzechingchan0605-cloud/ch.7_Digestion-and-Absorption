'use strict';

const PRACTICALS = {
  identify: {
    name: ['Identify the organs', '辨認消化系統的構造'],
    method: ['Select the highlighted structure’s name from the list. Check your answer, then try another structure.', '從清單選出圖中突出顯示的構造，檢查答案後再辨認另一個構造。']
  },
  foodTests: {
    name: ['Food tests', '食物測試'],
    method: ['Choose a food sample and a test. Use the observed colour or appearance to decide whether the nutrient is present.', '選擇食物樣本和試驗，根據顏色或外觀判斷樣本是否含有該種營養素。']
  },
  acidity: {
    name: ['Amylase and pH', 'pH 對澱粉酶活性的影響'],
    method: ['Choose a pH while keeping temperature at 37 °C. Sample the mixture with iodine at intervals and compare how long starch remains detectable.', '保持温度為 37 °C，選擇不同 pH。每隔一段時間，用碘液試驗檢測混合物，然後比較澱粉仍可被驗出的時間。']
  },
  temperature: {
    name: ['Amylase and temperature', '温度對澱粉酶活性的影響'],
    method: ['Keep pH at 7 and change the temperature. Use iodine to compare the time needed for starch to fall below the model’s detection threshold.', '保持 pH 為 7，改變温度。用碘液試驗比較澱粉含量降至模型檢測限以下所需的時間。']
  },
  bile: {
    name: ['Bile salts and lipase', '膽鹽和脂肪酶'],
    method: ['Compare four vessels with equal initial amounts of lipid. Vary the presence of bile salts and lipase, and compare lipid breakdown over time.', '比較四支含有等量脂質的試管。分別改變是否加入膽鹽和脂肪酶，觀察脂質隨時間分解的情況。']
  },
  dialysis: {
    name: ['Dialysis tubing model', '透析管小腸模型'],
    method: ['Put starch in the dialysis tubing. Select whether to add amylase, then test the water outside the tubing for starch and reducing sugar as time passes.', '把澱粉放入透析管，選擇是否加入澱粉酶，然後隨時間檢測透析管外的水樣本是否含有澱粉和還原糖。']
  },
  surface: {
    name: ['Surface area of the small intestine', '小腸的表面積'],
    method: ['Model the intestinal wall as a flat sheet with cylindrical villi. Change the number, height and radius of the villi, then compare surface areas.', '以平面和圓柱狀絨毛模擬小腸內壁。改變絨毛的數量、高度及半徑，再比較表面積。']
  }
};

const TESTS = {
  iodine: { name: ['Iodine test', '碘液試驗'], positive: ['Blue-black', '藍黑色'], negative: ['Yellow-brown', '黃褐色'], colours: ['#1b2850', '#b86c28'] },
  benedict: { name: ['Benedict’s test', '本立德試驗'], positive: ['Brick-red precipitate after heating', '加熱後出現磚紅色沉澱'], negative: ['Remains blue after heating', '加熱後仍呈藍色'], colours: ['#b74a2e', '#5296c4'] },
  biuret: { name: ['Biuret test', '雙縮脲試驗'], positive: ['Violet', '紫色'], negative: ['Remains blue', '仍呈藍色'], colours: ['#7747a0', '#5092b9'] },
  emulsion: { name: ['Emulsion test', '乳濁液試驗'], positive: ['Cloudy white emulsion', '出現白色混濁乳濁液'], negative: ['Clear', '保持透明'], colours: ['#e0e2da', '#f7faf9'] }
};

const TEST_SAMPLES = {
  bread: ['iodine', 'biuret'],
  glucose: ['benedict'],
  eggs: ['biuret', 'emulsion'],
  milk: ['benedict', 'biuret', 'emulsion'],
  water: []
};

const QUIZ_TOPICS = {
  organs: ['Organs and their functions', '構造與功能'],
  digestion: ['Physical and chemical digestion', '物理消化和化學消化'],
  enzymes: ['Digestive enzymes', '消化酶'],
  absorption: ['Absorption and villi', '吸收與絨毛'],
  helpers: ['Accessory structures', '附屬構造'],
  practicals: ['Practicals and calculations', '實驗與計算'],
  health: ['Digestive health', '消化系統健康']
};

const QUESTIONS = [
  {
    topic: 'organs', prompt: ['Which part carries the bolus from the pharynx to the stomach?', '哪個構造把食團由咽運送至胃？'],
    options: [['Trachea','氣管'], STRUCTURES.oesophagus.name, STRUCTURES.duodenum.name], answer: 1,
    why: ['Peristalsis in the oesophagus pushes the bolus towards the stomach.', '食道的蠕動把食團推向胃。']
  },
  {
    topic: 'organs', prompt: ['Where are faeces stored temporarily?', '糞便暫時儲存在哪裏？'],
    options: [STRUCTURES.caecum.name, STRUCTURES.ileum.name, STRUCTURES.rectum.name], answer: 2,
    why: ['The rectum stores faeces until egestion.', '糞便在排遺前暫時儲存在直腸。']
  },
  {
    topic: 'digestion', prompt: ['Which example is physical digestion?', '下列哪一項是物理消化的例子？'],
    options: [['Chewing food','咀嚼食物'], ['Breaking starch into maltose','把澱粉分解成麥芽糖'], ['Breaking proteins into peptides','把蛋白質分解成肽']], answer: 0,
    why: ['Chewing makes smaller pieces of food and increases the surface area for enzymes.', '咀嚼把食物嚼成小塊，增加食物與消化酶接觸的表面積。']
  },
  {
    topic: 'enzymes', prompt: ['What is the product of salivary amylase acting on starch?', '唾液澱粉酶催化澱粉分解，會產生甚麼？'],
    options: [['Glucose','葡萄糖'], ['Maltose','麥芽糖'], ['Glycerol','甘油']], answer: 1,
    why: ['Salivary amylase catalyses the breakdown of starch into maltose.', '唾液澱粉酶催化澱粉分解成麥芽糖。']
  },
  {
    topic: 'enzymes', prompt: ['Which enzyme breaks proteins down into peptides in the stomach?', '哪種酶在胃內催化蛋白質分解成肽？'],
    options: [['Maltase','麥芽糖酶'], ['Lipase','脂肪酶'], ['Pepsin','胃蛋白酶']], answer: 2,
    why: ['Hydrochloric acid creates an acidic medium in which pepsin works.', '氫氯酸提供酸性環境，有利胃蛋白酶發揮功用。']
  },
  {
    topic: 'absorption', prompt: ['Where do oil droplets formed in villus epithelial cells enter?', '絨毛上皮細胞內重新形成的小油滴進入哪個構造？'],
    options: [['Lacteal','乳糜管'], ['Bile duct','膽管'], ['Gastric gland','胃腺']], answer: 0,
    why: ['Fatty acids and glycerol recombine into oil droplets that enter the lacteal.', '脂肪酸和甘油在上皮細胞內重新結合成小油滴，再進入乳糜管。']
  },
  {
    topic: 'absorption', prompt: ['How does a one-cell-thick epithelium aid absorption?', '由一層細胞構成的上皮怎樣促進吸收？'],
    options: [['It increases the pH.','提高 pH。'], ['It shortens the transport distance.','縮短分子轉運的距離。'], ['It forms more bile salts.','製造更多膽鹽。']], answer: 1,
    why: ['A thinner barrier shortens the distance that food molecules cross.', '上皮越薄，食物分子需要轉運的距離便越短。']
  },
  {
    topic: 'helpers', prompt: ['Which organ produces bile?', '哪個器官製造膽汁？'],
    options: [STRUCTURES.pancreas.name, STRUCTURES.gallbladder.name, STRUCTURES.liver.name], answer: 2,
    why: ['The liver produces bile, and the gall bladder stores it temporarily.', '膽汁由肝製造，並暫時儲存在膽囊。']
  },
  {
    topic: 'practicals', prompt: ['What does blue-black iodine indicate?', '碘液變成藍黑色表示樣本含有甚麼？'],
    options: [['Starch','澱粉'], ['Reducing sugar','還原糖'], ['Protein','蛋白質']], answer: 0,
    why: ['Iodine turns blue-black when starch is present.', '碘液遇到澱粉會變成藍黑色。']
  },
  {
    topic: 'practicals', prompt: ['Why can reducing sugar appear outside the dialysis tubing?', '為甚麼透析管外會驗出還原糖？'],
    options: [['Starch crosses the tubing intact.','澱粉分子直接穿過透析管。'], ['Small sugar molecules can cross the tubing.','細小的糖分子可穿過透析管。'], ['Iodine digests starch.','碘液消化澱粉。']], answer: 1,
    why: ['Amylase breaks starch down into maltose, which is small enough to diffuse across the tubing.', '澱粉酶催化澱粉分解成麥芽糖。麥芽糖分子細小，能藉擴散穿過透析管。']
  },
  {
    topic: 'health', prompt: ['Which process is directly affected when the bile duct is blocked?', '膽管受阻時，哪個過程直接受到影響？'],
    options: [['Swallowing','吞嚥'], ['Stomach churning','胃的攪動'], ['Lipid emulsification','脂質的乳化']], answer: 2,
    why: ['Less bile reaches the duodenum, so fewer bile salts are available to emulsify lipids.', '流入十二指腸的膽汁減少，能把脂質乳化的膽鹽也隨之減少。']
  }
];

Object.assign(COPY, {
  sample: ['Sample', '樣本'], test: ['Test', '試驗'], remaining: ['Starch remaining', '剩餘澱粉'],
  predictionPositive: ['Present', '有'], predictionNegative: ['Absent', '沒有'],
  temperature: ['Temperature', '温度'], addAmylase: ['Add amylase', '加入澱粉酶'],
  starchOutside: ['Starch outside the tubing', '透析管外的澱粉'],
  sugarOutside: ['Reducing sugar outside the tubing', '透析管外的還原糖'],
  lipidProducts: ['Lipid broken down', '已分解的脂質'],
  flat: ['Flat area', '平面表面積'], totalArea: ['Surface area with villi', '有絨毛的表面積'],
  villusCount: ['Number of villi', '絨毛數量'], villusHeight: ['Villus height (mm)', '絨毛高度（mm）'],
  villusRadius: ['Villus radius (mm)', '絨毛半徑（mm）'], multiplier: ['Area ratio', '表面積比率'],
  neither: ['Neither', '兩者皆無'], bileOnly: ['Bile salts only', '只有膽鹽'],
  lipaseOnly: ['Lipase only', '只有脂肪酶'], both: ['Bile salts + lipase', '膽鹽及脂肪酶'],
  trials: ['Trials', '實驗次數'], noNutrients: ['This sample contains no modelled nutrient for this reading.', '此樣本不含這項讀數所代表的營養素。'],
  quizFinish: ['Round complete', '測驗完成'], quizNext: ['Next question', '下一題'],
  labStarted: ['Trial started.', '實驗已開始。'], time: ['Time', '時間'],
  villus: ['Villus cross-section', '絨毛橫切面'], blood: ['Blood capillaries', '微血管'], lacteal: ['Lacteal', '乳糜管'],
  epithelium: ['Epithelium', '上皮'], transport: ['Food moves through this structure by muscular action.', '食物經肌肉活動通過這個構造。'],
  more: ['Related structures', '相關構造'], healthNote: ['Condition effects are simplified for classroom comparison.', '本模型簡化各種身體狀況的影響，供課堂比較。'],
  normalPH: ['Acidic', '酸性'], alkaline: ['Alkaline', '鹼性'], finished: ['Journey complete', '消化過程已完成'],
  submit: ['Submit answer', '提交答案'], selected: ['Selected structure', '已選構造']
});

const ActivityModels = {
  foodTest(food, test) {
    return TEST_SAMPLES[food].includes(test);
  },
  starch(pH, temperature, seconds) {
    return 100 * Math.exp(-.045 * DigestionModel.amylaseActivity(pH, temperature) * seconds);
  },
  dialysis(amylase, seconds) {
    return { starchOutside: false, sugarOutside: amylase && seconds >= 40 };
  },
  surface(count, height, radius) {
    const flat = 100;
    const extra = count * 2 * Math.PI * radius * height;
    return { flat, area: flat + extra, ratio: (flat + extra) / flat };
  }
};
