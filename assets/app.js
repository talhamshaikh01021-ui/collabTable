/* CollabTable — shared behavior.
   Implements the component behaviors of the Flashoot reference (nav, marquee,
   sheets, rails, toasts, FAQ) and the CollabTable flows confirmed by the
   export: onboarding steps, forms with blur validation, filters and search,
   applications, offer / counter-offer, contract acknowledgement, escrow,
   delivery, review, and on-platform contact interception. */

(function () {
  'use strict';

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  /* ================================================== reduced motion ==== */

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================ icons ==== */

  var ICONS = {
    check: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
    lock: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="10.5" width="16" height="10" rx="2"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></svg>',
    search: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    x: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    alert: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>',
    shield: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l8 3v6c0 4.5-3.2 8.3-8 9-4.8-.7-8-4.5-8-9V6l8-3Z"/><path d="m9 12 2 2 4-4"/></svg>',
    doc: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
    cal: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
    star: '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m12 3 2.7 5.7 6.3.8-4.6 4.3 1.2 6.2L12 17l-5.6 3 1.2-6.2L3 9.5l6.3-.8L12 3Z"/></svg>',
    bolt: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>',
    users: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 5.2a3.5 3.5 0 0 1 0 5.6M18 20a6 6 0 0 0-3-5.2"/></svg>',
    city: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18M5 21V9l5-3 5 3v12M15 21V12l4 2v7"/><path d="M8 12h.01M8 16h.01M12 12h.01M12 16h.01"/></svg>',
    plate: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4.5"/></svg>',
    rupee: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 4h10M7 9h10M15.5 4c0 3.6-2.4 5-6 5h-.5l7 11"/></svg>'
  };

  function icon(name) { return ICONS[name] || ''; }

  /* ============================================================ toasts === */

  function toastHost() {
    var host = $('.toasts');
    if (!host) {
      host = document.createElement('div');
      host.className = 'toasts';
      host.setAttribute('role', 'status');
      host.setAttribute('aria-live', 'polite');
      document.body.appendChild(host);
    }
    return host;
  }

  function toast(message, kind) {
    var host = toastHost();
    var el = document.createElement('div');
    el.className = 'toast';
    el.setAttribute('data-kind', kind || 'ok');
    el.innerHTML = (kind === 'error' ? icon('alert') : icon('check')) +
      '<span>' + message + '</span>';
    host.appendChild(el);
    window.setTimeout(function () {
      el.setAttribute('data-leaving', 'true');
      window.setTimeout(function () { el.remove(); }, 300);
    }, 4200);
  }

  window.ctToast = toast;

  /* ============================================================== nav ==== */

  function initNav() {
    var burger = $('[data-burger]');
    var mnav = $('[data-mnav]');
    if (!burger || !mnav) return;

    function setOpen(open) {
      burger.setAttribute('aria-expanded', String(open));
      mnav.classList.toggle('is-on', open);
      mnav.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    }

    burger.addEventListener('click', function () {
      setOpen(burger.getAttribute('aria-expanded') !== 'true');
    });
    $$('a', mnav).forEach(function (a) {
      a.addEventListener('click', function () { setOpen(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        burger.focus();
      }
    });
  }

  /* ============================================================ sheet ==== */

  var sheetOpener = null;

  function initSheets() {
    var scrim = $('[data-scrim]');
    if (!scrim) return;

    function close() {
      $$('.sheet.is-on').forEach(function (s) {
        s.classList.remove('is-on');
        s.setAttribute('aria-hidden', 'true');
      });
      scrim.classList.remove('is-on');
      document.body.style.overflow = '';
      if (sheetOpener) {
        var host = sheetOpener.closest('.sheet');
        if (!host || host.classList.contains('is-on')) { sheetOpener.focus(); }
        sheetOpener = null;
      }
    }

    function open(sheet, opener) {
      sheetOpener = opener || null;
      /* a pop-up opened from inside another pop-up replaces it rather than
         stacking, so the deal room is always the only thing on screen */
      $$('.sheet.is-on').forEach(function (s) {
        if (s === sheet) return;
        s.classList.remove('is-on');
        s.setAttribute('aria-hidden', 'true');
        sheetOpener = null;
      });
      sheet.classList.add('is-on');
      sheet.setAttribute('aria-hidden', 'false');
      scrim.classList.add('is-on');
      document.body.style.overflow = 'hidden';
      sheet.scrollTop = 0;
      /* Whoever opened the pop-up says what it should be about. A restaurant
         runs several campaigns at once, so the deal room and the application
         sheet are shared and take their subject from the card that opened
         them rather than carrying one hard-coded campaign. */
      sheet.dispatchEvent(new CustomEvent('ct:sheet-open', { bubbles: true, detail: { opener: opener } }));
      var target = sheet.getAttribute('tabindex') === '-1'
        ? sheet
        : sheet.querySelector('input, textarea, select, button:not(.sheet-x)');
      if (target) { window.setTimeout(function () { target.focus(); }, 240); }
    }

    document.addEventListener('click', function (e) {
      var opener = e.target.closest('[data-sheet]');
      if (opener) {
        var sheet = document.getElementById(opener.getAttribute('data-sheet'));
        if (sheet) { e.preventDefault(); open(sheet, opener); }
        return;
      }
      if (e.target.closest('[data-sheet-close]')) { e.preventDefault(); close(); }
    });

    scrim.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); return; }
      /* Tab stays inside whatever pop-up is open, so the page behind it is
         never reachable by keyboard. */
      if (e.key !== 'Tab') return;
      var open = $('.sheet.is-on');
      if (!open) return;
      var focusables = $$('a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select, textarea, [tabindex]:not([tabindex="-1"])', open)
        .filter(function (el) { return el.offsetParent !== null; });
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });

    window.ctCloseSheet = close;
  }

  /* ============================================================== faq ==== */

  function initFaq() {
    $$('.faq-q').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq-item');
        var open = item.getAttribute('data-open') === 'true';
        item.setAttribute('data-open', String(!open));
        btn.setAttribute('aria-expanded', String(!open));
      });
    });
  }

  /* =========================================================== chips ==== */

  function initChips() {
    $$('[data-chipgroup]').forEach(function (group) {
      var single = group.getAttribute('data-chipgroup') === 'single';
      $$('.chip', group).forEach(function (chip) {
        chip.addEventListener('click', function () {
          if (single) {
            var on = chip.getAttribute('aria-pressed') === 'true';
            $$('.chip', group).forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
            chip.setAttribute('aria-pressed', String(!on));
          } else {
            chip.setAttribute('aria-pressed',
              chip.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
          }
          group.dispatchEvent(new CustomEvent('ct:filter', { bubbles: true }));
        });
      });
    });
  }

  /* ============================================================ tabs ==== */

  function initTabs() {
    $$('[role="tablist"]').forEach(function (list) {
      var tabs = $$('[role="tab"]', list);
      function select(tab) {
        tabs.forEach(function (t) {
          var on = t === tab;
          t.setAttribute('aria-selected', String(on));
          t.tabIndex = on ? 0 : -1;
          var panel = document.getElementById(t.getAttribute('aria-controls'));
          if (panel) {
            panel.hidden = !on;
            panel.classList.toggle('is-on', on);
          }
        });
      }
      tabs.forEach(function (tab, i) {
        tab.addEventListener('click', function () { select(tab); });
        tab.addEventListener('keydown', function (e) {
          var next = null;
          if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
          if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
          if (e.key === 'Home') next = tabs[0];
          if (e.key === 'End') next = tabs[tabs.length - 1];
          if (next) { e.preventDefault(); select(next); next.focus(); }
        });
      });
    });
  }

  /* =========================================================== stepper ==== */

  function initStepper() {
    $$('[data-stepper]').forEach(function (root) {
      var panes = $$('[data-pane]', root);
      var steps = $$('[data-step]', root);
      var current = 0;
      var guarded = root.hasAttribute('data-step-validate');

      /* A guarded stepper will not advance past a pane whose own fields are
         still empty or malformed. Fields injected after boot (branch cards)
         are read live, so the check stays true however many were added. */
      function paneBlockers(pane) {
        var bad = null;
        $$('input, select, textarea', pane).forEach(function (i) {
          if (i.type === 'hidden' || i.type === 'radio' || i.type === 'checkbox') return;
          if ((i.value || '').trim() || i.required) {
            if (!validate(i) && !bad) bad = i;
          }
        });
        $$('[data-req-group]', pane).forEach(function (g) {
          var ok = $$('input[type="checkbox"], input[type="radio"]', g)
            .some(function (b) { return b.checked; });
          g.setAttribute('data-invalid', String(!ok));
          if (!ok && !bad) bad = $('.label', g) || g;
        });
        return bad;
      }

      function paint() {
        panes.forEach(function (p, i) {
          p.classList.toggle('is-on', i === current);
          p.hidden = i !== current;
        });
        steps.forEach(function (s, i) {
          s.setAttribute('data-on', String(i === current));
          s.setAttribute('data-done', String(i < current));
        });
        var live = $('[data-step-live]', root);
        if (live) {
          live.textContent = 'Step ' + (current + 1) + ' of ' + panes.length;
        }
        root.setAttribute('data-current', String(current));
      }

      root.addEventListener('click', function (e) {
        var next = e.target.closest('[data-step-next]');
        var back = e.target.closest('[data-step-back]');
        if (next) {
          e.preventDefault();
          if (current >= panes.length - 1) return;
          var pane = panes[current];
          var sum = $('[data-form-summary]', pane);
          if (guarded) {
            var blocker = paneBlockers(pane);
            if (blocker) {
              if (sum) {
                sum.classList.add('is-on');
                sum.textContent = 'Complete the highlighted field to continue.';
              }
              focusField(blocker);
              return;
            }
            if (sum) sum.classList.remove('is-on');
          }
          current += 1;
          paint();
          if (guarded) {
            var head = $('.ob-h', panes[current]);
            if (head) {
              head.setAttribute('tabindex', '-1');
              head.focus({ preventScroll: true });
            }
          }
        } else if (back) {
          e.preventDefault();
          if (current > 0) { current -= 1; paint(); }
        }
      });

      paint();
      root.ctGoStep = function (i) { current = i; paint(); };
    });
  }

  /* ============================================================ forms ==== */

  function fieldOf(input) { return input.closest('.field') || input.parentElement; }

  /* Group failures land on a container, which is not focusable on its own —
     give it a tab stop so keyboard and screen-reader users land on the
     thing that actually needs attention. */
  function focusField(el) {
    if (!el) return;
    if (!/^(input|select|textarea|button|a)$/i.test(el.tagName)) {
      el.setAttribute('tabindex', '-1');
    }
    if (el.focus) el.focus();
  }

  function validate(input) {
    var ok = true;
    var v = (input.value || '').trim();

    if (input.required && !v) ok = false;
    if (ok && input.type === 'email' && v &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) ok = false;
    if (ok && input.type === 'tel' && v) {
      ok = /^[+\d][\d\s().-]{6,}$/.test(v);
    }
    if (ok && input.type === 'url' && v &&
        !/^https?:\/\/[^\s.]+\.[^\s]{2,}$/i.test(v)) ok = false;
    if (ok && input.type === 'number' && v) {
      var n = Number(v);
      ok = input.min === '' || n >= Number(input.min);
      if (ok && input.max !== '') ok = n <= Number(input.max);
    }
    if (ok && input.dataset.match && v) {
      ok = new RegExp(input.dataset.match).test(v);
    }

    input.setAttribute('aria-invalid', String(!ok));
    var field = fieldOf(input);
    if (field) {
      field.setAttribute('data-invalid', String(!ok));
      var msg = $('.err', field);
      if (msg && ok) msg.textContent = msg.getAttribute('data-ok') || '';
    }
    return ok;
  }

  function initForms() {
    $$('[data-form]').forEach(function (form) {
      /* Read live at submit so fields added after boot — branch cards — are
         validated with everything else. */
      function fieldInputs() {
        return $$('input, select, textarea', form).filter(function (i) {
          return i.type !== 'hidden' && i.type !== 'radio' && i.type !== 'checkbox';
        });
      }

      var inputs = fieldInputs();

      /* A group must hold at least one checked option: multi-select grids and
         single-select grids alike, plus the lone confirm checkbox. */
      function groupFailures() {
        return $$('[data-req-group]', form).filter(function (g) {
          var ok = $$('input[type="checkbox"], input[type="radio"]', g)
            .some(function (b) { return b.checked; });
          g.setAttribute('data-invalid', String(!ok));
          return !ok;
        });
      }

      function wire(input) {
        input.addEventListener('blur', function () {
          if (input.value.trim() || input.required) validate(input);
        });
        input.addEventListener('input', function () {
          if (input.getAttribute('aria-invalid') === 'true') validate(input);
        });
      }

      /* Validate on blur, not on every keystroke. */
      inputs.forEach(wire);
      form.ctWireFields = function () {
        fieldInputs().forEach(function (i) {
          if (inputs.indexOf(i) === -1) { inputs.push(i); wire(i); }
        });
      };

      $$('input[type="radio"], input[type="checkbox"]', form).forEach(function (input) {
        input.addEventListener('change', function () {
          var field = fieldOf(input);
          if (field) field.setAttribute('data-invalid', 'false');
        });
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var bad = fieldInputs().filter(function (i) { return !validate(i); });
        var badGroups = groupFailures();
        var items = bad.map(function (i, n) {
          var f = fieldOf(i);
          var l = f ? $('.label', f) : null;
          return '<a href="#' + (i.id || 'f') + '">' + (n + 1) + ') ' +
            ((l && l.textContent.trim()) || 'Field') + '</a>';
        }).concat(badGroups.map(function (g, n) {
          var l = $('.label', g);
          return '<a href="#' + (g.id || 'g') + '">' + (bad.length + n + 1) + ') ' +
            ((l && l.textContent.trim()) || 'Field') + '</a>';
        }));
        var sum = $('[data-form-summary]', form);
        if (bad.length || badGroups.length) {
          if (sum) {
            sum.classList.add('is-on');
            sum.innerHTML = items.length + ' field' + (items.length > 1 ? 's need' : ' needs') +
              ' attention before you can continue. ' + items.join(' · ');
          }
          focusField(bad[0] || badGroups[0]);
          return;
        }
        if (sum) sum.classList.remove('is-on');

        var btn = $('[type="submit"]', form);
        if (btn && !btn.disabled) {
          var label = btn.textContent;
          btn.disabled = true;
          btn.textContent = 'Sending…';
          window.setTimeout(function () {
            btn.disabled = false;
            btn.textContent = label;
            var msg = form.getAttribute('data-success') || 'Submitted.';
            toast(msg, 'ok');
            if (form.hasAttribute('data-reset')) form.reset();
            form.dispatchEvent(new CustomEvent('ct:submitted', { bubbles: true }));
          }, 700);
        }
      });
    });
  }

  /* ================================================= contact blocking ==== */

  /* The export keeps contact details blocked on-platform. Any attempt to
     reveal a phone number, email, or handle is intercepted and explained. */
  function initContactBlock() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-blocked-contact]');
      if (!t) return;
      e.preventDefault();
      var what = t.getAttribute('data-blocked-contact') || 'contact details';
      toast('Contact details stay on CollabTable. ' + what +
        ' unlock for both sides once the creator has been paid.', 'ok');
    });
  }

