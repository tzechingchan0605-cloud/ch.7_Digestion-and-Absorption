'use strict';

const COPY = {
  chapter: ['Human nutrition', '人的營養'],
  title: ['Human digestive system', '人的消化系統'],
  intro: [
    'Follow food from the mouth to the anus, or select a structure to see how it works.',
    '沿消化道追蹤食物由口腔到肛門的路徑，或選擇一個構造查看它的功能。'
  ],
  diagram: ['Anatomy', '構造圖'],
  labels: ['Diagram labels', '圖解標籤'],
  canal: ['Alimentary canal', '消化道'],
  accessory: ['Associated structures', '相關構造'],
  play: ['Play journey', '播放消化過程'],
  pause: ['Pause', '暫停'],
  resume: ['Resume journey', '繼續播放'],
  replay: ['Replay journey', '重新播放'],
  previous: ['Previous', '上一站'],
  next: ['Next', '下一站'],
  route: ['Food pathway', '食物路徑'],
  keyProcesses: ['What happens here', '主要過程'],
  related: ['Related structures', '相關構造'],
  schematic: ['Schematic illustration · Not to scale', '示意圖 · 不按比例'],
  source: ['Terminology and biology follow Chapter 7, Human Nutrition, pp. 7-3–7-30.', '用語及生物學內容參照教科書第 7 章《人的營養》，第 7-3 至 7-30 頁。']
};

