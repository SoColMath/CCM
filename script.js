// ======================================================
// XXV Congreso Colombiano de Matemáticas
// Script principal
// ======================================================

// ======================================================
// Sistema de pestañas
// ======================================================
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  if (!tabButtons.length || !tabContents.length) return;

  function activateTab(tabName, shouldScroll = true) {
    tabButtons.forEach((button) => {
      button.classList.remove("active");
      button.setAttribute("aria-selected", "false");
    });

    tabContents.forEach((content) => {
      content.classList.remove("active");
    });

    const activeButton = document.querySelector(
      `.tab-btn[data-tab="${tabName}"]`
    );
    const activeContent = document.getElementById(`tab-${tabName}`);

    if (!activeButton || !activeContent) return;

    activeButton.classList.add("active");
    activeButton.setAttribute("aria-selected", "true");
    activeContent.classList.add("active");

    if (shouldScroll) {
      const mainContent = document.querySelector(".main-content");
      if (mainContent) {
        mainContent.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }

    history.replaceState(null, "", `#tab-${tabName}`);
  }

  tabButtons.forEach((button) => {
    button.setAttribute("role", "tab");
    button.setAttribute("tabindex", "0");

    button.addEventListener("click", () => {
      const tabName = button.getAttribute("data-tab");
      activateTab(tabName);
    });

    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const tabName = button.getAttribute("data-tab");
        activateTab(tabName);
      }
    });
  });

  const hash = window.location.hash.replace("#tab-", "");
  if (hash) {
    activateTab(hash, false);
  }

  window.activateCongressTab = activateTab;
}

// ======================================================
// Botones que abren pestañas específicas
// ======================================================
function initTabLinks() {
  const links = document.querySelectorAll("[data-open-tab]");

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const tabName = link.getAttribute("data-open-tab");

      if (window.activateCongressTab && tabName) {
        window.activateCongressTab(tabName);
      }
    });
  });
}

// ======================================================
// Scroll suave para enlaces internos
// ======================================================
function initSmoothScroll() {
  const internalLinks = document.querySelectorAll('a[href^="#"]');

  internalLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      const href = this.getAttribute("href");

      if (!href || href === "#") {
        event.preventDefault();
        return;
      }

      if (href.startsWith("#tab-")) {
        event.preventDefault();
        const tabName = href.replace("#tab-", "");

        if (window.activateCongressTab) {
          window.activateCongressTab(tabName);
        }

        return;
      }

      const target = document.querySelector(href);

      if (target) {
        event.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
}

// ======================================================
// Efecto del header al hacer scroll
// ======================================================
function initHeaderEffect() {
  const header = document.querySelector(".header");

  if (!header) return;

  function updateHeader() {
    if (window.scrollY > 20) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });
}

// ======================================================
// Sistema de registro con selección de categoría
// ======================================================
function initRegistrationForms() {
  const typeButtons = document.querySelectorAll(".reg-type-btn");
  const formContainer = document.getElementById("registration-form-container");
  const loading = document.getElementById("form-loading");
  const iframe = document.getElementById("registration-iframe");
  const formTitle = document.getElementById("form-title");
  const btnChangeCategory = document.getElementById("btn-change-category");

  if (!typeButtons.length || !formContainer) return;

  // URLs de los formularios de Google Forms
  const formUrls = {
    estudiantes: "https://docs.google.com/forms/d/e/1FAIpQLSeeH_aYWGZ1P4DaSewg0-ALLF-iFhgrVMQIxX6xPT61BjRbew/viewform?embedded=true",
    socios: "https://docs.google.com/forms/d/e/1FAIpQLSdbggoeFJeIsXZ0GAsNm0G1y_4MXHQ0UbIhwxZJ0lbgDb__PQ/viewform?embedded=true",
    profesionales: "https://docs.google.com/forms/d/e/1FAIpQLSf_ZmT9pSIQRu0AS-VPKCEdbr69XWEhZkmXcF3wTFJU6wKrQA/viewform?embedded=true",
    profesores: "https://docs.google.com/forms/d/e/1FAIpQLSeHEWmHGYL-_e8WJudJ2RKTFOmjM9g_rqjrQRV0GhEH-yCW7w/viewform?embedded=true"
  };

  // Títulos de cada formulario
  const formTitles = {
    estudiantes: "Registro · Estudiantes",
    socios: "Registro · Socios SCM",
    profesionales: "Registro · Profesionales",
    profesores: "Registro · Profesores"
  };

  function loadForm(type) {
    const url = formUrls[type];
    if (!url || !iframe) return;

    typeButtons.forEach((btn) => {
      btn.classList.remove("active");
      if (btn.getAttribute("data-type") === type) {
        btn.classList.add("active");
      }
    });

    formContainer.style.display = "block";

    if (formTitle) {
      formTitle.textContent = formTitles[type] || "Formulario de registro";
    }

    if (loading) loading.style.display = "flex";
    iframe.style.display = "none";

    iframe.src = "";
    setTimeout(() => {
      iframe.src = url;
    }, 50);

    iframe.onload = function () {
      if (loading) loading.style.display = "none";
      iframe.style.display = "block";

      formContainer.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    };

    setTimeout(function () {
      if (loading && loading.style.display === "flex") {
        loading.style.display = "none";
        iframe.style.display = "block";
      }
    }, 8000);
  }

  function hideForm() {
    formContainer.style.display = "none";
    if (iframe) iframe.src = "";

    typeButtons.forEach((btn) => {
      btn.classList.remove("active");
    });
  }

  typeButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const type = this.getAttribute("data-type");
      loadForm(type);
    });

    button.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const type = this.getAttribute("data-type");
        loadForm(type);
      }
    });
  });

  if (btnChangeCategory) {
    btnChangeCategory.addEventListener("click", hideForm);
  }

  const hash = window.location.hash;
  if (hash && hash.includes("registro-")) {
    const type = hash.replace("#registro-", "");
    if (formUrls[type]) {
      loadForm(type);
    }
  }
}

// ======================================================
// Inicialización general
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initTabLinks();
  initSmoothScroll();
  initHeaderEffect();
  initRegistrationForms();
});
