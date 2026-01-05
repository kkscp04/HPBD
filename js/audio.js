// audio.js – Handles background music using Howler.js

// Howler is loaded from CDN, no import needed

let music;

export function playMusic() {
    if (music) return; // already playing or loaded
    music = new Howl({
        src: ["assets/music.mp3"],
        autoplay: false,
        loop: true,
        volume: 0.5,
    });
    // Must be triggered by user interaction (handled in heart.js)
    music.play();
}
