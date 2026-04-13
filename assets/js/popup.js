/* ============================================================
   PAUSE — popup.js
   Reflective message popup — triggers after 15s on page
   Shows a random message, can be dismissed by button or
   clicking the overlay backdrop
   ============================================================ */

"use strict";

/* ---- Reflective messages pool ---- */
const REFLECTIVE_MESSAGES = [
  "Sudahkah kamu menarik napas dalam hari ini?",
  "Ambil waktu sejenak. Kamu tidak harus produktif setiap detik.",
  "Halaman ini tidak akan ke mana-mana. Begitu juga duniamu. Berhentilah sebentar.",
  "Tubuhmu tahu kapan harus beristirahat. Dengarkanlah.",
  "Satu napas dalam. Pelan-pelan. Kamu tidak harus terburu-buru.",
];

/* ---- Timing constants ---- */
const IDLE_THRESHOLD_MS = 1500000; // show after 15s of no activity
const MAX_INTERVAL_MS = 300000; // always show at least every 30s

/* ---- Initialize popup logic ---- */
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("popup-overlay");
  const closeBtn = document.getElementById("popup-close");
  const messageEl = document.getElementById("popup-message");

  if (!overlay || !closeBtn || !messageEl) return;

  let lastActivity = Date.now();
  let lastPopupShown = Date.now();

  // Track any user activity
  const activityEvents = [
    "mousemove",
    "scroll",
    "keydown",
    "click",
    "touchstart",
  ];
  activityEvents.forEach((evt) =>
    window.addEventListener(
      evt,
      () => {
        lastActivity = Date.now();
      },
      { passive: true },
    ),
  );

  // Check every second whether to show popup
  setInterval(() => {
    if (overlay.classList.contains("is-visible")) return;

    const now = Date.now();
    const idleTime = now - lastActivity;
    const timeSince = now - lastPopupShown;

    const shouldShowIdle = idleTime >= IDLE_THRESHOLD_MS;
    const shouldShowForced = timeSince >= MAX_INTERVAL_MS;

    if (shouldShowIdle || shouldShowForced) {
      messageEl.textContent = pickRandom(REFLECTIVE_MESSAGES);
      showPopup(overlay);
      lastPopupShown = now;
    }
  }, 1000);

  // Close on button click
  closeBtn.addEventListener("click", () => hidePopup(overlay));

  // Close on backdrop click
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) hidePopup(overlay);
  });

  // Close on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-visible")) {
      hidePopup(overlay);
    }
  });
});

/* ---- Show popup ---- */
function showPopup(overlay) {
  overlay.removeAttribute("aria-hidden");
  overlay.classList.add("is-visible");

  // Trap focus on the close button
  const closeBtn = overlay.querySelector(".popup-close");
  if (closeBtn) {
    // Small delay so CSS transition plays first
    setTimeout(() => closeBtn.focus(), 300);
  }

  // Prevent background scroll while popup is open
  document.body.style.overflow = "hidden";
}

/* ---- Hide popup ---- */
function hidePopup(overlay) {
  overlay.classList.remove("is-visible");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

/* ---- Pick random item from array ---- */
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function showCustomMessage(message) {
  const overlay = document.getElementById("popup-overlay");
  const messageEl = document.getElementById("popup-message");

  if (!overlay || !messageEl) return;

  messageEl.textContent = message;
  showPopup(overlay);
}

function showLoadingThenMessage(message) {
  const overlay = document.getElementById("popup-overlay");
  const messageEl = document.getElementById("popup-message");
  const progressBar = document.getElementById("popup-progress-bar");

  if (!overlay || !messageEl || !progressBar) return;

  messageEl.textContent = "making things okay...";
  progressBar.style.width = "0%";

  showPopup(overlay);

  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 25; // random biar terasa natural
    if (progress >= 100) progress = 100;

    progressBar.style.width = progress + "%";

    if (progress === 100) {
      clearInterval(interval);

      setTimeout(() => {
        messageEl.textContent = message;
      }, 300);
    }
  }, 300);
}
