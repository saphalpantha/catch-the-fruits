import Game from './game.js';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth / 2;
canvas.height = window.innerHeight - 100;

const layouts = {
  loading: document.querySelector('.loading-layout'),
  start: document.querySelector('.start-layout'),
  gameOver: document.querySelector('.game-over-layout'),
};

const startBtn = layouts.start.querySelector('button');
const restartBtn = layouts.gameOver.querySelector('.restart-button');

let game;

function show(layout) {
  Object.values(layouts).forEach(el => el?.classList.add('hidden'));
  layout?.classList.remove('hidden');
}

// game over callback
function onGameOver() {
  console.log('callbackkkkkkkkkkkk');
  const gameOverScreen = document.getElementById('gameOverScreen');
  if (gameOverScreen) {
    gameOverScreen.classList.remove('hidden');
    restartBtn.classList.remove('hidden');
    console.log('afsa -------');
  } else {
    console.error('Game over !!!');
  }
}

// game init
function initGame() {
  show(null);
  game = new Game(canvas, ctx, onGameOver);
  Object.values(game.sounds).forEach(sound => {
    sound.load();
  });

  game.initializeGame();
}

// loading animate
show(layouts.loading);

setTimeout(() => show(layouts.start), 1500);

startBtn.addEventListener('click', initGame);
restartBtn.addEventListener('click', () => {
  restartBtn.classList.add('hidden');
  game.resetGame();
  game.initializeGame();
  show(null);
});
