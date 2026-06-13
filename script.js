const root = document.documentElement;
const canvas = document.querySelector("#signal-canvas");
const ctx = canvas.getContext("2d");
const pointer = { x: 0, y: 0, active: false };
let particles = [];
let width = 0;
let height = 0;
let rafId = 0;

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("portfolio-theme", theme);
}

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.max(44, Math.min(90, Math.floor((width * height) / 16000)));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    size: Math.random() * 2 + 1,
  }));
}

function drawNetwork() {
  const isLight = root.dataset.theme === "light";
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = isLight ? "rgba(245, 247, 243, 0.34)" : "rgba(8, 16, 15, 0.3)";
  ctx.fillRect(0, 0, width, height);

  particles.forEach((point) => {
    point.x += point.vx;
    point.y += point.vy;

    if (point.x < -20) point.x = width + 20;
    if (point.x > width + 20) point.x = -20;
    if (point.y < -20) point.y = height + 20;
    if (point.y > height + 20) point.y = -20;

    if (pointer.active) {
      const dx = pointer.x - point.x;
      const dy = pointer.y - point.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 160) {
        point.x -= dx * 0.0025;
        point.y -= dy * 0.0025;
      }
    }
  });

  for (let i = 0; i < particles.length; i += 1) {
    const a = particles[i];
    for (let j = i + 1; j < particles.length; j += 1) {
      const b = particles[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      if (distance < 136) {
        const alpha = 1 - distance / 136;
        ctx.strokeStyle = isLight
          ? `rgba(18, 80, 69, ${alpha * 0.15})`
          : `rgba(64, 214, 177, ${alpha * 0.17})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  particles.forEach((point) => {
    ctx.fillStyle = isLight ? "rgba(18, 80, 69, 0.32)" : "rgba(64, 214, 177, 0.48)";
    ctx.beginPath();
    ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
    ctx.fill();
  });

  rafId = requestAnimationFrame(drawNetwork);
}

function initProjectFilters() {
  const filters = document.querySelectorAll(".filter");
  const projects = document.querySelectorAll(".project-card");

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      filters.forEach((item) => item.classList.toggle("active", item === button));
      projects.forEach((project) => {
        const categories = project.dataset.category.split(" ");
        const visible = filter === "all" || categories.includes(filter);
        project.hidden = !visible;
      });
    });
  });
}

function initSkillOrbit() {
  const focus = document.querySelector("#skill-focus");
  const buttons = document.querySelectorAll(".orbit-item");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      buttons.forEach((item) => item.classList.toggle("active", item === button));
      focus.textContent = button.dataset.skill;
    });
  });
}

function initReveal() {
  const cards = document.querySelectorAll(".project-card, .skill-group, .timeline-item, .profile-band, .contact-section");
  cards.forEach((card) => card.classList.add("is-visible"));
}

function initHeaderShadow() {
  const header = document.querySelector(".site-header");
  const update = () => {
    header.style.transform = window.scrollY > 24 ? "translateY(-2px)" : "translateY(0)";
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
}

document.querySelector(".theme-toggle").addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
  setTheme(nextTheme);
});

document.addEventListener("pointermove", (event) => {
  pointer.x = event.clientX;
  pointer.y = event.clientY;
  pointer.active = true;
});

document.addEventListener("pointerleave", () => {
  pointer.active = false;
});

window.addEventListener("resize", resizeCanvas);

const savedTheme = localStorage.getItem("portfolio-theme");
if (savedTheme) {
  setTheme(savedTheme);
}

resizeCanvas();
drawNetwork();
initProjectFilters();
initSkillOrbit();
initReveal();
initHeaderShadow();

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(rafId);
  } else {
    drawNetwork();
  }
});
