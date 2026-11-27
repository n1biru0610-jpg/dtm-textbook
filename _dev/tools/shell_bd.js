/* ---------- 称号（バッジ）・ログインボーナス ---------- */
var bdDay='',bdSync=false;
function bdAcc(){var p=P();return (p&&ACC&&ACC.pid===p.id)?p:null}
function bdOf(p){var b=p.bd;if(!b||typeof b!=='object')b=p.bd={};if(!Array.isArray(b.days))b.days=[];if(!b.earned||typeof b.earned!=='object')b.earned={};if(!b.post||typeof b.post!=='object')b.post={};if(typeof b.wear!=='string')b.wear='';if(typeof b.skin!=='string')b.skin='';return b}
function bdFull(b){return Object.keys(b.post).filter(function(k){var x=b.post[k];return x&&x.total&&x.ok===x.total}).length}
function bdDefs(){var a=[],dd=[[1,'hello','はじめまして','👋','はじめてログインした'],[3,'d3','ちょっと なれてきた','🌱','ログインした日が3日になった'],[7,'d7','いつもの あの人','🌿','ログインした日が7日になった'],[14,'d14','かよいびと','🚶','ログインした日が14日になった'],[30,'d30','ひとつき マスター','🌙','ログインした日が30日になった'],[60,'d60','おとの ともだち','🎵','ログインした日が60日になった'],[100,'d100','ひゃくにちの おと','💯','ログインした日が100日になった']];
 dd.forEach(function(x){a.push({id:x[1],g:'login',n:x[2],ic:x[3],d:x[4],need:x[0],t:function(b){return b.days.length>=x[0]}})});
 CH.forEach(function(c){a.push({id:'ch'+c.n,g:'learn',n:'第'+c.n+'章 クリア',ic:'📘',d:'第'+c.n+'章「'+c.title+'」のレッスンを全部クリアした',t:function(){return c.ids.every(isDone)}})});
 a.push({id:'basic',g:'learn',n:'基礎マスター',ic:'🎓',d:'基礎編のレッスンを全部クリアした',t:function(){return CH.every(function(c){return c.ids.every(isDone)})}});
 [[1,'p1','最高の一歩','👣','DAWでつくった曲を、はじめて投稿した（デイリーチャレンジ）'],[2,'p2','地道な成功','🧱','2曲目を投稿した（べつの日のお題でね）'],[5,'p5','投稿の常連','📮','5曲を投稿した'],[10,'p10','おとの職人','🛠','10曲を投稿した']].forEach(function(x){a.push({id:x[1],g:'post',n:x[2],ic:x[3],d:x[4],t:function(b){return Object.keys(b.post).length>=x[0]}})});
 a.push({id:'f1',g:'post',n:'お題マスター',ic:'🏆',d:'お題の条件を全部クリアして投稿した',t:function(b){return bdFull(b)>=1}});
 a.push({id:'f5',g:'post',n:'お題ハンター',ic:'🎯',d:'お題を全部クリアして投稿したのが5回になった',t:function(b){return bdFull(b)>=5}});
 return a}
var BDSK=[{id:'',n:'クラシック',ic:'🎵',d:'はじめから使える',c:['#eef5f1','#2c64f0','#fff']},
 {id:'sakura',n:'さくら',ic:'🌸',d:'ログイン3日で',need:3,c:['#fdeef2','#e0527a','#fff']},
 {id:'forest',n:'もりのみどり',ic:'🌲',d:'ログイン7日で',need:7,c:['#e6f3e2','#2e8b57','#fff']},
 {id:'sunset',n:'ゆうやけ',ic:'🌇',d:'ログイン14日で',need:14,c:['#ffe9d6','#e8590c','#fff']},
 {id:'night',n:'よぞら',ic:'🌌',d:'ログイン30日で',need:30,c:['#0b1030','#8aa4ff','#171e4a']},
 {id:'gold',n:'ゴールド',ic:'🏆',d:'ログイン60日で',need:60,c:['#fff6d6','#c58a00','#fffdf3']},
 {id:'mono',n:'モノクロ',ic:'⬛',d:'称号『基礎マスター』で',title:'basic',c:['#f2f2f2','#333','#fff']},
 {id:'gb',n:'ゲームボーイ',ic:'🎮',d:'称号『お題マスター』で',title:'f1',c:['#c9d9a2','#306230','#e0efbf']}];
