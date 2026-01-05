// confetti.js – Simple wrapper around canvas‑confetti

export function launchConfetti() {
    // Create a full‑screen canvas if not already present
    let canvas = document.getElementById("confetti-canvas");
    if (!canvas) {
        canvas = document.createElement("canvas");
        canvas.id = "confetti-canvas";
        canvas.style.position = "fixed";
        canvas.style.top = "0";
        canvas.style.left = "0";
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.pointerEvents = "none";
        document.body.appendChild(canvas);
    }
    const myConfetti = confetti.create(canvas, { resize: true, useWorker: true });
    myConfetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
    });
}
