/* ===== 先生に曲を聴いてもらう ===== */
var TSN=0,TSLAST=0,TSTOAST=false,TSSTAMPS=['👍','🎵','🌟','💪','🎉'];
function tsHead(t){return '<div class="dh"><span>'+t+'</span><button class="dx" id="dcX">✕ とじる</button></div>'}
function tsDt(s){try{return new Date(s).toLocaleString('ja-JP',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}catch(e){return ''}}
function tsErr(e){return e&&e.s?(e.s===404||/42P01|PGRST205|relation/.test(String(e.t))?'先生の受け取り口が、まだ準備できていないよ（エラー '+e.s+'）。先生に伝えてね。':(e.s===401||e.s===403?'ログインの有効期限が切れたかも。いちどログインしなおしてね（エラー '+e.s+'）。':'うまく通信できなかったよ（エラー '+e.s+'）。')):(navigator.onLine===false?'インターネットにつながっていないみたい。つながったら、もう一度ためしてね。':'うまく通信できなかったよ。もう一度ためしてね。')}
function tsForm(d){dcBack=$('dawf');var c=$('dcc');$('dc').classList.add('on');
 if(!ACC){c.innerHTML=tsHead('🎧 先生に聴いてもらう')+'<h2 id="dcH" tabindex="-1">先生に聴いてもらう</h2><p class="ds">先生に曲を送るには、アカウントでログインしてね。（先生が、返事を ニックネームあてに かえせるよ）</p><div class="db"><button class="go" id="tsLg">ログイン／登録する</button><button id="dcBk">とじる</button></div>';
  $('dcX').onclick=dcClose;$('dcBk').onclick=dcClose;$('tsLg').onclick=function(){dcClose();openProf()};setTimeout(function(){try{$('dcH').focus()}catch(e){}},30);return}
 c.innerHTML=tsHead('🎧 先生に聴いてもらう')+'<h2 id="dcH" tabindex="-1">先生に聴いてもらう</h2><div class="tsf"><label for="tsTi">曲の名前</label><input id="tsTi" maxlength="40" autocomplete="off"><label for="tsMg">先生にひとこと（書かなくてもOK）</label><textarea id="tsMg" maxlength="200" rows="3" placeholder="れい：サビのところをがんばったよ！"></textarea></div><p class="ds" id="tsMs" role="status" aria-live="polite"></p><div class="db"><button class="go" id="tsGo">🎧 おくる</button><button id="dcBk">やめる</button></div>';
 $('tsTi').value=(d.name||'').slice(0,40)||'わたしの曲';$('dcX').onclick=dcClose;$('dcBk').onclick=dcClose;
 $('tsGo').onclick=function(){var ms=$('tsMs'),b=$('tsGo'),pj=d.proj;if(JSON.stringify(pj).length>280000){ms.textContent='曲が大きすぎて送れないよ。トラックやクリップを少しへらしてね。';return}
  b.disabled=true;b.textContent='おくっています…';ms.textContent='';
  var row={nick:String(dcNick()).slice(0,40),title:($('tsTi').value.trim()||'わたしの曲').slice(0,40),msg:$('tsMg').value.trim().slice(0,200),bpm:Math.round(+d.bpm||0),proj:pj};
  tokOK().then(function(t){return sbf('/rest/v1/teacher_songs',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(row)},t)}).then(function(r){if(!r.ok)return r.text().then(function(x){throw {s:r.status,t:x}});
   try{anHit('先生に送信')}catch(e){}
   c.innerHTML=tsHead('🎧 先生に聴いてもらう')+'<h2 id="dcH" tabindex="-1">おくったよ！</h2><p class="ds">先生が聴いたら、返事が とどくよ。<br>ホームの「🎒 もちもの」→「🎧 先生」でみられるよ。</p><div class="db"><button class="go" id="tsOk">とじる</button><button id="tsSee">おくった曲を見る</button></div>';
   $('dcX').onclick=dcClose;$('tsOk').onclick=dcClose;$('tsSee').onclick=function(){dcClose();dcBack=$('home');bdShow('ts')};setTimeout(function(){try{$('tsOk').focus()}catch(e){}},30)
  }).catch(function(e){b.disabled=false;b.textContent='🎧 おくる';ms.textContent=tsErr(e)+'　書いた内容はそのまま残っているよ。'})};
 setTimeout(function(){try{$('tsTi').focus();$('tsTi').select()}catch(e){}},30)}
