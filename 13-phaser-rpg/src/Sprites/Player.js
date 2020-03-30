import 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'characters', 325);
        this.scene = scene;
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
        this.setScale(4);
    }
    update () {
        if (this.cursors.up.isDown) {
            this.player.y -= 5;
        }
        if (this.cursors.down.isDown) {
            this.player.y += 5;
        }
        if (this.cursors.left.isDown) {
            this.player.x -= 5;
        }
        if (this.cursors.right.isDown) {
            this.player.x += 5;
        }
    };
};