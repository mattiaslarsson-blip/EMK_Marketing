// EMK Marketing — interactions

// Mobile menu
const burger = document.querySelector('.nav__burger');
const links = document.querySelector('.nav__links');
if (burger) {
  burger.addEventListener('click', () => links.classList.toggle('open'));
}
document.querySelectorAll('.nav__links a').forEach(a => {
  a.addEventListener('click', () => links && links.classList.remove('open'));
});

// Footer year
const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();

// Contact form (mailto fallback)
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const message = data.get('message') || '';
    const subject = encodeURIComponent(`Förfrågan från ${name}`);
    const body = encodeURIComponent(`Namn: ${name}\nE-post: ${email}\n\n${message}`);
    window.location.href = `mailto:info@emkmarketing.se?subject=${subject}&body=${body}`;
    status.textContent = 'Tack! Öppnar din mejlklient...';
    setTimeout(() => { status.textContent = ''; form.reset(); }, 4000);
  });
}

// Scroll-triggered fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-tile, .testimonial-card, .process-card, .gallery__item').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(28px)';
  el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
  observer.observe(el);
});

// ===========================
// SHOWREEL — interactions
// ===========================
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Mouse-following spotlight on cinematic hero (homepage)
const cineHero = document.querySelector('.hero--cinematic');
if (cineHero && !reduceMotion && window.matchMedia('(min-width: 981px)').matches) {
  cineHero.addEventListener('mousemove', (e) => {
    const rect = cineHero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cineHero.style.setProperty('--mouse-x', `${x}%`);
    cineHero.style.setProperty('--mouse-y', `${y}%`);
  });
}

// Spotlight cursor on showreel hero
const showreelHero = document.querySelector('.showreel-hero');
if (showreelHero && !reduceMotion && window.matchMedia('(min-width: 981px)').matches) {
  showreelHero.addEventListener('mousemove', (e) => {
    const rect = showreelHero.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    showreelHero.style.setProperty('--mouse-x', `${x}%`);
    showreelHero.style.setProperty('--mouse-y', `${y}%`);
  });
}

// Main reel: click to play with sound
const mainReel = document.getElementById('mainReel');
const mainReelPlay = document.getElementById('mainReelPlay');
const mainReelMute = document.getElementById('mainReelMute');
if (mainReel && mainReelPlay) {
  const startMain = () => {
    mainReel.muted = false;
    mainReel.controls = true;
    mainReel.play().catch(() => {});
    mainReelPlay.classList.add('is-hidden');
    if (mainReelMute) mainReelMute.style.display = 'none';
  };
  mainReelPlay.addEventListener('click', startMain);
  mainReel.addEventListener('click', () => {
    if (mainReelPlay.classList.contains('is-hidden')) return;
    startMain();
  });
  if (mainReelMute) {
    mainReelMute.addEventListener('click', (e) => {
      e.stopPropagation();
      mainReel.muted = !mainReel.muted;
      const muted = mainReelMute.querySelector('.icon-muted');
      const unmuted = mainReelMute.querySelector('.icon-unmuted');
      if (muted && unmuted) {
        muted.style.display = mainReel.muted ? '' : 'none';
        unmuted.style.display = mainReel.muted ? 'none' : '';
      }
    });
  }
}

// Filter chips
const chips = document.querySelectorAll('.filter-chip');
const items = document.querySelectorAll('.showreel-item');
if (chips.length && items.length) {
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      const filter = chip.dataset.filter;
      items.forEach(item => {
        const tag = item.dataset.tag;
        const show = filter === 'all' || tag === filter || (tag && tag.split(' ').includes(filter));
        item.classList.toggle('is-hidden', !show);
      });
    });
  });
}

// Reveal-on-scroll for grid items (with stagger)
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      const idx = Array.from(entry.target.parentElement.children).indexOf(entry.target);
      entry.target.style.transitionDelay = `${Math.min(idx * 60, 480)}ms`;
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
items.forEach(el => revealObserver.observe(el));

// Smart video autoplay: pause when out of viewport
const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const v = entry.target;
    if (v.id === 'mainReel') return; // don't touch the main reel
    if (entry.isIntersecting) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  });
}, { threshold: 0.25 });
document.querySelectorAll('.showreel-item video, .showreel-storytelling__bg, .showreel-hero__bg').forEach(v => videoObserver.observe(v));

