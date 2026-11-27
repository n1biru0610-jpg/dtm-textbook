// shift+ホイール横スクロール／shift+ctrl+ホイールでカーソル位置中心に横ズーム／お題から自由DAWへ（node zw.js）
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const res=[];const ok=(n,c,i)=>{res.push(c);console.log((c?'OK':'NG')+'  '+n+(i!==undefined&&i!==''?'  ('+i+')':''))};
(async()=>{
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const pg=await (await b.newContext({viewport:{width:1366,height:768}})).newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.route(/supabase\.co|fonts\.googleapis|accounts\.google/,r=>r.abort());
await pg.goto('http://localhost:8765/preview/index.html',{waitUntil:'load'});await pg.waitForTimeout(1200);
await pg.evaluate(()=>document.querySelector('#fgs').click());await pg.waitForTimeout(500);
await pg.evaluate(()=>{DAW_HTML=DAW_HTML.replace('function showStep(){','window.__g=function(c){return eval(c)};function showStep(){');openDaw()});await pg.waitForTimeout(1800);
const fh=await pg.$('#dawf');const fr=await fh.contentFrame();const E=c=>fr.evaluate(c=>__g(c),c);const box=await fh.boundingBox();
await fr.evaluate(()=>document.querySelector('#dfree').click());await pg.waitForTimeout(800);
const lr=JSON.parse(await E(`JSON.stringify((function(){var r=$('lanes').getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height}})())`));
const mx=box.x+lr.x+400,my=box.y+lr.y+60;
await pg.mouse.move(mx,my);
// shift+ホイールで横スクロール
await E(`$('lanes').scrollLeft=0`);await pg.keyboard.down('Shift');await pg.mouse.wheel(0,300);await pg.waitForTimeout(200);await pg.keyboard.up('Shift');
const s1=await E(`$('lanes').scrollLeft`);ok('shift+ホイールで横にスクロールする',s1>100,s1);
await pg.mouse.wheel(0,300);await pg.waitForTimeout(200);
// shift+ctrl+ホイールでカーソル位置を中心に拡大縮小
await E(`$('lanes').scrollLeft=300`);await pg.waitForTimeout(100);
const bar0=await E(`(function(){var r=$('lanes').getBoundingClientRect();return ($('lanes').scrollLeft+400)/bw()})()`);const w0=await E(`bw()`);
await pg.keyboard.down('Shift');await pg.keyboard.down('Control');await pg.mouse.wheel(0,-400);await pg.waitForTimeout(300);await pg.keyboard.up('Control');await pg.keyboard.up('Shift');
const w1=await E(`bw()`);const bar1=await E(`($('lanes').scrollLeft+400)/bw()`);
ok('shift+ctrl+ホイール(上)で拡大',w1>w0*1.3,w0+'→'+w1);
ok('拡大してもカーソル位置の小節が動かない',Math.abs(bar1-bar0)<.08,bar0.toFixed(3)+' vs '+bar1.toFixed(3));
await pg.keyboard.down('Shift');await pg.keyboard.down('Control');await pg.mouse.wheel(0,900);await pg.waitForTimeout(300);await pg.keyboard.up('Control');await pg.keyboard.up('Shift');
const w2=await E(`bw()`);const bar2=await E(`($('lanes').scrollLeft+400)/bw()`);
ok('下回しで縮小（下限あり）',w2<w1&&w2>=16,w1+'→'+w2);
const clamp=await E(`$("lanes").scrollLeft<=1||$("lanes").scrollLeft>=$("lanes").scrollWidth-$("lanes").clientWidth-2`);ok('縮小でもカーソル位置が保たれる（端に当たったときを除く）',clamp||Math.abs(bar2-bar0)<.15,bar2.toFixed(3)+' clamp='+clamp);
ok('ルーラーがレーンと同じ位置にそろう',(await E(`$('ruler').scrollLeft===$('lanes').scrollLeft`)));
ok('ページ全体のズームは起きない',(await pg.evaluate(()=>window.visualViewport.scale))===1);
// 打ち込み画面
await E(`$('lanes').scrollLeft=0;ZX=1;renderTracks();sel=0;openEd(T[0],T[0].clips[0])`);await pg.waitForTimeout(500);
const er=JSON.parse(await E(`JSON.stringify((function(){var r=$('escroll').getBoundingClientRect();return {x:r.left,y:r.top,w:r.width}})())`));
await pg.mouse.move(box.x+er.x+500,box.y+er.y+60);
const c0=await E(`cw`);
await pg.keyboard.down('Shift');await pg.keyboard.down('Control');await pg.mouse.wheel(0,-400);await pg.waitForTimeout(300);await pg.keyboard.up('Control');await pg.keyboard.up('Shift');
const c1=await E(`cw`);ok('打ち込み画面もshift+ctrl+ホイールで横に拡大',c1>c0,c0+'→'+c1);
await E(`$('escroll').scrollLeft=0`);await pg.keyboard.down('Shift');await pg.mouse.wheel(0,300);await pg.waitForTimeout(200);await pg.keyboard.up('Shift');
ok('打ち込み画面もshift+ホイールで横スクロール',(await E(`$('escroll').scrollLeft`))>50,await E(`$('escroll').scrollLeft`));
await E(`closeEd();CWZ=1`);
// お題 → 自由なDAW
await pg.evaluate(()=>dcStart());await pg.waitForTimeout(2500);
const ch=await E(`({act:chActive(),bars:BARS,dc:!!(pjGet(curId)||{}).dc})`);ok('お題DAWは4小節',ch.act&&ch.bars===4,JSON.stringify(ch));
await pg.evaluate(()=>dcOpenDaw({}));await pg.waitForTimeout(1800);
const fr2=await E(`({act:chActive(),bars:BARS,dc:!!(pjGet(curId)||{}).dc,can:canPlaceAt(T[0],10,1),bar:document.getElementById('chBar').hidden})`);
ok('お題から自由なDAWに行くと、お題の制限がなくなり4小節より先にも作れる',!fr2.act&&fr2.bars>=40&&fr2.can===true&&fr2.bar,JSON.stringify(fr2));
ok('お題のプロジェクトは残っている',(await E(`projs.filter(function(p){return p.dc}).length`))===1);
ok('ページエラー0件',errs.length===0,errs.slice(0,3).join('|'));
console.log(res.every(x=>x)?'結果：すべてOK':'結果：NG あり');await b.close()})();
