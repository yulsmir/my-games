// create a new scene
let gameScene = new Phaser.Scene('Game');

// some parameters for our scene
gameScene.init = function () {
    // game stats
    this.stats = {
        health: 100,
        fun: 100
    };
    this.decayRates = {
        health: -5,
        fun: -2,
    }
};

// load asset files for our game
gameScene.preload = function () {

};

// executed once, after assets were loaded
gameScene.create = function () {
    let background = this.add.sprite(0, 0, 'backyard').setOrigin(0, 0).setInteractive();

    // event listener for bg
    background.on('pointerdown', this.placeItem, this);

    this.pet = this.add.sprite(100, 200, 'pet', 0).setInteractive();
    this.pet.depth = 1;

    //make pet draggable
    this.input.setDraggable(this.pet);

    this.anims.create({
        key: 'funnyfaces',
        frames: this.anims.generateFrameNames('pet', {frames: [1, 2, 3]}),
        frameRate: 7,
        yoyo: true,
        repeat: 0
    })

    // follow pointer
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
        gameObject.x = dragX;
        gameObject.y = dragY;
    });

    this.createUi();
    this.createStats();
    this.refreshStats();

    this.timedEventStats = this.time.addEvent({
        delay: 1000,
        repeat: -1,
        callback: function () {
            this.updateStats(this.decayRates);
        },
        callbackScope: this
    });
};

//create UI
gameScene.createUi = function () {
//buttons
    this.appleBtn = this.add.sprite(72, 570, 'apple').setInteractive();
    this.appleBtn.customStats = {health: 20, fun: 0};
    this.appleBtn.on('pointerdown', this.pickItem);

    this.candyBtn = this.add.sprite(144, 570, 'candy').setInteractive();
    this.candyBtn.customStats = {health: -10, fun: 10};
    this.candyBtn.on('pointerdown', this.pickItem);

    this.toyBtn = this.add.sprite(216, 570, 'toy').setInteractive();
    this.toyBtn.customStats = {fun: 20};
    this.toyBtn.on('pointerdown', this.pickItem);

    this.rotateBtn = this.add.sprite(288, 570, 'rotate').setInteractive();
    this.rotateBtn.customStats = {health: 0, fun: 20};
    this.rotateBtn.on('pointerdown', this.rotatePet);

    // array with all buttons
    this.buttons = [this.appleBtn, this.candyBtn, this.toyBtn, this.rotateBtn];
    // ui is not blocked
    this.uiBlocked = false;

    //refresh ui
    this.uiReady();
};

gameScene.rotatePet = function () {
    // ui can't be blocked in order to select an item
    if (this.scene.uiBlocked) return;

    //check if ui is ready
    this.scene.uiReady();

    // block the ui
    this.scene.uiBlocked = true;

    //dim rotate icon
    this.alpha = 0.5;

    let scene = this.scene;

    let rotateTween = this.scene.tweens.add({
        targets: this.scene.pet,
        duration: 600,
        angle: 360,
        pause: false,
        callbackScope: this,
        onComplete: function (tween, sprites) {
            this.scene.updateStats(this.customStats);
            this.scene.stats.fun += this.customStats.fun;
            this.scene.uiReady();
            // this.scene.refreshStats();
        }
    });
    // setTimeout(function () {
    //     //    set scene back to ready
    //     scene.uiReady();
    // }, 2000);


    console.log('we are rotating the pet!')
};

gameScene.pickItem = function () {
    // ui can't be blocked in order to select an item
    if (this.scene.uiBlocked) return;

    //check if ui is ready
    this.scene.uiReady();

    // select item
    this.scene.selectedItem = this;

    // change transparency
    this.alpha = 0.5;

    console.log('we are picking ' + this.texture.key);
};

// set ui "ready"
gameScene.uiReady = function () {
    //nothing is being selected
    this.selectedItem = null;

    // set all buttons to alpha 1
    for (let i = 0; i < this.buttons.length; i++) {
        this.buttons[i].alpha = 1;
    }

    //make scene unblocked
    this.uiBlocked = false;
};

//place new item
gameScene.placeItem = function (pointer, localX, localY) {
    // check if item was selected
    if (!this.selectedItem) return;

    //ui must be unbocked
    if (this.uiBlocked) return;

    //create new item
    let newItem = this.add.sprite(localX, localY, this.selectedItem.texture.key);

    console.log(this.stats);

    //block UI
    this.uiBlocked = true;

    //pet movement tween
    let petTween = this.tweens.add({
        targets: this.pet,
        duration: 500,
        x: newItem.x,
        y: newItem.y,
        paused: false,
        callbackScope: this,
        onComplete: function (tween, sprites) {
            newItem.destroy();

            this.pet.on('animationcomplete', function () {
                this.pet.setFrame(0);
                this.uiReady();
                // this.refreshStats();
            }, this);
            this.pet.play('funnyfaces');

            this.updateStats(this.selectedItem.customStats);
        }
    });
};

gameScene.createStats = function () {
    this.healthText = this.add.text(20, 20, 'Health: ', {
        font: '24px Arial',
        fill: '#ffffff'
    });

    this.funText = this.add.text(250, 20, 'Fun: ', {
        font: '24px Arial',
        fill: '#ffffff'
    });

};

gameScene.refreshStats = function () {
    this.healthText.setText('Health: ' + this.stats.health);
    this.funText.setText('Fun: ' + this.stats.fun);
};

gameScene.updateStats = function (statDiff) {
    //pet stats
    // this.stats.health += this.selectedItem.customStats.health;
    // this.stats.fun += this.selectedItem.customStats.fun;

    let isGameOver = false;

    for (stat in statDiff) {
        if (statDiff.hasOwnProperty(stat)) {
            this.stats[stat] += statDiff[stat];
            if (this.stats[stat] < 0) {
                isGameOver = true;
                this.stats[stat] = 0;
            }
        }
    }
    this.refreshStats();
    if (isGameOver) this.gameOver();
};

gameScene.gameOver = function () {
    console.log('game over');
    this.uiBlocked = true;
    this.pet.setFrame(4);

    this.time.addEvent({
        delay: 2000,
        repeat: 0,
        callback: function () {
            this.scene.start('Home');
        },
        callbackScope: this
    });
};