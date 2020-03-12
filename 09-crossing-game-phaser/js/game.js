let gameScene = new Phaser.Scene('Game');

let player;
let enemy;

gameScene.init = function() {
    this.playerSpeed = 3;
};

gameScene.preload = function() {
    this.load.image('background', 'assets/background.png');
    this.load.image('player', 'assets/player.png');
    this.load.image('enemy', 'assets/dragon.png');
    this.load.image('goal', 'assets/treasure.png');
};

gameScene.create = function() {
    let bg = this.add.sprite(0, 0, 'background');
    // bg.setOrigin(0, 0);
    bg.setPosition(640/2, 360/2);
    this.player = this.add.sprite(40, this.sys.game.config.height / 2, 'player');
    this.player.setScale(0.5);

    this.goal = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'goal');
    this.goal.setScale(0.7);
    // this.enemy1 = this.add.sprite(250, 180, 'enemy');
    // this.enemy1.setScale(0.5);
    // enemy1.flipX = true;
    // enemy2.flipY = true;
    // enemy1.angle = 45;
    // enemy1.setAngle(45);
    // this.enemy1.rotation = Math.PI / 4;
    // this.enemy1.setRotation(Math.PI / 4);
};

gameScene.update = function() {
    // this.enemy1.x += 0.1;
    // this.enemy1.rotation += 0.1;
    // this.enemy1.angle += 1;
    //
    // if (this.player.scaleX < 2) {
    //     this.player.scaleX += 0.01;
    //     this.player.scaleY += 0.01;
    // }
    if(this.input.activePointer.isDown) {
      this.player.x += this.playerSpeed;
    }

    let playerRect = this.player.getBounds();
    let treasureRect = this.goal.getBounds();
    if (Phaser.Geom.Intersects.RectangleToTriangle(playerRect, treasureRect)) {
        alert('You won!');
        this.scene.manager.bootScene(this);
    }



};

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: gameScene,
};

let game = new Phaser.Game(config);