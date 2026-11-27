// ステップ7：新しいきせかえ（スキン）10このテスト。 node _dev/tools/sk7.js [出力] [幅] [高さ] [ページ] [t]
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
 const days=[];for(let i=1;i<=8;i++)days.push('2026-10-0'+i);
 const old={id:'p1',name:'てすと',col:'#ffc531',created:1,u:1,last:'1-1',ls:{'1-1':{d:1,n:1}},studio:{x:1},dw:{},dprojs:[],bd:{days,earned:{hello:5},post:{},wear:'hello',skin:'sakura',ic:''}};
 store={v:1,nick:'てすと',profile:old};
 let p=await ctx(b);await login(p);await p.waitForTimeout(3000);
 for(let i=0;i<3;i++){await p.waitForTimeout(1300);if(await p.isVisible('#zkGetOk'))await p.click('#zkGetOk')}
 await p.evaluate(()=>{if(document.getElementById('dc').classList.contains('on'))dcClose()});
 ok(await p.evaluate(()=>P().bd.skin==='sakura'&&document.body.classList.contains('sk-sakura')),'前のきせかえはそのまま');
 ok(await p.evaluate(()=>BDSK.length===18&&new Set(BDSK.map(x=>x.id)).size===18),'きせかえ 18こ（前の8＋10）・id 重複なし');
 await p.evaluate(()=>bdShow('sk'));await p.waitForTimeout(500);await p.screenshot({path:OUT+'/sk_list.png'});
 const st=await p.$$eval('#dc .bdsk button',a=>a.map(x=>x.dataset.id+':'+x.className.split(' ')[0]));
 ok(st.includes('umi:e'),'ログイン9日で うみ が使える');
 ok(st.includes('lemon:l')&&st.includes('score:l')&&st.includes('neon:l'),'まだのきせかえは🔒 '+st.filter(s=>/lemon|score|neon/.test(s)));
 ok(await p.evaluate(()=>document.querySelector('#dc .bdsk button[data-id=lemon]').textContent.includes('あと1日')),'あと何日か出る');
 const over=await p.$$eval('#dc .bdsk button',a=>a.filter(x=>x.scrollWidth>x.clientWidth+1).map(x=>x.dataset.id));ok(!over.length,'はみ出さない '+over);
 await p.evaluate(()=>dcClose());
 // 全部もらえる状態にして、1つずつためす
 await p.evaluate(()=>{const q=P();for(let i=1;i<=31;i++){q.bd.days.push('2026-08-'+String(i).padStart(2,'0'));q.bd.days.push('2026-07-'+String(i).padStart(2,'0'));q.bd.days.push('2026-06-'+String(i%30+1).padStart(2,'0'))}q.bd.days=[...new Set(q.bd.days)];['z10','z30','chd','dw5','f10'].forEach(k=>q.bd.earned[k]=Date.now())});
 await p.evaluate(()=>{const q=P();q.bd.seen=q.bd.seen||{};Object.keys(zkOwned()).forEach(k=>q.bd.seen[k]=1)});const ids=await p.evaluate(()=>BDSK.slice(8).map(x=>x.id));
 for(const id of ids){await p.evaluate(i=>{bdSkSet(i);dcClose();openHome(false)},id);await p.waitForTimeout(600);
  const r=await p.evaluate(i=>{const h=document.getElementById('home'),cs=getComputedStyle(h);return {on:document.body.classList.contains('sk-'+i),img:cs.backgroundImage.startsWith('url("data:image/svg'),bg:cs.backgroundColor}},id);
  ok(r.on&&r.img,id+' がホームに効く（もよう '+r.img+' '+r.bg+'）');await p.screenshot({path:OUT+'/sk_'+id+'.png'})}
 await p.evaluate(()=>bdSkSet('neon'));await p.waitForTimeout(1500);ok(store.profile.bd.skin==='neon','サーバーに保存');
 await p.evaluate(()=>{const q=P();q.bd.earned.dw5=0;delete q.bd.earned.dw5;bdSkApply()});ok(await p.evaluate(()=>!document.body.classList.contains('sk-neon')),'条件がないと効かない（もとの色）');
 ok(await p.evaluate(()=>bdSkNew(5,[]).some(x=>x.id==='umi')&&bdSkNew(3,[{id:'chd'}]).some(x=>x.id==='choco')),'もらったときのお知らせの対象');
 await p.context().close();
 ok(!errs.length,'ページエラー0件 '+errs.slice(0,3));console.log(ng?'NG '+ng:'ALL OK');await b.close();process.exit(ng?1:0)})();
