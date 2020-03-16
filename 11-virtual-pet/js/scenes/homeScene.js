let homeScene = new Phaser.Scene('Home');

homeScene.create = function () {
    let background = this.add.sprite(0, 0, 'backyard').setOrigin(0, 0).setInteractive();

    let text = this.add.text(this.sys.game.config.width / 2, this.sys.game.config.height / 2, 'VIRTUAL PET', {
        font: '40px Arial',
        fill: '#ffffff'
    });
    text.setOrigin(0.5);

    background.on('pointerdown', function () {
        this.scene.start('Game');
    }, this);
};