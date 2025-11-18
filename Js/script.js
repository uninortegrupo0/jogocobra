// === Jogo da Cobrinha ===
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restartBtn");

const tile = 20;
const rows = canvas.height / tile;
const cols = canvas.width / tile;

let snake, dir, nextDir, food, score, loop, running;

// === onde vamos iniciar o jogo ===
function init() {
  snake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
  ];
  dir = { x: 1, y: 0 };
  nextDir = { x: 1, y: 0 };
  score = 0;
  scoreEl.textContent = score;
  running = true;
  placeFood();

  if (loop) clearInterval(loop);
  loop = setInterval(update, 140
  );
}

// === comida criada===
function placeFood() {
  food = {
    x: Math.floor(Math.random() * cols),
    y: Math.floor(Math.random() * rows),
  };
  while (snake.some(seg => seg.x === food.x && seg.y === food.y)) {
    food = {
      x: Math.floor(Math.random() * cols),
      y: Math.floor(Math.random() * rows),
    };
  }
}

// === Atualizacao do jogo(inicio e fim) ===
function update() {
  if (!running) return;

  // Evita reversão direta
  if (!(nextDir.x === -dir.x && nextDir.y === -dir.y)) dir = nextDir;

  const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

  // Colisão com borda
  if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) return gameOver();

  // Colisão com corpo
  if (snake.some(s => s.x === head.x && s.y === head.y)) return gameOver();

  snake.unshift(head);

  // Comeu comida
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

// === Desenho ===
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // grade leve
  ctx.strokeStyle = "#21262d";
  for (let i = 0; i <= cols; i++) {
    ctx.beginPath();
    ctx.moveTo(i * tile, 0);
    ctx.lineTo(i * tile, canvas.height);
    ctx.stroke();
  }
  for (let j = 0; j <= rows; j++) {
    ctx.beginPath();
    ctx.moveTo(0, j * tile);
    ctx.lineTo(canvas.width, j * tile);
    ctx.stroke();
  }

  // comida — verde clara
  ctx.fillStyle = "red";
  ctx.fillRect(food.x * tile + 2, food.y * tile + 2, tile - 4, tile - 4);

  // cobra 
  snake.forEach((s, i) => {
    const shades = ["#3fb950", "#26a641", "#006d32"];
    ctx.fillStyle = shades[i % shades.length];
    ctx.fillRect(s.x * tile + 1, s.y * tile + 1, tile - 2, tile - 2);
  });
}

// === Game Over ===
function gameOver() {
  running = false;
  clearInterval(loop);
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, canvas.height / 2 - 30, canvas.width, 60);
  ctx.fillStyle = "#fff";
  ctx.font = "18px Arial";
  ctx.textAlign = "center";
  ctx.fillText("💀 Game Over — Clique em Reiniciar", canvas.width / 2, canvas.height / 2 + 7);
}

// === Controles ===
window.addEventListener("keydown", (e) => {
  if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(e.key)) e.preventDefault();

  if (e.key === "ArrowUp") nextDir = { x: 0, y: -1 };
  else if (e.key === "ArrowDown") nextDir = { x: 0, y: 1 };
  else if (e.key === "ArrowLeft") nextDir = { x: -1, y: 0 };
  else if (e.key === "ArrowRight") nextDir = { x: 1, y: 0 };
});

// === Botão Reiniciar ===
restartBtn.addEventListener("click", init);

// === Inicia o jogo ===
init();
