var game = new Phaser.Game(1280, 720






















, Phaser.CANVAS); //create the game will be refered to almost everything

    //add the game states
game.state.add("menu", menu);
game.state.add("levelSelector", levelSelector);
game.state.add("level1", level1)
game.state.add("level2", level2)
game.state.add("level3", level3)

game.state.start("menu"); //set the starting game state


//GLOBAL DECLERATIONS//
    /*every thing that will need to be used over multiple game states will go here, including variables and functions
    perhaps another file would have been appropiate for this purpose, but I didn't think it necessary*/
    
    //map stuff
var map;
var layer;

    //objects
var max;
var jak;
var crates;
var pressurePlates;
var tiles;
var slideDoors;
var endDoors;

    //hud stuff
var timerText;
var bestTimeText;
var yourTimeText;
var pauseButton;
var charSelect;

var hudMenuNum = 2;
var hudButtonScale = 1;
var hudButtonY = 210;
var hudButtonX = 300;
var hudButtonDif = 125;
var hudButtons = new Array(hudMenuNum);

var hudTextDifX = 0;
var hudTextDifY = 2;
var hudTexts = new Array(hudMenuNum);

var overlay;

    //groups
var worldCollisionGroup;
var characterCollisionGroup;

    //game states
var maxFinish = false;
var jakFinish = false;
var isJak = false;
var completedLevel = false;
var paused = false;

    //controls
var activeCheck = new Array(2);
activeCheck[0] = false;
var released = new Array(2);

var moveLeft, moveRight, jump;
var jumpActivateLength = 5, jumpActivateTime = 150;

    //timer
var timeString;
var elapsedTime = 0;
var startTime;
var pauseTimer = false;

    //sliding doors
var doOnceSD = new Array(4);
for (var i = 0; i < 4; i++){
    doOnceSD[i] = false;
}


    //useful functions
function checkOverlap(boundsA, boundsB, offputX, offputY) {
    boundsA.x += offputX;
    boundsA.y += offputY;
    
    boundsA.bottom = Math.floor(boundsA.bottom);
    boundsA.y = Math.floor(boundsA.y);

    if (boundsA.right <= boundsB.x)
    {
        return false;
    }

    if (boundsA.bottom <= boundsB.y)
    {
        return false;
    }

    if (boundsA.x >= boundsB.right)
    {
        return false;
    }

    if (boundsA.y >= boundsB.bottom)
    {
        return false;
    }

    return true;
}
function touchingDown(someone) {
    var yAxis = p2.vec2.fromValues(0, 1);
    var result = false;
    
    for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {
        
        var c = game.physics.p2.world.narrowphase.contactEquations[i];
        if (c.bodyA === someone.data || c.bodyB === someone.data) {
            var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis
            if (c.bodyA === someone.data) d *= -1;
            if (d > 0.5){
                result = true;
            }
        }
    }
    
    return result;
}
function sign(number){
    if (number == 0){
        return 0;
    }
    return number/Math.abs(number);
}

    //change level functions
function gotoLevel1(){
    game.state.start("level1");
}
function gotoLevel2(){
    game.state.start("level2");
}
function gotoLevel3(){
    game.state.start("level3");
}
function gotoMenu(){
    game.state.start("menu");
}
function gotoLevelSelector(){
    game.state.start("levelSelector");
}
function destroyGame(){
    game.destroy();
}

    //game specific functions
