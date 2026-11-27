/*zkdaw* 図鑑のMIDIパック・音源（ステップ4）。親から {zkOwn:[...]} で持っているカードが届く */
INST.orgel=function(m,t,d){vox(m,t,d,{w:[['sine',1,.6],['sine',3,.14],['sine',5.98,.05]],lp:9000,a:.002,dec:.9,sus:.04,r:.5,v:.17})};
INST.mokkin=function(m,t,d){vox(m,t,d,{w:[['sine',1,.7],['sine',4,.16],['triangle',1,.12]],lp:6000,a:.002,dec:.32,sus:.03,r:.12,v:.22})};
INST.chip=function(m,t,d){vox(m,t,d,{w:[['square',1,.5]],lp:12000,a:.002,dec:.05,sus:.85,r:.03,v:.08})};
var ZKI=[['orgel','オルゴール','小さくてやさしい、ぜんまいの音','🎁','オルゴール'],['mokkin','森の木琴','ころころした、木の音','🪵','木琴'],['chip','8ビット','ピコピコした、ゲーム機の音','👾','8ビット']],ZKOWN=[];
function zkHasI(id){return ZKOWN.some(function(c){return c.snd===id})}
function zkToast(m,ms){toast(m);clearTimeout(toast.k);toast.k=setTimeout(function(){$('toast').classList.remove('on')},ms||4500)}
function zkCan(){if(listenOnly){zkToast('いまは聴くだけの画面だよ。自分の曲にもどってから使ってね');sfx('low');return false}if(!free){zkToast('もらった素材は、DAW編のスタジオ（自由につくる）と今日のお題で使えるよ');sfx('low');return false}if(blocked()){zkToast('いまは置けないよ。開いている画面をとじてから、もう一度おしてね');sfx('low');return false}return true}
var zkPG=null;function zkPrev(c){init();ctx.resume();if(zkPG){try{zkPG.disconnect()}catch(e){}zkPG=null}OUT=null;if(c.snd){prevInst(c.snd);return}var k=c.pk,t0=ctx.currentTime+.05,st=sd(),g=ctx.createGain();g.connect(master);zkPG=g;OUT=g;try{var W=typeof swW==='function'?function(x){return swW(k,x)}:function(x){return x};k.n.forEach(function(n){if(n[0]>=64)return;var t=t0+W(n[0])*st;if(n[3]!=null&&n[3]<.99){var vg=ctx.createGain();vg.gain.value=Math.max(0,n[3]);vg.connect(g);OUT=vg}else OUT=g;if(k.k==='drum')drumHit(n[1],t,0);else tone(n[1]+(k.oct||0)*12,t,(W(n[0]+(n[2]||1))-W(n[0]))*st*.95,k.inst)})}finally{OUT=null}}
function zkUse(c){if(!c||!zkCan())return;if(c.snd){if(!INST[c.snd])return;addInst(c.snd);return}var k=c.pk;if(!k||!Array.isArray(k.n))return;if(T.length>=12){zkToast('トラックは12個までだよ');sfx('low');return}
 if(openClip)closeEd();
 var ch=chActive(),pb=Math.max(1,Math.min(64,k.bars|0)),bars=pb,rep=1,st=Math.max(0,Math.min(cursor|0,BARS-1)),cut=false,before=ch?chJudge(CH.conds):null;
 if(ch){st=0;if(pb<BARS){rep=Math.floor(BARS/pb);bars=pb*rep}}
 if(st+bars>BARS)st=bars>=BARS?0:BARS-bars;
 if(bars>BARS-st){bars=BARS-st;cut=true}
 addTrack(String(c.tn||c.name||'').slice(0,20),k.k==='drum'?'drum':'inst');var t=T[T.length-1];if(k.k==='drum')t.kit=0;else{if(k.inst&&k.inst!=='piano'&&INST[k.inst])t.inst=k.inst;if(k.oct)t.oct=Math.max(-2,Math.min(2,k.oct|0))}
 var nt=[];for(var r=0;r<rep;r++)k.n.forEach(function(n){var s0=n[0]+r*pb*16;if(!(s0<bars*16))return;var o={s:s0,p:n[1],l:Math.min(n[2]||1,bars*16-s0)};if(n[3]!=null&&n[3]<.99)o.v=n[3];nt.push(o)});
 var nc={s:st,l:bars,notes:nt},sw=+k.sw||0;if(sw>0)nc.sw=sw>=90?100:sw>=50?66:33;if(nc.sw&&k.swg===1)nc.swg=1;t.clips.push(nc);selClip=t.clips[0];focusTr=true;showTr(sel);afterEdit();fire('trackAdded');
 var m='「'+c.name+'」を '+(st+1)+'小節めに置いたよ'+(cut?'（お題の長さに入るぶんだけ）':rep>1?'（お題の4小節ぶん、くりかえし）':'')+'。ダブルクリック（2回タップ）で中身を見られるよ';
 if(before){var af=chJudge(CH.conds),lost=CH.conds.filter(function(q,i){return before[i]&&!af[i]}).map(function(q){return '「'+q.label.replace(/（[^）]*）/g,'')+'」'});if(lost.length)m+='。※お題の'+lost.join('')+'が×になったよ（いらなければ '+MOD+'Z でもどせる）'}
 zkToast(m,lost&&lost.length?7000:4500)}
function zkBl(l){var a=ZKOWN.filter(function(c){return c&&(c.pk||(c.snd&&INST[c.snd]))});if(!a.length){var d=document.createElement('div');d.className='bn';d.textContent='図鑑で「MIDIパック」や「音源」のカードを手に入れると、ここから使えるよ。';l.appendChild(d);return}
 a.forEach(function(c){var e=bi(c.ic+' '+c.name,c.snd?'音源：この音のトラックを作る':(c.sub||'MIDIパック '+c.pk.bars+'小節'),[['▶','きいてみる',function(){zkPrev(c)}],[c.snd?'＋ 追加':'＋ 置く',c.snd?'この音のトラックを作る':'新しいトラックに置く',function(){zkUse(c)},1]]);var bs=e.querySelectorAll('button');if(bs[0])bs[0].setAttribute('aria-label','きいてみる：'+c.name);if(bs[1])bs[1].setAttribute('aria-label',(c.snd?'トラックを作る：':'置く：')+c.name);e.dataset.zk=c.id;l.appendChild(e)})}
function zkRb(){var l=$('zkbl');if(!l)return;var f=document.activeElement,fi=null,fk=0;if(f&&l.contains(f)){var it=f.closest('.bi');fi=it&&it.dataset.zk;fk=Array.prototype.indexOf.call(it?it.querySelectorAll('button'):[],f)}l.innerHTML='';zkBl(l);if(fi){var n=l.querySelector('.bi[data-zk="'+fi+'"]'),bb=n&&n.querySelectorAll('button')[Math.max(0,fk)];if(bb)bb.focus();else{var x=l.querySelector('button');if(x)x.focus()}}}
