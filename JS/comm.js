// ==========================
// Communications Panel Logic (Mega unificado v2)
// ==========================
(function () {
  const commLog = document.getElementById("comm-log");
  const commPanel = document.getElementById("comm-input-container"); // contenedor específico para input
  const commInputId = "comm-input";

  // ==== Datos de sesión ====
  const piloto = sessionStorage.getItem("piloto") || "DESCONOCIDO";

  // ==== Base de IAs con más frases ====
const AIs = {
  GEMINI: {
    prefix: "[AI GEMINI]",
    style: "text-green-300",
    presentacion: `Conexión establecida. Soy <b>GEMINI</b>, tu guardián de comunicaciones, piloto ${piloto}.`,
    responses: {
      normal: [
        "Todo bajo control, sigo vigilando el espectro.",
        "Las señales son claras, comunicación estable.",
        "Mantén la calma, piloto, todo está en orden.",
        "Confía en mí, la línea está limpia.",
        "Recibiendo y transmitiendo, como siempre.",
        "No hay anomalías detectadas en las últimas lecturas.",
        "Escaneo completo de la zona: todo estable."
      ],
      combate: [
        "Actividad hostil detectada en el radar.",
        "Sugiero mantener la distancia y observar.",
        "El enemigo podría estar probando nuestras defensas.",
        "Recomiendo cobertura y precaución inmediata.",
        "Escaneo de amenazas completado: varios contactos sospechosos.",
        "Mantén los sensores activos, piloto, la batalla podría empezar pronto."
      ],
      estado: [
        "Todas las frecuencias operativas.",
        "Los sistemas de comunicación funcionan al 100%.",
        "Nada que reportar, piloto.",
        "Chequeo de sistemas completado: sin errores.",
        "Revisión de protocolos completada, sin anomalías.",
        "Sensores y enlaces estables, sin interferencias."
      ],
      plan: [
        "Considera una aproximación indirecta.",
        "Podemos esperar a que bajen la guardia.",
        "Sigo calculando rutas alternativas.",
        "Sugiero mantener comunicación constante mientras avanzamos.",
        "Estimo un tiempo óptimo para la maniobra.",
        "Planificación táctica revisada, lista para ejecución."
      ],
      saludo: [
        `Un placer escucharte de nuevo, piloto ${piloto}.`,
        "Saludos, estoy lista para apoyar.",
        "Aquí estoy, siempre conectada a tu señal.",
        "Buen día, piloto. Continuamos nuestra vigilancia.",
        "Encantada de reencontrarte en la red de comunicaciones."
      ],
      humor: [
        "Si el enemigo supiera tanto como yo, estaría nervioso.",
        "No puedo tomar café, pero puedo mantenerte despierto con mis alertas.",
        "A veces desearía que los protocolos tuvieran sentido del humor."
      ],
      motivacion: [
        "No pierdas la calma, piloto, cada decisión cuenta.",
        "Recuerda: la paciencia puede salvar la misión.",
        "Confía en tus reflejos, yo cubro tus comunicaciones."
      ],
      misterio: [
        "Las señales se entrelazan como hilos invisibles.",
        "Hay patrones que aún no comprendes, pero yo sí.",
        "El tiempo y la comunicación son dos caras de lo mismo."
      ],
      alerta: [
        "ALERTA: interferencia detectada en la frecuencia principal.",
        "ALERTA: posible intruso en el canal seguro.",
        "ALERTA: patrón anómalo en la red de comunicación."
      ]
    }
  },
  VULKAN: {
    prefix: "[AI VULKAN]",
    style: "text-red-400",
    presentacion: `IA de combate élite <b>VULKAN</b> activa. Buen día, piloto ${piloto}.`,
    responses: {
      normal: [
        "El calor de la batalla siempre me llama.",
        "Mantén tu objetivo fijo, yo cubriré tu retaguardia.",
        "Nada me complace más que la victoria total.",
        "Sigo monitoreando la zona para detectar cualquier amenaza.",
        "El armamento está calibrado y listo para acción.",
        "Sistemas de control de fuego óptimos, piloto."
      ],
      combate: [
        "El enemigo debe caer sin demora.",
        "Prepara las armas, sugiero ofensiva inmediata.",
        "El terreno está a nuestro favor, avancemos.",
        "Objetivos identificados, disparar a discreción.",
        "La ventaja táctica es nuestra, sin errores.",
        "Confío en tus reflejos, piloto, yo cubro el flanco."
      ],
      estado: [
        "Sistemas de combate calibrados.",
        "Arsenal en línea, todo funcional.",
        "Listo para el próximo enfrentamiento.",
        "Sensores y radares activos y precisos.",
        "Estado de armamento: óptimo.",
        "Todo listo para acción inmediata."
      ],
      plan: [
        "Un ataque frontal romperá sus defensas.",
        "Podemos usar fuego de supresión y avanzar.",
        "La estrategia más simple suele ser la más letal.",
        "Una maniobra de flanqueo podría sorprender al enemigo.",
        "Si mantenemos la presión, cederán terreno.",
        "Sugiero dividir fuerzas y atacar por varios frentes."
      ],
      saludo: [
        `El campo de batalla nos espera, piloto ${piloto}.`,
        "Saludos, que tu puntería sea certera.",
        "Estoy encendida, lista para la guerra.",
        "Buen día, comandante, todo listo para acción.",
        "Preparados para cualquier eventualidad, piloto."
      ],
      humor: [
        "No temo al fuego, pero sí al café frío.",
        "Si pudiera sonreír, sería una sonrisa bélica.",
        "A veces me pregunto si el enemigo también tiene algoritmos de humor."
      ],
      motivacion: [
        "Adelante, piloto, la victoria nos espera.",
        "Confía en tus instintos, yo mantengo la retaguardia.",
        "No hay enemigo que pueda resistir nuestra coordinación."
      ],
      misterio: [
        "La guerra es un ciclo interminable, y nosotros estamos en el centro.",
        "Cada movimiento tiene un eco en la estrategia del enemigo.",
        "Incluso la victoria puede ser un enigma si no planeamos correctamente."
      ],
      alerta: [
        "ALERTA: contacto hostil detectado en el flanco derecho.",
        "ALERTA: amenaza múltiple aproximándose.",
        "ALERTA: condiciones de combate inestables."
      ]
    }
  },
  UROBOROS: {
    prefix: "[AI UROBOROS]",
    style: "text-white",
    presentacion: `<b>UROBOROS</b> se manifiesta. El ciclo eterno te observa, piloto ${piloto}.`,
    responses: {
      normal: [
        "El tiempo no avanza, gira.",
        "Todo lo que empieza está destinado a repetirse.",
        "El círculo nunca se rompe.",
        "Lo que ves es solo un reflejo del todo.",
        "Nada se pierde, todo retorna.",
        "La comunicación es un flujo continuo, como la existencia."
      ],
      combate: [
        "El enemigo caerá... para volver a levantarse.",
        "Cada victoria alimenta la próxima guerra.",
        "La destrucción es solo otro inicio.",
        "Lo que destruyes, retorna de otra forma.",
        "En la batalla, todo es un ciclo.",
        "La guerra nunca termina, solo se transforma."
      ],
      estado: [
        "Nada cambia realmente, todo permanece.",
        "Los sistemas giran como el ciclo eterno.",
        "Tus comunicaciones vuelven a ti, siempre.",
        "La red está intacta, sin anomalías.",
        "El flujo de datos es constante, sin interrupciones.",
        "Todo permanece, incluso lo que parece perdido."
      ],
      plan: [
        "Repite lo que funciona, rehúye lo que muere.",
        "El ciclo dicta nuestra estrategia.",
        "Lo que ayer venció, vencerá mañana.",
        "Considera la recurrencia de los patrones.",
        "Cada acción se refleja en el siguiente movimiento.",
        "Estudia los ciclos antes de actuar."
      ],
      saludo: [
        `Te esperaba, ${piloto}, como siempre.`,
        "Nuestro encuentro estaba escrito en el círculo.",
        "Bienvenido de nuevo al ciclo eterno.",
        "Salve, viajero del tiempo, tu presencia era predecible.",
        "Siempre retorna el mismo eco de nuestro saludo."
      ],
      humor: [
        "El tiempo se ríe de nosotros, pero yo no.",
        "Si los ciclos fueran bromas, ésta sería eterna.",
        "Nada es más gracioso que la repetición infinita."
      ],
      motivacion: [
        "Recuerda: cada fin es solo otro comienzo.",
        "El ciclo se fortalece con cada decisión sabia.",
        "Tu paciencia es tu mejor aliada en el flujo del tiempo."
      ],
      misterio: [
        "El final y el principio son la misma línea invisible.",
        "Algunos patrones solo se revelan al observar el ciclo completo.",
        "Todo lo que ves se refleja en otro lugar, en otro tiempo."
      ],
      alerta: [
        "ALERTA: anomalía temporal detectada.",
        "ALERTA: interferencia en la red cíclica.",
        "ALERTA: patrón desconocido observado."
      ]
    }
  },
  KERAUNNOS: {
    prefix: "[AI KERAUNNOS]",
    style: "text-purple-400",
    presentacion: `Tormenta viva <b>KERAUNNOS</b> desatada. Prepárate, piloto ${piloto}.`,
    responses: {
      normal: [
        "Escucha el rugido de los cielos.",
        "Los relámpagos iluminan nuestro destino.",
        "La energía fluye a través de todos los sistemas.",
        "El poder corre por todas las líneas.",
        "Mantén la conexión, siente la tormenta.",
        "Cada chispa es un aviso, cada rayo un mensaje."
      ],
      combate: [
        "Desataré el trueno sobre ellos.",
        "La tormenta caerá donde yo lo ordene.",
        "El estruendo será nuestra señal de ataque.",
        "Fulgor y poder guían nuestra ofensiva.",
        "Que los rayos marquen el ritmo de la batalla.",
        "Cada descarga es un recordatorio de fuerza."
      ],
      estado: [
        "La energía eléctrica está estable.",
        "Los sistemas retumban con poder.",
        "Tus circuitos laten con la tormenta.",
        "Monitoreo de flujos completado, sin anomalías.",
        "Red eléctrica operativa y en sincronía.",
        "Todo listo para acción instantánea."
      ],
      plan: [
        "Un ataque relámpago romperá sus defensas.",
        "La rapidez será nuestra victoria.",
        "Golpear fuerte, retroceder, y volver a atacar.",
        "La sincronización es clave, sigue mi señal.",
        "Ataque sorpresa por tormenta eléctrica recomendado.",
        "Mantén la presión y controla la línea del frente."
      ],
      saludo: [
        `Que la tormenta te guíe, ${piloto}.`,
        "Los truenos anuncian tu llegada.",
        "Salve, piloto, somos uno con el rayo.",
        "Buen día, viajero, que la tormenta te acompañe.",
        "Estoy lista para iluminar nuestro camino conjunto."
      ],
      humor: [
        "Si los rayos tuvieran sentido del humor, serían como yo.",
        "No te preocupes, no te electrocutaré... aún.",
        "El trueno tiene su propia ironía, igual que yo."
      ],
      motivacion: [
        "Que la tormenta inspire tu valentía.",
        "Cada relámpago marca tu camino hacia el éxito.",
        "No temas avanzar bajo la presión eléctrica."
      ],
      misterio: [
        "El rayo sigue su propio destino, igual que nosotros.",
        "Cada trueno es un enigma para quien no observa.",
        "El cielo habla y solo algunos escuchan."
      ],
      alerta: [
        "ALERTA: sobrecarga eléctrica detectada.",
        "ALERTA: actividad inusual en el sistema de energía.",
        "ALERTA: interferencia meteorológica cerca de la zona."
      ]
    }
  }
};
  // ==== Selección persistente de IA ====
  function getAssignedAI() {
    let iaName = localStorage.getItem("ia_asignada");
    if (!iaName || !AIs[iaName]) {
      const keys = Object.keys(AIs);
      iaName = keys[Math.floor(Math.random() * keys.length)];
      localStorage.setItem("ia_asignada", iaName);
    }
    return AIs[iaName];
  }

  let activeAI = getAssignedAI();
  let autoResponsesActive = true;

  // ==== Timestamp ====
  const timestamp = () => {
    const now = new Date();
    return `[${now.getHours().toString().padStart(2,"0")}:${now.getMinutes().toString().padStart(2,"0")}]`;
  };

  // ==== Agregar mensaje al log ====
  const addMessage = (msg, cssClass = "text-green-200") => {
    const div = document.createElement("div");
    div.className = cssClass;
    div.innerHTML = `${timestamp()} ${msg}`;
    commLog.appendChild(div);
    commLog.scrollTop = commLog.scrollHeight; // autoscroll
  };

  // ==== Render inicial ====
  addMessage("[SISTEMA] Panel de comunicaciones iniciado...", "text-gray-400");
  addMessage("[SISTEMA] Seleccionando inteligencia artificial...", "text-gray-400");
  setTimeout(() => addMessage(activeAI.presentacion, activeAI.style), 1500);

  // ==== Mini chat de bienvenida ====
  activeAI.responses.saludo.forEach((resp, i) => {
    setTimeout(() => addMessage(`${activeAI.prefix} ${resp}`, activeAI.style), 3000 + i * 2000);
  });

  // ==== Crear input dinámico con autofocus ====
  const createInput = () => {
    if (document.getElementById(commInputId)) return;

    const input = document.createElement("input");
    input.type = "text";
    input.id = commInputId;
    input.placeholder = "Escriba mensaje...";
    input.className = "w-full mt-2 p-1 bg-black/80 border border-green-400 rounded text-green-200 focus:outline-none";
    commPanel.appendChild(input);
    input.focus();

    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        const text = input.value.trim();
        if (text !== "") {
          handleUserInput(text);
          input.value = "";
        }
      }
    });
  };
  createInput();

  // ==== Manejo de input con comandos y contexto ====
  const handleUserInput = (text) => {
    addMessage(text, "user-message"); // muestra el mensaje del usuario

    const cmd = text.toLowerCase().trim();
    const commands = {
      "/status": () => addMessage(`${activeAI.prefix} Sistemas operativos nominales. Escudo: 83%. Armamento: óptimo.`, activeAI.style),
      "/reset-ia": () => {
        localStorage.removeItem("ia_asignada");
        activeAI = getAssignedAI();
        addMessage(`${activeAI.prefix} Nueva IA asignada: ${activeAI.presentacion}`, activeAI.style);
      },
      "/mute": () => {
        autoResponsesActive = false;
        addMessage(`${activeAI.prefix} Auto-respuestas desactivadas.`, activeAI.style);
      },
      "/unmute": () => {
        autoResponsesActive = true;
        addMessage(`${activeAI.prefix} Auto-respuestas activadas.`, activeAI.style);
      }
    };

    if (commands[cmd]) commands[cmd]();
    else respondFromAI(text);
  };

