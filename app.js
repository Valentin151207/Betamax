// ═══════════════════════════════════════════════
//  BETAMAX — app.js  v5.0 — Mai 2026
//  GlobalMatchEngine · Tickets · Poker Expresso
// ═══════════════════════════════════════════════
'use strict';

// ══════════════════════════════════════════════
//  STATE GLOBAL
// ══════════════════════════════════════════════
const state = {
  user: null,
  balance: 0,
  freebets: 0,
  tickets: 0,           // ← NOUVEAU : tickets gratuits poker
  ticketLog: [],        // ← historique tickets
  useFreebet: false,
  basket: [],
  bets: [],
  solidarityTotal: 1247.80,
  userSolidarity: 0,
  boosterMultiplier: 0,
  currentTab: 'sport',
  isLoggedIn: false,
  matches: [],          // SOURCE UNIQUE — GlobalMatchEngine
  liveFilter: 'all',
  sportFilter: 'all',   // filtre onglet sport
  sportSearch: '',
  searchFilter: { sport:'all', country:'all' },
};

const BOOSTER_MULTIPLIERS = [1, 5, 15, 25, 50, 100];

// ══════════════════════════════════════════════
//  BASE DE DONNÉES MATCHS — mondiale étendue
// ══════════════════════════════════════════════
const MATCH_DB = [
  // ─── LIGUE 1 ───────────────────────────────────────────
  { id:'l1_01',sport:'foot',country:'France',   league:'Ligue 1',        flag:'🇫🇷',live:true, minute:34, score1:0,score2:1,team1:'PSG',          team2:'Marseille',      odd1:1.45,oddN:4.50,odd2:6.50 },
  { id:'l1_02',sport:'foot',country:'France',   league:'Ligue 1',        flag:'🇫🇷',live:true, minute:67, score1:1,score2:0,team1:'Lens',         team2:'Lille',          odd1:2.10,oddN:3.30,odd2:3.40 },
  { id:'l1_03',sport:'foot',country:'France',   league:'Ligue 1',        flag:'🇫🇷',live:true, minute:22, score1:0,score2:0,team1:'Monaco',       team2:'Lyon',           odd1:2.00,oddN:3.20,odd2:3.60 },
  { id:'l1_04',sport:'foot',country:'France',   league:'Ligue 1',        flag:'🇫🇷',live:false,kickoff:'21:00',team1:'Rennes',       team2:'Nantes',         odd1:2.20,oddN:3.10,odd2:3.20 },
  { id:'l1_05',sport:'foot',country:'France',   league:'Ligue 1',        flag:'🇫🇷',live:false,kickoff:'19:00',team1:'Nice',         team2:'Strasbourg',     odd1:1.95,oddN:3.40,odd2:3.80 },
  { id:'l1_06',sport:'foot',country:'France',   league:'Ligue 1',        flag:'🇫🇷',live:false,kickoff:'15:00',team1:'Brest',        team2:'Reims',          odd1:1.75,oddN:3.50,odd2:4.50 },
  { id:'l1_07',sport:'foot',country:'France',   league:'Ligue 1',        flag:'🇫🇷',live:false,kickoff:'14:30',team1:'Toulouse',     team2:'Le Havre',       odd1:1.85,oddN:3.30,odd2:4.20 },
  { id:'l1_08',sport:'foot',country:'France',   league:'Ligue 1',        flag:'🇫🇷',live:false,kickoff:'20:00',team1:'Montpellier',  team2:'Lorient',        odd1:2.10,oddN:3.15,odd2:3.40 },
  // ─── LIGUE 2 ───────────────────────────────────────────
  { id:'l2_01',sport:'foot',country:'France',   league:'Ligue 2',        flag:'🇫🇷',live:true, minute:51, score1:1,score2:1,team1:'Caen',         team2:'Dunkerque',      odd1:2.40,oddN:3.00,odd2:2.90 },
  { id:'l2_02',sport:'foot',country:'France',   league:'Ligue 2',        flag:'🇫🇷',live:false,kickoff:'18:00',team1:'Auxerre',      team2:'Grenoble',       odd1:1.90,oddN:3.30,odd2:3.70 },
  // ─── PREMIER LEAGUE ────────────────────────────────────
  { id:'pl_01',sport:'foot',country:'Angleterre',league:'Premier League',flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',live:true, minute:33, score1:0,score2:1,team1:'Chelsea',      team2:'Liverpool',      odd1:4.80,oddN:3.50,odd2:1.72 },
  { id:'pl_02',sport:'foot',country:'Angleterre',league:'Premier League',flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',live:true, minute:55, score1:2,score2:1,team1:'Man. City',    team2:'Arsenal',        odd1:1.55,oddN:4.20,odd2:5.50 },
  { id:'pl_03',sport:'foot',country:'Angleterre',league:'Premier League',flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',live:false,kickoff:'16:00',team1:'Man. United',  team2:'Tottenham',      odd1:2.40,oddN:3.30,odd2:2.80 },
  { id:'pl_04',sport:'foot',country:'Angleterre',league:'Premier League',flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',live:false,kickoff:'14:00',team1:'Newcastle',    team2:'Aston Villa',    odd1:2.20,oddN:3.40,odd2:3.10 },
  { id:'pl_05',sport:'foot',country:'Angleterre',league:'Premier League',flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',live:false,kickoff:'17:30',team1:'Brighton',     team2:'West Ham',       odd1:1.80,oddN:3.60,odd2:4.20 },
  // ─── CHAMPIONSHIP ──────────────────────────────────────
  { id:'ch_01',sport:'foot',country:'Angleterre',league:'Championship',  flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',live:true, minute:78, score1:2,score2:0,team1:'Leeds',        team2:'Sheffield Utd',  odd1:1.65,oddN:3.80,odd2:4.50 },
  // ─── LA LIGA ───────────────────────────────────────────
  { id:'ll_01',sport:'foot',country:'Espagne',  league:'La Liga',        flag:'🇪🇸',live:true, minute:45, score1:2,score2:0,team1:'Real Madrid',  team2:'Barcelone',      odd1:1.85,oddN:3.80,odd2:4.20 },
  { id:'ll_02',sport:'foot',country:'Espagne',  league:'La Liga',        flag:'🇪🇸',live:false,kickoff:'19:00',team1:'Atlético',    team2:'Séville',        odd1:1.90,oddN:3.50,odd2:3.80 },
  { id:'ll_03',sport:'foot',country:'Espagne',  league:'La Liga',        flag:'🇪🇸',live:false,kickoff:'21:00',team1:'Villarreal',  team2:'Betis',          odd1:2.30,oddN:3.20,odd2:2.90 },
  { id:'ll_04',sport:'foot',country:'Espagne',  league:'La Liga',        flag:'🇪🇸',live:false,kickoff:'16:15',team1:'Valencia',    team2:'Getafe',         odd1:2.00,oddN:3.10,odd2:3.50 },
  // ─── BUNDESLIGA ────────────────────────────────────────
  { id:'bl_01',sport:'foot',country:'Allemagne',league:'Bundesliga',     flag:'🇩🇪',live:true, minute:55, score1:1,score2:1,team1:'Bayern',       team2:'Dortmund',       odd1:1.60,oddN:4.00,odd2:5.20 },
  { id:'bl_02',sport:'foot',country:'Allemagne',league:'Bundesliga',     flag:'🇩🇪',live:false,kickoff:'15:30',team1:'Leverkusen',  team2:'Leipzig',        odd1:2.00,oddN:3.40,odd2:3.50 },
  { id:'bl_03',sport:'foot',country:'Allemagne',league:'Bundesliga',     flag:'🇩🇪',live:false,kickoff:'18:30',team1:'Francfort',   team2:'Stuttgart',      odd1:1.85,oddN:3.50,odd2:4.00 },
  // ─── SERIE A ───────────────────────────────────────────
  { id:'sa_01',sport:'foot',country:'Italie',   league:'Serie A',        flag:'🇮🇹',live:true, minute:22, score1:0,score2:0,team1:'Inter Milan',  team2:'Napoli',         odd1:2.10,oddN:3.40,odd2:3.30 },
  { id:'sa_02',sport:'foot',country:'Italie',   league:'Serie A',        flag:'🇮🇹',live:false,kickoff:'18:30',team1:'Juventus',    team2:'AC Milan',       odd1:2.30,oddN:3.20,odd2:2.90 },
  { id:'sa_03',sport:'foot',country:'Italie',   league:'Serie A',        flag:'🇮🇹',live:false,kickoff:'20:45',team1:'Roma',        team2:'Lazio',          odd1:2.40,oddN:3.10,odd2:2.80 },
  // ─── LIGA MX (MEXIQUE) ─────────────────────────────────
  { id:'mx_01',sport:'foot',country:'Mexique',  league:'Liga MX',        flag:'🇲🇽',live:true, minute:38, score1:1,score2:0,team1:'América',      team2:'Chivas',         odd1:2.10,oddN:3.20,odd2:3.10 },
  { id:'mx_02',sport:'foot',country:'Mexique',  league:'Liga MX',        flag:'🇲🇽',live:false,kickoff:'02:00',team1:'Cruz Azul',   team2:'Tigres',         odd1:2.30,oddN:3.00,odd2:2.80 },
  { id:'mx_03',sport:'foot',country:'Mexique',  league:'Liga MX',        flag:'🇲🇽',live:false,kickoff:'00:05',team1:'Monterrey',   team2:'Pumas',          odd1:1.95,oddN:3.30,odd2:3.50 },
  // ─── MLS (USA) ─────────────────────────────────────────
  { id:'mls_01',sport:'foot',country:'USA',     league:'MLS',            flag:'🇺🇸',live:true, minute:61, score1:2,score2:2,team1:'LA Galaxy',    team2:'NYCFC',          odd1:2.20,oddN:3.10,odd2:3.00 },
  { id:'mls_02',sport:'foot',country:'USA',     league:'MLS',            flag:'🇺🇸',live:false,kickoff:'01:30',team1:'Inter Miami', team2:'Atlanta',        odd1:1.80,oddN:3.40,odd2:4.00 },
  // ─── EREDIVISIE (PAYS-BAS) ─────────────────────────────
  { id:'er_01',sport:'foot',country:'Pays-Bas', league:'Eredivisie',     flag:'🇳🇱',live:false,kickoff:'18:45',team1:'Ajax',        team2:'PSV',            odd1:2.10,oddN:3.30,odd2:3.20 },
  { id:'er_02',sport:'foot',country:'Pays-Bas', league:'Eredivisie',     flag:'🇳🇱',live:false,kickoff:'20:00',team1:'Feyenoord',   team2:'AZ Alkmaar',     odd1:1.80,oddN:3.50,odd2:4.00 },
  // ─── PRIMEIRA LIGA (PORTUGAL) ──────────────────────────
  { id:'pt_01',sport:'foot',country:'Portugal', league:'Primeira Liga',  flag:'🇵🇹',live:true, minute:41, score1:1,score2:0,team1:'Benfica',      team2:'FC Porto',       odd1:2.00,oddN:3.30,odd2:3.40 },
  // ─── NBA ───────────────────────────────────────────────
  { id:'nb_01',sport:'basket',country:'USA',    league:'NBA',            flag:'🇺🇸',live:true, minute:'Q3 8:24',score1:87,score2:92,team1:'Lakers',  team2:'Warriors',       odd1:2.10,oddN:null,odd2:1.75 },
  { id:'nb_02',sport:'basket',country:'USA',    league:'NBA',            flag:'🇺🇸',live:true, minute:'Q2 3:11',score1:61,score2:58,team1:'Nuggets', team2:'Bucks',          odd1:1.90,oddN:null,odd2:1.95 },
  { id:'nb_03',sport:'basket',country:'USA',    league:'NBA',            flag:'🇺🇸',live:false,kickoff:'02:00',team1:'Celtics',     team2:'Heat',           odd1:1.65,oddN:null,odd2:2.25 },
  { id:'nb_04',sport:'basket',country:'USA',    league:'NBA',            flag:'🇺🇸',live:false,kickoff:'03:30',team1:'Clippers',    team2:'Suns',           odd1:1.85,oddN:null,odd2:2.00 },
  { id:'nb_05',sport:'basket',country:'USA',    league:'NBA',            flag:'🇺🇸',live:false,kickoff:'00:30',team1:'Knicks',      team2:'76ers',          odd1:1.95,oddN:null,odd2:1.90 },
  // ─── EUROLEAGUE ────────────────────────────────────────
  { id:'eu_01',sport:'basket',country:'Europe', league:'EuroLeague',     flag:'🇪🇺',live:true, minute:'Q4 2:05',score1:78,score2:75,team1:'Real Madrid',team2:'CSKA',           odd1:1.75,oddN:null,odd2:2.10 },
  // ─── NFL ───────────────────────────────────────────────
  { id:'nf_01',sport:'nfl',country:'USA',       league:'NFL',            flag:'🇺🇸',live:true, minute:'Q3 4:22',score1:17,score2:21,team1:'Chiefs',  team2:'Eagles',         odd1:2.20,oddN:null,odd2:1.75 },
  { id:'nf_02',sport:'nfl',country:'USA',       league:'NFL',            flag:'🇺🇸',live:true, minute:'Q2 1:05',score1:7, score2:10,team1:'Cowboys', team2:'49ers',          odd1:2.50,oddN:null,odd2:1.65 },
  { id:'nf_03',sport:'nfl',country:'USA',       league:'NFL',            flag:'🇺🇸',live:false,kickoff:'19:20',team1:'Ravens',      team2:'Dolphins',       odd1:1.80,oddN:null,odd2:2.10 },
  { id:'nf_04',sport:'nfl',country:'USA',       league:'NFL',            flag:'🇺🇸',live:false,kickoff:'23:15',team1:'Packers',     team2:'Rams',           odd1:2.30,oddN:null,odd2:1.70 },
  { id:'nf_05',sport:'nfl',country:'USA',       league:'NFL',            flag:'🇺🇸',live:false,kickoff:'22:00',team1:'Bills',       team2:'Bengals',        odd1:1.90,oddN:null,odd2:1.95 },
  { id:'nf_06',sport:'nfl',country:'USA',       league:'NFL',            flag:'🇺🇸',live:false,kickoff:'01:15',team1:'Steelers',    team2:'Browns',         odd1:2.10,oddN:null,odd2:1.80 },
  // ─── TENNIS ────────────────────────────────────────────
  { id:'te_01',sport:'tennis',country:'France', league:'Roland Garros',  flag:'🇫🇷',live:true, minute:'Set 3',score1:6,score2:7,team1:'Nadal',     team2:'Djokovic',       odd1:2.60,oddN:null,odd2:1.55 },
  { id:'te_02',sport:'tennis',country:'France', league:'Roland Garros',  flag:'🇫🇷',live:false,kickoff:'14:00',team1:'Alcaraz',     team2:'Sinner',         odd1:1.80,oddN:null,odd2:2.10 },
  { id:'te_03',sport:'tennis',country:'UK',     league:'Wimbledon',      flag:'🇬🇧',live:false,kickoff:'13:00',team1:'Medvedev',    team2:'Rublev',         odd1:1.70,oddN:null,odd2:2.20 },
  { id:'te_04',sport:'tennis',country:'USA',    league:'US Open',        flag:'🇺🇸',live:false,kickoff:'22:00',team1:'Zverev',      team2:'Tsitsipas',      odd1:1.85,oddN:null,odd2:2.00 },
  { id:'te_05',sport:'tennis',country:'Australie',league:'Open Australie',flag:'🇦🇺',live:true,minute:'Set 2',score1:6,score2:4,team1:'Swiatek',   team2:'Gauff',          odd1:1.60,oddN:null,odd2:2.40 },
  // ─── NHL ───────────────────────────────────────────────
  { id:'hl_01',sport:'hockey',country:'USA',    league:'NHL',            flag:'🇺🇸',live:true, minute:'P2 12:33',score1:2,score2:1,team1:'Maple Leafs',team2:'Canadiens',    odd1:1.80,oddN:3.20,odd2:3.90 },
  { id:'hl_02',sport:'hockey',country:'USA',    league:'NHL',            flag:'🇺🇸',live:false,kickoff:'00:00',team1:'Bruins',      team2:'Rangers',        odd1:2.10,oddN:3.50,odd2:2.80 },
  { id:'hl_03',sport:'hockey',country:'USA',    league:'NHL',            flag:'🇺🇸',live:false,kickoff:'02:30',team1:'Penguins',    team2:'Capitals',       odd1:1.95,oddN:3.40,odd2:3.20 },
];

// Pool régénération dynamique
const UPCOMING_POOL = [
  {sport:'foot',country:'France',   league:'Ligue 1',       flag:'🇫🇷',pairs:[['PSG','Monaco'],['Lens','Rennes'],['Brest','Nice'],['Marseille','Toulouse'],['Nantes','Strasbourg'],['Lille','Reims'],['Lyon','Metz'],['Le Havre','Lorient']]},
  {sport:'foot',country:'Angleterre',league:'Premier League',flag:'🏴󠁧󠁢󠁥󠁮󠁧󠁿',pairs:[['Liverpool','Chelsea'],['Arsenal','Tottenham'],['Man. City','Man. United'],['Brighton','Newcastle'],['Everton','West Ham']]},
  {sport:'foot',country:'Espagne',  league:'La Liga',       flag:'🇪🇸',pairs:[['Real Madrid','Séville'],['Barcelone','Atlético'],['Betis','Valencia'],['Villarreal','Getafe']]},
  {sport:'foot',country:'Allemagne',league:'Bundesliga',    flag:'🇩🇪',pairs:[['Bayern','Leipzig'],['Leverkusen','Francfort'],['Dortmund','Stuttgart']]},
  {sport:'foot',country:'Mexique',  league:'Liga MX',       flag:'🇲🇽',pairs:[['América','Cruz Azul'],['Chivas','Tigres'],['Monterrey','Pumas']]},
  {sport:'nfl', country:'USA',      league:'NFL',           flag:'🇺🇸',pairs:[['Chiefs','Ravens'],['Eagles','Cowboys'],['49ers','Packers'],['Dolphins','Rams']]},
  {sport:'basket',country:'USA',    league:'NBA',           flag:'🇺🇸',pairs:[['Celtics','Lakers'],['Warriors','Nuggets'],['Heat','Clippers'],['Bucks','Suns']]},
];

// Catégories pour filtres sport
const SPORT_CATS = [
  {id:'all',   label:'Tout',    icon:'🔥'},
  {id:'foot',  label:'Foot',    icon:'⚽'},
  {id:'basket',label:'Basket',  icon:'🏀'},
  {id:'nfl',   label:'NFL',     icon:'🏈'},
  {id:'tennis',label:'Tennis',  icon:'🎾'},
  {id:'hockey',label:'Hockey',  icon:'🏒'},
];

// ══════════════════════════════════════════════
//  INIT
// ══════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => { setupDropZone(); });

// ══════════════════════════════════════════════
//  AUTH
// ══════════════════════════════════════════════
function showAuthPanel(panel) {
  ['auth-home','auth-register','auth-login'].forEach(id => document.getElementById(id).style.display='none');
  document.getElementById('auth-'+panel).style.display='flex';
}

function submitRegister() {
  const fn=document.getElementById('reg-firstname').value.trim(), ln=document.getElementById('reg-lastname').value.trim(), dob=document.getElementById('reg-dob').value;
  const errEl=document.getElementById('reg-error'); errEl.textContent='';
  if(!fn||!ln||!dob){errEl.textContent='⚠️ Tous les champs sont obligatoires.';return;}
  const birth=new Date(dob),today=new Date(); let age=today.getFullYear()-birth.getFullYear();
  if(today.getMonth()-birth.getMonth()<0||(today.getMonth()===birth.getMonth()&&today.getDate()<birth.getDate()))age--;
  if(age<18){errEl.textContent='🚫 Accès refusé — Betamax est réservé aux +18 ans.';return;}
  const passport={version:'5.0',uid:'BX_'+Date.now().toString(36).toUpperCase()+'_'+Math.random().toString(36).substr(2,4).toUpperCase(),firstName:fn,lastName:ln,dob,createdAt:new Date().toISOString(),balance:0,freebets:0,tickets:0,ticketLog:[],solidarityTotal:0,bets:[]};
  downloadJSON(passport, `betamax_${fn}_${ln}_key.json`);
  showToast('✅ Compte créé ! Effectuez votre premier dépôt pour jouer.');
  applyPassport(passport);
}

function setupDropZone() {
  const zone=document.getElementById('drop-zone'); if(!zone)return;
  zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('dragover');});
  zone.addEventListener('dragleave',()=>zone.classList.remove('dragover'));
  zone.addEventListener('drop',e=>{e.preventDefault();zone.classList.remove('dragover');if(e.dataTransfer.files[0])loadPassportFile(e.dataTransfer.files[0]);});
}
function triggerFileInput(){document.getElementById('passport-file-input').click();}
function onFileSelected(input){if(input.files[0])loadPassportFile(input.files[0]);}

function loadPassportFile(file) {
  const errEl=document.getElementById('login-error'); errEl.textContent='';
  if(!file.name.endsWith('.json')){errEl.textContent='⚠️ Fichier invalide.';return;}
  const reader=new FileReader();
  reader.onload=e=>{try{const p=JSON.parse(e.target.result);if(!p.uid||!p.firstName)throw new Error();applyPassport(p);showToast(`Bienvenue, ${p.firstName} ! 👋`);}catch{errEl.textContent='⚠️ Fichier corrompu ou invalide.';}};
  reader.readAsText(file);
}

function applyPassport(p) {
  state.user=p; state.balance=p.balance??0; state.freebets=p.freebets??0;
  state.tickets=p.tickets??0; state.ticketLog=p.ticketLog??[];
  state.userSolidarity=p.solidarityTotal??0; state.bets=p.bets??[];
  bootApp();
}

function logout() {
  saveProgress(true);
  clearInterval(window._gmeOddsTimer); clearInterval(window._gmeMinuteTimer);
  Object.assign(state,{isLoggedIn:false,user:null,basket:[],bets:[],balance:0,freebets:0,tickets:0,ticketLog:[],userSolidarity:0,matches:[]});
  document.getElementById('app').style.display='none';
  document.getElementById('auth-overlay').style.display='flex';
  showAuthPanel('home'); showToast('💾 Progression sauvegardée. Déconnecté.');
}

// ══════════════════════════════════════════════
//  SAUVEGARDE
// ══════════════════════════════════════════════
function saveProgress(silent=false) {
  if(!state.user)return;
  const u={...state.user,balance:+state.balance.toFixed(2),freebets:+state.freebets.toFixed(2),tickets:state.tickets,ticketLog:state.ticketLog.slice(0,50),solidarityTotal:+state.userSolidarity.toFixed(2),bets:state.bets.slice(0,50),savedAt:new Date().toISOString()};
  const filename = state.user ? `betamax_${state.user.firstName}_${state.user.lastName}_key.json` : 'betamax_key.json';
  downloadJSON(u, filename); if(!silent)showToast('💾 Progression sauvegardée !');
}
function downloadJSON(data,filename){const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();document.body.removeChild(a);URL.revokeObjectURL(url);}

// ══════════════════════════════════════════════
//  BOOT APP
// ══════════════════════════════════════════════
function bootApp() {
  state.isLoggedIn=true;
  document.getElementById('auth-overlay').style.display='none';
  document.getElementById('app').style.display='flex';
  document.getElementById('menu-username').textContent=`${state.user.firstName} ${state.user.lastName}`;
  document.getElementById('menu-uid').textContent=state.user.uid;
  updateBalanceDisplay(); updateFreebetDisplay(); updateTicketsDisplay(); updateSolidarityDisplay();
  if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(()=>{});

  // GlobalMatchEngine : SOURCE UNIQUE
  state.matches = MATCH_DB.map(m=>({...m}));
  renderAllScreens();

  // GME — cotes toutes les 5s (DOM ciblé, 0 reflow)
  window._gmeOddsTimer   = setInterval(gmeOddsFluctuation, 5000);
  // GME — temps + buts toutes les 60s
  window._gmeMinuteTimer = setInterval(gmeMinuteEngine, 60000);
}

// ══════════════════════════════════════════════
//  GLOBAL MATCH ENGINE — cotes 5s
//  Met à jour state.matches ET le DOM simultanément
//  → Sport ET Live voient exactement la même donnée
// ══════════════════════════════════════════════
function gmeOddsFluctuation() {
  state.matches.forEach(m => {
    const diff=(m.score1||0)-(m.score2||0);
    const spread=m.live?0.08:0.04;
    const noise=()=>(Math.random()-0.5)*spread;

    if(diff>=3){m.odd1=Math.max(1.01,+(m.odd1-Math.random()*0.03).toFixed(2));m.odd2=Math.min(25,+(m.odd2+Math.random()*0.05).toFixed(2));}
    else if(diff<=-3){m.odd2=Math.max(1.01,+(m.odd2-Math.random()*0.03).toFixed(2));m.odd1=Math.min(25,+(m.odd1+Math.random()*0.05).toFixed(2));}
    else{m.odd1=Math.max(1.05,+(m.odd1+noise()).toFixed(2));m.odd2=Math.max(1.05,+(m.odd2+noise()).toFixed(2));if(m.oddN!=null)m.oddN=Math.max(2.50,+(m.oddN+noise()*0.5).toFixed(2));}

    // Mise à jour DOM ciblée : les deux onglets utilisent les mêmes IDs → sync parfaite
    ['1','N','2'].forEach(t=>{
      const v=t==='1'?m.odd1:t==='N'?m.oddN:m.odd2;
      if(v==null)return;
      document.querySelectorAll(`[id="odd-${m.id}-${t}"]`).forEach(el=>{
        el.textContent=v.toFixed(2); flashOdd(el);
      });
    });
  });

  // Sync panier
  state.basket.forEach(b=>{
    const m=state.matches.find(x=>x.id===b.matchId); if(!m)return;
    const nv=b.type==='1'?m.odd1:b.type==='N'?m.oddN:m.odd2;
    if(nv&&Math.abs(nv-b.odd)>0.01)b.odd=nv;
  });
  updateBasket();
}

function flashOdd(el){el.classList.remove('odd-flash-up');void el.offsetWidth;el.classList.add('odd-flash-up');setTimeout(()=>el.classList.remove('odd-flash-up'),400);}

// ══════════════════════════════════════════════
//  GLOBAL MATCH ENGINE — temps + buts 60s
// ══════════════════════════════════════════════
function gmeMinuteEngine() {
  const terminated=[];
  state.matches.forEach(m=>{
    if(!m.live||typeof m.minute!=='number')return;
    if(m.minute>=90){terminated.push(m.id);return;}
    m.minute+=1;
    // But foot réaliste (~2.5 buts/match)
    if(m.sport==='foot'&&Math.random()<0.028){
      const k=Math.random()>0.5?'score1':'score2'; m[k]=Math.min((m[k]||0)+1,5);
    }
    // Sync DOM instantané (Sport ET Live)
    document.querySelectorAll(`[id="score-${m.id}"]`).forEach(el=>el.textContent=`${m.score1} - ${m.score2}`);
    document.querySelectorAll(`[id="time-${m.id}"]`).forEach(el=>el.textContent=`🔴 ${m.minute}'`);
  });

  // Remplacer matchs terminés
  terminated.forEach(id=>{
    const idx=state.matches.findIndex(m=>m.id===id); if(idx<0)return;
    const old=state.matches[idx];
    const pool=UPCOMING_POOL.find(p=>p.league===old.league)||UPCOMING_POOL[0];
    const pair=pool.pairs[Math.floor(Math.random()*pool.pairs.length)];
    const hh=String(Math.floor(Math.random()*8)+12).padStart(2,'0');
    state.matches[idx]={id:'dyn_'+Date.now()+'_'+Math.random().toString(36).substr(2,4),sport:old.sport,country:old.country,league:old.league,flag:old.flag,live:false,kickoff:`${hh}:${Math.random()>0.5?'00':'30'}`,team1:pair[0],team2:pair[1],odd1:genOdd(50),oddN:old.sport==='foot'?genOdd(28):null,odd2:genOdd(38)};
  });
  if(terminated.length)renderAllScreens();
}

function genOdd(p){return Math.max(1.10,+((1/Math.max(p,5)*100)*(0.92+Math.random()*0.16)/1.08).toFixed(2));}

// ══════════════════════════════════════════════
//  RENDER
// ══════════════════════════════════════════════
function renderAllScreens(){renderSportScreen();renderLiveScreen();renderBetsScreen();}

function renderMatchCard(m) {
  const sel1=state.basket.find(b=>b.id===m.id+'_1');
  const selN=state.basket.find(b=>b.id===m.id+'_N');
  const sel2=state.basket.find(b=>b.id===m.id+'_2');
  const t1e=m.team1.replace(/'/g,"\\'"),t2e=m.team2.replace(/'/g,"\\'");
  const t1s=m.team1.split(' ')[0],t2s=m.team2.split(' ').pop();
  const timeDisp=typeof m.minute==='number'?`🔴 ${m.minute}'`:`🔴 ${m.minute}`;
  return `<div class="match-card" id="card-${m.id}">
    <div class="match-header"><span>${m.flag}</span><span class="match-league">${m.league}</span>${m.live?'<span class="live-badge">LIVE</span>':''}</div>
    <div class="match-body">
      <div class="match-teams"><div class="team-row"><span class="team-name">${m.team1}</span></div><div class="team-row"><span class="team-name">${m.team2}</span></div></div>
      <div class="match-score">${m.live?`<div class="score-display" id="score-${m.id}">${m.score1} - ${m.score2}</div><div class="match-time" id="time-${m.id}">${timeDisp}</div>`:`<div style="font-size:20px;font-weight:700;color:var(--grey-light);">${m.kickoff||''}</div>`}</div>
    </div>
    <div class="odds-row">
      <div class="odd-btn${sel1?' active':''}" onclick="toggleOdd('${m.id}','1','${t1e}',${m.odd1},'${m.league}')"><div class="odd-label">${t1s}</div><div class="odd-value" id="odd-${m.id}-1">${m.odd1.toFixed(2)}</div></div>
      ${m.oddN!=null?`<div class="odd-btn${selN?' active':''}" onclick="toggleOdd('${m.id}','N','Match nul',${m.oddN},'${m.league}')"><div class="odd-label">Nul</div><div class="odd-value" id="odd-${m.id}-N">${m.oddN.toFixed(2)}</div></div>`:''}
      <div class="odd-btn${sel2?' active':''}" onclick="toggleOdd('${m.id}','2','${t2e}',${m.odd2},'${m.league}')"><div class="odd-label">${t2s}</div><div class="odd-value" id="odd-${m.id}-2">${m.odd2.toFixed(2)}</div></div>
    </div>
  </div>`;
}

// ── Sport screen avec filtre sport et défilement ─
function renderSportScreen() {
  const q=(state.sportSearch||'').toLowerCase();
  const sf=state.searchFilter;
  let fm=state.matches;
  if(q)fm=fm.filter(m=>m.team1.toLowerCase().includes(q)||m.team2.toLowerCase().includes(q)||m.league.toLowerCase().includes(q)||(m.country||'').toLowerCase().includes(q));
  if(sf.sport!=='all')fm=fm.filter(m=>m.sport===sf.sport);
  if(sf.country!=='all')fm=fm.filter(m=>m.country===sf.country);
  if(state.sportFilter!=='all')fm=fm.filter(m=>m.sport===state.sportFilter);

  const live=fm.filter(m=>m.live),upcoming=fm.filter(m=>!m.live);
  const el1=document.getElementById('live-matches-sport'),el2=document.getElementById('upcoming-matches');
  if(el1)el1.innerHTML=live.length?live.map(renderMatchCard).join(''):'<div style="padding:16px;color:var(--grey);font-size:13px;">Aucun match en direct</div>';
  if(el2)el2.innerHTML=upcoming.length?upcoming.map(renderMatchCard).join(''):'<div style="padding:16px;color:var(--grey);font-size:13px;">Aucun match à venir</div>';
}

function setSportFilter(cat){
  state.sportFilter=cat;
  document.querySelectorAll('.sport-cat-chip').forEach(c=>c.classList.remove('active'));
  document.querySelector(`.sport-cat-chip[data-cat="${cat}"]`)?.classList.add('active');
  renderSportScreen();
}
function scrollSportCats(dx){const b=document.getElementById('sport-cat-bar');if(b)b.scrollLeft+=dx;}

// ── Live screen — MÊME source que Sport ──────────
function renderLiveScreen() {
  const f=state.liveFilter||'all';
  let live=state.matches.filter(m=>m.live);
  if(f!=='all')live=live.filter(m=>m.sport===f);
  const el=document.getElementById('live-matches-live');
  if(el)el.innerHTML=live.length?live.map(renderMatchCard).join(''):'<div style="padding:40px;text-align:center;color:var(--grey);">Aucun match en direct dans cette catégorie</div>';
}

function setLiveFilter(chip,sport){state.liveFilter=sport;document.querySelectorAll('.filter-chip').forEach(c=>c.classList.remove('active'));chip.classList.add('active');renderLiveScreen();}
function scrollLiveFilter(dx){const b=document.getElementById('live-filter-bar');if(b)b.scrollLeft+=dx;}

// ── Mes paris ─────────────────────────────────────
function renderBetsScreen() {
  const container=document.getElementById('bets-container');
  const activeTab=document.querySelector('.bet-tab.active')?.dataset?.tab||'all';
  let bets=[...state.bets];
  if(activeTab==='won')bets=bets.filter(b=>b.status==='won');
  if(activeTab==='lost')bets=bets.filter(b=>b.status==='lost');
  if(activeTab==='pending')bets=bets.filter(b=>b.status==='pending');
  if(!bets.length){container.innerHTML='<div style="padding:40px;text-align:center;color:var(--grey);">Aucun pari dans cette catégorie</div>';return;}
  container.innerHTML=bets.map(b=>{
    const sl={won:'Gagné',lost:'Perdu',pending:'En cours'}[b.status]||b.status;
    const sol=b.status==='lost'&&!b.isFreebet?`<div style="padding:6px 14px;font-size:11px;color:#69f0ae;background:rgba(0,200,83,0.08);border-top:1px solid #1a2a1a;">🤝 Don: <strong>${(b.stake*0.20).toFixed(2)}€</strong></div>`:'';
    return`<div class="bet-card"><div class="bet-card-header"><div><span class="bet-status ${b.status}">${sl}</span><span class="bet-type">${b.type}${b.isFreebet?' 🎟':''} ⚽${b.selections}</span></div><span style="color:var(--grey);">•••</span></div>
      <div class="bet-detail-row"><span class="bet-detail-label">Cote totale</span><span class="bet-detail-value">${b.totalOdd.toFixed(2)}</span></div>
      <div class="bet-detail-row"><span class="bet-detail-label">Mise</span><span class="bet-detail-value">${b.stake.toFixed(2)}€${b.isFreebet?' (FB)':''}</span></div>
      ${b.booster?`<div class="bet-detail-row"><span class="bet-detail-label"><span class="combo-booster-tag">⚡ BOOSTER +${b.booster}%</span></span><span class="bet-detail-value" style="color:var(--green)">+${(b.boosterGain||0).toFixed(2)}€</span></div>`:''}
      <div class="bet-detail-row"><span class="bet-detail-label">Gains</span><span class="bet-detail-value" style="color:${b.status==='won'?'var(--green)':b.status==='lost'?'var(--red)':'var(--yellow)'};">${b.gains!==null?b.gains.toFixed(2)+'€':'En attente...'}</span></div>
      <div class="bet-detail-row" style="font-size:11px;color:var(--grey);padding-bottom:6px;"><span>Réf: ${b.ref}</span><span>${b.date}</span></div>${sol}</div>`;
  }).join('');
}

// ══════════════════════════════════════════════
//  TICKETS — Système complet
// ══════════════════════════════════════════════
function updateTicketsDisplay() {
  document.querySelectorAll('.tickets-count').forEach(el=>el.textContent=state.tickets);
}

function applyTicketCode() {
  const input=document.getElementById('ticket-code-input');
  const code=(input?.value||'').trim().toUpperCase();
  const match=code.match(/^TICKET(\d+)$/);
  if(!match){showToast('❌ Code invalide');return;}
  const qty=parseInt(match[1]);
  if(qty<=0||qty>100){showToast('❌ Code invalide');return;}
  state.tickets+=qty;
  state.ticketLog.unshift({date:new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}),type:'Obtenu',desc:`Code bonus`,qty:+qty});
  updateTicketsDisplay(); renderTicketsScreen();
  if(input)input.value='';
  showToast(`🎟 ${qty} ticket${qty>1?'s':''} crédité${qty>1?'s':''} !`);
}

function renderTicketsScreen() {
  const el=document.getElementById('tickets-screen');
  if(!el)return;
  const logHTML=state.ticketLog.length?state.ticketLog.map(t=>`
    <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 14px;border-bottom:1px solid #111;">
      <div>
        <div style="font-size:13px;font-weight:600;color:${t.qty>0?'var(--green)':'var(--red)'};">${t.qty>0?'+':''}${t.qty} ticket${Math.abs(t.qty)>1?'s':''}</div>
        <div style="font-size:12px;color:var(--grey);margin-top:2px;">${t.desc}</div>
      </div>
      <div style="font-size:11px;color:var(--grey);">${t.date}</div>
    </div>`).join(''):'<div style="padding:24px;text-align:center;color:var(--grey);font-size:13px;">Aucun historique</div>';

  el.innerHTML=`
  <div style="padding:16px 14px 8px;">
    <!-- Compteur -->
    <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);border-radius:14px;padding:20px;text-align:center;border:1px solid #2a2a4e;margin-bottom:16px;">
      <div style="font-size:12px;color:#9c88cc;text-transform:uppercase;letter-spacing:1px;font-weight:700;">Tickets disponibles</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:64px;font-weight:900;color:var(--yellow);line-height:1;">${state.tickets}</div>
      <div style="font-size:12px;color:#9c88cc;margin-top:4px;">1 ticket = 1 partie de poker gratuite</div>
    </div>

    <!-- Saisie code -->
    <div style="background:var(--bg-card);border-radius:12px;padding:14px;border:1px solid #2a2a2a;margin-bottom:16px;">
      <div style="font-size:12px;font-weight:700;color:var(--grey-light);margin-bottom:10px;text-transform:uppercase;letter-spacing:0.5px;">🎁 Code ticket</div>
      <div style="display:flex;gap:8px;">
        <input id="ticket-code-input" placeholder="" style="flex:1;background:#222;border:1px solid #333;border-radius:8px;padding:10px 12px;color:white;font-size:15px;font-family:'Barlow',sans-serif;outline:none;text-transform:uppercase;" onkeydown="if(event.key==='Enter')applyTicketCode()" />
        <button onclick="applyTicketCode()" style="background:var(--red);border:none;color:white;padding:10px 16px;border-radius:8px;font-weight:800;font-size:14px;cursor:pointer;white-space:nowrap;">Valider</button>
      </div>
    </div>

    <!-- Utilisation -->
    <div style="background:var(--bg-card);border-radius:12px;padding:14px;border:1px solid #2a2a2a;margin-bottom:16px;">
      <div style="font-size:12px;font-weight:700;color:var(--grey-light);margin-bottom:8px;text-transform:uppercase;letter-spacing:0.5px;">💡 Comment utiliser ?</div>
      <div style="font-size:13px;color:var(--grey);line-height:1.6;">Vos tickets permettent de jouer gratuitement au Poker Expresso & Nitro. Rendez-vous dans l'onglet <strong style="color:var(--white);">Poker</strong> et choisissez <strong style="color:var(--yellow);">"Jouer (1 ticket)"</strong>.</div>
    </div>

    <!-- Historique -->
    <div style="font-size:13px;font-weight:700;color:var(--grey-light);text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">Historique</div>
    <div style="background:var(--bg-card);border-radius:12px;overflow:hidden;border:1px solid #2a2a2a;">
      ${logHTML}
    </div>
  </div>`;
}

// ══════════════════════════════════════════════
//  RECHERCHE OVERLAY
// ══════════════════════════════════════════════
function openSearchOverlay(){const o=document.getElementById('search-overlay');if(!o)return;o.style.display='flex';setTimeout(()=>document.getElementById('search-input-overlay')?.focus(),100);renderSearchResults('');}
function closeSearchOverlay(){const o=document.getElementById('search-overlay');if(o)o.style.display='none';state.sportSearch='';state.searchFilter={sport:'all',country:'all'};}
function applySearchFilter(type,value){
  state.searchFilter[type]=value;
  document.querySelectorAll(`.sf-btn[data-type="${type}"]`).forEach(b=>b.classList.remove('active'));
  document.querySelector(`.sf-btn[data-type="${type}"][data-val="${value}"]`)?.classList.add('active');
  renderSearchResults(document.getElementById('search-input-overlay')?.value||'');
}

// Défilement horizontal des barres de filtres de la recherche
function scrollSfBar(barId, dx) {
  const bar = document.getElementById(barId);
  if (bar) bar.scrollLeft += dx;
}
function renderSearchResults(q){
  state.sportSearch=q.toLowerCase();const sf=state.searchFilter;const ql=q.toLowerCase();
  let fm=state.matches;
  if(ql)fm=fm.filter(m=>m.team1.toLowerCase().includes(ql)||m.team2.toLowerCase().includes(ql)||m.league.toLowerCase().includes(ql)||(m.country||'').toLowerCase().includes(ql));
  if(sf.sport!=='all')fm=fm.filter(m=>m.sport===sf.sport);
  if(sf.country!=='all')fm=fm.filter(m=>m.country===sf.country);
  const el=document.getElementById('search-results');
  if(el)el.innerHTML=fm.length?fm.map(renderMatchCard).join(''):'<div style="padding:32px;text-align:center;color:var(--grey);">Aucun résultat</div>';
}
function applyAndCloseSearch(){const q=document.getElementById('search-input-overlay')?.value||'';state.sportSearch=q.toLowerCase();closeSearchOverlay();renderSportScreen();switchTab('sport');}

// ══════════════════════════════════════════════
//  PANIER
// ══════════════════════════════════════════════
function toggleOdd(matchId,type,teamLabel,odd,leagueLabel){
  const betId=`${matchId}_${type}`,match=state.matches.find(m=>m.id===matchId); if(!match)return;
  const idx=state.basket.findIndex(b=>b.id===betId);
  if(idx>=0){state.basket.splice(idx,1);showToast('Sélection retirée');}
  else{state.basket=state.basket.filter(b=>!b.id.startsWith(matchId));state.basket.push({id:betId,matchId,type,match:`${match.team1} - ${match.team2}`,league:leagueLabel,label:type==='N'?'Match nul':teamLabel,odd});showToast(`${teamLabel} à ${odd.toFixed(2)} ajouté !`);}
  if(state.basket.length>0)openBasket();
  renderSportScreen();renderLiveScreen();renderBasket();
}
function openBasket(){document.getElementById('bet-basket').classList.add('open');}
function closeBasket(){document.getElementById('bet-basket').classList.remove('open');}

function renderBasket(){
  const itemsEl=document.getElementById('basket-items');
  document.getElementById('basket-count').textContent=state.basket.length;
  itemsEl.innerHTML=state.basket.map(b=>`<div class="basket-item"><div class="basket-item-match">${b.league} • ${b.match}</div><div class="basket-item-bet"><span>${b.label}</span><div style="display:flex;align-items:center;gap:10px;"><span class="basket-item-odd">${b.odd.toFixed(2)}</span><button class="basket-remove" onclick="removeFromBasket('${b.id}')">✕</button></div></div></div>`).join('');
  document.getElementById('booster-preview').style.display=state.basket.length>=3?'block':'none';
  updateBasket();
}
function removeFromBasket(betId){state.basket=state.basket.filter(b=>b.id!==betId);renderSportScreen();renderLiveScreen();renderBasket();if(!state.basket.length)closeBasket();}

function updateBasket(){
  const stake=parseFloat(document.getElementById('stake-input')?.value)||0,totalOdd=state.basket.reduce((a,b)=>a*b.odd,1);
  const potGains=state.useFreebet?(totalOdd>=2?stake*totalOdd-stake:0):stake*totalOdd;
  const e1=document.getElementById('total-odds'),e2=document.getElementById('potential-gains');
  if(e1)e1.textContent=totalOdd.toFixed(2);if(e2)e2.textContent=formatCurrency(potGains);
}

function placeBet(){
  if(!state.basket.length){showToast('Aucune sélection');return;}
  const stake=parseFloat(document.getElementById('stake-input').value)||0;
  if(stake<=0){showToast('Mise invalide');return;}
  if(state.useFreebet){if(state.freebets<stake){showToast('Freebets insuffisants');return;}}
  else{if(stake>state.balance){showToast('Solde insuffisant — effectuez un dépôt');return;}}
  if(state.basket.length>=3&&!state.useFreebet){closeBasket();runComboBooster(stake);}
  else finalizeBet(stake,0);
}

// ══════════════════════════════════════════════
//  COMBO BOOSTER
// ══════════════════════════════════════════════
function runComboBooster(stake){
  const overlay=document.getElementById('booster-overlay'),grid=document.getElementById('booster-grid'),resultEl=document.getElementById('booster-result'),resultVal=document.getElementById('booster-result-val'),resultG=document.getElementById('booster-result-gains'),confirmBtn=document.getElementById('booster-confirm');
  resultEl.classList.remove('show');confirmBtn.classList.remove('show');overlay.classList.add('show');
  const shuffled=[...BOOSTER_MULTIPLIERS].sort(()=>Math.random()-0.5);
  const winnerIdx=Math.floor(Math.random()*shuffled.length);
  state.boosterMultiplier=shuffled[winnerIdx];
  grid.innerHTML=shuffled.map((mult,i)=>`<div class="booster-cell" id="bcell-${i}">+${mult}%</div>`).join('');
  Array.from({length:6},(_,i)=>document.getElementById(`bcell-${i}`)).forEach(c=>c.classList.add('lit'));
  const others=shuffled.map((_,i)=>i).filter(i=>i!==winnerIdx).sort(()=>Math.random()-0.5);
  let step=0;
  setTimeout(()=>{const elim=()=>{if(step>=others.length){const cell=document.getElementById(`bcell-${winnerIdx}`);cell.classList.remove('lit');cell.classList.add('winner');const base=stake*state.basket.reduce((a,b)=>a*b.odd,1),boosted=base+base*(state.boosterMultiplier/100);resultVal.textContent=`+${state.boosterMultiplier}%`;resultG.textContent=`Gains boostés : ${formatCurrency(boosted)}`;resultEl.classList.add('show');confirmBtn.classList.add('show');confirmBtn.dataset.stake=stake;return;}const c=document.getElementById(`bcell-${others[step]}`);c.classList.remove('lit');c.classList.add('eliminated');step++;setTimeout(elim,350+Math.random()*200);};elim();},800);
}
function confirmBooster(){const stake=parseFloat(document.getElementById('booster-confirm').dataset.stake)||0;document.getElementById('booster-overlay').classList.remove('show');finalizeBet(stake,state.boosterMultiplier);}

// ══════════════════════════════════════════════
//  FINALISER UN PARI
// ══════════════════════════════════════════════
function finalizeBet(stake,boosterPct){
  const totalOdd=state.basket.reduce((a,b)=>a*b.odd,1),isFreebet=state.useFreebet;
  if(isFreebet){state.freebets-=stake;updateFreebetDisplay();state.useFreebet=false;const btn=document.getElementById('freebet-toggle-btn');if(btn){btn.textContent='🎟 Utiliser un freebet';btn.style.background='';btn.style.borderColor='';btn.style.color='#ffd600';}}
  else state.balance-=stake;
  updateBalanceDisplay();
  const base=stake*totalOdd,boostAmt=boosterPct>0?base*(boosterPct/100):0,won=Math.random()>0.55;
  const newBet={id:'b'+Date.now(),type:state.basket.length>1?'Combiné':'Simple',status:'pending',selections:state.basket.length,totalOdd,stake,isFreebet,gains:null,booster:boosterPct||null,boosterGain:boostAmt>0?+boostAmt.toFixed(2):null,date:new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}),ref:Math.random().toString(36).substr(2,8).toUpperCase()};
  state.bets.unshift(newBet);
  setTimeout(()=>{
    newBet.status=won?'won':'lost';
    if(won){let g=isFreebet?(totalOdd>=2?+(base-stake+boostAmt).toFixed(2):0):+(base+boostAmt).toFixed(2);newBet.gains=g;state.balance+=g;updateBalanceDisplay();showToast(isFreebet&&totalOdd<2?'🎟 Cote < 2.00, gain annulé':`🎉 Pari gagné ! +${g.toFixed(2)}€`);}
    else{newBet.gains=0;if(!isFreebet)applySolidarity(stake);showToast(isFreebet?'❌ Freebet perdu.':`❌ Pari perdu. 🤝 ${(stake*0.20).toFixed(2)}€ reversés.`);}
    if(state.currentTab==='bets')renderBetsScreen();
  },3000);
  state.basket=[];renderSportScreen();renderLiveScreen();renderBasket();closeBasket();
  showToast('✅ Pari enregistré !');switchTab('bets');
}

// ══════════════════════════════════════════════
//  SOLIDARITÉ / UI
// ══════════════════════════════════════════════
function applySolidarity(l){const d=l*0.20;state.solidarityTotal+=d;state.userSolidarity+=d;updateSolidarityDisplay();}
function updateSolidarityDisplay(){document.getElementById('solidarity-total').textContent=formatCurrency(state.solidarityTotal);document.getElementById('header-solidarity').textContent=formatCurrency(state.userSolidarity);document.getElementById('menu-solidarity').textContent=formatCurrency(state.userSolidarity);document.getElementById('solidarity-fill').style.width=Math.min((state.solidarityTotal/5000)*100,100)+'%';}
function showSolidarityInfo(){showToast(`🤝 Total: ${formatCurrency(state.solidarityTotal)} | Vous: ${formatCurrency(state.userSolidarity)}`);}

function switchTab(tab){
  state.currentTab=tab;
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById(`screen-${tab}`).classList.add('active');
  document.querySelector(`[data-tab="${tab}"]`)?.classList.add('active');
  if(tab==='bets')renderBetsScreen();
  if(tab==='tickets')renderTicketsScreen();
  closeBasket();
}
function switchBetTab(el,tab){document.querySelectorAll('.bet-tab').forEach(t=>t.classList.remove('active'));el.classList.add('active');el.dataset.tab=tab;renderBetsScreen();}
function showToast(msg){const t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');clearTimeout(window._toastTimer);window._toastTimer=setTimeout(()=>t.classList.remove('show'),2800);}
function showDeposit(){document.getElementById('deposit-modal').classList.add('show');document.getElementById('deposit-input').value='';setTimeout(()=>document.getElementById('deposit-input').focus(),50);}
function closeDeposit(){document.getElementById('deposit-modal').classList.remove('show');}
function setDepositAmount(a){document.getElementById('deposit-input').value=a;}
function confirmDeposit(){const a=parseFloat(document.getElementById('deposit-input').value);if(!a||a<=0){showToast('Montant invalide');return;}state.balance+=a;updateBalanceDisplay();closeDeposit();showToast(`✅ Dépôt de ${a.toFixed(2)}€ effectué !`);}
function updateBalanceDisplay(){const s=formatCurrency(state.balance);document.getElementById('balance-display').textContent=s;document.getElementById('menu-balance').textContent=s;updateFreebetDisplay();}
function updateFreebetDisplay(){const el=document.getElementById('menu-freebets');if(el)el.textContent=formatCurrency(state.freebets);}
function formatCurrency(v){return v.toLocaleString('fr-FR',{minimumFractionDigits:2,maximumFractionDigits:2})+'€';}
function showWithdraw(){document.getElementById('withdraw-modal').classList.add('show');document.getElementById('withdraw-input').value='';}
function closeWithdraw(){document.getElementById('withdraw-modal').classList.remove('show');}
function confirmWithdraw(){const a=parseFloat(document.getElementById('withdraw-input').value);if(!a||a<=0){showToast('Montant invalide');return;}if(a>state.balance){showToast('Solde insuffisant');return;}state.balance-=a;updateBalanceDisplay();closeWithdraw();showToast('✅ Votre retrait a bien été effectué');}
function applyBonusCode(){const input=document.getElementById('bonus-code-input');const code=(input?.value||'').trim().toUpperCase();const m=code.match(/^FREE(\d+)$/);if(!m){showToast('❌ Code invalide');return;}const a=parseInt(m[1]);if(a<=0||a>500){showToast('❌ Montant invalide');return;}state.freebets+=a;updateFreebetDisplay();if(input)input.value='';showToast(`🎁 ${a}€ de freebets crédités !`);}
function toggleFreebet(){if(state.freebets<=0){showToast('Aucun freebet disponible');return;}state.useFreebet=!state.useFreebet;const btn=document.getElementById('freebet-toggle-btn');if(btn){btn.textContent=state.useFreebet?'🎟 Freebet actif ✓':'🎟 Utiliser un freebet';btn.style.background=state.useFreebet?'var(--green)':'';btn.style.borderColor=state.useFreebet?'var(--green)':'';btn.style.color=state.useFreebet?'white':'#ffd600';}showToast(state.useFreebet?`Freebet ${formatCurrency(state.freebets)} sélectionné`:'Freebet désactivé');updateBasket();}
function showCredits(){document.getElementById('credits-overlay').style.display='flex';}
function closeCredits(){document.getElementById('credits-overlay').style.display='none';}

// ══════════════════════════════════════════════
//  POKER EXPRESSO — Sit&Go style Winamax
//  Roulette multiplicateur → Texas Hold'em → Survivant
//  IA bots : Fold / Check / Call / Bet / Raise
//  Mise en jetons réglable par le joueur
// ══════════════════════════════════════════════
const PK_SUITS=['♠','♥','♦','♣'],PK_RANKS=['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
const PK_VAL={'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':11,'Q':12,'K':13,'A':14};
const EXPRESSO_MULTS=[{mult:2,weight:50},{mult:3,weight:25},{mult:5,weight:12},{mult:10,weight:7},{mult:25,weight:3},{mult:100,weight:2},{mult:1000,weight:1}];
let pkState=null;

function pkDeck(){const d=[];for(const s of PK_SUITS)for(const r of PK_RANKS)d.push({r,s});for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[d[i],d[j]]=[d[j],d[i]];}return d;}
function pkCardHTML(c,hidden=false){if(hidden)return`<div class="pk-card hidden"><span>🂠</span></div>`;const red=c.s==='♥'||c.s==='♦';return`<div class="pk-card${red?' red':''}"><span class="pk-rank-top">${c.r}</span><span class="pk-suit-mid">${c.s}</span></div>`;}

function pkEvalHand(cards){
  const vals=cards.map(c=>PK_VAL[c.r]),suits=cards.map(c=>c.s);
  const cnt={};vals.forEach(v=>cnt[v]=(cnt[v]||0)+1);
  const groups=Object.values(cnt).sort((a,b)=>b-a);
  const uniq=[...new Set(vals)].sort((a,b)=>a-b);
  const isFlush=suits.every(s=>s===suits[0]);
  const isStraight=uniq.length===5&&uniq[4]-uniq[0]===4;
  const isWheel=uniq.join(',')==='-1,12,13,14,2'||uniq.join(',')==='2,3,4,5,14';
  let rank=0,label='Carte haute';
  if(isStraight&&isFlush){rank=8;label='Quinte flush';}
  else if(groups[0]===4){rank=7;label='Carré';}
  else if(groups[0]===3&&groups[1]===2){rank=6;label='Full house';}
  else if(isFlush){rank=5;label='Couleur';}
  else if(isStraight||isWheel){rank=4;label='Suite';}
  else if(groups[0]===3){rank=3;label='Brelan';}
  else if(groups[0]===2&&groups[1]===2){rank=2;label='Double paire';}
  else if(groups[0]===2){rank=1;label='Paire';}
  const kickers=Object.entries(cnt).sort(([,a],[,b])=>b-a).flatMap(([v,c])=>Array(c).fill(parseInt(v)));
  return{rank,label,kickers};
}
function pkBestHand(hole,comm){
  const all=[...hole,...comm]; if(all.length<5)return pkEvalHand([...all,...Array(5-all.length).fill({r:'2',s:'♠'})]);
  let best=null;
  for(let i=0;i<all.length-4;i++)for(let j=i+1;j<all.length-3;j++)for(let k=j+1;k<all.length-2;k++)for(let l=k+1;l<all.length-1;l++)for(let m=l+1;m<all.length;m++){const h=pkEvalHand([all[i],all[j],all[k],all[l],all[m]]);if(!best||h.rank>best.rank||(h.rank===best.rank&&h.kickers.join()>best.kickers.join()))best=h;}
  return best;
}
function pkCompare(h1,h2){if(h1.rank!==h2.rank)return h1.rank-h2.rank;for(let i=0;i<5;i++){const d=(h1.kickers[i]||0)-(h2.kickers[i]||0);if(d)return d;}return 0;}

// IA Bot améliorée — Fold / Check / Call / Bet / Raise selon force de main
function pkBotAI(hole,comm,toCall,chips,BB,pot){
  const sample=[...hole,...comm];
  const h=pkEvalHand(sample.slice(0,Math.min(5,sample.length)));
  const str=h.rank, r=Math.random();
  const potOdds=toCall>0?(toCall/(pot+toCall)):0;

  if(toCall===0){
    // Pas de mise à suivre : Check ou Bet
    if(str>=3)return{action:'bet',amount:Math.min(BB*2,chips),label:'BET'};   // main forte → bet
    if(str>=1&&r>0.5)return{action:'bet',amount:Math.min(BB,chips),label:'BET'}; // paire → bet parfois
    if(r>0.75)return{action:'bet',amount:Math.min(BB,chips),label:'BET'};      // bluff occasionnel
    return{action:'check',label:'CHECK'};
  }

  // Doit payer pour suivre
  if(str>=4||r>0.80)return{action:'raise',amount:Math.min(toCall+BB,chips),label:'RAISE'};
  if(str>=2||(str>=1&&r>0.5)||r>0.72)return{action:'call',amount:Math.min(toCall,chips),label:'CALL'};
  return{action:'fold',label:'FOLD'};
}

// ── Entrée table ─────────────────────────────
function joinPokerTable(type,buyin,useTicket=false){
  if(useTicket){
    if(state.tickets<=0){showToast('Aucun ticket disponible');return;}
    state.tickets-=1;
    state.ticketLog.unshift({date:new Date().toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric'}),type:'Utilisé',desc:`Partie ${type.toUpperCase()}`,qty:-1});
    updateTicketsDisplay();
    showExpressoRoulette(type,0);
    return;
  }
  if(buyin>0&&buyin>state.balance){showToast('Solde insuffisant — effectuez un dépôt');return;}
  if(buyin>0){state.balance-=buyin;updateBalanceDisplay();}
  showExpressoRoulette(type,buyin);
}

// ── Roulette ──────────────────────────────────
function pickMultiplier(){const total=EXPRESSO_MULTS.reduce((s,m)=>s+m.weight,0);let r=Math.random()*total;for(const m of EXPRESSO_MULTS){r-=m.weight;if(r<=0)return m.mult;}return 2;}

function showExpressoRoulette(type,buyin){
  const overlay=document.getElementById('poker-game-overlay'); if(!overlay)return;
  const finalMult=pickMultiplier(), totalPrize=+(buyin*3*finalMult).toFixed(2);
  const mults=EXPRESSO_MULTS.map(m=>m.mult);
  const SPIN_ITEMS=22, items=[];
  for(let i=0;i<SPIN_ITEMS-1;i++)items.push(mults[Math.floor(Math.random()*mults.length)]);
  items.push(finalMult);

  overlay.style.display='flex';
  overlay.innerHTML=`<div class="pk-wrap" style="max-width:380px;text-align:center;">
    <div class="pk-header" style="justify-content:center;"><span class="pk-title">🎰 ROULETTE EXPRESSO</span></div>
    <div style="padding:20px 16px;">
      <div style="font-size:13px;color:var(--grey);margin-bottom:16px;">Votre multiplicateur de gains se révèle...</div>
      <div style="overflow:hidden;border-radius:12px;border:2px solid #ffd600;height:80px;position:relative;background:#0a0a0a;">
        <div id="roulette-track" style="display:flex;gap:8px;padding:0 8px;position:absolute;left:0;top:50%;transform:translateY(-50%);white-space:nowrap;">
          ${items.map(m=>`<div style="min-width:80px;height:60px;border-radius:8px;background:${m>=100?'linear-gradient(135deg,#7b2ff7,#e040fb)':m>=25?'linear-gradient(135deg,#e2001a,#ff5252)':m>=5?'linear-gradient(135deg,#1565c0,#42a5f5)':'#1a1a1a'};border:1px solid ${m>=25?'#ffd600':'#333'};display:flex;align-items:center;justify-content:center;font-family:'Barlow Condensed',sans-serif;font-size:26px;font-weight:900;color:white;flex-shrink:0;">x${m}</div>`).join('')}
        </div>
        <div style="position:absolute;top:0;left:50%;transform:translateX(-50%);width:2px;height:100%;background:var(--yellow);z-index:2;pointer-events:none;"></div>
      </div>
      <div id="roulette-result" style="display:none;margin-top:20px;">
        <div style="font-size:14px;color:var(--grey);margin-bottom:8px;">Multiplicateur obtenu</div>
        <div style="font-family:'Barlow Condensed',sans-serif;font-size:64px;font-weight:900;color:${finalMult>=100?'#e040fb':finalMult>=25?'var(--red)':finalMult>=5?'#42a5f5':'var(--yellow)'};">x${finalMult}</div>
        ${buyin>0?`<div style="font-size:14px;color:var(--grey);margin-top:8px;">Le survivant remporte</div><div style="font-family:'Barlow Condensed',sans-serif;font-size:36px;font-weight:900;color:var(--green);">${formatCurrency(totalPrize)}</div>`:'<div style="font-size:14px;color:var(--grey);margin-top:8px;">Partie ticket — pas de gain réel</div>'}
        <button onclick="pkStartSitNGo('${type}',${buyin},${finalMult},${totalPrize})" style="margin-top:20px;width:100%;background:var(--red);border:none;border-radius:12px;padding:14px;color:white;font-family:'Barlow Condensed',sans-serif;font-size:20px;font-weight:900;cursor:pointer;">🃏 Commencer la partie !</button>
        <button onclick="closePokerGame()" style="margin-top:8px;width:100%;background:transparent;border:1px solid #333;border-radius:12px;padding:10px;color:var(--grey);font-size:14px;cursor:pointer;">Quitter</button>
      </div>
    </div>
  </div>`;

  const track=document.getElementById('roulette-track');
  const itemW=88; let speed=22, x=0;
  const spin=()=>{speed=Math.max(2,speed*0.97);x-=speed;const minX=-(SPIN_ITEMS-1)*itemW;if(x<minX)x=minX;track.style.transform=`translateY(-50%) translateX(${x}px)`;if(speed>2.5){requestAnimationFrame(spin);}else{track.style.transition='transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94)';track.style.transform=`translateY(-50%) translateX(${minX}px)`;setTimeout(()=>{document.getElementById('roulette-result').style.display='block';},500);}};
  requestAnimationFrame(spin);
}

// ── Sit & Go ─────────────────────────────────
function pkStartSitNGo(type,buyin,mult,totalPrize){
  const CHIPS=type==='nitro'?300:500, SB=type==='nitro'?10:5, BB=SB*2;
  const deck=pkDeck();
  // Au pré-flop : Bot1 = SB, Bot2 = BB, Joueur = dealer (UTG)
  // playerBet=0 pour que toCall=BB → boutons FOLD/CALL/RAISE dès le départ
  pkState={type,buyin,mult,totalPrize,phase:'preflop',deck,handNum:1,SB,BB,
    playerHole:[deck.pop(),deck.pop()],bot1Hole:[deck.pop(),deck.pop()],bot2Hole:[deck.pop(),deck.pop()],
    community:[],
    pot:SB+BB,
    playerChips:CHIPS,          // le joueur n'a pas encore payé de blinde
    bot1Chips:CHIPS-SB,         // Bot1 = petite blinde
    bot2Chips:CHIPS-BB,         // Bot2 = grande blinde
    playerBet:0,                // joueur n'a rien misé → toCall = BB
    bot1Bet:SB,
    bot2Bet:BB,
    currentBet:BB,
    playerFolded:false,bot1Folded:false,bot2Folded:false,
    customBet:BB,
    log:[`🃏 Main #1 — Tapis: ${CHIPS}🪙 — Blindes ${SB}/${BB} — À vous d'agir`],
  };
  pkRender();
}

// ── Render table ───────────────────────────────
function pkRender(){
  const ps=pkState, overlay=document.getElementById('poker-game-overlay');
  if(!ps||!overlay)return;
  const phaseLabel={preflop:'Pré-flop',flop:'Flop',turn:'Turn',river:'River',showdown:'Showdown'}[ps.phase];
  const commHTML=()=>{const s=ps.community.map(c=>pkCardHTML(c));const e=Array(5-ps.community.length).fill('<div class="pk-card-empty"></div>');return[...s,...e].join('');};
  let handPreview='';
  if(ps.community.length>=3&&!ps.playerFolded&&ps.phase!=='showdown'){const bh=pkBestHand(ps.playerHole,ps.community);if(bh)handPreview=`<div class="pk-hand-label">✋ ${bh.label}</div>`;}
  const logHTML=ps.log.slice(-6).reverse().map((l,i)=>`<div class="pk-log-entry" style="opacity:${Math.max(0.2,1-i*0.15)}">${l}</div>`).join('');
  const toCall=Math.max(0,ps.currentBet-ps.playerBet);
  const maxBet=ps.playerChips;
  const cb=Math.min(ps.customBet||ps.BB,maxBet);
  const facingBet = toCall > 0; // un bot a misé avant nous

  let actionsHTML='';
  if(ps.phase==='showdown'){
    actionsHTML=ps.playerChips<=0
      ?`<div class="pk-info-msg" style="color:var(--red);width:100%;font-weight:700;">💀 Éliminé</div><button class="pk-btn pk-grey" onclick="closePokerGame()">Quitter</button>`
      :`<button class="pk-btn pk-green" onclick="pkNextHand()">🔄 Main suivante</button><button class="pk-btn pk-grey" onclick="closePokerGame()">Quitter</button>`;
  } else if(ps.playerFolded){
    actionsHTML=`<div class="pk-info-msg">Vous avez passé.</div><button class="pk-btn pk-green" onclick="pkBotsPlay();pkAdvance()">Continuer →</button>`;
  } else if(facingBet){
    // ── Un bot a misé → FOLD · CALL · (slider RAISE) · RAISE · ALL-IN ──
    const raiseAmt = Math.min(toCall + (ps.customBet||ps.BB), ps.playerChips);
    actionsHTML=`
      <button class="pk-btn pk-red"    onclick="pkAction('fold')">FOLD</button>
      <button class="pk-btn pk-blue"   onclick="pkAction('call')">CALL ${toCall}🪙</button>
      <div class="pk-bet-ctrl">
        <button class="pk-bet-adj" onclick="pkAdjBet(-${ps.BB})">−</button>
        <span class="pk-bet-val">${raiseAmt}🪙</span>
        <button class="pk-bet-adj" onclick="pkAdjBet(${ps.BB})">+</button>
      </div>
      <button class="pk-btn pk-orange" onclick="pkAction('raise')">RAISE</button>
      ${maxBet>0?`<button class="pk-btn pk-purple" onclick="pkAction('allin')">ALL-IN</button>`:''}`;
  } else {
    // ── Personne n'a misé → FOLD · CHECK · (slider BET) · BET · ALL-IN ──
    actionsHTML=`
      <button class="pk-btn pk-red"    onclick="pkAction('fold')">FOLD</button>
      <button class="pk-btn pk-blue"   onclick="pkAction('check')">CHECK</button>
      <div class="pk-bet-ctrl">
        <button class="pk-bet-adj" onclick="pkAdjBet(-${ps.BB})">−</button>
        <span class="pk-bet-val">${cb}🪙</span>
        <button class="pk-bet-adj" onclick="pkAdjBet(${ps.BB})">+</button>
      </div>
      <button class="pk-btn pk-yellow" onclick="pkAction('bet')">BET</button>
      ${maxBet>0?`<button class="pk-btn pk-purple" onclick="pkAction('allin')">ALL-IN</button>`:''}`;
  }

  const showBot1=ps.phase==='showdown'&&!ps.bot1Folded, showBot2=ps.phase==='showdown'&&!ps.bot2Folded;
  const prizeBar=ps.buyin>0||ps.mult>0?`<div style="background:rgba(0,200,83,0.1);border-bottom:1px solid rgba(0,200,83,0.2);padding:6px 16px;display:flex;justify-content:space-between;font-size:12px;"><span style="color:#69f0ae;">x${ps.mult} · Main #${ps.handNum}</span><span style="color:var(--green);font-weight:700;">🏆 ${ps.buyin>0?formatCurrency(ps.totalPrize):'Ticket'}</span></div>`:'';

  overlay.innerHTML=`<div class="pk-wrap">
    <div class="pk-header"><span class="pk-title">♠ ${ps.type.toUpperCase()} — <span style="color:var(--yellow)">${phaseLabel}</span></span><button onclick="closePokerGame()" class="pk-close">✕</button></div>
    ${prizeBar}
    <div class="pk-felt">
      <div class="pk-bots-row">
        <div class="pk-player-box${ps.bot1Folded?' folded':''}${ps.bot1Chips<=0?' eliminated':''}">
          <div class="pk-bot-label">🤖 Bot 1${ps.bot1Folded?` <span class='pk-badge-fold'>FOLD</span>`:''}${ps.bot1Chips<=0?` <span class='pk-badge-fold' style='background:#555'>OUT</span>`:''}</div>
          <div class="pk-hand">${showBot1?ps.bot1Hole.map(c=>pkCardHTML(c)).join(''):ps.bot1Hole.map(()=>pkCardHTML(null,true)).join('')}</div>
          <div class="pk-chips-display">💰 ${ps.bot1Chips}🪙${ps.bot1Bet>0?` <span style='color:var(--yellow);font-size:10px;'>(mis: ${ps.bot1Bet})</span>`:''}</div>
        </div>
        <div class="pk-pot-area"><div class="pk-pot-label">POT</div><div class="pk-pot-amount">${ps.pot}🪙</div><div style="font-size:10px;color:var(--grey);margin-top:4px;">${phaseLabel}</div></div>
        <div class="pk-player-box${ps.bot2Folded?' folded':''}${ps.bot2Chips<=0?' eliminated':''}">
          <div class="pk-bot-label">🤖 Bot 2${ps.bot2Folded?` <span class='pk-badge-fold'>FOLD</span>`:''}${ps.bot2Chips<=0?` <span class='pk-badge-fold' style='background:#555'>OUT</span>`:''}</div>
          <div class="pk-hand">${showBot2?ps.bot2Hole.map(c=>pkCardHTML(c)).join(''):ps.bot2Hole.map(()=>pkCardHTML(null,true)).join('')}</div>
          <div class="pk-chips-display">💰 ${ps.bot2Chips}🪙${ps.bot2Bet>0?` <span style='color:var(--yellow);font-size:10px;'>(mis: ${ps.bot2Bet})</span>`:''}</div>
        </div>
      </div>
      <div class="pk-community-row">${commHTML()}</div>
      <div class="pk-player-self${ps.playerFolded?' folded':''}${ps.playerChips<=0?' eliminated':''}">
        <div class="pk-hand">${ps.playerHole.map(c=>pkCardHTML(c)).join('')}</div>
        ${handPreview}
        <div class="pk-player-info"><span>👤 <strong>Vous</strong></span><span class="pk-chips-display">💰 ${ps.playerChips}🪙${ps.playerBet>0?` <span style='color:var(--yellow);font-size:10px;'>(mis: ${ps.playerBet})</span>`:''}</span></div>
      </div>
    </div>
    <div class="pk-log">${logHTML}</div>
    <div class="pk-actions">${actionsHTML}</div>
  </div>`;
}

function pkAdjBet(delta){
  if(!pkState)return;
  pkState.customBet=Math.max(pkState.BB,Math.min(pkState.playerChips,(pkState.customBet||pkState.BB)+delta));
  pkRender();
}

function pkAction(action){
  const ps=pkState; if(!ps||ps.playerFolded||ps.phase==='showdown'||ps.playerChips<=0)return;
  const toCall=Math.max(0,ps.currentBet-ps.playerBet);
  const cb=Math.min(ps.customBet||ps.BB,ps.playerChips);

  if(action==='fold'){ps.playerFolded=true;ps.log.push('👤 Vous : FOLD');pkBotsPlay();pkAdvance();return;}
  if(action==='check'){ps.log.push('👤 Vous : CHECK');}
  if(action==='call'){const a=Math.min(toCall,ps.playerChips);ps.playerChips-=a;ps.pot+=a;ps.playerBet+=a;ps.log.push(`👤 Vous : CALL ${a}🪙`);}
  if(action==='bet'){ps.playerChips-=cb;ps.pot+=cb;ps.playerBet+=cb;ps.currentBet=Math.max(ps.currentBet,ps.playerBet);ps.log.push(`👤 Vous : BET ${cb}🪙`);}
  if(action==='raise'){
    // Raise = payer le call + relancer d'un montant supplémentaire
    const raiseTotal=Math.min(toCall+(ps.customBet||ps.BB),ps.playerChips);
    ps.playerChips-=raiseTotal;ps.pot+=raiseTotal;ps.playerBet+=raiseTotal;
    ps.currentBet=ps.playerBet;
    ps.log.push(`👤 Vous : RAISE ${raiseTotal}🪙`);
  }
  if(action==='allin'){const a=ps.playerChips;ps.pot+=a;ps.playerBet+=a;ps.currentBet=Math.max(ps.currentBet,ps.playerBet);ps.playerChips=0;ps.log.push(`👤 Vous : ALL-IN ${a}🪙 ⚡`);}
  pkBotsPlay();pkAdvance();
}

function pkBotsPlay(){
  const ps=pkState;
  [1,2].forEach(b=>{
    const folded=b===1?ps.bot1Folded:ps.bot2Folded, chips=b===1?ps.bot1Chips:ps.bot2Chips;
    if(folded||chips<=0)return;
    const hole=b===1?ps.bot1Hole:ps.bot2Hole, botBet=b===1?ps.bot1Bet:ps.bot2Bet;
    const toCall=Math.max(0,ps.currentBet-botBet);
    const dec=pkBotAI(hole,ps.community,toCall,chips,ps.BB,ps.pot);

    if(dec.action==='fold'){if(b===1)ps.bot1Folded=true;else ps.bot2Folded=true;ps.log.push(`🤖 Bot ${b} : FOLD`);}
    else if(dec.action==='call'){const a=Math.min(toCall,chips);if(b===1){ps.bot1Chips-=a;ps.bot1Bet+=a;}else{ps.bot2Chips-=a;ps.bot2Bet+=a;}ps.pot+=a;ps.log.push(`🤖 Bot ${b} : CALL ${a}🪙`);}
    else if(dec.action==='bet'||dec.action==='raise'){const a=Math.min(dec.amount||ps.BB,chips);if(b===1){ps.bot1Chips-=a;ps.bot1Bet+=a;}else{ps.bot2Chips-=a;ps.bot2Bet+=a;}ps.pot+=a;ps.currentBet=Math.max(ps.currentBet,b===1?ps.bot1Bet:ps.bot2Bet);ps.log.push(`🤖 Bot ${b} : ${dec.label} ${a}🪙`);}
    else ps.log.push(`🤖 Bot ${b} : CHECK`);
  });
}

function pkAdvance(){
  const ps=pkState;
  const alive=[!ps.playerFolded&&ps.playerChips>0,!ps.bot1Folded&&ps.bot1Chips>0,!ps.bot2Folded&&ps.bot2Chips>0].filter(Boolean).length;
  if(alive<=1||ps.phase==='river'){pkShowdown();return;}
  const order=['preflop','flop','turn','river','showdown'], next=order[order.indexOf(ps.phase)+1];

  // Si le joueur n'a pas encore payé la BB au pré-flop (toCall > 0), 
  // on reste en pré-flop et on re-render avec les bons boutons
  if(ps.phase==='preflop' && !ps.playerFolded && Math.max(0,ps.currentBet-ps.playerBet)>0){
    pkRender(); return;
  }

  ps.playerBet=0;ps.bot1Bet=0;ps.bot2Bet=0;ps.currentBet=0;
  if(next==='flop'){ps.community=[ps.deck.pop(),ps.deck.pop(),ps.deck.pop()];ps.log.push('🃏 Flop révélé');}
  if(next==='turn'){ps.community.push(ps.deck.pop());ps.log.push('🃏 Turn révélé');}
  if(next==='river'){ps.community.push(ps.deck.pop());ps.log.push('🃏 River révélée');}
  if(next==='showdown'){pkShowdown();return;}
  ps.phase=next;pkRender();
}

function pkShowdown(){
  const ps=pkState; ps.phase='showdown';
  const alive=[];
  if(!ps.playerFolded)alive.push({who:'player',hole:ps.playerHole});
  if(!ps.bot1Folded)  alive.push({who:'bot1',  hole:ps.bot1Hole});
  if(!ps.bot2Folded)  alive.push({who:'bot2',  hole:ps.bot2Hole});

  let winner=null, bestH=null;
  alive.forEach(c=>{
    const h=pkBestHand(c.hole,ps.community);
    if(!bestH||pkCompare(h,bestH)>0){bestH=h;winner=c;}
  });

  const playerWon = winner?.who==='player';
  const whoLabel  = playerWon?'Vous':winner?.who==='bot1'?'Bot 1':'Bot 2';
  const potWon    = ps.pot;
  // Ce que le joueur a personnellement misé cette main (avant distribution)
  const playerStake = ps.playerBet || 0;

  ps.log.push(`🏆 ${whoLabel} remporte ${potWon}🪙 (${bestH?.label||'?'})`);

  // Distribuer le pot
  if(winner?.who==='player') ps.playerChips+=potWon;
  else if(winner?.who==='bot1') ps.bot1Chips+=potWon;
  else ps.bot2Chips+=potWon;
  ps.pot=0;

  // ── Animation résultat de main ──────────────────
  pkShowResultAnim(playerWon, playerWon ? potWon : playerStake, bestH?.label||'', ()=>{
    const survivors=[ps.playerChips>0,ps.bot1Chips>0,ps.bot2Chips>0].filter(Boolean).length;
    if(survivors<=1){pkTournamentEnd();return;}
    pkRender();
  });
}

// ── Animation flash résultat de main ───────────────
function pkShowResultAnim(playerWon, potJetons, handLabel, callback){
  const overlay = document.getElementById('poker-game-overlay');
  if(!overlay){callback();return;}

  // Injecter l'overlay d'animation par-dessus la table
  const anim = document.createElement('div');
  anim.id = 'pk-result-anim';
  anim.style.cssText = `
    position:absolute;inset:0;display:flex;flex-direction:column;
    align-items:center;justify-content:center;z-index:10;
    background:${playerWon?'rgba(0,40,0,0.82)':'rgba(40,0,0,0.82)'};
    border-radius:16px;animation:pkResultFadeIn 0.25s ease;
  `;

  const emoji  = playerWon ? '🏆' : '💀';
  const label  = playerWon ? 'VICTOIRE !' : 'DÉFAITE';
  const color  = playerWon ? '#00e676' : '#ff5252';
  const chips  = playerWon ? `+${potJetons}🪙` : `−${potJetons}🪙`;
  const chipColor = playerWon ? '#00e676' : '#ff5252';

  anim.innerHTML = `
    <div style="font-size:52px;margin-bottom:8px;animation:pkResultPop 0.35s cubic-bezier(0.175,0.885,0.32,1.275);">
      ${emoji}
    </div>
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:36px;font-weight:900;color:${color};letter-spacing:1px;">
      ${label}
    </div>
    ${handLabel?`<div style="font-size:14px;color:rgba(255,255,255,0.7);margin-top:4px;">${handLabel}</div>`:''}
    <div style="font-family:'Barlow Condensed',sans-serif;font-size:48px;font-weight:900;color:${chipColor};margin-top:12px;animation:pkResultSlide 0.4s 0.1s both;">
      ${chips}
    </div>
  `;

  // Positionner relativement au wrapper poker
  const wrap = overlay.querySelector('.pk-wrap');
  if(wrap){
    wrap.style.position='relative';
    wrap.appendChild(anim);
  } else {
    overlay.appendChild(anim);
  }

  // Disparition après 2s puis callback
  setTimeout(()=>{
    anim.style.animation='pkResultFadeOut 0.3s ease forwards';
    setTimeout(()=>{
      anim.remove();
      callback();
    },300);
  },2000);
}

function pkNextHand(){
  const ps=pkState; if(!ps)return;
  const survivors=[ps.playerChips>0,ps.bot1Chips>0,ps.bot2Chips>0].filter(Boolean).length;
  if(survivors<=1){pkTournamentEnd();return;}
  const deck=pkDeck(); ps.deck=deck; ps.phase='preflop'; ps.community=[]; ps.handNum=(ps.handNum||1)+1;
  const SB=ps.SB, BB=ps.BB;

  // Bot1 = SB, Bot2 = BB, Joueur = dealer/UTG → playerBet=0 → toCall=BB → FOLD/CALL/RAISE
  const b1b=Math.min(SB,ps.bot1Chips), b2b=Math.min(BB,ps.bot2Chips);
  ps.bot1Chips-=b1b; ps.bot2Chips-=b2b;
  ps.pot=b1b+b2b; ps.currentBet=BB;
  ps.playerBet=0; ps.bot1Bet=b1b; ps.bot2Bet=b2b;
  ps.playerFolded=false; ps.bot1Folded=false; ps.bot2Folded=false;
  ps.customBet=BB;
  ps.playerHole=[deck.pop(),deck.pop()]; ps.bot1Hole=[deck.pop(),deck.pop()]; ps.bot2Hole=[deck.pop(),deck.pop()];
  ps.log=[`🃏 Main #${ps.handNum} — Vous: ${ps.playerChips}🪙 / Bot1: ${ps.bot1Chips+b1b}🪙 / Bot2: ${ps.bot2Chips+b2b}🪙`];
  pkRender();
}

function pkTournamentEnd(){
  const ps=pkState, overlay=document.getElementById('poker-game-overlay'); if(!overlay)return;
  const playerWon=ps.playerChips>0;
  if(playerWon&&ps.buyin>0){state.balance+=ps.totalPrize;updateBalanceDisplay();}
  else if(!playerWon&&ps.buyin>0)applySolidarity(ps.buyin*0.2);
  const color=playerWon?'var(--green)':'var(--red)';
  overlay.innerHTML=`<div class="pk-wrap" style="max-width:360px;text-align:center;">
    <div class="pk-header" style="justify-content:center;"><span class="pk-title">♠ FIN DU TOURNOI</span></div>
    <div style="padding:32px 20px;">
      <div style="font-size:52px;margin-bottom:16px;">${playerWon?'🏆':'💀'}</div>
      <div style="font-family:'Barlow Condensed',sans-serif;font-size:28px;font-weight:900;color:${color};">${playerWon?`Victoire ! Vous remportez ${ps.buyin>0?formatCurrency(ps.totalPrize):'la gloire !'}`:ps.buyin>0?`Défaite. Mise de ${ps.buyin}€ perdue.`:'Défaite.'}</div>
      ${playerWon&&ps.buyin>0?`<div style="margin-top:12px;font-family:'Barlow Condensed',sans-serif;font-size:48px;font-weight:900;color:var(--green);">+${formatCurrency(ps.totalPrize)}</div><div style="font-size:12px;color:#69f0ae;margin-top:4px;">Multiplicateur x${ps.mult}</div>`:''}
      <button onclick="joinPokerTable('${ps.type}',${ps.buyin})" style="margin-top:24px;width:100%;background:var(--red);border:none;border-radius:12px;padding:14px;color:white;font-family:'Barlow Condensed',sans-serif;font-size:18px;font-weight:900;cursor:pointer;">🔄 Rejouer</button>
      <button onclick="closePokerGame()" style="margin-top:8px;width:100%;background:transparent;border:1px solid #333;border-radius:12px;padding:10px;color:var(--grey);font-size:14px;cursor:pointer;">Retour au lobby</button>
    </div>
  </div>`;
}

function closePokerGame(){const o=document.getElementById('poker-game-overlay');if(o)o.style.display='none';pkState=null;}
