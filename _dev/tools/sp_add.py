import re
def cnt(a,n=1):
    assert s.count(a)==n,(s.count(a),a[:70])
# iframe + css
rep('<iframe id="dawf" title="DAW編"></iframe>','<iframe id="dawf" title="DAW編"></iframe><iframe id="dawc" title="今日のお題のDAW"></iframe>')
rep("#dawf{position:fixed;inset:0;","#dawf,#dawc{position:fixed;inset:0;")
# openDaw / openDawC
i=s.index("function openDaw(){");j=s.index("\n",i)+1
od=s[i:j]
assert od.count("catch(e){}}")>=1
od2=od.replace("function openDaw(){","function openDaw(){dcIn=false;$('dawc').style.display='none';",1)
assert od2.rstrip().endswith("catch(e){}}")
od2=od2.rstrip()[:-1]+"dcTabSync()}\n"
oc=od.replace("function openDaw(){","function openDawC(){dcIn=true;$('dawf').style.display='none';",1).replace("$('dawf')","$('dawc')").replace("dawLoaded","dawcLoaded").replace("$('mtD').setAttribute('aria-pressed',true)","$('mtD').setAttribute('aria-pressed',false)").replace("document.body.classList.toggle('dmap',dawcLoaded&&dawMapOn)","document.body.classList.remove('dmap')").replace("$('dawc').style.display='none';","$('dawf').style.display='none';",0)
# the first replace turned '$('dawf').style.display='none'' prefix into dawc; fix prefix
oc=oc.replace("function openDawC(){dcIn=true;$('dawc').style.display='none';","function openDawC(){dcIn=true;$('dawf').style.display='none';",1)
oc=oc.rstrip()[:-1]+"dcTabSync()}\n"
s=s[:i]+od2+"var dawcLoaded=false,dawfExtra=null;\n"+oc+s[j:]
# hide dawc in other screens
n=s.count("$('dawf').style.display='none'")
s=s.replace("$('dawf').style.display='none'","$('dawf').style.display='none';$('dawc').style.display='none'")
# (openDaw / openDawC themselves were already built; undo duplicates inside them)
s=s.replace("function openDaw(){dcIn=false;$('dawc').style.display='none';","function openDaw(){dcIn=false;$('dawc').style.display='none';")
rep("['dawf','rhf','scf','glf'].forEach(function(k)","['dawf','dawc','rhf','scf','glf'].forEach(function(k)")
rep("['f','dawf','rhf','scf','glf']","['f','dawf','dawc','rhf','scf','glf']")
# message handler
rep("window.addEventListener('message',function(e){if(e.source!==$('dawf').contentWindow||!e.data)return;","window.addEventListener('message',function(e){var DS=e.source===$('dawf').contentWindow?'f':(e.source===$('dawc').contentWindow?'c':'');if(!DS||!e.data)return;")
rep("if(e.data.dawView){","if(e.data.dawView&&DS==='f'){")
rep("  if(e.data.dawReady){if(dawWantFree){","  if(e.data.dawReady&&DS==='c')dcReadyC();\n  if(e.data.dawReady&&DS==='f'){dcMig(P());if(dawWantFree){")
rep("dcExtra||{}),'*');dcExtra=null}var p=P();","dawfExtra||{}),'*');dawfExtra=null}var p=P();")
rep("if(e.data.auUp){","if(e.data.auUp&&DS==='f'){")
rep("if(e.data.auGet){","if(e.data.auGet&&DS==='f'){")
rep("if(e.data.dawProjs){var q4=P();if(q4){q4.dprojs=e.data.dawProjs;q4.dcur=e.data.dawCur||null;delete q4.dproj;q4.u=Date.now();saveDB()}}","if(e.data.dawProjs){var q4=P();if(q4){if(DS==='c'){q4.cprojs=e.data.dawProjs;q4.ccur=e.data.dawCur||null}else{q4.dprojs=e.data.dawProjs.filter(function(x){return !x.dc});q4.dcur=e.data.dawCur||null;delete q4.dproj}q4.u=Date.now();saveDB()}}")
rep("if(e.data.dawProject){var q3=P();","if(e.data.dawProject&&DS==='f'){var q3=P();")
rep("  if(e.data.tsSend)tsForm(e.data.tsSend);\n","  if(e.data.tsSend)tsForm(e.data.tsSend);\n  if(e.data.dcContinue)dcCont(e.data.dcContinue);\n")
rep("else if(e.source===$('dawf').contentWindow){if(d.dawStat)","else if(e.source===$('dawf').contentWindow||e.source===$('dawc').contentWindow){if(d.dawStat)")
rep("function openStudio(){dawWantFree=true;var fr=$('dawf');if(dawLoaded){openDaw();var pp=P();","function openStudio(){dawWantFree=true;var fr=$('dawf');dcMig(P());if(dawLoaded){openDaw();var pp=P();")
rep("['st','dprojs','dcur','dw','dr','rh','mel','mode']","['st','dprojs','dcur','cprojs','ccur','dw','dr','rh','mel','mode']")
code='''function dcMig(p){if(!p)return;var a=p.dprojs||[],m=a.filter(function(x){return x.dc});if(m.length){p.cprojs=(p.cprojs||[]).concat(m);p.dprojs=a.filter(function(x){return !x.dc});if(m.some(function(x){return x.id===p.dcur}))p.dcur=null;p.u=Date.now();saveDB()}}
function dcReadyC(){var pf=P();dcMig(pf);try{$('dawc').contentWindow.postMessage(Object.assign({dawFree:1,dawOnly:1,dawProjs:pf&&pf.cprojs||[],dawCur:pf&&pf.ccur||null},dcExtra||{}),'*')}catch(e){}dcExtra=null}
function dcCont(d){dcClose();dcMig(P());dawfExtra={dawImport:d};dawWantFree=true;if(dawLoaded){openDaw();var pp=P();$('dawf').contentWindow.postMessage(Object.assign({dawFree:1,dawProject:pp&&pp.dproj||null,dawProjs:pp&&pp.dprojs||[],dawCur:pp&&pp.dcur||null},dawfExtra),'*');dawWantFree=false;dawfExtra=null}else openDaw()}
'''
rep("function openStudioOld(){",code+"function openStudioOld(){")
