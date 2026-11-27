// デイリーチャレンジの通しテスト（Supabase は daily_entries だけ偽サーバーで代用）
// 使い方：node dcflow.js [幅] [高さ] [t=タッチ]   （リポジトリ直下で python3 -m http.server 8765）
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const W=+process.argv[2]||1366,H=+process.argv[3]||768,MOB=process.argv[4]==='t';
const res=[];const ok=(n,c,i)=>{res.push(c);console.log((c?'OK':'NG')+'  '+n+(i!==undefined&&i!==''?'  ('+i+')':''))};
(async()=>{
const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const ctx=await b.newContext(MOB?{viewport:{width:W,height:H},isMobile:true,hasTouch:true,userAgent:'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36'}:{viewport:{width:W,height:H}});
const pg=await ctx.newPage();const errs=[];pg.on('pageerror',e=>errs.push(e.message));pg.on('console',m=>{if(m.type()==='error'&&!/net::|Failed to load|ERR_|406|404/.test(m.text()))errs.push('console: '+m.text())});
const rows=[];let missing=process.env.MISSING==='1';
await pg.route(/supabase\.co/,async r=>{const u=r.request().url(),m=r.request().method();
  if(/daily_entries/.test(u)){
    if(missing)return r.fulfill({status:404,contentType:'application/json',body:JSON.stringify({code:'PGRST205',message:'Could not find the table'})});
    if(m==='POST'){const row=JSON.parse(r.request().postData());row.id='id'+(rows.length+1);row.created_at=new Date().toISOString();rows.push(row);return r.fulfill({status:201,body:''})}
    const q=new URL(u).searchParams;const idq=q.get('id');
    if(idq){const id=idq.replace('eq.','');const e=rows.find(x=>x.id===id);return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(e?[e]:[])})}
    const dq=(q.get('day')||'').replace('eq.','');return r.fulfill({status:200,contentType:'application/json',body:JSON.stringify(rows.filter(x=>x.day===dq).map(x=>({id:x.id,created_at:x.created_at,nick:x.nick,ok:x.ok,total:x.total,bpm:x.bpm})))})}
  r.abort()});
