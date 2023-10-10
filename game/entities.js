class Player {

  constructor(positionX, positionY) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.velocityX = 0;
    this.velocityY = 0;
    this.radius = 25;

    this.fuel = 100;
    this.health = 100;

  }

  moveTowardsMouse() {
    let dx = mouseX - this.positionX;
    let dy = mouseY - this.positionY;

    let r = sqrt(dx * dx + dy * dy);

    let force = 0.1;
    if (keyIsDown(32) && (this.fuel > 0)) {
      force = 4;
      this.fuel -= 2.5;
    }

    let ax = dx * abs(dx) / (r * r + 0.001) * force;
    let ay = dy * abs(dy) / (r * r + 0.001) * force;

    this.velocityX += ax;
    this.velocityY += ay;

    this.positionX += this.velocityX;
    this.positionY += this.velocityY;

    this.velocityX *= 0.9;
    this.velocityY *= 0.9;
  }

  show() {
    ellipse(this.positionX, this.positionY, 2 * this.radius, 2 * this.radius);
  }
}

class Ore {

  constructor(positionX, positionY) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.radius = 5;
  }

  show() {
    fill('red');
    ellipse(this.positionX, this.positionY, 2 * this.radius, 2 * this.radius);
    fill('black');
  }

}

class Rod {
  constructor(startX, startY, endX, endY) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.color = 'black';
  }

  show() {
    stroke(this.color);
    strokeWeight(5);
    line(this.startX, this.startY, this.endX, this.endY);
    strokeWeight(1);
    stroke('black');
  }
}

