zj=open('zm_shell.js',encoding='utf8').read()
A="if(PHONE){document.documentElement.classList.add('phone');try{screen.orientation.lock('landscape').catch(function(){})}catch(e){}}"
rep(A,A+"\n"+zj)
rep("function openStudioOld(){","var dcIn=false;function dcTabSync(){var on=dcIn&&document.body.classList.contains('dm');$('mtC').setAttribute('aria-pressed',on);if(on)$('mtD').setAttribute('aria-pressed',false)}\nnew MutationObserver(dcTabSync).observe(document.body,{attributes:true,attributeFilter:['class']});\nfunction dcTabDaw(){openDaw()}\nfunction openStudioOld(){")
rep("$('mtD').onclick=openDaw;","$('mtD').onclick=function(){dcTabDaw()};")