await pg.route(/fonts\.googleapis|accounts\.google/,r=>r.abort());
await pg.goto('http://localhost:8765/index.html',{waitUntil:'load'});await pg.waitForTimeout(1500);
await pg.evaluate(()=>{const e=document.querySelector('#fgs');if(e)e.click()});await pg.waitForTimeout(600);
await pg.evaluate(()=>{DAW_HTML=DAW_HTML.replace('function showStep(){','window.__g=function(c){return eval(c)};function showStep(){')});
await pg.evaluate(()=>document.body.classList.add('x'));await pg.addStyleTag({content:'body.dchl #dcCta,body.dchl #modeTabs #mtC{animation:none!important}'});
// ホームにいるか
await pg.evaluate(()=>openHome(false));await pg.waitForTimeout(600);
const vis=async s=>pg.evaluate(s=>{const e=document.querySelector(s);if(!e)return false;const r=e.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(e).display!=='none'},s);
ok('ホームに「今日のお題」ボタンが見える',await vis('#dcCta'));
await pg.screenshot({path:'dc_home.png'});
ok('モードの並びに「今日のお題」がある',await pg.evaluate(()=>{const t=[...document.querySelectorAll('#modeTabs button')].filter(b=>getComputedStyle(b).display!=='none').map(b=>b.textContent.trim());window.__tabs=t;return t.some(x=>x.includes('今日のお題'))&&t.indexOf('🎛 DAW編')<t.findIndex(x=>x.includes('今日のお題'))}),await pg.evaluate(()=>window.__tabs.join(' | ')));
await pg.screenshot({path:'dc_home_tabs.png'});
const th=await pg.evaluate(()=>dcTheme(dcJst()));
// 日付ごとのお題が決まっている（同じ日は同じ）
const t2=await pg.evaluate(()=>[dcTheme('2026-11-27').title,dcTheme('2026-11-27').title,dcTheme('2026-11-28').title]);
ok('同じ日は同じお題・次の日は別のお題',t2[0]===t2[1]&&t2[0]!==t2[2],t2.join(' / '));
// DAWで作る
await pg.click('#mtC');await pg.waitForTimeout(2800);
const fh=await pg.$('#dawc');const fr=await fh.contentFrame();
const E=c=>fr.evaluate(c=>__g(c),c);
ok('タブを押すとDAWが直接開き、お題カードが配られる',await fr.evaluate(()=>document.getElementById('chm').classList.contains('on')));
ok('お題ボタンが「お題 0/N」',(await fr.evaluate(()=>document.getElementById('chBtn').textContent)).includes('お題 0/'+th.conds.length),await fr.evaluate(()=>document.getElementById('chBtn').textContent));
const ctxt=await fr.evaluate(()=>document.getElementById('chm').innerText);
ok('カードにお題名と条件がぜんぶ出る',ctxt.includes(th.title)&&th.conds.every(c=>ctxt.includes(c.label)),th.conds.length+'枚');
await pg.waitForTimeout(1200);await pg.screenshot({path:'dc_daw_panel.png'});
// パネルを閉じる(Esc)
await fr.evaluate(()=>document.getElementById('chm').dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true})));
ok('Escでお題パネルが閉じる',!(await fr.evaluate(()=>document.getElementById('chm').classList.contains('on'))));
const lane=await fr.evaluate(()=>{const b=document.getElementById('chBar'),m=document.getElementById('midiBtn'),p=document.getElementById('mapBtn');const rb=b.getBoundingClientRect(),rp=p.getBoundingClientRect();const chips=[...b.children].map(x=>x.getBoundingClientRect());const inside=chips.every(r=>r.width>0&&r.right<=rp.left+1&&r.left>=0);const wide=innerWidth>=1000;const rows=new Set(chips.map(r=>Math.round(r.top))).size;const txt=[...b.children].every(x=>x.querySelector('.tx')&&x.querySelector('.ci svg'));const rpb=window.parent.document.getElementById('rpBtn').getBoundingClientRect();return {vis:!b.hidden&&rb.width>0,n:b.children.length,midiHidden:getComputedStyle(m).display==='none',mapOk:rp.right<=innerWidth+1&&rp.width>0,inside,wide,rows,icons:txt,rpLeftBottom:rpb.left<140&&rpb.top>innerHeight*0.8}});
ok('お題の条件が、アイコン付きで全部一覧できる（MIDI書き出しは非表示・マップは残る・ほうこくは左下）',lane.vis&&lane.n===th.conds.length&&lane.midiHidden&&lane.mapOk&&lane.icons&&lane.rpLeftBottom&&(!lane.wide||lane.inside),JSON.stringify(lane));
await pg.screenshot({path:'dc_lane.png'});
// 判定ユニット：条件ごとに作った曲で true/false
const unit=await E(`(function(){
 function mk(tr,b){T=tr;if(b)bpm=b}
 var R={};var saveT=T,saveB=bpm;
 var D=function(notes){return {name:'ドラム',kind:'drum',clips:[{s:0,l:4,notes:notes}]}};
 var I=function(notes,inst){var t={name:'x',kind:'inst',clips:[{s:0,l:4,notes:notes}]};if(inst)t.inst=inst;return t};
 var full=[];for(var b=0;b<4;b++){full.push({s:b*16,p:0,l:1})}
 mk([D(full)],120);
 R.bars4=chJudge([{t:'bars4'}])[0];R.kick4=chJudge([{t:'kick',n:4}])[0];R.kick5=chJudge([{t:'kick',n:5}])[0];
 R.bpmIn=chJudge([{t:'bpm',a:100,b:130}])[0];R.bpmOut=chJudge([{t:'bpm',a:130,b:170}])[0];
 mk([D(full.concat([{s:64,p:0,l:1}]))],120);R.out5=chJudge([{t:'bars4'}])[0];
 mk([D([{s:0,p:0,l:1},{s:4,p:1,l:1},{s:8,p:2,l:1},{s:48,p:0,l:1}])]);R.drumAll=chJudge([{t:'drumAll'}])[0];
 var m=[{s:0,p:60,l:4},{s:16,p:62,l:4},{s:32,p:64,l:4},{s:48,p:60,l:4}];
 mk([D(full),I(m)]);R.mel=chJudge([{t:'mel',n:4}])[0];R.mel5=chJudge([{t:'mel',n:5}])[0];
 R.scale=chJudge([{t:'scale',set:[0,2,4,5,7,9,11]}])[0];R.scaleNo=chJudge([{t:'scale',set:[0,4,7]}])[0];
 R.melMax3=chJudge([{t:'melMax',n:3}])[0];R.melMax2=chJudge([{t:'melMax',n:2}])[0];R.melMin3=chJudge([{t:'melMin',n:3}])[0];
 R.endsC=chJudge([{t:'ends',pc:0}])[0];R.endsA=chJudge([{t:'ends',pc:9}])[0];
 R.maxNotes4=chJudge([{t:'maxNotes',n:4}])[0];R.maxNotes3=chJudge([{t:'maxNotes',n:3}])[0];
 R.tracks2=chJudge([{t:'tracks',n:2}])[0];R.tracks3=chJudge([{t:'tracks',n:3}])[0];
 R.instPiano=chJudge([{t:'inst',k:'piano'}])[0];R.instBell=chJudge([{t:'inst',k:'bell'}])[0];
 mk([D(full),I(m,'bass'),I([{s:0,p:60,l:4},{s:0,p:64,l:4},{s:0,p:67,l:4},{s:32,p:60,l:4},{s:32,p:64,l:4},{s:32,p:67,l:4}],'bell')]);
 R.bass=chJudge([{t:'bass',n:4}])[0];R.bass5=chJudge([{t:'bass',n:5}])[0];R.chord2=chJudge([{t:'chord',n:2}])[0];R.chord3=chJudge([{t:'chord',n:3}])[0];R.bell=chJudge([{t:'inst',k:'bell'}])[0];
 T=saveT;bpm=saveB;return R})()`);
