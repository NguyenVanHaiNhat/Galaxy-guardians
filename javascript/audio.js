function playShootSound() {
    const shootSound = new Audio('./sounds/shoot.wav');

    // Lắng nghe sự kiện 'ended' để có thể chơi âm thanh nhiều lần
    shootSound.addEventListener('ended', function() {
        this.currentTime = 0;
    }, false);

    shootSound.play();
}

// Thêm sự kiện cho sự kiện tải trang
window.addEventListener('load', function() {
    // Chơi âm nhạc nền khi trang được tải
    playBackgroundMusic();
});

function playBackgroundMusic() {
    const backgroundMusic = new Audio('./sounds/backgruondsound.wav');
    backgroundMusic.volume = 0.5; // Điều chỉnh âm lượng theo nhu cầu
    backgroundMusic.play();
}