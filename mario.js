var goingDown = false;
var goingRight = false;
var myGamePiece;
var gameObstacles = [];
var gameEnemy = [];
var gameEnemies = [];
var realEnemy = [];
var realstar = [];
var isGameOver;
var stage = 0;
var score = 0;
var background;
var lastFire = Date.now();
var bullets = [];
var fire = [];
var dx = 4;
var FPS =30;
var health = 0;
var myScore;
var stars = [];
var bricks =[];
var cmmTID;
var soundBackground;



function startGame(){
	stage1();
	myGameArea.start();
	newAnimation();
	startAnimation();

	soundBackground = new Howl({
        urls: ['sound/SuperMario.ogg'],
        loop: true,
        volume: 0.3,
    }).play();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 1350;
        this.canvas.height = 650;
		this.timer = newAnimation();
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 1000/FPS);
        },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
		console.log('stop', this, this.interval);
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.velX = 0;
	this.angle = 0;
    this.moveAngle = 1;
    this.velY = 0;
	this.speed = 1;
    this.x = x;
    this.y = y;
	this.speed = 3;
	this.jumping = false;
	this.grounded = true;
    this.update = function() {
        ctx = myGameArea.context;
        if (type == "image") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        } else if (type == "text") {
			ctx.font = this.width + " " + this.height;
			ctx.fillStyle = color;
			ctx.fillText(this.text, this.x, this.y);
		} else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function() {
        this.x += this.velX;
        this.y += this.velY;
    }
	this.newPos1 = function() {
        this.angle += this.moveAngle * Math.PI / 90;
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
		if (this.y <= 530 ){
        this.angle -= this.moveAngle * Math.PI / 360;
		}
    }
	this.newPos2 = function() {
        this.angle += this.moveAngle * Math.PI / 50;
        this.x += this.speed * Math.sin(this.angle);
        this.y -= this.speed * Math.cos(this.angle);
		if (this.y <= 530 ){
        this.angle -= this.moveAngle * Math.PI / 360;
		}
	}
}

//WALKING ENEMY
function enemyPosition(something) {
    "use strict"
		 if(something.x> 100 && !goingRight){
		something.x -= dx;
    }else {
    goingRight = true;
        something.x +=dx;
		if(something.x == 592){
		   goingRight = false;}
        }

}


