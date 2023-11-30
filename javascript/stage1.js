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