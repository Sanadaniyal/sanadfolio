export function initCopyButtons() {
  document.querySelectorAll("[data-copy]").forEach((btn) => {
    const originalLabel = btn.getAttribute("aria-label");

    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy");

      try {
        await navigator.clipboard.writeText(value);
      } catch (err) {
        return;
      }

      btn.classList.add("is-copied");
      btn.setAttribute("aria-label", "Copied!");

      setTimeout(() => {
        btn.classList.remove("is-copied");
        btn.setAttribute("aria-label", originalLabel);
      }, 1500);
    });
  });
}
