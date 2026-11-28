// デイリー作品のスタンプのテスト：node _dev/tools/lk.js [ポート] [幅] [高さ] [ページ] [nolike=テーブルなし]
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const PORT=process.argv[2]||8765,W=+process.argv[3]||1366,H=+process.argv[4]||768,PAGE=process.argv[5]||'preview/index.html',NOT=process.argv[6]==='nolike';
const URL_='http://localhost:'+PORT+'/'+PAGE;const errs=[];let ng=0;const ok=(c,m)=>{console.log((c?'OK ':'NG ')+m);if(!c)ng++};
const E1='11111111-1111-1111-1111-111111111111',E2='22222222-2222-2222-2222-222222222222';
let likes=[{entry_id:E1,stamp:0,user_id:'other'},{entry_id:E1,stamp:0,user_id:'other2'},{entry_id:E2,stamp:2,user_id:'other'}];const calls=[];
async function ctx(b,login){const c=await b.newContext({viewport:{width:W,height:H},serviceWorkers:'block'});await c.route(/googleapis|gstatic/,r=>r.abort());
 await c.route(/supabase\.co/,async r=>{const u=r.request().url(),m=r.request().method();const hd={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*'};const j=(o,s=200)=>r.fulfill({status:s,contentType:'application/json',headers:hd,body:JSON.stringify(o)});
  if(m==='OPTIONS')return j({});
  if(/auth\/v1/.test(u))return j({access_token:'t',refresh_token:'r',expires_in:3600,user:{id:'me'}});
  if(/rest\/v1\/progress/.test(u)){if(m==='POST')return r.fulfill({status:201,headers:hd,body:''});return j([{data:{v:1,nick:'てすと',profile:{id:'p1',name:'てすと',col:'#ffc531',created:1,u:1,ls:{}}}}])}
  if(/rest\/v1\/daily_entries/.test(u))return j([{id:E1,created_at:'x',nick:'あおい',ok:3,total:3,bpm:100},{id:E2,created_at:'x',nick:'はると',ok:2,total:3,bpm:90}]);
  if(/rest\/v1\/daily_likes/.test(u)){calls.push(m+' '+decodeURIComponent(u.split('/rest/v1/')[1]));if(NOT)return j({code:'PGRST205',message:'not found'},404);
    if(m==='GET')return j(likes);if(m==='POST'){const b=JSON.parse(r.request().postData());likes.push({entry_id:b.entry_id,stamp:b.stamp,user_id:'me'});return r.fulfill({status:201,headers:hd,body:''})}
    if(m==='DELETE'){likes=likes.filter(x=>!(x.user_id==='me'&&u.includes(x.entry_id)&&u.includes('stamp=eq.'+x.stamp)));return r.fulfill({status:204,headers:hd,body:''})}}
  return j([])});
 const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));await p.goto(URL_);await p.waitForSelector('#prof.on');
 if(login){await p.click('#flg');await p.fill('#nk','てすと');await p.fill('#pw','abcdef12');await p.click('#go2');await p.waitForTimeout(3000)}
 else{await p.evaluate(()=>{try{guest()}catch(e){}});await p.waitForTimeout(800)}
 return p}
const cnt=async(p,i,s)=>p.evaluate(([i,s])=>{const b=document.querySelectorAll('#dcL li')[i].querySelectorAll('.lk button')[s];return {n:b.querySelector('i').textContent,on:b.getAttribute('aria-pressed')}},[i,s]);
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 let p=await ctx(b,true);await p.evaluate(()=>{try{if($('zkGet').classList.contains('on'))$('zkGetOk').click()}catch(e){}});
 await p.evaluate(()=>{$('dc').classList.add('on');dcGallery(dcJst())});await p.waitForTimeout(1500);
 if(NOT){ok(await p.evaluate(()=>[...document.querySelectorAll('#dcL .lk')].every(d=>d.hidden)),'テーブルがないときはスタンプを出さない');ok((await p.$$('#dcL li')).length===2,'作品一覧はふつうに出る')}
 else{
 ok(JSON.stringify(await cnt(p,0,0))==='{"n":"2","on":"false"}','あおいさんの👍が2');ok((await cnt(p,1,2)).n==='1','はるとさんの🎉が1');
 await p.screenshot({path:'/tmp/nmt/out/lk1.png'});
 const bt=await p.$$('#dcL li:nth-child(1) .lk button');await bt[0].click();await p.waitForTimeout(600);
 ok(JSON.stringify(await cnt(p,0,0))==='{"n":"3","on":"true"}','おすと3・おした状態');ok(likes.some(x=>x.user_id==='me'&&x.entry_id===E1&&x.stamp===0),'サーバーに保存');
 await bt[1].click();await p.waitForTimeout(600);ok((await cnt(p,0,1)).n==='1','❤️もおせる');
 await bt[0].click();await p.waitForTimeout(600);ok(JSON.stringify(await cnt(p,0,0))==='{"n":"2","on":"false"}','もう一度おすと取り消し');ok(!likes.some(x=>x.user_id==='me'&&x.stamp===0),'サーバーからも消える');
 await p.screenshot({path:'/tmp/nmt/out/lk2.png'});
 await p.evaluate(()=>dcGallery(dcJst()));await p.waitForTimeout(1500);ok((await cnt(p,0,1)).on==='true','開き直しても自分のスタンプがわかる');
 await p.close();
 p=await ctx(b,false);await p.evaluate(()=>{$('dc').classList.add('on');dcGallery(dcJst())});await p.waitForTimeout(1500);
 ok((await cnt(p,0,0)).n==='2','ゲストも数は見える');const n0=likes.length;await (await p.$$('#dcL li:nth-child(1) .lk button'))[0].click();await p.waitForTimeout(400);
 ok(likes.length===n0&&(await p.textContent('#dcMs')).includes('ログイン'),'ゲストは押せず、ログインを案内')}
 ok(errs.length===0,'ページエラー0件 '+errs.slice(0,3));console.log(ng?'結果：NGあり':'結果：すべてOK');await b.close()})()
