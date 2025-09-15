(function() {
  const damageList = document.getElementById("damage-list");
  const shieldBar = document.getElementById("shield-bar");

  const systems = [
    { name: "Motor", health: 0.9 },
    { name: "Sistema de armas", health: 0.7 },
    { name: "Blindaje frontal", health: 0.8 },
    { name: "Sensores", health: 0.6 }
  ];

  const renderDamage = () => {
    damageList.innerHTML = "";
    systems.forEach(s => {
      const li = document.createElement("li");
      li.classList.add("flex", "justify-between", "items-center");
      li.textContent = s.name;
      const barContainer = document.createElement("div");
      barContainer.classList.add("h-2", "w-16", "bg-blue-900", "rounded-full", "overflow-hidden");
      const bar = document.createElement("div");
      bar.classList.add("h-2", "bg-blue-400", "transition-all");
      bar.style.width = `${s.health * 100}%`;
      barContainer.appendChild(bar);
      li.appendChild(barContainer);
      damageList.appendChild(li);
    });

    const avgHealth = systems.reduce((acc, s) => acc + s.health, 0) / systems.length;
    shieldBar.style.width = `${avgHealth * 100}%`;
  };

  renderDamage();

  setInterval(() => {
    systems.forEach(s => {
      s.health = Math.max(0, Math.min(1, s.health + (Math.random() - 0.5) * 0.05));
    });
    renderDamage();
  }, 5000);
})();
