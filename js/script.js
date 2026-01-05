/* script.js – Consolidated logic for the birthday card (No Modules) */

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initModal();
    // Start countdown instead of immediate heart animation
    startCountdown();
});

/* --- Countdown Handling --- */
function startCountdown() {
    const countdownContainer = document.getElementById("countdown-container");
    const countdownElement = document.getElementById("countdown");
    const heartContainer = document.getElementById("heart-container");

    // Target date: Jan 6, 2026 00:00:00
    // Note: ISO string is dependable in modern browsers.
    const targetDate = new Date("2026-01-06T00:00:00").getTime();

    const updateTimer = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(updateTimer);
            if (countdownContainer) countdownContainer.style.display = "none";
            if (heartContainer) {
                heartContainer.style.display = "flex"; // Show heart container
                startHeartAnimation();
            }
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (countdownElement) countdownElement.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
}

/* --- Theme Handling --- */
function initTheme() {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") document.body.classList.add("dark");
    const btn = document.getElementById("theme-toggle");
    if (btn) {
        btn.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            const isDark = document.body.classList.contains("dark");
            localStorage.setItem("theme", isDark ? "dark" : "light");
        });
    }
}

/* --- Modal Handling --- */
function initModal() {
    const modal = document.getElementById("media-modal");
    const closeBtn = document.getElementById("modal-close");
    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            modal.classList.add("hidden");
        });
    }
    // Clicking outside modal content also closes it
    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) modal.classList.add("hidden");
        });
    }
}

