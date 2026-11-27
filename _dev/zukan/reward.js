/* ---------- 図鑑：もらったときの演出と、つぎのカードの案内（ステップ3） ---------- */
var zkShowing=[],zkHomeAt=0,zkForce=0,zkGetBack=null;
function zkPending(){var p=P();if(!p||!p.bd||!p.bd.cards)return [];if(ACC&&ACC.pid===p.id&&!bdSync)return [];var s=p.bd.seen||{};
  return ZKCARDS.filter(function(d){return p.bd.cards[d.id]&&!s[d.id]})}
/* ほかの画面が開いている間は出さない（クイズや説明のじゃまをしない） */
function zkBusy(){return zkIsOpen||!!document.querySelector('#dc.on,#prof.on,#qz.on,#clr.on,#setM.on,#rpM.on,#stfM.on,#chap.on,#intro.on,#zkGet.on')}
function zkFanfare(rar){try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();AC.resume();var t=AC.currentTime+.05;
  var ns=rar==='s'?[523.25,659.25,783.99,1046.5,1318.5]:rar==='r'?[523.25,659.25,783.99,1046.5]:[523.25,783.99,1046.5];
  ns.forEach(function(h,k){var o=AC.createOscillator(),g=AC.createGain(),q=t+k*.11;o.type='triangle';o.frequency.value=h;o.connect(g);g.connect(AC.destination);g.gain.setValueAtTime(.0001,q);g.gain.exponentialRampToValueAtTime(.07,q+.02);g.gain.exponentialRampToValueAtTime(.0001,q+.5);o.start(q);o.stop(q+.55)})}catch(e){}}
function zkGetShow(list){var row=$('zkGetRow'),order={s:0,r:1,n:2},l=list.slice().sort(function(a,b){return order[a.rar]-order[b.rar]}),show=l.slice(0,3);
  zkShowing=list.map(function(d){return d.id});zkGetBack=document.activeElement;row.innerHTML='';
  show.forEach(function(d,i){var r=ZKR[d.rar],c=zkEl('div','zkflip rar-'+d.rar),inner=zkEl('div','zkin'),back=zkEl('div','zkface zkb','📖'),front=zkEl('div','zkface zkf');
    back.setAttribute('aria-hidden','true');front.appendChild(zkIcon(d));front.appendChild(zkEl('b','',d.name));front.appendChild(zkEl('small','',r.star+' '+r.n+'　'+ZKT[d.type].n));front.appendChild(zkEl('p','','🌱 '+d.can));
    inner.appendChild(back);inner.appendChild(front);c.appendChild(inner);inner.style.animationDelay=(.35+i*.45)+'s';row.appendChild(c);
    setTimeout(function(){if($('zkGet').classList.contains('on'))zkFanfare(d.rar)},500+i*450)});
  $('zkGetT').textContent=list.length>1?'カードを '+list.length+'枚 手に入れた！':'カードを手に入れた！';
  $('zkGetMore').textContent=list.length>show.length?'ほかの '+(list.length-show.length)+'枚は、図鑑で見てね。':'';
  /* 出たとたんの押しまちがいで閉じないように、少しだけ待ってからボタンを使えるようにする */
  $('zkGetOk').disabled=$('zkGetBook').disabled=true;setTimeout(function(){$('zkGetOk').disabled=$('zkGetBook').disabled=false},900);
  $('zkGet').classList.add('on');setTimeout(function(){try{$('zkGetT').focus()}catch(e){}},30)}
function zkGetClose(toBook){if(!$('zkGet').classList.contains('on'))return;$('zkGet').classList.remove('on');var ids=zkShowing;zkShowing=[];zkSeen(ids);zkBtnUpd();zkNextUpd();
  if(toBook){ids.forEach(function(id){zkNew[id]=1});zkOpen();var pages=zkPages();for(var i=0;i<pages.length;i++)if(pages[i].cards.some(function(d){return zkNew[d.id]})){zkAt=i;zkRender();break}}
  else zkFocusBack(zkGetBack)}
