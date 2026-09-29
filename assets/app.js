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
          if (current < panes.length - 1) { current += 1; paint(); }
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
      var inputs = $$('input, select, textarea', form).filter(function (i) {
        return i.type !== 'hidden' && i.type !== 'radio' && i.type !== 'checkbox';
      });

      /* Validate on blur, not on every keystroke. */
      inputs.forEach(function (input) {
        input.addEventListener('blur', function () {
          if (input.value.trim() || input.required) validate(input);
        });
        input.addEventListener('input', function () {
          if (input.getAttribute('aria-invalid') === 'true') validate(input);
        });
      });

      $$('input[type="radio"], input[type="checkbox"]', form).forEach(function (input) {
        input.addEventListener('change', function () {
          var field = fieldOf(input);
          if (field) field.setAttribute('data-invalid', 'false');
        });
      });

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        var bad = inputs.filter(function (i) { return !validate(i); });
        var sum = $('[data-form-summary]', form);
        if (sum) {
          if (bad.length) {
            sum.classList.add('is-on');
            sum.innerHTML = bad.length + ' field' + (bad.length > 1 ? 's need' : ' needs') +
              ' attention before you can continue. ' + bad.map(function (i, n) {
                var f = fieldOf(i);
                var l = f ? $('.label', f) : null;
                return '<a href="#' + (i.id || 'f') + '">' + (n + 1) + ') ' +
                  ((l && l.textContent.trim()) || 'Field') + '</a>';
              }).join(' · ');
            if (bad[0].focus) bad[0].focus();
            return;
          }
          sum.classList.remove('is-on');
        }
        if (bad.length) { if (bad[0].focus) bad[0].focus(); return; }

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

  /* The room follows the order a deal actually happens: the two sides talk
     the fee and scope out, sign the contract, then the money moves. A stage
     only opens once the one before it is done, and both sides stay masked to
     each other until the creator has been paid. */

  var DEAL_STAGES = ['offer', 'contract', 'payment'];

  var STAGE_COPY = {
    offer: {
      label: 'Negotiate',
      title: 'Agree the scope and the fee',
      note: 'Either of you can move the number. Nothing is binding until the contract is signed.'
    },
    contract: {
      label: 'Contract',
      title: 'The deal, written down',
      note: 'Finalised at the agreed fee. Both parties sign before the payment stage opens.'
    },
    payment: {
      label: 'Payment',
      title: 'Move the money',
      note: 'The restaurant funds escrow. Contact details unlock for both of you once the creator is paid.'
    }
  };

  var DEAL_FEE_RATE = 0.1; /* platform fee, taken off the agreed fee */
  var DEAL_MIN = 20000;    /* the published campaign range */
  var DEAL_MAX = 50000;
  var DEAL_METHODS = { upi: 'UPI', net: 'Net banking', card: 'Card' };

  function rupees(n) {
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }

  function mountDeal(root) {
    var role = root.getAttribute('data-deal-role') === 'creator' ? 'creator' : 'restaurant';
    var other = role === 'creator' ? 'restaurant' : 'creator';
    var roleLabel = role === 'creator' ? 'Creator' : 'Restaurant';
    var start = DEAL_STAGES.indexOf(root.getAttribute('data-stage'));
    var stage = DEAL_STAGES[start > -1 ? start : 0];

    var deal = {
      fee: Number(root.getAttribute('data-fee')) || DEAL_MIN,
      finalised: false,
      signed: { restaurant: false, creator: false },
      method: 'upi',
      funded: false,
      paid: false
    };
    /* The other side signs in their own session, so their row is already
       settled on this screen and only the viewer's own row is outstanding. */
    deal.signed[other] = true;
    if (start >= 1) deal.finalised = true;
    if (start >= 2) { deal.signed.restaurant = true; deal.signed.creator = true; }

    function totals() {
      var platform = Math.round(deal.fee * DEAL_FEE_RATE);
      return { fee: deal.fee, platform: platform, payout: deal.fee - platform };
    }

    function bothSigned() { return deal.signed.restaurant && deal.signed.creator; }

    function unlocked(i) {
      if (i === 0) return true;
      if (i === 1) return deal.finalised;
      return bothSigned();
    }

    function paintAmount() {
      var t = totals();
      $$('[data-deal-amount]', root).forEach(function (el) { el.textContent = rupees(t.fee); });
      $$('[data-deal-fee]', root).forEach(function (el) { el.textContent = rupees(t.platform); });
      $$('[data-deal-payout]', root).forEach(function (el) { el.textContent = rupees(t.payout); });
    }

    function paintSign() {
      $$('[data-deal-sign-row]', root).forEach(function (row) {
        var who = row.getAttribute('data-deal-sign-row');
        var on = !!deal.signed[who];
        row.setAttribute('data-signed', String(on));
        var tag = $('[data-deal-sign-tag]', row);
        if (tag) {
          tag.textContent = on ? 'Signed' : (who === role ? 'Needs your signature' : 'Pending');
          tag.className = on ? 'tag tag-red' : 'tag';
        }
      });
      var btn = $('[data-deal-sign]', root);
      if (btn) btn.hidden = !!deal.signed[role];
    }

    function paintMoney() {
      var t = totals();
      var state = $('[data-deal-escrow-state]', root);
      if (state) {
        state.textContent = deal.funded ? rupees(t.fee) + ' funded' : 'Not funded';
        state.className = deal.funded ? 'tag tag-red' : 'tag';
      }
      var out = $('[data-deal-out-state]', root);
      if (out) {
        out.textContent = deal.paid ? rupees(t.payout) + ' released' : 'Held in escrow';
        out.className = deal.paid ? 'tag tag-red' : 'tag';
      }
      var fund = $('[data-deal-fund]', root);
      if (fund) fund.hidden = deal.funded;
      var release = $('[data-deal-release]', root);
      if (release) {
        release.hidden = role === 'creator' ? deal.paid : (!deal.funded || deal.paid);
      }
      var next = $('[data-deal-next]', root);
      if (next) next.disabled = !bothSigned();
      var done = $('[data-deal-done]', root);
      if (done) done.hidden = !deal.paid;
    }

    function paintPi() {
      var panel = $('[data-deal-pi]', root);
      if (!panel) return;
      panel.setAttribute('data-locked', String(!deal.paid));
      var title = $('[data-deal-pi-title]', panel);
      if (title) {
        title.textContent = deal.paid
          ? 'Contact details unlocked'
          : 'Contact details locked';
      }
      var note = $('[data-deal-pi-note]', panel);
      if (note) {
        note.textContent = deal.paid
          ? 'The money reached the creator, so the two of you can talk directly now.'
          : 'Hidden from both of you. They unlock as soon as the payment reaches the creator.';
      }
      $$('[data-pi]', panel).forEach(function (el) {
        el.textContent = deal.paid
          ? (el.getAttribute('data-real') || '')
          : (el.getAttribute('data-mask') || '');
      });
    }

    function paint() {
      var idx = DEAL_STAGES.indexOf(stage);

      $$('[data-deal-stage]', root).forEach(function (el) {
        el.hidden = DEAL_STAGES.indexOf(el.getAttribute('data-deal-stage')) !== idx;
      });

      $$('[data-deal-step]', root).forEach(function (el) {
        var i = DEAL_STAGES.indexOf(el.getAttribute('data-deal-step'));
        el.setAttribute('data-state', i < idx ? 'done'
          : (i === idx ? 'current' : (unlocked(i) ? 'todo' : 'locked')));
        if (i === idx) el.setAttribute('aria-current', 'step');
        else el.removeAttribute('aria-current');
      });

      $$('[data-deal-title]', root).forEach(function (el) {
        el.textContent = STAGE_COPY[stage].title;
      });

      var accept = $('[data-deal-accept]', root);
      if (accept) accept.hidden = deal.finalised;
      var toContract = $('[data-deal-contract]', root);
      if (toContract) toContract.hidden = !deal.finalised;
      var status = $('[data-deal-status]', root);
      if (status) {
        status.textContent = deal.paid ? 'Paid'
          : (bothSigned() ? 'Awaiting payment'
            : (deal.finalised ? 'Contract signed' : 'Negotiating'));
      }

      var live = $('[data-deal-live]', root);
      if (live) {
        live.textContent = 'Stage ' + (idx + 1) + ' of ' + DEAL_STAGES.length + ': ' +
          STAGE_COPY[stage].label + '. ' + STAGE_COPY[stage].note;
      }

      paintAmount();
      paintSign();
      paintMoney();
      paintPi();

      root.setAttribute('data-current', stage);
      root.setAttribute('data-paid', String(deal.paid));
    }

    function go(name) {
      var i = DEAL_STAGES.indexOf(name);
      if (i < 0 || !unlocked(i)) return;
      stage = name;
      paint();
      root.scrollTop = 0;
    }

    /* Offers you send land in the same thread as the one you received, so
       both sides always see the whole negotiation in one place. */
    function appendOffer(amount, note) {
      var thread = $('[data-deal-thread]', root);
      if (!thread) return;
      var li = document.createElement('li');
      li.className = 'offer';
      li.setAttribute('data-side', 'mine');
      var head = document.createElement('div');
      head.className = 'offer-hd';
      var whoEl = document.createElement('span');
      whoEl.className = 'offer-who';
      whoEl.textContent = 'You · ' + roleLabel;
      var whenEl = document.createElement('span');
      whenEl.className = 'offer-when';
      whenEl.textContent = 'Just now';
      head.appendChild(whoEl);
      head.appendChild(whenEl);
      var amtEl = document.createElement('p');
      amtEl.className = 'offer-amt';
      amtEl.textContent = rupees(amount);
      li.appendChild(head);
      li.appendChild(amtEl);
      if (note) {
        var noteEl = document.createElement('p');
        noteEl.className = 'offer-note';
        noteEl.textContent = note;
        li.appendChild(noteEl);
      }
      thread.appendChild(li);
    }

    var counter = $('[data-deal-counter]', root);
    if (counter) {
      var amount = $('[name="dr-amount"]', counter);
      if (amount) {
        amount.min = String(DEAL_MIN);
        amount.max = String(DEAL_MAX);
        amount.value = String(deal.fee);
      }
      /* The shared form handler clears the form on success, so read the values
         as they are submitted rather than when the success event arrives. */
      counter.addEventListener('submit', function () {
        counter.ctAmount = Number($('[name="dr-amount"]', counter).value);
        counter.ctNote = ($('[name="dr-note"]', counter).value || '').trim();
      });
      counter.addEventListener('ct:submitted', function () {
        deal.fee = counter.ctAmount || DEAL_MIN;
        appendOffer(deal.fee, counter.ctNote);
        paint();
      });
    }

    $$('[data-deal-method]', root).forEach(function (input) {
      input.checked = input.value === deal.method;
      var row = input.closest('.pay');
      if (row) row.setAttribute('data-on', String(input.checked));
    });

    root.addEventListener('change', function (e) {
      var input = e.target.closest('[data-deal-method]');
      if (!input) return;
      deal.method = input.value;
      $$('[data-deal-method]', root).forEach(function (el) {
        var row = el.closest('.pay');
        if (row) row.setAttribute('data-on', String(el.checked));
      });
      var picked = $('[data-deal-method-state]', root);
      if (picked) picked.textContent = DEAL_METHODS[deal.method] || DEAL_METHODS.upi;
    });

    root.addEventListener('click', function (e) {
      if (e.target.closest('[data-deal-accept]')) {
        e.preventDefault();
        var first = !deal.finalised;
        deal.finalised = true;
        paint();
        go('contract');
        if (first) {
          toast('Deal finalised at ' + rupees(deal.fee) + '. Both of you sign the contract next.', 'ok');
        }
        return;
      }
      if (e.target.closest('[data-deal-contract]')) {
        e.preventDefault();
        go('contract');
        return;
      }
      if (e.target.closest('[data-deal-sign]')) {
        e.preventDefault();
        deal.signed[role] = true;
        paint();
        toast('Contract signed. Payment is open for both of you.', 'ok');
        return;
      }
      if (e.target.closest('[data-deal-next]')) {
        e.preventDefault();
        go('payment');
        return;
      }
      if (e.target.closest('[data-deal-fund]')) {
        e.preventDefault();
        deal.funded = true;
        paint();
        toast('Escrow funded. The fee is held until you release it.', 'ok');
        return;
      }
      if (e.target.closest('[data-deal-release]')) {
        e.preventDefault();
        deal.funded = true;
        deal.paid = true;
        paint();
        toast('Payment released. Contact details just unlocked for both of you.', 'ok');
        return;
      }
      if (e.target.closest('[data-deal-back]')) {
        e.preventDefault();
        var i = DEAL_STAGES.indexOf(stage);
        if (i > 0) { stage = DEAL_STAGES[i - 1]; paint(); }
      }
    });

    paint();
  }

  /* The deal room ships as a pop-up on every surface, and a page can hold more
     than one instance, so mount them all. */
  function initDeal() {
    $$('[data-deal]').forEach(mountDeal);
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

  /* ============================================================== init ==== */

  function boot() {
    initNav();
    initSheets();
    initFaq();
    initChips();
    initTabs();
    initStepper();
    initForms();
    initContactBlock();
    initDeal();
    initFiltering();
    initReveal();
    initCopy();
    document.documentElement.setAttribute('data-ct-ready', 'true');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
