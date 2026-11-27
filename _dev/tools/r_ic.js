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
await pg.goto('http://localhost:8765/index.html',{waitUntil:'load'});await pg.waitForTimeout(4500);

await pg.click('#bdLt').catch(()=>{});await pg.waitForTimeout(300);
await pg.evaluate(()=>{if(document.getElementById('dc').classList.contains('on'))document.getElementById('dcX').click()});
await pg.click('#pchip');await pg.waitForTimeout(400);
const pr=await pg.evaluate(()=>({dc:document.getElementById('dc').classList.contains('on'),prof:document.getElementById('prof').classList.contains('on'),t1:document.getElementById('bdT1')&&document.getElementById('bdT1').getAttribute('aria-selected'),ac:!!document.getElementById('bdAc')}));
ok('アカウント（左下のチップ）を開くと、すぐ「もちもの」が表示される',pr.dc&&!pr.prof&&pr.t1==='true'&&pr.ac,JSON.stringify(pr));
await pg.screenshot({path:'/tmp/w/ic_prof.png'});
await pg.click('#bdAc');await pg.waitForTimeout(400);
ok('「👤 アカウント・ログアウト」でアカウント画面（ログアウト）が開く',await pg.evaluate(()=>document.getElementById('prof').classList.contains('on')&&!!document.getElementById('plo')&&!document.getElementById('dc').classList.contains('on')));
await pg.click('#pcl');await pg.waitForTimeout(300);
await pg.click('#pchip');await pg.waitForTimeout(400);await pg.click('#bdT3');await pg.waitForTimeout(400);
const t=await pg.evaluate(()=>({tab:document.getElementById('bdT3').getAttribute('aria-selected'),ch:document.querySelectorAll('[data-k=c]').length,ac:document.querySelectorAll('[data-k=a]').length,co:document.querySelectorAll('[data-k=o]').length,lkc:document.querySelectorAll('[data-k=c].l').length,lka:document.querySelectorAll('[data-k=a].l').length}));
ok('アイコン画面：キャラ10・かざり9・いろ8、ロックはキャラ3・かざり7',t.tab==='true'&&t.ch===10&&t.ac===9&&t.co===8&&t.lkc===3&&t.lka===7,JSON.stringify(t));
await pg.click('[data-k=c][data-v="🐶"]');await pg.waitForTimeout(250);
await pg.click('[data-k=a][data-v="🎀"]');await pg.waitForTimeout(250);
await pg.click('[data-k=o][data-v="#e0527a"]');await pg.waitForTimeout(250);
await pg.evaluate(()=>document.querySelector('[data-k=a][data-v="👑"]').click());await pg.waitForTimeout(200);
const ht=await pg.evaluate(()=>document.getElementById('bdHt').textContent);
ok('ロック中のかざりは えらべず、条件が出る',/ログイン30日/.test(ht),ht);
await pg.screenshot({path:'/tmp/w/ic_edit.png'});
await pg.click('#dcX');await pg.waitForTimeout(300);
const ch=await pg.evaluate(()=>{const a=document.querySelector('#pchip .av');return {i:a.querySelector('i')&&a.querySelector('i').textContent,b:a.querySelector('b')&&a.querySelector('b').textContent,bg:a.style.background}});
ok('ホームのアカウントのアイコンに反映（🐶＋🎀＋ピンク）',ch.i==='🐶'&&ch.b==='🎀'&&/224, 82, 122|#e0527a/.test(ch.bg),JSON.stringify(ch));
await pg.screenshot({path:'/tmp/w/ic_home.png'});
await pg.reload({waitUntil:'load'});await pg.waitForTimeout(4500);
ok('リロード後も残る',await pg.evaluate(()=>{const a=document.querySelector('#pchip .av i');return a&&a.textContent==='🐶'}));
ok('サーバー保存に入る',!!remote&&remote.data&&remote.data.profile&&remote.data.profile.bd&&remote.data.profile.bd.ic==='🐶|🎀'&&remote.data.profile.col==='#e0527a',JSON.stringify(remote&&remote.data&&remote.data.profile&&[remote.data.profile.bd&&remote.data.profile.bd.ic,remote.data.profile.col]));
ok('エラーなし',errs.length===0,errs.join('|'));
console.log('結果：'+(res.every(Boolean)?'すべてOK':'NG あり'));await b.close()})()
