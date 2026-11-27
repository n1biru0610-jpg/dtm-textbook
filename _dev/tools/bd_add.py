BDCSS=open('bd_css.txt',encoding='utf8').read()
rep("body.ho #dcCta{display:block}","body.ho #dcCta{display:block}\n"+BDCSS)
rep('<button id="dcCta">📅 今日のお題</button>','<button id="dcCta">📅 今日のお題</button><button id="bdBtn">🏅 しょうごう</button>')
rep("    if((rp.su||0)>(lp.su||0)){lp.studio=rp.studio;lp.su=rp.su}","    if(rp.bd)lp.bd=bdMerge(lp.bd,rp.bd,(rp.u||0)>(lp.u||0));\n    if((rp.su||0)>(lp.su||0)){lp.studio=rp.studio;lp.su=rp.su}")
rep("e.d=1;e.at=Date.now();p.u=Date.now();saveDB()}","e.d=1;e.at=Date.now();p.u=Date.now();saveDB();try{bdNote(bdEval())}catch(x){}}")
rep("if(pf){mergeProf(pf);chip();if(homeOn)renderHome(false)}pushAcc()}).catch(function(){})}","if(pf){mergeProf(pf);chip();if(homeOn)renderHome(false)}pushAcc()}).catch(function(){}).then(function(){bdSync=true;try{bdCheck()}catch(e){}})}")
rep("closeProf();chip();hopPos=null;renderHome(false)}).catch(function(e){$('go2')","bdSync=true;closeProf();chip();hopPos=null;renderHome(false)}).catch(function(e){$('go2')")
rep("b.children[1].textContent=p.name}","b.children[1].textContent=p.name;try{bdBtnUpd()}catch(e){}}")
rep("function dcStart(){var day=dcJst()","function dcStart(){document.body.classList.remove('dchl');var day=dcJst()")
rep("bpm:s.bpm|0,proj:s.proj};","bpm:s.bpm|0,proj:s.proj};var bt=bdTitle();if(bt)row.badge=bt.slice(0,30);")
rep("tk.then(function(t){return sbf('/rest/v1/daily_entries',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(row)},t)}).then(function(r){",
 "tk.then(function(t){var go=function(rw){return sbf('/rest/v1/daily_entries',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(rw)},t)};return go(row).then(function(r){if(r.ok||!row.badge)return r;return r.text().then(function(x){if(!/badge/i.test(x))return {ok:false,status:r.status,text:function(){return Promise.resolve(x)}};var r2=Object.assign({},row);delete r2.badge;return go(r2)})})}).then(function(r){")
rep("anHit('デイリー提出');","anHit('デイリー提出');var nb=[];try{nb=bdPost(row.day,row.ok,row.total)}catch(e){}")
rep("みんなの作品も聴けるよ。',{ok:row.ok,total:row.total})","みんなの作品も聴けるよ。'+(nb.length?'　🏅新しい称号：'+nb.map(function(d){return d.ic+' '+d.n}).join('、'):''),{ok:row.ok,total:row.total})")
rep("return sbf('/rest/v1/daily_entries?day=eq.'+day+'&select=id,created_at,nick,ok,total,bpm&order=created_at.desc&limit=200',{},t)}",
 "var q=function(s){return '/rest/v1/daily_entries?day=eq.'+day+'&select=id,created_at,nick,'+s+'ok,total,bpm&order=created_at.desc&limit=200'};return sbf(q('badge,'),{},t).then(function(r){if(r.ok)return r;return r.text().then(function(x){if(!/badge/i.test(x))return {ok:false,status:r.status,text:function(){return Promise.resolve(x)}};return sbf(q(''),{},t)})})}")
rep("li.innerHTML='<span class=\"n\"></span><span class=\"k\"></span><button type=\"button\">♪ きく</button>';li.children[0].textContent=e.nick||'ななし';",
 "li.innerHTML='<span class=\"n\"><em></em><b></b></span><span class=\"k\"></span><button type=\"button\">♪ きく</button>';li.children[0].children[1].textContent=e.nick||'ななし';if(e.badge)li.children[0].children[0].textContent=e.badge;else li.children[0].children[0].remove();")
rep('function openStudioOld(){',open('shell_bd.js',encoding='utf8').read()+'function openStudioOld(){')

rep("""b.innerHTML='<span class="av" style="background:'+p.col+'"></span><span></span><span class="sync">'""","""b.innerHTML=(typeof bdAv==='function'?bdAv(p):'<span class="av" style="background:'+p.col+'"></span>')+'<span></span><span class="sync">'""")
rep("""b.className='pr act';b.innerHTML='<span class="av" style="background:'+p.col+'"></span><span></span><small></small>';b.children[1].textContent=(ACC&&ACC.nick)||p.name;b.children[2].textContent=doneCount(p)+'/'+L.length+' クリア';pl.appendChild(b)}""","""b.className='pr act';b.innerHTML=bdAv(p)+'<span></span><small></small>';b.children[1].textContent=(ACC&&ACC.nick)||p.name;b.children[2].textContent=doneCount(p)+'/'+L.length+' クリア';pl.appendChild(b);if(bdAcc()){var x=document.createElement('div');x.className='row2';x.innerHTML='<button class="btn pri" id="pic">🎭 アイコンをきがえる</button><button class="btn" id="pmo">🎒 もちもの</button>';pl.appendChild(x);$('pic').onclick=function(){closeProf();bdShow('ic')};$('pmo').onclick=function(){closeProf();bdShow('ti')}}}""")
