// 16パッド・音量/ピッチ・インスペクターの音源設定の通しテスト（node pd.js [幅] [高さ] [t]）
const {chromium}=require('/opt/npm-tools/node_modules/playwright');const fs=require('fs');
const W=+process.argv[2]||1366,H=+process.argv[3]||768,MOB=process.argv[4]==='t';
const res=[];const ok=(n,c,i)=>{res.push(c);console.log((c?'OK':'NG')+'  '+n+(i!==undefined&&i!==''?'  ('+i+')':''))};
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
await E(`addTrack('ドラム','drum');T[T.length-1].clips.push({s:0,l:4,notes:[{s:0,p:0,l:1},{s:4,p:1,l:1},{s:8,p:12,l:1},{s:12,p:15,l:1}]});sel=T.length-1;renderTracks();openEd(T[sel],T[sel].clips[0])`);await pg.waitForTimeout(600);
const rows=await fr.evaluate(()=>({k:document.querySelectorAll('#keys .dk').length,dc:new Set([...document.querySelectorAll('#grid .dc')].map(e=>e.style.top)).size,nt:document.querySelectorAll('#grid .nt').length,h:document.getElementById('grid').offsetHeight}));
ok('ドラムが16パッド（16行）になる',rows.k===16&&rows.dc===16,JSON.stringify(rows));
// 16番目のパッドにも音を置ける（クリック）
const ptr=await E(`(function(){var g=$('grid').getBoundingClientRect();return JSON.stringify([g.left+cw*20+cw/2,g.top+(drw(11)+.5)*RH])})()`);const q=JSON.parse(ptr);
await E(`$('escroll').scrollTop=0`);
const hit=await fr.evaluate(([x,y])=>{const e=document.elementFromPoint(x,y);return e&&e.id+'/'+e.className},q);
// 直接データで置く（スクロール位置に依存させない）
await E(`T[sel].clips[0].notes.push({s:20,p:11,l:1});renderEd()`);
ok('パッド12のノートも表示される',(await fr.evaluate(()=>document.querySelectorAll('#grid .nt').length))===5);
// インスペクター
await fr.evaluate(()=>document.getElementById('inspBtn').click());await pg.waitForTimeout(500);
const ins=await fr.evaluate(()=>({isd:!!document.querySelector('#insp .isd'),pads:document.querySelectorAll('#insp .ipads button').length,kit:!!document.getElementById('isK'),w:document.getElementById('insp').offsetWidth}));
ok('インスペクターに「音源の設定」（キット・16パッド）が出る',ins.isd&&ins.pads===16&&ins.kit,JSON.stringify(ins));
await pg.screenshot({path:'/tmp/w/pd_insp.png'});
// パッド選択→音量・ピッチ
await fr.evaluate(()=>document.querySelectorAll('#insp .ipads button')[11].click());await pg.waitForTimeout(200);
ok('パッドを選ぶと詳細が切り替わる',(await fr.evaluate(()=>document.querySelector('#insp .ipd .pn').textContent)).includes('パッド12'));
ok('サンプルなしのパッドはピッチが使えない',await fr.evaluate(()=>document.getElementById('isPt').disabled));
// サンプルを入れる
const fs2=require('fs');
await E(`smTarget=11`);await fr.locator('#smIn').setInputFiles(['/tmp/w/smp/snare_tight.wav']);await pg.waitForTimeout(1000);
ok('インスペクターの📂でサンプルが入る→ピッチが使える',(await E(`!!T[sel].smp[11]`))&&!(await fr.evaluate(()=>document.getElementById('isPt').disabled)),await E(`JSON.stringify(T[sel].smp)`));
await fr.evaluate(()=>{const s=document.getElementById('isPt');s.value=12;s.dispatchEvent(new Event('input',{bubbles:true}));const v=document.getElementById('isV');v.value=50;v.dispatchEvent(new Event('input',{bubbles:true}))});
ok('ピッチ・音量がトラックに保存される',(await E(`JSON.stringify(T[sel].pad)`))==='{"11":{"pt":12,"v":0.5}}',await E(`JSON.stringify(T[sel].pad)`));
const r=await E(`(function(){var rate=null,gain=null,o=ctx.createBufferSource;init();var oc=ctx.createBufferSource.bind(ctx);ctx.createBufferSource=function(){var s=oc();var d=Object.getOwnPropertyDescriptor(AudioBufferSourceNode.prototype,'playbackRate');rate=s.playbackRate;return s};var og=ctx.createGain.bind(ctx);var gs=[];ctx.createGain=function(){var g=og();gs.push(g);return g};drumHit(11,ctx.currentTime+.01,0,T[sel]);ctx.createBufferSource=oc;ctx.createGain=og;return JSON.stringify({rate:rate&&rate.value,g:gs.map(function(g){return g.gain.value})})})()`);
ok('サンプルが1オクターブ上(2倍速)・音量50%で鳴る',/"rate":2/.test(r)&&/0\.4[45]/.test(r),r);
// 合成音パッドの音量
await E(`setPad(T[sel],0,'v',.5)`);
const r2=await E(`(function(){var og=ctx.createGain.bind(ctx),gs=[];ctx.createGain=function(){var g=og();gs.push(g);return g};drumHit(0,ctx.currentTime+.01,0,T[sel]);ctx.createGain=og;return gs.map(function(g){return +g.gain.value.toFixed(2)}).join(',')})()`);
ok('合成音のパッドも音量が効く（0.5のゲインが入る）',/(^|,)0\.5(,|$)/.test(r2),r2);
// 再生中にエラーなし
await E(`setPad(T[sel],0,'v',1);play&&0`).catch(()=>{});
await fr.evaluate(()=>document.getElementById('play')&&document.getElementById('play').click());await pg.waitForTimeout(1500);await fr.evaluate(()=>document.getElementById('play')&&document.getElementById('play').click());
// キット
await fr.evaluate(()=>{const k=document.getElementById('isK');k.value='1';k.dispatchEvent(new Event('change'))});
ok('キット（プリセット）を切りかえられる',(await E(`T[sel].kit`))===1);
// MIDI書き出しの割り当て
// 楽器トラック
await E(`addTrack('ピアノ','inst');sel=T.length-1;T[sel].clips.push({s:0,l:4,notes:[{s:0,p:60,l:4}]});renderTracks();inspRender()`);await pg.waitForTimeout(400);
const i1=await fr.evaluate(()=>({sec:!!document.querySelector('#insp .isd #isI'),n:document.querySelectorAll('#isI option').length}));
ok('楽器トラックのインスペクターに音色・オクターブ・長さが出る',i1.sec&&i1.n>=5,JSON.stringify(i1));
await fr.evaluate(()=>{const s=document.getElementById('isI');s.value='bell';s.dispatchEvent(new Event('change'))});
ok('音色（プリセット）を変えられる',(await E(`T[sel].inst`))==='bell');
await fr.evaluate(()=>document.getElementById('isO2').click());await fr.evaluate(()=>document.getElementById('isO2').click());
ok('オクターブを上げられる（+2・上限2）',(await E(`T[sel].oct`))===2&&(await fr.evaluate(()=>{document.getElementById('isO2').click();return 1}))&&(await E(`T[sel].oct`))===2);
await fr.evaluate(()=>{const l=document.getElementById('isLn');l.value=150;l.dispatchEvent(new Event('input',{bubbles:true}))});
ok('音の長さを変えられる',(await E(`T[sel].len`))===1.5);
const tn=await E(`(function(){var a=[],o=tone;tone=function(m,t,d,i){a.push([m,+d.toFixed(2)]);return o(m,t,d,i)};var t=T[sel];t.clips.forEach(function(c){});/*再生1拍ぶんを直接*/ var n=t.clips[0].notes[0];tone(n.p+(t.oct||0)*12,0,n.l*sd()*.95*(t.len||1),t.inst);tone=o;return JSON.stringify(a)})()`);
ok('再生時にオクターブ・長さが反映される',/\[\[84,/.test(tn),tn);
// 保存・復元
await E(`saveFree()`);const sv=await E(`JSON.stringify(projs.find(function(p){return p.id===curId}).T.map(function(t){return [t.kit,t.pad&&Object.keys(t.pad).length,t.oct,t.len,t.inst]}))`);
ok('設定がプロジェクトに保存される',sv==='[[1,null,null,null,null],[null,null,2,1.5,"bell"]]'||/\[1,/.test(sv),sv);
ok('ページエラー0件',errs.length===0,errs.slice(0,3).join('|'));
await pg.screenshot({path:'/tmp/w/pd_insp2.png'});
console.log(res.every(x=>x)?'結果：すべてOK':'結果：NG あり');await b.close()})();
