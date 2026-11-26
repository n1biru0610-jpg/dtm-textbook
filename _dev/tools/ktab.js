const {chromium}=require('/opt/npm-tools/node_modules/playwright');
const only=(process.argv[2]||'1-1,2-3,3-2,4-3').split(',');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox','--autoplay-policy=no-user-gesture-required']});
const p=await b.newPage({viewport:{width:1366,height:768}});const errs=[];p.on('pageerror',e=>errs.push('top:'+e.message));
await p.route(/supabase|googleapis|gstatic/,r=>r.abort());
await p.goto('file:///home/claude/dtm-textbook/preview/index.html');await p.waitForTimeout(2500);
await p.click('#fgs').catch(()=>{});await p.waitForTimeout(800);
const ids=await p.evaluate(()=>L.map(l=>l.id));
for(const id of only){const i=ids.indexOf(id);
 await p.evaluate(i=>{startLesson(i)},i);await p.waitForTimeout(1200);
 for(let k=0;k<6;k++){const on=await p.evaluate(()=>document.getElementById('intro').classList.contains('on')||!!document.querySelector('.chap.on,#chap.on'));if(on){await p.mouse.click(683,384);await p.waitForTimeout(800)}else break}
 await p.waitForTimeout(1500);
 const fr=await (await p.$('#f')).contentFrame();
 const info=await fr.evaluate(()=>{const nf=[];document.querySelectorAll('[onclick],.cell,.key,.pad,[data-n],[data-i]').forEach(e=>{if(!e.offsetParent)return;if(e.tabIndex<0&&!['BUTTON','INPUT','SELECT','A','TEXTAREA'].includes(e.tagName))nf.push(e.tagName+'.'+e.className)});
   const clickables=[...document.querySelectorAll('*')].filter(e=>e.offsetParent&&getComputedStyle(e).cursor==='pointer'&&e.tabIndex<0&&!e.closest('button'));
   return {nf:nf.length,nfs:[...new Set(nf)].slice(0,5),ptr:clickables.length,ptrs:[...new Set(clickables.map(e=>e.tagName+'.'+e.className))].slice(0,6)}});
 // Tab 順
 await p.evaluate(()=>document.activeElement&&document.activeElement.blur());
 const seq=[];for(let t=0;t<25;t++){await p.keyboard.press('Tab');const a=await p.evaluate(()=>{let a=document.activeElement;let pre='';if(a&&a.tagName==='IFRAME'){a=a.contentDocument.activeElement;pre='[f]'}return pre+a.tagName+'#'+a.id+':'+(a.getAttribute('aria-label')||a.textContent||'').trim().slice(0,10)});seq.push(a)}
 console.log(id,JSON.stringify(info));console.log('  Tab:',seq.join(' | '));
}
console.log('errors',errs);await b.close()})();
