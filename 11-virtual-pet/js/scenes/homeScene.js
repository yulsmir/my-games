let homeScene = new Phaser.Scene('Home');

homeScene.create = function () {
    let background = this.add.sprite(0, 0, 'backyard').setOrigin(0, 0).setInteractive();

    let gameW = this.sys.game.config.width;
    let gameH = this.sys.game.config.height;

    let text = this.add.text(gameW / 2, gameH / 2, 'VIRTUAL PET', {
        font: '40px Arial',
        fill: '#ffffff'
    });
    text.setOrigin(0.5);
    text.depth = 1;

    let textBackground = this.add.graphics();
    textBackground.fillStyle(0x000000, 0.7);
    textBackground.fillRect(gameW/2 - text.width/2 - 10, gameH/2 - text.height/2 - 10, text.width + 20, text.height + 20);
    background.on('pointerdown', function () {
        this.scene.start('Game');
    }, this);
};