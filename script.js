// Personalized guest name: reads ?to=Nama from the URL (e.g.
// https://situskamu.vercel.app/?to=Budi) and shows "Kepada : Budi" on
// the cover screen. If the link has no ?to= param, this block does
// nothing and the cover just shows the default text.
(function(){
  const params = new URLSearchParams(window.location.search);
  const guest = params.get('to');
  const el = document.getElementById('coverGuest');
  if(!el || !guest || !guest.trim()) return;
  el.textContent = 'Undangan Kepada : ' + guest.trim();
  el.hidden = false;
})();

window.dataLayer = window.dataLayer || [];

// Personalized guest name from the ?to= URL parameter (e.g. ?to=Budi).
// Also fed into dataLayer so GTM/GA4 can attach it to every event below.
var guestName = '';
(function(){
  var params = new URLSearchParams(window.location.search);
  var raw = params.get('to');
  if(!raw) return;
  guestName = decodeURIComponent(raw.replace(/\+/g, ' ')).trim();
  if(!guestName) return;
  var guestEl = document.getElementById('coverGuest');
  if(guestEl){
    guestEl.textContent = 'Kepada Yth. Bapak/Ibu/Saudara/i ' + guestName;
  }
  window.dataLayer.push({ guest_name: guestName });
})();

// Basic deterrent against casual photo saving: block right-click and
// drag on every photo. (Note: this only stops casual attempts — anyone
// using browser DevTools can still find the image, this just removes
// the easy one-click path.)
(function(){
  document.querySelectorAll('.tone-photo').forEach(function(img){
    img.addEventListener('contextmenu', function(e){ e.preventDefault(); });
    img.addEventListener('dragstart', function(e){ e.preventDefault(); });
  });
})();

// Cover / opening screen: unlocks scroll and starts the headline entrance
// animation only once the person taps "Buka Undangan".
(function(){
  const html = document.documentElement;
  const body = document.body;
  const cover = document.getElementById('coverScreen');
  const openBtn = document.getElementById('openInvitation');
  if(!cover || !openBtn) return;

  html.classList.add('cover-locked');

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
    openInvitation();
    // Add a real history entry so the browser's back button has
    // somewhere to go — otherwise the first "back" press exits the tab.
    history.pushState({ invitationOpen: true }, '', '#undangan');
  });

  window.addEventListener('popstate', function(e){
    if(!e.state || !e.state.invitationOpen){
      showCover();
    }
  });
})();

// Scroll progress indicator: thin bar at the top that fills as the page scrolls.
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

// Subtle parallax on the headline photo (moves the photo wrapper — the
// zoom animation lives on the <img> itself so the two don't fight over
// the transform property).
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

// Countdown to 11 Oct 2026, 16:00 WIB (UTC+7)
(function(){
  const target = new Date('2026-10-11T16:00:00+07:00').getTime();
  function setDigit(id, value){
    const el = document.getElementById(id);
    const next = String(value).padStart(2,'0');
    if(el.textContent !== next){
      el.textContent = next;
      el.classList.remove('tick'); // restart animation if still running
      void el.offsetWidth; // force reflow so the animation replays
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

// Scroll-reveal: fade + rise elements into view as the user scrolls down.
// Purely additive — adds classes at runtime, never touches the markup or its text.
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

// Track clicks on "Buka Google Maps"
(function(){
  const mapBtn = document.querySelector('.map-btn');
  if(!mapBtn) return;
  mapBtn.addEventListener('click', function(){
    window.dataLayer.push({ event: 'klik_maps', guest_name: guestName || '(tidak diketahui)' });
  });
})();
