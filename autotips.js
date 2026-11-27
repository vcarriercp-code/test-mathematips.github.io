/* Auto'Tips — générateur de questions (3ème)
   Une série = 4 questions ouvertes aléatoires + correction.
   Pour ajouter une série : écrire une fonction genN() qui renvoie 4 objets {q, a}
   (q = énoncé en HTML, a = correction en HTML), puis l'inscrire dans TITRES et GEN. */
(function () {
  'use strict';

  /* ================= Outils ================= */
  var NBSP = '\u00a0', MOINS = '\u2212';

  function rnd(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
  function pick(t) { return t[rnd(0, t.length - 1)]; }
  function shuffle(t) {
    var c = t.slice();
    for (var i = c.length - 1; i > 0; i--) { var j = rnd(0, i), x = c[i]; c[i] = c[j]; c[j] = x; }
    return c;
  }
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = a % b; a = b; b = t; } return a; }
  function grouper(ent) { return ent.replace(/\B(?=(\d{3})+(?!\d))/g, NBSP); }
  /* nombre JS -> texte français (virgule, espaces, vrai signe moins) */
  function fr(x) {
    var s = String(Math.round(x * 1000) / 1000), neg = s.charAt(0) === '-';
    if (neg) s = s.slice(1);
    var p = s.split('.');
    return (neg ? MOINS : '') + grouper(p[0]) + (p[1] ? ',' + p[1] : '');
  }
  /* "1234.5" -> "1 234,5" */
  function frStr(s) { var p = String(s).split('.'); return grouper(p[0]) + (p[1] ? ',' + p[1] : ''); }
  /* Déplace la virgule de k rangs (k>0 : ×10^k ; k<0 : ÷10^|k|) sans erreur d'arrondi. Entrée/sortie avec un point. */
  function deplacer(s, k) {
    s = String(s).replace(',', '.');
    var i = s.indexOf('.');
    var ent = i < 0 ? s : s.slice(0, i), dec = i < 0 ? '' : s.slice(i + 1);
    var ch = ent + dec, pos = ent.length + k;
    if (pos <= 0) { ch = new Array(2 - pos).join('0') + ch; pos = 1; }
    if (pos > ch.length) { ch += new Array(pos - ch.length + 1).join('0'); }
    var E = ch.slice(0, pos).replace(/^0+(?=\d)/, ''), D = ch.slice(pos).replace(/0+$/, '');
    return D ? E + '.' + D : E;
  }
  function frac(n, d) { return '<span class="frac"><span>' + n + '</span><span>' + d + '</span></span>'; }
  function fracSimple(n, d) {
    if (n === 0) return '0';
    var g = gcd(n, d); n /= g; d /= g;
    return d === 1 ? String(n) : frac(n, d);
  }
  function sup(x) { return '<sup>' + x + '</sup>'; }
  function iN() { return '<i>n</i>'; }
  function expo(e) { return sup(e < 0 ? MOINS + (-e) : e); }
  function unique4(gen) {
    var out = [], vus = {}, essais = 0;
    while (out.length < 4 && essais < 300) {
      var x = gen(out.length); essais++;
      if (!vus[x.q]) { vus[x.q] = 1; out.push(x); }
    }
    return out;
  }
  /* valeur aléatoire sous forme de chaîne (point décimal) : entier ou 1–2 décimales */
  function valAlea() {
    var v = String(rnd(1, 999)), st = rnd(0, 2);
    return st ? deplacer(v, -st) : v;
  }

  /* ================= Séries ================= */

  /* 1 – Écriture décimale de fractions */
  function gen1() {
    var dens = shuffle([2, 4, 5, 8, 10, 20, 25, 50, 100, 1000]), out = [];
    for (var i = 0; i < 4; i++) {
      var d = dens[i], n;
      do { n = rnd(1, Math.min(d * 2, 999)); } while (n % d === 0);
      out.push({ q: 'Donne l\u2019écriture décimale de ' + frac(n, d) + '.', a: frac(n, d) + ' = ' + fr(n / d) });
    }
    return out;
  }

  /* 2 – Comparer des nombres décimaux */
  function decAvec(e) {
    var k = rnd(1, 3), dec = '';
    for (var i = 0; i < k; i++) dec += rnd(0, 9);
    dec = dec.replace(/0+$/, '');
    if (!dec) dec = String(rnd(1, 9));
    return e + '.' + dec;
  }
  function nombresDistincts(n, entiers) {
    var l, ok;
    do {
      l = []; for (var i = 0; i < n; i++) l.push(decAvec(entiers[i % entiers.length]));
      ok = true;
      for (var a = 0; a < n; a++) for (var b = a + 1; b < n; b++) if (parseFloat(l[a]) === parseFloat(l[b])) ok = false;
    } while (!ok);
    return l;
  }
  function gen2() {
    var out = [];
    for (var i = 0; i < 2; i++) {
      var e = rnd(0, 15), p = nombresDistincts(2, [e]), a = p[0], b = p[1];
      out.push({
        q: 'Compare ces deux nombres avec le signe &lt; ou &gt; : ' + frStr(a) + ' &nbsp;…&nbsp; ' + frStr(b),
        a: frStr(a) + ' ' + (parseFloat(a) < parseFloat(b) ? '&lt;' : '&gt;') + ' ' + frStr(b)
      });
    }
    var e1 = rnd(0, 15), l1 = nombresDistincts(4, [e1]);
    var e2 = rnd(0, 15), l2 = nombresDistincts(4, [e2, e2, e2 + 1, e2 + 2]);
    function tri(l, signe, croissant) {
      return l.slice().sort(function (x, y) { return croissant ? x - y : y - x; }).map(frStr).join(' ' + signe + ' ');
    }
    out.push({ q: 'Range ces nombres dans l\u2019ordre croissant : ' + l1.map(frStr).join(' ; '), a: tri(l1, '&lt;', true) });
    out.push({ q: 'Range ces nombres dans l\u2019ordre décroissant : ' + l2.map(frStr).join(' ; '), a: tri(l2, '&gt;', false) });
    return out;
  }

  /* 3 – Calculer avec des nombres décimaux relatifs (valeurs en dixièmes) */
  function tdix(t) { return (t < 0 ? MOINS : '') + frStr(deplacer(String(Math.abs(t)), -1)); }
  function reld(t) { return '(' + (t < 0 ? MOINS : '+') + frStr(deplacer(String(Math.abs(t)), -1)) + ')'; }
  function reli(m) { return '(' + (m < 0 ? MOINS : '+') + Math.abs(m) + ')'; }
  function dixNonNul(max) { var v; do { v = rnd(-max, max); } while (v === 0); return v; }
  function gen3() {
    var a = dixNonNul(99), b = dixNonNul(99);
    var c = dixNonNul(99), d = dixNonNul(99);
    var e = dixNonNul(60), m = rnd(2, 9) * pick([1, -1]);
    var r = dixNonNul(90), dv = rnd(2, 9) * pick([1, -1]);
    return [
      { q: 'Calcule : ' + reld(a) + ' + ' + reld(b), a: tdix(a + b) },
      { q: 'Calcule : ' + reld(c) + ' ' + MOINS + ' ' + reld(d), a: tdix(c - d) },
      { q: 'Calcule : ' + reld(e) + ' \u00d7 ' + reli(m), a: tdix(e * m) },
      { q: 'Calcule : ' + reld(r * dv) + ' \u00f7 ' + reli(dv), a: tdix(r) }
    ];
  }

  /* 5 – Prendre une fraction d'un nombre */
  function gen5() {
    return unique4(function () {
      var d = pick([2, 3, 4, 5, 6, 8, 10]), n, k = rnd(2, 12), N = d * k;
      do { n = rnd(1, d - 1); } while (gcd(n, d) !== 1);
      return { q: 'Calcule ' + frac(n, d) + ' de ' + fr(N) + '.', a: frac(n, d) + ' de ' + fr(N) + ' = ' + fr(n * k) };
    });
  }

  /* 6 – Appliquer un pourcentage simple */
  function gen6() {
    var ps = shuffle([5, 10, 15, 20, 25, 30, 40, 50, 60, 75, 80, 90]);
    var tpl = shuffle([
      function (p, N, r) { return { q: 'Calcule ' + p + NBSP + '% de ' + fr(N) + '.', a: p + NBSP + '% de ' + fr(N) + ' = ' + r }; },
      function (p, N, r) { return { q: 'Un article coûte ' + fr(N) + ' \u20ac. On applique une remise de ' + p + NBSP + '%. Quel est le montant de la remise ?', a: r + ' \u20ac' }; },
      function (p, N, r) { return { q: 'Un collège compte ' + fr(N) + ' élèves, dont ' + p + NBSP + '% sont demi-pensionnaires. Combien d\u2019élèves sont demi-pensionnaires ?', a: r + ' élèves' }; },
      function (p, N, r) { return { q: 'Un sac contient ' + fr(N) + ' billes et ' + p + NBSP + '% sont rouges. Combien y a-t-il de billes rouges ?', a: r + ' billes' }; }
    ]);
    return tpl.map(function (f, i) {
      var p = ps[i], step = 100 / gcd(p, 100), N = step * rnd(1, Math.max(1, Math.floor(400 / step)));
      return f(p, N, fr(N * p / 100));
    });
  }

  /* 7 – Écrire un nombre sous de multiples formes */
  var FORMES = [[1, 2, '0,5', '50'], [1, 4, '0,25', '25'], [3, 4, '0,75', '75'], [1, 5, '0,2', '20'], [2, 5, '0,4', '40'],
    [3, 5, '0,6', '60'], [4, 5, '0,8', '80'], [1, 10, '0,1', '10'], [3, 10, '0,3', '30'], [7, 10, '0,7', '70'],
    [9, 10, '0,9', '90'], [1, 20, '0,05', '5'], [3, 20, '0,15', '15'], [7, 20, '0,35', '35'], [1, 8, '0,125', '12,5'],
    [3, 8, '0,375', '37,5'], [1, 50, '0,02', '2']];
  function montrer(it, f) { return f === 'f' ? frac(it[0], it[1]) : f === 'd' ? it[2] : it[3] + NBSP + '%'; }
  function gen7() {
    var phrase = { f: 'sous la forme d\u2019une fraction irréductible', d: 'sous forme décimale', p: 'sous forme de pourcentage' };
    return shuffle(FORMES).slice(0, 4).map(function (it) {
      var de = pick(['f', 'd', 'p']), vers;
      do { vers = pick(['f', 'd', 'p']); } while (vers === de);
      return { q: 'Écris ' + montrer(it, de) + ' ' + phrase[vers] + '.', a: montrer(it, de) + ' = ' + montrer(it, vers) };
    });
  }

  /* 8 – Écriture décimale -> écriture scientifique */
  function gen8() {
    var es = shuffle([rnd(2, 8), rnd(2, 8), -rnd(1, 7), -rnd(1, 7)]);
    return es.map(function (e) {
      var k = rnd(0, 2), M;
      do { M = rnd(Math.pow(10, k), Math.pow(10, k + 1) - 1); } while (k > 0 && M % 10 === 0);
      var mant = k === 0 ? String(M) : deplacer(String(M), -k);
      var val = deplacer(String(M), e - k);
      return { q: 'Écris ' + frStr(val) + ' en écriture scientifique.', a: frStr(val) + ' = ' + frStr(mant) + ' \u00d7 10' + expo(e) };
    });
  }

  /* 9 – Carrés de 1 à 12 */
  function gen9() {
    var ns = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 4);
    return [
      { q: 'Calcule ' + ns[0] + sup(2) + '.', a: ns[0] + sup(2) + ' = ' + ns[0] * ns[0] },
      { q: 'Calcule ' + ns[1] + sup(2) + '.', a: ns[1] + sup(2) + ' = ' + ns[1] * ns[1] },
      { q: 'Quel nombre positif a pour carré ' + ns[2] * ns[2] + ' ?', a: ns[2] + ' (car ' + ns[2] + sup(2) + ' = ' + ns[2] * ns[2] + ')' },
      { q: 'Quel nombre positif a pour carré ' + ns[3] * ns[3] + ' ?', a: ns[3] + ' (car ' + ns[3] + sup(2) + ' = ' + ns[3] * ns[3] + ')' }
    ];
  }

  /* 10 – Critères de divisibilité par 2, 3, 5, 9 */
  function gen10() {
    return shuffle([2, 3, 5, 9]).map(function (c) {
      var oui = Math.random() < 0.5, n;
      do { n = rnd(100, 9999); } while ((n % c === 0) !== oui);
      var ch = String(n).split(''), s = 0, last = ch[ch.length - 1];
      ch.forEach(function (x) { s += +x; });
      var somme = ch.join(' + ') + ' = ' + s, rep;
      if (c === 2) rep = oui ? 'Oui, car son dernier chiffre (' + last + ') est pair.' : 'Non, car son dernier chiffre (' + last + ') est impair.';
      else if (c === 5) rep = oui ? 'Oui, car il se termine par ' + last + '.' : 'Non, car il se termine par ' + last + ' (ni 0 ni 5).';
      else rep = oui ? 'Oui, car ' + somme + ' et ' + s + ' est un multiple de ' + c + '.' : 'Non, car ' + somme + ' et ' + s + ' n\u2019est pas un multiple de ' + c + '.';
      return { q: 'Le nombre ' + frStr(String(n)) + ' est-il divisible par ' + c + ' ? Justifie.', a: rep };
    });
  }

  /* 11 – double, triple, moitié, prédécesseur, successeur, carré */
  var PROPS = [
    { nom: 'le double de', sym: '2' + iN(), f: function (n) { return 2 * n; } },
    { nom: 'le triple de', sym: '3' + iN(), f: function (n) { return 3 * n; } },
    { nom: 'la moitié de', sym: frac(iN(), 2), f: function (n) { return n / 2; }, pair: true },
    { nom: 'le prédécesseur de', sym: iN() + ' ' + MOINS + ' 1', f: function (n) { return n - 1; } },
    { nom: 'le successeur de', sym: iN() + ' + 1', f: function (n) { return n + 1; } },
    { nom: 'le carré de', sym: iN() + sup(2), f: function (n) { return n * n; } }
  ];
  function gen11() {
    return shuffle(PROPS).slice(0, 4).map(function (p) {
      if (Math.random() < 0.5) {
        return { q: 'Pour un nombre entier ' + iN() + ', exprime ' + p.nom + ' ' + iN() + ' en fonction de ' + iN() + '.', a: p.sym };
      }
      var n = p.pair ? 2 * rnd(2, 10) : rnd(2, 20);
      return { q: 'Pour ' + iN() + ' = ' + n + ', calcule ' + p.nom + ' ' + iN() + '.', a: p.sym + ' = ' + p.f(n) };
    });
  }

  /* 19 – Triangles, quadrilatères particuliers, médiatrice */
  var BANQUE19 = [
    ['Comment s\u2019appelle un triangle qui a trois côtés de même longueur ?', 'Un triangle équilatéral.'],
    ['Comment s\u2019appelle un triangle qui a deux côtés de même longueur ?', 'Un triangle isocèle.'],
    ['Comment s\u2019appelle un triangle qui a un angle droit ?', 'Un triangle rectangle.'],
    ['Comment s\u2019appelle un triangle qui a un angle droit et deux côtés de même longueur ?', 'Un triangle rectangle isocèle.'],
    ['Un triangle a trois angles de 60°. Quelle est sa nature ?', 'Il est équilatéral.'],
    ['Comment s\u2019appelle un triangle dont les trois côtés ont des longueurs différentes ?', 'Un triangle quelconque.'],
    ['Comment s\u2019appelle un quadrilatère qui a quatre angles droits ?', 'Un rectangle.'],
    ['Comment s\u2019appelle un quadrilatère qui a quatre côtés de même longueur ?', 'Un losange.'],
    ['Comment s\u2019appelle un quadrilatère qui a quatre côtés de même longueur et quatre angles droits ?', 'Un carré.'],
    ['Comment s\u2019appelle un quadrilatère dont les côtés opposés sont parallèles deux à deux ?', 'Un parallélogramme.'],
    ['Comment s\u2019appelle un quadrilatère qui a seulement deux côtés parallèles ?', 'Un trapèze.'],
    ['Un quadrilatère a ses diagonales perpendiculaires qui se coupent en leur milieu. Quelle est sa nature ?', 'C\u2019est un losange.'],
    ['Un quadrilatère a ses diagonales de même longueur qui se coupent en leur milieu. Quelle est sa nature ?', 'C\u2019est un rectangle.'],
    ['Comment s\u2019appelle la droite qui passe par le milieu d\u2019un segment et qui lui est perpendiculaire ?', 'La médiatrice du segment.'],
    ['Tout point de la médiatrice d\u2019un segment [AB] est situé à quelle distance de A et de B ?', 'À la même distance de A et de B.']
  ];
  function gen19() { return shuffle(BANQUE19).slice(0, 4).map(function (x) { return { q: x[0], a: x[1] }; }); }

  /* 20 – Reconnaître et citer des angles */
  var NATURES = {
    aigu: { nom: 'aigu', gen: function () { return rnd(5, 89); }, ex: 'Il mesure moins de 90°' },
    droit: { nom: 'droit', gen: function () { return 90; }, ex: 'Il mesure exactement 90°' },
    obtus: { nom: 'obtus', gen: function () { return rnd(91, 175); }, ex: 'Il mesure entre 90° et 180°' },
    plat: { nom: 'plat', gen: function () { return 180; }, ex: 'Il mesure exactement 180°' }
  };
  var BANQUE20 = [
    ['Comment appelle-t-on un angle qui mesure 90° ?', 'Un angle droit.'],
    ['Comment appelle-t-on un angle dont la mesure est inférieure à 90° ?', 'Un angle aigu.'],
    ['Comment appelle-t-on un angle dont la mesure est comprise entre 90° et 180° ?', 'Un angle obtus.'],
    ['Comment appelle-t-on un angle qui mesure 180° ?', 'Un angle plat.'],
    ['Comment appelle-t-on deux angles dont la somme est égale à 90° ?', 'Des angles complémentaires.'],
    ['Comment appelle-t-on deux angles dont la somme est égale à 180° ?', 'Des angles supplémentaires.'],
    ['Deux angles sont opposés par le sommet. Que peut-on dire de leurs mesures ?', 'Elles sont égales.']
  ];
  function gen20() {
    var cs = shuffle(['aigu', 'droit', 'obtus', 'plat']).slice(0, 2), out = [];
    cs.forEach(function (c) {
      var m = NATURES[c].gen();
      out.push({ q: 'Un angle mesure ' + m + '°. Est-il aigu, droit, obtus ou plat ?', a: 'C\u2019est un angle ' + NATURES[c].nom + ' (' + NATURES[c].ex.toLowerCase() + ').' });
    });
    var b = pick(BANQUE20);
    out.push({ q: b[0], a: b[1] });
    if (Math.random() < 0.5) {
      var x = rnd(5, 85);
      out.push({ q: 'Deux angles sont complémentaires. L\u2019un mesure ' + x + '°. Combien mesure l\u2019autre ?', a: '90° ' + MOINS + ' ' + x + '° = ' + (90 - x) + '°' });
    } else {
      var y = rnd(10, 170);
      out.push({ q: 'Deux angles sont supplémentaires. L\u2019un mesure ' + y + '°. Combien mesure l\u2019autre ?', a: '180° ' + MOINS + ' ' + y + '° = ' + (180 - y) + '°' });
    }
    return shuffle(out);
  }

  /* 21 – Troisième angle d'un triangle */
  function gen21() {
    var noms = shuffle(['ABC', 'DEF', 'GHI', 'MNP', 'RST', 'XYZ']);
    return unique4(function (i) {
      var a, b;
      do { a = rnd(20, 100); b = rnd(20, 100); } while (a + b > 160);
      var t = noms[i];
      return {
        q: 'Dans le triangle <i>' + t + '</i>, l\u2019angle en <i>' + t[0] + '</i> mesure ' + a + '° et l\u2019angle en <i>' + t[1] + '</i> mesure ' + b + '°. Calcule la mesure de l\u2019angle en <i>' + t[2] + '</i>.',
        a: '180° ' + MOINS + ' ' + a + '° ' + MOINS + ' ' + b + '° = ' + (180 - a - b) + '°'
      };
    });
  }

  /* 22, 23, 24 – Conversions */
  function genConversion(unites, pas, maxPas) {
    return unique4(function () {
      var i = rnd(0, unites.length - 1), j;
      do { j = rnd(0, unites.length - 1); } while (j === i || Math.abs(j - i) > maxPas);
      var v = valAlea(), res = deplacer(v, (j - i) * pas);
      return {
        q: 'Convertis ' + frStr(v) + NBSP + unites[i] + ' en ' + unites[j] + '.',
        a: frStr(v) + NBSP + unites[i] + ' = ' + frStr(res) + NBSP + unites[j]
      };
    });
  }
  function gen22() { return genConversion(['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'], 1, 3); }
  function gen23() { return genConversion(['km\u00b2', 'hm\u00b2', 'dam\u00b2', 'm\u00b2', 'dm\u00b2', 'cm\u00b2', 'mm\u00b2'], 2, 2); }
  function gen24() { return genConversion(['m\u00b3', 'dm\u00b3', 'cm\u00b3', 'mm\u00b3'], 3, 2); }

  /* 25 – s, min, h, jour */
  function plur(k, mot) { return fr(k) + ' ' + (mot === 'jour' && k >= 2 ? 'jours' : mot); }
  var G25 = [
    function () { var k = pick([2, 3, 4, 5, 6, 8, 10, 12, 15, 1.5, 2.5]); return { q: 'Convertis ' + plur(k, 'min') + ' en secondes.', a: plur(k, 'min') + ' = ' + fr(k * 60) + ' s' }; },
    function () { var k = pick([2, 3, 4, 5, 6, 8, 0.5, 1.5, 2.5, 0.25, 0.75]); return { q: 'Convertis ' + plur(k, 'h') + ' en minutes.', a: plur(k, 'h') + ' = ' + fr(k * 60) + ' min' }; },
    function () { var k = rnd(1, 5); return { q: 'Convertis ' + plur(k, 'h') + ' en secondes.', a: plur(k, 'h') + ' = ' + fr(k * 3600) + ' s' }; },
    function () { var k = pick([2, 3, 4, 5, 7, 1.5]); return { q: 'Convertis ' + plur(k, 'jour') + ' en heures.', a: plur(k, 'jour') + ' = ' + fr(k * 24) + ' h' }; },
    function () { var k = pick([1, 2, 3]); return { q: 'Convertis ' + plur(k, 'jour') + ' en minutes.', a: plur(k, 'jour') + ' = ' + fr(k * 1440) + ' min' }; },
    function () { var m = rnd(2, 20); return { q: 'Convertis ' + fr(m * 60) + ' s en minutes.', a: fr(m * 60) + ' s = ' + m + ' min' }; },
    function () { var h = rnd(2, 6); return { q: 'Convertis ' + fr(h * 60) + ' min en heures.', a: fr(h * 60) + ' min = ' + h + ' h' }; },
    function () { var j = rnd(2, 5); return { q: 'Convertis ' + fr(j * 24) + ' h en jours.', a: fr(j * 24) + ' h = ' + j + ' jours' }; }
  ];
  function gen25() { return shuffle(G25).slice(0, 4).map(function (f) { return f(); }); }

  /* 26 – dm³, L, m³ */
  function gen26() {
    return shuffle([
      function () { var v = valAlea(); return { q: 'Convertis ' + frStr(v) + NBSP + 'dm\u00b3 en litres.', a: frStr(v) + NBSP + 'dm\u00b3 = ' + frStr(v) + NBSP + 'L' }; },
      function () { var v = valAlea(); return { q: 'Convertis ' + frStr(v) + NBSP + 'L en dm\u00b3.', a: frStr(v) + NBSP + 'L = ' + frStr(v) + NBSP + 'dm\u00b3' }; },
      function () { var v = valAlea(); return { q: 'Convertis ' + frStr(v) + NBSP + 'm\u00b3 en litres.', a: frStr(v) + NBSP + 'm\u00b3 = ' + frStr(deplacer(v, 3)) + NBSP + 'L' }; },
      function () { var v = String(rnd(1, 99) * 100); return { q: 'Convertis ' + frStr(v) + NBSP + 'L en m\u00b3.', a: frStr(v) + NBSP + 'L = ' + frStr(deplacer(v, -3)) + NBSP + 'm\u00b3' }; }
    ]).map(function (f) { return f(); });
  }

  /* 27 – Probabilités simples */
  var COULEURS = [{ p: 'rouges', s: 'rouge' }, { p: 'bleues', s: 'bleue' }, { p: 'vertes', s: 'verte' }, { p: 'jaunes', s: 'jaune' }];
  function boules(k, c) { return k + ' boule' + (k > 1 ? 's ' + c.p : ' ' + c.s); }
  function urne() {
    var cs = shuffle(COULEURS).slice(0, 3), n = [rnd(1, 8), rnd(1, 8), rnd(1, 8)], tot = n[0] + n[1] + n[2];
    return { cs: cs, n: n, tot: tot, txt: 'Une urne contient ' + boules(n[0], cs[0]) + ', ' + boules(n[1], cs[1]) + ' et ' + boules(n[2], cs[2]) + '. On tire une boule au hasard.' };
  }
  var DE = [['un nombre pair', 3], ['un nombre impair', 3], ['un multiple de 3', 2], ['un nombre supérieur ou égal à 5', 2],
    ['le nombre 6', 1], ['un nombre premier', 3], ['un nombre strictement inférieur à 3', 2]];
  var CARTES = [['un c\u0153ur', 8], ['un roi', 4], ['une carte rouge', 16], ['un as', 4], ['une figure (valet, dame ou roi)', 12]];
  var ROUE = [['un nombre pair', 5], ['un multiple de 5', 2], ['un nombre supérieur à 7', 3], ['un nombre premier', 4]];
  function gen27() {
    var u1 = urne(), i1 = rnd(0, 2);
    var u2 = urne(), i2 = rnd(0, 2);
    var d = pick(DE), q4;
    var t = pick(['cartes', 'roue', 'impossible']);
    if (t === 'cartes') {
      var c = pick(CARTES);
      q4 = { q: 'On tire une carte au hasard dans un jeu de 32 cartes. Quelle est la probabilité d\u2019obtenir ' + c[0] + ' ?', a: 'P = ' + fracSimple(c[1], 32) };
    } else if (t === 'roue') {
      var r = pick(ROUE);
      q4 = { q: 'Une roue est partagée en 10 secteurs identiques numérotés de 1 à 10. On la fait tourner. Quelle est la probabilité d\u2019obtenir ' + r[0] + ' ?', a: 'P = ' + fracSimple(r[1], 10) };
    } else {
      var cs = shuffle(COULEURS).slice(0, 3), a = rnd(2, 8), b = rnd(2, 8);
      q4 = { q: 'Une urne contient ' + boules(a, cs[0]) + ' et ' + boules(b, cs[1]) + '. On tire une boule au hasard. Quelle est la probabilité d\u2019obtenir une boule ' + cs[2].s + ' ?', a: 'P = 0 (événement impossible)' };
    }
    return [
      { q: u1.txt + ' Quelle est la probabilité d\u2019obtenir une boule ' + u1.cs[i1].s + ' ?', a: 'P = ' + fracSimple(u1.n[i1], u1.tot) },
      { q: u2.txt + ' Quelle est la probabilité d\u2019obtenir une boule qui n\u2019est pas ' + u2.cs[i2].s + ' ?', a: 'P = ' + fracSimple(u2.tot - u2.n[i2], u2.tot) },
      { q: 'On lance un dé équilibré à 6 faces. Quelle est la probabilité d\u2019obtenir ' + d[0] + ' ?', a: 'P = ' + fracSimple(d[1], 6) },
      q4
    ];
  }

  /* 29 – Proportionnalité ou non */
  var CONTEXTES = [{ x: 'Nombre de stylos', y: 'Prix (\u20ac)' }, { x: 'Masse de pommes (kg)', y: 'Prix (\u20ac)' },
    { x: 'Durée (h)', y: 'Distance (km)' }, { x: 'Nombre de places', y: 'Prix (\u20ac)' }];
  function ratio(y, x) {
    var r = y / x, rr = Math.round(r * 100) / 100;
    return fr(y) + ' \u00f7 ' + fr(x) + (Math.abs(rr - r) < 1e-9 ? ' = ' : ' \u2248 ') + fr(rr);
  }
  function questionTableau(prop) {
    var ctx = pick(CONTEXTES), nb = rnd(3, 4);
    var xs = shuffle([1, 2, 3, 4, 5, 6, 8, 10, 12]).slice(0, nb).sort(function (a, b) { return a - b; });
    var k = pick(prop ? [2, 3, 4, 5, 1.5, 2.5] : [2, 3, 4, 5]), c = pick([1, 2, 3, 4, 5]);
    var ys = xs.map(function (x) { return prop ? k * x : k * x + c; });
    var h = '<table class="tableau-prop"><tbody><tr><th scope="row">' + ctx.x + '</th>';
    xs.forEach(function (x) { h += '<td>' + fr(x) + '</td>'; });
    h += '</tr><tr><th scope="row">' + ctx.y + '</th>';
    ys.forEach(function (y) { h += '<td>' + fr(y) + '</td>'; });
    h += '</tr></tbody></table>';
    var rep = prop
      ? 'Oui : tous les quotients sont égaux (' + xs.map(function (x, i) { return ratio(ys[i], x); }).join(' ; ') + ').'
      : 'Non : les quotients ne sont pas égaux (' + ratio(ys[0], xs[0]) + ' alors que ' + ratio(ys[1], xs[1]) + ').';
    return { q: 'Ce tableau est-il un tableau de proportionnalité ? Justifie.' + h, a: rep };
  }
  var SIT_OUI = [
    ['Les poires coûtent 3,20 \u20ac le kilogramme. Le prix à payer est-il proportionnel à la masse achetée ?', 'Oui : le prix se calcule en multipliant la masse par 3,20 \u20ac/kg.'],
    ['Un cycliste roule à vitesse constante. La distance parcourue est-elle proportionnelle à la durée du trajet ?', 'Oui : la distance est égale à la vitesse multipliée par la durée.'],
    ['Le périmètre d\u2019un carré est-il proportionnel à la longueur de son côté ?', 'Oui : P = 4 \u00d7 côté.'],
    ['Une recette demande 200 g de farine pour 4 personnes. La quantité de farine est-elle proportionnelle au nombre de personnes ?', 'Oui : il faut 50 g de farine par personne.'],
    ['Une place de cinéma coûte 8 \u20ac. Le prix à payer est-il proportionnel au nombre de places ?', 'Oui : prix = 8 \u20ac \u00d7 nombre de places.'],
    ['Le périmètre d\u2019un cercle est-il proportionnel à son diamètre ?', 'Oui : P = \u03c0 \u00d7 diamètre.']
  ];
  var SIT_NON = [
    ['L\u2019aire d\u2019un carré est-elle proportionnelle à la longueur de son côté ?', 'Non : pour un côté de 2 cm l\u2019aire est 4 cm\u00b2, mais pour un côté de 4 cm elle est 16 cm\u00b2 (et non 8 cm\u00b2).'],
    ['La taille d\u2019un enfant est-elle proportionnelle à son âge ?', 'Non : un enfant de 2 ans ne mesure pas deux fois moins qu\u2019un enfant de 4 ans, et la taille cesse de grandir à l\u2019âge adulte.'],
    ['Un taxi facture 3 \u20ac de prise en charge puis 2 \u20ac par kilomètre. Le prix est-il proportionnel à la distance ?', 'Non : pour 0 km on paie déjà 3 \u20ac, et 10 km coûtent 23 \u20ac alors que 5 km coûtent 13 \u20ac (et non 11,5 \u20ac).'],
    ['Une salle de sport demande 15 \u20ac d\u2019inscription puis 10 \u20ac par mois. Le prix payé est-il proportionnel au nombre de mois ?', 'Non : à cause des 15 \u20ac d\u2019inscription, 2 mois coûtent 35 \u20ac et non le double de 1 mois (25 \u20ac).'],
    ['L\u2019âge d\u2019une personne est-il proportionnel à sa masse ?', 'Non : la masse ne double pas quand l\u2019âge double.']
  ];
  function gen29() {
    var t1 = Math.random() < 0.5, s1 = Math.random() < 0.5, a = pick(s1 ? SIT_OUI : SIT_NON), b = pick(s1 ? SIT_NON : SIT_OUI);
    return shuffle([questionTableau(t1), questionTableau(!t1), { q: a[0], a: a[1] }, { q: b[0], a: b[1] }]);
  }

  /* ================= Déclaration des séries ================= */
  var TOTAL = 32;
  var TITRES = {
    1: 'Écriture décimale de fractions',
    2: 'Comparer des nombres décimaux',
    3: 'Calculer avec des nombres décimaux relatifs',
    5: 'Prendre une fraction d\u2019un nombre',
    6: 'Appliquer un pourcentage simple',
    7: 'Écrire un nombre sous de multiples formes',
    8: 'Passer de l\u2019écriture décimale à l\u2019écriture scientifique',
    9: 'Connaître les carrés des nombres entiers de 1 à 12',
    10: 'Appliquer les critères de divisibilité par 2, 3, 5, 9',
    11: 'Pour un entier n : double, triple, moitié, prédécesseur, successeur, carré',
    19: 'Identifier des triangles, des quadrilatères particuliers, une médiatrice',
    20: 'Reconnaître et citer des angles',
    21: 'Calculer la mesure du troisième angle d\u2019un triangle',
    22: 'Convertir des longueurs',
    23: 'Convertir des aires',
    24: 'Convertir des volumes',
    25: 'Connaître les correspondances entre s, min, h et jour',
    26: 'Connaître les correspondances entre dm\u00b3, L et m\u00b3, L',
    27: 'Calculer des probabilités simples',
    29: 'Reconnaître si une situation est de la proportionnalité ou non'
  };
  var GEN = { 1: gen1, 2: gen2, 3: gen3, 5: gen5, 6: gen6, 7: gen7, 8: gen8, 9: gen9, 10: gen10, 11: gen11,
    19: gen19, 20: gen20, 21: gen21, 22: gen22, 23: gen23, 24: gen24, 25: gen25, 26: gen26, 27: gen27, 29: gen29 };

  /* ================= Leçons liées à chaque série =================
     Clé = numéro de série. Pour chaque leçon : un titre et le chemin de l'image.
     Exemple :  '5': [ { titre: 'Les fractions', image: 'images/3emes/lecons/fractions.png' } ]  */
  var LECONS = {
    '1': [{ titre: 'Leçon liée à la série 1 (titre à définir)', image: 'images/3emes/lecons/lecon-1A.png' }]
  };

  if (typeof module !== 'undefined' && module.exports) { module.exports = { GEN: GEN, TITRES: TITRES }; }
  if (typeof document === 'undefined') return;

  /* ================= Interface ================= */
  var selSerie = document.getElementById('autotips-serie');
  if (!selSerie) return;
  var zone = document.getElementById('autotips-zone');
  var titre = document.getElementById('autotips-titre');
  var liste = document.getElementById('autotips-questions');
  var btnCorr = document.getElementById('autotips-correction-btn');
  var btnNouv = document.getElementById('autotips-nouveau');
  var selLecon = document.getElementById('autotips-lecon');
  var figLecon = document.getElementById('autotips-lecon-figure');
  var imgLecon = document.getElementById('autotips-lecon-image');
  var absLecon = document.getElementById('autotips-lecon-absent');
  var corrige = false;

  function option(valeur, texte, desactive) {
    var o = document.createElement('option');
    o.value = valeur; o.textContent = texte; o.disabled = !!desactive;
    return o;
  }
  selSerie.appendChild(option('', 'Choisir une série\u2026'));
  for (var n = 1; n <= TOTAL; n++) {
    selSerie.appendChild(TITRES[n] ? option(String(n), n + ' \u2013 ' + TITRES[n]) : option(String(n), n + ' \u2013 (bientôt disponible)', true));
  }

  function majBoutonCorrection() {
    btnCorr.setAttribute('aria-expanded', corrige ? 'true' : 'false');
    btnCorr.textContent = corrige ? 'Masquer la correction' : 'Afficher la correction';
    Array.prototype.forEach.call(liste.querySelectorAll('.reponse'), function (r) { r.hidden = !corrige; });
  }

  function majLecons() {
    var n = selSerie.value, l = (n && LECONS[n]) || [];
    selLecon.innerHTML = '';
    figLecon.hidden = true;
    selLecon.appendChild(option('', !n ? 'Choisis d\u2019abord une série' : l.length ? 'Choisir une leçon\u2026' : 'Aucune leçon pour cette série'));
    l.forEach(function (x, i) { selLecon.appendChild(option(String(i), x.titre)); });
    selLecon.disabled = !l.length;
  }

  function afficherSerie() {
    var n = parseInt(selSerie.value, 10);
    corrige = false;
    if (!n) { zone.hidden = true; liste.innerHTML = ''; majBoutonCorrection(); majLecons(); return; }
    titre.textContent = 'Série ' + n + ' : ' + TITRES[n];
    liste.innerHTML = '';
    GEN[n]().forEach(function (x, i) {
      var li = document.createElement('li');
      var q = document.createElement('div'); q.className = 'enonce'; q.innerHTML = x.q;
      var champ = document.createElement('input');
      champ.type = 'text'; champ.className = 'champ-reponse'; champ.autocomplete = 'off';
      champ.setAttribute('aria-label', 'Ta réponse à la question ' + (i + 1));
      champ.placeholder = 'Ta réponse';
      var rep = document.createElement('div'); rep.className = 'reponse'; rep.hidden = true;
      rep.innerHTML = '<strong>Correction :</strong> ' + x.a;
      li.appendChild(q); li.appendChild(champ); li.appendChild(rep);
      liste.appendChild(li);
    });
    zone.hidden = false;
    majBoutonCorrection();
    majLecons();
  }

  function afficherLecon() {
    var l = (LECONS[selSerie.value] || [])[parseInt(selLecon.value, 10)];
    if (!l) { figLecon.hidden = true; return; }
    figLecon.hidden = false; absLecon.hidden = true; imgLecon.hidden = false;
    imgLecon.alt = 'Leçon : ' + l.titre;
    imgLecon.src = l.image;
  }

  imgLecon.addEventListener('error', function () { imgLecon.hidden = true; absLecon.hidden = false; });
  selSerie.addEventListener('change', afficherSerie);
  btnNouv.addEventListener('click', afficherSerie);
  btnCorr.addEventListener('click', function () { corrige = !corrige; majBoutonCorrection(); });
  selLecon.addEventListener('change', afficherLecon);
  afficherSerie();
})();
