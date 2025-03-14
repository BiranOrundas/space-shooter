
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
  // Draw player ship
  ctx.fillStyle = player.color;
  
  // Ship body
  ctx.beginPath();
  ctx.moveTo(player.x + player.width / 2, player.y);
  ctx.lineTo(player.x + player.width, player.y + player.height);
  ctx.lineTo(player.x, player.y + player.height);
  ctx.closePath();
  ctx.fill();
  
  // Engine flames
  if (player.isBoosting) {
    ctx.fillStyle = '#ff0';
  } else {
    ctx.fillStyle = '#f60';
  }
  
  const flameHeight = player.isBoosting ? 60 : 15;
  ctx.beginPath();
  ctx.moveTo(player.x + 10, player.y + player.height);
  ctx.lineTo(player.x + player.width / 2, player.y + player.height + flameHeight);
  ctx.lineTo(player.x + player.width - 10, player.y + player.height);
  ctx.closePath();
  ctx.fill();
}

// Create a bullet
function shootBullet() {
  const now = Date.now();
  if (now - player.lastShot > 150 ) { // Cooldown in ms
    bullets.push({
      x: player.x + player.width / 2 - 3,
      y: player.y,
      width: 2,
      height: 10,
      speed: 15,   
      color: '#f00'
    });
    player.lastShot = now;
  }
}

// Draw bullets
function drawBullets() {
  bullets.forEach(bullet => {
    ctx.fillStyle = bullet.color;
    ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
  });
}

// Create enemy ships
let spawnFactor = 0.02; // Başlangıçta Math.random() için başlangıç faktörü
// Fonksiyon: Düşmanları spawn et
function spawnEnemy() {
  if (Math.random() < spawnFactor && !gameOver) {
    // Eğer boost aktifse, düşmanların hızını artır
    const speedFactor = player.isBoosting ? 25.5 : 1; 
    enemySpeed = player.isBoosting ? Math.random() * speedFactor : Math.random() * 1 + 2;

    enemies.push({
      x: Math.random() * (canvas.width - 50),
      y: -50,
      width: 50,
      height: 50,
      speed: enemySpeed  // Boost durumuna göre hız
    });
  }
}

// Bu fonksiyonu her 30 saniyede bir çağırarak spawnFactor'ü artır
setInterval(function() {
  spawnFactor += 0.02;  // spawnFactor'ü 0.01 arttır
  console.log("Updated spawn factor:", spawnFactor); // Güncellenen faktörü konsola yazdır
}, 10000);  // 30 saniye arayla çalışır (30000ms)

setInterval(function() {
  spawnFactor -= 0.05;  // spawnFactor'ü 0.01 arttır
  console.log("Updated spawn factor for minus:", spawnFactor); // Güncellenen faktörü konsola yazdır
}, 100000); 
// Diğer kod...



// Draw enemy ships
function drawEnemies() {
  enemies.forEach(enemy => {
    // Enemy ship body
    ctx.fillStyle = '#f00';
    ctx.beginPath();
    ctx.moveTo(enemy.x + enemy.width / 2, enemy.y + enemy.height);
    ctx.lineTo(enemy.x + enemy.width, enemy.y);
    ctx.lineTo(enemy.x, enemy.y);
    ctx.closePath();
    ctx.fill();
    
    // Enemy details
    ctx.fillStyle = '#ff0';
    ctx.beginPath();
    ctx.arc(enemy.x + enemy.width / 2, enemy.y + enemy.height / 2, 10, 0, Math.PI * 2);
    ctx.fill();
  });
}

const healthBonuses = []; // Array to hold health bonuses

// Function to spawn health bonuses
function spawnHealthBonus() {
  if (Math.random() < 2 && !gameOver) { // Adjust spawn rate as needed
    healthBonuses.push({
      x: Math.random() * (canvas.width - 20),
      y: Math.random() * (canvas.height - 20),
      radius: 10, // Radius of the health bonus
      color: 'green' // Color of the health bonus
    });
  }
}