function bdSkOk(s,b){return !s.id||(s.need?b.days.length>=s.need:!!b.earned[s.title])}
function bdSkApply(){var cl=document.body.classList,i;for(i=cl.length-1;i>=0;i--){if(/^sk-|^skx$/.test(cl[i]))cl.remove(cl[i])}var p=bdAcc();if(!p)return;var b=bdOf(p),s=BDSK.filter(function(x){return x.id&&x.id===b.skin})[0];if(s&&bdSkOk(s,b)){cl.add('skx');cl.add('sk-'+s.id)}}
function bdSkName(p){p=p||bdAcc();if(!p)return '';var b=bdOf(p),s=BDSK.filter(function(x){return x.id===b.skin})[0];return s&&bdSkOk(s,b)?s.n:'クラシック'}
function bdSkSet(id){var p=bdAcc();if(!p)return;var b=bdOf(p),s=BDSK.filter(function(x){return x.id===id})[0];if(!s||!bdSkOk(s,b))return;b.skin=id;p.u=Date.now();saveDB();bdSkApply();bdShow('sk')}
function bdSkNew(n,nw){return BDSK.filter(function(x){return x.id&&(x.need?x.need===n:nw.some(function(d){return d.id===x.title}))})}
function bdDef(id){return bdDefs().filter(function(d){return d.id===id})[0]}
function bdTitle(p){p=p||bdAcc();if(!p)return '';var b=bdOf(p),d=b.wear&&b.wear!=='-'&&b.earned[b.wear]?bdDef(b.wear):null;return d?d.ic+' '+d.n:''}
function bdEval(){var p=bdAcc();if(!p)return [];var b=bdOf(p),nw=[];bdDefs().forEach(function(d){if(!b.earned[d.id]){var ok=false;try{ok=!!d.t(b,p)}catch(e){}if(ok){b.earned[d.id]=Date.now();nw.push(d)}}});
 if(nw.length){if(!b.wear)b.wear=nw[0].id;p.u=Date.now();saveDB();bdBtnUpd()}return nw}
function bdNote(nw){if(nw&&nw.length){var k=BDSK.filter(function(x){return x.title&&nw.some(function(d){return d.id===x.title})});accToast('🏅 新しい称号をゲット！ 『'+nw.map(function(d){return d.ic+' '+d.n}).join('』『')+'』'+(k.length?'　🎨 きせかえ『'+k.map(function(x){return x.n}).join('』『')+'』も！':''))}}
function bdPost(day,ok,total){var p=bdAcc();if(!p)return [];var b=bdOf(p),o=b.post[day];if(!o||ok/(total||1)>=o.ok/(o.total||1))b.post[day]={ok:ok,total:total};
 var k=Object.keys(b.post).sort();while(k.length>400)delete b.post[k.shift()];p.u=Date.now();saveDB();return bdEval()}
function bdMerge(a,r,rNew){a=a||{};r=r||{};var o={days:[],earned:{},post:{},wear:'',skin:''},m={};(a.days||[]).concat(r.days||[]).forEach(function(d){if(/^\d{4}-\d\d-\d\d$/.test(d))m[d]=1});o.days=Object.keys(m).sort().slice(-400);
 [a.earned||{},r.earned||{}].forEach(function(e){for(var k in e){if(!o.earned[k]||e[k]<o.earned[k])o.earned[k]=e[k]}});
 [a.post||{},r.post||{}].forEach(function(e){for(var k in e){var x=e[k];if(!x)continue;var y=o.post[k];if(!y||x.ok/(x.total||1)>y.ok/(y.total||1))o.post[k]={ok:x.ok,total:x.total}}});
 o.wear=(rNew?(r.wear||a.wear):(a.wear||r.wear))||'';o.skin=(rNew?(r.skin||a.skin):(a.skin||r.skin))||'';return o}
function bdBtnUpd(){var b=$('bdBtn');if(!b)return;var t=bdTitle();b.textContent=t?'🎒 '+t.replace(/^\S+\s/,''):'🎒 もちもの';bdSkApply()}
function bdHL(){document.body.classList.add('dchl')}
function bdCheck(){var p=bdAcc(),today=dcJst();
 if(!p){if(!bdSync&&ACC)return;try{var done=localStorage.getItem('dtm-dchl')===today;if(!done&&$('home').classList.contains('on')&&!$('prof').classList.contains('on')&&!$('dc').classList.contains('on')){localStorage.setItem('dtm-dchl',today);bdHL()}}catch(e){}return}
 if(!bdSync)return;var key=today+'|'+p.id;if(bdDay===key)return;
 if(!$('home').classList.contains('on')||$('prof').classList.contains('on')||$('dc').classList.contains('on'))return;
 bdDay=key;var b=bdOf(p),first=b.days.indexOf(today)<0;
 if(first){b.days.push(today);b.days.sort();if(b.days.length>400)b.days=b.days.slice(-400);p.u=Date.now();saveDB()}
 var nw=bdEval();if(first){bdWelcome(p,nw)}else if(nw.length)bdNote(nw);bdHL()}
