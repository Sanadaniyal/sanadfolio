const LINES = [
  "Senior Product Designer with 9 years in Tech & 6 years in Product Design.",
  "Developer turned Designer, bridging technology and human needs.",
  "Taking products from discovery and strategy to launch and beyond.",
  "Simplifying complex products into intuitive user experiences.",
  "Building scalable Design Systems for growing products.",
  "Leveraging AI to accelerate research, design, and innovation.",
];

const TYPE_SPEED = 42;
const PAUSE_AFTER_TYPE = 1800;
const PAUSE_AFTER_CLEAR = 300;
const REDUCED_MOTION_DWELL = 3500;

export function initHeroTagline(reducedMotion) {
  const mount = document.querySelector("[data-hero-tagline]");
  if (!mount) return;

  const sizers = LINES.map(
    (line) => `<span class="hero-tagline__sizer" aria-hidden="true">${line}</span>`
  ).join("");

  mount.innerHTML = `${sizers}<span class="hero-tagline__anim"><span class="hero-tagline__text"></span><span class="hero-tagline__cursor" aria-hidden="true">|</span></span>`;

  const textEl = mount.querySelector(".hero-tagline__text");

  if (reducedMotion) {
    let index = 0;
    textEl.textContent = LINES[0];
    setInterval(() => {
      index = (index + 1) % LINES.length;
      textEl.textContent = LINES[index];
    }, REDUCED_MOTION_DWELL);
    return;
  }

  let lineIndex = 0;
  let charIndex = 0;

  function type() {
    const line = LINES[lineIndex];
    textEl.textContent = line.slice(0, charIndex);

    if (charIndex <= line.length) {
      charIndex++;
      setTimeout(type, TYPE_SPEED);
    } else {
      setTimeout(clearLine, PAUSE_AFTER_TYPE);
    }
  }

  function clearLine() {
    textEl.textContent = "";
    charIndex = 0;
    lineIndex = (lineIndex + 1) % LINES.length;
    setTimeout(type, PAUSE_AFTER_CLEAR);
  }

  type();
}
