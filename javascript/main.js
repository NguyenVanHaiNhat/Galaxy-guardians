
function updateGame() {
    if (!gameOvers) {
        updateBullets();
        updateEnemies();
        checkCollisions();
    }
}

function gameLoop() {
    updateGame();
    renderGame();
    requestAnimationFrame(gameLoop);
}

enemyImage1.onload = function() {
    gameLoop();
};

enemyImage2.onload = function() {
    gameLoop();
};

playerImage.onload = function() {
    gameLoop();
};

backgroundImage.onload = function() {
    gameLoop();
};

enemyImage2.src = './images/meteorite.png';
enemyImage1.src = './images/enemy1.png';
playerImage.src = './images/player.png';
backgroundImage.src = './images/space.png';

window.addEventListener('load', function() {
    gameLoop();
});
