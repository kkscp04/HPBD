// main.js – Entry point for the birthday card

import { startHeartAnimation } from "./heart.js";

// Theme toggle handling
function initTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") document.body.classList.add("dark");
    const btn = document.getElementById("theme-toggle");
    btn.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        const isDark = document.body.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
    });
}

// Modal handling (close button)
function initModal() {
    const modal = document.getElementById("media-modal");
    const closeBtn = document.getElementById("modal-close");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.classList.add("hidden");
        });
    }
    // Clicking outside modal content also closes it
    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initModal();
    // Animation starts after user interaction handled within startHeartAnimation
    startHeartAnimation();
});
