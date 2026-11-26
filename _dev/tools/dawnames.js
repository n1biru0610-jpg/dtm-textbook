const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1366,height:768}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+__dirname+'/dawt2.html');await p.waitForTimeout(1500);
const E=c=>p.evaluate(c=>window.__g(c),c);
await E(`startLesson(LES.findIndex(function(l){return l.id==='D-34'}))`);await p.waitForTimeout(500);
for(let k=0;k<6;k++){await p.mouse.click(683,384);await p.waitForTimeout(600)}
const scan=async(tag)=>{const r=await p.evaluate(()=>[...document.querySelectorAll('button,a,[role=button],[role=slider],input,select,[tabindex]')].filter(x=>x.offsetParent!==null).map(x=>{const t=(x.getAttribute('aria-label')||x.title||x.textContent||x.value||'').trim();return x.tagName+'#'+x.id+'.'+(x.className+'').slice(0,20)+' ['+t.slice(0,20)+']'}));const bad=r.filter(s=>!/[ぁ-んァ-ヶ一-龠A-Za-z0-9]/.test(s.split(' [')[1].split(']')[0]));console.log(tag,r.length,bad.length);console.log([...new Set(bad)].slice(0,20).join('\n'))};
await scan('start');
for(const f of ['openFxP()','openAuP()','openInsp(true)']){try{await E(f);await p.waitForTimeout(300);await scan(f)}catch(e){console.log(f,'ERR',e.message.slice(0,80))}}
console.log(await p.evaluate(()=>[...document.querySelectorAll('button')].filter(x=>x.offsetParent!==null&&!x.textContent.trim()&&!x.getAttribute('aria-label')&&!x.title).map(x=>x.parentElement.outerHTML.slice(0,400)).slice(0,2).join('\n---\n')));await p.click('#inC button:nth-child(5)');await p.waitForTimeout(300);console.log(await p.evaluate(()=>[...document.querySelectorAll('#inC button')].map(x=>x.getAttribute('aria-label')+'='+x.getAttribute('aria-pressed')).join(' ')));console.log('errors',errs);await b.close()})();
