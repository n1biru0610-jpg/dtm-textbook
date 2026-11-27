s=open('pv0.html',encoding='utf8').read()
def rep(old,new,cnt=1):
    global s
    n=s.count(old)
    assert n==cnt,(old[:70],n)
    s=s.replace(old,new)
css='''#modeTabs #mtC[aria-pressed="true"]{background:#ffc531;color:#2a2100}
body.dm:not(.dmap) #rpBtn{top:auto!important;right:auto!important;left:12px!important;bottom:14px!important;height:40px!important;font-size:15px!important;padding:0 14px!important;opacity:1!important}html.phone body.dm:not(.dmap) #rpBtn{top:auto!important;right:auto!important;left:8px!important;bottom:9px!important;height:34px!important;font-size:13px!important;padding:0 9px!important;opacity:1!important}
#dcCta{position:fixed;top:56px;right:12px;z-index:19;display:none;font:inherit;font-weight:800;font-size:15px;padding:8px 16px;border-radius:22px;border:0;background:#ffc531;color:#2a2100;cursor:pointer;box-shadow:0 3px 0 rgba(0,0,0,.25)}
body.ho #dcCta{display:block}
#dcCta:focus-visible,#dc button:focus-visible,#dc select:focus-visible{outline:4px solid #2c64f0;outline-offset:2px}
#dc{position:fixed;inset:0;z-index:62;display:none;align-items:center;justify-content:center;background:rgba(20,16,40,.82);padding:14px;overflow:auto}
#dc.on{display:flex}
#dc .dcc{width:min(620px,100%);max-height:100%;overflow:auto;background:#fffdf6;color:#2b2540;border-radius:22px;padding:18px 22px 18px;box-shadow:0 14px 50px rgba(0,0,0,.45);font-family:inherit}
#dc .dh{display:flex;justify-content:space-between;align-items:center;gap:10px;font-weight:800;font-size:15px;color:#5b4f86}
#dc .dx{font:inherit;font-weight:800;font-size:14px;padding:6px 12px;border-radius:12px;border:2px solid #cfc7e8;background:#fff;color:#2b2540;cursor:pointer}
#dc h2{margin:8px 0 6px;font-size:22px;outline:none}
#dc .dt{background:#fff3c4;border:2px solid #f0d36a;border-radius:16px;padding:10px 14px}#dc .dt b{font-size:19px}#dc .dt p{margin:4px 0 0;font-size:15px;line-height:1.6}
#dc .dq{margin:10px 0 4px;font-weight:800;font-size:15px}
#dc .dl{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:4px}#dc .dl li{background:#fff;border:2px solid #e3dcf5;border-radius:10px;padding:6px 10px;font-size:15px}
#dc .dr{margin:10px 0 2px;font-weight:800;font-size:15px}#dc .ds{margin:2px 0 8px;font-size:15px;color:#4b4268;line-height:1.5}
#dc .db{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}
#dc .db button{font:inherit;font-weight:800;font-size:16px;padding:11px 18px;border-radius:14px;border:2px solid #cfc7e8;background:#fff;color:#2b2540;cursor:pointer}
#dc .db button.go{background:#2c64f0;border-color:#2c64f0;color:#fff}
#dc select{position:static;font:inherit;font-size:15px;padding:5px 8px;border-radius:8px;border:2px solid #cfc7e8;max-width:100%}
#dc .dg{margin:6px 0 4px;padding:0;list-style:none;display:flex;flex-direction:column;gap:6px;max-height:44vh;overflow:auto}
#dc .dg li{display:flex;align-items:center;gap:10px;background:#fff;border:2px solid #e3dcf5;border-radius:12px;padding:6px 10px;font-size:15px}
#dc .dg .n{font-weight:800;flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#dc .dg .k{font-size:13px;color:#5b4f86;white-space:nowrap}
#dc .dg button{font:inherit;font-weight:800;font-size:14px;padding:6px 12px;border-radius:10px;border:0;background:#ffc531;color:#2a2100;cursor:pointer}
@media (max-height:500px) and (orientation:landscape){#dc{padding:6px}#dc .dcc{padding:10px 14px}#dc h2{font-size:18px;margin:4px 0}#dc .dt{padding:6px 10px}#dc .dt p{font-size:13px;line-height:1.4}#dc .dl li{padding:3px 8px;font-size:13px}#dc .dq,#dc .dr,#dc .ds{font-size:13px;margin:4px 0}#dc .db button{padding:7px 14px;font-size:14px}#dcCta{top:50px;padding:6px 12px;font-size:13px}#dc .dg{max-height:36vh}#dc .dl{display:grid;grid-template-columns:1fr 1fr;gap:3px}#dc .dr,#dc .ds{display:inline-block;margin:2px 12px 2px 0}#dc .db{margin-top:4px}#dc .dx{padding:4px 10px}#dc .dt b{font-size:16px}}
@media (prefers-reduced-motion:reduce){#dcCta{box-shadow:none}}
'''
rep('#qz{position:fixed;inset:0;z-index:61;',css+'#qz{position:fixed;inset:0;z-index:61;')
rep('<div id="qz" role="dialog" aria-label="ふり返りクイズ" aria-modal="true"><div class="qc" id="qc"></div></div>','<div id="qz" role="dialog" aria-label="ふり返りクイズ" aria-modal="true"><div class="qc" id="qc"></div></div>\n<div id="dc" role="dialog" aria-label="デイリーチャレンジ" aria-modal="true"><div class="dcc" id="dcc"></div></div>')
rep('<button id="mtO" aria-pressed="false">','<button id="mtC" aria-pressed="false">📅 今日のお題</button><button id="mtO" aria-pressed="false">')
rep('<button id="stCta">🎛 スタジオで作ってみよう</button>','<button id="stCta">🎛 スタジオで作ってみよう</button><button id="dcCta">📅 今日のお題</button>')
rep("if(dawWantFree){dawWantFree=false;var pf=P();$('dawf').contentWindow.postMessage({dawFree:1,dawProject:pf&&pf.dproj||null,dawProjs:pf&&pf.dprojs||[],dawCur:pf&&pf.dcur||null},'*')}var p=P();",
    "if(dawWantFree){dawWantFree=false;var pf=P();$('dawf').contentWindow.postMessage(Object.assign({dawFree:1,dawProject:pf&&pf.dproj||null,dawProjs:pf&&pf.dprojs||[],dawCur:pf&&pf.dcur||null},dcExtra||{}),'*');dcExtra=null}var p=P();")
rep("  if(e.data.dawSave)saveText(e.data.dawSave);\n","  if(e.data.dawSave)saveText(e.data.dawSave);\n  if(e.data.dawSubmit)dcSubmit(e.data.dawSubmit);\n  if(e.data.dcGallery)dcShowGallery();\n")
js=open('shell_dc.js',encoding='utf8').read()
rep('function openStudioOld(){',js+'function openStudioOld(){')
exec(open('bd_add.py',encoding='utf8').read())
exec(open('ts_add.py',encoding='utf8').read())
exec(open('sp_add.py',encoding='utf8').read())
exec(open('zm_add.py',encoding='utf8').read())
exec(open('bs_add.py',encoding='utf8').read())
open('pv1.html','w',encoding='utf8').write(s)
print('ok')
