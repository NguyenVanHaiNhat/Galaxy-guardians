function shoot() {
    // Lấy thời điểm hiện tại
    const currentTime = Date.now();

    // Thời gian giữa các lần bắn (200 milliseconds)
    const timeBetweenShots = 200;

    // Kiểm tra xem đã đủ thời gian giữa các lần bắn chưa
    if (currentTime - lastShotTime > timeBetweenShots) {
        // Tạo đối tượng đạn
        let bullet = {
            x: player.x + player.width / 2 - 2, // Xác định vị trí ban đầu của đạn trên trục X
            y: player.y, // Xác định vị trí ban đầu của đạn trên trục Y
            width: 4, // Độ rộng của đạn
            height: 10, // Độ cao của đạn
            speed: 8, // Tốc độ di chuyển của đạn
        };

        // Thêm đạn vào mảng đạn
        bullets.push(bullet);

        // Cập nhật thời điểm bắn đạn cuối cùng
        lastShotTime = currentTime;

        // Phát âm thanh bắn đạn nếu âm thanh đang được bật
        if (isSoundOn) {
            shootSound.volume = shootVolume; // Đặt âm lượng cho âm thanh bắn đạn
            shootSound.play(); // Phát âm thanh bắn đạn
        }
    }
}

function enemyShoot(enemy) {
    // Lấy thời điểm hiện tại
    const currentTime = Date.now();

    // Kiểm tra xem đã đủ thời gian từ lần bắn cuối cùng chưa
    if (currentTime - enemy.lastShotTime > enemyCoolDown) {
        // Tạo đối tượng đạn của kẻ địch
        let enemyBullet = {
            x: enemy.x + enemy.width / 2 - 2, // Xác định vị trí ban đầu của đạn trên trục X
            y: enemy.y + enemy.height, // Xác định vị trí ban đầu của đạn trên trục Y
            width: 4, // Độ rộng của đạn
            height: 10, // Độ cao của đạn
            speed: 0.5, // Tốc độ di chuyển của đạn (chậm hơn so với đạn của người chơi)
        };

        // Thêm đạn của kẻ địch vào mảng đạn của kẻ địch
        enemyBullets.push(enemyBullet);

        // Cập nhật thời điểm bắn đạn cuối cùng cho kẻ địch hiện tại
        enemy.lastShotTime = currentTime;
    }
}

function updateBullets() {
    // Cập nhật vị trí của đạn từ người chơi
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bullets[i].speed; // Di chuyển đạn lên trên theo trục Y

        // Kiểm tra va chạm giữa đạn và kẻ địch
        for (let j = 0; j < enemies.length; j++) {
            if (
                bullets[i].x < enemies[j].x + enemies[j].width &&
                bullets[i].x + bullets[i].width > enemies[j].x &&
                bullets[i].y < enemies[j].y + enemies[j].height &&
                bullets[i].y + bullets[i].height > enemies[j].y
            ) {
                // Xử lý va chạm: tăng điểm, loại bỏ đạn và kẻ địch, phát âm thanh
                score++;
                bullets.splice(i, 1);
                i--;
                enemies.splice(j, 1);
                remainingEnemies--;

                // Phát âm thanh khi kẻ địch bị tiêu diệt
                killEnemySound.volume = enemyDeathVolume;
                killEnemySound.play();

                // Kiểm tra nếu tất cả kẻ địch đã bị tiêu diệt để chuyển cấp độ hoặc thắng
                if (remainingEnemies === 0) {
                    nextLevel();
                }

                // Kiểm tra và thưởng thêm mạng khi đạt được một mốc điểm
                if (score % 100 === 0) {
                    addLife();
                }

                break; // Dừng vòng lặp để không kiểm tra đối tượng đã bị xoá
            }
        }

        // Loại bỏ đạn nếu vượt ra khỏi màn hình
        if (bullets[i] && bullets[i].y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }

    // Cập nhật vị trí của đạn từ kẻ địch
    for (let i = 0; i < enemyBullets.length; i++) {
        enemyBullets[i].y += enemyBullets[i].speed; // Di chuyển đạn xuống dưới theo trục Y

        // Kiểm tra va chạm giữa đạn kẻ địch và người chơi
        if (
            enemyBullets[i].x < player.x + player.width &&
            enemyBullets[i].x + enemyBullets[i].width > player.x &&
            enemyBullets[i].y < player.y + player.height &&
            enemyBullets[i].y + enemyBullets[i].height > player.y
        ) {
            // Xử lý va chạm: giảm mạng của người chơi, loại bỏ đạn kẻ địch
            playerHit();
            enemyBullets.splice(i, 1);
            i--;
            break; // Dừng vòng lặp để không kiểm tra đối tượng đã bị xoá
        }

        // Loại bỏ đạn nếu vượt ra khỏi màn hình
        if (enemyBullets[i] && enemyBullets[i].y > canvas.height) {
            enemyBullets.splice(i, 1);
            i--;
        }
    }
}

