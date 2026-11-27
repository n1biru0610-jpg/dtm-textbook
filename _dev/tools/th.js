const {chromium}=require('/opt/npm-tools/node_modules/playwright');
(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/google-chrome'});
const pg=await b.newPage({viewport:{width:1366,height:768}});const errs=[];pg.on('pageerror',e=>errs.push(e.message));
await pg.goto('http://localhost:8765/preview/index.html',{waitUntil:'load'});await pg.waitForTimeout(1500);
const r=await pg.evaluate(()=>{const ids=DCP.map(t=>t.id);const dup=ids.filter((x,i)=>ids.indexOf(x)!==i);return {n:ids.length,dup,ids}});
console.log('themes',r.n,'dup',r.dup.join(','));
// DAW側にアイコン・判定がそろうか
await pg.evaluate(()=>{DAW_HTML=DAW_HTML.replace('function showStep(){','window.__g=function(c){return eval(c)};function showStep(){');openDaw()});await pg.waitForTimeout(1500);
const fr=await (await pg.$('#dawf')).contentFrame();
const ids=r.ids;let bad=[];
for(const id of ids){const x=await fr.evaluate(c=>__g(c),`(function(id){var s=CHIC[id];var ok=false;try{var d=new DOMParser().parseFromString(s,'image/svg+xml');ok=!d.querySelector('parsererror')}catch(e){}return {ic:!!s&&s.indexOf('<svg')===0,xml:ok}})('${id}')`);if(!x.ic||!x.xml)bad.push(id)}
console.log('icon NG:',bad.join(',')||'なし');
// 全テーマ：条件が正しく評価できる（空の曲でもエラーにならず、すべて未達成）
const bad2=await pg.evaluate(()=>DCP.filter(t=>{const th=dcTheme('2026-12-01');return false}).length);
const jr=await pg.evaluate(()=>{const o=[];DCP.forEach(t=>{t.c.forEach(c=>{if(!c.label||!c.t)o.push(t.id+':'+JSON.stringify(c))});if(!t.c.some(c=>c.t==='scale')&&!['three','chord','mini','party','rhythm','dash','race','drumonly'].includes(t.id)){}});return o});
console.log('cond NG:',jr.join(',')||'なし');
// 28日ぶん：どの日も条件5〜7個で、表示チップが出せる
const days=await pg.evaluate(()=>{const o=[];for(let i=0;i<30;i++){const d=new Date(Date.UTC(2026,10,27+i));const day=d.getUTCFullYear()+'-'+('0'+(d.getUTCMonth()+1)).slice(-2)+'-'+('0'+d.getUTCDate()).slice(-2);const t=dcTheme(day);o.push(t.id+':'+t.conds.length)}return o});
console.log(days.join(' '));
console.log('errs',errs.length);await b.close()})()
