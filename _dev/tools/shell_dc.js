/* ---------- デイリーチャレンジ（4小節をお題でつくる） ---------- */
var dcExtra=null,dcBack=null,DC_BARS='4小節ぜんぶに音をおく（5小節目には出さない）';
function dcC(t,o){o.t=t;return o}
var DCP=[
 {id:'walk',title:'あさの さんぽ',desc:'明るくて、ゆったりした朝の曲。白い鍵盤の音だけで、ドでおわらせよう。',c:[dcC('bpm',{a:90,b:110,label:'テンポ 90〜110'}),dcC('mel',{n:6,label:'メロディを6音以上'}),dcC('scale',{set:[0,2,4,5,7,9,11],label:'白い鍵盤（ドレミファソラシ）の音だけ'}),dcC('ends',{pc:0,label:'メロディの最後は「ド」'})]},
 {id:'dash',title:'ダッシュ！',desc:'走り出したくなる、はやい曲。ドラムでぐいぐい進もう。',c:[dcC('bpm',{a:140,b:170,label:'テンポ 140〜170'}),dcC('kick',{n:8,label:'キックを8回以上'}),dcC('snare',{n:2,label:'スネアを2回以上'}),dcC('hat',{n:8,label:'ハイハットを8回以上'}),dcC('scale',{set:[0,2,4,5,7,9,11],label:'白い鍵盤（ドレミファソラシ）の音だけ'})]},
 {id:'sleep',title:'ねむる まえに',desc:'しずかで、音がすくない子守歌。ふんわりしたパッドの音で。',c:[dcC('bpm',{a:60,b:85,label:'テンポ 60〜85'}),dcC('maxNotes',{n:8,label:'メロディは8音以下'}),dcC('inst',{k:'pad',label:'パッド（ふんわりした音）をつかう'}),dcC('scale',{set:[0,2,4,7,9],label:'ド・レ・ミ・ソ・ラだけ'})]},
 {id:'bass',title:'ベースが かっこいい',desc:'低い音が主役。ドラムとベースで、ノれる土台をつくろう。',c:[dcC('bpm',{a:100,b:130,label:'テンポ 100〜130'}),dcC('drumAll',{label:'キック・スネア・ハイハットぜんぶ'}),dcC('bass',{n:6,label:'ベースを6音以上'}),dcC('scale',{set:[0,3,5,7,10],label:'ド・ミ♭・ファ・ソ・シ♭だけ'})]},
 {id:'chord',title:'コードで キラキラ',desc:'3つ以上の音をいっしょに鳴らす「コード」で、きらきらした曲に。',c:[dcC('chord',{n:2,label:'3音いじょうの和音（コード）を2回以上'}),dcC('inst',{k:'bell',label:'ベル（きらきらした音）をつかう'}),dcC('scale',{set:[0,2,4,5,7,9,11],label:'白い鍵盤（ドレミファソラシ）の音だけ'})]},
 {id:'three',title:'3つの音だけ',desc:'メロディに使える高さは、たったの3種類。せいげんの中で、くふうしよう。',c:[dcC('melMax',{n:3,label:'メロディの高さは3種類以下'}),dcC('mel',{n:6,label:'メロディを6音以上'}),dcC('kick',{n:4,label:'キックを4回以上'}),dcC('scale',{set:[0,2,4,7,9],label:'ド・レ・ミ・ソ・ラだけ'})]},
 {id:'rhythm',title:'リズムで あそぼう',desc:'ドラムが主役のリズムあそび。キック・スネア・ハイハットで、のれるビートを。',c:[dcC('bpm',{a:100,b:140,label:'テンポ 100〜140'}),dcC('kick',{n:6,label:'キックを6回以上'}),dcC('snare',{n:4,label:'スネアを4回以上'}),dcC('hat',{n:12,label:'ハイハットを12回以上'}),dcC('scale',{set:[0,2,4,5,7,9,11],label:'白い鍵盤（ドレミファソラシ）の音だけ'})]},
 {id:'fes',title:'おまつり',desc:'にぎやかなおまつりの音。ドレソラ…の5つの音（ペンタトニック）で作ると、それっぽくなるよ。',c:[dcC('bpm',{a:120,b:150,label:'テンポ 120〜150'}),dcC('scale',{set:[0,2,4,7,9],label:'ド・レ・ミ・ソ・ラだけ'}),dcC('mel',{n:8,label:'メロディを8音以上'}),dcC('inst',{k:'pluck',label:'プラック（はじいた音）をつかう'})]},
 {id:'sunset',title:'ゆうやけの かえりみち',desc:'ちょっとさみしい、夕方の曲。ゆっくり、和音もまぜて。「ラ」でおわらせよう。',c:[dcC('bpm',{a:70,b:95,label:'テンポ 70〜95'}),dcC('mel',{n:5,label:'メロディを5音以上'}),dcC('chord',{n:1,label:'3音いじょうの和音を1回以上'}),dcC('ends',{pc:9,label:'メロディの最後は「ラ」'}),dcC('scale',{set:[0,2,4,5,7,9,11],label:'白い鍵盤（ドレミファソラシ）の音だけ'})]},
 {id:'robot',title:'ロボットの ダンス',desc:'ピコピコしたシンセで、ロボットがおどる曲。',c:[dcC('bpm',{a:120,b:140,label:'テンポ 120〜140'}),dcC('inst',{k:'lead',label:'リード（ピコピコ音）をつかう'}),dcC('bass',{n:4,label:'ベースを4音以上'}),dcC('drumAll',{label:'キック・スネア・ハイハットぜんぶ'}),dcC('scale',{set:[0,3,5,7,10],label:'ド・ミ♭・ファ・ソ・シ♭だけ'})]},
 {id:'wide',title:'ひろい音いき',desc:'低い音から高い音まで、いろいろな高さをつかって、にぎやかに。',c:[dcC('melMin',{n:5,label:'メロディの高さを5種類以上'}),dcC('mel',{n:8,label:'メロディを8音以上'}),dcC('ends',{pc:0,label:'メロディの最後は「ド」'}),dcC('scale',{set:[0,2,4,5,7,9,11],label:'白い鍵盤（ドレミファソラシ）の音だけ'})]},
 {id:'mini',title:'すくない音で かっこよく',desc:'ひく音をぐっとへらして、すき間をいかす。引き算の曲づくり。',c:[dcC('maxNotes',{n:6,label:'メロディは6音以下'}),dcC('bass',{n:3,label:'ベースを3音以上'}),dcC('drumAll',{label:'キック・スネア・ハイハットぜんぶ'}),dcC('scale',{set:[0,2,4,7,9],label:'ド・レ・ミ・ソ・ラだけ'})]},
 {id:'party',title:'パーティー',desc:'いろいろな楽器があつまるパーティー。3つ以上のトラックで、にぎやかに。',c:[dcC('tracks',{n:3,label:'音のあるトラックを3つ以上'}),dcC('bpm',{a:120,b:140,label:'テンポ 120〜140'}),dcC('hat',{n:8,label:'ハイハットを8回以上'}),dcC('scale',{set:[0,2,4,5,7,9,11],label:'白い鍵盤（ドレミファソラシ）の音だけ'})]},
 {id:'game',title:'ゲームの ステージ1',desc:'ゲームの最初のステージのBGM。かっこいいマイナーペンタの音でつくろう。',c:[dcC('bpm',{a:130,b:160,label:'テンポ 130〜160'}),dcC('scale',{set:[0,3,5,7,10],label:'ド・ミ♭・ファ・ソ・シ♭だけ'}),dcC('inst',{k:'lead',label:'リードをつかう'}),dcC('mel',{n:8,label:'メロディを8音以上'})]},
 {id:'umi',title:'うみの ひるね',desc:'波の音みたいに、ゆらゆらした曲。ふんわりしたパッドで、ドでおわろう。',c:[dcC('bpm',{a:70,b:90,label:'テンポ 70〜90'}),dcC('inst',{k:'pad',label:'パッド（ふんわりした音）をつかう'}),dcC('mel',{n:5,label:'メロディを5音以上'}),dcC('ends',{pc:0,label:'メロディの最後は「ド」'}),dcC('scale',{set:[0,2,4,7,9],label:'ド・レ・ミ・ソ・ラだけ'})]},
 {id:'rain',title:'あめの まど',desc:'しとしと雨の日。音をすくなめにして、やさしいエレピで。',c:[dcC('bpm',{a:65,b:85,label:'テンポ 65〜85'}),dcC('inst',{k:'ep',label:'エレピ（やわらかい鍵盤の音）をつかう'}),dcC('maxNotes',{n:7,label:'メロディは7音以下'}),dcC('chord',{n:1,label:'3音いじょうの和音を1回以上'}),dcC('scale',{set:[0,2,4,7,9],label:'ド・レ・ミ・ソ・ラだけ'})]},
 {id:'kuro',title:'くろい けんばんだけ',desc:'黒い鍵盤だけで作ってみよう。どれをひいても、ふしぎときれいにきこえるよ。',c:[dcC('scale',{set:[1,3,6,8,10],label:'黒い鍵盤の音だけ'}),dcC('mel',{n:6,label:'メロディを6音以上'}),dcC('bpm',{a:90,b:120,label:'テンポ 90〜120'}),dcC('kick',{n:4,label:'キックを4回以上'})]},
 {id:'wa',title:'にほんの おまつり みち',desc:'日本っぽい音階で、おまつりの道を歩く曲。はじいた音（プラック）が合うよ。',c:[dcC('scale',{set:[0,2,3,7,8],label:'ド・レ・ミ♭・ソ・ラ♭だけ（日本っぽい音階）'}),dcC('inst',{k:'pluck',label:'プラック（はじいた音）をつかう'}),dcC('bpm',{a:90,b:120,label:'テンポ 90〜120'}),dcC('mel',{n:6,label:'メロディを6音以上'}),dcC('kick',{n:4,label:'キックを4回以上'})]},
 {id:'okinawa',title:'なんごくの かぜ',desc:'南の島のそよ風。ちょっと明るい、沖縄っぽい音階で。',c:[dcC('scale',{set:[0,4,5,7,11],label:'ド・ミ・ファ・ソ・シだけ（沖縄っぽい音階）'}),dcC('bpm',{a:100,b:125,label:'テンポ 100〜125'}),dcC('inst',{k:'pluck',label:'プラック（はじいた音）をつかう'}),dcC('mel',{n:6,label:'メロディを6音以上'}),dcC('chord',{n:1,label:'3音いじょうの和音を1回以上'})]},
 {id:'blues',title:'ブルースな よる',desc:'おとなっぽい、ゆったりブルース。ベースがかっこよく動くと決まるよ。',c:[dcC('scale',{set:[0,3,5,6,7,10],label:'ド・ミ♭・ファ・ファ♯・ソ・シ♭だけ（ブルース）'}),dcC('bpm',{a:80,b:105,label:'テンポ 80〜105'}),dcC('bass',{n:4,label:'ベースを4音以上'}),dcC('snare',{n:3,label:'スネアを3回以上'}),dcC('mel',{n:5,label:'メロディを5音以上'})]},
 {id:'space',title:'うちゅう りょこう',desc:'ふわふわ浮かぶ宇宙の曲。ふしぎな音階（全音音階）で、遠くへ。',c:[dcC('scale',{set:[0,2,4,6,8,10],label:'ド・レ・ミ・ファ♯・ソ♯・ラ♯だけ（ふしぎな音階）'}),dcC('inst',{k:'pad',label:'パッド（ふんわりした音）をつかう'}),dcC('bpm',{a:60,b:90,label:'テンポ 60〜90'}),dcC('maxNotes',{n:8,label:'メロディは8音以下'}),dcC('chord',{n:1,label:'3音いじょうの和音を1回以上'})]},
 {id:'circus',title:'サーカスが やってきた',desc:'はずむような、にぎやかな行進曲。ベルの音で、ドでびしっと終わろう。',c:[dcC('bpm',{a:130,b:160,label:'テンポ 130〜160'}),dcC('inst',{k:'bell',label:'ベル（きらきらした音）をつかう'}),dcC('mel',{n:10,label:'メロディを10音以上'}),dcC('ends',{pc:0,label:'メロディの最後は「ド」'}),dcC('scale',{set:[0,2,4,5,7,9,11],label:'白い鍵盤（ドレミファソラシ）の音だけ'})]},
 {id:'ninja',title:'にんじゃの しのびあし',desc:'すばやく、静かに。日本っぽい音階で、すき間をいかそう。',c:[dcC('scale',{set:[0,2,3,7,8],label:'ド・レ・ミ♭・ソ・ラ♭だけ（日本っぽい音階）'}),dcC('bpm',{a:140,b:170,label:'テンポ 140〜170'}),dcC('kick',{n:4,label:'キックを4回以上'}),dcC('snare',{n:2,label:'スネアを2回以上'}),dcC('maxNotes',{n:10,label:'メロディは10音以下'})]},
 {id:'yousei',title:'もりの ようせい',desc:'きらきら光る森の小さな妖精。ベルと和音で、ふわっと軽く。',c:[dcC('bpm',{a:80,b:110,label:'テンポ 80〜110'}),dcC('inst',{k:'bell',label:'ベル（きらきらした音）をつかう'}),dcC('chord',{n:2,label:'3音いじょうの和音を2回以上'}),dcC('tracks',{n:2,label:'音のあるトラックを2つ以上'}),dcC('scale',{set:[0,2,4,7,9],label:'ド・レ・ミ・ソ・ラだけ'})]},
 {id:'race',title:'ぜんそくりょく レース',desc:'エンジン全開！ ドラムとベースでぐいぐい加速しよう。',c:[dcC('bpm',{a:150,b:180,label:'テンポ 150〜180'}),dcC('kick',{n:12,label:'キックを12回以上'}),dcC('hat',{n:16,label:'ハイハットを16回以上'}),dcC('bass',{n:8,label:'ベースを8音以上'}),dcC('scale',{set:[0,3,5,7,10],label:'ド・ミ♭・ファ・ソ・シ♭だけ'})]},
 {id:'birth',title:'おたんじょうび',desc:'だれかのお祝いの曲。ベルでおめでとう！ ドでにっこり終わろう。',c:[dcC('bpm',{a:100,b:130,label:'テンポ 100〜130'}),dcC('inst',{k:'bell',label:'ベル（きらきらした音）をつかう'}),dcC('mel',{n:8,label:'メロディを8音以上'}),dcC('ends',{pc:0,label:'メロディの最後は「ド」'}),dcC('scale',{set:[0,2,4,5,7,9,11],label:'白い鍵盤（ドレミファソラシ）の音だけ'})]},
 {id:'magic',title:'まほうの じゅもん',desc:'たった4種類の高さで作る、ふしぎな呪文。「ソ」で魔法が完成するよ。',c:[dcC('melMax',{n:4,label:'メロディの高さは4種類以下'}),dcC('mel',{n:6,label:'メロディを6音以上'}),dcC('inst',{k:'bell',label:'ベル（きらきらした音）をつかう'}),dcC('ends',{pc:7,label:'メロディの最後は「ソ」'}),dcC('scale',{set:[0,4,7,9],label:'ド・ミ・ソ・ラだけ'})]},
 {id:'drumonly',title:'ドラムだけで かっこよく',desc:'メロディなし！ ドラムのパターンだけで、聴く人をのせよう。',c:[dcC('bpm',{a:90,b:130,label:'テンポ 90〜130'}),dcC('drumAll',{label:'キック・スネア・ハイハットぜんぶ'}),dcC('kick',{n:8,label:'キックを8回以上'}),dcC('snare',{n:4,label:'スネアを4回以上'}),dcC('hat',{n:12,label:'ハイハットを12回以上'})]}
];
function dcJst(d){var t=new Date((d||new Date()).getTime()+9*3600000);return t.getUTCFullYear()+'-'+('0'+(t.getUTCMonth()+1)).slice(-2)+'-'+('0'+t.getUTCDate()).slice(-2)}
function dcMd(day){var a=day.split('-'),d=new Date(Date.UTC(+a[0],+a[1]-1,+a[2]));return (+a[1])+'月'+(+a[2])+'日（'+'日月火水木金土'.charAt(d.getUTCDay())+'）'}
function dcTheme(day){var a=day.split('-'),n=Math.floor(Date.UTC(+a[0],+a[1]-1,+a[2])/86400000),t=DCP[n%DCP.length];
  return {day:day,id:t.id,md:dcMd(day),title:t.title,desc:t.desc,conds:t.c.concat([dcC('bars4',{label:DC_BARS})])}}
