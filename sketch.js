var PLAY = 1;
var END;
var gameState = PLAY;

var box, box_running, box_collided;

var ground, invisibleGround, groundImage;

var obstaclesGroup, obstacle1, obstacle2;

var score;

var gameOverImage, restartImage;

var jumpSound, checkPointSound, dieSound;
var bg;

function preload() {
  box_running = loadAnimation(
    "box3.png",
    "box4.png",
    "box5.png",
    "box6.png",

    "box8.png",
    "box9.png",
    "box10.png",
    "box11.png",

    "box14.png",
    "box15.png",
    "box16.png",
    "box17.png",

    "box20.png",
    "box21.png",
    "box22.png",
    "box22.png",
    "box23.png",
    "box24.png",
    "box25.png"
  );

  box_collided = loadAnimation("boxCollided.png");

  groundImage = loadImage("ground.jpg");

  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");

  gameOverImage = loadImage("gameover.png");
  restartImage = loadImage("restart.png");

  jumpSound = loadSound("jumpSound.wav");
  dieSound = loadSound("dieSound.mp3");

  checkPointSound = loadSound("checkPointSound.mp3");

  bg = loadImage("background.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  box = createSprite(50, height - 215, 20, 50);
  box.addAnimation("running", box_running);
  box.addAnimation("collided", box_collided);
  box.scale = 0.2;

  ground = createSprite(200, height - 100, 400, 20);
  ground.addImage("ground", groundImage);
  ground.x = ground.width / 6;

  invisibleGround = createSprite(200, height - 215, 400, 20);
  invisibleGround.visible = false;

  gameOver = createSprite(width / 2, height - 350);
  gameOver.addImage(gameOverImage);
  gameOver.scale = 0.5;

  restart = createSprite(width / 2, height - 250);
  restart.addImage(restartImage);
  restart.scale = 0.5;

  obstaclesGroup = new Group();

  box.setCollider("rectangle", 0, 0, box.width, box.height);

  score = 0;
}

function draw() {
  background(bg);
  fill("green");
  stroke(5);
  text("Score: " + score, 500, 50);

  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;

    ground.velocityX = -(4 + (3 * score) / 100);
    score = score + Math.round(getFrameRate() / 60);

    if (score > 0 && score % 100 === 0) {
      checkPointSound.play();
    }
    if (ground.x < 0) {
      ground.x = ground.width / 2;
    }

    if (touches.length > 0 || (keyDown("space") && box.y >= 250)) {
      box.velocityY = -12;
      jumpSound.play();
      touches = [];
    }
    box.velocityY = box.velocityY + 0.8;
    if (obstaclesGroup.isTouching(box)) {
      gameState = END;
      dieSound.play();
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    box.changeAnimation("collided", box_collided);

    ground.velocityX = 0;
    box.velocityY = 0;

    obstaclesGroup.setLifetimeEach(0);
    obstaclesGroup.setVelocityEach(0);

    if (mousePressedOver(restart)) {
      reset();
    }
  }
  box.collide(invisibleGround);

  spawnObstacles();
  drawSprites();
}

function reset() {
  gameState = PLAY;
  obstaclesGroup.destroyEach();
  box.changeAnimation("running", box_running);

  score = 0;
}

function spawnObstacles() {
  if (frameCount % 90 === 0) {
    var obstacle = createSprite(600, height - 240, 10, 40);
    obstacle.velocityX = -(4 + (3 * score) / 100);
    var rand = Math.round(random(1, 2));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle1);
        break;
      case 2:
        obstacle.addImage(obstacle2);
        break;
      default:
        break;
    }
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
  }
}
