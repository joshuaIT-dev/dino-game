/* ══ dino.js ══ */

/* ══ SPRITES ══ */
const SPR_PLAYER=`<svg width="60" height="64" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
  <rect x="4" y="6" width="7" height="5" fill="#4ecb71"/>
  <rect x="8" y="4" width="3" height="3" fill="#4ecb71"/>
  <rect x="9" y="2" width="4" height="3" fill="#4ecb71"/>
  <rect x="12" y="2" width="1" height="1" fill="#fff"/>
  <rect x="12" y="4" width="2" height="1" fill="#2a8040"/>
  <rect x="5" y="5" width="1" height="2" fill="#2a8040"/>
  <rect x="7" y="4" width="1" height="2" fill="#2a8040"/>
  <rect x="2" y="8" width="3" height="2" fill="#4ecb71"/>
  <rect x="1" y="9" width="2" height="1" fill="#4ecb71"/>
  <rect x="5" y="11" width="2" height="3" fill="#4ecb71"/>
  <rect x="9" y="11" width="2" height="3" fill="#4ecb71"/>
  <rect x="4" y="13" width="3" height="1" fill="#2a8040"/>
  <rect x="8" y="13" width="3" height="1" fill="#2a8040"/>
</svg>`;

const ECOL=[
  {body:'#7dde7d',dark:'#4aaa4a',eye:'#ffff66'},
  {body:'#c8a96e',dark:'#8a6030',eye:'#ff8'},
  {body:'#4a7ee0',dark:'#22448a',eye:'#aaddff'},
  {body:'#e06a20',dark:'#8a3000',eye:'#ffcc00'},
  {body:'#8B1A1A',dark:'#5a0000',eye:'#ff4444',boss:true,crown:'#ffdd00'},
  {body:'#5a1a8b',dark:'#2a0044',eye:'#cc88ff'},
  {body:'#0e9a8a',dark:'#004a44',eye:'#aaffee'},
  {body:'#6a5a00',dark:'#2a2400',eye:'#ffdd44'},
  {body:'#1a5a8b',dark:'#002244',eye:'#aaddff'},
  {body:'#0a000a',dark:'#000',eye:'#ff0088',boss:true,crown:'#ffaa00'},
];
function makeSpr(c,size=60){
  const s=size/16,h=Math.round(size*1.06);
  const cr=c.boss&&c.crown?`<rect x="${3*s}" y="0" width="${s}" height="${2*s}" fill="${c.crown}"/>
    <rect x="${5*s}" y="0" width="${s}" height="${s}" fill="${c.crown}"/>
    <rect x="${7*s}" y="0" width="${s}" height="${2*s}" fill="${c.crown}"/>`:'' ;
  return `<svg width="${size}" height="${h}" viewBox="0 0 ${size} ${h}" xmlns="http://www.w3.org/2000/svg">
    ${cr}
    <rect x="${4*s}" y="${6*s}" width="${7*s}" height="${5*s}" fill="${c.body}"/>
    <rect x="${4*s}" y="${4*s}" width="${3*s}" height="${3*s}" fill="${c.body}"/>
    <rect x="${2*s}" y="${2*s}" width="${4*s}" height="${3*s}" fill="${c.body}"/>
    <rect x="${2*s}" y="${2*s}" width="${s}" height="${s}" fill="${c.eye}"/>
    <rect x="${s}" y="${4*s}" width="${3*s}" height="${s}" fill="${c.body}"/>
    <rect x="${s}" y="${5*s}" width="${s}" height="${s}" fill="#fff"/>
    <rect x="${3*s}" y="${5*s}" width="${s}" height="${s}" fill="#fff"/>
    <rect x="${10*s}" y="${8*s}" width="${3*s}" height="${2*s}" fill="${c.body}"/>
    <rect x="${5*s}" y="${11*s}" width="${2*s}" height="${3*s}" fill="${c.body}"/>
    <rect x="${9*s}" y="${11*s}" width="${2*s}" height="${3*s}" fill="${c.body}"/>
    <rect x="${4*s}" y="${13*s}" width="${3*s}" height="${s}" fill="${c.dark}"/>
    <rect x="${8*s}" y="${13*s}" width="${3*s}" height="${s}" fill="${c.dark}"/>
  </svg>`;
}

