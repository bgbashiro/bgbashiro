class Player {

  constructor(positionX, positionY) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.prevPositionXs = Array(10).fill(positionX);
    this.prevPositionYs = Array(10).fill(positionY);
    this.alphas = [];
    for (let i = 0; i < 10; i++) { this.alphas.push(Math.exp(-i*i)) }
    this.velocityX = 0;
    this.velocityY = 0;
    this.radius = 25;

    this.fuel = 100;
    this.health = 100;

    this.image = loadImage("assets/spaceship.png");

  }

  moveTowardsMouse() {
    let dx = mouseX - this.positionX;
    let dy = mouseY - this.positionY;

    let r = sqrt(dx * dx + dy * dy);

    let force = 0.1;
    if (keyIsDown(32) && (this.fuel > 0)) {
      force = 1.4;
      this.fuel -= 1.5;
    }

    let ax = dx * abs(dx) / (r * r + 0.001) * force;
    let ay = dy * abs(dy) / (r * r + 0.001) * force;

    this.velocityX += ax;
    this.velocityY += ay;

    this.prevPositionXs = this.prevPositionXs.slice(0, 4);
    this.prevPositionYs = this.prevPositionYs.slice(0, 4);
    this.prevPositionXs.unshift(this.positionX);
    this.prevPositionYs.unshift(this.positionY);

    this.positionX += this.velocityX;
    this.positionY += this.velocityY;

    this.velocityX *= 0.93;
    this.velocityY *= 0.93;
  }

  show() {
    fill(0, 100, 0);
    // ellipse(this.positionX, this.positionY, 2 * this.radius, 2 * this.radius);
    imageMode(CENTER);
    image(this.image, this.positionX, this.positionY, 2 * this.radius, 2 * this.radius);
    for (let i = 0; i < this.alphas.length; i++) {
      let px = this.prevPositionXs[i];
      let py = this.prevPositionYs[i];
      let a = this.alphas[i];
      tint(255, 255 * a);
      image(this.image, px, py, 2 * this.radius, 2 * this.radius);
    }
    fill(0);
  }
}

class Ore {

  constructor(positionX, positionY) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.radius = 10;
    this.image = loadImage("assets/amethyst.png");
  }

  show() {
    noTint();
    imageMode(CENTER);
    image(this.image, this.positionX, this.positionY, 3*this.radius, 3 * this.radius);
  }

}

class Rod {
  constructor(startX, startY, endX, endY) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.color = 'white';
  }

  show() {
    stroke(this.color);
    strokeWeight(5);
    line(this.startX, this.startY, this.endX, this.endY);
    strokeWeight(1);
    stroke('black');
  }
}

