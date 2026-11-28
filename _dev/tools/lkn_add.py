# スタンプをもらったら知らせる＋押した人の名前を送る。lk_add.py のあとに使う。
# 使い方: python3 _dev/tools/lkn_add.py [ファイル...]（省略時は preview/index.html）
import sys
FILES=sys.argv[1:] or ['preview/index.html']
MARK='function lkCheck('
JS=r"""function lkPost(id,st,t){var go=function(b){return sbf('/rest/v1/daily_likes',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(b)},t)};
  var b={entry_id:id,stamp:st,nick:String(myNm()||'').slice(0,40)};return go(b).then(function(r){if(r.ok||r.status===409)return r;return r.text().then(function(x){if(!/nick/i.test(x))return {ok:false,status:r.status};delete b.nick;return go(b)})})}
function lkCheck(){var p=bdAcc();if(!p||!ACC||!ACC.uid||lkCheck.busy||document.visibilityState==='hidden')return;lkCheck.busy=1;
  var since=p.lkSeen||'1970-01-01T00:00:00Z',me=encodeURIComponent(ACC.uid);
  tokOK().then(function(t){var q=function(n){return '/rest/v1/daily_likes?select=stamp,created_at,'+n+'daily_entries!inner(user_id,day)&daily_entries.user_id=eq.'+me+'&user_id=neq.'+me+'&created_at=gt.'+encodeURIComponent(since)+'&order=created_at.asc&limit=300'};
    return sbf(q('nick,'),{},t).then(function(r){if(r.ok)return r;return r.text().then(function(x){if(/nick/i.test(x))return sbf(q(''),{},t);throw 0})})})
  .then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(a){if(!a||!a.length)return;var p2=bdAcc();if(!p2)return;
    p2.lkSeen=a[a.length-1].created_at;p2.u=Date.now();saveDB();pushAcc();lkShow(a)}).catch(function(){}).then(function(){lkCheck.busy=0})}
function lkBusy(){return ['dc','zkGet','prof','sideDlg'].some(function(i){var e=$(i);return e&&e.classList.contains('on')})}
function lkShow(a){if(lkBusy()){lkShow.q=(lkShow.q||[]).concat(a);clearTimeout(lkShow.w);lkShow.w=setTimeout(function(){var q=lkShow.q;lkShow.q=null;lkShow(q)},1500);return}var c=[0,0,0,0],nm=[],days={};a.forEach(function(x){c[x.stamp]=(c[x.stamp]||0)+1;if(x.nick&&nm.indexOf(x.nick)<0)nm.push(x.nick);var d=x.daily_entries&&x.daily_entries.day;if(d)days[d]=1});
  var st=LKS.map(function(k,i){return c[i]?k[0]+'×'+c[i]:''}).filter(Boolean).join('　');
  var who=nm.length?nm.slice(0,3).join('さん、')+'さん'+(nm.length>3?' ほか'+(nm.length-3)+'人':'')+'から':'みんなから';
  var dl=Object.keys(days).sort(),day=dl[dl.length-1];
  var w=$('lkT');if(!w){w=document.createElement('div');w.id='lkT';w.setAttribute('role','status');w.setAttribute('aria-live','polite');document.body.appendChild(w)}
  w.innerHTML='<button type="button"><b>🎉 スタンプがとどいたよ！</b><span></span><small>おすと、みんなの作品がひらくよ</small></button><button type="button" class="x" aria-label="とじる">✕</button>';
  w.children[0].children[1].textContent=who+'　'+st;
  w.children[0].onclick=function(){w.classList.remove('on');try{if(typeof dcIn!=='undefined'&&document.body.classList.contains('dm'))openHome();dcBack=$('home');$('dc').classList.add('on');dcGallery(day)}catch(e){}};
  w.children[1].onclick=function(){w.classList.remove('on')};
  w.classList.add('on');try{sfx('ok')}catch(e){}clearTimeout(lkShow.t);lkShow.t=setTimeout(function(){w.classList.remove('on')},12000)}
setInterval(lkCheck,45000);document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')setTimeout(lkCheck,800)});
"""
CSS="#lkT{position:fixed;right:16px;top:70px;z-index:130;display:flex;align-items:flex-start;gap:4px;opacity:0;transform:translateY(-10px);transition:opacity .35s,transform .35s;pointer-events:none}#lkT.on{opacity:1;transform:none;pointer-events:auto}#lkT button{font:inherit;cursor:pointer}#lkT>button:first-child{display:flex;flex-direction:column;gap:2px;text-align:left;background:#fff8e1;color:#2a2100;border:3px solid #f0b400;border-radius:18px;padding:12px 18px;box-shadow:0 8px 26px rgba(0,0,0,.25);max-width:min(420px,80vw)}#lkT b{font-size:18px}#lkT span{font-size:16px;font-weight:700}#lkT small{font-size:12px;color:#6b5100}#lkT .x{background:#fff;color:#2a2100;border:2px solid #f0b400;border-radius:999px;width:36px;height:36px;font-weight:800}#lkT button:focus-visible{outline:3px solid #5b4fd6;outline-offset:2px}@media (prefers-reduced-motion:reduce){#lkT{transition:none}}"
R=[("sbf('/rest/v1/daily_likes',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({entry_id:b.dataset.id,stamp:st})},t)","lkPost(b.dataset.id,st,t)"),
   ("function dcListen(",JS+"function dcListen("),
   ("#dc .dg li{display:flex;align-items:center;gap:10px;background:#fff;border:2px solid #e3dcf5;border-radius:12px;padding:6px 10px;font-size:15px}","#dc .dg li{display:flex;align-items:center;gap:10px;background:#fff;border:2px solid #e3dcf5;border-radius:12px;padding:6px 10px;font-size:15px}"+CSS),
   ("then(function(){bdSync=true;try{bdCheck()}catch(e){}})}","then(function(){bdSync=true;try{bdCheck()}catch(e){}setTimeout(lkCheck,2500)})}"),
   ("bdSync=true;closeProf();chip();hopPos=null;renderHome(false)}","bdSync=true;closeProf();chip();hopPos=null;renderHome(false);setTimeout(lkCheck,2500)}")]
for f in FILES:
    s=open(f,encoding='utf8').read()
    if MARK in s:print(f,'already');continue
    if 'function dcLkTap(' not in s:sys.exit(f+': lk_add.py を先に')
    for o,n in R:
        c=s.count(o)
        if c!=1:sys.exit('%s: count %d for %r'%(f,c,o[:50]))
        s=s.replace(o,n)
    open(f,'w',encoding='utf8').write(s);print(f,'ok')
