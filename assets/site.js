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

}());
