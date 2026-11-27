// 称号・ログインボーナスの通しテスト（Supabase は偽サーバー）  node bd.js [幅] [高さ] [t]
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const W=+process.argv[2]||1366,H=+process.argv[3]||768,MOB=process.argv[4]==='t';
const res=[];const ok=(n,c,i)=>{res.push(c);console.log((c?'OK':'NG')+'  '+n+(i!==undefined&&i!==''?'  ('+i+')':''))};
(async()=>{
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const ctx=await b.newContext(MOB?{viewport:{width:W,height:H},isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/120 Mobile Safari/537.36'}:{viewport:{width:W,height:H}});
const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
const TS={rows:[],posts:[],patches:[]};let remote=null;const rows=[];let badgeCol=true;
await pg.route(/supabase\.co/,async r=>{const u=r.request().url(),m=r.request().method();
 if(/\/rest\/v1\/progress/.test(u)){if(m==='POST'){try{remote=JSON.parse(r.request().postData())}catch(e){}return r.fulfill({status:201,body:''})}return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(remote?[{data:remote.data}]:[])})}
 if(/daily_entries/.test(u)){
  if(m==='POST'){const row=JSON.parse(r.request().postData());if(!badgeCol&&'badge' in row)return r.fulfill({status:400,contentType:'application/json',body:JSON.stringify({code:'PGRST204',message:"Could not find the 'badge' column of 'daily_entries' in the schema cache"})});row.id='id'+(rows.length+1);rows.push(row);return r.fulfill({status:201,body:''})}
  if(/select=[^&]*badge/.test(u)&&!badgeCol)return r.fulfill({status:400,contentType:'application/json',body:JSON.stringify({code:'42703',message:'column daily_entries.badge does not exist'})});
  return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(rows.map(x=>({id:x.id,created_at:'2026-11-27T00:00:00Z',nick:x.nick,badge:badgeCol?x.badge:undefined,ok:x.ok,total:x.total,bpm:x.bpm})))})}
 if(/teacher_songs/.test(u)){const j=(o,st)=>r.fulfill({status:st||200,contentType:'application/json',body:JSON.stringify(o)});
  if(m==='POST'){const row=JSON.parse(r.request().postData());TS.posts.push(row);TS.rows.push(Object.assign({id:'ts'+(TS.rows.length+1),created_at:new Date().toISOString(),user_id:'u1',reply:'',stamp:'',replied_at:null},row));return r.fulfill({status:201,body:''})}
  if(m==='PATCH'){const id=/id=eq\.([^&]+)/.exec(u)[1];const x=TS.rows.find(q=>q.id===id);Object.assign(x,JSON.parse(r.request().postData()));TS.patches.push(x);return r.fulfill({status:204,body:''})}
  if(m==='DELETE'){const id=/id=eq\.([^&]+)/.exec(u)[1];TS.rows=TS.rows.filter(q=>q.id!==id);return r.fulfill({status:204,body:''})}
  if(/id=eq\./.test(u)){const id=/id=eq\.([^&]+)/.exec(u)[1];return j(TS.rows.filter(q=>q.id===id))}
  if(/replied_at=not\.is\.null/.test(u))return j(TS.rows.filter(q=>q.replied_at).map(q=>({id:q.id})));
  return j(TS.rows)}
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

await pg.click('#bdLt').catch(()=>{});
await pg.waitForTimeout(300);
await pg.evaluate(()=>{if(document.getElementById('dc').classList.contains('on'))document.getElementById('dcX').click()});
await pg.evaluate(()=>{DAW_HTML=DAW_HTML.replace('function showStep(){','window.__g=function(c){return eval(c)};function showStep(){');openDaw()});await pg.waitForTimeout(1800);
const fh=await pg.$('#dawf');const fr=await fh.contentFrame();const E=c=>fr.evaluate(c=>__g(c),c);
await fr.evaluate(()=>document.querySelector('#dfree').click());await pg.waitForTimeout(900);
const vis0=await fr.evaluate(()=>getComputedStyle(document.getElementById('tcBtn')).display);
ok('自由DAWに「先生に聴いてもらう」ボタンが出る',vis0!=='none',vis0);
await E(`(function(){T.forEach(function(t){t.clips.forEach(function(c){c.notes=[]})});renderTracks();afterEdit()})()`);
await fr.evaluate(()=>document.getElementById('tcBtn').click());await pg.waitForTimeout(400);
ok('音がないときは送れない（フォームが開かない）',!(await pg.evaluate(()=>document.getElementById('dc').classList.contains('on'))));
await E(`(function(){T[0].clips[0].notes=[{s:0,p:0,l:1},{s:16,p:1,l:1}];addTrack('ピアノ','inst');T[1].clips.push({s:0,l:4,notes:[{s:0,p:60,l:4},{s:16,p:64,l:4}]});renderTracks();afterEdit()})()`);
await fr.evaluate(()=>document.getElementById('tcBtn').click());await pg.waitForTimeout(500);
ok('音があるとフォームが開く',await pg.evaluate(()=>document.getElementById('dc').classList.contains('on')&&!!document.getElementById('tsTi')));
await pg.fill('#tsTi','はじめての曲');await pg.fill('#tsMg','サビをがんばったよ');
await pg.screenshot({path:'/tmp/w/ts_form.png'});
await pg.click('#tsGo');await pg.waitForTimeout(700);
const po=TS.posts[0];
ok('送信：曲名・ひとこと・BPM・曲データ（トラック2つ以上）がサーバーに届く',po&&po.title==='はじめての曲'&&po.msg==='サビをがんばったよ'&&po.nick==='テストくん'&&po.proj&&po.proj.T&&po.proj.T.length>=2&&po.bpm>0,po&&JSON.stringify({t:po.title,m:po.msg,n:po.nick,b:po.bpm,tr:po.proj&&po.proj.T&&po.proj.T.length}));
ok('完了画面が出る',await pg.evaluate(()=>/おくったよ/.test(document.getElementById('dcH').textContent)));
await pg.click('#tsSee');await pg.waitForTimeout(700);
const my=await pg.evaluate(()=>({t4:document.getElementById('bdT4')&&document.getElementById('bdT4').getAttribute('aria-selected'),n:document.querySelectorAll('#tsL li').length,w:(document.querySelector('#tsL .rv')||{}).textContent}));
ok('もちもの→先生：送った曲が1件、返事まち表示',my.t4==='true'&&my.n===1&&/まっている/.test(my.w||''),JSON.stringify(my));
await pg.screenshot({path:'/tmp/w/ts_mine.png'});
// 先生の画面
const ctx2=await b.newContext({viewport:{width:W,height:H}});const pg2=await ctx2.newPage();const e2=[];pg2.on('pageerror',e=>e2.push(e.message));
await pg2.route(/supabase\.co/,async r=>{const u=r.request().url(),m=r.request().method();
 if(/teacher_songs/.test(u)){const j=(o,st)=>r.fulfill({status:st||200,contentType:'application/json',body:JSON.stringify(o)});
  if(m==='PATCH'){const id=/id=eq\.([^&]+)/.exec(u)[1];const x=TS.rows.find(q=>q.id===id);Object.assign(x,JSON.parse(r.request().postData()));TS.patches.push(x);return r.fulfill({status:204,body:''})}
  if(/id=eq\./.test(u)){const id=/id=eq\.([^&]+)/.exec(u)[1];return j(TS.rows.filter(q=>q.id===id))}
  return j(TS.rows)}
 if(/rest\/v1\/progress/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});
 if(/reports/.test(u))return r.fulfill({status:200,contentType:'application/json',body:'[]'});
 r.abort()});
await pg2.route(/fonts\.googleapis|accounts\.google/,r=>r.abort());
await pg2.addInitScript(()=>{sessionStorage.setItem('dtm.acct.v1',JSON.stringify({tok:'t',ref:'r',exp:Date.now()+3600000,uid:'u9',nick:'いぶき',pid:'pstaff'}));const p={id:'pstaff',name:'いぶき',col:'#09f',created:Date.now(),u:Date.now(),last:null,ls:{}};localStorage.setItem('dtm.progress.v1',JSON.stringify({schema:'dtm-learning-progress',version:1,active:'pstaff',del:[],profiles:{pstaff:p}}))});
await pg2.goto('http://localhost:8765/index.html',{waitUntil:'load'});await pg2.waitForTimeout(3500);
await pg2.evaluate(()=>{const d=document.getElementById('dc');if(d.classList.contains('on'))document.getElementById('dcX').click()});
await pg2.evaluate(()=>{setOpen()});await pg2.waitForTimeout(300);
await pg2.evaluate(()=>document.getElementById('stfBtn').click());await pg2.waitForTimeout(600);
await pg2.evaluate(()=>[...document.querySelectorAll('#stfTb button')].find(x=>/届いた曲/.test(x.textContent)).click());await pg2.waitForTimeout(800);
const st=await pg2.evaluate(()=>({cards:document.querySelectorAll('#stfBd .rp').length,tx:(document.querySelector('#stfBd .rp')||{}).innerText}));
ok('先生の画面に、届いた曲が見える（未返事）',st.cards===1&&/はじめての曲/.test(st.tx)&&/サビをがんばった/.test(st.tx)&&/未返事/.test(st.tx),JSON.stringify(st));
await pg2.screenshot({path:'/tmp/w/ts_staff.png'});
await pg2.evaluate(()=>{const d=document.querySelector('#stfBd .rp');d.querySelectorAll('.sts button')[1].click();const t=d.querySelector('textarea');t.value='サビがいいね！';d.querySelector('[data-a=rp]').click()});await pg2.waitForTimeout(700);
ok('返事（スタンプ＋コメント）がサーバーに届く',TS.patches.length===1&&TS.patches[0].reply==='サビがいいね！'&&TS.patches[0].stamp==='🎵'&&!!TS.patches[0].replied_at,JSON.stringify(TS.patches[0]&&{r:TS.patches[0].reply,s:TS.patches[0].stamp}));
ok('返事ずみに変わる',await pg2.evaluate(()=>/返事ずみ/.test(document.querySelector('#stfBd .rf button.on')?document.body.innerText:'')||document.querySelectorAll('#stfBd .rp').length===0));
await pg2.evaluate(()=>[...document.querySelectorAll('#stfBd .rf button')].find(x=>/返事ずみ/.test(x.textContent)).click());await pg2.waitForTimeout(300);
ok('「返事ずみ」一覧に出る',await pg2.evaluate(()=>document.querySelectorAll('#stfBd .rp').length===1));
ok('先生側エラーなし',e2.length===0,e2.join('|'));
// 生徒に戻る：ポーリングで💌
await pg.evaluate(()=>{document.getElementById('dcX').click()});await pg.waitForTimeout(200);
await pg.evaluate(()=>{TSLAST=0;tsPoll()});await pg.waitForTimeout(900);
const dot=await pg.evaluate(()=>document.getElementById('bdBtn').textContent);
ok('生徒のホームに「💌」（返事がきた印）が出る',/💌/.test(dot),dot);
await pg.evaluate(()=>openHome(false));await pg.waitForTimeout(500);await pg.click('#bdBtn');await pg.waitForTimeout(400);await pg.click('#bdT4');await pg.waitForTimeout(800);
const rv=await pg.evaluate(()=>(document.querySelector('#tsL .rv')||{}).textContent);
ok('先生タブに返事が表示される',/サビがいいね/.test(rv||'')&&/🎵/.test(rv||''),rv);
await pg.screenshot({path:'/tmp/w/ts_reply.png'});
ok('見たら💌が消える',await pg.evaluate(()=>!/💌/.test(document.getElementById('bdBtn').textContent)));
await pg.click('#tsL [data-a=rm]');await pg.click('#tsL [data-a=rm]');await pg.waitForTimeout(500);
ok('とりけしで削除（2回おして確定）',await pg.evaluate(()=>document.querySelectorAll('#tsL li').length===0)&&TS.rows.length===0);
ok('生徒側エラーなし',errs.length===0,errs.join('|'));
console.log('結果：'+(res.every(Boolean)?'すべてOK':'NG あり'));await b.close()})()
