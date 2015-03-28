// Copyright (C) 2009 John H. Palevich. All Rights Reserved.
// Modified by Austin Meyers (AK5A) for PulsedLight Inc. 03/28/15. Happy Arduino Day 2015!

var livesPerGame = 3;

var lives = 0;

var highScore = 0;
var score = 0;

var fieldW = 840;
var fieldH = 680;

var brickStartY = 40;
var brickRows = 6;
var brickColor = [
    // Rainbow styling
    "hsl(  0, 100%, 50%)",
    "hsl( 60, 100%, 50%)",
    "hsl(120, 100%, 50%)",
    "hsl(180, 100%, 50%)",
    "hsl(240, 100%, 50%)",
    "hsl(300, 100%, 50%)"
];

var brickW = 40;
var brickH = 25;

var ballSpeed = 8;

var paddleX = 0;
var paddleY = 580;
var paddleW = 160;
var paddleH = 25;

var ballStartX = 10;
var ballStartY = brickStartY + brickRows * brickH;

var ballX = ballStartX;
var ballY = ballStartY;
var ballH = 16;
var ballW = 16;
var ballDX = ballSpeed;
var ballDY = ballSpeed;
var ballNerfed = false;

var black = "#000000";
var white = "#ffffff";

var canvas;


var brickColumns = fieldW / brickW;

var bricks = [];
var brickCount = 0;

function setupBricks() {
    var x, y;
    for (y = 0; y < brickRows; y++) {
        for (x = 0; x < brickColumns; x++) {
            bricks[x + y * brickColumns] = true;
        }
    }
    brickCount = brickRows * brickColumns;
}

function drawPicture(){
    var context = canvas.getContext('2d');
    
    context.fillStyle = black;
    
    context.fillRect(0, 0, fieldW, fieldH);
    
    var x, y;
    for (y = 0; y < brickRows; y++) {
        context.fillStyle = brickColor[y];
        for (x = 0; x < brickColumns; x++) {
            if (bricks[x + y * brickColumns] ) {
                context.fillRect(brickW * x, brickStartY + brickH * y,
                                 brickW, brickH);
            }
        }
    }

    if (lives > 0) {
        context.fillStyle = white;
        context.fillRect(paddleX, paddleY, paddleW,  paddleH);
        context.fillRect(ballX, ballY, ballW, ballH);
    }else{
	    document.getElementById("start_game").style.display = "block";	    
    }
    
}

function updateScore() {
    if (highScore < score) {
        highScore = score;
    }
    document.getElementById("highscore").innerHTML = '' + highScore;
    document.getElementById("score").innerHTML = '' + score;
    document.getElementById("lives").innerHTML = '' + lives;
}

function overlap(ax, aw, bx, bw) {
    return ! ((ax + aw) <= bx || ax >= (bx + bw));
}

function overlap2D(ax, ay, aw, ah, bx, by, bw, bh) {
    return overlap(ax, aw, bx, bw) &&
        overlap(ay, ah, by, bh);
}

function serveBall() {
    ballX = ballStartX;
    ballY = ballStartY;
    ballDY = ballSpeed;
    ballDX = ballSpeed;
    ballNerfed = true;
}

function moveBall() {
    ballX += ballDX;
    ballY += ballDY;
    
    var rightSide = fieldW - ballW;
    
    if (ballX > rightSide) {
        ballX = 2 * rightSide - ballX;
        ballDX = - ballDX;
    }
    
    if (ballX < 0) {
        ballX = -ballX;
        ballDX = -ballDX;
    }
    
    if (ballY < 0) {
        ballY = -ballY;
        ballDY = -ballDY;
        ballNerfed = false;
    }
    
    if (ballY > fieldH) {
        lives = lives - 1;
        updateScore();
        if (lives > 0) {
            serveBall();
        }
    }
    
    var ballBottom = ballY + ballH;
    if (overlap2D(ballX, ballY, ballW, ballH,
                  paddleX, paddleY, paddleW, paddleH)) {
        ballNerfed = false;
        ballY = 2 * paddleY - ballBottom - ballH;
        ballDY = -ballDY;
        ballDX = ((ballX + ballW * 0.5) - (paddleX + paddleW * 0.5)) * 8 / paddleW;
    }
    
    // Check for hitting a brick.
    if (! ballNerfed) {
        var bx = Math.floor((ballX + ballW * 0.5)/ brickW);
        var by = Math.floor((ballY + ballH * 0.5 - brickStartY) / brickH);
        if (by >= 0 && by < brickRows) {
            var index = bx + by * brickColumns;
            if (bricks[index]) {
                ballNerfed = true;
                bricks[index] = false;
                brickCount = brickCount - 1;
                score += 10 * (brickRows - by);
                updateScore();
                if (brickCount <= 0) {
                    setupBricks();
                }
                ballDY = -ballDY;
                if (by === 0) {
                    if (ballDY < 0) {
                        ballDY = -2 * ballSpeed;
                    } else {
                        ballDY = 2 * ballSpeed;
                    }
                }
            }
        }
    }
}

function startGame() {
    document.getElementById("start_game").style.display = "none";
    lives = livesPerGame;
    score = 0;
    updateScore();
    setupBricks();
    serveBall();
}

function dokeydown() {
    if (lives <= 0) {
        startGame();
    }
}

/*
function domousemove(event) {
    var x=event.clientX;
    paddleX = x - 10; // Adjust for the left margin on the Canvas tag.
    paddleX -= (paddleW / 2);
    var leftEdge = 0;
    var rightEdge = fieldW - paddleW;
    if (paddleX < leftEdge) {
        paddleX = leftEdge;
    }
    if (paddleX > rightEdge) {
        paddleX = rightEdge;
    }
}
*/


function lidarlitemove(event) {
    var x=event;
    paddleX = x - 10; // Adjust for the left margin on the Canvas tag.
    paddleX -= (paddleW / 2);
    var leftEdge = 0;
    var rightEdge = fieldW - paddleW;
    if (paddleX < leftEdge) {
        paddleX = leftEdge;
    }
    if (paddleX > rightEdge) {
        paddleX = rightEdge;
    }
}

function gameStep() {
    if (lives > 0) {
        moveBall();
    }
    drawPicture();
}

function setupGlobals() {
    canvas = document.getElementById('gameCanvas');
    lives = 0;
    score = 0;
}

function game() {
    setupGlobals();
    setupBricks();
    lives = 0;
    setInterval(gameStep, 15);
}


document.onkeydown = function (evt) {
  var keyCode = evt ? (evt.which ? evt.which : evt.keyCode) : event.keyCode;
  if (keyCode == 13) {
    if (lives <= 0) {
        startGame();
    }
  }else {
    return true;
  }
};

/*
document.onmousemove = domousemove;
document.onmousedown = domousedown;
*/
