// ===== HUD.js Optimizado, Robusto y Modular =====

// ===== Atajo para obtener elementos =====
const $ = id => document.getElementById(id);

// ===== Mapeo de elementos principales =====
const HUD = {
  container: $("hud-container"),
  startup: $("hud-startup"),
  bootLog: $("hud-boot-log"),
  progressBar: $("hud-progress-bar"),
  bootAudio: $("hud-boot-audio"),
  unitName: $("hud-unit-name"),
  weaponList: $("weapon-list"),
  alertList: $("alert-list"),
  missionList: $("mission-list"),
  damageList: $("damage-list"),
  dynamicAlert: $("dynamic-alert"),
  clock: $("hud-clock"),
  toastsContainer: null,
  secretButtons: $("hud-hidden-buttons")
};

// ===== Utilidades =====
function stripDiacritics(str = "") {
  try {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  } catch {
    return str.replace(/[\u0300-\u036f]/g, "");
  }
}

function normalizeKey(str = "") {
  return stripDiacritics(String(str))
    .toUpperCase()
    .replace(/\s+/g, "");
}

// ===== Temas por unidad =====
const UNIT_THEMES_RAW = {
  "LÁZARO": "#00ff99",
  "CHRONOS": "#00bfff",
  "VULTURE": "#ff6600",
  "ORION": "#ff00ff",
  "TITAN": "#ffff00",
  "AEGIS": "#00ffff",
  "PHANTOM": "#ff3399"
};

const UNIT_THEMES = Object.fromEntries(
  Object.entries(UNIT_THEMES_RAW).map(([k, v]) => [normalizeKey(k), v])
);

// ===== Obtener unidad desde sessionStorage o query =====
function getUnidadFromSession() {
  const candidateKeys = ["unidad", "unit", "unidadSeleccionada", "selectedUnit", "unidad_seleccionada"];

  for (const key of candidateKeys) {
    let raw = sessionStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      if (typeof parsed === "string") raw = parsed;
      else if (parsed?.name || parsed?.unidad) raw = parsed.name || parsed.unidad;
    } catch {
      // no es JSON
    }
    if (raw) return String(raw);
  }

  try {
    const url = new URL(window.location.href);
    if (url.searchParams.has("unidad")) return url.searchParams.get("unidad");
  } catch {
    /* noop */
  }

  return "LÁZARO"; // fallback
}

// ===== Aplicar tema =====
function applyThemeFromUnidad(unidadRaw) {
  const unidadDisplay = unidadRaw || getUnidadFromSession();
  const normalized = normalizeKey(unidadDisplay);
  const color = UNIT_THEMES[normalized] || UNIT_THEMES[normalizeKey("LÁZARO")];

  document.body.style.setProperty("--hud-color", color);

  if (HUD.unitName) HUD.unitName.textContent = String(unidadDisplay).toUpperCase();

  // Aplicar color a elementos que usaban text-green / border-green
  document.querySelectorAll('[class*="text-green-"], [class*="border-green-"]').forEach(el => {
    if (el.className.includes("text-green-")) el.style.color = color;
    if (el.className.includes("border-green-")) el.style.borderColor = color;
    if (["SVG", "PATH", "CIRCLE"].includes(el.tagName)) {
      el.style.stroke = color;
      el.style.fill = color;
    }
  });

  document.querySelectorAll('[class*="bg-green-"]').forEach(el => {
    if (!el.style.backgroundColor) el.style.backgroundColor = color;
  });

  return color;
}

// ===== Piloto =====
function getPilotoFromSession() {
  let p = sessionStorage.getItem("piloto") || sessionStorage.getItem("pilot");
  if (!p) return "DESCONOCIDO";

  try {
    const parsed = JSON.parse(p);
    if (typeof parsed === "string") p = parsed;
    else if (parsed?.name || parsed?.piloto) p = parsed.name || parsed.piloto;
  } catch {
    /* noop */
  }
  return String(p);
}

// ===== Boot log =====
const piloto = getPilotoFromSession();
const unidadActual = getUnidadFromSession();
const bootLines = [
  "[ CORE ] Inicializando subsistemas...",
  "[ CORE ] Verificando integridad de la unidad...",
  "[ CORE ] Cargando control de piloto...",
  `[ CORE ] Asignando piloto: ${piloto}`,
  `[ CORE ] Unidad asignada: ${unidadActual}`,
  "[ CORE ] Inicialización completa."
];

let currentLine = 0;
let charIndex = 0;

function typeBootLine(speed = 40) {
  if (!HUD.bootLog) return;

  if (currentLine >= bootLines.length) {
    applyThemeFromUnidad(unidadActual);
    return setTimeout(showHUD, 800);
  }

  const line = bootLines[currentLine];
  if (charIndex < line.length) {
    HUD.bootLog.textContent += line[charIndex++];
    setTimeout(() => typeBootLine(speed), speed + Math.random() * 20);
  } else {
    if (Math.random() < 0.15 && currentLine < bootLines.length - 1) {
      showBootError();
    } else {
      HUD.bootLog.textContent += "\n";
      updateBootProgress(++currentLine / bootLines.length);
      charIndex = 0;
      setTimeout(typeBootLine, 300);
    }
  }
}

function updateBootProgress(percent) {
  if (HUD.progressBar) HUD.progressBar.style.width = `${Math.floor(percent * 100)}%`;
}

function showBootError() {
  if (!HUD.bootLog) return;

  HUD.bootLog.innerHTML += `<i class="fa-solid fa-rotate-right boot-error-icon"></i> [ERROR DETECTADO]\n`;
  setTimeout(() => {
    HUD.bootLog.textContent += `[ CORE ] Reparando subsistema...\n`;
    setTimeout(() => {
      HUD.bootLog.textContent += "[ CORE ] Reparación completada.\n";
      updateBootProgress(++currentLine / bootLines.length);
      charIndex = 0;
      setTimeout(typeBootLine, 300);
    }, 1000);
  }, 1000);
}

