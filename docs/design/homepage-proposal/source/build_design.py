from pathlib import Path
import json, re, html, math, random, zipfile, shutil
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
import fitz
from PIL import Image

BASE=Path(__file__).parent
OUT=BASE.parent/'deliverables'
OUT.mkdir(exist_ok=True)
D=json.loads((BASE/'content.json').read_text())
C={'white':'#FFFFFF','ink':'#0A0A0A','blue':'#0000FF','paper':'#FAFAF8','surface':'#F5F5F2','muted':'#5F5F5F','line':'#DCDCD8','night':'#090910','light':'#B8B8C6'}

class Font:
    def __init__(self,name,weight=None):
        self.tt=TTFont(BASE/'fonts'/name)
        if 'fvar' in self.tt and weight:
            self.tt=instantiateVariableFont(self.tt,{'wght':weight},inplace=False)
        self.gs=self.tt.getGlyphSet();self.cm=self.tt.getBestCmap();self.units=self.tt['head'].unitsPerEm
        self.asc=self.tt['hhea'].ascent/self.units
    def width(self,t,size,tracking=0):
        return sum(self.gs[self.cm.get(ord(c),'.notdef')].width for c in t)*size/self.units+max(0,len(t)-1)*tracking
    def path(self,t,x,y,size,tracking=0):
        p=SVGPathPen(self.gs);s=size/self.units
        for c in t:
            g=self.gs[self.cm.get(ord(c),'.notdef')]
            g.draw(TransformPen(p,(s,0,0,-s,x,y)))
            x+=g.width*s+tracking
        return p.getCommands()

F={'regular':Font('Geist-Regular.ttf'),'medium':Font('Geist-Medium.ttf'),'semibold':Font('Geist-SemiBold.ttf'),'mono':Font('GeistMono-Regular.ttf'),'serif':Font('Lora.ttf',400),'inter':Font('Inter.ttf',400),'intersemi':Font('Inter.ttf',600)}
FAMILY={'regular':'Geist','medium':'Geist','semibold':'Geist','mono':'Geist Mono','serif':'Lora','inter':'Inter','intersemi':'Inter'}
WEIGHT={'regular':400,'medium':500,'semibold':600,'mono':400,'serif':400,'inter':400,'intersemi':600}