function dcRec(){try{return JSON.parse(localStorage.getItem('dtm-dc')||'{}')||{}}catch(e){return {}}}
function dcRecSet(day,v){try{var r=dcRec();r[day]=v;localStorage.setItem('dtm-dc',JSON.stringify(r))}catch(e){}}
function dcStreak(){var r=dcRec(),n=0,d=new Date();if(!r[dcJst(d)])d=new Date(d.getTime()-86400000);while(r[dcJst(d)]&&n<400){n++;d=new Date(d.getTime()-86400000)}return n}
function dcNick(){var n=rpNick();return (!n||n==='（なし）')?'ななし':n}
function dcEsc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function dcClose(){$('dc').classList.remove('on');try{(dcBack&&dcBack.focus&&document.contains(dcBack)?dcBack:document.body).focus()}catch(e){}}
function dcStart(){var day=dcJst(),th=dcTheme(day),rec=dcRec()[day];th.sent=rec?{ok:rec.ok,total:rec.total}:null;dcOpenDaw({dawChallenge:th})}
function dcShowGallery(){dcBack=dcIn?$('dawc'):$('dawf');$('dc').classList.add('on');dcGallery(dcJst())}
function dcOpenDaw(extra){dcClose();dcExtra=extra;if(dawcLoaded){openDawC();dcReadyC()}else openDawC()}
function dcGallery(day){var c=$('dcc'),days=[],i,d=new Date();for(i=0;i<7;i++){days.push(dcJst(new Date(d.getTime()-i*86400000)))}if(days.indexOf(day)<0)day=days[0];
  c.innerHTML='<div class="dh"><span>👥 みんなの作品</span><button class="dx" id="dcX">✕ とじる</button></div><h2 id="dcH" tabindex="-1">みんなの作品</h2><p class="dq"><label for="dcDay">日にちをえらぶ：</label><select id="dcDay">'+days.map(function(x){return '<option value="'+x+'"'+(x===day?' selected':'')+'>'+dcEsc(dcMd(x))+' 『'+dcEsc(dcTheme(x).title)+'』</option>'}).join('')+'</select></p><p class="ds" id="dcMs" role="status" aria-live="polite">よみこみ中…</p><ol class="dg" id="dcL"></ol><div class="db"><button id="dcBk">← とじる</button></div>';
  $('dcX').onclick=dcClose;$('dcBk').onclick=dcClose;$('dcDay').onchange=function(){dcGallery(this.value)};
  setTimeout(function(){try{$('dcH').focus()}catch(e){}},30);
  var tk=ACC?tokOK().catch(function(){return null}):Promise.resolve(null);
  tk.then(function(t){return sbf('/rest/v1/daily_entries?day=eq.'+day+'&select=id,created_at,nick,ok,total,bpm&order=created_at.desc&limit=200',{},t)}).then(function(r){if(!r.ok)return r.text().then(function(x){throw {s:r.status,t:x}});return r.json()}).then(function(a){
    if(!$('dcL')||$('dcDay').value!==day)return;var seen={},L=[];(a||[]).forEach(function(e){var k=e.nick||'';if(seen[k])return;seen[k]=1;L.push(e)});
    L.sort(function(x,y){return ((y.ok/(y.total||1))-(x.ok/(x.total||1)))||0});
    $('dcMs').textContent=L.length?L.length+'人の作品があるよ。「♪きく」でDAWにひらけるよ（きくだけで、保存はされないよ）。':'この日の作品は、まだないよ。いちばん乗りになろう！';
    var ol=$('dcL');L.forEach(function(e){var li=document.createElement('li');var full=e.total&&e.ok===e.total;li.innerHTML='<span class="n"></span><span class="k"></span><button type="button">♪ きく</button>';li.children[0].textContent=e.nick||'ななし';li.children[1].textContent=(full?'🎉 全クリア ':'')+e.ok+'/'+e.total+'　テンポ'+e.bpm;
      li.children[2].setAttribute('aria-label',(e.nick||'ななし')+'さんの作品をきく');li.children[2].onclick=function(){dcListen(e.id,this)};ol.appendChild(li)})}).catch(function(e){if(!$('dcMs'))return;
    var miss=e&&(e.s===404||/PGRST205|does not exist|schema cache/i.test(e.t||''));
    $('dcMs').textContent=miss?'みんなの作品ひろばは、まだ準備中だよ（先生が準備しているよ）。':(navigator.onLine===false?'インターネットにつながっていないみたい。':'みんなの作品を読みこめなかったよ。あとでもう一度ためしてね。');try{if(e&&e.s)console.warn('daily',e.s,e.t)}catch(x){}})}
