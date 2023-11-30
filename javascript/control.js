
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