// Parallax on storytelling break
const storyBg = document.querySelector('.showreel-storytelling__bg');
const storySection = document.querySelector('.showreel-storytelling');
if (storyBg && storySection && !reduceMotion) {
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const rect = storySection.getBoundingClientRect();
      const offset = (window.innerHeight - rect.top) * 0.15;
      storyBg.style.transform = `translateY(${-offset}px) scale(1.15)`;
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

// Lightbox
const lightbox = document.getElementById('lightbox');
const stage = document.getElementById('lightboxStage');
const caption = document.getElementById('lightboxCaption');
if (lightbox && stage) {
  const closeBtn = lightbox.querySelector('.lightbox__close');
  const prevBtn = lightbox.querySelector('.lightbox__nav--prev');
  const nextBtn = lightbox.querySelector('.lightbox__nav--next');
  const visibleItems = () => Array.from(items).filter(it => !it.classList.contains('is-hidden'));
  let currentIdx = 0;

  const renderItem = () => {
    const list = visibleItems();
    if (!list.length) return;
    currentIdx = (currentIdx + list.length) % list.length;
    const item = list[currentIdx];
    stage.innerHTML = '';
    const media = item.querySelector('img, video');
    if (!media) return;
    let clone;
    if (media.tagName === 'VIDEO') {
      clone = document.createElement('video');
      clone.src = media.currentSrc || media.querySelector('source')?.src || '';
      clone.poster = media.poster;
      clone.controls = true;
      clone.autoplay = true;
      clone.playsInline = true;
    } else {
      clone = document.createElement('img');
      clone.src = media.src;
      clone.alt = media.alt || '';
    }
    stage.appendChild(clone);
    const client = item.querySelector('.showreel-item__client')?.textContent || '';
    const type = item.querySelector('.showreel-item__type')?.textContent || '';
    if (caption) caption.textContent = client && type ? `${client} · ${type}` : client || type;
  };

  const open = (item) => {
    const list = visibleItems();
    currentIdx = list.indexOf(item);
    if (currentIdx < 0) currentIdx = 0;
    lightbox.classList.add('is-open');
    document.body.classList.add('lightbox-open');
    renderItem();
  };
  const close = () => {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('lightbox-open');
    stage.innerHTML = '';
  };
  const next = () => { currentIdx++; renderItem(); };
  const prev = () => { currentIdx--; renderItem(); };

  items.forEach(item => item.addEventListener('click', () => open(item)));
  closeBtn && closeBtn.addEventListener('click', close);
  nextBtn && nextBtn.addEventListener('click', next);
  prevBtn && prevBtn.addEventListener('click', prev);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('is-open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft') prev();
  });
}

// ===========================
// FOTO CAROUSEL — infinite swipe (mobile)
// ===========================
(function() {
  const carousel = document.getElementById('fotoCarousel');
  if (!carousel) return;
  const track = carousel.querySelector('.foto-carousel__track');
  if (!track) return;

  const mq = window.matchMedia('(max-width: 768px)');
  let originalCount = 0;

  const getSetWidth = () => {
    const first = track.children[0];
    if (!first || originalCount === 0) return 0;
    const itemWidth = first.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 12;
    return (itemWidth + gap) * originalCount;
  };

  // Hoppa scrollLeft direkt utan smooth — kringgår 'behavior: instant'-stöd
  const jump = (newLeft) => {
    const prev = carousel.style.scrollBehavior;
    carousel.style.scrollBehavior = 'auto';
    carousel.scrollLeft = newLeft;
    // Force reflow
    void carousel.offsetWidth;
    carousel.style.scrollBehavior = prev || '';
  };

  const initCarousel = () => {
    if (!mq.matches) return;
    if (carousel.dataset.cloned === '1') return;

    const originals = Array.from(track.children);
    if (originals.length === 0) return;
    originalCount = originals.length;

    // Klona items 2 set till → [klon1][original][klon2]
    const beforeClones = originals.map(el => el.cloneNode(true));
    const afterClones = originals.map(el => el.cloneNode(true));
    beforeClones.reverse().forEach(c => track.insertBefore(c, track.firstChild));
    afterClones.forEach(c => track.appendChild(c));

    carousel.dataset.cloned = '1';

    // Vänta på att bilder fått sin storlek innan vi sätter scroll-pos
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        jump(getSetWidth());
      });
    });
  };

  // Snap-back när användaren scrollar in i klon-set
  let scrollTimer;
  carousel.addEventListener('scroll', () => {
    if (carousel.dataset.cloned !== '1') return;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const setWidth = getSetWidth();
      if (setWidth === 0) return;
      const sl = carousel.scrollLeft;

      if (sl < setWidth * 0.5) {
        jump(sl + setWidth);
      } else if (sl > setWidth * 2.5) {
        jump(sl - setWidth);
      }
    }, 140);
  }, { passive: true });

  // Init när DOM är redo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCarousel);
  } else {
    initCarousel();
  }

  // Init om viewport ändras till mobil
  const onChange = () => {
    if (mq.matches && carousel.dataset.cloned !== '1') initCarousel();
  };
  if (mq.addEventListener) mq.addEventListener('change', onChange);
  else if (mq.addListener) mq.addListener(onChange);
  window.addEventListener('resize', onChange);
})();
