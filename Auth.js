// Simulamos base de datos
const pilotos = {
  "Treaker": "1234",
  "Ace": "abcd",
  "Viper": "pass"
};

const toast = document.getElementById("terminal-toast");

function showTerminalToast(message) {
  toast.textContent = "";
  toast.classList.remove("hide");
  toast.classList.add("show");

  let index = 0;
  function typeChar() {
    if (index < message.length) {
      toast.textContent += message[index];
      index++;
      setTimeout(typeChar, 40);
    } else {
      setTimeout(() => {
        toast.classList.remove("show");
        toast.classList.add("hide");
      }, 2000);
    }
  }
  typeChar();
}

// --- LOGIN ---
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

// --- REGISTRO ---
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
  registerModule.classList.add('fade-out');
  setTimeout(() => {
    registerModule.classList.add('hidden');
    registerModule.classList.remove('fade-out');
    loginModule.classList.remove('hidden');
    loginModule.classList.add('fade-in');
    setTimeout(() => loginModule.classList.remove('fade-in'), 500);
  }, 500);
});