function tsTabs(t){var n=[['ti','🏅 しょうごう'],['sk','🎨 きせかえ'],['ic','🎭 アイコン'],['ts','🎧 先生']];return '<div class="bdtb" role="tablist">'+n.map(function(x,i){return '<button type="button" role="tab" id="bdT'+(i+1)+'" aria-selected="'+(t===x[0])+'">'+x[1]+'</button>'}).join('')+'</div>'}
function tsSeenKey(){return 'dtm-tsr:'+(ACC&&ACC.uid||'')}
function tsSeen(){try{return JSON.parse(localStorage.getItem(tsSeenKey())||'[]')}catch(e){return []}}
function tsListen(id,nick){tokOK().then(function(t){return sbf('/rest/v1/teacher_songs?id=eq.'+encodeURIComponent(id)+'&select=proj,bpm,nick',{},t)}).then(function(r){if(!r.ok)throw {s:r.status};return r.json()}).then(function(a){var e=a&&a[0];if(!e||!e.proj||!e.proj.T)throw {s:0};dcOpenDaw({dawListen:{T:e.proj.T,bpm:e.bpm||e.proj.bpm||120,nick:nick||e.nick||'ななし'}})}).catch(function(){try{accToast('曲をひらけなかったよ')}catch(e){}})}
function tsMine(){var c=$('dcc');dcBack=$('home');$('dc').classList.add('on');
 c.innerHTML=tsHead('🎒 もちもの')+'<h2 id="dcH" tabindex="-1">もちもの</h2>'+tsTabs('ts')+'<p class="ds" id="tsMs" role="status" aria-live="polite">よみこみ中…</p><div class="bdsc"><ul class="tsl" id="tsL"></ul></div><div class="db"><button id="dcBk">← とじる</button></div>';
 $('dcX').onclick=dcClose;$('dcBk').onclick=dcClose;[['bdT1','ti'],['bdT2','sk'],['bdT3','ic'],['bdT4','ts']].forEach(function(x){$(x[0]).onclick=function(){bdShow(x[1])}});
 setTimeout(function(){try{$('dcH').focus()}catch(e){}},30);
 if(!bdAcc()){$('tsMs').textContent='ログインすると、先生に送った曲と返事が見られるよ。';return}
 tokOK().then(function(t){return sbf('/rest/v1/teacher_songs?select=id,created_at,title,bpm,msg,reply,stamp,replied_at&order=created_at.desc&limit=30',{},t)}).then(function(r){if(!r.ok)return r.text().then(function(x){throw {s:r.status,t:x}});return r.json()}).then(function(a){
  var L=$('tsL');if(!L)return;a=a||[];$('tsMs').textContent=a.length?'先生に送った曲（新しい順）':'まだ送った曲はないよ。DAWの「🎧 先生に聴いてもらう」から送れるよ。';
  a.forEach(function(r){var li=document.createElement('li');li.innerHTML='<div class="h"><b></b><small></small></div><p class="m"></p><div class="rv"></div><div class="ac"><button type="button" data-a="pl">♪ きく</button><button type="button" data-a="rm">とりけし</button></div>';
   li.querySelector('b').textContent=r.title||'無題';li.querySelector('small').textContent=tsDt(r.created_at)+(r.bpm?'　BPM '+r.bpm:'');li.querySelector('.m').textContent=r.msg?'わたし：'+r.msg:'';
   var rv=li.querySelector('.rv');if(r.replied_at||r.reply||r.stamp){rv.className='rv on';var s=document.createElement('span');s.textContent=(r.stamp||'👩‍🏫')+' ';var t2=document.createElement('span');t2.textContent=r.reply?'先生より：'+r.reply:'先生が聴いてくれたよ！';rv.appendChild(s);rv.appendChild(t2)}else{rv.textContent='🕒 先生が聴くのを まっているよ'}
   li.querySelector('[data-a=pl]').onclick=function(){dcClose();tsListen(r.id,'わたし')};
   li.querySelector('[data-a=rm]').onclick=function(){var b=this;if(b.dataset.c!=='1'){b.dataset.c='1';b.textContent='ほんとうにとりけす？';return}b.disabled=true;tokOK().then(function(t){return sbf('/rest/v1/teacher_songs?id=eq.'+encodeURIComponent(r.id),{method:'DELETE',headers:{Prefer:'return=minimal'}},t)}).then(function(x){if(!x.ok)throw 0;li.remove()}).catch(function(){b.disabled=false;b.textContent='とりけせなかった'})};
   L.appendChild(li)});
  var ids=a.filter(function(r){return r.replied_at||r.reply||r.stamp}).map(function(r){return r.id});try{localStorage.setItem(tsSeenKey(),JSON.stringify(ids.slice(0,100)))}catch(e){}TSN=0;try{bdBtnUpd()}catch(e){}
 }).catch(function(e){if($('tsMs'))$('tsMs').textContent=tsErr(e)})}
function tsPoll(){var p=bdAcc();if(!p||!bdSync||!ACC||Date.now()-TSLAST<300000)return;TSLAST=Date.now();
 tokOK().then(function(t){return sbf('/rest/v1/teacher_songs?select=id&replied_at=not.is.null&limit=100',{},t)}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(a){var seen=tsSeen(),n=(a||[]).filter(function(x){return seen.indexOf(x.id)<0}).length;TSN=n;try{bdBtnUpd()}catch(e){}if(n&&!TSTOAST){TSTOAST=true;try{accToast('💌 先生から、曲の返事がとどいているよ！（もちもの→先生）')}catch(e){}}}).catch(function(){})}
