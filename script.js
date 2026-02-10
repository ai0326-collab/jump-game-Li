const canvas = document.getElementById('raftCanvas');
const ctx = canvas.getContext('2d');

let gameState = 'playing';
let frameCount = 0;
let score = 0;
let distance = 0;
let speed = 3;

const player = {
  x: 180,
  y: 500,
  width: 40,
  height: 60
};

let rocks = [];
let items = [];

const keys = { ArrowLeft: false, ArrowRight: false };

/* 長輩按鈕控制（長按移動） */
function bindButton(el, key) {
  el.addEventListener('pointerdown', e => {
    e.preventDefault();
    keys[key] = true;
  });

  const stop = e => {
    e.preventDefault();
    keys[key] = false;
  };

  el.addEventListener('pointerup', stop);
  el.addEventListener('pointerleave', stop);
  el.addEventListener('pointercancel', stop);
}

bindButton(document.getElementById('btn-left'), 'ArrowLeft');
bindButton(document.getElementById('btn-right'), 'ArrowRight');

/* 鍵盤也可用 */
window.addEventListener('keydown', e => {
  if (keys.hasOwnProperty(e.code)) keys[e.code] = true;
});
window.addEventListener('keyup', e => {
  if (keys.hasOwnProperty(e.code)) keys[e.code] = false;
});

function resetGame() {
  gameState = 'playing';
  frameCount = 0;
  score = 0;
  distance = 0;
  speed = 3;
  rocks = [];
  items = [];
  player.x = 180;
  document.getElementById('game-over').style.display = 'none';
}

function spawnRock() {
  const size = 40 + Math.random() * 40;
  rocks.push({
    x: Math.random() * (canvas.width - size),
    y: -80,
    w: size,
    h: size
  });
}

function spawnItem() {
  items.push({
    x: 40 + Math.random() * (canvas.width - 80),
    y: -40,
    collected: false
  });
}

function update() {
  if (gameState !== 'playing') return;

  frameCount++;
  distance += 0.1;

  if (keys.ArrowLeft) player.x -= 5;
  if (keys.ArrowRight) player.x += 5;

  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width)
    player.x = canvas.width - player.width;

  if (frameCount % 70 === 0) spawnRock();
  if (frameCount % 180 === 0) spawnItem();

  rocks.forEach(r => r.y += speed);
  items.forEach(i => i.y += speed);

  rocks = rocks.filter(r => r.y < canvas.height + 50);
  items = items.filter(i => i.y < canvas.height + 50);

  for (let r of rocks) {
    if (
      player.x < r.x + r.w &&
      player.x + player.width > r.x &&
      player.y < r.y + r.h &&
      player.y + player.height > r.y
    ) {
      gameOver();
      return;
    }
  }

  for (let i of items) {
    if (!i.collected &&
      player.x < i.x + 20 &&
      player.x + player.width > i.x &&
      player.y < i.y + 20 &&
      player.y + player.height > i.y
    ) {
      i.collected = true;
      score += 100;
    }
  }

  document.getElementById('distance').innerText = Math.floor(distance);
  document.getElementById('score').innerText = score;
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#4db6ac';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#5d4037';
  rocks.forEach(r => ctx.fillRect(r.x, r.y, r.w, r.h));

  ctx.fillStyle = '#fff176';
  items.forEach(i => {
    if (!i.collected) ctx.fillRect(i.x, i.y, 20, 20);
  });

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(player.x, player.y, player.width, player.height);

  requestAnimationFrame(() => {
    update();
    draw();
  });
}

function gameOver() {
  gameState = 'gameover';
  document.getElementById('final-score').innerText = score;
  document.getElementById('game-over').style.display = 'block';
}

resetGame();
draw();