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

    this.gameState = "INIT";
    this.startButton;
    this.nextButton;
    this.replayButton;
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
    this.timer = 0;
    this.frameCount = 0;
  }

  spawnOre() {
    let ore = new Ore(Math.ceil(10 + Math.random() * 780), 35 + Math.ceil(Math.random() * 775))
    while (gm.entities.obstacles
      .map(obs => checkLineAndCircleCollision(ore.positionX, ore.positionY, ore.radius, obs.startX, obs.startY, obs.endX, obs.endY))
      .reduce((a, b) => { return a || b }, false)
    ) {
      ore = new Ore(Math.ceil(10 + Math.random() * 780), 35 + Math.ceil(Math.random() * 775))
    }
    this.entities.ores.push(ore)
  }

  setLevel() {
    switch (this.level) {
      case 1:
        this.entities.obstacles.push(
          new Rod(0, 50, 0, HEIGHT),
          new Rod(WIDTH, 50, WIDTH, HEIGHT),
          new Rod(0, 50, WIDTH, 50),
          new Rod(0, HEIGHT, WIDTH, HEIGHT),
        )
        break;
      case 2:
        this.entities.obstacles.push(
          new Rod(0, 50, 0, HEIGHT),
          new Rod(WIDTH, 50, WIDTH, HEIGHT),
          new Rod(0, 50, WIDTH, 50),
          new Rod(0, HEIGHT, WIDTH, HEIGHT),
          new Rod(WIDTH / 2, HEIGHT / 3, WIDTH, HEIGHT / 3),
        )
        break;
      case 3:
        this.entities.obstacles.push(
          new Rod(0, 50, 0, HEIGHT),
          new Rod(WIDTH, 50, WIDTH, HEIGHT),
          new Rod(0, 50, WIDTH, 50),
          new Rod(0, HEIGHT, WIDTH, HEIGHT),
          new Rod(WIDTH / 2, HEIGHT / 3, WIDTH, HEIGHT / 3),
          new Rod(0, 2 * HEIGHT / 3, WIDTH / 2, 2 * HEIGHT / 3),
        )
        break
      default:
        break;
    }

  }

};



var gm = new GameManager();

function setup() {
  let viewport = document.getElementById("viewport");

  let cnv = createCanvas(800, 800);
  cnv.parent(viewport);

  gm.startButton = createButton("START");
  gm.startButton.parent(viewport);
  gm.startButton.class("gameButton");
  gm.startButton.mousePressed(() => {
    gm.gameState = "INTRO";
    gm.reset();
  });
  gm.startButton.hide();
  gm.startButton.center();

  gm.nextButton = createButton("NEXT");
  gm.nextButton.parent(viewport);
  gm.nextButton.class("gameButton");
  gm.nextButton.mousePressed(() => {
    gm.gameState = "INTRO";
    gm.reset();
    gm.level++;
    gm.nextButton.hide();
  });
  gm.nextButton.hide();
  gm.nextButton.position(WIDTH/2, HEIGHT/3);

  gm.replayButton = createButton("REPLAY");
  gm.replayButton.parent(viewport);
  gm.replayButton.class("gameButton");
  gm.replayButton.mousePressed(() => {
    gm.gameState = "INTRO";
    gm.reset();
    gm.replayButton.hide();
  });
  gm.replayButton.hide();
  gm.nextButton.position(WIDTH/2, 2*HEIGHT/3);

  frameRate(60);
}

function drawWelcome() {
  background(220);
  text("You are a pilot controlling a spaceship", 50, 50);
  gm.startButton.show();
}

function drawIntro() {
  gm.startButton.hide();
  background(220);

  gm.entities.player.show();
  gm.entities.obstacles.forEach(obs => obs.show());
  gm.entities.ores.forEach(ore => ore.show());
  if (gm.timer >= 3) {
    gm.setLevel();
    gm.gameState = "PLAY";
  }

  text(4 - gm.timer, WIDTH / 2, HEIGHT / 2);

}

function drawOutroWin() {
  gm.startButton.hide();
  background(220);
  text("Congratz. You are qualified to go to next level.", 50, 50);
  gm.nextButton.show();
  gm.replayButton.show();
}

function drawOutroLose() {
  gm.startButton.hide();
  background(220);
  text("Too slow. You need to pass for next level.", 50, 50);
  gm.replayButton.show();
}


function drawGamePlay() {
  gm.startButton.hide();
  gm.nextButton.hide();
  gm.replayButton.hide();
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
      if (gm.entities.player.health <= 0) { gm.gameState = "OUTROLOSE" };
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

  if ((gm.oreCounter >= 2) && (gm.timer <= 10)) {
    if (gm.level === 3) {
      gm.gameState = "FINISH";
    } else {
      gm.gameState = "OUTROWIN";
    }
  } else if (gm.timer > 10) {
    gm.gameState = "OUTROLOSE";
  }

}

function draw() {
  switch (gm.gameState) {
    // Start Screen
    case "INIT":
      drawWelcome();
      break;
    case "INTRO":
      drawIntro();
      break;
    case "OUTROWIN":
      drawOutroWin();
      break;
    case "OUTROLOSE":
      drawOutroLose();
      break;
    case "PLAY":
      drawGamePlay();
      break;
    case "FINISH":
      drawFinish();
      break;
    default:
      break;
  }

  gm.frameCount++;
  gm.timer = Math.ceil(gm.frameCount / 60);
}