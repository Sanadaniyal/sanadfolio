export function initContactForm(reducedMotion) {
  const toggle = document.querySelector("[data-connect-toggle]");
  const wrap = document.querySelector("[data-contact-form-wrap]");
  const form = document.querySelector("[data-contact-form]");
  const status = document.querySelector("[data-form-status]");

  if (!toggle || !wrap || !form) return;

  const submitBtn = form.querySelector("[data-contact-submit]");
  const emailField = form.querySelector("#contact-email");
  const messageField = form.querySelector("#contact-message");

  function updateSubmitState() {
    const hasEmail = emailField.value.trim().length > 0;
    const hasMessage = messageField.value.trim().length > 0;
    submitBtn.disabled = !(hasEmail && hasMessage);
  }

  updateSubmitState();
  emailField.addEventListener("input", updateSubmitState);
  messageField.addEventListener("input", updateSubmitState);

  let open = false;

  toggle.addEventListener("click", () => {
    open = !open;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.classList.toggle("btn-primary", !open);
    toggle.classList.toggle("btn-secondary", open);

    if (open) {
      wrap.hidden = false;
      const height = wrap.scrollHeight;

      if (reducedMotion || !window.gsap) {
        wrap.style.height = "auto";
        wrap.style.opacity = "1";
      } else {
        window.gsap.fromTo(
          wrap,
          { height: 0, opacity: 0 },
          {
            height,
            opacity: 1,
            duration: 0.6,
            ease: "power3.out",
            onComplete: () => {
              wrap.style.height = "auto";
            },
          }
        );
        window.gsap.fromTo(
          wrap.querySelectorAll(".form-field, [data-contact-submit]"),
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            stagger: 0.07,
            delay: 0.15,
            onComplete: () => {
              submitBtn.style.removeProperty("opacity");
            },
          }
        );
      }
    } else if (reducedMotion || !window.gsap) {
      wrap.hidden = true;
    } else {
      window.gsap.to(wrap, {
        height: 0,
        opacity: 0,
        duration: 0.4,
        ease: "power2.in",
        onComplete: () => {
          wrap.hidden = true;
        },
      });
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    submitBtn.disabled = true;
    status.textContent = "Sending...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (response.ok) {
        status.textContent = "Thanks — your message has been sent!";
        form.reset();
      } else {
        status.textContent = "Something went wrong. Please try again or email directly.";
      }
    } catch (err) {
      status.textContent = "Something went wrong. Please try again or email directly.";
    } finally {
      updateSubmitState();
    }
  });
}
