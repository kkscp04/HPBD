// text.js – Initializes Typed.js to display birthday wishes

// Typed is loaded from CDN, no import needed

export function startTyping() {
    const messages = [
        "Chúc mừng sinh nhật!",
        "Cậu là người tuyệt vời nhất!",
        "Mong mọi ước mơ của cậu thành hiện thực!",
        "Hãy tận hưởng ngày đặc biệt này nhé!",
    ];
    const options = {
        strings: messages,
        typeSpeed: 60,
        backSpeed: 30,
        backDelay: 1500,
        startDelay: 500,
        loop: false,
        onComplete: () => {
            // After typing finishes, launch confetti
            import("./confetti.js").then((mod) => mod.launchConfetti());
        },
    };
    const typed = new Typed("#message", options);
    // Reveal the message container
    document.getElementById("message").classList.remove("hidden");
}