function bdWelcome(p,nw){var b=bdOf(p),c=$('dcc'),today=dcJst(),th=dcTheme(today),n=b.days.length,i,st='';dcBack=$('home');
 for(i=6;i>=0;i--){var dd=dcJst(new Date(Date.now()-i*86400000));st+='<li class="'+(b.days.indexOf(dd)>=0?'on':'')+(i===0?' today':'')+'"><small>'+dcEsc(dcMd(dd).replace(/（.*$/,''))+'</small><b>'+(b.days.indexOf(dd)>=0?'✔':'・')+'</b></li>'}
 var nsk=bdSkNew(n,nw);var nx=bdDefs().filter(function(d){return d.g==='login'&&!b.earned[d.id]})[0],nxt=nx?'つぎの称号『'+nx.ic+' '+nx.n+'』まで、あと '+(nx.need-n)+'日':'ログインの称号は ぜんぶ そろったよ！';
 c.innerHTML='<div class="dh"><span>🎁 ログインボーナス</span><button class="dx" id="dcX">✕ とじる</button></div><h2 id="dcH" tabindex="-1"></h2><div class="bdn"><b>'+n+'</b><span>日め</span></div><ol class="bds" aria-label="さいきん7日のログイン">'+st+'</ol><p class="ds" id="bdNx"></p>'+(nw.length?'<div class="bdnew" role="status"><b>🏅 新しい称号をゲット！</b><ul>'+nw.map(function(d){return '<li><i>'+d.ic+'</i><span><b>'+dcEsc(d.n)+'</b><small>'+dcEsc(d.d)+'</small></span></li>'}).join('')+'</ul></div>':'')+(nsk.length?'<div class="bdnew" role="status"><b>🎨 新しいきせかえをゲット！</b><ul>'+nsk.map(function(x){return '<li><i>'+x.ic+'</i><span><b>'+dcEsc(x.n)+'</b><small>ホーム画面の色が かわるよ</small></span></li>'}).join('')+'</ul></div>':'')+'<div class="dt"><b>📅 今日のお題　『'+dcEsc(th.title)+'』</b><p>'+dcEsc(th.desc)+'</p></div><div class="db"><button class="go" id="bdGo">📅 今日のお題にちょうせん</button><button id="bdSh">🎒 もちものを見る</button><button id="bdLt">あとで</button></div>';
 $('dcH').textContent='ようこそ、'+(p.name||'')+'さん！';$('bdNx').textContent=nxt;
 $('dcX').onclick=dcClose;$('bdLt').onclick=dcClose;$('bdGo').onclick=function(){dcClose();dcStart()};$('bdSh').onclick=function(){bdShow(nsk.length?'sk':'')};
 $('dc').classList.add('on');setTimeout(function(){try{$('dcH').focus()}catch(e){}},30)}
