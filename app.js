const startBtn = document.getElementById('start-button');
const messageDiv = document.getElementById('message');
const levelDiv = document.getElementById('level');
const scoreDiv = document.getElementById('score');
const livesDiv = document.getElementById('lives');
const buttons = document.querySelectorAll('.color-btn');
const comboDiv = document.getElementById("combo");
const highScoreDiv = document.getElementById("high-score");
const themeSelector = document.getElementById("theme");

let gameSequence = [];
let userSequence = [];
let level = 1;
let score = 0;
let lives = 3;
let userTurn = false;
let combo = 0;

const colors = ['red', 'green', 'blue', 'yellow'];

//START GAME
themeSelector.addEventListener("change", function() {
    document.body.classList.remove("cyberpunk", "midnight", "light");
    document.body.classList.add(this.value);
} );
startBtn.addEventListener("click", function(){
    console.log("Start button clicked");

    gameSequence = [];
    userSequence = [];
    level = 1;
    score = 0;
    levelDiv.textContent = level;
    scoreDiv.textContent = score;
    comboDiv.textContent = combo;

    const hearts = livesDiv.querySelectorAll(".heart");
    hearts.forEach(function (heart , index) {
        heart.classList.remove("lost");
    });
    
    startBtn.disabled = true;
    messageDiv.textContent = "Watch the sequence carefully!";

    nextRound();
});

//NEXT ROUND
function nextRound() {
    userSequence = [];
    userTurn = false;
    
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    gameSequence.push(randomColor);
    levelDiv.textContent = level;
    showSequence();
}

//SHOW SEQUENCE
async function showSequence() {
   for (let color of gameSequence) {
        const button = document.querySelector(`[data-color="${color}"]`);
        button.classList.add("active");
        await new Promise(resolve => setTimeout(resolve, 600));
        button.classList.remove("active");
        await new Promise(resolve => setTimeout(resolve, 300));
        if(lives <=0) {
            userTurn = false;
            return;
        }
    } 
    userTurn = true;
    messageDiv.textContent = "Your turn! Repeat the sequence.";
    }

//USER BUTTON CLICKS
    buttons.forEach( function(button) {
        button.addEventListener("click",function (){
            if (!userTurn) return;
            const clickedColor = button.dataset.color;
            userSequence.push(clickedColor);
            button.classList.add("active");
            setTimeout(function(){
                 button.classList.remove("active"); }, 200);
            checkAnswer();
        });
    });

//CHECK ANSWER
    function checkAnswer() {
        const currentIndex = userSequence.length - 1;

//WRONG ANSWER        
        if (userSequence[currentIndex] !== gameSequence[currentIndex]) {
            lives--;
            combo = 0; // Reset combo on wrong answer
            comboDiv.textContent =combo;
            //HEARTS UPDATE
            const hearts = livesDiv.querySelectorAll(".heart");
            hearts.forEach(function (heart, index) {
                if (index >= lives) {
                    heart.classList.add("lost");
                }
            });

            //GAME OVER IF NO LIVES LEFT
            if (lives <= 0) {
                userTurn = false;
                gameOver();
                return;
            }   
            messageDiv.textContent = "Wrong sequence! Game over.";
            userSequence = [];
            setTimeout(function(){
                if (lives > 0) {
                    showSequence();
                }
            }, 1000);
            return;
        }

//COMPELETE SEQUENCE CORRECTLY        
        if (userSequence.length === gameSequence.length) {
            combo++;
            const comboBonus = combo * 10; // Each combo gives 10 extra points
            score += 10 + comboBonus; // Base score of 10 plus combo bonus
            scoreDiv.textContent = score;
            comboDiv.textContent = combo;
            level++;
            userTurn = false;
            messageDiv.textContent = "Correct! Get ready for the next round.";
            setTimeout(function(){
                 nextRound();
                 }, 1000);
        }
    }

//GAME OVER
    function gameOver() {
        messageDiv.textContent = "Game over! Your final score is: " + score;
        startBtn.disabled = false;
        startBtn.textContent = "PLAY AGAIN";
        const oldHighScore =localStorage.getItem("highScore") || 0;

        if(score> oldHighScore){
            localStorage.setItem("highScore", score);
            highScoreDiv.textContent = score;
            messageDiv.textContent += " New High Score!" + score;
        }
    }