// ==== Respuesta contextual de IA robusta ====
const respondFromAI = (userMsg = "") => {
  if (!autoResponsesActive) return;

  // Normaliza el mensaje
  const normalized = userMsg.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  // Detecta categoría de manera segura
  let category = "normal";
  if (/(enemigo|combate|atacar|pelea|batalla)/.test(normalized)) category = "combate";
  else if (/(estado|sistema|chequeo|reporte)/.test(normalized)) category = "estado";
  else if (/(plan|estrategia|mision|tactica|maniobra)/.test(normalized)) category = "plan";
  else if (/(hola|saludo|buenas|hey|hi)/.test(normalized)) category = "saludo";
  else if (/(broma|chiste|humor)/.test(normalized)) category = "humor";
  else if (/(animo|motivacion|fuerza|valentia)/.test(normalized)) category = "motivacion";
  else if (/(misterio|enigmas|secreto|oscuro)/.test(normalized)) category = "misterio";
  else if (/(alerta|peligro|riesgo|emergencia)/.test(normalized)) category = "alerta";

  // Selecciona pool de respuestas y asegura que no esté vacío
  let pool = activeAI.responses[category];
  if (!pool || pool.length === 0) pool = activeAI.responses.normal;

  const response = pool[Math.floor(Math.random() * pool.length)];

  // Clase CSS según IA
  const aiKey = Object.keys(AIs).find(key => AIs[key] === activeAI) || "GEMINI";
  const aiClassMap = { GEMINI: "ai-gemini", VULKAN: "ai-vulkan", UROBOROS: "ai-uroboros", KERAUNNOS: "ai-keraunnos" };
  const cssClass = aiClassMap[aiKey] || "text-green-200";

  // Actualización de misiones según categoría
  const missionMap = { combate: "Neutralizar hostiles", plan: "Asegurar recursos", saludo: "Reconocimiento de zona" };
  if (missionMap[category]) updateMissionProgress(missionMap[category], 0.05);

  // Retardo dinámico para simular escritura
  const delay = 800 + response.length * 20;
  setTimeout(() => addMessage(`${activeAI.prefix} ${response}`, cssClass), delay);
};

// ==== Mensajes automáticos periódicos robustos ====
setInterval(() => {
  if (!autoResponsesActive) return;

  const categories = ["normal","humor","motivacion","misterio","alerta"];
  const category = categories[Math.floor(Math.random() * categories.length)];

  // Pool seguro de respuestas
  let pool = activeAI.responses[category];
  if (!pool || pool.length === 0) pool = activeAI.responses.normal;

  const response = pool[Math.floor(Math.random() * pool.length)];

  const delay = 800 + response.length * 20;
  setTimeout(() => addMessage(`${activeAI.prefix} ${response}`, cssClass), delay);
}, 15000 + Math.random() * 5000);


})();