const STRUCTURES = {
  mouth: {
    name: ['Mouth cavity', '口腔'],
    role: ['Ingestion and digestion', '攝食及消化'],
    summary: [
      'Teeth break food into smaller pieces and mix it with saliva. The tongue shapes the chewed food into a bolus for swallowing.',
      '牙齒把食物嚼成小塊，並與唾液混合。舌頭把嚼碎的食物搓成食團，以便吞嚥。'
    ],
    facts: [
      ['Physical digestion increases the surface area of food exposed to digestive enzymes.', '物理消化增加食物與消化酶接觸的表面積。'],
      ['Salivary amylase catalyses the breakdown of starch into maltose.', '唾液澱粉酶催化澱粉分解成麥芽糖。']
    ],
    related: ['salivary']
  },
  pharynx: {
    name: ['Pharynx', '咽'],
    role: ['Swallowing', '吞嚥'],
    summary: [
      'During swallowing, the bolus passes from the mouth cavity through the pharynx and enters the oesophagus.',
      '吞嚥時，食團從口腔經咽進入食道。'
    ],
    facts: [
      ['The epiglottis covers the opening of the trachea during swallowing.', '吞嚥時，會厭覆蓋氣管的入口。']
    ]
  },
  oesophagus: {
    name: ['Oesophagus', '食道'],
    role: ['Transport', '運送食團'],
    summary: [
      'Waves of muscle contraction called peristalsis push the bolus towards the stomach.',
      '食道肌肉作波浪式交替收縮，藉蠕動把食團推向胃。'
    ],
    facts: [
      ['Circular muscles contract behind the bolus and relax in front of it.', '食團後方的環肌收縮，前方的環肌鬆弛。']
    ]
  },
  stomach: {
    name: ['Stomach', '胃'],
    role: ['Churning and protein digestion', '攪動及蛋白質消化'],
    summary: [
      'The muscular stomach wall churns food and mixes it with gastric juice, forming semi-liquid chyme.',
      '胃壁肌肉收縮，攪動食物並與胃液混合，形成半流質狀的食糜。'
    ],
    facts: [
      ['Gastric glands secrete gastric juice. Hydrochloric acid provides an acidic environment for pepsin, which breaks down proteins into peptides.', '胃腺分泌胃液。氫氯酸提供酸性環境，讓胃蛋白酶催化蛋白質分解成肽。'],
      ['Mucus protects the stomach lining. The pyloric sphincter controls the release of chyme into the duodenum.', '黏液保護胃的內壁。幽門括約肌控制食糜進入十二指腸。']
    ]
  },
  duodenum: {
    name: ['Duodenum', '十二指腸'],
    role: ['Small intestine · Digestion', '小腸 · 消化'],
    summary: [
      'Chyme mixes with bile, pancreatic juice and intestinal juice in the first part of the small intestine.',
      '食糜在小腸的起始部分與膽汁、胰液和腸液混合。'
    ],
    facts: [
      ['Alkaline digestive fluids help neutralise the acidic chyme. Bile salts emulsify lipids into small oil droplets.', '鹼性的消化液有助中和酸性食糜。膽鹽把脂質乳化成小油滴。'],
      ['Pancreatic amylase breaks down starch into maltose. Lipase breaks down lipids into fatty acids and glycerol. Proteases act on proteins and peptides.', '胰澱粉酶催化澱粉分解成麥芽糖。脂肪酶催化脂質分解成脂肪酸和甘油。蛋白酶催化蛋白質和肽的分解。']
    ],
    related: ['liver', 'gallbladder', 'pancreas', 'bileDuct', 'pancreaticDuct']
  },
  ileum: {
    name: ['Ileum', '迴腸'],
    role: ['Small intestine · Digestion and absorption', '小腸 · 消化及吸收'],
    summary: [
      'Digestion is completed in the small intestine. Villi and microvilli give its lining a large surface area for absorption.',
      '消化在小腸內完成。小腸內壁有大量絨毛，絨毛的上皮細胞有微絨毛，大大增加吸收的表面積。'
    ],
    facts: [
      ['Enzymes on the membranes of epithelial cells complete digestion. Maltase breaks down maltose into glucose, and proteases break down peptides into amino acids.', '小腸壁上皮細胞的細胞膜附有消化酶。麥芽糖酶催化麥芽糖分解成葡萄糖，蛋白酶催化肽分解成氨基酸。'],
      ['Monosaccharides and amino acids enter blood capillaries. Fatty acids and glycerol diffuse into epithelial cells and recombine into oil droplets, which enter lacteals.', '單糖和氨基酸進入微血管。脂肪酸和甘油藉擴散進入上皮細胞，重新結合成小油滴，再進入乳糜管。']
    ]
  },
  caecum: {
    name: ['Caecum', '盲腸'],
    role: ['Large intestine', '大腸'],
    summary: [
      'Undigested material passes from the ileum into the caecum, the pouch at the start of the large intestine, and then enters the colon.',
      '未能消化的物質從迴腸進入大腸起始處的囊狀構造盲腸，然後進入結腸。'
    ],
    related: ['appendix']
  },
  colon: {
    name: ['Colon', '結腸'],
    role: ['Large intestine · Absorption', '大腸 · 吸收'],
    summary: [
      'The large intestine absorbs water, minerals and some vitamins from undigested material. The remaining material forms faeces.',
      '大腸從未能消化的物質中吸收水份、礦物質和某些維生素，餘下的物質形成糞便。'
    ]
  },
  rectum: {
    name: ['Rectum', '直腸'],
    role: ['Large intestine · Storage', '大腸 · 暫時儲存'],
    summary: [
      'Faeces are stored temporarily in the rectum before being passed out through the anus.',
      '糞便經肛門排出體外之前，會在直腸內暫時儲存。'
    ]
  },
  anus: {
    name: ['Anus', '肛門'],
    role: ['Egestion', '排遺'],
    summary: [
      'When the anal sphincter relaxes and the rectal muscles contract, faeces are expelled through the anus.',
      '肛門括約肌鬆弛、直腸肌肉收縮時，糞便經肛門排出體外。'
    ]
  },
  salivary: {
    name: ['Salivary glands', '唾腺'],
    role: ['Secretion of saliva', '分泌唾液'],
    summary: [
      'Salivary glands secrete saliva into the mouth cavity. Mucus helps lubricate food and salivary amylase starts starch digestion.',
      '唾腺把唾液分泌到口腔。黏液有助潤滑食物，唾液澱粉酶開始消化澱粉。'
    ],
    related: ['mouth']
  },
  liver: {
    name: ['Liver', '肝'],
    role: ['Production of bile', '製造膽汁'],
    summary: [
      'The liver produces bile. Bile salts emulsify lipids in the duodenum, increasing the surface area available to lipase.',
      '肝製造膽汁。膽鹽在十二指腸把脂質乳化，增加脂質與脂肪酶接觸的表面積。'
    ],
    related: ['gallbladder', 'bileDuct', 'duodenum']
  },
  gallbladder: {
    name: ['Gall bladder', '膽囊'],
    role: ['Storage of bile', '儲存膽汁'],
    summary: [
      'The gall bladder temporarily stores bile made by the liver and releases it through the bile duct into the duodenum.',
      '膽囊暫時儲存由肝製造的膽汁，並經膽管把膽汁釋放到十二指腸。'
    ],
    related: ['liver', 'bileDuct', 'duodenum']
  },
  bileDuct: {
    name: ['Bile duct', '膽管'],
    role: ['Transport of bile', '運送膽汁'],
    summary: [
      'Bile flows through the bile duct into the duodenum, where its bile salts emulsify lipids.',
      '膽汁沿膽管流入十二指腸，其中的膽鹽把脂質乳化。'
    ],
    related: ['liver', 'gallbladder', 'duodenum']
  },
  pancreas: {
    name: ['Pancreas', '胰'],
    role: ['Secretion of pancreatic juice', '分泌胰液'],
    summary: [
      'The pancreas produces pancreatic juice containing pancreatic amylase, proteases, lipase and sodium hydrogencarbonate.',
      '胰製造胰液。胰液含有胰澱粉酶、蛋白酶、脂肪酶和碳酸氫鈉。'
    ],
    related: ['pancreaticDuct', 'duodenum']
  },
  pancreaticDuct: {
    name: ['Pancreatic duct', '胰管'],
    role: ['Transport of pancreatic juice', '運送胰液'],
    summary: [
      'Pancreatic juice flows from the pancreas through the pancreatic duct into the duodenum.',
      '胰液由胰經胰管流入十二指腸。'
    ],
    related: ['pancreas', 'duodenum']
  },
  appendix: {
    name: ['Appendix', '闌尾'],
    role: ['Branch of the caecum', '與盲腸相連'],
    summary: [
      'The appendix is a narrow, blind-ended branch of the caecum. Food does not normally pass through it. Undigested material moves from the ileum into the caecum and then into the colon.',
      '闌尾是連接盲腸的一端封閉的細管。食物通常不會經過闌尾。未能消化的物質由迴腸進入盲腸，再進入結腸。'
    ],
    related: ['caecum']
  }
};

