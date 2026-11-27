// 図鑑のテスト。リポジトリ直下を http://localhost:8765/ で配信してから実行する： node _dev/tools/zk.js [出力フォルダ] [幅] [高さ] [ページ]
// Supabase は偽サーバーで代用する（登録・保存・読み込み）。
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const OUT=process.argv[2]||'.',W=+process.argv[3]||1366,H=+process.argv[4]||768,PAGE=process.argv[5]||'index.html';
const URL_='http://localhost:8765/'+PAGE;
let store=null,posts=0;const errs=[];let ng=0;
const ok=(c,m)=>{console.log((c?'OK ':'NG ')+m);if(!c)ng++};
async function ctx(b,init){const c=await b.newContext({viewport:{width:W,height:H},serviceWorkers:'block',...(process.argv[6]==='t'?{hasTouch:true,isMobile:true}:{})});
 await c.route(/googleapis|gstatic/,r=>r.abort());
 await c.route(/supabase\.co/,async r=>{const u=r.request().url(),m=r.request().method();const j=(o,s=200)=>r.fulfill({status:s,contentType:'application/json',headers:{'access-control-allow-origin':'*','access-control-allow-headers':'*','access-control-allow-methods':'*'},body:JSON.stringify(o)});
  if(m==='OPTIONS')return j({});
  if(/auth\/v1/.test(u))return j({access_token:'t',refresh_token:'r',expires_in:3600,user:{id:'u1'}});
  if(/rest\/v1\/progress/.test(u)){if(m==='POST'){const d=JSON.parse(r.request().postData());store=d.data;posts++;return r.fulfill({status:201,headers:{'access-control-allow-origin':'*'},body:''})}return j(store?[{data:store}]:[])}
  return j([])});
 if(init)await c.addInitScript(init);
 const p=await c.newPage();p.on('pageerror',e=>errs.push(e.message));return p}
async function login(p,mode){await p.goto(URL_);await p.waitForSelector('#prof.on');await p.click(mode==='reg'?'#frg':'#flg');
 await p.fill('#nk','てすと');await p.fill('#pw','abcdef12');await p.click('#go2');await p.waitForTimeout(1500)}
