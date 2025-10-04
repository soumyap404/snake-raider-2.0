//constants
let inputDir = { x: 0, y: 0 };
const foodsound = new Audio('food.mp3');
const gameoversound = new Audio('gameOver.mp3');
const movesound = new Audio('move.mp3');
const musicsound = new Audio('bgm.mp3');

let speed = 4;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: 13, y: 15 }];
let food = { x: 6, y: 7 };
let isGameOver = false;

//game functions
function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) return;
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    for (let i = 1; i < snakeArr.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
    }
    if (snake[0].x >= 18 || snake[0].x <= 0 || snake[0].y >= 18 || snake[0].y <= 0) return true;
    return false;
}

function gameEngine() {
    if (isCollide(snakeArr)) {
        musicsound.pause(); musicsound.currentTime = 0;
        gameoversound.play();
        inputDir = { x: 0, y: 0 };
        isGameOver = true;
        alert("Game Over .. press any key to play again!!");
        snakeArr = [{ x: 13, y: 15 }];
        score = 0;
        scoreBox.innerHTML = "score : " + score;
        return;
    }

    // if eaten the food
    if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
        foodsound.currentTime = 0;
        foodsound.play();
        score += 1;
        scoreBox.innerHTML = "score : " + score;
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2, b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    // moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }
    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // render snake and food
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement("div");
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) snakeElement.classList.add("head");
        else snakeElement.classList.add("snake");
        board.appendChild(snakeElement);
    });

    let foodElement = document.createElement("div");
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add("food");
    board.appendChild(foodElement);
}

// main logic
window.requestAnimationFrame(main);

// keyboard control
window.addEventListener("keydown", (e) => {
    if (isGameOver) { musicsound.play(); isGameOver = false; }
    inputDir = { x: 0, y: 0 };
    movesound.currentTime = 0; movesound.play(); musicsound.play();
    switch (e.key) {
        case "ArrowUp": inputDir = { x: 0, y: -1 }; break;
        case "ArrowDown": inputDir = { x: 0, y: 1 }; break;
        case "ArrowLeft": inputDir = { x: -1, y: 0 }; break;
        case "ArrowRight": inputDir = { x: 1, y: 0 }; break;
    }
});

// touch swipe support
let touchStartX = 0, touchStartY = 0;
window.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY; }, {passive: true});
window.addEventListener("touchend", e => {
    let dx = e.changedTouches[0].clientX - touchStartX;
    let dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy)) dx > 0 ? inputDir = { x: 1, y: 0 } : inputDir = { x: -1, y: 0 };
    else dy > 0 ? inputDir = { x: 0, y: 1 } : inputDir = { x: 0, y: -1 };
    movesound.currentTime = 0; movesound.play();
    if (!isGameOver) musicsound.play();
}, {passive: true});
