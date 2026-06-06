(function () {
  const toggle = document.querySelector("[data-nav-toggle]");
  const links = document.querySelector("[data-nav-links]");

  if (toggle && links) {
    toggle.addEventListener("click", function () {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    links.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll(".faq-item").forEach(function (item) {
    const button = item.querySelector(".faq-q");
    const answer = item.querySelector(".faq-a");
    if (!button || !answer) return;
    button.addEventListener("click", function () {
      const open = item.classList.toggle("open");
      button.setAttribute("aria-expanded", String(open));
      answer.hidden = !open;
    });
  });

  const newsletterUser = "BUTTONDOWN_USERNAME";
  document.querySelectorAll("[data-newsletter-form]").forEach(function (form) {
    const note = form.parentElement.querySelector("[data-form-note]");
    form.addEventListener("submit", function (event) {
      const email = form.querySelector('input[type="email"]');
      if (!email || !email.validity.valid) {
        event.preventDefault();
        if (note) {
          note.textContent = "Enter a valid email address.";
          note.dataset.state = "error";
        }
        email && email.focus();
        return;
      }

      if (newsletterUser === "BUTTONDOWN_USERNAME") {
        event.preventDefault();
        if (note) {
          note.textContent = "Field Notes subscriptions are opening shortly.";
          note.dataset.state = "success";
        }
        return;
      }

      form.action = "https://buttondown.com/api/emails/embed-subscribe/" + newsletterUser;
      if (note) {
        note.textContent = "Opening subscription confirmation…";
        note.dataset.state = "success";
      }
    });
  });
}());
