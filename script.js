//global vars
const cards = document.querySelectorAll('.memory-card')
const overlays = document.querySelectorAll('.overlay-text');
const restart = document.querySelectorAll('.restart')
let hasFlipped = false   //ip there is a card flipped, set to true. default is false
let firstCard, secondCard
let lock = false //lock the board temporarily when the card dont match,give it some time to flip back. basically it make sure no more than two card is flipped at the same time
let totalTime = 95
let timeRemaining = 95
let totalFlips = 0
let match = 0
let timer = document.getElementById('time-remaining')
let flips = document.getElementById('flips');
let countdown 

//music
let bgMusic = new Audio('./audio/bgmusic.mp3');
let flipSound = new Audio('./audio/flip.wav');
let matchSound = new Audio('./audio/match.wav');
let victorySound = new Audio('./audio/win.wav');
let gameOverSound = new Audio('./audio/gameover.wav');
bgMusic.volume = 0.25
bgMusic.loop = true //dont need cuz the music is already too long


//flip the card and unflip if the number of card flipped > 2
function flipCard(){
    if (lock) return;  //if the board is lock, stop there, don't don anything
    if (this === firstCard) return; //if the card that trigger this function is clicked again, make sure it's not a match

    this.classList.add('flip')  //originally is toggle. but we have code to remove the class below, so no need 
    flipSound.play()
    totalFlips++;
    flips.innerText = totalFlips;

    if (!hasFlipped){
        hasFlipped = true
        firstCard = this
    }
    else{
        hasFlipped = false
        secondCard = this

        checkMatch()
    }
}

function checkMatch(){
    //check if card match. If match, disable click; else, flip over
    if (firstCard.dataset.name === secondCard.dataset.name){
        firstCard.removeEventListener('click', flipCard)
        secondCard.removeEventListener('click', flipCard)
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');

        match++
        console.log(match)
        matchSound.play()

        if(match === (cards.length)/2)
            victory();

        reset()
    }
    else{
        lock = true //wait for the card to flip back
        //slow down so that we can see the flipping
        setTimeout(() => {
            firstCard.classList.remove('flip')
            secondCard.classList.remove('flip')

            //cards finished flipping, allow the program to continue
            reset()
        }, 1000)
    }
}


//reset the values after a pair of cards is flipped, regardless of match or not
function reset(){
    hasFlipped = false
    lock = false
    firstCard = null
    secondCard = null
}


//shuffle the cards. Using here: IIFE: https://developer.mozilla.org/en-US/docs/Glossary/IIFE
(function shuffle(){
    cards.forEach(card => {
        let pos = Math.floor(Math.random() * 12)
        card.style.order = pos
    })
})()

function startCountdown() {
    return setInterval(() => {
        timeRemaining--;
        timer.innerText = timeRemaining;
        if(timeRemaining === 0)
            gameOver();
    }, 1000);
}

function gameOver() {
    clearInterval(countdown);
    document.getElementById('game-over-text').classList.add('visible');
    bgMusic.pause()
    gameOverSound.play()
}

function victory() {
    clearInterval(countdown);
    document.getElementById('victory-text').classList.add('visible');
    bgMusic.pause()
    victorySound.play()
}

function restartGame(){
    window.location.reload();
    return false;   
}


//THINGS START HERE

const startBtn = document.querySelector('.start')
startBtn.addEventListener('click', game)


function game(){
    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
        });
    });
    
    setTimeout(() => {
        bgMusic.play()
        countdown = startCountdown();
    }, 500)
    
    cards.forEach(card => card.addEventListener('click', flipCard))
    restart.forEach(r => r.addEventListener('click', restartGame))
}


//120deg, #ff0a45 0%, #ff4261 43%,  #ffad97 100%