$('zkGetOk').onclick=function(){zkGetClose(false)};$('zkGetBook').onclick=function(){zkGetClose(true)};
document.addEventListener('keydown',function(e){if(!$('zkGet').classList.contains('on'))return;
  if(e.key==='Escape'){e.preventDefault();e.stopPropagation();if(!$('zkGetOk').disabled)zkGetClose(false)}
  else if(e.key==='Tab'){e.preventDefault();var a=[$('zkGetBook'),$('zkGetOk')],i=a.indexOf(document.activeElement);a[i<0?0:(i+1)%2].focus()}},true);
/* ホームに着いて少したったら（道を進む演出のあと）出す。曲の提出直後は、その場で出す */
function zkTick(){try{
  if(!homeOn)zkHomeAt=0;else if(!zkHomeAt)zkHomeAt=Date.now();
  var force=zkForce&&Date.now()>=zkForce;
  /* 提出した画面（お題のDAW）をはなれていたら、割りこまずにホームで出す */
  if(force&&!(dcIn&&document.body.classList.contains('dm'))){zkForce=0;force=false}
  if(!force&&(!homeOn||Date.now()-zkHomeAt<2200))return;
  if(zkBusy())return;var l=zkPending();zkForce=0;if(l.length)zkGetShow(l)}catch(e){}}
setInterval(zkTick,500);
var _zkBp2=bdPost;bdPost=function(a,b,c){var r=_zkBp2(a,b,c);if(zkPending().length)zkForce=Date.now()+1500;return r};
/* つぎにもらえるカード。基礎編の順に進むと、あと何レッスンでもらえるか */
function zkNextCard(){var p=P(),own=zkOwned();if(!p)return null;var nxt=resumeIdx(),done=function(i){return isDone(L[i].id)},best=null;
  ZKCARDS.forEach(function(d){if(own[d.id])return;var c=d.c,ids=null;
    if(c.k==='lesson')ids=[c.id];else if(c.k==='chap'){var h=chObj(c.n);ids=h&&h.ids}else if(c.k==='basic')ids=L.map(function(l){return l.id});
    if(!ids)return;var last=-1;ids.forEach(function(id){if(!isDone(id))for(var i=0;i<L.length;i++)if(L[i].id===id)last=Math.max(last,i)});if(last<0)return;
    /* 残り＝「いまのレッスン」からその場所まで（とばして残した章内のレッスンも数える） */
    var n=0;for(var i=0;i<=last;i++)if(!done(i)&&(i>=nxt||ids.indexOf(L[i].id)>=0))n++;
    if(!best||n<best.n)best={d:d,n:n,text:'あと'+n+'レッスンで'}});
  if(!best&&bdAcc())ZKCARDS.forEach(function(d){if(own[d.id]||(d.c.k!=='login'&&d.c.k!=='post'))return;var g=zkProg(d.c,p),n=g.need-g.have;
    if(!best||n<best.n)best={d:d,n:n,text:d.c.k==='login'?'あと'+n+'日のログインで':'あと'+n+'回、べつの日に曲を提出すると'}});
  return best}
function zkNextUpd(){var b=$('zkNext1'),x=null;try{x=zkNextCard()}catch(e){}if(!x){b.hidden=true;return}b.hidden=false;
  var key=x.d.id+'|'+x.text;if(b.dataset.k===key)return;b.dataset.k=key;b.innerHTML='';
  b.appendChild(zkEl('span','','🎁 '+x.text));var c=zkEl('b');var ic=zkEl('i','',x.d.ic);ic.setAttribute('aria-hidden','true');c.appendChild(ic);c.appendChild(document.createTextNode(' '+x.d.name));b.appendChild(c);
  b.setAttribute('aria-label','つぎのカード：'+x.text+'「'+x.d.name+'」。図鑑をひらく')}
$('zkNext1').onclick=zkOpen;
var _zkRh=renderHome;renderHome=function(a){_zkRh(a);zkNextUpd()};
var _zkChip2=chip;chip=function(){_zkChip2.apply(this,arguments);zkNextUpd()};
zkNextUpd();
