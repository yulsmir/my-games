'use strict';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    zoom: 1.5,
    roundPixels: true,
    backgroundColor: '#089ba3',
    title: 'Pikachu Catches Pokeballs',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 1000}
        }
    },
    scene: {
        preload,
        create,
        update
    }
};

//ASSETS VARIABLES
let player;
let balls;
let bombs;
let platforms;
let cursors;
let score = 0;
let scoreText;
let gameOver = false;
let gameOverText = false;
let backgroundMusic;
let jumpAudio;
let restartText = false;

new Phaser.Game(config);

function preload() {
    this.load.image('ground', 'assets/images/ground.png');
    this.load.image('platform', 'assets/images/platform.png');
    this.load.image('ball', 'assets/images/ball.png');
    this.load.image('bomb', 'assets/images/bomb.png');
    this.load.spritesheet('player', 'assets/images/pika.png', {frameWidth: 62, frameHeight: 64});
    this.load.audio('bgmusic', 'assets/audio/happy.mp3');
    this.load.audio('jumpAudio', 'assets/audio/jump.wav');
    //TODO audio play on events
}

function create() {
    //PLATFORMS
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 588, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'platform');
    platforms.create(50, 250, 'platform');
    platforms.create(750, 240, 'platform');

    //PLAYER
    player = this.physics.add.sprite(100, 450, 'player');
    player.setCollideWorldBounds(true);

    //AUDIO
    backgroundMusic = this.sound.add('bgmusic');
    jumpAudio = this.sound.add('jumpAudio');
    backgroundMusic.play();

    //ANIMATIONS
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('player', {start: 5, end: 7}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{key: 'player', frame: 2}]
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('player', {start: 9, end: 11}),
        frameRate: 10,
        repeat: -1
    });

    //CURSORS
    cursors = this.input.keyboard.createCursorKeys();

    //ENEMY
    balls = this.physics.add.group({
        key: 'ball',
        repeat: 10,
        setXY: {x: 12, y: 0, stepX: 70},
    });

    balls.children.iterate(function (child) {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    bombs = this.physics.add.group();

    //SCORE
    scoreText = this.add.text(300, 16, 'SCORE: 0', {fontSize: '40px', fill: '#FFF', fontWeight: 'bold'});

    //COLLISIONS
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(balls, platforms);
    this.physics.add.collider(bombs, platforms);
    this.physics.add.overlap(player, balls, collectBall, null, this);
    this.physics.add.collider(player, bombs, hitBomb, null, this);
}

function update() {
    if (gameOver) {
        return gameOverText;
    }
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-600);
        jumpAudio.play();
    }
}

function collectBall(player, ball) {
    ball.disableBody(true, true);
    score += 10;
    scoreText.setText('SCORE: ' + score);

    if (balls.countActive(true) === 0) {
        balls.children.iterate(function (child) {
            child.enableBody(true, child.x, 0, true, true);
        });

        let x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        const bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }
}

function hitBomb(player, bomb) {
    this.physics.pause();
    backgroundMusic.pause();
    player.setTint(0xff0000);
    player.anims.play('turn');
    gameOver = true;
    gameOverText = this.add.text(300, 300, 'Game Over', {fontSize: '40px', fill: '#FF5733'});
    restartText = this.add.text(200, 400, 'PRESS F5 TO RESTART', {
        fontSize: '40px',
        fill: '#FFFFFF',
        fontWeight: 'bold'
    });
}