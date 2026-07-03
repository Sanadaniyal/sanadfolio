export function initNav() {
  const hamburger = document.querySelector("[data-nav-hamburger]");
  const links = document.querySelector("[data-nav-links]");
  const overlay = document.querySelector("[data-nav-overlay]");
  const navPill = document.querySelector(".nav-pill");

  if (!hamburger || !links || !overlay) return;

  if (navPill) {
    const SCROLL_THRESHOLD = 10;
    let ticking = false;

    function updateScrolled() {
      navPill.classList.toggle("is-scrolled", window.scrollY > SCROLL_THRESHOLD);
      ticking = false;
    }

    updateScrolled();
    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(updateScrolled);
        }
      },
      { passive: true }
    );
  }

  function setOpen(open) {
    links.setAttribute("data-open", String(open));
    overlay.setAttribute("data-open", String(open));
    hamburger.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }

  hamburger.addEventListener("click", () => {
    const isOpen = links.getAttribute("data-open") === "true";
    setOpen(!isOpen);
  });

  overlay.addEventListener("click", () => setOpen(false));

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });
}