const exp={bars4:true,kick4:true,kick5:false,bpmIn:true,bpmOut:false,out5:false,drumAll:true,mel:true,mel5:false,scale:true,scaleNo:false,melMax3:true,melMax2:false,melMin3:true,endsC:true,endsA:false,maxNotes4:true,maxNotes3:false,tracks2:true,tracks3:false,instPiano:true,instBell:false,bass:true,bass5:false,chord2:true,chord3:false,bell:true};
const bad=Object.keys(exp).filter(k=>unit[k]!==exp[k]);
ok('条件の判定（'+Object.keys(exp).length+'パターン）',bad.length===0,bad.length?'NG: '+bad.map(k=>k+'='+unit[k]).join(','):'');
// 曲を実際に入れて提出：ドラムとメロディ
await E(`(function(){T[0].clips[0].notes=[{s:0,p:0,l:1},{s:16,p:0,l:1},{s:32,p:1,l:1},{s:48,p:2,l:1}];addTrack('ピアノ','inst');T[1].clips.push({s:0,l:4,notes:[{s:0,p:60,l:4},{s:16,p:62,l:4},{s:32,p:64,l:4},{s:48,p:60,l:4}]});renderTracks();chUI()})()`);
await fr.waitForTimeout?.(0);await pg.waitForTimeout(1300);
const btn=await fr.evaluate(()=>document.getElementById('chBtn').textContent);
const lane2=await fr.evaluate(()=>[...document.getElementById('chBar').children].filter(x=>x.classList.contains('ok')).length);ok('列の条件にもチェックが付く',lane2>=1,lane2+'個');
{const bars=await E('BARS');const rl=await fr.evaluate(()=>document.querySelectorAll('#ruler > span').length);const sw=await fr.evaluate(()=>{const l=document.getElementById('lanes');return l.scrollWidth<=l.clientWidth+2});const cp=await E('canPlaceAt(T[0],4,1)');
ok('お題モードは4小節だけ表示（5小節目には置けない・横スクロールなし）',bars===4&&rl===4&&sw&&cp===false,'BARS='+bars+' ルーラー'+rl+' 横スクロールなし='+sw+' 5小節目に置ける='+cp);
await E(`window.__cs=CH.conds.slice();CH.conds.push({t:'scale',set:[0,2,4,5,7,9,11],label:'テスト'});chUI();openEd(T[1],T[1].clips[0])`);await pg.waitForTimeout(500);
const hl=await fr.evaluate(()=>({sc:document.querySelectorAll('.pk.sc').length,out:document.querySelectorAll('.pk.out').length,dl:document.querySelectorAll('.dl.sc,.dl.hm').length,dlo:document.querySelectorAll('.dl.out').length}));
ok('お題のスケールが打ち込み画面でハイライトされる（スケール内の鍵盤・行／外は暗く）',hl.sc>0&&hl.out>0&&hl.dl>0&&hl.dlo>0,JSON.stringify(hl));
await pg.screenshot({path:'dc_scale.png'});
await E(`CH.conds=CH.conds.filter(function(c){return c.t!=='scale'});chUI()`);await pg.waitForTimeout(300);
const hl2=await fr.evaluate(()=>document.querySelectorAll('.pk.out,.pk.sc').length);
ok('スケールの条件がないお題では、ハイライトされない',hl2===0,hl2+'個');await E(`CH.conds=window.__cs;chUI()`);
await E('closeEd()');}
ok('お題ボタンの達成数が更新される',/お題 \d+\/\d+/.test(btn)&&!/お題 0\//.test(btn),btn);
await fr.evaluate(()=>document.getElementById('chBtn').click());await pg.waitForTimeout(300);
const ic=await fr.evaluate(()=>{const e=document.getElementById('chIc');const r=e.getBoundingClientRect();return {svg:!!e.querySelector('svg'),w:Math.round(r.width)}});ok('お題カードにイラスト（アイコン）が付く',ic.svg&&ic.w>40,JSON.stringify(ic));
const li=await fr.evaluate(()=>[...document.querySelectorAll('#chL li')].map(l=>l.className+':'+l.textContent));
ok('条件リストに「できた」が出る',li.some(x=>/(^|\s)ok[ :]/.test(x)),li.length+'件');
const vs=async()=>fr.evaluate(()=>({x:!document.getElementById('chX').hidden,c:!document.getElementById('chCont').hidden,k:!document.getElementById('chKeep').hidden,s:!document.getElementById('chSub').hidden,g:document.getElementById('chG').textContent}));
const v0=await vs();ok('全部クリア前は「提出」「続き」「保存」が出ない',v0.x&&!v0.c&&!v0.k&&!v0.s,JSON.stringify(v0));
await fr.evaluate(()=>document.getElementById('chSub').click());await pg.waitForTimeout(500);
ok('クリア前は(無理に押しても)提出されない',rows.length===0,rows.length+'件');
await pg.screenshot({path:'dc_daw_panel2.png'});
await fr.evaluate(()=>document.getElementById('chX').click());
// 全クリアにする
await E(`(function(){bpm=80;$('bv').textContent=bpm;T[1].clips[0].notes=[{s:0,p:60,l:4},{s:4,p:64,l:4},{s:8,p:67,l:4},{s:12,p:62,l:4},{s:16,p:64,l:4},{s:32,p:67,l:4},{s:48,p:69,l:8}];T[1].clips[0].notes.push({s:0,p:48,l:8},{s:0,p:52,l:8},{s:0,p:55,l:8});renderTracks();chUI()})()`);
await pg.waitForTimeout(1500);
const st1=await E(`chJudge(CH.conds).map(Boolean).join(',')+' '+CH.conds.map(function(c){return c.t}).join(',')`);
const v1=await vs();const open1=await fr.evaluate(()=>document.getElementById('chm').classList.contains('on'));
ok('全部クリアで、カードが自動で開き3つの選択肢が出る',open1&&!v1.x&&v1.c&&v1.k&&v1.s&&/全クリア/.test(v1.g),st1+' '+JSON.stringify(v1)+' open='+open1);
ok('全クリアでお題ボタンが「全クリア」になる',/全クリア/.test(await fr.evaluate(()=>document.getElementById('chBtn').textContent)));
await pg.screenshot({path:'dc_allclear.png'});
// 保存して提出しない
await fr.evaluate(()=>document.getElementById('chKeep').click());await pg.waitForTimeout(500);
ok('「保存して提出しない」→閉じて、サーバーには送られない',rows.length===0&&!(await fr.evaluate(()=>document.getElementById('chm').classList.contains('on'))),rows.length+'件');
const prj=await pg.evaluate(()=>0);const saved=await E(`projs.filter(function(p){return p.dc}).length`);ok('お題の作品が保存されている',saved===1,saved+'件');
// 続きをつくる
await fr.evaluate(()=>document.getElementById('chBtn').click());await pg.waitForTimeout(300);
const nBefore=await E(`T.reduce(function(a,t){return a+t.clips.reduce(function(b,c){return b+c.notes.length},0)},0)`);
await fr.evaluate(()=>document.getElementById('chCont').click());await pg.waitForTimeout(700);
await pg.waitForTimeout(800);
const fh2=await pg.$('#dawf');const fr2=await fh2.contentFrame();const E2=c=>fr2.evaluate(c=>__g(c),c);
const cs=await E2(`({bars:BARS,act:chActive(),n:projs.length,dc:projs.filter(function(p){return p.dc}).length,name:pjGet(curId).name,notes:T.reduce(function(a,t){return a+t.clips.reduce(function(b,c){return b+c.notes.length},0)},0),barHidden:document.getElementById('chBar').hidden,guide:!!guide})`);
const vis2=await pg.evaluate(()=>({f:getComputedStyle(document.getElementById('dawf')).display,c:getComputedStyle(document.getElementById('dawc')).display}));
ok('「制限のないDAWで続きを作る」→自由DAW（別画面）に40小節の新プロジェクトとして曲が引き継がれる',cs.bars===40&&!cs.act&&cs.dc===0&&cs.notes===nBefore&&cs.barHidden&&!cs.guide&&/続き/.test(cs.name)&&vis2.f==='block'&&vis2.c==='none',JSON.stringify(Object.assign(cs,vis2)));
const cp5=await E2('canPlaceAt(T[0],10,1)');ok('続きでは5小節目以降にも置ける',cp5===true,String(cp5));
const frs=await E(`projs.filter(function(p){return p.dc}).length`);
ok('お題のDAWには、お題の作品がそのまま残っている',frs===1,String(frs));
// お題にもどる
await pg.evaluate(()=>document.getElementById('mtC').click());await pg.waitForTimeout(1800);
ok('「今日のお題」タブでお題のDAWにもどれる（自由DAWは隠れる）',await pg.evaluate(()=>getComputedStyle(document.getElementById('dawc')).display==='block'&&getComputedStyle(document.getElementById('dawf')).display==='none'&&document.getElementById('mtC').getAttribute('aria-pressed')==='true'));

await fr.evaluate(()=>{const b=document.getElementById('chBtn');b.click()});await pg.waitForTimeout(400);
const v2=await vs();ok('お題の作品を開き直すと、再び3つの選択肢が出る',v2.c&&v2.k&&v2.s,JSON.stringify(v2));
await fr.evaluate(()=>document.getElementById('chSub').click());await pg.waitForTimeout(900);
ok('提出が1件サーバーに届いた',rows.length===1,rows[0]&&(rows[0].nick+' '+rows[0].ok+'/'+rows[0].total+' bpm'+rows[0].bpm));
ok('提出は全部クリア（ok===total）',rows[0]&&rows[0].ok===rows[0].total,rows[0]&&(rows[0].ok+'/'+rows[0].total));
ok('提出データに曲（トラック）が入る',rows[0]&&rows[0].proj&&rows[0].proj.T&&rows[0].proj.T.length===2);
const st=await fr.evaluate(()=>document.getElementById('chS').textContent);
ok('提出後にメッセージが出て、ボタンが「提出ずみ」か全クリアのまま',/出せたよ/.test(st),st);
const rec=await pg.evaluate(()=>dcRec());ok('この端末に記録が残る',!!rec[th.day]);
await fr.evaluate(()=>document.getElementById('chX').click());
// 再度提出（出しなおし）しても一覧は1人1件
await pg.evaluate(()=>{});
// ホームへ→みんなの作品
await pg.evaluate(()=>openHome(false));await pg.waitForTimeout(500);
await pg.click('#dcCta');await pg.waitForTimeout(2800);
const stl=await fr.evaluate(()=>document.getElementById('chS').textContent);ok('ホームのボタンからも直接開き、「提出ずみ」が出る',/提出ずみ/.test(stl),stl);
await fr.evaluate(()=>document.getElementById('chAll').click());await pg.waitForTimeout(1000);
const g=await pg.evaluate(()=>[...document.querySelectorAll('#dcL li')].map(l=>l.innerText.replace(/\s+/g,' ')));
ok('みんなの作品に自分の作品が出る',g.length===1,g.join('|'));
await pg.screenshot({path:'dc_gallery.png'});
// ♪きく
const pb=await pg.evaluate(()=>window.__projsBefore=JSON.stringify(P().dprojs||[]));
await pg.click('#dcL li button');await pg.waitForTimeout(2500);
ok('♪きくでDAWが聴くモードになる',await fr.evaluate(()=>document.getElementById('chBtn').dataset.m==='l'&&!document.getElementById('chBtn').hidden),await fr.evaluate(()=>document.getElementById('chBtn').textContent));
const nt=await E(`T.length+':'+T.map(function(t){return t.clips.reduce(function(a,c){return a+c.notes.length},0)}).join(',')`);
ok('作品の曲がDAWに読みこまれる',/^2:\d+,\d+$/.test(nt)&&nt.split(':')[1].split(',').every(x=>+x>0),nt);
await pg.waitForTimeout(2200);
const after=await pg.evaluate(()=>JSON.stringify(P().dprojs||[]));
ok('聴くだけのときは、自分のプロジェクトに保存されない',after===pb,after.length+' vs '+pb.length);
await pg.screenshot({path:'dc_listen.png'});
// 準備中（テーブルなし）
missing=true;await pg.evaluate(()=>dcClose());await pg.evaluate(()=>dcShowGallery());await pg.waitForTimeout(900);
const ms=await pg.evaluate(()=>document.querySelector('#dcMs').textContent);ok('テーブルが無いときは「準備中」と出る',/準備中/.test(ms),ms);
ok('ページエラー0件',errs.length===0,errs.slice(0,3).join(' | '));
console.log(res.every(x=>x)?'結果：すべてOK':'結果：NG あり');
await b.close()})();
