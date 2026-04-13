/* ============================================================
   PAUSE — main.js
   Handles: scroll animations, active nav highlighting,
            FAQ accordion, SVG draw trigger, navbar scroll state
   ============================================================ */

"use strict";

/* ---- Wait for DOM to be ready ---- */
document.addEventListener("DOMContentLoaded", () => {
  initNavbarScroll();
  initSmoothScroll();
  initActiveNavLinks();
  initFadeInObserver();
  initSvgDrawObserver();
  initFaqAccordion();

  initFeelingsInteraction();
  initOkButton();
});

/* ============================================================
   Navbar — add background on scroll
   ============================================================ */
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

/* ============================================================
   Smooth scroll — intercept anchor href clicks
   ============================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const targetId = anchor.getAttribute("href");
      if (targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });

      // Update URL without triggering a hard jump
      history.pushState(null, "", targetId);
    });
  });
}

/* ============================================================
   Active nav links — highlight based on current section
   ============================================================ */
function initActiveNavLinks() {
  const sections = document.querySelectorAll(".section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const id = entry.target.getAttribute("id");
        navLinks.forEach((link) => {
          link.classList.toggle(
            "is-active",
            link.getAttribute("href") === `#${id}`,
          );
        });
      });
    },
    {
      // Trigger when section crosses ~25% of viewport
      threshold: 0.25,
      rootMargin: `-${
        getComputedStyle(document.documentElement).getPropertyValue(
          "--navbar-height",
        ) || "70px"
      } 0px 0px 0px`,
    },
  );

  sections.forEach((section) => observer.observe(section));
}

/* ============================================================
   Fade-in on scroll — IntersectionObserver for .fade-in
   ============================================================ */
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

/* ============================================================
   SVG draw animation — trigger on scroll into view
   ============================================================ */
function initSvgDrawObserver() {
  // Target any element containing draw-path or draw-circle SVGs
  const artContainers = document.querySelectorAll(
    ".feeling-card-art, .about-art, .home-line-art",
  );
  if (!artContainers.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-drawn");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.3 },
  );

  artContainers.forEach((el) => observer.observe(el));
}

/* ============================================================
   FAQ accordion — accessible expand / collapse
   ============================================================ */
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
    tired: "ya... capek ya. boleh istirahat sebentar.",
    anxious: "pelan-pelan. kamu aman sekarang.",
    overthinking: "tidak semua harus kamu selesaikan hari ini.",
  };

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      const title = card
        .querySelector(".feeling-title")
        ?.textContent.toLowerCase();

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
