const MAX_POINTS = 28;
const POINT_LIFETIME = 420; // ms — short on purpose so the stroke vanishes fast once the cursor stops
const MAX_WIDTH = 16;
const MIN_WIDTH = 2;

export function initRipple(reducedMotion) {
  const canvas = document.getElementById("ripple-canvas");
  if (!canvas) return;

  const supportsFinePointer = window.matchMedia(
    "(hover: hover) and (pointer: fine)"
  ).matches;

  if (reducedMotion || !supportsFinePointer) {
    canvas.remove();
    return;
  }

  const ctx = canvas.getContext("2d");
  let points = [];
  let rafId = null;
  let colors = readColors();

  function readColors() {
    const styles = getComputedStyle(document.documentElement);
    return {
      c1: styles.getPropertyValue("--ripple-color-1").trim() || "20, 184, 166",
      c2: styles.getPropertyValue("--ripple-color-2").trim() || "99, 102, 241",
      c3: styles.getPropertyValue("--ripple-color-3").trim() || "139, 92, 246",
    };
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  const themeToggle = document.querySelector("[data-theme-toggle]");
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      setTimeout(() => {
        colors = readColors();
      }, 50);
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const now = performance.now();

    points = points.filter((p) => now - p.t < POINT_LIFETIME);

    if (points.length > 1) {
      const palette = [colors.c1, colors.c2, colors.c3];

      for (let i = 1; i < points.length; i++) {
        const from = points[i - 1];
        const to = points[i];

        const ageFrom = Math.min(1, (now - from.t) / POINT_LIFETIME);
        const ageTo = Math.min(1, (now - to.t) / POINT_LIFETIME);
        const widthFrom = MIN_WIDTH + (1 - ageFrom) * (MAX_WIDTH - MIN_WIDTH);
        const widthTo = MIN_WIDTH + (1 - ageTo) * (MAX_WIDTH - MIN_WIDTH);
        const alpha = (1 - ageTo) * 0.45;

        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;

        // build a tapered quad between the two points (a brush "ribbon" segment)
        // instead of stroking capped lines, which is what created the beaded/comet look
        const fx1 = from.x + (nx * widthFrom) / 2;
        const fy1 = from.y + (ny * widthFrom) / 2;
        const fx2 = from.x - (nx * widthFrom) / 2;
        const fy2 = from.y - (ny * widthFrom) / 2;
        const tx1 = to.x + (nx * widthTo) / 2;
        const ty1 = to.y + (ny * widthTo) / 2;
        const tx2 = to.x - (nx * widthTo) / 2;
        const ty2 = to.y - (ny * widthTo) / 2;

        const color = palette[i % palette.length];
        ctx.fillStyle = `rgba(${color}, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(fx1, fy1);
        ctx.lineTo(tx1, ty1);
        ctx.lineTo(tx2, ty2);
        ctx.lineTo(fx2, fy2);
        ctx.closePath();
        ctx.fill();
      }
    }

    if (points.length > 0) {
      rafId = requestAnimationFrame(draw);
    } else {
      rafId = null;
    }
  }

  function scheduleDraw() {
    if (rafId === null) {
      rafId = requestAnimationFrame(draw);
    }
  }

  function addPoint(x, y) {
    points.push({ x, y, t: performance.now() });
    if (points.length > MAX_POINTS) points.shift();
    scheduleDraw();
  }

  let ticking = false;
  window.addEventListener("pointermove", (e) => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      addPoint(e.clientX, e.clientY);
      ticking = false;
    });
  });

  document.addEventListener("pointerdown", (e) => {
    const ring = document.createElement("span");
    ring.className = "cursor-glow__pulse";
    ring.style.left = `${e.clientX}px`;
    ring.style.top = `${e.clientY}px`;
    document.body.appendChild(ring);

    if (window.gsap) {
      window.gsap.fromTo(
        ring,
        { scale: 0.3, opacity: 0.5 },
        {
          scale: 1.6,
          opacity: 0,
          duration: 0.7,
          ease: "power2.out",
          onComplete: () => ring.remove(),
        }
      );
    } else {
      setTimeout(() => ring.remove(), 700);
    }
  });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      points = [];
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  });
}
