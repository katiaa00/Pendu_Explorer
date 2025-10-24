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
const words = {
  soft: [
    { word: "france", hint: "Pays d'Europe de l'Ouest " },
    { word: "espagne", hint: "Pays célèbre pour la paella " },
    { word: "italie", hint: "Pays des pizzas et du Colisée " },
    { word: "inde", hint: "Pays du Taj Mahal " },
    { word: "chine", hint: "Le pays le plus peuplé 🇨🇳" },
  ],
  hard: [
    { word: "kirghizistan", hint: "Pays montagneux d'Asie centrale " },
    { word: "azerbaidjan", hint: "Pays du Caucase " },
    { word: "liechtenstein", hint: "Petit pays entre Suisse et Autriche " },
    { word: "mozambique", hint: "Pays d’Afrique australe " },
    { word: "ouzbekistan", hint: "Pays des steppes d’Asie centrale " },
  ],
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
