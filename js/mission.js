// ==========================
// Mission Panel Logic (Integrated with COMMS)
// ==========================
(function() {
  const missionList = document.getElementById("mission-list");
  const missionPanel = document.getElementById("mission-panel");
  const globalBar = document.getElementById("mission-progress-bar");

  // ==== Lista base de posibles misiones ====
  const possibleMissions = [
    { task: "Reconocimiento de zona", description: "Explora la región y reporta actividad." },
    { task: "Neutralizar hostiles", description: "Elimina amenazas enemigas." },
    { task: "Asegurar recursos", description: "Recolecta suministros críticos." },
    { task: "Protección de convoy", description: "Asegura la ruta de transporte." },
    { task: "Intercepción de señal", description: "Captura datos del enemigo." },
    { task: "Exploración subterránea", description: "Investiga túneles y estructuras." }
  ];

  // ==== Inicializar misiones aleatorias ====
  let missions = [];
  const maxMissions = 3;
  while (missions.length < maxMissions) {
    const candidate = possibleMissions[Math.floor(Math.random() * possibleMissions.length)];
    if (!missions.find(m => m.task === candidate.task)) {
      missions.push({ ...candidate, progress: Math.random() * 0.3 });
    }
  }

  // ==== Función para renderizar el panel ====
  const renderMissions = () => {
    missionList.innerHTML = "";
    let totalProgress = 0;

    missions.forEach(m => {
      totalProgress += m.progress;

      const li = document.createElement("li");
      li.className = "mission-item flex flex-col space-y-1";

      const taskLabel = document.createElement("span");
      taskLabel.textContent = m.task;
      taskLabel.className = "mission-task font-semibold text-green-200";

      const descLabel = document.createElement("span");
      descLabel.textContent = m.description;
      descLabel.className = "mission-desc text-green-400 text-sm";

      const progressContainer = document.createElement("div");
      progressContainer.className = "mission-progress-container w-full bg-gray-800 h-2 rounded-full overflow-hidden";

      const progressBar = document.createElement("div");
      progressBar.className = "mission-progress-bar h-2 transition-all duration-500";
      progressBar.style.width = `${m.progress * 100}%`;

      // Color dinámico según progreso
      progressBar.style.background = m.progress < 0.3 ? "#f87171"
                                : m.progress < 0.7 ? "#facc15"
                                : "#34d399";

      progressContainer.appendChild(progressBar);
      li.append(taskLabel, descLabel, progressContainer);
      missionList.appendChild(li);
    });

    // Actualizar barra global
    const avgProgress = totalProgress / missions.length;
    globalBar.style.width = `${avgProgress * 100}%`;
    globalBar.style.background = `linear-gradient(90deg, #34d399 ${avgProgress*100}%, #111 0%)`;
  };

  // ==== Exponer función para actualizar progreso desde COMMS ====
  window.updateMissionProgress = (taskName, increment = 0.05) => {
    const mission = missions.find(m => m.task === taskName);
    if (!mission) return;

    mission.progress = Math.min(1, mission.progress + increment);
    renderMissions();

    // Log en COMMS
    if (typeof addMessage === "function") {
      addMessage(`[MISION] "${taskName}" progresó al ${(mission.progress*100).toFixed(0)}%.`, "text-green-300");
    }
  };

  // ==== Función pública para mostrar/ocultar el panel de misiones ====
  window.toggleMissionPanel = (forceState) => {
    if (forceState === true) {
      missionPanel.classList.add("active");
    } else if (forceState === false) {
      missionPanel.classList.remove("active");
    } else {
      missionPanel.classList.toggle("active");
    }

    // Log en COMMS
    if (typeof addMessage === "function") {
      const state = missionPanel.classList.contains("active") ? "MOSTRADO" : "OCULTADO";
      addMessage(`[MISIONES] Panel ${state}.`, "text-yellow-300");
    }
  };

  // ==== Actualización periódica de progreso automática ====
  setInterval(() => {
    missions.forEach(m => {
      m.progress = Math.min(1, m.progress + Math.random() * 0.05);
    });
    renderMissions();
  }, 4000);

  // ==== Render inicial y mostrar panel ====
  renderMissions();
  missionPanel.classList.add("active"); // se muestra por defecto al iniciar
})();
