import 'phaser';
import Player from "../Sprites/Player";

export default class GameScene extends Phaser.Scene {
  constructor (key) {
    super(key);
  }

  preload () {
  }

  create () {
    this.events.on('resize', this.resize, this);
    this.createMap();
    this.createPlayer();
    this.cameras.main.startFollow(this.player);
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  update () {

  };
  createPlayer () {
    this.map.findObject('Player', (obj) => {
      if (obj.type === 'StartingPosition') {
        this.player = new Player(this, obj.x, obj.y);
      }
    });
    this.player.speed = 5;
  }

  resize (width, height) {
    if  (width === undefined) {
      width  = this.sys.game.config.width;
    }
    if  (height === undefined) {

      height  = this.sys.game.config.height;
    }
    this.cameras.resize(width,  height);
  }
  createMap () {
    this.map = this.make.tilemap({ key: 'level1' });
    this.tiles = this.map.addTilesetImage('RPGpack_sheet');
    this.backgroundLayer = this.map.createStaticLayer('Background', this.tiles, 0, 0);
    this.blockedLayer = this.map.createStaticLayer('Blocked', this.tiles, 0, 0);
  }
};
