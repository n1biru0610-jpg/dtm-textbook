# ステップ7：着せ替え20（アイコンのキャラ10・かざり10）を SVG の絵で足す。index.html と preview/index.html。何回実行しても同じ
# e は 's:〇〇'（保存は今までどおり bd.ic='キャラ|かざり' の文字列。古い版で開くと「なし」になるだけ）
K = '#2b2233'
def S(body):
    return ('<svg class="bdsv" viewBox="0 0 32 32" aria-hidden="true" focusable="false">' + body + '</svg>').replace('K', K)
SW = 'stroke="K" stroke-width="1.6" stroke-linejoin="round"'
EY = lambda x1, x2, y: '<circle cx="%s" cy="%s" r="1.5" fill="K"/><circle cx="%s" cy="%s" r="1.5" fill="K"/>' % (x1, y, x2, y)
CH = [
 ('onpu', 'おんぷの ようせい', 'ログイン2日で', {'need': 2},
  '<path d="M19.5 21V4.5q1 3 5 5t2 8q-1-4-7-5" fill="#ffd23f" ' + SW + '/><ellipse cx="13.5" cy="22" rx="7" ry="5.6" fill="#ffd23f" ' + SW + '/>' + EY(11.3, 15.7, 21.3) + '<path d="M12 24q1.5 1.3 3 0" stroke="K" stroke-width="1.1" fill="none" stroke-linecap="round"/><circle cx="9" cy="23.4" r="1.1" fill="#ff8fa3"/><circle cx="18" cy="23.4" r="1.1" fill="#ff8fa3"/>'),
 ('slime', 'リズムスライム', 'ログイン5日で', {'need': 5},
  '<path d="M4.5 26.5c0-9 5-17.5 11.5-19.5 6.5 2 11.5 10.5 11.5 19.5z" fill="#5ad1b4" ' + SW + '/><ellipse cx="11" cy="15" rx="1.8" ry="3" fill="#fff" opacity=".75"/>' + EY(13, 19, 19.5) + '<path d="M13.5 22.5q2.5 2 5 0" stroke="K" stroke-width="1.2" fill="none" stroke-linecap="round"/>'),
 ('fukuro', 'ふくろうの せんせい', '称号『第1章 クリア』で', {'title': 'ch1'},
  '<path d="M6 7l5 4h10l5-4v14a10 8.5 0 0 1-20 0z" fill="#a5774f" ' + SW + '/><path d="M11 24q5 4 10 0" fill="#e8cfa6"/><circle cx="12" cy="16" r="4" fill="#fff" ' + SW + '/><circle cx="20" cy="16" r="4" fill="#fff" ' + SW + '/><circle cx="12.5" cy="16.3" r="1.7" fill="K"/><circle cx="19.5" cy="16.3" r="1.7" fill="K"/><path d="M14.5 19.5h3l-1.5 2.6z" fill="#f2a33a" stroke="K" stroke-width="1"/>'),
 ('metro', 'メトロノームくん', '称号『第2章 クリア』で', {'title': 'ch2'},
  '<path d="M11.5 4h9l5.5 23H6z" fill="#c0643a" ' + SW + '/><path d="M6 27h20" stroke="K" stroke-width="2.4" stroke-linecap="round"/><path d="M16 24L21 7" stroke="#f4efe6" stroke-width="1.8" stroke-linecap="round"/><circle cx="19.6" cy="11.8" r="1.8" fill="#ffd23f" stroke="K" stroke-width="1"/>' + '<circle cx="11.8" cy="19.5" r="1.7" fill="#fff"/><circle cx="11.8" cy="19.6" r=".9" fill="K"/><circle cx="20.6" cy="19.5" r="1.7" fill="#fff"/><circle cx="20.6" cy="19.6" r=".9" fill="K"/>'),
 ('hiyoko', 'うたう ひよこ', '称号『第3章 クリア』で', {'title': 'ch3'},
  '<circle cx="15" cy="19" r="9.5" fill="#ffe066" ' + SW + '/><path d="M14 9.5q-1-4 2-5M15 9.5q2-3 4-2" stroke="K" stroke-width="1.3" fill="none" stroke-linecap="round"/>' + EY(11.5, 17.5, 17) + '<path d="M13 21l2-1.5 2 1.5-2 2.6z" fill="#f2833a" stroke="K" stroke-width="1"/><path d="M26 4v6.5" stroke="K" stroke-width="1.5"/><ellipse cx="24.6" cy="11" rx="2" ry="1.5" fill="K"/>'),
 ('piano', 'けんばんの ピアノン', '称号『第4章 クリア』で', {'title': 'ch4'},
  '<rect x="4" y="6.5" width="24" height="20" rx="4" fill="#3a3550" ' + SW + '/><rect x="6" y="16" width="20" height="8.5" fill="#fff"/><path d="M10 16v8.5M14 16v8.5M18 16v8.5M22 16v8.5" stroke="K" stroke-width="1"/><path d="M9 16h2v5H9zM13 16h2v5h-2zM21 16h2v5h-2z" fill="K"/><circle cx="12" cy="11.2" r="1.6" fill="#fff"/><circle cx="20" cy="11.2" r="1.6" fill="#fff"/><path d="M14.4 13.2q1.6 1.2 3.2 0" stroke="#fff" stroke-width="1.1" fill="none" stroke-linecap="round"/>'),
 ('drum', 'たいこの ドンちゃん', '称号『投稿の常連』で', {'title': 'p5'},
  '<path d="M20 2.5l-4.5 8M27 5l-8 5.5" stroke="#c8935a" stroke-width="2.2" stroke-linecap="round"/><path d="M6 13v11a10 3.5 0 0 0 20 0V13" fill="#e34b4b" ' + SW + '/><ellipse cx="16" cy="13" rx="10" ry="3.5" fill="#f4efe6" ' + SW + '/><path d="M6.5 26h19" stroke="#ffd23f" stroke-width="1.4"/><circle cx="12.5" cy="19" r="1.8" fill="#fff"/><circle cx="12.6" cy="19.1" r=".95" fill="K"/><circle cx="19.5" cy="19" r="1.8" fill="#fff"/><circle cx="19.4" cy="19.1" r=".95" fill="K"/><path d="M14.5 22q1.5 1.2 3 0" stroke="#fff" stroke-width="1.1" fill="none" stroke-linecap="round"/>'),
 ('kujira', 'うたう くじら', 'ログイン21日で', {'need': 21},
  '<path d="M3.5 18c0-5 5-8.5 11-8.5 6.5 0 10.5 3.5 11.5 7.5l3-4-.4 7.5-3.6 1.2c-2 3-6 5-10.5 5-6.5 0-11-3.8-11-8.7z" fill="#4b8fe0" ' + SW + '/><path d="M5.5 21q5 4.5 15 2" stroke="#cfe3fb" stroke-width="2" fill="none" stroke-linecap="round"/><circle cx="10" cy="16" r="1.3" fill="K"/><path d="M13.5 9c0-2-1.6-3-3-4.2M13.5 9c0-2 1.6-3 3-4.2" stroke="#4b8fe0" stroke-width="1.6" fill="none" stroke-linecap="round"/>'),
 ('deshi', 'まほうつかいの でし', '称号『コードの まほうつかい』で', {'title': 'chd'},
  '<circle cx="16" cy="21.5" r="7.5" fill="#ffd9b8" ' + SW + '/><path d="M8.5 15.5L17 2.5l6.8 13z" fill="#5b3fa6" ' + SW + '/><ellipse cx="16" cy="15.5" rx="10" ry="2.4" fill="#5b3fa6" ' + SW + '/><path d="M16.5 7.5l.8 1.7 1.8.2-1.4 1.2.4 1.8-1.6-.9-1.6.9.4-1.8-1.4-1.2 1.8-.2z" fill="#ffd23f"/>' + EY(13.3, 18.7, 21) + '<path d="M14.3 24q1.7 1.3 3.4 0" stroke="K" stroke-width="1.1" fill="none" stroke-linecap="round"/>'),
 ('tsuki', 'つきの うさぎ', 'ログイン50日で', {'need': 50},
  '<path d="M25 2.5a5 5 0 1 0 4.5 7.5 4 4 0 1 1-4.5-7.5z" fill="#ffd23f" stroke="K" stroke-width="1.1"/><ellipse cx="12.2" cy="9" rx="2.6" ry="6.4" fill="#fff" ' + SW + '/><ellipse cx="19.8" cy="9" rx="2.6" ry="6.4" fill="#fff" ' + SW + '/><ellipse cx="12.2" cy="9.5" rx="1.1" ry="4" fill="#ffb3c4"/><ellipse cx="19.8" cy="9.5" rx="1.1" ry="4" fill="#ffb3c4"/><circle cx="16" cy="21" r="8" fill="#fff" ' + SW + '/>' + EY(13.2, 18.8, 20) + '<path d="M15 23l1 .8 1-.8" stroke="K" stroke-width="1.1" fill="none" stroke-linecap="round"/><circle cx="11" cy="23" r="1.2" fill="#ffb3c4"/><circle cx="21" cy="23" r="1.2" fill="#ffb3c4"/>'),
]
AC = [
 ('gclef', 'ト音記号の かみかざり', 'ログイン4日で', {'need': 4},
  '<path d="M15 29c-3 0-3.5-3.5-1-3.8 2-.2 2.5 2.4.6 3M16.5 27V3.5c3.5 2.5 3.5 7-.6 10-4.3 3.2-5.2 6.6-3 9.4 2.2 2.8 7.6 1.8 7.4-2.2-.2-3-3.4-4-5.4-2.8-1.7 1-1.4 3.4.4 3.8" fill="none" stroke="#fff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 29c-3 0-3.5-3.5-1-3.8 2-.2 2.5 2.4.6 3M16.5 27V3.5c3.5 2.5 3.5 7-.6 10-4.3 3.2-5.2 6.6-3 9.4 2.2 2.8 7.6 1.8 7.4-2.2-.2-3-3.4-4-5.4-2.8-1.7 1-1.4 3.4.4 3.8" fill="none" stroke="#4a2a8a" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>'),
 ('suzu', 'すず', 'ログイン10日で', {'need': 10},
  '<path d="M11 5.5q5-3 10 0" stroke="#d63b3b" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M16 6c-5 0-7.5 4-7.5 9v4.5L6.5 23h19l-2-3.5V15c0-5-2.5-9-7.5-9z" fill="#ffcf3a" ' + SW + '/><circle cx="16" cy="25.5" r="2.3" fill="#c58a00" stroke="K" stroke-width="1.2"/><path d="M12 11.5q1-2 3-2.5" stroke="#fff" stroke-width="1.4" fill="none" stroke-linecap="round"/>'),
 ('clover', 'よつばの クローバー', 'ログイン25日で', {'need': 25},
  '<path d="M16 16q2 7 6 11" stroke="#2e7d32" stroke-width="2" fill="none" stroke-linecap="round"/><g fill="#3aa655" stroke="K" stroke-width="1.3"><circle cx="11.5" cy="11.5" r="4.6"/><circle cx="20.5" cy="11.5" r="4.6"/><circle cx="11.5" cy="20" r="4.6"/><circle cx="20.5" cy="20" r="4.6"/></g><circle cx="16" cy="15.8" r="1.6" fill="#8fdc95"/>'),
 ('mikazuki', 'みかづき', 'ログイン40日で', {'need': 40},
  '<path d="M19 3a12 12 0 1 0 10 18A10 10 0 1 1 19 3z" fill="#ffd23f" ' + SW + '/><circle cx="14" cy="19" r="1.1" fill="K"/><path d="M12 23q2 1.4 4 .2" stroke="K" stroke-width="1.1" fill="none" stroke-linecap="round"/>'),
 ('tsue', 'ほしの つえ', '称号『図鑑の たび人』で', {'title': 'z10'},
  '<path d="M5 28L18.5 14.5" stroke="K" stroke-width="4" stroke-linecap="round"/><path d="M5 28L18.5 14.5" stroke="#9b6a3c" stroke-width="2.2" stroke-linecap="round"/><path d="M22 3.5l2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5L14.8 8.8l5-.7z" fill="#ffd23f" ' + SW + '/>'),
 ('shiori', '図鑑の しおり', '称号『図鑑の けんきゅう家』で', {'title': 'z30'},
  '<path d="M10 3h12v25l-6-5-6 5z" fill="#b8322a" ' + SW + '/><path d="M12.5 7h7" stroke="#ffd23f" stroke-width="1.5"/><path d="M16 11.5l1 2 2.2.3-1.6 1.5.4 2.2-2-1.1-2 1.1.4-2.2-1.6-1.5 2.2-.3z" fill="#ffd23f"/>'),
 ('boushi', 'まほうの ぼうし', '称号『DAWの みならい』で', {'title': 'dw5'},
  '<path d="M7 24L17 3l8 21z" fill="#2f6fd6" ' + SW + '/><ellipse cx="16" cy="24.5" rx="13" ry="3.6" fill="#2f6fd6" ' + SW + '/><path d="M9.5 19.5q7 2.6 13.5 0" stroke="#ffd23f" stroke-width="2.2" fill="none"/><circle cx="16" cy="12" r="1.5" fill="#ffd23f"/><circle cx="19.5" cy="15.5" r="1" fill="#fff"/>'),
 ('rappa', 'きんの らっぱ', '称号『おとの職人』で', {'title': 'p10'},
  '<path d="M3.5 14.5h14l9-7v17l-9-7h-14z" fill="#f5c23a" ' + SW + '/><path d="M8 17.5v4h3v-4M12.5 17.5v4" stroke="K" stroke-width="1.4" fill="none"/><path d="M28 9q2 7 0 14" stroke="#f5c23a" stroke-width="2" fill="none" stroke-linecap="round"/>'),
 ('niji', 'にじ', '称号『お題ハンター』で', {'title': 'f5'},
  '<g fill="none" stroke-width="3" stroke-linecap="round"><path d="M3.5 25a12.5 12.5 0 0 1 25 0" stroke="#e53935"/><path d="M7 25a9 9 0 0 1 18 0" stroke="#fbc02d"/><path d="M10.5 25a5.5 5.5 0 0 1 11 0" stroke="#43a047"/><path d="M13.8 25a2.2 2.2 0 0 1 4.4 0" stroke="#1e88e5"/></g><path d="M2 25.2a14 14 0 0 1 28 0" fill="none" stroke="K" stroke-width="1"/>'),
 ('hane', 'はねペン', '称号『第5章 クリア』で', {'title': 'ch5'},
  '<path d="M27 3C17 5 9 13 7 25l3-1c1-4 3-7 6-9-2 3-3.5 5.5-4.5 8.5C20 22 25 14 27 3z" fill="#f4efe6" ' + SW + '/><path d="M27 3L8 26" stroke="K" stroke-width="1.2"/><path d="M8 26l-3 3.5" stroke="K" stroke-width="2" stroke-linecap="round"/>'),
]
def js_list(L):
    out = ''
    for i, n, d, c, b in L:
        cond = ("need:%d" % c['need']) if 'need' in c else ("title:'%s'" % c['title'])
        out += ",\n {e:'s:%s',n:'%s',%s,d:'%s',sv:'%s'}" % (i, n, cond, d, S(b))
    return out
