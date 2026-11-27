# よりみちステージ（_dev/side）を index.html と preview/index.html に組み込む。何回実行しても同じ。
import re,os
R=os.path.join(os.path.dirname(__file__),'..','..')
css=open(os.path.join(R,'_dev/side/side.css'),encoding='utf-8').read().strip()
js=open(os.path.join(R,'_dev/side/side.js'),encoding='utf-8').read().strip()
for fn in ['index.html','preview/index.html']:
    p=os.path.join(R,fn);s=open(p,encoding='utf-8',newline='').read()
    s=re.sub(r'<style id="sidecss">.*?</style><!--/sidecss-->','',s,flags=re.S)
    s=re.sub(r'/\*side\*/.*?/\*/side\*/\n','',s,flags=re.S)
    a='</head><body>';assert s.count(a)==1
    s=s.replace(a,'<style id="sidecss">'+css+'</style><!--/sidecss-->'+a)
    a="pillsR();par()}\nfunction celebrate(n)";assert s.count(a)==1,fn
    s=s.replace(a,"pillsR();par()}\n/*side*/"+js+"\n/*/side*/\nfunction celebrate(n)")
    a="querySelectorAll('.node,.sign')"
    if s.count(a)==1:s=s.replace(a,"querySelectorAll('.node,.sign,.side')")
    assert s.count("querySelectorAll('.node,.sign,.side')")==1,fn
    a="  pillsR();par()}\n/*side*/"
    if "try{sideR()}" not in s:
        assert s.count(a)==1,fn
        s=s.replace(a,"  try{sideR()}catch(e){try{console.warn('sideR',e)}catch(x){}}pillsR();par()}\n/*side*/")
    open(p,'w',encoding='utf-8',newline='').write(s)
    print(fn,'ok')
