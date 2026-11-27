const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});
const pg=await b.newPage({viewport:{width:1366,height:768}});
await pg.goto('http://localhost:8765/preview/index.html');await pg.waitForTimeout(1200);
await pg.evaluate(()=>{const s=document.createElement('style');s.textContent='*{animation:none!important}';document.head.appendChild(s);newProf&&0});
const st=()=>pg.evaluate(()=>({D:document.getElementById('mtD').getAttribute('aria-pressed'),C:document.getElementById('mtC').getAttribute('aria-pressed'),chon:document.body.classList.contains('chon')}));
await pg.evaluate(()=>{try{document.getElementById('gst')&&document.getElementById('gst').click()}catch(e){}});
await pg.evaluate(()=>{[...document.querySelectorAll('button')].filter(x=>/ゲスト/.test(x.textContent)&&x.offsetParent)[0]?.click()});
await pg.waitForTimeout(500);
await pg.evaluate(()=>document.getElementById('mtC').click());await pg.waitForTimeout(2500);console.log('お題',await st());
await pg.evaluate(()=>document.getElementById('mtD').click());await pg.waitForTimeout(2000);console.log('DAW編クリック後',await st());
await pg.evaluate(()=>document.getElementById('mtC').click());await pg.waitForTimeout(2500);console.log('お題に戻る',await st());
await pg.evaluate(()=>document.getElementById('mtB').click());await pg.waitForTimeout(800);console.log('基礎編',await st());
await b.close()})()
