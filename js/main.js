import { initTheme } from "./theme.js";
import { initNav } from "./nav.js";
import { initRipple } from "./ripple.js";
import { initHeroTagline } from "./hero-tagline.js";
import { renderWork } from "./render-work.js";
import { renderTestimonials } from "./render-testimonials.js";
import { initScrollAnimations } from "./scroll-animations.js";
import { initContactForm } from "./contact-form.js";
import { initCopyButtons } from "./copy-to-clipboard.js";
import { initCountUp } from "./count-up.js";

const reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

initTheme(reducedMotion);
initNav();
initRipple(reducedMotion);
initHeroTagline(reducedMotion);
renderWork();
renderTestimonials(reducedMotion);
initScrollAnimations(reducedMotion);
initContactForm(reducedMotion);
initCopyButtons();
initCountUp(reducedMotion);
