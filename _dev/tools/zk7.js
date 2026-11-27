// ステップ7のテスト：MIDIカード30枚が、自由DAW（スタジオ）とお題DAWの両方で置けて鳴るか（スウィングつきのパックはスウィングも引きつぐか）。
// 使い方：リポジトリ直下で python3 -m http.server 8765 → node _dev/tools/zk7.js [出力フォルダ] [幅] [高さ] [t=タッチ]
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const OUT=process.argv[2]||'.',W=+process.argv[3]||1366,H=+process.argv[4]||768,MOB=process.argv[5]==='t';
let ng=0;const ok=(c,m,i)=>{console.log((c?'OK ':'NG ')+m+(i!==undefined?'  ('+i+')':''));if(!c)ng++};
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const ctx=await b.newContext(MOB?{viewport:{width:W,height:H},isMobile:true,hasTouch:true}:{viewport:{width:W,height:H}});
const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.route(/supabase\.co|googleapis|gstatic|accounts\.google/,r=>r.abort());
await pg.goto('http://localhost:8765/preview/index.html',{waitUntil:'load'});await pg.waitForTimeout(1500);await pg.addStyleTag({content:'body.dchl #dcCta,body.dchl #modeTabs #mtC{animation:none!important}'});
await pg.evaluate(()=>{const e=document.querySelector('#fgs');if(e)e.click()});await pg.waitForTimeout(600);
await pg.evaluate(()=>{DAW_HTML=DAW_HTML.replace('function showStep(){','window.__g=function(c){return eval(c)};function showStep(){')});
const info=await pg.evaluate(()=>{var m=ZKCARDS.filter(d=>d.type==='midi');return {n:ZKCARDS.length,midi:m.length,pk:m.filter(d=>ZKPK[d.id]).length,ids:m.map(d=>d.id),uniq:new Set(ZKCARDS.map(d=>d.id)).size,
 kinds:{chord:0}}});
ok(info.midi===30&&info.pk===30,'MIDIカード30枚、全部に中身がある',info.midi+'/'+info.pk);
ok(info.uniq===info.n,'カードの id がかぶらない',info.n);
// 全カードの説明・条件の文がちゃんと作れる
const how=await pg.evaluate(()=>ZKCARDS.filter(d=>{var t=zkHow(d.c);return !t||/undefined/.test(t)||!d.can||!d.desc}).map(d=>d.id));
ok(how.length===0,'全カードに説明・できること・入手条件の文がある',how.join(','));
// 全部持たせる
await pg.evaluate(()=>{var p=P(),b=bdOf(p),c=zkCards(b);b.seen=b.seen||{};ZKCARDS.forEach(d=>{c[d.id]=Date.now();b.seen[d.id]=1});p.u=Date.now();saveDB()});
await pg.evaluate(()=>{zkOpen()});await pg.waitForTimeout(800);
const cnt=await pg.evaluate(()=>{var e=document.querySelector('#zk');return e?e.textContent.match(/\d+\s*\/\s*\d+/):null});
ok(cnt&&cnt[0].replace(/\s/g,'')==='53/53','図鑑の枚数表示 53 / 53',cnt&&cnt[0]);
await pg.screenshot({path:OUT+'/zk7_book.png'});
await pg.evaluate(()=>zkClose());await pg.waitForTimeout(300);
// 自由DAW
await pg.evaluate(()=>{openDawFree&&openDawFree()}).catch(()=>{});
await pg.evaluate(()=>{zkToStudio(ZKCARDS.filter(d=>d.id==='m-axis')[0])});await pg.waitForTimeout(4500);
const fr=await (await pg.$('#dawf')).contentFrame();const E=c=>fr.evaluate(c=>__g(c),c);
await pg.waitForTimeout(800);
const nb=await fr.evaluate(()=>document.querySelectorAll('#zkbl .bi').length);
ok(nb===33,'自由DAWの「もらった素材」に33こ（MIDI30＋音源3）',nb);
const pk=await pg.evaluate(()=>zkDawList().filter(c=>c.pk));
let bad=[];
for(const c of pk){const r=await E(`(function(){var c=${JSON.stringify(c)};while(T.length>2){T.pop()}sel=0;var n0=T.length;try{zkUse(c)}catch(e){return {err:String(e)}}var t=T[T.length-1],k=t.clips[0];var r={add:T.length===n0+1,n:k.notes.length,l:k.l,sw:k.sw||0,swg:k.swg||0,kind:t.kind,inst:t.inst||'piano',oct:t.oct||0};try{zkPrev(c)}catch(e){r.err=String(e)}return r})()`);
 const k=c.pk,exp=k.n.length,swe=k.sw?(k.sw>=90?100:k.sw>=50?66:33):0;
 const good=r.add&&!r.err&&r.n===exp&&r.l===k.bars&&r.sw===swe&&r.swg===(swe&&k.swg===1?1:0)&&r.kind===(k.k==='drum'?'drum':'inst')&&(k.k==='drum'||r.inst===(k.inst||'piano'))&&r.oct===(k.oct||0);
 if(!good)bad.push(c.id+':'+JSON.stringify(r));}
