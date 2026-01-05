// heart.js – Handles SVG heart drawing and opening animation using GSAP

import { launchConfetti } from "./confetti.js";
import { startTyping } from "./text.js";
import { playMusic } from "./audio.js";

// Insert SVG into #heart-container and add Text Overlay
function createHeartSVG() {
  const container = document.getElementById("heart-container");

  // Add an initial prompt text
  const prompt = document.createElement("div");
  prompt.id = "start-prompt";
  prompt.innerText = "Click to Open ❤️";
  prompt.style.position = "absolute";
  prompt.style.top = "60%";
  prompt.style.fontSize = "1.5rem";
  prompt.style.color = "var(--color-primary)";
  prompt.style.fontFamily = "var(--font-primary)";
  prompt.style.animation = "pulse 1.5s infinite";
  container.appendChild(prompt);

  const ns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(ns, "svg");
  svg.setAttribute("viewBox", "0 0 200 200");
  svg.setAttribute("width", "300"); // Made larger
  svg.setAttribute("height", "300");
  svg.style.cursor = "pointer";

  const path = document.createElementNS(ns, "path");
  // Simple Heart Path
  path.setAttribute(
    "d",
    "M100,30 C60,0 0,30 0,85 C0,140 100,185 100,185 C100,185 200,140 200,85 C200,30 140,0 100,30 Z"
  );
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "var(--color-primary)");
  path.setAttribute("stroke-width", "6");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("stroke-linejoin", "round");

  // Prepare for dash animation
  const length = path.getTotalLength();
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length; // Initially hidden (undrawn)

  svg.appendChild(path);
  container.appendChild(svg);

  return { svg, path, prompt };
}

function animateHeart() {
  const { svg, path, prompt } = createHeartSVG();
  const container = document.getElementById("heart-container");

  // Wait for user click to start everything
  const startHandler = () => {
    container.removeEventListener("click", startHandler);
    prompt.style.display = "none";

    // Play music immediately on interaction
    playMusic();

    const tl = gsap.timeline({ onComplete: onHeartOpen });
    // 1. Draw the heart
    tl.to(path, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" })
      // 2. Pulse once
      .to(svg, { scale: 1.2, duration: 0.3, ease: "back.out(1.7)" })
      .to(svg, { scale: 1, duration: 0.3, ease: "power2.out" })
      // 3. Explode / Fade out
      .to(svg, { scale: 10, opacity: 0, duration: 0.8, ease: "power2.in" })
      .to(container, { display: "none", duration: 0 }); // Hide container to reveal message
  };

  container.addEventListener("click", startHandler);
}

function onHeartOpen() {
  startTyping();

  // Enable optional modal click AFTER animation
  setTimeout(() => {
    document.body.addEventListener("click", (e) => {
      // Prevent opening if clicking on theme toggle or existing modal
      if (e.target.closest('#theme-toggle') || e.target.closest('.modal')) return;

      const modal = document.getElementById("media-modal");
      if (modal) modal.classList.remove("hidden");
    }, { once: true });
  }, 2000);
}

// Export for main.js
export function startHeartAnimation() {
  // Add simple CSS for pulse animation if not exists
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes pulse {
      0% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(1); opacity: 0.8; }
    }
  `;
  document.head.appendChild(style);

  animateHeart();
}
