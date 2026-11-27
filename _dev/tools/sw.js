// ステップ8 スウィングのテスト：ピアノロールの「〰 スウィング」を実クリック／キーボードで選ぶ → 再生のノリ（うらの音が遅れる）→ MIDI書き出し → 保存・読み込み → お題DAWでも使える
// 使い方：リポジトリ直下で python3 -m http.server 8765 → node _dev/tools/sw.js [幅] [高さ] [t]
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const W=+process.argv[2]||1366,H=+process.argv[3]||768,MOB=process.argv[4]==='t';
const res=[];const ok=(n,c,i)=>{res.push(c);console.log((c?'OK':'NG')+'  '+n+(i!==undefined&&i!==''?'  ('+i+')':''))};
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const cx=await b.newContext(MOB?{viewport:{width:W,height:H},isMobile:true,hasTouch:true}:{viewport:{width:W,height:H}});const pg=await cx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.route(/supabase\.co|fonts\.googleapis|accounts\.google/,r=>r.abort());
await pg.goto('http://localhost:8765/preview/index.html',{waitUntil:'load'});await pg.waitForTimeout(1200);
await pg.evaluate(()=>document.querySelector('#fgs').click());await pg.waitForTimeout(500);
await pg.evaluate(()=>{DAW_HTML=DAW_HTML.replace('function showStep(){','window.__g=function(c){return eval(c)};function showStep(){');openDaw()});await pg.waitForTimeout(1800);
const fh=await pg.$('#dawf');const fr=await fh.contentFrame();const E=c=>fr.evaluate(c=>__g(c),c);const box=await fh.boundingBox();
const R=async sel=>JSON.parse(await fr.evaluate(s=>{const e=Array.from(document.querySelectorAll(s)).filter(e=>e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden')[0];if(!e)return 'null';e.scrollIntoView({block:'nearest',inline:'nearest'});const r=e.getBoundingClientRect();return JSON.stringify({x:r.left,y:r.top,w:r.width,h:r.height})},sel));
const press=async sel=>{const r=await R(sel);if(!r){ok('見つからない: '+sel,false);return false}const x=r.x+r.w/2,y=r.y+r.h/2;const hit=await fr.evaluate(([x,y,s])=>{const e=document.elementFromPoint(x,y);const t=document.querySelector(s);return !!(e&&t&&(t===e||t.contains(e)))},[x,y,sel]);if(!hit)ok('押せない（隠れている）: '+sel,false);if(MOB)await pg.touchscreen.tap(box.x+x,box.y+y);else await pg.mouse.click(box.x+x,box.y+y);await pg.waitForTimeout(250);return hit};
const pressMenu=async txt=>{const i=await fr.evaluate(t=>[...document.querySelectorAll('#ctxm button')].findIndex(b=>b.textContent.includes(t)),txt);if(i<0){ok('メニューに無い: '+txt,false);return}await press('#ctxm button:nth-of-type('+(i+1)+')')};
// ※ #ctxm の中は button と div.sep が混ざるので nth-of-type（button の何番め）で押す
await press('#dfree');await pg.waitForTimeout(800);
await E(`(function(){T=[];addTrack('ドラム','drum');T[0].clips.push({s:0,l:1,notes:[0,2,4,6,8,10,12,14].map(function(s){return{s:s,p:2,l:1}})});addTrack('メロディ');T[1].clips.push({s:0,l:1,notes:[{s:0,p:60,l:2},{s:2,p:62,l:2}]});setBpm(120,1);renderTracks();afterEdit();openEd(T[0],T[0].clips[0])})()`);
await pg.waitForTimeout(500);
ok('ピアノロールに「〰 スウィング：なし」が見える',await fr.evaluate(()=>{const e=document.getElementById('swBtn');return !!e&&!e.hidden&&e.getClientRects().length>0&&e.textContent.includes('なし')}));
await pg.screenshot({path:'sw_0.png'});
await press('#swBtn');await pg.waitForTimeout(200);
ok('押すとメニューが開く（強さ4つ＋8分/16分）',await fr.evaluate(()=>document.getElementById('ctxm').classList.contains('on')&&document.querySelectorAll('#ctxm button').length===6));
await pg.screenshot({path:'sw_menu.png'});
await pressMenu('ふつうに');await pg.waitForTimeout(300);
let s=JSON.parse(await E("JSON.stringify({sw:T[0].clips[0].sw,swg:T[0].clips[0].swg||0,lab:$('swBtn').textContent,lines:document.querySelectorAll('#grid .swl').length})"));
ok('「ふつうに はねる」でクリップに sw=66、ボタンが「ふつう」',s.sw===66&&/ふつう/.test(s.lab),JSON.stringify(s));
ok('ずれて鳴る位置に点線（1小節で4本）',s.lines===4,s.lines);
await pg.screenshot({path:'sw_1.png'});
// 再生のノリ
await E(`(function(){window.__log=[];var t0=tone;tone=function(p,t,d,i){__log.push(['n',p,t,d]);return t0.apply(this,arguments)};DK=DK.map(function(f,k){return function(t){__log.push(['d',k,t]);return f.apply(this,arguments)}})})()`);
const sd=+await E('sd()');
const play=async()=>{await E('__log=[];cursor=0');await press('#play');await pg.waitForTimeout(sd*16*1000+500);await press('#stop');const L=JSON.parse(await E('JSON.stringify(__log)'));const d=L.filter(x=>x[0]==='d');const st=Math.min(...d.map(x=>x[2]));return {d:d.slice(0,8).map(x=>+((x[2]-st)/sd).toFixed(2)),n:L.filter(x=>x[0]==='n').slice(0,2).map(x=>[+((x[2]-st)/sd).toFixed(2),+(x[3]/sd).toFixed(2)])}};
let p=await play();
ok('スウィング：8分のうら（2,6,10,14）が遅れ、おもて（0,4,8,12）はそのまま',JSON.stringify(p.d)===JSON.stringify([0,2.44,4,6.44,8,10.44,12,14.44]),JSON.stringify(p.d));
ok('ほかのクリップ（スウィングなし）はまっすぐ',p.n.length===2&&p.n[1][0]===2,JSON.stringify(p.n));
// 16分
await press('#swBtn');await pressMenu('16分');await pg.waitForTimeout(200);
s=JSON.parse(await E("JSON.stringify({sw:T[0].clips[0].sw,swg:T[0].clips[0].swg||0,lab:$('swBtn').textContent,lines:document.querySelectorAll('#grid .swl').length})"));
ok('「16分のうら」で swg=1、ボタンが「ふつう・16分」、点線8本',s.swg===1&&/16分/.test(s.lab)&&s.lines===8,JSON.stringify(s));
p=await play();ok('16分スウィング：8分の音は動かない（16分のうらだけずれる）',JSON.stringify(p.d)===JSON.stringify([0,2,4,6,8,10,12,14]),JSON.stringify(p.d));
await E("T[0].clips[0].notes.push({s:1,p:0,l:1});renderEd()");p=await play();
await E("T[0].clips[0].notes.pop();renderEd()");
const d1=JSON.parse(await E('JSON.stringify(__log.filter(function(x){return x[0]==="d"&&x[1]===0}).map(function(x){return x[2]}))'));
ok('16分スウィング：16分のうら（1）が 1.22 に',p.d[1]===1.22,JSON.stringify(p.d));
// キーボード
await press('#swBtn');await pg.keyboard.press('Escape');await pg.waitForTimeout(150);
await fr.evaluate(()=>document.getElementById('swBtn').focus());await pg.keyboard.press('Enter');await pg.waitForTimeout(200);
const kf=await fr.evaluate(()=>({on:document.getElementById('ctxm').classList.contains('on'),f:document.activeElement&&document.activeElement.closest&&!!document.activeElement.closest('#ctxm'),ex:document.getElementById('swBtn').getAttribute('aria-expanded')}));
ok('キーボード：Enter でメニューが開き、中にフォーカス',kf.on&&kf.f&&kf.ex==='true',JSON.stringify(kf));
await pg.keyboard.press('Home');await pg.keyboard.press('Enter');await pg.waitForTimeout(250);
s=JSON.parse(await E("JSON.stringify({sw:T[0].clips[0].sw||0,f:document.activeElement.id,ex:$('swBtn').getAttribute('aria-expanded')})"));
ok('キーボード：「なし」をえらぶとスウィングが消え、フォーカスがボタンにもどる',s.sw===0&&s.f==='swBtn'&&s.ex==='false',JSON.stringify(s));
// Ctrl+Z
await pg.waitForTimeout(200);await fr.evaluate(()=>document.activeElement.blur());await pg.keyboard.press('Control+z');await pg.waitForTimeout(300);
s=JSON.parse(await E("JSON.stringify({sw:(T[0].clips[0]||{}).sw||0,swg:(T[0].clips[0]||{}).swg||0})"));
ok('Ctrl+Z で ひとつ前（ふつう・16分）にもどる',s.sw===66&&s.swg===1,JSON.stringify(s));
// 8分にもどして MIDI
await E("openEd(T[0],T[0].clips[0]);swSet(66,2)");
const mid=await E('midiB64()');const by=Buffer.from(mid,'base64');
// ドラム(ch10)のノートオンの時刻を読む
let pos=14,ons=[];while(pos<by.length){if(by.toString('latin1',pos,pos+4)!=='MTrk')break;const len=by.readUInt32BE(pos+4);let q=pos+8,t=0,rs=0;const end=q+len;while(q<end){let v=0,c;do{c=by[q++];v=(v<<7)|(c&127)}while(c&128);t+=v;let st=by[q];if(st===0xff){q+=2;let l=0;do{c=by[q++];l=(l<<7)|(c&127)}while(c&128);q+=l;continue}if(st&0x80){rs=st;q++}if((rs&0xf0)===0x90&&by[q+1]>0&&(rs&15)===9)ons.push(t);q+=((rs&0xf0)===0xc0||(rs&0xf0)===0xd0)?1:2}pos=end}
ok('MIDI書き出しにも、ずらした位置で入る（ドラム 0,293,480,773…）',JSON.stringify(ons.slice(0,4))===JSON.stringify([0,293,480,773]),JSON.stringify(ons.slice(0,8)));
// 分割
await E("cursor=0");
// 保存・読み込み
await E("closeEd()");await pg.waitForTimeout(2200);
const pp=await pg.evaluate(()=>{const p=P();return JSON.stringify((p&&p.dprojs||[]).map(x=>(x.T||[]).map(t=>t.clips.map(c=>[c.sw||0,c.swg||0]))))});
ok('学習記録（プロジェクト）に sw が保存される',/\[66,0\]/.test(pp),pp);
await press('#mapBtn');await pg.waitForTimeout(600);await press('#dfree');await pg.waitForTimeout(900);
s=JSON.parse(await E("JSON.stringify({sw:T[0]&&T[0].clips[0]&&T[0].clips[0].sw})"));
ok('マップ→自由につくる でもう一度開いても、スウィングが残っている',s.sw===66,JSON.stringify(s));
await E("openEd(T[0],T[0].clips[0])");await pg.waitForTimeout(300);
ok('開き直したボタンの表示も「ふつう」',/ふつう/.test(await fr.evaluate(()=>document.getElementById('swBtn').textContent)));
// 作品を聴くとき（お題の提出データ）
const cc=JSON.parse(await E("JSON.stringify(chClean([{kind:'drum',clips:[{s:0,l:1,sw:66,swg:1,notes:[{s:2,p:2,l:1}]},{s:1,l:1,sw:'abc',notes:[]},{s:2,l:1,sw:500,notes:[]}]}])[0].clips.map(function(c){return[c.sw||0,c.swg||0]}))"));
ok('ほかの人の作品を開くときも sw が残る（へんな値は直す）',JSON.stringify(cc)==='[[66,1],[0,0],[100,0]]',JSON.stringify(cc));
// 分割したクリップにも引きつぐ
const sp=JSON.parse(await E("(function(){T[1].clips=[{s:0,l:2,sw:33,notes:[{s:2,p:60,l:1},{s:18,p:62,l:1}]}];cursor=1;splitClip(T[1].clips[0]);return JSON.stringify(T[1].clips.map(function(c){return c.sw||0}))})()"));
ok('クリップを2つに分けても、両方にスウィングが残る',JSON.stringify(sp)==='[33,33]',JSON.stringify(sp));
// レッスン（free でない）ではボタンを出さない
const les=await E("(function(){var f=free;free=false;renderEd();var b=$('swBtn'),h=b.hidden&&b.getClientRects().length===0,i=$('inspBtn').getClientRects().length===0;b.click();var m=$('ctxm').classList.contains('on');var c=openClip,w=c.sw;swSet(100,2);var ch=c.sw!==w;free=f;renderEd();return JSON.stringify({h:h,i:i,m:m,ch:ch})})()");ok('レッスン中のDAWには出さない（見えない・押せない・変えられない）',les==='{"h":true,"i":true,"m":false,"ch":false}',les);
const du=JSON.parse(await E("(function(){var t=T[0],c=t.clips[0];t.clips=[c];c.sw=66;c.swg=1;openEd(t,c);$('dupBtn').click();return JSON.stringify(t.clips.map(function(x){return[x.sw||0,x.swg||0]}))})()"));ok('「クリップを複製」でもスウィングが残る',JSON.stringify(du)==='[[66,1],[66,1]]',JSON.stringify(du));
await E("T[0].clips=[T[0].clips[0]];delete T[0].clips[0].swg;openEd(T[0],T[0].clips[0]);renderTracks()");
// お題DAW
await pg.evaluate(()=>openHome(false));await pg.waitForTimeout(500);await pg.click('#mtC');await pg.waitForTimeout(2800);
let fc=null;for(let k=0;k<20;k++){fc=await (await pg.$('#dawc')).contentFrame();if(fc&&await fc.evaluate(()=>typeof __g==='function'&&__g("typeof swSet==='function'")).catch(()=>false))break;await pg.waitForTimeout(500)}
const dc=await fc.evaluate(()=>{try{document.getElementById('chX').click()}catch(e){}return 1});await pg.waitForTimeout(400);
const dcr=await fc.evaluate(c=>__g(c),"(function(){var t=T[0],c=t&&t.clips[0];if(!c){c={s:0,l:4,notes:[]};t.clips.push(c)}c.notes=[{s:0,p:2,l:1},{s:2,p:2,l:1}];openEd(t,c);var b=document.getElementById('swBtn');var vis=!b.hidden&&b.getClientRects().length>0;swSet(100,2);return JSON.stringify({vis:vis,sw:c.sw,lab:b.textContent,w:swW(c,2)})})()");
ok('お題DAWにも「〰 スウィング」があり、つよい（3連）が使える',/"vis":true/.test(dcr)&&/"sw":100/.test(dcr)&&/"w":2.666/.test(dcr),dcr);
await pg.screenshot({path:'sw_dc.png'});
ok('ページエラー0件',!errs.length,errs.slice(0,4).join(' | '));
console.log(res.every(x=>x)?'結果：すべてOK':'結果：NG あり');await b.close()})();
