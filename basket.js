import { loadImage } from './util.js';

export default class Basket {
  constructor(canvas, ctx) {
    (this.width = 120), (this.height = 120);
    this.image = loadImage('basket');
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = (this.canvas.width - this.width) / 2;
    this.y = this.canvas.height - this.height - 10;
    this.isDragging = false;
    this.offset = 0;
    this.initializeMovement();
    this.collected = [];

    // console.log(this.image, 'imgggggggggggg');
    // console.log('Basket position:', this.x, this.y);
    // console.log('Canvas size:', this.canvas.width, this.canvas.height);

    this.image.onload = () => {
      this.draw();
    };
  }

  draw() {
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  setDrag() {
    this.canvas.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener('mousedown', e => {
      // check boundary of canvas & only draggable if user drag basket inside canvas
      if (
        e.offsetX >= this.x &&
        e.offsetX <= this.x + this.width &&
        e.offsetY >= this.y &&
        e.offsetY <= this.y + this.height
      ) {
        this.isDragging = true;
        this.offset = e.offsetX - this.x;
      }
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener('mousemove', e => {
      if (this.isDragging) {
        let newX = e.offsetX - this.offset;

        if (newX < 0) newX = 0;
        if (newX + this.width > this.canvas.width) {
          newX = this.canvas.width - this.width;
        }

        this.x = newX;
      }

      if (this.x < 0) this.x = 0;
      if (this.x + this.width > this.canvas.width) this.x = this.canvas.width - this.width;
    });

    //handles key press event
    document.addEventListener('keydown', e => {
      const moveAmount = 20;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        this.x -= moveAmount;
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        this.x += moveAmount;
      }

      // Boundary checking
      if (this.x < 0) this.x = 0;
      if (this.x + this.width > this.canvas.width) {
        this.x = this.canvas.width - this.width;
      }
    });
  }

  initializeMovement() {
    this.setDrag();
  }
}
