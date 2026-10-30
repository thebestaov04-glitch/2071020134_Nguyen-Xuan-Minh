const themeToggle = document.getElementById("theme-toggle");
const savedTheme = localStorage.getItem("portfolio-theme");

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";

  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.textContent = isDark ? "☀️" : "🌙";
}

setTheme(savedTheme === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
  localStorage.setItem("portfolio-theme", nextTheme);
});

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const touchDevice = window.matchMedia("(pointer: coarse)").matches;

import("https://cdn.jsdelivr.net/npm/motion@14.7.1/+esm")
  .then(({ animate, drag }) => {
    document.querySelectorAll(".hero, .about, .skill-card, .card").forEach((card) => {
      card.classList.add("drag-enabled");

      drag(card, {
        directionLock: !touchDevice,
        axis: touchDevice ? "x" : undefined,
        constraints: { top: -24, right: 24, bottom: 24, left: -24 },
        elastic: reduceMotion ? 0 : 0.2,
        momentum: false,
        transition: { bounceStiffness: 500, bounceDamping: 15 },
        onStart: () => {
          card.classList.add("is-dragging");
          if (touchDevice) card.dataset.dragAxis = "x";
        },
        onDirectionLock: (axis) => {
          card.dataset.dragAxis = axis;
        },
        onEnd: () => {
          card.classList.remove("is-dragging");
          delete card.dataset.dragAxis;
          animate(
            card,
            { x: 0, y: 0 },
            reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 28 }
          );
        },
      });
    });
  })
  .catch(() => {
    console.warn("Không tải được Motion; tính năng kéo các thẻ nội dung hiện không khả dụng.");
  });
