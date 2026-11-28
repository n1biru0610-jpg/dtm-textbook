// TAC BASE 音源のテスト：node _dev/tools/tac.js [ページ] [幅] [高さ]
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const PAGE=process.argv[2]||'preview/index.html',W=+process.argv[3]||1366,H=+process.argv[4]||768;let ng=0;const ok=(c,m)=>{console.log((c?'OK ':'NG ')+m);if(!c)ng++};
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const pg=await b.newPage({viewport:{width:W,height:H}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.route(/supabase\.co|fonts\.googleapis|accounts\.google/,r=>r.abort());
await pg.goto('http://localhost:8765/'+PAGE,{waitUntil:'load'});await pg.waitForTimeout(1200);
await pg.evaluate(()=>document.querySelector('#fgs').click());await pg.waitForTimeout(500);
await pg.evaluate(()=>{DAW_HTML=DAW_HTML.replace('function showStep(){','window.__g=function(c){return eval(c)};function showStep(){');openDaw()});await pg.waitForTimeout(1800);
const fh=await pg.$('#dawf');const fr=await fh.contentFrame();const E=c=>fr.evaluate(c=>__g(c),c);const box=await fh.boundingBox();
fr.on('pageerror',e=>errs.push('daw: '+e.message));
await E("$('dfree').click()");await pg.waitForTimeout(800);
ok((await E("TACB")).endsWith('/tac/')&&!(await E("TACB")).includes('preview'),'素材の場所: '+await E("TACB"));
// 録音の楽器の欄を開いて、アップライトピアノを「＋ 追加」（実際のクリック）
ok(!(await fr.$('text=録音の楽器')),'「録音の楽器」の欄はなく、インストゥルメントにまとまっている');
const brw=await E("$('brw').textContent");ok(brw.includes('アップライトピアノ')&&brw.includes('けんばん')&&!brw.includes('シンセ・リード')&&!brw.includes('ドラム（アコースティック）'),'インストゥルメントは TAC の楽器だけ（前のシンセは出ない）');
await pg.screenshot({path:'/tmp/nmt/out/tac1.png'});
const n0=await E("T.length");
const add=await fr.evaluateHandle(()=>{var it=[...document.querySelectorAll('#brw *')].filter(e=>e.children.length&&/アップライトピアノ/.test(e.textContent)&&e.querySelectorAll('button').length>=2&&e.textContent.length<80)[0];return it&&[...it.querySelectorAll('button')].filter(x=>/追加/.test(x.textContent))[0]});
const ab=add.asElement();ok(!!ab,'ピアノの「＋ 追加」ボタン');if(ab){await ab.scrollIntoViewIfNeeded();await ab.click()}
await pg.waitForTimeout(4000);
ok(await E("T.length")===n0+1&&await E("T[T.length-1].inst")==='tac:UprightKW','ピアノのトラックができる');
ok(await E("!!(TACD.UprightKW&&TACD.UprightKW.ok)"),'ピアノの音を読みこめた');
// 音が出るか（アナライザーで実測）
await E("window.__an=ctx.createAnalyser();__an.fftSize=2048;master.connect(__an);window.__pk=function(){var a=new Float32Array(2048),m=0;__an.getFloatTimeDomainData(a);for(var i=0;i<a.length;i++)m=Math.max(m,Math.abs(a[i]));return m}");
const peak=async(code,ms)=>{await E(code);let m=0;for(let i=0;i<8;i++){await pg.waitForTimeout((ms||400)/8);m=Math.max(m,await E("__pk()"))}return m};
await pg.waitForTimeout(800);
const pS=await peak("tone(60,ctx.currentTime+.03,.5,'piano')");
const pP=await peak("tone(60,ctx.currentTime+.03,.5,'tac:UprightKW')");
ok(pP>0.02,'ピアノのドが鳴る（ピーク '+pP.toFixed(3)+'、いつものピアノ '+pS.toFixed(3)+'）');
await pg.waitForTimeout(2500);const pOut=await peak("tone(110,ctx.currentTime+.03,.5,'tac:UprightKW')");ok(pOut<0.01,'音域の外（C8より上）は鳴らさない');
// 全部の音源を読みこむ
const all=await E("(async function(){var r={};for(var i=0;i<TACIL.length;i++){var x=TACIL[i];try{if(x[0].indexOf('tac:')===0)await tacLoad(x[0].slice(4));else await tacKit(+x[0].slice(4));r[x[0]]='ok'}catch(e){r[x[0]]='NG '+e}}return r})()");
const bad=Object.entries(all).filter(([k,v])=>v!=='ok');ok(bad.length===0&&Object.keys(all).length===40,'40音源（録音35＋ドラム5）がすべて読みこめる '+JSON.stringify(bad));
// 音源ごとの音量（ピーク）
const lv={};for(const x of await E("TACIL.map(function(x){return [x[0],x[5]]})")){if(!x[0].startsWith('tac:'))continue;const m=64+(x[1]||0)*12;await pg.waitForTimeout(300);lv[x[0].slice(4)]=+(await peak("tone("+m+",ctx.currentTime+.03,.4,'"+x[0]+"')",450)).toFixed(3)}
console.log('  音量',JSON.stringify(lv));ok(Object.values(lv).every(v=>v>0.01),'録音の楽器がすべて鳴る（ミの音）');
// ドラム（DISTKIT）を追加して鳴らす
await E("addInst('tkit0')");await pg.waitForTimeout(1500);ok(await E("T[T.length-1].tk")===0&&await E("T[T.length-1].kind")==='drum','ドラム DISTKIT のトラックができる');
const pD=await peak("drumHit(0,ctx.currentTime+.03,0,T[T.length-1])");ok(pD>0.05,'キックが鳴る（'+pD.toFixed(3)+'）');
for(const p of [1,2,3,4,5,6,7,8,10,14,15]){const v=await peak("drumHit("+p+",ctx.currentTime+.03,0,T[T.length-1])",300);if(!(v>0.01))ok(false,'ドラムの段 '+p+' が鳴らない')}
// 再生（ピアノのクリップに音を入れて ▶）
await E("var t=T.filter(function(x){return x.inst==='tac:UprightKW'})[0];t.clips=[{s:0,l:1,notes:[{s:0,p:60,l:4},{s:4,p:64,l:4,v:.4},{s:8,p:67,l:4}]}];renderTracks()");
const pPlay=await peak("$('play').click()",900);await E("if(playing)$('play').click()");ok(pPlay>0.02,'▶で再生すると鳴る（'+pPlay.toFixed(3)+'）');
// ＋ボタンで作ったトラックの最初の音
await E("addTrack('メロディ','inst');addTrack('ドラム','drum')");ok(await E("T[T.length-2].inst")==='tac:UprightKW'&&await E("T[T.length-1].tk")===0,'＋で作るトラックは、アップライトピアノ／DISTKIT');
await E("T.splice(T.length-2,2);renderTracks()");
// お題の「楽器」の条件は種類で判定
ok(await E("tacFam('tac:ConcertHarp')==='pluck'&&tacFam('tac:FingerBassYR')==='bass'&&tacFam('pad')==='pad'&&tacFam(undefined)==='piano'"),'楽器の種類（お題の判定用）');
// 前の音の曲：音色の欄に「前の音」として残る
await E("addTrack('むかし','inst');T[T.length-1].inst='lead';sel=T.length-1;renderTracks();inspSound()");await pg.waitForTimeout(300);
const op=await E("(function(){var s=document.querySelector('#isI');return s?[].map.call(s.options,function(o){return o.textContent}).join('|')+' ='+s.value:'none'})()");
ok(op.includes('シンセ・リード（前の音）')&&op.includes('アップライトピアノ')&&!op.includes('ベル（')&&op.endsWith('=lead'),'前の音の曲は、音色の欄に「前の音」として残る');
await E("addTrack('むかしドラム','drum');T[T.length-1].kit=1;delete T[T.length-1].tk;sel=T.length-1;renderTracks();inspSound()");await pg.waitForTimeout(300);
const ok2=await E("(function(){var s=document.querySelector('#isK');return s?[].map.call(s.options,function(o){return o.textContent}).join('|')+' ='+s.value:'none'})()");
ok(ok2.includes('エレクトロ（前の音）')&&!ok2.includes('アコースティック')&&ok2.includes('DISTKIT')&&ok2.endsWith('=1'),'前のキットも「前の音」として残る: '+ok2);
await E("T.splice(T.length-2,2);renderTracks()");
// 保存（プロジェクト）に音源が残る
ok(await E("JSON.stringify(T).indexOf('tac:UprightKW')>=0&&JSON.stringify(T).indexOf('\"tk\":0')>=0"),'プロジェクトに音源が記録される');
ok(await E("JSON.stringify(chClean(T)).indexOf('tac:UprightKW')>=0&&JSON.stringify(chClean(T)).indexOf('\"tk\":0')>=0"),'お題の提出データにも音源が残る');
await pg.screenshot({path:'/tmp/nmt/out/tac2.png'});
ok(errs.length===0,'エラー0件 '+errs.slice(0,3));console.log(ng?'結果：NGあり':'結果：すべてOK');await b.close()})()
