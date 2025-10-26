const levelTag = document.getElementById("levelTag");
const triesEl = document.getElementById("tries");
const wordEl = document.getElementById("word");
const usedEl = document.getElementById("used");
const hintEl = document.getElementById("hint");
const keyboardEl = document.getElementById("keyboard");

const btnRestart = document.getElementById("btnRestart");
const btnHome = document.getElementById("btnHome");

// Récupération du niveau 
const urlParams = new URLSearchParams(window.location.search);
const level = urlParams.get("level") || "soft";

// On affiche le niveau dans le header
levelTag.textContent = `Niveau : ${level === "hard" ? "Hard" : "Soft"}`;

// Variables de jeu
let currentWord = "";
let hiddenWord = [];
let usedLetters = [];
let mistakes = 0;
const maxMistakes = 6;

// Récupération des morceaux du pendu dans l'ordre
const hangmanParts = [
  document.getElementById("partHead"),
  document.getElementById("partBody"),
  document.getElementById("partArmL"),
  document.getElementById("partArmR"),
  document.getElementById("partLegL"),
  document.getElementById("partLegR"),
];

// LISTE DES PAYS ---
// --- LISTE DES PAYS ---
const words = {
  soft: [
    { word: "france", hint: "Pays d’Europe de l’Ouest " },
    { word: "italie", hint: "Pays des pizzas et du Colisée " },
    { word: "espagne", hint: "Pays du soleil et de la paella " },
    { word: "maroc", hint: "Pays d’Afrique du Nord, célèbre pour Marrakech " },
    { word: "tunisie", hint: "Pays d’Afrique du Nord, connu pour ses plages " },
    { word: "algérie", hint: "Plus grand pays d’Afrique " },
    { word: "portugal", hint: "Pays de Lisbonne et du fado " },
    { word: "sénégal", hint: "Pays d’Afrique de l’Ouest " },
    { word: "canada", hint: "Pays des grands espaces et du sirop d’érable " },
    { word: "brésil", hint: "Pays du carnaval et du football " },
    { word: "argentine", hint: "Pays de Messi et du tango " },
    { word: "mexique", hint: "Pays des tacos et des pyramides mayas " },
    { word: "chine", hint: "Pays le plus peuplé du monde " },
    { word: "japon", hint: "Pays du soleil levant " },
    { word: "inde", hint: "Pays du Taj Mahal " },
    { word: "turquie", hint: "Pays à cheval entre Europe et Asie " },
    { word: "grèce", hint: "Berceau de la mythologie " },
    { word: "allemagne", hint: "Pays du mur de Berlin " },
    { word: "suisse", hint: "Pays des montagnes et du chocolat " },
    { word: "belgique", hint: "Pays des frites et des BD " }
  ],

  hard: [
    { word: "azerbaidjan", hint: "Pays du Caucase 🇦🇿" },
    { word: "kirghizistan", hint: "Pays montagneux d’Asie centrale 🇰🇬" },
    { word: "bosnieherzegovine", hint: "Pays des Balkans 🇧🇦" },
    { word: "tchecoslovaquie", hint: "Ancien pays d’Europe de l’Est 🇨🇿🇸🇰" },
    { word: "liechtenstein", hint: "Petit pays entre la Suisse et l’Autriche 🇱🇮" },
    { word: "mozambique", hint: "Pays d’Afrique australe 🇲🇿" },
    { word: "luxembourg", hint: "Petit pays européen 🇱🇺" },
    { word: "ouzbekistan", hint: "Pays d’Asie centrale 🇺🇿" },
    { word: "papouasie", hint: "Île d’Océanie 🇵🇬" },
    { word: "tanzanie", hint: "Pays du Kilimandjaro 🇹🇿" },
    { word: "mauritanie", hint: "Pays désertique d’Afrique de l’Ouest 🇲🇷" },
    { word: "macedoine", hint: "Pays des Balkans 🇲🇰" },
    { word: "guatemala", hint: "Pays d’Amérique centrale 🇬🇹" },
    { word: "nicaragua", hint: "Pays d’Amérique centrale 🇳🇮" },
    { word: "zimbabwe", hint: "Pays d’Afrique australe 🇿🇼" },
    { word: "emiratsarabesunis", hint: "Pays du golfe Persique 🇦🇪" },
    { word: "arabiesaoudite", hint: "Pays du pèlerinage à La Mecque 🇸🇦" },
    { word: "republiquetcheque", hint: "Pays d’Europe centrale 🇨🇿" },
    { word: "slovaquie", hint: "Pays d’Europe centrale 🇸🇰" },
    { word: "seychelles", hint: "Archipel de l’océan Indien 🇸🇨" }
  ]
};