ok(bad.length===0,'自由DAWで30枚すべて置ける（音の数・長さ・音色・オクターブ・スウィング）・▶きいてみる',bad.join(' | '));
// 再生してエラーが出ない（スウィングつき）
await E(`(function(){while(T.length>0)T.pop();})()`);
for(const id of ['m-ukg','m-shuffle','m-mel-riff','m-bs-walk','m-1625']){await E(`zkUse(${JSON.stringify(pk.find(c=>c.id===id))})`)}
await E('try{showTr(0)}catch(e){}');
await E('try{play()}catch(e){}');await pg.waitForTimeout(2500);await E('try{stopPlay()}catch(e){}');
const ukg=await E(`(function(){var t=T.filter(function(t){return t.name==='UKガレージ'})[0];return t?{sw:t.clips[0].sw,swg:t.clips[0].swg}:null})()`);
ok(ukg&&ukg.sw===66&&ukg.swg===1,'UKガレージは16分のスウィング「ふつう」つきで置かれる',JSON.stringify(ukg));
await pg.screenshot({path:OUT+'/zk7_studio.png'});
// MIDI書き出しがエラーにならない
const mx=await E(`(function(){try{var f=typeof buildMidi==='function'?buildMidi:(typeof mkMidi==='function'?mkMidi:null);if(!f)return 'skip';var d=f();return d&&(d.length||d.byteLength)?'ok':'empty'}catch(e){return String(e)}})()`);
ok(mx==='ok'||mx==='skip','MIDI書き出し',mx);
await pg.waitForTimeout(3500);
const saved=await pg.evaluate(()=>{var p=P();var a=(p.dprojs||[]).concat(p.dproj?[p.dproj]:[]);var t=null;a.forEach(x=>(x.T||[]).forEach(q=>{if(q.name==='UKガレージ')t=q}));return t?{sw:t.clips[0].sw,swg:t.clips[0].swg}:null});
ok(saved&&saved.sw===66&&saved.swg===1,'スウィングつきで学習記録に保存される',JSON.stringify(saved));
// お題DAW
await pg.evaluate(()=>openHome(false));await pg.waitForTimeout(600);await pg.click('#mtC');await pg.waitForTimeout(3500);
const fc=await (await pg.$('#dawc')).contentFrame();const C=c=>fc.evaluate(c=>__g(c),c);
await fc.evaluate(()=>{var m=document.getElementById('chm');if(m&&m.classList.contains('on'))m.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))});await pg.waitForTimeout(300);
ok(await C('chActive()'),'お題DAWが開く');
const nc=await fc.evaluate(()=>document.querySelectorAll('#zkbl .bi').length);ok(nc===33,'お題DAWにも33こ',nc);
bad=[];
for(const c of pk){const r=await C(`(function(){var c=${JSON.stringify(c)};while(T.length>1){T.pop()}sel=0;var n0=T.length;try{zkUse(c)}catch(e){return {err:String(e)}}var t=T[T.length-1],k=t.clips[0];return {add:T.length===n0+1,s:k.s,l:k.l,n:k.notes.length,max:Math.max.apply(null,k.notes.map(function(n){return n.s+n.l})),sw:k.sw||0,bars:BARS}})()`);
 const good=r.add&&!r.err&&r.s===0&&r.l===r.bars&&r.max<=r.bars*16+1e-6&&r.n>0&&r.sw===(c.pk.sw?(c.pk.sw>=90?100:c.pk.sw>=50?66:33):0);
 if(!good)bad.push(c.id+':'+JSON.stringify(r));}
ok(bad.length===0,'お題DAWで30枚すべて置ける（1小節めから・お題の長さに入る・スウィング）',bad.join(' | '));
const jd=await C(`(function(){try{chJudge(CH.conds);return 'ok'}catch(e){return String(e)}})()`);ok(jd==='ok','お題の判定がエラーにならない',jd);
await C('try{play()}catch(e){}');await pg.waitForTimeout(1500);await C('try{stopPlay()}catch(e){}');
await pg.screenshot({path:OUT+'/zk7_odai.png'});
ok(errs.length===0,'ページエラー0件',errs.join(' / '));
console.log(ng?'結果：NG あり':'結果：すべてOK');await b.close();process.exit(ng?1:0)})();
