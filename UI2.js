// --- AC Terminal UI Unificado ---

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

// Simulamos base de datos
const pilotos = {
  "Treaker": "1234",
  "Ace": "abcd",
  "Viper": "pass"
};

// ===== Funciones =====

// Animación Boot
let currentLine = 0, charIndex = 0;
function typeLine(speed = 40){
  if(currentLine < logLines.length){
    if(charIndex < logLines[currentLine].length){
      bootLog.textContent += logLines[currentLine][charIndex];
      charIndex++;
      const variance = Math.random() * 20;
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

// Login/Register Animación
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

// Toast futurista
function showTerminalToast(message) {
  terminalToast.textContent = "";
  terminalToast.classList.remove("hide");
  terminalToast.classList.add("show");

  let index = 0;
  function typeChar() {
    if (index < message.length) {
      terminalToast.textContent += message[index];
      index++;
      setTimeout(typeChar, 40);
    } else {
      setTimeout(() => {
        terminalToast.classList.remove("show");
        terminalToast.classList.add("hide");
      }, 2000);
    }
  }
  typeChar();
}

// Efecto parpadeo
function blinkEffect(element, duration = 3000){
  let visible = true;
  const interval = setInterval(() => {
    element.style.opacity = visible ? '1' : '0.4';
    visible = !visible;
  }, 500);
  setTimeout(() => clearInterval(interval), duration);
}

// Login exitoso -> AC HUD
function loginExitosa(username){
  const unit = acUnits[Math.floor(Math.random()*acUnits.length)];

  // Guardamos la unidad y usuario en sessionStorage
  sessionStorage.setItem('piloto', username);
  sessionStorage.setItem('unidad', unit);

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

    let lineIndex = 0, charIdx = 0;

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

// ===== Eventos Login / Registro =====
document.getElementById('btn-login').addEventListener('click', () => {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value.trim();

  if (!username || !password) {
    showTerminalToast("Complete todos los campos");
    return;
  }

  if (!pilotos[username] || pilotos[username] !== password) {
    showTerminalToast("Piloto caído en combate");
    return;
  }

  loginExitosa(username);
});

document.getElementById('btn-register').addEventListener('click', () => {
  const username = document.getElementById('register-username').value.trim();
  const password = document.getElementById('register-password').value.trim();

  if (!username || !password) {
    showTerminalToast("Complete todos los campos");
    return;
  }

  if (pilotos[username]) {
    showTerminalToast("Piloto ya registrado");
    return;
  }

  pilotos[username] = password;
  showTerminalToast("Piloto registrado con éxito");

  // Auto swap a login
  swapModules(registerModule, loginModule);
});

// ===== Inicialización =====
typeLine();
