let gameScene = new Phaser.Scene('Game');

gameScene.preload = function() {
    this.load.image('background', 'assets/background.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/dragon.png');
};

gameScene.create = function() {
    let bg = this.add.sprite(0, 0, 'background');
    // bg.setOrigin(0, 0);
    bg.setPosition(640/2, 360/2);
    let player = this.add.sprite(50, 180, 'player');
    player.setScale(0.7);

    let enemy1 = this.add.sprite(250, 180, 'enemy');
    let enemy2 = this.add.sprite(450, 180, 'enemy');
    enemy1.setScale(0.7);
    enemy1.flipX = true;
    enemy2.flipY = true;
};

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: gameScene,
};

let game = new Phaser.Game(config);