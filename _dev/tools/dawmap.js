// DAW編のマップ：押せる見た目なのにキーボードで届かない部品・名前のない部品
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1366,height:768}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/google/,r=>r.abort());
await p.goto('file://'+__dirname+'/dawt2.html');await p.waitForTimeout(2000);
const E=c=>p.evaluate(c=>window.__g(c),c);
console.log('mapOn',await E('mapOn'));
const audit=()=>p.evaluate(()=>{const nf=[],nn=[];[...document.querySelectorAll('*')].forEach(e=>{if(!e.offsetParent)return;const cs=getComputedStyle(e);const clickable=cs.cursor==='pointer'||e.onclick;if(clickable&&e.tabIndex<0&&!e.closest('button,a,[tabindex],input,select,label'))nf.push(e.tagName+'#'+e.id+'.'+String(e.className).slice(0,20)+':'+e.textContent.trim().slice(0,10));
 if((e.tagName==='BUTTON'||e.getAttribute('role')==='button')&&!(e.getAttribute('aria-label')||e.textContent.trim()||e.title))nn.push(e.id+'.'+e.className)});return {nf:nf.length,notFocusable:[...new Set(nf)].slice(0,15),noName:nn.slice(0,10)}});
console.log('map',JSON.stringify(await audit()));
await E('startLesson(0)');await p.waitForTimeout(9000);
console.log('lesson',JSON.stringify(await audit()));
console.log('errors',errs);await b.close()})();
