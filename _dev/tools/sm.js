// ドラムのサンプル読み込みの通しテスト（node sm.js [幅] [高さ] [t]）
const {chromium}=require('/opt/npm-tools/node_modules/playwright');const fs=require('fs');
const W=+process.argv[2]||1366,H=+process.argv[3]||768,MOB=process.argv[4]==='t';
const res=[];const ok=(n,c,i)=>{res.push(c);console.log((c?'OK':'NG')+'  '+n+(i!==undefined&&i!==''?'  ('+i+')':''))};
function wav(f,hz,sec){const sr=22050,n=Math.floor(sr*sec),b=Buffer.alloc(44+n*2);b.write('RIFF',0);b.writeUInt32LE(36+n*2,4);b.write('WAVEfmt ',8);b.writeUInt32LE(16,16);b.writeUInt16LE(1,20);b.writeUInt16LE(1,22);b.writeUInt32LE(sr,24);b.writeUInt32LE(sr*2,28);b.writeUInt16LE(2,32);b.writeUInt16LE(16,34);b.write('data',36);b.writeUInt32LE(n*2,40);for(let i=0;i<n;i++)b.writeInt16LE(Math.round(Math.sin(2*Math.PI*hz*i/sr)*12000*(1-i/n)),44+i*2);fs.writeFileSync(f,b)}
fs.mkdirSync('/tmp/w/smp',{recursive:true});
wav('/tmp/w/smp/Splice_Kick_01.wav',60,.3);wav('/tmp/w/smp/snare_tight.wav',200,.2);wav('/tmp/w/smp/closed_hat.wav',900,.08);wav('/tmp/w/smp/Clap-Big.wav',500,.15);wav('/tmp/w/smp/long.wav',200,9);fs.writeFileSync('/tmp/w/smp/bad.wav','nope');
(async()=>{
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const ctx=await b.newContext(MOB?{viewport:{width:W,height:H},isMobile:true,hasTouch:true}:{viewport:{width:W,height:H}});
const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.route(/supabase\.co|fonts\.googleapis|accounts\.google/,r=>r.abort());
await pg.goto('http://localhost:8765/preview/index.html',{waitUntil:'load'});await pg.waitForTimeout(1200);
await pg.evaluate(()=>document.querySelector('#fgs').click());await pg.waitForTimeout(500);
await pg.evaluate(()=>{DAW_HTML=DAW_HTML.replace('function showStep(){','window.__g=function(c){return eval(c)};function showStep(){');openDaw()});await pg.waitForTimeout(1800);
const fh=await pg.$('#dawf');const fr=await fh.contentFrame();const E=c=>fr.evaluate(c=>__g(c),c);
await fr.evaluate(()=>document.querySelector('#dfree').click());await pg.waitForTimeout(800);
await E(`addTrack('ドラム','drum');T[T.length-1].clips.push({s:0,l:4,notes:[{s:0,p:0,l:1},{s:4,p:1,l:1},{s:8,p:2,l:1},{s:12,p:4,l:1}]});sel=T.length-1;renderTracks();openEd(T[sel],T[sel].clips[0])`);await pg.waitForTimeout(600);
const bt=await fr.evaluate(()=>({n:document.querySelectorAll('#keys .sb').length,bulk:!document.getElementById('smBulk').hidden}));
ok('ドラムの鍵盤に読み込みボタンが5つ・まとめて読み込みボタンが出る',bt.n===5&&bt.bulk,JSON.stringify(bt));
// まとめて（名前から自動割り当て）
await E(`smTarget='bulk'`);
await fr.locator('#smIn').setInputFiles(['/tmp/w/smp/Splice_Kick_01.wav','/tmp/w/smp/snare_tight.wav','/tmp/w/smp/closed_hat.wav','/tmp/w/smp/Clap-Big.wav']);await pg.waitForTimeout(1200);
const m=await E(`JSON.stringify(Object.keys(T[sel].smp||{}).map(function(k){return k+':'+T[sel].smp[k].name}))+' '+Object.keys(SB).length`);
ok('ファイル名から キック/スネア/ハット/クラップ に自動で割り当たる',m===JSON.stringify(['0:Splice_Kick_01','1:snare_tight','2:closed_hat','4:Clap-Big'])+' 4',m);
const bt2=await fr.evaluate(()=>[...document.querySelectorAll('#keys .sb.has')].length);ok('読み込んだ鍵盤が🎧になる',bt2===4,bt2);
// 再生がサンプルを使う
const used=await E(`(function(){var c=0,o=playSmp;playSmp=function(b,t){c++;return o(b,t)};init();ctx.resume();[0,1,2,3,4].forEach(function(p){drumHit(p,ctx.currentTime+.01,0,T[sel])});playSmp=o;return c})()`);
ok('サンプルを入れたパッドはサンプルが鳴り、入れていない(オープンハット)は元の音',used===4,used);
// 長い/壊れたファイル
await E(`smTarget=3`);await fr.locator('#smIn').setInputFiles(['/tmp/w/smp/long.wav']);await pg.waitForTimeout(800);
const t1=await fr.evaluate(()=>document.getElementById('toast').textContent);ok('8秒を超えるファイルは断られる',/長すぎる/.test(t1)&&!(await E(`!!T[sel].smp[3]`)),t1);
await E(`smTarget=3`);await fr.locator('#smIn').setInputFiles(['/tmp/w/smp/bad.wav']);await pg.waitForTimeout(800);
const t2=await fr.evaluate(()=>document.getElementById('toast').textContent);ok('壊れたファイルは断られ、エラーにならない',/読みこめなかった/.test(t2),t2);
// 1パッド入れかえ・✕で戻す
await E(`smTarget=0`);await fr.locator('#smIn').setInputFiles(['/tmp/w/smp/Clap-Big.wav']);await pg.waitForTimeout(800);
ok('1つだけ入れかえできる',(await E(`T[sel].smp[0].name`))==='Clap-Big');
await fr.evaluate(()=>document.querySelector('#keys .sx').click());await pg.waitForTimeout(300);
ok('✕でもとの音にもどる',(await E(`Object.keys(T[sel].smp).length`))===3);
// 保存→再読み込み後もサンプルが復元される
await E(`saveFree()`);await pg.waitForTimeout(300);
const kept=await E(`JSON.stringify(projs.find(function(p){return p.id===curId}).T[sel].smp?Object.keys(projs.find(function(p){return p.id===curId}).T[sel].smp):null)`);
ok('プロジェクトにサンプル情報が保存される',kept!=='null',kept);
await E(`SB={};SBLOAD={};smEnsure()`);await pg.waitForTimeout(1500);
ok('サンプルの音が保存先(IndexedDB)から復元される',(await E(`Object.keys(SB).length`))===3,await E(`Object.keys(SB).length`));
// 再生してもエラーなし
await E(`play&&0`).catch(()=>{});await fr.evaluate(()=>document.getElementById('play')&&document.getElementById('play').click());await pg.waitForTimeout(1200);
await fr.evaluate(()=>document.getElementById('play')&&document.getElementById('play').click());
await pg.screenshot({path:'/tmp/w/sm_ed.png'});
ok('ページエラー0件',errs.length===0,errs.slice(0,3).join('|'));
console.log(res.every(x=>x)?'結果：すべてOK':'結果：NG あり');await b.close()})();