A_CH = "{e:'🤖',n:'ロボット',title:'p2',d:'称号『地道な成功』で'}"
A_AC = "{e:'⭐',n:'ほし',title:'f1',d:'称号『お題マスター』で'}"
R = [
 ("var nsk=bdSkNew(n,nw);var nx=", "var nsk=bdSkNew(n,nw),nic=bdIcNew(n,nw);var nx="),
 ("<small>ホーム画面の色と もようが かわるよ</small></span></li>'}).join('')+'</ul></div>':'')+'<div class=\"dt\">",
  "<small>ホーム画面の色と もようが かわるよ</small></span></li>'}).join('')+'</ul></div>':'')+(nic.length?'<div class=\"bdnew\" role=\"status\"><b>🎭 新しいアイコンをゲット！</b><ul>'+nic.map(function(x){return '<li><i>'+(x.sv||x.e)+'</i><span><b>'+dcEsc(x.n)+'</b><small>アイコンの きがえに 使えるよ</small></span></li>'}).join('')+'</ul></div>':'')+'<div class=\"dt\">"),
 ("$('bdSh').onclick=function(){bdShow(nsk.length?'sk':'')};", "$('bdSh').onclick=function(){bdShow(nsk.length?'sk':nic.length?'ic':'')};"),

 ("+'\" style=\"background:'+col+'\"><i>'+(i.c||'🙂')+'</i>'+(i.a?'<b>'+i.a+'</b>':'')+'</span>'}",
  "+'\" aria-hidden=\"true\" style=\"background:'+col+'\"><i>'+(bdGl(BDCH,i.c)||'🙂')+'</i>'+(i.a?'<b>'+bdGl(BDAC,i.a)+'</b>':'')+'</span>'}"),
 ("+'\">'+(x.e||'✖')+(ok?'':'<u>🔒</u>')+'</button></li>'",
  "+'\">'+(x.sv||x.e||'✖')+(ok?'':'<u>🔒</u>')+'</button></li>'"),
]
FN = "/*ic7f*/function bdGl(L,e){var x=L.filter(function(y){return y.e===e})[0];return x?(x.sv||x.e):''}function bdIcT(nw){var n=BDCH.concat(BDAC).filter(function(x){return x.title&&nw.some(function(d){return d.id===x.title})}).length;return n?'　🎭 アイコンも '+n+'こ！':''}function bdIcNew(n,nw){return BDCH.concat(BDAC).filter(function(x){return x.e&&(x.need?x.need===n:!!x.title&&nw.some(function(d){return d.id===x.title}))})}/*/ic7f*/\n"
N_A = ("+(k3.length?'　🎨 きせかえも '+k3.length+'こ！':'')+'　「🎒 もちもの」で 見てね')",
       "+(k3.length?'　🎨 きせかえも '+k3.length+'こ！':'')+bdIcT(nw)+'　「🎒 もちもの」で 見てね')")
