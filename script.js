'use strict';

/* ── INZETCONFIGURATIE (max £200 per race) ──────────────── */
// Best WIN:         £100 outlay
// Beste 3 (3x E/W): £10 E/W elk = £20 outlay per paard = £60 totaal
// Underdog E/W:     £20 E/W = £40 outlay
// Totaal:           £100 + £60 + £40 = £200 ✓
const S = { best: 100, b3Each: 10, underdog: 20 };

/* ── RACE DATA ──────────────────────────────────────────── */
const races = [
  {
    id: 1,
    name: 'Hardwicke Stakes',
    time: '15:10',
    type: 'Group 2',
    distance: '1m4f',
    runners: 12,
    status: 'ready',
    best: {
      horse: 'Kalpana',
      odds: '10/3',
      jockey: 'Colin Keane',
      trainer: 'Andrew Balding',
      form: '2271-1',
      draw: 2,
      reason: 'Marktleider, gewonnen laatste race (form eindigt op 1), Draw 2 = binnenbaan voordeel op 1m4f, Balding yard in topvorm, Keane is een van de beste jockeys van het moment.'
    },
    underdog: {
      horse: 'Ethical Diamond',
      odds: '11/1',
      jockey: 'D.B. McMonagle',
      trainer: 'W P Mullins',
      form: '/111-5',
      draw: 9,
      reason: 'Willie Mullins yard, won drie op rij voor laatste run. Herstelkandiaat bij 11/1 is uitstekende waarde — Mullins laat zelden een paard lopen zonder doel.'
    },
    bestOf3: [
      { horse: 'Kalpana',      odds: '10/3', draw: 2, form: '2271-1', jockey: 'C. Keane' },
      { horse: 'Jan Brueghel', odds: '5/1',  draw: 3, form: '214-12', jockey: 'R. Moore' },
      { horse: 'Best Secret',  odds: '11/2', draw: 7, form: '311-61', jockey: 'J. Doyle' }
    ]
  },
  {
    id: 2,
    name: 'QE Jubilee Stakes',
    time: '15:40',
    type: 'Group 1',
    distance: '6f',
    runners: 18,
    status: 'ready',
    best: {
      horse: 'Joliestar',
      odds: '13/8',
      jockey: 'James McDonald',
      trainer: 'Chris Wall',
      form: '53-111',
      draw: 9,
      reason: 'RP tip. Australische kampioene met 2 Group 1 winnen dit voorjaar, 3 op rij gewonnen. Draw 9 is neutraal op rechte 6f. McDonald kent het paard als geen ander.'
    },
    underdog: {
      horse: 'Almeraq',
      odds: '25/1',
      jockey: 'Tom Marquand',
      trainer: 'William Haggas',
      form: '/21F-1',
      draw: 11,
      reason: 'RP omschrijft expliciet als "dark horse with more in the tank". Recent gewonnen, Haggas = topstable. Bij 25/1 enorme waarde als dit paard zijn ware niveau toont.'
    },
    bestOf3: [
      { horse: 'Joliestar',   odds: '13/8', draw: 9, form: '53-111',  jockey: 'J. McDonald' },
      { horse: 'Lake Forest', odds: '17/2', draw: 1, form: '2207-1',  jockey: 'C. Fallon' },
      { horse: 'Sajir',       odds: '18/1', draw: 6, form: '10-221',  jockey: 'O. Murphy' }
    ]
  },
  {
    id: 3,
    name: 'Race 3',
    time: '16:20',
    type: '?',
    distance: '?',
    runners: '?',
    status: 'tbc'
  },
  {
    id: 4,
    name: 'Wokingham Stakes',
    time: '17:00',
    type: 'Heritage Handicap',
    distance: '6f',
    runners: 30,
    status: 'ready',
    best: {
      horse: 'Realign',
      odds: '14/1',
      jockey: 'James Doyle',
      trainer: 'William Haggas',
      form: '017-91',
      draw: 10,
      reason: 'RP tip. Recent gewonnen, Draw 10 is uitstekend in 30-loper veld op rechte 6f. Doyle + Haggas = topcombinatie. Marktleider Binhareer heeft Draw 22 — groot nadeel.'
    },
    underdog: {
      horse: 'Sondad',
      odds: '25/1',
      jockey: 'Joanna Mason',
      trainer: 'M&D Easterby',
      form: '723-01',
      draw: 2,
      reason: 'Recent gewonnen, Draw 2 = ideaal op rechte 6f in groot veld. Bij 25/1 enorme waarde: als de draw werkt en de form klopt, is dit de winnaar.'
    },
    bestOf3: [
      { horse: 'Realign',        odds: '14/1', draw: 10, form: '017-91', jockey: 'J. Doyle' },
      { horse: 'Far Above Dream', odds: '20/1', draw: 17, form: '101-11', jockey: 'K. Shoemark' },
      { horse: 'Sondad',         odds: '25/1', draw: 2,  form: '723-01', jockey: 'J. Mason' }
    ]
  },
  {
    id: 5,
    name: 'Golden Gates Stakes',
    time: '17:35',
    type: 'Handicap',
    distance: '1m2f',
    runners: 12,
    status: 'ready',
    best: {
      horse: 'Lost Boys',
      odds: '11/4',
      jockey: 'James McDonald',
      trainer: 'David Menuisier',
      form: '331-11',
      draw: 14,
      reason: 'Topvorm: 2 op rij gewonnen. McDonald rijdt uitstekend op Ascot dit seizoen. Menuisier yard is momenteel in uitstekende vorm. Op 1m2f is draw minder cruciaal — klasse en conditionering bepalen de uitslag.'
    },
    underdog: {
      horse: 'Princling',
      odds: '15/2',
      jockey: 'Tom Marquand',
      trainer: 'William Haggas',
      form: '22-14',
      draw: 18,
      reason: 'Haggas topstable met Marquand in het zadel. Op 1m2f geen draw-nadeel. Bij 15/2 aantrekkelijke prijs voor een paard dat al twee keer tweede werd — klaar voor een overwinning.'
    },
    bestOf3: [
      { horse: 'Lost Boys',   odds: '11/4', draw: 14, form: '331-11', jockey: 'J. McDonald' },
      { horse: 'Sahara King', odds: '5/1',  draw: 17, form: '1-522',  jockey: 'J. Doyle' },
      { horse: 'Princling',   odds: '15/2', draw: 18, form: '22-14',  jockey: 'T. Marquand' }
    ]
  }
];

