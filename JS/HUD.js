// ===== HUD.js Optimizado =====

// ===== Datos de sesión =====
const piloto = sessionStorage.getItem('piloto') || "DESCONOCIDO";
const unidad = sessionStorage.getItem('unidad') || "LÁZARO";

// ===== Elementos =====
const $ = id => document.getElementById(id);
const hudContainer = $("hud-container");
const hudStartup = $("hud-startup");
const hudBootLog = $("hud-boot-log");
const hudProgressBar = $("hud-progress-bar");
const hudBootAudio = $("hud-boot-audio");
const hudUnitName = $("hud-unit-name");
const weaponList = $("weapon-list");
const alertList = $("alert-list");
const missionList = $("mission-list");
const damageList = $("damage-list");
const dynamicAlert = $("dynamic-alert");

// ===== Unidad y tema dinámico =====
hudUnitName.textContent = unidad.toUpperCase();
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

// aplicar theme en elementos relevantes
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
  if (currentLine >= bootLines.length) return setTimeout(showHUD, 800);

  const line = bootLines[currentLine];
  if (charIndex < line.length) {
    hudBootLog.textContent += line[charIndex++];
    setTimeout(() => typeBootLine(speed), speed + Math.random() * 20);
  } else {
    if (Math.random() < 0.15 && currentLine < bootLines.length - 1) {
      showBootError();
    } else {
      hudBootLog.textContent += '\n';
      updateBootProgress(++currentLine / bootLines.length);
      charIndex = 0;
      setTimeout(typeBootLine, 300);
    }
  }
}

function updateBootProgress(percent) {
  hudProgressBar.style.width = `${Math.floor(percent * 100)}%`;
}

function showHUD() {
  hudBootAudio.play().catch(() => {});
  hudStartup.style.display = "none";
  hudContainer.style.opacity = "1";
  hudContainer.classList.add("fade-in");
  initHUD();
}

function showBootError() {
  hudBootLog.innerHTML += `<i class="fa-solid fa-rotate-right boot-error-icon"></i> [ERROR DETECTADO]\n`;
  setTimeout(() => {
    hudBootLog.textContent += `[ CORE ] Reparando subsistema...\n`;
    setTimeout(() => {
      hudBootLog.textContent += "Reparación completada.\n";
      updateBootProgress(++currentLine / bootLines.length);
      charIndex = 0;
      setTimeout(typeBootLine, 300);
    }, 1000);
  }, 1000);
}

// ===== Inicialización HUD =====
function initHUD() {
  // Armas
  [
    { name: "RIFLE ASLT", ammo: 120 },
    { name: "MISSILES", ammo: 20 },
    { name: "BLADE", status: "OK" }
  ].forEach(a => {
    weaponList.innerHTML += `<li>[${a.name}] <span class="float-right text-green-300">${a.ammo ? `Ammo: ${a.ammo}` : `Status: ${a.status}`}</span></li>`;
  });

  // Alertas
  [
    { text: "[!] Zona hostil detectada", color: "red" },
    { text: "[i] Nuevo objetivo asignado", color: "yellow" }
  ].forEach(a => {
    alertList.innerHTML += `<li class="text-${a.color}-400">${a.text}</li>`;
  });

  // Misiones
  ["Ingresar a zona hostil", "Eliminar fuerzas enemigas", "Extraer datos críticos"]
    .forEach(m => missionList.innerHTML += `<li>${m}</li>`);

  // Daños
  ["Core", "Cabeza", "Brazos", "Piernas"]
    .forEach(p => damageList.innerHTML += `<li>${p} <span class="float-right text-green-300">100%</span></li>`);

  // Toasts cinematográficos
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
    setTimeout(() => showToast(line, Math.random() < 0.2), totalDelay);
  });

  // Reloj
  setInterval(() => $("hud-clock").textContent = new Date().toLocaleTimeString(), 1000);

  // Alertas emergentes
  setInterval(() => showDynamicAlert("[!] ALERTA: Entrada a zona de combate", 2000), 15000);

  // Radar
  initRadar();
}

// ===== Funciones HUD =====
function showDynamicAlert(text, duration = 2000) {
  dynamicAlert.textContent = text;
  dynamicAlert.style.display = "block";
  gsap.fromTo(dynamicAlert, { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(1.7)" });
  setTimeout(() => {
    gsap.to(dynamicAlert, {
      scale: 0, duration: 0.3, ease: "back.in(1.7)",
      onComplete: () => dynamicAlert.style.display = "none"
    });
  }, duration);
}

function showToast(message, error = false) {
  let container = $("hud-toasts");
  if (!container) {
    container = document.createElement("div");
    container.id = "hud-toasts";
    container.className = "absolute top-16 right-4 flex flex-col gap-2 z-[999]";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `hud-toast ${error ? "error-toast" : "normal-toast"}`;
  toast.innerHTML = `<i class="fas ${error ? "fa-exclamation-triangle" : "fa-terminal"} mr-2"></i><span>${message}</span>`;
  container.appendChild(toast);

  gsap.fromTo(toast, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" });

  if (error) setTimeout(() => toast.className = "hud-toast normal-toast", 2000);

  setTimeout(() => gsap.to(toast, { opacity: 0, y: -20, duration: 0.5, onComplete: () => toast.remove() }), 4000);
}

// ===== Radar con canvas =====
function initRadar() {
  const canvas = $("radar-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const { width, height } = canvas;
  const [centerX, centerY] = [width / 2, height / 2];
  const radius = width / 2 - 10;

  const blips = Array.from({ length: 10 }, () => ({
    angle: Math.random() * Math.PI * 2,
    distance: Math.random() * radius,
    speed: 0.01 + Math.random() * 0.02
  }));

  (function drawRadar() {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    blips.forEach(b => {
      b.angle += b.speed;
      ctx.fillStyle = themeColor;
      ctx.beginPath();
      ctx.arc(centerX + b.distance * Math.cos(b.angle), centerY + b.distance * Math.sin(b.angle), 4, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(drawRadar);
  })();
}

// ===== Iniciar Boot =====
typeBootLine();

// ===== Logica botones ocultos =====
document.addEventListener("DOMContentLoaded", () => {
  const secretButtons = document.getElementById("secret-buttons");

  // Mostrar botones después de 2 minutos (120000 ms)
  setTimeout(() => {
    secretButtons.classList.remove("opacity-0", "pointer-events-none");
    secretButtons.classList.add("opacity-100");
  }, 120000);
});
