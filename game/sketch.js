class Player {

  constructor(positionX, positionY) {
    this.positionX = positionX;
    this.positionY = positionY;
    this.velocityX = 0;
    this.velocityY = 0;
    this.radius = 25;
  }

  moveTowardsMouse() {
    let dx = mouseX-this.positionX;
    let dy = mouseY-this.positionY;

    let r = sqrt(dx*dx + dy*dy);

    let force = 0.2;
    if (mouseIsPressed) { 
      force = 10;
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
    ellipse(this.positionX,this.positionY,2*this.radius,2*this.radius);
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
    ellipse(this.positionX,this.positionY,2*this.radius,2*this.radius);
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

function checkLineAndCircleCollision(
  cx,cy,  // center coordinates of circle
  r,      // radis of circle
  x1, y1, // start of line segment
  x2, y2  // end of line segment
) {
  
  xAC = cx - x1;
  yAC = cy - y1;

  xAB = x2 - x1;
  yAB = y2 - y1;

  dotACAB = xAC*xAB + yAC*yAB;
  magnAB  = xAB*xAB + yAB*yAB;

  uxAB = xAB / magnAB;
  uyAB = yAB / magnAB;

  xAD = uxAB * dotACAB;
  yAD = uyAB * dotACAB;
  
  projX = x1+xAD;
  projY = y1+yAD;

  dx = projX-cx;
  dy = projY-cy;
  dd = Math.sqrt(dx*dx+dy*dy);

  if (
    (dd<=r) && (projX <= (r + Math.max(x1,x2)) ) && (projY <= (r+Math.max(y1, y2)) )
    && (projX >= (Math.min(x1,x2) - r) ) && (projY >= (Math.min(y1, y2) - r) )
  ){
    return true;
  } else {
    return false;
  }

}

function checkCircleAndCirleCollision(
  cx1, cy1, r1, cx2, cy2, r2 
) {
  let dx = cx1-cx2;
  let dy = cy1-cy2;
  let dd = Math.sqrt(dx*dx+dy*dy);

  return dd<=(r1+r2);
}

function spawnOre() {
  entities.ores.push(
    new Ore( Math.ceil(Math.random() * 800), Math.ceil(Math.random()*800) )
  )
}

var entities = {
  player: null,
  obstacles: [],
  ores: []
};
const WIDTH = 800;
const HEIGHT = 800;

function setup() {
  createCanvas(800, 800);
  frameRate(83);
  entities.player = new Player(400,400);
  entities.obstacles.push(
    new Rod(0,0,0,HEIGHT),
    new Rod(WIDTH,0,WIDTH,HEIGHT),
    new Rod(0,0,WIDTH,0),
    new Rod(0,HEIGHT,WIDTH,HEIGHT),
  )
}

function draw() {
    background(220);
    entities.player.moveTowardsMouse();

    entities.obstacles.forEach(obs => {
      if (checkLineAndCircleCollision(
        entities.player.positionX, entities.player.positionY, entities.player.radius,
        obs.startX, obs.startY, obs.endX, obs.endY
      )) {
        obs.color = 'red';
        alert("GAME OVER!!!");
        window.location.reload();
      } else {
        obs.color = 'black';
      }
    })

    if (entities.ores.length==0) {
      spawnOre();
    }

    if (checkCircleAndCirleCollision(
      entities.player.positionX, entities.player.positionY, entities.player.radius,
      entities.ores[0].positionX, entities.ores[0].positionY, entities.ores[0].radius,
    )) {
      entities.ores.pop();
    }

    entities.player.show();
    entities.obstacles.forEach(obs => obs.show());
    entities.ores.forEach(ore => ore.show());
}