/* ── HELPERS ────────────────────────────────────────────── */
function toDecimal(frac) {
  const [n, d] = frac.split('/').map(Number);
  return d ? n / d + 1 : n + 1;
}

function winReturn(stake, odds) {
  return Math.round(stake * toDecimal(odds));
}

function placeReturn(stake, odds) {
  const placeOdds = (toDecimal(odds) - 1) / 4 + 1;
  return Math.round(stake * placeOdds);
}

/* ── RENDER RACE ────────────────────────────────────────── */
function renderRace(r) {
  if (r.status === 'tbc') {
    return `
      <div class="race-tbc">
        <div class="tbc-icon">📋</div>
        <div class="tbc-title">Race ${r.id} — ${r.time}</div>
        <p class="tbc-text">Stuur de screenshots voor de analyse</p>
      </div>`;
  }

  const { best, underdog, bestOf3 } = r;
  const totalStake = S.best + S.b3Each * 2 * 3 + S.underdog * 2;

  const bestReturn  = winReturn(S.best, best.odds);
  const bestProfit  = bestReturn - S.best;
  const udWin       = winReturn(S.underdog, underdog.odds);
  const udPlace     = placeReturn(S.underdog, underdog.odds);

  return `
    <div class="race-card">
      <div class="race-header">
        <div>
          <div class="race-number">Race ${r.id}</div>
          <div class="race-name">${r.name}</div>
          <div class="race-meta">
            <span class="race-badge">${r.type}</span>
            <span class="race-badge">${r.distance}</span>
            <span class="race-badge">${r.runners} lopers</span>
          </div>
        </div>
        <div class="race-time">${r.time}</div>
      </div>

      <div class="race-body">

        <!-- BEST BET -->
        <div class="bet-block bet-best">
          <div class="bet-label">🏆 Best bet — WIN</div>
          <div class="bet-content">
            <div class="bet-horse-row">
              <div class="bet-horse-name">${best.horse}</div>
              <div class="bet-odds">${best.odds}</div>
            </div>
            <div class="bet-details">
              <span>🏇 ${best.jockey}</span>
              <span>🎩 ${best.trainer}</span>
              <span>📊 ${best.form}</span>
              <span>🔢 Draw ${best.draw}</span>
            </div>
            <div class="bet-reason">${best.reason}</div>
            <div class="bet-stake-row">
              <div>
                <div class="bet-stake-label">WIN inzet</div>
                <div class="bet-stake-return">Als winnaar → £${bestReturn} terug (winst £${bestProfit})</div>
              </div>
              <div class="bet-stake-amount">£${S.best}</div>
            </div>
          </div>
        </div>

        <!-- BESTE 3 -->
        <div class="bet-block bet-b3">
          <div class="bet-label">🎯 Beste 3 — Each-Way (£${S.b3Each} E/W per paard)</div>
          <div class="b3-grid">
            ${bestOf3.map((h, i) => `
              <div class="b3-item">
                <div class="b3-rank">#${i + 1}</div>
                <div class="b3-horse">${h.horse}</div>
                <div class="b3-odds">${h.odds}</div>
                <div class="b3-form">${h.form}</div>
                <div class="b3-jockey">${h.jockey} · draw ${h.draw}</div>
                <div class="b3-stake">£${S.b3Each} E/W</div>
              </div>`).join('')}
          </div>
        </div>

        <!-- UNDERDOG -->
        <div class="bet-block bet-underdog">
          <div class="bet-label">🎲 Underdog — Each-Way</div>
          <div class="bet-content">
            <div class="bet-horse-row">
              <div class="bet-horse-name">${underdog.horse}</div>
              <div class="bet-odds">${underdog.odds}</div>
            </div>
            <div class="bet-details">
              <span>🏇 ${underdog.jockey}</span>
              <span>🎩 ${underdog.trainer}</span>
              <span>📊 ${underdog.form}</span>
              <span>🔢 Draw ${underdog.draw}</span>
            </div>
            <div class="bet-reason">${underdog.reason}</div>
            <div class="bet-stake-row">
              <div>
                <div class="bet-stake-label">EACH-WAY inzet</div>
                <div class="bet-stake-return">Win: £${udWin} · Plaatsing: £${udPlace}</div>
              </div>
              <div class="bet-stake-amount">£${S.underdog} E/W</div>
            </div>
          </div>
        </div>

        <!-- INZET OVERZICHT -->
        <div class="stake-summary">
          <div class="stake-row">
            <span class="stake-label">Best WIN</span>
            <span class="stake-val">£${S.best}</span>
          </div>
          <div class="stake-row">
            <span class="stake-label">Beste 3 (3 × £${S.b3Each} E/W)</span>
            <span class="stake-val">£${S.b3Each * 2 * 3}</span>
          </div>
          <div class="stake-row">
            <span class="stake-label">Underdog E/W</span>
            <span class="stake-val">£${S.underdog * 2}</span>
          </div>
          <div class="stake-total-row">
            <span class="stake-total-label">Totaal race ${r.id}</span>
            <span class="stake-total-val">£${totalStake}</span>
          </div>
        </div>

      </div>
    </div>`;
}

