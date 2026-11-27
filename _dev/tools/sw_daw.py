# スウィング（ステップ8）を DAW（DAW_HTML）に組み込む。何回実行しても同じ結果になる。
# 使い方：リポジトリ直下で  python3 _dev/tools/sw_daw.py
import io,os,json
ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..')
inner=io.open(os.path.join(ROOT,'_dev/swing/sw_inner.js'),encoding='utf8').read()
B='/*sw-begin*/\n';E='/*sw-end*/\n'
def patch(h):
    def rep(o,n):
        nonlocal h
        if n in h: return
        assert h.count(o)==1,(o[:70],h.count(o))
        h=h.replace(o,n)
    # 1 ボタン（ピアノロールの上の帯）
    rep('<button class="tbn" id="dupBtn">','<button class="tbn" id="swBtn" type="button" aria-haspopup="menu" title="スウィング（はねるリズム）" hidden>〰 スウィング：<b>なし</b></button><button class="tbn" id="dupBtn">')
    # 2 見た目
    rep('#inspBtn,#smBulk,#dupBtn{white-space:nowrap;flex:none;margin-left:6px}','#inspBtn,#smBulk,#dupBtn,#swBtn{white-space:nowrap;flex:none;margin-left:6px}#swBtn{width:auto;padding:0 10px;height:24px;display:inline-flex;align-items:center;font-weight:800}#inspBtn,#smBulk{width:auto;padding:0 8px}#swBtn b{color:var(--sun,#ffc531);font-weight:800}.swl{position:absolute;top:0;bottom:0;width:0;border-left:2px dotted rgba(255,197,49,.6);pointer-events:none}')
    # 3 本体
    A='/* ---------- ピアノロール ---------- */'
    if B in h:
        a=h.index(B);b=h.index(E)+len(E);h=h[:a]+B+inner+E+h[b:]
    else:
        assert h.count(A)==1;h=h.replace(A,A+'\n'+B+inner+E)
    # 4 ピアノロールを描くとき：ボタンの表示と、ずれて鳴る位置の点線
    rep("$('inspBtn').hidden=!free}catch(_){}","$('inspBtn').hidden=!free;swUI()}catch(_){}")
    rep("  c.notes.forEach(function(n){var e=document.createElement('div');e.className='nt';","  [].slice.call(g.querySelectorAll('.swl')).forEach(function(x){x.remove()});if(c.sw>0){var sg=c.swg===1?1:2;for(var q=sg;q<steps;q+=2*sg){var sl=document.createElement('div');sl.className='swl';sl.style.left=(swW(c,q)*cw)+'px';g.appendChild(sl)}}\n  c.notes.forEach(function(n){var e=document.createElement('div');e.className='nt';")
    # 5 再生
    rep("c.notes.forEach(function(n){var fs=Math.floor(n.s+1e-9);if(fs===ls){var off=(n.s-fs)*sd();","c.notes.forEach(function(n){var ns=c.sw?swW(c,n.s):n.s,fs=Math.floor(ns+1e-9);if(fs===ls){var off=(ns-fs)*sd();")
    rep("else tone(n.p+(t.oct||0)*12,nextT+off,n.l*sd()*.95*(t.len||1),t.inst);OUT=O0}","else tone(n.p+(t.oct||0)*12,nextT+off,(c.sw?swW(c,n.s+n.l)-ns:n.l)*sd()*.95*(t.len||1),t.inst);OUT=O0}")
    # 6 MIDI書き出し（ほかのDAWでも同じノリで鳴るように、ずらした位置で書く）
    rep("a=Math.round((c.s*16+n.s)*U),l=Math.max(30,Math.round(n.l*U));","a=Math.round((c.s*16+swW(c,n.s))*U),l=Math.max(30,Math.round((swW(c,n.s+n.l)-swW(c,n.s))*U));")
    # 7 クリップを2つに分けたとき
    rep("var d={s:at,l:c.l-l1,notes:B};","var d={s:at,l:c.l-l1,notes:B};if(c.sw){d.sw=c.sw;if(c.swg===1)d.swg=1}")
    # 8 ほかの人の作品を聴くとき（お題の提出）
    rep("var cl={s:Math.max(0,Math.min(200,+c.s||0)),l:Math.max(1,Math.min(64,+c.l||1)),notes:[]};","var cl={s:Math.max(0,Math.min(200,+c.s||0)),l:Math.max(1,Math.min(64,+c.l||1)),notes:[]};var sw0=Math.round(+c.sw||0);if(sw0>0){cl.sw=Math.min(100,sw0);if(c.swg===1)cl.swg=1}")
    return h
for path in ('index.html','preview/index.html'):
    p=os.path.join(ROOT,path);s=io.open(p,encoding='utf8',newline='').read()
    a=s.index('var DAW_HTML="')+len('var DAW_HTML=');j=a+1
    while True:
        c=s[j]
        if c=='\\': j+=2; continue
        if c=='"': break
        j+=1
    lit=s[a:j+1];h=json.loads(lit)
    assert json.dumps(h,ensure_ascii=False).replace('</','<\\/')==lit
    h=patch(h)
    s=s[:a]+json.dumps(h,ensure_ascii=False).replace('</','<\\/')+s[j+1:]
    io.open(p,'w',encoding='utf8',newline='').write(s);print('ok',path,len(s))
