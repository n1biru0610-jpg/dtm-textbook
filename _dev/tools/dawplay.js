// DAW編「自由につくる」の再生テスト：置いた音が、再生で全部・正しい時間に鳴るか（4小節をくりかえすか）
// 使い方：作業フォルダで node dawplay.js   （リポジトリ直下で python3 -m http.server 8765）
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const res=[];const ok=(n,c,i)=>{res.push(c);console.log((c?'OK':'NG')+'  '+n+(i!==undefined&&i!==''?'  ('+i+')':''))};
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const pg=await b.newPage({viewport:{width:1366,height:768}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.route(/supabase\.co|fonts\.googleapis|accounts\.google/,r=>r.abort());
await pg.goto('http://localhost:8765/preview/index.html',{waitUntil:'load'});await pg.waitForTimeout(1200);
await pg.evaluate(()=>document.querySelector('#fgs').click());await pg.waitForTimeout(500);
await pg.evaluate(()=>{DAW_HTML=DAW_HTML.replace('function showStep(){','window.__g=function(c){return eval(c)};function showStep(){');openDaw()});await pg.waitForTimeout(1800);
const fr=await (await pg.$('#dawf')).contentFrame();const E=c=>fr.evaluate(c=>__g(c),c);
await fr.click('#dfree');await pg.waitForTimeout(800);
// 4小節：ドラム（4小節ぶん全部入り 56音）、ベース4音、コード（C→G→Am→F 12音）、メロディ（16分・付点など）
await E(`(function(){T=[];addTrack('ドラム','drum');T[0].clips.push(drumClip(4,true));
addTrack('ベース');T[1].clips.push({s:0,l:4,notes:[{s:0,p:36,l:16},{s:16,p:43,l:16},{s:32,p:45,l:16},{s:48,p:41,l:16}]});
addTrack('コード');T[2].clips.push({s:0,l:4,notes:mkN(chordNotes())});
addTrack('メロディ');T[3].clips.push({s:0,l:2,notes:[{s:0,p:64,l:1},{s:1,p:65,l:1},{s:3,p:67,l:3},{s:15,p:72,l:1},{s:31,p:71,l:1}]},{s:2,l:2,notes:[{s:0,p:60,l:2},{s:31,p:60,l:1}]});
setBpm(240,1);renderTracks();afterEdit();
window.__log=[];var t0=tone;tone=function(p,t,d,i){__log.push(['n',p,t]);return t0.apply(this,arguments)};
DK=DK.map(function(f,k){return function(t){__log.push(['d',k,t]);return f.apply(this,arguments)}})})()`);
const want=JSON.parse(await E("JSON.stringify({d:56,n:4+12+7,steps:total(),sd:sd()})"));
await E("cursor=0;setCursor&&setCursor(0)");await fr.click('#play');const t0=+await E('ctx.currentTime');
await pg.waitForTimeout(want.sd*want.steps*1000*2+600);await fr.click('#stop');
const log=JSON.parse(await E('JSON.stringify(__log)'));const st=Math.min(...log.map(x=>x[2]));const L1=want.sd*want.steps;
const pass1=log.filter(x=>x[2]<st+L1-1e-6),pass2=log.filter(x=>x[2]>=st+L1-1e-6&&x[2]<st+2*L1-1e-6);
ok('曲の長さ（くりかえしの単位）が4小節',want.steps===64,want.steps+'ステップ');
ok('1回めの再生で、ドラムが全部鳴る',pass1.filter(x=>x[0]==='d').length===want.d,pass1.filter(x=>x[0]==='d').length+'/'+want.d);
ok('1回めの再生で、ドラム以外の音が全部鳴る',pass1.filter(x=>x[0]==='n').length===want.n,pass1.filter(x=>x[0]==='n').length+'/'+want.n);
ok('4小節のあと、頭にもどってもう一度同じ数だけ鳴る（ループ）',pass2.length===pass1.length,pass2.length+'/'+pass1.length);
// タイミング：メロディの16分の音（1小節め s=1）が開始から 1×16分 の位置
const m=pass1.filter(x=>x[0]==='n'&&x[1]===65)[0];ok('16分の音が正しい時間に鳴る',m&&Math.abs((m[2]-st)-want.sd)<0.002,m?((m[2]-st)/want.sd).toFixed(3)+'×16分':'鳴らない');
const c2=pass1.filter(x=>x[0]==='n'&&x[1]===60&&Math.abs((x[2]-st)-32*want.sd)<0.002).length;ok('2つめのクリップ（3小節め）の音も鳴る',c2>=1,c2);
ok('ページエラー0件',!errs.length,errs.join(' | '));
console.log(res.every(x=>x)?'結果：すべてOK':'結果：NG あり');await b.close()})();
