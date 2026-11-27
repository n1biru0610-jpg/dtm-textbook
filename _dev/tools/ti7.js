// ステップ7：新しい称号5つのテスト。 node _dev/tools/ti7.js [出力] [幅] [高さ] [ページ] [t]
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const OUT=process.argv[2]||'.',W=+process.argv[3]||1366,H=+process.argv[4]||768,PAGE=process.argv[5]||'index.html';
const URL_='http://localhost:8765/'+PAGE;let store=null;const errs=[];let ng=0;
const ok=(c,m)=>{console.log((c?'OK ':'NG ')+m);if(!c)ng++};
async function ctx(b){const c=await b.newContext({viewport:{width:W,height:H},serviceWorkers:'block',...(process.argv[6]==='t'?{hasTouch:true,isMobile:true}:{})});
 await c.route(/googleapis|gstatic/,r=>r.abort());
 await c.route(/supabase\.co/,async r=>{const u=r.request().url(),m=r.request().method();const j=(o,s=200)=>r.fulfill({status:s,contentType:'application/json',headers:{'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*'},body:JSON.stringify(o)});
  if(m==='OPTIONS')return j({});if(/auth\/v1/.test(u))return j({access_token:'t',refresh_token:'r',expires_in:3600,user:{id:'u1'}});
  if(/rest\/v1\/progress/.test(u)){if(m==='POST'){store=JSON.parse(r.request().postData()).data;return r.fulfill({status:201,headers:{'access-control-allow-origin':'*'},body:''})}return j(store?[{data:store}]:[])}
  return j([])});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));return p}