function dcListen(id,btn){if(btn){btn.disabled=true;btn.textContent='ひらいています…'}
  var tk=ACC?tokOK().catch(function(){return null}):Promise.resolve(null);
  tk.then(function(t){return sbf('/rest/v1/daily_entries?id=eq.'+encodeURIComponent(id)+'&select=nick,bpm,proj&limit=1',{},t)}).then(function(r){if(!r.ok)throw 0;return r.json()}).then(function(a){var e=a&&a[0];if(!e||!e.proj||!e.proj.T)throw 0;
    dcOpenDaw({dawListen:{T:e.proj.T,bpm:e.bpm||e.proj.bpm||120,nick:e.nick||'ななし'}})}).catch(function(){if(btn){btn.disabled=false;btn.textContent='♪ きく'}var m=$('dcMs');if(m)m.textContent='作品をひらけなかったよ。もう一度ためしてね。'})}
function dcSubmit(s){var fr=$('dawc').contentWindow;function say(ok,msg,sent){try{fr.postMessage({dcDone:{ok:ok,msg:msg,sent:sent}},'*')}catch(e){}}
  if(!s||!/^\d{4}-\d\d-\d\d$/.test(s.day||'')){say(false,'うまく送れなかったよ。');return}
  var pj=JSON.stringify(s.proj||{});if(pj.length>90000){say(false,'曲が大きすぎて送れなかったよ。音をへらしてね。');return}
  var row={day:s.day,theme:String(s.title||'').slice(0,60),nick:dcNick().slice(0,40),ok:s.ok|0,total:s.total|0,bpm:s.bpm|0,proj:s.proj};
  var tk=ACC?tokOK().catch(function(){return null}):Promise.resolve(null);
  tk.then(function(t){return sbf('/rest/v1/daily_entries',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(row)},t)}).then(function(r){
    if(!r.ok)return r.text().then(function(x){throw {s:r.status,t:x}});
    dcRecSet(row.day,{ok:row.ok,total:row.total,t:Date.now()});anHit('デイリー提出');
    say(true,'出せたよ！ '+row.ok+'/'+row.total+(row.ok===row.total?'　全クリア🎉':'')+'。ホームの「今日のお題」から、みんなの作品も聴けるよ。',{ok:row.ok,total:row.total})}).catch(function(e){
    var miss=e&&(e.s===404||/PGRST205|does not exist|schema cache/i.test(e.t||''));
    if(miss){dcRecSet(row.day,{ok:row.ok,total:row.total,t:Date.now()});say(false,'クリアは記録したけど、みんなへの提出は、まだ準備中で送れなかったよ。')}
    else{try{if(e&&e.s)console.warn('daily submit',e.s,e.t)}catch(x){}say(false,navigator.onLine===false?'インターネットにつながっていないみたい。つながったら、もう一度おしてね。':'うまく送れなかったよ。もう一度ためしてね。')}})}
$('dcCta').onclick=dcStart;$('mtC').onclick=dcStart;
$('dc').addEventListener('keydown',function(e){if(e.key==='Escape'){e.preventDefault();dcClose()}});
$('dc').addEventListener('pointerdown',function(e){if(e.target===$('dc'))dcClose()});
