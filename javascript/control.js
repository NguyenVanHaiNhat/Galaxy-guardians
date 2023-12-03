document.addEventListener('mousemove', function(event) {
    let mouseX = event.clientX - canvas.getBoundingClientRect().left;
    let mouseY = event.clientY - canvas.getBoundingClientRect().top;

    player.x = Math.max(0, Math.min(mouseX - player.width / 2, canvas.width - player.width));
    player.y = Math.max(0, Math.min(mouseY - player.height / 2, canvas.height - player.height));

    canvas.style.cursor = 'none';
});

document.addEventListener('keydown', function(event) {
    if (event.key === ' ') {
        shoot();
    }
});


document.addEventListener('keydown', function(event) {
    if (event.key === 'm') {
        toggleSound();
    }
});




