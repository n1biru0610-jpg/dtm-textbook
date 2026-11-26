const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1366,height:768}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route(/supabase|googleapis|gstatic/,r=>r.abort());
await p.goto('file:///home/claude/dtm-textbook/preview/index.html');await p.waitForTimeout(4000);
await p.screenshot({path:'home.png'});
const btns=await p.evaluate(()=>Array.from(document.querySelectorAll('button')).filter(b=>b.offsetParent).map(b=>b.textContent.trim().slice(0,20)).slice(0,40));console.log(btns.join(' | '));
console.log('errors',errs);await b.close()})();