const FOOD_PATH = ['mouth', 'pharynx', 'oesophagus', 'stomach', 'duodenum', 'ileum', 'caecum', 'colon', 'rectum', 'anus'];
const ASSOCIATED = ['salivary', 'liver', 'gallbladder', 'bileDuct', 'pancreas', 'pancreaticDuct', 'appendix'];

Object.assign(COPY, {
  intro: ['Follow a meal, explore the organs and practise the experiments behind digestion and absorption.', '追蹤食物在消化道的旅程、探索各個構造，並透過實驗了解消化和吸收。'],
  simulate: ['Explore', '探索'], experiment: ['Practicals', '實驗'], quiz: ['Quiz', '測驗'],
  whole: ['Whole system', '整個消化系統'], focus: ['Follow the meal', '追蹤食物'],
  closeup: ['Close-up', '放大構造'], inside: ['Cutaway', '剖視'], acidity: ['pH labels', '顯示 pH'],
  foodMarker: ['Food marker', '食物標記'],
  speed: ['Speed', '播放速度'], auto: ['Auto', '自動'], minuteSecond: ['min/s', '分鐘／秒'],
  hourSecond: ['h/s', '小時／秒'], modelTime: ['Model time', '模型時間'],
  reset: ['Reset', '重設'], meal: ['Meal', '食物'], chewing: ['Chewing', '咀嚼'],
  chew: ['Chew thoroughly', '充分咀嚼'], gulp: ['Swallow quickly', '快速吞嚥'],
  condition: ['Model condition', '模型狀況'], playbackSettings: ['Playback settings', '播放設定'],
  molecules: ['Molecules', '分子'], graph: ['Graph', '圖表'], organ: ['Organ', '器官'],
  status: ['Live readings', '即時數據'], starch: ['Starch', '澱粉'], protein: ['Proteins', '蛋白質'],
  lipid: ['Lipids', '脂質'], sugar: ['Sugars', '糖'], water: ['Water', '水份'],
  absorbed: ['Absorbed', '已吸收'], unabsorbed: ['Unabsorbed', '未吸收'],
  absorbedWater: ['Water absorbed', '已吸收的水份'], stomachPH: ['Stomach pH', '胃內 pH'],
  progress: ['Journey progress', '消化過程進度'], illustrative: ['Illustrative model. Times and readings are not measured human data.', '教學模型的時間和數值並非人體實測數據。'],
  notebook: ['Lab notebook', '實驗記錄'], record: ['Record result', '記錄結果'], csv: ['Export CSV', '匯出 CSV'],
  print: ['Print / Save PDF', '列印／儲存 PDF'], clear: ['Clear records', '清除記錄'],
  noRecords: ['Recorded observations appear here.', '已記錄的觀察結果會在此顯示。'],
  activity: ['Activity', '活動'], setting: ['Setting', '設定'], result: ['Result', '結果'],
  method: ['Method', '步驟'], predict: ['Prediction', '預測'], observation: ['Observation', '觀察'],
  run: ['Run trial', '開始實驗'], tick: ['Advance time', '推進時間'], seconds: ['s', '秒'],
  correct: ['Correct.', '正確。'], incorrect: ['Try again.', '再試一次。'],
  submitted: ['Answer recorded.', '已記錄答案。'], start: ['Start', '開始'],
  practice: ['Practice', '練習'], round: ['Five-question round', '五題測驗'],
  check: ['Check answer', '檢查答案'], show: ['Show answer', '顯示答案'], another: ['New question', '下一題'],
  score: ['Score', '得分'], topic: ['Topic', '題目類別'], all: ['All topics', '所有類別'],
  close: ['Close', '關閉'], conclusion: ['Conclusion', '結論'], name: ['Name', '姓名'], class: ['Class', '班別']
});