function updateCounter(){
    //UPDATE THE ELAPSED TIME
    if (!pauseTimer){
        elapsedTime = game.time.time - startTime;
    }
}
function convertTime(ms){
    //CREATE A TIME STYLED STRING FROM THE MS PROVIDED//
    var minutes = Math.floor(ms / 60000) % 60;
    var seconds = Math.floor(ms / 1000) % 60;
    var milliseconds = Math.floor(ms) % 1000;
    //If any of the digits becomes a single digit number, pad it with a zero
    if (milliseconds < 10){
        milliseconds = '0' + milliseconds;
    }
    if (seconds < 10){
        seconds = '0' + seconds;
    }
    if (minutes < 10){
        minutes = '0' + minutes;
    }
    
    return minutes+":"+seconds+":"+milliseconds;
}
function restartLevel(){
    //ENSURE THAT THE LEVEL RESTARTS SMOOTHLY//
    resetVariables();
    game.state.start(game.state.current);
}
function resetVariables(){
    //RESET ALL VARIABLES SO THAT WHEN GAME IS RESTARTED, EVERYTHING WORKS SMOOTHLY//
    elapsedTime = 0;
    pauseTimer = false;
    maxFinish = false;
    jakFinish = false;
    completedLevel = false
    paused = false;
    isJak = false;
    moveLeft = false;
    moveRight = false;
    jump = false;
}
function levelComplete(){
    //DO EVERYTHING THAT HAS TO BE WHEN THE LEVEL IS COMPLETE
        //level 1
    if (game.state.current == "level1"){
        if (localStorage.getItem("level1Time") !== null){ // if high score is set
            if (elapsedTime < localStorage.getItem("level1Time")){ // if they beat it
                localStorage.setItem("level1Time", elapsedTime);
            }
        }
        else{
            localStorage.setItem("level1Time", elapsedTime); // if no high score is set; then they automatically must have high score
        }
    }
        //level 2
    else if (game.state.current == "level2"){
        if (localStorage.getItem("level2Time") !== null){
            if (elapsedTime < localStorage.getItem("level2Time")){
                localStorage.setItem("level2Time", elapsedTime);
            }
        }
        else{
            localStorage.setItem("level2Time", elapsedTime);
        }
    }
        //level 2
    else if (game.state.current == "level3"){
        if (localStorage.getItem("level3Time") !== null){
            if (elapsedTime < localStorage.getItem("level3Time")){
                localStorage.setItem("level3Time", elapsedTime);
            }
        }
        else{
            localStorage.setItem("level3Time", elapsedTime);
        }
    }
    
        //set variables
    pauseTimer = true;
    completedLevel = true;
}
function toggleJak(){
    isJak = !isJak;
}

    //level functions
function setupControls(){
    this.eKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
    this.eKey.onUp.add(toggleJak, game);
}
function setupPhysics(){
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.setImpactEvents(true);
    game.physics.p2.gravity.y = 1100;
}
function handleControls(){
    //CONTROLS//
        //reset certain booleans
    moveLeft = false;
    moveRight = false;
    jump = false;
    
    //CHECK FOR TOUCH SCREEN RELEASES//
        //reset releases
    for (var i = 0; i < released.length; i++){
        released[i] = false;
    }
        //pointer 1
    if (game.input.pointer1.active){
        activeCheck[0] = true;
    }
    else if (activeCheck[0]){
        activeCheck[0] = false;
        released[0] = true;
    }
        //pointer 2
    if (game.input.pointer2.active){
        activeCheck[1] = true;
    }
    else if (activeCheck[1]){
        activeCheck[1] = false;
        released[1] = true;
    }
    
    //MOBILE CONTROLS//
        //move left and right, by touching the left and right hand sides of the screen
        //pointer 1
    if (game.input.pointer1.isDown){
        if (game.input.pointer1.screenX > game.world.width*(4/5)){ //right most fifth of screen
            moveRight = true;
        }
        else if (game.input.pointer1.screenX < game.world.width*(1/5)){//left most fifth of screen
            moveLeft = true;
        }
    }
        //pointer 2
    if (game.input.pointer2.isDown){
        if (game.input.pointer2.screenX > game.world.width*(4/5)){
            moveRight = true;
        }
        else if (game.input.pointer2.screenX < game.world.width*(1/5)){
            moveLeft = true;
        }
    }
    
        //check for jumps - done in the middle 3/5 of the screens
        //pointer 1
    if (game.input.pointer1.isDown){
        if (game.input.pointer1.screenX < game.world.width*(4/5) && game.input.pointer1.screenX > game.world.width*(1/5)
        && game.input.pointer1.screenY > 64+140){ //the middle 3/5 of the screen
            jump = true;
        }
    }
        //pointer 2
    if (game.input.pointer2.isDown){
        if (game.input.pointer2.screenX < game.world.width*(4/5) && game.input.pointer2.screenX > game.world.width*(1/5)
        && game.input.pointer1.screenY > 64+140){
            jump = true;
        }
    }
    
        //PC controls
    if (game.input.keyboard.isDown(Phaser.Keyboard.D)){
        moveRight = true;
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.A)){
        moveLeft = true;
    }
    if (game.input.keyboard.isDown(Phaser.Keyboard.W)){
        jump = true;
    }
}
function handleLevelEnd(){
    //END THE GAME//
        //if they complete the level
    if (checkOverlap(max.sprite.getBounds(), endDoors.group.children[0].getBounds(), 0, 0)){ //if max colliding with end door
        maxFinish = true;
    }
    else{
        maxFinish = false;
    }
    
    if (checkOverlap(jak.sprite.getBounds(), endDoors.group.children[0].getBounds(), 0, 0)){ //if jak colliding with end door
        jakFinish = true;
    }
    else{
        jakFinish = false;
    }
        //if they fall to their death
    if (jak.sprite.y > 1500){
        restartLevel();
    }
    
    //LEVEL CONTOROL//
        //restart level
    if (game.input.keyboard.isDown(Phaser.Keyboard.R)){
        restartLevel();
    }
        //solved level
    if ((maxFinish && jakFinish) || game.input.keyboard.isDown(Phaser.Keyboard.T)){
        levelComplete();
    }
    /*note that mobile level control is done through event actions in the on screen buttons, these buttons are part of the hud, and as such created there (check the booter file)*/
}

    //hud functions
