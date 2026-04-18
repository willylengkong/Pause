// PAUSE — main.js
// Handles: scroll animations, active nav highlighting, FAQ accordion, navbar scroll state

"use strict";

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  initNavbarScroll();
  initActiveNavLinks();
  initFadeInObserver();
  initFaqAccordion();

  initFeelingsInteraction();
  initOkButton();
  initBreathingExercise();
});

// Navbar — add background on scroll
function initNavbarScroll() {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const onScroll = () => {
    // Toggle scrolled state once user moves past 40px
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // Run once on load in case page is already scrolled
}

// Active nav links — highlight based on current page URL
function initActiveNavLinks() {
  const navLinks = document.querySelectorAll(".nav-link");
  if (!navLinks.length) return;

  const page = window.location.pathname.split("/").pop() || "index.html";

  navLinks.forEach((link) => {
    const href = link.getAttribute("href") || "";
    link.classList.toggle("is-active", href === page);
  });
}

// Fade-in on scroll — IntersectionObserver for .fade-in
function initFadeInObserver() {
  const elements = document.querySelectorAll(".fade-in");
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // Animate once only
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    },
  );

  elements.forEach((el) => observer.observe(el));
}
// FAQ accordion — accessible expand / collapse
function initFaqAccordion() {
  const questions = document.querySelectorAll(".faq-question");
  if (!questions.length) return;

  questions.forEach((button) => {
    button.addEventListener("click", () => {
      const isExpanded = button.getAttribute("aria-expanded") === "true";
      const answerId = button.getAttribute("aria-controls");
      const answerPanel = document.getElementById(answerId);
      if (!answerPanel) return;

      // Toggle current item
      setFaqState(button, answerPanel, !isExpanded);
    });

    // Keyboard support — Enter and Space already fire click on <button>,
    // but Escape should close the open panel
    button.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const answerId = button.getAttribute("aria-controls");
        const answerPanel = document.getElementById(answerId);
        if (answerPanel) setFaqState(button, answerPanel, false);
        button.blur();
      }
    });
  });
}

function setFaqState(button, panel, open) {
  button.setAttribute("aria-expanded", String(open));

  if (open) {
    // Remove hidden so the element participates in layout
    panel.removeAttribute("hidden");
    // Use rAF so CSS transition picks up the change
    requestAnimationFrame(() => {
      requestAnimationFrame(() => panel.classList.add("is-open"));
    });
  } else {
    panel.classList.remove("is-open");
    // Re-add hidden after transition ends
    panel.addEventListener(
      "transitionend",
      () => panel.setAttribute("hidden", ""),
      { once: true },
    );
  }
}

function initFeelingsInteraction() {
  const cards = document.querySelectorAll(".feeling-card");

  const messages = {
    tired: "ya... capek ya. boleh istirahat sebentar kok.",
    anxious: "tenang yahhh. ga semua harus sekaligus selesai kok.",
    overthinking:
      "Fokus sama yang sekarang dulu, ga harus dipikirin terus yah.",
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const title = card
        .querySelector(".feeling-title")
        ?.textContent.trim()
        .toLowerCase();

      if (messages[title]) {
        showCustomMessage(messages[title]);
      }
    });
  });
}

function initOkButton() {
  const btn = document.getElementById("ok-button");
  if (!btn) return;

  btn.addEventListener("click", () => {
    showLoadingThenMessage("Everything is OK now");
  });
}

// Breathing Exercise — 4-4-4 guided breathing
function initBreathingExercise() {
  const btn = document.getElementById("breathe-btn");
  const circle = document.getElementById("breathe-circle");
  const phaseText = document.getElementById("breathe-phase-text");
  const timerText = document.getElementById("breathe-timer");

  if (!btn || !circle || !phaseText || !timerText) return;

  const PHASES = [
    { name: "Hirup...", className: "is-inhale", duration: 4 },
    { name: "Tahan...", className: "is-hold", duration: 4 },
    { name: "Hembuskan...", className: "is-exhale", duration: 4 },
  ];

  const TOTAL_CYCLES = 3;
  let running = false;
  let timerId = null;
  let phaseTimeout = null;

  btn.addEventListener("click", () => {
    if (running) {
      stopBreathing();
    } else {
      startBreathing();
    }
  });

  function startBreathing() {
    running = true;
    btn.textContent = "berhenti";
    btn.classList.add("is-active");
    runCycle(0, 0);
  }

  function stopBreathing() {
    running = false;
    clearInterval(timerId);
    clearTimeout(phaseTimeout);
    btn.textContent = "coba sekarang";
    btn.classList.remove("is-active");
    circle.classList.remove("is-inhale", "is-hold", "is-exhale");
    phaseText.textContent = "";
    timerText.textContent = "";
  }

  function runCycle(cycleIndex, phaseIndex) {
    if (!running) return;
    if (cycleIndex >= TOTAL_CYCLES) {
      finishBreathing();
      return;
    }

    const phase = PHASES[phaseIndex];
    setPhase(phase);

    let remaining = phase.duration;
    timerText.textContent = remaining;

    timerId = setInterval(() => {
      remaining--;
      if (remaining > 0) {
        timerText.textContent = remaining;
      } else {
        timerText.textContent = "";
        clearInterval(timerId);
      }
    }, 1000);

    phaseTimeout = setTimeout(() => {
      const nextPhase = phaseIndex + 1;
      if (nextPhase < PHASES.length) {
        runCycle(cycleIndex, nextPhase);
      } else {
        runCycle(cycleIndex + 1, 0);
      }
    }, phase.duration * 1000);
  }

  function setPhase(phase) {
    circle.classList.remove("is-inhale", "is-hold", "is-exhale");
    // Force reflow so the transition restarts cleanly
    void circle.offsetWidth;
    circle.classList.add(phase.className);
    phaseText.textContent = phase.name;
  }

  function finishBreathing() {
    running = false;
    clearInterval(timerId);
    btn.textContent = "ulangi";
    btn.classList.remove("is-active");
    circle.classList.remove("is-inhale", "is-hold", "is-exhale");
    phaseText.textContent = "";
    timerText.textContent = "";
    showBreathePopup();
  }

  /* Breathe-done popup */
  const popupOverlay = document.getElementById("breathe-popup-overlay");
  const popupOk = document.getElementById("breathe-popup-ok");
  const popupRetry = document.getElementById("breathe-popup-retry");

  function showBreathePopup() {
    if (!popupOverlay) return;
    popupOverlay.removeAttribute("aria-hidden");
    popupOverlay.classList.add("is-visible");
    document.body.style.overflow = "hidden";
    if (popupOk) setTimeout(() => popupOk.focus(), 300);
  }

  function hideBreathePopup() {
    if (!popupOverlay) return;
    popupOverlay.setAttribute("aria-hidden", "true");
    popupOverlay.classList.remove("is-visible");
    document.body.style.overflow = "";
  }

  if (popupOk) {
    popupOk.addEventListener("click", () => {
      hideBreathePopup();
      btn.textContent = "coba sekarang";
    });
  }

  if (popupRetry) {
    popupRetry.addEventListener("click", () => {
      hideBreathePopup();
      startBreathing();
    });
  }

  if (popupOverlay) {
    popupOverlay.addEventListener("click", (e) => {
      if (e.target === popupOverlay) {
        hideBreathePopup();
        btn.textContent = "coba sekarang";
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && popupOverlay.classList.contains("is-visible")) {
        hideBreathePopup();
        btn.textContent = "coba sekarang";
      }
    });
  }
}