function bdWear(id){var p=bdAcc();if(!p)return;var b=bdOf(p);if(id!=='-'&&!b.earned[id])return;b.wear=id;p.u=Date.now();saveDB();bdBtnUpd();bdShow()}
function bdShow(tab){tab=tab==='sk'?'sk':'ti';var p=bdAcc(),c=$('dcc');dcBack=$('home');$('dc').classList.add('on');
 if(!p){c.innerHTML='<div class="dh"><span>🎒 もちもの</span><button class="dx" id="dcX">✕ とじる</button></div><h2 id="dcH" tabindex="-1">もちもの</h2><p class="ds">ログインすると、毎日のログインや、レッスン・曲の投稿で「称号」や「きせかえ」がもらえるよ。もらった称号は、みんなの作品といっしょに表示できるよ。</p><div class="db"><button class="go" id="bdLg">ログイン／登録する</button><button id="dcBk">とじる</button></div>';
  $('dcX').onclick=dcClose;$('dcBk').onclick=dcClose;$('bdLg').onclick=function(){dcClose();openProf()};setTimeout(function(){try{$('dcH').focus()}catch(e){}},30);return}
 var b=bdOf(p),defs=bdDefs(),tabs='<div class="bdtb" role="tablist"><button type="button" role="tab" id="bdT1" aria-selected="'+(tab==='ti')+'">🏅 しょうごう</button><button type="button" role="tab" id="bdT2" aria-selected="'+(tab==='sk')+'">🎨 きせかえ</button></div>',gn={login:'📆 ログイン',learn:'📘 レッスン',post:'🎼 曲の投稿'},h='';
 ['login','learn','post'].forEach(function(g){h+='<h3 class="bdg">'+gn[g]+'</h3><ul class="bdl">'+defs.filter(function(d){return d.g===g}).map(function(d){var e=!!b.earned[d.id],w=b.wear===d.id;return '<li><button type="button" class="'+(e?'e':'l')+(w?' w':'')+'" data-id="'+d.id+'" aria-pressed="'+w+'"'+(e?'':' aria-disabled="true"')+'><i>'+(e?d.ic:'🔒')+'</i><span><b>'+dcEsc(d.n)+'</b><small>'+dcEsc(d.d)+'</small></span>'+(w?'<em>つけてる</em>':'')+'</button></li>'}).join('')+'</ul>'});
 if(tab==='sk'){var sh=BDSK.map(function(x){var ok=bdSkOk(x,b),on=(b.skin||'')===x.id,lack=x.need?'（あと'+Math.max(0,x.need-b.days.length)+'日）':'';return '<li><button type="button" class="'+(ok?'e':'l')+(on?' w':'')+'" data-id="'+x.id+'" aria-pressed="'+on+'"'+(ok?'':' aria-disabled="true"')+'><span class="skw" style="background:'+x.c[0]+'"><u style="background:'+x.c[2]+'"></u><s style="background:'+x.c[1]+'"></s></span><span><b>'+x.ic+' '+dcEsc(x.n)+'</b><small>'+(ok?dcEsc(x.d.replace(/で$/,'')+(x.id?'でゲット':'')):'🔒 '+dcEsc(x.d)+(x.title?'ゲット':'')+lack)+'</small></span>'+(on?'<em>つかってる</em>':'')+'</button></li>'}).join('');
 c.innerHTML='<div class="dh"><span>🎒 もちもの</span><button class="dx" id="dcX">✕ とじる</button></div><h2 id="dcH" tabindex="-1">もちもの</h2>'+tabs+'<p class="ds">いまの きせかえ：<b id="bdNow"></b>　（ログイン <b>'+b.days.length+'</b>日）<br>おすと、ホーム画面の色が かわるよ。</p><div class="bdsc"><ul class="bdl bdsk">'+sh+'</ul></div><div class="db"><button id="dcBk">← とじる</button></div>';
 $('bdNow').textContent=bdSkName(p);$('dcX').onclick=dcClose;$('dcBk').onclick=dcClose;$('bdT1').onclick=function(){bdShow('ti')};$('bdT2').onclick=function(){bdShow('sk')};
 Array.prototype.forEach.call(c.querySelectorAll('.bdl button.e'),function(x){x.onclick=function(){bdSkSet(x.dataset.id)}});
 setTimeout(function(){try{$('dcH').focus()}catch(e){}},30);return}
 c.innerHTML='<div class="dh"><span>🎒 もちもの</span><button class="dx" id="dcX">✕ とじる</button></div><h2 id="dcH" tabindex="-1">もちもの</h2>'+tabs+'<p class="ds">いま つけている称号：<b id="bdNow"></b>　（ログイン <b>'+b.days.length+'</b>日・投稿 <b>'+Object.keys(b.post).length+'</b>曲）<br>もらった称号をおすと、みんなの作品に表示する称号に えらべるよ。</p><div class="bdsc">'+h+'</div><div class="db"><button id="bdNo">称号をつけない</button><button id="dcBk">← とじる</button></div>';
 $('bdNow').textContent=bdTitle(p)||'（なし）';$('bdT1').onclick=function(){bdShow('ti')};$('bdT2').onclick=function(){bdShow('sk')};$('dcX').onclick=dcClose;$('dcBk').onclick=dcClose;$('bdNo').onclick=function(){bdWear('-')};
 Array.prototype.forEach.call(c.querySelectorAll('.bdl button.e'),function(x){x.onclick=function(){bdWear(x.dataset.id)}});
 setTimeout(function(){try{$('dcH').focus()}catch(e){}},30)}
$('bdBtn').onclick=bdShow;
setInterval(function(){try{bdCheck()}catch(e){}},3000);
