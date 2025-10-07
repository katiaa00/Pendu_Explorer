// --- Constantes & utilitaires ---
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const q = new URLSearchParams(location.search);
const level = (q.get("level") || "soft").toLowerCase();
const triesMax = 6;

function norm(s) {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toUpperCase();
}
function isLetter(ch) { return /^[A-Z]$/.test(ch); }
function byId(id) { return document.getElementById(id); }

// --- Dataset local : pays ---
const WORDS = {
  soft: [
    "France","Italie","Espagne","Maroc","Tunisie","Algérie","Portugal",
    "Sénégal","Canada","Brésil","Argentine","Mexique","Chine","Japon",
    "Inde","Turquie","Grèce","Allemagne","Suisse","Belgique"
  ],
  hard: [
    "Azerbaïdjan","Kirghizistan","Bosnie-Herzégovine","Tchécoslovaquie",
    "Liechtenstein","Mozambique","Luxembourg","Ouzbékistan","Papouasie",
    "Tanzanie","Mauritanie","Macédoine","Guatemala","Nicaragua","Zimbabwe",
    "Émirats arabes unis","Arabie saoudite","République tchèque","Slovaquie","Seychelles"
  ]
};

// --- Dessin du pendu : ordre d'apparition (6 erreurs) ---
const HANGMAN_PARTS = ["h-head","h-body","h-armL","h-armR","h-legL","h-legR"];
function hideAllParts() { HANGMAN_PARTS.forEach(id => { const el = byId(id); if (el) el.style.visibility = "hidden"; }); }
function updateHangman() {
  const wrong = triesMax - tries;
  HANGMAN_PARTS.forEach((id, idx) => {
    const el = byId(id);
    if (el) el.style.visibility = idx < wrong ? "visible" : "hidden";
  });
}

// --- État du jeu ---
let secretRaw = "";  // mot avec accents/espaces pour affichage
let secret = "";     // normalisé (A-Z)
let display = [];    // tableau "_", espaces, tirets…
let tries = triesMax;
let used = new Set();

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// --- Initialisation ---
function startGame() {
  const list = WORDS[level] || WORDS.soft;
  secretRaw = pickRandom(list);
  secret = norm(secretRaw);
  tries = triesMax;
  used = new Set();

  // Remplit l'affichage 
  display = secretRaw.split("").map(ch => {
    const n = norm(ch);
    if (isLetter(n)) return "_";
    if (ch === " " || ch === "-" || ch === "’" || ch === "'") return ch;
    return ch;
  });

  byId("levelTag").textContent = `Niveau : ${level === "hard" ? "Hard" : "Soft"}`;
  hideAllParts();
  render();
  buildKeyboard();
}

function render() {
  byId("word").textContent = display.join(" ");
  byId("tries").textContent = `Essais : ${tries}`;
  byId("used").textContent = used.size ? `Lettres : ${[...used].join(" ")}` : "Lettres : —";
  updateHangman();
}

function buildKeyboard() {
  const k = byId("keyboard");
  k.innerHTML = "";
  ALPHABET.forEach(L => {
    const btn = document.createElement("button");
    btn.className = "key";
    btn.textContent = L;
    btn.disabled = used.has(L) || isFinished();
    btn.addEventListener("click", () => onGuess(L, btn));
    k.appendChild(btn);
  });
}

function onGuess(L, btnEl) {
  if (isFinished() || used.has(L)) return;
  used.add(L);

  let hit = false;
  for (let i = 0; i < secret.length; i++) {
    if (secret[i] === L) {
      display[i] = secretRaw[i]; // conserve l'accent
      hit = true;
    }
  }

  if (!hit) { tries--; btnEl?.classList.add("miss"); }
  else { btnEl?.classList.add("hit"); }
  btnEl.disabled = true;

  render();

  if (isWin()) {
    setTimeout(() => alert(`Bravo ! Le pays était : ${secretRaw}`), 10);
    disableKeys();
  } else if (isLose()) {
    revealWord();
    setTimeout(() => alert(`Dommage… Le pays était : ${secretRaw}`), 10);
    disableKeys();
  }
}

function disableKeys() { document.querySelectorAll(".key").forEach(b => b.disabled = true); }
function isWin() { return !display.includes("_"); }
function isLose() { return tries <= 0; }
function isFinished() { return isWin() || isLose(); }
function revealWord() { display = secretRaw.split(""); render(); }

// Clavier physique
window.addEventListener("keydown", (e) => {
  if (isFinished()) return;
  const L = norm(e.key).slice(0,1);
  if (!isLetter(L)) return;
  const btn = [...document.querySelectorAll(".key")].find(b => b.textContent === L);
  onGuess(L, btn);
});

// Boutons
byId("btnRestart").addEventListener("click", startGame);
byId("btnHome").addEventListener("click", () => location.href = "index.html");

// Go
startGame();
