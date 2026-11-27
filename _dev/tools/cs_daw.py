i=s.index("function chContinue(){");j=s.index("function chSave(){")
s=s[:i]+"""function chContinue(){if(!CH||!chActive())return;saveFree();var cp=JSON.parse(JSON.stringify(T)).map(function(t){t.clips=t.clips.filter(function(c){return !c.au});return t}),nm='デイリー '+CH.md+' の続き',bb=bpm;chClose();try{parent.postMessage({dcContinue:{name:nm,bpm:bb,T:cp}},'*')}catch(e){}}
function dawImp(o){if(!free||!o||!Array.isArray(o.T)||!o.T.length||o.T.length>12)return;saveFree();listenOnly=false;T=o.T;bpm=Math.max(40,Math.min(240,+o.bpm||120));BARS=40;curId=pid();projs.push({id:curId,name:String(o.name||'デイリーの続き').slice(0,40),t:Date.now(),bpm:bpm,bars:BARS,T:T});lastSig=pjSig();pjSwitch();pjSync();toast('制限のないDAWで続きを作れるよ（お題の作品は、お題のDAWに残してあるよ）');sfx('next')}
"""+s[j:]
rep("else if(d.dawListen)chListen(d.dawListen);else chLeave();return}","else if(d.dawListen)chListen(d.dawListen);else if(d.dawImport)dawImp(d.dawImport);else chLeave();return}")
