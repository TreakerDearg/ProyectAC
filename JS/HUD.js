// ===== HUD.js Optimizado y Modular =====

// ===== Datos de sesión =====
const piloto = sessionStorage.getItem('piloto') || "DESCONOCIDO";
const unidad = sessionStorage.getItem('unidad') || "LÁZARO";

// ===== Elementos del DOM =====
const $ = id => document.getElementById(id);

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

// ===== Unidad y tema dinámico =====
const unitThemes = {
  "LÁZARO": "#00ff99",
  "CHRONOS": "#00bfff",
  "VULTURE": "#ff6600",
  "ORION": "#ff00ff",
  "TITAN": "#ffff00",
  "AEGIS": "#00ffff",
  "PHANTOM": "#ff3399"
};

const themeColor = unitThemes[unidad.toUpperCase()] || "#00ff99";
document.body.style.setProperty('--hud-color', themeColor);

// Aplicar tema a texto y bordes
[".text-green-400", ".border-green-400"].forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    if (sel.includes("text")) el.style.color = themeColor;
    if (sel.includes("border")) el.style.borderColor = themeColor;
  });
});

// ===== Boot Avanzado =====
const bootLines = [
  "[ CORE ] Inicializando subsistemas...",
  "[ CORE ] Verificando integridad de la unidad...",
  "[ CORE ] Cargando control de piloto...",
  `[ CORE ] Asignando piloto: ${piloto}`,
  `[ CORE ] Unidad asignada: ${unidad}`,
  "[ CORE ] Inicialización completa."
];

let currentLine = 0, charIndex = 0;

function typeBootLine(speed = 40) {
  if (!HUD.bootLog) return;

  if (currentLine >= bootLines.length) {
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
      HUD.bootLog.textContent += '\n';
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

function showHUD() {
  if (HUD.bootAudio) HUD.bootAudio.play().catch(() => {});
  if (HUD.startup) HUD.startup.style.display = "none";
  if (HUD.container) {
    HUD.container.style.opacity = "1";
    HUD.container.classList.add("fade-in");
  }
  initHUD();
}

// ===== Inicialización HUD =====
function initHUD() {
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

// ===== Paneles Dinámicos =====
function initWeapons() {
  if (!HUD.weaponList) return;
  const weapons = [
    { name: "RIFLE ASLT", ammo: 120 },
    { name: "MISSILES", ammo: 20 },
    { name: "BLADE", status: "OK" }
  ];
  HUD.weaponList.innerHTML = "";
  weapons.forEach(w => {
    const ammoOrStatus = w.ammo ? `Ammo: ${w.ammo}` : `Status: ${w.status}`;
    HUD.weaponList.innerHTML += `<li>[${w.name}] <span class="float-right text-green-300">${ammoOrStatus}</span></li>`;
  });
}

function initAlerts() {
  if (!HUD.alertList) return;
  const alerts = [
    { text: "[!] Zona hostil detectada", color: "red" },
    { text: "[i] Nuevo objetivo asignado", color: "yellow" }
  ];
  HUD.alertList.innerHTML = "";
  alerts.forEach(a => {
    HUD.alertList.innerHTML += `<li class="text-${a.color}-400">${a.text}</li>`;
  });
}

function initMissions() {
  if (!HUD.missionList) return;
  const missions = ["Ingresar a zona hostil", "Eliminar fuerzas enemigas", "Extraer datos críticos"];
  HUD.missionList.innerHTML = "";
  missions.forEach(m => HUD.missionList.innerHTML += `<li>${m}</li>`);
}

function initDamage() {
  if (!HUD.damageList) return;
  const parts = ["Core", "Cabeza", "Brazos", "Piernas"];
  HUD.damageList.innerHTML = "";
  parts.forEach(p => HUD.damageList.innerHTML += `<li>${p} <span class="float-right text-green-300">100%</span></li>`);
}

// ===== Reloj =====
function initClock() {
  if (!HUD.clock) return;
  setInterval(() => {
    HUD.clock.textContent = new Date().toLocaleTimeString();
  }, 1000);
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
    `[AC] Comunicaciones: Conectadas`,
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

  gsap.fromTo(toast, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" });
  setTimeout(() => gsap.to(toast, { opacity: 0, y: -20, duration: 0.5, onComplete: () => toast.remove() }), 4000);
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
      scale: 0, duration: 0.3, ease: "back.in(1.7)",
      onComplete: () => HUD.dynamicAlert.style.display = "none"
    });
  }, duration);
}

// ===== Radar (placeholder) =====
function initRadar() {
  const canvas = $("radar-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#00ff99";
  ctx.fillText("RADAR ONLINE", canvas.width/2 - 40, canvas.height/2);
}

// ===== Botones ocultos =====
function initSecretButtons() {
  if (!HUD.secretButtons) return;
  setTimeout(() => {
    HUD.secretButtons.classList.remove("hidden");
    HUD.secretButtons.classList.add("opacity-100");
  }, 120000); // 2 minutos
}

// ===== Iniciar Boot =====
typeBootLine();