const STAGES=[
    {name:'FOREST FRINGE',icon:'🌿',sprIdx:0,world:1,isBoss:false,
    passive:{label:'🌿 Camouflage',desc:'20% dodge'},res:{},
    levels:[
      {lv:1,sub:'Leaf Gecko',    hp:20, atk:[8,14],  attr:{hp:3,atk:0,res:0}},
      {lv:2,sub:'Fern Crawler',  hp:28, atk:[10,17], attr:{hp:4,atk:1,res:0}},
      {lv:3,sub:'Vine Spitter',  hp:36, atk:[12,20], attr:{hp:3,atk:0,res:2}},
      {lv:4,sub:'Bark Hound',    hp:44, atk:[14,24], attr:{hp:5,atk:1,res:0}},
      {lv:5,sub:'Grove Warden',  hp:60, atk:[18,30], attr:{hp:6,atk:2,res:2},mini:true},
    ],
    // Vine Spitter poisons you when it lands a hit at low HP
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=40){g.bossSpecialFired=true;g.activeEffects.push({type:'playerPoison',turns:2,hpPerTurn:6});renderEffects();setMsg('🌿 GROVE WARDEN spits venom! -6/turn!','var(--green)');}}},
  {name:'DESERT DUNES',icon:'🏜',sprIdx:1,world:1,isBoss:false,
    passive:{label:'🏜 Sand Armor',desc:'-15% dmg taken'},res:{burn:0.5},
    levels:[
      {lv:1,sub:'Sand Skink',    hp:32, atk:[12,20], attr:{hp:4,atk:1,res:0}},
      {lv:2,sub:'Dune Crawler',  hp:42, atk:[14,24], attr:{hp:5,atk:0,res:2}},
      {lv:3,sub:'Heat Drake',    hp:52, atk:[17,28], attr:{hp:4,atk:2,res:0}},
      {lv:4,sub:'Sand Titan',    hp:62, atk:[20,32], attr:{hp:6,atk:1,res:2}},
      {lv:5,sub:'Dune Tyrant',   hp:80, atk:[24,40], attr:{hp:8,atk:2,res:3},mini:true},
    ],
    // Dune Tyrant enrages, boosting its attack
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=50){g.bossSpecialFired=true;g.rageMult=(g.rageMult||1)*1.4;setMsg('🏜 DUNE TYRANT kicks up a sandstorm! ATK ×1.4!','var(--yellow)');}}},
  {name:'COASTAL CLIFFS',icon:'🌊',sprIdx:2,world:1,isBoss:false,
    passive:{label:'🌊 Aqua Shell',desc:'Resists Burn 40%'},res:{burn:0.6},
    levels:[
      {lv:1,sub:'Cliff Iguana',  hp:46, atk:[15,24], attr:{hp:5,atk:1,res:0}},
      {lv:2,sub:'Sea Runner',    hp:58, atk:[17,28], attr:{hp:5,atk:2,res:0}},
      {lv:3,sub:'Storm Skimmer', hp:70, atk:[20,32], attr:{hp:6,atk:0,res:3}},
      {lv:4,sub:'Wave Stalker',  hp:82, atk:[23,37], attr:{hp:7,atk:2,res:2}},
      {lv:5,sub:'Tide Lord',     hp:100,atk:[28,46], attr:{hp:10,atk:3,res:3},mini:true},
    ],
    // Tide Lord heals itself periodically
    spFn:g=>{if(g.bossAtkCounter%3===0&&g.bossAtkCounter>0){g.bossHP=Math.min(g.bossMaxHP,g.bossHP+15);setMsg('🌊 TIDE LORD rides a wave! Healed +15 HP!','var(--blue)');}}},
  {name:'VOLCANIC VALLEY',icon:'🌋',sprIdx:3,world:1,isBoss:false,
    passive:{label:'🌋 Lava Skin',desc:'Immune Burn, Poison ½'},res:{burn:0,poison:0.5},
    levels:[
      {lv:1,sub:'Magma Hatch',   hp:60, atk:[20,32], attr:{hp:6,atk:2,res:0}},
      {lv:2,sub:'Lava Crawler',  hp:76, atk:[23,37], attr:{hp:7,atk:2,res:2}},
      {lv:3,sub:'Cinder Drake',  hp:92, atk:[27,43], attr:{hp:7,atk:1,res:3}},
      {lv:4,sub:'Eruption Beast',hp:110,atk:[31,48], attr:{hp:8,atk:3,res:2}},
      {lv:5,sub:'Volcano Titan', hp:130,atk:[36,56], attr:{hp:12,atk:4,res:4},mini:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=50){g.bossSpecialFired=true;g.activeEffects.push({type:'playerBurn',turns:3,hpPerTurn:10});renderEffects();setMsg('🌋 VOLCANO TITAN burns you! -10/turn for 3 turns!','var(--orange)');}}},
  {name:'EMBER KEEP',icon:'👑',sprIdx:4,world:1,isBoss:true,
    passive:{label:'🔥 Flame Armor',desc:'Immune Burn · Poison -50% · ATK×1.6 at 50% HP'},
    res:{burn:0,poison:0.5},
    levels:[
      {lv:1,sub:'Ember Guard',   hp:90, atk:[12,20],attr:{hp:8,atk:2,res:2}},
      {lv:2,sub:'Flame Knight',  hp:110,atk:[14,22],attr:{hp:8,atk:3,res:2}},
      {lv:3,sub:'Inferno Drake', hp:130,atk:[16,26],attr:{hp:10,atk:3,res:3}},
      {lv:4,sub:'Blaze Colossus',hp:155,atk:[18,28],attr:{hp:12,atk:4,res:4}},
      {lv:5,sub:'☠ EMBER KING',  hp:280,atk:[22,36],attr:{hp:20,atk:6,res:5},boss:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=50){g.bossSpecialFired=true;g.rageMult=(g.rageMult||1)*1.8;setMsg('🔥 EMBER KING ENRAGES! ATK ×1.8!','var(--orange)');}}},
  {name:'SHADOW CAVERNS',icon:'🌑',sprIdx:5,world:2,isBoss:false,
    passive:{label:'🌑 Shadow Step',desc:'30% dodge · Half HP -50%'},res:{halfhp:0.5},
    levels:[
      {lv:1,sub:'Cave Lurker',   hp:120,atk:[14,22],attr:{hp:8,atk:2,res:2}},
      {lv:2,sub:'Dark Raptor',   hp:140,atk:[16,25],attr:{hp:9,atk:3,res:2}},
      {lv:3,sub:'Shadow Drake',  hp:162,atk:[18,28],attr:{hp:10,atk:3,res:3}},
      {lv:4,sub:'Void Stalker',  hp:186,atk:[20,32],attr:{hp:11,atk:4,res:3}},
      {lv:5,sub:'Night Sovereign',hp:215,atk:[23,36],attr:{hp:14,atk:5,res:4},mini:true},
    ]},
  {name:'FROST PEAKS',icon:'❄',sprIdx:6,world:2,isBoss:false,
    passive:{label:'❄ Cryo Shell',desc:'Immune Freeze · Paralyze -60%'},res:{freeze:0,paralyze:0.4},
    levels:[
      {lv:1,sub:'Ice Skink',     hp:145,atk:[16,26],attr:{hp:9,atk:3,res:2}},
      {lv:2,sub:'Frost Raptor',  hp:168,atk:[18,29],attr:{hp:10,atk:3,res:3}},
      {lv:3,sub:'Blizzard Drake',hp:192,atk:[20,33],attr:{hp:11,atk:4,res:3}},
      {lv:4,sub:'Glacier Titan', hp:218,atk:[23,37],attr:{hp:13,atk:4,res:4}},
      {lv:5,sub:'Cryo Colossus', hp:250,atk:[26,42],attr:{hp:16,atk:5,res:5},mini:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=50){g.bossSpecialFired=true;g.activeEffects.push({type:'playerParalyze',turns:2});renderEffects();setMsg('❄ CRYO COLOSSUS paralyzes you for 2 turns!','var(--cyan)');}}},
  {name:'POISON SWAMP',icon:'☠',sprIdx:7,world:2,isBoss:false,
    passive:{label:'☠ Venom Master',desc:'Immune Poison · Burn -40%'},res:{poison:0,burn:0.6},
    levels:[
      {lv:1,sub:'Swamp Toad',    hp:172,atk:[18,30],attr:{hp:10,atk:3,res:3}},
      {lv:2,sub:'Venom Crawler', hp:198,atk:[21,34],attr:{hp:11,atk:4,res:3}},
      {lv:3,sub:'Toxic Drake',   hp:226,atk:[24,38],attr:{hp:13,atk:4,res:4}},
      {lv:4,sub:'Plague Beast',  hp:256,atk:[27,43],attr:{hp:14,atk:5,res:4}},
      {lv:5,sub:'Venom Queen',   hp:290,atk:[31,48],attr:{hp:18,atk:6,res:5},mini:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=60){g.bossSpecialFired=true;g.activeEffects.push({type:'playerPoison',turns:4,hpPerTurn:14});renderEffects();setMsg('☠ VENOM QUEEN mega-venom! -14/turn!','var(--purple)');}}},
  {name:'CHAOS WASTES',icon:'🌪',sprIdx:8,world:2,isBoss:false,
    passive:{label:'🌪 Chaos Aura',desc:'All DoTs -50% · Shuffles inv every 2 atks'},res:{poison:0.5,burn:0.5,paralyze:0.5},
    levels:[
      {lv:1,sub:'Chaos Skink',   hp:200,atk:[22,35],attr:{hp:11,atk:4,res:3}},
      {lv:2,sub:'Void Crawler',  hp:228,atk:[25,39],attr:{hp:13,atk:5,res:4}},
      {lv:3,sub:'Rift Drake',    hp:258,atk:[28,44],attr:{hp:14,atk:5,res:4}},
      {lv:4,sub:'Null Titan',    hp:290,atk:[32,50],attr:{hp:16,atk:6,res:5}},
      {lv:5,sub:'Omega Herald',  hp:330,atk:[36,56],attr:{hp:20,atk:7,res:6},mini:true},
    ],
    spFn:g=>{if(g.bossAtkCounter%2===0&&g.bossAtkCounter>0){const keys=Object.keys(g.inv).filter(k=>g.inv[k]>0);if(keys.length>=2){shuffle(keys);const a=keys[0],b=keys[1];const t=g.inv[a];g.inv[a]=g.inv[b];g.inv[b]=t;renderInventory();setMsg('🌪 CHAOS AURA shuffles your inventory!','var(--orange)');}}}},
  {name:'OMEGA CITADEL',icon:'💀',sprIdx:9,world:2,isBoss:true,
    passive:{label:'🌟 Omega Force',desc:'All res 50% · Erases powerups at 50% · ATK×2 at 30%'},
    res:{poison:0.5,burn:0.5,paralyze:0.5,freeze:0.5,halfhp:0.3},
    levels:[
      {lv:1,sub:'Omega Shard',    hp:240,atk:[26,42],attr:{hp:14,atk:5,res:4}},
      {lv:2,sub:'Omega Sentinel', hp:275,atk:[30,48],attr:{hp:16,atk:6,res:5}},
      {lv:3,sub:'Omega Warden',   hp:315,atk:[34,54],attr:{hp:18,atk:7,res:6}},
      {lv:4,sub:'Omega Commander',hp:360,atk:[39,62],attr:{hp:22,atk:8,res:7}},
      {lv:5,sub:'☠ OMEGA REX',   hp:600,atk:[46,76],attr:{hp:0,atk:0,res:0},boss:true},
    ],
    
    spFn:g=>{
      if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=50){g.bossSpecialFired=true;Object.keys(g.inv).forEach(k=>g.inv[k]=0);renderInventory();setMsg('🌟 OMEGA REX erases ALL powerups!','var(--red)');}
      if(g.bossHP/g.bossMaxHP*100<=30&&!g.omegaRageTwo){g.omegaRageTwo=true;g.rageMult=(g.rageMult||1)*2;setMsg('🌟 OMEGA REX — FINAL FORM! ATK×2!','var(--yellow)');}
    }},
    {name:'AETHER REACTOR',icon:'⚡',sprIdx:10,world:3,isBoss:false,
    passive:{label:'⚡ Overcharge',desc:'Immune Paralyze · Skills cooldown +1 turn'},res:{paralyze:0},
    levels:[
      {lv:1,sub:'Plasma Hound',   hp:400,atk:[42,65],attr:{hp:24,atk:8,res:6}},
      {lv:2,sub:'Volt Striker',   hp:450,atk:[46,72],attr:{hp:26,atk:9,res:6}},
      {lv:3,sub:'Lightning Drake',hp:510,atk:[52,80],attr:{hp:28,atk:10,res:7}},
      {lv:4,sub:'Laser Golem',    hp:580,atk:[58,90],attr:{hp:32,atk:11,res:8}},
      {lv:5,sub:'Storm Core',     hp:660,atk:[65,102],attr:{hp:36,atk:13,res:9},mini:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=50){g.bossSpecialFired=true;g.activeEffects.push({type:'playerEnergyLock',turns:3});renderEffects();setMsg('⚡ STORM CORE locks your special skills for 3 turns!','var(--yellow)');}}},
  {name:'NEVER-HELL',icon:'🔥',sprIdx:11,world:3,isBoss:false,
    passive:{label:'🔥 Soul Burn',desc:'Immune Burn · Heals 10% of dealt dmg'},res:{burn:0},
    levels:[
      {lv:1,sub:'Magma Imp',      hp:520,atk:[55,85],attr:{hp:30,atk:11,res:7}},
      {lv:2,sub:'Hellhound Alpha',hp:590,atk:[62,96],attr:{hp:34,atk:12,res:8}},
      {lv:3,sub:'Inferno Drake',  hp:670,atk:[70,108],attr:{hp:38,atk:14,res:9}},
      {lv:4,sub:'Pyroclast Fiend',hp:760,atk:[78,122],attr:{hp:42,atk:16,res:10}},
      {lv:5,sub:'Lord of Cinders',hp:870,atk:[88,138],attr:{hp:48,atk:18,res:12},mini:true},
    ],
    spFn:g=>{if(g.bossAtkCounter%3===0&&g.bossAtkCounter>0){g.bossHP=Math.min(g.bossMaxHP,g.bossHP+40);setMsg('🔥 LORD OF CINDERS consumes your ash! Healed +40 HP!','var(--red)');}}},
  {name:'ANCIENT RUINS',icon:'⏳',sprIdx:12,world:3,isBoss:false,
    passive:{label:'⏳ Time Warp',desc:'Immune Freeze · Deducts 1 item on hit'},res:{freeze:0},
    levels:[
      {lv:1,sub:'Stone Golem',    hp:600,atk:[64,98],attr:{hp:34,atk:13,res:8}},
      {lv:2,sub:'Ruins Gazer',    hp:680,atk:[72,110],attr:{hp:38,atk:15,res:9}},
      {lv:3,sub:'Relic Drake',    hp:770,atk:[80,124],attr:{hp:42,atk:16,res:10}},
      {lv:4,sub:'Aeon Guardian',  hp:860,atk:[90,140],attr:{hp:46,atk:18,res:11}},
      {lv:5,sub:'Clockwork Lich', hp:980,atk:[102,158],attr:{hp:52,atk:21,res:13},mini:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=50){g.bossSpecialFired=true;g.activeEffects.push({type:'playerSlowed',turns:2});renderEffects();setMsg('⏳ CLOCKWORK LICH breaks the timeline! You are slowed for 2 turns!','var(--amber)');}}},
  {name:'ABYSSAL TRENCH',icon:'👁️',sprIdx:13,world:3,isBoss:false,
    passive:{label:'👁️ Mind Wipe',desc:'All DoTs -60% · 20% to reflect debuffs'},res:{poison:0.4,burn:0.4,paralyze:0.4,freeze:0.4},
    levels:[
      {lv:1,sub:'Deep Stalker',   hp:1050,atk:[110,168],attr:{hp:46,atk:18,res:12}},
      {lv:2,sub:'Kraken Hatchling',hp:1160,atk:[120,185],attr:{hp:50,atk:20,res:13}},
      {lv:3,sub:'Abyss Leviathan',hp:1280,atk:[132,204],attr:{hp:56,atk:22,res:14}},
      {lv:4,sub:'Eldritch Horror',hp:1420,atk:[146,226],attr:{hp:62,atk:25,res:16}},
      {lv:5,sub:'Cthulhu Spawn',  hp:1600,atk:[162,252],attr:{hp:70,atk:28,res:18},mini:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=40){g.bossSpecialFired=true;g.activeEffects.push({type:'blindness',turns:3});renderEffects();setMsg('👁️ CTHULHU SPAWN blinds you! 50% miss chance for 3 turns!','var(--purple)');}}},
  {name:'COSMIC ASCENSION',icon:'🌌',sprIdx:14,world:3,isBoss:true,
    passive:{label:'🌌 Astral Barrier',desc:'All res 70% · Counter-attacks on item use'},
    res:{poison:0.3,burn:0.3,paralyze:0.3,freeze:0.3,halfhp:0.1},
    levels:[
      {lv:1,sub:'Star Fragment',  hp:1750,atk:[178,274],attr:{hp:65,atk:24,res:15}},
      {lv:2,sub:'Nebula Golem',   hp:1920,atk:[195,302],attr:{hp:72,atk:27,res:17}},
      {lv:3,sub:'Quasar Sentinel',hp:2100,atk:[212,332],attr:{hp:80,atk:30,res:19}},
      {lv:4,sub:'Infinity Engine',hp:2300,atk:[232,364],attr:{hp:88,atk:34,res:21}},
      {lv:5,sub:'👑 COSMOS PRIME',hp:3500,atk:[260,410],attr:{hp:0,atk:0,res:0},boss:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=50){g.bossSpecialFired=true;g.bossAtkMin=Math.floor(g.bossAtkMin*1.5);g.bossAtkMax=Math.floor(g.bossAtkMax*1.5);setMsg('🌌 COSMOS PRIME collapses space! ATK permanently multiplied by 1.5×!','var(--magenta)');}
  }},
  {name:'CHRONO WHIRLPOOL',icon:'🌀',sprIdx:15,world:4,isBoss:false,
    passive:{label:'🌀 Time Distortion',desc:'All DoTs -70% · Drastically extends enemy turn speed'},res:{poison:0.3,burn:0.3,paralyze:0.3,freeze:0.3},
    levels:[
      {lv:1,sub:'Temporal Wisp',  hp:3800,atk:[280,440],attr:{hp:220,atk:36,res:22}},
      {lv:2,sub:'Aeon Stalker',   hp:4150,atk:[305,480],attr:{hp:240,atk:40,res:24}},
      {lv:3,sub:'Paradox Drake',  hp:4550,atk:[335,525],attr:{hp:260,atk:44,res:26}},
      {lv:4,sub:'Rift Weaver',    hp:5000,atk:[370,575],attr:{hp:290,atk:48,res:28}},
      {lv:5,sub:'Time Devourer',  hp:5500,atk:[410,635],attr:{hp:320,atk:54,res:32},mini:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=50){g.bossSpecialFired=true;g.activeEffects.push({type:'playerSlowed',turns:3});renderEffects();setMsg('🌀 TIME DEVOURER distorts your timeline! You are slowed for 3 turns!','var(--cyan)');}}},
  {name:'NEBULA GRAVEYARD',icon:'🪦',sprIdx:16,world:4,isBoss:false,
    passive:{label:'🪦 Cosmic Decay',desc:'Immune Poison · Reduces player Max HP by 2% each attack'},res:{poison:0},
    levels:[
      {lv:1,sub:'Dust Wraith',    hp:4800,atk:[350,550],attr:{hp:260,atk:45,res:25}},
      {lv:2,sub:'Spectral Husk',  hp:5250,atk:[385,600],attr:{hp:280,atk:50,res:27}},
      {lv:3,sub:'Supernova Corpse',hp:5750,atk:[425,655],attr:{hp:310,atk:55,res:29}},
      {lv:4,sub:'Eclipsed Titan', hp:6300,atk:[470,720],attr:{hp:340,atk:60,res:32}},
      {lv:5,sub:'Astral Reaper',  hp:7000,atk:[520,795],attr:{hp:380,atk:68,res:36},mini:true},
    ],
    spFn:g=>{if(g.bossAtkCounter%3===0&&g.bossAtkCounter>0){g.playerMaxHP=Math.max(100,g.playerMaxHP-50);if(g.playerHP>g.playerMaxHP)g.playerHP=g.playerMaxHP;setMsg('🪦 ASTRAL REAPER rots your life force! Permanent -50 Max HP!','var(--grey)');}}},
  {name:'QUANTUM MATRIX',icon:'🔮',sprIdx:17,world:4,isBoss:false,
    passive:{label:'🔮 Glitch Shield',desc:'35% chance to completely evade player skills'},res:{halfhp:0.2},
    levels:[
      {lv:1,sub:'Data Shard',     hp:5400,atk:[400,620],attr:{hp:300,atk:50,res:28}},
      {lv:2,sub:'Cyber Sentinel', hp:5900,atk:[440,680],attr:{hp:330,atk:55,res:30}},
      {lv:3,sub:'Vector Dragon',  hp:6450,atk:[485,745],attr:{hp:360,atk:60,res:33}},
      {lv:4,sub:'Logic Devourer', hp:7100,atk:[535,820],attr:{hp:400,atk:66,res:36}},
      {lv:5,sub:'Matrix Overlord',hp:7800,atk:[590,900],attr:{hp:440,atk:74,res:40},mini:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=60){g.bossSpecialFired=true;const keys=Object.keys(g.inv).filter(k=>g.inv[k]>0);if(keys.length>0){const target=keys[Math.floor(Math.random()*keys.length)];g.inv[target]=0;renderInventory();setMsg('🔮 MATRIX OVERLORD reformats reality! One of your item stacks was erased!','var(--purple)');}}}},
  {name:'STARLIGHT FORGE',icon:'☀️',sprIdx:18,world:4,isBoss:false,
    passive:{label:'☀️ Solar Radiance',desc:'Immune Burn · Converts 20% of taken dmg into heal'},res:{burn:0},
    levels:[
      {lv:1,sub:'Solar Flare',    hp:6200,atk:[460,710],attr:{hp:360,atk:58,res:32}},
      {lv:2,sub:'Magma Golem',    hp:6750,atk:[505,780],attr:{hp:390,atk:64,res:35}},
      {lv:3,sub:'Ignis Leviathan',hp:7350,atk:[555,855],attr:{hp:430,atk:70,res:38}},
      {lv:4,sub:'Plasma Colossus',hp:8000,atk:[610,935],attr:{hp:470,atk:78,res:42}},
      {lv:5,sub:'Helios Monarch', hp:9000,atk:[670,1025],attr:{hp:520,atk:86,res:46},mini:true},
    ],
    spFn:g=>{if(g.bossAtkCounter%2===0&&g.bossAtkCounter>0){g.bossHP=Math.min(g.bossMaxHP,g.bossHP+250);setMsg('☀️ HELIOS MONARCH flares up! Absorbed heat to restore +250 HP!','var(--orange)');}}},
  {name:'THE VOID CORE',icon:'🕳️',sprIdx:19,world:4,isBoss:true,
    passive:{label:'👁️ Event Horizon',desc:'All res 80% · Disables player healing items at 40% HP'},
    res:{poison:0.2,burn:0.2,paralyze:0.2,freeze:0.2,halfhp:0},
    levels:[
      {lv:1,sub:'Gravity Well',   hp:7000,atk:[530,810],attr:{hp:200,atk:70,res:38}},
      {lv:2,sub:'Singularity Eye',hp:7650,atk:[585,890],attr:{hp:220,atk:78,res:42}},
      {lv:3,sub:'Antimatter Beast',hp:8400,atk:[645,980],attr:{hp:245,atk:86,res:46}},
      {lv:4,sub:'Reality Shredder',hp:9200,atk:[710,1080],attr:{hp:270,atk:95,res:50}},
      {lv:5,sub:'🚨 SINGULARITY ALPHA',hp:15000,atk:[820,1250],attr:{hp:0,atk:0,res:0},boss:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=40){g.bossSpecialFired=true;g.bossAtkMin=Math.floor(g.bossAtkMin*1.8);g.bossAtkMax=Math.floor(g.bossAtkMax*1.8);setMsg('🕳️ SINGULARITY ALPHA collapses time and gravity! ATK boosted by 1.8×!','var(--red)');}}
  },
  {name:'FORGE OF GENESIS',icon:'🛠️',sprIdx:20,world:5,isBoss:true,
    passive:{label:'🛠️ Iron Creator',desc:'All res 85% · Reflects 20% of physical damage back to player'},
    res:{poison:0.15,burn:0.15,paralyze:0.15,freeze:0.15,halfhp:0},
    levels:[
      {lv:1,sub:'Anvil Sentinel', hp:16500,atk:[900,1350],attr:{hp:600,atk:100,res:55}},
      {lv:2,sub:'Molten Spark',   hp:18000,atk:[980,1480],attr:{hp:650,atk:110,res:58}},
      {lv:3,sub:'Creation Pillar',hp:19800,atk:[1080,1620],attr:{hp:700,atk:120,res:62}},
      {lv:4,sub:'World Shaper',   hp:22000,atk:[1200,1800],attr:{hp:780,atk:135,res:66}},
      {lv:5,sub:'🔨 VULCAN THE ARCHITECT',hp:28000,atk:[1400,2100],attr:{hp:0,atk:0,res:0},boss:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=50){g.bossSpecialFired=true;g.bossAtkMin=Math.floor(g.bossAtkMin*1.5);g.bossAtkMax=Math.floor(g.bossAtkMax*1.5);setMsg('🛠️ VULCAN strikes his cosmic anvil! ATK permanently increased by 1.5×!','var(--orange)');}}},

  {name:'ECHOES OF TIME',icon:'⏳',sprIdx:21,world:5,isBoss:true,
    passive:{label:'⏳ Infinite Loop',desc:'Immune Paralyze/Freeze · Rewinds 1 turn of player actions every 4 turns'},
    res:{paralyze:0,freeze:0,poison:0.2,burn:0.2,halfhp:0},
    levels:[
      {lv:1,sub:'Past Fragment',  hp:20000,atk:[1100,1650],attr:{hp:720,atk:125,res:60}},
      {lv:2,sub:'Present Husk',  hp:22000,atk:[1200,1800],attr:{hp:780,atk:135,res:64}},
      {lv:3,sub:'Future Specter', hp:24200,atk:[1320,1980],attr:{hp:840,atk:145,res:68}},
      {lv:4,sub:'Aeon Warden',    hp:26800,atk:[1460,2200],attr:{hp:920,atk:160,res:72}},
      {lv:5,sub:'⏳ CHRONOS THE TIMELESS',hp:34000,atk:[1680,2500],attr:{hp:0,atk:0,res:0},boss:true},
    ],
    spFn:g=>{if(g.bossAtkCounter%4===0&&g.bossAtkCounter>0){g.bossHP=Math.min(g.bossMaxHP,g.bossHP+1500);setMsg('⏳ CHRONOS reverses the timeline! Restored +1500 HP!','var(--cyan)');}}},

  {name:'ABYSS OF THE LOST',icon:'👁️',sprIdx:22,world:5,isBoss:true,
    passive:{label:'👁️ Void Madness',desc:'All DoTs -80% · Skills cost double resource/cooldown'},
    res:{poison:0.2,burn:0.2,paralyze:0.2,freeze:0.2,halfhp:0},
    levels:[
      {lv:1,sub:'Insanity Creep', hp:24500,atk:[1350,2050],attr:{hp:840,atk:150,res:70}},
      {lv:2,sub:'Terror tendril', hp:27000,atk:[1480,2250],attr:{hp:900,atk:160,res:74}},
      {lv:3,sub:'Dread Eye',      hp:29800,atk:[1620,2460],attr:{hp:980,atk:175,res:78}},
      {lv:4,sub:'Grave Whisper',  hp:33000,atk:[1800,2700],attr:{hp:1060,atk:190,res:82}},
      {lv:5,sub:'🐙 CTHULHU LEGACY',hp:40000,atk:[2100,3150],attr:{hp:0,atk:0,res:0},boss:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=40){g.bossSpecialFired=true;g.activeEffects.push({type:'playerParalyze',turns:2},{type:'blindness',turns:3});renderEffects();setMsg('👁️ CTHULHU LEGACY inflicts absolute madness! Paralyzed and Blinded!','var(--purple)');}}},

  {name:' astral PANTHEON',icon:'💫',sprIdx:23,world:5,isBoss:true,
    passive:{label:'💫 Celestial Shield',desc:'90% status condition resistance · Breaks 1 random item per turn'},
    res:{poison:0.1,burn:0.1,paralyze:0.1,freeze:0.1,halfhp:0},
    levels:[
      {lv:1,sub:'Solar Aspect',   hp:30000,atk:[1650,2500],attr:{hp:1000,atk:180,res:85}},
      {lv:2,sub:'Lunar Aspect',   hp:33000,atk:[1820,2750],attr:{hp:1080,atk:195,res:90}},
      {lv:3,sub:'Stellar Aspect', hp:36500,atk:[2000,3000],attr:{hp:1160,atk:210,res:95}},
      {lv:4,sub:'Cosmic Jury',    hp:40500,atk:[2220,3350],attr:{hp:1260,atk:230,res:100}},
      {lv:5,sub:'🌌 AMATERASU SUPREME',hp:46000,atk:[2500,3800],attr:{hp:0,atk:0,res:0},boss:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=50){g.bossSpecialFired=true;const keys=Object.keys(g.inv).filter(k=>g.inv[k]>0);keys.forEach(k=>{g.inv[k]=Math.floor(g.inv[k]/2);});renderInventory();setMsg('💫 AMATERASU releases a cosmic pulse! All inventory item stacks are halved!','var(--magenta)');}}},

  {name:'END OF REALITY',icon:'👑',sprIdx:24,world:5,isBoss:true,
    passive:{label:'🌌 Alpha & Omega',desc:'Immune to all negative status effects and item debuffs'},
    res:{poison:0,burn:0,paralyze:0,freeze:0,halfhp:0},
    levels:[
      {lv:1,sub:'The First Light',hp:38000,atk:[2100,3200],attr:{hp:1400,atk:250,res:110}},
      {lv:2,sub:'The Last Dark', hp:42000,atk:[2320,3550],attr:{hp:1500,atk:270,res:115}},
      {lv:3,sub:'Fate Weaver',    hp:46500,atk:[2580,3950],attr:{hp:1640,atk:295,res:122}},
      {lv:4,sub:'Void Genesis',   hp:51500,atk:[2850,4350],attr:{hp:1800,atk:325,res:130}},
      {lv:5,sub:'🌟 ETERNUS PRIME',hp:75000,atk:[3500,5300],attr:{hp:0,atk:0,res:0},boss:true},
    ],
    spFn:g=>{if(!g.bossSpecialFired&&g.bossHP/g.bossMaxHP*100<=30){g.bossSpecialFired=true;g.bossHP=g.bossMaxHP;g.bossAtkMin=Math.floor(g.bossAtkMin*2);g.bossAtkMax=Math.floor(g.bossAtkMax*2);setMsg('👑 ETERNUS PRIME triggers Big Bang! Health fully restored and damage multiplied by 2×!','var(--yellow)');}}},
];

