# ステップ7：きせかえ（スキン）を10こ足す。index.html と preview/index.html。何回実行しても同じ
# それぞれ：id, 名前, 絵文字, 説明, 条件(need=ログイン日数 / title=称号id), bg, panel, ink, sub, blue(アクセント), line, もよう(SVG の中身・色は currentColor でなく固定)
import urllib.parse
SK=[
 ('umi','うみ','🌊','ログイン5日で',{'need':5},'#e3f3fb','#ffffff','#10324a','#3f6478','#0d6fa8','#b5dcef','<path d="M0 30q10-8 20 0t20 0" fill="none" stroke="#0d6fa8" stroke-width="2"/>'),
 ('lemon','レモン','🍋','ログイン10日で',{'need':10},'#fdf8d8','#ffffff','#3a3300','#6d6420','#8a6d00','#efe29a','<circle cx="20" cy="20" r="5" fill="none" stroke="#8a6d00" stroke-width="2"/>'),
 ('lavender','ラベンダー','💜','ログイン20日で',{'need':20},'#f1ebfb','#ffffff','#2e1f4a','#5f4f7f','#6a42c2','#d6c8f0','<path d="M20 12v16M16 16l4-4 4 4" fill="none" stroke="#6a42c2" stroke-width="2"/>'),
 ('momiji','もみじ','🍁','ログイン45日で',{'need':45},'#fbeadf','#ffffff','#3f1d0e','#7a4a33','#b5400f','#efc2a6','<path d="M20 10l3 7 7-2-4 6 5 4-8 0-3 7-3-7-8 0 5-4-4-6 7 2z" fill="#b5400f"/>'),
 ('yuki','ゆきげしき','❄️','ログイン80日で',{'need':80},'#eef4f8','#ffffff','#1b2a36','#4d6070','#3a6ea5','#cfdce6','<path d="M20 12v16M13 16l14 8M13 24l14-8" stroke="#3a6ea5" stroke-width="2"/>'),
 ('score','五線紙','🎼','称号『図鑑の たび人』で',{'title':'z10'},'#fbf7ee','#fffdf7','#2b2418','#5f5440','#7a4b12','#e5d9bd','<path d="M0 8h40M0 14h40M0 20h40M0 26h40M0 32h40" stroke="#7a4b12" stroke-width="1"/>'),
 ('hoshi','星のおと','✨','称号『図鑑の けんきゅう家』で',{'title':'z30'},'#0b0e24','#141a3a','#f1f3ff','#b8c0ea','#9a6a00','#34407a','<path d="M20 12l2 6 6 2-6 2-2 6-2-6-6-2 6-2z" fill="#ffd166"/>'),
 ('choco','ショコラ','🍫','称号『コードの まほうつかい』で',{'title':'chd'},'#f3e7dc','#fffaf5','#2e1a0e','#6b4c38','#8a4b22','#ddc3ad','<rect x="12" y="12" width="16" height="16" rx="3" fill="none" stroke="#8a4b22" stroke-width="2"/>'),
 ('neon','ネオンのまち','🌃','称号『DAWの みならい』で',{'title':'dw5'},'#0a0a14','#16162a','#f4f0ff','#c0b8e0','#d6307c','#3a3a5e','<path d="M8 32v-8h6v-6h6v10h6v-14h6v18" fill="none" stroke="#ff5fa2" stroke-width="2"/>'),
 ('sora','おおぞら','☁️','称号『お題の たつじん』で',{'title':'f10'},'#e6f1ff','#ffffff','#132a4a','#465f80','#1f5fbf','#bcd4f2','<path d="M10 26a5 5 0 0 1 4-8 7 7 0 0 1 13 1 4 4 0 0 1 3 7z" fill="#1f5fbf"/>'),
]
def lum(h):
    h=h.lstrip('#');r,g,b=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    f=lambda c:c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4
    return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b)
def cr(a,b):
    x,y=lum(a),lum(b);return (max(x,y)+0.05)/(min(x,y)+0.05)
bad=[]
for s in SK:
    i,n,ic,d,c,bg,pn,ink,sub,bl,ln,pat=s
    for nm,a,b,need in [('ink/bg',ink,bg,4.5),('ink/panel',ink,pn,4.5),('sub/panel',sub,pn,4.5),('sub/bg',sub,bg,4.5),('blue/panel',bl,pn,3.5),('blue/bg',bl,bg,3.5)]:
        if cr(a,b)<need: bad.append((i,nm,round(cr(a,b),2)))
    # ボタン（--blue の上の白い字）
    if cr(bl,'#ffffff')<4.5: bad.append((i,'white/blue',round(cr(bl,'#ffffff'),2)))
if __name__=='__main__':
    import sys
    if bad: print('コントラスト不足',bad)
css=''
js=''
for s in SK:
    i,n,ic,d,c,bg,pn,ink,sub,bl,ln,pat=s
    svg='<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40"><g opacity=".09">'+pat+'</g></svg>'
    u="url(\"data:image/svg+xml,"+urllib.parse.quote(svg,safe='')+"\")"
    css+='body.sk-%s{--bg:%s;--panel:%s;--ink:%s;--sub:%s;--blue:%s;--line:%s}body.skx.sk-%s #home{background:%s %s repeat!important}\n'%(i,bg,pn,ink,sub,bl,ln,i,bg,u)
    cond=("need:%d"%c['need']) if 'need' in c else ("title:'%s'"%c['title'])
    js+=",\n {id:'%s',n:'%s',ic:'%s',d:'%s',%s,c:['%s','%s','%s']}"%(i,n,ic,d,cond,bg,bl,pn)
A_CSS="body.sk-gb{--bg:#c9d9a2;--panel:#e0efbf;--ink:#1f2d10;--sub:#4a6030;--blue:#306230;--line:#9db36e}"
A_JS=" {id:'gb',n:'ゲームボーイ',ic:'🎮',d:'称号『お題マスター』で',title:'f1',c:['#c9d9a2','#306230','#e0efbf']}"
def run():
    for f in ['index.html','preview/index.html']:
        s=open(f,encoding='utf-8').read()
        if '/*sk7*/' in s:
            a=s.index('/*sk7*/');b=s.index('/*/sk7*/')+len('/*/sk7*/');s=s[:a]+s[b:]
            a=s.index(',/*sk7j*/');b=s.index('/*/sk7j*/')+len('/*/sk7j*/');s=s[:a]+s[b:]
        assert s.count(A_CSS)==1 and s.count(A_JS)==1,f
        s=s.replace(A_CSS,A_CSS+'\n/*sk7*/\n'+css+'/*/sk7*/')
        s=s.replace(A_JS,A_JS+',/*sk7j*/'+js[1:]+'/*/sk7j*/')
        N0="if(nw&&nw.length>=3){accToast('🏅 新しい称号を '+nw.length+'こ ゲット！　「🎒 もちもの」で 見てね');return}"
        N1="if(nw&&nw.length>=3){var k3=BDSK.filter(function(x){return x.title&&nw.some(function(d){return d.id===x.title})});accToast('🏅 新しい称号を '+nw.length+'こ ゲット！'+(k3.length?'　🎨 きせかえも '+k3.length+'こ！':'')+'　「🎒 もちもの」で 見てね');return}"
        if N1 not in s:
            assert s.count(N0)==1,f; s=s.replace(N0,N1)
        s=s.replace("<small>ホーム画面の色が かわるよ</small>","<small>ホーム画面の色と もようが かわるよ</small>")
        open(f,'w',encoding='utf-8').write(s);print('ok',f)
if __name__=='__main__':
    if bad: sys.exit(1)
    run()
