
function spawnEnemyStage2() {
    let rowY = 0;
    let rowWidth = canvas.width / 5;
    let enemyWidth = 20;
    let enemyHeight = 20;
    let enemySpeed = 0.5;
    let spawnInterval = 20000; // Thời gian giữa mỗi lần spawn (10s)
    let enemiesToSpawn = 20; // Số lượng kẻ địch mỗi lần spawn

    function spawnEnemies() {
        for (let i = 0; i < enemiesToSpawn; i++) {
            let enemy = {
                x: i * rowWidth + (rowWidth - enemyWidth) / 2,
                y: rowY,
                width: enemyWidth,
                height: enemyHeight,
                speed: enemySpeed,
                directionX: -1,
                directionY: 1,
            };
            enemies.push(enemy);
        }
    }

    // Gọi hàm spawnEnemies ngay từ lúc bắt đầu và sau mỗi khoảng thời gian spawnInterval
    spawnEnemies();
    setInterval(spawnEnemies, spawnInterval);
}


