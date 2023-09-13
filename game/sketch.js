class Player {

  constructor(positionX, positionY) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.velocityX = 0;
    this.velocityY = 0;
    this.radius = 80;
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
    ellipse(this.positionX,this.positionY,this.radius,this.radius);
  }
}

var d = null;

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
    strokeWeight(20);
    line(this.startX, this.startY, this.endX, this.endY);
    strokeWeight(1);
    stroke('black');
  }
}

function checkCollisionRodPlayer(player, rod) {  
  let v1x = player.positionX-rod.startX;
  let v1y = player.positionY-rod.startY;

  let v2x = rod.endX-rod.startX;
  let v2y = rod.endY-rod.startY;
  let L = Math.sqrt(v2x*v2x+v2y*v2y)

  let ux = v2x / L;
  let uy = v2y / L;

  let dot = Math.sqrt(v1x*ux + v1y*uy);

  let v3x = dot*ux;
  let v3y = dot*uy;

  let v4x = v1x - v3x; 
  let v4y = v1y - v3y; 
  let dv4 = Math.sqrt(v4x*v4x + v4y*v4y);
  d = dv4;
  return (dv4 < player.radius);
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
  // console.log(touchPointX, touchPointY, 10, 10);
}

var entities = {}

function setup() {
  createCanvas(800, 800);
  frameRate(24);
  entities.player = new Player(280,80);
  entities.rod1 = new Rod(100,100,110,300);
}

function draw() {
    background(220);
    entities.player.moveTowardsMouse();
    entities.player.show();
    entities.rod1.show();
    a = checkCollisionRodPlayer(entities.player, entities.rod1);
    rod2 = {...entities.rod1};
    rod2.startX = entities.rod1.endX;
    rod2.startY = entities.rod1.endY;
    rod2.endX = entities.rod1.startX;
    rod2.endY = entities.rod1.startY;
    b = checkCollisionRodPlayer(entities.player, rod2)
    if (a || b) {entities.rod1.color = "red";} else {entities.rod1.color = "black";}

}