/* ── RENDER DAG OVERZICHT ───────────────────────────────── */
function renderSummary() {
  const ready = races.filter(r => r.status === 'ready');
  const totalStaked = ready.length * 200;

  const rows = ready.flatMap(r => [
    { time: r.time, race: r.name, horse: r.best.horse,     odds: r.best.odds,     type: 'best',     stake: `£${S.best} WIN` },
    ...r.bestOf3.map(h => ({ time: r.time, race: r.name, horse: h.horse, odds: h.odds, type: 'b3', stake: `£${S.b3Each} E/W` })),
    { time: r.time, race: r.name, horse: r.underdog.horse, odds: r.underdog.odds, type: 'underdog', stake: `£${S.underdog} E/W` }
  ]);

  const maxBestReturn = ready.reduce((sum, r) => sum + winReturn(S.best, r.best.odds), 0);

  return `
    <div class="container">
      <h2 class="day-summary-title">📋 Dag Overzicht — Alle Bets</h2>
      <table class="summary-table">
        <thead>
          <tr>
            <th>Tijd</th>
            <th>Race</th>
            <th>Paard</th>
            <th>Odds</th>
            <th>Type</th>
            <th>Inzet</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map(b => `
            <tr>
              <td>${b.time}</td>
              <td>${b.race}</td>
              <td><strong>${b.horse}</strong></td>
              <td><strong>${b.odds}</strong></td>
              <td><span class="type-badge badge-${b.type}">${b.type === 'best' ? 'Best' : b.type === 'b3' ? 'Top 3' : 'Underdog'}</span></td>
              <td>${b.stake}</td>
            </tr>`).join('')}
        </tbody>
      </table>
      <div class="summary-totals">
        <div class="summary-box">
          <div class="s-label">Races klaar</div>
          <div class="s-value">${ready.length} / ${races.length}</div>
        </div>
        <div class="summary-box">
          <div class="s-label">Totaal bets</div>
          <div class="s-value">${rows.length}</div>
        </div>
        <div class="summary-box hl">
          <div class="s-label">Totaal ingezet</div>
          <div class="s-value">£${totalStaked}</div>
        </div>
      </div>
    </div>`;
}

/* ── INIT ───────────────────────────────────────────────── */
(function init() {
  const main    = document.getElementById('races-container');
  const summary = document.getElementById('day-summary');

  if (main)    main.innerHTML    = races.map(renderRace).join('');
  if (summary) summary.innerHTML = renderSummary();

  const ready = races.filter(r => r.status === 'ready');
  const amountEl = document.getElementById('total-amount');
  const returnEl = document.getElementById('return-amount');

  if (amountEl) amountEl.textContent = ready.length * 200;
  if (returnEl) returnEl.textContent = ready.reduce((s, r) => s + winReturn(S.best, r.best.odds), 0);
})();
