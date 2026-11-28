// スタンプ通知のテスト：node _dev/tools/lkn.js [ポート] [幅] [高さ] [ページ] [nonick=名前の列なし]
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const PORT=process.argv[2]||8765,W=+process.argv[3]||1366,H=+process.argv[4]||768,PAGE=process.argv[5]||'preview/index.html',NONICK=process.argv[6]==='nonick';
const errs=[];let ng=0;const ok=(c,m)=>{console.log((c?'OK ':'NG ')+m);if(!c)ng++};
const E1='11111111-1111-1111-1111-111111111111';let store=null,posts=[],gets=[];
const today=new Date(Date.now()+9*3600e3).toISOString().slice(0,10);
const NOTE=[{stamp:0,created_at:'2026-11-28T10:00:00+00:00',nick:'あおい',daily_entries:{user_id:'me',day:today}},{stamp:0,created_at:'2026-11-28T10:01:00+00:00',nick:'はると',daily_entries:{user_id:'me',day:today}},{stamp:1,created_at:'2026-11-28T10:02:00+00:00',nick:'あおい',daily_entries:{user_id:'me',day:today}}];
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});const c=await b.newContext({viewport:{width:W,height:H},serviceWorkers:'block'});
await c.route(/googleapis|gstatic/,r=>r.abort());const hd={'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*'};
await c.route(/supabase\.co/,async r=>{const u=decodeURIComponent(r.request().url()),m=r.request().method();const j=(o,s=200)=>r.fulfill({status:s,contentType:'application/json',headers:hd,body:JSON.stringify(o)});if(m==='OPTIONS')return j({});
 if(/auth\/v1/.test(u))return j({access_token:'t',refresh_token:'r',expires_in:3600,user:{id:'me'}});
 if(/progress/.test(u)){if(m==='POST'){store=JSON.parse(r.request().postData()).data;return r.fulfill({status:201,headers:hd,body:''})}return j([{data:store||{v:1,nick:'てすと',profile:{id:'p1',name:'てすと',col:'#ffc531',created:1,u:1,ls:{},upd:'2026-11-tac'}}}])}
 if(/daily_entries/.test(u)&&!/daily_likes/.test(u))return j([{id:E1,created_at:'x',nick:'てすと',ok:3,total:3,bpm:100}]);
 if(/daily_likes/.test(u)){
   if(m==='POST'){const bd=JSON.parse(r.request().postData());if(NONICK&&'nick' in bd)return j({message:'Could not find the \'nick\' column'},400);posts.push(bd);return r.fulfill({status:201,headers:hd,body:''})}
   if(/daily_entries\.user_id/.test(u)){gets.push(u);if(NONICK&&/select=stamp,created_at,nick/.test(u))return j({message:'column daily_likes.nick does not exist'},400);
     const since=(u.match(/created_at=gt\.([^&]+)/)||[])[1];return j(NOTE.filter(x=>x.created_at>since).map(x=>NONICK?{stamp:x.stamp,created_at:x.created_at,daily_entries:x.daily_entries}:x))}
   return j([])}
 return j([])});
const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));await p.goto('http://localhost:'+PORT+'/'+PAGE);await p.waitForSelector('#prof.on');
await p.click('#flg');await p.fill('#nk','てすと');await p.fill('#pw','abcdef12');await p.click('#go2');await p.waitForTimeout(8000);
ok(!(await p.evaluate(()=>!!document.querySelector('#lkT.on'))),'ログインボーナスの画面が出ているあいだは待つ');
await p.evaluate(()=>{try{dcClose()}catch(e){};try{if($('zkGet').classList.contains('on'))$('zkGetOk').click()}catch(e){}});await p.waitForTimeout(2500);await p.evaluate(()=>{try{if($('zkGet').classList.contains('on'))$('zkGetOk').click()}catch(e){};try{if($('dc').classList.contains('on'))dcClose()}catch(e){}});await p.waitForTimeout(2500);
ok(await p.evaluate(()=>!!document.querySelector('#lkT.on')),'閉じたら通知が出る');
const tx=await p.evaluate(()=>{var e=document.querySelector('#lkT');return e?e.textContent:''});console.log('  ',tx);
ok(NONICK?tx.includes('みんなから')&&tx.includes('👍×2')&&tx.includes('❤️×1'):tx.includes('あおいさん、はるとさんから')&&tx.includes('👍×2'),'中身（だれから・スタンプの数）');
await p.screenshot({path:'/tmp/nmt/out/lkn1.png'});
ok(await p.evaluate(()=>P().lkSeen)==='2026-11-28T10:02:00+00:00','見たところまで記録');await p.waitForTimeout(1500);ok(store&&store.profile.lkSeen==='2026-11-28T10:02:00+00:00','アカウントにも記録（別のPCで同じ通知を出さない）');
await p.evaluate(()=>{document.querySelector('#lkT').classList.remove('on');lkCheck()});await p.waitForTimeout(1500);ok(!(await p.evaluate(()=>!!document.querySelector('#lkT.on'))),'同じスタンプは2回知らせない');
NOTE.push({stamp:2,created_at:'2026-11-28T11:00:00+00:00',nick:'そら',daily_entries:{user_id:'me',day:today}});
await p.evaluate(()=>lkCheck());await p.waitForTimeout(1500);const t2=await p.evaluate(()=>{var e=document.querySelector('#lkT.on');return e?e.textContent:''});ok(t2.includes('🎉×1')&&!t2.includes('👍'),'ログイン中に届いた分だけ知らせる: '+t2.slice(0,40));
ok(gets.every(u=>u.includes('user_id=neq.me')),'自分で押したスタンプは数えない');
console.log('  dbg',await p.evaluate(()=>{var e=document.querySelector('#lkT');var b=e.children[0].getBoundingClientRect();var t=document.elementFromPoint(b.left+b.width/2,b.top+b.height/2);return e.className+' '+getComputedStyle(e).opacity+' '+JSON.stringify([b.left,b.top,b.width,b.height])+' '+(t&&(t.id||t.className))}));await p.click('#lkT>button:first-child');await p.waitForTimeout(1500);ok(await p.evaluate(()=>$('dc').classList.contains('on')&&!!$('dcL')),'通知をおすと作品ひろばが開く');
await p.evaluate(()=>{var b=document.querySelector('#dcL .lk button');if(b)b.click()});await p.waitForTimeout(1200);
ok(posts.length===1&&(NONICK?!('nick' in posts[0]):posts[0].nick==='てすと'),'スタンプを送るとき名前もつける'+(NONICK?'（列がなければ名前なしで送る）':''));
ok(errs.length===0,'ページエラー0件 '+errs.slice(0,3));console.log(ng?'結果：NGあり':'結果：すべてOK');await b.close()})()