function drawHealthBonuses() {
  healthBonuses.forEach(bonus => {
    ctx.fillStyle = bonus.color;
    ctx.beginPath();
    ctx.arc(bonus.x, bonus.y, bonus.radius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function updateHealthBonuses() {
  for (let i = 0; i < healthBonuses.length; i++) {
    // Check for collision with player
    if (
      player.x < healthBonuses[i].x + healthBonuses[i].radius &&
      player.x + player.width > healthBonuses[i].x - healthBonuses[i].radius &&
      player.y < healthBonuses[i].y + healthBonuses[i].radius &&
      player.y + player.height > healthBonuses[i].y - healthBonuses[i].radius
    ) {
      // Increase player's life
      player.life = Math.min(player.life + 20, 100); // Increase life by 20, max 100
      updateLifeBar();
      healthBonuses.splice(i, 1); // Remove the health bonus
      i--; // Adjust index after removal
    }
  }
}

// Draw stars background
function drawStars() {
  ctx.fillStyle = 'white';
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

function change(){
    var num = Math.floor(Math.random() * 100);
    stars.style.borderRadius= num+'px';
  };


// Update star positions
// Update star positions
function updateStars() {
stars.forEach(star => {
// Eğer boost aktifse, yıldızın hızını artır
const speedFactor = player.isBoosting ? 5.5 : 1; 

star.y += star.speed * speedFactor; // Yıldızın hızı boost durumuna göre değişir  

// Eğer yıldız ekranın dışına çıkarsa, konumunu sıfırlayın
if (star.y > canvas.height) {
  star.y = 0;
  star.x = Math.random() * canvas.width;
}
});
}


// Update game elements
function updateGameElements() {

if (leftPressed && player.x > 0) {
player.x -= player.isBoosting ? player.boostedSpeed : player.speed;
const LeftDirs = document.getElementsByName("leftButton");
LeftDirs.forEach(btn => {
btn.style.backgroundColor = "#5CE65C";
});
}else{
const LeftDirs = document.getElementsByName("leftButton");
LeftDirs.forEach(btn => {
btn.style.backgroundColor = "#AAAAAA";
})};



if (rightPressed && player.x < canvas.width - player.width) {
player.x += player.isBoosting ? player.boostedSpeed : player.speed;

const rightDirs = document.getElementsByName("rightButton");
rightDirs.forEach(btn => {
btn.style.backgroundColor = "#5CE65C";
});
}else{
const rightDirs = document.getElementsByName("rightButton");
rightDirs.forEach(btn => {
btn.style.backgroundColor = "#AAAAAA";
})};


if (upPressed && player.y < canvas.height - player.height) {
player.y -= player.isBoosting ? player.boostedSpeed : player.speed;
const upDirs = document.getElementsByName("upButton");
upDirs.forEach(btn => {
btn.style.backgroundColor = "#5CE65C";
});

}else{
const upDirs = document.getElementsByName("upButton");
upDirs.forEach(btn => {
btn.style.backgroundColor = "#AAAAAA";
})};






if (downPressed && player.y < canvas.height - 20 - player.height) {
player.y += player.isBoosting ? player.boostedSpeed : player.speed;
const downDirs = document.getElementsByName("downButton");
downDirs.forEach(btn => {
btn.style.backgroundColor = "#5CE65C";
});

}else{
const downDirs = document.getElementsByName("downButton");
downDirs.forEach(btn => {
btn.style.backgroundColor = "#AAAAAA";
})};

// Update bullets
for (let i = 0; i < bullets.length; i++) {
bullets[i].y -= bullets[i].speed;

// Remove bullets that are off screen
if (bullets[i].y < 0) {
  bullets.splice(i, 1);
  i--;
}
}

// Update enemies
for (let i = 0; i < enemies.length; i++) {
enemies[i].y += enemies[i].speed;

// Check for collision with player
if (
  player.x < enemies[i].x + enemies[i].width &&
  player.x + player.width > enemies[i].x &&
  player.y < enemies[i].y + enemies[i].height &&
  player.y + player.height > enemies[i].y
) {
  // Player hit by enemy
  player.life -= 20;
  updateLifeBar();

  // Remove enemy
  enemies.splice(i, 1);
  i--;

  // Check game over
  if (player.life <= 0) {
    endGame();
  }

  continue;
}     

// Check for bullets hitting enemies
for (let j = 0; j < bullets.length; j++) {
  if (
    bullets[j].x < enemies[i].x + enemies[i].width &&
    bullets[j].x + bullets[j].width > enemies[i].x &&
    bullets[j].y < enemies[i].y + enemies[i].height &&
    bullets[j].y + bullets[j].height > enemies[i].y
  ) {
    // Enemy hit by bullet
    score += 115;
    updateScore();

  // Global variable to track if the bullet height has been changed
let bulletHeightUpdated = false;

// Inside the game loop or where you check the score
if (score >= 100 && !bulletHeightUpdated) {
// Set the bullet height to 100
bullets.forEach(bullet => {
    bullet.height = 100;
    bullet.color = "#00FF00"
});

// Mark the bullet height as updated
bulletHeightUpdated = true;
}


    // Remove enemy and bullet
    enemies.splice(i, 1);
    bullets.splice(j, 1);
    i--;
    break;
  }
}

// Remove enemies that are off screen
if (enemies[i] && enemies[i].y > canvas.height) {
  enemies.splice(i, 1);
  i--;
}
}
}


function Day() { 
const space = document.getElementById("game-container");  

setTimeout((randomColor) => {     
    var randomColor = Math.floor(Math.random()*16777215).toString(16);   
    space.style.backgroundColor = randomColor;        
},5500);
}


// Update life bar
function updateLifeBar() {
  const lifeBar = document.getElementById('life-bar');
  lifeBar.style.width = `${player.life}%`; // Life bar genişliği oyuncunun hayatına göre ayarlanır
  lifeBar.innerHTML = ` ${player.life}`;

  // Hayat durumuna göre renk değiştir
  if (player.life > 80) {
    lifeBar.style.backgroundColor = '#7CFC00'; // Yeşil
    lifeBar.style.color = '#fff'; // Yeşil
  } else if (player.life > 60) {
    lifeBar.style.backgroundColor = '#FF5F1F'; // Sarı-yeşil
  } else if (player.life > 40) {
    lifeBar.style.backgroundColor = '#FFC300'; // Sarı
  } else if (player.life > 20) {
    lifeBar.style.backgroundColor = '#FF5F1F'; // Turuncu
  } else {
    lifeBar.style.backgroundColor = '#f00'; // Kırmızı
  }
  
  
}

function lifeUp() {
  // Eğer hayat çubuğu zaten 100'e ulaşmışsa, işlemi durdur.
  if (player.life >= 100) return;

  // Eğer daha önce bir interval başlatılmamışsa, başlat
  if (!player.lifeUpActive) {
    player.lifeUpActive = true; // Interval'in aktif olduğunu işaretle

    let interval = setInterval(function() {
      if (player.life < 100) {
        player.life += 0.5;  // Hayat çubuğunu artır
        updateLifeBar(); // Hayat çubuğunu güncelle
        console.log("lifeUp çalışıyor: " + player.life); // Hangi durumda olduğunu görmek için
      } else {
        player.life = 100; // Hayat çubuğu 100'e ulaşırsa, sabit tut
        updateLifeBar(); // Güncelleme yap
        clearInterval(interval); // Interval'i temizle
        player.lifeUpActive = false; // Artış işlemi tamamlandı, flag sıfırlansın
        console.log("lifeUp durdu: " + player.life); // Durum mesajı
      }
    }, 500); // 100ms arayla hayat artır
  }
}


// Update score display
function updateScore() {
  document.getElementById('score').textContent = `Score: ${score}`;
}



// Game over
function endGame() {
  gameOver = true;
  document.getElementById('game-over').style.display = 'flex';
  document.getElementById('final-score').textContent = `Score: ${score}`;
  let menu = document.getElementById('menu-screen')
  menu.style.display = 'block'
  cancelAnimationFrame(animationId);  

  if(menu.style.display === 'block') {
    cancelAnimationFrame(gameLoop);
    clearInterval(interval);
    console.log("game stopped !")
  }

  return;
}

// Main game loop
function gameLoop() {
  // Clear canvas
  ctx.fillStyle = '#003';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  
//   let colors = 0;
//   var randomColor = Math.floor(Math.random()*16777215).toString(16);
//   while(colors = 0 < 10 ){
//     ctx.fillStyle = randomColor; colors++
//   }

    //Space Turning
  Day();
  lifeUp();
  // Draw stars
  drawStars();
  updateStars();
  
  // Spawn enemies
  spawnEnemy();
  
  
  // Update game elements
  updateGameElements();
  
  // Fire bullet if shoot button is pressed
  if (shootPressed) {
    shootBullet();
    
  }
  
  // Draw game elements
  drawPlayer();
  drawBullets();
  drawEnemies();
  
  // Continue game loop
  if (!gameOver) {
    animationId = requestAnimationFrame(gameLoop);
  }
}

// Event listeners for keyboard controls
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a') leftPressed = true;
  if (e.key === 'ArrowRight' || e.key === 'd') rightPressed = true;
  if (e.key === 'ArrowUp' || e.key === 'w') upPressed = true;
  if (e.key === 'ArrowDown' || e.key === 's') downPressed = true;
  if (e.key === ' ' || e.key === 'Enter') shootPressed = true;
  if (e.key === 'Shift') {
    boostPressed = true;
    player.isBoosting = true;
    console.log("BOOSTED !!! ")
  }
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowLeft' || e.key === 'a') leftPressed = false;
  if (e.key === 'ArrowRight' || e.key === 'd') rightPressed = false;
  if (e.key === 'ArrowUp' || e.key === 'w') upPressed = false;
  if (e.key === 'ArrowDown' || e.key === 's') downPressed = false;
  if (e.key === ' ' || e.key === 'Enter') shootPressed = false;
  if (e.key === 'Shift') {
    boostPressed = false;
    player.isBoosting = false;
    console.log("Rolanted! ")
  }
});

// Touch controls
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const shootBtn = document.getElementById('shoot-btn');
const boostBtn = document.getElementById('boost-btn');

leftBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  leftPressed = true;
});

leftBtn.addEventListener('touchend', (e) => {
  e.preventDefault();
  leftPressed = false;
});

rightBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  rightPressed = true;
});

