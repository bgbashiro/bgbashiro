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

    this.gameState = "LOGIN";
    this.buttons = {};
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

  initMusic() {

    this.bgMusic = {
      part1: loadSound("assets/organica-part1.mp3"),
      part2: loadSound("assets/organica-part2.mp3"),
      part3: loadSound("assets/organica-part3.mp3"),
      part4: loadSound("assets/organica-part4.mp3"),
    }
    Object.entries(this.bgMusic).forEach(([_, v]) => v.playMode("untilDone"));
    this.currentMusic = this.bgMusic.part1;
  }

  initButtons(parentContainer) {

    // Buttons for handling login / setting username

    this.buttons['login'] = createButton("Login with Google");
    this.buttons['login'].mousePressed(() => {
      googleSignIn(() => { this.updateGameState('INIT') });
    });
    this.buttons['login'].class("btn-neon btn-center")
    this.buttons['login'].parent(parentContainer);

    this.buttons['usernameForm'] = createDiv();
    let messageBox = createElement("p");
    messageBox.elt.innerText = "Enter your username";
    this.buttons['usernameForm'].child(messageBox);
    let unameInput = createInput()
    this.buttons['usernameForm'].child(unameInput);
    let submitBtn = createInput("Enter", "submit");
    submitBtn.mousePressed(() => {
      if (unameInput.elt.value === "") {
        messageBox.elt.innerText = "Username cannot be blank..."
        setTimeout(() => {
          messageBox.elt.innerText = "Enter your username";
        }, 2000)
      } else {
        setUsernameForCurrentUser(unameInput.elt.value, () => {
          this.updateGameState("HOME");
        });
      }
    })
    this.buttons['usernameForm'].child(submitBtn);
    this.buttons['usernameForm'].class("btn-neon btn-center")
    this.buttons['usernameForm'].parent(parentContainer);

    //
    let info = createDiv();
    let infoText = createElement('p');
    infoText.elt.innerText = `
    You are a pilot controlling a spaceship in deep space. Your goal is to collect as much "gravitanium" crystals as possible in 60 seconds. These are purpleish crystals scattered around. You will definitely recognize them when seeing, do not worry. These crystals are important to make space travel possible by helping us bend gravity rules. 
    
    The position of the mouse pointer is current center of gravity pulling the spaceship. You can increase the strength of gravity by pressing SPACEBAR. Do not worry if you do not understand it, just head to "tutorial" and move your pointer around and press SPACEBAR at times, you will get the feel for it.  

    Depending on difficulty of mission you will get compensated in "gravicoins" (1 for each gravitanium crystal for Levels 2-4, 2 for levels 5-7 and 3 for level 8, tutorial does not give any coins). You can spend these to add message to "Hall Of Fame" to your left. You can also check leaderboard to your right to see how other fellow pilots are doing.
    `
    info.parent(parentContainer);
    info.child(infoText);
    info.class("text-gameplay-info")

    this.buttons['levels'] = createDiv();
    this.buttons['levels'].parent(parentContainer);
    this.buttons['levels'].class("levels-container-root")
    this.buttons['levels'].child(info);

    let div0 = createDiv();
    div0.class("levels-container")
    let btn = createButton(`Tutorial`);
    btn.mousePressed(() => {
      this.level = 1;
      this.updateGameState("INTRO");
    })
    btn.class("btn-neon btn-level")

    div0.child(btn);
    this.buttons['levels'].child(div0);

    let div1 = createDiv();
    div1.class("levels-container")
    for (let i = 2; i <= 4; i++) {
      let btn = createButton(`LEVEL ${i}`);
      btn.mousePressed(() => {
        this.level = i;
        this.updateGameState("INTRO");
      })
      btn.class("btn-neon btn-level")
      div1.child(btn)
    }
    this.buttons['levels'].child(div1);

    let div2 = createDiv();
    div2.class("levels-container")
    for (let i = 5; i <= 7; i++) {
      let btn = createButton(`LEVEL ${i}`);
      btn.mousePressed(() => {
        this.level = i;
        this.updateGameState("INTRO");
      })
      btn.class("btn-neon btn-level")
      div2.child(btn)
    }

    this.buttons['levels'].child(div2);
    let div3 = createDiv();
    div3.class("levels-container")
    for (let i = 8; i <= 8; i++) {
      let btn = createButton(`LEVEL ${i}`);
      btn.mousePressed(() => {
        this.level = i;
        this.updateGameState("INTRO");
      })
      btn.class("btn-neon btn-level")
      div3.child(btn)
    }
    this.buttons['levels'].child(div3);

    this.buttons['signout'] = createButton(`Sign out`);
    this.buttons['signout'].mousePressed(() => {
      googleSignOut(this.updateGameState("LOGIN"));
    })
    this.buttons['signout'].class("btn-neon btn-bottom btn-neon-scarlet");
    this.buttons['signout'].parent(parentContainer);

  }

  updateGameState(newState) {
    Object.entries(this.buttons).forEach(([_, btn]) => {
      btn.hide();
    });

    updateHallOfFame();
    if (gm.level !== undefined) {
      updateLeaderBoard(gm.level);
    }
    this.gameState = newState;
    switch (this.gameState) {
      case "LOGIN":
        this.buttons['login'].show();
        break;
      case "INIT":

        this.currentMusic = this.bgMusic.part1;
        this.currentMusic.setLoop(true);
        this.currentMusic.play();

        this.buttons['usernameForm'].show();
        let unameInput = this.buttons['usernameForm'].elt.querySelector('input');
        getCurrentUser((data) => {
          if (data !== undefined) {
            unameInput.value = data['displayName']
          }
        });
        break;
      case "HOME":

        this.currentMusic.stop();
        this.currentMusic = this.bgMusic.part1;
        this.currentMusic.setLoop(true);
        this.currentMusic.play();

        this.buttons['levels'].style('display', 'flex');
        this.buttons['signout'].show();

        break;
      case "INTRO":

        this.currentMusic.stop();
        this.currentMusic = this.bgMusic.part3;
        this.currentMusic.setLoop(false);
        this.currentMusic.play();

        this.reset();
        this.setLevel();
        break;
      case "GAME":

        this.currentMusic.stop();
        this.currentMusic = this.bgMusic.part2;
        this.currentMusic.setLoop(true);
        this.currentMusic.play();

        this.timer = 0;
        this.frameCount = 0;
        break;
      case "OUTRO":

        this.currentMusic.stop();
        this.currentMusic = this.bgMusic.part4;
        this.currentMusic.setLoop(false);
        this.currentMusic.play();

        if (gm.entities.player.health > 0) {
          addGameScore(gm.level, gm.oreCounter);
        }
        this.timer = 0;
        this.frameCount = 0;

        break;
      default:
        break;
    }
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
var amethystImage;

function setup() {
  let canvasContainer = document.getElementById("canvasContainer");
  let canvas = createCanvas(800, 800);
  canvas.parent(canvasContainer);
  gm.initButtons(canvasContainer);
  gm.initMusic();
  gm.updateGameState("LOGIN");

  amethystImage = loadImage("assets/amethyst.png");


  frameRate(60);
}

function drawLogin() {
}

function drawInit() {
}

function drawHome() {
}

function drawWelcome() {
}

function drawIntro() {
  background(0, 0.2);

  gm.entities.player.show();
  gm.entities.obstacles.forEach(obs => obs.show());
  gm.entities.ores.forEach(ore => ore.show());
  stroke('black');
  fill('white');
  rect(300, 350, 200, 100);
  textSize(36);
  stroke('red');
  text(6 - gm.timer, 350, 400);
  textSize(12);

  if (gm.timer > 5) {
    gm.updateGameState("GAME");
  }


}

function drawOutro() {

  gm.entities.player.show();
  gm.entities.obstacles.forEach(obs => obs.show());
  gm.entities.ores.forEach(ore => ore.show());
  stroke('black');
  fill('white');
  rect(300, 350, 200, 100);
  stroke('red');
  fill('red');
  textSize(12);
  if (gm.entities.player.health <= 0) {
    text('You lost all ores, better luck next time', 350, 400);
  } else {
    text(`You collected ${gm.oreCounter} ores, you will be compensated accordingly`, 350, 400);
  }
  text(6 - gm.timer, 350, 430);

  if (gm.timer > 5) {
    gm.updateGameState("HOME");
  }


}

function drawGame() {

  gm.entities.player.moveTowardsMouse();

  gm.entities.obstacles.forEach(obs => {
    if (checkLineAndCircleCollision(
      gm.entities.player.positionX, gm.entities.player.positionY, gm.entities.player.radius,
      obs.startX, obs.startY, obs.endX, obs.endY
    )) {
      obs.color = 'red';
      let speed = Math.sqrt(gm.entities.player.velocityX * gm.entities.player.velocityX + gm.entities.player.velocityY * gm.entities.player.velocityY);
      gm.entities.player.health -= Math.min(1 + speed * 2.5, 50);
      gm.entities.player.velocityX *= -1.1;
      gm.entities.player.velocityY *= -1.1;
    } else {
      obs.color = 'white';
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

  fill('white');
  imageMode(CORNER);
  image(amethystImage, 10, 10, 15, 15)
  text(gm.oreCounter, 30, 25);
  text(`⏲️ ${60-gm.timer}`, 10, 40);

  if (gm.entities.player.health <= 0) {
    gm.updateGameState("OUTRO")
  };

  if (gm.timer > 60) {
    gm.updateGameState("OUTRO");
  }

}

function draw() {
  clear();
  background(0, 0.5);
  switch (gm.gameState) {
    // Start Screen

    case "LOGIN":
      drawLogin();
      break;
    case "INIT":
      drawWelcome();
      break;
    case "HOME":
      drawHome();
      break;
    case "INTRO":
      drawIntro();
      break;
    case "GAME":
      drawGame();
      break;
    case "OUTRO":
      drawOutro();
      break;
    default:
      break;
  }

  gm.frameCount++;
  gm.timer = Math.ceil(gm.frameCount / 60);
}