const PLAYER_PASSIVES=[
  {label:'🩹 Resilience', desc:'Heal +5 HP on correct answer'},
  {label:'⚔ Sharpened',  desc:'+10 bonus dmg on correct answers'},
  {label:'🔥 Battle Aura',desc:'+14 dmg + heal 6 HP on correct'},
  {label:'🌟 Heroic Soul',desc:'+20 dmg, 9 HP heal, 15% crit ×2.5'},
];

const PU={
  heal:    {icon:'💚',name:'HEAL',    color:'var(--green)', border:'#4ecb71',desc:'+30 HP'},
  double:  {icon:'⚡',name:'2× DMG',  color:'var(--yellow)',border:'#f5c842',desc:'Next hit ×2'},
  freeze:  {icon:'❄', name:'FREEZE',  color:'var(--blue)',  border:'#4a9eff',desc:'Skip Enemy turn'},
  poison:  {icon:'☠', name:'POISON',  color:'var(--purple)',border:'#b06aff',desc:'-12/turn×4'},
  shield:  {icon:'🛡',name:'SHIELD',  color:'var(--teal)',  border:'#2dd4c8',desc:'50% absorb×3'},
  fiftyf:  {icon:'🎯',name:'50/50',   color:'var(--orange)',border:'#ff7a30',desc:'Remove 2 wrong'},
  burn:    {icon:'🔥',name:'BURN',    color:'var(--orange)',border:'#ff7a30',desc:'-8/turn×3'},
  halfhp:  {icon:'💀',name:'HALF HP', color:'var(--red)',   border:'#e84545',desc:'Halve Enemy HP'},
  paralyze:{icon:'⚡',name:'PARALYZE',color:'var(--cyan)',  border:'#00e5ff',desc:'Enemy loses 2 turns'},
  revive:  {icon:'🍖',name:'REVIVE',  color:'var(--pink)',  border:'#ff6eb4',desc:'Auto-revive×1'},
  regen:   {icon:'💉',name:'REGEN',    color:'var(--green)', border:'#4ecb71',desc:'+8 HP/turn×3'},
  mirror:  {icon:'🪞',name:'MIRROR',   color:'var(--teal)',  border:'#2dd4c8',desc:'Reflect dmg back×1'},
  rage:    {icon:'😤',name:'RAGE',     color:'var(--red)',   border:'#e84545',desc:'ATK×2 but -5HP/turn×3'},
  stun:    {icon:'💫',name:'STUN',     color:'var(--yellow)',border:'#f5c842',desc:'Enemy skips 3 turns'},
  leech:   {icon:'🩸',name:'LEECH',    color:'var(--purple)',border:'#b06aff',desc:'Steal 15HP from Enemy'},
  barrier: {icon:'🧱',name:'BARRIER',  color:'var(--blue)',  border:'#4a9eff',desc:'Block next 2 hits fully'},
  divine:  {icon:'🌟',name:'DIVINE',  color:'var(--yellow)',border:'#f5c842',desc:'Full HP restore'},
  overload:{icon:'⚡',name:'OVERLOAD',color:'var(--yellow)',border:'#f5c842',desc:'Triple DMG next hit'},
  gamble:  {icon:'🎲',name:'GAMBLE',  color:'var(--pink)',  border:'#ff6eb4',desc:'Random powerful effect'},
  nuke:    {icon:'💣',name:'NUKE',    color:'var(--red)',   border:'#e84545',desc:'Deal 50% max HP as DMG'},
  oracle:  {icon:'🔮',name:'ORACLE',  color:'var(--purple)',border:'#b06aff',desc:'Reveals correct answer'},
  insight: {icon:'👁',name:'INSIGHT', color:'var(--blue)',  border:'#4a9eff',desc:'+30s to timer'},
};

const Q={
  easy:[
    {type:'Math',q:'What is 6 × 7?',a:'42',c:['42','45','48','36']},
    {type:'Math',q:'What is 15 + 28?',a:'43',c:['41','43','45','47']},
    {type:'Math',q:'What is 100 ÷ 4?',a:'25',c:['20','25','30','40']},
    {type:'Math',q:'What is 9 × 8?',a:'72',c:['63','72','81','64']},
    {type:'Math',q:'What is 50 - 17?',a:'33',c:['33','37','31','27']},
    {type:'Math',q:'What is 12 × 5?',a:'60',c:['55','65','60','50']},
    {type:'Math',q:'What is 81 ÷ 9?',a:'9',c:['7','8','9','11']},
    {type:'Math',q:'What is 3³?',a:'27',c:['9','27','81','18']},
    {type:'Math',q:'What is 14 × 3?',a:'42',c:['38','40','42','45']},
    {type:'Math',q:'What is 120 ÷ 6?',a:'20',c:['15','18','20','24']},
    {type:'Math',q:'What is 7 + 8 × 2?',a:'23',c:['30','23','22','15']},
    {type:'Math',q:'What is 2⁴?',a:'16',c:['8','12','16','32']},
    {type:'Trivia',q:'What is the hottest planet in our solar system?',a:'Venus',c:['Mercury','Venus','Mars','Jupiter']},
    {type:'Trivia',q:'Which planet is famous for its big red spot?',a:'Jupiter',c:['Mars','Jupiter','Saturn','Neptune']},
    {type:'Trivia',q:'What is the approximate age of the universe (billion years)?',a:'13.8',c:['4.5','10.2','13.8','20.1']},
    {type:'Trivia',q:'Which galaxy is closest to our Milky Way?',a:'Andromeda',c:['Andromeda','Triangulum','Sombrero','Centaurus']},
    {type:'Trivia',q:'What type of star is our Sun?',a:'Yellow Dwarf',c:['Red Giant','White Dwarf','Yellow Dwarf','Blue Supergiant']},
    {type:'Trivia',q:'How many moons does Mars have?',a:'2',c:['0','1','2','4']},
    {type:'Trivia',q:'What is the invisible force that keeps planets in orbit?',a:'Gravity',c:['Magnetism','Gravity','Dark Matter','Centrifugal']},
    {type:'Trivia',q:'Which planet rolls on its side like a bowling ball?',a:'Uranus',c:['Saturn','Uranus','Neptune','Pluto']},
    {type:'Trivia',q:'What is the boundary around a black hole called?',a:'Event Horizon',c:['Singularity','Event Horizon','Dark Zone','Accretion Disk']},
    {type:'Trivia',q:'In what year did humans first land on the Moon?',a:'1969',c:['1965','1969','1972','1975']},
    {type:'Trivia',q:'What is the largest moon in our solar system?',a:'Ganymede',c:['Titan','Ganymede','Europa','Io']},
    {type:'Trivia',q:'Which planet was officially downgraded to a dwarf planet in 2006?',a:'Pluto',c:['Ceres','Eris','Pluto','Makemake']},
    {type:'Trivia',q:'What are comets mostly made of?',a:'Ice and Dust',c:['Rock and Iron','Liquid Gas','Ice and Dust','Pure Carbon']},
  ],
  medium:[
    {type:'Math',q:'What is 17 × 13?',a:'221',c:['201','211','221','231']},
    {type:'Math',q:'What is 256 ÷ 16?',a:'16',c:['14','16','18','20']},
    {type:'Math',q:'What is 45% of 200?',a:'90',c:['85','90','95','100']},
    {type:'Math',q:'What is √144?',a:'12',c:['11','12','13','14']},
    {type:'Math',q:'What is 2⁸?',a:'256',c:['128','256','512','64']},
    {type:'Math',q:'If 3x+9=24, x=?',a:'5',c:['3','4','5','6']},
    {type:'Math',q:'What is 15% of 340?',a:'51',c:['48','51','54','57']},
    {type:'Math',q:'What is 23²?',a:'529',c:['484','506','529','551']},
    {type:'Math',q:'Degrees in a triangle?',a:'180',c:['90','120','180','360']},
    {type:'Math',q:'What is 7 × 11 × 3?',a:'231',c:['210','231','252','273']},
    {type:'Math',q:'What is 2³ + 3²?',a:'17',c:['13','17','19','21']},
    {type:'Math',q:'Area circle r=7 (π≈3.14)?',a:'153.86',c:['43.96','153.86','154','78']},
    {type:'Trivia',q:'Atomic number 79 = ?',a:'Gold',c:['Silver','Platinum','Gold','Copper']},
    {type:'Trivia',q:'Who painted the Mona Lisa?',a:'Leonardo da Vinci',c:['Michelangelo','Raphael','Leonardo da Vinci','Caravaggio']},
    {type:'Trivia',q:'Hardest natural substance?',a:'Diamond',c:['Ruby','Quartz','Diamond','Sapphire']},
    {type:'Trivia',q:'Year Titanic sank?',a:'1912',c:['1910','1911','1912','1915']},
    {type:'Trivia',q:'Bones in adult human body?',a:'206',c:['196','206','216','226']},
    {type:'Trivia',q:'Powerhouse of the cell?',a:'Mitochondria',c:['Nucleus','Ribosome','Mitochondria','Vacuole']},
    {type:'Trivia',q:'Most of Earth atmosphere?',a:'Nitrogen',c:['Oxygen','Carbon dioxide','Nitrogen','Argon']},
    {type:'Trivia',q:'Who wrote Romeo and Juliet?',a:'Shakespeare',c:['Dickens','Shakespeare','Chaucer','Milton']},
    {type:'Trivia',q:'Olympics first held in?',a:'Greece',c:['Italy','Egypt','Greece','Turkey']},
    {type:'Trivia',q:'Longest river in world?',a:'Nile',c:['Amazon','Yangtze','Nile','Mississippi']},
    {type:'Trivia',q:'Speed of light (km/s)?',a:'300,000',c:['30,000','300,000','3,000,000','3,000']},
    {type:'Trivia',q:'Chemical symbol for gold?',a:'Au',c:['Go','Gd','Au','Ag']},
    {type:'Trivia',q:'Chambers in human heart?',a:'4',c:['2','3','4','6']},
  ],
  hard:[
    {type:'Math',q:'347 × 23 = ?',a:'7981',c:['7681','7781','7881','7981']},
    {type:'Math',q:'4x² - 36 = 0 → x = ?',a:'3',c:['2','3','4','6']},
    {type:'Math',q:'log₂(128) = ?',a:'7',c:['5','6','7','8']},
    {type:'Math',q:'Derivative of x³?',a:'3x²',c:['x²','2x','3x²','3x³']},
    {type:'Math',q:'Prime numbers below 20?',a:'8',c:['6','7','8','9']},
    {type:'Math',q:'sin(θ)=0.5 → θ = ?',a:'30°',c:['30°','45°','60°','90°']},
    {type:'Math',q:'17 mod 5 = ?',a:'2',c:['1','2','3','4']},
    {type:'Math',q:'Interior angles pentagon?',a:'540°',c:['360°','450°','540°','720°']},
    {type:'Math',q:'(3+4i)(3−4i) = ?',a:'25',c:['7','25','12+0i','16']},
    {type:'Math',q:'Fibonacci 10th term?',a:'55',c:['34','44','55','65']},
    {type:'Math',q:'∫x² dx = ?',a:'x³/3 + C',c:['x³+C','2x+C','x³/3+C','3x²+C']},
    {type:'Math',q:'e to 2 decimal places?',a:'2.72',c:['1.41','2.72','3.14','2.61']},
    {type:'Math',q:'1+2+3+…+100 = ?',a:'5050',c:['4950','5000','5050','5100']},
    {type:'Trivia',q:'Treaty ending WWI?',a:'Treaty of Versailles',c:['Treaty of Paris','Treaty of Utrecht','Treaty of Versailles','Treaty of Vienna']},
    {type:'Trivia',q:'Chandrasekhar limit?',a:'1.4 solar masses',c:['0.8','1.0','1.4 solar masses','2.0']},
    {type:'Trivia',q:'Most abundant element?',a:'Hydrogen',c:['Helium','Oxygen','Carbon','Hydrogen']},
    {type:'Trivia',q:'Magna Carta signed?',a:'1215',c:['1215','1066','1492','1776']},
    {type:'Trivia',q:'Largest organ in body?',a:'Skin',c:['Liver','Brain','Intestines','Skin']},
    {type:'Trivia',q:'First person on Moon?',a:'Neil Armstrong',c:['Buzz Aldrin','Yuri Gagarin','Neil Armstrong','John Glenn']},
    {type:'Trivia',q:'Element symbol Hg?',a:'Mercury',c:['Hydrogen','Gold','Silver','Mercury']},
    {type:'Trivia',q:'Berlin Wall fell?',a:'1989',c:['1987','1988','1989','1991']},
    {type:'Trivia',q:'Most native speaker language?',a:'Mandarin Chinese',c:['English','Spanish','Hindi','Mandarin Chinese']},
    {type:'Trivia',q:'Developed general relativity?',a:'Einstein',c:['Newton','Bohr','Einstein','Planck']},
    {type:'Trivia',q:'Moons of Jupiter (2023)?',a:'95',c:['67','79','92','95']},
    {type:'Trivia',q:'Half-life of Carbon-14?',a:'5,730 years',c:['1,000 years','5,730 years','10,000 years','14,000 years']},
    {type:'Trivia',q:'What is the name of the largest known volcano in the solar system?',a:'Olympus Mons',c:['Mauna Kea','Olympus Mons','Tharsis Montes','Caloris Montes']},
    {type:'Trivia',q:'Which moon of Saturn has active geysers shooting water ice into space?',a:'Enceladus',c:['Titan','Enceladus','Mimas','Iapetus']},
    {type:'Trivia',q:'What is the theoretical maximum mass limit for a white dwarf star?',a:'Chandrasekhar Limit',c:['Schwarzschild Limit', 'Chandrasekhar Limit', 'Oppenheimer Limit', 'Eddington Limit']},
    {type:'Trivia',q:'Which planet experiences the fastest wind speeds, reaching up to 2,100 km/h?',a:'Neptune',c:['Jupiter','Saturn','Uranus','Neptune']},
    {type:'Trivia',q:'What is the primary gas found in the atmosphere of Venus?',a:'Carbon Dioxide',c:['Nitrogen','Carbon Dioxide','Sulfur Dioxide','Methane']},
    {type:'Trivia',q:'What hypothetical region of space-time is the mathematical opposite of a black hole?',a:'White Hole',c:['Wormhole','Warp Bubble','White Hole','Dark Void']},
    {type:'Trivia',q:'How many Earth days does it take for Mercury to complete one full rotation on its axis?',a:'59',c:['24','59','88','176']},
    {type:'Trivia',q:'What is the name of the first interstellar object ever detected passing through our solar system?',a:'Oumuamua',c:['Borisov','Oumuamua','Halley','Churyumov']},
    {type:'Trivia',q:'Which constellation contains the supergiant star Betelgeuse?',a:'Orion',c:['Ursa Major','Orion','Taurus','Scorpius']},
    {type:'Trivia',q:'What is the active, intensely luminous core of a distant young galaxy powered by a supermassive black hole called?',a:'Quasar',c:['Pulsar','Magnetar','Quasar','Nebula']}
  ],
};

