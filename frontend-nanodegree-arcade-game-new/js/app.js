
//modal function from: https://www.w3schools.com/howto/howto_css_modals.asp
//declaring variables for the modals (lives finished & game over). 
var modals = document.getElementsByClassName('modal');

// getting the span elements
var spans = document.getElementsByClassName("close");

//restart button on the modals
var restartButton = document.getElementsByClassName("restart");


//closing modals on the click of 'x'
//lives over
spans[0].onclick = function() {
    modals[0].classList.toggle("opened");
}

//game won
spans[1].onclick = function() {
    modasl[1].classList.toggle("opened");
}

// closing modals if the user clicks anywhere outside of it
window.onclick = function(event) {
    if (event.target == modals[0]) {
        modals[0].classList.toggle("opened");
    }

    if (event.target == modals[1]) {
        modals[1].classList.toggle("opened");
    }
}

//restarting the game
//lives over
restartButton[0].onclick = function(){
    showHearts();

    //hide the modal
    modals[0].classList.toggle("opened");

    //restart the bugs
    restartBugs(allEnemies);

    //update the score to 0
    scoreBoard.score = 0;

    //reset the collisionCounter to 0 so the player can start with 3 lives again
    // allEnemies.forEach(function(enemy){
    //     enemy.collisionCounter = 0;
    // });
    collisionCounter = 0;
}

//game won
restartButton[1].onclick = function(){
    //show hearts
    showHearts();

    //hide the modal
    modals[1].classList.toggle("opened");

    //restart the bugs
    restartBugs(allEnemies);

    //update the score to 0
    scoreBoard.score = 0;

    //reset the collisionCounter to 0 so the player can start with 3 lives again
    // allEnemies.forEach(function(enemy){
    //     enemy.collisionCounter = 0;
    // });
    collisionCounter = 0;
}

function showHearts(){
    heart1.show();
    heart2.show();
    heart3.show();
};

function restartBugs(array){
    array.forEach(function(enemy) {
        enemy.speed = speedGenerator();
    });
};

//setting up a collision counter variable 
var collisionCounter = 0;

class Enemy {
    constructor(z, speed) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';
        this.x = -70;
        this.y = z;
        this.speed = speed;
        // this.collisionCounter = 0;
    }
    
    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt){
        if(this.x < 505){
            this.x += this.speed * dt;
            }
            else {
                this.x = -70;
            }
        //2D collision detection function from: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
        if (this.x < player.x + 55 &&
            this.x + 60 > player.x &&
            this.y < player.y + 92 &&
            65 + this.y > player.y){
                //if the collision occurs, reset the player
                player.x = 200;
                player.y = 400;
                
                //if the collision occurs, remove one of the hearts
                switch(collisionCounter){
                    case 0:
                        heart3.remove();
                        collisionCounter = 1;
                        break;
                    case 1:
                        heart2.remove();
                        collisionCounter = 2;
                        break;
                    case 2:
                        heart1.remove();
                        collisionCounter = 3;
                        //show the modal saying that the lives are finished
                        modals[0].classList.toggle("opened");

                        //stop the bugs
                        allEnemies.forEach(function(enemy) {
                            enemy.speed = 0;
                        });

                        break;
                }
            }
        }  

    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // Draw the enemy on the screen, required method for game
    render(){
         ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    stop(){
        this.speed = 0;
    }
};

//a function to generate random speed number

