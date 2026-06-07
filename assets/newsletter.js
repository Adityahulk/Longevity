(function () {
  var action = window.BREVO_NEWSLETTER_FORM_ACTION || "";
  var frameName = "brevo-form-target";

  if (action && !document.getElementById("brevo-form-frame")) {
    var frame = document.createElement("iframe");
    frame.id = "brevo-form-frame";
    frame.name = frameName;
    frame.title = "Newsletter signup";
    frame.setAttribute("aria-hidden", "true");
    frame.style.cssText = "position:absolute;width:1px;height:1px;border:0;opacity:0;pointer-events:none";
    document.body.appendChild(frame);
  }

  document.querySelectorAll("[data-brevo-form]").forEach(function (form) {
    var note = form.parentElement.querySelector("[data-brevo-note]");

    if (!action) {
      form.addEventListener("submit", function (event) {
        event.preventDefault();
        if (note) {
          note.textContent = "Newsletter signup is being connected. Check back shortly.";
        }
      });
      return;
    }

    form.action = action;
    form.target = frameName;

    form.addEventListener("submit", function () {
      if (note) {
        note.textContent = "Thanks! Check your inbox to confirm your subscription.";
      }
      window.setTimeout(function () {
        var email = form.querySelector('input[type="email"]');
        if (email) {
          email.value = "";
        }
      }, 0);
    });
  });

  if (window.location.search.indexOf("subscribed=1") !== -1 && document.querySelector("[data-brevo-note]")) {
    document.querySelector("[data-brevo-note]").textContent =
      "You're subscribed. New Field Notes will arrive when we publish.";
  }
}());
