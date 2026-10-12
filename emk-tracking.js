/* =========================================================
   EMK – spårning för landningssidorna
   1) Klistra in ert Meta Pixel-ID nedan (bara siffrorna).
   2) Klart. Alla sidor som laddar den här filen räknas.
   ========================================================= */
var EMK_PIXEL_ID = ''; // <-- t.ex. '123456789012345'

(function () {
  /* ---- Meta Pixel ---- */
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
    var forms = document.querySelectorAll('form[action*="formsubmit"]');
    forms.forEach(function (form) {
      addHidden(form, 'Sida', location.pathname);
      addHidden(form, 'Första sida', firstPage);
      KEYS.forEach(function (k) { addHidden(form, k, saved[k]); });
      form.addEventListener('submit', function () {
        if (window.fbq) fbq('trackCustom', 'FormSubmit', { page: location.pathname });
      });
    });
  });
})();
