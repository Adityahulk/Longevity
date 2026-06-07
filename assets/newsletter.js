(function () {
  var action = window.BREVO_NEWSLETTER_FORM_ACTION || "";

  document.querySelectorAll("[data-brevo-form]").forEach(function (form) {
    var note = form.parentElement.querySelector("[data-brevo-note]");

    if (action) {
      form.action = action;
      form.target = "_blank";
      form.setAttribute("rel", "noopener noreferrer");
      return;
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (note) {
        note.textContent = "Newsletter signup is being connected. Check back shortly.";
      }
    });
  });
}());
