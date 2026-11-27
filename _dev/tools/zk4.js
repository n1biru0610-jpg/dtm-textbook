// 図鑑ステップ4のテスト：MIDIパック・音源を自由DAW（スタジオ）とお題DAWで使えるか。
// 使い方：リポジトリ直下で python3 -m http.server 8765 → node _dev/tools/zk4.js [出力フォルダ] [幅] [高さ] [t=タッチ]
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const OUT=process.argv[2]||'.',W=+process.argv[3]||1366,H=+process.argv[4]||768,MOB=process.argv[5]==='t';
let ng=0;const ok=(c,m,i)=>{console.log((c?'OK ':'NG ')+m+(i!==undefined?'  ('+i+')':''));if(!c)ng++};
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const ctx=await b.newContext(MOB?{viewport:{width:W,height:H},isMobile:true,hasTouch:true}:{viewport:{width:W,height:H}});
const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.route(/supabase\.co|googleapis|gstatic|accounts\.google/,r=>r.abort());
await pg.goto('http://localhost:8765/preview/index.html',{waitUntil:'load'});await pg.waitForTimeout(1500);
await pg.evaluate(()=>{const e=document.querySelector('#fgs');if(e)e.click()});await pg.waitForTimeout(600);
await pg.evaluate(()=>{DAW_HTML=DAW_HTML.replace('function showStep(){','window.__g=function(c){return eval(c)};function showStep(){')});
const ids=['m-beat8','m-four','m-melody','m-oudou','m-root','m-canon','m-marusa','s-orgel','s-mokkin','s-8bit'];
// 1) 持っていないときの図鑑の説明
await pg.evaluate(()=>{openHome(false)});await pg.waitForTimeout(500);
await pg.evaluate(()=>{zkOpen();zkDetail(ZKCARDS.filter(d=>d.id==='m-oudou')[0],null)});await pg.waitForTimeout(400);
ok(!(await pg.$('#zkDet .zkuse')),'持っていないMIDIパックには「スタジオで使う」ボタンがない');
ok((await pg.textContent('#zkDet')).includes('手に入れると、DAW編のスタジオと今日のお題で使えるよ'),'持っていないときの案内');
await pg.evaluate(()=>{zkDetClose();zkClose()});
// 2) カードを持たせる
await pg.evaluate(ids=>{var p=P(),b=bdOf(p),c=zkCards(b);b.seen=b.seen||{};ids.forEach(i=>{c[i]=Date.now();b.seen[i]=1});p.u=Date.now();saveDB()},ids);
await pg.evaluate(()=>{zkOpen();zkDetail(ZKCARDS.filter(d=>d.id==='t-listen')[0],null)});await pg.waitForTimeout(300);
ok(!(await pg.$('#zkDet .zkuse')),'ヒントカードにはボタンがない');
await pg.evaluate(()=>{zkDetClose();zkDetail(ZKCARDS.filter(d=>d.id==='m-oudou')[0],null)});await pg.waitForTimeout(400);
ok(await pg.isVisible('#zkDet .zkuse'),'持っているMIDIパックに「スタジオで使う」ボタン');
await pg.screenshot({path:OUT+'/zk4_detail.png'});
// Tab で届く
await pg.keyboard.press('Tab');const f1=await pg.evaluate(()=>document.activeElement.className);
ok(f1==='zkuse','Tab で「スタジオで使う」に届く',f1);
await pg.click('#zkDet .zkuse');await pg.waitForTimeout(4000);
ok(await pg.evaluate(()=>getComputedStyle($('dawf')).display!=='none'&&!zkIsOpen),'自由DAWが開き、図鑑はとじる');
const fr=await (await pg.$('#dawf')).contentFrame();const E=c=>fr.evaluate(c=>__g(c),c);
await pg.waitForTimeout(800);
let r=await E(`(function(){var t=T.filter(function(t){return t.name==='王道進行'})[0];return {free:free,n:t&&t.clips[0].notes.length,l:t&&t.clips[0].l,inst:t&&t.inst||'piano'}})()`);
ok(r.free&&r.n===12&&r.l===4,'スタジオに「王道進行」のトラック（4小節・12音）',JSON.stringify(r));
await pg.screenshot({path:OUT+'/zk4_studio.png'});
// 3) 右のブラウザ「もらった素材」
const nb=await fr.evaluate(()=>document.querySelectorAll('#zkbl .bi').length);
ok(nb===10,'「もらった素材」に10こ並ぶ',nb);
await fr.evaluate(()=>{var s=document.getElementById('zkbl').parentNode;s.classList.add('open')});
const showBr=await fr.evaluate(()=>{var e=document.getElementById('zkbl');return e.getBoundingClientRect().width>0});
if(!showBr){await fr.evaluate(()=>{var b=document.querySelector('#brBtn,#brT,[aria-label*="ブラウザ"]');if(b)b.click()})}
await fr.evaluate(()=>document.getElementById('zkbl').parentNode.scrollIntoView());await pg.waitForTimeout(400);await pg.screenshot({path:OUT+'/zk4_browser.png'});
const tn0=await E('T.length');
await fr.evaluate(()=>{var it=[...document.querySelectorAll('#zkbl .bi')].filter(e=>e.textContent.includes('8ビートの小箱'))[0];it.querySelector('button.ad').click()});await pg.waitForTimeout(300);
r=await E(`(function(){var t=T[T.length-1];return {k:t.kind,n:t.clips[0].notes.length,l:t.clips[0].l,v:t.clips[0].notes.filter(function(n){return n.v}).length}})()`);
ok(await E('T.length')===tn0+1&&r.k==='drum'&&r.l===2&&r.n===27,'「＋ 置く」で8ビート（ドラム2小節）',JSON.stringify(r));
await fr.evaluate(()=>{var it=[...document.querySelectorAll('#zkbl .bi')].filter(e=>e.textContent.includes('オルゴール'))[0];it.querySelector('button.ad').click()});await pg.waitForTimeout(300);
r=await E('T[T.length-1].inst');ok(r==='orgel','音源「オルゴール」のトラックができる',r);
const sel=await E(`(function(){sel=T.length-1;try{inspSound()}catch(e){};var s=document.getElementById('isI');return s?[].map.call(s.options,function(o){return o.value}).join(','):'none'})()`);
ok((sel.includes('orgel')&&sel.includes('mokkin')&&sel.includes('chip')),'音源の設定で図鑑の音色が選べる',sel);
r=await E(`(function(){try{ZKOWN.forEach(function(c){zkPrev(c)});['orgel','mokkin','chip'].forEach(function(i){tone(60,ctx.currentTime+.1,.3,i)});return 'ok'}catch(e){return String(e)}})()`);
ok(r==='ok','全部の「▶ きいてみる」と新しい音色が鳴らせる',r);
r=await E(`(function(){var t=T.filter(function(t){return t.inst==='bass'})[0];return t?0:1})()`);
await fr.evaluate(()=>{var it=[...document.querySelectorAll('#zkbl .bi')].filter(e=>e.textContent.includes('ルートの石だたみ'))[0];it.querySelector('button.ad').click()});await pg.waitForTimeout(300);
r=await E(`(function(){var t=T[T.length-1];return {inst:t.inst,oct:t.oct,min:Math.min.apply(null,t.clips[0].notes.map(function(n){return n.p})),n:t.clips[0].notes.length}})()`);
ok(r.inst==='bass'&&r.oct===-1&&r.min>=48&&r.n===32,'ルートのベース（ピアノロールに見える高さ・1オクターブ下で鳴る）',JSON.stringify(r));
// 再生してエラーが出ない
await E('try{play()}catch(e){}');await pg.waitForTimeout(1500);await E('try{stopPlay()}catch(e){}');
await pg.waitForTimeout(3500);
const saved=await pg.evaluate(()=>{var p=P();var a=(p.dprojs||[]).concat(p.dproj?[p.dproj]:[]);return a.some(x=>(x.T||[]).some(t=>t.name==='王道進行'))});
ok(saved,'自由DAWの曲として学習記録に保存される');
// 4) お題DAW
await pg.evaluate(()=>openHome(false));await pg.waitForTimeout(600);await pg.click('#mtC');await pg.waitForTimeout(3200);
const fc=await (await pg.$('#dawc')).contentFrame();const C=c=>fc.evaluate(c=>__g(c),c);
await fc.evaluate(()=>{var m=document.getElementById('chm');if(m&&m.classList.contains('on'))m.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))});await pg.waitForTimeout(300);
ok(await C('chActive()'),'お題DAWが開く');
const nc=await fc.evaluate(()=>document.querySelectorAll('#zkbl .bi').length);ok(nc===10,'お題DAWにも「もらった素材」10こ',nc);
await fc.evaluate(()=>{var it=[...document.querySelectorAll('#zkbl .bi')].filter(e=>e.textContent.includes('カノンの宝箱'))[0];it.querySelector('button.ad').click()});await pg.waitForTimeout(300);
r=await C(`(function(){var t=T[T.length-1];return {name:t.name,l:t.clips[0].l,s:t.clips[0].s,n:t.clips[0].notes.length,bars:BARS,max:Math.max.apply(null,t.clips[0].notes.map(function(n){return n.s+n.l}))}})()`);
ok(r.name==='カノン進行'&&r.l===4&&r.s===0&&r.n===12&&r.bars===4&&r.max<=64,'お題DAWで8小節のカノンは、はじめの4小節だけ置ける',JSON.stringify(r));
await fc.evaluate(()=>{var it=[...document.querySelectorAll('#zkbl .bi')].filter(e=>e.textContent.includes('8ビットの精'))[0];it.querySelector('button.ad').click()});await pg.waitForTimeout(300);
ok(await C('T[T.length-1].inst')==='chip','お題DAWで音源「8ビット」のトラック');
const jd=await C(`(function(){try{chJudge(CH.conds);return 'ok'}catch(e){return String(e)}})()`);ok(jd==='ok','お題の判定がエラーにならない',jd);
await pg.screenshot({path:OUT+'/zk4_odai.png'});
// 5) お題で2小節のドラムは4小節までくりかえす・元にもどせる
const pk=await pg.evaluate(()=>zkDawList());
const tl=await C('T.length');
r=await C(`(function(){zkUse(${JSON.stringify(pk.find(c=>c.id==='m-four'))});var t=T[T.length-1];return {l:t.clips[0].l,s:t.clips[0].s,n:t.clips[0].notes.length,last:Math.max.apply(null,t.clips[0].notes.map(function(n){return n.s}))}})()`);
ok(r.l===4&&r.s===0&&r.n===56&&r.last===62,'お題で2小節の4つ打ちは4小節にくりかえして置く',JSON.stringify(r));
await pg.waitForTimeout(400);await fc.evaluate(()=>document.body.dispatchEvent(new KeyboardEvent('keydown',{key:'z',ctrlKey:true,metaKey:true,bubbles:true})));await pg.waitForTimeout(300);
ok(await C('T.length')===tl,'Ctrl+Z で置いたトラックが消える',await C('T.length')+' / '+tl);
// 6) 12トラックで止まる
r=await C(`(function(){var c=${JSON.stringify(pk.find(c=>c.id==='m-melody'))};for(var i=0;i<15;i++)zkUse(c);return T.length})()`);ok(r===12,'トラックは12個まで',r);
// 7) 聴くだけ・レッスン中は置けない
r=await E(`(function(){var n=T.length;listenOnly=true;zkUse(${JSON.stringify(pk.find(c=>c.id==='m-melody'))});var a=T.length===n;listenOnly=false;free=false;zkUse(${JSON.stringify(pk.find(c=>c.id==='m-melody'))});var b=T.length===n;free=true;return a&&b})()`);
ok(r,'聴くだけの画面とレッスン中は置けない');
// 8) ほかの人の作品を聴くとき、オクターブと強さが残る
r=await C(`(function(){var a=chClean([{name:'b',kind:'inst',inst:'bass',oct:-1,len:1.5,clips:[{s:0,l:1,notes:[{s:0,p:48,l:2,v:.5},{s:2,p:48,l:2}]}]},{name:'o',kind:'inst',inst:'orgel',clips:[]}]);return {oct:a[0].oct,len:a[0].len,v:a[0].clips[0].notes[0].v,v2:a[0].clips[0].notes[1].v,o:a[1].inst}})()`);
ok(r.oct===-1&&r.len===1.5&&r.v===.5&&r.v2===undefined&&r.o==='orgel','聴くときもオクターブ・長さ・強さ・図鑑の音色が残る',JSON.stringify(r));
ok(errs.length===0,'ページエラー0件',errs.slice(0,3).join(' | '));
console.log(ng?'結果：NG あり '+ng:'結果：すべてOK');await b.close()})();
