/* ARRIVA Studio — main.js — Mobile menu only */
(function () {
  'use strict';
  var btn = document.getElementById('menu-toggle') || document.getElementById('mobile-menu-btn');
  var nav = document.getElementById('main-nav') || document.getElementById('mobile-nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
  });

  /* Close when a link inside the nav is tapped */
  nav.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      nav.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();
