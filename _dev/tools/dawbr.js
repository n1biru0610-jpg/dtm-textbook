// DAW編 右のブラウザの見出し（インストゥルメント等）をキーボードで開閉できるか
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1366,height:768}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/google/,r=>r.abort());
await p.goto('file://'+__dirname+'/dawt2.html');await p.waitForTimeout(2000);
const E=c=>p.evaluate(c=>window.__g(c),c);
const seq=[];for(let i=0;i<30;i++){await p.keyboard.press('Tab');seq.push(await p.evaluate(()=>{const a=document.activeElement;return (a.closest('#dhome')?'MAP:':'DAW:')+a.tagName+'.'+String(a.className).slice(0,8)}))}console.log('map tab',seq.join(' '));
await p.evaluate(()=>document.activeElement.blur());await E('startLesson(0)');await p.waitForTimeout(9000);
// 自由モードにしてブラウザを開く
const st=()=>p.evaluate(()=>[...document.querySelectorAll('.bsec')].map(s=>(s.classList.contains('open')?1:0)+':'+s.querySelector('.bc').getAttribute('aria-expanded')+':'+s.querySelector('.bc').getAttribute('aria-label')));
console.log('init',await st());
let found=0;for(let i=0;i<200;i++){await p.keyboard.press('Tab');const a=await p.evaluate(()=>document.activeElement.className+'|'+(document.activeElement.getAttribute('aria-label')||''));if(a.startsWith('bc|')){console.log('tab',i+1,a);found=1;break}}
if(found){await p.keyboard.press('Enter');await p.waitForTimeout(200);console.log('after Enter',await st());
 const ol=await p.evaluate(()=>getComputedStyle(document.activeElement).outlineColor+' '+getComputedStyle(document.activeElement).outlineWidth);console.log('outline',ol);
 await p.screenshot({path:'dawbr_k.png'});}
// マウスでクリック
const h=await p.$$('.bsec .bc');if(h[1]&&await h[1].isVisible()){await h[1].click();await p.waitForTimeout(200);console.log('after click',await st(),'focus',await p.evaluate(()=>document.activeElement.className))}
console.log('errors',errs);await b.close()})();
