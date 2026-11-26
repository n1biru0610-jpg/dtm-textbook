const fs=require('fs');const s=fs.readFileSync('/home/claude/dtm-textbook/preview/index.html','utf8');
let idx=[];let i=-1;while((i=s.indexOf('DAW_HTML="',i+1))>=0)idx.push(i);console.log(idx);
const st=idx[0]+9;let j=st+1;while(true){if(s[j]==='\\'){j+=2;continue}if(s[j]==='"')break;j++}
const html=eval(s.slice(st,j+1));fs.writeFileSync('daw.html',html);console.log(html.length);
console.log((html.match(/function showStep\(\)/g)||[]).length)