N_B = ("+(k.length?'　🎨 きせかえ『'+k.map(function(x){return x.n}).join('』『')+'』も！':''))}}",
       "+(k.length?'　🎨 きせかえ『'+k.map(function(x){return x.n}).join('』『')+'』も！':'')+bdIcT(nw))}}")
CSS_A = ".avx{position:relative;display:inline-flex;align-items:center;justify-content:center;flex:none;overflow:visible}"
CSS = "/*ic7c*/.bdpk button.w{border-width:3px}.bdpk button.w::after{content:'✔';position:absolute;left:2px;top:0;font-size:11px;line-height:1;color:#1f9d6b;font-weight:900}.bdnew li i .bdsv{width:1.2em;height:1.2em}.bdsv{width:1.15em;height:1.15em;display:block}.avx b .bdsv{width:1.05em;height:1.05em}.bdpk button .bdsv{margin:auto}/*/ic7c*/"
def run():
    for f in ['index.html', 'preview/index.html']:
        s = open(f, encoding='utf-8').read()
        for m in ['ic7a', 'ic7b']:
            if ',/*%s*/' % m in s:
                a = s.index(',/*%s*/' % m); b = s.index('/*/%s*/' % m) + len('/*/%s*/' % m); s = s[:a] + s[b:]
        if '/*ic7f*/' in s:
            a = s.index('/*ic7f*/'); b = s.index('/*/ic7f*/') + len('/*/ic7f*/') + 1; s = s[:a] + s[b:]
        if '/*ic7c*/' in s:
            a = s.index('/*ic7c*/'); b = s.index('/*/ic7c*/') + len('/*/ic7c*/'); s = s[:a] + s[b:]
        assert s.count(A_CH) == 1 and s.count(A_AC) == 1 and s.count(CSS_A) == 1, f
        s = s.replace(A_CH, A_CH + ',/*ic7a*/' + js_list(CH)[1:] + '/*/ic7a*/')
        s = s.replace(A_AC, A_AC + ',/*ic7b*/' + js_list(AC)[1:] + '/*/ic7b*/')
        s = s.replace(CSS_A, CSS_A + CSS)
        F0 = 'function bdIc(b){'
        assert s.count(F0) == 1, f
        s = s.replace(F0, FN + F0)
        for a, b in R + [N_A, N_B]:
            if b not in s:
                assert s.count(a) == 1, (f, a[:40]); s = s.replace(a, b)
        open(f, 'w', encoding='utf-8').write(s); print('ok', f)
if __name__ == '__main__':
    run()
