// Dark-theme YOi screens, adapted from the "Тільки майстриня" artboards of Manik Screens
const SV = {
  send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3L10 14"/><path d="M21 3l-7 18-4-7-7-4 18-7z"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
  msg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4.1A8 8 0 1 1 20 11.5z"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 5.5L8 12l6.5 6.5"/></svg>',
  fwd: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 5.5L16 12l-6.5 6.5"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>',
  warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17.5v.01"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
};
const TABS = (on) => `<div class="tabdock"><nav class="tabbar glass">${[['i-calendar','Schedule'],['i-person-circle','Clients'],['i-sliders','Stats']].map(([i,l],k)=>`<span class="tab${k===on?' tab--on':''}"><span class="icon ${i}"></span><span>${l}</span></span>`).join('')}</nav></div>`;

const SCHEDULE_BODY = `
<div class="row" style="padding: 70px 20px 0; gap: 10px; align-items: flex-start">
<div class="stack" style="flex: 1; gap: 6px"><h1 style="margin: 0; font-size: 32px; font-weight: 700; line-height: 1.12; letter-spacing: -0.6px">Schedule</h1><span class="muted" style="font-size: 15px">October 2026</span></div>
<span class="round raised">${SV.send}</span><span class="round raised">${SV.plus}</span>
</div>
<div class="week">${[['MON',5],['TUE',6],['WED',7],['THU',8],['FRI',9],['SAT',10],['SUN',11]].map(([d,n])=>`<span class="day${n===8?' day--on':''}"><small>${d}</small><b>${n}</b></span>`).join('')}</div>
<div class="row between" style="padding: 8px 20px 10px"><span class="label">Thu, Oct 8</span><span class="muted" style="font-size: 13px">2 bookings · 2 free · 1 plan</span></div>
<div class="stack" style="gap: 10px; padding: 0 16px">
<div class="card slot" data-k="c1" style="padding: 12px 16px"><span class="slot-time">09:00</span><span class="ava" style="width: 38px; height: 38px; font-size: 14px">O</span><span class="stack" style="flex: 1; min-width: 0; gap: 2px"><span style="font-size: 16px; font-weight: 700">Olya</span><span class="muted" style="font-size: 13px">@olya.nails · Gel polish</span></span><span class="round round--sm raised">${SV.msg}</span></div>
<div class="slot slot-free" data-k="c2"><span class="slot-time">12:00</span><span style="flex: 1">Free</span><span style="font-size: 14px">Book</span></div>
<div class="card slot" data-k="c3" style="padding: 12px 16px"><span class="slot-time">15:00</span><span class="ava" style="width: 38px; height: 38px; font-size: 14px">K</span><span class="stack" style="flex: 1; min-width: 0; gap: 2px"><span style="font-size: 16px; font-weight: 700">Kate</span><span class="muted" style="font-size: 13px">@kate_m · French tips</span></span><span class="round round--sm raised">${SV.msg}</span></div>
<div class="slot slot-free" data-k="c4"><span class="slot-time">18:30</span><span style="flex: 1">Free</span><span class="warn">${SV.warn}Boxing</span></div>
<div class="event" data-k="c5"><span class="slot-time">19:00</span><span class="stack" style="flex: 1; gap: 2px"><span style="font-size: 16px; font-weight: 700">Boxing</span><span class="muted" style="font-size: 13px">until 20:30 · every Thu</span></span></div>
</div>
${TABS(0)}`;

const SCREEN = {};
SCREEN.schedule = SCHEDULE_BODY;

