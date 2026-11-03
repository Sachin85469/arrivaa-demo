(function () {
  'use strict';

  document.documentElement.classList.add('js');

  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initHeader() {
    var header = document.querySelector('.site-header');
    var btn = document.getElementById('menu-toggle');
    var nav = document.getElementById('main-nav');
    var backdrop = document.getElementById('nav-backdrop');

    if (header) {
      function onScroll() {
        if (window.scrollY > 8) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    }

    if (!btn || !nav) return;

    function openMenu() {
      nav.classList.add('is-open');
      if (backdrop) backdrop.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Close menu');
      document.body.style.overflow = 'hidden';
      var firstLink = nav.querySelector('a');
      if (firstLink) firstLink.focus();
    }

    function closeMenu(returnFocus) {
      nav.classList.remove('is-open');
      if (backdrop) backdrop.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open menu');
      document.body.style.overflow = '';
      if (returnFocus) btn.focus();
    }

    btn.addEventListener('click', function () {
      var isOpen = nav.classList.contains('is-open');
      if (isOpen) {
        closeMenu(true);
      } else {
        openMenu();
      }
    });

    if (backdrop) {
      backdrop.addEventListener('click', function () {
        closeMenu(true);
      });
    }

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        closeMenu(false);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (!nav.classList.contains('is-open')) return;
      if (e.key === 'Escape') {
        closeMenu(true);
        return;
      }
      if (e.key === 'Tab') {
        var focusables = [btn].concat(Array.prototype.slice.call(nav.querySelectorAll('a, button')));
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    });
  }

  function initHero() {
    var items = document.querySelectorAll('.hero-reveal');
    if (items.length > 0) {
      if (reducedMotion) {
        items.forEach(function (el) {
          el.classList.add('revealed');
        });
      } else {
        items.forEach(function (el, idx) {
          setTimeout(function () {
            el.classList.add('revealed');
          }, idx * 60);
        });
      }
    }

    var wrap = document.getElementById('hero-phone-wrap');
    var phone = document.getElementById('hero-phone');
    if (wrap && phone && !reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 768px)').matches) {
      wrap.addEventListener('pointermove', function (e) {
        var rect = wrap.getBoundingClientRect();
        var x = e.clientX - rect.left - rect.width / 2;
        var y = e.clientY - rect.top - rect.height / 2;
        var maxTilt = 4;
        var tiltX = -(y / (rect.height / 2)) * maxTilt;
        var tiltY = (x / (rect.width / 2)) * maxTilt;
        phone.style.transform = 'perspective(900px) rotateX(' + tiltX.toFixed(2) + 'deg) rotateY(' + tiltY.toFixed(2) + 'deg)';
      });

      wrap.addEventListener('pointerleave', function () {
        phone.style.transform = '';
      });
    }
  }

  function initItineraryTidy() {
    var btn = document.getElementById('btn-tidy-route');
    var list = document.getElementById('itinerary-stops');
    if (!btn || !list) return;

    var isTidied = false;

    var initialStops = [
      { id: '1', name: 'Sinhagad Fort', meta: 'Ridge ascent · 4.8 km trek' },
      { id: '2', name: 'Panshet Valley', meta: 'Dam viewpoint · Water sports' },
      { id: '3', name: 'Khadakwasla Lake', meta: 'Waterfront promenade · Sunset' }
    ];

    var tidiedStops = [
      { id: '3', name: 'Khadakwasla Lake', meta: 'Waterfront promenade · Morning start' },
      { id: '1', name: 'Sinhagad Fort', meta: 'Ridge ascent · Midday climb' },
      { id: '2', name: 'Panshet Valley', meta: 'Dam viewpoint · Evening sunset' }
    ];

    function renderStops(data) {
      list.innerHTML = '';
      data.forEach(function (stop, idx) {
        var card = document.createElement('div');
        card.className = 'stop-card';
        card.setAttribute('data-stop', stop.id);
        card.setAttribute('role', 'listitem');
        card.innerHTML = '<span class="stop-number">' + (idx + 1) + '</span>' +
          '<div class="stop-details">' +
          '<span class="stop-name">' + stop.name + '</span>' +
          '<span class="stop-meta">' + stop.meta + '</span>' +
          '</div>';
        list.appendChild(card);
      });
    }

    renderStops(initialStops);

    btn.addEventListener('click', function () {
      var currentCards = Array.prototype.slice.call(list.querySelectorAll('.stop-card'));
      var firstPositions = {};
      currentCards.forEach(function (c) {
        var id = c.getAttribute('data-stop');
        firstPositions[id] = c.getBoundingClientRect().top;
      });

      isTidied = !isTidied;
      var targetData = isTidied ? tidiedStops : initialStops;
      renderStops(targetData);

      btn.textContent = isTidied ? 'Route tidied' : 'Tidy up the route';
      btn.setAttribute('aria-pressed', String(isTidied));

      if (reducedMotion) return;

      var newCards = list.querySelectorAll('.stop-card');
      newCards.forEach(function (c) {
        var id = c.getAttribute('data-stop');
        var firstTop = firstPositions[id];
        if (firstTop !== undefined) {
          var lastTop = c.getBoundingClientRect().top;
          var deltaY = firstTop - lastTop;
          c.style.transform = 'translateY(' + deltaY + 'px)';
          c.style.transition = 'none';
        }
      });

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          newCards.forEach(function (c) {
            c.style.transition = 'transform 320ms cubic-bezier(0.22, 0.7, 0.2, 1)';
            c.style.transform = '';
          });
        });
      });
    });
  }

  function initProductRows() {
    var rows = document.querySelectorAll('.product-row[data-href]');
    rows.forEach(function (row) {
      row.addEventListener('click', function (e) {
        if (e.target.closest('a')) return;
        var href = row.getAttribute('data-href');
        if (href) window.location.href = href;
      });

      row.addEventListener('keydown', function (e) {
        if (e.target.closest('a')) return;
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          var href = row.getAttribute('data-href');
          if (href) window.location.href = href;
        }
      });
    });
  }

  function initSpotlightTabs() {
    var tablist = document.querySelector('.spotlight-tablist');
    if (!tablist) return;

    var tabs = Array.prototype.slice.call(tablist.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(document.querySelectorAll('.spotlight-panel'));
    var routeDrawn = false;

    function activateTab(targetTab, moveFocus) {
      tabs.forEach(function (tab) {
        var selected = tab === targetTab;
        tab.setAttribute('aria-selected', String(selected));
        tab.setAttribute('tabindex', selected ? '0' : '-1');
      });

      var targetPanelId = targetTab.getAttribute('aria-controls');
      panels.forEach(function (panel) {
        if (panel.id === targetPanelId) {
          panel.hidden = false;
          panel.classList.add('is-active');
        } else {
          panel.hidden = true;
          panel.classList.remove('is-active');
        }
      });

      if (moveFocus) targetTab.focus();

      if (targetPanelId === 'panel-map') {
        drawMapRoute();
      }
    }

    function drawMapRoute() {
      if (routeDrawn) return;
      routeDrawn = true;

      var path = document.getElementById('trail-route-path');
      var pins = document.querySelectorAll('.map-pin');
      if (!path) return;

      if (reducedMotion) {
        pins.forEach(function (p) { p.classList.add('is-visible'); });
        return;
      }

      var len = path.getTotalLength ? path.getTotalLength() : 380;
      path.style.strokeDasharray = String(len);
      path.style.strokeDashoffset = String(len);
      path.getBoundingClientRect();
      path.style.transition = 'stroke-dashoffset 1.2s cubic-bezier(0.22, 0.7, 0.2, 1)';
      path.style.strokeDashoffset = '0';

      pins.forEach(function (pin, idx) {
        setTimeout(function () {
          pin.classList.add('is-visible');
        }, 300 + idx * 400);
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        activateTab(tab, false);
      });

      tab.addEventListener('keydown', function (e) {
        var idx = tabs.indexOf(tab);
        var nextIdx = -1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
          nextIdx = (idx + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
          nextIdx = (idx - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
          nextIdx = 0;
        } else if (e.key === 'End') {
          nextIdx = tabs.length - 1;
        }

        if (nextIdx !== -1) {
          e.preventDefault();
          activateTab(tabs[nextIdx], true);
        }
      });
    });

    var playBtn = document.getElementById('btn-play-phrase');
    var waveform = document.getElementById('phrase-waveform');
    if (playBtn) {
      playBtn.addEventListener('click', function () {
        if (waveform) {
          waveform.classList.add('is-playing');
          setTimeout(function () {
            waveform.classList.remove('is-playing');
          }, 2000);
        }

        if ('speechSynthesis' in window) {
          var voices = window.speechSynthesis.getVoices();
          var marathiVoice = voices.find(function (v) {
            return v.lang && v.lang.toLowerCase().indexOf('mr') === 0;
          });
          if (marathiVoice) {
            try {
              var utterance = new SpeechSynthesisUtterance('नमस्कार, शनिवार वाडा कुठे आहे?');
              utterance.voice = marathiVoice;
              utterance.lang = marathiVoice.lang;
              window.speechSynthesis.speak(utterance);
            } catch (err) {}
          }
        }
      });
    }
  }

  function initScrollReveals() {
    var reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(function (el) {
        el.classList.add('revealed');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initReadingProgress() {
    var bar = document.getElementById('reading-progress');
    if (!bar) return;

    function updateBar() {
      var docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) {
        bar.style.width = '0%';
        return;
      }
      var progress = Math.min(100, Math.max(0, (window.scrollY / docHeight) * 100));
      bar.style.width = progress.toFixed(1) + '%';
    }

    window.addEventListener('scroll', updateBar, { passive: true });
    updateBar();
  }

  function initTocHighlight() {
    var toc = document.querySelector('.toc');
    if (!toc) return;

    var links = Array.prototype.slice.call(toc.querySelectorAll('a[href^="#"]'));
    if (links.length === 0) return;

    var sections = links.map(function (link) {
      var id = link.getAttribute('href').slice(1);
      return document.getElementById(id);
    }).filter(Boolean);

    if (!('IntersectionObserver' in window)) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.id;
          links.forEach(function (link) {
            if (link.getAttribute('href') === '#' + id) {
              link.classList.add('is-active');
            } else {
              link.classList.remove('is-active');
            }
          });
        }
      });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });

    sections.forEach(function (sec) {
      observer.observe(sec);
    });
  }

  function initAccordions() {
    var items = document.querySelectorAll('.accordion-item');
    items.forEach(function (item) {
      var summary = item.querySelector('summary');
      var content = item.querySelector('.accordion-content');
      if (!summary || !content) return;

      summary.addEventListener('click', function (e) {
        if (reducedMotion) return;
        e.preventDefault();

        if (item.open) {
          var startHeight = content.offsetHeight;
          content.style.height = startHeight + 'px';
          content.style.overflow = 'hidden';
          content.style.transition = 'height 240ms cubic-bezier(0.22, 0.7, 0.2, 1), opacity 200ms ease';
          requestAnimationFrame(function () {
            content.style.height = '0px';
            content.style.opacity = '0';
          });
          setTimeout(function () {
            item.open = false;
            content.style.height = '';
            content.style.opacity = '';
            content.style.overflow = '';
            content.style.transition = '';
          }, 240);
        } else {
          item.open = true;
          content.style.overflow = 'hidden';
          content.style.height = '0px';
          content.style.opacity = '0';
          var endHeight = content.scrollHeight;
          content.style.transition = 'height 280ms cubic-bezier(0.22, 0.7, 0.2, 1), opacity 240ms ease';
          requestAnimationFrame(function () {
            content.style.height = endHeight + 'px';
            content.style.opacity = '1';
          });
          setTimeout(function () {
            content.style.height = '';
            content.style.opacity = '';
            content.style.overflow = '';
            content.style.transition = '';
          }, 280);
        }
      });
    });
  }

  function initBackToTop() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;

    function checkPosition() {
      if (window.scrollY > 600) {
        btn.classList.add('is-visible');
      } else {
        btn.classList.remove('is-visible');
      }
    }

    window.addEventListener('scroll', checkPosition, { passive: true });
    checkPosition();

    btn.addEventListener('click', function () {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? 'auto' : 'smooth'
      });
    });
  }

  function initCopyEmail() {
    var btn = document.getElementById('copy-email-btn');
    var status = document.getElementById('copy-status');
    if (!btn) return;

    function showCopied() {
      if (status) {
        status.textContent = 'Copied!';
        status.classList.add('is-visible');
        setTimeout(function () {
          status.classList.remove('is-visible');
        }, 2000);
      }
    }

    btn.addEventListener('click', function () {
      var email = btn.getAttribute('data-email') || 'sachinbableshwar1828@gmail.com';
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(function () {
          showCopied();
        }).catch(function () {
          fallbackCopy(email);
        });
      } else {
        fallbackCopy(email);
      }
    });

    function fallbackCopy(text) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
      } catch (err) {}
      document.body.removeChild(ta);
      showCopied();
    }
  }

  function domReady(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  domReady(function () {
    initHeader();
    initHero();
    initItineraryTidy();
    initProductRows();
    initSpotlightTabs();
    initScrollReveals();
    initReadingProgress();
    initTocHighlight();
    initAccordions();
    initBackToTop();
    initCopyEmail();
  });
})();