let G={};
function freshState(diff){
  return {
    diff,curStage:0,curLevel:0,stagesCleared:0,
    pickDone:false,
    levelsCleared:Array(STAGES.length).fill(0),
    pHP:0,pATK:0,pRES:0,playerMaxHP:500,playerHP:500,
    bossHP:0,bossMaxHP:0,
    bossSpecialFired:false,rageMult:1,bossAtkCounter:0,omegaRageTwo:false,
    score:0,streak:0,combo:1,
    inv:{heal:1,double:0,freeze:0,poison:0,shield:0,fiftyf:0,burn:0,halfhp:0,paralyze:0,revive:0,regen:0,mirror:0,rage:0,stun:0,leech:0,barrier:0,divine:0,overload:0,gamble:0,nuke:0,oracle:0,insight:0,},
    activeEffects:[],eliminated:[],
    animLock:false,timerVal:0,timerInterval:null,
    qUsed:{easy:new Set(),medium:new Set(),hard:new Set()},
    currentQ:null,pendingRewardCount:0,
  };
}

function show(id){document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on'));document.getElementById(id).classList.add('on');}
function showDiff(){show('s-diff');}
/* ---------- SAVE / LOAD ---------- */
const SAVE_KEY='dqb3_save';
function hasSave(){try{return !!localStorage.getItem(SAVE_KEY);}catch(e){return false;}}
function saveGame(){
  if(!G||!G.diff)return;
  try{
    const s=JSON.parse(JSON.stringify(G));
    // Sets can't be JSON'd  convert to arrays
    s.qUsed={easy:[...G.qUsed.easy],medium:[...G.qUsed.medium],hard:[...G.qUsed.hard]};
    // runtime-only stuff we don't need
    s.timerInterval=null;s.animLock=false;s.currentQ=null;
    localStorage.setItem(SAVE_KEY,JSON.stringify(s));
  }catch(e){}
}
function loadGame(){
  try{
    const raw=localStorage.getItem(SAVE_KEY);if(!raw)return false;
    const s=JSON.parse(raw);
    G=s;
    G.qUsed={
      easy:new Set(s.qUsed?.easy||[]),
      medium:new Set(s.qUsed?.medium||[]),
      hard:new Set(s.qUsed?.hard||[]),
    };
    G.timerInterval=null;G.animLock=false;G.currentQ=null;
    if(G.pickDone===undefined)G.pickDone=false;
    return true;
  }catch(e){return false;}
}
function clearSave(){try{localStorage.removeItem(SAVE_KEY);}catch(e){}}

function fullReset(){clearSave();show('s-title');refreshTitle();}
function quitToTitle(){saveGame();show('s-title');refreshTitle();}


/* Called by the START button on the title screen */
function onStartClicked(){
  // Starting a brand new game wipes any old save
  clearSave();
  showDiff();
}
/* Called by CONTINUE button */
function continueGame(){
  if(!loadGame()){refreshTitle();return;}
  buildMap();
  show('s-map');
}
/* Update the title screen based on whether a save exists */
function refreshTitle(){
  const cont=document.getElementById('continue-btn');
  const note=document.getElementById('saved-note');
  if(hasSave()){
    let info='';
    try{const s=JSON.parse(localStorage.getItem(SAVE_KEY));
      info=`Saved run: ${s.diff.toUpperCase()} &middot; S${(s.curStage||0)+1}-L${(s.curLevel||0)+1} &middot; Score ${s.score||0}`;
    }catch(e){info='You have a saved run in progress';}
    cont.style.display='block';
    note.style.display='block';
    note.innerHTML=info;
  }else{
    cont.style.display='none';
    note.style.display='none';
  }
}

function startGame(diff){
  G=freshState(diff);
  applyDailyGifts();
  // Pick starting loadout BEFORE the map
  G._startupPick=true;
  goStartupPick();
}
function goStartupPick(){
  G._picked=[];
  G._pickTarget=5;                 // pick 4 at start (change to 3 or 5 if you like)
  const allTypes=Object.keys(PU);
  shuffle(allTypes);
  G._pickChoices=allTypes.slice(0,10);   // offer 8, choose 4
  G._pickMode='startup';
  renderPickPU();
  show('s-pickpu');
}



let _curWorld=0; // 0-indexed currently-viewed world

function buildMap(){
  document.getElementById('mhp').textContent=G.playerMaxHP;
  document.getElementById('matk').textContent='+'+G.pATK;
  document.getElementById('mres').textContent=G.pRES+'%';
  document.getElementById('mscore').textContent=G.score;

  const track=document.getElementById('map-track');
  track.innerHTML='';
  const worldColors=['wl-1','wl-2','wl-3','wl-4','wl-5'];
  const worldNames=[
    'WORLD 1  THE KNOWN LANDS','WORLD 2  THE DARK BEYOND',
    'WORLD 3  THE ABYSS','WORLD 4  THE VOID FRONTIER',
    'WORLD 5  THE CELESTIAL PANTHEON'
  ];

  for(let world=1;world<=5;world++){
    const slide=document.createElement('div');
    slide.className='map-slide';
    const label=document.createElement('div');
    label.className='world-label '+worldColors[world-1];
    label.textContent=worldNames[world-1];
    slide.appendChild(label);

    const stages=document.createElement('div');
    stages.className='slide-stages';
    const stageIndices=STAGES.map((s,i)=>i).filter(i=>STAGES[i].world===world);
    const wrap=document.createElement('div');
    wrap.style.cssText='display:flex;align-items:center;justify-content:center;gap:0;width:100%;flex-wrap:wrap';

    stageIndices.forEach((si,pos)=>{
      if(pos>0){
        const conn=document.createElement('div');
        const prevDone=G.levelsCleared[stageIndices[pos-1]]>=5;
        conn.className='path-connector'+(prevDone?' done':'');
        wrap.appendChild(conn);
      }
      const cleared=G.levelsCleared[si]>=5,current=G.curStage===si,locked=G.curStage<si,stg=STAGES[si];
      const node=document.createElement('div');
      let cls='stage-node ';
      if(cleared)cls+='sn-done ';else if(current)cls+='sn-active ';else cls+='sn-locked locked ';
      if(si===4)cls+='sn-boss5 ';if(si===9)cls+='sn-boss10 ';
      node.className=cls.trim();
      node.innerHTML=`<div class="sn-orb"><div class="sn-num">S${si+1}</div><div class="sn-icon">${stg.icon}</div></div><div class="sn-label" style="color:${stg.isBoss?(si===4?'var(--orange)':'var(--red)'):'var(--teal)'}">${stg.name}</div><div class="sn-pips" id="pips-${si}"></div><div class="reward-badge">${stg.isBoss?'Boss Rewards!':'Level Drops'}</div>`;
      if(!locked)node.addEventListener('click',()=>showStageLevels(si));
      wrap.appendChild(node);
    });
    stages.appendChild(wrap);

    // sublevel row for the current stage if it's in this world
    if(stageIndices.includes(G.curStage)){
      const slRow=document.createElement('div');
      slRow.className='sublevel-row';
      const stg=STAGES[G.curStage];
      stg.levels.forEach((lv,li)=>{
        const done=G.levelsCleared[G.curStage]>li,cur=G.levelsCleared[G.curStage]===li,locked2=G.levelsCleared[G.curStage]<li;
        const bub=document.createElement('div');
        bub.className='sl-bubble '+(done?'sl-done':cur?'sl-cur':'sl-locked');
        bub.textContent='L'+(li+1);bub.title=lv.sub;
        if(!locked2)bub.addEventListener('click',()=>{if(cur)enterLevel(G.curStage,li);});
        slRow.appendChild(bub);
      });
      stages.appendChild(slRow);
    }

    slide.appendChild(stages);
    track.appendChild(slide);
  }

  // fill pips
  STAGES.forEach((stg,si)=>{
    const pipsEl=document.getElementById('pips-'+si);if(!pipsEl)return;
    stg.levels.forEach((_,li)=>{
      const pip=document.createElement('div');
      const done=G.levelsCleared[si]>li,cur=G.curStage===si&&G.levelsCleared[si]===li;
      pip.className='pip'+(done?' p-done':cur?' p-cur':'');
      pipsEl.appendChild(pip);
    });
  });

  // dots
  const dots=document.getElementById('map-dots');dots.innerHTML='';
  for(let w=0;w<5;w++){
    const d=document.createElement('div');
    const worldUnlocked=STAGES.some((s,i)=>s.world===w+1 && G.curStage>=i);
    d.className='map-dot'+(w===_curWorld?' active':'')+(worldUnlocked?'':' locked');
    if(worldUnlocked)d.onclick=()=>goToWorld(w);
    dots.appendChild(d);
  }

  // jump to the world containing the current stage on first build
  _curWorld=STAGES[G.curStage].world-1;
  updateSlide();
}

function updateSlide(){
  const track=document.getElementById('map-track');
  track.style.transform=`translateX(-${_curWorld*100}%)`;
  document.getElementById('map-prev').disabled=_curWorld<=0;
  // can't view worlds that are fully locked
  const maxWorld=STAGES[G.curStage].world-1;
  document.getElementById('map-next').disabled=_curWorld>=maxWorld;
  document.querySelectorAll('.map-dot').forEach((d,i)=>d.classList.toggle('active',i===_curWorld));
}

function slideWorld(dir){
  const maxWorld=STAGES[G.curStage].world-1;
  const next=_curWorld+dir;
  if(next<0||next>maxWorld)return;
  _curWorld=next;updateSlide();
}

function goToWorld(w){
  const maxWorld=STAGES[G.curStage].world-1;
  if(w<0||w>maxWorld)return;
  _curWorld=w;updateSlide();
}

/*swipe for phones*/
(function(){
  let sx=0,sy=0;
  const wrap=document.querySelector('.map-slider-wrap');
  if(!wrap)return;
  document.addEventListener('touchstart',e=>{
    if(!document.getElementById('s-map').classList.contains('on'))return;
    sx=e.touches[0].clientX;sy=e.touches[0].clientY;
  },{passive:true});
  document.addEventListener('touchend',e=>{
    if(!document.getElementById('s-map').classList.contains('on'))return;
    const dx=e.changedTouches[0].clientX-sx;
    const dy=e.changedTouches[0].clientY-sy;
    if(Math.abs(dx)>60 && Math.abs(dx)>Math.abs(dy)){
      slideWorld(dx<0?1:-1);
    }
  },{passive:true});
})();


function showStageLevels(si){if(si!==G.curStage)return;enterLevel(si,G.levelsCleared[si]);}
function enterLevel(si,li){G.curStage=si;G.curLevel=li;show('s-game');loadLevel(si,li);}

function adjHex(hex,amt){const n=parseInt(hex.slice(1),16);return `rgb(${Math.min(255,((n>>16)&0xff)+amt)},${Math.min(255,((n>>8)&0xff)+amt)},${Math.min(255,(n&0xff)+amt)})`;}

function drawBattleBg(canvas,isBoss,worldIdx){
  const w=canvas.width=canvas.offsetWidth||400,h=canvas.height=canvas.offsetHeight||260;
  const ctx=canvas.getContext('2d'),pal=[{sky:'#0a1a2a',ground:'#1a3a1a',hill:'#0f2a0f',star:'#cceeff'},{sky:'#1a0a2a',ground:'#2a1a0a',hill:'#1a0f06',star:'#ffeecc'}];
  const p=pal[Math.min(worldIdx,1)];
  ctx.clearRect(0,0,w,h);
  const sg=ctx.createLinearGradient(0,0,0,h*.7);sg.addColorStop(0,p.sky);sg.addColorStop(1,adjHex(p.sky,20));ctx.fillStyle=sg;ctx.fillRect(0,0,w,h*.7);
  ctx.fillStyle=p.star;for(let i=0;i<20;i++)ctx.fillRect((i*137+worldIdx*31)%w,(i*79)%(h*.5),i%3?1:2,i%3?1:2);
  ctx.fillStyle=p.hill;ctx.beginPath();ctx.moveTo(0,h*.65);for(let x=0;x<=w;x+=10)ctx.lineTo(x,h*.65-Math.abs(Math.sin(x*.04+worldIdx)*18)-Math.abs(Math.sin(x*.07)*10));ctx.lineTo(w,h*.7);ctx.lineTo(0,h*.7);ctx.closePath();ctx.fill();
  const gg=ctx.createLinearGradient(0,h*.7,0,h);gg.addColorStop(0,p.ground);gg.addColorStop(1,'#000');ctx.fillStyle=gg;ctx.fillRect(0,h*.7,w,h*.3);
  ctx.fillStyle='rgba(0,0,0,0.2)';for(let y=Math.floor(h*.7);y<h;y+=4)ctx.fillRect(0,y,w,1);
  if(isBoss){for(let i=0;i<3;i++){const cx=(w/4)*(i+1),rg=ctx.createRadialGradient(cx,h,0,cx,h,40);rg.addColorStop(0,'rgba(255,100,0,0.35)');rg.addColorStop(1,'rgba(255,50,0,0)');ctx.fillStyle=rg;ctx.fillRect(0,0,w,h);}}
}

let _walkId=null,_walkX=0;
function drawWalkInside(canvas,worldIdx,isBoss){
  const w=canvas.width=canvas.offsetWidth||400,h=canvas.height=canvas.offsetHeight||260;
  const ctx=canvas.getContext('2d'),pal=[{sky:'#0a1a2a',mid:'#0f2a0f',ground:'#1a3a1a',star:'#cceeff',tree:'#0a2a0a'},{sky:'#1a0a2a',mid:'#1a0f06',ground:'#2a1a0a',star:'#ffeecc',tree:'#1a0a00'}];
  const p=pal[Math.min(worldIdx,1)];const gY=h*.68;
  ctx.clearRect(0,0,w,h);
  const sg=ctx.createLinearGradient(0,0,0,gY);sg.addColorStop(0,p.sky);sg.addColorStop(1,adjHex(p.sky,20));ctx.fillStyle=sg;ctx.fillRect(0,0,w,gY);
  ctx.fillStyle=p.star;for(let i=0;i<18;i++)ctx.fillRect((i*97+3)%w,(i*61)%(gY*.6),i%4?1:2,1);
  const hOff=_walkX*.25;ctx.fillStyle=p.mid;ctx.beginPath();ctx.moveTo(0,gY);
  for(let x=0;x<=w+16;x+=10){const hx=((x-hOff%180+180)%180)/180;ctx.lineTo(x,gY-32-Math.abs(Math.sin(hx*Math.PI*4+worldIdx)*24));}
  ctx.lineTo(w,gY);ctx.closePath();ctx.fill();
  const gg=ctx.createLinearGradient(0,gY,0,h);gg.addColorStop(0,p.ground);gg.addColorStop(1,'#000');ctx.fillStyle=gg;ctx.fillRect(0,gY,w,h-gY);
  ctx.fillStyle='rgba(0,0,0,0.18)';for(let y=Math.floor(gY);y<h;y+=4)ctx.fillRect(0,y,w,1);
  for(let i=0;i<6;i++){const tx=((i*120-_walkX*.6)%(w+60)+w+60)%(w+60)-30,th=30+(i%3)*12;ctx.fillStyle='rgba(0,0,0,0.35)';ctx.fillRect(tx+5,gY-th+12,5,th-12);ctx.fillStyle=p.tree;for(let by=0;by<th-12;by+=4){const bw=18-by*.38;ctx.fillRect(tx+7-bw/2,gY-th+by,bw,4);}}
  if(isBoss){const lY=gY+5;const lg=ctx.createLinearGradient(0,lY,0,lY+10);lg.addColorStop(0,'rgba(255,90,0,.65)');lg.addColorStop(1,'rgba(180,20,0,.2)');ctx.fillStyle=lg;for(let i=0;i<3;i++){const lx=((i*150-_walkX)%(w+90)+w+90)%(w+90)-45;ctx.fillRect(lx,lY,85,10);}}
}

function playWalkInBattle(si,li,onDone){
  const stg=STAGES[si],lv=stg.levels[li];
  const worldIdx=stg.world-1,isBoss=!!(lv.boss||lv.mini||stg.isBoss);
  const layer=document.getElementById('walk-layer'),bc=document.getElementById('battle-content');
  layer.style.display='block';bc.classList.add('walk-hidden');
  const wc=document.getElementById('walk-canvas');
  document.getElementById('walk-player-spr').innerHTML=SPR_PLAYER;
  document.getElementById('walk-enemy-spr').innerHTML='';
  document.getElementById('walk-enemy-spr').classList.remove('visible');
  document.getElementById('walk-label').textContent=`S${si+1}-L${li+1}: ${lv.sub}`;
  _walkX=0;cancelAnimationFrame(_walkId);
  let frame=0;const TOTAL=50,ENEMY_AT=32;let eShown=false;
  function animate(){
    _walkX+=3.5;frame++;
    wc.width=wc.offsetWidth||400;wc.height=wc.offsetHeight||260;
    drawWalkInside(wc,worldIdx,isBoss);
    const pct=Math.min(frame/TOTAL,1);
    const dEl=document.getElementById('walk-player-spr');
    dEl.style.left=(-15+pct*(wc.width*0.28))+'px';
    dEl.style.bottom=(wc.height*.28)+'px';
    if(frame>=ENEMY_AT&&!eShown){
      eShown=true;
      const eEl=document.getElementById('walk-enemy-spr');
      eEl.innerHTML=makeSpr(ECOL[stg.sprIdx],isBoss?90:68);
      eEl.style.bottom=(wc.height*.28)+'px';
      eEl.classList.add('visible');
    }
    if(frame<TOTAL+12){_walkId=requestAnimationFrame(animate);}
    else{cancelAnimationFrame(_walkId);setTimeout(()=>{layer.style.display='none';bc.classList.remove('walk-hidden');onDone();},200);}
  }
  animate();
}

function loadLevel(si,li){
  const stg=STAGES[si],lv=stg.levels[li];
  const isBoss=!!(lv.boss||lv.mini||stg.isBoss),worldIdx=stg.world-1;
  const lvScale  = 1 + (li  * 0.18);
  const stgScale = 1 + (si  * 0.14);
  const calcHP = lv.boss
    ? Math.round(G.playerMaxHP * 5.0 * stgScale)
    : lv.mini
    ? Math.round(G.playerMaxHP * 2.2 * stgScale)
    : Math.round(G.playerMaxHP * lvScale * stgScale);
  G.bossHP=calcHP;G.bossMaxHP=calcHP;

  // NEW — scale enemy ATK the same way HP scales, so offense keeps pace
  const atkTier = lv.boss ? 1.5 : lv.mini ? 1.2 : 1.0;
  G.bossAtkMin = Math.round(lv.atk[0] * stgScale * atkTier);
  G.bossAtkMax = Math.round(lv.atk[1] * stgScale * atkTier);

  G.bossSpecialFired=false;G.rageMult=1;G.bossAtkCounter=0;G.activeEffects=[];G.eliminated=[];

  document.getElementById('player-spr').innerHTML=SPR_PLAYER;
  const bEl=document.getElementById('boss-spr');
  bEl.innerHTML=makeSpr(ECOL[stg.sprIdx],isBoss?90:68);
  document.getElementById('g-stage').textContent=`S${si+1}-L${li+1}`;
  document.getElementById('g-boss-name').textContent=lv.sub;
  document.getElementById('boss-f-name').textContent=lv.sub;
  const pIdx=Math.min(Math.floor(G.stagesCleared/3),PLAYER_PASSIVES.length-1);
  document.getElementById('pp-player').textContent=PLAYER_PASSIVES[pIdx].label+' — '+PLAYER_PASSIVES[pIdx].desc;
  let bd=stg.passive.label+' — '+stg.passive.desc;
  const rk=Object.keys(stg.res||{});
  if(rk.length)bd+=' | RES: '+rk.map(k=>stg.res[k]===0?`${k.toUpperCase()}×IMM`:`${k.toUpperCase()} ${Math.round((1-stg.res[k])*100)}%↓`).join(', ');
  document.getElementById('pp-boss').textContent=bd;
  document.getElementById('stage-info').textContent=`${stg.name} — HP:${calcHP} ATK:${lv.atk[0]}–${lv.atk[1]}`;
  const bc2=document.getElementById('battle-canvas');
  requestAnimationFrame(()=>{bc2.width=bc2.offsetWidth||400;bc2.height=bc2.offsetHeight||260;drawBattleBg(bc2,isBoss,worldIdx);});
  renderAttrs();updateBars();renderInventory();renderEffects();
  setMsg(`${isBoss?'⚠ BOSS: ':''}${lv.sub} appears! (HP: ${calcHP})`,isBoss?'var(--red)':'var(--yellow)');
  setTurnIndicator(true);
  playWalkInBattle(si,li,()=>{bEl.firstChild&&bEl.firstChild.classList.add('boss-entry');setTimeout(nextQ,300);});
}

function getPool(){return{easy:['easy','easy','easy','medium'],medium:['easy','medium','medium','hard'],hard:['medium','hard','hard','hard']}[G.diff];}
function pickQ(){const tier=getPool()[Math.floor(Math.random()*4)];const bank=Q[tier],used=G.qUsed[tier];let idx=bank.map((_,i)=>i).filter(i=>!used.has(i));if(!idx.length){used.clear();idx=bank.map((_,i)=>i);}const i=idx[Math.floor(Math.random()*idx.length)];used.add(i);return{tier,...bank[i]};}
function getChoiceCount(){return G.diff==='hard'?6:4;}
function buildChoices(q){
  const n=getChoiceCount();
  const all=[q.a,...q.c.filter(c=>c!==q.a)];
  const u=[...new Set(all)];
  if(u.length<n){
    const bank=Q[q.tier]||[];
    const extras=[];
    bank.forEach(item=>{
      if(item.q===q.q) return;
      item.c.forEach(choice=>{
        if(choice!==q.a && !u.includes(choice) && !extras.includes(choice)) extras.push(choice);
      });
    });
    shuffle(extras);
    for(const choice of extras){
      if(u.length>=n) break;
      u.push(choice);
    }
  }
  shuffle(u);
  // pad with generic placeholders only if there still aren't enough unique distractors
  while(u.length<n)u.push(`Option ${String.fromCharCode(65+u.length)}`);
  let ch=u.slice(0,n);
  if(!ch.includes(q.a))ch[Math.floor(Math.random()*n)]=q.a;
  shuffle(ch);
  return ch;
}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function getTimerDur(){return{easy:30,medium:20,hard:12}[G.diff]||20;}

function nextQ(){
  clearInterval(G.timerInterval);G.eliminated=[];
  const pFrz=G.activeEffects.find(e=>e.type==='playerFreeze'||e.type==='playerParalyze');
  if(pFrz){pFrz.turns--;if(pFrz.turns<=0)G.activeEffects=G.activeEffects.filter(e=>e!==pFrz);renderEffects();updateBars();setMsg('⚡ You are paralyzed! Turn skipped!','var(--cyan)');setTurnIndicator(false);setTimeout(()=>bossAttacks(()=>{if(G.playerHP>0)setTimeout(nextQ,500);}),900);return;}
  tickEffects();renderEffects();updateBars();
  if(G.playerHP<=0){endGame(false);return;}if(G.bossHP<=0){handleLevelWin();return;}
  const q=pickQ();G.currentQ=q;G.currentQ.built=buildChoices(q);
  const tag=document.getElementById('q-diff-tag');tag.textContent=q.tier.toUpperCase();tag.className=`q-tag q-diff-${q.tier}`;
  document.getElementById('q-type-tag').textContent=q.type.toUpperCase();document.getElementById('q-text').textContent=q.q;
  renderChoices();setTurnIndicator(true);startTimer();
}

function renderChoices(){
  const grid=document.getElementById('choices-grid'),lets=['A','B','C','D','E','F'];grid.innerHTML='';
  const n=getChoiceCount();grid.style.gridTemplateColumns=n===6?'1fr 1fr':'1fr 1fr';
  G.currentQ.built.forEach((c,i)=>{const btn=document.createElement('button');btn.className='choice'+(G.eliminated.includes(i)?' eliminated':'');btn.disabled=G.eliminated.includes(i);btn.innerHTML=`<span class="c-letter">${lets[i]}</span>${c}`;btn.onclick=()=>onAnswer(c,btn,i);grid.appendChild(btn);});
}

function startTimer(){
  const dur=getTimerDur();G.timerVal=dur;const el=document.getElementById('q-timer');el.textContent=dur;el.className='q-timer';clearInterval(G.timerInterval);
  G.timerInterval=setInterval(()=>{G.timerVal--;el.textContent=G.timerVal;if(G.timerVal<=5)el.className='q-timer urgent';if(G.timerVal<=3)sfx.tick();if(G.timerVal<=0){clearInterval(G.timerInterval);onTimeout();}},1000);
}

function onAnswer(chosen,btnEl,idx){
  if(G.animLock)return;clearInterval(G.timerInterval);G.animLock=true;
  const correct=chosen===G.currentQ.a;highlightChoices(chosen);
  if(correct){
    sfx.correct();G.streak++;G.combo=Math.min(8,1+Math.floor(G.streak/3));
    document.getElementById('sc-streak').textContent=G.streak;document.getElementById('sc-combo').textContent=`×${G.combo}`;
    const pIdx=Math.min(Math.floor(G.stagesCleared/3),PLAYER_PASSIVES.length-1);
    const tierBonus={easy:12,medium:22,hard:34}[G.currentQ.tier]||12;
    let dmg=(tierBonus+G.timerVal*1.8)*G.combo;
    const hasDouble=G.activeEffects.find(e=>e.type==='double');if(hasDouble){dmg*=2;G.activeEffects=G.activeEffects.filter(e=>e!==hasDouble);}
    const hasOverload=G.activeEffects.find(e=>e.type==='overload');if(hasOverload){dmg*=3;G.activeEffects=G.activeEffects.filter(e=>e!==hasOverload);}
    dmg+=G.pATK;if(pIdx>=1)dmg+=10;if(pIdx>=2)dmg+=14;if(pIdx>=3)dmg+=20;
    let crit=false;if(pIdx>=3&&Math.random()<0.15){dmg*=2.5;crit=true;}dmg=Math.floor(dmg);
    G.bossHP=Math.max(0,G.bossHP-dmg);G.score+=dmg;
    document.getElementById('sc-score').textContent=G.score;document.getElementById('g-score').textContent='SCORE:'+G.score;
    spawnFloat(`-${dmg}${crit?' CRIT!':''}`, 'var(--red)', true);
    let healAmt=0;if(pIdx===0)healAmt=5;else if(pIdx===2)healAmt=6;else if(pIdx>=3)healAmt=9;if(healAmt>0)doHealAura(healAmt);
    setMsg(crit?`💥 CRIT! ${dmg} dmg! ×${G.combo} — Counter!`:`✓ ${dmg} dmg! ×${G.combo} — Counter!`,'var(--green)');
    updateBars();const stg=STAGES[G.curStage];if(stg.spFn)stg.spFn(G);renderEffects();updateBars();
    const drop=rollDrop(G.streak,G.diff);if(drop){G.inv[drop]=(G.inv[drop]||0)+1;renderInventory();sfx.powerup();setMsg(`✓ ${dmg} dmg! Drop: ${PU[drop].icon} ${PU[drop].name}!`,'var(--green)');}
    if(G.bossHP<=0){G.animLock=false;handleLevelWin();return;}
    doAnim('player-f','aR',()=>{doAnim('boss-f','aS',()=>{setTurnIndicator(false);setTimeout(()=>bossAttacks(()=>{G.animLock=false;if(G.playerHP>0)setTimeout(nextQ,500);}),400);});});
  } else {
    sfx.wrong();G.streak=0;G.combo=Math.max(1,G.combo-1);
    document.getElementById('sc-streak').textContent=0;document.getElementById('sc-combo').textContent=`×${G.combo}`;
    setMsg(`✗ Wrong! Answer: ${G.currentQ.a} — Boss attacks!`,'var(--red)');setTurnIndicator(false);
    setTimeout(()=>bossAttacks(()=>{G.animLock=false;if(G.playerHP>0)setTimeout(nextQ,400);}),700);
  }
}

function onTimeout(){if(G.animLock)return;clearInterval(G.timerInterval);sfx.wrong();G.streak=0;setMsg(`⏱ Time's up! Answer: ${G.currentQ.a}`,'var(--red)');highlightChoices(null);setTurnIndicator(false);setTimeout(()=>bossAttacks(()=>{G.animLock=false;if(G.playerHP>0)setTimeout(nextQ,500);}),800);}
function highlightChoices(chosen){document.querySelectorAll('.choice').forEach(btn=>{const txt=btn.textContent.slice(1).trim();if(chosen&&txt===G.currentQ.a)btn.classList.add('correct');else if(txt===chosen)btn.classList.add('wrong');else btn.classList.add('dimmed');btn.disabled=true;});}

function bossAttacks(cb){
  const stg=STAGES[G.curStage],lv=stg.levels[G.curLevel];
  const frozen=G.activeEffects.find(e=>e.type==='freeze');
  const stunned=G.activeEffects.find(e=>e.type==='stun');
  if(stunned){
    stunned.turns--;if(stunned.turns<=0)G.activeEffects=G.activeEffects.filter(e=>e!==stunned);
    renderEffects();setMsg(`💫 Boss is STUNNED! Skips attack!`,'var(--yellow)');
    doAnim('boss-f','aS',()=>{if(cb)cb();});return;
  }
  if(frozen){frozen.turns--;if(frozen.turns<=0)G.activeEffects=G.activeEffects.filter(e=>e!==frozen);renderEffects();showFreezeOverlay();setMsg(`❄ ${lv.sub} FROZEN! Skips!`,'var(--blue)');doAnim('boss-f','aS',()=>{if(cb)cb();});return;}
  const para=G.activeEffects.find(e=>e.type==='paralyze');
  if(para){para.turns--;if(para.turns<=0)G.activeEffects=G.activeEffects.filter(e=>e!==para);renderEffects();showParalyzeOverlay();setMsg(`⚡ ${lv.sub} PARALYZED! Skips!`,'var(--cyan)');doAnim('boss-f','aS',()=>{if(cb)cb();});return;}
  G.bossAtkCounter++;if(stg.spFn)stg.spFn(G);
  let dmg=Math.floor(Math.random()*(G.bossAtkMax-G.bossAtkMin+1))+G.bossAtkMin;
dmg=Math.floor(dmg*(G.rageMult||1));dmg=Math.floor(dmg*(G.rageMult||1));
  if(G.pRES>0) dmg=Math.floor(dmg*(1-resMitigation(G.pRES)));
  // Barrier — fully blocks hit
  const barrier=G.activeEffects.find(e=>e.type==='barrier');
  if(barrier){
    barrier.turns--;if(barrier.turns<=0)G.activeEffects=G.activeEffects.filter(e=>e!==barrier);
    renderEffects();setMsg('🧱 BARRIER blocks all damage!','var(--blue)');
    doAnim('boss-f','aS',()=>{if(cb)cb();});return;
  }
  // Mirror — reflects damage back
  const mirror=G.activeEffects.find(e=>e.type==='mirror');
  if(mirror){
    G.activeEffects=G.activeEffects.filter(e=>e!==mirror);
    G.bossHP=Math.max(0,G.bossHP-dmg);
    spawnFloat(`-${dmg}🪞`,'var(--teal)',true);
    setMsg(`🪞 MIRROR reflects ${dmg} back at boss!`,'var(--teal)');
    updateBars();renderEffects();
    if(G.bossHP<=0){G.animLock=false;handleLevelWin();return;}
    doAnim('boss-f','aS',()=>{G.animLock=false;if(cb)cb();});return;}
  const shield=G.activeEffects.find(e=>e.type==='shield');
  if(shield){dmg=Math.floor(dmg*.50);shield.turns--;if(shield.turns<=0)G.activeEffects=G.activeEffects.filter(e=>e!==shield);renderEffects();showShieldGlow();setMsg(`🛡 SHIELD blocks! Only ${dmg} dmg!`,'var(--teal)');}
  else setMsg(`${lv.sub} strikes for ${dmg}!`,'var(--orange)');
  G.playerHP=Math.max(0,G.playerHP-dmg);spawnFloat(`-${dmg}`,'var(--orange)',false);sfx.hit();
  if(G.playerHP<=0&&G.inv.revive>0){G.inv.revive--;G.playerHP=1;renderInventory();setMsg('🍖 REVIVE! Back at 1 HP!','var(--pink)');sfx.powerup();}
  doAnim('boss-f','aL',()=>{doAnim('player-f','aS',()=>{updateBars();if(G.playerHP<=0){sfx.gameover();setTimeout(()=>endGame(false),400);return;}if(cb)cb();});});
}

function showFreezeOverlay(){const el=document.getElementById('boss-spr');const ov=document.createElement('div');ov.className='freeze-overlay';ov.textContent='❄';el.appendChild(ov);setTimeout(()=>ov.remove(),1400);}
function showParalyzeOverlay(){const el=document.getElementById('boss-spr');const ov=document.createElement('div');ov.className='paralyze-overlay';ov.textContent='⚡';el.appendChild(ov);setTimeout(()=>ov.remove(),1400);}
function showShieldGlow(){const el=document.getElementById('player-spr');const gl=document.createElement('div');gl.className='shield-glow';el.appendChild(gl);setTimeout(()=>gl.remove(),900);}
function doHealAura(amt){const el=document.getElementById('player-spr');const a=document.createElement('div');a.className='heal-aura';el.appendChild(a);const f=document.createElement('div');f.className='heal-float';f.textContent=`+${amt} HP`;el.appendChild(f);G.playerHP=Math.min(G.playerMaxHP,G.playerHP+amt);updateBars();setTimeout(()=>{a.remove();f.remove();},900);}

function tickEffects(){
  const res=STAGES[G.curStage].res||{};
  G.activeEffects=G.activeEffects.filter(e=>{
    if(e.type==='playerRegen'){G.playerHP=Math.min(G.playerMaxHP,G.playerHP+e.hpPerTurn);spawnFloat(`+${e.hpPerTurn}💉`,'var(--green)',false);}
    if(e.type==='playerRage'){G.playerHP=Math.max(0,G.playerHP-5);spawnFloat('-5😤','var(--red)',false);}
    if(e.type==='bossPoison'){const r=res.poison;let d=e.hpPerTurn;if(r===0){spawnFloat('IMMUNE','var(--dim)',true);}else{if(r!=null)d=Math.floor(d*r);G.bossHP=Math.max(0,G.bossHP-d);spawnFloat(`-${d}☠`,'var(--purple)',true);}}
    if(e.type==='bossBurn'){const r=res.burn;let d=e.hpPerTurn;if(r===0){spawnFloat('IMM🔥','var(--dim)',true);}else{if(r!=null)d=Math.floor(d*r);G.bossHP=Math.max(0,G.bossHP-d);spawnFloat(`-${d}🔥`,'var(--orange)',true);}}
    if(e.type==='playerPoison'){G.playerHP=Math.max(0,G.playerHP-e.hpPerTurn);spawnFloat(`-${e.hpPerTurn}☠`,'var(--purple)',false);}
    if(e.type==='playerBurn'){G.playerHP=Math.max(0,G.playerHP-e.hpPerTurn);spawnFloat(`-${e.hpPerTurn}🔥`,'var(--orange)',false);}
    // overload, double, freeze, paralyze, shield, stun, mirror, barrier just tick down
    e.turns--;return e.turns>0;
  });
}

function renderEffects(){
  const rows=document.getElementById('effect-rows');
  if(!G.activeEffects.length){rows.innerHTML='<span style="font-size:11px;color:var(--dim)">No effects</span>';return;}
  const cfg={
  double:        {icon:'⚡',name:'2×DMG',        bar:'var(--yellow)'},
  freeze:        {icon:'❄', name:'FROZEN',        bar:'var(--blue)'},
  paralyze:      {icon:'⚡',name:'PARALYZED',     bar:'var(--cyan)'},
  bossPoison:    {icon:'☠', name:'POISONED',      bar:'var(--purple)'},
  bossBurn:      {icon:'🔥',name:'BURNED',        bar:'var(--orange)'},
  shield:        {icon:'🛡',name:'SHIELD',        bar:'var(--teal)'},
  playerPoison:  {icon:'☠', name:'U-POISON',      bar:'var(--purple)'},
  playerBurn:    {icon:'🔥',name:'U-BURN',        bar:'var(--orange)'},
  playerFreeze:  {icon:'❄', name:'U-FREEZE',      bar:'var(--blue)'},
  playerParalyze:{icon:'⚡',name:'U-PARA',        bar:'var(--cyan)'},
  playerRegen:   {icon:'💉',name:'REGEN',         bar:'var(--green)'},
  playerRage:    {icon:'😤',name:'RAGE ATK×2',    bar:'var(--red)'},
  stun:          {icon:'💫',name:'BOSS STUNNED',  bar:'var(--yellow)'},
  mirror:        {icon:'🪞',name:'MIRROR',        bar:'var(--teal)'},
  barrier:       {icon:'🧱',name:'BARRIER',       bar:'var(--blue)'},
  overload:      {icon:'⚡',name:'OVERLOAD ×3',   bar:'var(--yellow)'},
  divine:        {icon:'🌟',name:'DIVINE',        bar:'var(--yellow)'},
  gamble:        {icon:'🎲',name:'GAMBLE',        bar:'var(--pink)'},
  nuke:          {icon:'💣',name:'NUKE',          bar:'var(--red)'},
  oracle:        {icon:'🔮',name:'ORACLE',        bar:'var(--purple)'},
  insight:       {icon:'👁',name:'INSIGHT',       bar:'var(--blue)'},
};
  rows.innerHTML=G.activeEffects.map(e=>{
    const c=cfg[e.type]||{icon:'✨',name:e.type,bar:'#fff',bg:'',chip:''};
    return `<span style="display:inline-flex;align-items:center;gap:3px;background:var(--panel2);border:1px solid ${c.bar};border-radius:4px;padding:1px 5px;font-size:11px;color:${c.bar}">${c.icon} ${c.name} <b>${e.turns}t</b></span>`;
  }).join('');
  document.getElementById('boss-stat').innerHTML=(G.activeEffects.some(e=>e.type==='bossPoison')?'<span class="sicon">☠</span>':'')+(G.activeEffects.some(e=>e.type==='bossBurn')?'<span class="sicon">🔥</span>':'')+(G.activeEffects.some(e=>e.type==='freeze')?'<span class="sicon">❄</span>':'')+(G.activeEffects.some(e=>e.type==='paralyze')?'<span class="sicon">⚡</span>':'');
  document.getElementById('player-stat').innerHTML=(G.activeEffects.some(e=>e.type==='shield')?'<span class="sicon">🛡</span>':'')+(G.activeEffects.some(e=>e.type==='playerPoison')?'<span class="sicon">☠</span>':'')+(G.activeEffects.some(e=>e.type==='playerBurn')?'<span class="sicon">🔥</span>':'')+(G.activeEffects.some(e=>e.type==='playerParalyze'||e.type==='playerFreeze')?'<span class="sicon">⚡</span>':'');
}

function usePowerup(type){
  if(G.animLock)return;if(!G.inv[type]||G.inv[type]<=0)return;
  const res=STAGES[G.curStage].res||{};
  if(type==='halfhp'){const r=res.halfhp;if(r===0){setMsg('💀 IMMUNE!','var(--dim)');return;}const ratio=r||0.5,newHP=Math.floor(G.bossHP*(1-ratio)),dealt=G.bossHP-newHP;G.bossHP=newHP;G.inv[type]--;sfx.halfhp();spawnFloat(`-${dealt} HALF HP!`,'var(--red)',true);setMsg(`💀 HALF HP! Lost ${dealt}${r&&r!==0.5?' (RES)':''}!`,'var(--red)');G.score+=Math.floor(dealt*.5);updateBars();renderInventory();STAGES[G.curStage].spFn&&STAGES[G.curStage].spFn(G);if(G.bossHP<=0)handleLevelWin();return;}
  if(type==='heal'){G.inv[type]--;doHealAura(30);setMsg('💚 Healed +30 HP!','var(--green)');sfx.powerup();renderInventory();return;}
  if(type==='fiftyf'){const ch=G.currentQ.built,wi=ch.map((c,i)=>i).filter(i=>ch[i]!==G.currentQ.a&&!G.eliminated.includes(i));if(wi.length<2){setMsg('Nothing to eliminate!','var(--dim)');return;}shuffle(wi);G.eliminated.push(wi[0],wi[1]);G.inv[type]--;sfx.powerup();setMsg('🎯 50/50!','var(--orange)');renderChoices();renderInventory();return;}
  if(type==='revive'){setMsg('🍖 Revive ready (auto on death).','var(--pink)');return;}
  const eff={type};
  if(type==='regen'){
    G.inv[type]--;
    G.activeEffects.push({type:'playerRegen',turns:3,hpPerTurn:8});
    sfx.powerup();setMsg('💉 REGEN! +8 HP/turn × 3','var(--green)');
    doHealAura(0);
    renderEffects();renderInventory();return;
  }
  if(type==='divine'){
    G.inv[type]--;
    const healed=G.playerMaxHP-G.playerHP;
    G.playerHP=G.playerMaxHP;
    doHealAura(healed);
    sfx.powerup();setMsg('🌟 DIVINE! Full HP restored!','var(--yellow)');
    updateBars();renderInventory();return;
  }
  if(type==='overload'){
      G.inv[type]--;
      G.activeEffects.push({type:'overload',turns:2});
      sfx.powerup();setMsg('⚡ OVERLOAD! Next hit deals TRIPLE damage!','var(--yellow)');
      spawnFloat('⚡ OVERLOAD!','var(--yellow)',false);
      renderEffects();renderInventory();return;
  }
  if(type==='gamble'){
      G.inv[type]--;
      const pool=['heal','double','freeze','poison','burn','shield','paralyze','halfhp','revive','regen','mirror','rage','stun','leech','barrier','divine','nuke'];
      const picked=pool[Math.floor(Math.random()*pool.length)];
      G.inv[picked]=(G.inv[picked]||0)+1;
      sfx.powerup();setMsg(`🎲 GAMBLE! Got: ${PU[picked].icon} ${PU[picked].name}!`,'var(--pink)');
      spawnFloat(`🎲 +${PU[picked].icon}`,'var(--pink)',false);
      renderInventory();return;
  }
  if(type==='nuke'){
      G.inv[type]--;
      const dmg=Math.floor(G.playerMaxHP*0.5);
      G.bossHP=Math.max(0,G.bossHP-dmg);
      sfx.halfhp();spawnFloat(`-${dmg}💣`,'var(--red)',true);
      setMsg(`💣 NUKE! Dealt ${dmg} damage!`,'var(--red)');
      updateBars();renderInventory();
      if(G.bossHP<=0)handleLevelWin();return;
  }
  if(type==='oracle'){
      G.inv[type]--;
      const correct=G.currentQ.a;
      document.querySelectorAll('.choice').forEach(btn=>{
          const txt=btn.textContent.slice(1).trim();
          if(txt===correct)btn.style.background='rgba(245,200,66,0.15)';
          else btn.style.opacity='0.4';
      });
      sfx.powerup();setMsg(`🔮 ORACLE! Correct answer highlighted!`,'var(--purple)');
      renderInventory();return;
  }
  if(type==='insight'){
      G.inv[type]--;
      G.timerVal+=30;
      document.getElementById('q-timer').textContent=G.timerVal;
      document.getElementById('q-timer').className='q-timer';
      sfx.powerup();setMsg('👁 INSIGHT! +30 seconds added!','var(--blue)');
      spawnFloat('+30s 👁','var(--blue)',false);
      renderInventory();return;
  }
  if(type==='leech'){
    G.inv[type]--;
    const stolen=Math.min(15,G.bossHP);
    G.bossHP=Math.max(0,G.bossHP-stolen);
    G.playerHP=Math.min(G.playerMaxHP,G.playerHP+stolen);
    sfx.powerup();spawnFloat(`-${stolen}🩸`,'var(--purple)',true);
    doHealAura(stolen);
    setMsg(`🩸 LEECH! Stole ${stolen} HP from boss!`,'var(--purple)');
    updateBars();renderInventory();
    if(G.bossHP<=0)handleLevelWin();return;
  }
  if(type==='stun'){
    G.inv[type]--;
    G.activeEffects.push({type:'stun',turns:3});
    sfx.powerup();setMsg('💫 STUN! Boss skips 3 turns!','var(--yellow)');
    showParalyzeOverlay();
    renderEffects();renderInventory();return;
  }
  if(type==='rage'){
    G.inv[type]--;
    G.activeEffects.push({type:'playerRage',turns:3});
    sfx.powerup();setMsg('😤 RAGE! ATK×2 but -5HP/turn × 3','var(--red)');
    doAnim('player-f','aS',()=>{});
    spawnFloat('😤 RAGE!','var(--red)',false);
    renderEffects();renderInventory();return;
  }
  if(type==='mirror'){
    G.inv[type]--;
    G.activeEffects.push({type:'mirror',turns:1});
    sfx.powerup();setMsg('🪞 MIRROR! Next hit reflected back!','var(--teal)');
    showShieldGlow();
    spawnFloat('🪞 MIRROR!','var(--teal)',false);
    renderEffects();renderInventory();return;
  }
  if(type==='barrier'){
    G.inv[type]--;
    G.activeEffects.push({type:'barrier',turns:2});
    sfx.powerup();setMsg('🧱 BARRIER! Next 2 hits fully blocked!','var(--blue)');
    showShieldGlow();
    spawnFloat('🧱 BARRIER!','var(--blue)',false);
    renderEffects();renderInventory();return;
  }
    if(type==='double'){eff.turns=1;}
    if(type==='freeze'){if(res.freeze===0){setMsg('❄ IMMUNE!','var(--dim)');G.inv[type]++;renderInventory();return;}eff.turns=res.freeze!=null?1:2;showFreezeOverlay();}
    if(type==='poison'){if(res.poison===0){setMsg('☠ IMMUNE!','var(--dim)');G.inv[type]++;renderInventory();return;}eff.type='bossPoison';eff.turns=4;eff.hpPerTurn=12;}
    if(type==='burn'){if(res.burn===0){setMsg('🔥 IMMUNE!','var(--dim)');G.inv[type]++;renderInventory();return;}eff.type='bossBurn';eff.turns=3;eff.hpPerTurn=8;}
    if(type==='shield'){eff.turns=3;showShieldGlow();}
    if(type==='paralyze'){if(res.paralyze===0){setMsg('⚡ IMMUNE!','var(--dim)');G.inv[type]++;renderInventory();return;}eff.turns=res.paralyze!=null?1:2;showParalyzeOverlay();}
    G.inv[type]--;G.activeEffects.push(eff);sfx.powerup();setMsg(`${PU[type].icon} ${PU[type].name} activated!`,'var(--purple)');renderEffects();renderInventory();
  }

function rollDrop(streak,diff){const rates={easy:.48,medium:.36,hard:.24};let chance=rates[diff]||.36;if(streak>=5&&Math.random()<.18)return 'halfhp';if(streak>=7&&Math.random()<.10)return 'revive';if(streak>=3)chance+=.10;if(Math.random()>chance)return null;
return['heal','heal','double','double','freeze','poison','poison','shield','fiftyf','burn','paralyze','paralyze','divine','overload','gamble','nuke','oracle','insight'][Math.floor(Math.random()*18)];;}

function handleLevelWin(){
  clearInterval(G.timerInterval);sfx.victory();
  const si=G.curStage,li=G.curLevel,stg=STAGES[si],lv=stg.levels[li];
  const isFinalLevel=li===4,isFinalStage=si===9&&isFinalLevel;
  const attr=lv.attr;G.pHP+=attr.hp;G.pATK+=attr.atk;G.pRES=Math.min(400,G.pRES+attr.res);G.playerMaxHP=500+G.pHP;G.playerHP=Math.min(G.playerHP+attr.hp,G.playerMaxHP);
  G.levelsCleared[si]=Math.max(G.levelsCleared[si],li+1);if(isFinalLevel)G.stagesCleared++;
  if(isFinalStage){setTimeout(()=>endGame(true),600);return;}
  const nextSi=isFinalLevel?si+1:si,nextLi=isFinalLevel?0:li+1;
  document.getElementById('aw-title').textContent=lv.boss?'👑 BOSS DEFEATED!':lv.mini?'⚔ MINI-BOSS CLEAR!':'✓ LEVEL CLEAR!';
  document.getElementById('aw-sub').textContent=lv.sub+' defeated!';
  const gains=document.getElementById('aw-gains');gains.innerHTML='';
  const addRow=(icon,text,val)=>{const r=document.createElement('div');r.className='aw-row';r.innerHTML=`<span class="aw-icon">${icon}</span><span class="aw-text">${text}</span><span class="aw-val">+${val}</span>`;gains.appendChild(r);};
  if(attr.hp)addRow('❤','Max HP & Heal',attr.hp);if(attr.atk)addRow('⚔','Attack Bonus',attr.atk);if(attr.res)addRow('🛡','Resistance',attr.res+'%');
  if(lv.boss&&si===4){const r=document.createElement('div');r.className='aw-row';r.innerHTML='<span class="aw-icon">💥</span><span class="aw-text" style="color:var(--orange)">EMBER KING DEFEATED! ATK×1.2 permanent!</span><span class="aw-val" style="color:var(--orange)">RARE</span>';gains.appendChild(r);G.pATK=Math.floor(G.pATK*1.2);}
  if(lv.boss&&si===9){const r=document.createElement('div');r.className='aw-row';r.innerHTML='<span class="aw-icon">🌟</span><span class="aw-text" style="color:var(--yellow)">OMEGA REX SLAIN! All stats ×1.5!</span><span class="aw-val" style="color:var(--yellow)">LEGEND</span>';gains.appendChild(r);}
    document.getElementById('aw-btn').onclick=()=>{
    // Offer a 1-of-3 pick when the NEXT level is an odd level (index 0,2,4 = levels 1,3,5)
    if(nextLi % 2 === 0){
      goMidPick(nextSi,nextLi);
    }else{
      goNextLevel(nextSi,nextLi);
    }
  };
  show('s-attrwin');

}

// Mitigation curve — asymptotically approaches ~85%, never fully nullifies a hit:
function resMitigation(res){
  return Math.min(0.85, res/(res+150));
}

function goPickPU(nextSi,nextLi){
  // One-time picking for the WHOLE game. If already done, skip straight ahead.
  if(G.pickDone){goNextLevel(nextSi,nextLi);return;}
  G._picked=[];              // track chosen cards this session
  G._pickTarget=5;           // pick exactly 5
  G._pickNext={si:nextSi,li:nextLi};
  const allTypes=Object.keys(PU);
  shuffle(allTypes);
  G._pickChoices=allTypes.slice(0,8);   // offer 8, choose 5
  renderPickPU();
  show('s-pickpu');
}

function goMidPick(nextSi,nextLi){
  G._picked=[];
  G._pickMode='mid';
  G._pickNext={si:nextSi,li:nextLi};
  const allTypes=Object.keys(PU);
  shuffle(allTypes);
  G._pickChoices=allTypes.slice(0,3);   // offer exactly 3
  renderPickPU();
  show('s-pickpu');
}

function renderPickPU(){
  const isMid = G._pickMode==='mid';
  document.getElementById('pickpu-title').textContent = isMid ? 'PICK A POWERUP' : 'CHOOSE YOUR LOADOUT';
  document.getElementById('pickpu-sub').textContent = isMid
    ? 'Choose 1 of 3 to add to your inventory'
    : `Pick ${G._pickTarget} powerups to start your run!`;
  document.getElementById('pickpu-progress').textContent = isMid
    ? '' : `PICKED ${G._picked.length} / ${G._pickTarget}`;
  document.getElementById('pickpu-cards').innerHTML=G._pickChoices.map(t=>{
    const picked=G._picked.includes(t);
    return `<div class="pu-pick-card${picked?' picked':''}" style="border-color:${PU[t].border};color:${PU[t].color}" onclick="pickReward('${t}')">
      <div class="card-icon">${PU[t].icon}</div>
      <div class="card-name" style="color:${PU[t].color}">${PU[t].name}</div>
      <div class="card-desc">${PU[t].desc}</div>
      <div class="card-rarity">${PU[t].name}</div>
    </div>`;
  }).join('');
}


function pickReward(type){
  // MID-LEVEL: pick exactly 1, then continue
  if(G._pickMode==='mid'){
    G.inv[type]=(G.inv[type]||0)+1;
    sfx.powerup();
    // visually mark it, then move on
    G._picked=[type];
    renderPickPU();
    saveGame();
    const nx=G._pickNext;
    setTimeout(()=>goNextLevel(nx.si,nx.li),500);
    return;
  }

  // STARTUP or legacy multi-pick
  if(G._picked.includes(type))return;
  if(G._picked.length>=G._pickTarget)return;
  G._picked.push(type);
  G.inv[type]=(G.inv[type]||0)+1;
  sfx.powerup();
  renderPickPU();

  if(G._picked.length>=G._pickTarget){
    if(G._pickMode==='startup'){
      // startup done → go to map and start the game
      setTimeout(()=>{buildMap();saveGame();show('s-map');},600);
    }else{
      // legacy path (shouldn't normally hit)
      G.pickDone=true;saveGame();
      const nx=G._pickNext;
      setTimeout(()=>goNextLevel(nx.si,nx.li),600);
    }
  }
}

function goNextLevel(nextSi,nextLi){
  saveGame();
  G.streak=0;
  G.combo=1;
  document.getElementById('sc-streak').textContent=0;document.getElementById('sc-combo').textContent='×1';if(nextLi===0&&nextSi>G.curStage){G.curStage=nextSi;G.curLevel=0;buildMap();show('s-map');}else{G.curLevel=nextLi;show('s-game');loadLevel(nextSi,nextLi);}}

function updateBars(){const pp=Math.max(0,G.playerHP/G.playerMaxHP*100),bp=Math.max(0,G.bossHP/G.bossMaxHP*100);document.getElementById('p-hp').style.width=pp+'%';document.getElementById('b-hp').style.width=bp+'%';document.getElementById('p-hp-txt').textContent=`${Math.max(0,G.playerHP)}/${G.playerMaxHP}`;document.getElementById('b-hp-txt').textContent=`${Math.max(0,G.bossHP)}/${G.bossMaxHP}`;document.getElementById('p-hp').style.background=pp<25?'var(--red)':pp<50?'var(--orange)':'var(--green)';}
function renderAttrs(){
  const g=document.getElementById('attr-grid');
  g.innerHTML=`
    <div class="attr-row"><span class="attr-icon">❤</span><span class="attr-val">+${G.pHP}</span><span class="attr-lbl" style="font-size:13px"> HP</span></div>
    <div class="attr-row"><span class="attr-icon">⚔</span><span class="attr-val">+${G.pATK}</span><span class="attr-lbl" style="font-size:13px"> ATK</span></div>
    <div class="attr-row"><span class="attr-icon">🛡</span><span class="attr-val">${G.pRES}%</span><span class="attr-lbl" style="font-size:13px"> RES</span></div>
    <div class="attr-row"><span class="attr-icon">🌟</span><span class="attr-val">S${G.stagesCleared}</span><span class="attr-lbl" style="font-size:13px"> done</span></div>`;
}
function renderInventory(){
  const w=document.getElementById('pu-items');
  const order=[
    // COMMON — green
    'heal','regen','leech',
    // OFFENSIVE — red/orange
    'poison','burn','halfhp',
    // CONTROL — blue/cyan
    'freeze','paralyze','stun',
    // UTILITY — yellow/orange
    'double','fiftyf','rage',
    // DEFENSIVE — teal/blue
    'shield','mirror','barrier',
    // SPECIAL — pink
    'revive','divine','overload','gamble','nuke','oracle','insight',
  ];
  const rarity={
    // COMMON — all green
    heal:    {label:'COMMON',  color:'#4ecb71'},
    regen:   {label:'COMMON',  color:'#4ecb71'},
    leech:   {label:'COMMON',  color:'#4ecb71'},
    // OFFENSE — all red
    poison:  {label:'OFFENSE', color:'#e84545'},
    burn:    {label:'OFFENSE', color:'#e84545'},
    halfhp:  {label:'OFFENSE', color:'#e84545'},
    // CONTROL — all blue
    freeze:  {label:'CONTROL', color:'#4a9eff'},
    paralyze:{label:'CONTROL', color:'#4a9eff'},
    stun:    {label:'CONTROL', color:'#4a9eff'},
    // UTILITY — all yellow
    double:  {label:'UTILITY', color:'#f5c842'},
    fiftyf:  {label:'UTILITY', color:'#f5c842'},
    rage:    {label:'UTILITY', color:'#f5c842'},
    // DEFEND — all teal
    shield:  {label:'DEFEND',  color:'#2dd4c8'},
    mirror:  {label:'DEFEND',  color:'#2dd4c8'},
    barrier: {label:'DEFEND',  color:'#2dd4c8'},
    // SPECIAL — all pink
    revive:  {label:'SPECIAL', color:'#ff6eb4'},
    divine:  {label:'SPECIAL', color:'#f5c842'},
    overload:{label:'SPECIAL', color:'#f5c842'},
    gamble:  {label:'SPECIAL', color:'#ff6eb4'},
    nuke:    {label:'SPECIAL', color:'#e84545'},
    oracle:  {label:'SPECIAL', color:'#b06aff'},
    insight: {label:'SPECIAL', color:'#4a9eff'},
};
  w.innerHTML=order.map(t=>{
    const d=PU[t],cnt=G.inv[t]||0,r=rarity[t];
    return `<button class="pu-btn" style="border-color:${r.color};opacity:${cnt===0?'0.3':'1'};pointer-events:${cnt===0?'none':'auto'}" onclick="usePowerup('${t}')" title="${d.desc}">
    ${cnt>0?`<span class="pu-count" style="color:${r.color}">${cnt}</span>`:''}
      <span class="pu-icon">${d.icon}</span>
      <span class="pu-name" style="color:${r.color}">${d.name}</span>
      <span style="font-family:var(--px);font-size:5px;color:${r.color};opacity:0.7;letter-spacing:1px">${r.label}</span>
    </button>`;
  }).join('');
}

const HINTS=[
  'Answer correctly to counter-attack the enemy!',
  'Build a streak to increase your combo multiplier!',
  'Use FREEZE or STUN to skip the enemy\'s turn!',
  'POISON and BURN deal damage every turn!',
  'SHIELD absorbs 50% of incoming damage for 3 hits!',
  'HALF HP instantly cuts the enemy\'s health in half!',
  'ORACLE reveals the correct answer — use it wisely!',
  'DIVINE fully restores your HP in an emergency!',
  'NUKE deals damage equal to 50% of your max HP!',
  'GAMBLE gives you a random powerup — risky but fun!',
  'BARRIER blocks the next 2 hits completely!',
  'MIRROR reflects the next attack back at the enemy!',
  'OVERLOAD triples your damage on the next correct answer!',
  'INSIGHT adds 30 seconds to the timer!',
  'LEECH steals 15 HP directly from the enemy!',
  'RAGE doubles your attack but costs 5 HP per turn!',
  'Earn permanent HP, ATK and RES by clearing levels!',
  'Boss stages drop better rewards on clear!',
  'Answer faster for bonus damage — timer counts!',
  'Combo multiplier resets on wrong answer — stay sharp!',
];
let _hintIdx=0;
function cycleHint(){
  const el=document.getElementById('hint-text');
  if(!el)return;
  el.style.opacity='0';
  setTimeout(()=>{
    _hintIdx=(_hintIdx+1)%HINTS.length;
    el.textContent=HINTS[_hintIdx];
    el.style.transition='opacity 0.5s';
    el.style.opacity='1';
  },300);
}
setInterval(cycleHint,4000);
document.addEventListener('DOMContentLoaded',()=>{
  const el=document.getElementById('hint-text');
  if(el)el.textContent=HINTS[0];
});

function setMsg(txt,color){const el=document.getElementById('msg-bar');el.textContent=txt;el.style.color=color||'var(--dim)';}
function setTurnIndicator(isPlayer){const el=document.getElementById('turn-indicator');if(isPlayer){el.textContent='⚔ YOUR TURN';el.className='turn-indicator player-turn';}else{el.textContent=`🔥 ${STAGES[G.curStage]?.levels[G.curLevel]?.sub||'ENEMY'} COUNTER!`;el.className='turn-indicator boss-turn';}}
function spawnFloat(txt,color,isBoss){const ba=document.getElementById('battle-area');const el=document.createElement('div');el.className='fdmg';el.textContent=txt;el.style.color=color;el.style.left=isBoss?'60%':'24%';el.style.top='16px';ba.appendChild(el);setTimeout(()=>el.remove(),1300);}
function doAnim(id,cls,cb){const el=document.getElementById(id);el.classList.add(cls);setTimeout(()=>{el.classList.remove(cls);if(cb)cb();},460);}

function endGame(win){
  clearSave();
  clearInterval(G.timerInterval);
  G.animLock=true;
  const title=document.getElementById('end-title');
  title.textContent=win?'🏆 VICTORY!':'💀 GAME OVER';
  title.style.color=win?'var(--yellow)':'var(--red)';
  document.getElementById('end-dino').innerHTML=SPR_PLAYER;
  document.getElementById('end-stats').innerHTML=`Score: ${G.score}<br>Stage: S${G.curStage+1}-L${G.curLevel+1}<br>Max HP: ${G.playerMaxHP}<br>ATK Bonus: +${G.pATK}<br>Resistance: ${G.pRES}%<br>Difficulty: ${G.diff.toUpperCase()}`;document.getElementById('name-in').value='';if(win)sfx.victory();else sfx.gameover();show('s-end');}
function saveScore(){const name=(document.getElementById('name-in').value.trim().toUpperCase()||'ANON').slice(0,10);const board=getBoard();board.push({name,score:G.score,stage:`S${G.curStage+1}-L${G.curLevel+1}`,diff:G.diff});board.sort((a,b)=>b.score-a.score);try{localStorage.setItem('dqb3_lb',JSON.stringify(board.slice(0,10)));}catch(e){}sfx.victory();show('s-lb');renderLB();}
function getBoard(){try{return JSON.parse(localStorage.getItem('dqb3_lb'))||[];}catch{return[];}}
function renderLB(){const rows=document.getElementById('lb-rows'),board=getBoard(),medals=['🥇','🥈','🥉'];rows.innerHTML=board.length?board.map((e,i)=>`<div class="lb-row ${i<3?'r'+(i+1):''}"><span>${medals[i]||i+1}</span><span>${e.name}</span><span>${e.score}</span><span>${e.stage}</span></div>`).join(''):'<div style="padding:14px;text-align:center;font-size:15px;color:var(--dim)">No scores yet!</div>';}

let _actx=null;
function ac(){if(!_actx)_actx=new(window.AudioContext||window.webkitAudioContext)();return _actx;}
function beep(f,t,d,v=.22){try{const c=ac(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type=t;o.frequency.value=f;g.gain.value=v;g.gain.exponentialRampToValueAtTime(.001,c.currentTime+d);o.start();o.stop(c.currentTime+d);}catch(e){}}
const sfx={correct:()=>{beep(523,'sine',.08,.2);setTimeout(()=>beep(659,'sine',.08,.2),90);setTimeout(()=>beep(784,'sine',.12,.2),180);},wrong:()=>{beep(200,'sawtooth',.12,.3);setTimeout(()=>beep(150,'sawtooth',.12,.3),110);},hit:()=>{beep(180,'sawtooth',.13,.35);setTimeout(()=>beep(130,'sawtooth',.1,.3),100);},powerup:()=>{[440,554,659,880].forEach((f,i)=>setTimeout(()=>beep(f,'sine',.1,.2),i*55));},halfhp:()=>{[220,330,440,550,660,880].forEach((f,i)=>setTimeout(()=>beep(f,'square',.12,.35),i*60));},victory:()=>{[523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,'square',.18,.3),i*110));},gameover:()=>{[440,330,220,165].forEach((f,i)=>setTimeout(()=>beep(f,'sawtooth',.25,.4),i*180));},tick:()=>beep(880,'square',.04,.15),stage:()=>{[392,494,587,784].forEach((f,i)=>setTimeout(()=>beep(f,'square',.15,.28),i*90));},};