const PICKS = [15, 17, 29, 31];
// "Вікна" sheet, redrawn from the real app (December 2026 starts on a Tuesday)
SCREEN.fill = `
<div class="fm-under">${TABS(0)}</div>
<div class="fm-sheet">
<div class="fm-seg"><span class="fm-seg-on">Windows</span><span>My plans</span></div>
<div class="fm-month"><span class="fm-nav"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 5.5L8 12l6.5 6.5"/></svg></span><b>December 2026</b><span class="fm-nav"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.5 5.5L16 12l-6.5 6.5"/></svg></span></div>
<div class="fm-cal">${['M','T','W','T','F','S','S'].map(d=>`<i>${d}</i>`).join('')}<span></span>${Array.from({length:31},(_,i)=>i+1).map(n=>`<span class="dd" data-day="${n}"><b>${n}</b></span>`).join('')}</div>
<div class="fm-label">Hours</div>
<div class="fm-hours">${['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'].map(h=>`<span class="hchip" data-hour="${h.replace(/^0/,'')}">${h}</span>`).join('')}</div>
<div class="fm-own">＋ Custom time</div>
<div class="fm-foot"><span class="fm-cancel">Cancel</span><span class="fm-go" data-k="go">Add 12 windows</span></div>
</div>`;

SCREEN.book = SCHEDULE_BODY + `
<div class="scrim"><div class="sheet">
<div class="stack" style="gap: 4px"><h2>Book a client</h2><span class="muted" style="font-size: 14px">Thu, Oct 8 · 12:00</span></div>
<div class="search raised">${SV.search}<span style="color:#FFFFFF">ol</span></div>
<div class="stack" style="gap: 2px">
<div class="formrow" style="gap: 12px"><span class="ava" style="width: 36px; height: 36px; font-size: 13px">O</span><span class="stack" style="flex: 1; gap: 1px"><span style="font-size: 15px; font-weight: 700">Olya</span><span class="muted" style="font-size: 13px">@olya.nails</span></span><span class="check" data-k="chk1"></span></div>
<div class="formrow" style="gap: 12px"><span class="ava" style="width: 36px; height: 36px; font-size: 13px">O</span><span class="stack" style="flex: 1; gap: 1px"><span style="font-size: 15px; font-weight: 700">Olena</span><span class="muted" style="font-size: 13px">@olena.k</span></span><span class="check"></span></div>
<div class="formrow" style="gap: 12px"><span class="ava" style="width: 36px; height: 36px; font-size: 13px">O</span><span class="stack" style="flex: 1; gap: 1px"><span style="font-size: 15px; font-weight: 700">Olga</span><span class="muted" style="font-size: 13px">@olga_beauty</span></span><span class="check"></span></div>
</div>
<div class="stack" style="gap: 8px"><span class="label">Service · optional</span><div class="chips" style="flex-wrap: wrap"><span class="chip" data-k="svc1" style="min-width: 0">Gel polish</span><span class="chip" style="min-width: 0">Classic</span><span class="chip" style="min-width: 0">French tips</span></div></div>
<div class="row between"><span class="btn btn--text">Cancel</span><span class="btn btn--primary" data-k="bookbtn">Book<span class="tap" data-k="tap3"></span></span></div>
</div></div>`;

SCREEN.share = SCHEDULE_BODY + `
<div class="scrim"><div class="sheet">
<div class="stack" style="gap: 4px"><h2>Send schedule</h2><p class="note">Free hours only, from today</p></div>
<div class="segments"><span class="segment" style="display:grid;place-items:center">This week</span><span class="segment segment--on" style="display:grid;place-items:center">October</span></div>
<div class="card msgtext" style="padding: 16px; border-radius: 18px; background:#2C252C">Free windows in October:
9.10 Fri — 13:00, 17:00
10.10 Sat — 10:00, 14:00
13.10 Tue — 10:00, 13:00, 16:00
15.10 Thu — 10:00, 16:00
20.10 Tue — 13:00
22.10 Thu — 10:00, 13:00, 16:00</div>
<div class="row" style="gap: 10px"><span class="btn btn--secondary btn--flex">Share</span><span class="btn btn--primary btn--flex" data-k="copy">Copy<span class="tap" data-k="tapc"></span></span></div>
<span class="btn btn--text" style="align-self: center">Close</span>
</div></div>`;

