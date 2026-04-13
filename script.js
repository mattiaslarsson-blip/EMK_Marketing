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
