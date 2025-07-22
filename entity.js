import { loadImage } from './util.js';

class Entity {
  constructor(type, x, y, speed) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.image = loadImage(type);
    this.width = 50;
    this.height = 50;
    this.collected = false;
  }

  draw(ctx) {
    // console.log(ctx);
    if (this.image.complete) {
      console.log('complete');
      ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else {
      this.image.onload = () => {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
      };
    }
  }

  update(canvasHeight) {
    if (!this.collected) {
      this.y += this.speed;
    } else {
      // slows time after entity collected into basket
      this.y += this.speed * 1.5;
    }
    // console.log(ctx);
    // if (this.y >= canvasHeight) {
    //   console.log(`Your missed this enitity ${this.type}`);
    // }
    // this.y += this.speed;
  }
}
export default Entity;