async function login(p){await p.goto(URL_);await p.waitForSelector('#prof.on');await p.click('#flg');await p.fill('#nk','てすと');await p.fill('#pw','abcdef12');await p.click('#go2');await p.waitForTimeout(1500)}
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 // 前の版の記録：4-1〜4-5 済み・DAW 4つ・お題全クリア9回・称号いくつか
 const ls={};['1-1','1-2','2-1','2-2','2-4','2-5','2-6','4-1','4-2','4-3','4-4','4-5'].forEach(k=>ls[k]={d:1,n:1});
 const post={};for(let i=1;i<=9;i++)post['2026-10-0'+i]={ok:5,total:5};
 const old={id:'p1',name:'てすと',col:'#ffc531',created:1,u:1,last:'4-5',ls,studio:{x:1},dw:{'D-1':1,'D-2':1,'D-3':1,'D-4':1},dprojs:[],bd:{days:['2026-11-01','2026-11-02'],earned:{hello:5,d1:1,p1:3,f1:4,f5:6},post,wear:'f1',skin:'',ic:''}};
 store={v:1,nick:'てすと',profile:old};
 let p=await ctx(b);await login(p);await p.waitForTimeout(3000);
 let e=await p.evaluate(()=>P().bd.earned);const wr=await p.evaluate(()=>P().bd.wear);
 ok(!e.chd&&!e.dw5&&!e.f10,'まだ条件を満たしていない称号はもらえない '+Object.keys(e));
 ok(e.hello===5&&e.p1===3&&e.f5===6&&wr==='f1','前からの称号・つけている称号はそのまま');
 const zn=await p.evaluate(()=>Object.keys(zkOwned()).length);ok(!!e.z10===(zn>=10),'図鑑10枚の称号はカード数('+zn+')どおり');
 ok(await p.evaluate(()=>bdDefs().filter(d=>['chd','dw5','z10','z30','f10'].includes(d.id)).length===5),'新しい称号の定義が5つ');
 ok(await p.evaluate(()=>{const ids=bdDefs().map(d=>d.id);return ids.length===new Set(ids).size}),'称号の id に重複なし');
 // もちもの → 称号の一覧
 await p.evaluate(()=>{if(document.getElementById('dc').classList.contains('on'))dcClose()});await p.waitForTimeout(300);
 for(let i=0;i<3;i++){await p.waitForTimeout(1300);if(await p.isVisible('#zkGetOk'))await p.click('#zkGetOk')}await p.evaluate(()=>bdShow('ti'));await p.waitForTimeout(500);await p.evaluate(()=>{const l=[...document.querySelectorAll('#dc .bdl button')].find(x=>x.dataset.id==='chd');l&&l.scrollIntoView()});
 const li=await p.$$eval('#dc .bdl button',a=>a.map(x=>x.dataset.id+':'+x.className));
 ok(['chd','dw5','z10','z30','f10'].every(id=>li.some(s=>s.startsWith(id+':'))),'もちものの一覧に5つ出る');
 ok(li.some(s=>s.startsWith('chd:l')),'まだの称号は🔒');
 await p.screenshot({path:OUT+'/ti_list.png'});
 const over=await p.$$eval('#dc .bdl button',a=>a.filter(x=>x.scrollWidth>x.clientWidth+1).map(x=>x.dataset.id));ok(!over.length,'はみ出さない '+over);
 await p.evaluate(()=>dcClose());
 // 条件を満たす
 await p.evaluate(()=>{markDone('4-6');markDone('4-7')});e=await p.evaluate(()=>P().bd.earned);ok(!e.chd,'4-6・4-7 だけではまだ');
 await p.evaluate(()=>markDone('4-8'));await p.waitForTimeout(300);e=await p.evaluate(()=>P().bd.earned);ok(!!e.chd,'4-8 までクリアで「コードの まほうつかい」');
 const t=await p.evaluate(()=>{const q=document.querySelector('.acct,#accT,[role=status]');return document.body.innerText.includes('コードの まほうつかい')});ok(t,'お知らせに名前が出る');
 await p.evaluate(()=>{const q=P();q.dw['D-5']=1;q.dw['x']=1;bdNote(bdEval())});e=await p.evaluate(()=>P().bd.earned);ok(!!e.dw5,'DAW編5つで「DAWの みならい」');
 await p.evaluate(()=>bdPost('2026-11-20',3,5));e=await p.evaluate(()=>P().bd.earned);ok(!e.f10,'全クリアでない投稿は数えない');
 await p.evaluate(()=>bdPost('2026-11-21',4,4));e=await p.evaluate(()=>P().bd.earned);ok(!!e.f10,'全クリア10回で「お題の たつじん」');
 await p.evaluate(()=>{const q=P();for(let i=1;i<=40;i++)q.bd.days.push('2026-09-'+String(i%30+1).padStart(2,'0'));q.bd.days=[...new Set(q.bd.days)];bdNote(bdEval())});
 const zn2=await p.evaluate(()=>Object.keys(zkOwned()).length);e=await p.evaluate(()=>P().bd.earned);ok(!!e.z10===(zn2>=10)&&!!e.z30===(zn2>=30),'図鑑の称号 カード'+zn2+'枚 z10='+!!e.z10+' z30='+!!e.z30);
 // 称号をつける→作品の表示名
 for(let i=0;i<3;i++){await p.waitForTimeout(1300);if(await p.isVisible('#zkGetOk'))await p.click('#zkGetOk')}await p.evaluate(()=>bdShow('ti'));await p.waitForTimeout(400);await p.click('#dc .bdl button[data-id="chd"]');await p.waitForTimeout(400);
 ok(await p.evaluate(()=>P().bd.wear==='chd'&&bdTitle().includes('コードの まほうつかい')),'新しい称号をつけられる');
 await p.evaluate(()=>dcClose());await p.waitForTimeout(1500);
 ok(store.profile.bd.earned.chd&&store.profile.bd.wear==='chd','サーバーに保存');
 await p.context().close();
 p=await ctx(b);await login(p);await p.waitForTimeout(2500);ok(await p.evaluate(()=>!!P().bd.earned.f10&&P().bd.wear==='chd'),'別の端末で読み込める');
 await p.evaluate(()=>openHome&&openHome(false)).catch(()=>{});await p.screenshot({path:OUT+'/ti_home.png'});
 await p.context().close();
 ok(!errs.length,'ページエラー0件 '+errs.slice(0,3));console.log(ng?'NG '+ng:'ALL OK');await b.close();process.exit(ng?1:0)})();
