# 図鑑（_dev/zukan/ の部品）を index.html と preview/index.html に組み込む。何回実行しても同じ結果になる。
# 使い方：リポジトリ直下で  python3 _dev/tools/zk_add.py
import io,os,re
ROOT=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..')
def rd(p):
    p=os.path.join(ROOT,p)
    return io.open(p,encoding='utf8',newline='').read() if os.path.exists(p) else ''
def block(s,begin,end,body,anchor):
    new=begin+body+end
    if begin in s:
        a=s.index(begin); b=s.index(end,a)+len(end)
        return s[:a]+new+s[b:]
    assert s.count(anchor)==1,('anchor',anchor,s.count(anchor))
    return s.replace(anchor,new+anchor,1)
css=rd('_dev/zukan/zukan.css')
html=rd('_dev/zukan/zukan.html').strip('\n')
js=rd('_dev/zukan/cards.js')+rd('_dev/zukan/core.js')+rd('_dev/zukan/ui.js')
assert '</script' not in js
OLD="o.wear=(rNew?(r.wear||a.wear):(a.wear||r.wear))||'';"
NEW="var cd={};[a.cards||{},r.cards||{}].forEach(function(e){for(var k in e){if(e[k]&&(!cd[k]||e[k]<cd[k]))cd[k]=e[k]}});o.cards=cd;/*zk-merge*/\n "
for path in ('index.html','preview/index.html'):
    s=rd(path)
    if '/*zk-merge*/' not in s:
        assert s.count(OLD)==1,'bdMerge'
        s=s.replace(OLD,NEW+OLD,1)
    if css: s=block(s,'<style id="zkcss">\n','</style><!--/zkcss-->\n',css,'</head><body>')
    if html: s=block(s,'<!--zk-->\n','\n<!--/zk-->\n',html,'<div id="chap"></div>')
    if rd('_dev/zukan/ui.js'): s=block(s,'<script id="zkjs">\n','</script><!--/zkjs-->',js,"<script>(function(){try{if(!('serviceWorker' in navigator)")
    io.open(os.path.join(ROOT,path),'w',encoding='utf8',newline='').write(s)
    print('ok',path,len(s))
