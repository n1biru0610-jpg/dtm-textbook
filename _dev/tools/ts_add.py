j=open('shell_ts.js',encoding='utf8').read()
rep("['rp','📮 報告一覧']]","['rp','📮 報告一覧'],['ts','🎧 届いた曲']]")
rep("  if(e.data.dawSubmit)dcSubmit(e.data.dawSubmit);\n","  if(e.data.dawSubmit)dcSubmit(e.data.dawSubmit);\n  if(e.data.tsSend)tsForm(e.data.tsSend);\n")
rep("function openStudioOld(){",j+"function openStudioOld(){")
