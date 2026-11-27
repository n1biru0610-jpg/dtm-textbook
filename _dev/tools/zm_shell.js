(function(){
function blk(e){if(e.ctrlKey||e.metaKey)e.preventDefault()}
window.addEventListener('wheel',blk,{passive:false,capture:true});
window.addEventListener('keydown',function(e){if((e.ctrlKey||e.metaKey)&&/^[-+=_0]$/.test(e.key))e.preventDefault()},true);
document.addEventListener('gesturestart',function(e){e.preventDefault()});
function z(){var big=!PHONE&&matchMedia('(pointer:fine)').matches&&innerWidth>=1000;document.documentElement.style.zoom=big?'1.25':''}

})();
