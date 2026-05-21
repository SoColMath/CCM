// ======================================================
// XXV Congreso Colombiano de Matemáticas
// Script principal
// ======================================================

// Fecha objetivo del congreso
const CONGRESS_DATE = new Date("2027-06-08T08:00:00").getTime();


// ======================================================
// Cuenta regresiva
// ======================================================
function initCountdown() {
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  if (!daysEl || !hoursEl || !minutesEl || !secondsEl) return;

  function updateCountdown() {
    const now = new Date().getTime();
    const distance = CONGRESS_DATE - now;

    if (distance <= 0) {
      daysEl.textContent = "00";
      hoursEl.textContent = "00";
      minutesEl.textContent = "00";
      secondsEl.textContent = "00";
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (distance % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor(
      (distance % (1000 * 60)) / 1000
    );

    daysEl.textContent = days.toString().padStart(2, "0");
    hoursEl.textContent = hours.toString().padStart(2, "0");
    minutesEl.textContent = minutes.toString().padStart(2, "0");
    secondsEl.textContent = seconds.toString().padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}


// ======================================================
// Sistema de pestañas principales
// Compatible con id="registro" y con id="tab-registro"
// ======================================================
function initTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  if (!tabButtons.length || !tabContents.length) return;

  function getTabContent(tabName) {
    return (
      document.getElementById(tabName) ||
      document.getElementById(`tab-${tabName}`)
    );
  }

  function activateTab(tabName, shouldScroll = true) {
    const activeContent = getTabContent(tabName);

    if (!activeContent) return;

    tabButtons.forEach((button) => {
      button.classList.remove("active");
      button.setAttribute("aria-selected", "false");
    });

    tabContents.forEach((content) => {
      content.classList.remove("active");
    });

    const activeButtons = document.querySelectorAll(
      `.tab-btn[data-tab="${tabName}"]`
    );

    activeButtons.forEach((button) => {
      button.classList.add("active");
      button.setAttribute("aria-selected", "true");
    });

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

    history.replaceState(null, "", `#${activeContent.id}`);
  }

  tabButtons.forEach((button) => {
    button.setAttribute("role", "tab");
    button.setAttribute("tabindex", "0");

    button.addEventListener("click", () => {
      const tabName = button.getAttribute("data-tab");
      if (tabName) activateTab(tabName);
    });

    button.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const tabName = button.getAttribute("data-tab");
        if (tabName) activateTab(tabName);
      }
    });
  });

  // Abrir pestaña desde hash
  const hash = window.location.hash.replace("#", "");

  if (hash) {
    if (hash.startsWith("tab-")) {
      activateTab(hash.replace("tab-", ""), false);
    } else {
      activateTab(hash, false);
    }
  }

  window.activateCongressTab = activateTab;
}


// ======================================================
// Botones que abren pestañas específicas
// Ejemplo: data-open-tab="registro"
// ======================================================
function initTabLinks() {
  const links = document.querySelectorAll("[data-open-tab], .hero-action, .final-cta-actions button");

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const tabName =
        link.getAttribute("data-open-tab") ||
        link.getAttribute("data-tab");

      if (!tabName) return;

      event.preventDefault();

      if (window.activateCongressTab) {
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

      const hash = href.replace("#", "");

      if (window.activateCongressTab) {
        const possibleTab =
          document.getElementById(hash) ||
          document.getElementById(`tab-${hash}`);

        if (possibleTab && possibleTab.classList.contains("tab-content")) {
          event.preventDefault();
          window.activateCongressTab(hash);
          return;
        }
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
    if (window.scrollY > 80) {
      header.classList.add("header-scrolled");
    } else {
      header.classList.remove("header-scrolled");
    }
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader);
}


// ======================================================
// Animaciones de entrada al hacer scroll
// ======================================================
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll(
    ".section-card, .stat-card, .speaker-card, .activity-card, .agenda-card, .memory-card, .cost-card, .info-card, .award-card, .category-card"
  );

  if (!animatedElements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px",
    }
  );

  animatedElements.forEach((element, index) => {
    element.classList.add("reveal-on-scroll");
    element.style.transitionDelay = `${Math.min(index * 0.04, 0.35)}s`;
    observer.observe(element);
  });
}


// ======================================================
// Movimiento sutil de elementos matemáticos del hero
// ======================================================
function initMathFloating() {
  const floatingItems = document.querySelectorAll(".math-float");

  if (!floatingItems.length) return;

  floatingItems.forEach((item, index) => {
    item.style.animationDelay = `${index * 0.7}s`;
  });
}


// ======================================================
// Efecto hover con inclinación muy suave en tarjetas
// ======================================================
function initCardTilt() {
  const cards = document.querySelectorAll(
    ".stat-card, .speaker-card, .activity-card, .cost-card, .memory-card"
  );

  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -2;
      const rotateY = ((x - centerX) / centerX) * 2;

      card.style.transform = `translateY(-4px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}


// ======================================================
// Botón volver arriba, si existe en el HTML
// ======================================================
function initBackToTop() {
  const button = document.querySelector(".back-to-top");

  if (!button) return;

  function toggleButton() {
    if (window.scrollY > 500) {
      button.classList.add("show");
    } else {
      button.classList.remove("show");
    }
  }

  button.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  toggleButton();
  window.addEventListener("scroll", toggleButton);
}


// ======================================================
// Sistema de registro por categorías
// ======================================================
function initRegistrationForms() {
  const categoryButtons = document.querySelectorAll(".category-card");
  const formContainer = document.getElementById("registration-form-container");
  const formPanels = document.querySelectorAll(".registration-form-panel");
  const backButton = document.getElementById("back-to-categories");
  const categoryGrid = document.querySelector(".category-grid");
  const categoryTitle = document.querySelector(".category-title");

  if (!categoryButtons.length || !formContainer || !formPanels.length) return;

  function openForm(formId) {
    const selectedPanel = document.getElementById(formId);

    if (!selectedPanel) return;

    formPanels.forEach((panel) => {
      panel.classList.remove("active");
    });

    categoryButtons.forEach((button) => {
      button.classList.remove("active");
    });

    selectedPanel.classList.add("active");

    const selectedButton = document.querySelector(
      `.category-card[data-form="${formId}"]`
    );

    if (selectedButton) {
      selectedButton.classList.add("active");
    }

    formContainer.style.display = "block";

    if (categoryGrid) {
      categoryGrid.style.display = "none";
    }

    if (categoryTitle) {
      categoryTitle.style.display = "none";
    }

    formContainer.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  function backToCategories() {
    formContainer.style.display = "none";

    formPanels.forEach((panel) => {
      panel.classList.remove("active");
    });

    categoryButtons.forEach((button) => {
      button.classList.remove("active");
    });

    if (categoryGrid) {
      categoryGrid.style.display = "grid";
    }

    if (categoryTitle) {
      categoryTitle.style.display = "block";
    }

    const registrationSection = document.querySelector(".registration-section");

    if (registrationSection) {
      registrationSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const formId = this.getAttribute("data-form");
      openForm(formId);
    });

    button.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        const formId = this.getAttribute("data-form");
        openForm(formId);
      }
    });
  });

  if (backButton) {
    backButton.addEventListener("click", backToCategories);
  }
}


// ======================================================
// Inicialización general
// ======================================================
document.addEventListener("DOMContentLoaded", () => {
  initCountdown();
  initTabs();
  initTabLinks();
  initSmoothScroll();
  initHeaderEffect();
  initScrollAnimations();
  initMathFloating();
  initCardTilt();
  initBackToTop();
  initRegistrationForms();
});
