(function() {
  const weaponList = document.getElementById("weapon-list");
  const weaponEnergyBar = document.getElementById("weapon-energy-bar");

  const weapons = [
    { name: "Cañón Láser", energy: 0.9 },
    { name: "Misiles Térmicos", energy: 0.7 },
    { name: "Rifle de Plasma", energy: 0.5 },
    { name: "Cañón Iónico", energy: 0.3 }
  ];

  const renderWeapons = () => {
    weaponList.innerHTML = "";
    weapons.forEach(w => {
      const li = document.createElement("li");
      li.classList.add("flex", "justify-between", "items-center");

      const nameSpan = document.createElement("span");
      nameSpan.textContent = w.name;

      const energyDiv = document.createElement("div");
      energyDiv.classList.add("h-2", "w-16", "bg-green-900", "rounded-full", "overflow-hidden");
      const energyBar = document.createElement("div");
      energyBar.classList.add("h-2", "bg-green-400", "transition-all");
      energyBar.style.width = `${w.energy * 100}%`;
      energyDiv.appendChild(energyBar);

      li.appendChild(nameSpan);
      li.appendChild(energyDiv);
      weaponList.appendChild(li);
    });

    const avgEnergy = weapons.reduce((acc, w) => acc + w.energy, 0) / weapons.length;
    weaponEnergyBar.style.width = `${avgEnergy * 100}%`;
  };

  renderWeapons();

  setInterval(() => {
    weapons.forEach(w => {
      w.energy = Math.max(0, Math.min(1, w.energy + (Math.random() - 0.5) * 0.1));
    });
    renderWeapons();
  }, 5000);
})();
