window.dataLayer = window.dataLayer || [];

var guestName = '';
(function(){
  var params = new URLSearchParams(window.location.search);
  var raw = params.get('to');
  if(raw){
    guestName = decodeURIComponent(raw.replace(/\+/g, ' ')).trim();
  }
})();
(function(){
  document.querySelectorAll('.tone-photo').forEach(function(img){
    img.addEventListener('contextmenu', function(e){ e.preventDefault(); });
    img.addEventListener('dragstart', function(e){ e.preventDefault(); });
  });
})();

(function(){
  const html = document.documentElement;
  const body = document.body;
  const cover = document.getElementById('coverScreen');
  const openBtn = document.getElementById('openInvitation');
  const guestEl = document.getElementById('coverGuest');
  const nameForm = document.getElementById('coverNameForm');
  const nameInput = document.getElementById('guestNameInput');
  const nameError = document.getElementById('coverNameError');
  if(!cover || !openBtn) return;

  html.classList.add('cover-locked');

  if(guestName){
    if(guestEl) guestEl.textContent = 'Undangan Kepada ' + guestName;
    window.dataLayer.push({ guest_name: guestName });
  } else if(nameForm){
    nameForm.hidden = false;
  }

  if(nameInput){
    nameInput.addEventListener('keydown', function(e){
      if(e.key === 'Enter') openBtn.click();
    });
  }

  function openInvitation(){
    cover.classList.add('is-open');
    html.classList.remove('cover-locked');
    body.classList.add('invitation-open');
    window.dataLayer.push({ event: 'buka_undangan', guest_name: guestName || '(tidak diketahui)' });
  }

  function showCover(){
    cover.classList.remove('is-open');
    html.classList.add('cover-locked');
    body.classList.remove('invitation-open');
    window.scrollTo(0, 0);
  }

  openBtn.addEventListener('click', function(){
    if(nameForm && !nameForm.hidden){
      const typed = nameInput.value.trim();
      if(!typed){
        if(nameError) nameError.textContent = 'Isi nama dulu, ya.';
        nameInput.focus();
        return;
      }
      guestName = typed;
      if(guestEl) guestEl.textContent = 'Undangan Kepada ' + guestName;
      window.dataLayer.push({ guest_name: guestName });
    }
    openInvitation();
    history.pushState({ invitationOpen: true }, '', '#undangan');
  });

  window.addEventListener('popstate', function(e){
    if(!e.state || !e.state.invitationOpen){
      showCover();
    }
  });
})();

(function(){
  const bar = document.getElementById('progressBar');
  if(!bar) return;
  let ticking = false;
  function update(){
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = pct + '%';
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive:true });
  update();
})();

(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const inner = document.querySelector('.headline-media-inner');
  if(!inner || prefersReduced) return;
  let ticking = false;
  function update(){
    const offset = Math.min(window.scrollY * 0.18, 60);
    inner.style.transform = 'translateY(-' + offset + 'px)';
    ticking = false;
  }
  window.addEventListener('scroll', function(){
    if(!ticking){
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive:true });
})();

(function(){
  const target = new Date('2026-10-11T16:00:00+07:00').getTime();
  function setDigit(id, value){
    const el = document.getElementById(id);
    const next = String(value).padStart(2,'0');
    if(el.textContent !== next){
      el.textContent = next;
      el.classList.remove('tick'); 
      void el.offsetWidth; 
      el.classList.add('tick');
    }
  }
  function tick(){
    const now = Date.now();
    let diff = target - now;
    if(diff < 0) diff = 0;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    setDigit('cdDays', days);
    setDigit('cdHours', hours);
    setDigit('cdMinutes', minutes);
    setDigit('cdSeconds', seconds);
  }
  tick();
  setInterval(tick, 1000);
})();

(function(){
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const selectors = [
    '.countdown .kicker', '.cd-box',
    '.greeting .salam', '.greeting p', '.couple-grid',
    '.gallery-head h2', '.gal-grid img',
    '.location h2', '.location p', '.location .event-date', '.location .addr', '.location .map-btn',
    '.gift .kicker', '.gift p', '.gift .bank-card',
    '.thankyou .kicker', '.thankyou h2', '.thankyou p', '.thankyou .closing', '.thankyou .sign'
  ];
  const els = Array.from(document.querySelectorAll(selectors.join(',')));
  if(prefersReduced || !('IntersectionObserver' in window)){
    els.forEach(el => el.classList.add('reveal', 'is-visible'));
    return;
  }
  els.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = (i % 5) * 70 + 'ms';
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));
})();



function copyNum(){
  const num = document.getElementById('bankNum').innerText;
  navigator.clipboard.writeText(num).then(function(){
    const note = document.getElementById('copyNote');
    note.textContent = 'Nomor rekening disalin';
    setTimeout(function(){ note.textContent=''; }, 2200);
    window.dataLayer.push({ event: 'copy_rekening', guest_name: guestName || '(tidak diketahui)' });
  });
}

(function(){
  const mapBtn = document.querySelector('.map-btn');
  if(!mapBtn) return;
  mapBtn.addEventListener('click', function(){
    window.dataLayer.push({ event: 'klik_maps', guest_name: guestName || '(tidak diketahui)' });
  });
})();