function unpause(){
    paused = false;
}
function pause(){
    hudButtons[0].events.onInputDown.add(unpause, game);
    hudButtons[1].events.onInputDown.add(gotoMenu, game);
    paused = true;
}
function loadHud(){
    //CREATE ALL OBJECTS THAT ARE NEEDED FOR THE HUD//
    overlay = game.add.sprite(-1, -1, "overlay");
    
    timerText = game.add.text(32, 32, "00:00:00", { font: "normal 20px Courier"})
    timerText.addColor("#ebebeb", 0);
    timerText.fixedToCamera = true;
    
    yourTimeText = game.add.text(game.world.centerX, 64, "", { font: "normal 20px Courier"})
    yourTimeText.anchor.set(0.5);
    yourTimeText.addColor("#ebebeb", 0);
    yourTimeText.fixedToCamera = true;
    
    bestTimeText = game.add.text(game.world.centerX, 96, "", { font: "normal 20px Courier"})
    bestTimeText.anchor.set(0.5);
    bestTimeText.addColor("#ebebeb", 0);
    bestTimeText.fixedToCamera = true;
    
    pauseButton = game.add.sprite(game.world.width - 32, 32, "pauseButton");
    pauseButton.anchor.set(1, 0);
    pauseButton.fixedToCamera = true;
    pauseButton.inputEnabled = true;
    pauseButton.events.onInputDown.add(pause, game);
    
    restartButton = game.add.sprite(game.world.width - 32, game.world.height - 32, "restartButton");
    restartButton.anchor.set(1, 1);
    restartButton.fixedToCamera = true;
    restartButton.inputEnabled = true;
    restartButton.events.onInputDown.add(restartLevel, game);
    
    charSelect = game.add.sprite(game.world.centerX, 0, "charSelect");
    charSelect.anchor.set(0.5, 0);
    charSelect.fixedToCamera = true;
    charSelect.inputEnabled = true;
    charSelect.events.onInputDown.add(toggleJak, game);
    
    for (var i = 0; i < hudMenuNum; i++){
        hudButtons[i] = game.add.sprite(game.world.centerX, hudButtonY + (i*hudButtonDif), "button");
        hudButtons[i].anchor.set(0.5);
        hudButtons[i].smoothed = false;
        hudButtons[i].scale.set(hudButtonScale);
        hudButtons[i].inputEnabled = true;
        hudButtons[i].fixedToCamera = true;
        hudButtons[i].visible = false;
        
        hudTexts[i] = game.add.text(game.world.centerX+hudTextDifX, hudButtonY + (i*hudButtonDif) + hudTextDifY, "", { font: "normal 35px Courier"});
        hudTexts[i].anchor.set(0.5);
        hudTexts[i].fixedToCamera = true;
        hudTexts[i].addColor("#D1D1D1", 0);
    }
}
function updateHud(){
    if (completedLevel == true){
        //DO HUD STUFF FOR WHEN THEY COMPLETE THE GAME//
            //create a semi-transparent black overlay over the screen.
        overlay.x = -1000;
        overlay.y = -1000;
        overlay.scale.set(game.world.width*10, game.world.height*10);
        overlay.alpha = 0.3;
        
            //disable timer, pause and restart buttons
        timerText.setText("");
        pauseButton.visible = false;
        restartButton.visible = false;
        charSelect.visible = false;
        
            //set the text displaying high score and your score
            //level 1
        if (game.state.current == "level1"){
            if (localStorage.getItem("level1Time") != null){
                if (elapsedTime > localStorage.getItem("level1Time")){ // if they didn't beat high score
                    yourTimeText.setText("your time: " + convertTime(elapsedTime));
                    bestTimeText.setText("best time: " + convertTime(localStorage.getItem("level1Time")));
                }
                else{ //if they did beat the high score
                    bestTimeText.setText("new best: " + convertTime(localStorage.getItem("level1Time")));
                }
            }
            else{ //if no high score was set
                bestTimeText.setText("new best: " + convertTime(localStorage.getItem("level1Time")));
            }
        }
            //level 2
        else if (game.state.current == "level2"){
            if (localStorage.getItem("level2Time") != null){
                if (elapsedTime > localStorage.getItem("level2Time")){
                    yourTimeText.setText("your time: " + convertTime(elapsedTime));
                    bestTimeText.setText("best time: " + convertTime(localStorage.getItem("level2Time")));
                }
                else{
                    bestTimeText.setText("new best: " + convertTime(localStorage.getItem("level2Time")));
                }
            }
            else{
                bestTimeText.setText("new best: " + convertTime(localStorage.getItem("level2Time")));
            }
        }
            //level 2
        else if (game.state.current == "level3"){
            if (localStorage.getItem("level3Time") != null){
                if (elapsedTime > localStorage.getItem("level3Time")){
                    yourTimeText.setText("your time: " + convertTime(elapsedTime));
                    bestTimeText.setText("best time: " + convertTime(localStorage.getItem("level3Time")));
                }
                else{
                    bestTimeText.setText("new best: " + convertTime(localStorage.getItem("level3Time")));
                }
            }
            else{
                bestTimeText.setText("new best: " + convertTime(localStorage.getItem("level3Time")));
            }
        }
        
            //display the two HUD buttons
        for (var i = 0; i < 2; i++){
            hudButtons[i].visible = true;
        }
            //set the texts
        hudTexts[0].setText("restart");
        hudTexts[1].setText("exit");
        
            //create the actions that happen for these buttons
        hudButtons[0].events.onInputDown.add(restartLevel, game);
        hudButtons[1].events.onInputDown.add(gotoMenu, game);
    }
    else{ // if they haven't completed the level (just normal game)
        timerText.setText(convertTime(elapsedTime)); //set the timer to current elapsed time
            //make pause and restart button visible
        pauseButton.visible = true;
        restartButton.visible = true;
        charSelect.visible = true;
        
            //make invisible all the stuff that would show if they completed the level
        yourTimeText.setText("");
        bestTimeText.setText("");
        for (var i = 0; i < hudMenuNum; i++){
            hudButtons[i].visible = false;
            hudTexts[i].setText("");
        }
    }
    if (paused == true){ // if the game is paused
            //set invisible the level complete buttons
        pauseButton.visible = false;
        restartButton.visble = false;
        
        for (var i = 0; i < 2; i++){ //make visible the pause hud buttons
            hudButtons[i].visible = true;
        }
        hudTexts[0].setText("resume"); //set the texts
        hudTexts[1].setText("exit");
    }
    
    if (!isJak){
        charSelect.frame = 0;
    }
    else{
        charSelect.frame = 1;
    }
}

    //sliding doors
