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
let lastShotTime = 0;
let enemies = [];
let bullets = [];
let enemyBullets = [];
let enemiesCanShoot = [];
let score = 0;
let remainingEnemies = 100;
let enemyCoolDown = 2000;
let lastEnemyShootTime = 0;
let enemyShootInterval = 2000;
let currentLevel = 1;

document.addEventListener('mousemove', function(event) {
    let mouseX = event.clientX - canvas.getBoundingClientRect().left;
    let mouseY = event.clientY - canvas.getBoundingClientRect().top;

    player.x = Math.max(0, Math.min(mouseX - player.width / 2, canvas.width - player.width));
    player.y = Math.max(0, Math.min(mouseY - player.height / 2, canvas.height - player.height));
});

document.addEventListener('keydown', function(event) {
    if (event.key === ' ') {
        shoot();
    }
});

function shoot() {
    const currentTime = Date.now();
    const timeBetweenShots = 200;

    if (currentTime - lastShotTime > timeBetweenShots) {
        let bullet = {
            x: player.x + player.width / 2 - 2,
            y: player.y,
            width: 4,
            height: 10,
            speed: 8,
        };
        bullets.push(bullet);
        lastShotTime = currentTime;
    }
}

function enemyShoot(enemy) {
    const currentTime = Date.now();

    // Kiểm tra xem đã đủ thời gian từ lần bắn cuối cùng chưa
    if (currentTime - enemy.lastShotTime > enemyCoolDown) {
        let enemyBullet = {
            x: enemy.x + enemy.width / 2 - 2,
            y: enemy.y + enemy.height,
            width: 4,
            height: 10,
            speed: 0.5, // Chậm hơn so với đạn của người chơi
        };

        enemyBullets.push(enemyBullet);

        // Cập nhật thời điểm bắn đạn cuối cùng cho kẻ thù hiện tại
        enemy.lastShotTime = currentTime;
    }
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

    for (let i = 0; i < enemyBullets.length; i++) {
        enemyBullets[i].y += enemyBullets[i].speed;

        if (
            enemyBullets[i].x < player.x + player.width &&
            enemyBullets[i].x + enemyBullets[i].width > player.x &&
            enemyBullets[i].y < player.y + player.height &&
            enemyBullets[i].y + enemyBullets[i].height > player.y
        ) {
            playerHit();
            enemyBullets.splice(i, 1);
            i--;
            break;
        }

        if (enemyBullets[i] && enemyBullets[i].y > canvas.height) {
            enemyBullets.splice(i, 1);
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

    ctx.fillStyle = '#F00';
    for (let bullet of enemyBullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }
}

function updateEnemies() {
    let currentTime = Date.now();
    for (let enemy of enemies) {
        enemy.y += enemy.speed * enemy.directionY;
        enemy.x += enemy.speed * enemy.directionX;

        // Kiểm tra và điều chỉnh vị trí của enemy nếu nó vượt quá biên phải của canvas
        if (enemy.x < 0) {
            enemy.x = 0;
            enemy.directionX *= -1; // Đảo hướng di chuyển khi va chạm với biên trái
        } else if (enemy.x + enemy.width > canvas.width) {
            enemy.x = canvas.width - enemy.width;
            enemy.directionX *= -1; // Đảo hướng di chuyển khi va chạm với biên phải
        }

        if (enemy.canShoot && Math.random() < 0.005) {
            enemyShoot(enemy);
        }

        if (enemy.y <= 0 || enemy.y + enemy.height >= canvas.height) {
            enemy.directionY *= -1;
        }

        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            enemy.directionX *= -1;
        }
    }
    if (currentTime - lastEnemyShootTime > enemyShootInterval) {
        // Chọn ngẫu nhiên 5 kẻ thù từ mảng và cho chúng bắn
        let randomEnemies = getRandomEnemies(5);
        randomEnemies.forEach((enemy) => {
            enemyShoot(enemy);
        });

        lastEnemyShootTime = currentTime;
    }


    if (enemies.length < remainingEnemies && Math.random() < 0.02) {
        if (currentLevel === 1) {
            spawnEnemyStage1();
        } else if (currentLevel === 2) {
            spawnEnemyStage2();
        }
    }
}

function getRandomEnemies(n) {
    let randomEnemies = [];
    while (randomEnemies.length < n && enemiesCanShoot.length > 0) {
        let randomIndex = Math.floor(Math.random() * enemiesCanShoot.length);
        randomEnemies.push(enemiesCanShoot[randomIndex]);
        enemiesCanShoot.splice(randomIndex, 1);
    }
    return randomEnemies;
}

function spawnEnemyStage1() {
    let numRows = 4;
    let rowWidth = canvas.width / 5;
    let enemyWidth = 20;
    let enemyHeight = 20;
    let enemySpeed = 0.5;
    let rowGap = 20;

    for (let row = 0; row < numRows; row++) {
        for (let i = 0; i < 5; i++) {
            let enemy = {
                x: Math.min(i * (rowWidth + rowGap) + (rowWidth - enemyWidth) / 2),
                y: row * (enemyHeight + rowGap),
                width: enemyWidth,
                height: enemyHeight,
                speed: enemySpeed,
                directionX: -1,
                directionY: 0,
                canShoot: true,
                lastShotTime: 0,
            };
            enemies.push(enemy);
        }
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
            directionX: -1,
            directionY: 1,
            canShoot: true,
            lastShotTime: 0,
        };
        enemies.push(enemy);
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
    } else {
        player.x = canvas.width / 2 - player.width / 2;
        player.y = canvas.height + 50;
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

function renderEnemies() {
    if (currentLevel === 1) {
        for (let enemy of enemies) {
            ctx.drawImage(enemyImage1, enemy.x, enemy.y, enemy.width, enemy.height);
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

    renderEnemies();
    renderBullets();
    renderScore();
    renderRemainingEnemies();
    renderLives();
    renderLevel();
}

function updateGame() {
    updateBullets();
    updateEnemies();
    checkCollisions();
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
    enemyBullets = [];
    bullets = [];
    remainingEnemies = 100;
    enemiesCanShoot = [...enemies]; // Sao chép tất cả kẻ thù vào mảng mới
    lastEnemyShootTime = 0; // Reset thời điểm cuối cùng bắn của nhóm kẻ thù

    if (currentLevel === 1) {
        spawnEnemyStage1();
    } else if (currentLevel === 2) {
        spawnEnemyStage2();
    } else if (currentLevel === 3) {
        spawnBoss();
    }
}

function gameWin() {
    alert('Congratulations! You have defeated all enemies and won the game!');
    resetGame();
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

enemyImage2.src = './images/enemy2.png';
enemyImage1.src = './images/enemy1.png';
playerImage.src = './images/player.png';
backgroundImage.src = './images/space.png';

window.addEventListener('load', function() {
    gameLoop();
});
