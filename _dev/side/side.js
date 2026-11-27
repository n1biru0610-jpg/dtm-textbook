/* よりみちステージ（ステップ5）：メインの道（L）は変えず、カードの下に「よりみち」をぶら下げる */
var SIDE=[
{id:'3-A',at:'3-2',t:'階段とジャンプ',d:'となりの音へ進む「階段」と、はなれた音へとぶ「ジャンプ」。歌いやすいメロディは、階段が多めだよ。'},
{id:'3-B',at:'3-3',t:'のばす音・きざむ音',d:'音の長さで表情をつけよう。長い音は落ち着いて、短い音ははずむよ。'},
{id:'3-C',at:'3-4',t:'明るいメロディ・さみしいメロディ',d:'ドではなくラで終わると、少しさみしく聞こえるよ。'},
{id:'3-D',at:'3-6',t:'ウラから始まるメロディ',d:'1拍めより少し前から歌い出すと、はずんだ感じになるよ。'},
{id:'4-A',at:'4-2',t:'明るいコード・暗いコード',d:'C と Cm のように、明るいコードと暗いコードを聴きくらべよう。'},
{id:'4-B',at:'4-3',t:'なめらかにつなごう',d:'コードの音を上や下にずらして、となりのコードへ近い音でつなごう。'},
{id:'4-C',at:'4-4',t:'カノン進行',d:'C → G → Am → Em → F → C → F → G。とても有名なならびを使ってみよう。'},
{id:'4-D',at:'4-5',t:'おしゃれな4つ重ね',d:'音を4つ重ねたコードで、おしゃれなひびきにしよう。'},
{id:'4-E',at:'4-5',t:'ばらして弾こう',d:'コードの音を1つずつ順番に鳴らすと、きらきらした伴奏になるよ。'}];
var SIDE_SHOW_SOON=true; /* まだ作っていない寄り道（じゅんび中）もマップに出すか */
function sideOk(s){return !!(s.go||SIDE_SHOW_SOON)}
function sideR(){var w=$('world');Array.prototype.slice.call(w.querySelectorAll('.side')).forEach(function(e){e.remove()});
  var ids=L.map(function(l){return l.id}),low=matchMedia('(max-height:500px)').matches,ct=$('cta').getBoundingClientRect(),st=$('scroll').getBoundingClientRect().top,ctaTop=ct.height?ct.top:1e9;
  ids.forEach(function(id,i){var ss=SIDE.filter(function(s){return s.at===id&&sideOk(s)});if(!ss.length||!NE[i])return;
    var ch=chObj(chapOf(i)),all=ss.every(function(s){return isDone(s.id)}),b=document.createElement('button');
    b.type='button';b.className='side'+(all?' done':'');b.dataset.at=id;b.style.setProperty('--c',ch.c);
    var h=NE[i].offsetHeight,wd=NE[i].offsetWidth;
    if(!low&&st+ys[i]+h/2+28>ctaTop){b.classList.add('top');b.style.left=(xs[i]-wd/2+10)+'px';b.style.top=(ys[i]-h/2)+'px'}
    else{b.style.left=xs[i]+'px';b.style.top=(ys[i]+h/2)+'px'}
    b.innerHTML='<span aria-hidden="true">🌿</span> よりみち'+(ss.length>1?' <i>×'+ss.length+'</i>':'')+(all?' <i>★</i>':'');
    b.setAttribute('aria-label','よりみちステージ：'+ss.map(function(s){return s.id+' '+s.t}).join('、')+(all?'（ぜんぶクリア）':'')+'。やらなくても先へすすめます');
    b.onclick=function(){sideOpen(ss,b)};NE[i].insertAdjacentElement('afterend',b)})}
var sideBack=null,sideAt=null,sideT0=0;
function sideClose(){var d=$('sideDlg');if(!d||!d.classList.contains('on'))return;d.classList.remove('on');try{$('home').inert=false}catch(e){}
  var b=sideBack&&sideBack.isConnected?sideBack:document.querySelector('.side[data-at="'+sideAt+'"]');if(b)try{b.focus()}catch(e){}sideBack=null}
function sideOpen(ss,from){var d=$('sideDlg');
  if(!d){d=document.createElement('div');d.id='sideDlg';d.innerHTML='<div class="sdb" role="dialog" aria-modal="true" aria-labelledby="sdT" aria-describedby="sdP sdL"><h2 id="sdT"><span aria-hidden="true">🌿</span> よりみちステージ</h2><p class="sdp" id="sdP">やらなくても、先へすすめるよ。きょうみがあったら、のぞいてみよう。</p><div class="sdl" id="sdL"></div><button type="button" class="sdx">とじる</button></div>';
    document.body.appendChild(d);d.onclick=function(e){if(e.target===d)sideClose()};d.querySelector('.sdx').onclick=sideClose;
    document.addEventListener('keydown',function(e){if(!d.classList.contains('on'))return;
      if((e.key==='Enter'||e.key===' ')&&(e.repeat||Date.now()-sideT0<400)){e.preventDefault();e.stopPropagation();return}
      if(e.key==='Escape'){e.preventDefault();e.stopPropagation();sideClose()}
      else if(e.key==='Tab'){e.stopPropagation();var f=Array.prototype.slice.call(d.querySelectorAll('button')),a=f[0],z=f[f.length-1],ae=document.activeElement;
        if(!d.contains(ae)){e.preventDefault();(e.shiftKey?z:a).focus()}else if(e.shiftKey&&ae===a){e.preventDefault();z.focus()}else if(!e.shiftKey&&ae===z){e.preventDefault();a.focus()}}},true)}
  var l=d.querySelector('.sdl');l.innerHTML='';d.querySelector('.sdb').style.setProperty('--c',from.style.getPropertyValue('--c'));
  ss.forEach(function(s){var it=document.createElement('div');it.className='sdi';it.innerHTML='<b></b><span></span><p></p>';
    it.querySelector('b').textContent=s.id;it.querySelector('span').textContent=s.t;it.querySelector('p').textContent=s.d;
    var st=document.createElement(s.go?'button':'div');st.className='sds';
    if(s.go){st.type='button';st.textContent=isDone(s.id)?'★ クリア（もう一回）':'▶ あそぶ';st.onclick=function(){sideClose();s.go()}}
    else st.textContent='🔧 じゅんび中（もうすぐ遊べるよ）';
    it.appendChild(st);l.appendChild(it)});
  sideBack=from;sideAt=from.dataset.at;sideT0=Date.now();d.classList.add('on');try{$('home').inert=true}catch(e){}try{landSnd()}catch(e){}
  setTimeout(function(){var f=d.querySelector('.sds[type=button]')||d.querySelector('.sdx');try{f.focus({preventScroll:true})}catch(e){}d.querySelector('.sdb').scrollTop=0},30)}