const MEALS = {
  plate: { name: ['Balanced meal', '均衡膳食'], amount: [38, 22, 16, 8, 115] },
  bread: { name: ['Bread', '麪包'], amount: [34, 7, 3, 4, 24] },
  burger: { name: ['Burger and chips', '漢堡包和薯條'], amount: [53, 24, 29, 7, 107] },
  steak: { name: ['Steak', '牛扒'], amount: [0, 34, 18, 0, 88] },
  eggs: { name: ['Eggs', '雞蛋'], amount: [0, 13, 11, 0, 75] },
  milk: { name: ['Milk', '牛奶'], amount: [0, 8, 8, 12, 219] },
  apple: { name: ['Apple', '蘋果'], amount: [0, 0, 0, 18, 133] },
  beans: { name: ['Beans', '豆類'], amount: [28, 14, 2, 2, 106] },
  iceCream: { name: ['Ice cream', '雪糕'], amount: [0, 4, 11, 22, 62] },
  glucose: { name: ['Glucose drink', '葡萄糖飲品'], amount: [0, 0, 0, 20, 230] },
  water: { name: ['Water', '水'], amount: [0, 0, 0, 0, 250] }
};

const CONDITIONS = {
  normal: ['Typical digestion', '一般消化情況'],
  lactose: ['Lactose intolerance', '乳糖不耐症'],
  reflux: ['Acid reflux', '胃酸倒流'],
  coeliac: ['Coeliac disease', '乳糜瀉'],
  ulcer: ['Peptic ulcer', '消化性潰瘍'],
  gallstones: ['Blocked bile duct', '膽管受阻'],
  pancreas: ['Reduced pancreatic secretion', '胰液分泌減少'],
  constipation: ['Slow colonic transit', '結腸蠕動減慢'],
  diarrhoea: ['Fast colonic transit', '結腸蠕動加快']
};

const MOLECULAR = {
  mouth: [
    ['Starch → maltose (salivary amylase)', '澱粉 → 麥芽糖（唾液澱粉酶）'],
    ['Chewing reduces the size of food pieces.', '咀嚼把食物嚼成小塊。']
  ],
  stomach: [
    ['Proteins → peptides (pepsin)', '蛋白質 → 肽（胃蛋白酶）'],
    ['Churning mixes food with gastric juice to form chyme.', '攪動把食物與胃液混合，形成食糜。']
  ],
  duodenum: [
    ['Starch → maltose (pancreatic amylase)', '澱粉 → 麥芽糖（胰澱粉酶）'],
    ['Lipids → small oil droplets (emulsification by bile salts)', '脂質 → 小油滴（膽鹽的乳化作用）'],
    ['Lipids → fatty acids + glycerol (lipase)', '脂質 → 脂肪酸 + 甘油（脂肪酶）'],
    ['Proteins → peptides → amino acids (proteases)', '蛋白質 → 肽 → 氨基酸（蛋白酶）']
  ],
  ileum: [
    ['Maltose → glucose (maltase)', '麥芽糖 → 葡萄糖（麥芽糖酶）'],
    ['Peptides → amino acids (proteases)', '肽 → 氨基酸（蛋白酶）'],
    ['Monosaccharides and amino acids → blood capillaries', '單糖和氨基酸 → 微血管'],
    ['Fatty acids + glycerol → oil droplets in epithelial cells → lacteals', '脂肪酸 + 甘油 → 上皮細胞內的小油滴 → 乳糜管']
  ]
};

const CONDITION_NOTES = {
  lactose: ['Less lactose in milk and ice cream can be broken down into absorbable sugars.', '牛奶和雪糕中的乳糖較難分解成可吸收的糖。'],
  reflux: ['Stomach contents can move back into the oesophagus when the lower sphincter does not close tightly.', '賁門括約肌未能緊閉時，胃內物質可倒流入食道。'],
  coeliac: ['Damage to the intestinal lining reduces the surface available for nutrient absorption.', '小腸內壁受損，可供吸收營養素的表面積減少。'],
  ulcer: ['A sore in the stomach or duodenum forms where the protective lining is damaged.', '胃或十二指腸的保護層受損，可形成潰瘍。'],
  gallstones: ['Less bile reaches the duodenum, reducing emulsification in this model.', '流入十二指腸的膽汁減少，模型中的乳化作用減弱。'],
  pancreas: ['Fewer pancreatic enzymes reach the duodenum, reducing digestion in this model.', '流入十二指腸的胰液所含消化酶減少，模型中的消化作用減弱。'],
  constipation: ['Material takes longer to move through the colon.', '物質通過結腸所需的時間較長。'],
  diarrhoea: ['Material passes through the colon faster, leaving less time for water to be absorbed.', '物質較快通過結腸，水份被吸收的時間縮短。']
};
