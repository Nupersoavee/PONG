const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const socket = io();

// Define the game variables
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

let player1Y = canvas.height / 2 - paddleHeight / 2;
let player2Y = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

// Handle user input
canvas.addEventListener('mousemove', (event) => {
    const mouseY = event.clientY - canvas.getBoundingClientRect().top - paddleHeight / 2;
    player1Y = mouseY;
    socket.emit('paddleMove', player1Y); // Send the paddle position to the server
});

// Receive updates from the server
socket.on('gameState', (gameState) => {
    player1Y = gameState.player1Y;
    player2Y = gameState.player2Y;
    ballX = gameState.ballX;
    ballY = gameState.ballY;
});

// Update game state and send it to the server
function update() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top and bottom walls
    if (ballY < 0 || ballY > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Ball collision with paddles
    if (
        ballX < paddleWidth &&
        ballY > player1Y &&
        ballY < player1Y + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
    }
    if (
        ballX > canvas.width - paddleWidth &&
        ballY > player2Y &&
        ballY < player2Y + paddleHeight
    ) {
        ballSpeedX = -ballSpeedX;
    }

    // Ball out of bounds
    if (ballX < 0 || ballX > canvas.width) {
        // Reset ball position
        ballX = canvas.width / 2;
        ballY = canvas.height / 2;
        ballSpeedX = -ballSpeedX;
    }

    // Send the updated game state to the server
    socket.emit('gameState', {
        player1Y,
        player2Y,
        ballX,
        ballY,
    });

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(0, player1Y, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, player2Y, paddleWidth, paddleHeight);

    // Draw the ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fill();

    requestAnimationFrame(update);
}

update();
