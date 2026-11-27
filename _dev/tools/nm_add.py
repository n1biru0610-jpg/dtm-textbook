# アカウント画面から「表示名」を変えられるようにする（ログイン名は変えない）
# 使い方: python3 _dev/tools/nm_add.py   （index.html と preview/index.html に適用。2回目以降は何もしない）
import sys
FILES=['index.html','preview/index.html']
MARK='function myNm(){'
R=[
# 表示名の関数
("function fixNm(){",
 "function myNm(){var p=P();if(p&&p.dn)return p.dn;if(typeof ACC!=='undefined'&&ACC&&ACC.nick)return ACC.nick;return p?p.name:''}\nfunction fixNm(){"),
# 別のPCとの合流で表示名も引きつぐ
("if((rp.u||0)>(lp.u||0)){lp.name=rp.name;",
 "if((rp.u||0)>(lp.u||0)){lp.name=rp.name;if(rp.dn!==undefined)lp.dn=rp.dn;"),
# アカウント画面
("<h2>☁ ログイン中</h2><p>ニックネーム：<b></b>　（学習者：<span id=\"an\"></span>）</p><p>どのPCでも、このニックネームと合言葉でログインすると、続きから遊べるよ。</p>",
 "<h2>☁ ログイン中</h2><p>なまえ：<b id=\"anD\"></b>　<button class=\"btn\" id=\"anE\" type=\"button\">✏️ なまえをかえる</button></p>"
 "<div id=\"anF\" style=\"display:none;margin:6px 0 10px\"><label for=\"anI\" style=\"display:block;font-weight:700;margin-bottom:6px\">あたらしい なまえ（2〜10文字）</label>"
 "<input id=\"anI\" maxlength=\"10\" autocomplete=\"off\" style=\"font:inherit;font-size:20px;padding:10px 14px;border-radius:14px;border:3px solid var(--line);background:var(--bg);color:var(--ink);width:100%;box-sizing:border-box;margin:0 0 8px\">"
 "<div class=\"row2\"><button class=\"btn pri\" id=\"anS\" type=\"button\">この なまえにする</button><button class=\"btn\" id=\"anC\" type=\"button\">やめる</button></div></div>"
 "<p class=\"note\" id=\"anM\" role=\"status\" aria-live=\"polite\"></p>"
 "<p>ログインするときのニックネーム：<b id=\"anL\"></b>（なまえを変えても、ログインはこのニックネームのままだよ）</p>"
 "<p>どのPCでも、このニックネームと合言葉でログインすると、続きから遊べるよ。</p>"),
("pb.querySelector('b').textContent=ACC.nick;$('an').textContent=p?p.name:'';",
 "$('anD').textContent=myNm();$('anL').textContent=ACC.nick;"
 "$('anE').onclick=function(){$('anF').style.display='block';$('anE').style.display='none';$('anI').value=myNm();$('anM').textContent='';$('anI').focus();$('anI').select()};"
 "$('anC').onclick=function(){$('anF').style.display='none';$('anE').style.display='';$('anM').textContent='';$('anE').focus()};"
 "$('anI').onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();$('anS').click()}else if(e.key==='Escape'){e.preventDefault();$('anC').click()}};"
 "$('anS').onclick=function(){var v=$('anI').value.normalize('NFKC').trim(),q=DB.profiles[ACC.pid];"
 "if(v.length<2||v.length>10||/\\s/.test(v)){$('anM').textContent='なまえは、2〜10文字で、あいだに空白を入れないでね。（ひらがなもOK）';$('anI').focus();return}"
 "if(!q)return;q.dn=v;q.name=v;q.u=Date.now();saveDB();pushAcc();chip();try{if(homeOn)renderHome(false)}catch(e){}"
 "$('anD').textContent=v;$('anF').style.display='none';$('anE').style.display='';$('anM').textContent='なまえを「'+v+'」にしたよ ✓';$('anE').focus()};"),
# 表示する場所を表示名に
("$('bdNm').textContent=(ACC&&ACC.nick)||p.name;","$('bdNm').textContent=myNm();"),
("b.children[1].textContent=(ACC&&ACC.nick)||p.name;","b.children[1].textContent=myNm();"),
# 作品ひろば・先生へ送る曲は表示名で
("function dcNick(){var n=rpNick();return (!n||n==='（なし）')?'ななし':n}","function dcNick(){var n=myNm();return n||'ななし'}"),
# ほうこくは、だれか分かるように両方
("function rpNick(){if(ACC&&ACC.nick)return ACC.nick;","function rpNick(){if(ACC&&ACC.nick){var q=P();return (q&&q.dn&&q.dn!==ACC.nick)?q.dn+'（'+ACC.nick+'）':ACC.nick}"),
# 学習者のパネルからも開ける
("<button class=\"btn\" id=\"pmo\">🎒 もちもの</button>';pl.appendChild(x);",
 "<button class=\"btn\" id=\"pmo\">🎒 もちもの</button>'+(ACC?'<button class=\"btn\" id=\"pnm\">✏️ なまえをかえる</button>':'');pl.appendChild(x);if($('pnm'))$('pnm').onclick=function(){accScreen();$('anE').click()};"),
]
for f in FILES:
    s=open(f,encoding='utf8').read()
    if MARK in s: print(f,'already'); continue
    for o,n in R:
        c=s.count(o)
        if c!=1: sys.exit('%s: count %d for %r'%(f,c,o[:60]))
        s=s.replace(o,n)
    open(f,'w',encoding='utf8').write(s); print(f,'ok')
