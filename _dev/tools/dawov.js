// DAW編の重なって開く画面（作り方をえらぶ・確認ダイアログ・プロジェクト）で Tab が外へ出ないか
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1366,height:768}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/google/,r=>r.abort());
await p.goto('file://'+__dirname+'/dawt2.html');await p.waitForTimeout(1500);const E=c=>p.evaluate(c=>window.__g(c),c);
async function probe(name,id){const r=[];for(let i=0;i<20;i++){await p.keyboard.press('Tab');r.push(await p.evaluate(id=>{const a=document.activeElement;return a.closest('#'+id)?'IN':'OUT:'+a.tagName+'#'+a.id+'.'+String(a.className).slice(0,8)},id))}const out=r.filter(x=>x!=='IN');console.log(name,'out',out.length,[...new Set(out)].slice(0,5).join(' '))}
await E('routeAsk()');await p.waitForTimeout(400);console.log('route on',await E("$('route').classList.contains('on')"));await probe('route','route');await p.keyboard.press('Escape');await p.waitForTimeout(300);console.log('route after esc',await E("$('route').classList.contains('on')"));
await E("$('route').classList.remove('on')");
await E('startLesson(0)');await p.waitForTimeout(9000);
const dl=await E("typeof newProject");console.log('newProject',dl);
await E("$('addT').click()");await p.waitForTimeout(400);console.log('dlg on',await E("$('dlg').classList.contains('on')"),await E("$('pjm').classList.contains('on')"));
if(await E("$('dlg').classList.contains('on')"))await probe('dlg','dlg');
await E("$('dlg').classList.remove('on')");await E('pjOpenDlg()');await p.waitForTimeout(300);await probe('pjm','pjm');
console.log('errors',errs);await b.close()})();