class Canvas:
    def __init__(self,w,name):
        self.w=w;self.name=name;self.parts=[];self.edit=[];self.boxes=[];self.sections=[];self.idx=0
    def add(self,s):self.parts.append(s);self.edit.append(s)
    def rect(self,x,y,w,h,fill,r=0,stroke=None,sw=1,opacity=1):
        self.add(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" opacity="{opacity}"'+(f' stroke="{stroke}" stroke-width="{sw}"' if stroke else '')+'/>')
    def line(self,x,y,x2,y2,color=C['line'],sw=1):
        self.add(f'<path d="M{x} {y}H{x2}" fill="none" stroke="{color}" stroke-width="{sw}"/>' if y==y2 else f'<path d="M{x} {y}L{x2} {y2}" fill="none" stroke="{color}" stroke-width="{sw}"/>')
    def wrap(self,t,size,width,font='regular',tracking=0):
        lines=[]
        for para in t.split('\n'):
            line=''
            for word in para.split(' '):
                trial=line+' '+word if line else word
                if line and F[font].width(trial,size,tracking)>width:
                    lines.append(line);line=word
                else:line=trial
            lines.append(line)
        return lines
    def text(self,t,x,y,size=16,color=None,width=None,font='regular',lh=None,tracking=0,align='left',name=None):
        color=color or C['ink'];lh=lh or size*1.5
        lines=self.wrap(t,size,width,font,tracking) if width else t.split('\n')
        gid=f'text-{self.name.lower()}-{self.idx}';self.idx+=1
        outline=[];editable=[]
        for i,line in enumerate(lines):
            tw=F[font].width(line,size,tracking);xx=x if align=='left' else x-tw/2 if align=='center' else x-tw
            by=y+size*.80+i*lh
            outline.append(f'<path d="{F[font].path(line,xx,by,size,tracking)}" fill="{color}"/>')
            editable.append(f'<text x="{xx}" y="{by}" font-family="{FAMILY[font]}" font-weight="{WEIGHT[font]}" font-size="{size}" letter-spacing="{tracking}" fill="{color}">{html.escape(line)}</text>')
            self.boxes.append({'section':self.sections[-1]['name'] if self.sections else '', 'text':line,'x':xx,'y':y+i*lh,'w':tw,'h':lh})
        nm=html.escape(name or t[:80],quote=True)
        self.parts.append(f'<g id="{gid}" aria-label="{nm}"><title>{html.escape(t)}</title>'+''.join(outline)+'</g>')
        self.edit.append(f'<g id="{gid}" aria-label="{nm}">'+''.join(editable)+'</g>')
        return y+lh*len(lines)
    def label(self,t,x,y,color=None,width=None):
        return self.text(t,x,y,11,color or C['muted'],width,font='mono',lh=16,tracking=.8)
    def arrow(self,x,y,color=C['ink'],size=18,diag=False):
        p='M4 12H20M14 6L20 12L14 18' if not diag else 'M5 19L19 5M5 5H19V19'
        self.add(f'<g transform="translate({x} {y}) scale({size/24})"><path d="{p}" stroke="{color}" stroke-width="1.5" fill="none"/></g>')
    def button(self,t,x,y,variant='primary',h=48,width=None):
        w=width or F['medium'].width(t,14)+66
        fill=C['blue'] if variant=='primary' else C['white'] if variant=='inverse' else 'none'
        tc=C['white'] if variant in ['primary','dark-outline'] else C['ink']
        border=None if variant in ['primary','inverse'] else '#5B5B70' if variant=='dark-outline' else '#C8C8C5'
        self.rect(x,y,w,h,fill,4,border)
        self.text(t,x+20,y+(h-14)/2-1,14,tc,font='medium',lh=18)
        self.arrow(x+w-34,y+(h-18)/2,tc)
        return w
    def slot(self,x,y,w,h,number='01',label='PROJECT IMAGE',dark=False):
        bg='url(#slotDark)' if dark else 'url(#slotLight)'
        self.rect(x,y,w,h,bg,0,'#3E3E60' if dark else '#DDDDDF')
        col='#6E6E95' if dark else '#C4C4CF'
        self.line(x+24,y+24,x+w-24,y+h-24,col,.5)
        self.line(x+w-24,y+24,x+24,y+h-24,col,.5)
        self.rect(x+w/2-78,y+h/2-17,156,34,'#1B1B37' if dark else '#F1F1F4')
        self.text(label,x+w/2,y+h/2-5,10,'#D4D4E4' if dark else '#6F6F7E',font='mono',lh=14,align='center',tracking=.6)
        self.text(number,x+24,y+h-83,64,'#8F8FF7' if dark else '#B6B6EE',font='semibold',lh=70,tracking=-3)
    def icon(self,n,x,y,size=28,color=C['ink']):
        svg=(BASE/'icons'/f'{n}.svg').read_text()
        paths=re.findall(r'<path[^>]+>',svg)
        self.add(f'<g aria-label="{n}" transform="translate({x} {y}) scale({size/24})" fill="{color}">'+''.join(paths)+'</g>')
    def section(self,name,y,h,color):
        self.sections.append({'name':name,'y':y,'h':h})
        self.add(f'<g id="section-{len(self.sections)}" aria-label="{html.escape(name)}">')
        self.rect(0,y,self.w,h,color)
    def end(self):self.add('</g>')
    def save(self,height):
        self.height=height
        defs='''<defs><linearGradient id="hero" x1="0" y1="0" x2="1" y2=".8"><stop stop-color="#090910"/><stop offset=".65" stop-color="#0E0E28"/><stop offset="1" stop-color="#00007C"/></linearGradient><linearGradient id="slotDark" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#22224B"/><stop offset="1" stop-color="#101024"/></linearGradient><linearGradient id="slotLight" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#F5F5F2"/><stop offset="1" stop-color="#E3E3F6"/></linearGradient></defs>'''
        top=f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{self.w}" height="{height}" viewBox="0 0 {self.w} {height}"><title>Global Comm homepage — {self.name}</title><desc>Design proposal based on CLAUDE.md commit 3f5dea4 and three supplied design documents. Project and client media are explicitly marked as asset slots because the inspected deployment supplied none.</desc>{defs}'
        p=OUT/f'Global-Comm-{self.name}.svg';p.write_text(top+''.join(self.parts)+'</svg>')
        (OUT/f'Global-Comm-{self.name}-live-text.svg').write_text(top+''.join(self.edit)+'</svg>')
        (BASE/f'{self.name}-layout.json').write_text(json.dumps({'width':self.w,'height':height,'sections':self.sections,'text':self.boxes},ensure_ascii=False,indent=2))
        return p

def desktop():
    a=Canvas(1440,'Desktop');M=88;R=1352;W=1264;y=0
    a.section('GlobalHeader',0,80,C['paper'])
    a.text(D['header']['wordmark'],M,32,16,font='semibold',lh=20,tracking=-.3)
    for x,link in zip([865,954,1061,1171],D['header']['nav']):a.text(link['label'],x,34,14,font='medium',lh=18)
    a.line(1250,25,1250,55);a.text('EN',1280,34,13,font='medium',lh=18);a.add('<path d="M1322 36L1327 41L1332 36" fill="none" stroke="#0A0A0A" stroke-width="1.5"/>');a.end();y=80
    a.section('Hero',y,868,'url(#hero)')
    a.label(D['hero']['eyebrow'],M,y+68,'#BABAD0')
    h=a.text(D['hero']['heading'],M,y+125,72,C['white'],width=740,font='semibold',lh=76,tracking=-2.5)
    q=a.text(D['hero']['support'],M,h+35,19,'#C8C8D7',width=602,lh=30)
    bw=a.button(D['hero']['primaryCTA']['label'],M,q+32)
    a.button(D['hero']['secondaryCTA']['label'],M+bw+14,q+32,'dark-outline')
    a.slot(918,y+108,434,408,'01','FEATURED PROJECT',True)
    a.label('SELECTED WORK',918,y+543,'#9B9BB4');a.text('Project title',918,y+575,26,C['white'],font='medium',lh=32)
    a.label('01 / 01',1260,y+583,'#B5B5CD');a.arrow(1324,y+580,C['white'],22)
    a.text(D['hero']['closing'],M,y+644,14,'#AAAABF',width=600,lh=23)
    a.line(M,y+721,R,y+721,'#36364E')
    a.label('SELECTED EXPERIENCE',M,y+755,'#A5A5BD')
    a.text(D['experience']['support'],M,y+784,13,'#BDBDCD',width=340,lh=20)
    for i in range(4):
        x=570+i*198;a.rect(x,y+766,166,48,'none',0,'#49495C');a.text(f'CLIENT LOGO {i+1:02}',x+83,y+785,10,'#A0A0B7',font='mono',align='center',lh=15)
    a.end();y+=868
    a.section('PlatformExpertise',y,424,C['white'])
    a.label(D['platforms']['label'],M,y+72)
    a.text('Platform\nExpertise',M,y+112,44,width=340,font='semibold',lh=48,tracking=-1.3)
    a.text(D['platforms']['support'],M,y+236,16,C['muted'],width=310,lh=26)
    bx=512;cw=210
    for i,(key,col) in enumerate([('google','#4285F4'),('meta','#0866FF'),('tiktok','#111111'),('linkedin','#0A66C2')]):
        a.icon(key,bx+i*cw+90,y+88,30,col)
        a.line(bx+i*cw,y+149,bx+(i+1)*cw,y+149,C['blue'] if i==0 else C['line'],2 if i==0 else 1)
    p=D['platforms']['items'][0]
    for i,(cap,note) in enumerate(zip(p['capabilities'],p['notes'])):
        x=bx+i*cw;a.label(f'0{i+1}',x,y+184,C['blue']);a.text(cap,x,y+222,15,font='semibold',lh=21);a.text(note,x,y+263,15,C['muted'],width=175,lh=24)
    a.end();y+=424
    a.section('PointOfView',y,640,C['night'])
    a.label('OUR POINT OF VIEW',612,y+95,'#9F9FB4')
    for i,line in enumerate(['We make your brand','impossible to ignore,','easy to trust, and','built to grow.']):
        a.text(line,720,y+158+i*81,70,'#8686FF' if i==1 else C['white'],font='semibold',lh=80,tracking=-2.2,align='center')
    a.rect(709,y+534,22,3,C['blue']);a.end();y+=640
    exp=D['expertise'];height=3210
    a.section('FrozenExpertise',y,height,C['white'])
    a.label(exp['kicker'],M,y+90)
    a.text(exp['title'],M,y+132,44,width=600,font='intersemi',lh=49,tracking=-.8)
    a.text('\n\n'.join(exp['body']),814,y+139,16,C['muted'],width=495,font='inter',lh=26)
    ry=y+386
    for i,it in enumerate(exp['items']):
        if i:a.line(M,ry-34,R,ry-34)
        imagex=M if i%2==0 else 762;textx=800 if i%2==0 else M
        a.slot(imagex,ry,590,570,it['number'],'SERVICE IMAGE')
        a.text(it['number'],textx,ry+3,13,C['blue'],font='intersemi',lh=18)
        yy=a.text(it['name'],textx+36,ry,24,width=510,font='intersemi',lh=29,tracking=-.4)
        yy=a.text(it['promise'],textx,yy+26,28,width=490,font='serif',lh=35,tracking=-.3)
        yy=a.text(it['body'],textx,yy+24,15,C['muted'],width=530,font='inter',lh=25)
        sy=yy+26
        for j,s in enumerate(it['scope']):
            xx=textx+(j%2)*277;py=sy+(j//2)*58
            a.text('—',xx,py,14,C['blue'],lh=21);a.text(s,xx+20,py,13,width=238,font='inter',lh=20)
        yy=sy+182;a.line(textx,yy,textx+536,yy,C['ink'])
        a.label(exp['outcomeLabel'].upper(),textx,yy+21)
        yy=a.text(it['outcome'],textx,yy+50,15,width=535,font='intersemi',lh=24)
        yy=a.text(it['cta']['label'],textx,yy+24,13,C['blue'],width=490,font='intersemi',lh=21);a.arrow(textx+515,yy-21,C['blue'])
        ry+=667
    a.button(exp['sectionCTA']['label'],M,y+height-108,'outline');a.end();y+=height
    a.section('SelectedWork',y,948,C['paper'])
    a.label('SELECTED WORK',M,y+77);a.text(D['work']['viewAll']['label'],1197,y+75,14,font='medium');a.arrow(1330,y+77)
    a.slot(M,y+139,784,536,'01');a.slot(920,y+139,432,237,'02');a.slot(920,y+438,432,237,'03')
    a.text('Project title',M,y+708,28,font='semibold',lh=34);a.arrow(838,y+712,size=25,diag=True)
    a.label('CLIENT · DISCIPLINES · YEAR',M,y+761)
    a.text('Project context and the contribution of Global Comm.',M,y+797,16,C['muted'],width=720,lh=25)
    a.text('Project title',920,y+399,17,font='medium',lh=22);a.arrow(1328,y+399,size=19,diag=True)
    a.text('Project title',920,y+702,17,font='medium',lh=22);a.arrow(1328,y+702,size=19,diag=True)
    a.label('DESIGN SLOTS · APPROVED PROJECT CONTENT REQUIRED',M,y+886);a.end();y+=948
    a.section('ClientLogoCloud',y,493,C['white'])
    a.label(D['experience']['label'],M,y+73)
    a.text(D['experience']['support'],M,y+112,37,width=850,font='semibold',lh=44,tracking=-1)
    for i in range(8):
        x=M+(i%4)*316;yy=y+239+(i//4)*88
        a.rect(x,yy,316,88,'none',0,C['line']);a.text(f'CLIENT LOGO {i+1:02}',x+158,yy+39,11,'#83838B',font='mono',align='center',lh=16,tracking=.8)
    a.end();y+=493
    a.section('EvidenceFaq',y,1410,C['surface'])
    a.label(D['evidence']['label'],M,y+83)
    a.text(D['evidence']['heading'],M,y+126,42,width=695,font='semibold',lh=47,tracking=-1.2)
    a.label(D['faq']['label'],930,y+83)
    a.text(D['faq']['support'],930,y+126,25,width=407,font='semibold',lh=31,tracking=-.5)
    fy=y+250
    for i,it in enumerate(D['faq']['items']):
        a.line(930,fy,1352,fy)
        end=a.text(it['question'],930,fy+24,15,width=350,font='medium',lh=24)
        a.text('−' if i==0 else '+',1333,fy+24,20,font='regular',lh=24)
        if i==0:end=a.text(it['answer'],930,end+18,14,C['muted'],width=390,lh=23)+8
        fy=end+24
    a.line(930,fy,1352,fy)
    ey=y+304
    for i,it in enumerate(D['evidence']['categories']):
        a.line(M,ey,820,ey)
        a.label(it['label'],M,ey+31,C['blue'])
        a.text(it['deliverable'],292,ey+24,27,width=520,font='semibold',lh=33,tracking=-.6)
        a.text(it['body'],292,ey+76,16,C['muted'],width=480,lh=26)
        for j,p in enumerate(it['points']):a.text('—  '+p,292,ey+170+j*26,14,width=490,lh=22)
        ey+=266
    a.end();y+=1410
    a.section('FinalCta',y,458,C['blue'])
    a.label("LET'S TALK",M,y+83,'#BDBDFF')
    a.text(D['finalCTA']['heading'],M,y+135,60,C['white'],width=720,font='semibold',lh=65,tracking=-1.8)
    a.text(D['finalCTA']['support'],956,y+151,21,C['white'],width=350,lh=32)
    a.button(D['finalCTA']['action']['label'],956,y+265,'inverse',width=356)
    a.end();y+=458
    a.section('Footer',y,410,C['paper'])
    a.text(D['footer']['wordmark'],M,y+73,16,font='semibold',lh=21)
    a.text(D['footer']['location'],M,y+111,14,C['muted'],lh=22)
    for i,it in enumerate(D['footer']['links']):a.text(it['label'],900+i*115,y+74,14,font='medium')
    a.text('FR    EN    ES',1191,y+115,12,C['muted'],font='mono')
    a.text('Building brands for a brighter tomorrow.',M,y+193,44,width=1170,font='semibold',lh=51,tracking=-1.4)
    a.line(M,y+306,R,y+306)
    a.text(D['footer']['copyright'],M,y+339,12,C['muted'],lh=19)
    for i,it in enumerate(D['footer']['legal']):a.text(it['label'],1124+i*83,y+339,12,C['muted'],lh=19)
    a.end();y+=410
    return a,a.save(y)

def mobile():
    a=Canvas(390,'Mobile');m=24;w=342;y=0
    a.section('GlobalHeader',0,72,C['paper'])
    a.text('GLOBAL COMMUNICATION\nCORPORATE™',m,23,10,font='semibold',lh=13,tracking=.1)
    a.text('MENU',326,30,10,font='mono',lh=15);a.end();y=72
    hh=1260;a.section('Hero',y,hh,'url(#hero)')
    a.label(D['hero']['eyebrow'],m,y+38,'#BDBDD2',width=w)
    hy=a.text(D['hero']['heading'],m,y+101,43,C['white'],width=w,font='semibold',lh=47,tracking=-1.3)
    hy=a.text(D['hero']['support'],m,hy+26,16,'#C9C9D8',width=w,lh=26)
    a.button(D['hero']['primaryCTA']['label'],m,hy+27,width=w)
    a.button(D['hero']['secondaryCTA']['label'],m,hy+87,'dark-outline',width=w)
    hy+=177;a.slot(m,hy,w,255,'01','FEATURED PROJECT',True)
    a.text('Project title',m,hy+280,21,C['white'],font='medium',lh=27);a.label('01 / 01',304,hy+284,'#BDBDD2')
    hy+=343;a.text(D['hero']['closing'],m,hy,13,'#B2B2C9',width=w,lh=22)
    hy+=90;a.line(m,hy,366,hy,'#41415A');a.label('SELECTED EXPERIENCE',m,hy+28,'#BDBDD2')
    for i in range(2):a.rect(m+i*177,hy+61,165,50,'none',0,'#4C4C61');a.text(f'CLIENT LOGO {i+1:02}',m+i*177+82.5,hy+81,9,'#C0C0D5',font='mono',align='center',lh=13)
    a.end();y+=hh
    a.section('PlatformExpertise',y,648,C['white'])
    a.label(D['platforms']['label'],m,y+53);a.text('Platform Expertise',m,y+89,33,width=w,font='semibold',lh=38,tracking=-.9)
    a.text(D['platforms']['support'],m,y+145,16,C['muted'],width=w,lh=25)
    for i,(key,col) in enumerate([('google','#4285F4'),('meta','#0866FF'),('tiktok','#111111'),('linkedin','#0A66C2')]):
        x=m+i*w/4;a.icon(key,x+29,y+228,26,col);a.line(x,y+276,x+w/4,y+276,C['blue'] if i==0 else C['line'],2 if i==0 else 1)
    p=D['platforms']['items'][0]
    for i,(cap,note) in enumerate(zip(p['capabilities'],p['notes'])):
        x=m+(i%2)*180;yy=y+310+(i//2)*152;a.label(f'0{i+1}',x,yy,C['blue']);a.text(cap,x,yy+29,13,font='semibold',lh=18);a.text(note,x,yy+60,13,C['muted'],width=155,lh=21)
    a.end();y+=648
    a.section('PointOfView',y,505,C['night'])
    a.label('OUR POINT OF VIEW',109,y+67,'#AAAABF')
    for i,line in enumerate(['We make your brand','impossible to ignore,','easy to trust,','and built to grow.']):
        a.text(line,195,y+139+i*58,32,'#9A9AFF' if i==1 else C['white'],font='semibold',lh=41,tracking=-1.2,align='center')
    a.rect(185,y+419,20,3,C['blue']);a.end();y+=505
    exp=D['expertise'];start=y
    # Content-first sizing for the long service section.
    b=Canvas(390,'Expertise-temp');b.sections=[{'name':'FrozenExpertise'}]
    yy=b.label(exp['kicker'],m,y+62,width=w)
    yy=b.text(exp['title'],m,yy+25,32,width=w,font='intersemi',lh=37,tracking=-.7)
    yy=b.text('\n\n'.join(exp['body']),m,yy+27,15,C['muted'],width=w,font='inter',lh=25)+49
    for i,it in enumerate(exp['items']):
        if i:b.line(m,yy-24,366,yy-24)
        b.slot(m,yy,w,225,it['number'],'SERVICE IMAGE');yy+=263
        b.text(it['number'],m,yy+3,12,C['blue'],font='intersemi',lh=17)
        yy=b.text(it['name'],m+30,yy,23,width=312,font='intersemi',lh=29,tracking=-.4)
        yy=b.text(it['promise'],m,yy+22,26,width=w,font='serif',lh=33,tracking=-.3)
        yy=b.text(it['body'],m,yy+22,15,C['muted'],width=w,font='inter',lh=25)+24
        for s in it['scope']:
            b.text('—',m,yy,13,C['blue'],lh=20);yy=b.text(s,m+20,yy,13,width=w-20,font='inter',lh=21)+9
        b.line(m,yy+14,366,yy+14);yy+=38;b.label(exp['outcomeLabel'].upper(),m,yy);yy+=32
        yy=b.text(it['outcome'],m,yy,15,width=w,font='intersemi',lh=25)
        yy=b.text(it['cta']['label'],m,yy+25,13,C['blue'],width=w,font='intersemi',lh=21)+80
    b.button(exp['sectionCTA']['label'],m,yy-24,'outline',width=w);yy+=84
    a.section('FrozenExpertise',start,yy-start,C['white']);a.parts+=b.parts;a.edit+=b.edit;a.boxes+=b.boxes;a.end();y=yy
    a.section('SelectedWork',y,1393,C['paper'])
    a.label('SELECTED WORK',m,y+55);a.text('View all work',248,y+54,12,font='medium',lh=19);a.arrow(349,y+54,size=17)
    for i in range(3):
        yy=y+113+i*393;a.slot(m,yy,w,280,f'0{i+1}');a.text('Project title',m,yy+304,22,font='semibold',lh=28);a.arrow(346,yy+307,diag=True);a.label('CLIENT · DISCIPLINES · YEAR',m,yy+346)
    a.label('DESIGN SLOTS · PROJECT CONTENT REQUIRED',m,y+1330,width=w);a.end();y+=1393
    a.section('ClientLogoCloud',y,602,C['white'])
    a.label(D['experience']['label'],m,y+59);a.text(D['experience']['support'],m,y+101,29,width=w,font='semibold',lh=35,tracking=-.8)
    for i in range(8):
        x=m+(i%2)*171;yy=y+251+(i//2)*69;a.rect(x,yy,171,69,'none',0,C['line']);a.text(f'CLIENT LOGO {i+1:02}',x+85.5,yy+29,9,'#83838B',font='mono',lh=14,align='center',tracking=.4)
    a.end();y+=602
    start=y;b=Canvas(390,'Evidence-temp');b.sections=[{'name':'EvidenceFaq'}]
    b.label(D['evidence']['label'],m,y+58);yy=b.text(D['evidence']['heading'],m,y+98,32,width=w,font='semibold',lh=38,tracking=-.9)+47
    for it in D['evidence']['categories']:
        b.line(m,yy,366,yy);b.label(it['label'],m,yy+24,C['blue']);yy=b.text(it['deliverable'],m,yy+59,25,width=w,font='semibold',lh=31,tracking=-.5)
        yy=b.text(it['body'],m,yy+21,15,C['muted'],width=w,lh=25)+22
        for p in it['points']:yy=b.text('—  '+p,m,yy,14,width=w,lh=23)+5
        yy+=45
    b.label(D['faq']['label'],m,yy+32,width=w);yy=b.text(D['faq']['support'],m,yy+77,26,width=w,font='semibold',lh=32,tracking=-.5)+35
    for i,it in enumerate(D['faq']['items']):
        b.line(m,yy,366,yy);end=b.text(it['question'],m,yy+24,15,width=300,font='medium',lh=24);b.text('−' if i==0 else '+',350,yy+25,18,lh=23)
        if i==0:end=b.text(it['answer'],m,end+18,14,C['muted'],width=w,lh=23)+8
        yy=end+25
    b.line(m,yy,366,yy);yy+=64
    a.section('EvidenceFaq',start,yy-start,C['surface']);a.parts+=b.parts;a.edit+=b.edit;a.boxes+=b.boxes;a.end();y=yy
    a.section('FinalCta',y,511,C['blue'])
    a.label("LET'S TALK",m,y+65,'#CCCCFF');end=a.text(D['finalCTA']['heading'],m,y+112,40,C['white'],width=w,font='semibold',lh=44,tracking=-1.2)
    end=a.text(D['finalCTA']['support'],m,end+29,18,C['white'],width=w,lh=28);a.button(D['finalCTA']['action']['label'],m,end+31,'inverse',width=w);a.end();y+=511
    a.section('Footer',y,612,C['paper'])
    a.text(D['footer']['wordmark'],m,y+54,12,width=w,font='semibold',lh=18);a.text(D['footer']['location'],m,y+88,13,C['muted'],lh=20)
    for i,it in enumerate(D['footer']['links']):a.text(it['label'],m+i*90,y+146,13,font='medium',lh=19)
    a.text('FR    EN    ES',m,y+196,12,C['muted'],font='mono',lh=18)
    a.text('Building brands for a brighter tomorrow.',m,y+260,33,width=w,font='semibold',lh=38,tracking=-1)
    a.line(m,y+453,366,y+453);a.text(D['footer']['copyright'],m,y+482,11,C['muted'],width=w,lh=18)
    for i,it in enumerate(D['footer']['legal']):a.text(it['label'],m+i*85,y+531,11,C['muted'],lh=18)
    a.end();y+=612
    return a,a.save(math.ceil(y))

def render(svg,path,scale=.75,clip=None):
    import subprocess
    args=['inkscape',str(svg),'--export-type=png','--export-background=#ffffff',f'--export-filename={path}',f'--export-dpi={96*scale}']
    if clip is not None:args.append('--export-area='+':'.join(str(v) for v in clip))
    subprocess.run(args,check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)

if __name__=='__main__':
    da,dp=desktop();ma,mp=mobile()
    render(dp,OUT/'Global-Comm-Desktop.png',.8)
    render(mp,OUT/'Global-Comm-Mobile.png',1.25)
    # Overview shows enough scale for immediate review.
    render(dp,BASE/'desktop-top.png',1,fitz.Rect(0,0,1440,1372))
    render(mp,BASE/'mobile-top.png',1,fitz.Rect(0,0,390,2022))
    p=Image.new('RGB',(1820,1780),'#E9E9E6')
    p.paste(Image.open(BASE/'desktop-top.png').resize((1368,1303)),(32,80))
    p.paste(Image.open(BASE/'mobile-top.png').resize((351,1820)),(1434,80))
    from PIL import ImageDraw,ImageFont
    draw=ImageDraw.Draw(p);tf=ImageFont.truetype(str(BASE/'fonts/Geist-Medium.ttf'),23)
    draw.text((32,26),'Global Comm / Homepage — desktop',font=tf,fill='#18181C')
    draw.text((1434,26),'Mobile',font=tf,fill='#18181C')
    sf=ImageFont.truetype(str(BASE/'fonts/Geist-Regular.ttf'),19)
    draw.text((32,1430),'Design proposal · Project and client media are labelled asset slots.',font=sf,fill='#545458')
    draw.text((32,1470),'Geist typography / #0000FF / Existing section order and source copy',font=sf,fill='#545458')
    p.save(OUT/'Global-Comm-Preview.png')
    bad=[]
    for a in [da,ma]:
        for b in a.boxes:
            if b['x']<-.5 or b['x']+b['w']>a.w+.5:bad.append({'artboard':a.name,**b})
    (BASE/'validation.json').write_text(json.dumps({'desktop':{'width':da.w,'height':da.height,'sections':da.sections},'mobile':{'width':ma.w,'height':ma.height,'sections':ma.sections},'horizontal_overflows':bad},ensure_ascii=False,indent=2))
    print(json.dumps({'desktop_height':da.height,'mobile_height':ma.height,'horizontal_overflows':bad},ensure_ascii=False))
