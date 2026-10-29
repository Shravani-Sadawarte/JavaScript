
import {
    startTimer,
    pauseTimer,
    resumeTimer,
    resetTimer
} from "./timer.js";

const classNameInput = document.getElementById("className");
const hoursInput = document.getElementById("hours");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");

const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");

const celebration = document.getElementById("celebration");
const completionMessage = document.getElementById("completionMessage");

const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

let paused = false;
let active = false;
let animationId = null;
let completionTimeout = null;
let lastLaunch = 0;

let rockets = [];
let particles = [];

const random = (min, max) =>
    Math.random() * (max - min) + min;

function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    canvas.width = Math.floor(window.innerWidth * dpr);
    canvas.height = Math.floor(window.innerHeight * dpr);

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

function launchRocket() {
    rockets.push({
        x: random(40, window.innerWidth - 40),
        y: window.innerHeight + 10,
        targetY: random(
            window.innerHeight * 0.12,
            window.innerHeight * 0.55
        ),
        speed: random(5, 9),
        hue: random(0, 360),
        trail: []
    });
}

function explode(x, y, hue) {
    const count = 110;

    for (let i = 0; i < count; i++) {
        const angle = random(0, Math.PI * 2);
        const speed = random(1.2, 6.5);

        particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            hue: (hue + random(-35, 35) + 360) % 360,
            alpha: 1,
            decay: random(0.008, 0.018),
            radius: random(1.5, 3),
            gravity: 0.045
        });
    }

    // A bright central flash
    particles.push({
        x,
        y,
        vx: 0,
        vy: 0,
        hue,
        alpha: 1,
        decay: 0.08,
        radius: 16,
        gravity: 0
    });
}

function drawRocket(rocket) {
    rocket.trail.push({ x: rocket.x, y: rocket.y });

    if (rocket.trail.length > 7) {
        rocket.trail.shift();
    }

    rocket.y -= rocket.speed;
    rocket.x += Math.sin(rocket.y * 0.025) * 0.6;

    if (rocket.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(rocket.trail[0].x, rocket.trail[0].y);

        for (const point of rocket.trail) {
            ctx.lineTo(point.x, point.y);
        }

        ctx.strokeStyle =
            `hsla(${rocket.hue}, 100%, 70%, 0.85)`;

        ctx.lineWidth = 2;
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(rocket.x, rocket.y, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${rocket.hue}, 100%, 80%)`;
    ctx.shadowBlur = 15;
    ctx.shadowColor = ctx.fillStyle;
    ctx.fill();
    ctx.shadowBlur = 0;
}

function drawParticle(particle) {
    particle.x += particle.vx;
    particle.y += particle.vy;

    particle.vx *= 0.99;
    particle.vy = particle.vy * 0.99 + particle.gravity;
    particle.alpha -= particle.decay;

    if (particle.alpha <= 0) return false;

    ctx.beginPath();
    ctx.arc(
        particle.x,
        particle.y,
        particle.radius,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        `hsla(${particle.hue}, 100%, 65%, ${particle.alpha})`;

    ctx.shadowBlur = 12;
    ctx.shadowColor = ctx.fillStyle;
    ctx.fill();
    ctx.shadowBlur = 0;

    return true;
}

function animateFireworks(timestamp) {
    if (!active) return;

    const width = window.innerWidth;
    const height = window.innerHeight;

    // Fade previous frames to create luminous trails.
    ctx.globalCompositeOperation = "destination-out";
    ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "lighter";

    // Launch rockets every 450 milliseconds.
    if (timestamp - lastLaunch > 450) {
        launchRocket();
        lastLaunch = timestamp;
    }

    rockets = rockets.filter(rocket => {
        drawRocket(rocket);

        if (rocket.y <= rocket.targetY) {
            explode(rocket.x, rocket.y, rocket.hue);
            return false;
        }

        return true;
    });

    particles = particles.filter(drawParticle);

    ctx.globalCompositeOperation = "source-over";

    animationId = requestAnimationFrame(animateFireworks);
}

function startFireworks() {
    stopFireworks();

    active = true;
    lastLaunch = 0;
    canvas.style.display = "block";

    animationId = requestAnimationFrame(animateFireworks);
}

function stopFireworks() {
    active = false;

    if (animationId !== null) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }

    rockets = [];
    particles = [];

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    canvas.style.display = "none";
    ctx.globalCompositeOperation = "source-over";
}

function stopCelebration() {
    stopFireworks();
    celebration.hidden = true;

    if (completionTimeout !== null) {
        clearTimeout(completionTimeout);
        completionTimeout = null;
    }
}

function completed() {
    active = false;
    paused = false;

    pauseBtn.textContent = "Ⅱ Pause";
    pauseBtn.disabled = true;
    startBtn.disabled = false;

    celebration.hidden = false;

    completionMessage.textContent =
        classNameInput.value.trim() +
        " class completed successfully!";

    startFireworks();
}

startBtn.addEventListener("click", () => {
    const name = classNameInput.value.trim();
    const hours = Number(hoursInput.value);
    const minutes = Number(minutesInput.value);
    const seconds = Number(secondsInput.value);

    const valid =
        hoursInput.value !== "" &&
        minutesInput.value !== "" &&
        secondsInput.value !== "" &&
        Number.isInteger(hours) &&
        Number.isInteger(minutes) &&
        Number.isInteger(seconds) &&
        hours >= 0 &&
        hours <= 999 &&
        minutes >= 0 &&
        minutes <= 59 &&
        seconds >= 0 &&
        seconds <= 59;

    if (!name || !valid) {
        alert("Enter a class name and valid time.");
        return;
    }

    const totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (totalSeconds <= 0) {
        alert("Please enter a duration greater than zero.");
        return;
    }

    stopCelebration();
    resetTimer();

    paused = false;
    active = true;

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    pauseBtn.textContent = "Ⅱ Pause";

    startTimer(totalSeconds, () => {
        // Delay callback can be cancelled by reset/new start.
        completionTimeout = setTimeout(() => {
            completionTimeout = null;
            completed();
        }, 0);
    });
});

pauseBtn.addEventListener("click", () => {
    if (!active) return;

    if (!paused) {
        pauseTimer();
        paused = true;
        pauseBtn.textContent = "▶ Resume";
        document.getElementById("status").textContent =
            "Timer paused";
    } else {
        resumeTimer(() => {
            completionTimeout = setTimeout(() => {
                completionTimeout = null;
                completed();
            }, 0);
        });

        paused = false;
        pauseBtn.textContent = "Ⅱ Pause";
    }
});

resetBtn.addEventListener("click", () => {
    stopCelebration();
    resetTimer();

    active = false;
    paused = false;

    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = "Ⅱ Pause";
});
