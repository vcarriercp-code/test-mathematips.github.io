/* Données des séquences de 3ème.
   Une seule page (sequence.html?n=1, ?n=2…) affiche la séquence demandée à partir de ces données.
   Pour compléter une séquence : remplir « objectifs », « outils » et « ateliers ».
   Dès qu'une séquence a du contenu, elle devient un lien dans la liste de la page 3èmes.
   - outils   : { texte, url }          (leçons, roue, flashcards…)
   - ateliers : { nom, url, correction } (correction = adresse de la correction, laisser '' si pas encore prête) */
var SEQUENCES = [
  {
    n: 1, titre: 'Calculer avec des fractions',
    objectifs: ['Additionner et soustraire des fractions', 'Multiplier des fractions', 'Diviser des fractions'],
    outils: [
      { texte: 'Leçon C1 : Additionner et soustraire des fractions', url: 'https://ldelaporte.wixsite.com/mathematips/3-lecons/calculer-avec-des-fractions-c1' },
      { texte: 'Leçon C2 : Multiplier des fractions', url: 'https://ldelaporte.wixsite.com/mathematips/3-lecons/calculer-avec-des-fractions-c2' },
      { texte: 'Leçon C3 : Diviser des fractions', url: 'https://ldelaporte.wixsite.com/mathematips/3-lecons/calculer-avec-des-fractions-c3' },
      { texte: 'Roue à manipuler', url: 'https://ldelaporte.wixsite.com/mathematips/3-lecons/calculer-avec-des-fractions-roue-interactive' },
      { texte: 'Créer tes propres flashcards', url: 'https://ldelaporte.wixsite.com/mathematips/3-lecons/calculer-avec-des-fractions-flashcards' }
    ],
    ateliers: [
      { nom: 'Atelier A : Cartes à pince', url: 'https://ldelaporte.wixsite.com/mathematips/exercices/calculer-avec-des-fractions/atelier-a', correction: '' },
      { nom: 'Atelier B : Dominos', url: 'https://ldelaporte.wixsite.com/mathematips/exercices/sequence-1-calculer-avec-des-fraction/atelier-b', correction: '' },
      { nom: 'Atelier C : Associer des paires', url: 'https://ldelaporte.wixsite.com/mathematips/exercices/sequence-1-calculer-avec-des-fractions/atelier-c-association-de-paires', correction: '' },
      { nom: 'Atelier D : Cartes autocorrectives', url: 'https://ldelaporte.wixsite.com/mathematips/exercices/sequence-1-calculer-avec-des-fractions/atelier-d-flashcards', correction: '' },
      { nom: 'Atelier E : Chercher l’erreur', url: 'https://ldelaporte.wixsite.com/mathematips/exercices/sequence-1-calculer-avec-des-fractions/atelier-e-flashcards', correction: '' },
      { nom: 'Atelier F : Labyrinthe', url: 'https://ldelaporte.wixsite.com/mathematips/exercices/sequence-1-calculer-avec-des-fractions/atelier-f-labyrinthe', correction: '' },
      { nom: 'Atelier G : Fiche de calculs', url: 'https://ldelaporte.wixsite.com/mathematips/exercices/sequence-1-calculer-avec-des-fractions/atelier-g-fiche-de-calculs', correction: '' }
    ]
  },
  {
    n: 2, titre: 'Calcul littéral 1',
    objectifs: [
      'Développer avec la simple distributivité',
      'Factoriser avec un facteur commun',
      'Réduire des expressions avec ou sans parenthèses',
      'Calculer la valeur d’une expression littérale avec un nombre donné'
    ],
    outils: [
      { texte: 'Leçon C4 : Réduire des expressions sans parenthèses', url: 'https://ldelaporte.wixsite.com/mathematips/3-lecons/calcul-litteral-1-c4-sans' },
      { texte: 'Leçon C4 : Réduire des expressions avec parenthèses', url: 'https://ldelaporte.wixsite.com/mathematips/3-lecons/calcul-litteral-1-c4' },
      { texte: 'Leçon C5 : Développer des expressions', url: 'https://ldelaporte.wixsite.com/mathematips/3-lecons/calcul-litteral-1-c5' },
      { texte: 'Leçon C6 : Factoriser des expressions', url: 'https://ldelaporte.wixsite.com/mathematips/3-lecons/calcul-litteral-1-c6' }
    ],
    ateliers: [
      { nom: 'Atelier A : Expressions à relier', url: 'https://ldelaporte.wixsite.com/mathematips/exercices/sequence-2-calcul-litteral-1/atelier-a-expression-%C3%A0-relier', correction: '' },
      { nom: 'Atelier B : Cartes autocorrectrices', url: 'https://ldelaporte.wixsite.com/mathematips/exercices/sequence-2-calcul-litteral-1/atelier-b-flashcards', correction: '' },
      { nom: 'Atelier C : Associer des paires', url: 'https://ldelaporte.wixsite.com/mathematips/exercices/sequence-2-calcul-litteral-1/atelier-c-association-de-paires', correction: '' },
      { nom: 'Atelier D : Dominos', url: 'https://ldelaporte.wixsite.com/mathematips/exercices/sequence-2-calcul-litteral-1/atelier-d-dominos', correction: '' },
      { nom: 'Atelier E : Cluedo', url: 'https://ldelaporte.wixsite.com/mathematips/exercices/sequence-2-calcul-litteral-1/atelier-e-cluedo', correction: '' },
      { nom: 'Atelier G : Exercices', url: 'https://ldelaporte.wixsite.com/mathematips/exercices/sequence-2-calcul-litteral-1/atelier-g-exercices', correction: '' }
    ]
  },
  { n: 3, titre: 'Statistiques', objectifs: [], outils: [], ateliers: [] },
  { n: 4, titre: 'Puissances', objectifs: [], outils: [], ateliers: [] },
  { n: 5, titre: 'Pythagore', objectifs: [], outils: [], ateliers: [] },
  { n: 6, titre: 'Équation 1', objectifs: [], outils: [], ateliers: [] },
  { n: 7, titre: 'Probabilités', objectifs: [], outils: [], ateliers: [] },
  { n: 8, titre: 'Fonction', objectifs: [], outils: [], ateliers: [] },
  { n: 9, titre: 'Thalès', objectifs: [], outils: [], ateliers: [] },
  { n: 10, titre: 'Arithmétique', objectifs: [], outils: [], ateliers: [] },
  { n: 11, titre: 'Équation 2', objectifs: [], outils: [], ateliers: [] },
  { n: 12, titre: 'Trigonométrie', objectifs: [], outils: [], ateliers: [] },
  { n: 13, titre: 'Calcul littéral 2', objectifs: [], outils: [], ateliers: [] },
  { n: 14, titre: 'Transformation', objectifs: [], outils: [], ateliers: [] },
  { n: 15, titre: 'Fonctions linéaires et affines', objectifs: [], outils: [], ateliers: [] },
  { n: 16, titre: 'Espaces', objectifs: [], outils: [], ateliers: [] },
  { n: 17, titre: 'Repérage dans l’espace', objectifs: [], outils: [], ateliers: [] }
];

function sequenceAContenu(s) {
  return s.objectifs.length > 0 || s.outils.length > 0 || s.ateliers.length > 0;
}

/* Page 3èmes : la liste des séquences se construit toute seule à partir des données ci-dessus */
(function () {
  if (typeof document === 'undefined') return;
  var ul = document.getElementById('liste-sequences');
  if (!ul) return;
  ul.innerHTML = '';
  SEQUENCES.forEach(function (s) {
    var li = document.createElement('li');
    var texte = 'Séquence ' + s.n + ' : ' + s.titre;
    if (sequenceAContenu(s)) {
      var a = document.createElement('a');
      a.href = 'sequence.html?n=' + s.n;
      a.textContent = texte;
      li.appendChild(a);
    } else {
      li.textContent = texte;
    }
    ul.appendChild(li);
  });
})();
