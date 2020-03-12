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

    //goal
    this.goal = this.add.sprite(this.sys.game.config.width - 80, this.sys.game.config.height / 2, 'goal');
    this.goal.setScale(0.7);

    //enemy
    this.enemies = this.add.group({
        key: 'enemy',
        repeat: 5,
        setXY: {
            x: 90,
            y: 100,
            stepX: 80,
            stepY: 20
        }
    });

    Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.4, -0.4);
    console.log(this.enemies.getChildren());

    Phaser.Actions.Call(this.enemies.getChildren(), function (enemy) {
        enemy.flipX = true;

        let direction = Math.random() < 0.5 ? 1 : -1;
        let speed = this.enemyMinSpeed + Math.random() * (this.enemyMaxSpeed - this.enemyMinSpeed);
        enemy.speed = direction * speed;

    }, this);

};

gameScene.update = function() {
    if(this.input.activePointer.isDown) {
      this.player.x += this.playerSpeed;
    }

    let enemies = this.enemies.getChildren();
    let numEnemies = enemies.length;
    let playerRect = this.player.getBounds();

    for(let i = 0; i < numEnemies; i++) {
        //enemy movement
        enemies[i].y += enemies[i].speed;

        //check if we pass min or max Y
        let conditionUp = enemies[i].speed < 0 && enemies[i].y <= this.enemyMinY;
        let conditionDown = enemies[i].speed > 0 && enemies[i].y >= this.enemyMaxY;

        if(conditionUp || conditionDown) {
            enemies[i].speed *= -1;
        }

        //check enemy overlap

        let enemyRect = enemies[i].getBounds();
        if (Phaser.Geom.Intersects.RectangleToTriangle(playerRect, enemyRect)) {
            alert('Game Over');
            this.scene.manager.bootScene(this);
        }
    }


};

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 360,
    scene: gameScene,
};

let game = new Phaser.Game(config);