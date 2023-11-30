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



function updateEnemies() {

    for (let i = 0; i < enemies.length; i++) {
        for (let j = i + 1; j < enemies.length; j++) {
            let distanceX = Math.abs(enemies[i].x - enemies[j].x);
            let distanceY = Math.abs(enemies[i].y - enemies[j].y);
            let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            // Đặt giá trị khoảng cách tối thiểu giữa các quái vật
            let minDistance = 20;
            if (distance < minDistance) {
                // Điều chỉnh hướng di chuyển hoặc tốc độ theo nhu cầu
                // Ví dụ: enemies[i].directionX *= -1; // Đảo hướng di chuyển
                // Hoặc: enemies[i].speed *= 0.9; // Giảm tốc độ
            }
        }
    }
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

function gameOver() {

    gameOvers = true;

    enemies = [];
    bullets = [];
    enemyBullets = [];
    // Hiển thị hộp thoại thông báo Game Over
    let gameOverDiv = document.createElement('div');
    gameOverDiv.style.position = 'absolute';
    gameOverDiv.style.top = '50%';
    gameOverDiv.style.left = '50%';
    gameOverDiv.style.transform = 'translate(-50%, -50%)';
    gameOverDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    gameOverDiv.style.padding = '20px';
    gameOverDiv.style.textAlign = 'center';
    gameOverDiv.style.color = '#fff';
    gameOverDiv.style.borderRadius = '10px';

    gameOverDiv.innerHTML = `
        <h2>Game Over! Your score is ${score}</h2>
        <button onclick="retryGame()">Retry</button>
        <button onclick="exitGame()">Exit</button>
    `;

    document.body.appendChild(gameOverDiv);
}

function retryGame() {
    // Xóa hộp thoại thông báo Game Over
    document.body.removeChild(document.querySelector('div'));

    // Gọi lại hàm resetGame để bắt đầu lại trò chơi
    resetGame();
    gameOvers = false;
}

function exitGame() {
    // Đóng trình duyệt hoặc chuyển đến trang chính
    window.close(); // Đóng trình duyệt
    // hoặc
    // window.location.href = 'index.html'; // Chuyển đến trang chính (thay 'index.html' bằng đường dẫn tương ứng)
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
    player.lives = 5;
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