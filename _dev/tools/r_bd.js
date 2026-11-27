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
await seed(null);
await pg.goto('http://localhost:8765/index.html',{waitUntil:'load'});await pg.waitForTimeout(4500);
const w1=await pg.evaluate(()=>({on:document.getElementById('dc').classList.contains('on'),h:document.getElementById('dcH')&&document.getElementById('dcH').textContent,n:(document.querySelector('.bdn b')||{}).textContent,nw:[...document.querySelectorAll('.bdnew li b')].map(x=>x.textContent),th:(document.querySelector('#dcc .dt b')||{}).textContent,hl:document.body.classList.contains('dchl')}));
ok('その日はじめてのログインで「ログインボーナス」が出る（1日め）',w1.on&&/ようこそ/.test(w1.h)&&w1.n==='1',JSON.stringify(w1));
ok('最初のログインで、最初の称号「はじめまして」がもらえる',w1.nw.length===1&&w1.nw[0]==='はじめまして',JSON.stringify(w1.nw));
ok('ボーナス画面に今日のお題が出る',/『.+』/.test(w1.th||''),w1.th);
await pg.screenshot({path:'/tmp/w/bd_welcome.png'});
await pg.click('#bdLt');await pg.waitForTimeout(300);
const hl=await pg.evaluate(()=>({hl:document.body.classList.contains('dchl'),an:getComputedStyle(document.getElementById('dcCta')).animationName}));
ok('閉じたあと、今日のお題のボタンがハイライト（点滅）される',hl.hl&&/dcPulse/.test(hl.an),JSON.stringify(hl));
await pg.screenshot({path:'/tmp/w/bd_home.png'});
const bb=await pg.evaluate(()=>({vis:getComputedStyle(document.getElementById('bdBtn')).display,t:document.getElementById('bdBtn').textContent}));
ok('ホームに「称号」ボタンが出て、つけている称号名が表示される',bb.vis==='block'&&/はじめまして/.test(bb.t),JSON.stringify(bb));
// 同じ日にもう一度（リロード）→出ない
await pg.reload({waitUntil:'load'});await pg.waitForTimeout(4500);
ok('同じ日の2回めは、ログインボーナスが出ない',!(await pg.evaluate(()=>document.getElementById('dc').classList.contains('on'))));
// 称号画面
await pg.click('#bdBtn');await pg.waitForTimeout(400);
const sh=await pg.evaluate(()=>({e:document.querySelectorAll('.bdl button.e').length,l:document.querySelectorAll('.bdl button.l').length,w:(document.querySelector('.bdl button.w b')||{}).textContent}));
ok('称号一覧：もらった称号と、まだの称号（鍵つき）が並ぶ',sh.e===1&&sh.l>=15&&sh.w==='はじめまして',JSON.stringify(sh));
await pg.screenshot({path:'/tmp/w/bd_list.png'});
// 称号をレッスンでもらう：基礎編すべてクリア
await pg.evaluate(()=>{dcClose();CH.forEach(c=>c.ids.forEach(id=>{if(!isDone(id))markDone(id)}))});await pg.waitForTimeout(300);
const ea=await pg.evaluate(()=>{const b=P().bd;return Object.keys(b.earned).join(',')});
ok('基礎編を全部クリアすると「基礎マスター」と各章の称号がもらえる',/basic/.test(ea)&&/ch1/.test(ea),ea);
// 称号を選ぶ（カスタマイズ）
await pg.evaluate(()=>bdShow());await pg.waitForTimeout(300);
await pg.evaluate(()=>[...document.querySelectorAll('.bdl button.e')].find(x=>/基礎マスター/.test(x.textContent)).click());await pg.waitForTimeout(300);
ok('もらった称号を選んで、つける称号を変えられる',(await pg.evaluate(()=>P().bd.wear))==='basic'&&/基礎マスター/.test(await pg.evaluate(()=>document.getElementById('bdBtn').textContent)));
await pg.evaluate(()=>bdWear('-'));ok('「称号をつけない」もできる',(await pg.evaluate(()=>bdTitle()))==='');
await pg.evaluate(()=>bdWear('basic'));
// 投稿（DAWから）で称号
for(let i=0;i<2;i++){const day=i===0?'2026-11-27':'2026-11-26';
 await pg.evaluate(d=>dcSubmit({day:d,title:'テスト',ok:6,total:6,bpm:90,proj:{T:[],bpm:90,bars:4}}),day);await pg.waitForTimeout(700)}
