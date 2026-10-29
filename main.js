/* EMK Marketing, ljus version.
   1) Prickade illustrationer ritas med kod (moln, filmklappa, spår). 2) Header, karusell, fade-in, räknare, logotyper. */
(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  $('#year').textContent = new Date().getFullYear();
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';   // varje sida börjar högst upp

  /* ---------------------------------------------------------------- Prickad stil (stippling) */
  const rng = seed => () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };

  // Ritar en form i färg på ett dolt papper och ersätter den sedan med slumpade prickar i formens färger.
  function stipple(canvas, W, H, draw, { seed = 1, density = 0.07, rMin = 0.7, rMax = 1.7 } = {}) {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = canvas.getBoundingClientRect().width || W;
    const s = Math.max(0.5, (cssW * dpr) / W);
    const pw = Math.round(W * s), ph = Math.round(H * s);
    const src = document.createElement('canvas'); src.width = pw; src.height = ph;
    const sctx = src.getContext('2d'); sctx.scale(s, s); draw(sctx, W, H);
    const data = sctx.getImageData(0, 0, pw, ph).data;
    canvas.width = pw; canvas.height = ph;
    const ctx = canvas.getContext('2d'); ctx.clearRect(0, 0, pw, ph);
    const rand = rng(seed), tries = Math.round(pw * ph * density);
    for (let i = 0; i < tries; i++) {
      const x = (rand() * pw) | 0, y = (rand() * ph) | 0, k = (y * pw + x) * 4, a = data[k + 3] / 255;
      if (a < 0.03 || rand() > Math.pow(a, 1.15)) continue;
      ctx.fillStyle = `rgb(${data[k]},${data[k + 1]},${data[k + 2]})`;
      ctx.beginPath(); ctx.arc(x + 0.5, y + 0.5, (rMin + rand() * (rMax - rMin)) * Math.max(0.8, s * 0.7), 0, 6.2832); ctx.fill();
    }
  }

  const ART = {
    // Moln: ljust champagnguld upptill, dämpat guld under
    cloud(canvas, seed) {
      stipple(canvas, 600, 300, (c, W, H) => {
        const g = c.createLinearGradient(0, H * 0.25, 0, H * 0.95);
        g.addColorStop(0, '#f6ecd2'); g.addColorStop(0.45, '#e3cd9b'); g.addColorStop(1, '#9a8a63');
        c.fillStyle = g; c.beginPath();
        const r = rng(seed * 7);
        [[.18, .66, .15], [.34, .5, .2], [.52, .42, .22], [.7, .52, .19], [.84, .66, .14], [.5, .72, .2], [.28, .74, .15], [.72, .76, .15]].forEach(([x, y, rad]) => {
          const j = 1 + (r() - 0.5) * 0.14;
          c.moveTo(x * W + rad * H * j, y * H); c.arc(x * W, y * H, rad * H * j, 0, 6.2832);
        });
        c.fill();
      }, { seed, density: 0.09 });
    },

    // Filmklappans underdel
    body(canvas) {
      stipple(canvas, 600, 520, (c) => {
        const g = c.createLinearGradient(60, 210, 480, 470);
        g.addColorStop(0, '#ecdcb4'); g.addColorStop(1, '#b58f45');
        c.fillStyle = g; roundRect(c, 60, 210, 420, 255, 20); c.fill();
        c.fillStyle = 'rgba(30,30,40,.85)';
        [[96, 262, 170, 11], [96, 296, 250, 11], [96, 330, 120, 11], [96, 364, 210, 11]].forEach(([x, y, w, h]) => roundRect(c, x, y, w, h, 5) && c.fill());
        c.fillStyle = '#14182a'; for (let i = 0; i < 5; i++) { roundRect(c, 300 + i * 34, 410, 22, 22, 5); c.fill(); }
      }, { seed: 21, density: 0.2, rMin: .8, rMax: 1.8 });
    },

    // Klappans arm med ränder (gångjärn nere till vänster)
    arm(canvas) {
      stipple(canvas, 600, 520, (c) => {
        c.save(); roundRect(c, 60, 146, 420, 58, 14); c.clip();
        c.fillStyle = '#f6efdc'; c.fillRect(60, 146, 420, 58);
        c.fillStyle = '#14182a';
        for (let i = -1; i < 10; i++) { c.beginPath(); const x = 60 + i * 84; c.moveTo(x, 204); c.lineTo(x + 42, 204); c.lineTo(x + 74, 146); c.lineTo(x + 32, 146); c.closePath(); c.fill(); }
        c.restore();
        c.fillStyle = '#b58f45'; c.beginPath(); c.arc(66, 204, 9, 0, 6.2832); c.fill();
      }, { seed: 34, density: 0.2, rMin: .8, rMax: 1.8 });
    },

    // Små ikoner till stegen
    'icon-target'(canvas) {
      stipple(canvas, 120, 120, (c) => {
        [[50, '#d9c9a0'], [37, '#f6efdc'], [24, '#c9a766'], [11, '#14182a']].forEach(([r, col]) => { c.fillStyle = col; c.beginPath(); c.arc(60, 60, r, 0, 6.2832); c.fill(); });
        c.strokeStyle = '#14182a'; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(60, 60); c.lineTo(104, 16); c.stroke();
      }, { seed: 61, density: 0.34, rMin: .8, rMax: 1.6 });
    },
    'icon-camera'(canvas) {
      stipple(canvas, 120, 120, (c) => {
        c.fillStyle = '#d9c9a0'; roundRect(c, 30, 24, 34, 18, 6); c.fill();
        c.fillStyle = '#c9a766'; roundRect(c, 12, 38, 96, 64, 14); c.fill();
        c.fillStyle = '#14182a'; c.beginPath(); c.arc(60, 70, 23, 0, 6.2832); c.fill();
        c.fillStyle = '#f6efdc'; c.beginPath(); c.arc(60, 70, 12, 0, 6.2832); c.fill();
        c.fillStyle = '#14182a'; c.beginPath(); c.arc(94, 52, 5, 0, 6.2832); c.fill();
      }, { seed: 62, density: 0.34, rMin: .8, rMax: 1.6 });
    },
    'icon-megaphone'(canvas) {
      stipple(canvas, 120, 120, (c) => {
        c.fillStyle = '#c9a766'; c.beginPath(); c.moveTo(16, 50); c.lineTo(76, 22); c.lineTo(76, 98); c.lineTo(16, 70); c.closePath(); c.fill();
        c.fillStyle = '#d9c9a0'; roundRect(c, 24, 68, 18, 34, 6); c.fill();
        c.fillStyle = '#14182a'; roundRect(c, 8, 48, 14, 24, 5); c.fill();
        c.strokeStyle = '#14182a'; c.lineWidth = 6; c.lineCap = 'round';
        [[88, 14], [100, 22]].forEach(([x, r]) => { c.beginPath(); c.arc(x - 8, 60, r + 6, -0.9, 0.9); c.stroke(); });
      }, { seed: 63, density: 0.34, rMin: .8, rMax: 1.6 });
    },
    'icon-chart'(canvas) {
      stipple(canvas, 120, 120, (c) => {
        c.fillStyle = '#d9c9a0'; roundRect(c, 14, 70, 22, 34, 5); c.fill();
        c.fillStyle = '#c9a766'; roundRect(c, 44, 50, 22, 54, 5); c.fill();
        c.fillStyle = '#14182a'; roundRect(c, 74, 24, 22, 80, 5); c.fill();
        c.strokeStyle = '#f6efdc'; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(18, 56); c.lineTo(52, 34); c.lineTo(84, 12); c.stroke();
      }, { seed: 64, density: 0.34, rMin: .8, rMax: 1.6 });
    },

    // Dammspår efter klappan (som en komet)
    trail(canvas) {
      stipple(canvas, 400, 400, (c, W, H) => {
        const g = c.createLinearGradient(W, 0, 0, H);
        g.addColorStop(0, 'rgba(226,196,120,1)'); g.addColorStop(0.5, 'rgba(214,182,120,.6)'); g.addColorStop(1, 'rgba(214,182,120,0)');
        c.fillStyle = g; c.beginPath(); c.moveTo(W * 0.98, H * 0.02); c.lineTo(0, H * 0.78); c.lineTo(W * 0.32, H); c.closePath(); c.fill();
      }, { seed: 55, density: 0.09, rMin: .7, rMax: 1.5 });
    }
  };
  function roundRect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); return true; }

  const drawArt = (scope = document) => $$('[data-art]', scope).forEach(cv => {
    const w = Math.round(cv.getBoundingClientRect().width);
    if (!w || cv.dataset.drawn === String(w)) return;          // dold sida eller redan ritad i den bredden
    const f = ART[cv.dataset.art]; if (f) { f(cv, +cv.dataset.seed || 1); cv.dataset.drawn = String(w); }
  });
  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => drawArt($('.view.is-active')), 300); });

  // Molnen följer musen lite grann (djup)
  if (!reduced && matchMedia('(hover: hover)').matches) {
    const layers = [['.cloud--a', 14], ['.cloud--b', -10], ['.cloud--c', 18], ['.board', -8]].map(([sel, k]) => [$(sel), k]);
    let tx = 0, ty = 0, cx = 0, cy = 0;
    addEventListener('pointermove', e => { tx = e.clientX / innerWidth - 0.5; ty = e.clientY / innerHeight - 0.5; }, { passive: true });
    (function loop() {
      cx += (tx - cx) * 0.05; cy += (ty - cy) * 0.05;
      layers.forEach(([el, k]) => { if (el) el.style.translate = `${cx * k}px ${cy * k}px`; });
      requestAnimationFrame(loop);
    })();
  }

  // Klicka på klappan: den smäller igen
  const board = $('.board');
  if (board) board.addEventListener('click', () => { board.classList.remove('is-clap'); void board.offsetWidth; board.classList.add('is-clap'); setTimeout(() => board.classList.remove('is-clap'), 700); });

  /* ---------------------------------------------------------------- Kundlogotyper (länkas från emkmarketing.se) */
  const logos = ['reseskaparna', 'aventyrsresor', 'festivalborg', 'fjallfrid', 'bonnie', 'caliente', 'the-lobby', 'tapas28', 'snnc', 'linsblocker', 'stg',
    'svensk-gymnastik', 'coahdan', 'gtg-golf', 'joina', 'hg', 'heylinn', 'foreningen-ekonomerna', 'indie-pen-publishing', 'ballersapp', 'skarmskold', 'grand-tours'];
  ['logosA', 'logosB'].forEach((id, k) => logos.forEach(f => {
    const img = new Image();
    img.src = `https://emkmarketing.se/images/logos/${f}.png`; img.alt = k ? '' : f; img.loading = 'lazy'; img.referrerPolicy = 'no-referrer';
    img.onerror = () => img.remove(); document.getElementById(id).appendChild(img);
  }));

  /* ---------------------------------------------------------------- Header */
  const header = $('#header'), burger = $('#burger'), nav = $('#nav');
  const onScroll = () => header.classList.toggle('is-stuck', scrollY > 40);
  onScroll(); addEventListener('scroll', onScroll, { passive: true });
  const setMenu = o => { burger.setAttribute('aria-expanded', String(o)); nav.classList.toggle('is-open', o); };
  burger.addEventListener('click', () => setMenu(burger.getAttribute('aria-expanded') !== 'true'));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

  /* ---------------------------------------------------------------- Karusell */
  const track = $('#track'), prev = $('#prev'), next = $('#next');
  const step = () => (track.querySelector('.pcard')?.getBoundingClientRect().width || 600) + 20;
  const sync = () => { prev.disabled = track.scrollLeft < 10; next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 10; };
  prev.addEventListener('click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
  next.addEventListener('click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
  track.addEventListener('scroll', sync, { passive: true }); addEventListener('resize', sync); sync();
  track.addEventListener('keydown', e => { if (e.key === 'ArrowRight') next.click(); if (e.key === 'ArrowLeft') prev.click(); });

  /* ---------------------------------------------------------------- Recensionskarusell */
  const rtrack = $('#rtrack'), rprev = $('#rprev'), rnext = $('#rnext');
  if (rtrack) {
    const cards = $$('.rcard', rtrack);
    const mark = () => {
      const mid = rtrack.getBoundingClientRect().left + rtrack.clientWidth / 2;
      let best = null, bd = Infinity;
      cards.forEach(c => { const r = c.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid); if (d < bd) { bd = d; best = c; } });
      cards.forEach(c => { c.classList.toggle('is-active', c === best); if (c !== best) c.classList.remove('is-open'); });
    };
    const rstep = () => (cards[0]?.getBoundingClientRect().width || 460) + 22;
    rprev.addEventListener('click', () => rtrack.scrollBy({ left: -rstep(), behavior: 'smooth' }));
    rnext.addEventListener('click', () => rtrack.scrollBy({ left: rstep(), behavior: 'smooth' }));
    rtrack.addEventListener('scroll', () => requestAnimationFrame(mark), { passive: true });
    rtrack.addEventListener('keydown', e => { if (e.key === 'ArrowRight') rnext.click(); if (e.key === 'ArrowLeft') rprev.click(); });
    cards.forEach(c => $('.rcard__q', c).addEventListener('click', () => c.classList.toggle('is-open')));
    addEventListener('resize', mark); setTimeout(mark, 60);
  }

  /* ---------------------------------------------------------------- Fade-in och räknare (allt ovanför bild visas direkt) */
  const format = (v, d) => v.toLocaleString('sv-SE', { minimumFractionDigits: d, maximumFractionDigits: d });
  const counted = new WeakSet();
  const countUp = el => {
    if (counted.has(el)) return; counted.add(el);
    const target = +el.dataset.count, dec = +el.dataset.decimals || 0, t0 = performance.now(), dur = 1600;
    (function f(now) { const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4); el.textContent = format(target * e, dec); if (p < 1) requestAnimationFrame(f); })(t0);
  };
  const jsOn = !reduced && document.documentElement.classList.contains('js');
  let pending = [], ticking = false;
  const check = () => {
    ticking = false;
    const line = innerHeight * 0.92;
    pending = pending.filter(el => {
      if (el.getBoundingClientRect().top < line) { el.classList.add('is-in'); $$('[data-count]', el).forEach(countUp); return false; }
      return true;
    });
  };
  const onS = () => { if (!ticking) { ticking = true; requestAnimationFrame(check); } };
  if (jsOn) { addEventListener('scroll', onS, { passive: true }); addEventListener('resize', onS); }
  const armReveal = view => {
    if (!jsOn) { $$('[data-count]', view).forEach(countUp); return; }
    pending = $$('.reveal', view);
    pending.forEach((el, i) => { el.style.transitionDelay = Math.min(i, 8) * 70 + 'ms'; });
    void view.offsetWidth; check();
  };

  /* ---------------------------------------------------------------- Sidor: menyn byter sida i stället för att scrolla */
  const views = $$('.view'), names = views.map(v => v.dataset.view);
  const titles = { hem: 'Hem', tjanster: 'Tjänster', varfor: 'Varför EMK', resultat: 'Resultat', arbete: 'Utvalt arbete', faq: 'Frågor', kontakt: 'Kontakt' };
  const baseTitle = document.title;
  const wipe = $('#wipe'), wipeLabel = $('.wipe__label');
  let current = null, busy = false, queued = null;

  const swap = name => {
    const next = $(`.view[data-view="${name}"]`);
    $('.view.is-active')?.classList.remove('is-active');
    $$('.reveal', next).forEach(el => el.classList.remove('is-in'));     // görs medan sidan är dold, så ingen övergång syns
    next.classList.add('is-active');
    window.scrollTo({ top: 0, behavior: 'instant' });
    current = name;
    document.title = name === 'hem' ? baseTitle : `${titles[name]} | EMK Marketing`;
    $$('.nav a').forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + name));
    drawArt(next);
    if (name === 'tjanster') sync();
    if (name === 'hem') setTimeout(() => rtrack && rtrack.dispatchEvent(new Event('scroll')), 80);
    armReveal(next);
    next.tabIndex = -1; next.focus({ preventScroll: true });
  };

  const show = (name, instant) => {
    if (name === current) return;
    if (busy) { queued = name; return; }
    if (instant || reduced || !wipe.animate) { swap(name); return; }
    busy = true;
    wipeLabel.textContent = titles[name];
    const ease = 'cubic-bezier(.7, 0, .2, 1)';
    wipe.style.visibility = 'visible';
    // Tidsstyrda steg (inte beroende av att animationer "blir klara"), så bytet aldrig kan hänga sig
    wipe.animate([{ transform: 'translateY(100%)' }, { transform: 'translateY(0)' }], { duration: 300, easing: ease, fill: 'forwards' });
    setTimeout(() => swap(name), 320);
    setTimeout(() => wipe.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(-100%)' }], { duration: 340, easing: ease, fill: 'forwards' }), 430);
    setTimeout(() => {
      wipe.getAnimations().forEach(an => an.cancel()); wipe.style.visibility = 'hidden';
      busy = false; const q = queued; queued = null; if (q && q !== current) show(q);
    }, 800);
  };

  const fromHash = () => { const h = location.hash.replace(/^#\/?/, ''); return names.includes(h) ? h : 'hem'; };
  addEventListener('hashchange', () => { setMenu(false); show(fromHash()); });
  show(fromHash(), true);
})();
