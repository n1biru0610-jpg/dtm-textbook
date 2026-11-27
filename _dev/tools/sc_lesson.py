import re
h=open('l32.html',encoding='utf8').read()
def R(a,b,c=1):
    global h
    n=h.count(a); assert n==c,(a[:60],n)
    h=h.replace(a,b)
R('<title>3-2 使っていい音をえらぼう</title>','<title>3-8 スケールで気分をかえよう</title>')
R('<header><b>3-2</b>　使っていい音をえらぼう</header>','<header><b>3-8</b>　スケールで気分をかえよう</header>')
R('<div class="homeNote" id="homeNote" style="display:none">黒いふち＝「おうち」の音（ド）</div>','<div class="homeNote" id="homeNote" style="display:none"></div>')
# steps
i=h.index('var CFG={cols:8'); j=h.index('var ctx=null')
steps='''var CFG={cols:8,bpm:100,drums:false,steps:[
{t:'まずはおさらい。「ド・レ・ミ・ソ・ラ」の5つの音で、四角を4つ以上ならべて、▶ で聴いてみよう！',reset:1,home:1,btns:['play','rand','clear'],spot:'play',gate:function(){return notesN()>=4&&played>=1}},
{t:'音のセットのことを「スケール」というよ。いまのメロディの形はそのままで、スケールだけ「日本風」にかえてみよう。ボタンを押してね！',home:1,btns:['sa','sj','play'],spot:'sj',gate:function(){return heard.j&&played>=1}},
{t:'同じ形なのに、和風の雰囲気になったね！ つぎは「沖縄風」。あかるくて、のんびりした感じになるよ。',home:1,btns:['sa','sj','so','play'],spot:'so',gate:function(){return heard.o&&played>=1}},
{t:'さいごは「ブルース」。ちょっとおとなっぽくて、かっこいい感じ！ 聴いてみよう。',home:1,btns:['sa','sj','so','sb','play'],spot:'sb',gate:function(){return heard.b&&played>=1}},
{t:'まだまだあるよ！ 「かなしい」「ふしぎ」「スペイン風」「ミステリー」も、ぜんぶ聴いてみよう。',home:1,btns:['sm','sw','ss','sd','play'],spot:'sm',gate:function(){return heard.m&&heard.w&&heard.s&&heard.d&&played>=1}},
{t:'スケールをかえるだけで、気分がガラッと変わるね。好きなスケールをえらんで、自分のメロディを作ってみよう！',home:1,btns:['sa','sj','so','sb','sm','sw','ss','sd','play','rand','clear'],last:1}
]};
'''
h=h[:i]+steps+h[j:]
# scales
R("var ROWS=[{n:'ド',m:72},{n:'ラ',m:69},{n:'ソ',m:67},{n:'ミ',m:64},{n:'レ',m:62},{n:'ド',m:60}];",
"""var ROWS=[{n:'ド',m:72},{n:'ラ',m:69},{n:'ソ',m:67},{n:'ミ',m:64},{n:'レ',m:62},{n:'ド',m:60}];
var NN=['ド','ド♯','レ','ミ♭','ミ','ファ','ファ♯','ソ','ラ♭','ラ','シ♭','シ'];
var SC={a:{nm:'あかるい（ペンタトニック）',o:[0,2,4,7,9,12]},j:{nm:'日本風',o:[0,2,3,7,8,12]},o:{nm:'沖縄風',o:[0,4,5,7,11,12]},b:{nm:'ブルース',o:[0,3,5,6,7,10]},m:{nm:'かなしい（マイナー）',o:[0,3,5,7,10,12]},w:{nm:'ふしぎ（全音）',o:[0,2,4,6,8,10]},s:{nm:'スペイン風',o:[0,1,4,5,7,8]},d:{nm:'ミステリー',o:[0,3,5,7,8,11]}};
var SK={sa:'a',sj:'j',so:'o',sb:'b',sm:'m',sw:'w',ss:'s',sd:'d'},curSc='a';""")
R("var GRAY={0:{n:'シ',m:71},2:{n:'ファ',m:65}};","var GRAY={};")
R("labs.forEach(function(l,r){l.classList.toggle('home',!!s.home&&(r===5||r===0))});","labs.forEach(function(l,r){l.classList.toggle('home',(ROWS[r].m-60)%12===0)});")
# setScale + buttons
R("var BTN={","""function setScale(k){curSc=k;var o=SC[k].o;for(var r=0;r<ROWS.length;r++){var m=60+o[5-r];ROWS[r].m=m;ROWS[r].n=NN[(m-60)%12];if(labs[r]){labs[r].textContent=ROWS[r].n;labs[r].setAttribute('aria-label',ROWS[r].n);labs[r].classList.toggle('home',(m-60)%12===0)}for(var c=0;c<NC;c++)if(cells[r]&&cells[r][c])cells[r][c].setAttribute('aria-label',ROWS[r].n+' '+(c+1))}
  var hn=$('homeNote');if(hn)hn.textContent='いまのスケール：'+SC[k].nm+'　（黒いふち＝「おうち」の音）';pressSc()}
function pressSc(){Array.prototype.forEach.call($('mbtns').children,function(b){if(SK[b.dataset.k])b.setAttribute('aria-pressed',SK[b.dataset.k]===curSc?'true':'false')})}
function scBtn(k,t){return {t:t,f:function(){var s=SK[k];setScale(s);heard[s]=1;playMel(false);gate()}}}
var BTN={
 sa:scBtn('sa','🌞 あかるい'),sj:scBtn('sj','🎌 日本風'),so:scBtn('so','🌺 沖縄風'),sb:scBtn('sb','🎷 ブルース'),sm:scBtn('sm','🌧 かなしい'),sw:scBtn('sw','🔮 ふしぎ'),ss:scBtn('ss','💃 スペイン風'),sd:scBtn('sd','🦇 ミステリー'),""")
R("b.onclick=function(){BTN[k].f()};m.appendChild(b)})}","b.onclick=function(){BTN[k].f()};m.appendChild(b)});pressSc()}")
R("function show(i){\n  timers.forEach","function show(i){\n  if(i===0)setScale('a');\n  timers.forEach")
# play with drums false default: playMel(false) ok. again resets via show(0)
open('l38.html','w',encoding='utf8').write(h)
print(len(h))
