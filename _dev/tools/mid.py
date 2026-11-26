# MIDIファイル（SMF）を読んで、テンポ・トラック名・音（開始tick, 音の高さ, 長さtick, チャンネル）をJSONで出す
# 使い方：python3 mid.py out.mid
import sys,json
def parse(path):
  d=open(path,'rb').read()
  assert d[:4]==b'MThd','MThd がない'
  fmt=int.from_bytes(d[8:10],'big');ntr=int.from_bytes(d[10:12],'big');ppq=int.from_bytes(d[12:14],'big')
  i=14;tracks=[]
  while i<len(d):
    assert d[i:i+4]==b'MTrk','MTrk がない';L=int.from_bytes(d[i+4:i+8],'big');t=d[i+8:i+8+L];i+=8+L
    p=0;tick=0;run=None;notes=[];tempo=[];name='';on={};bad=[]
    def vlq():
      nonlocal p
      v=0
      while True:
        c=t[p];p+=1;v=(v<<7)|(c&127)
        if c<128:return v
    while p<len(t):
      tick+=vlq();st=t[p]
      if st==0xFF:
        ty=t[p+1];p+=2;l=vlq();data=t[p:p+l];p+=l
        if ty==0x51:tempo.append([tick,round(60e6/int.from_bytes(data,'big'),2)])
        if ty==3:name=data.decode('utf8','replace')
        continue
      if st&0x80:run=st;p+=1
      k=run&0xF0;ch=run&15
      if k in(0x80,0x90):
        n,vel=t[p],t[p+1];p+=2
        if k==0x90 and vel>0:
          if (ch,n) in on:bad.append(['重なり',tick,n])
          on[(ch,n)]=tick
        else:
          s=on.pop((ch,n),None)
          if s is None:bad.append(['開始なしの終了',tick,n])
          else:notes.append([s,n,tick-s,ch])
      elif k in(0xC0,0xD0):p+=1
      else:p+=2
    for (ch,n),s in on.items():bad.append(['終了なし',s,n])
    tracks.append({'name':name,'tempo':tempo,'notes':sorted(notes),'bad':bad})
  return {'fmt':fmt,'ntr':ntr,'ppq':ppq,'tracks':tracks}
if __name__=='__main__':print(json.dumps(parse(sys.argv[1]),ensure_ascii=False))
