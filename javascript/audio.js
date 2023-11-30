function playShootSound() {
    const shootSound = new Audio('./sounds/shoot.wav');

    shootSound.addEventListener('ended', function() {
        this.currentTime = 0;
    }, false);

    shootSound.play();
}

window.addEventListener('load', function() {
    playBackgroundMusic();
});

function playBackgroundMusic() {
    const backgroundMusic = new Audio('./sounds/backgruondsound.wav');
    backgroundMusic.volume = 0.5;
    backgroundMusic.play();
}