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
    if (mouseIsPressed && (this.fuel > 0)) {
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

function checkLineAndCircleCollision(
  cx, cy,  // center coordinates of circle
  r,      // radis of circle
  x1, y1, // start of line segment
  x2, y2  // end of line segment
) {

  xAC = cx - x1;
  yAC = cy - y1;

  xAB = x2 - x1;
  yAB = y2 - y1;

  dotACAB = xAC * xAB + yAC * yAB;
  magnAB = xAB * xAB + yAB * yAB;

  uxAB = xAB / magnAB;
  uyAB = yAB / magnAB;

  xAD = uxAB * dotACAB;
  yAD = uyAB * dotACAB;

  projX = x1 + xAD;
  projY = y1 + yAD;

  dx = projX - cx;
  dy = projY - cy;
  dd = Math.sqrt(dx * dx + dy * dy);

  if (
    (dd <= r) && (projX <= (r + Math.max(x1, x2))) && (projY <= (r + Math.max(y1, y2)))
    && (projX >= (Math.min(x1, x2) - r)) && (projY >= (Math.min(y1, y2) - r))
  ) {
    return true;
  } else {
    return false;
  }

}

function checkCircleAndCirleCollision(
  cx1, cy1, r1, cx2, cy2, r2
) {
  let dx = cx1 - cx2;
  let dy = cy1 - cy2;
  let dd = Math.sqrt(dx * dx + dy * dy);

  return dd <= (r1 + r2);
}




// --- Global variables / objects --- //

const WIDTH = 800;
const HEIGHT = 800;

class GameManager {

  constructor() {
    this.entities = {
      player: null,
      obstacles: [],
      ores: []
    }

    this.gameState = 0;
    this.startButton;
    this.oreCounter = 0;
    this.timer = 0;
    this.level = 1;
  }

  reset() {
    this.entities = {
      player: null,
      obstacles: [],
      ores: []
    };
    this.entities.player = new Player(400, 400);
    this.oreCounter = 0;
    this.frameCount = 0;
  }

  spawnOre() {
    this.entities.ores.push(
      new Ore(Math.ceil(10 + Math.random() * 780), 35 + Math.ceil(Math.random() * 775))
    )
  }

  setLevelOne() {
    this.entities.obstacles.push(
      new Rod(0, 50, 0, HEIGHT),
      new Rod(WIDTH, 50, WIDTH, HEIGHT),
      new Rod(0, 50, WIDTH, 50),
      new Rod(0, HEIGHT, WIDTH, HEIGHT),
    )
  }

  setLevelTwo() {
    this.entities.obstacles.push(
      new Rod(0, 50, 0, HEIGHT),
      new Rod(WIDTH, 50, WIDTH, HEIGHT),
      new Rod(0, 50, WIDTH, 50),
      new Rod(0, HEIGHT, WIDTH, HEIGHT),
      new Rod(WIDTH / 2, HEIGHT / 3, WIDTH, HEIGHT / 3),
    )
  }

  setLevelThree() {
    this.entities.obstacles.push(
      new Rod(0, 50, 0, HEIGHT),
      new Rod(WIDTH, 50, WIDTH, HEIGHT),
      new Rod(0, 50, WIDTH, 50),
      new Rod(0, HEIGHT, WIDTH, HEIGHT),
      new Rod(WIDTH / 2, HEIGHT / 3, WIDTH, HEIGHT / 3),
      new Rod(0, 2 * HEIGHT / 3, WIDTH / 2, 2 * HEIGHT / 3),
    )
  }

};

var gm = new GameManager();

function setup() {
  createCanvas(800, 800);
  frameRate(60);
  gm.startButton = createButton("START");
  gm.startButton.position(WIDTH / 2, HEIGHT / 2);
  gm.startButton.size(80, 20);
  gm.startButton.mousePressed(() => {
    gm.gameState = 1;
    gm.reset();
    gm.setLevelOne();
  });
  gm.startButton.hide()
}

function drawWelcomScreen() {
  background(220);
  gm.startButton.show()
}

function drawGamePlay() {
  gm.startButton.hide();
  background(220);
  gm.entities.player.moveTowardsMouse();

  gm.entities.obstacles.forEach(obs => {
    if (checkLineAndCircleCollision(
      gm.entities.player.positionX, gm.entities.player.positionY, gm.entities.player.radius,
      obs.startX, obs.startY, obs.endX, obs.endY
    )) {
      obs.color = 'red';
      let speed = Math.sqrt(gm.entities.player.velocityX * gm.entities.player.velocityX + gm.entities.player.velocityY * gm.entities.player.velocityY);
      gm.entities.player.health -= Math.min(1 + speed * 1.2, 50);
      if (gm.entities.player.health <= 0) { gameState = 0 };
      gm.entities.player.velocityX *= -1.1;
      gm.entities.player.velocityY *= -1.1;
    } else {
      obs.color = 'black';
    }
  })

  if (gm.entities.ores.length == 0) {
    gm.spawnOre();
  }

  if (checkCircleAndCirleCollision(
    gm.entities.player.positionX, gm.entities.player.positionY, gm.entities.player.radius,
    gm.entities.ores[0].positionX, gm.entities.ores[0].positionY, gm.entities.ores[0].radius,
  )) {
    gm.entities.ores.pop();
    gm.oreCounter++;
  }

  gm.entities.player.show();
  gm.entities.obstacles.forEach(obs => obs.show());
  gm.entities.ores.forEach(ore => ore.show());

  if ((gm.entities.player.fuel < 100) && (!mouseIsPressed)) { gm.entities.player.fuel += 0.5 };
  if (gm.entities.player.health < 100) { gm.entities.player.health += 0.05 };

  rect(WIDTH * 0.85, 0, 100, 25);
  fill('red');
  rect(WIDTH * 0.85, 0, Math.max(0, gm.entities.player.health), 25);
  fill('black');

  rect(WIDTH * 0.85, 25, 100, 25);
  fill('green');
  rect(WIDTH * 0.85, 25, Math.max(0, gm.entities.player.fuel), 25);
  fill('black');

  text(gm.oreCounter, 10, 25);
  text(gm.timer, 10, 40);
  gm.timer = Math.ceil(frameCount / 60);


}

function draw() {
  switch (gm.gameState) {
    // Start Screen
    case 0:
      drawWelcomScreen();
      break;
    // Level Intro  
    case 1:
      drawGamePlay()
      break;
    default:
      break;
  }
  if ((gm.oreCounter >= 10) && (gm.timer <= 30)) {
    if (gm.level == 1) {
      gm.level = 2;
      gm.reset();
      gm.setLevelTwo();
    } else if (level == 2) {
      gm.level = 3;
      gm.reset();
      gm.setLevelThree();
    } else if (level == 3) {
      gm.level = 1;
      gm.gameState = 0;
    }
  } else if (gm.timer > 30) {
    gm.gameState = 0;
  }
}