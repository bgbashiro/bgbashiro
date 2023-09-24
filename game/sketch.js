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

    let force = 0.1;
    if (mouseIsPressed && (fuel>0)) { 
      force = 4;
      fuel -= 2.5;
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
    new Ore( Math.ceil(10 + Math.random() * 780), 35 + Math.ceil(Math.random()*775) )
  )
}

var entities = {
  player: null,
  obstacles: [],
  ores: []
};

var fuel = 100;
var health = 100;
const WIDTH = 800;
const HEIGHT = 800;
var gameState = 0;
var startButton;
var oreCounter = 0;
var timer = 0;
var level = 1;

function resetWorld() {
  fuel = 100;
  health = 100;
  entities = {
    player: null,
    obstacles: [],
    ores: []
  };
  entities.player = new Player(400,400);
  oreCounter = 0;
  frameCount = 0;
}

function setLevelOne() {
  entities.obstacles.push(
    new Rod(0,50,0,HEIGHT),
    new Rod(WIDTH,50,WIDTH,HEIGHT),
    new Rod(0,50,WIDTH,50),
    new Rod(0,HEIGHT,WIDTH,HEIGHT),
  )
}

function setLevelTwo() {
  entities.obstacles.push(
    new Rod(0,50,0,HEIGHT),
    new Rod(WIDTH,50,WIDTH,HEIGHT),
    new Rod(0,50,WIDTH,50),
    new Rod(0,HEIGHT,WIDTH,HEIGHT),
    new Rod(WIDTH/2,HEIGHT/3,WIDTH,HEIGHT/3),
  )
}

function setLevelThree() {
  entities.obstacles.push(
    new Rod(0,50,0,HEIGHT),
    new Rod(WIDTH,50,WIDTH,HEIGHT),
    new Rod(0,50,WIDTH,50),
    new Rod(0,HEIGHT,WIDTH,HEIGHT),
    new Rod(WIDTH/2,HEIGHT/3,WIDTH,HEIGHT/3),
    new Rod(0,2*HEIGHT/3,WIDTH/2,2*HEIGHT/3),
  )
}

function setup() {
  createCanvas(800, 800);
  frameRate(60);
  startButton = createButton("START");
  startButton.position(WIDTH/2, HEIGHT/2);
  startButton.size(80, 20);
  startButton.mousePressed(()=>{
    gameState=1;
    resetWorld();
    setLevelOne();
  });
  startButton.hide()
}

function drawWelcomScreen() {
  background(220);
  startButton.show()
}

function drawGamePlay() {
    startButton.hide();
    background(220);
    entities.player.moveTowardsMouse();

    entities.obstacles.forEach(obs => {
      if (checkLineAndCircleCollision(
        entities.player.positionX, entities.player.positionY, entities.player.radius,
        obs.startX, obs.startY, obs.endX, obs.endY
      )) {
        obs.color = 'red';
        let speed = Math.sqrt(entities.player.velocityX*entities.player.velocityX+entities.player.velocityY*entities.player.velocityY);
        health -= Math.min(1 + speed * 1.2, 50);
        if (health<=0){gameState = 0};
        entities.player.velocityX*=-1.1;
        entities.player.velocityY*=-1.1;
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
      oreCounter++;
    }

    entities.player.show();
    entities.obstacles.forEach(obs => obs.show());
    entities.ores.forEach(ore => ore.show());

    if ((fuel<100)&&(!mouseIsPressed)) {fuel+=0.5};
    if (health<100){health+=0.05};

    rect(WIDTH*0.85, 0, 100, 25);
    fill('red');
    rect(WIDTH*0.85, 0, Math.max(0,health), 25);
    fill('black');

    rect(WIDTH*0.85, 25, 100, 25);
    fill('green');
    rect(WIDTH*0.85, 25, Math.max(0,fuel), 25);
    fill('black');

    text(oreCounter, 10, 25);
    text(timer, 10, 40);
    timer = Math.ceil(frameCount/60);


}

function draw() {
  switch (gameState) {
    case 0:
      drawWelcomScreen();
      break;
    case 1:
      drawGamePlay()
      break;
    default:
      break;
  }
  if ((oreCounter>=10) && (timer <= 30)) {
    if (level==1) {
      level = 2;
      resetWorld();
      setLevelTwo();
    } else if (level == 2) {
      level = 3;
      resetWorld();
      setLevelThree();
    } else if (level == 3) {
      level=1;
      gameState = 0;
    }
  } else if (timer > 30) {
    gameState = 0;
  }
}