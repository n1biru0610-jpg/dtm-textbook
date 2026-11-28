# 大きなアップデートのお知らせ（アップデート後にはじめて開いた・ログインした人に1回だけ）
# ログイン中はアカウント（プロフィール p.upd）に、ゲストはこの端末（localStorage）に「見た」を記録する。
# 次のお知らせを出すときは UPD_ID と中身（UPD_HTML）を変えるだけ。
# 使い方: python3 _dev/tools/upd_add.py [ファイル...]（省略時は preview/index.html）
import sys
FILES=sys.argv[1:] or ['preview/index.html']
MARK='function updCheck('
JS=r"""var UPD_ID='2026-11-tac',UPD_HEAD='🎉 アップデートのお知らせ',UPD_TITLE='本物の楽器の音が 40こ ふえたよ！',
 UPD_HTML='<p class="ds">スタジオと「今日のお題」のDAWで、録音した <b>本物の楽器の音</b> が使えるようになったよ。ぜんぶで <b>楽器35こ ＋ ドラム5キット</b>。</p>'
 +'<div class="bdnew"><ul>'
 +'<li><i>🎹</i><span><b>けんばん</b><small>ピアノ・エレピ・チェンバロ・オルガン</small></span></li>'
 +'<li><i>🎻</i><span><b>弦の楽器</b><small>バイオリン・ビオラ・チェロ・コントラバス（はじく音・はねる音も）</small></span></li>'
 +'<li><i>🎸</i><span><b>ギター・ベース</b><small>アコギ・エレキ・クラシックギター・ウクレレ・ハープ・エレキベース</small></span></li>'
 +'<li><i>🎺</i><span><b>管楽器</b><small>サックス・トランペット・ホルン・トロンボーン・フルート・クラリネット・オーボエ・ファゴット・ハーモニカ</small></span></li>'
 +'<li><i>🔔</i><span><b>たたく鍵盤</b><small>グロッケン・ビブラフォン・マリンバ</small></span></li>'
 +'<li><i>🥁</i><span><b>ドラム</b><small>キットが5つ（12このパッド）</small></span></li></ul></div>'
 +'<p class="ds">DAWの右の「インストゥルメント」から、▶ で聴いて「＋ 追加」で使えるよ。前につくった曲は、前の音のままだよ。</p>';
function updSeen(){var p=bdAcc();if(p)return p.upd===UPD_ID;try{return localStorage.getItem('dtm-upd')===UPD_ID}catch(e){return true}}
function updMark(){var p=bdAcc();if(p){p.upd=UPD_ID;p.u=Date.now();saveDB();pushAcc()}else{try{localStorage.setItem('dtm-upd',UPD_ID)}catch(e){}}}
function updCheck(){if(updCheck.done||!homeOn)return;if(ACC&&(!bdSync||!bdAcc()))return;if(ACC){updCheck.t0=updCheck.t0||Date.now();if(String(bdDay).indexOf(dcJst())!==0&&Date.now()-updCheck.t0<20000)return}
  if(['dc','zkGet','prof','sideDlg'].some(function(i){var e=$(i);return e&&e.classList.contains('on')}))return;
  if(updSeen()){updCheck.done=1;return}updCheck.done=1;updMark();updShow()}
function updShow(){var c=$('dcc');dcBack=$('home');
  c.innerHTML='<div class="dh"><span>'+UPD_HEAD+'</span><button class="dx" id="dcX">✕ とじる</button></div><h2 id="dcH" tabindex="-1">'+UPD_TITLE+'</h2>'+UPD_HTML
   +'<div class="db"><button id="updGo" class="pri">🎛 スタジオでためす</button><button id="updLater">あとで</button></div>';
  $('dc').classList.add('on');$('dcX').onclick=dcClose;$('updLater').onclick=dcClose;
  $('updGo').onclick=function(){dcClose();try{openStudio()}catch(e){}};try{sfx('ok')}catch(e){}
  setTimeout(function(){try{$('dcH').focus()}catch(e){}},30)}
setInterval(updCheck,2000);
"""
R=[("function bdWelcome(",JS+"function bdWelcome("),
   ("if((rp.u||0)>(lp.u||0)){lp.name=rp.name;","if(rp.upd)lp.upd=rp.upd;if(rp.lkSeen&&(!lp.lkSeen||rp.lkSeen>lp.lkSeen))lp.lkSeen=rp.lkSeen;if((rp.u||0)>(lp.u||0)){lp.name=rp.name;")]
for f in FILES:
    s=open(f,encoding='utf8').read()
    if MARK in s:print(f,'already');continue
    for o,n in R:
        c=s.count(o)
        if c!=1:sys.exit('%s: count %d for %r'%(f,c,o[:50]))
        s=s.replace(o,n)
    open(f,'w',encoding='utf8').write(s);print(f,'ok')
