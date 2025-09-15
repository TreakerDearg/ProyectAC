(function() {
  const alertList = document.getElementById("alert-list");
  const alertCritical = document.getElementById("alert-critical");

  const alerts = [
    { msg: "Radar detecta intrusión", critical: false },
    { msg: "Escudo al 40%", critical: true },
    { msg: "Sistema de comunicaciones activo", critical: false }
  ];

  const renderAlerts = () => {
    alertList.innerHTML = "";
    let hasCritical = false;

    alerts.forEach(a => {
      const li = document.createElement("li");
      li.textContent = a.msg;
      if (a.critical) {
        li.classList.add("text-red-500", "font-bold");
        hasCritical = true;
      } else {
        li.classList.add("text-green-200");
      }
      alertList.appendChild(li);
    });

    alertCritical.classList.toggle("hidden", !hasCritical);
  };

  renderAlerts();

  setInterval(() => {
    alerts.forEach(a => {
      if (Math.random() < 0.3) a.critical = !a.critical;
    });
    renderAlerts();
  }, 7000);
})();
