import { projects } from "../data/projects.js";

export function renderWork() {
  const grid = document.querySelector("[data-work-grid]");
  if (!grid) return;

  grid.innerHTML = projects
    .map(
      (p) => `
      <article class="project-card glass reveal">
        <div class="project-card__thumb">
          <img src="assets/images/projects/placeholder-web.jpg" alt="" class="project-card__thumb-img" />
          <span class="project-card__tag">${p.tag}</span>
        </div>
        <div class="project-card__body">
          <h3 class="project-card__title">${p.title}</h3>
          <p class="project-card__desc">${p.description}</p>
          <a href="${p.link}" class="btn btn-outline"><span class="btn-outline__label">View project</span></a>
        </div>
      </article>`
    )
    .join("");
}
