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

let generatedGameCode = null; // Store the generated game code
let joinedGame = false; // Flag to track if the player has joined a game

// Function to generate a random game code
function generateGameCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
    }
    return code;
}

// Handle user interactions
const createGameButton = document.getElementById('createGameButton');
const joinGameButton = document.getElementById('joinGameButton');
const gameCodeInput = document.getElementById('gameCodeInput');
const startGameButton = document.getElementById('startGameButton');
const gameCodeDisplay = document.getElementById('gameCodeDisplay');

createGameButton.addEventListener('click', createGame);
joinGameButton.addEventListener('click', showGameCodeInput);
startGameButton.addEventListener('click', joinGame);

function createGame() {
    // Generate a random game code and display it
    generatedGameCode = generateGameCode();
    gameCodeDisplay.innerText = `Share this code with your friend: ${generatedGameCode}`;
    gameCodeDisplay.style.display = 'block';
    startGameButton.style.display = 'block';
    createGameButton.style.display = 'none';
    joinGameButton.style.display = 'none';
}

function showGameCodeInput() {
    gameCodeInput.style.display = 'block';
    startGameButton.style.display = 'block';
    createGameButton.style.display = 'none';
    joinGameButton.style.display = 'none';
}

// Handle game joining
function joinGame() {
    if (joinedGame) return; // Prevent joining multiple times
    joinedGame = true;

    if (gameCodeInput.value === generatedGameCode) {
        // Emit the join game event with the game code
        socket.emit('joinGame', generatedGameCode);
    } else {
        alert('Invalid game code. Please enter the correct code.');
    }
}

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
window.addEventListener('load', createGame);

// Start the game loop
update();
