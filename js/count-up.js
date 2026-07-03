export function initCountUp(reducedMotion) {
  if (reducedMotion || !window.gsap || !window.ScrollTrigger) return;

  window.gsap.registerPlugin(window.ScrollTrigger);

  const els = document.querySelectorAll("[data-count-to]");

  els.forEach((el) => {
    const target = parseFloat(el.getAttribute("data-count-to"));
    const suffix = el.getAttribute("data-suffix") || "";
    const counter = { val: 0 };

    el.textContent = `0${suffix}`;

    window.gsap.to(counter, {
      val: target,
      duration: 1.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        once: true,
      },
      onUpdate: () => {
        el.textContent = `${Math.round(counter.val).toLocaleString("en-US")}${suffix}`;
      },
      onComplete: () => {
        el.textContent = `${target.toLocaleString("en-US")}${suffix}`;
      },
    });
  });
}
