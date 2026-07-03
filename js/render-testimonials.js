import { testimonials } from "../data/testimonials.js";

const PIXELS_PER_SECOND = 40;

function cardHTML(t, hidden) {
  return `
      <article class="testimonial-card glass reveal" style="width: ${t.cardWidth}px;" ${hidden ? 'aria-hidden="true"' : ""}>
        <div class="testimonial-card__header">
          <span class="testimonial-card__avatar">${
            t.avatar
              ? `<img src="${t.avatar}" alt="${t.name}" class="testimonial-card__avatar-img" />`
              : t.initials
          }</span>
          <div>
            <p class="testimonial-card__name">${t.name}</p>
            <p class="testimonial-card__title">${t.title}</p>
          </div>
        </div>
        <p class="testimonial-card__quote">&ldquo;${t.quote}&rdquo;</p>
      </article>`;
}

export function renderTestimonials(reducedMotion) {
  const grid = document.querySelector("[data-testimonials-grid]");
  if (!grid) return;

  const originalSet = testimonials.map((t) => cardHTML(t, false)).join("");

  if (reducedMotion) {
    grid.innerHTML = originalSet;
    return;
  }

  const duplicateSet = testimonials.map((t) => cardHTML(t, true)).join("");
  grid.innerHTML = originalSet + duplicateSet;

  const totalWidth = grid.scrollWidth / 2;
  const duration = totalWidth / PIXELS_PER_SECOND;
  grid.style.setProperty("--marquee-duration", `${duration}s`);
  grid.classList.add("is-marquee");
}