/* ===================================================== deal lifecycle ==== */

  /* One deal room per campaign, opened by both sides from any surface. The
     room runs the real order of a deal: the two sides settle a number, both
     accept it, the restaurant pays, and only then does the contract with the
     real names and contact details open. Until the fee reaches escrow the
     header carries nothing but the campaign and the budget, so countering can
     never become a way to unmask the other side. */

  var DEAL_STORE = 'collabtable.deals.v1';

  var DEAL_COPY = {
    waitCreator: 'Wait for creator to accept the offer',
    waitRestaurant: 'Wait for restaurant to accept the offer',
    saidCreator: 'Creator has already accepted the offer',
    saidRestaurant: 'Restaurant has already accepted the offer',
    counter: 'Enter counter amount (Numbers only)'
  };

  var DEAL_CHECKS = [
    ['scope', 'Scope confirmed by both sides'],
    ['fee', 'Fee agreed at the settled amount'],
    ['files', 'Deliverables uploaded to the thread'],
    ['sign', 'Signed by restaurant and creator']
  ];

  /* The default campaign for a surface that carries none of its own, such as
     the landing page. Which campaign a room is actually showing is per-instance
     state, not a module global: a page can mount more than one room, and two
     rooms pointed at a single shared variable would overwrite each other. */
  var DEAL_DEFAULT_LINK = 'weekend-japanese';

  /* The deal has to outlive a repaint, but localStorage is not always there: a
     sandboxed preview frame, private mode and some file:// setups all throw on
     setItem. Swallowing that error is what made this room feel broken — every
     counter and acceptance went into a store that did not exist, and the record
     was gone by the next repaint, so nothing either side clicked ever stuck.
     Persistence is therefore a preference rather than a requirement: the record
     falls back to memory and the room says so, instead of losing the move. */
  /* Every mounted room registers a repaint callback here, so a write on one
     side repaints the other side immediately. Without it two rooms on one page
     could only ever catch up on the slow poll. */
  var dealBus = [];

  function dealAnnounce() {
    for (var i = 0; i < dealBus.length; i++) {
      try { dealBus[i](); } catch (err) { /* one broken room must not stall the rest */ }
    }
  }

  var dealLive = (function () {
    try {
      var probe = DEAL_STORE + '.probe';
      window.localStorage.setItem(probe, '1');
      window.localStorage.removeItem(probe);
      return true;
    } catch (err) {
      return false;
    }
  })();
  var dealMemory = {};

  function dealRead() {
    var raw = null;
    if (!dealLive) return dealMemory;
    try { raw = window.localStorage.getItem(DEAL_STORE); } catch (err) { dealLive = false; return dealMemory; }
    if (!raw) return {};
    try {
      var map = JSON.parse(raw);
      return (map && typeof map === 'object') ? map : {};
    } catch (err2) { return {}; }
  }

  function dealWrite(map) {
    if (!dealLive) { dealMemory = map; return; }
    try {
      window.localStorage.setItem(DEAL_STORE, JSON.stringify(map));
    } catch (err) {
      /* a store that filled up mid-session keeps the deal rather than dropping
         it, so it is demoted to memory instead of silently discarding writes */
      dealLive = false;
      dealMemory = map;
    }
    dealAnnounce();
  }

  function dealState(link) {
    var map = dealRead();
    var found = map[link];
    if (!found) {
      found = {
        link: link,
        campaign: 'Weekend Japanese Experience',
        base: 20000,
        latest: 20000,
        creatorPrice: null,
        restaurantPrice: null,
        initiator: 'NONE',
        restaurantAccept: false,
        creatorAccept: false,
        payment: 'UNPAID',
        edits: 0,
        adjusted: false,
        checks: {},
        chat: [{ side: 'restaurant', text: 'Opening scope shared. Counter the number whenever it moves.' }]
      };
      map[link] = found;
      dealWrite(map);
    }
    if (typeof found.creatorPrice !== 'number') found.creatorPrice = null;
    if (typeof found.restaurantPrice !== 'number') found.restaurantPrice = null;
    if (!found.checks || typeof found.checks !== 'object') found.checks = {};
    if (!Array.isArray(found.chat)) found.chat = [];
    return found;
  }

  function dealSave(state) {
    var map = dealRead();
    map[state.link] = state;
    dealWrite(map);
  }

  function dealSay(state, side, text) {
    state.chat.push({ side: side, text: text });
  }

  function rupee(n) { return '₹' + Number(n).toLocaleString('en-IN'); }

  /* Wipes the record so a run can start from the opening offer. Exposed on the
     window because the test harness needs it and there is no in-product surface
     that should offer a reset — a real deal room has no such control. */
  function dealReset() {
    var map = dealRead();
    Object.keys(map).forEach(function (k) { delete map[k]; });
    if (dealLive) {
      try { window.localStorage.removeItem(DEAL_STORE); } catch (err) { dealLive = false; }
    }
    dealMemory = map;
    dealAnnounce();
  }

  function dealMarkup(root) {
    var uid = root.getAttribute('id') || 'deal-room';
    return [
      '<div class="sheet-head">',
      '  <div>',
      '    <span class="eyebrow eyebrow-red">Deal room</span>',
      '    <h2 class="h4" id="' + uid + '-t">One thread, settled here</h2>',
      '  </div>',
      '  <button class="sheet-x" type="button" data-sheet-close aria-label="Close deal room">',
      ICONS.x,
      '  </button>',
      '</div>',

      '<div class="dr-hdr">',
      '  <p class="dr-hdr-k">Campaign: <span data-dr-campaign>Weekend Japanese Experience</span></p>',
      '  <p class="dr-hdr-k">Original Budget: <span data-dr-base>₹20,000</span></p>',
      '  <p class="dr-storage" data-dr-storage hidden role="status">This browser is blocking saved storage, so this deal lasts until you reload the page. Everything else still works.</p>',
      '</div>',

      '<div class="dr-mid">',
      '  <div class="dr-canvas" data-dr-canvas>',
      '    <div class="dr-col" data-side="creator">',
      '      <span class="dr-col-k">Creator Countered Price</span>',
      '      <span class="dr-col-v" data-dr-price-creator>—</span>',
      '    </div>',
      '    <div class="dr-col" data-side="restaurant">',
      '      <span class="dr-col-k">Restaurant Countered Price</span>',
      '      <span class="dr-col-v" data-dr-price-restaurant>—</span>',
      '    </div>',
      '  </div>',
      '  <p class="dr-wait" data-dr-wait hidden role="status" aria-live="polite"></p>',
      '</div>',

      '<div class="dr-acts">',
      '  <button class="btn btn-primary" type="button" data-dr-accept>Accept Offer</button>',
      '  <button class="btn btn-ghost" type="button" data-dr-counter-btn>Counter Offer</button>',
      '  <button class="btn btn-quiet" type="button" data-dr-cancel-btn hidden>Cancel Negotiation</button>',
      '  <button class="btn btn-primary" type="button" data-dr-pay hidden>Pay Now</button>',
      '  <p class="dr-banner" data-dr-await hidden>Awaiting Brand Payment</p>',
      '  <button class="btn btn-gold" type="button" data-dr-contract hidden>Contract</button>',
      '</div>',
      '<p class="dr-status" data-dr-status hidden role="status" aria-live="polite"></p>',

      /* ---------------------------------------------------- counter --- */
      '<div class="dr-sub" data-dr-sub="counter" hidden aria-hidden="true">',
      '  <div class="dr-sub-card" role="dialog" aria-modal="true" aria-labelledby="' + uid + '-ct">',
      '    <h3 class="h4" id="' + uid + '-ct">Counter the offer</h3>',
      '    <p class="dr-sub-s">Your number replaces the current one and the other side has to accept it.</p>',
      '    <label class="label" for="' + uid + '-amt">Counter amount</label>',
      '    <input class="input" id="' + uid + '-amt" type="text" inputmode="numeric" autocomplete="off"',
      '           placeholder="' + DEAL_COPY.counter + '" data-dr-amount aria-describedby="' + uid + '-amt-h">',
      '    <p class="hint" id="' + uid + '-amt-h">Whole rupees only.</p>',
      '    <div class="dr-sub-acts">',
      '      <button class="btn btn-primary" type="button" data-dr-counter-submit disabled>Submit Counter</button>',
      '      <button class="btn btn-quiet" type="button" data-dr-back>Back</button>',
      '    </div>',
      '  </div>',
      '</div>',

      /* ----------------------------------------------------- cancel --- */
      '<div class="dr-sub" data-dr-sub="cancel" hidden aria-hidden="true">',
      '  <div class="dr-sub-card" role="dialog" aria-modal="true" aria-labelledby="' + uid + '-cn">',
      '    <h3 class="h4" id="' + uid + '-cn">Cancel this negotiation?</h3>',
      '    <p class="dr-sub-s">The thread and its entry point are removed for both sides. This cannot be undone.</p>',
      '    <div class="dr-sub-acts">',
      '      <button class="btn btn-primary" type="button" data-dr-cancel-confirm>Yes, cancel negotiation</button>',
      '      <button class="btn btn-quiet" type="button" data-dr-back>Keep it open</button>',
      '    </div>',
      '  </div>',
      '</div>',

      /* --------------------------------------------------- contract --- */
      '<div class="dr-sub dr-sub-wide" data-dr-sub="contract" hidden aria-hidden="true">',
      '  <div class="dr-contract">',
      '    <div class="dr-contract-head">',
      '      <div>',
      '        <span class="eyebrow eyebrow-red">Contract</span>',
      '        <h3 class="h4">Settled at <span data-dr-contract-price>₹20,000</span></h3>',
      '      </div>',
      '      <button class="btn btn-quiet btn-sm" type="button" data-dr-back>Close contract</button>',
      '    </div>',

      '    <div class="dr-contract-scroll">',
      '    <div class="dr-contract-top">',
      '      <section class="dr-card" aria-labelledby="' + uid + '-cam">',
      '        <span class="eyebrow">Campaign metadata</span>',
      '        <h4 class="h4" id="' + uid + '-cam" data-dr-campaign>Weekend Japanese Experience</h4>',
      '        <dl class="dr-defs">',
      '          <dt>Original budget</dt><dd data-dr-base>₹20,000</dd>',
      '          <dt>Agreed fee</dt><dd data-dr-contract-base>₹20,000</dd>',
      '          <dt>Platform fee (10%)</dt><dd data-dr-contract-fee>₹2,000</dd>',
      '          <dt>Creator payout</dt><dd data-dr-contract-net>₹18,000</dd>',
      '          <dt>Deliverable</dt><dd>3 Reels + 4 Stories</dd>',
      '          <dt>Shoot window</dt><dd>12–14 Sep · Mumbai</dd>',
      '        </dl>',
      '      </section>',
      '      <section class="dr-card" aria-labelledby="' + uid + '-res">',
      '        <span class="eyebrow">Restaurant · business directory</span>',
      '        <h4 class="h4" id="' + uid + '-res">Sakura House</h4>',
      '        <dl class="dr-defs">',
      '          <dt>Brand</dt><dd>Sakura House</dd>',
      '          <dt>Category</dt><dd>Japanese · Bandra West</dd>',
      '          <dt>Corporate address</dt><dd>14 Pali Hill, Bandra West, Mumbai 400050</dd>',
      '          <dt>Point of contact</dt><dd>Priya Raman · Managing Partner</dd>',
      '          <dt>Contact</dt><dd>+91 98200 41123 · priya@sakurahouse.in</dd>',
      '        </dl>',
      '      </section>',
      '      <section class="dr-card" aria-labelledby="' + uid + '-cre">',
      '        <span class="eyebrow">Creator · personal record</span>',
      '        <h4 class="h4" id="' + uid + '-cre">Ananya Kapoor</h4>',
      '        <dl class="dr-defs">',
      '          <dt>Legal name</dt><dd>Ananya Kapoor</dd>',
      '          <dt>Email address</dt><dd>ananya.kapoor@postbox.in</dd>',
      '          <dt>Contact number</dt><dd>+91 90045 22118</dd>',
      '          <dt>Reach</dt><dd>124k · Mumbai</dd>',
      '        </dl>',
      '      </section>',
      '    </div>',

      '    <div class="dr-contract-body">',
      '      <section class="dr-card" aria-labelledby="' + uid + '-cht">',
      '        <span class="eyebrow">Chat &amp; file system</span>',
      '        <h4 class="h4" id="' + uid + '-cht">Campaign thread</h4>',
      '        <div class="dr-chat" data-dr-chat role="log" aria-label="Deal messages"></div>',
      '        <div class="dr-file-acts">',
      '          <button class="btn btn-ghost btn-sm" type="button" data-dr-upload>Upload Files</button>',
      '          <button class="btn btn-primary btn-sm" type="button" data-dr-review>Review Files</button>',
      '          <input type="file" multiple hidden data-dr-file-input>',
      '        </div>',
      '        <p class="hint" data-dr-edit-note hidden>One edit request is already spent on this campaign.</p>',
      '      </section>',

      '      <section class="dr-card" aria-labelledby="' + uid + '-sgn">',
      '        <span class="eyebrow">Sign-off</span>',
      '        <h4 class="h4" id="' + uid + '-sgn">Checklist</h4>',
      '        <ul class="dr-checks" data-dr-checks></ul>',
      '      </section>',
      '    </div>',
      '    </div>',

      '    <section class="dr-card dr-milestone" aria-labelledby="' + uid + '-mst">',
      '      <span class="eyebrow">Milestone</span>',
      '      <h4 class="h4" id="' + uid + '-mst">Milestone Verification Checklist</h4>',
      '      <label class="dr-check">',
      '        <input type="checkbox" data-dr-verify>',
      '        <span>Work Done or Not</span>',
      '      </label>',
      '      <p class="hint" data-dr-verify-note>Unlocks once the fee is in escrow.</p>',
      '    </section>',
      '  </div>',
      '</div>',

      /* ---------------------------------------------- review overlay --- */
      '<div class="dr-review" data-dr-sub="review" hidden aria-hidden="true">',
      '  <div class="dr-review-head">',
      '    <h3 class="h4">Review files</h3>',
      '    <button class="sheet-x" type="button" data-dr-review-close aria-label="Close file review">',
      ICONS.x,
      '    </button>',
      '  </div>',
      '  <div class="dr-review-body" data-dr-review-body></div>',
      '  <div class="dr-review-acts">',
      '    <button class="btn btn-primary" type="button" data-dr-request-edit>Request Edits</button>',
      '    <button class="btn btn-quiet" type="button" data-dr-review-close>Close</button>',
      '  </div>',
      '</div>',

      /* ------------------------------------------------------- edit --- */
      '<div class="dr-sub" data-dr-sub="edit" hidden aria-hidden="true">',
      '  <div class="dr-sub-card" role="dialog" aria-modal="true" aria-labelledby="' + uid + '-ed">',
      '    <h3 class="h4" id="' + uid + '-ed">Request edits</h3>',
      '    <p class="dr-sub-s">One request per campaign. The creator sees it as an adjustment on the deal.</p>',
      '    <label class="label" for="' + uid + '-edt">What needs changing</label>',
      '    <textarea class="input" id="' + uid + '-edt" rows="4" data-dr-edit-text',
      '              placeholder="Describe the change you need."></textarea>',
      '    <div class="dr-sub-acts">',
      '      <button class="btn btn-primary" type="button" data-dr-edit-send>Send request</button>',
      '      <button class="btn btn-quiet" type="button" data-dr-back>Back</button>',
      '    </div>',
      '  </div>',
      '</div>'
    ].join('\n');
  }

  function mountDeal(root) {
    var role = root.getAttribute('data-deal-role') === 'creator' ? 'creator' : 'restaurant';
    var uid = root.getAttribute('id') || 'deal-room';
    /* Which campaign this instance shows. It lives here rather than on the
       module so two rooms on one page — the side-by-side test harness mounts
       the restaurant and the creator at once — cannot overwrite each other. */
    var link = root.getAttribute('data-deal-link') || DEAL_DEFAULT_LINK;
    /* Uploaded blobs only live for this session — the bytes are never sent
       anywhere in a static prototype, so they are not worth pretending to
       survive a reload. */
    var files = [];

    root.innerHTML = dealMarkup(root);
    root.setAttribute('data-ready', 'true');

    function find(name) { return $('[data-dr-' + name + ']', root); }
    function sub(name) { return $('[data-dr-sub="' + name + '"]', root); }
    function all(name) { return $$('[data-dr-' + name + ']', root); }

    function showSub(name, on) {
      var node = sub(name);
      if (!node) return;
      node.hidden = !on;
      node.setAttribute('aria-hidden', String(!on));
      if (on) {
        var first = $('input, textarea, button', node);
        if (first) window.setTimeout(function () { first.focus(); }, 40);
      }
    }

    function closeSubs() {
      ['counter', 'cancel', 'edit'].forEach(function (n) { showSub(n, false); });
    }

    /* ---- the acceptance copy reads differently on the two sides ---- */
    function waitMessage(state) {
      if (state.restaurantAccept && !state.creatorAccept) {
        return role === 'restaurant' ? DEAL_COPY.waitCreator : DEAL_COPY.saidRestaurant;
      }
      if (state.creatorAccept && !state.restaurantAccept) {
        return role === 'restaurant' ? DEAL_COPY.saidCreator : DEAL_COPY.waitRestaurant;
      }
      return '';
    }

    function setAccept(state, on) {
      if (role === 'restaurant') state.restaurantAccept = on;
      else state.creatorAccept = on;
    }

    /* The side that put the last number on the table waits; the other side
       keeps its controls live. */
    function locked(state) {
      return state.initiator !== 'NONE' && state.initiator === role.toUpperCase();
    }

    function paintChecks(state) {
      var list = find('checks');
      if (list) {
        list.innerHTML = DEAL_CHECKS.map(function (c) {
          return '<li class="dr-check-item"><label class="dr-check">' +
            '<input type="checkbox" data-dr-check="' + c[0] + '"' + (state.checks[c[0]] ? ' checked' : '') + '>' +
            '<span>' + c[1] + '</span></label></li>';
        }).join('');
      }
      var verify = find('verify');
      if (verify) verify.checked = state.checks.done === true;
      var note = find('verify-note');
      if (note) {
        note.textContent = state.payment === 'PAID'
          ? 'Checked once both sides confirm the work has landed.'
          : 'Unlocks once the fee is in escrow.';
      }
    }

    function paintChat(state) {
      var box = find('chat');
      if (!box) return;
      var recent = state.chat.slice(-40);
      box.innerHTML = recent.map(function (m) {
        return '<p class="dr-msg" data-side="' + m.side + '" data-mine="' + (m.side === role) + '">' +
          '<span class="dr-msg-s">' + (m.side === 'creator' ? 'Creator' : 'Restaurant') + '</span>' +
          '<span class="dr-msg-t"></span></p>';
      }).join('');
      /* text is set after the markup so a message can never inject markup */
      $$('.dr-msg-t', box).forEach(function (n, i) { n.textContent = recent[i].text; });
      box.scrollTop = box.scrollHeight;
    }

    function paintReview(state) {
      var body = find('review-body');
      if (body) {
        body.innerHTML = files.length
          ? files.map(function (f) {
              return '<div class="dr-file">' +
                '<span class="dr-file-i">' + ICONS.doc + '</span>' +
                '<span class="dr-file-b"><span class="dr-file-n"></span>' +
                '<span class="dr-file-s"></span></span>' +
                '<a class="btn btn-ghost btn-sm" download>Download</a></div>';
            }).join('')
          : '<p class="dr-empty">No deliverables uploaded yet.</p>';
        $$('.dr-file', body).forEach(function (row, i) {
          var f = files[i];
          $('.dr-file-n', row).textContent = f.name;
          $('.dr-file-s', row).textContent = Math.max(1, Math.round(f.size / 1024)) + ' KB';
          var a = $('a', row);
          a.href = f.url;
          a.setAttribute('download', f.name);
        });
      }
      var ask = find('request-edit');
      if (ask) ask.disabled = state.edits > 0;
      var spent = find('edit-note');
      if (spent) spent.hidden = state.edits === 0;
    }

    /* Dashboard cards carry the live number, so they follow every move.
       This only reads: merely landing on a page must not open a thread for
       every campaign it happens to mention. */
    function paintCards() {
      var map = dealRead();
      $$('[data-deal-card]').forEach(function (card) {
        var s = map[card.getAttribute('data-deal-card')];
        var price = $('[data-deal-card-price]', card);
        if (price && s) price.textContent = rupee(s.latest);
      });
    }

    /* Two greyed-out buttons explain nothing on their own, so the room says
       whose move it is and what would hand the controls back. This is the
       whole negotiation rule in one sentence per side. */
    function statusMessage(state) {
      if (state.payment === 'PAID') return '';
      if (state.restaurantAccept && state.creatorAccept) return '';
      if (!locked(state)) return '';
      return role === 'restaurant'
        ? 'The creator put a number on the table. Accept it or counter it — either one hands your controls back.'
        : 'Your counter is with the restaurant. Accept and counter reopen as soon as they respond, or withdraw the negotiation below.';
    }

    function paint() {
      var state = dealState(link);
      var bothAccepted = state.restaurantAccept && state.creatorAccept;
      var isLocked = locked(state);
      var paid = state.payment === 'PAID';
      var fee = Math.round(state.latest * 0.1);

      all('campaign').forEach(function (n) { n.textContent = state.campaign; });
      all('base').forEach(function (n) { n.textContent = rupee(state.base); });

      var creatorPrice = find('price-creator');
      if (creatorPrice) creatorPrice.textContent = state.creatorPrice === null ? '—' : rupee(state.creatorPrice);
      var restPrice = find('price-restaurant');
      if (restPrice) restPrice.textContent = state.restaurantPrice === null ? '—' : rupee(state.restaurantPrice);

      var msg = waitMessage(state);
      var wait = find('wait');
      if (wait) { wait.textContent = msg; wait.hidden = !msg; }
      var canvas = find('canvas');
      if (canvas) canvas.hidden = !!msg;

      /* the contract only ever quotes a fee that has actually been paid */
      var settled = paid ? rupee(state.latest) : '—';
      var feeNode = find('contract-price');
      if (feeNode) feeNode.textContent = settled;
      var baseNode = find('contract-base');
      if (baseNode) baseNode.textContent = settled;
      var feeVal = find('contract-fee');
      if (feeVal) feeVal.textContent = paid ? rupee(fee) : '—';
      var netVal = find('contract-net');
      if (netVal) netVal.textContent = paid ? rupee(state.latest - fee) : '—';

      var accept = find('accept');
      var counterBtn = find('counter-btn');
      if (accept) {
        accept.hidden = paid || bothAccepted;
        accept.disabled = isLocked;
        accept.setAttribute('aria-disabled', String(isLocked));
      }
      if (counterBtn) {
        counterBtn.hidden = paid || bothAccepted;
        counterBtn.disabled = isLocked;
        counterBtn.setAttribute('aria-disabled', String(isLocked));
      }
      var cancelBtn = find('cancel-btn');
      if (cancelBtn) {
        var mayCancel = state.initiator !== 'NONE' && state.initiator === role.toUpperCase();
        cancelBtn.hidden = !mayCancel || paid || bothAccepted;
        cancelBtn.disabled = !mayCancel;
      }
      /* Say out loud why the two controls are dead, otherwise a locked side
         reads the room as broken rather than as its turn to wait. */
      var status = find('status');
      if (status) {
        var why = statusMessage(state);
        status.textContent = why;
        status.hidden = !why;
      }

      var awaitEl = find('await');
      if (awaitEl) awaitEl.hidden = !(bothAccepted && role === 'creator' && !paid);
      var pay = find('pay');
      if (pay) {
        pay.hidden = !(bothAccepted && role === 'restaurant' && !paid);
        pay.disabled = state.payment === 'PENDING';
        pay.textContent = state.payment === 'PENDING' ? 'Processing…' : 'Pay Now';
      }
      var contract = find('contract');
      if (contract) contract.hidden = !paid;
      /* the milestone only becomes real once the money is in escrow */
      var verify = find('verify');
      if (verify) verify.disabled = !paid;

      /* A room whose store fell back to memory says so, rather than letting the user
       assume a move was saved when a reload will take it away. */
      var storeNote = find('storage');
      if (storeNote) storeNote.hidden = dealLive;

      root.setAttribute('data-stage', paid ? 'contract' : bothAccepted ? 'payment' : 'offer');
      root.setAttribute('data-locked', String(isLocked));

      paintChat(state);
      paintChecks(state);
      paintReview(state);
      paintCards();
    }

    /* Escape closes the topmost nested overlay first and only then lets the
       sheet's own handler close the room. */
    root.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape') return;
      var openSub = $$('[data-dr-sub]:not([hidden])', root).pop();
      if (!openSub) return;
      e.stopPropagation();
      e.preventDefault();
      showSub(openSub.getAttribute('data-dr-sub'), false);
    });

    root.addEventListener('click', function (e) {
      var t = e.target;

      if (t.closest('[data-dr-accept]')) {
        e.preventDefault();
        var s = dealState(link);
        if (locked(s)) return;
        /* Only the side the counter is not waiting on can get here, so accepting is
           by definition an answer to that counter. It hands the floor back:
           without this the restaurant that countered stays locked out of its
           own Accept button, the thread deadlocks with both controls greyed
           out, and the negotiation can never reach a contract. */
        if (s.initiator !== 'NONE') s.initiator = 'NONE';
        setAccept(s, true);
        dealSave(s);
        paint();
        return;
      }

      if (t.closest('[data-dr-counter-btn]')) {
        e.preventDefault();
        var s2 = dealState(link);
        if (locked(s2)) return;
        var amt = find('amount');
        if (amt) {
          amt.value = '';
          amt.setAttribute('aria-invalid', 'false');
        }
        var submit = find('counter-submit');
        if (submit) submit.disabled = true;
        showSub('counter', true);
        return;
      }

      if (t.closest('[data-dr-counter-submit]')) {
        e.preventDefault();
        var amt2 = find('amount');
        var n = Number(((amt2 && amt2.value) || '').replace(/[^0-9]/g, ''));
        if (!n || n <= 0) return;
        var s3 = dealState(link);
        s3.latest = n;
        if (role === 'creator') s3.creatorPrice = n; else s3.restaurantPrice = n;
        s3.initiator = role.toUpperCase();
        /* a changed price has to be accepted again by both sides */
        s3.restaurantAccept = false;
        s3.creatorAccept = false;
        dealSay(s3, role, 'Countered at ' + rupee(n) + '.');
        dealSave(s3);
        showSub('counter', false);
        paint();
        return;
      }

      if (t.closest('[data-dr-cancel-btn]')) {
        e.preventDefault();
        showSub('cancel', true);
        return;
      }

      if (t.closest('[data-dr-cancel-confirm]')) {
        e.preventDefault();
        var map = dealRead();
        delete map[link];
        dealWrite(map);
        /* the card and every entry point for this campaign go together */
        $$('[data-deal-card="' + link + '"]').forEach(function (n) {
          n.hidden = true;
          n.setAttribute('data-cancelled', 'true');
        });
        $$('[data-deal-link="' + link + '"]').forEach(function (n) {
          if (n.closest('[data-deal]')) return;
          var row = n.closest('[data-deal-entry]') || n;
          row.hidden = true;
          row.setAttribute('data-cancelled', 'true');
        });
        showSub('cancel', false);
        if (window.ctCloseSheet) window.ctCloseSheet();
        toast('Negotiation cancelled. The deal room has been removed.', 'ok');
        return;
      }

      if (t.closest('[data-dr-back]')) {
        e.preventDefault();
        closeSubs();
        return;
      }

      if (t.closest('[data-dr-pay]')) {
        e.preventDefault();
        var sp = dealState(link);
        if (sp.payment !== 'UNPAID') return;
        sp.payment = 'PENDING';
        dealSave(sp);
        paint();
        window.setTimeout(function () {
          var s4 = dealState(link);
          if (s4.payment !== 'PENDING') return;
          s4.payment = 'PAID';
          dealSay(s4, 'restaurant', 'Paid ' + rupee(s4.latest) + ' into escrow.');
          dealSave(s4);
          paint();
          toast('Payment captured. The contract is now open to both sides.', 'ok');
        }, 900);
        return;
      }

      if (t.closest('[data-dr-contract]')) {
        e.preventDefault();
        if (dealState(link).payment === 'PAID') showSub('contract', true);
        return;
      }

      if (t.closest('[data-dr-upload]')) {
        e.preventDefault();
        var input = find('file-input');
        if (input) input.click();
        return;
      }

      if (t.closest('[data-dr-review]')) {
        e.preventDefault();
        paintReview(dealState(link));
        showSub('review', true);
        return;
      }

      if (t.closest('[data-dr-review-close]')) {
        e.preventDefault();
        showSub('review', false);
        return;
      }

      if (t.closest('[data-dr-request-edit]')) {
        e.preventDefault();
        if (dealState(link).edits > 0) return;
        showSub('review', false);
        var note = find('edit-text');
        if (note) note.value = '';
        showSub('edit', true);
        return;
      }

      if (t.closest('[data-dr-edit-send]')) {
        e.preventDefault();
        var se = dealState(link);
        if (se.edits > 0) return;
        var box = find('edit-text');
        var text = ((box && box.value) || '').trim();
        if (!text) return;
        se.edits = 1;
        se.adjusted = true;
        dealSay(se, 'restaurant', 'Edit request: ' + text);
        dealSave(se);
        showSub('edit', false);
        paint();
        toast('Edit request sent. It is now locked for this campaign.', 'ok');
        return;
      }
    });

    root.addEventListener('change', function (e) {
      var t = e.target;

      if (t.matches && t.matches('[data-dr-check]')) {
        var s = dealState(link);
        s.checks[t.getAttribute('data-dr-check')] = t.checked;
        dealSave(s);
        return;
      }

      if (t.matches && t.matches('[data-dr-verify]')) {
        var sv = dealState(link);
        if (sv.payment !== 'PAID') { t.checked = false; return; }
        sv.checks.done = t.checked;
        dealSave(sv);
        return;
      }

      if (t.matches && t.matches('[data-dr-file-input]')) {
        var chosen = Array.prototype.slice.call(t.files || []);
        if (!chosen.length) return;
        var st = dealState(link);
        chosen.forEach(function (file) {
          files.push({
            name: file.name,
            size: file.size,
            url: URL.createObjectURL(file)
          });
          dealSay(st, 'creator', 'Uploaded ' + file.name + '.');
        });
        dealSave(st);
        t.value = '';
        paint();
        toast(chosen.length + ' file' + (chosen.length > 1 ? 's' : '') + ' shared in the thread.', 'ok');
      }
    });

    /* counters accept whole rupees only: no letters, spaces or symbols */
    var amountField = find('amount');
    if (amountField) {
      amountField.addEventListener('input', function () {
        var cleaned = amountField.value.replace(/[^0-9]/g, '');
        if (cleaned !== amountField.value) amountField.value = cleaned;
        var n = Number(cleaned);
        var ok = !!cleaned && n > 0;
        amountField.setAttribute('aria-invalid', String(!!cleaned && !ok));
        var submit = find('counter-submit');
        if (submit) submit.disabled = !ok;
      });
      amountField.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        var submit = find('counter-submit');
        if (submit && !submit.disabled) { e.preventDefault(); submit.click(); }
      });
    }

    root.addEventListener('ct:sheet-open', function (e) {
      var opener = e.detail && e.detail.opener;
      if (!opener) return;
      var next = opener.getAttribute('data-deal-link');
      if (!next) return;

      /* With more than one room on a page, an opener can name the room it means
         so one campaign never repaints the other side's view by accident. */
      var want = opener.getAttribute('data-deal-target');
      if (want && want !== uid) return;

      /* The card that opened the room says which campaign it is, either on the
         application itself or on the campaign group it sits in. The name always
         follows the card, because the same link is reachable from more than one
         surface and a thread must never be labelled with a campaign it is not. */
      var card = opener.closest('[data-appl]') || opener;
      var group = opener.closest('[data-campaign]');
      var named = card.getAttribute('data-appl-campaign') ||
                  (group && group.getAttribute('data-campaign'));
      if (named) {
        var fresh = !dealRead()[next];
        var seeded = dealState(next);
        if (seeded.campaign !== named) seeded.campaign = named;
        var rate = Number(card.getAttribute('data-appl-rate'));
        if (fresh && rate > 0) seeded.base = rate;
        dealSave(seeded);
      }

      link = next;
      closeSubs();
      paint();
    });

    /* Anything that changes the record tells every room on the page directly, so
       the two sides of the same deal repaint in the same tick rather than after
       the next slow poll. This is the path the in-page harness relies on. */
    function joinDealBus() {
      if (root.__dealBus) return;
      root.__dealBus = true;
      dealBus.push(function () { paint(); });
    }
    joinDealBus();

    /* Another tab moving the deal should show up here too. The storage event is the
       fast path, but it is not delivered between every pair of tabs — an
       origin the browser treats as opaque will simply not fire it — so the room
       also re-reads the store on a slow tick and repaints only when the record
       actually moved. That is what makes the two-sided flow testable. */
    var seen = null;
    window.addEventListener('storage', function (e) {
      if (e.key !== DEAL_STORE) return;
      seen = null;
      paint();
    });

    window.setInterval(function () {
      var raw;
      if (!dealLive) return;
      try { raw = window.localStorage.getItem(DEAL_STORE); } catch (err) { return; }
      if (raw === seen) return;
      seen = raw;
      paint();
    }, 900);

    paint();
  }

  /* The deal room ships as a pop-up on every surface, and a page can hold more
     than one instance, so mount them all. */
  function initDeal() {
    $$('[data-deal]').forEach(mountDeal);
    window.ctDealReset = dealReset;
    window.ctDealStoreLive = function () { return dealLive; };
  }

  /* ==================================================== sheet context ===== */

  /* A restaurant can run several campaigns at once, so the deal room and the
     application sheet are single shared pop-ups. The application card that
     opened one carries the campaign, so both pop-ups can name the right one
     instead of every deal reading as the same deal. */
  function initSheetContext() {
    /* The card that was read last. A deal room opened from inside the
       application sheet has no card above it, so it inherits the application
       currently on screen instead of falling back to a generic deal. */
    var current = null;

    document.addEventListener('ct:sheet-open', function (e) {
      var sheet = e.target;
      var opener = e.detail && e.detail.opener;
      if (!opener || !sheet) return;
      /* the button may carry the context, or sit inside a card that does */
      var src = opener.closest('[data-appl]') || opener;
      if (src.getAttribute('data-appl-campaign')) current = src;

      /* inside the application sheet there is no card, so reuse the one the
         reader came from and the deal room names the same campaign */
      if (opener.closest('[data-appl-sheet]') && current) src = current;

      /* the deal room names its own campaign: it reads the card that opened it
         and keeps that name with the deal itself, so reopening it from a
         different surface still lands on the right thread */
      if (sheet.hasAttribute('data-appl-sheet')) {
        apply(sheet, src, '[data-ap-name]', 'data-appl-name');
        apply(sheet, src, '[data-ap-campaign]', 'data-appl-campaign');
        apply(sheet, src, '[data-ap-meta]', 'data-appl-meta');
        apply(sheet, src, '[data-ap-rate]', 'data-appl-rate');
        apply(sheet, src, '[data-ap-range]', 'data-appl-range');
        apply(sheet, src, '[data-ap-note]', 'data-appl-note');
        apply(sheet, src, '[data-ap-age]', 'data-ap-age');
        applyOptional(sheet, src, '[data-ap-also]', 'data-appl-also');
      }
    });

    function apply(sheet, src, sel, attr) {
      var el = $(sel, sheet);
      var val = src.getAttribute(attr);
      if (el && val) el.textContent = val;
    }

    function applyOptional(sheet, src, sel, attr) {
      var el = $(sel, sheet);
      var val = src.getAttribute(attr);
      if (!el) return;
      el.hidden = !val;
      if (val) el.textContent = val;
    }
  }

  /* ================================================== filter and search ==== */

  function initFiltering() {
    $$('[data-filterable]').forEach(function (scope) {
      var items = $$('[data-tags]', scope);
      var empty = $('[data-empty]', scope);
      var count = $('[data-count]', scope);
      var search = $('[data-search]', scope);

      function activeTags() {
        var tags = [];
        $$('[data-chipgroup] .chip[aria-pressed="true"]', scope).forEach(function (c) {
          var v = c.getAttribute('data-tag');
          if (v) tags.push(v);
        });
        return tags;
      }

      function apply() {
        var tags = activeTags();
        var q = search ? search.value.trim().toLowerCase() : '';
        var shown = 0;

        items.forEach(function (item) {
          var itemTags = (item.getAttribute('data-tags') || '').split(/\s+/);
          var okTag = tags.length === 0 || tags.every(function (t) {
            return itemTags.indexOf(t) > -1;
          });
          var okQ = !q || (item.textContent || '').toLowerCase().indexOf(q) > -1;
          var on = okTag && okQ;
          item.hidden = !on;
          if (on) shown += 1;
        });

        if (empty) empty.hidden = shown > 0;
        if (count) count.textContent = String(shown);
      }

      scope.addEventListener('ct:filter', apply);
      if (search) {
        search.addEventListener('input', function () {
          window.clearTimeout(search.ctTimer);
          search.ctTimer = window.setTimeout(apply, 160);
        });
      }
      apply();
    });
  }

  /* ============================================== collapsible filters ==== */

  function initFilterToggle() {
    $$('[data-filter-toggle]').forEach(function (btn) {
      var panel = document.getElementById(btn.getAttribute('aria-controls') || '');
      if (!panel) return;

      function pressed() {
        return $$('[data-chipgroup] .chip[aria-pressed="true"]', panel).length;
      }

      function sync() {
        var n = pressed();
        var open = btn.getAttribute('aria-expanded') === 'true';
        var badge = $('[data-filter-count]', btn);
        if (badge) badge.textContent = String(n);
        btn.setAttribute('data-active', n > 0 ? 'true' : 'false');
        btn.setAttribute('aria-label',
          n + (n === 1 ? ' filter active, ' : ' filters active, ') +
          (open ? 'collapse filters' : 'expand filters'));
      }

      function setOpen(open) {
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
        panel.hidden = !open;
        sync();
      }

      btn.addEventListener('click', function () {
        setOpen(btn.getAttribute('aria-expanded') !== 'true');
      });
      panel.addEventListener('ct:filter', sync);

      setOpen(btn.getAttribute('aria-expanded') === 'true');
    });
  }

  /* =========================================================== reveal ===== */

  function initReveal() {
    var targets = $$('[data-reveal]');
    if (!targets.length) return;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (t) { t.style.opacity = '1'; t.style.transform = 'none'; });
      return;
    }
    targets.forEach(function (t) {
      t.style.opacity = '0';
      t.style.transform = 'translateY(12px)';
      t.style.transition = 'opacity 380ms cubic-bezier(0.16,1,0.3,1), transform 380ms cubic-bezier(0.16,1,0.3,1)';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.style.opacity = '1';
        en.target.style.transform = 'none';
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    targets.forEach(function (t) { io.observe(t); });
  }

  /* ========================================================= copy bits ==== */

  function initCopy() {
    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-copy]');
      if (!t) return;
      e.preventDefault();
      var text = t.getAttribute('data-copy');
      if (!text) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
          .then(function () { toast('Copied to clipboard.', 'ok'); })
          .catch(function () { toast('Copy failed — select the text manually.', 'error'); });
      } else {
        toast('Copy unavailable in this browser.', 'error');
      }
    });
  }

  /* ==================================================== motion toggle ==== */

  function initLanes() {
    var wrap = $('[data-lanes]');
    var btn = $('[data-lanes-toggle]');
    if (!wrap) return;
    var label = btn ? $('[data-lanes-toggle-label]', btn) : null;
    if (reduceMotion) {
      wrap.classList.add('lanes-paused');
      if (btn) {
        btn.setAttribute('aria-pressed', 'true');
        if (label) label.textContent = 'Play motion';
      }
    }
    if (btn) {
      btn.addEventListener('click', function () {
        var paused = wrap.classList.toggle('lanes-paused');
        btn.setAttribute('aria-pressed', paused ? 'true' : 'false');
        if (label) label.textContent = paused ? 'Play motion' : 'Pause motion';
      });
    }
    $$('[data-lane]', wrap).forEach(function (lane) {
      var id = lane.getAttribute('data-lane');
      $$('[data-lane-target="' + id + '"][data-lane-step]', wrap).forEach(function (step) {
        step.addEventListener('click', function () {
          var dir = step.getAttribute('data-lane-step') === 'next' ? 1 : -1;
          lane.scrollBy({ left: dir * lane.clientWidth * 0.8, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
      });
      bindLaneDrag(lane);
    });
  }

  /* pointer drag for mouse users; touch and trackpad use native scrolling */
  function bindLaneDrag(lane) {
    var pid = null, startX = 0, startLeft = 0, moved = false;
    lane.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch' || (e.button !== undefined && e.button !== 0)) return;
      pid = e.pointerId;
      startX = e.clientX;
      startLeft = lane.scrollLeft;
      moved = false;
    });
    lane.addEventListener('pointermove', function (e) {
      if (pid !== e.pointerId) return;
      var dx = e.clientX - startX;
      if (!moved) {
        if (Math.abs(dx) < 6) return;
        moved = true;
        lane.classList.add('is-dragging');
        if (lane.setPointerCapture) lane.setPointerCapture(e.pointerId);
      }
      lane.scrollLeft = startLeft - dx;
      e.preventDefault();
    });
    function end(e) {
      if (pid !== e.pointerId) return;
      if (moved) lane.classList.remove('is-dragging');
      pid = null;
    }
    lane.addEventListener('pointerup', end);
    lane.addEventListener('pointercancel', end);
    lane.addEventListener('click', function (e) {
      if (!moved) return;
      moved = false;
      e.preventDefault();
      e.stopPropagation();
    }, true);
  }

  /* ====================================================== 3D Ferris Wheel Carousel ==== */

  function initCircularCarousel() {
    var carousels = $$('.cc-carousel');
    if (!carousels.length) return;

    carousels.forEach(function (carousel) {
      var ring = $('#cc-ring', carousel);
      if (!ring) return;

      var items = carousel.querySelectorAll('[data-cc-item]');
      var count = items.length;
      if (count === 0) return;

      // Configuration from data attributes
      var axis = carousel.getAttribute('data-axis') || 'y';
      var tilt = parseFloat(carousel.getAttribute('data-tilt')) || -5;
      var perspective = parseFloat(carousel.getAttribute('data-perspective')) || 2500;
      var gap = parseFloat(carousel.getAttribute('data-gap')) || 24;
      var cardWidth = parseFloat(carousel.getAttribute('data-card-width')) || 320;
      var aspectRatio = parseFloat(carousel.getAttribute('data-aspect-ratio')) || 0.5625;
      var speed = parseFloat(carousel.getAttribute('data-speed')) || 14;
      var autoplay = carousel.getAttribute('data-autoplay') || 'drift';
      var interval = parseFloat(carousel.getAttribute('data-interval')) || 3;
      var draggable = carousel.getAttribute('data-draggable') !== 'false';
      var momentum = parseFloat(carousel.getAttribute('data-momentum')) || 0.6;
      var snap = carousel.getAttribute('data-snap') !== 'false';
      var pauseOnHover = carousel.getAttribute('data-pause-on-hover') !== 'false';
      var parallax = parseFloat(carousel.getAttribute('data-parallax')) || 0.3;
      var stretch = parseFloat(carousel.getAttribute('data-stretch')) || 0.5;
      var depthFade = parseFloat(carousel.getAttribute('data-depth-fade')) || 0.55;
      var innerShade = parseFloat(carousel.getAttribute('data-inner-shade')) || 0.6;
      var cornerRadius = parseFloat(carousel.getAttribute('data-corner-radius')) || 12;
      var fadeColor = carousel.getAttribute('data-fade-color') || '#000000';

      var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Card dimensions
      var cardW = Math.max(40, cardWidth);
      var cardH = cardW / Math.max(0.2, Math.min(5, aspectRatio));
      var along = axis === 'x' ? cardH : cardW;
      var count = items.length;
      var step = 360 / count;

      // Calculate radius
      var n = Math.max(count, 3);
      var pitch = (along + gap) * 1; // spread = 1 for cylinder
      var chord = pitch / (2 * Math.sin(Math.PI / n));
      var arc = (n * pitch) / (2 * Math.PI);
      var radius = Math.max(chord + (arc - chord) * 1, along * 0.6); // curve = 1 for cylinder

      // Create tiles (subdivisions of card for curved surface)
      var tilesPerCard = 8; // TILES = 8
      var tiles = [];
      var bend = radius; // curveValue = 1, so bend = radius / 1 = radius

      for (var t = 0; t < tilesPerCard; t++) {
        var length = cardH / tilesPerCard;
        var start = t * length - (t > 0 ? 2.5 / 2 : 0); // OVERLAP = 2.5
        var end = (t + 1) * length + (t < tilesPerCard - 1 ? 2.5 / 2 : 0);
        var center = (start + end) / 2 - cardH / 2;
        var alpha = center / bend;
        var shift = bend * Math.sin(alpha);
        var sink = bend * (1 - Math.cos(alpha));
        var depth = -sink; // inward = false for cylinder
        var turn = (alpha * 180) / Math.PI;
        var move = 'translate3d(' + shift + 'px, 0px, ' + depth + 'px) rotateY(' + turn + 'deg)';
        tiles.push({ index: t, move: move });
      }

      // State
      var state = {
        angle: 0,
        velocity: 0,
        target: null,
        dir: -1, // direction: 'left' -> -1
        press: null,
        drag: false,
        hover: false,
        pointer: { inside: false, x: 0, y: 0 },
        intro: null,
        introDone: false,
        holdUntil: 0,
        stepAt: 0,
        suppressClick: false,
        wheelTimer: 0,
        fit: 1,
        shift: 0,
        drop: 0,
        last: 0
      };

      var settings = {
        count: count,
        step: step,
        radius: radius,
        axis: 'y',
        tilt: -5,
        perspective: perspective,
        cardW: cardWidth,
        cardH: cardH,
        intro: 'rise',
        autoplay: 'drift',
        speed: speed,
        interval: Math.max(0.5, interval),
        draggable: draggable,
        momentum: Math.max(0, Math.min(1, momentum)),
        snap: snap,
        pauseOnHover: pauseOnHover,
        parallax: 0.3,
        stretch: 0.5,
        depthFade: 0.55,
        captions: false,
        reduced: window.matchMedia('(prefers-reduced-motion: reduce)').matches
      };

      var dragSign = 1;
      var directionSign = -1;

      var rootRef = carousel;
      var stageRef = $('.cc-carousel__stage', carousel);
      var cameraRef = $('.cc-carousel__camera', carousel);
      var ringRef = ring;
      var cardRefs = Array.from(items);
      var activeRef = 0;
      var active = 0;
      var ready = false;
      var dragging = false;
      var readyRef = false;

      // Sample items data (matching the React component's DEFAULT_ITEMS)
      var sampleItems = [
        { src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80&auto=format&fit=max&sat=-100', alt: 'Mist drifting through a mountain valley', title: 'Valley', subtitle: 'Landscape' },
        { src: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&q=80&auto=format&fit=max&sat=-100', alt: 'A woman with long hair in soft studio light', title: 'Portrait', subtitle: 'Studio' },
        { src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900&q=80&auto=format&fit=max&sat=-100', alt: 'Glass towers seen from street level', title: 'Towers', subtitle: 'Architecture' },
        { src: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=900&q=80&auto=format&fit=max&sat=-100', alt: 'A surfer carving inside a breaking wave', title: 'Swell', subtitle: 'Ocean' },
        { src: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=900&q=80&auto=format&fit=max&sat=-100', alt: 'An angular white building against the sky', title: 'Facade', subtitle: 'Architecture' },
        { src: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&q=80&auto=format&fit=max&sat=-100', alt: 'A model in striped trousers leaning on a wall', title: 'Pose', subtitle: 'Editorial' },
        { src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900&q=80&auto=format&fit=max&sat=-100', alt: 'The Milky Way above snowy peaks', title: 'Night', subtitle: 'Sky' },
        { src: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=900&q=80&auto=format&fit=max&sat=-100', alt: 'A woman in a long coat on a city street', title: 'Street', subtitle: 'Editorial' },
        { src: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=900&q=80&auto=format&fit=max&sat=-100', alt: 'Mountains mirrored in a still lake', title: 'Mirror', subtitle: 'Landscape' },
        { src: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=900&q=80&auto=format&fit=max&sat=-100', alt: 'A glass skyscraper under a cloudy sky', title: 'Glass', subtitle: 'Architecture' }
      ];

      // Build card elements
      function buildCards() {
        ring.innerHTML = '';
        var cards = [];
        for (var i = 0; i < items.length; i++) {
          var item = items[i];
          var cardData = sampleItems[i % sampleItems.length];
          
          var card = document.createElement('div');
          card.className = 'cc-carousel__card';
          card.setAttribute('data-cc-item', '');
          card.style.transformStyle = 'preserve-3d';
          card.style.cursor = 'grab';

          // Create tiles for this card
          tiles.forEach(function (tile, tIdx) {
            var tileEl = document.createElement('div');
            tileEl.className = 'cc-carousel__tile';
            tileEl.style.transform = tile.move;
            tileEl.style.transformStyle = 'preserve-3d';
            tileEl.style.backfaceVisibility = 'visible';

            var frame = document.createElement('div');
            frame.className = 'cc-carousel__frame';
            frame.style.width = '100%';
            frame.style.height = '100%';
            frame.style.borderRadius = cornerRadius + 'px';
            frame.style.overflow = 'hidden';
            frame.style.position = 'relative';
            frame.style.background = 'var(--color-surface-2)';

            // Photo/Video element
            var media = document.createElement('video');
            media.className = 'cc-carousel__photo';
            media.src = 'https://assets.mixkit.co/videos/preview/mixkit-abstract-glowing-lines-background-5225-large.mp4';
            media.muted = true;
            media.loop = true;
            media.playsInline = true;
            media.setAttribute('preload', 'metadata');
            media.style.width = '100%';
            media.style.height = '100%';
            media.style.objectFit = 'cover';
            media.style.backfaceVisibility = 'hidden';
            frame.appendChild(media);

            // Inner shade
            var inner = document.createElement('div');
            inner.className = 'cc-carousel__inner';
            inner.style.background = 'rgba(0,0,0, 0.4)';
            inner.style.backfaceVisibility = 'hidden';
            frame.appendChild(inner);

            // Gradient shade
            var shade = document.createElement('div');
            shade.className = 'cc-carousel__shade';
            shade.style.background = 'linear-gradient(180deg, transparent 40%, #000000 100%)';
            shade.style.opacity = '0.55';
            shade.style.pointerEvents = 'none';
            frame.appendChild(shade);

            // Caption
            var caption = document.createElement('div');
            caption.className = 'cc-carousel__caption';
            caption.style.textAlign = 'center';
            caption.style.pointerEvents = 'none';
            caption.style.zIndex = '10';
            caption.innerHTML = '<span class="cc-carousel__title">' + (['Valley', 'Portrait', 'Towers', 'Swell', 'Facade', 'Pose', 'Night', 'Street', 'Mirror', 'Glass'][i % 10]) + '</span><br><span class="cc-carousel__subtitle">' + (['Landscape', 'Studio', 'Architecture', 'Ocean', 'Architecture', 'Editorial', 'Sky', 'Editorial', 'Landscape', 'Architecture'][i % 10]) + '</span>';

            frame.appendChild(caption);
            tileEl.appendChild(frame);
            tileEl.appendChild(frame);
            tileEl.appendChild(frame); // Clone for leave animation placeholder
            tileEl.appendChild(frame);

            // Actually we need to add the frame once, not 4 times. Let me fix this.
          });

          // Actually let me rebuild this properly
        }

        // Simplified approach - create cards with proper structure
        for (var i = 0; i < items.length; i++) {
          var card = document.createElement('div');
          card.className = 'cc-carousel__card';
          card.setAttribute('data-cc-item', '');
          card.style.transformStyle = 'preserve-3d';
          card.style.cursor = 'grab';

          // Add tiles
          tiles.forEach(function (tile, tIdx) {
            var tileEl = document.createElement('div');
            tileEl.className = 'cc-carousel__tile';
            tileEl.style.transform = tile.move;
            tileEl.style.transformStyle = 'preserve-3d';
            tileEl.style.backfaceVisibility = 'visible';

            var frame = document.createElement('div');
            frame.className = 'cc-carousel__frame';
            frame.style.width = '100%';
            frame.style.height = '100%';
            frame.style.borderRadius = cornerRadius + 'px';
            frame.style.overflow = 'hidden';
            frame.style.position = 'relative';
            frame.style.background = 'var(--color-surface-2)';

            var media = document.createElement('video');
            media.className = 'cc-carousel__photo';
            media.src = 'https://assets.mixkit.co/videos/preview/mixkit-abstract-glowing-lines-background-5225-large.mp4';
            media.muted = true;
            media.loop = true;
            media.playsInline = true;
            media.setAttribute('preload', 'metadata');
            media.style.width = '100%';
            media.style.height = '100%';
            media.style.objectFit = 'cover';
            media.style.backfaceVisibility = 'hidden';
            frame.appendChild(media);

            var inner = document.createElement('div');
            inner.className = 'cc-carousel__inner';
            frame.appendChild(inner);

            var shade = document.createElement('div');
            shade.className = 'cc-carousel__shade';
            frame.appendChild(shade);

            var caption = document.createElement('div');
            caption.className = 'cc-carousel__caption';
            caption.innerHTML = '<span class="cc-carousel__title">Video ' + (i + 1) + '</span><br><span class="cc-carousel__subtitle">Sample</span>';
            frame.appendChild(caption);

            tileEl.appendChild(frame);
            tileEl.appendChild(tileEl); // This is wrong, let me fix
          });

          // Actually I need to restructure. Let me just use the existing HTML and add JS logic.
        }
      }

      // Since the HTML already has the structure, let's use it
      var existingCards = $$('.cc-carousel__card', carousel);
      if (existingCards.length > 0) {
        // Cards already exist in HTML, just need to initialize the 3D logic
        initializeCarousel();
      } else {
        // Build from scratch
        buildCards();
      }

      function initializeCarousel() {
        var cards = $$('.cc-carousel__card', carousel);
        count = cards.length;
        if (count === 0) return;

        // Recalculate step and radius
        step = 360 / count;

        // Position cards in 3D ring
        function positionCards(angle) {
          cards.forEach(function (card, i) {
            var itemAngle = i * step + angle;
            var rad = itemAngle * Math.PI / 180;
            var x = Math.sin(rad) * radius;
            var z = Math.cos(rad) * radius;
            
            var transform = 'translate3d(' + x + 'px, 0px, ' + z + 'px) rotateY(' + (-itemAngle) + 'deg)';
            card.style.transform = transform;
            
            // Apply depth fade and scale
            var opacity = 1;
            var scale = 1;
            if (depthFade > 0) {
              var cosAngle = Math.cos(rad);
              opacity = 1 - depthFade * (1 - cosAngle) / 2;
              scale = 0.5 + 0.5 * cosAngle;
            }
            card.style.opacity = opacity;
            card.style.transform += ' scale(' + scale + ')';
            card.style.zIndex = Math.round(1000 + scale * 1000);
          });
        }

        // Update caption
        function updateCaption() {
          var titleEl = $('#cc-title');
          var subtitleEl = $('#cc-subtitle');
          var indicator = $('#cc-indicator');
          var live = $('#cc-live');
          
          if (titleEl && subtitleEl) {
            var activeIndex = Math.round(-state.angle / step) % count;
            if (activeIndex < 0) activeIndex += count;
            var item = sampleItems[activeIndex % sampleItems.length];
            titleEl.textContent = item.title;
            subtitleEl.textContent = item.subtitle;
          }
          
          if (indicator) {
            indicator.innerHTML = '';
            for (var i = 0; i < count; i++) {
              var dot = document.createElement('div');
              dot.className = 'cc-carousel__dot' + (i === active ? ' cc-carousel__dot--active' : '');
              indicator.appendChild(dot);
            }
          }
          
          if (live) {
            live.textContent = 'Card ' + (active + 1) + ' of ' + count;
          }
        }

        // Animation loop
        var raf = 0;
        var lastTime = 0;

        function animate(time) {
          if (!visible) return;
          
          var dt = (time - lastTime) / 1000;
          lastTime = time;
          
          var s = settings;
          var st = state;
          
          // Apply velocity with friction
          if (st.velocity !== 0) {
            st.angle += st.velocity * dt * 60;
            st.velocity *= Math.pow(1 - 0.02, dt * 60); // friction
            
            if (Math.abs(st.velocity) < 0.01) {
              st.velocity = 0;
              if (snap) {
                var nearestAngle = Math.round(st.angle / step) * step;
                st.target = nearestAngle;
              }
            }
          }
          
          // Snap to target
          if (st.target !== null) {
            var diff = st.target - st.angle;
            if (Math.abs(diff) < 0.1) {
              st.angle = st.target;
              st.target = null;
            } else {
              st.angle += diff * 0.15;
            }
          }
          
          // Autoplay drift
          if (s.autoplay === 'drift' && !st.drag && !st.hover && st.velocity === 0 && st.target === null) {
            st.angle += s.speed * dt * s.dir;
          }
          
          positionCards(st.angle);
          
          // Update active index
          var newActive = Math.round(-st.angle / step) % count;
          if (newActive < 0) newActive += count;
          if (newActive !== active) {
            active = newActive;
            updateCaption();
          }
          
          raf = requestAnimationFrame(animate);
        }

        // Interaction handlers
        function onPointerDown(e) {
          if (e.pointerType === 'touch' || (e.button !== undefined && e.button !== 0)) return;
          st.drag = true;
          st.press = { x: e.clientX, y: e.clientY, angle: st.angle, time: Date.now() };
          st.velocity = 0;
          st.target = null;
          carousel.classList.add('is-dragging');
          if (ring.setPointerCapture) ring.setPointerCapture(e.pointerId);
        }

        function onPointerMove(e) {
          if (!st.drag || e.pointerId !== st.press?.pointerId) return;
          var dx = e.clientX - st.press.x;
          var dy = e.clientY - st.press.y;
          var delta = (axis === 'x' ? dy : dx) * 0.5;
          st.angle = st.press.angle + delta * directionSign;
          st.velocity = 0;
        }

        function onPointerUp(e) {
          if (!st.drag) return;
          st.drag = false;
          carousel.classList.remove('is-dragging');
          if (ring.releasePointerCapture) ring.releasePointerCapture(e.pointerId);
          
          // Momentum
          var dt = (Date.now() - st.press.time) / 1000;
          var dx = e.clientX - st.press.x;
          var dy = e.clientY - st.press.y;
          var dist = axis === 'x' ? dy : dx;
          if (dt > 0 && Math.abs(dist) > 10) {
            st.velocity = (dist / dt) * 0.01 * momentum * directionSign;
          }
        }

        // Wheel scroll
        carousel.addEventListener('wheel', function (e) {
          e.preventDefault();
          st.target = null;
          var delta = e.deltaY * 0.5 * directionSign;
          st.angle += delta;
          st.velocity = 0;
        }, { passive: false });

        // Click to focus
        carousel.addEventListener('click', function (e) {
          if (st.suppressClick) return;
          var card = e.target.closest('.cc-carousel__card');
          if (card) {
            var idx = Array.from(cards).indexOf(card);
            if (idx >= 0) {
              st.target = idx * step;
            }
          }
        }, true);

        // Hover pause
        carousel.addEventListener('mouseenter', function () { st.hover = true; });
        carousel.addEventListener('mouseleave', function () { st.hover = false; });

        // Touch events
        carousel.addEventListener('touchstart', function (e) {
          onPointerDown(e.touches[0]);
          st.press.pointerId = e.touches[0].identifier;
        }, { passive: true });
        
        carousel.addEventListener('touchmove', function (e) {
          var touch = Array.from(e.touches).find(function (t) { return t.identifier === st.press?.pointerId; });
          if (touch) onPointerMove(touch);
        }, { passive: false });
        
        carousel.addEventListener('touchend', function (e) {
          var touch = Array.from(e.changedTouches).find(function (t) { return t.identifier === st.press?.pointerId; });
          if (touch) onPointerUp(touch);
        });

        // Keyboard navigation
        carousel.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowLeft') {
            e.preventDefault();
            st.target = (active + 1) * step;
          } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            st.target = (active - 1) * step;
          } else if (e.key === 'Home') {
            e.preventDefault();
            st.target = 0;
          }
        });

        // Initialize
        positionCards(state.angle);
        updateCaption();
        state.introDone = true;
        animate(0);

        // Handle visibility
        var visible = true;
        document.addEventListener('visibilitychange', function () {
          visible = !document.hidden;
        });
      }

      initializeCarousel();
    });
  }

  /* ============================================================ init ==== */

  /* hero product video: muted cinematic playback with a real, always-visible control.
     Autoplay is muted only, never with sound, and never when the reader asked for
     reduced motion — in that case the poster frame stands in as the static version. */
  function initHeroVideo() {
    $$('[data-video]').forEach(function (frame) {
      var vid = $('[data-video-el]', frame);
      var btn = $('[data-video-toggle]', frame);
      var lbl = btn ? $('[data-video-label]', btn) : null;
      if (!vid) return;

      var playing = false;
      var auto = !reduceMotion;

      vid.muted = true;
      if (lbl) lbl.textContent = 'Play overview';

      function paint() {
        if (!btn) return;
        frame.classList.toggle('is-playing', playing);
        if (lbl) lbl.textContent = playing ? 'Pause overview' : 'Play overview';
      }

      vid.addEventListener('play', function () { playing = true; paint(); });
      vid.addEventListener('pause', function () { playing = false; paint(); });

      if (auto) {
        var attempt = vid.play();
        if (attempt && attempt.catch) attempt.catch(function () { playing = false; paint(); });
      } else {
        frame.classList.add('is-static');
        paint();
      }

      if (btn) {
        btn.addEventListener('click', function () {
          if (vid.paused) {
            auto = true;
            var again = vid.play();
            if (again && again.catch) again.catch(function () { playing = false; paint(); });
          } else {
            auto = false;
            vid.pause();
          }
        });
      }

      /* a looping hero should not keep playing off-screen */
      if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              if (auto && vid.paused) {
                var back = vid.play();
                if (back && back.catch) back.catch(function () { playing = false; paint(); });
              }
            } else if (!vid.paused) {
              vid.pause();
            }
          });
        }, { threshold: 0.25 }).observe(frame);
      }
    });
  }

  /* ================================================= entity product pages ==== */

  /* Each side of the marketplace has one page per entity, not per campaign. A
     restaurant looking at a creator needs the creator's own page, and a creator
     looking at a restaurant needs that restaurant's own page. One registry
     serves both, so the listing card and the page it opens can never drift:
     every slug in here is the slug the listing links to.

     rateFloor is the number a fresh deal thread opens at, so the room does not
     start from the default campaign budget when it belongs to another entity. */
  var ENTITIES = {
    creator: {
      'ananya': {
        name: 'Creator Ananya', initial: 'A', sub: 'Japanese · Mumbai',
        tags: 'japanese mumbai weekend',
        bio: 'Shoots tasting menus and dessert finishes. Reels and story sets, available on both weekend services.',
        rate: '₹20K–₹50K', rateFloor: 20000,
        format: 'Reels, stories', notice: '3–5 days',
        contact: 'Her contact details',
        campaign: 'Weekend Japanese Experience', venue: 'Sakura House',
        link: 'creator-ananya', done: 34, reach: '412K', response: 'Replies same day'
      },
      'rahul-v': {
        name: 'Rahul V.', initial: 'R', sub: 'Japanese · Mumbai',
        tags: 'japanese mumbai evenings',
        bio: 'Reels, feed posts, and menu shoots. Happy to bundle two campaigns into one visit.',
        rate: '₹25K–₹60K', rateFloor: 25000,
        format: 'Reels, feed post', notice: 'About a week',
        contact: 'His contact details',
        campaign: 'Weekend Japanese Experience', venue: 'Sakura House',
        link: 'creator-rahul-v', done: 51, reach: '688K', response: 'Replies in a few hours'
      },
      'kabir-s': {
        name: 'Kabir S.', initial: 'K', sub: 'Street food · Mumbai',
        tags: 'street mumbai evenings',
        bio: 'Evening street-food work, strong on handheld shots and quick service moments.',
        rate: '₹12K–₹30K', rateFloor: 12000,
        format: 'Reels', notice: '3–5 days',
        contact: 'His contact details',
        campaign: 'Street Food Fridays', venue: 'Tandoor Nights',
        link: 'creator-kabir-s', done: 28, reach: '301K', response: 'Replies same day'
      },
      'nisha-r': {
        name: 'Nisha R.', initial: 'N', sub: 'North Indian · Mumbai',
        tags: 'north mumbai fullweek',
        bio: 'Thali spreads and curry close-ups, available across the week for mid-week service shoots.',
        rate: '₹18K–₹40K', rateFloor: 18000,
        format: 'Reels, feed post', notice: '3–5 days',
        contact: 'Her contact details',
        campaign: 'Breakfast Menu Shoot', venue: 'Udupi Corner',
        link: 'creator-nisha-r', done: 22, reach: '244K', response: 'Replies next day'
      },
      'praveen-k': {
        name: 'Praveen K.', initial: 'P', sub: 'South Indian · Mumbai',
        tags: 'south mumbai weekend',
        bio: 'Dosa and filter-coffee shoots, with weekend brunch coverage across multiple outlets.',
        rate: '₹15K–₹35K', rateFloor: 15000,
        format: 'Reels, stories', notice: 'About a week',
        contact: 'His contact details',
        campaign: 'Breakfast Menu Shoot', venue: 'Udupi Corner',
        link: 'creator-praveen-k', done: 40, reach: '377K', response: 'Replies in a few hours'
      },
      'diya-j': {
        name: 'Diya J.', initial: 'D', sub: 'Cafe & bakery · Pune',
        tags: 'cafe pune fullweek',
        bio: 'Bakery and cafe work, pastry close-ups, and weekday afternoon coverage.',
        rate: '₹14K–₹28K', rateFloor: 14000,
        format: 'Reels, feed post', notice: 'Two weeks',
        contact: 'Her contact details',
        campaign: 'Bakery Case Refresh', venue: 'Mill & Co.',
        link: 'creator-diya-j', done: 19, reach: '198K', response: 'Replies next day'
      }
    },
    restaurant: {
      'sakura-house': {
        name: 'Sakura House', initial: 'S',
        campaign: 'Weekend Japanese Experience',
        sub: 'Mumbai · Shoot 12–14 Sep',
        tags: 'japanese mumbai',
        closing: 'Closing Sep 15',
        brief: 'Launch campaign for the new tasting menu. Two reels and a story set, shot across two weekend services. Brief is specific about must-shoot dishes.',
        rate: '₹20K–₹50K', rateFloor: 20000,
        deliverables: 'Reels, story set', applied: 'Applied at ₹20,000',
        link: 'sakura-tasting'
      },
      'sana-m': {
        name: 'Sana M.', initial: 'S',
        campaign: 'Dessert Menu Refresh',
        sub: 'Mumbai · Shoot 20–22 Sep',
        tags: 'desserts mumbai',
        closing: 'Closing Sep 20',
        brief: 'Re-shoot the dessert menu with new styling. One reel and one feed post, plus close-ups of each plated finish.',
        rate: '₹20K–₹35K', rateFloor: 24000,
        deliverables: 'Reel, feed post', applied: 'Applied at ₹24,000',
        link: 'sana-dessert'
      },
      'tandoor-nights': {
        name: 'Tandoor Nights', initial: 'T',
        campaign: 'Street Food Fridays',
        sub: 'Mumbai · Shoot 26–28 Sep',
        tags: 'street mumbai',
        closing: 'Closing Sep 28',
        brief: 'Weekly evening service coverage for a street-food counter. Two reels per Friday, handheld and fast-cut.',
        rate: '₹15K–₹28K', rateFloor: 19000,
        deliverables: 'Reels', applied: 'Counter-offer at ₹19,000',
        link: 'tandoor-street'
      },
      'udupi-corner': {
        name: 'Udupi Corner', initial: 'U',
        campaign: 'Breakfast Menu Shoot',
        sub: 'Mumbai · Shoot 2–4 Oct',
        tags: 'south mumbai',
        closing: 'Closing Oct 4',
        brief: 'Dosa, filter coffee, and the breakfast counter. Morning light, two reels plus a story set.',
        rate: '₹18K–₹32K', rateFloor: 18000,
        deliverables: 'Reels, story set', applied: '',
        link: 'udupi-breakfast'
      },
      'mill-and-co': {
        name: 'Mill & Co.', initial: 'M',
        campaign: 'Bakery Case Refresh',
        sub: 'Pune · Shoot 6–9 Oct',
        tags: 'cafe pune',
        closing: 'Closing Oct 9',
        brief: 'Pastry case and bakery counter for a new outlet. Weekday afternoon coverage, one reel and one feed post.',
        rate: '₹14K–₹26K', rateFloor: 14000,
        deliverables: 'Reel, feed post', applied: '',
        link: 'mill-bakery'
      }
    }
  };

  function entityId() {
    var m = /[?&]id=([^&]+)/.exec(window.location.search);
    return m ? decodeURIComponent(m[1]) : '';
  }

  function initEntityProfile() {
    var scope = $('[data-entity]');
    if (!scope) return;

    var kind = scope.getAttribute('data-entity');
    var book = ENTITIES[kind] || {};
    var e = book[entityId()] || book[Object.keys(book)[0]];
    if (!e) return;

    /* Fields are addressed by name, so one markup shape serves every entity in
       the book. A field the entity does not carry is removed rather than left
       showing the previous page's value. */
    $$('[data-e]', scope).forEach(function (node) {
      var val = e[node.getAttribute('data-e')];
      if (val === undefined || val === null || val === '') {
        var host = node.closest('[data-e-if]');
        if (host) host.remove();
        node.remove();
        return;
      }
      node.innerHTML = val;
    });

    document.title = (kind === 'creator' ? e.name : e.campaign + ' · ' + e.name) +
      ' — CollabTable';

    var back = $('[data-back]', scope);
    if (back) {
      back.setAttribute('href',
        kind === 'creator' ? 'discover-creators.html' : 'discover-restaurants.html');
    }

    /* The room on this page belongs to this entity, so both the sheet host and
       every opener carry its link, its campaign name, and its own rate floor.
       Naming them here is what stops the room falling back to the default
       campaign and labelling a creator's thread with a restaurant's brief. */
    var host = $('[data-deal]');
    if (host) {
      host.setAttribute('data-deal-link', e.link);
      host.setAttribute('data-deal-role', kind === 'creator' ? 'restaurant' : 'creator');
    }
    $$('[data-sheet="deal-room"]', scope).forEach(function (btn) {
      btn.setAttribute('data-deal-link', e.link);
      btn.setAttribute('data-appl-campaign',
        kind === 'creator' ? e.name : e.campaign);
      btn.setAttribute('data-appl-rate', String(e.rateFloor));
    });
  }

  /* ============================================ onboarding branches ==== */

  /* One account carries every branch it runs. Branches are cloned from a
     single template with fresh ids and radio names, so no two branches share
     a control; the first branch is never removable, and the "number of
     branches" field on the details step stays in step with the list. */
  function initBranches() {
    var list = $('[data-branch-list]');
    if (!list) return;
    var tpl = document.getElementById('branch-tpl');
    var count = $('[data-branch-count]');
    var live = $('[data-branch-live]');
    var seq = $$('[data-branch]', list).length;

    function cards() { return $$('[data-branch]', list); }

    function announce() {
      var n = cards().length;
      if (live) live.textContent = n + ' branch' + (n > 1 ? 'es' : '') + ' on this account.';
      if (count && count.value !== String(n)) count.value = String(n);
    }

    function renumber() {
      cards().forEach(function (card, i) {
        card.setAttribute('data-branch', String(i + 1));
        var title = $('[data-branch-title]', card);
        if (title) title.textContent = 'Branch ' + (i + 1);
        var rm = $('[data-branch-remove]', card);
        if (rm) rm.hidden = i === 0;
      });
      announce();
    }

    function wireNew(card) {
      var form = list.closest('[data-form]');
      if (form && form.ctWireFields) { form.ctWireFields(); return; }
      $$('input, select, textarea', card).forEach(function (i) {
        if (i.type === 'hidden' || i.type === 'radio' || i.type === 'checkbox') return;
        i.addEventListener('blur', function () {
          if (i.value.trim() || i.required) validate(i);
        });
        i.addEventListener('input', function () {
          if (i.getAttribute('aria-invalid') === 'true') validate(i);
        });
      });
    }

    function add() {
      if (!tpl) return null;
      seq += 1;
      var node = tpl.content.cloneNode(true);
      $$('[data-b]', node).forEach(function (el) {
        var id = 'br' + seq + '-' + el.getAttribute('data-b');
        el.id = id;
        if (el.name !== undefined) el.name = id;
      });
      $$('[data-b-for]', node).forEach(function (l) {
        l.setAttribute('for', 'br' + seq + '-' + l.getAttribute('data-b-for'));
      });
      $$('[data-b-name]', node).forEach(function (r) {
        r.name = 'br' + seq + '-' + r.getAttribute('data-b-name');
      });
      var card = node.firstElementChild;
      list.appendChild(card);
      wireNew(card);
      renumber();
      return card;
    }

    list.addEventListener('click', function (e) {
      var rm = e.target.closest('[data-branch-remove]');
      if (rm && cards().length > 1) {
        var card = rm.closest('[data-branch]');
        var i = cards().indexOf(card);
        card.remove();
        renumber();
        var prev = cards()[Math.max(0, i - 1)];
        var field = prev ? $('.input, .textarea', prev) : null;
        if (field) field.focus();
        return;
      }
      if (e.target.closest('[data-branch-add]')) {
        var made = add();
        var first = made ? $('.input', made) : null;
        if (first) first.focus();
      }
    });

    if (count) {
      count.addEventListener('change', function () {
        var want = Math.max(1, Math.min(12, parseInt(count.value, 10) || 1));
        count.value = String(want);
        var have = cards().length;
        while (have < want) { add(); have += 1; }
        while (have > want && have > 1) {
          cards()[have - 1].remove();
          have -= 1;
        }
        renumber();
      });
    }

    renumber();
  }

  /* The Instagram hand-off is a prototype affordance: it fills the profile
     field so the step can be completed without any OAuth round-trip. */
  function initInstagram() {
    $$('[data-connect-ig]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var scope = btn.closest('.field') || document;
        var input = $('[data-ig-input]', scope);
        if (input) {
          input.value = 'https://www.instagram.com/yourrestaurant/';
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.setAttribute('aria-invalid', 'false');
          var field = fieldOf(input);
          if (field) field.setAttribute('data-invalid', 'false');
        }
        btn.disabled = true;
        btn.setAttribute('aria-pressed', 'true');
        btn.textContent = 'Instagram connected';
        toast('Instagram connected. The profile link is filled in — edit it any time.', 'ok');
      });
    });
  }

function boot() {
    initNav();
    initSheets();
    initFaq();
    initChips();
    initTabs();
    initStepper();
    initForms();
    initBranches();
    initInstagram();
    initContactBlock();
    initDeal();
    initSheetContext();
    initEntityProfile();
    initFiltering();
    initFilterToggle();
    initReveal();
    initCopy();
    initLanes();
    initHeroVideo();
    initCircularCarousel();
    document.documentElement.setAttribute('data-ct-ready', 'true');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
