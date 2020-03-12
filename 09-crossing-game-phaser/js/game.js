let gameScene = new Phaser.Scene('Game');

let player;
let enemy;

gameScene.init = function() {
    this.playerSpeed = 3;
    this.enemyMinSpeed = 2;
    this.enemyMaxSpeed = 5;
    this.enemyMinY = 80;
    this.enemyMaxY = 280;
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
    this.enemy = this.add.sprite(120, this.sys.game.config.height / 2, 'enemy');
    this.enemy.flipX = true;
    this.enemy.setScale(0.6);

    //enemy speed
    let direction = Math.random() < 0.5 ? 1 : -1;
    let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
    this.enemy.speed = direction * speed;
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

    this.enemy.y += this.enemy.speed;

    let conditionUp = this.enemy.speed < 0 && this.enemy.y <= this.enemyMinY;
    let conditionDown = this.enemy.speed > 0 && this.enemy.y >= this.enemyMaxY;
    if(conditionUp || conditionDown) {
        this.enemy.speed *= -1;
    }
};

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: gameScene,
};

let game = new Phaser.Game(config);