document.getElementById('title-dino').innerHTML=SPR_PLAYER;

/* ---------- DAILY STREAK ---------- */
const DAILY_KEY='dqb3_daily';
// 7-day reward cycle  gifts are inventory powerups
const DAILY_REWARDS=[
  {pu:'heal',   amt:2},
  {pu:'double', amt:1},
  {pu:'shield', amt:1},
  {pu:'freeze', amt:1},
  {pu:'poison', amt:2},
  {pu:'divine', amt:1},
  {pu:'gamble', amt:2},
];
function todayStr(){return new Date().toISOString().slice(0,10);}
function getDaily(){try{return JSON.parse(localStorage.getItem(DAILY_KEY))||{streak:0,last:null,pending:{}};}catch(e){return{streak:0,last:null,pending:{}};}}
function setDaily(d){try{localStorage.setItem(DAILY_KEY,JSON.stringify(d));}catch(e){}}

function checkDailyStreak(){
  const d=getDaily();
  const today=todayStr();
  if(d.last===today)return; // already opened today

  // compute if yesterday to continue streak, else reset
  const y=new Date();y.setDate(y.getDate()-1);
  const yStr=y.toISOString().slice(0,10);
  if(d.last===yStr)d.streak=(d.streak||0)+1;
  else d.streak=1;
  d.last=today;
  d._justClaimedDay=((d.streak-1)%7); // index into reward cycle
  setDaily(d);
  showStreakModal(d);
}

