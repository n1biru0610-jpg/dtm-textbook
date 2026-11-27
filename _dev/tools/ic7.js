// ステップ7：着せ替え20（アイコンのキャラ10・かざり10・SVG）のテスト。 node _dev/tools/ic7.js [出力] [幅] [高さ] [ページ] [t]
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
 const old={id:'p1',name:'てすと',col:'#ffc531',created:1,u:1,last:'1-1',ls:{'1-1':{d:1,n:1}},studio:{x:1},dw:{},dprojs:[],bd:{days,earned:{hello:5},post:{},wear:'hello',skin:'sakura',ic:'🐶|🎀'}};
 store={v:1,nick:'てすと',profile:old};
 let p=await ctx(b);await login(p);await p.waitForTimeout(3000);
 for(let i=0;i<3;i++){await p.waitForTimeout(1300);if(await p.isVisible('#zkGetOk'))await p.click('#zkGetOk')}
 await p.evaluate(()=>{if(document.getElementById('dc').classList.contains('on'))dcClose()});
 ok(await p.evaluate(()=>bdIc(P().bd).c==='🐶'&&bdIc(P().bd).a==='🎀'),'前のアイコンはそのまま');
 ok(await p.evaluate(()=>BDCH.length===20&&BDAC.length===19&&new Set(BDCH.map(x=>x.e)).size===20&&new Set(BDAC.map(x=>x.e)).size===19),'キャラ20・かざり19（なし含む）・重複なし');
 await p.evaluate(()=>bdShow('ic'));await p.waitForTimeout(500);await p.screenshot({path:OUT+'/ic_list.png'});
 const st=await p.$$eval('#dc .bdpk button[data-k]',a=>a.map(x=>x.dataset.v+':'+x.className.split(' ')[0]));
 ok(st.includes('s:onpu:e')&&st.includes('s:slime:e')&&st.includes('s:gclef:e'),'ログイン8日で使えるもの');
 ok(st.includes('s:kujira:l')&&st.includes('s:suzu:l')&&st.includes('s:tsue:l'),'まだのものは🔒');
 ok(await p.$$eval('#dc .bdpk button[data-v^="s:"]',a=>a.length===20&&a.every(x=>x.querySelector('svg.bdsv')&&x.querySelector('svg').getBoundingClientRect().width>=16)),'20こ SVG の絵が出る');
 const ov=await p.$$eval('#dc .bdpk button[data-v^="s:"]',a=>a.filter(x=>{const r=x.getBoundingClientRect(),s=x.querySelector('svg').getBoundingClientRect();return s.left<r.left-1||s.right>r.right+1||s.top<r.top-1||s.bottom>r.bottom+1}).map(x=>x.dataset.v));ok(!ov.length,'ボタンからはみ出さない '+ov);
 await p.click('#dc .bdpk button[data-v="s:kujira"]');await p.waitForTimeout(200);ok((await p.textContent('#bdHt')).includes('ログイン21日'),'🔒を押すと条件が出る');
 await p.click('#dc .bdpk button[data-v="s:onpu"]');await p.waitForTimeout(300);await p.click('#dc .bdpk button[data-v="s:gclef"]');await p.waitForTimeout(300);
 ok(await p.evaluate(()=>P().bd.ic==='s:onpu|s:gclef'),'えらぶと保存 '+await p.evaluate(()=>P().bd.ic));
 ok(await p.evaluate(()=>{const h=bdAv(P());return h.includes('bdsv')&&(h.match(/<svg/g)||[]).length===2}),'アイコンにキャラとかざりの絵');
 await p.evaluate(()=>dcClose());await p.waitForTimeout(300);
 ok(await p.evaluate(()=>[...document.querySelectorAll('.avx svg')].some(s=>s.getBoundingClientRect().width>10)),'画面のアイコンに絵が出る');
 await p.screenshot({path:OUT+'/ic_home.png'});
 await p.evaluate(()=>{const q=P();for(let i=1;i<=31;i++){q.bd.days.push('2026-08-'+String(i).padStart(2,'0'));q.bd.days.push('2026-07-'+String(i).padStart(2,'0'))}q.bd.days=[...new Set(q.bd.days)];['ch1','ch2','ch3','ch4','ch5','p5','p10','f5','z10','z30','dw5','chd'].forEach(k=>q.bd.earned[k]=Date.now());bdShow('ic')});await p.waitForTimeout(400);
 ok(await p.$$eval('#dc .bdpk button[data-v^="s:"]',a=>a.every(x=>x.classList.contains('e'))),'条件がそろうと20こ全部使える');
 for(let i=0;i<4;i++){await p.waitForTimeout(800);if(await p.isVisible('#zkGetOk'))await p.click('#zkGetOk')}if(!(await p.isVisible('#dc .bdpk')))await p.evaluate(()=>bdShow('ic'));await p.screenshot({path:OUT+'/ic_all.png'});
 await p.click('#dc .bdpk button[data-v="s:deshi"]');await p.waitForTimeout(300);await p.click('#dc .bdpk button[data-v="s:boushi"]');await p.waitForTimeout(1500);
 ok(store.profile.bd.ic==='s:deshi|s:boushi','サーバーに保存');
 await p.evaluate(()=>{const q=P();delete q.bd.earned.chd});ok(await p.evaluate(()=>bdIc(P().bd).c===''&&bdIc(P().bd).a==='s:boushi'),'条件がないと使えない');
 ok(await p.evaluate(()=>bdIcT([{id:'ch1'},{id:'z10'}]).includes('2こ')&&bdIcT([{id:'hello'}])===''),'称号をもらったときのお知らせ');
 const lg=await p.evaluate(()=>bdAv(P(),1));ok(lg.includes('lg'),'大きいアイコン');
 await p.context().close();
 // 別の端末で読み込み
 p=await ctx(b);await login(p);await p.waitForTimeout(2500);ok(await p.evaluate(()=>P().bd.ic==='s:deshi|s:boushi'),'別の端末で読み込み');await p.context().close();
 ok(!errs.length,'ページエラー0件 '+errs.slice(0,3));console.log(ng?'NG '+ng:'ALL OK');await b.close();process.exit(ng?1:0)})();
