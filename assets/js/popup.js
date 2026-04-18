// PAUSE — popup.js
// Reflective message popup — forces every 30s regardless of user activity
// Dismissible via button, backdrop click, or Escape key

"use strict";

// Reflective messages pool
const REFLECTIVE_MESSAGES = [
  "Sudahkah kamu menarik napas dalam hari ini?",
  "Ambil waktu sejenak. Kamu tidak harus produktif setiap detik.",
  "Halaman ini tidak akan ke mana-mana. Begitu juga duniamu. Berhentilah sebentar.",
  "Tubuhmu tahu kapan harus beristirahat. Dengarkanlah.",
  "Satu napas dalam. Pelan-pelan. Kamu tidak harus terburu-buru.",
];

const POPUP_INTERVAL_MS = 30000; // force popup every 30s

// Module-level so hidePopup can reset it
let lastPopupShown = Date.now();

// Initialize popup logic
document.addEventListener("DOMContentLoaded", () => {
  const overlay = document.getElementById("popup-overlay");
  const closeBtn = document.getElementById("popup-close");
  const messageEl = document.getElementById("popup-message");

  if (!overlay || !closeBtn || !messageEl) return;

  // Force popup every 30 seconds regardless of user activity
  setInterval(() => {
    if (overlay.classList.contains("is-visible")) return;
    if (Date.now() - lastPopupShown >= POPUP_INTERVAL_MS) {
      messageEl.textContent = pickRandom(REFLECTIVE_MESSAGES);
      showPopup(overlay);
      lastPopupShown = Date.now();
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

// Show popup
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

// Hide popup
function hidePopup(overlay) {
  overlay.classList.remove("is-visible");
  overlay.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  lastPopupShown = Date.now(); // reset timer so popup waits another 30s before reshowing
}

// Pick random item from array
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
