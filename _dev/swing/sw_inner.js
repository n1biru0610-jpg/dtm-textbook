/* スウィング（ステップ8）：クリップごとに c.sw（0〜100。100＝3連のノリ）と c.swg（1＝16分のうら、なし＝8分のうら）。
   音の位置データは変えず、再生・MIDI書き出しのときだけ「うら」の音を遅らせる（Studio One のクオンタイズのスウィングと同じ考え方：100%で3連の位置）。 */
var SWL=[['なし（まっすぐ）',0],['すこし はねる',33],['ふつうに はねる',66],['つよく はねる（タッタ タッタ）',100]];
function swCat(a){a=+a||0;return a<=0?0:a<50?33:a<90?66:100}
function swW(c,x){var a=+(c&&c.sw)||0;if(!(a>0))return x;var g=c.swg===1?1:2,P=2*g,b=Math.floor(x/P+1e-9)*P,f=x-b,k=(.5+Math.min(100,a)/600)*P;return b+(f<g?f*k/g:k+(f-g)*(P-k)/g)}
function swName(c){var a=swCat(c&&c.sw);if(!a)return 'なし';return (a===33?'すこし':a===66?'ふつう':'つよい')+(c.swg===1?'・16分':'')}
function swUI(){var b=$('swBtn');if(!b)return;b.hidden=!free;if(openClip){b.querySelector('b').textContent=swName(openClip);b.setAttribute('aria-label','スウィング：'+swName(openClip)+'（はねるリズム）')}}
function swSet(a,g){var c=openClip;if(!free||!c||c.au)return;stat('swing');if(a!=null){if(a>0)c.sw=a;else delete c.sw}if(g===1)c.swg=1;else if(g===2)delete c.swg;
  var nm=c.swg===1?'16分':'8分';renderEd();afterEdit();sfx('next');
  toast(c.sw?('はねるリズムにしたよ（'+swName(c)+'）。点線の所で鳴るよ。▶で聴いてみよう'):(g?nm+'音符を はねさせる設定にしたよ。上の強さをえらんでね':'まっすぐのリズムにもどしたよ'));clearTimeout(toast.k);toast.k=setTimeout(function(){$('toast').classList.remove('on')},5000);try{fire('swing',+c.sw||0)}catch(e){}}
function swItems(){var c=openClip||{},a=swCat(c.sw),g=c.swg===1?1:2;return SWL.map(function(x){var on=x[1]===a;return {t:(on?'✓ ':'　')+x[0],f:function(){swSet(x[1],null)}}}).concat(['-',{t:(g===2?'✓ ':'　')+'8分音符を はねさせる（ふつう）',f:function(){swSet(null,2)}},{t:(g===1?'✓ ':'　')+'16分音符を はねさせる（こまかい）',f:function(){swSet(null,1)}}])}
(function(){var b=$('swBtn');if(!b)return;b.setAttribute('aria-expanded','false');b.addEventListener('mousedown',function(e){e.preventDefault()});function op(kb){if(!free||blocked()||!openClip)return;var r=b.getBoundingClientRect();ctxShow(r.left,r.bottom+4,swItems());ctxRet=b;ctxFrom=b;b.setAttribute('aria-expanded','true');if(kb){var q=$('ctxm').querySelectorAll('button');if(q.length)try{q[0].focus({preventScroll:true})}catch(x){}}}
 b.onclick=function(ev){ev.stopPropagation();op(ev.detail===0)};b.addEventListener('keydown',function(e){if(e.key==='ArrowDown'){e.preventDefault();e.stopPropagation();op(true)}})})();
(function(){var t=$('toast');if(t&&!t.getAttribute('role')){t.setAttribute('role','status');t.setAttribute('aria-live','polite')}})();