function speedGenerator(){
    return (Math.floor(Math.random() * 181) + 40);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


class Player {
    constructor(){
        this.sprite = 'images/char-boy.png';
        this.x = 200;
        this.y = 400;
    }

    update(dt) {
       //console.log('updated');
    }

    render(){
         ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(keyPressed){
        switch(keyPressed){
            case 'left':
                if(this.x > 0){
                    this.x -= 100;
                }
                break;
            case 'right':
                if(this.x < 400){
                    this.x += 100;
                }
                break;
            case 'up':
                if(this.y > 0){
                    this.y -= 80;
                }
                break;
            case 'down':
                if (this.y < 400){
                    this.y += 80;
                }
                break;
        }
    }


    //reset the player to the initial position once it reached the water
    reset(){
        if(this.y === 0){
            this.x = 200;
            this.y = 400;

            //increase the score by 100 points if the player reached the water
            scoreBoard.score += 100;

            // if the score is more than 1000, show game won modal & stop all enemies
            if(scoreBoard.score >= 1000){
                modals[1].classList.toggle("opened");
                
                //stop all enemies from moving
                allEnemies.forEach(function(enemy) {
                    enemy.stop();
                });
            }
        }
    }
}

//create a class of hearts for the lives count
class Heart {
    constructor(x){
        this.sprite = "images/Heart.png";
        this.x = x;
        this.y = 0;
        this.width = 30;
        this.height = 50;
    }

    render(){
         ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
    }

    remove(){
        this.width = 0;
    }

    show(){
        this.width = 30;
    }
}

//create score
class Score {
    constructor(score){
        this.x = 360;
        this.y = 30;
        this.score = score;
    }

    render(){
        ctx.font = "30px Arial";
        ctx.fillText(this.score + " points", this.x, this.y);
    }
}


//create a variable to store the score
var gemScore = 500;
//create collectibles
class Gem {
    constructor(positionX, positionY, sprite){
        this.sprite = sprite;
        this.x = positionX;
        this.y = positionY;
        this.width = 80;
        this.height = 120;
    }

    update(){
        
        //detect a collision with a gem, increase the score
        if (this.x > player.x &&
            this.x + this.width < player.x + 100 &&
            this.y > player.y &&
            this.y < player.y + 80){
                scoreBoard.score += 150;
                removeGem(this);
        }

        //if score is more than 500, recreate gems
        if (scoreBoard.score >= gemScore){
            recreateGems(this);
            gemScore += 500;
        };
    };

    render(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
    };
}

//removing the gem once the collision is detected
function removeGem(gemToRemove){
	allGems.forEach(function(gem){
		if(gem.sprite === gemToRemove.sprite){
			allGems.delete(gemToRemove);
		}
	});
    // allGems = allGems.filter(function(gem) {
    //     return gem.sprite !== gemToRemove.sprite;
    // });
}

//recreating gems (clearing the allGems array & switching their positions)
function recreateGems(gemToPush){
	allGems.clear();
	allGems.add(blueGem);
	allGems.add(orangeGem);
	allGems.add(greenGem);

    blueGem.x = 310;
    blueGem.y = 95;
   
    orangeGem.x = 106;
    orangeGem.y = 180;
  
    greenGem.x = 411;
    greenGem.y = 265;
};


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
//initializing Enemies
const newEnemy = new Enemy(65, speedGenerator());
const newEnemy1 = new Enemy(65, speedGenerator());
const newEnemy2 = new Enemy(148, speedGenerator());
const newEnemy3 = new Enemy(148, speedGenerator());
const newEnemy4 = new Enemy(231, speedGenerator());
const newEnemy5 = new Enemy(231, speedGenerator());

//initiating player
const player = new Player();

//storing enemies in an array
let allEnemies = [newEnemy, newEnemy1, newEnemy2, newEnemy3, newEnemy4, newEnemy5];

//initiating hearts
const heart1 = new Heart(15);
const heart2 = new Heart(45);
const heart3 = new Heart(75);

let allHearts = [heart1, heart2, heart3];

//initiate score

let scoreBoard = new Score(0);

//creating an array to store all the gems
//initiating gems
let blueGem = new Gem(5, 95, 'images/Gem Blue.png');
let orangeGem = new Gem(110, 180, 'images/Gem Orange.png');
let greenGem = new Gem(310, 265, 'images/Gem Green.png');

//storing all gems in the array
let allGems = new Set([blueGem, orangeGem, greenGem]);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
    player.reset();
});
