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
// Inicialización general
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  initTabLinks();
  initSmoothScroll();
  initHeaderEffect();
});
