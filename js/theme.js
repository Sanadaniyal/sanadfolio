const STORAGE_KEY = "theme";
const THUMB_TRAVEL_PX = 20;

function getStoredTheme() {
  return localStorage.getItem(STORAGE_KEY);
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

function positionThumb(thumb, theme, animate, reducedMotion) {
  const x = theme === "light" ? THUMB_TRAVEL_PX : 0;

  if (!reducedMotion && animate && window.gsap) {
    window.gsap.to(thumb, { x, duration: 0.4, ease: "power3.out" });
  } else {
    thumb.style.transform = `translateX(${x}px)`;
  }
}

export function initTheme(reducedMotion) {
  const toggle = document.querySelector("[data-theme-toggle]");
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  media.addEventListener("change", (e) => {
    if (!getStoredTheme()) {
      applyTheme(e.matches ? "dark" : "light");
    }
  });

  if (!toggle) return;

  const thumb = toggle.querySelector("[data-theme-thumb]");
  const currentTheme = document.documentElement.getAttribute("data-theme");

  toggle.setAttribute("aria-checked", String(currentTheme === "dark"));
  if (thumb) positionThumb(thumb, currentTheme, false, reducedMotion);

  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    toggle.setAttribute("aria-checked", String(next === "dark"));

    if (thumb) positionThumb(thumb, next, true, reducedMotion);

    if (!reducedMotion && window.gsap) {
      const thumbIcon = toggle.querySelector("[data-theme-thumb-icon]");
      if (thumbIcon) {
        window.gsap.fromTo(
          thumbIcon,
          { scale: 0.6, rotate: -25 },
          { scale: 1, rotate: 0, duration: 0.45, ease: "elastic.out(1, 0.55)" }
        );
      }
    }
  });
}
