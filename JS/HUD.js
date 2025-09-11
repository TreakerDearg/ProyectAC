// ===== HUD.js Final Avanzado =====

// ===== Datos de sesión =====
const piloto = sessionStorage.getItem('piloto') || "DESCONOCIDO";
const unidad = sessionStorage.getItem('unidad') || "LÁZARO";

// ===== Elementos =====
const hudContainer = document.getElementById('hud-container');
const hudStartup = document.getElementById('hud-startup');
const hudBootLog = document.getElementById('hud-boot-log');
const hudProgressBar = document.getElementById('hud-progress-bar');
const hudBootAudio = document.getElementById('hud-boot-audio');
const hudUnitName = document.getElementById('hud-unit-name');
const hudLog = document.getElementById('hud-log');
const weaponList = document.getElementById('weapon-list');
const alertList = document.getElementById('alert-list');
const missionList = document.getElementById('mission-list');
const damageList = document.getElementById('damage-list');
const dynamicAlert = document.getElementById('dynamic-alert');

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
document.querySelectorAll('.text-green-400').forEach(el => el.style.color = themeColor);
document.querySelectorAll('.border-green-400').forEach(el => el.style.borderColor = themeColor);

// ===== Boot Avanzado con posibles errores =====
const bootLines = [
  "[ CORE ] Inicializando subsistemas...",
  "[ CORE ] Verificando integridad de la unidad...",
  "[ CORE ] Cargando control de piloto...",
  `[ CORE ] Asignando piloto: ${piloto}`,
  `[ CORE ] Unidad asignada: ${unidad}`,
  "[ CORE ] Inicialización completa."
];

let currentLine = 0;
let charIndex = 0;

function typeBootLine(speed=40){
  if(currentLine < bootLines.length){
    if(charIndex < bootLines[currentLine].length){
      hudBootLog.textContent += bootLines[currentLine][charIndex];
      charIndex++;
      setTimeout(() => typeBootLine(speed), speed + Math.random()*20);
    } else {
      // === Probabilidad de error ===
      if(Math.random() < 0.15 && currentLine !== bootLines.length-1){
        showBootError(currentLine);
      } else {
        hudBootLog.textContent += '\n';
        currentLine++;
        charIndex = 0;
        updateBootProgress(currentLine / bootLines.length);
        setTimeout(typeBootLine, 300);
      }
    }
  } else {
    setTimeout(showHUD, 800);
  }
}

function updateBootProgress(percent){
  hudProgressBar.style.width = `${Math.floor(percent*100)}%`;
}

// ==== Mostrar HUD final ====
function showHUD(){
  hudBootAudio.play().catch(()=>{});
  hudStartup.style.display = "none";
  hudContainer.style.opacity = "1";
  hudContainer.classList.add('fade-in');
  initHUD();
}

// ==== Función de error en boot ====
function showBootError(line){
  const icon = document.createElement('span');
  icon.innerHTML = '<i class="fa-solid fa-rotate-right boot-error-icon"></i>';
  hudBootLog.appendChild(icon);
  hudBootLog.textContent += " [ERROR DETECTADO]\n";
  setTimeout(() => {
    hudBootLog.textContent += `[ CORE ] Reparando subsistema...\n`;
    setTimeout(() => {
      hudBootLog.textContent += "Reparación completada.\n";
      currentLine++;
      charIndex = 0;
      updateBootProgress(currentLine / bootLines.length);
      setTimeout(typeBootLine, 300);
    }, 1000);
  }, 1000);
}

