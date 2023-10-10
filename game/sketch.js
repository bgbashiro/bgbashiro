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
    this.buttons={};
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
    this.entities.player = new Player(100, 155);
    this.oreCounter = 0;
    this.timer = 0;
    this.frameCount = 0;
  }

  initButtons() {
    this.buttons['start'] = createButton("START");
    this.buttons['start'].mousePressed(() => {
      gm.gameState = "INTRO";
      gm.reset();
    });
    this.buttons['start'].center();

    this.buttons['next'] = createButton("NEXT");

    this.buttons['next'].mousePressed(() => {
      gm.gameState = "INTRO";
      gm.reset();
      gm.level++;
      gm.level = Math.min(gm.level, 4);
      gm.buttons['next'].hide();
    });
    this.buttons['next'].position(WIDTH / 2, HEIGHT / 3);

    this.buttons['replay'] = createButton("REPLAY");
    this.buttons['replay'].mousePressed(() => {
      gm.gameState = "INTRO";
      gm.reset();
      gm.buttons['replay'].hide();
    });
    this.buttons['replay'].position(WIDTH / 2, 2 * HEIGHT / 3);
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
          new Rod(WIDTH / 2, HEIGHT / 2 + 50, WIDTH, HEIGHT / 3),
        )
        break;
      case 3:
        this.entities.obstacles.push(
          new Rod(0, 50, 0, HEIGHT),
          new Rod(WIDTH, 50, WIDTH, HEIGHT),
          new Rod(0, 50, WIDTH, 50),
          new Rod(0, HEIGHT, WIDTH, HEIGHT),
          new Rod(WIDTH / 2 + 20, HEIGHT / 2 - 50, WIDTH, HEIGHT / 3 - 50),
          new Rod(0, HEIGHT / 2 + 60, WIDTH / 2 + 22, 2 * HEIGHT / 3 + 60),
        )
        break
      case 4:
        this.entities.obstacles.push(
          new Rod(0, 50, 0, HEIGHT),
          new Rod(WIDTH, 50, WIDTH, HEIGHT),
          new Rod(0, 50, WIDTH, 50),
          new Rod(0, HEIGHT, WIDTH, HEIGHT),
          new Rod(400, 300, 500, 400),
          new Rod(500, 400, 400, 500),
          new Rod(400, 500, 300, 400),
          new Rod(300, 400, 400, 300),
        )
        break;
      case 5:
        this.entities.obstacles.push(
          new Rod(0, 50, 0, HEIGHT),
          new Rod(WIDTH, 50, WIDTH, HEIGHT),
          new Rod(0, 50, WIDTH, 50),
          new Rod(0, HEIGHT, WIDTH, HEIGHT),

          new Rod(400, 200, 450, 250),
          new Rod(450, 250, 400, 300),
          new Rod(400, 300, 350, 250),
          new Rod(350, 250, 400, 200),

          new Rod(400, 600, 450, 650),
          new Rod(450, 650, 400, 700),
          new Rod(400, 700, 350, 650),
          new Rod(350, 650, 400, 600),

          new Rod(600, 400, 650, 450),
          new Rod(650, 450, 600, 500),
          new Rod(600, 500, 550, 450),
          new Rod(550, 450, 600, 400),

          new Rod(200, 400, 250, 450),
          new Rod(250, 450, 200, 500),
          new Rod(200, 500, 150, 450),
          new Rod(150, 450, 200, 400),

        )
        break;
      case 6:
        this.entities.obstacles.push(
          new Rod(0, 50, 0, HEIGHT),
          new Rod(WIDTH, 50, WIDTH, HEIGHT),
          new Rod(0, 50, WIDTH, 50),
          new Rod(0, HEIGHT, WIDTH, HEIGHT),

          new Rod(200, 600, 250, 650),
          new Rod(250, 650, 200, 700),
          new Rod(200, 700, 150, 650),
          new Rod(150, 650, 200, 600),
          new Rod(400, 800, 500, 600),

          new Rod(600, 200, 650, 250),
          new Rod(650, 250, 600, 300),
          new Rod(600, 300, 550, 250),
          new Rod(550, 250, 600, 200),
          new Rod(400, 50, 300, 250),
        );
        break;
      case 7:
        this.entities.obstacles.push(
          new Rod(0, 50, 0, HEIGHT),
          new Rod(WIDTH, 50, WIDTH, HEIGHT),
          new Rod(0, 50, WIDTH, 50),
          new Rod(0, HEIGHT, WIDTH, HEIGHT),

          new Rod(600, 200, 650, 250),
          new Rod(650, 250, 600, 300),
          new Rod(600, 300, 550, 250),
          new Rod(550, 250, 600, 200),

          new Rod(400, 300, 400, 500),

          new Rod(200, 500, 200, 700),
          new Rod(100, 600, 300, 600),

          new Rod(100, 200, 200, 300),
          new Rod(550, 550, 650, 650),
        );
        break;
      case 8:
        this.entities.player.positionX = 400;
        this.entities.obstacles.push(
          new Rod(0, 50, 0, HEIGHT),
          new Rod(WIDTH, 50, WIDTH, HEIGHT),
          new Rod(0, 50, WIDTH, 50),
          new Rod(0, HEIGHT, WIDTH, HEIGHT),

          new Rod(300, 300, 500, 500),
          new Rod(500, 300, 300, 500),

          new Rod(0, 200, 200, 200),
          new Rod(100, 150, 100, 250),

          new Rod(600, 200, 800, 200),
          new Rod(700, 150, 700, 250),

          new Rod(0, 600, 200, 600),
          new Rod(600, 600, 800, 600),

          new Rod(400, 550, 450, 600),
          new Rod(450, 600, 400, 650),
          new Rod(400, 650, 350, 600),
          new Rod(350, 600, 400, 550),
        );
        break;
      case 9:
        this.entities.obstacles.push(
          new Rod(0, 50, 0, HEIGHT),
          new Rod(WIDTH, 50, WIDTH, HEIGHT),
          new Rod(0, 50, WIDTH, 50),
          new Rod(0, HEIGHT, WIDTH, HEIGHT),
        );
        break;
      case 10:
        this.entities.obstacles.push(
          new Rod(0, 50, 0, HEIGHT),
          new Rod(WIDTH, 50, WIDTH, HEIGHT),
          new Rod(0, 50, WIDTH, 50),
          new Rod(0, HEIGHT, WIDTH, HEIGHT),
        );
        break;
      default:
        break;
    }

  }

};




