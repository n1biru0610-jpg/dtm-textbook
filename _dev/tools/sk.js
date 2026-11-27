// 称号・ログインボーナスの通しテスト（Supabase は偽サーバー）  node bd.js [幅] [高さ] [t]
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const W=+process.argv[2]||1366,H=+process.argv[3]||768,MOB=process.argv[4]==='t';
const res=[];const ok=(n,c,i)=>{res.push(c);console.log((c?'OK':'NG')+'  '+n+(i!==undefined&&i!==''?'  ('+i+')':''))};
(async()=>{
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const ctx=await b.newContext(MOB?{viewport:{width:W,height:H},isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36'}:{viewport:{width:W,height:H}});
const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
let remote=null;const rows=[];let badgeCol=true;
await pg.route(/supabase\.co/,async r=>{const u=r.request().url(),m=r.request().method();
 if(/\/rest\/v1\/progress/.test(u)){if(m==='POST'){try{remote=JSON.parse(r.request().postData())}catch(e){}return r.fulfill({status:201,body:''})}return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(remote?[{data:remote.data}]:[])})}
 if(/daily_entries/.test(u)){
  if(m==='POST'){const row=JSON.parse(r.request().postData());if(!badgeCol&&'badge' in row)return r.fulfill({status:400,contentType:'application/json',body:JSON.stringify({code:'PGRST204',message:"Could not find the 'badge' column of 'daily_entries' in the schema cache"})});row.id='id'+(rows.length+1);rows.push(row);return r.fulfill({status:201,body:''})}
  if(/select=[^&]*badge/.test(u)&&!badgeCol)return r.fulfill({status:400,contentType:'application/json',body:JSON.stringify({code:'42703',message:'column daily_entries.badge does not exist'})});
  return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(rows.map(x=>({id:x.id,created_at:'2026-11-27T00:00:00Z',nick:x.nick,badge:badgeCol?x.badge:undefined,ok:x.ok,total:x.total,bpm:x.bpm})))})}
 r.abort()});
await pg.route(/fonts\.googleapis|accounts\.google/,r=>r.abort());
const pid='ptest1';
const seed=(days)=>pg.addInitScript(([pid,days])=>{if(sessionStorage.getItem('seeded'))return;sessionStorage.setItem('seeded','1');
  sessionStorage.setItem('dtm.acct.v1',JSON.stringify({tok:'t',ref:'r',exp:Date.now()+3600000,uid:'u1',nick:'テストくん',pid}));
  const p={id:pid,name:'テストくん',col:'#f90',created:Date.now(),u:Date.now(),last:null,ls:{}};if(days)p.bd={days,earned:{},post:{},wear:''};
  localStorage.setItem('dtm.progress.v1',JSON.stringify({schema:'dtm-learning-progress',version:1,active:pid,del:[],profiles:{[pid]:p}}))},[pid,days]);

const D=n=>{const a=[];for(let i=n-1;i>=1;i--){a.push(new Date(Date.now()+9*3600000-i*86400000).toISOString().slice(0,10))}return a};
await seed(D(3));
await pg.goto('http://localhost:8765/preview/index.html',{waitUntil:'load'});await pg.waitForTimeout(4500);
// 3日め → さくらをゲット
const w=await pg.evaluate(()=>({n:(document.querySelector('.bdn b')||{}).textContent,t:document.querySelector('.bdnew b')&&[...document.querySelectorAll('.bdnew b')].map(x=>x.textContent).join('|'),btn:document.getElementById('bdSh').textContent}));
ok('3日めのボーナスで「きせかえ」をゲットした表示が出る',w.n==='3'&&/きせかえ/.test(w.t||''),JSON.stringify(w));
await pg.click('#bdSh');await pg.waitForTimeout(400);
const tab=await pg.evaluate(()=>({t2:document.getElementById('bdT2').getAttribute('aria-selected'),cards:document.querySelectorAll('.bdsk button').length,en:document.querySelectorAll('.bdsk button.e').length,lk:document.querySelectorAll('.bdsk button.l').length}));
ok('もちもの→きせかえ画面が開き、8種類・解禁2つ・ロック6つ',tab.t2==='true'&&tab.cards===8&&tab.en===2&&tab.lk===6,JSON.stringify(tab));
await pg.click('.bdsk button[data-id="sakura"]');await pg.waitForTimeout(400);
const ap=await pg.evaluate(()=>({cls:document.body.className.match(/sk-\w+/)&&document.body.className.match(/sk-\w+/)[0],bg:getComputedStyle(document.getElementById('home')).backgroundColor,now:document.getElementById('bdNow').textContent}));
ok('さくらをえらぶと、ホームの色が変わる',ap.cls==='sk-sakura'&&ap.bg==='rgb(253, 238, 242)'&&ap.now==='さくら',JSON.stringify(ap));
await pg.screenshot({path:'/tmp/w/sk_list.png'});
await pg.evaluate(()=>document.querySelector('.bdsk button[data-id="forest"]').click());await pg.waitForTimeout(200);
ok('ロック中のきせかえは えらべない',await pg.evaluate(()=>/sk-sakura/.test(document.body.className)));
await pg.click('#dcBk');await pg.waitForTimeout(300);await pg.screenshot({path:'/tmp/w/sk_home.png'});
await pg.reload({waitUntil:'load'});await pg.waitForTimeout(4500);
ok('リロードしてもきせかえが残る',await pg.evaluate(()=>/sk-sakura/.test(document.body.className)));
ok('保存データ(サーバー)にきせかえが入る',!!remote&&remote.data&&remote.data.profile&&remote.data.profile.bd&&remote.data.profile.bd.skin==='sakura',JSON.stringify(remote&&remote.data&&remote.data.profile&&remote.data.profile.bd&&remote.data.profile.bd.skin));
// 称号タブにもどれて、クラシックに戻せる
await pg.evaluate(()=>{if(document.getElementById('dc').classList.contains('on'))document.getElementById('dcX').click()});
await pg.click('#bdBtn');await pg.waitForTimeout(300);await pg.click('#bdT2');await pg.waitForTimeout(200);await pg.click('.bdsk button[data-id=""]');await pg.waitForTimeout(200);
ok('クラシックにもどせる',await pg.evaluate(()=>!/sk-/.test(document.body.className)));
await pg.click('#bdT1');await pg.waitForTimeout(200);
ok('しょうごうタブにもどれる',await pg.evaluate(()=>document.querySelectorAll('.bdl button').length>10));
ok('エラーなし',errs.length===0,errs.join('|'));
console.log('結果：'+(res.every(Boolean)?'すべてOK':'NG あり'));await b.close()})()
