# ステップ7：新しい称号5つを bdDefs に足す（index.html と preview/index.html。何回実行しても同じ）
import sys
A=" a.push({id:'f5',g:'post',n:'お題ハンター',ic:'🎯',d:'お題を全部クリアして投稿したのが5回になった',t:function(b){return bdFull(b)>=5}});\n"
NEW=(" /*ti7*/a.push({id:'chd',g:'learn',n:'コードの まほうつかい',ic:'🪄',d:'第4章の 4-6・4-7・4-8 を全部クリアした',t:function(){return ['4-6','4-7','4-8'].every(isDone)}});"
 "a.push({id:'dw5',g:'learn',n:'DAWの みならい',ic:'🎛',d:'DAW編のレッスンを5つクリアした',t:function(b,p){return !!(p&&p.dw)&&Object.keys(p.dw).filter(function(k){return /^D-\\d+$/.test(k)&&p.dw[k]}).length>=5}});"
 "a.push({id:'z10',g:'learn',n:'図鑑の たび人',ic:'📖',d:'図鑑のカードを10枚あつめた',t:function(){return Object.keys(zkOwned()).length>=10}});"
 "a.push({id:'z30',g:'learn',n:'図鑑の けんきゅう家',ic:'🔍',d:'図鑑のカードを30枚あつめた',t:function(){return Object.keys(zkOwned()).length>=30}});"
 "a.push({id:'f10',g:'post',n:'お題の たつじん',ic:'🌟',d:'お題を全部クリアして投稿したのが10回になった',t:function(b){return bdFull(b)>=10}});/*/ti7*/\n")
for f in ['index.html','preview/index.html']:
    s=open(f,encoding='utf-8').read()
    if '/*ti7*/' in s:
        i=s.index(' /*ti7*/');j=s.index('/*/ti7*/\n')+len('/*/ti7*/\n');s=s[:i]+s[j:]
    assert s.count(A)==1,f
    s=s.replace(A,A+NEW)
    D0="q.dw=q.dw||{})[e.data.dawDone]=1;q.u=Date.now();saveDB()}}"
    D1="q.dw=q.dw||{})[e.data.dawDone]=1;q.u=Date.now();saveDB();try{bdNote(bdEval())}catch(x){}}}"
    if D1 not in s:
        assert s.count(D0)==1,f; s=s.replace(D0,D1)
    N0="function bdNote(nw){if(nw&&nw.length){var k="
    N1="function bdNote(nw){if(nw&&nw.length>=3){accToast('🏅 新しい称号を '+nw.length+'こ ゲット！　「🎒 もちもの」で 見てね');return}if(nw&&nw.length){var k="
    if N1 not in s:
        assert s.count(N0)==1,f; s=s.replace(N0,N1)
    open(f,'w',encoding='utf-8').write(s)
    print('ok',f)
