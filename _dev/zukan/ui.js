/* ---------- 図鑑：画面（ステップ2） ---------- */
var zkIsOpen=false,zkAt=0,zkShape='',zkNew={},zkBack=null,zkPick=null;
function zkSingle(){return innerWidth<=640}
function zkPer(){return innerHeight<=520&&!zkSingle()?3:4}
function zkPages(){var per=zkPer(),a=[];['tips','midi','sound'].forEach(function(t){var l=ZKCARDS.filter(function(d){return d.type===t});for(var i=0;i<l.length;i+=per)a.push({type:t,cards:l.slice(i,i+per),no:i/per+1,of:Math.ceil(l.length/per)})});return a}
function zkStep(){return zkSingle()?1:2}
function zkCount(){return Object.keys(zkOwned()).length}
function zkBtnUpd(){var t='📖 図鑑 '+zkCount()+'/'+ZKCARDS.length;$('zkBtn').textContent=t;$('zkBtn').setAttribute('aria-label','図鑑をひらく。集めたカードは '+ZKCARDS.length+'枚中 '+zkCount()+'枚')}
/* 新しくもらったカードを記録して、次に図鑑を開いたとき NEW を付ける */
function zkAuto(){try{zkEval().forEach(function(d){zkNew[d.id]=1})}catch(e){}}
/* seen … 「もらったよ」を見せ終わったカード。まだのものがあれば、ホームで演出を出す */
function zkSeen(ids){var p=P();if(!p||!ids.length)return;var b=bdOf(p);if(!b.seen||typeof b.seen!=='object')b.seen={};var ch=0;ids.forEach(function(id){if(!b.seen[id]){b.seen[id]=1;ch=1}});if(ch){p.u=Date.now();saveDB()}}
function zkSnd(){try{if(!AC)AC=new (window.AudioContext||window.webkitAudioContext)();AC.resume();var t=AC.currentTime+.01,n=Math.floor(AC.sampleRate*.16),buf=AC.createBuffer(1,n,AC.sampleRate),d=buf.getChannelData(0);for(var i=0;i<n;i++)d[i]=(Math.random()*2-1)*Math.sin(Math.PI*i/n);var s=AC.createBufferSource(),f=AC.createBiquadFilter(),g=AC.createGain();s.buffer=buf;f.type='bandpass';f.frequency.value=2600;f.Q.value=.7;g.gain.value=.07;s.connect(f);f.connect(g);g.connect(AC.destination);s.start(t)}catch(e){}}
function zkEl(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}
function zkIcon(d){var i=zkEl('i');i.setAttribute('aria-hidden','true');i.appendChild(zkEl('span','',d.ic));return i}
function zkCardEl(d,has,p){var r=ZKR[d.rar],b=zkEl('button','zkc rar-'+d.rar+(has?'':' no'));b.type='button';b.dataset.id=d.id;
  if(has&&zkNew[d.id])b.appendChild(zkEl('em','','NEW'));
  b.appendChild(zkIcon(d));b.appendChild(zkEl('b','',has?d.name:'？？？'));
  b.appendChild(zkEl('small','',r.star+' '+r.n));
  if(!has)b.appendChild(zkEl('small','',zkLeft(d.c,p)));
  b.setAttribute('aria-label',(has?d.name+'、'+r.n+'、持っている'+(zkNew[d.id]?'、新しいカード':''):'まだ持っていないカード、'+r.n+'、'+zkHow(d.c)+'、'+zkLeft(d.c,p))+'。くわしく見る');
  b.onclick=function(){zkDetail(d,b)};return b}
function zkRender(){var pages=zkPages(),st=zkStep(),p=P(),own=zkOwned(),sp=$('zkSp');
  zkAt=Math.max(0,Math.min(zkAt,pages.length-1));zkAt-=zkAt%st;zkShape=zkShapeNow();
  var heads=[];
  sp.innerHTML='';
  for(var k=0;k<st;k++){var pg=pages[zkAt+k],el=zkEl('div','zkpage');
    if(pg){var t=ZKT[pg.type];heads.push(t.n);el.appendChild(zkEl('h3','',t.ic+' '+t.n+(pg.of>1?'（'+pg.no+' / '+pg.of+'）':'')));var g=zkEl('div','zkgrid');pg.cards.forEach(function(d){g.appendChild(zkCardEl(d,!!own[d.id],p))});el.appendChild(g)}
    sp.appendChild(el)}
  $('zkN').textContent=Object.keys(own).length+' / '+ZKCARDS.length;
  $('zkNote').textContent=!p?'ログインすると、カードを集められるよ。':(bdAcc()?'カードをおすと、くわしく見られるよ。':'ログインしていないので、ページを閉じるとカードは消えるよ。ログインすると、のこして集められるよ。');
  var tot=Math.ceil(pages.length/st),now=zkAt/st+1;$('zkPg').textContent=now+' / '+tot;$('zkPg').setAttribute('aria-label',tot+'見開き中 '+now+'。'+heads.join('と'));
  $('zkPrev').disabled=now<=1;$('zkNext').disabled=now>=tot}
