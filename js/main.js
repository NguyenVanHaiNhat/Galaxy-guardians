const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let player = {
    x: 50,
    y: 50,
    width: 20,
    height: 20,
    speed: 5,
    lives: 3,
};

let enemyImage1 = new Image();
enemyImage1.src = "./images/enemy1.png";
let enemyImage2 = new Image();
enemyImage2.src = "./images/enemy2.png";
let playerImage = new Image();
playerImage.src = "./images/player.png";
let backgroundImage = new Image();
backgroundImage.src = "./images/space.png";
let enemies = [];
let bullets = [];
let score = 0;
let remainingEnemies = 100;

let currentLevel = 1;

document.addEventListener('mousemove', function(event) {
    let mouseX = event.clientX - canvas.getBoundingClientRect().left;
    let mouseY = event.clientY - canvas.getBoundingClientRect().top;

// Giới hạn tọa độ x của nhân vật trong khoảng từ 0 đến (canvas.width - player.width)
    player.x = Math.max(0, Math.min(mouseX - player.width / 2, canvas.width - player.width));

    // Giới hạn tọa độ y của nhân vật trong khoảng từ 0 đến (canvas.height - player.height)
    player.y = Math.max(0, Math.min(mouseY - player.height / 2, canvas.height - player.height));
});

document.addEventListener('keydown', function(event) {
    if (event.key === ' ') {
        shoot();
    }
});

function shoot(){
    let bullet = {
        x: player.x + player.width / 2 - 2,
        y: player.y,
        width: 4,
        height: 10,
        speed: 8,
    };
    bullets.push(bullet);
}

function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bullets[i].speed;

        for (let j = 0; j < enemies.length; j++) {
            if (
                bullets[i].x < enemies[j].x + enemies[j].width &&
                bullets[i].x + bullets[i].width > enemies[j].x &&
                bullets[i].y < enemies[j].y + enemies[j].height &&
                bullets[i].y + bullets[i].height > enemies[j].y
            ) {
                score++;
                bullets.splice(i, 1);
                i--;
                enemies.splice(j, 1);
                remainingEnemies--;

                if (remainingEnemies === 0) {
                    nextLevel();
                }

                // Kiểm tra điều kiện để thêm mạng
                if (score % 100 === 0) {
                    addLife();
                }

                break;
            }
        }

        if (bullets[i] && bullets[i].y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

function addLife() {
    player.lives++;
}

function renderBullets() {
    ctx.fillStyle = '#0F0';
    for (let bullet of bullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
}

function updateEnemies() {
    for (let enemy of enemies) {
        enemy.y += enemy.speed * enemy.directionY;
        enemy.x += enemy.speed * enemy.directionX;

        // Kiểm tra va chạm với biên trên và dưới
        if (enemy.y <= 0 || enemy.y + enemy.height >= canvas.height) {
            enemy.directionY *= -1; // Đảo hướng di chuyển theo trục y
        }

        // Kiểm tra va chạm với biên trái và phải
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            enemy.directionX *= -1; // Đảo hướng di chuyển theo trục x
        }
    }

    if (enemies.length < remainingEnemies && Math.random() < 0.02) {
        if (currentLevel === 1){
            spawnEnemyStage1();
        }
        else if (currentLevel === 2){
            spawnEnemyStage2();
        }
    }
}

function spawnEnemyStage1() {
    let rowY = 0;
    let rowWidth = canvas.width / 5;
    let enemyWidth = 20;
    let enemyHeight = 20;
    let enemySpeed = 0.5;

    for (let i = 0; i < 5; i++) {
        let enemy = {
            x: i * rowWidth + (rowWidth - enemyWidth) / 2,
            y: rowY,
            width: enemyWidth,
            height: enemyHeight,
            speed: enemySpeed,
            directionX: -1, // Hướng di chuyển theo trục x, 1 là qua phải, -1 là qua trái
            directionY: 0, // Hướng di chuyển theo trục y, 1 là xuống, -1 là lên
        };
        enemies.push(enemy);
    }
}

function spawnEnemyStage2() {
    let rowY = 0;
    let rowWidth = canvas.width / 5;
    let enemyWidth = 20;
    let enemyHeight = 20;
    let enemySpeed = 1;

    for (let i = 0; i < 5; i++) {
        let enemy = {
            x: i * rowWidth + (rowWidth - enemyWidth) / 2,
            y: rowY,
            width: enemyWidth,
            height: enemyHeight,
            speed: enemySpeed,
            directionX: -1, // Hướng di chuyển theo trục x, 1 là qua phải, -1 là qua trái
            directionY: 1, // Hướng di chuyển theo trục y, 1 là xuống, -1 là lên
        };
        enemies.push(enemy);
    }
}


function renderEnemies() {
   if (currentLevel === 1){
       for (let enemy of enemies) {
           ctx.drawImage(enemyImage1, enemy.x, enemy.y, enemy.width, enemy.height);
       }
   } else if (currentLevel === 2){
       for (let enemy of enemies) {
           ctx.drawImage(enemyImage2, enemy.x, enemy.y, enemy.width, enemy.height);
       }
   }
}

function checkCollisions() {
    for (let enemy of enemies) {
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            playerHit();
        }
    }
}

