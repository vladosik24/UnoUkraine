/* УНО Україна — мод: виправлення + столи, кастомізація карт, 3D, музика. Підключається після index.html */
(function(){
const $q=s=>document.querySelector(s);
const PF={pal:0,ic:0,ft:0,pt:0,fx:0,tb:0,d3:0,mus:0,mv:.5,sv:1};
try{Object.assign(PF,JSON.parse(localStorage.getItem('unopf')||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem('unopf',JSON.stringify(PF))}catch(e){}};
const wins=()=>{try{return stat().w||0}catch(e){return 0}};

/* ---------- СТИЛІ ---------- */
const st=document.createElement('style');
st.textContent=`
#hd{padding:4px 54px}
.btn-ghost{background:transparent;color:#fff;box-shadow:inset 0 0 0 2px #fff6;font:700 15px system-ui,sans-serif;padding:12px 22px;border-radius:14px}
.btn-ghost:active{box-shadow:inset 0 0 0 2px #fff6}
body[data-fr="ua"] .card{border-image:none;border-color:#0057b7 #0057b7 #ffd700 #ffd700;box-shadow:0 0 6px #ffd70066,0 3px 10px #0008}
.fly{transform:none;transition:transform .45s cubic-bezier(.2,.8,.3,1),opacity .15s .35s}
.fly.gone{opacity:0;transform:var(--ft)!important}
#settings{justify-content:flex-start;padding-top:20px}
.set-opt.locked{opacity:.45}
#msec input[type=range]{width:100%;padding:0;border:0;background:transparent;font:inherit;letter-spacing:0;text-transform:none;accent-color:#f5c400}
#msec .set-sec{margin-bottom:12px}
#msec .set-row{justify-content:flex-start}
body[data-ic="1"] .card:not(.back) .m{background:none;color:#fff;box-shadow:none;transform:none;font-size:30px;text-shadow:0 2px 4px #0008}
body[data-ic="1"] .card.big:not(.back) .m{font-size:36px}
body[data-ic="2"] .card:not(.back) .m{border-radius:14px 14px 50% 50%/10px 10px 50% 50%;transform:none}
body[data-ft="1"] .card{font-family:system-ui,sans-serif}
body[data-ft="2"] .card{font-family:"Courier New",monospace}
body[data-ft="3"] .card{font-family:Impact,"Arial Black",sans-serif;letter-spacing:1px}
body[data-pt="1"] .card:not(.back):not(.w){background-image:linear-gradient(45deg,#fff2 25%,transparent 25% 50%,#fff2 50% 75%,transparent 75%);background-size:14px 14px}
body[data-pt="2"] .card:not(.back):not(.w){background-image:linear-gradient(45deg,transparent 42%,#fff3 42% 58%,transparent 58%),linear-gradient(-45deg,transparent 42%,#fff3 42% 58%,transparent 58%);background-size:10px 10px}
body[data-pt="3"] .card:not(.back):not(.w){background-image:repeating-linear-gradient(90deg,#ffffff22 0 6px,transparent 6px 12px)}
body.d3 #mid{transform:perspective(700px) rotateX(22deg);transform-origin:50% 100%}
body.d3 .card{box-shadow:1px 1px 0 #0004,2px 2px 0 #0004,3px 4px 0 #0003,5px 9px 14px #000a}
body.d3 .card::after{content:'';position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:linear-gradient(calc(110deg + var(--tx,0)*1deg),transparent 35%,#ffffff40 48%,transparent 62%)}
body.d3 #hand .card{transform:perspective(500px) rotateY(calc(var(--tx,0)*.6deg)) rotateX(calc(var(--ty,0)*-.5deg))}
body.d3 #hand .card.can{transform:translateY(-14px) perspective(500px) rotateY(calc(var(--tx,0)*.6deg)) rotateX(calc(var(--ty,0)*-.5deg))}
.msp{position:fixed;width:7px;height:7px;border-radius:50%;background:#ffe27a;box-shadow:0 0 8px #fff;pointer-events:none;z-index:60;animation:spk .7s ease-out forwards}
.msp.fire{width:10px;height:10px;background:radial-gradient(#fff 0,#ff9a00 50%,#d6342c)}
.mrg{position:fixed;width:80px;height:80px;border-radius:50%;border:4px solid #f5c400;pointer-events:none;z-index:60;animation:rng .6s ease-out forwards}
@keyframes spk{to{transform:translate(var(--dx),var(--dy)) scale(.2);opacity:0}}
@keyframes rng{from{transform:scale(.3);opacity:.9}to{transform:scale(2.6);opacity:0}}`;
document.head.appendChild(st);
const tbs=document.createElement('style');tbs.id='mtb';document.head.appendChild(tbs);

/* ---------- ДАНІ ---------- */
const PAL=[
 {r:'#d6342c',y:'#f5c400',g:'#2e9b4e',b:'#1f5fbf'},
 {r:'#ef6f6c',y:'#f7d86b',g:'#6cc08b',b:'#6aa0e8'},
 {r:'#ff1f1f',y:'#ffe600',g:'#00c24a',b:'#1560ff'},
 {r:'#8e1f1f',y:'#a88a14',g:'#1d6b3a',b:'#17408f'}];
const TB=[
 ['Синій',0,'','#1f5fbf'],
 ['Сукно',0,'#app{background:radial-gradient(circle at 50% 45%,#2e8b57,#0b3d22 75%)}#mid{background:radial-gradient(ellipse,#3aa86a 0,#1f7a47 55%,transparent 72%)}','#2e8b57'],
 ['Дерево',1,'#app{background:repeating-linear-gradient(92deg,#5a381c 0 18px,#6b4423 18px 21px,#4e2f17 21px 36px)}#mid{background:radial-gradient(ellipse,#9a6a38 0,#6b4423 58%,transparent 74%)}','#6b4423'],
 ['Рушник',5,'#app{background:#7a1010 repeating-linear-gradient(45deg,#ffffff18 0 7px,transparent 7px 14px),repeating-linear-gradient(-45deg,#ffffff18 0 7px,transparent 7px 14px)}#mid{background:radial-gradient(ellipse,#fff3d6 0,#c4553a 55%,transparent 72%)}','#7a1010'],
 ['Степ',10,'#app{background:linear-gradient(180deg,#2f6fd6 0 52%,#f5c400 52%)}#mid{background:radial-gradient(ellipse,#ffe27a 0,#e0a800 55%,transparent 72%)}','#e0a800'],
 ['Космос',20,'#app{background:radial-gradient(1.5px 1.5px at 20% 30%,#fff,transparent),radial-gradient(1px 1px at 70% 20%,#fff,transparent),radial-gradient(1.5px 1.5px at 40% 80%,#fff,transparent),radial-gradient(1px 1px at 85% 65%,#fff,transparent),radial-gradient(circle at 50% 45%,#2a1b6e,#07051a 75%)}#mid{background:radial-gradient(ellipse,#6a4fe0 0,#35208f 55%,transparent 72%)}','#35208f'],
 ['Ніч',50,'#app{background:radial-gradient(circle at 50% 45%,#10192e,#03050a 75%)}#mid{background:radial-gradient(ellipse,#27406f 0,#16264a 55%,transparent 72%)}','#16264a']];
const PREV=[{c:'r',v:'7'},{c:'b',v:'D'},{c:'g',v:'S'},{c:'y',v:'R'},{c:'w',v:'F'}];

/* ---------- ЗАСТОСУВАННЯ ---------- */
function applyAll(){
  try{
    const d=document.body.dataset,pal=PAL[PF.pal]||PAL[0];
    d.ic=PF.ic;d.ft=PF.ft;d.pt=PF.pt;
    document.body.classList.toggle('d3',!!PF.d3);
    Object.assign(HEX,pal);
    for(const k in pal)document.documentElement.style.setProperty('--'+k,pal[k]);
    const t=TB[PF.tb];$q('#mtb').textContent=t&&wins()>=t[1]?t[2]:'';
    music();
    if(typeof lastV!=='undefined'&&lastV&&typeof playing!=='undefined'&&playing)render(lastV);
  }catch(e){console.log('mod apply',e)}
}

/* ---------- НАЛАШТУВАННЯ ---------- */
function build(){
  try{
    let box=$q('#msec');
    if(!box){
      box=document.createElement('div');box.id='msec';
      const s=document.querySelectorAll('#settings .set-sec');s[s.length-1].before(box);
      box.onclick=onClick;
      box.oninput=e=>{
        const k=e.target.dataset.s;if(!k)return;
        PF[k]=+e.target.value;save();if(k==='mv')music();
      };
    }
    const w=wins();
    const chip=(k,a)=>a.map((n,i)=>`<button class="set-toggle ${PF[k]===i?'on':''}" data-k="${k}" data-i="${i}">${n}</button>`).join('');
    box.innerHTML=`
    <div class="set-sec"><h3>👀 Перегляд</h3><div class="set-row">${PREV.map(c=>cardH(c)).join('')}</div></div>
    <div class="set-sec"><h3>🎨 Палітра карт</h3><div class="set-row">${chip('pal',['Класика','Пастель','Контраст','Темна'])}</div></div>
    <div class="set-sec"><h3>⭕ Значок</h3><div class="set-row">${chip('ic',['Овал','Мінімал','Щит'])}</div></div>
    <div class="set-sec"><h3>🔤 Шрифт</h3><div class="set-row">${chip('ft',['Georgia','Сучасний','Моно','Жирний'])}</div></div>
    <div class="set-sec"><h3>▦ Візерунок карти</h3><div class="set-row">${chip('pt',['Нема','Ромби','Хрестики','Смуги'])}</div></div>
    <div class="set-sec"><h3>✨ Ефект кладення</h3><div class="set-row">${chip('fx',['Нема','Іскри','Кільце','Вогонь'])}</div></div>
    <div class="set-sec"><h3>🪵 Стіл (відкриваються за перемоги)</h3><div class="set-grid">${TB.map((t,i)=>{
      const lock=w<t[1];
      return `<div class="set-opt ${PF.tb===i&&!lock?'on':''} ${lock?'locked':''}" data-tb="${i}"><div class="prev" style="width:60px;height:40px;border-radius:10px;background:${t[3]}"></div><span>${t[0]}${lock?' 🔒 '+t[1]:''}</span></div>`}).join('')}</div></div>
    <div class="set-sec"><h3>🧊 3D</h3><div class="set-row"><button class="set-toggle ${PF.d3?'on':''}" data-t="d3">3D-стіл і об'ємні карти (нахили телефон)</button></div></div>
    <div class="set-sec"><h3>🎵 Музика і звуки</h3><div class="set-row"><button class="set-toggle ${PF.mus?'on':''}" data-t="mus">🎵 Фонова музика</button></div>
      <p class="sub" style="margin:8px 0 2px">Гучність музики</p><input type="range" min="0" max="1" step=".05" value="${PF.mv}" data-s="mv">
      <p class="sub" style="margin:8px 0 2px">Гучність ефектів</p><input type="range" min="0" max="1.5" step=".05" value="${PF.sv}" data-s="sv"></div>`;
  }catch(e){console.log('mod build',e)}
}
function onClick(e){
  const c=e.target.closest('[data-k],[data-tb],[data-t]');if(!c)return;
  if(c.dataset.k)PF[c.dataset.k]=+c.dataset.i;
  else if(c.dataset.tb){if(wins()<TB[+c.dataset.tb][1]){try{SFX.bad()}catch(x){}return}PF.tb=+c.dataset.tb}
  else PF[c.dataset.t]=PF[c.dataset.t]?0:1;
  save();applyAll();build();try{hap('light')}catch(x){}
}
const sb=$q('#setbtn');if(sb)sb.addEventListener('click',build);

/* ---------- ВИПРАВЛЕННЯ ---------- */
const V0=window.view;
window.view=function(i){const v=V0(i);v.pd=pd;return v};

const R0=window.render;
window.render=function(v){
  R0(v);
  try{
    const s=$q('#stack');
    if(s){if(v.pd>0){s.textContent='+'+v.pd;s.classList.add('on')}else s.classList.remove('on')}
    hot=v.P.some(x=>x.c<=2)||v.hand.length<=2;
  }catch(e){}
};

window.showEndStats=function(v,e){
  const s=stat(),el=$q('#endstats');
  if(el)el.textContent=`Ігор: ${s.g} · Перемог: ${s.w} · Win rate: ${s.g?Math.round(s.w/s.g*100):0}%`;
  const row=$q('#achrow');if(!row)return;
  let pr=0;try{pr=+localStorage.getItem('unopress')||0}catch(x){}
  const A=[[s.w>=1,'🥉 Перша перемога'],[s.w>=10,'🥈 10 перемог'],[s.w>=50,'🥇 50 перемог'],[s.g>=25,'🎮 25 ігор'],[s.g>=100,'💯 100 ігор'],[pr>=5,'📢 Майстер УНО']].filter(a=>a[0]);
  row.innerHTML=A.length?A.map(a=>`<div class="ach got">${a[1]}</div>`).join(''):'<div class="sub" style="font-size:13px;opacity:.7">Нагород ще немає — перемагай!</div>';
};

const un=$q('#uno'),u0=un.onclick;
un.onclick=()=>{try{localStorage.setItem('unopress',(+localStorage.getItem('unopress')||0)+1)}catch(e){}u0()};

$q('#surr').onclick=()=>{
  const m=role==='host'?'Ти хост: якщо вийдеш, кімнату буде закрито для всіх. Вийти?':'Здатися і вийти в меню?';
  if(tg&&tg.showConfirm)tg.showConfirm(m,ok=>{if(ok)leave()});
  else if(confirm(m))leave();
};

/* звуки: без подвоєння на хості, штраф чують і гості */
let lu=0,lp=0;
const U0=SFX.uno,P0=SFX.pen;
SFX.uno=()=>{const n=Date.now();if(n-lu<500)return;lu=n;U0()};
SFX.pen=()=>{const n=Date.now();if(n-lp<500)return;lp=n;P0()};
const T0=window.tone;
window.tone=function(f,d,t,v,a){T0(f,d,t,(v==null?.28:v)*PF.sv,a)};

/* політ карти */
window.flyCard=function(f,t,c){
  if(!f||!t)return;
  const a=f.getBoundingClientRect(),b=t.getBoundingClientRect();
  const ax=a.left+a.width/2,ay=a.top+a.height/2,bx=b.left+b.width/2,by=b.top+b.height/2;
  const s=SYM[c.v]||c.v,d=document.createElement('div');
  d.className='card '+c.c+' fly';
  d.style.cssText=`left:${ax-32}px;top:${ay-48}px;width:64px;height:96px`;
  d.innerHTML=`<i class="x t"></i><b class="k">${s}</b><span class="m">${s}</span><b class="k e">${s}</b><i class="x bt"></i>`;
  document.body.appendChild(d);
  requestAnimationFrame(()=>requestAnimationFrame(()=>{d.style.setProperty('--ft',`translate(${bx-ax}px,${by-ay}px) scale(1.15)`);d.classList.add('gone')}));
  setTimeout(()=>d.remove(),650);
};
function burst(){
  const k=+PF.fx;if(!k)return;
  const r=$q('#top').getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2;
  if(k===2){const e=document.createElement('i');e.className='mrg';e.style.cssText=`left:${x-40}px;top:${y-40}px`;document.body.appendChild(e);setTimeout(()=>e.remove(),700);return}
  for(let i=0;i<(k===1?14:10);i++){
    const e=document.createElement('i'),a=Math.random()*6.28,d=40+Math.random()*50;
    e.className='msp'+(k===3?' fire':'');
    e.style.cssText=`left:${x}px;top:${y}px;--dx:${Math.cos(a)*d}px;--dy:${Math.sin(a)*d-(k===3?30:0)}px`;
    document.body.appendChild(e);setTimeout(()=>e.remove(),800);
  }
}
const F0=window.fx;
window.fx=function(pv,v){
  F0(pv,v);
  if(!pv)return;
  try{
    if(v.dn!==pv.dn){
      const src=pv.cur===v.me?$q('#hand'):$q('.op[data-j="'+pv.cur+'"]');
      flyCard(src,$q('#top'),v.top);burst();
    }
    if(v.msg!==pv.msg&&(/за УНО/.test(v.msg)||/бере \+/.test(v.msg)))SFX.pen();
  }catch(e){}
};

/* ---------- 3D-нахил ---------- */
const tilt=(x,y)=>{const s=document.documentElement.style;s.setProperty('--tx',Math.max(-30,Math.min(30,x)));s.setProperty('--ty',Math.max(-30,Math.min(30,y)))};
addEventListener('deviceorientation',e=>{if(PF.d3&&e.gamma!=null)tilt(e.gamma,(e.beta||0)-50)});
document.addEventListener('pointermove',e=>{if(PF.d3)tilt((e.clientX/innerWidth-.5)*60,(e.clientY/innerHeight-.5)*60)});

/* ---------- МУЗИКА (синтез) ---------- */
let MG=null,mt=0,ms=0,mi=3,mT=null,hot=false;
const SC=[220,246.94,261.63,293.66,329.63,392,440,493.88],BS=[110,87.31,98,82.41];
function mn(f,t,d,ty,v){
  const g=AC.createGain(),o=AC.createOscillator();
  o.type=ty;o.frequency.value=f;
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(v,t+.04);g.gain.exponentialRampToValueAtTime(.0001,t+d);
  o.connect(g);g.connect(MG);o.start(t);o.stop(t+d+.05);
}
function msch(){
  if(!PF.mus||!AC||!MG)return;
  MG.gain.setTargetAtTime(mute?0:PF.mv*.6,AC.currentTime,.1);
  const sp=60/(hot?112:76)/2;
  while(mt<AC.currentTime+.5){
    const s=ms%16,b=(ms>>4)%4;
    if(s===0){mn(BS[b],mt,sp*14,'sine',.4);[1,1.5,2].forEach(m=>mn(BS[b]*2*m,mt,sp*14,'triangle',.07))}
    if(s%2===0&&(s%8===0||Math.random()<.65)){mi=Math.max(0,Math.min(7,mi+(Math.random()*5|0)-2));mn(SC[mi],mt,sp*(s%4===0?3:1.6),'triangle',.16)}
    if(hot&&s%2===1)mn(SC[(mi+2)%8]*2,mt,sp*.9,'sine',.06);
    mt+=sp;ms++;
  }
}
function music(){
  try{
    if(PF.mus){
      unlockAudio();if(!AC)return;
      if(!MG){MG=AC.createGain();MG.gain.value=0;MG.connect(AC.destination)}
      if(!mT){mt=AC.currentTime+.1;mT=setInterval(msch,150)}
    }else if(mT){clearInterval(mT);mT=null;if(MG)MG.gain.value=0}
  }catch(e){}
}
addEventListener('pointerdown',()=>{if(PF.mus)music()});
document.addEventListener('visibilitychange',()=>{try{if(AC){document.hidden?AC.suspend():AC.resume()}}catch(e){}});

applyAll();
})();
