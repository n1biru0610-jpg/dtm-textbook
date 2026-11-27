/* ---------- 図鑑：獲得の判定と保存（ステップ1） ----------
   持っているカードは、学習者の記録の bd.cards = {カードid: もらった時刻} に入れる。
   bd は称号・ログイン日数と同じ入れ物なので、アカウント（Supabase の progress 表）にそのまま保存される。新しい表は不要。 */
function zkCards(b){if(!b.cards||typeof b.cards!=='object'||Array.isArray(b.cards))b.cards={};return b.cards}
/* その条件が、いまどこまで進んだか。have/need。acc=false（ログインしていない）はログイン日数と提出を数えない */
function zkProg(c,p){var acc=!!bdAcc(),b=p&&p.bd||{},have=0,need=1;
  var done=function(id){return !!(p&&p.ls&&p.ls[id]&&p.ls[id].d)};
  if(c.k==='login'){need=c.n;have=acc&&Array.isArray(b.days)?b.days.length:0}
  else if(c.k==='post'){need=c.n;have=acc&&b.post?Object.keys(b.post).length:0}
  else if(c.k==='lesson'){need=1;have=done(c.id)?1:0}
  else if(c.k==='chap'||c.k==='basic'){var ids=[];CH.forEach(function(h){if(c.k==='basic'||h.n===c.n)ids=ids.concat(h.ids)});need=ids.length||1;have=ids.filter(done).length}
  return {have:Math.min(have,need),need:need,ok:have>=need}}
function zkHow(c){
  if(c.k==='login')return 'ログインした日が、ぜんぶで'+c.n+'日になる';
  if(c.k==='post')return '今日のお題に、曲を'+c.n+'回（べつの日に）提出する';
  if(c.k==='lesson'){var l=L.filter(function(x){return x.id===c.id})[0];return 'レッスン '+c.id+(l?'「'+l.title+'」':'')+' をクリアする'}
  if(c.k==='chap'){var h=chObj(c.n);return '第'+c.n+'章'+(h?'「'+h.title+'」':'')+'を全部クリアする'}
  return '基礎編のレッスンを全部クリアする'}
function zkLeft(c,p){var g=zkProg(c,p),n=g.need-g.have;
  if((c.k==='login'||c.k==='post')&&!bdAcc())return 'ログインすると、数えはじめるよ';
  return c.k==='login'?'あと'+n+'日':c.k==='post'?'あと'+n+'回':c.k==='lesson'?'あと1レッスン':'あと'+n+'レッスン'}
/* 条件を満たしたカードを足して、新しくもらった分を返す。一度もらったカードは消えない */
function zkEval(){var p=P();if(!p)return [];
  if(ACC&&ACC.pid===p.id&&!bdSync)return []; /* サーバーの記録を読みこむ前は保存しない（古い記録で上書きしないため） */
  var b=bdOf(p),own=zkCards(b),nw=[];
  ZKCARDS.forEach(function(d){if(!own[d.id]&&zkProg(d.c,p).ok){own[d.id]=Date.now();nw.push(d)}});
  if(nw.length){p.u=Date.now();saveDB()}
  return nw}
/* 表示用：持っているカード（まだ保存していない分も、条件を満たしていれば持っている扱い） */
function zkOwned(){var p=P(),o={};if(!p)return o;var own=p.bd&&p.bd.cards||{};ZKCARDS.forEach(function(d){if(own[d.id])o[d.id]=own[d.id];else if(zkProg(d.c,p).ok)o[d.id]=Date.now()});return o}
