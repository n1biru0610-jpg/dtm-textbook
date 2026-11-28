# デイリー作品にスタンプ（いいね）をつける。使い方: python3 _dev/tools/lk_add.py [ファイル...]（省略時は preview/index.html）
import sys
FILES=sys.argv[1:] or ['preview/index.html']
MARK='function dcLkTap('
JS=r"""var LKS=[['👍','いいね'],['❤️','すき'],['🎉','すごい'],['🎵','ノリノリ']],dcLkMine={};
function dcLkRow(li,id){var d=document.createElement('span');d.className='lk';d.setAttribute('role','group');d.setAttribute('aria-label','スタンプ');d.hidden=true;
  LKS.forEach(function(k,i){var b=document.createElement('button');b.type='button';b.dataset.i=i;b.dataset.id=id;b.innerHTML=k[0]+'<i>0</i>';b.title=k[1];dcLkSet(b,0,false);b.onclick=function(){dcLkTap(this)};d.appendChild(b)});li.appendChild(d)}
function dcLkSet(b,n,on){b.querySelector('i').textContent=n;b.setAttribute('aria-pressed',on?'true':'false');b.classList.toggle('on',on);b.setAttribute('aria-label',LKS[b.dataset.i][1]+' '+n+(on?'（おしたよ）':''))}
function dcLkLoad(ids){if(!ids.length)return;var tk=ACC?tokOK().catch(function(){return null}):Promise.resolve(null);
  tk.then(function(t){return sbf('/rest/v1/daily_likes?entry_id=in.('+ids.join(',')+')&select=entry_id,stamp,user_id&limit=10000',{},t)}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(a){
    var c={},me=ACC&&ACC.uid;dcLkMine={};(a||[]).forEach(function(x){var k=x.entry_id+'|'+x.stamp;c[k]=(c[k]||0)+1;if(me&&x.user_id===me)dcLkMine[k]=1});
    [].forEach.call(document.querySelectorAll('#dcL .lk'),function(d){d.hidden=false;[].forEach.call(d.children,function(b){var k=b.dataset.id+'|'+b.dataset.i;dcLkSet(b,c[k]||0,!!dcLkMine[k])})})}).catch(function(){})}
function dcLkTap(b){var m=$('dcMs');if(!ACC){if(m)m.textContent='スタンプは、ログインするとおせるよ。';return}
  if(b.disabled)return;var k=b.dataset.id+'|'+b.dataset.i,on=!dcLkMine[k],n0=+b.querySelector('i').textContent;b.disabled=true;
  dcLkSet(b,Math.max(0,n0+(on?1:-1)),on);if(on){dcLkMine[k]=1;try{sfx('add')}catch(e){}}else delete dcLkMine[k];
  tokOK().then(function(t){var st=+b.dataset.i;return on?sbf('/rest/v1/daily_likes',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({entry_id:b.dataset.id,stamp:st})},t)
    :sbf('/rest/v1/daily_likes?entry_id=eq.'+encodeURIComponent(b.dataset.id)+'&stamp=eq.'+st+'&user_id=eq.'+encodeURIComponent(ACC.uid),{method:'DELETE',headers:{Prefer:'return=minimal'}},t)})
  .then(function(r){if(!r.ok&&!(on&&r.status===409))throw 0}).catch(function(){dcLkSet(b,n0,!on);if(on)delete dcLkMine[k];else dcLkMine[k]=1;if(m)m.textContent='スタンプを送れなかったよ。もう一度ためしてね。'})
  .then(function(){b.disabled=false})}
"""
CSS="#dc .dg li{flex-wrap:wrap}#dc .dg .lk{flex-basis:100%;display:flex;gap:6px;flex-wrap:wrap;margin:2px 0 2px}#dc .dg .lk[hidden]{display:none}#dc .dg .lk button{background:#f3effc;color:#3b2f6b;border:2px solid #e3dcf5;padding:3px 10px;font-size:15px;min-height:36px;min-width:52px}#dc .dg .lk button i{font-style:normal;margin-left:4px;font-size:13px}#dc .dg .lk button.on{background:#ffe9a8;border-color:#e0a400;color:#2a2100}#dc .dg .lk button:focus-visible{outline:3px solid #5b4fd6;outline-offset:2px}"
R=[("ol.appendChild(li)})}).catch(function(e){if(!$('dcMs'))return;","dcLkRow(li,e.id);ol.appendChild(li)});dcLkLoad(L.map(function(e){return e.id}))}).catch(function(e){if(!$('dcMs'))return;"),
   ("function dcListen(",JS+"function dcListen("),
   ("#dc .dg{max-height:36vh}","#dc .dg{max-height:36vh}"+CSS),
   ("L.length+'人の作品があるよ。「♪きく」でDAWにひらけるよ（きくだけで、保存はされないよ）。'","L.length+'人の作品があるよ。「♪きく」でDAWにひらけるよ（きくだけで、保存はされないよ）。気に入ったら👍などのスタンプをおしてね。'")]
for f in FILES:
    s=open(f,encoding='utf8').read()
    if MARK in s:print(f,'already');continue
    for o,n in R:
        c=s.count(o)
        if c!=1:sys.exit('%s: count %d for %r'%(f,c,o[:50]))
        s=s.replace(o,n)
    open(f,'w',encoding='utf8').write(s);print(f,'ok')
