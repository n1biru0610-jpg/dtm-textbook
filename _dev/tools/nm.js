// 表示名の変更テスト：node _dev/tools/nm.js [ポート] [幅] [高さ] [ページ]
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const PORT=process.argv[2]||8765,W=+process.argv[3]||1366,H=+process.argv[4]||768,PAGE=process.argv[5]||'index.html';
const URL_='http://localhost:'+PORT+'/'+PAGE;let store=null;const errs=[];let ng=0;
const ok=(c,m)=>{console.log((c?'OK ':'NG ')+m);if(!c)ng++};
async function ctx(b){const c=await b.newContext({viewport:{width:W,height:H},serviceWorkers:'block'});
 await c.route(/googleapis|gstatic/,r=>r.abort());
 await c.route(/supabase\.co/,async r=>{const u=r.request().url(),m=r.request().method();const j=(o,s=200)=>r.fulfill({status:s,contentType:'application/json',headers:{'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*'},body:JSON.stringify(o)});
  if(m==='OPTIONS')return j({});
  if(/auth\/v1/.test(u))return j({access_token:'t',refresh_token:'r',expires_in:3600,user:{id:'u1'}});
  if(/rest\/v1\/progress/.test(u)){if(m==='POST'){store=JSON.parse(r.request().postData()).data;return r.fulfill({status:201,headers:{'access-control-allow-origin':'*'},body:''})}return j(store?[{data:store}]:[])}
  return j([])});
 const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));return p}
async function login(p){await p.goto(URL_);await p.waitForSelector('#prof.on');await p.click('#flg');await p.fill('#nk','てすと');await p.fill('#pw','abcdef12');await p.click('#go2');await p.waitForTimeout(2500)}
async function closeAll(p){await p.evaluate(()=>{try{if(document.getElementById('dc').classList.contains('on'))dcClose()}catch(e){}});const g=await p.$('#zkGet.on #zkGetOk');if(g){await p.waitForTimeout(1200);await g.click().catch(()=>{})}}
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 store={v:1,nick:'てすと',profile:{id:'p1',name:'てすと',col:'#ffc531',created:1,u:1,last:'1-1',ls:{'1-1':{d:1,n:1}}}};
 let p=await ctx(b);await login(p);await p.waitForTimeout(3000);await closeAll(p);
 ok(await p.evaluate(()=>myNm())==='てすと','はじめはログイン名と同じ');
 await p.click('#pchip');await p.waitForTimeout(600);await p.screenshot({path:'/tmp/nmt/out/pc.png'});console.log('pnm',await p.$('#pnm')!==null,await p.evaluate(()=>[...document.querySelectorAll('.on')].map(e=>e.id).join(',')));await p.click('text=アカウント・ログアウト');await p.waitForTimeout(500);await p.screenshot({path:'/tmp/nmt/out/pl.png'});await p.click('#pnm');await p.waitForTimeout(500);
 await p.screenshot({path:'/tmp/nmt/out/acc1.png'});

 ok(await p.isVisible('#anI'),'学習者パネルの「なまえをかえる」で入力欄が出る');
 await p.fill('#anI','あ');await p.click('#anS');ok((await p.textContent('#anM')).includes('2〜10文字'),'短すぎると案内');
 await p.fill('#anI','たろう ちゃん');await p.click('#anS');ok((await p.textContent('#anM')).includes('空白'),'空白は案内');
 await p.fill('#anI','たろう');await p.keyboard.press('Enter');await p.waitForTimeout(1500);
 await p.screenshot({path:'/tmp/nmt/out/acc2.png'});
 ok((await p.textContent('#anD'))==='たろう','表示名が変わる');ok((await p.textContent('#anL'))==='てすと','ログイン名はそのまま');
 ok(await p.evaluate(()=>myNm()==='たろう'&&ACC.nick==='てすと'&&dcNick()==='たろう'&&rpNick()==='たろう（てすと）'),'作品ひろば=たろう、ほうこく=たろう（てすと）');
 ok(store&&store.nick==='てすと'&&store.profile.dn==='たろう','サーバーには ログイン名てすと・表示名たろう で保存');
 ok((await p.textContent('#pchip')).includes('たろう'),'右上の名前も変わる: '+(await p.textContent('#pchip')).trim());
 ok(await p.evaluate(()=>stfOn()===false),'スタッフ判定はログイン名のまま');
 const ls=await p.evaluate(()=>JSON.parse(localStorage.getItem('dtm.progress.v1')).profiles.p1);ok(ls.ls['1-1'].d===1&&ls.dn==='たろう','この端末の記録も残る');
 await p.click('#anE');await p.click('#anC');ok(!(await p.isVisible('#anI')),'やめるで閉じる');
 await p.context().close();
 // 別のPCでログイン
 p=await ctx(b);await login(p);await p.waitForTimeout(3000);await closeAll(p);
 ok(await p.evaluate(()=>myNm())==='たろう','別のPCでも表示名が引きつがれる');
 ok((await p.textContent('#pchip')).includes('たろう'),'別のPCの右上もたろう');
 await p.context().close();
 // ゲスト
 p=await ctx(b);await p.goto(URL_);await p.waitForTimeout(1500);ok(await p.evaluate(()=>typeof myNm==='function'),'ゲストでも動く');await p.context().close();
 ok(errs.length===0,'ページエラー0件 '+errs.slice(0,3));console.log(ng?'結果：NGあり':'結果：すべてOK');await b.close()})()
