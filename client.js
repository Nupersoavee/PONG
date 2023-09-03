const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const socket = io();

// Game variables
const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

let player1Y = canvas.height / 2 - paddleHeight / 2;
let player2Y = canvas.height / 2 - paddleHeight / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

let gameCode = null; // Store the game code
let joinedGame = false; // Flag to track if the player has joined a game

// Function to join a game with a code
function joinGame() {
    gameCode = prompt('Enter the game code:');
    if (gameCode) {
        socket.emit('joinGame', gameCode);
        joinedGame = true;
    }
}

// Handle user input
canvas.addEventListener('mousemove', (event) => {
    if (joinedGame) {
        const mouseY = event.clientY - canvas.getBoundingClientRect().top - paddleHeight / 2;
        player1Y = mouseY;
        socket.emit('paddleMove', player1Y);
    }
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
    if (joinedGame) {
        // ... (same game update logic as before)

        socket.emit('gameState', {
            player1Y,
            player2Y,
            ballX,
            ballY,
        });
    }

    // ... (same rendering logic as before)

    requestAnimationFrame(update);
}

// Join a game when the page loads
window.addEventListener('load', joinGame);

// Start the game loop
update();
