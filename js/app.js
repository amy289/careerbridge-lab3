// CareerBridge demo interactions. No server/database is connected.
document.addEventListener("DOMContentLoaded", () => {
  // Keep the footer year current.
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });

  // Demo form feedback. The browser performs required/type/minlength validation first.
  document.querySelectorAll(".demo-form").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const feedback = form.querySelector(".form-feedback");
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Extra matching-password check on the registration page.
      const password = form.querySelector("#reg-password");
      const confirm = form.querySelector("#confirm-password");
      if (password && confirm && password.value !== confirm.value) {
        confirm.setCustomValidity("Passwords do not match.");
        confirm.reportValidity();
        confirm.addEventListener("input", () => confirm.setCustomValidity(""), { once: true });
        return;
      }

      // Check the selected resume size (5 MB maximum).
      const resume = form.querySelector("#resume");
      if (resume && resume.files.length && resume.files[0].size > 5 * 1024 * 1024) {
        resume.setCustomValidity("Please choose a file smaller than 5 MB.");
        resume.reportValidity();
        resume.addEventListener("change", () => resume.setCustomValidity(""), { once: true });
        return;
      }

      if (feedback) {
        feedback.textContent = "Success! This is a front-end demo; no information was sent or saved.";
        feedback.className = "form-feedback success";
      }
      form.reset();
    });
  });

  // Search/filter the sample job cards without reloading the page.
  const filterForm = document.querySelector("#job-filter");
  if (filterForm) {
    const params = new URLSearchParams(window.location.search);
    const keyword = document.querySelector("#job-keyword");
    const category = document.querySelector("#job-category");
    const type = document.querySelector("#job-type");
    const cards = [...document.querySelectorAll(".job-list-card")];
    const count = document.querySelector("#results-count");
    const empty = document.querySelector("#empty-state");

    keyword.value = params.get("q") || "";
    category.value = params.get("category") || "";
    type.value = params.get("type") || "";

    const applyFilters = () => {
      const term = keyword.value.trim().toLowerCase();
      let visible = 0;
      cards.forEach((card) => {
        const textMatches = !term || (card.dataset.title + " " + card.textContent).toLowerCase().includes(term);
        const categoryMatches = !category.value || card.dataset.category === category.value;
        const typeMatches = !type.value || card.dataset.type === type.value;
        const show = textMatches && categoryMatches && typeMatches;
        card.hidden = !show;
        if (show) visible += 1;
      });
      count.textContent = `Showing ${visible} of ${cards.length} sample jobs`;
      empty.hidden = visible !== 0;
    };

    filterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      applyFilters();
    });
    keyword.addEventListener("input", applyFilters);
    category.addEventListener("change", applyFilters);
    type.addEventListener("change", applyFilters);
    applyFilters();
  }

  // Preselect the job when an Apply link includes ?job=...
  const jobSelect = document.querySelector("#app-job");
  if (jobSelect) {
    const requestedJob = new URLSearchParams(window.location.search).get("job");
    if (requestedJob) {
      const match = [...jobSelect.options].find((option) => option.text === requestedJob);
      if (match) jobSelect.value = match.value;
    }
  }
});
