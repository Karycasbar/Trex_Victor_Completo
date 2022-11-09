var trex ,trex_running, trex_collided;
var edges;
var ground, invisibleGround, groundImage;
var rand;
var cloud, cloudImage;
var obstacle, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var score = 0;
var obstaclesGroup, cloudsGroup;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOverImg, restartImg, gameOver, restart;
var jumpSound, checkPointSound, dieSound;


function preload(){
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  trex_collided = loadAnimation("trex_collided.png");
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkpoint.mp3");
}

function setup(){
  //createCanvas(600,200)
  createCanvas(windowWidth,windowHeight)
  
  //crear sprite del t-rex.
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.setCollider("circle", 0,0,45);
  //trex.setCollider("rectangle", 0,0, 400, trex.height);
  trex.debug = false;
  
  //crea bordes
  edges = createEdgeSprites();

  trex.scale = 0.5;
  trex.x = 50;

  ground = createSprite(width/2, height-80, width, 2);
  ground.addImage("ground", groundImage);

  //crear un suelo invisible
  invisibleGround = createSprite(width/2, height-10, width, 125);
  invisibleGround.visible = false;

  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  //rand = Math.round(random(1,100));
  //console.log(frameCount);

  //sprite para gameOver
  gameOver = createSprite(width/2, height/2 -50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;

  //sprite para restart
  restart = createSprite(width/2, height/2);
  restart.addImage(restartImg);
  restart.scale = 0.5; 
  
}

function draw(){
  background("gray");

  

  fill("black");
  text("Puntaje: " + score, width/2, 50);
  //console.log("este estado es:" +gameState);


  if(gameState == PLAY){
    //esconder los sprites de gameover y restart
    gameOver.visible = false;
    restart.visible = false;

    //Suelo en movimiento
    ground.velocityX = -(5 + score/100);

    if(ground.x < 0){
      ground.x = ground.width/2;
    }
      //Salto del trex
      if((touches.length >0 || keyDown("space")) && trex.y >=height-180){
        trex.velocityY = -10;
        jumpSound.play();
        touches = [];
      }
    trex.velocityY = trex.velocityY + 0.5;  

    score = score + Math.round(getFrameRate() / 60);
    if(score > 0 && score % 100 == 0){
      checkPointSound.play();
    }
    spawnClouds();
    spawnObstacles();

    if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      dieSound.play();
      //trex.velocityY = -12;
      //jumpSound.play();
    }

  }else if(gameState == END){
    //mostrar los sprites de gameover y restart
    gameOver.visible = true;
    restart.visible = true;

    ground.velocityX = 0;
    //cambia la animación del trex
    trex.changeAnimation("collided",trex_collided);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    //establecer un ciclo de vida a los objetos, para que nunca sean destruidos
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    trex.velocityY = 0;

    //Acción para reiniciar el juego
    /*if(mousePressedOver(restart)){
      //console.log("Reinicio del juego");
      reset();
    }*/
    if(touches.length >0 || keyDown("space")){
      reset();
      touches = [];
    }


  }
  //console.log(frameCount);
  //console.log(trex.y);




  trex.collide(invisibleGround);
  
  drawSprites();
}

function spawnClouds(){
  if(frameCount % 60 == 0){ 
  cloud = createSprite(width+20,height,40,10);
  cloud.addImage(cloudImage);
  cloud.scale = 0.4;
  cloud.y = Math.round(random(10,60));
  cloud.velocityX = -3;

  //asigna un ciclo de vida a la nube
  cloud.lifetime = 350;

  //ajusta la profundidad
  cloud.depth = trex.depth;
  trex.depth = trex.depth + 1;
  //grupo de nubes
  cloudsGroup.add(cloud);
  }
}

function spawnObstacles(){
  if(frameCount % 60 == 0){
    obstacle = createSprite(width+20, height-95, 10, 40);
    obstacle.velocityX = -(6 + score/100);

    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: obstacle.addImage(obstacle1);
        break;
      case 2: obstacle.addImage(obstacle2);
        break;
      case 3: obstacle.addImage(obstacle3);
        break;
      case 4: obstacle.addImage(obstacle4);
        break;
      case 5: obstacle.addImage(obstacle5);
        break;
      case 6: obstacle.addImage(obstacle6);
        break;
      default: break;
    }

    //asignar escala y ciclo de vida
    obstacle.scale = 0.5;
    obstacle.lifetime = 350;
    //grupo de obstaculos
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;

  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();

  trex.changeAnimation("running", trex_running);

  score = 0;
}
