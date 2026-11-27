/* ---------- 図鑑：MIDIパック・音源をスタジオで使う（ステップ4） ----------
   持っているカードの中身を、自由DAW（#dawf）とお題DAW（#dawc）に {zkOwn:[...]} で送る。
   DAWの右の「もらった素材」から置ける。図鑑の「スタジオで使う」は、自由DAWを開いて {zkUse:...} で置く。 */
function zkDawList(){var own=zkOwned();return ZKCARDS.filter(function(d){return own[d.id]&&(ZKPK[d.id]||ZKSND[d.id])}).map(function(d){var k=ZKPK[d.id]||null;return {id:d.id,ic:d.ic,name:d.name,tn:k?k.tn:'',sub:k&&k.sub||'',pk:k,snd:ZKSND[d.id]||null}})}
var zkDawSig=null;
function zkDawPost(w,l){try{if(w)w.postMessage({zkOwn:l},'*')}catch(e){}}
function zkDawSync(){var l=zkDawList(),s=l.map(function(c){return c.id}).join(',');if(s===zkDawSig)return;zkDawSig=s;['dawf','dawc'].forEach(function(id){var e=$(id);if(e&&e.srcdoc)zkDawPost(e.contentWindow,l)})}
window.addEventListener('message',function(e){if(!e.data||!e.data.dawReady)return;var a=$('dawf'),b=$('dawc');if((a&&e.source===a.contentWindow)||(b&&e.source===b.contentWindow))zkDawPost(e.source,zkDawList())});
setInterval(function(){try{zkDawSync()}catch(e){}},3000);
function zkToStudio(d){var c=zkDawList().filter(function(x){return x.id===d.id})[0];if(!c)return;
  zkDetClose();zkClose();try{dcClose()}catch(e){}dcMig(P());dawfExtra={zkUse:c};dawWantFree=true;
  if(dawLoaded){openDaw();var pp=P();$('dawf').contentWindow.postMessage(Object.assign({dawFree:1,dawProject:pp&&pp.dproj||null,dawProjs:pp&&pp.dprojs||[],dawCur:pp&&pp.dcur||null},dawfExtra),'*');dawWantFree=false;dawfExtra=null}else openDaw()}
