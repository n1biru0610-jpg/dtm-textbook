# 図鑑のMIDIパック・音源を DAW（DAW_HTML）に組み込む（ステップ4）。何回実行しても同じ結果になる。
# 使い方：リポジトリ直下で  python3 _dev/tools/zk_daw.py   （zk_add.py のあとでも前でもよい）
import io,os,json,re
ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..')
inner=io.open(os.path.join(ROOT,'_dev/zukan/daw_inner.js'),encoding='utf8').read()
B='/*zkdaw-begin*/\n';E='/*zkdaw-end*/\n'
def patch(h):
    def rep(o,n):
        nonlocal h
        if n in h: return
        assert h.count(o)==1,(o[:60],h.count(o))
        h=h.replace(o,n)
    # 1 本体（音色・もらった素材）
    A='/* ---------- ブラウザ（右のパネル） ---------- */'
    if B in h:
        a=h.index(B);b=h.index(E)+len(E);h=h[:a]+B+inner+E+h[b:]
    else:
        assert h.count(A)==1;h=h.replace(A,B+inner+E+A)
    # 2 addInst が図鑑の音源も探す
    rep("function addInst(id){var d=INSTL.filter(","function addInst(id){var d=INSTL.concat(ZKI).filter(")
    # 3 ブラウザに「もらった素材」
    rep("   ['エフェクト','音を加工する',","   ['もらった素材','図鑑のカードを使う','<svg viewBox=\"0 0 28 28\"><path d=\"M4 6h8a2 2 0 0 1 2 2v14a2 2 0 0 0-2-2H4zM24 6h-8a2 2 0 0 0-2 2v14a2 2 0 0 1 2-2h8z\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linejoin=\"round\"/></svg>',function(l){l.id='zkbl';zkBl(l)}],\n   ['エフェクト','音を加工する',")
    # 4 音源の設定：持っている図鑑の音源（と、いまの音色）を選べる
    rep("var cur=t.inst||'piano',opts=INSTL.filter(function(x){return x[0].indexOf('kit')!==0}).map(","var cur=t.inst||'piano',opts=INSTL.filter(function(x){return x[0].indexOf('kit')!==0}).concat(ZKI.filter(function(x){return zkHasI(x[0])||x[0]===cur})).map(")
    # 5 ほかの人の作品を聴くとき、図鑑の音色も残す
    rep("var ok=['piano','ep','lead','pad','bass','pluck','bell'];","var ok=['piano','ep','lead','pad','bass','pluck','bell','orgel','mokkin','chip'];")
    # 5b ほかの人の作品を聴くとき、オクターブ・音の長さ・強さも残す
    rep("else if(ok.indexOf(t.inst)>0)o.inst=t.inst;","else if(ok.indexOf(t.inst)>0)o.inst=t.inst;if(kd!=='drum'){var oc=Math.round(+t.oct||0);if(oc)o.oct=Math.max(-2,Math.min(2,oc));var ln=+t.len;if(ln&&ln!==1)o.len=Math.max(.5,Math.min(2,ln))}")
    rep("l:Math.max(.25,Math.min(256,+n.l||1))})});o.clips.push(cl)","l:Math.max(.25,Math.min(256,+n.l||1))});var nv=+n.v;if(n.v!=null&&nv>=.05&&nv<.99)cl.notes[cl.notes.length-1].v=nv});o.clips.push(cl)")
    # 6 メッセージ
    rep("window.addEventListener('message',function(e){var d=e.data;if(d&&d.auData){","window.addEventListener('message',function(e){var d=e.data;if(d&&d.zkOwn){if(Array.isArray(d.zkOwn)){ZKOWN=d.zkOwn;zkRb()}return}if(d&&d.auData){")
    rep("else if(d.dawImport)dawImp(d.dawImport);else chLeave();return}","else if(d.dawImport)dawImp(d.dawImport);else chLeave();if(d.zkUse){var zu=d.zkUse;setTimeout(function(){zkUse(zu)},80)}return}")
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
