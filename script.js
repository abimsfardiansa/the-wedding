// Countdown to 11 Oct 2026, 16:00 WIB (UTC+7)
(function(){
  const target = new Date('2026-10-11T16:00:00+07:00').getTime();
  function tick(){
    const now = Date.now();
    let diff = target - now;
    if(diff < 0) diff = 0;
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    document.getElementById('cdDays').textContent = String(days).padStart(2,'0');
    document.getElementById('cdHours').textContent = String(hours).padStart(2,'0');
    document.getElementById('cdMinutes').textContent = String(minutes).padStart(2,'0');
    document.getElementById('cdSeconds').textContent = String(seconds).padStart(2,'0');
  }
  tick();
  setInterval(tick, 1000);
})();



function copyNum(){
  const num = document.getElementById('bankNum').innerText;
  navigator.clipboard.writeText(num).then(function(){
    const note = document.getElementById('copyNote');
    note.textContent = 'Nomor rekening disalin';
    setTimeout(function(){ note.textContent=''; }, 2200);
  });
}