/* --- Heart Animation --- */
function startHeartAnimation() {
    // Add simple CSS for pulse animation
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

function createHeartSVG() {
    const container = document.getElementById("heart-container");
    if (!container) return null;

    // Add an initial prompt text
    const prompt = document.createElement("div");
    prompt.id = "start-prompt";
    prompt.innerText = "Click to Open ❤️";
    prompt.style.position = "absolute";
    prompt.style.top = "60%";
    prompt.style.fontSize = "1.5rem";
    prompt.style.color = "var(--color-primary)";
    prompt.style.fontFamily = "var(--font-primary), cursive";
    prompt.style.animation = "pulse 1.5s infinite";
    prompt.style.cursor = "pointer";
    container.appendChild(prompt);

    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 200 200");
    svg.setAttribute("width", "300");
    svg.setAttribute("height", "300");
    svg.style.cursor = "pointer";
    // svg.style.zIndex = "20"; // Ensure above everything

    const path = document.createElementNS(ns, "path");
    // Heart path
    path.setAttribute(
        "d",
        "M100,30 C60,0 0,30 0,85 C0,140 100,185 100,185 C100,185 200,140 200,85 C200,30 140,0 100,30 Z"
    );
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#ff6b6b"); // Fallback color
    path.style.stroke = "var(--color-primary)";
    path.setAttribute("stroke-width", "6");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");

    // Dash animation setup
    const length = path.getTotalLength();
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    svg.appendChild(path);
    container.appendChild(svg);

    return { svg, path, prompt };
}

function animateHeart() {
    const obj = createHeartSVG();
    if (!obj) return;
    const { svg, path, prompt } = obj;
    const container = document.getElementById("heart-container");

    const startHandler = () => {
        container.removeEventListener("click", startHandler);
        if (prompt) prompt.style.display = "none";

        // Play music
        playMusic();

        // Check if GSAP is loaded
        if (typeof gsap === "undefined") {
            console.error("GSAP not loaded");
            onHeartOpen(); // Skip animation fallback
            return;
        }

        const tl = gsap.timeline({ onComplete: onHeartOpen });
        // 1. Draw
        tl.to(path, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" })
            // 2. Pulse
            .to(svg, { scale: 1.2, duration: 0.3, ease: "back.out(1.7)" })
            .to(svg, { scale: 1, duration: 0.3, ease: "power2.out" })
            // 3. Explode
            .to(svg, { scale: 10, opacity: 0, duration: 0.8, ease: "power2.in" })
            .to(container, { display: "none", duration: 0 }); // Hide container
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

/* --- Typing / Text Explosion Effect --- */
function startTyping() {
    // User requested specific messages:
    const messages = [
        "Chúc mừng sinh nhật!",
        "Mong mọi ước mơ của cậu thành hiện thực! ✨",
        "Hãy tận hưởng ngày đặc biệt này nhé!",
        "Luôn vui vẻ và hạnh phúc nhé! ❤️"
    ];

    const messageContainer = document.getElementById("message");
    messageContainer.classList.remove("hidden");
    messageContainer.innerHTML = ""; // Clear previous

    // Helper to animate one line at a time
    let lineIndex = 0;

    function animateLine() {
        if (lineIndex >= messages.length) {
            launchConfetti();
            const memeContainer = document.getElementById("meme-container");
            if (memeContainer) {
                setTimeout(() => {
                    memeContainer.classList.remove("hidden");
                    memeContainer.classList.add("visible");
                }, 1000);
            }
            return;
        }

        const lineText = messages[lineIndex];
        const lineDiv = document.createElement("div");
        lineDiv.style.marginBottom = "1.5rem";
        lineDiv.style.minHeight = "40px";
        lineDiv.style.position = "relative";
        messageContainer.appendChild(lineDiv);

        // We will create two layers: 
        // 1. The Heart Layer (starts visible, explodes, fades)
        // 2. The Text Layer (starts invisible, fades in at end position)

        const chars = lineText.split("").map((char, index) => {
            const wrapper = document.createElement("span");
            wrapper.style.display = "inline-block";
            wrapper.style.position = "relative";
            wrapper.style.width = char === " " ? "10px" : "auto"; // Handle spaces

            // The actual final text character
            const textSpan = document.createElement("span");
            textSpan.innerText = char;
            textSpan.style.opacity = "0"; // Start hidden
            textSpan.style.color = "var(--color-primary)";
            textSpan.style.display = "inline-block";

            // The heart particle that mimics the character initially
            const heartSpan = document.createElement("span");
            heartSpan.innerText = "❤️";
            heartSpan.style.position = "absolute";
            heartSpan.style.left = "0";
            heartSpan.style.top = "0";
            heartSpan.style.fontSize = "1.2rem";
            heartSpan.style.opacity = "0"; // Start invisible

            wrapper.appendChild(textSpan);
            if (char.trim() !== "") wrapper.appendChild(heartSpan); // Only add heart for non-spaces

            lineDiv.appendChild(wrapper);
            return { wrapper, textSpan, heartSpan };
        });

        const hearts = chars.filter(c => c.heartSpan).map(c => c.heartSpan);
        const texts = chars.map(c => c.textSpan);

        const tl = gsap.timeline({
            onComplete: () => {
                lineIndex++;
                setTimeout(animateLine, 500);
            }
        });

        // 1. Setup: Hearts start random
        gsap.set(hearts, {
            x: () => (Math.random() - 0.5) * 200,
            y: () => (Math.random() - 0.5) * 200,
            scale: 0,
            opacity: 0,
            rotation: () => Math.random() * 360
        });

        // 2. Explosion / Fly In
        tl.to(hearts, {
            duration: 0.8,
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            rotation: 0,
            ease: "back.out(1.2)", // Bouncy arrival
            stagger: 0.02
        })
            // 3. Transformation: Heart spins and vanishes, Text appears
            .to(hearts, {
                duration: 0.4,
                scale: 1.5,
                opacity: 0,
                ease: "power2.out"
            }, "-=0.2")
            .to(texts, {
                duration: 0.4,
                opacity: 1,
                scale: 1,
                startAt: { scale: 0.5 },
                ease: "back.out(1.7)"
            }, "<");
    }

    animateLine();
}

/* --- Audio --- */
let musicPlayer;
function playMusic() {
    if (musicPlayer) return;
    if (typeof Howl === "undefined") return;

    // Use a placeholder if local file missing, but try local first
    // Use a placeholder if local file missing, but try local first
    // Changed to 'nhacnen' folder as requested. 
    musicPlayer = new Howl({
        src: ["nhacnen/nhac-chuong-khuc-hat-mung-sinh-nhat-remix-tiktok-mp3-dj.mp3"],
        autoplay: false,
        loop: true,
        volume: 0.5,
        html5: true,
        onloaderror: function () {
            console.log("Local music not found, falling back to online url");
            this._src = ["https://www.bensound.com/bensound-music/bensound-ukulele.mp3"];
            this.load();
        }
    });
    musicPlayer.play();
}

/* --- Confetti --- */
function launchConfetti() {
    const canvas = document.createElement("canvas");
    canvas.id = "confetti-canvas";
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "999";
    document.body.appendChild(canvas);

    if (typeof confetti === "undefined") return;

    const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });

    // Fire multiple bursts
    const end = Date.now() + 3000;
    const colors = ['#bb0000', '#ffffff'];

    (function frame() {
        myConfetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        myConfetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}
