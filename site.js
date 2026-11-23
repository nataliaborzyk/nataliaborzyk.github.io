(function(){
  var EN={};
  var els=document.querySelectorAll('[data-t]');
  els.forEach(function(el){EN[el.getAttribute('data-t')]=el.innerHTML;});
  var T0=document.title;
  function setLang(l){
    document.title=(l==='pl'&&window.PL&&window.PL.__title)?window.PL.__title:T0;
    els.forEach(function(el){
      var k=el.getAttribute('data-t');
      var v=(l==='pl'&&window.PL&&window.PL[k]!==undefined)?window.PL[k]:EN[k];
      if(v!==undefined) el.innerHTML=v;
    });
    document.documentElement.lang=l;
    document.querySelectorAll('[data-set-lang]').forEach(function(b){b.setAttribute('aria-pressed',b.getAttribute('data-set-lang')===l?'true':'false');});
    try{localStorage.setItem('nbc-lang',l);}catch(e){}
  }
  document.querySelectorAll('[data-set-lang]').forEach(function(b){b.addEventListener('click',function(){setLang(b.getAttribute('data-set-lang'));});});
  var saved=null;try{saved=localStorage.getItem('nbc-lang');}catch(e){}
  if(!saved&&(navigator.language||'').toLowerCase().indexOf('pl')===0)saved='pl';
  if(saved==='pl')setLang('pl');
  var form=document.getElementById('contact-form');
  if(form){form.addEventListener('submit',function(e){
    e.preventDefault();
    var ok=document.getElementById('form-ok'),err=document.getElementById('form-err');
    var lang=document.documentElement.lang;
    var data=new FormData(form);
    fetch(form.action,{method:'POST',body:data,headers:{'Accept':'application/json'}}).then(function(r){
      if(r.ok){form.hidden=true;ok.hidden=false;err.hidden=true;}else{err.hidden=false;}
    }).catch(function(){err.hidden=false;});
  });}
  // ---- label shelf + viewer
  var stage=document.getElementById('viewer-stage');
  document.querySelectorAll('.jar').forEach(function(j){j.addEventListener('click',function(){
    var k=j.getAttribute('data-label');
    document.querySelectorAll('.jar').forEach(function(o){o.classList.toggle('is-on',o===j);});
    document.getElementById('v-cut').src='img/cut-'+k+'.webp';
    document.getElementById('v-file').src='img/file-'+k+'.jpg';
    document.getElementById('v-die').src='img/die-'+k+'.png';
    document.getElementById('viewer-name').textContent=j.getAttribute('data-name');
    var n=j.getAttribute('data-kind')==='n';
    document.getElementById('spec-f').hidden=n;document.getElementById('spec-n').hidden=!n;
    if(window.innerWidth<960){document.getElementById('viewer').scrollIntoView({behavior:'smooth',block:'start'});}
  });});
  var bt=document.getElementById('bleed-toggle');
  if(bt&&stage){bt.addEventListener('change',function(){stage.classList.toggle('show-file',bt.checked);});}
  document.querySelectorAll('[data-toggle="decal"]').forEach(function(c){c.addEventListener('change',function(){document.getElementById('decal').classList.toggle('show-cut',c.checked);});});
  // ---- slider
  document.querySelectorAll('[data-slider]').forEach(function(sl){
    var track=sl.querySelector('.slides'),n=track.children.length,i=0,cnt=sl.querySelector('.sl-count');
    function go(k){i=(k+n)%n;track.style.transform='translateX('+(-100*i)+'%)';cnt.textContent=(i+1)+' / '+n;}
    sl.querySelector('.sl-prev').addEventListener('click',function(){go(i-1);});
    sl.querySelector('.sl-next').addEventListener('click',function(){go(i+1);});
    var x0=null;track.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});
    track.addEventListener('touchend',function(e){if(x0===null)return;var dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>40)go(i+(dx<0?1:-1));x0=null;});
    go(0);
  });
  // ---- stories
  document.querySelectorAll('.st-phone').forEach(function(ph){
    var names=JSON.parse(ph.getAttribute('data-stories')),slides=ph.querySelectorAll('.st-slide'),bars=ph.querySelectorAll('.st-bars i'),
      thumbs=document.querySelectorAll('.st-thumb'),nm=ph.querySelector('.st-name'),av=ph.querySelector('.st-head .ig-av'),i=0,t0=0,dur=5000,paused=false,raf;
    var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function show(k){i=(k+slides.length)%slides.length;t0=performance.now();
      slides.forEach(function(s,j){s.classList.toggle('is-on',j===i);});
      bars.forEach(function(b,j){b.classList.toggle('done',j<i);b.firstChild.style.width=j<i?'100%':'0';});
      thumbs.forEach(function(b,j){b.classList.toggle('is-on',j===i);});nm.textContent=names[i];av.textContent=names[i].replace(/^i/,'').charAt(0).toUpperCase();}
    function tick(now){if(!paused&&!reduce){var p=Math.min(1,(now-t0)/dur);bars[i].firstChild.style.width=(p*100)+'%';if(p>=1)show(i+1);}else{t0=now-(parseFloat(bars[i].firstChild.style.width)||0)/100*dur;}raf=requestAnimationFrame(tick);}
    ph.querySelector('.st-tap--next').addEventListener('click',function(){show(i+1);});
    ph.querySelector('.st-tap--prev').addEventListener('click',function(){show(i-1);});
    ph.addEventListener('mouseenter',function(){paused=true;});ph.addEventListener('mouseleave',function(){paused=false;});
    thumbs.forEach(function(b){b.addEventListener('click',function(){show(+b.getAttribute('data-go'));});});
    show(0);raf=requestAnimationFrame(tick);
  });
  // ---- format tabs
  var tabs=document.querySelectorAll('.tab[data-tab]'),walls=document.querySelectorAll('.fwall');
  tabs.forEach(function(tb){tb.addEventListener('click',function(){var k=+tb.getAttribute('data-tab');tabs.forEach(function(o,j){o.classList.toggle('is-on',j===k);});walls.forEach(function(w,j){w.classList.toggle('is-on',j===k);});});});
  // ---- newsletter scroll height
  function nlh(){document.querySelectorAll('.nl-screen').forEach(function(s){s.style.setProperty('--sh',s.clientHeight+'px');});}
  nlh();window.addEventListener('resize',nlh);
  // ---- pattern studio
  var pat=document.getElementById('pat');
  if(pat){
    document.querySelectorAll('.sw').forEach(function(b){b.addEventListener('click',function(){
      pat.style.setProperty('--tile','url(img/dingo-'+b.getAttribute('data-cw')+'.jpg)');
      document.querySelectorAll('.sw').forEach(function(o){o.classList.toggle('is-on',o===b);o.setAttribute('aria-pressed',o===b?'true':'false');});});});
    var sc=document.getElementById('pat-scale');sc.addEventListener('input',function(){pat.style.setProperty('--size',sc.value+'px');});
    document.getElementById('tile-toggle').addEventListener('change',function(e){pat.classList.toggle('show-tile',e.target.checked);});
    ['sky','lilac','mint','grey'].forEach(function(k){var i=new Image();i.src='img/dingo-'+k+'.jpg';});
  }
  // ---- smooth FAQ
  var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('details').forEach(function(d){
    var s=d.querySelector('summary'),body=s.nextElementSibling;if(!body||rm)return;
    var busy=false;
    s.addEventListener('click',function(e){
      e.preventDefault();if(busy)return;busy=true;
      var cs=getComputedStyle(body),mt=cs.marginTop;
      if(!d.open){
        d.open=true;var h=body.offsetHeight;
        var a=body.animate([{height:'0px',marginTop:'0px',opacity:0},{height:h+'px',marginTop:mt,opacity:1}],{duration:340,easing:'cubic-bezier(.2,.7,.2,1)'});
        a.onfinish=function(){busy=false;};
      }else{
        var h2=body.offsetHeight;
        var b=body.animate([{height:h2+'px',marginTop:mt,opacity:1},{height:'0px',marginTop:'0px',opacity:0}],{duration:260,easing:'cubic-bezier(.4,0,.6,1)'});
        b.onfinish=function(){d.open=false;busy=false;};
      }
    });
  });
  // ---- branding
  var ut=document.querySelectorAll('[data-utab]'),up=document.querySelectorAll('.upanel');
  ut.forEach(function(b){b.addEventListener('click',function(){var k=+b.getAttribute('data-utab');ut.forEach(function(o,j){o.classList.toggle('is-on',j===k);});up.forEach(function(p,j){p.classList.toggle('is-on',j===k);});});});
  var bl=document.getElementById('bb-logo'),bs=document.getElementById('bb-stage');
  if(bl){
    document.querySelectorAll('[data-ver]').forEach(function(b){b.addEventListener('click',function(){var v=b.getAttribute('data-ver');
      document.querySelectorAll('[data-ver]').forEach(function(o){o.classList.toggle('is-on',o===b);});
      bl.classList.toggle('is-h',v==='h');bl.classList.toggle('is-v',v==='v');
      document.querySelectorAll('[data-cap]').forEach(function(c){c.hidden=c.getAttribute('data-cap')!==v;});});});
    document.getElementById('cs-toggle').addEventListener('change',function(e){bl.classList.toggle('show-cs',e.target.checked);});
    document.querySelectorAll('.vbtn').forEach(function(b){b.addEventListener('click',function(){
      bs.style.setProperty('--fg',b.getAttribute('data-fg'));bs.style.setProperty('--bg',b.getAttribute('data-bg'));
      document.querySelectorAll('.vbtn').forEach(function(o){o.classList.toggle('is-on',o===b);});});});
    document.querySelectorAll('.swatch').forEach(function(b){b.addEventListener('click',function(){
      var h=b.getAttribute('data-copy');try{navigator.clipboard.writeText(h);}catch(e){}
      b.classList.add('copied');setTimeout(function(){b.classList.remove('copied');},1500);});});
  }
})();