const statCard = (icon, val, unit, label, extra) => `<div class="card stack" style="gap: 10px; padding: 16px"><span class="tile"><span class="icon ${icon}"></span></span><div class="row" style="gap: 4px; align-items: baseline"><span style="font-size: 26px; font-weight: 800">${val}</span>${unit?`<span class="muted" style="font-size: 14px; font-weight: 600">${unit}</span>`:''}</div><div class="row between"><span class="muted" style="font-size: 14px; font-weight: 600">${label}</span>${extra||''}</div></div>`;
SCREEN.stats = `
<header class="large-title"><h1>Statistics</h1></header>
<div class="row between" style="padding: 16px 20px 0"><span class="round raised round--sm">${SV.back}</span><span style="font-size: 17px; font-weight: 700">October 2026</span><span class="round raised round--sm" style="opacity:.35">${SV.fwd}</span></div>
<div class="stack" style="gap: 14px; padding: 16px 16px 0">
<section class="card stack" style="gap: 6px; align-items: center; padding: 22px">
<span class="muted" style="font-size: 15px; font-weight: 600">Income</span>
<span data-k="rev" style="font-size: 40px; font-weight: 800; letter-spacing: -1px">8 400 zł</span>
<span class="up" style="font-size: 13px; font-weight: 700">↑ 34% <span class="muted" style="font-weight: 500">vs last month</span></span>
<hr class="hairline" style="align-self: stretch; margin-top: 12px">
<span style="font-size: 14px; padding-top: 6px"><span class="muted">Expected</span> <b style="font-weight: 700">9 200 zł</b></span>
</section>
<div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px">
${statCard('i-check-circle','60','','Visits')}${statCard('i-clock','105','h','Hours worked')}${statCard('i-person-2','44','','Clients','<span class="up" style="font-size: 12px; font-weight: 700">↑ 22%</span>')}${statCard('i-square-dashed','5','','Free windows')}
</div>
<div class="card row" style="gap: 12px; padding: 14px 16px"><span class="tile"><span class="icon i-list-rect"></span></span><span class="stack" style="flex: 1; gap: 2px"><span style="font-size: 16px; font-weight: 700">My services</span><span class="muted" style="font-size: 13px">Prices & favorites</span></span><span class="muted" style="width: 16px; height: 16px; display: grid">${SV.fwd}</span></div>
</div>
${TABS(2)}`;

// "Clients" list, from the SoloClients artboard
SCREEN.clients = `
<div class="row" style="padding: 70px 20px 0; gap: 10px; align-items: flex-start">
<div class="stack" style="flex: 1; gap: 6px"><h1 style="margin: 0; font-size: 32px; font-weight: 700; line-height: 1.12; letter-spacing: -0.6px">Clients</h1><span class="muted" style="font-size: 15px">24 saved</span></div>
<span class="round raised">${SV.plus}</span>
</div>
<div style="padding: 18px 16px 0"><div class="search raised">${SV.search}<span>Nickname or name</span></div></div>
<div style="padding: 20px 20px 10px"><span class="label">Recent</span></div>
<div class="stack" style="gap: 10px; padding: 0 16px">
${[['O','Olya','@olya.nails · Thu, Oct 8, 09:00'],['K','Kate','@kate_m · Thu, Oct 8, 15:00'],['M','Marina','@marina.v · 2 weeks ago'],['I','Iryna','@irka_lviv · 5 weeks ago'],['S','Sonia','@sonya.art · no visits yet']].map(([a,n,h])=>`<div class="card row" style="gap: 14px; padding: 12px 14px 12px 16px"><span class="ava">${a}</span><span class="stack" style="flex: 1; min-width: 0; gap: 2px"><span style="font-size: 16px; font-weight: 700">${n}</span><span class="muted" style="font-size: 13px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis">${h}</span></span><span class="round raised">${SV.msg}</span></div>`).join('')}
</div>
${TABS(1)}`;
