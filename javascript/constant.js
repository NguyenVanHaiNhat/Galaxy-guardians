const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let player = {
    x: 50,
    y: 50,
    width: 20,
    height: 20,
    speed: 5,
    lives: 5,
};

let enemyImage1 = new Image();
enemyImage1.src = "./images/enemy1.png";
let enemyImage2 = new Image();
enemyImage2.src = "./images/meteorite.png";
let playerImage = new Image();
playerImage.src = "./images/player.png";
let backgroundImage = new Image();
backgroundImage.src = "./images/space.png";
let lastShotTime = 0;
let enemies = [];
let bullets = [];
let enemyBullets = [];
let enemiesCanShoot = [];
let score = 0;
let remainingEnemies = 100;
let enemyCoolDown = 2000;
let lastEnemyShootTime = 0;
let enemyShootInterval = 2000;
let currentLevel = 1;
let gameOvers = false;