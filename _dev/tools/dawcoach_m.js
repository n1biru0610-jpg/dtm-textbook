// DAW編：説明だけのステップをキーボード（Tab→Enter）で進めるか、ステップが変わったあとフォーカスがどこにあるか
const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome',args:['--no-sandbox']});
const p=await b.newPage({viewport:{width:1366,height:768}});const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.route(/google/,r=>r.abort());
await p.goto('file://'+__dirname+'/dawt2.html');await p.waitForTimeout(1500);
const E=c=>p.evaluate(c=>window.__g(c),c);await p.mouse.click(700,300);await p.waitForTimeout(300);await E(`startLesson(+(process&&0)||0)`).catch(()=>E('startLesson(0)'));await p.waitForTimeout(9000);
const A=()=>p.evaluate(()=>{const a=document.activeElement;return a.tagName+'#'+a.id+':'+(a.textContent||'').trim().slice(0,12)+(a.matches(':focus-visible')?'(枠)':'')});
console.log('start',await A(),'live=',await E("$('ctx').getAttribute('aria-live')+'/'+$('coach').getAttribute('role')"));
for(let s=0;s<8;s++){const st=await E("({s:typeof step!=='undefined'?step:-1,txt:$('ctx').textContent.slice(0,25),nx:(function(){var b=$('cnext');return b?(b.offsetParent!==null&&!b.disabled):null})()})");
 if(!st.nx){console.log('step',JSON.stringify(st),'→ つぎへ無し（操作が必要）');break}
 let t=0;
 console.log('step',JSON.stringify(st),'Tab',t);await p.click('#cnext',{force:true});await p.waitForTimeout(800);console.log('  after',await A())}
console.log('errors',errs);await b.close()})();
