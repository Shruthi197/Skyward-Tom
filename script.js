const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = 320;
canvas.height = 480;

// Game variables
let tom = { 
    x: 50, 
    y: 150, 
    width: 20, 
    height: 20, 
    gravity: 0.4,    // Slightly reduce gravity for a slower descent
    lift: -10,       // Lower lift value to reduce the jump height
    velocity: 0 
};


let pipes = [];
let pipeWidth = 40;
let pipeGap = 100;
let frameCount = 0;
let isGameOver = false;
let score = 0;
let scored = false;  // To track whether the score has been counted for a pipe

// Load images
const tomImg = new Image();
tomImg.src = 'tom.png'; // Cute character image

const bgImg = new Image();
bgImg.src = 'background.jpg'; // Aesthetic background image

const pillarImg = new Image();
pillarImg.src = 'pillar.png'; // Beautiful pillar image

// Handle key press or screen tap
document.addEventListener("keydown", () => {
    if (!isGameOver) {
        tom.velocity = tom.lift;
    }
});

canvas.addEventListener("click", () => {
    if (!isGameOver) {
        tom.velocity = tom.lift;
    }
});

function drawTom() {
    ctx.drawImage(tomImg, tom.x, tom.y, tom.width, tom.height);
}

function drawBackground() {
    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
}

function createPipes() {
    if (frameCount % 90 === 0) {
        let pipeHeight = Math.floor(Math.random() * (canvas.height - pipeGap));
        pipes.push({ x: canvas.width, y: pipeHeight, passed: false });
    }
}

function drawPipes() {
    pipes.forEach(pipe => {
        // Top pipe
        ctx.drawImage(pillarImg, pipe.x, 0, pipeWidth, pipe.y);

        // Bottom pipe
        ctx.drawImage(pillarImg, pipe.x, pipe.y + pipeGap, pipeWidth, canvas.height - (pipe.y + pipeGap));

        // Move pipe
        pipe.x -= 2;

        // Collision detection
        if (pipe.x < tom.x + tom.width &&
            pipe.x + pipeWidth > tom.x &&
            (tom.y < pipe.y || tom.y + tom.height > pipe.y + pipeGap)) {
            isGameOver = true;
        }

        // Scoring logic: If Tom passes through the pipe
        if (!pipe.passed && pipe.x + pipeWidth < tom.x) {
            score++;
            pipe.passed = true; // Mark the pipe as passed to avoid multiple scoring
        }

        // Remove pipes that have gone off screen
        if (pipe.x + pipeWidth < 0) {
            pipes.shift();
        }
    });
}

function updateTom() {
    tom.velocity += tom.gravity;
    tom.y += tom.velocity;

    if (tom.y + tom.height > canvas.height || tom.y < 0) {
        isGameOver = true;
    }
}

function drawScore() {
    ctx.font = "24px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("Score: " + score, 10, 30);
}

function gameOver() {
    ctx.font = "30px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Game Over", canvas.width / 4, canvas.height / 2);
    ctx.fillText("Final Score: " + score, canvas.width / 5, canvas.height / 2 + 40);
}

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawBackground();
    drawTom();
    createPipes();
    drawPipes();
    updateTom();
    drawScore();  // Display score on the screen

    frameCount++;

    if (!isGameOver) {
        requestAnimationFrame(gameLoop);
    } else {
        gameOver();
    }
}


tomImg.onload = gameLoop;