function moveDoorUp(PP, door, amount, speed){
    //SLIDING DOORS//
    if (pressurePlates.pressed[PP]){ //check if the pressure plate is pressed
        if (slideDoors.group.children[door].body.y > slideDoors.startPos[door].y-amount+1){ //move door up, until it hits a limit
            slideDoors.group.children[door].body.y -= speed;
        }
    }
    else{
        if (slideDoors.group.children[door].body.y < slideDoors.startPos[door].y-1){ //move door down, until it hits a limit
            slideDoors.group.children[door].body.y += speed;
        }
    }
}
function moveDoorRight(PP, door, amount, speed){
    if (pressurePlates.pressed[PP]){
        if (slideDoors.group.children[door].body.x < slideDoors.startPos[door].x+amount-1){ //move door right, until it hits a limit
            slideDoors.group.children[door].body.x += speed;
        }
    }
    else{
        if (slideDoors.group.children[door].body.x > slideDoors.startPos[door].x+1){ //move door left, until it hits a limit
            slideDoors.group.children[door].body.x -= speed;
        }
        
    }
}
function rotateDoor(PP, angle, xMove, yMove){
    //CORRECT PLATFORM ORIENTATIONS & POSITIONS//
        slideDoors.group.children[PP].body.angle = angle;
            //fix position
        slideDoors.group.children[PP].body.x += xMove;
        slideDoors.startPos[PP].x += xMove;
        slideDoors.group.children[PP].body.y += yMove;
        slideDoors.startPos[PP].y += yMove;
}

    //sounds
function handleSounds(){
    for (var i = 0; i < pressurePlates.group.children.length; i++){
        if (pressurePlates.justPressed[i] == true){
            game.sound.play("snd_slidingDoor");
        }
        if (pressurePlates.justReleased[i] == true){
            game.sound.play("snd_slidingDoorDown");
        }
    }
}