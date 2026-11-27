import re
base=open('l27.html',encoding='utf8').read()
def build(num,title,consts,steps):
    h=base
    def R(a,b):
        nonlocal h
        assert h.count(a)==1,(a[:50],h.count(a));h=h.replace(a,b)
    R('<title>2-7 ドラムを完成させよう</title>','<title>%s %s</title>'%(num,title))
    R('<header><b>2-7</b>　ドラムを完成させよう</header>','<header><b>%s</b>　%s</header>'%(num,title))
    i=h.index('var G0=mk('); j=h.index('function match(g)')
    h=h[:i]+consts+'\n'+steps+'\n'+h[j:]
    return h
c8='''var G1=mk({kick:[0,3,4],snare:[2,6],hat:[0,1,2,3,4,5,6,7]});
var I1=mk({kick:[0,4],snare:[2,6],hat:[0,1,2,3,4,5,6,7]});
var G0=mk({kick:[0,3,4,7],snare:[2,6],hat:[0,1,2,3,4,5,6,7]});
var I0=mk({snare:[2,6],hat:[0,1,2,3,4,5,6,7]});'''
s8='''var S=[
 {mode:'fill',goal:G1,init:I1,t:'ビートの「と」（ウラ拍）にもキックを置くと、リズムがはずんでノリが出るよ。まずは穴うめ。「？」のマスに置いてみよう。お手本を聴くと、完成形がわかるよ。',ok:'はずんだね！ 「2」の次の「と」にキックが入ると、ノリが出るよ。'},
 {mode:'ref',goal:G0,init:I0,t:'今度は、お手本を聴いて同じリズムを作ろう。スネアとハイハットは置いてあるよ。キックを、どこに置くかな？',ok:'そっくり！ ウラ拍のキックを、耳で見つけられたね。'},
 {mode:'free',last:1,t:'最後は自由制作。キックを「と」にも置いて、あなたのノリを作ろう！'}
];'''
c9='''var G1=mk({kick:[0,4],snare:[2,6],hat:[0,2,3,4,6,7]});
var I1=mk({kick:[0,4],snare:[2,6],hat:[0,1,2,3,4,5,6,7]});
var G0=mk({kick:[0,3,4],snare:[2,6],hat:[0,2,4,6]});
var I0=mk({kick:[0,3,4],snare:[2,6],hat:[0,1,2,3,4,5,6,7]});'''
s9='''var S=[
 {mode:'fill',goal:G1,init:I1,t:'音を鳴らさないところを「休符」というよ。休符があると、リズムにスキマができて、めりはりが出る。ハイハットを2つ消して、スキマを作ってみよう。お手本を聴くと、完成形がわかるよ。',ok:'スキマができたね！ 休符も、リズムの大事な一部だよ。'},
 {mode:'ref',goal:G0,init:I0,t:'今度は、お手本を聴いて同じリズムを作ろう。ハイハットは、どこをお休みにするかな？ 聴いて、いらないマスを消してみてね。',ok:'そっくり！ お休みの場所を、耳で見つけられたね。'},
 {mode:'free',last:1,t:'最後は自由制作。音をつめたり、休符でスカスカにしたり、好きなバランスで作ってみよう！'}
];'''
open('l28.html','w',encoding='utf8').write(build('2-8','ウラ拍でノリを出そう',c8,s8))
open('l29.html','w',encoding='utf8').write(build('2-9','休符でスキマを作ろう',c9,s9))
print('ok')
