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
    ".section-card, .stat-card, .speaker-card, .activity-card, .agenda-card, .memory-card, .cost-card, .info-card, .award-card"
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
});
