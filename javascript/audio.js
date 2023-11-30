function playShootSound() {

    shootSound.addEventListener('ended', function() {
        this.currentTime = 0;
    }, false);

    shootSound.play();
}

window.addEventListener('load', function() {
    playBackgroundMusic();
});

function playBackgroundMusic() {

    backgroundMusic.volume = 0.5;
    backgroundMusic.play();
}

function toggleSound() {

    isSoundOn = !isSoundOn;

    if (isSoundOn) {
        backgroundMusic.play();
        shootSound.play();
    } else {
        backgroundMusic.pause();
        shootSound.pause();

    }
}