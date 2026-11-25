// Scroll story: the app comes to life as the page scrolls, like the promo video but driven by the reader.
// Everything on screen is a pure function of the scroll position, so scrolling back plays it in reverse.
(function () {
  var section = document.querySelector('.story');
  if (!section || typeof SCREEN === 'undefined' || !('attachShadow' in Element.prototype)) return;

  var EN = document.documentElement.lang === 'en';
  var T = EN ? {
    addN: function (n) { return n ? 'Add ' + n + ' windows' : 'Add windows'; }, added: '✓ 12 windows added', copied: '✓ Copied',
    placeholder: 'Nickname or name', query: 'ol', booked: ['Olena', '@olena.k · Gel polish'],
    dm: 'Free windows in October:\n9.10 Fri 13:00, 17:00\n10.10 Sat 10:00, 14:00\n13.10 Tue 10:00, 13:00, 16:00\n15.10 Thu 10:00, 16:00',
    reply: 'Can I get Tue at 13:00?', ask: 'Any free slots this week?',
    notes: ['Notes', 'Olya 14:00 ??', 'Kate Fri or Sat?', 'Iryna 16:00'], sticky: ["DON'T FORGET", 'Sonia ?'],
    shot: ['free on Thu?', 'ok, Thu it is', 'Screenshot'], direct: 'Direct · 3 new',
    chips: ['15.12 · 10:00', '15.12 · 13:00', '17.12 · 16:00', '29.12 · 10:00', '31.12 · 13:00']
  } : {
    addN: function (n) { return n ? 'Додати ' + n + ' ' + (n % 10 >= 2 && n % 10 <= 4 && (n < 10 || n > 20) ? 'вікна' : 'вікон') : 'Додати вікна'; },
    added: '✓ Додано 12 вікон', copied: '✓ Скопійовано',
    placeholder: "Нік або ім'я", query: 'ol', booked: ['Олена', '@olena.k · Гель-лак'],
    dm: 'Вільні вікна на жовтень:\n9.10 пт 13:00, 17:00\n10.10 сб 10:00, 14:00\n13.10 вт 10:00, 13:00, 16:00\n15.10 чт 10:00, 16:00',
    reply: 'Хочу на 13:00 у вівторок!', ask: 'Коли є вільне віконце?',
    notes: ['Нотатки', 'Оля 14:00 ??', 'Катя пт чи сб?', 'Ірина 16:00'], sticky: ['НЕ ЗАБУТИ', 'Соня ?'],
    shot: ['а в чт є час?', 'ок, давай в чт', 'Знімок екрана'], direct: 'Direct · 3 нових',
    chips: ['15.12 · 10:00', '15.12 · 13:00', '17.12 · 16:00', '29.12 · 10:00', '31.12 · 13:00']
  };

  // ---------- helpers ----------
  var cl = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
  var R = function (u, a, d) { return cl((u - a) / d); };
  var L = function (a, b, p) { return a + (b - a) * p; };
  var E = {
    oc: function (t) { return 1 - Math.pow(1 - t, 3); },
    oq: function (t) { return 1 - Math.pow(1 - t, 5); },
    ob: function (t) { var c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    io: function (t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  };
  function el(tag, cls, html, parent) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; if (parent) parent.appendChild(e); return e; }
  function put(e, x, y, extra, op) { e.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) ' + (extra || ''); if (op != null) { e.style.opacity = op.toFixed(3); e.style.visibility = op <= 0.001 ? 'hidden' : 'visible'; } }

  // ---------- build the stage ----------
  var visual = section.querySelector('.story-visual');
  var steps = Array.prototype.slice.call(section.querySelectorAll('.story-step'));
  var dotsBox = section.querySelector('.story-dots');
  var dots = steps.map(function () { return el('i', null, null, dotsBox); });
  var plane = el('div', 'st-plane', null, visual);
  var glowA = el('div', 'st-glow', null, plane), glowB = el('div', 'st-glow', null, plane);

  var phone = el('div', 'st-phone', '<i class="key l" style="top:172px;height:32px"></i><i class="key l" style="top:232px;height:60px"></i><i class="key l" style="top:304px;height:60px"></i><i class="key r" style="top:258px;height:96px"></i><div class="alu"></div><div class="face"></div><div class="scr"></div><div class="shine"></div><div class="isl"></div>', plane);
  var host = phone.querySelector('.scr');
  var shadow = host.attachShadow({ mode: 'open' });
  var base = (document.currentScript && document.currentScript.src) || '';
  base = base.replace(/story\.js.*$/, '');
  var SBAR = '<div class="sbar"><span class="tm">9:41</span><span class="ic"><svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="#fff"/><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="#fff"/><rect x="10" y="3" width="3" height="9" rx="1" fill="#fff"/><rect x="15" y="0" width="3" height="12" rx="1" fill="#fff"/></svg><svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.5l2.3-2.6a3.3 3.3 0 0 0-4.6 0z" fill="#fff"/><path d="M3.5 6.9a6.4 6.4 0 0 1 9 0l-1.4 1.5a4.4 4.4 0 0 0-6.2 0z" fill="#fff"/><path d="M1.3 4.5a9.6 9.6 0 0 1 13.4 0l-1.4 1.5a7.6 7.6 0 0 0-10.6 0z" fill="#fff"/></svg><svg width="27" height="13" viewBox="0 0 27 13"><rect x="0.5" y="0.5" width="23" height="12" rx="3.8" fill="none" stroke="rgba(255,255,255,.45)"/><rect x="2" y="2" width="17" height="9" rx="2.4" fill="#fff"/><path d="M25 4.5v4a2 2 0 0 0 0-4z" fill="rgba(255,255,255,.5)"/></svg></span></div>';
  shadow.innerHTML = '<link rel="stylesheet" href="' + base + 'app.css">' +
    '<style>:host{all:initial;display:block;width:390px;height:844px}' +
    '.v2{line-height:normal}.ly{position:absolute;inset:0}.full{background:#0B080B}' +
    '.sbar{position:absolute;left:0;right:0;top:0;height:52px;z-index:15;color:#fff;font:600 17px -apple-system,"SF Pro Text","Inter",system-ui,sans-serif;letter-spacing:-.2px}' +
    '.sbar .tm{position:absolute;left:0;width:153px;top:19px;text-align:center}.sbar .ic{position:absolute;right:0;width:153px;top:21px;display:flex;justify-content:center;align-items:center;gap:6px}' +
    '.home{position:absolute;left:50%;bottom:8px;width:140px;height:5px;margin-left:-70px;border-radius:3px;background:rgba(255,255,255,.92);z-index:15}' +
    '#fill{background:rgba(11,8,11,.72)}#fill .fm-under{display:none}#fill .fm-sheet{will-change:transform}' +
    '.scrim{will-change:opacity}.sheet{will-change:transform}.tap{display:none}' +
    '.v2 .chip,.v2 .check,.v2 .btn,.v2 .fm-go,.v2 .dd b,.v2 .hchip{transition:none}' +
    '</style><div class="v2" id="root" style="position:absolute;inset:0">' +
    '<div class="ly full" id="sched">' + SCHEDULE_BODY + '</div>' +
    '<div class="ly" id="fill">' + SCREEN.fill + '</div>' +
    '<div class="ly" id="share">' + SCREEN.share.slice(SCHEDULE_BODY.length) + '</div>' +
    '<div class="ly" id="book">' + SCREEN.book.slice(SCHEDULE_BODY.length) + '</div>' +
    '<div class="ly full" id="clients">' + SCREEN.clients + '</div>' +
    '<div class="ly full" id="stats">' + SCREEN.stats + '</div>' +
    '<div class="ly full" id="splash"></div>' + SBAR + '<div class="home"></div></div>';
  var $ = function (s) { return shadow.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(shadow.querySelectorAll(s)); };

  var S = {
    sched: $('#sched'), fill: $('#fill'), fillSheet: $('#fill .fm-sheet'), share: $('#share'), shareSheet: $('#share .sheet'),
    book: $('#book'), bookSheet: $('#book .sheet'), clients: $('#clients'), stats: $('#stats'), splash: $('#splash'),
    slots: ['c1', 'c2', 'c3', 'c4', 'c5'].map(function (k) { return $('#sched [data-k="' + k + '"]'); }),
    days: PICKS.map(function (n) { return $('#fill [data-day="' + n + '"]'); }),
    hours: ['10:00', '13:00', '16:00'].map(function (h) { return $('#fill [data-hour="' + h + '"]'); }),
    go: $('#fill [data-k="go"]'), copy: $('#share [data-k="copy"]'),
    search: $('#book .search span'), rows: $$('#book .formrow'), checks: $$('#book .check'),
    svc: $('#book [data-k="svc1"]'), bookBtn: $('#book [data-k="bookbtn"]'),
    clientRows: $$('#clients .card.row'), rev: $('#stats [data-k="rev"]'),
    statVals: $$('#stats .card.stack span[style*="font-size: 26px"]'), statCards: $$('#stats .card')
  };
  S.copyLabel = S.copy.firstChild; S.copy.style.whiteSpace = 'nowrap'; S.bookRows = S.rows;
  // the 12:00 window becomes a booking in step 5
  var booked = S.slots[0].cloneNode(true);
  booked.querySelector('.slot-time').textContent = '12:00';
  var bn = booked.querySelectorAll('.stack > span'); bn[0].textContent = T.booked[0]; bn[1].textContent = T.booked[1];
  S.slots[1].parentNode.insertBefore(booked, S.slots[1].nextSibling);
  S.booked = booked;
  var checkSvg = typeof SV !== 'undefined' ? SV.check : '';
  var statTargets = S.statVals.map(function (n) { return parseInt(n.textContent, 10) || 0; });

  var icon = el('img', 'st-icon', null, plane); icon.src = base + '../img/icon.png'; icon.alt = '';

  // the chaos: where a master's schedule lives today
  function scrap(html, css, home) { var d = el('div', 'st-scrap', html, plane); d.setAttribute('style', css); d._h = home; return d; }
  var scraps = [
    scrap('<div style="font-size:19px;font-weight:700;color:#D7ADB5;margin-bottom:8px">' + T.notes[0] + '</div><div style="font-size:23px;line-height:1.45">' + T.notes[1] + '<br>' + T.notes[2] + '<br><s style="color:#8E858D">' + T.notes[3] + '</s></div>',
      'width:260px;padding:20px 22px;border-radius:24px;background:#2C252C;box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 26px 50px rgba(0,0,0,.5)', [150, -215, 7]),
    scrap('<div style="font-size:17px;font-weight:800;color:#0B080B;letter-spacing:.06em">' + T.sticky[0] + '</div><div style="font-size:32px;font-weight:700;color:#0B080B;margin-top:4px">' + T.sticky[1] + '</div>',
      'width:190px;padding:18px 20px;border-radius:8px;background:#D7ADB5;box-shadow:0 22px 44px rgba(0,0,0,.5)', [-150, -300, -9]),
    scrap('<div style="height:11px;width:60%;border-radius:6px;background:#3A333A;margin-bottom:12px"></div><div style="align-self:flex-start;background:#3A333A;border-radius:16px 16px 16px 5px;padding:8px 12px;font-size:18px">' + T.shot[0] + '</div><div style="align-self:flex-end;margin-top:8px;background:#6B3442;border-radius:16px 16px 5px 16px;padding:8px 12px;font-size:18px">' + T.shot[1] + '</div><div style="margin-top:auto;font-size:15px;color:#8E858D;text-align:center">' + T.shot[2] + '</div>',
      'width:210px;height:270px;display:flex;flex-direction:column;padding:16px 13px;border-radius:26px;background:#1F1A1F;box-shadow:0 0 0 3px #3A333A,0 26px 50px rgba(0,0,0,.55)', [-145, 175, -8]),
    scrap('<span style="display:inline-block;width:13px;height:13px;border-radius:50%;background:#E5484D;margin-right:11px;vertical-align:middle"></span>' + T.direct,
      'padding:17px 26px;border-radius:999px;background:#2C252C;font-size:26px;font-weight:700;white-space:nowrap;box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 22px 44px rgba(0,0,0,.5)', [130, 265, 6]),
    scrap(T.ask, 'padding:18px 24px;border-radius:30px 30px 30px 9px;font-size:24px;white-space:nowrap', [25, -25, -3])
  ];
  scraps[4].classList.add('st-lg');
  // translate(-50%,-50%) is folded into put() via margins measured once
  var chips = T.chips.map(function (txt, i) { var c = el('div', 'st-bubble st-lg' + (i % 2 ? ' st-lg--wine' : ''), txt, plane); c.setAttribute('style', 'padding:13px 22px;border-radius:999px;font-size:21px;font-weight:600;white-space:nowrap'); return c; });
  var dm = el('div', 'st-bubble st-lg st-lg--wine', T.dm, plane);
  dm.setAttribute('style', 'width:290px;padding:22px 24px;border-radius:30px 30px 9px 30px;font-size:18px;line-height:1.55;font-weight:600');
  var reply = el('div', 'st-bubble st-lg', T.reply, plane);
  reply.setAttribute('style', 'padding:17px 22px;border-radius:28px 28px 28px 9px;font-size:21px;font-weight:500;white-space:nowrap');
  var floaters = scraps.concat(chips, [dm, reply, icon]);

  // ---------- layout ----------
  var WEIGHTS = [0.7, 1.0, 0.8, 1.2, 1.0, 1.1, 0.8, 1.0];
  var STARTS = [], TOTAL = 0;
  WEIGHTS.forEach(function (w) { STARTS.push(TOTAL); TOTAL += w; });
  var vw = 0, vh = 0, scale = 1, wide = false, side = 0, shift = 0, spread = 1;
  function layout() {
    vw = window.innerWidth; vh = window.innerHeight; wide = vw >= 960;
    var copyH = 0;
    if (!wide) {
      steps.forEach(function (s) { copyH = Math.max(copyH, s.offsetHeight); });
      copyH += 44;
      section.style.setProperty('--copy-h', copyH + 'px');
    } else section.style.removeProperty('--copy-h');
    var visH = wide ? vh : vh - copyH;
    scale = wide ? Math.min(0.92, (vh - 90) / 872) : Math.min(0.9, (visH - 46) / 872, vw * 0.84 / 418);
    side = wide ? 255 : 70; shift = wide ? 40 : 0; spread = wide ? 1 : Math.min(1, (vw / scale - 40) / 560);
    section.style.height = (TOTAL * (wide ? 0.85 : 0.75) * vh + vh) + 'px';
    floaters.forEach(function (f) { f._w = f.offsetWidth; f._hh = f.offsetHeight; });
  }
  function at(e, x, y, extra, op) { put(e, x - e._w / 2, y - e._hh / 2, extra, op); }

  // ---------- render ----------
  function local(g, k) { return (g - STARTS[k]) / WEIGHTS[k]; }
  function render(g, time) {
    var k = 0; while (k < WEIGHTS.length - 1 && g >= STARTS[k + 1]) k++;
    var u = [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { return local(g, i); });

    // copy: each headline slides in by line, then out as the next one comes
    steps.forEach(function (s, i) {
      var a = i === 0 ? 1 : E.oq(cl((g - STARTS[i] + 0.04) / 0.16));
      var b = i === steps.length - 1 ? 0 : E.io(cl((g - (STARTS[i] + WEIGHTS[i] - 0.1)) / 0.08));
      s.style.visibility = a <= 0 || b >= 1 ? 'hidden' : 'visible';
      s._lines = s._lines || Array.prototype.slice.call(s.querySelectorAll('.ln > span'));
      s._lines.forEach(function (ln, j) {
        var aj = i === 0 ? 1 : E.oq(cl((g - STARTS[i] + 0.04 - j * 0.035) / 0.16));
        ln.style.transform = 'translateY(' + ((1 - aj) * 112 - b * 112).toFixed(1) + '%)';
      });
      var p = s.querySelector('p'), pa = i === 0 ? 1 : E.oc(cl((g - STARTS[i] - 0.02) / 0.14));
      p.style.opacity = (pa * (1 - b)).toFixed(3);
      p.style.transform = 'translateY(' + ((1 - pa) * 14 - b * 8).toFixed(1) + 'px)';
    });
    dots.forEach(function (d, i) { d.style.setProperty('--f', cl(u[i]).toFixed(3)); });

    plane.style.transform = 'scale(' + scale.toFixed(4) + ')';
    put(glowA, Math.sin(time * 0.5) * 60 + 40, -140 + Math.cos(time * 0.4) * 50, 'scale(' + (0.9 + 0.05 * Math.sin(time * 0.8)) + ')', 0.9);
    put(glowB, -120 + Math.cos(time * 0.45) * 50, 260 + Math.sin(time * 0.55) * 40, 'scale(0.7)', 0.55 + 0.35 * E.oc(cl(u[1])));

    // 0-1: the chaos shakes, then flies into the logo; the phone appears around it
    var tremble = Math.pow(R(u[0], 0.45, 0.55), 2) * (1 - R(u[1], 0, 0.08));
    scraps.forEach(function (d, i) {
      var h = d._h, q = E.io(R(u[1], i * 0.04, 0.32));
      var x = h[0] * spread + shift * (1 - q) + Math.sin(time * 1.1 + i * 2) * 6 * (1 - q) + Math.sin(time * 43 + i * 3) * 7 * tremble;
      var y = h[1] + Math.cos(time * 0.9 + i) * 7 * (1 - q) + Math.cos(time * 39 + i) * 4 * tremble;
      at(d, L(x, 0, q), L(y, 0, q), 'rotate(' + (h[2] + q * (i % 2 ? 160 : -160) + Math.sin(time * 1.3 + i) * 1.2).toFixed(2) + 'deg) scale(' + L(1, 0.12, q).toFixed(3) + ')', 1 - R(q, 0.75, 0.25));
    });
    var ip = E.ob(R(u[1], 0.3, 0.25)), iout = E.io(R(u[2], 0, 0.22));
    at(icon, 0, L(0, -120, iout), 'rotate(' + L(-14, 0, ip).toFixed(2) + 'deg) scale(' + (L(0.3, 1, ip) * L(1, 0.5, iout)).toFixed(3) + ')', R(u[1], 0.3, 0.05) * (1 - iout));
    var f = E.oc(R(u[1], 0.42, 0.3));
    var tilt = Math.sin(g * 1.15) * 5;
    put(phone, 0, 0, 'perspective(1800px) rotateY(' + (L(-22, 0, f) + tilt).toFixed(2) + 'deg) rotateX(' + (3 + Math.cos(g) * 2).toFixed(2) + 'deg) scale(' + L(0.84, 1, f).toFixed(3) + ')', f);

    // 2: the day on one screen
    S.splash.style.opacity = (1 - R(u[2], 0.05, 0.2)).toFixed(3);
    S.slots.forEach(function (s, i) {
      var a = E.oc(R(u[2], 0.16 + i * 0.07, 0.2));
      s.style.opacity = a.toFixed(3); s.style.transform = 'translateY(' + ((1 - a) * 34).toFixed(1) + 'px)';
    });

    // 3: a month of windows: pick days and hours, add them all at once
    var fa = E.oc(R(u[3], 0, 0.14)), fb = E.io(R(u[3], 0.86, 0.12));
    S.fill.style.opacity = (fa * (1 - fb)).toFixed(3); S.fill.style.visibility = fa * (1 - fb) > 0 ? 'visible' : 'hidden';
    S.fillSheet.style.transform = 'translateY(' + ((1 - fa) * 820 + fb * 820).toFixed(1) + 'px)';
    var np = 0, nh = 0;
    S.days.forEach(function (d, i) { var t0 = 0.2 + i * 0.05, on = u[3] >= t0; if (on) np++; d.classList.toggle('cd--pick', on); d.firstChild.style.transform = 'scale(' + (on ? L(1.4, 1, E.oc(R(u[3], t0, 0.05))) : 1).toFixed(3) + ')'; });
    S.hours.forEach(function (h, i) { var t0 = 0.43 + i * 0.05, on = u[3] >= t0; if (on) nh++; h.classList.toggle('chip--on', on); h.style.transform = 'scale(' + (on ? L(1.22, 1, E.oc(R(u[3], t0, 0.05))) : 1).toFixed(3) + ')'; });
    var done = u[3] >= 0.66;
    var lbl = done ? T.added : T.addN(np * nh);
    if (S.go.textContent !== lbl) S.go.textContent = lbl;
    S.go.style.opacity = np * nh ? 1 : 0.5;
    var pr = R(u[3], 0.62, 0.04);
    S.go.style.transform = 'scale(' + (pr > 0 && pr < 1 ? L(0.92, 1, pr) : done ? 1 + 0.08 * Math.exp(-(u[3] - 0.66) * 60) : 1).toFixed(3) + ')';
    chips.forEach(function (c, i) {
      var a = E.ob(R(u[3], 0.67 + i * 0.025, 0.1)), o = R(u[3], 0.67 + i * 0.025, 0.02) * (1 - R(u[3], 0.84, 0.08));
      var tx = side + (i % 2 ? 40 : -10), ty = -250 + i * 125;
      at(c, L(60, tx, a), L(330, ty, a) + Math.sin(time * 1.4 + i) * 5, 'rotate(' + ((i % 2 ? 4 : -5) * a).toFixed(2) + 'deg) scale(' + L(0.3, 1, a).toFixed(3) + ')', o);
    });

    // 4: copy the free windows and send them to a DM
    var sa = E.oc(R(u[4], 0, 0.14)), sb = E.io(R(u[4], 0.86, 0.12));
    S.share.style.opacity = (sa * (1 - sb)).toFixed(3); S.share.style.visibility = sa * (1 - sb) > 0 ? 'visible' : 'hidden';
    S.shareSheet.style.transform = 'translateY(' + ((1 - sa) * 700 + sb * 700).toFixed(1) + 'px)';
    var cp = R(u[4], 0.36, 0.04), copied = u[4] >= 0.4;
    var cl1 = copied ? T.copied : (EN ? 'Copy' : 'Скопіювати');
    if (S.copyLabel.textContent !== cl1) S.copyLabel.textContent = cl1;
    S.copy.style.transform = 'scale(' + (cp > 0 && cp < 1 ? L(0.92, 1, cp) : 1) + ')';
    var da = E.ob(R(u[4], 0.44, 0.13)), ra = E.ob(R(u[4], 0.6, 0.1));
    at(dm, L(0, side + 20, da), L(120, 10, da) + Math.sin(time * 1.2) * 5, 'rotate(' + L(-8, 2, da).toFixed(2) + 'deg) scale(' + L(0.3, 1, da).toFixed(3) + ')', R(u[4], 0.44, 0.02) * (1 - sb));
    at(reply, L(side - 40, side - 20, ra), L(260, 220, ra) + Math.cos(time * 1.3) * 5, 'scale(' + L(0.5, 1, ra).toFixed(3) + ')', R(u[4], 0.6, 0.03) * (1 - sb));

    // 5: book a client in two taps; the free 12:00 becomes a booking
    var ba = E.oc(R(u[5], 0, 0.14)), bb = E.io(R(u[5], 0.66, 0.12));
    S.book.style.opacity = (ba * (1 - bb)).toFixed(3); S.book.style.visibility = ba * (1 - bb) > 0 ? 'visible' : 'hidden';
    S.bookSheet.style.transform = 'translateY(' + ((1 - ba) * 700 + bb * 700).toFixed(1) + 'px)';
    var typed = T.query.slice(0, u[5] < 0.18 ? 0 : u[5] < 0.24 ? 1 : 2);
    var st = typed || T.placeholder;
    if (S.search.textContent !== st) { S.search.textContent = st; S.search.style.color = typed ? '#FFFFFF' : '#9C939B'; }
    S.rows.forEach(function (r, i) { var a = E.oc(R(u[5], 0.2 + i * 0.03, 0.08)); r.style.opacity = (0.15 + 0.85 * a).toFixed(3); });
    var chOn = u[5] >= 0.36;
    S.checks.forEach(function (c, i) { var on = i === 1 && chOn; if (c._on !== on) { c._on = on; c.classList.toggle('check--on', on); c.innerHTML = on ? checkSvg : ''; } });
    S.checks[1].style.transform = 'scale(' + (chOn ? L(1.35, 1, E.oc(R(u[5], 0.36, 0.05))) : 1).toFixed(3) + ')';
    var svOn = u[5] >= 0.45; S.svc.classList.toggle('chip--on', svOn);
    S.svc.style.transform = 'scale(' + (svOn ? L(1.15, 1, E.oc(R(u[5], 0.45, 0.05))) : 1).toFixed(3) + ')';
    var bp = R(u[5], 0.56, 0.04); S.bookBtn.style.transform = 'scale(' + (bp > 0 && bp < 1 ? L(0.92, 1, bp) : 1) + ')';
    var isBooked = u[5] >= 0.74, pop = E.oc(R(u[5], 0.74, 0.1));
    S.slots[1].style.display = isBooked ? 'none' : ''; S.booked.style.display = isBooked ? '' : 'none';
    S.booked.style.transform = 'scale(' + (isBooked ? L(1.1, 1, pop) : 1).toFixed(3) + ')';
    S.booked.style.boxShadow = isBooked ? '0 0 0 ' + (2 * (1 - pop)).toFixed(2) + 'px #D7ADB5, 0 0 ' + (40 * (1 - pop)).toFixed(1) + 'px rgba(215,173,181,.5)' : '';

    // 6: all clients at hand (switches tab, slides in from the right)
    var ca = E.io(R(u[6], 0, 0.2));
    S.clients.style.transform = 'translateX(' + ((1 - ca) * 100).toFixed(2) + '%)'; S.clients.style.visibility = ca > 0 ? 'visible' : 'hidden';
    S.clientRows.forEach(function (r, i) { var a = E.oc(R(u[6], 0.14 + i * 0.06, 0.16)); r.style.opacity = a.toFixed(3); r.style.transform = 'translateY(' + ((1 - a) * 30).toFixed(1) + 'px)'; });

    // 7: the month in numbers, counting up
    var ta = E.io(R(u[7], 0, 0.2));
    S.stats.style.transform = 'translateX(' + ((1 - ta) * 100).toFixed(2) + '%)'; S.stats.style.visibility = ta > 0 ? 'visible' : 'hidden';
    var rv = Math.round(8400 * E.oc(R(u[7], 0.14, 0.4)) / 100) * 100;
    var rvs = String(rv).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' zł';
    if (S.rev.textContent !== rvs) S.rev.textContent = rvs;
    S.statCards.forEach(function (c, i) { var a = E.oc(R(u[7], 0.1 + i * 0.05, 0.16)); c.style.opacity = a.toFixed(3); c.style.transform = 'translateY(' + ((1 - a) * 28).toFixed(1) + 'px)'; });
    S.statVals.forEach(function (n, i) { var v = String(Math.round(statTargets[i] * E.oc(R(u[7], 0.22 + i * 0.05, 0.35)))); if (n.textContent !== v) n.textContent = v; });
  }

  // ---------- scroll loop ----------
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var target = 0, cur = -1, running = false, visible = false, t0 = performance.now();
  function measure() {
    var r = section.getBoundingClientRect(), span = r.height - vh;
    target = cl(-r.top / (span > 0 ? span : 1)) * TOTAL;
  }
  function frame(now) {
    measure();
    if (cur < 0 || reduce) cur = target; else cur += (target - cur) * 0.16;
    if (Math.abs(target - cur) < 0.0005) cur = target;
    render(cur, reduce ? 0 : (now - t0) / 1000);
    if (visible) requestAnimationFrame(frame); else running = false;
  }
  function start() { if (!running) { running = true; requestAnimationFrame(frame); } }

  section.classList.add('is-live');
  layout();
  measure(); cur = target; render(cur, 0);
  window.addEventListener('resize', function () { layout(); measure(); cur = target; render(cur, (performance.now() - t0) / 1000); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) start(); }).observe(section);
  } else { visible = true; start(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { layout(); });
})();
