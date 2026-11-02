/* =========================================================
   EMK – spårning för hela sajten
   1) Klistra in ert Google Analytics-ID (G-...) och ev. Meta Pixel-ID nedan.
   2) Klart. Cookie-rutan visas automatiskt när ett ID finns.
   ========================================================= */
var EMK_GA4_ID = '';    // <-- t.ex. 'G-ABC123XYZ9'
var EMK_PIXEL_ID = '';  // <-- t.ex. '123456789012345'

(function () {
  /* ---- Samtycke (GDPR) ---- */
  var KEY = 'emk_consent';
  function getConsent(){ try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function setConsent(v){ try { localStorage.setItem(KEY, v); } catch (e) {} }
  var consent = getConsent(); // 'all' | 'necessary' | null

  /* ---- Google Analytics 4 med Consent Mode v2 ---- */
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ dataLayer.push(arguments); };
  if (EMK_GA4_ID) {
    gtag('consent', 'default', {
      ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
      analytics_storage: consent === 'all' ? 'granted' : 'denied', wait_for_update: 500
    });
    var g = document.createElement('script'); g.async = true;
    g.src = 'https://www.googletagmanager.com/gtag/js?id=' + EMK_GA4_ID;
    document.head.appendChild(g);
    gtag('js', new Date());
    gtag('config', EMK_GA4_ID);
    if (consent === 'all') gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
    if (window.EMK_EVENT) gtag('event', 'generate_lead', { lead_type: window.EMK_EVENT });
  }
  function track(name, params){ if (EMK_GA4_ID) gtag('event', name, params || {}); }
  window.emkTrack = track;

  /* ---- Meta Pixel (laddas bara efter samtycke) ---- */
  function loadPixel(){
  if (EMK_PIXEL_ID) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
    n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
    n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
    t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
    document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', EMK_PIXEL_ID);
    fbq('track', 'PageView');
    // Tacksidan sätter window.EMK_EVENT = 'Lead' innan filen laddas
    if (window.EMK_EVENT) fbq('track', window.EMK_EVENT, window.EMK_EVENT_DATA || {});
  }
  }
  if (consent === 'all') loadPixel();

  function accept(all){
    setConsent(all ? 'all' : 'necessary');
    if (all) {
      if (EMK_GA4_ID) gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted' });
      loadPixel();
    }
    var b = document.getElementById('emk-cc'); if (b) b.remove();
  }

  function banner(){
    if (consent || !(EMK_GA4_ID || EMK_PIXEL_ID)) return;
    var css = '#emk-cc{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:440px;margin-left:auto;padding:24px;border-radius:20px;'
      + 'background:rgba(24,23,21,.92);-webkit-backdrop-filter:blur(16px);backdrop-filter:blur(16px);box-shadow:inset 0 0 0 1px rgba(245,241,232,.14),0 24px 48px -16px rgba(0,0,0,.8);'
      + "font-family:'DM Sans',system-ui,sans-serif;color:#F5F1E8}"
      + '#emk-cc p{margin:0 0 16px;font-size:15px;line-height:1.5;color:#D9D3C6}#emk-cc b{display:block;font-size:16px;color:#F5F1E8;margin-bottom:8px}'
      + '#emk-cc .r{display:flex;gap:8px;flex-wrap:wrap}#emk-cc button{flex:1 1 auto;min-height:44px;padding:0 24px;border-radius:999px;font-family:inherit;font-size:15px;font-weight:700;line-height:1;cursor:pointer;border:0}'
      + '#emk-cc .y{background:#DFA438;color:#111}#emk-cc .n{background:transparent;color:#F5F1E8;box-shadow:inset 0 0 0 1.5px rgba(245,241,232,.3)}'
      + '#emk-cc button:focus-visible{outline:2px solid #DFA438;outline-offset:2px}';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var d = document.createElement('div'); d.id = 'emk-cc'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-label', 'Cookies');
    d.innerHTML = '<b>Vi använder cookies</b><p>För att se hur sajten används och förbättra våra annonser. Du väljer själv.</p>'
      + '<div class="r"><button type="button" class="y">Godkänn alla</button><button type="button" class="n">Bara nödvändiga</button></div>';
    document.body.appendChild(d);
    d.querySelector('.y').addEventListener('click', function(){ accept(true); });
    d.querySelector('.n').addEventListener('click', function(){ accept(false); });
  }

  /* ---- Spara annonskälla (UTM) så den följer med i formulären ---- */
  var KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  var params = new URLSearchParams(location.search);
  var saved = {};
  try { saved = JSON.parse(sessionStorage.getItem('emk_utm') || '{}'); } catch (e) {}
  var found = false;
  KEYS.forEach(function (k) { if (params.get(k)) { saved[k] = params.get(k); found = true; } });
  if (found) { try { sessionStorage.setItem('emk_utm', JSON.stringify(saved)); } catch (e) {} }
  var firstPage = '';
  try {
    firstPage = sessionStorage.getItem('emk_first') || '';
    if (!firstPage) { firstPage = location.pathname; sessionStorage.setItem('emk_first', firstPage); }
  } catch (e) { firstPage = location.pathname; }

  function addHidden(form, name, value) {
    if (!value || form.querySelector('input[name="' + name + '"]')) return;
    var i = document.createElement('input');
    i.type = 'hidden'; i.name = name; i.value = value;
    form.appendChild(i);
  }

  document.addEventListener('DOMContentLoaded', function () {
    banner();
    /* Klick på boka-knappar, mejl och telefon */
    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a'); if (!a) return;
      var h = a.getAttribute('href') || '';
      if (h.indexOf('mailto:') === 0) track('email_click');
      else if (h.indexOf('tel:') === 0) track('phone_click');
      else if (/kontakt|#emk-boka|#boka/.test(h)) track('cta_click', { cta_text: (a.textContent || '').trim().slice(0, 60), page: location.pathname });
    });
    var forms = document.querySelectorAll('form[action*="formsubmit"]');
    forms.forEach(function (form) {
      addHidden(form, 'Sida', location.pathname);
      addHidden(form, 'Första sida', firstPage);
      KEYS.forEach(function (k) { addHidden(form, k, saved[k]); });
      form.addEventListener('submit', function () {
        track('form_submit', { page: location.pathname });
        if (window.fbq) fbq('trackCustom', 'FormSubmit', { page: location.pathname });
      });
    });
  });
})();