function playerHit() {
    player.lives--;

    if (player.lives === 0) {
        gameOver();
    }
}

function renderScore() {
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 30);
}

function renderRemainingEnemies() {
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText('Remaining Enemies: ' + remainingEnemies, 10, 60);
}

function renderLives() {
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText('Lives: ' + player.lives, 10, 90);
}

function renderLevel() {
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText('Level: ' + currentLevel, 10, 120);
}

function updateGame() {
    updateBullets();
    updateEnemies();
    checkCollisions();
}

function renderGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height)

    // ctx.fillStyle = '#00F';
    // ctx.fillRect(player.x, player.y, player.width, player.height);

    renderEnemies();
    renderBullets();
    renderScore();
    renderRemainingEnemies();
    renderLives();
    renderLevel();
}

function gameLoop() {
    updateGame();
    renderGame();
    requestAnimationFrame(gameLoop);
}

function gameOver() {
    alert('Game Over! Your score is ' + score);
    resetGame();
}

function nextLevel() {
    currentLevel++;

    if (currentLevel <= 2) {
        alert('Level ' + currentLevel + ' complete! Get ready for the next level!');
        resetGame();
    } else if (currentLevel === 3) {
        alert('Boss Level! Prepare for the final showdown!');
        spawnBoss();
    } else {
        gameWin();
    }
}

function resetGame() {
    score = 0;
    player.lives = 3;
    player.x = 50;
    player.y = 50;
    enemies = [];
    bullets = [];
    remainingEnemies = 100;

    if (currentLevel === 1 ){
        spawnEnemyStage1();
    }
    else if (currentLevel === 2){
        spawnEnemyStage2();
    }
    else if (currentLevel === 3){
        spawnBoss();
    }
}

function gameWin() {
    alert('Congratulations! You have defeated all enemies and won the ga    me!');
    resetGame();
}

enemyImage1.onload = function() {
    // Start the game loop after the image is loaded
    gameLoop();
};

enemyImage2.onload = function() {
    // Start the game loop after the image is loaded
    gameLoop();
};

playerImage.onload = function() {
    // Bắt đầu vòng lặp trò chơi sau khi hình ảnh người chơi được tải
    gameLoop();
};
playerImage.src = './images/player.png';

backgroundImage.onload = function() {
    // Tiếp tục tải trước các hình ảnh khác hoặc bắt đầu vòng lặp trò chơi ở đây nếu cần
};
backgroundImage.src = './images/space.png';

enemyImage2.src = './images/enemy2.png';
enemyImage1.src = './images/enemy1.png';

window.addEventListener('load', function() {
    gameLoop();
});