rightBtn.addEventListener('touchend', (e) => {
  e.preventDefault();
  rightPressed = false;
});

shootBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  shootPressed = true;
});

shootBtn.addEventListener('touchend', (e) => {
  e.preventDefault();
  shootPressed = false;
});

boostBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  boostPressed = true;
  player.isBoosting = true;
});

boostBtn.addEventListener('touchend', (e) => {
  e.preventDefault();
  boostPressed = false;
  player.isBoosting = false;
});

// Mouse controls (for testing on desktop)
leftBtn.addEventListener('mousedown', () => {
  leftPressed = true;
});

leftBtn.addEventListener('mouseup', () => {
  leftPressed = false;
});

rightBtn.addEventListener('mousedown', () => {
  rightPressed = true;
});

rightBtn.addEventListener('mouseup', () => {
  rightPressed = false;
});

shootBtn.addEventListener('mousedown', () => {
  shootPressed = true;
});

shootBtn.addEventListener('mouseup', () => {
  shootPressed = false;
});

boostBtn.addEventListener('mousedown', () => {
  boostPressed = true;
  player.isBoosting = true;
});

boostBtn.addEventListener('mouseup', () => {
  boostPressed = false;
  player.isBoosting = false;
});

// Restart game
document.getElementById('restart-btn').addEventListener('click', () => {
  // Reset game state
  score = 0;
  gameOver = false;
  player.life = 100;
  player.x = canvas.width / 2 - 25;
  player.y = canvas.height - 100;
  player.isBoosting = false;
  
  // Clear arrays
  bullets.length = 0;
  enemies.length = 0;
  
  // Update UI
  updateScore();
  updateLifeBar();
  
  // Hide game over screen
  document.getElementById('game-over').style.display = 'none';
  
  // Start game loop
  gameLoop();
});

// Initialize game
function initGame() {
  createStars();
  updateLifeBar();
   
  gameLoop();
}

// Start the game
window.addEventListener('load', initGame);

window.addEventListener('resize', () => {
canvas.width = container.clientWidth;
canvas.height = container.clientHeight;
});

