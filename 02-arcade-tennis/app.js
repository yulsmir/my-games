let canvas;
let canvasContext;
let ballX = 50;
let ballY = 50;
let ballSpeedX = 10;
let ballSpeedY = 4;

let player1Score = 0;
let player2Score = 0;
const winningScore = 10;

let instructionText = true;

let showingWinScreen = false;


let paddle1Y = 250;
let paddle2Y = 250;
const paddleHeight = 150;
const paddleThickness = 15;

function calculateMousePos(evt) {
    let rect = canvas.getBoundingClientRect();
    let root = document.documentElement;
    let mouseX = evt.clientX - rect.left - root.scrollLeft;
    let mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    }
}

function handleMouseClick (evt) {
    if (showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}

window.onload = function () {
    canvas = document.getElementById('game-canvas');
    canvasContext = canvas.getContext('2d');
    let framesPerSecond = 30;
    setInterval(function () {
        moveEverything();
        drawEverything();
    }, 1000 / framesPerSecond);

    canvas.addEventListener('mousedown', handleMouseClick);

    canvas.addEventListener('mousemove',
        function (evt) {
            let mousePos = calculateMousePos(evt);
            paddle1Y = mousePos.y - (paddleHeight / 2);
        });
};

function ballReset() {
    if (player1Score >= winningScore || player2Score >= winningScore) {
        scoreReset();
    }
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function scoreReset() {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = true;
}

function computerMovement() {
    let paddle2YCenter = paddle2Y + (paddleHeight / 2);
    if (paddle2YCenter < ballY - 35) {
        paddle2Y += 6;
    } else if (paddle2YCenter > ballY + 35) {
        paddle2Y -= 6;
    }
}

function moveEverything() {
    computerMovement();

    ballX += +ballSpeedX;
    ballY += +ballSpeedY;

    if (ballX < 0) {
        if (ballY > paddle1Y && ballY < paddle1Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY - (paddle1Y + paddleHeight / 2);
            ballSpeedY = deltaY * 0.35;
        } else {
            player2Score++;
            ballReset();
        }
    }

    if (ballX > canvas.width) {
        if (ballY > paddle2Y && ballY < paddle2Y + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            let deltaY = ballY
                - (paddle2Y + paddleHeight / 2);
            ballSpeedY = deltaY * 0.35;
        } else {
            player1Score++;
            ballReset();
        }
    }
    if (ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
    if (ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
}

function drawNet() {
    for(let i = 0; i < canvas.height; i+=40){
        colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
    }
}

function drawEverything() {
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    if (showingWinScreen) {
        canvasContext.fillStyle = 'white';
        if (player1Score >= winningScore) {
            canvasContext.fillText("Left Player Won!", 350, 200);
        } else if (player2Score >= winningScore) {
            canvasContext.fillText("Right Player Won!", 350, 200);
        }
        canvasContext.fillText("CLICK TO CONTINUE", 260, 300);
        return;
    }
    drawNet();

    colorRect(0, paddle1Y, paddleThickness, paddleHeight, 'white');
    colorRect(canvas.width - paddleThickness, paddle2Y, paddleThickness, paddleHeight, 'white');
    colorCircle(ballX, ballY, 10, 'white');

    canvasContext.fillText(player1Score, 200, 300,);
    canvasContext.fillText(player2Score, canvas.width - 200, 300);
    canvasContext.font = "30px Arial";
}

function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height, drawColor);
}