//
function updateGameArea() {
    myGameArea.clear();
    myGamePiece.newPos();
	background.update();
    myGamePiece.update();
	for(var i=0; i<gameObstacles.length; i++){
	    gameObstacles[i].update();
	}
	for(var i=0; i<bricks.length; i++){
	    bricks[i].update();
	}
	for(var j=0; j<gameEnemy.length; j++){
		gameEnemy[j].update();
		enemyPosition(gameEnemy[j]);
			if (myGamePiece.x < gameEnemy[j].x + gameEnemy[j].width &&
				myGamePiece.x + myGamePiece.width > gameEnemy[j].x &&
				myGamePiece.y < gameEnemy[j].y + gameEnemy[j].height &&
				myGamePiece.height + myGamePiece.y > gameEnemy[j].y){
					myGamePiece.height = 0;
					gameOver();
					console.log("mario is dead");
                var sound = new Howl({
                    urls: ['sound/Die.wav']
                }).play();
				soundBackground.stop();
				}
			}
	for(var j=0; j<gameEnemies.length; j++){
		gameEnemies[j].newPos1();
		gameEnemies[j].update();
			if (myGamePiece.x < gameEnemies[j].x + gameEnemies[j].width &&
				myGamePiece.x + myGamePiece.width > gameEnemies[j].x &&
				myGamePiece.y < gameEnemies[j].y + gameEnemies[j].height &&
				myGamePiece.height + myGamePiece.y > gameEnemies[j].y){
					myGamePiece.height = 0;
					gameOver();
					console.log("mario is dead");
                var sound = new Howl({
                    urls: ['sound/Die.wav']
                }).play();
					soundBackground.stop();
				}
		}
	for(var j=0; j<realEnemy.length; j++){
		realEnemy[j].newPos2();
		realEnemy[j].update();
			if (myGamePiece.x < realEnemy[j].x + realEnemy[j].width &&
				myGamePiece.x + myGamePiece.width > realEnemy[j].x &&
				myGamePiece.y < realEnemy[j].y + realEnemy[j].height &&
				myGamePiece.height + myGamePiece.y > realEnemy[j].y){
					myGamePiece.height = 0;
					gameOver();
					console.log("mario is dead");
                var sound = new Howl({
                    urls: ['sound/Die.wav']
                }).play();
					soundBackground.stop();
				}
		}
	for(var i=0; i<fire.length; i++){
		fire[i].update();
			if(fire[i].x < myGamePiece.x + myGamePiece.width &&
			fire[i].x + fire[i].width > myGamePiece.x &&
			fire[i].y < myGamePiece.y + myGamePiece.height &&
			fire[i].height + fire[i].y > myGamePiece.y){
				fire.splice(i,1);
				i--;
				score = score+2;
			}
		}

	for(var i=0; i<stars.length; i++){
		stars[i].update();
			if(stars[i].x < myGamePiece.x + myGamePiece.width &&
			stars[i].x + stars[i].width > myGamePiece.x &&
			stars[i].y < myGamePiece.y + myGamePiece.height &&
			stars[i].height + stars[i].y > myGamePiece.y){
				stars.splice(i,1);
				i--;
                var sound = new Howl({
                    urls: ['sound/Coin.wav']
                }).play();
				score++;
			}
		}
	for(var i=0; i<realstar.length; i++){
		realstar[i].update();
			if(realstar[i].x < myGamePiece.x + myGamePiece.width &&
			realstar[i].x + realstar[i].width > myGamePiece.x &&
			realstar[i].y < myGamePiece.y + myGamePiece.height &&
			realstar[i].height + realstar[i].y > myGamePiece.y){
				realstar.splice(i,1);
				i--;
				myGamePiece.height = 90;
				myGamePiece.width = 70;
				winner();
                var sound = new Howl({
                    urls: ['sound/Coin.wav']
                }).play();
				soundBackground.stop();
				score = score+50;
			}
		}
	 // Update all the bullets
    for(var i=0; i<bullets.length; i++) {
			bullets[i].update();
			bullets[i].newPos();
			bullets[i].velX++;
			for(var j=0; j<gameEnemy.length; j++){
				if (bullets[i].x < gameEnemy[j].x + gameEnemy[j].width &&
					bullets[i].x + bullets[i].width > gameEnemy[j].x &&
					bullets[i].y < gameEnemy[j].y + gameEnemy[j].height &&
					bullets[i].height + bullets[i].y > gameEnemy[j].y){
						gameEnemy.splice(j,1);
						j--;
						score = score+5;
                var sound = new Howl({
                    urls: ['sound/Kick.wav']
                }).play();
					}
			}
			for(var j=0; j<gameEnemies.length; j++){
				if (bullets[i].x < gameEnemies[j].x + gameEnemies[j].width &&
					bullets[i].x + bullets[i].width > gameEnemies[j].x &&
					bullets[i].y < gameEnemies[j].y + gameEnemies[j].height &&
					bullets[i].height + bullets[i].y > gameEnemies[j].y){
						gameEnemies.splice(j,1);
						j--;
						score = score+5;
                var sound = new Howl({
                    urls: ['sound/Kick.wav']
                }).play();
					}
			}
			for(var j=0; j<realEnemy.length; j++){
				if (bullets[i].x < realEnemy[j].x + realEnemy[j].width &&
					bullets[i].x + bullets[i].width > realEnemy[j].x &&
					bullets[i].y < realEnemy[j].y + realEnemy[j].height &&
					bullets[i].height + bullets[i].y > realEnemy[j].y){
						realEnemy.splice(j,1);
						j--;
						score = score+10;
                var sound = new Howl({
                    urls: ['sound/Kick.wav']
                }).play();
					}
			}
        // Remove the bullet if it goes offscreen
			if(bullets[i].y < 0 || bullets[i].y >600 ||bullets[i].x > 1350) {
				bullets.splice(i, 1);
				i--;
				}
    }
	if(stage==0 && myGamePiece.x >= 1280){
		stage2();
		console.log("stage2")
		stage++;
	} else if (stage == 1 && myGamePiece.x >= 1280){
			stage3();
			stage++;
			console.log("stage3")
		}
	myScore.text="SCORE: " +score;
	document.getElementById("score").innerHTML = score ;
    myScore.update();
}
function myFunction() {
    location.reload();
}

