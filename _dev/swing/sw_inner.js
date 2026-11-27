/* スウィング（ステップ8）：クリップごとに c.sw（0〜100。100＝3連のノリ）と c.swg（1＝16分のうら、なし＝8分のうら）。
   音の位置データは変えず、再生・MIDI書き出しのときだけ「うら」の音を遅らせる（Studio One のクオンタイズのスウィングと同じ考え方：100%で3連の位置）。 */
var SWL=[['なし（まっすぐ）',0],['すこし はねる',33],['ふつうに はねる',66],['つよく はねる（3連のノリ）',100]];
function swW(c,x){var a=+(c&&c.sw)||0;if(!(a>0))return x;var g=c.swg===1?1:2,P=2*g,b=Math.floor(x/P+1e-9)*P,f=x-b,k=(.5+Math.min(100,a)/600)*P;return b+(f<g?f*k/g:k+(f-g)*(P-k)/g)}
function swName(c){var a=+(c&&c.sw)||0;if(!a)return 'なし';return (a<50?'すこし':a<90?'ふつう':'つよい')+(c.swg===1?'・16分':'')}
function swUI(){var b=$('swBtn');if(!b)return;b.hidden=!free;if(openClip){b.querySelector('b').textContent=swName(openClip);b.setAttribute('aria-label','スウィング（はねるリズム）：いまは'+swName(openClip))}}
function swSet(a,g){var c=openClip;if(!c||c.au)return;stat('swing');if(a!=null){if(a>0)c.sw=a;else delete c.sw}if(g===1)c.swg=1;else if(g===2)delete c.swg;
  var nm=c.swg===1?'16分':'8分';renderEd();afterEdit();sfx('next');
  toast(c.sw?('スウィング：'+swName(c)+'（'+nm+'の「うら」の音が、すこしおそく鳴って はずむよ。点線の位置で鳴るよ。▶で聴いてみよう）'):('スウィング：なし（まっすぐのリズム）'+(g?'。はねる強さをえらぶと、'+nm+'のうらがずれるよ':'')));try{fire('swing',+c.sw||0)}catch(e){}}
function swItems(){var c=openClip||{},a=+c.sw||0,g=c.swg===1?1:2;return SWL.map(function(x){var on=x[1]===0?!a:(a>0&&Math.abs(a-x[1])<17);return {t:(on?'✓ ':'　')+x[0],f:function(){swSet(x[1],null)}}}).concat(['-',{t:(g===2?'✓ ':'　')+'8分のうらを ずらす（ふつう）',f:function(){swSet(null,2)}},{t:(g===1?'✓ ':'　')+'16分のうらを ずらす（こまかい）',f:function(){swSet(null,1)}}])}
(function(){var b=$('swBtn');if(!b)return;b.setAttribute('aria-expanded','false');b.addEventListener('mousedown',function(e){e.preventDefault()});b.onclick=function(ev){ev.stopPropagation();if(blocked()||!openClip)return;var r=b.getBoundingClientRect();ctxShow(r.left,r.bottom+4,swItems());ctxRet=b;ctxFrom=b;b.setAttribute('aria-expanded','true');if(ev.detail===0){var q=$('ctxm').querySelectorAll('button');if(q.length)try{q[0].focus({preventScroll:true})}catch(x){}}}})();
