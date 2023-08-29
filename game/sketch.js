class Player {

  constructor(positionX, positionY) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.velocityX = 0;
    this.velocityY = 0;
  }

  moveTowardsMouse() {
    let dx = mouseX-this.positionX;
    let dy = mouseY-this.positionY;

    let r = sqrt(dx*dx + dy*dy);

    let force = 0.2;
    if (mouseIsPressed) { 
      force = 5
    }

    let ax = dx*abs(dx)/(r*r+0.001) * force; 
    let ay = dy*abs(dy)/(r*r+0.001) * force; 
    
    this.velocityX += ax;
    this.velocityY += ay;

    this.positionX += this.velocityX;
    this.positionY += this.velocityY;

    this.velocityX *= 0.9;
    this.velocityY *= 0.9;
  }

  show() {
    ellipse(this.positionX,this.positionY,80,80);
  }
}

class Rod {
  constructor(startX, startY, endX, endY) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
  }

  show() {
    strokeWeight(20);
    line(this.startX, this.startY, this.endX, this.endY);
    strokeWeight(1);
  }
}

function rodTouchesPlayer(rod, player) {
  // taken from https://stackoverflow.com/a/1079478
  let vectorToPlayerX = rod.startX - player.positionX; 
  let vectorToPlayerY = rod.startY - player.positionY; 

  let vectorToRodX = rod.startX - rod.endX;
  let vectorToRodY = rod.startY - rod.endY;

  let dotPlayerRod = vectorToPlayerX*vectorToRodX + vectorToPlayerY*vectorToRodY;
  let dotRodRod = vectorToRodX*vectorToRodX + vectorToRodY*vectorToRodY;
  let k = dotPlayerRod / dotRodRod; 
  let touchPointX = rod.startX + k*vectorToRodX
  let touchPointY = rod.startY + k*vectorToRodY;
  fill(100,0,0);
  ellipse(touchPointX, touchPointY, 10, 10);
  console.log(touchPointX, touchPointY, 10, 10);
}

var entities = {}

function setup() {
  createCanvas(800, 800);
  frameRate(24);
  entities.player = new Player(280,80);
  entities.rod1 = new Rod(10,10,110,120);
}

function draw() {
    background(220);
    entities.player.moveTowardsMouse();
    entities.player.show();
    entities.rod1.show();
    rodTouchesPlayer(entities.player, entities.rod1);
}