function addLife() {
    if (score > 0 && score % 100 === 0) {
        player.lives++;
    }
}



function updateEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        for (let j = i + 1; j < enemies.length; j++) {
            // Kiểm tra va chạm giữa các kẻ địch và điều chỉnh hướng di chuyển hoặc tốc độ nếu cần
            let distanceX = Math.abs(enemies[i].x - enemies[j].x);
            let distanceY = Math.abs(enemies[i].y - enemies[j].y);
            let distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

            let minDistance = 20; // Đặt giá trị khoảng cách tối thiểu giữa các kẻ địch
            if (distance < minDistance) {
                // Điều chỉnh hướng di chuyển hoặc tốc độ theo nhu cầu
                // enemies[i].directionX *= -1; // Đảo hướng di chuyển
                // enemies[i].speed *= 0.9; // Giảm tốc độ
            }
        }
    }

    // Cập nhật vị trí của từng kẻ địch
    let currentTime = Date.now();
    for (let enemy of enemies) {
        enemy.y += enemy.speed * enemy.directionY;
        enemy.x += enemy.speed * enemy.directionX;

        // Kiểm tra và điều chỉnh vị trí của enemy nếu nó vượt quá biên của canvas
        if (enemy.x < 0) {
            enemy.x = 0;
            enemy.directionX *= -1; // Đảo hướng di chuyển khi va chạm với biên trái
        } else if (enemy.x + enemy.width > canvas.width) {
            enemy.x = canvas.width - enemy.width;
            enemy.directionX *= -1; // Đảo hướng di chuyển khi va chạm với biên phải
        }

        // Kiểm tra và điều chỉnh vị trí của enemy nếu nó vượt quá biên trên hoặc dưới của canvas
        if (enemy.y <= 0 || enemy.y + enemy.height >= canvas.height) {
            enemy.directionY *= -1; // Đảo hướng di chuyển khi va chạm với biên trên hoặc dưới
        }

        // Kiểm tra và điều chỉnh vị trí của enemy nếu nó vượt quá biên trái hoặc phải của canvas
        if (enemy.x <= 0 || enemy.x + enemy.width >= canvas.width) {
            enemy.directionX *= -1; // Đảo hướng di chuyển khi va chạm với biên trái hoặc phải
        }

        // Bắn đạn nếu kẻ địch có thể bắn và đạt đến thời điểm bắn tiếp theo
        if (enemy.canShoot && Math.random() < 0.005) {
            enemyShoot(enemy);
        }
    }

    // Bắn đạn của ngẫu nhiên một số kẻ địch sau mỗi khoảng thời gian
    if (currentTime - lastEnemyShootTime > enemyShootInterval) {
        let randomEnemies = getRandomEnemies(10);
        randomEnemies.forEach((enemy) => {
            enemyShoot(enemy);
        });

        lastEnemyShootTime = currentTime;
    }

    // Spawn thêm kẻ địch nếu số lượng kẻ địch hiện tại nhỏ hơn số lượng kẻ địch còn lại và có xác suất
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
    gameOverDiv.style.backgroundColor = 'rgb(255,255,255)';
    gameOverDiv.style.padding = '20px';
    gameOverDiv.style.textAlign = 'center';
    gameOverDiv.style.color = '#d20e0e';
    gameOverDiv.style.borderRadius = '10px';

    gameOverDiv.innerHTML = `
        <h2>Game Over! Your score is ${score}</h2>
        <button onclick="retryGame()">TryAgain</button>
        <button onclick="exitGame()">return start screen</button>
    `;

    document.body.appendChild(gameOverDiv);
}

function retryGame() {
    document.body.removeChild(document.querySelector('div'));

    resetGame();
    gameOvers = false;
}

function exitGame() {

    window.location.href = 'startScreen.html';
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