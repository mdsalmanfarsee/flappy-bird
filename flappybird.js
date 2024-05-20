

//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;

//bird
let birdWidth = 32; //width/height ratio = 8/10
let birdHeight = 40;
let birdX = boardWidth / 8;
let birdY = boardHeight / 2;
let birdImg;


let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2; //pipe moving left speed
let velocityY = 0; // bird jump speed
let gravity = 0.4;
let gameOver = false;
let score = 0;

//music
// background music
let bgMusic = new Audio('./music2.mp3');
bgMusic.loop = true;



//memesound
let meme = new Audio('./memesound.mp3');
meme.loop = true;


window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board
    let btn = document.querySelector('.btn'); //button


    btn.addEventListener('click', () => {

        //hide the button after clicking
        btn.style.display = "none";

        //draw flappy bird

        //load images
        birdImg = new Image();
        birdImg.src = './salman.png';
        birdImg.onload = function () {

            context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
        }

        topPipeImg = new Image();
        topPipeImg.src = './toppipe.png';
        bottomPipeImg = new Image();
        bottomPipeImg.src = './bottompipe.png';


        // Play background music once everything is loaded
        bgMusic.addEventListener('canplaythrough', () => {
            // bgMusic.currentTime = 30;
            bgMusic.play().catch(error => {
                console.error("Error playing music:", error);
            });
        });
        bgMusic.load();   // Load the music to ensure it can play
        // sadMusic.load();
        meme.load();



        requestAnimationFrame(update);

        setInterval(placePipes, 1500); //every 1.5 second

        document.addEventListener("keydown", moveBird);
        board.addEventListener("touchstart", moveBird);
    });




}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        bgMusic.pause();
        // sadMusic.currentTime = 0;
        // sadMusic.play();
        meme.play();
        return;
    }
    // sadMusic.pause();
    meme.pause();
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to the bird.y , limit the bird.y to top of the canves
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }


    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; // two pipes are passing so 2*0.5 =1
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }

    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x + pipeArray[0].width < 0) {
        pipeArray.shift(); // remove 1st pipe
    }


    //score
    context.fillStyle = "red";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);
    if (gameOver) {
        context.fillText("GAME OVER!", 5, 90);
        context.fillText("Tap to Retry", boardWidth / 5, boardHeight / 2);
    }
}

function placePipes() {
    if (gameOver) {
        return;
    }
    let randomPipeY = pipeY - pipeHeight / 4 - Math.random() * (pipeHeight / 2);
    let openingSpace = board.height / 4;
    let topPipe = {
        img: topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }

    pipeArray.push(topPipe);

    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX" || e.type === "touchstart") {
        //jump
        velocityY = -6;

        //reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;
            bgMusic.currentTime = 0;
            bgMusic.play();

        }
    }


}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;
}