const fs=require('fs');const s=fs.readFileSync('/home/claude/dtm-textbook/preview/index.html','utf8');
const i=s.indexOf('L=[{"id"');let j=i+2,d=0,inStr=false,esc=false;
for(;j<s.length;j++){const c=s[j];if(inStr){if(esc)esc=false;else if(c=='\\')esc=true;else if(c=='"')inStr=false;continue}if(c=='"')inStr=true;else if(c=='['||c=='{')d++;else if(c==']'||c=='}'){d--;if(d==0)break}}
const L=JSON.parse(s.slice(i+2,j+1));L.forEach(l=>fs.writeFileSync('L_'+l.id+'.html',l.html));console.log(L.map(l=>l.id+' '+l.title+' '+l.html.length).join('\n'))
