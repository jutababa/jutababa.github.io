const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const typewriter = document.querySelector('.typewriter');
const text = typewriter.getAttribute('data-text');
let index = 0;

let particles = [];
const num = 100;
const mouse = { x: null, y: null };

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.shadowBlur = 6;
    ctx.shadowColor = "white";
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

function init() {
  for (let i = 0; i < num; i++) particles.push(new Particle());
}

function connect() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a; b < particles.length; b++) {
      const dx = particles[a].x - particles[b].x;
      const dy = particles[a].y - particles[b].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 90) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 90})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p of particles) {
    p.update();
    p.draw();
  }
  connect();
  requestAnimationFrame(animate);
}

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
  for (let p of particles) {
    const dx = p.x - mouse.x;
    const dy = p.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      p.x += dx / 15;
      p.y += dy / 15;
    }
  }
});

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

function type() {
  if (index < text.length) {
    typewriter.textContent += text[index];
    index++;
    setTimeout(type, 50); // typing speed in ms
  }
}

document.addEventListener('DOMContentLoaded', type);

// Sidebar toggle
document.getElementById("menu-btn").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("active");
});

init();
animate();
