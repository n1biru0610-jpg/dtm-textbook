const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1366,height:768}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.route(/supabase|googleapis|gstatic/,r=>r.abort());
await p.goto('file:///home/claude/dtm-textbook/preview/index.html');await p.waitForTimeout(2500);await p.click('#fgs').catch(()=>{});await p.waitForTimeout(800);
const scanF=async(tag,fid)=>{const fr=p.frames().find(f=>f.parentFrame()&&f.name()===''&&f!==p.mainFrame()&&f._fid===undefined&&f);const h=await p.$('#'+fid);const f=await h.contentFrame();if(!f){console.log(tag,'no frame');return}
 const r=await f.evaluate(()=>[...document.querySelectorAll('button,a,[role=button],input,select,[tabindex]:not([tabindex="-1"])')].filter(x=>x.offsetParent!==null).map(x=>{const t=(x.getAttribute('aria-label')||x.title||x.textContent||x.value||'').trim();return x.tagName+'#'+x.id+'.'+(x.className+'').slice(0,20)+' ['+t.slice(0,20)+'] '+x.parentElement.className}));const bad=r.filter(s=>!/[ぁ-んァ-ヶ一-龠A-Za-z0-9]/.test(s.split(' [')[1].split(']')[0]));console.log(tag,r.length,bad.length);console.log([...new Set(bad)].slice(0,12).join('\n'))};
await p.evaluate(()=>openRhythm());await p.waitForTimeout(1500);await scanF('rhythm map','rhf');
await p.evaluate(()=>openShortcut());await p.waitForTimeout(1500);await scanF('shortcut','scf');
await p.evaluate(()=>openGlossary());await p.waitForTimeout(1500);await scanF('glossary','glf');
await p.evaluate(()=>{openHome&&openHome(true)});await p.waitForTimeout(500);
await p.evaluate(()=>{try{start(0)}catch(e){}});await p.waitForTimeout(1500);
const ids=['1-3','2-4','3-3','4-3','5-3','6-3'];
for(const id of ids){await p.evaluate(id=>{startLesson(L.findIndex(l=>l.id===id))},id);await p.waitForTimeout(1200);for(let k=0;k<4;k++){await p.mouse.click(683,384);await p.waitForTimeout(600)}await scanF('lesson '+id,'f')}
console.log('errors',errs);await b.close()})();