//keyboard left right jumping
 keys = [],
    friction = 0.8,
    gravity = 0.3;

var width = 1350;
var height = 580;

function update(){
  // check keys
    if (keys[38] ) {
        // up arrow or space
      if(!myGamePiece.jumping && myGamePiece.grounded){
			myGamePiece.jumping = true;
			console.log("mario jumps");
            var sound = new Howl({
                urls: ['sound/Jump.wav']
            }).play();
			myGamePiece.grounded = false;
			myGamePiece.velY = -myGamePiece.speed*3;
      }
    }
    if (keys[39]) {
        // right arrow
       if (myGamePiece.velX < myGamePiece.speed) {
            myGamePiece.velX++;
        }
    }
    if (keys[37]) {
        // left arrow
        if (myGamePiece.velX > -myGamePiece.speed) {
            myGamePiece.velX--;
        }
    }
   if (keys[32]&&!isGameOver && Date.now() - lastFire > 100){
		//space
		console.log("mario shoots");
        var sound = new Howl({
            urls: ['sound/Fire Ball.wav']
        }).play();
		var x = myGamePiece.x + myGamePiece.width / 2;
        var y = myGamePiece.y + myGamePiece.height / 2;
		bullets.push(new component (40,40,'images/bullets.png',x,y, 'image'));
        lastFire = Date.now();
    }
    myGamePiece.velX *= friction;
   if (myGamePiece.jumping == true){
		myGamePiece.velY += gravity;
	}

    if(myGamePiece.jumping ==false){
		myGamePiece.grounded = true;
	}
    for (var i = 0; i < gameObstacles.length; i++) {
        var dir = colCheck(myGamePiece, gameObstacles[i]);
	}

        if (dir === "l"||dir ==="r") {
            myGamePiece.velX = 0;
	   console.log("hah:" +1)
		} else if (dir === "b") {
            myGamePiece.grounded = true;
            myGamePiece.jumping = false;
			myGamePiece.velY = 2;
	   console.log("hbh:" +1)

        } else if (dir === "t") {
            myGamePiece.velY *= -1;
			myGamePiece.jumping = true;
	   console.log("hch:" +1)
	   }

    if(myGamePiece.grounded){
         myGamePiece.velY = 0;
    }

    myGamePiece.x += myGamePiece.velX;
    myGamePiece.y += myGamePiece.velY;
	if (myGamePiece.x >= width-myGamePiece.width) {
        myGamePiece.x = width-myGamePiece.width;
    } else if (myGamePiece.x <= 0) {
        myGamePiece.x = 0;
    }

    if(myGamePiece.y >= height-myGamePiece.height){
        myGamePiece.y = height - myGamePiece.height ;
        myGamePiece.jumping = false;
    }
    requestAnimationFrame(update);
}

function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
        // add the half widths and half heights of the objects
        hWidths = (shapeA.width / 3) + (shapeB.width / 3),
        hHeights = (shapeA.height / 2.3) + (shapeB.height / 2.3),
        colDir = null;

    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = "t";
                shapeA.y += oY;

            } else {
                colDir = "b";
                shapeA.y -= oY;
				myGamePiece.grounded = true;
				myGamePiece.jumping = false;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;

            } else {
                colDir = "r";
                shapeA.x -= oX;
            }
        }
    }
    return colDir;
	console.log("hehe:" +1)
}

document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});


window.addEventListener("load", function () {
    update();
});

