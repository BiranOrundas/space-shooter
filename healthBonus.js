const healthBonuses = []; // Array to hold health bonuses

// Function to spawn health bonuses
function spawnHealthBonus() {
  if (Math.random() < 0.02 && !gameOver) { // Adjust spawn rate as needed
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

// Export functions for use in other files
export { spawnHealthBonus, drawHealthBonuses, updateHealthBonuses };