function showStreakModal(d){
  const rewardIdx=d._justClaimedDay;
  document.getElementById('streak-count').textContent='DAY '+d.streak;
  const cells=document.getElementById('streak-days');
  const cycleDay=(d.streak-1)%7;
  cells.innerHTML=DAILY_REWARDS.map((r,i)=>{
    let cls='sd-cell';
    if(i<cycleDay)cls+=' claimed';
    else if(i===cycleDay)cls+=' today';
    else cls+=' future';
    return `<div class="${cls}">
      <div class="sd-day">D${i+1}</div>
      <div class="sd-gift">${PU[r.pu].icon}</div>
      <div class="sd-amt">${PU[r.pu].name} x${r.amt}</div>
    </div>`;
  }).join('');
  const r=DAILY_REWARDS[rewardIdx];
  document.getElementById('streak-reward').innerHTML=
    `Today's gift: <b style="color:${PU[r.pu].color}">${PU[r.pu].icon} ${PU[r.pu].name} x${r.amt}</b>`;
  document.getElementById('streak-modal').classList.add('on');
}

function claimDaily(){
  const d=getDaily();
  const r=DAILY_REWARDS[d._justClaimedDay];
  // store as pending gift  applied when a run starts
  d.pending=d.pending||{};
  d.pending[r.pu]=(d.pending[r.pu]||0)+r.amt;
  setDaily(d);
  sfx.powerup();
  closeModal('streak-modal');
}