// ==== Inicialización HUD =====
function initHUD(){
  // === Paneles dinámicos ===
  const armas = [
    {name:"RIFLE ASLT", ammo:120},
    {name:"MISSILES", ammo:20},
    {name:"BLADE", status:"OK"}
  ];
  armas.forEach(a=>{
    const li = document.createElement('li');
    li.innerHTML = a.ammo ? `[${a.name}] <span class="float-right text-green-300">Ammo: ${a.ammo}</span>`
                           : `[${a.name}] <span class="float-right text-green-300">Status: ${a.status}</span>`;
    weaponList.appendChild(li);
  });

  const alerts = [
    {text:"[!] Zona hostil detectada", color:"red"},
    {text:"[i] Nuevo objetivo asignado", color:"yellow"}
  ];
  alerts.forEach(a=>{
    const li = document.createElement('li');
    li.textContent = a.text;
    li.classList.add(`text-${a.color}-400`);
    alertList.appendChild(li);
  });

  const misiones = [
    "Ingresar a zona hostil",
    "Eliminar fuerzas enemigas",
    "Extraer datos críticos"
  ];
  misiones.forEach(m=>{
    const li = document.createElement('li');
    li.textContent = m;
    missionList.appendChild(li);
  });

  const daños = [
    {part:"Core", val:"100%"},
    {part:"Cabeza", val:"100%"},
    {part:"Brazos", val:"100%"},
    {part:"Piernas", val:"100%"}
  ];
  daños.forEach(d=>{
    const li = document.createElement('li');
    li.innerHTML = `${d.part} <span class="float-right text-green-300">${d.val}</span>`;
    damageList.appendChild(li);
  });

// ==== Toasts cinematográficos ====
const logLines = [
  `[AC] Conectando sistemas...`,
  `[AC] Piloto: ${piloto}`,
  `[AC] Unidad asignada: ${unidad}`,
  `[AC] Todos los sistemas en línea.`,
  `[AC] Inicializando módulo de navegación...`,
  `[AC] Escudos: Estables`,
  `[AC] Armas: Listas`,
  `[AC] Motores: Operativos`,
  `[AC] Comunicaciones: Conectadas`,
  `[AC] Preparando salto de unidad...`
];

let totalDelay = 0;

logLines.forEach((line) => {
  // retraso aleatorio entre 600ms y 1200ms
  const delay = 600 + Math.random() * 600;
  totalDelay += delay;

  setTimeout(() => {
    // decidir aleatoriamente si hay error (20% de probabilidad)
    const isError = Math.random() < 0.2;

    showToast(line, isError);
  }, totalDelay);
});

// ==== Función showToast avanzada ====
function showToast(message, error = false) {
  const toast = document.createElement('div');
  toast.classList.add('hud-toast', error ? 'error-toast' : 'normal-toast');

  // Icono opcional
  const icon = document.createElement('i');
  icon.className = error ? 'fas fa-exclamation-triangle mr-2' : 'fas fa-terminal mr-2';
  toast.appendChild(icon);

  const text = document.createElement('span');
  text.textContent = message;
  toast.appendChild(text);

  document.body.appendChild(toast);

  // Animación de entrada
  gsap.fromTo(toast, {opacity:0, y:-20}, {opacity:1, y:0, duration:0.5, ease:'back.out(1.7)'});

  // Si hay error, repararlo tras 2s
  if(error){
    setTimeout(() => {
      toast.classList.remove('error-toast');
      toast.classList.add('normal-toast');
      icon.className = 'fas fa-terminal mr-2';
    }, 2000);
  }

  // Desaparece después de 4s
  setTimeout(() => {
    gsap.to(toast, {opacity:0, y:-20, duration:0.5, onComplete:()=>toast.remove()});
  }, 4000);
}


  // ==== Reloj HUD ====
  const clockEl = document.getElementById('hud-clock');
  setInterval(()=>{
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString();
  },1000);

  // ==== Alertas emergentes ====
  setInterval(()=>{
    showDynamicAlert("[!] ALERTA: Entrada a zona de combate",2000);
  },15000);

  // ==== Radar animado ====
  initRadar();
}

// ==== Funciones ====
function showDynamicAlert(text,duration=2000){
  dynamicAlert.textContent = text;
  dynamicAlert.style.display = "block";
  gsap.fromTo(dynamicAlert,{scale:0},{scale:1,duration:0.3,ease:"back.out(1.7)"});
  setTimeout(()=>{
    gsap.to(dynamicAlert,{scale:0,duration:0.3,ease:"back.in(1.7)",onComplete:()=>{dynamicAlert.style.display="none"}});
  },duration);
}

function showToast(text){
  let container = document.getElementById('hud-toasts');
  if(!container){
    container = document.createElement('div');
    container.id = "hud-toasts";
    container.className = "absolute top-16 right-4 flex flex-col gap-2 z-[999]";
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = "hud-toast";
  toast.textContent = text;
  container.appendChild(toast);
  setTimeout(()=>toast.remove(), 4000);
}

// ==== Radar simulado con canvas ====
function initRadar(){
  const canvas = document.getElementById('radar-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const centerX = width/2;
  const centerY = height/2;
  const radius = width/2 - 10;

  const blips = Array.from({length:10},()=>(({
    angle: Math.random()*Math.PI*2,
    distance: Math.random()*radius,
    speed: 0.01 + Math.random()*0.02
  })));

  function drawRadar(){
    ctx.clearRect(0,0,width,height);
    ctx.strokeStyle = themeColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX,centerY,radius,0,Math.PI*2);
    ctx.stroke();

    blips.forEach(b=>{
      b.angle += b.speed;
      const x = centerX + b.distance * Math.cos(b.angle);
      const y = centerY + b.distance * Math.sin(b.angle);
      ctx.fillStyle = themeColor;
      ctx.beginPath();
      ctx.arc(x,y,4,0,Math.PI*2);
      ctx.fill();
    });

    requestAnimationFrame(drawRadar);
  }
  drawRadar();
}

// ==== Iniciar boot ====
typeBootLine();
