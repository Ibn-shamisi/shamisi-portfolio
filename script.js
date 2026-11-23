/* ===== YOUR BOOKS: add one line per book. cover = file name in this folder (optional). =====
   Example:  { title: "Echoes of the Coast", author: "A. Shamisi Ahmed", price: "KSh 1,200", cover: "echoes.jpg", url: "https://shamisipublishers.co.ke/book/1" }  */
var BOOKS = [
];
(function(){
  var shelf = document.getElementById('shelf'); if (!shelf) return;
  function esc(s){ var d=document.createElement('div'); d.textContent=s||''; return d.innerHTML; }
  if (!BOOKS.length) {
    shelf.innerHTML = '<p class="empty">Browse every Shamisi title in our online shop. <a class="more" href="https://shamisipublishers.co.ke/#books">Open the shop &rarr;</a></p>'; return;
  }
  shelf.innerHTML = BOOKS.map(function(b){
    var jacket = b.cover ? '<img src="'+esc(b.cover)+'" alt="'+esc(b.title)+'" loading="lazy">' : '<span class="ph">'+esc(b.title)+'</span>';
    return '<a class="book" href="'+esc(b.url||'https://shamisipublishers.co.ke')+'"><span class="jacket">'+jacket+'</span><b>'+esc(b.title)+'</b><small>'+esc(b.author)+'</small><em>'+esc(b.price)+'</em></a>';
  }).join('');
})();
/* Shamisi Publishers portfolio: clock, flip board, pull-cord theme switch, doors. Plain JavaScript, no libraries. */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;

  /* 1. Nairobi clock */
  var tEl = document.getElementById('clockTime'), dEl = document.getElementById('clockDate');
  function tick() {
    try {
      var now = new Date();
      tEl.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Nairobi' });
      dEl.textContent = now.toLocaleDateString([], { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Nairobi' });
    } catch (e) {}
  }
  if (tEl && dEl) { tick(); setInterval(tick, 20000); }

  /* 2. Flip board: the notebook card turns a page every few seconds */
  var word = document.getElementById('flipword'), count = document.getElementById('flipcount');
  if (word) {
    var words = [];
    try { words = JSON.parse(word.getAttribute('data-words')); } catch (e) {}
    if (words.length > 1 && !reduce) {
      var i = 0;
      setInterval(function () {
        word.classList.add('out');
        setTimeout(function () {
          i = (i + 1) % words.length;
          word.textContent = words[i];
          if (count) count.textContent = '0' + (i + 1) + ' / 0' + words.length;
          word.classList.remove('out');
          word.classList.add('in');
          void word.offsetWidth;                 /* restart the transition */
          word.classList.remove('in');
        }, 330);
      }, 2600);
    }
  }

  /* 3. Pull cord: drag it down (or tap / press Enter) to switch day and night reading */
  var cord = document.getElementById('cord'), bead = document.getElementById('cordBead');
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('shamisi-theme', t); } catch (e) {}
  }
  function toggle() { setTheme(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); }
  if (cord && bead) {
    var startY = 0, dy = 0, dragging = false;
    bead.addEventListener('pointerdown', function (e) {
      dragging = true; startY = e.clientY; dy = 0;
      cord.classList.add('drag');
      try { bead.setPointerCapture(e.pointerId); } catch (x) {}
    });
    bead.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      dy = Math.max(0, Math.min(70, e.clientY - startY));
      cord.style.transform = 'translateY(' + dy + 'px)';
    });
    function release() {
      if (!dragging) return;
      dragging = false;
      cord.classList.remove('drag');
      cord.style.transform = '';
      toggle();                                  /* a pull or a simple tap both switch the lamp */
    }
    bead.addEventListener('pointerup', release);
    bead.addEventListener('pointercancel', function () { dragging = false; cord.classList.remove('drag'); cord.style.transform = ''; });
    bead.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault(); toggle();
        cord.style.transform = 'translateY(30px)';
        setTimeout(function () { cord.style.transform = ''; }, 150);
      }
    });
  }

  /* 4. Doors: click one to open it and see what happens inside */
  var doors = [].slice.call(document.querySelectorAll('.door'));
  var panels = [].slice.call(document.querySelectorAll('.panel'));
  var pick = document.querySelector('.pick');
  function openDoor(n) {
    doors.forEach(function (d, k) {
      var on = (k === n);
      d.classList.toggle('open', on);
      d.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    panels.forEach(function (p, k) { p.classList.toggle('show', k === n); });
    if (pick) pick.style.display = 'none';
  }
  doors.forEach(function (d, k) {
    d.addEventListener('click', function () { openDoor(k); });
  });

  /* 5. Numbers count up when they scroll into view */
  var nums = [].slice.call(document.querySelectorAll('[data-count]'));
  if (nums.length && 'IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        var el = en.target, end = parseInt(el.getAttribute('data-count'), 10) || 0, t0 = null;
        if (end < 2) return;
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min(1, (ts - t0) / 900);
          el.textContent = Math.round(end * p);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    nums.forEach(function (n) { io.observe(n); });
  }
})();
