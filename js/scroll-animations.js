export function initScrollAnimations(reducedMotion) {
  const gsap = window.gsap;

  if (reducedMotion || !gsap || !window.ScrollTrigger) {
    document.querySelectorAll(".reveal").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  } else {
    gsap.registerPlugin(window.ScrollTrigger);

    document.querySelectorAll(".reveal").forEach((el, i) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        delay: (i % 6) * 0.06,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    });
  }

  initHoverInteractions(reducedMotion);
}

function initHoverInteractions(reducedMotion) {
  const gsap = window.gsap;
  const selector = ".btn, .nav-link, .project-card, .copy-btn";

  document.addEventListener("pointerover", (e) => {
    const el = e.target.closest(selector);
    if (!el) return;
    animateHover(el, true, reducedMotion);
  });

  document.addEventListener("pointerout", (e) => {
    const el = e.target.closest(selector);
    if (!el) return;
    animateHover(el, false, reducedMotion);
  });
}

function animateHover(el, entering, reducedMotion) {
  const isCard = el.classList.contains("project-card") || el.classList.contains("testimonial-card");
  const lift = isCard ? -8 : -2;
  const scale = isCard ? 1.015 : 1;

  if (reducedMotion || !window.gsap) {
    el.style.transform = entering ? `translateY(${lift}px)` : "none";
    return;
  }

  window.gsap.to(el, {
    y: entering ? lift : 0,
    scale: entering ? scale : 1,
    duration: 0.35,
    ease: "power2.out",
  });
}
