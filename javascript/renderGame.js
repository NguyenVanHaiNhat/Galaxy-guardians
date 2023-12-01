function renderBullets() {
    ctx.fillStyle = '#0F0';
    for (let bullet of bullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }

    ctx.fillStyle = '#F00';
    for (let bullet of enemyBullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
}

function renderScore() {
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 700, 30);
}

function renderRemainingEnemies() {
    ctx.fillStyle = '#d2a40e';
    ctx.font = '20px Arial';
    ctx.fillText('Remaining Enemies: ' + remainingEnemies, 10, 30);
}

function renderLives() {
    ctx.fillStyle = '#d20e0e';
    ctx.font = '20px Arial';
    ctx.fillText('Lives: ' + player.lives, 10, 580);
}

function renderEnemies() {
    if (currentLevel === 1) {
        for (let enemy of enemies) {
            ctx.drawImage(enemyImage1, enemy.x, enemy.y, enemy.width, enemy.height);
            ctx.drawImage(enemyImage3, enemy.x, enemy.y, enemy.width, enemy.height);
        }
    } else if (currentLevel === 2) {
        for (let enemy of enemies) {
            ctx.drawImage(enemyImage2, enemy.x, enemy.y, enemy.width, enemy.height);
        }
    }
}

function renderGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height)

    if (!gameOvers) {
        renderEnemies();
        renderBullets();
        renderScore();
        renderRemainingEnemies();
        renderLives();
    }
}