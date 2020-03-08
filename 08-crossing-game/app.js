'use strict';
let canvas = document.getElementById('myCanvas');
let ctx = canvas.getContext('2d');

let screenWidth = 1000;
let screenHeight = 500;
let width = 80;
let isGameLive = true;
let isRightKeyPressed = false;
let isLeftKeyPressed = false;

class GameCharacter {
    constructor(x, y, width, height, color, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
        this.maxSpeed = 4
    }

    moveVertically() {
        if (this.y > screenHeight - 100) {
            this.speed = -this.speed;
        }
        if (this.y <= 0) {
            this.speed = -this.speed;
        }
        this.y += this.speed;
    }

    moveHorizontally() {
        this.x += this.speed;
    }
}


let rectangle = new GameCharacter(50, 50, 50, 50, "rgb(0, 0, 255)", 2);

let enemies = [
    new GameCharacter(200, 22, 51, 65, 'rgb(255, 255, 255)', 2),
    new GameCharacter(450, screenHeight - 100, 51, 65, 'rgb(255, 255, 255)', 3),
    new GameCharacter(700, 50, 51, 65, 'rgb(255, 255, 255)', 4),
];

let goal = new GameCharacter(screenWidth - 75, 200, 80, 120, 'rgb(250, 100, 0)');

let player = new GameCharacter(0, 225, 52, 83, 'rgb(255, 255, 0)', 0);

let sprites = {};

let loadSprites = function () {
    sprites.player = new Image();
    sprites.player.src = 'images/hero.png';

    sprites.background = new Image();
    sprites.background.src = 'images/background.png';

    sprites.enemy = new Image();
    sprites.enemy.src = 'images/enemy.png';

    sprites.goal = new Image();
    sprites.goal.src = 'images/goal.png';
};

document.onkeydown = function (event) {
    // let keyPressed = event.keyCode;
    // if (keyPressed === 39) {
    //     player.speed = player.maxSpeed;
    // }
    // if (keyPressed === 37) {
    //     player.speed = -player.maxSpeed;
    // }
    let keyPressed = event.keyCode;
    if (keyPressed === 39) {
        isRightKeyPressed = true;
        player.speed = player.maxSpeed;
    }
    if (keyPressed === 37) {
        isLeftKeyPressed = true;
        player.speed = -player.maxSpeed;
    }
};
document.onkeyup = function (event) {
    // let keyPressed = event.keyCode;
    // if (keyPressed === 39 || keyPressed === 37) {
    //     player.speed = 0;
    // }
    let keyUp = event.keyCode;
    if (keyUp === 39) {
        isRightKeyPressed = false;
        if (isLeftKeyPressed) {
            player.speed = -player.maxSpeed;
        } else {
            player.speed = 0;
        }
    } else if (keyUp === 37) {
        isLeftKeyPressed = false;
        if (isRightKeyPressed) {
            player.speed = player.maxSpeed;
        } else {
            player.speed = 0;
        }
    }
};

let checkCollisions = function (rect1, rect2) {
    let xOverlap = Math.abs(rect1.x - rect2.x) <= Math.max(rect1.width, rect2.width);
    let yOverlap = Math.abs(rect1.y - rect2.y) <= Math.max(rect1.height, rect2.height);
    return xOverlap && yOverlap;
};

let draw = function () {
    ctx.clearRect(0, 0, screenWidth, screenHeight);

    ctx.drawImage(sprites.background, 0, 0);
    ctx.drawImage(sprites.player, player.x, player.y);
    ctx.drawImage(sprites.goal, goal.x, goal.y);

    enemies.forEach(function (element) {
        ctx.drawImage(sprites.enemy, element.x, element.y);
    });

    // enemies.forEach(function (element) {
    //     ctx.fillStyle = element.color;
    //     ctx.fillRect(element.x, element.y, element.width, element.height);
    // });
    // ctx.fillStyle = player.color;
    // ctx.fillStyle = rectangle.color;
    // ctx.fillRect(player.x, player.y, player.width, player.height);
    // ctx.fillStyle = goal.color;
    // ctx.fillRect(goal.x, goal.y, goal.width, goal.height);

};

let update = function () {
    if (checkCollisions(player, goal)) {
        endGameLogic('You win!');
    }
    enemies.forEach(function (element) {
        if (checkCollisions(player, element)) {
            endGameLogic('Game Over');
        }
        element.moveVertically();
    });
    player.moveHorizontally();
};

let endGameLogic = function (text) {
    alert(text);
    window.location = '';
    isGameLive = false;
};

let step = function () {
    update();
    draw();
    if (isGameLive) {
        window.requestAnimationFrame(step);
    }
};
loadSprites();
step();
