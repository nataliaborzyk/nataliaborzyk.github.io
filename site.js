(function(){
  var EN={};
  var els=document.querySelectorAll('[data-t]');
  els.forEach(function(el){EN[el.getAttribute('data-t')]=el.innerHTML;});
  function setLang(l){
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
})();