setInterval(function(){try{tsPoll()}catch(e){}},15000);
var _tsBu=bdBtnUpd;bdBtnUpd=function(){_tsBu();if(TSN>0){var b=$('bdBtn');if(b)b.textContent+=' 💌'}};
var _tsBs=bdShow;bdShow=function(tab){if(tab==='ts')return tsMine();_tsBs(tab);var b=$('bdT4');if(b)b.onclick=function(){bdShow('ts')}};
$('bdBtn').onclick=function(){bdShow()};
/* ---- スタッフ：届いた曲 ---- */
var TSS={rows:null,flt:'new',loading:false,err:''};
function tssLoad(){if(!ACC){TSS.err='スタッフのアカウントでログインしてね。';TSS.rows=[];tssDraw();return}TSS.loading=true;$('stfBd').textContent='読みこみ中…';
 tokOK().then(function(t){return sbf('/rest/v1/teacher_songs?select=id,created_at,user_id,nick,title,msg,bpm,reply,stamp,replied_at&order=created_at.desc&limit=200',{},t)}).then(function(r){if(!r.ok)return r.text().then(function(x){throw {s:r.status,t:x}});return r.json()}).then(function(a){TSS.loading=false;TSS.err='';TSS.rows=a||[];tssDraw()}).catch(function(e){TSS.loading=false;TSS.rows=[];TSS.err='読みこめませんでした。'+tsErr(e);tssDraw()})}
function tssDraw(){if(STF.tab!=='ts')return;var bd=$('stfBd'),rows=TSS.rows||[],nw=rows.filter(function(r){return !r.replied_at}).length;
 var h='<div class="rf" style="display:flex;gap:6px;flex-wrap:wrap;align-items:center">';[['new','未返事 ('+nw+')'],['done','返事ずみ ('+(rows.length-nw)+')'],['all','すべて ('+rows.length+')']].forEach(function(f){h+='<button data-f="'+f[0]+'" class="'+(TSS.flt===f[0]?'on':'')+'">'+f[1]+'</button>'});h+='<button data-f="re">🔄 再読みこみ</button></div>';
 if(TSS.err)h+='<p class="nt">'+stfEsc(TSS.err)+'</p>';var vis=rows.filter(function(r){return TSS.flt==='all'||(TSS.flt==='done'?!!r.replied_at:!r.replied_at)});
 if(!vis.length&&!TSS.err)h+='<p class="nt">この条件の曲はありません。</p>';bd.innerHTML=h;
 Array.prototype.forEach.call(bd.querySelectorAll('.rf button'),function(b){b.onclick=function(){if(b.dataset.f==='re'){tssLoad();return}TSS.flt=b.dataset.f;tssDraw()}});
 vis.forEach(function(r){var d=document.createElement('div');d.className='rp';var dn=!!r.replied_at;
  d.innerHTML='<div class="h"><span class="st'+(dn?' dn':'')+'">'+(dn?'返事ずみ':'未返事')+'</span><b></b><span></span><span></span></div><div class="tx"></div><div class="ac2"><button data-a="pl">♪ きく</button></div><div class="ac2 sts"></div><textarea placeholder="生徒への ひとことコメント"></textarea><div class="ac2"><button data-a="rp">返事をおくる</button><span></span></div>';
  var hs=d.querySelector('.h');hs.children[1].textContent=r.title||'無題';hs.children[2].textContent=tsDt(r.created_at)+(r.bpm?'　BPM '+r.bpm:'');hs.children[3].textContent='👤 '+(r.nick||'');d.querySelector('.tx').textContent=r.msg?'「'+r.msg+'」':'（ひとことなし）';
  var ta=d.querySelector('textarea');ta.value=r.reply||'';var stp=r.stamp||'',sb=d.querySelector('.sts');
  TSSTAMPS.forEach(function(s){var b=document.createElement('button');b.type='button';b.textContent=s;b.setAttribute('aria-pressed',stp===s);b.onclick=function(){stp=stp===s?'':s;Array.prototype.forEach.call(sb.children,function(x){x.setAttribute('aria-pressed',x.textContent===stp)})};sb.appendChild(b)});
  d.querySelector('[data-a=pl]').onclick=function(){$('stfX').onclick();tsListen(r.id,r.nick)};
  var sm=d.querySelector('.ac2:last-child span');d.querySelector('[data-a=rp]').onclick=function(){var b=this;if(!ta.value.trim()&&!stp){sm.textContent='コメントかスタンプを入れてね';return}b.disabled=true;sm.textContent='おくっています…';var patch={reply:ta.value.trim().slice(0,300),stamp:stp,replied_at:new Date().toISOString()};
   tokOK().then(function(t){return sbf('/rest/v1/teacher_songs?id=eq.'+encodeURIComponent(r.id),{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify(patch)},t)}).then(function(x){if(!x.ok)return x.text().then(function(y){throw {s:x.status,t:y}});for(var k in patch)r[k]=patch[k];tssDraw()}).catch(function(e){b.disabled=false;sm.textContent='おくれませんでした'+(e&&e.s?'（エラー '+e.s+'）':'')})};
  bd.appendChild(d)})}
var _tsD0=stfDraw;stfDraw=function(){_tsD0.apply(this,arguments);if(STF.tab==='ts'){if(TSS.rows===null&&!TSS.loading)tssLoad();else if(!TSS.loading)tssDraw()}};
