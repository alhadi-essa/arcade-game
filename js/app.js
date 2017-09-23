var Enemy = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    // The image/sprite for load enemies image
    this.sprite = "images/enemy-bug.png";
    //this.sprite = 'images/enemy-skull.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    //reset enemy position to the left after reaching canvas width
    if (this.x >= 700) {
        this.x = 0;
    }

    //check for collision and reset the game
    if (
        player.y + 131 >= this.y + 90
        && player.x + 25 <= this.x + 88
        && player.y + 73 <= this.y + 135
        && player.x + 76 >= this.x + 11) {
        console.log("collided");
        document.getElementById('sound-one').play();
    //if collision detect live decrease by 1
        live = live -1;
        increaseDifficulty(Math.floor((Math.random(score) * 10) + 1));
    //Check if player lives end to reset the game
        if (live == 0){
            document.getElementById('sound-three').play();
            alert('Game Over Please Click Ok To Start Play Again')
            window.location.reload();
        }
        player.x = 402.5;
        player.y = 383;
    }
};


// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
            ctx.drawImage(Resources.get(this.sprite), this.x , this.y);
};


// write player class
var Player = function() {
    this.playerList = [
        'images/char-cat-girl.png',
        'images/char-horn-girl.png',
        'images/char-boy.png',
        'images/char-pink-girl.png',
        'images/char-princess-girl.png',
        'images/char-cat-rapit.png',
        'images/ninja.png',
        'images/knight.png'
    ];
    //player default location
    this.x = 2 * 101;
    this.y = 6 * 83 - 20;
    this.selector = 'images/Selector.png';
    this.selectorId = 2;
    this.isSelected = false;
};


Player.prototype.update = function(dt) {
    //prevent player from moving off the bottom of the screen
    if (this.y > 383) {
        this.y = 383;
    }

    //prevent player from moving off the screen to the right
    if (this.x > 700) {
        this.x = 700;
    }

    //prevent player from moving off the screen to the left
    if (this.x < 2.5) {
        this.x = 2.5;
    }

    //check if player reaches the water and wins the game
    //if player wins, increase score and level by 1
    if (this.y + 65 <= 0 ) {
        this.x = 402.5;
        this.y = 383;
        document.getElementById('sound-two').play();
        score += 1;
        gameLevel += 1;
        console.log("current score: " + score + ", current level: " + gameLevel );
        increaseDifficulty(score);
    }
};

Player.prototype.render = function() {
    var id = this.selectorId;
    if (this.isSelected === true) {
        ctx.drawImage(Resources.get(this.playerList[id]), this.x, this.y);
            displayScoreLevel(score, gameLevel,live);

    } else {
        var pList = this.playerList;
        ctx.drawImage(Resources.get(this.selector), this.selectorId * 101, 5 * 83 - 20);
        for (var player in pList) {
            ctx.drawImage(Resources.get(pList[player]), player * 101, 5 * 83 - 20);
        }
    }
};

Player.prototype.handleSelectInput = function(input) {
    var id = this.selectorId;
    if (this.isSelected === false)
        switch (input) {
            case 'left':
                if (id > 0) this.selectorId -= 1;
                break;
            case 'right':
                if (id < 7) this.selectorId += 1;
                break;
            case 'enter':
                this.isSelected = true;
        }
};
// a handleInput() method.
Player.prototype.handleInput = function(keycode) {
    switch(keycode) {
        case "left":
            this.x -= 100;
            break;
        case "right":
            this.x += 100;
            break;
        case "up":
            this.y -= 90;
            break;
        case "down":
            this.y += 90;
            break;
    }
};

//Display Score on Screen
var displayScoreLevel = function(aScore, aLevel,live) {
    var canvas = document.getElementsByTagName("canvas");
    var firstCanvasTag = canvas;

    //add player score, level and Live to created div to show om screen
    scoreLevelDiv.innerHTML = "Score: " + aScore +" &#9733 "+ " &brvbar; " + "Level: " + aLevel + " &#9812 " + " &brvbar; " + "Lives: " + live + " &hearts;";
    document.body.insertBefore(scoreLevelDiv, firstCanvasTag[0]);
};


var increaseDifficulty = function(numEnemies) {
    //remove enemies
    allEnemies.length = 0;

    //load new set of enemies
    for (var i = 0; i <= numEnemies; i++) {
        var enemy = new Enemy(0, Math.random() * 184 + 50, Math.random() * 256);
    // Push the new enemy to AllEnemies Array
        allEnemies.push(enemy);
    }
};

// Set Game Sittings
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
// Enemy randomly placed vertically within section of canvas
// Declare new score,gameLevel and Live Variables to store score and level
var allEnemies = [];
var player = new Player();
var live =3;
var score = 0;
var gameLevel = 1;
var scoreLevelDiv = document.querySelector(".scoreLevelDiv");
var enemy = new Enemy(0, Math.random() * 184 + 50, Math.random() * 256);

allEnemies.push(enemy);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    var allowedSelectKeys = {
        37: 'left',
        13: 'enter',
        39: 'right',
    };
    player.handleSelectInput(allowedSelectKeys[e.keyCode]);
    player.handleInput(allowedKeys[e.keyCode]);
});