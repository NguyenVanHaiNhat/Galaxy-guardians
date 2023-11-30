function spawnEnemyStage2() {
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
            directionX: -1,
            directionY: 1,
        };
        enemies.push(enemy);
    }
}