# お題・作品をきくDAW（dawOnly）では「マップ」をホームへのボタンにする（DAW編のマップに迷いこまない）
import sys
FILES=sys.argv[1:] or ['preview/index.html']
MARK='var onlyM=false;'
R=[("$('mapBtn').onclick=function(){if(free)endFree();setMap(true)};",
    "var onlyM=false;$('mapBtn').onclick=function(){if(onlyM){try{parent.postMessage({dawHome:1},'*')}catch(e){}return}if(free)endFree();setMap(true)};"),
   ("startFree();if(d.dawChallenge)chStart(d.dawChallenge);",
    "onlyM=!!d.dawOnly;$('mapBtn').textContent=onlyM?'🏠 ホーム':'🗺 マップ';startFree();if(d.dawChallenge)chStart(d.dawChallenge);")]
for f in FILES:
    s=open(f,encoding='utf8').read()
    if MARK in s:print(f,'already');continue
    for o,n in R:
        c=s.count(o)
        if c!=1:sys.exit('%s: count %d for %r'%(f,c,o[:50]))
        s=s.replace(o,n)
    open(f,'w',encoding='utf8').write(s);print(f,'ok')
