// --- UI.js avanzado para AC Terminal --- 

// ===== Elementos =====
const bootScreen     = document.getElementById('boot-screen');
const authContainer  = document.getElementById('auth-container');
const bootLog        = document.getElementById('boot-log');
const bootProgress   = document.getElementById('boot-progress');

const loginModule    = document.getElementById('login-module');
const registerModule = document.getElementById('register-module');
const swapToRegister = document.getElementById('swap-to-register');
const swapToLogin    = document.getElementById('swap-to-login');

const acHUD          = document.getElementById('ac-hud');
const acLog          = document.getElementById('ac-log');

const terminalToast  = document.getElementById('terminal-toast');

// ===== Datos =====
const acUnits = ['Lázaro','Chronos','Vulture','Orion','Titan','Aegis','Phantom'];
const logLines = [
  "[SISTEMA] Iniciando subsistemas...",
  "[SISTEMA] Verificando integridad de la unidad...",
  "[SISTEMA] Cargando control de piloto...",
  "[SISTEMA] Inicialización completa."
];

// ===== Boot Animation =====
let currentLine = 0;
let charIndex   = 0;

function typeLine(speed = 40){
  if(currentLine < logLines.length){
    if(charIndex < logLines[currentLine].length){
      bootLog.textContent += logLines[currentLine][charIndex];
      charIndex++;
      const variance = Math.random() * 20; // velocidad variable
      setTimeout(() => typeLine(speed), speed - variance);
    } else {
      bootLog.textContent += '\n';
      currentLine++;
      charIndex = 0;
      updateProgress(currentLine / logLines.length);
      setTimeout(typeLine, 300);
    }
    bootLog.scrollTop = bootLog.scrollHeight;
  } else {
    setTimeout(() => {
      bootScreen.classList.add('fade-out');
      setTimeout(() => {
        bootScreen.classList.add('hidden');
        authContainer.classList.remove('hidden');
        authContainer.classList.add('fade-in');
        animateModule(loginModule);
      }, 500);
    }, 500);
  }
}

function updateProgress(percent){
  const totalBars = 50;
  const filled = Math.floor(totalBars * percent);
  const empty  = totalBars - filled;
  bootProgress.textContent = `[${'='.repeat(filled)}${'.'.repeat(empty)}] ${Math.floor(percent*100)}%`;
}

typeLine();

// ===== Login/Register Animación avanzada =====
function swapModules(hideModule, showModule){
  hideModule.classList.add('fade-out');
  hideModule.style.transform = 'scale(0.97)';
  setTimeout(() => {
    hideModule.classList.add('hidden');
    hideModule.classList.remove('fade-out');
    showModule.classList.remove('hidden');
    animateModule(showModule);
  }, 500);
}

function animateModule(module){
  module.classList.add('fade-in');
  module.style.transform = 'scale(1.05)';
  setTimeout(() => {
    module.classList.remove('fade-in');
    module.style.transform = 'scale(1)';
  }, 500);
}

swapToRegister.addEventListener('click', () => swapModules(loginModule, registerModule));
swapToLogin.addEventListener('click', () => swapModules(registerModule, loginModule));

// ===== Toast futurista avanzado =====
function showToast(message, type = 'random'){
  const colors = ['green','red','blue','purple'];
  let color = type === 'random' ? colors[Math.floor(Math.random()*colors.length)] : type;
  terminalToast.textContent = message;
  terminalToast.className = `show toast-${color}`;
  setTimeout(() => {
    terminalToast.classList.add('hide');
    setTimeout(() => terminalToast.className = '', 500);
  }, 2500);
}

// ===== Animación AC HUD con efecto de escritura y scroll =====
function loginExitosa(username){
  const unit = acUnits[Math.floor(Math.random()*acUnits.length)];
  authContainer.classList.add('fade-out');
  setTimeout(() => {
    authContainer.classList.add('hidden');
    acHUD.classList.remove('hidden');
    acHUD.classList.add('fade-in');
    acLog.textContent = '';
    animateModule(acHUD);

    const acLines = [
      `[AC] Conectando sistemas...`,
      `[AC] Piloto: ${username}`,
      `[AC] Unidad asignada: ${unit}`,
      `[AC] Todos los sistemas en línea.`,
      `[AC] Iniciando sistema Geminis...`
    ];

    let lineIndex = 0;
    let charIdx   = 0;

    function typeACLine(){
      if(lineIndex < acLines.length){
        if(charIdx < acLines[lineIndex].length){
          acLog.textContent += acLines[lineIndex][charIdx];
          charIdx++;
          const variance = Math.random()*20;
          setTimeout(typeACLine, 40 - variance);
        } else {
          acLog.textContent += '\n';
          lineIndex++;
          charIdx = 0;
          acLog.scrollTop = acLog.scrollHeight;
          setTimeout(typeACLine, 300);
        }
      } else {
        const lastLine = document.createElement('span');
        lastLine.textContent = "[AC] Preparando salto de unidad...";
        acLog.appendChild(lastLine);
        blinkEffect(lastLine, 4000);
        acLog.scrollTop = acLog.scrollHeight;
        setTimeout(() => window.location.href = "hub.html", 1500);
      }
    }

    typeACLine();
  }, 500);
}

// ===== Efecto parpadeo sutil =====
function blinkEffect(element, duration = 3000){
  let visible = true;
  const interval = setInterval(() => {
    element.style.opacity = visible ? '1' : '0.4';
    visible = !visible;
  }, 500);
  setTimeout(() => clearInterval(interval), duration);
}

// ===== HUD Dinámico opcional =====
function updateHUDStatus(statusObj){
  document.querySelectorAll('.hud-panel').forEach(panel => {
    Object.entries(statusObj).forEach(([key,val])=>{
      const elem = panel.querySelector(`[data-status="${key}"]`);
      if(elem) elem.textContent = val;
    });
  });
}