const pe=await pg.evaluate(()=>Object.keys(P().bd.earned).filter(k=>/^p|^f/.test(k)).join(','));
ok('曲を投稿すると「最高の一歩」、2曲目で「地道な成功」、全クリア投稿で「お題マスター」',/p1/.test(pe)&&/p2/.test(pe)&&/f1/.test(pe),pe);
ok('投稿データにアカウント名と称号が入る',rows.length===2&&rows[0].nick==='テストくん'&&/基礎マスター/.test(rows[0].badge||''),JSON.stringify(rows[0]&&{n:rows[0].nick,b:rows[0].badge}));
// みんなの作品に表示
await pg.evaluate(()=>dcShowGallery());await pg.waitForTimeout(1200);
const gl=await pg.evaluate(()=>[...document.querySelectorAll('#dcL li')].map(l=>l.innerText.replace(/\s+/g,' ')));
ok('みんなの作品に、アカウントと称号が表示される',gl.length===1&&/基礎マスター/.test(gl[0])&&/テストくん/.test(gl[0]),gl.join('|'));
await pg.screenshot({path:'/tmp/w/bd_gallery.png'});
// badge列がまだ無いサーバー
badgeCol=false;rows.length=0;
await pg.evaluate(()=>{dcClose();dcSubmit({day:'2026-11-25',title:'テスト',ok:6,total:6,bpm:90,proj:{T:[],bpm:90,bars:4}})});await pg.waitForTimeout(900);
ok('サーバーにbadge列がなくても、称号なしで投稿できる',rows.length===1&&!('badge' in rows[0]),JSON.stringify(rows[0]&&Object.keys(rows[0])));
await pg.evaluate(()=>dcShowGallery());await pg.waitForTimeout(1200);
ok('badge列がなくても、みんなの作品は読める',(await pg.evaluate(()=>document.querySelectorAll('#dcL li').length))===1);
// 同期：リモートに保存される（アカウント）
await pg.waitForTimeout(1200);
ok('称号のデータがアカウントに保存される（同期）',!!(remote&&remote.data&&remote.data.profile&&remote.data.profile.bd&&remote.data.profile.bd.earned.basic),remote&&Object.keys((remote.data.profile.bd||{earned:{}}).earned).length+'個');
// 別の日（昨日までのログイン履歴）→ログイン日数が増える
await pg.close();
const pg2=await ctx.newPage();pg2.on('pageerror',e=>errs.push(e.message));
await pg2.route(/supabase\.co/,r=>r.abort());await pg2.route(/fonts\.googleapis|accounts\.google/,r=>r.abort());
const y=d=>new Date(Date.now()+9*3600000-d*86400000).toISOString().slice(0,10);
await pg2.addInitScript(([pid,days])=>{if(sessionStorage.getItem('seeded'))return;sessionStorage.setItem('seeded','1');sessionStorage.setItem('dtm.acct.v1',JSON.stringify({tok:'t',ref:'r',exp:Date.now()+3600000,uid:'u1',nick:'テストくん',pid}));
 localStorage.setItem('dtm.progress.v1',JSON.stringify({schema:'dtm-learning-progress',version:1,active:pid,del:[],profiles:{[pid]:{id:pid,name:'テストくん',col:'#f90',created:Date.now(),u:Date.now(),last:null,ls:{},bd:{days,earned:{hello:1},post:{},wear:'hello'}}}}))},[pid,[y(3),y(2),y(1)]]);
await pg2.goto('http://localhost:8765/index.html',{waitUntil:'load'});await pg2.waitForTimeout(5500);
const w2=await pg2.evaluate(()=>({n:(document.querySelector('.bdn b')||{}).textContent,nw:[...document.querySelectorAll('.bdnew li b')].map(x=>x.textContent),stamps:document.querySelectorAll('.bds li.on').length,nx:(document.getElementById('bdNx')||{}).textContent}));
ok('3日つづけて来たあと4日め：日数が増え、3日の称号がもらえる',w2.n==='4'&&w2.nw.includes('ちょっと なれてきた')&&w2.stamps===4,JSON.stringify(w2));
await pg2.screenshot({path:'/tmp/w/bd_welcome2.png'});
// ゲスト
const pg3=await (await b.newContext({viewport:{width:W,height:H}})).newPage();pg3.on('pageerror',e=>errs.push(e.message));
await pg3.route(/supabase\.co|fonts\.googleapis|accounts\.google/,r=>r.abort());
await pg3.goto('http://localhost:8765/index.html',{waitUntil:'load'});await pg3.waitForTimeout(1500);await pg3.evaluate(()=>{newProf('ゲスト',AVC[0]);DB.profiles[DB.active].tmp=1;closeProf();chip();hopPos=null;renderHome(false)});await pg3.waitForTimeout(4500);
const g=await pg3.evaluate(()=>({modal:document.getElementById('dc').classList.contains('on'),hl:document.body.classList.contains('dchl')}));
ok('ゲストはログインボーナスは出ないが、今日のお題のハイライトは出る',!g.modal&&g.hl,JSON.stringify(g));
await pg3.evaluate(()=>{document.getElementById('bdBtn').click()});await pg3.waitForTimeout(300);
ok('ゲストが称号ボタンをおすと「ログインすると…」と案内が出る',/ログインすると/.test(await pg3.evaluate(()=>document.getElementById('dcc').innerText)));
ok('ページエラー0件',errs.length===0,errs.slice(0,3).join('|'));
console.log(res.every(x=>x)?'結果：すべてOK':'結果：NG あり');await b.close()})();