(function() {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();
//Game over
function gameOver() {
    document.getElementById('game-over').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    isGameOver = true;
	myGameArea.stop();
}
//winning position
function winner() {
    document.getElementById('winner').style.display = 'block';
    document.getElementById('game-over-overlay').style.display = 'block';
    isGameOver = true;
	var sound = new Howl({
        urls: ['sound/Stage clear.wav'],
        loop: false,
        volume: 0.3,
    }).play();
	myGameArea.stop();
}
function stage1() {
	myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGamePiece = new component(50, 70, "images/mario6.png", 10, 535, "image");
	gameObstacles = [new component(150, 200, "images/marioo.gif", 600, 410, "image"),new component(200, 40, "images/solid.png", 10, 400, "image"),new component(200, 40, "images/solid.png", 1140, 400, "image"),new component(40, 40, "images/single.png", 400, 300, "image"),new component(40, 40, "images/single.png", 910, 300, "image")];
	background = new component (1350,650,"images/mariob.png",0,0,"image");
    gameEnemy = [new component(50, 70, "images/marioe.png", 400, 523, "image")];
	bricks = [new component(1350, 60, "images/bricks0.png", 0, 590, "image")];
	fire = 	 [new component(50, 50, "images/bullets.png",600,150 , "image"),new component(50, 50, "images/bullets.png",600,200 , "image"),new component(50, 50, "images/bullets.png",600,250 , "image"),new component(50, 50, "images/bullets.png",600,100 , "image"),new component(50, 50, "images/bullets.png",650,100 , "image"),new component(50, 50, "images/bullets.png",700,100 , "image"),new component(50, 50, "images/bullets.png",700,150 , "image"),new component(50, 50, "images/bullets.png",650,175 , "image"),new component(50, 50, "images/bullets.png",650,225 , "image"),new component(50, 50, "images/bullets.png",700,250 , "image")];
	stars = [new component(40, 40, "images/star.png",525,100 , "image"),new component(40, 40, "images/star.png",525,150 , "image"),new component(40, 40, "images/star.png",525,200 , "image"),
	new component(40, 40, "images/star.png",525,250 , "image"),new component(40, 40, "images/star.png",475,100 , "image"),new component(40, 40, "images/star.png",425,100 , "image"),
	new component(40, 40, "images/star.png",425,150 , "image"),new component(40, 40, "images/star.png",425,200 , "image"),new component(40, 40, "images/star.png",425,250 , "image"),
	new component(40, 40, "images/star.png",475,175 , "image"),new component(40, 40, "images/star.png",350,100 , "image"),new component(40, 40, "images/star.png",350,150 , "image"),
	new component(40, 40, "images/star.png",350,200 , "image"),new component(40, 40, "images/star.png",350,250 , "image"),new component(40, 40, "images/star.png",300,150 , "image"),
	new component(40, 40, "images/star.png",250,100 , "image"),new component(40, 40, "images/star.png",250,150 , "image"),new component(40, 40, "images/star.png",250,200 , "image"),
	new component(40, 40, "images/star.png",250,250 , "image"),new component(40, 40, "images/star.png",775,100 , "image"),new component(40, 40, "images/star.png",775,250 , "image"),
	new component(40, 40, "images/star.png",825,100 , "image"),new component(40, 40, "images/star.png",825,150 , "image"),new component(40, 40, "images/star.png",825,200 , "image"),
	new component(40, 40, "images/star.png",825,250 , "image"),new component(40, 40, "images/star.png",875,250 , "image"),new component(40, 40, "images/star.png",875,100 , "image"),
	new component(40, 40, "images/star.png",950,100 , "image"),new component(40, 40, "images/star.png",950,150 , "image"),new component(40, 40, "images/star.png",950,200 , "image"),
	new component(40, 40, "images/star.png",950,250 , "image"),new component(40, 40, "images/star.png",1000,250 , "image"),new component(40, 40, "images/star.png",1000,100 , "image"),
	new component(40, 40, "images/star.png",1050,100 , "image"),new component(40, 40, "images/star.png",1050,150 , "image"),new component(40, 40, "images/star.png",1050,200 , "image"),
	new component(40, 40, "images/star.png",1050,250 , "image")];
	gameEnemies = [];
	realEnemy = [];
	}


var stage2 = function(){
	stars = [new component(40, 40, "images/star.png",400,100 , "image"),new component(40, 40, "images/star.png",450,100 , "image"),new component(40, 40, "images/star.png",500,100 , "image"),new component(40, 40, "images/star.png",550,100 , "image"),new component(40, 40, "images/star.png",600,100 , "image"),new component(40, 40, "images/star.png",550,50 , "image"),new component(40, 40, "images/star.png",550,150 , "image")];
	bricks = [];
	fire = [];
	gameEnemies = [];
	realEnemy = [];
    myGamePiece = new component(50, 70, "images/mario6.png", 10, 490, "image");
    gameEnemy = [new component(50, 70, "images/enemy.png", 400, 500, "image")];
	background = new component (1350,650,"images/background2.png",0,0,"image");
	gameObstacles = [new component(200, 40, "images/solid.png", 400, 300, "image"),new component(135, 165, "images/marioo.gif", 710, 412, "image"),new component(128, 125, "images/marioo.gif", 1050, 448, "image")];
}
var stage3 = function(){
	myGamePiece.x = 10;
	stars = [new component(40, 40, "images/star.png",400,360 , "image"),new component(40, 40, "images/star.png",450,360 , "image"),new component(40, 40, "images/star.png",500,360 , "image"),new component(40, 40, "images/star.png",550,360 , "image"),new component(40, 40, "images/star.png",600,210 , "image"),new component(40, 40, "images/star.png",650,210 , "image"),new component(40, 40, "images/star.png",700,210 , "image"),new component(40, 40, "images/star.png",750,210 , "image"),new component(40, 40, "images/star.png",800,60 , "image"),new component(40, 40, "images/star.png",850,60 , "image"),new component(40, 40, "images/star.png",900,60 , "image"),new component(40, 40, "images/star.png",950,60 , "image")];
	gameEnemy = [];
	gameEnemies = [new component(50, 70, "images/enemy.png", 350, 350, "image"),new component(50, 70, "images/enemy.png", 550, 200, "image"),new component(50, 70, "images/enemy.png", 750, 50, "image")];
	realEnemy = [new component(50, 70, "images/enemy.png", 1050, 50, "image")]
	realstar = [new component(70, 70, "images/realstar.png",1100,50 , "image")];
	bricks = [];
	background = new component (1350,650,"images/background2.png",0,0,"image");
	gameObstacles = [new component(200, 40, "images/solid.png", 400, 400, "image"),new component(200, 40, "images/solid.png", 600, 250, "image"),new component(200, 40, "images/solid.png", 800, 100, "image")];
}



/**
 * Event Handler for timer reset
 */
function handleReset(event) {
	newAnimation();
}

// interactive elements of the view.
var view = {
	timerBoxes : document.querySelectorAll('#timer span'),

	displayTime : function( time ) {
		// Assumes time is in seconds
		var minutes = Math.floor(time/60);
		var decaseconds  = Math.floor((time%60)/10);
		var seconds      = Math.floor( (time%60)%10 );
		// most significant digit
		this.timerBoxes[1].innerHTML =  minutes;
		this.timerBoxes[2].innerHTML = decaseconds;
		this.timerBoxes[3].innerHTML = seconds;
	},


	}


// #### Main Program ###
// For simplicity, I'm using a global here to keep track of the timer and the current time (the app's data model - one integer!)
var START_SECONDS = 50; // how many seconds on the timer when timer is reset
var INTERVAL = 1000; 		// interval between animation steps in seconds
var timeLeft = 0;    	// Model: time left on the timer in seconds
var timer = null;  		// the "timer" will be set when the animation starts.
newAnimation();

function newAnimation() {
	if (timer) {
		stopAnimation();
	}
	timeLeft = START_SECONDS; // timer is in seconds
	view.displayTime( timeLeft );
}

function startAnimation() {
	timer = setInterval( animate, INTERVAL);
}

function stopAnimation( end ) {
	clearInterval( timer );
	timer = null;
	if (end) {
		myGameArea.stop();
	}
}

// Finally... the big moment - our animation algorithm!! TA-DA...
function animate() {
	timeLeft--;

	if (timeLeft <= 0) {  // Important!  Stop the timer when it gets to 0
		timeLeft = 0;
		stopAnimation( true );
		gameOver();
	}

	view.displayTime( timeLeft );
}
if (timeLeft < 8)
    alert("adf");
