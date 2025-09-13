// ==========================
// Panel Controller (Template)
// ==========================

(function() {
  const buttons = document.querySelectorAll("[data-modal]");
  const modals = document.querySelectorAll(".hud-modal");

  const closeAll = () => {
    modals.forEach(m => m.classList.add("hidden"));
  };

  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      const modalId = btn.dataset.modal;
      const modal = document.getElementById(modalId);
      if (!modal) return;

      if (!modal.classList.contains("hidden")) {
        modal.classList.add("hidden");
        return;
      }

      closeAll();
      modal.classList.remove("hidden");
      gsap.fromTo(modal, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
})();