function zkFlip(n,back,cover){var fx=$('zkFx');fx.innerHTML='';for(var i=0;i<n;i++){var l=zkEl('div','zkleaf'+(back?' back':'')+(cover&&i===0?' cover':''));l.style.animationDelay=(i*.11)+'s';l.style.zIndex=n-i;fx.appendChild(l)}
  clearTimeout(zkFlip.t);zkFlip.t=setTimeout(function(){fx.innerHTML=''},700+n*110);
  var rm=false;try{rm=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}for(var s=0;s<(rm?1:Math.min(n,3));s++)setTimeout(zkSnd,s*120)}
function zkShapeNow(){return zkPer()+'/'+zkStep()}
function zkTurn(dir){var before=zkAt,a=document.activeElement,onCard=a&&$('zkSp').contains(a);zkAt+=dir*zkStep();zkRender();if(zkAt!==before)zkFlip(1,dir<0)
  var b=$(dir<0?'zkPrev':'zkNext');
  if(onCard){var c=$('zkSp').querySelector('.zkc');if(c)c.focus()}else if(b.disabled)$(dir<0?'zkNext':'zkPrev').focus()}
/* くわしい説明を開いている間は、うしろの本をさわれない・読み上げないようにする */
function zkBehind(on){Array.prototype.forEach.call(document.querySelectorAll('#zk .zkbook>*'),function(e){if(e.id!=='zkDet')e.inert=on})}
function zkDetail(d,from){var own=zkOwned(),has=!!own[d.id],p=P(),g=zkProg(d.c,p),r=ZKR[d.rar],box=$('zkDet');zkPick=from;
  box.innerHTML='';var c=zkEl('div','zkd rar-'+d.rar+(has?'':' no'));
  c.appendChild(zkIcon(d));var h=zkEl('h4','',has?d.name:'？？？');h.tabIndex=-1;c.appendChild(h);
  c.appendChild(zkEl('p','',r.star+' '+r.n+'　'+ZKT[d.type].n));
  c.appendChild(zkEl('p','',has?d.desc:'まだ持っていないカードだよ。'));
  var dl=zkEl('dl');function row(a,b){dl.appendChild(zkEl('dt','',a));var dd=zkEl('dd','',b);dl.appendChild(dd);return dd}
  row('🌱 できるようになること',d.can);
  var dd=row('🗝 もらい方',zkHow(d.c));
  if(!has){var pr=document.createElement('progress');pr.max=g.need;pr.value=g.have;pr.setAttribute('aria-label','すすみぐあい');dd.appendChild(document.createElement('br'));dd.appendChild(pr);dd.appendChild(zkEl('span','',g.have+' / '+g.need+'（'+zkLeft(d.c,p)+'）'))}
  else if(p&&p.bd&&p.bd.cards&&p.bd.cards[d.id]){var t=new Date(p.bd.cards[d.id]);row('📅 図鑑にのった日',t.getFullYear()+'年'+(t.getMonth()+1)+'月'+t.getDate()+'日')}
  if(d.type!=='tips'&&ZK_PACK_SOON)row('🎛 スタジオで使う','いま じゅんび中だよ。使えるようになるまで、カードは図鑑にのこるよ。');
  c.appendChild(dl);var bk=zkEl('button','zkback','もどる');bk.type='button';bk.onclick=zkDetClose;c.appendChild(bk);
  box.appendChild(c);box.classList.add('on');box.setAttribute('aria-label',(has?d.name:'まだ持っていないカード')+'のくわしい説明');zkBehind(true);setTimeout(function(){try{h.focus()}catch(e){}},30)}