// apply any pending daily gifts into a fresh run's inventory
function applyDailyGifts(){
  const d=getDaily();
  if(d.pending){
    Object.keys(d.pending).forEach(pu=>{
      G.inv[pu]=(G.inv[pu]||0)+d.pending[pu];
    });
    d.pending={};setDaily(d);
  }
}

/* ---------- INTRO / HOW TO PLAY ---------- */
const INTRO_KEY='dqb3_seen_intro';
const INTRO_PAGES=[
  {t:'WELCOME, HERO!',b:'You are a dino warrior battling through 5 worlds and 50 levels. Answer quiz questions to attack  the smarter and faster you are, the harder you hit!'},
  {t:'ANSWER = ATTACK',b:'Every correct answer counter-attacks the enemy. Answer fast for bonus damage. A wrong answer or timeout lets the enemy strike you instead!'},
  {t:'BUILD COMBOS',b:'Chain correct answers to raise your combo multiplier (up to 8x). A wrong answer resets your streak, so stay sharp!'},
  {t:'POWERUPS',b:'Pick 5 powerups at the start of your run  this is a ONE-TIME loadout. Use them in battle to heal, freeze enemies, deal huge damage, and more.'},
  {t:'PROGRESS & BOSSES',b:'Clear levels to earn permanent HP, ATK and RES. Every 5th level is a BOSS with special attacks. Bosses drop the best rewards!'},
  {t:'DAILY STREAK',b:'Log in every day to claim free powerup gifts. The longer your daily streak, the better the rewards. Miss a day and it resets!'},
];
let _introPage=0;
function openIntro(first){
  _introPage=0;renderIntro();
  document.getElementById('intro-modal').classList.add('on');
  if(first){try{localStorage.setItem(INTRO_KEY,'1');}catch(e){}}
}
function renderIntro(){
  const p=INTRO_PAGES[_introPage];
  document.getElementById('intro-title').textContent=p.t;
  document.getElementById('intro-body').innerHTML=
    `<div style="font-size:19px;line-height:1.6;color:var(--text);text-align:center;padding:6px">${p.b}</div>`;
  document.getElementById('intro-dots').innerHTML=INTRO_PAGES.map((_,i)=>
    `<span style="width:9px;height:9px;border-radius:50%;background:${i===_introPage?'var(--teal)':'var(--border)'};display:inline-block"></span>`
  ).join('');
  const nextBtn=document.getElementById('intro-next');
  nextBtn.textContent=_introPage>=INTRO_PAGES.length-1?'GOT IT!':'NEXT';
  document.getElementById('intro-prev').disabled=_introPage<=0;
}
document.getElementById('intro-next').onclick=()=>{
  if(_introPage>=INTRO_PAGES.length-1){closeModal('intro-modal');}
  else{_introPage++;renderIntro();}
};
document.getElementById('intro-prev').onclick=()=>{if(_introPage>0){_introPage--;renderIntro();}};