// ===== Mostrar HUD =====
function showHUD() {
  HUD.bootAudio?.play().catch(() => {});
  if (HUD.startup) HUD.startup.style.display = "none";
  if (HUD.container) {
    HUD.container.style.opacity = "1";
    HUD.container.classList.add("fade-in");
  }
  initHUD();
}

// ===== Inicialización modular =====
function initHUD() {
  applyThemeFromUnidad(getUnidadFromSession());
  initClock();
  initWeapons();
  initAlerts();
  initMissions();
  initDamage();
  initToasts();
  initDynamicAlerts();
  initRadar();
  initSecretButtons();
}

// ===== Submódulos =====
function initWeapons() {
  if (!HUD.weaponList) return;
  const weapons = [
    { name: "RIFLE ASLT", ammo: 120 },
    { name: "MISSILES", ammo: 20 },
    { name: "BLADE", status: "OK" }
  ];
  HUD.weaponList.innerHTML = weapons
    .map(w => `<li>[${w.name}] <span class="float-right text-green-300">${w.ammo ? `Ammo: ${w.ammo}` : `Status: ${w.status}`}</span></li>`)
    .join("");
}

function initAlerts() {
  if (!HUD.alertList) return;
  const alerts = [
    { text: "[!] Zona hostil detectada", color: "red" },
    { text: "[i] Nuevo objetivo asignado", color: "yellow" }
  ];
  HUD.alertList.innerHTML = alerts.map(a => `<li class="text-${a.color}-400">${a.text}</li>`).join("");
}

function initMissions() {
  if (!HUD.missionList) return;
  const missions = ["Ingresar a zona hostil", "Eliminar fuerzas enemigas", "Extraer datos críticos"];
  HUD.missionList.innerHTML = missions.map(m => `<li>${m}</li>`).join("");
}

function initDamage() {
  if (!HUD.damageList) return;
  const parts = ["Core", "Cabeza", "Brazos", "Piernas"];
  HUD.damageList.innerHTML = parts.map(p => `<li>${p} <span class="float-right text-green-300">100%</span></li>`).join("");
}

function initClock() {
  if (!HUD.clock) return;
  const updateClock = () => (HUD.clock.textContent = new Date().toLocaleTimeString());
  updateClock();
  setInterval(updateClock, 1000);
}

// ===== Toasts =====
function initToasts() {
  if (!HUD.toastsContainer) {
    HUD.toastsContainer = document.createElement("div");
    HUD.toastsContainer.id = "hud-toasts";
    HUD.toastsContainer.className = "absolute top-16 right-4 flex flex-col gap-2 z-[999]";
    document.body.appendChild(HUD.toastsContainer);
  }

  const logLines = [
    `[AC] Conectando sistemas...`,
    `[AC] Todos los sistemas en línea.`,
    `[AC] Inicializando módulo de navegación...`,
    `[AC] Escudos: Estables`,
    `[AC] Armas: Listas`,
    `[AC] Motores: Operativos`,
    `[AC] Comunicaciones: Conectadas`
  ];

  let totalDelay = 0;
  logLines.forEach(line => {
    totalDelay += 600 + Math.random() * 600;
    setTimeout(() => showToast(line), totalDelay);
  });
}

function showToast(message, error = false) {
  if (!HUD.toastsContainer) return;
  const toast = document.createElement("div");
  toast.className = `hud-toast ${error ? "error-toast" : "normal-toast"}`;
  toast.innerHTML = `<i class="fas ${error ? "fa-exclamation-triangle" : "fa-terminal"} mr-2"></i><span>${message}</span>`;
  HUD.toastsContainer.appendChild(toast);

  gsap.fromTo(toast, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.45, ease: "back.out(1.7)" });
  setTimeout(() => gsap.to(toast, { opacity: 0, y: -20, duration: 0.45, onComplete: () => toast.remove() }), 4000);
}

// ===== Alertas dinámicas =====
function initDynamicAlerts() {
  if (!HUD.dynamicAlert) return;
  setInterval(() => showDynamicAlert("[!] ALERTA: Entrada a zona de combate", 2000), 15000);
}

function showDynamicAlert(text, duration = 2000) {
  if (!HUD.dynamicAlert) return;
  HUD.dynamicAlert.textContent = text;
  HUD.dynamicAlert.style.display = "block";
  gsap.fromTo(HUD.dynamicAlert, { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(1.7)" });
  setTimeout(() => {
    gsap.to(HUD.dynamicAlert, {
      scale: 0,
      duration: 0.3,
      ease: "back.in(1.7)",
      onComplete: () => (HUD.dynamicAlert.style.display = "none")
    });
  }, duration);
}

// ===== Radar (placeholder) =====
function initRadar() {
  const canvas = $("radar-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = document.body.style.getPropertyValue("--hud-color") || "#00ff99";
  ctx.font = "14px monospace";
  ctx.fillText("RADAR ONLINE", canvas.width / 2 - 40, canvas.height / 2);
}

// ===== Botones ocultos =====
function initSecretButtons() {
  if (!HUD.secretButtons) return;
  setTimeout(() => {
    HUD.secretButtons.classList.remove("hidden");
    HUD.secretButtons.classList.add("opacity-100");
  }, 120000); // 2 minutos
}

// ===== Lanzar boot typer =====
typeBootLine();

// ===== API pública =====
window.HUD_setUnidad = function (newUnidadName) {
  if (!newUnidadName) return;
  applyThemeFromUnidad(newUnidadName);
  if (HUD.unitName) HUD.unitName.textContent = String(newUnidadName).toUpperCase();
};
