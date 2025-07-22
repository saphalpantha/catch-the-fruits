import Entity from './entity.js';
import Basket from './basket.js';
class Game {
  constructor(canvas, ctx, onGameOverCallback) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.entities = [];
    this.backgroundImage = null;
    this.animationId = null;
    this.level = 10; // less difficult
    this.health = 100;
    this.basket = null;
    this.score = 0;
    this.spawnInterval = 1000;
    this.lastSpawnTime = 0;
    this.resetGame();
    this.onGameOverCallback = onGameOverCallback;
    this.sounds = {
      fruit: new Audio('./assets/sfx/fruit.mp3'),
      bomb: new Audio('./assets/sfx/bomb.mp3'),
    };
    this.totalTime = 60;
    this.remainingTime = this.totalTime;
    this.timerInterval = null;
  }

  setStartingLayout() {
    this.backgroundImage = new Image();
    this.backgroundImage.src = '\\assets\\background.jpg';
    this.backgroundImage.onload = () => {
      this.ctx.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
    };

    console.log('Game Initialized');
  }

  resetGame() {
    this.entities = [];
    this.backgroundImage = null;
    this.animationId = null;
    this.level = 10;
    this.health = 100;
    this.score = 0;
    this.spawnInterval = 1000;
    this.lastSpawnTime = 0;
    this.basket = null;
  }

  spawnEntity() {
    const type = Math.random() < 0.8 ? 'fruit' : 'bomb';
    const x = Math.random() * (this.width - 50);
    const y = -50; // start above canvas
    const speed = (Math.random() * this.level) / 2;

    const entity = new Entity(type, x, y, speed);
    this.entities.push(entity);
  }

  loadBasket() {
    this.basket = new Basket(this.canvas, this.ctx);
    this.basket.draw();
  }

  gameOver() {
    cancelAnimationFrame(this.animationId);
    this.entities = [];

    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Redraw background if available
    if (this.backgroundImage?.complete) {
      this.ctx.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
    }

    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 48px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 30);

    this.ctx.font = 'bold 28px Arial';
    this.ctx.fillText(`Score: ${this.score}`, this.width / 2, this.height / 2 + 30);

    if (this.onGameOverCallback) {
      this.onGameOverCallback();
    }
  }

  displayHealth() {
    this.ctx.font = 'bold 24px Cursive';
    this.ctx.fillStyle = 'rgb(0, 100, 0)';
    this.ctx.fillText(`❤️${this.health}`, this.canvas.width - 120, 180);
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    this.ctx.shadowBlur = 2;
  }

  displayScore() {
    this.ctx.font = 'bold 26px Cursive';
    this.ctx.fillStyle = '#332500';
    this.ctx.fillText(`🍓 Score: ${this.score}`, 20, 150);
    this.ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
    this.ctx.shadowBlur = 2;
  }

  startTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.remainingTime = this.totalTime;
    this.timerInterval = setInterval(() => {
      this.remainingTime--;

      if (this.remainingTime <= 0) {
        clearInterval(this.timerInterval);
        this.remainingTime = 0;
        this.gameOver();
      }
    }, 1000);
  }

  displayTimer() {
    this.ctx.font = 'bold 24px Cursive';
    this.ctx.fillStyle = '#333';
    this.ctx.fillText(
      `⏱️ ${this.remainingTime}s`,
      this.canvas.width - 100,
      this.canvas.height - 50
    );
  }

  updateGame() {
    // Clear the canvas & redraw background
    this.ctx.clearRect(0, 0, this.width, this.height);
    if (this.backgroundImage) {
      this.ctx.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
    }

    // Spwan Entity on Random timestamp;
    const now = Date.now();
    if (now - this.lastSpawnTime > this.spawnInterval) {
      this.spawnEntity();
      this.lastSpawnTime = now;
    }

    // Call Update and Draw method for each on random position
    this.entities.forEach((entity, idx) => {
      // check entity touches the basket coordinate;
      const isInBasket =
        entity.y + entity.height >= this.basket.y &&
        entity.y <= this.basket.y + this.basket.height &&
        entity.x + entity.width >= this.basket.x &&
        entity.x <= this.basket.x + this.basket.width;

      if (entity.type === 'bomb' && isInBasket && !entity.collected) {
        this.health = 0;
        this.sounds.bomb.load();
        this.sounds.bomb.currentTime = 0;
        this.sounds.bomb.play();
        entity.collected = true;
        this.entities.splice(idx, 1);
      }

      if (entity.collected) {
        entity.update();
        entity.draw(this.ctx);
        if (entity.y >= this.basket.y + this.basket.height / 2) {
          this.entities.splice(idx, 1);
        } else {
          entity.draw(this.ctx);
        }
        return;
      }

      if (entity.type === 'fruit' && isInBasket && !entity.collected) {
        entity.collected = true;

        this.basket.collected.push(entity);
        this.score++;
        this.sounds.fruit.currentTime = 0;
        this.sounds.fruit.play();
        // Increase difficulty when score increases;
        if (this.score % 10 === 0) {
          this.level++;
          this.spawnInterval = Math.max(300, this.spawnInterval - 100);
        }
        return;
      }

      // Fruit Missed
      if (entity.type === 'fruit' && entity.y >= this.canvas.height && this.health >= 10) {
        this.health -= 10;
        console.log(`enitity missed ${entity.type}`);
        console.log(this.entities.length);
        this.entities.splice(idx, 1);
        console.log(this.entities.length, 'up');
      }

      entity.update();
      entity.draw(this.ctx);
    });

    this.displayScore();
    this.displayHealth();
    this.displayTimer();

    if (this.basket && this.basket.image.complete) {
      this.basket.draw();
    }

    this.health = Math.max(0, this.health);
    if (this.health === 0) {
      this.gameOver();
    }
  }

  gameLoop = () => {
    this.updateGame();
    this.animationId = requestAnimationFrame(this.gameLoop);
  };

  initializeGame() {
    this.setStartingLayout();
    this.loadBasket();
    this.startTimer();
    this.gameLoop();
  }
}

export default Game;