//INITIALISATION DU JEU ---

function initGame() {
  mistakes = 0;
  usedLetters = [];

  // Réinitialiser les parties du pendu
  hangmanParts.forEach((part) => (part.style.visibility = "hidden"));

  // Choisir un mot au hasard selon le niveau
  const list = words[level];
  const random = list[Math.floor(Math.random() * list.length)];
  currentWord = random.word.toUpperCase();
  hiddenWord = currentWord.split("").map((l) => (l === " " ? " " : "_"));

  // Mettre à jour l’affichage du mot et des lettres utilisées
  wordEl.textContent = hiddenWord.join(" ");
  usedEl.textContent = "Lettres : —";
  triesEl.textContent = `Essais : ${maxMistakes}`;

  // Gérer l'indice selon le niveau
  if (level === "soft") {
    hintEl.hidden = false;
    hintEl.textContent = `Indice : ${random.hint}`;
  } else {
    hintEl.hidden = true;
    hintEl.textContent = "";
  }

  // Recréer le clavier
  createKeyboard();
}


// CLAVIER VIRTUEL ---

function createKeyboard() {
  keyboardEl.innerHTML = "";
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  letters.forEach((letter) => {
    const btn = document.createElement("button");
    btn.className = "key";
    btn.textContent = letter;
    btn.addEventListener("click", () => handleLetter(letter, btn));
    keyboardEl.appendChild(btn);
  });
}

// GESTION D’UNE LETTRE ---

function handleLetter(letter, btn) {
  if (usedLetters.includes(letter)) return;

  usedLetters.push(letter);
  usedEl.textContent = `Lettres : ${usedLetters.join(" ")}`;

  if (currentWord.includes(letter)) {
    // Bonne lettre 
    revealLetter(letter);
    btn.classList.add("hit");
  } else {
    // Mauvaise lettre 
    mistakes++;
    btn.classList.add("miss");
    showNextPart(mistakes);
  }

  btn.disabled = true;
  updateTries();

  // Vérifier victoire/défaite
  checkGameStatus();
}

//AFFICHER LA PROCHAINE PARTIE DU PENDU ---

function showNextPart(errorsCount) {
  if (hangmanParts[errorsCount - 1]) {
    hangmanParts[errorsCount - 1].style.visibility = "visible";
  }
}

// METTRE À JOUR LES ESSAIS RESTANTS ---

function updateTries() {
  const remaining = maxMistakes - mistakes;
  triesEl.textContent = `Essais : ${remaining}`;
}

// RÉVÉLER LES LETTRES TROUVÉES ---

function revealLetter(letter) {
  currentWord.split("").forEach((l, i) => {
    if (l === letter) hiddenWord[i] = letter;
  });
  wordEl.textContent = hiddenWord.join(" ");
}

// VÉRIFIER L’ÉTAT DU JEU ---

function checkGameStatus() {
  if (!hiddenWord.includes("_")) {
    // Gagné 
    setTimeout(() => {
      alert("Bravo ! Tu as trouvé le mot 🎉");
      initGame();
    }, 400);
  } else if (mistakes >= maxMistakes) {
    // Perdu 
    setTimeout(() => {
      alert(`Perdu ! Le mot était : ${currentWord}`);
      initGame();
    }, 400);
  }
}

// BOUTONS ---

btnRestart.addEventListener("click", initGame);
btnHome.addEventListener("click", () => {
  window.location.href = "index.html";
});

// LANCEMENT INITIAL ---

initGame();