var gm = new GameManager();

function setup() {
  let canvasContainer = document.getElementById("canvasContainer");
  console.log(canvasContainer);
  let canvas = createCanvas(800, 800);
  canvas.parent(canvasContainer);
  gm.initButtons()
  Object.entries(gm.buttons).forEach(([_, btn])=>{
    btn.parent(canvasContainer);
    btn.class("gameButton");
    btn.hide();
  });

  frameRate(60);
}

function drawWelcome() {
  background(220);
  text("You are a pilot controlling a spaceship", 50, 50);
  gm.buttons['start'].show();
}

function drawIntro() {
  gm.buttons['start'].hide();
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
  gm.buttons['start'].hide();
  background(220);
  text("Congratz. You are qualified to go to next level.", 50, 50);
  gm.buttons['next'].show();
  gm.buttons['replay'].show();
}

function drawOutroLose() {
  gm.buttons['start'].hide();
  background(220);
  text("Too slow. You need to pass for next level.", 50, 50);
  gm.buttons['replay'].show();
}


function drawGamePlay() {
  gm.buttons['start'].hide();
  gm.buttons['next'].hide();
  gm.buttons['replay'].hide();
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

  if ((gm.oreCounter >= 10) && (gm.timer <= 30)) {
    // if (gm.level === 4) {
    // gm.gameState = "FINISH";
    // } else {
    gm.gameState = "OUTROWIN";
    // }
  } else if (gm.timer > 30) {
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