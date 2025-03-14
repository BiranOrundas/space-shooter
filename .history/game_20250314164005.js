// Game setup
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions to match container
const container = document.getElementById('game-container');
canvas.width = container.clientWidth;
canvas.height = container.clientHeight;

// Game variables
let score = 0;
let gameOver = false;
let animationId;
let bulletPowerUpActive = false; // Bullet boost aktif mi?

// Player variables
const player = {
  x: canvas.width / 2 - 20,
  y: canvas.height - 100,
  width: 50,
  height: 60,
  speed: 5,
  boostedSpeed: 10,
  isBoosting: false,
  life: 100,
  color: '#00f',
  cooldown: 0,
  lastShot: 0
};

// Game elements arrays
const bullets = [];
const enemies = [];
const stars = [];

// Control variables
let leftPressed = false;
let rightPressed = false;
let upPressed = false;
let downPressed = false;
let shootPressed = false;
let boostPressed = false;

// Generate stars for background
function createStars() {
  const starCount = 300;
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 1 + 0.4,
      speed: Math.random() * 1 + 1.9,
    });
  }
}

// Draw player's spaceship
function drawPlayer() {
  ctx.fillStyle = player.color;
  
  ctx.beginPath();
  ctx.moveTo(player.x + player.width / 2, player.y);
  ctx.lineTo(player.x + player.width, player.y + player.height);
  ctx.lineTo(player.x, player.y + player.height);
  ctx.closePath();
  ctx.fill();
}

// Create a bullet
function shootBullet() {
  const now = Date.now();
  if (now - player.lastShot > 150) { // Cooldown in ms
    bullets.push({
      x: player.x + player.width / 2 - 3,
      y: player.y,
      width: bulletPowerUpActive ? 100 : 3, // Eğer güçlendirme aktifse geniş bullet at
      height: 10,
      speed: 17,   
      color: bulletPowerUpActive ? "#00FF00" : "#f00" // Renk değiştirme
    });
    player.lastShot = now;
  }
}

// Bullet güncelleme fonksiyonu
function updateBullets() {
  for (let i = 0; i < bullets.length; i++) {
    bullets[i].y -= bullets[i].speed;
    if (bullets[i].y < 0) {
      bullets.splice(i, 1);
      i--;
    }
  }
}

// Bullet güçlendirme (10 saniyeliğine aktif olur)
function activateBulletPowerUp() {
  bulletPowerUpActive = true;

  let scoreDiv = document.getElementById("score");
  scoreDiv.style.color = "#0f0"; // Skor yeşil olur

  console.log("Bullet Power-Up Aktif! 10 saniye sürecek.");

  // 10 saniye sonra bullet özelliklerini eski haline getir
  setTimeout(() => {
    bulletPowerUpActive = false;
    scoreDiv.style.color = "#fff"; // Skor rengi eski haline dönsün
    console.log("Bullet Power-Up Süresi Bitti!");
  }, 10000);
}

// Skor güncelleme fonksiyonu
function updateScore() {
  document.getElementById('score').textContent = `Score: ${score}`;
  if (score >= 100 && !bulletPowerUpActive) {
    activateBulletPowerUp(); // Bullet yükseltmesini başlat
  }
}

// Game over
function endGame() {
  gameOver = true;
  document.getElementById('game-over').style.display = 'flex';
  document.getElementById('final-score').textContent = `Score: ${score}`;
  let menu = document.getElementById('menu-screen');
  menu.style.display = 'block';
  cancelAnimationFrame(animationId);  
}

// Main game loop
function gameLoop() {
  ctx.fillStyle = '#003';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  updateBullets();
  
  if (!gameOver) {
    animationId = requestAnimationFrame(gameLoop);
  }
}

// Event listeners for keyboard controls
document.addEventListener('keydown', (e) => {
  if (e.key === ' ') shootPressed = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key === ' ') shootPressed = false;
});

// Restart game
document.getElementById('restart-btn').addEventListener('click', () => {
  score = 0;
  gameOver = false;
  player.life = 100;
  bullets.length = 0;
  enemies.length = 0;
  updateScore();
  document.getElementById('game-over').style.display = 'none';
  gameLoop();
});

// Initialize game
function initGame() {
  createStars();
  gameLoop();
}

// Start the game
window.addEventListener('load', initGame);

window.addEventListener('resize', () => {
  canvas.width = container.clientWidth;
  canvas.height = container.clientHeight;
});