/* ---------- POWERUP GUIDE ---------- */
function openPowerupGuide(){
  const list=document.getElementById('pu-guide-list');
  list.innerHTML=Object.keys(PU).map(t=>{
    const d=PU[t];
    return `<div style="display:flex;align-items:center;gap:10px;background:var(--panel2);border:1px solid ${d.border};padding:8px 10px">
      <span style="font-size:24px">${d.icon}</span>
      <div style="flex:1">
        <div style="font-family:var(--px);font-size:8px;color:${d.color}">${d.name}</div>
        <div style="font-size:15px;color:var(--dim);margin-top:2px">${d.desc}</div>
      </div>
    </div>`;
  }).join('');
  document.getElementById('pu-guide-modal').classList.add('on');
}

function closeModal(id){document.getElementById(id).classList.remove('on');}

// First-ever visit: show intro, then daily streak
window.addEventListener('load',()=>{
  let seenIntro=false;
  try{seenIntro=!!localStorage.getItem(INTRO_KEY);}catch(e){}
  if(!seenIntro){
    openIntro(true);
    // when they close intro, show daily  patch the next button once
    const origNext=document.getElementById('intro-next').onclick;
    document.getElementById('intro-next').onclick=function(){
      const wasLast=_introPage>=INTRO_PAGES.length-1;
      origNext();
      if(wasLast)setTimeout(checkDailyStreak,300);
    };
  }else{
    checkDailyStreak();
  }
});

refreshTitle();