const closeDc=async p=>{await p.waitForTimeout(3600);if(await p.$('#dc.on'))await p.evaluate(()=>dcClose())};
const closeGet=async p=>{try{await p.waitForSelector('#zkGet.on',{timeout:6000});await p.waitForTimeout(1100);await p.click('#zkGetOk')}catch(e){}};
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
 // 1) 前の版で作ったアカウントの記録（図鑑の項目なし）を読みこむ
 const old={id:'p1',name:'てすと',col:'#ffc531',created:1,u:1,last:'2-4',ls:{'1-1':{d:1,n:1},'1-2':{d:1,n:1},'2-1':{d:1,n:2},'2-4':{d:1,n:1}},studio:{x:1},dw:{'D-1':1},dprojs:[],bd:{days:[],earned:{hello:5},post:{},wear:'hello',skin:'',ic:''}};
 store={v:1,nick:'てすと',profile:old};
 let p=await ctx(b);await login(p,'login');await closeDc(p);
 await p.waitForSelector('#zkGet.on',{timeout:8000}).catch(()=>{});await p.waitForTimeout(2200);await p.screenshot({path:OUT+'/zk_get.png'});
 ok(await p.isVisible('#zkGet .zkgbox'),'ホームで獲得の演出が出る: '+(await p.textContent('#zkGetT')));await p.click('#zkGetOk');await p.waitForTimeout(400);
 ok(await p.evaluate(()=>Object.keys(P().bd.seen||{}).length===4),'見たカードは記録');await p.waitForTimeout(3500);ok(!await p.isVisible('#zkGet .zkgbox'),'同じカードの演出は2回出ない');
 ok(await p.isVisible('#zkNext1'),'つぎのカードの案内: '+(await p.textContent('#zkNext1')));
 await p.screenshot({path:OUT+'/zk_home.png'});
 ok((await p.textContent('#zkBtn')).includes('4/53'),'ボタンに 4/53（初ログイン, 1-2, 2-1, 2-4）: '+await p.textContent('#zkBtn'));
 await p.click('#zkBtn');await p.waitForTimeout(250);await p.screenshot({path:OUT+'/zk_flip.png'});await p.waitForTimeout(1200);await p.screenshot({path:OUT+'/zk_book.png'});
 ok(await p.isVisible('#zk .zkbook'),'図鑑が開く');
 ok((await p.textContent('#zkN'))==='4 / 53','枚数表示 4 / 53');
 ok(await p.$$eval('#zk .zkc:not(.no)',a=>a.length)>=1,'持っているカードがある');
 ok(await p.$$eval('#zk .zkc.no',a=>a.length)>=1,'未獲得（シルエット）がある');
 const d=await p.evaluate(()=>JSON.parse(localStorage.getItem('dtm.progress.v1')).profiles.p1);
 ok(Object.keys(d.bd.cards).sort().join()==='t-bpm,t-kick4,t-listen,t-parts','保存されたカード '+Object.keys(d.bd.cards));
 ok(d.ls['2-1'].n===2&&d.studio.x===1&&d.dw['D-1']===1&&d.last==='2-4'&&d.bd.earned.hello===5&&d.bd.wear==='hello','前の記録はそのまま');
 // あふれ確認
 let over=[];const n=await p.textContent('#zkPg');const tot=+n.split('/')[1];
 for(let i=0;i<tot;i++){await p.waitForTimeout(700);
  over=over.concat(await p.$$eval('#zk .zkc',a=>a.filter(e=>e.scrollHeight>e.clientHeight+1||e.getBoundingClientRect().height<60).map(e=>e.dataset.id+':'+e.scrollHeight+'>'+e.clientHeight)));
  await p.screenshot({path:OUT+'/zk_p'+(i+1)+'.png'});if(i<tot-1)await p.click('#zkNext')}
 ok(!over.length,'カードの中身がはみ出さない（'+tot+'見開き） '+over.slice(0,8));
 ok(await p.isDisabled('#zkNext'),'最後のページで「つぎ」は押せない');
 await p.keyboard.press('ArrowLeft');ok((await p.textContent('#zkPg')).startsWith((tot-1)+' '),'左矢印キーでめくれる');
 await p.click('#zk .zkc >> nth=0');await p.waitForTimeout(300);ok(await p.isVisible('.zkd'),'詳細が開く');await p.screenshot({path:OUT+'/zk_det.png'});
 await p.keyboard.press('Escape');ok(!await p.isVisible('.zkd')&&await p.isVisible('#zk .zkbook'),'Esc で詳細だけ閉じる');
 await p.keyboard.press('Escape');ok(!await p.isVisible('#zk .zkbook'),'もう一度 Esc で図鑑が閉じる');
 // レッスン画面から
 await p.evaluate(()=>startLesson(0));await p.waitForTimeout(1500);if(await p.$('#chap.on'))await p.click('#chap');await p.waitForTimeout(5000);
 await p.screenshot({path:OUT+'/zk_lesson.png'});ok(await p.isVisible('#zkBarBtn'),'レッスン画面の上に図鑑ボタン');
 await p.click('#zkBarBtn');await p.waitForTimeout(900);ok(await p.isVisible('#zk .zkbook'),'レッスンから開ける');await p.click('#zkX');
 // ほかの画面
 for(const [fn,name] of [['openDaw','daw'],['openStudio','studio'],['dcStart','daily'],['openRhythm','rhythm'],['openOther','other']]){
  await p.evaluate(f=>{if(document.getElementById('dc').classList.contains('on'))dcClose();window[f]()},fn);await p.waitForTimeout(name==='daily'?1000:3500);
  if(name==='daily'){const go=await p.$('#dc.on button.go');if(go){await go.click();await p.waitForTimeout(4000)}}
  await p.screenshot({path:OUT+'/zk_'+name+'.png'});console.log('  '+name+' 図鑑ボタン表示='+await p.isVisible('#zkBtn'))}
 await p.context().close();
 store=null;
 // 2) テスト用アカウント：登録 → レッスンをクリア → 図鑑 → サーバーへ保存 → 別の端末で読みこみ
 p=await ctx(b);await login(p,'reg');await closeDc(p);
 await closeGet(p);
 await p.evaluate(()=>{markDone('1-2');markDone('2-1')});
 ok(await p.waitForSelector('#zkGet.on',{timeout:8000}).then(()=>true,()=>false),'レッスンの節目で演出（ログインのカードも）');await p.waitForTimeout(1100);await p.keyboard.press('Escape');
 // 提出の節目
 await p.evaluate(()=>{openDawC()});await p.waitForTimeout(1500);await p.evaluate(()=>bdPost(dcJst(),6,6));
 ok(await p.waitForSelector('#zkGet.on',{timeout:8000}).then(()=>true,()=>false),'曲の提出の直後（ホーム以外）でも演出');await p.waitForTimeout(2200);await p.screenshot({path:OUT+'/zk_get_post.png'});
 ok((await p.textContent('#zkGetRow')).includes('4つ打ちの小箱'),'提出1回のカード');await p.click('#zkGetBook');await p.waitForTimeout(900);ok(await p.isVisible('#zk .zkbook'),'演出から図鑑へ');ok(await p.$$eval('#zk .zkc em',a=>a.length)>0,'新しいカードに NEW');await p.click('#zkX');await p.evaluate(()=>openHome(false));await closeDc(p);
 await p.screenshot({path:OUT+'/zk_acc_home.png'});
 await p.click('#zkBtn');await p.waitForTimeout(1500);await p.screenshot({path:OUT+'/zk_acc_book.png'});
 await p.focus('#zk .zkc >> nth=0').catch(()=>{});await p.evaluate(()=>document.querySelector('#zk .zkc').focus());await p.keyboard.press('ArrowRight');ok(await p.evaluate(()=>document.activeElement.classList.contains('zkc')),'矢印でめくってもフォーカスが残る');
 await p.keyboard.press('Enter');await p.waitForTimeout(200);ok(await p.evaluate(()=>$('zkSp').inert===true),'詳細の間、うしろは inert');await p.setViewportSize({width:W,height:H-20});await p.waitForTimeout(300);ok(await p.isVisible('.zkd')||H<=540,'少し大きさが変わっても詳細は閉じない');await p.keyboard.press('Escape');await p.setViewportSize({width:W,height:H});
 await p.keyboard.press('Escape');await p.evaluate(()=>markDone('2-4'));await p.waitForTimeout(1200);ok(!!(store.profile.bd.cards||{})['t-kick4'],'図鑑を開かなくても、クリアした時点で保存');
 const sc=store&&store.profile&&store.profile.bd&&store.profile.bd.cards||{};
 ok(['t-listen','t-parts','t-bpm'].every(k=>sc[k]),'サーバーに保存: '+Object.keys(sc));
 const t0=sc['t-listen'];await p.context().close();
 p=await ctx(b);await login(p,'login');await closeDc(p);
 ok(await p.evaluate(()=>!!(P().bd.seen||{})['t-parts']),'見た記録も別の端末へ');
 const got=await p.evaluate(()=>P().bd.cards);ok(['t-listen','t-parts','t-bpm'].every(k=>got&&got[k])&&got['t-listen']===t0,'別の端末で読みこみ（もらった時刻も同じ）');
 // 古い版が bd.cards を持たない記録を送ってきても消えない
 const m=await p.evaluate(()=>bdMerge({days:[],cards:{'t-bpm':5,'t-x':9}},{days:[],cards:{'t-bpm':3}},true).cards);ok(m['t-bpm']===3&&m['t-x']===9,'合流：両方のカードが残り、早い時刻になる');
 const m2=await p.evaluate(()=>bdMerge({cards:{'t-x':9}},{},true).cards);ok(m2['t-x']===9,'合流：相手にカードがなくても消えない');
 await p.context().close();
 // 3) はじめての人（記録なし）
 p=await ctx(b);await p.goto(URL_);await p.waitForTimeout(2500);
 ok(await p.isVisible('#prof.on'),'はじめての人にはログイン画面');
 await p.evaluate(()=>{$('prof').classList.remove('on');zkOpen()});await p.waitForTimeout(900);ok((await p.textContent('#zkN'))==='0 / 53','記録なしでも開ける 0 / 53');
 await p.evaluate(()=>{zkClose();newProf('ゲスト','#ffc531');markDone('1-2');zkOpen()});await p.waitForTimeout(900);ok((await p.textContent('#zkN'))==='1 / 53','ゲストはレッスンのカードが集まる');await p.screenshot({path:OUT+'/zk_guest.png'});
 await p.context().close();
 console.log('ページエラー',errs.length,errs.slice(0,5));console.log(ng||errs.length?'結果：NG あり '+ng:'結果：すべてOK');await b.close()})();
