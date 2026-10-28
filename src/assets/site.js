(() => {
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
  const behavior=()=>reduce.matches?'instant':'smooth';
  const menu=$('.menu-toggle'), nav=$('#navigation');
  const closeMenu=()=>{document.body.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open menu');};
  menu.addEventListener('click',()=>{const open=!document.body.classList.contains('menu-open');document.body.classList.toggle('menu-open',open);menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu');if(open)$('a',nav).focus();});
  $$('a',nav).forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(!document.body.classList.contains('menu-open'))return;if(e.key==='Escape'){closeMenu();menu.focus();}if(e.key==='Tab'){const links=$$('a',nav),first=links[0];if(e.shiftKey&&document.activeElement===first){e.preventDefault();menu.focus();}else if(!e.shiftKey&&document.activeElement===menu){e.preventDefault();first.focus();}}});
  window.matchMedia('(min-width: 801px)').addEventListener('change',e=>{if(e.matches)closeMenu();});

  // Content remains visible if JavaScript or motion support is unavailable.
  if('IntersectionObserver' in window&&!reduce.matches){
    const reveals=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('is-visible');reveals.unobserve(e.target);}}),{threshold:.04,rootMargin:'0px 0px -25px 0px'});
    document.documentElement.classList.add('motion-ready');
    $$('[data-reveal]').forEach(el=>reveals.observe(el));
  }
  let ticking=false;const hero=$('.hero'),visual=$('.hero-visual'),header=$('.header');
  const updateScroll=()=>{const max=document.documentElement.scrollHeight-innerHeight;header.style.setProperty('--progress',max>0?String(Math.max(0,Math.min(1,scrollY/max))):'0');if(hero&&visual&&!reduce.matches&&innerWidth>800&&scrollY<hero.offsetHeight)visual.style.transform=`translateY(${Math.min(scrollY*.09,50)}px)`;ticking=false;};
  addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(updateScroll);ticking=true;}},{passive:true});addEventListener('resize',()=>{if(visual)visual.style.transform='';updateScroll();});updateScroll();

  // Native horizontal scrolling and explicit controls; no forced page-scroll capture.
  $$('.photo-section').forEach(section=>{
    const rail=$('.photo-rail',section),frames=$$('.photo-frame',rail),prev=$('[data-rail-prev]',section),next=$('[data-rail-next]',section),count=$('.rail-count',section),bar=$('.rail-baseline',section);
    const offsets=()=>frames.map(el=>el.offsetLeft-frames[0].offsetLeft);
    const current=()=>{const os=offsets();let at=0;for(let i=0;i<os.length;i++)if(rail.scrollLeft>=os[i]-30)at=i;return at;};
    const update=()=>{const max=rail.scrollWidth-rail.clientWidth;const atEnd=rail.scrollLeft>=max-3;const i=atEnd?frames.length-1:current();count.textContent=`${String(i+1).padStart(2,'0')} / ${String(frames.length).padStart(2,'0')}`;prev.disabled=rail.scrollLeft<3;next.disabled=atEnd;bar.style.setProperty('--rail-progress',`${Math.max(1/frames.length,Math.min(1,(rail.scrollLeft+rail.clientWidth)/rail.scrollWidth))*100}%`);};
    const move=d=>{const os=offsets(),i=current();rail.scrollTo({left:os[Math.max(0,Math.min(frames.length-1,i+d))],behavior:behavior()});};
    prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
    rail.addEventListener('keydown',e=>{if(e.target!==rail)return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});
    rail.addEventListener('scroll',update,{passive:true});addEventListener('resize',update);$$('img',rail).forEach(im=>im.addEventListener('load',update));update();
  });

  // Accessible native dialog: keyboard navigation, focus containment and focus return.
  const dialog=$('.lightbox'),large=$('.lightbox__image',dialog),caption=$('.lightbox__cap',dialog),previous=$('.lightbox__prev',dialog),next=$('.lightbox__next',dialog);
  let pictures=[],pictureIndex=0,pictureTitle='',returnFocus=null,previousOverflow='';
  const showPicture=()=>{large.src=pictures[pictureIndex];large.alt=`${pictureTitle}${pictures.length>1?' photo '+(pictureIndex+1):''}`;caption.textContent=`${pictureTitle}${pictures.length>1?' · '+(pictureIndex+1)+' / '+pictures.length:''}`;previous.hidden=next.hidden=pictures.length<2;};
  const openViewer=(set,index,title,trigger)=>{pictures=set;pictureIndex=index;pictureTitle=title;returnFocus=trigger;showPicture();previousOverflow=document.body.style.overflow;document.body.style.overflow='hidden';dialog.showModal();$('.lightbox__close',dialog).focus();};
  $('.lightbox__close',dialog).addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;if(returnFocus?.isConnected)returnFocus.focus({preventScroll:true});});
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  const step=d=>{pictureIndex=(pictureIndex+d+pictures.length)%pictures.length;showPicture();};
  previous.addEventListener('click',()=>step(-1));next.addEventListener('click',()=>step(1));
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();step(-1);}if(e.key==='ArrowRight'){e.preventDefault();step(1);}});
  $$('[data-photo]').forEach(button=>button.addEventListener('click',()=>{const rail=button.closest('.photo-rail');const buttons=rail?$$('[data-photo]',rail):[button];openViewer(buttons.map(b=>b.dataset.photo),buttons.indexOf(button),rail?rail.getAttribute('aria-label'):button.dataset.caption,button);}));

  $$('.album').forEach(album=>{
    const full=album.dataset.full.split('|'),thumbs=$$('.album-thumbs button',album),main=$('.album-open',album),mainImg=$('img',main),count=$('.album-count',album),strip=$('.album-thumbs',album);let index=0;
    const go=n=>{index=(n+full.length)%full.length;mainImg.src=$('img',thumbs[index]).src;mainImg.alt=$('img',thumbs[index]).alt;count.textContent=`${index+1} / ${full.length}`;thumbs.forEach((t,i)=>{t.classList.toggle('is-active',index===i);t.setAttribute('aria-pressed',String(index===i));});const t=thumbs[index];strip.scrollTo({left:t.offsetLeft-thumbs[0].offsetLeft-(strip.clientWidth-t.clientWidth)/2,behavior:behavior()});};
    $('.album-prev',album).addEventListener('click',()=>go(index-1));$('.album-next',album).addEventListener('click',()=>go(index+1));thumbs.forEach((t,i)=>t.addEventListener('click',()=>go(i)));main.addEventListener('click',()=>openViewer(full,index,album.dataset.title,main));
  });

  // Muted background films are visitor controlled and pause off screen.
  $$('.ambient-video').forEach(v=>{
    const control=$('.video-toggle',v.parentElement);v.muted=true;
    const sync=()=>{const playing=!v.paused;control.innerHTML=`${playing?'Pause video':'Play video'} <span aria-hidden="true">${playing?'Ⅱ':'▷'}</span>`;control.setAttribute('aria-label',`${playing?'Pause':'Play'} background video`);};
    control.addEventListener('click',async()=>{if(v.paused){try{await v.play();}catch{control.textContent='Video unavailable';}}else v.pause();sync();});
    v.addEventListener('play',sync);v.addEventListener('pause',sync);
    if('IntersectionObserver' in window)new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)v.pause();}),{threshold:.1}).observe(v);
    document.addEventListener('visibilitychange',()=>{if(document.hidden)v.pause();});
    reduce.addEventListener('change',e=>{if(e.matches)v.pause();});
  });
})();
