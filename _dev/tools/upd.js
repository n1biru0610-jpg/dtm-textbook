// アップデートのお知らせのテスト：node _dev/tools/upd.js [ページ] [幅] [高さ]
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const PAGE=process.argv[2]||'preview/index.html',W=+process.argv[3]||1366,H=+process.argv[4]||768;let ng=0;const ok=(c,m)=>{console.log((c?'OK ':'NG ')+m);if(!c)ng++};
const errs=[];let store=null;
async function ctx(b){const c=await b.newContext({viewport:{width:W,height:H},serviceWorkers:'block'});await c.route(/googleapis|gstatic/,r=>r.abort());const hd={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*'};
 await c.route(/supabase\.co/,async r=>{const u=r.request().url(),m=r.request().method();const j=(o,s=200)=>r.fulfill({status:s,contentType:'application/json',headers:hd,body:JSON.stringify(o)});if(m==='OPTIONS')return j({});
  if(/auth\/v1/.test(u))return j({access_token:'t',refresh_token:'r',expires_in:3600,user:{id:'me'}});
  if(/progress/.test(u)){if(m==='POST'){store=JSON.parse(r.request().postData()).data;return r.fulfill({status:201,headers:hd,body:''})}return j([{data:store||{v:1,nick:'てすと',profile:{id:'p1',name:'てすと',col:'#ffc531',created:1,u:1,ls:{}}}}])}
  return j([])});const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));return p}
const upOn=p=>p.evaluate(()=>$('dc').classList.contains('on')&&!!document.getElementById('updGo'));
async function closeDc(p){await p.evaluate(()=>{try{if($('zkGet').classList.contains('on'))$('zkGetOk').click()}catch(e){}try{if($('dc').classList.contains('on')&&!document.getElementById('updGo'))dcClose()}catch(e){}})}
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 // ゲスト
 let p=await ctx(b);await p.goto('http://localhost:8765/'+PAGE);await p.waitForSelector('#prof.on');await p.click('#fgs');await p.waitForTimeout(3500);
 for(let i=0;i<4&&!(await upOn(p));i++){await closeDc(p);await p.waitForTimeout(2200)}
 ok(await upOn(p),'ゲスト：ホームに出るとお知らせが出る');await p.screenshot({path:'/tmp/nmt/out/upd1.png'});
 const tx=await p.textContent('#dcc');ok(tx.includes('40こ')&&tx.includes('ドラム'),'中身（40こ・ドラム）');
 await p.click('#updLater');await p.waitForTimeout(500);ok(!(await p.evaluate(()=>$('dc').classList.contains('on'))),'「あとで」で閉じる');
 await p.reload();await p.waitForTimeout(1200);await p.evaluate(()=>{try{if($('prof').classList.contains('on'))$('fgs').click()}catch(e){}});await p.waitForTimeout(5000);await closeDc(p);await p.waitForTimeout(2500);
 ok(!(await upOn(p)),'ゲスト：2回目は出ない');await p.context().close();
 // ログイン（1回目）
 p=await ctx(b);await p.goto('http://localhost:8765/'+PAGE);await p.waitForSelector('#prof.on');await p.click('#flg');await p.fill('#nk','てすと');await p.fill('#pw','abcdef12');await p.click('#go2');await p.waitForTimeout(4000);
 const first=await p.evaluate(()=>document.getElementById('updGo')?'upd':($('dc').classList.contains('on')?'other':'none'));ok(first!=='upd','ログインボーナスより先には出ない（'+first+'）');
 for(let i=0;i<5&&!(await upOn(p));i++){await closeDc(p);await p.waitForTimeout(2200)}
 ok(await upOn(p),'ログイン：ボーナスを閉じたあとにお知らせが出る');await p.waitForTimeout(1500);
 ok(store&&store.profile&&store.profile.upd==='2026-11-tac','アカウントに「見た」を記録');
 await p.click('#updGo');await p.waitForTimeout(2500);ok(await p.evaluate(()=>document.body.classList.contains('dm')&&$('dawf').style.display!=='none'),'「スタジオでためす」でスタジオが開く');
 await p.context().close();
 // ログイン（別の端末で2回目）
 p=await ctx(b);await p.goto('http://localhost:8765/'+PAGE);await p.waitForSelector('#prof.on');await p.click('#flg');await p.fill('#nk','てすと');await p.fill('#pw','abcdef12');await p.click('#go2');await p.waitForTimeout(4000);
 for(let i=0;i<3;i++){await closeDc(p);await p.waitForTimeout(2200)}ok(!(await upOn(p)),'別の端末でログインしても2回目は出ない');
 ok(errs.length===0,'エラー0件 '+errs.slice(0,3));console.log(ng?'結果：NGあり':'結果：すべてOK');await b.close()})()