function zkDetClose(){zkBehind(false);$('zkDet').classList.remove('on');$('zkDet').innerHTML='';try{if(zkPick&&document.contains(zkPick))zkPick.focus()}catch(e){}}
function zkOpen(){if(zkIsOpen)return;zkBack=document.activeElement;
  zkAuto();var nw=ZKCARDS.filter(function(d){return zkNew[d.id]});
  zkBehind(false);zkIsOpen=true;try{if(f.srcdoc)f.contentWindow.postMessage({lessonMute:1},'*')}catch(e){}
  zkAt=0;if(nw.length){var pages=zkPages();for(var i=0;i<pages.length;i++)if(pages[i].cards.some(function(d){return zkNew[d.id]})){zkAt=i;break}}
  $('zkDet').classList.remove('on');$('zk').classList.add('on');zkRender();zkFlip(5,false,true);zkBtnUpd();
  setTimeout(function(){try{$('zkT').focus()}catch(e){}},30)}
function zkClose(){if(!zkIsOpen)return;zkIsOpen=false;zkNew={};zkBehind(false);$('zk').classList.remove('on');$('zkDet').classList.remove('on');$('zkFx').innerHTML='';zkSnd();zkBtnUpd();
  zkFocusBack(zkBack)}
/* もとの場所へフォーカスを戻す。固定表示のボタンは offsetParent が無いので、画面に出ているかは getClientRects で見る */
function zkFocusBack(x){try{var b=x&&x!==document.body&&document.contains(x)&&x.getClientRects().length?x:null;
  if(!b&&$('zkBtn').getClientRects().length)b=$('zkBtn');
  if(!b&&document.body.classList.contains('dm'))b=dcIn?$('dawc'):$('dawf');
  if(!b)return;b.focus();if(b.tagName==='IFRAME')b.contentWindow.focus()}catch(e){}}
$('zkBtn').onclick=zkOpen;$('zkX').onclick=zkClose;
$('zkPrev').onclick=function(){zkTurn(-1)};$('zkNext').onclick=function(){zkTurn(1)};
$('zk').addEventListener('pointerdown',function(e){if(e.target===$('zk'))zkClose()});
$('zkDet').addEventListener('click',function(e){if(e.target===$('zkDet'))zkDetClose()});
document.addEventListener('keydown',function(e){if(!zkIsOpen)return;var det=$('zkDet').classList.contains('on');
  if(e.key==='Escape'){e.preventDefault();e.stopPropagation();det?zkDetClose():zkClose()}
  else if(!det&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();zkTurn(e.key==='ArrowLeft'?-1:1)}
  else if(e.key==='Tab'){var root=det?$('zkDet'):$('zk'),a=Array.prototype.filter.call(root.querySelectorAll('button'),function(b){return !b.disabled&&b.offsetParent!==null&&(det||!$('zkDet').contains(b))});if(!a.length)return;var i=a.indexOf(document.activeElement);e.preventDefault();a[i<0?(e.shiftKey?a.length-1:0):(i+(e.shiftKey?a.length-1:1))%a.length].focus()}},true);
window.addEventListener('resize',function(){if(!zkIsOpen||zkShape===zkShapeNow())return;if($('zkDet').classList.contains('on'))zkDetClose();var had=$('zk').contains(document.activeElement);zkRender();if(had&&!$('zk').contains(document.activeElement))$('zkT').focus()});
(function(){var s=$('sel');if(!s)return;var b=zkEl('button','hb','📖 図鑑');b.type='button';b.id='zkBarBtn';b.onclick=zkOpen;s.parentNode.insertBefore(b,s)})();
var _zkChip=chip;chip=function(){_zkChip.apply(this,arguments);try{zkBtnUpd()}catch(e){}};
/* 条件を満たしたら、図鑑を開かなくてもすぐ記録する（あとで章にレッスンが増えても、もらったカードは消えない） */
var _zkBdc=bdCheck;bdCheck=function(){if(zkIsOpen||$('zkGet').classList.contains('on'))return;_zkBdc();zkAuto()};
var _zkMd=markDone;markDone=function(id){_zkMd(id);zkAuto()};
var _zkBp=bdPost;bdPost=function(a,b,c){var r=_zkBp(a,b,c);zkAuto();return r};
setInterval(function(){try{if(!zkIsOpen)zkBtnUpd()}catch(e){}},3000);
zkBtnUpd();
