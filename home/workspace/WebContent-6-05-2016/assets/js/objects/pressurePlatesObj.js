function pressurePlatesObj(offPutX, offPutY){
    this.load = pressurePlates_load;
    this.update = pressurePlates_update;
    this.offPut = new Phaser.Point(offPutX, offPutY);
}

function pressurePlates_load(){
    //basics
    this.group = game.add.group();
    this.pressed = new Array();
    
    this.justPressed = new Array();
    this.justReleased = new Array();
    this.previousPressed = new Array();
    
    map.createFromObjects("pressurePlates", 5, "pressurePlate", 0, true, false, this.group);
    
    for (var i = 0; i < this.group.children.length; i++){
        this.group.children[i].anchor.set(0.5, 1);
        this.group.children[i].smoothed = false
        
        this.group.children[i].x += this.offPut.x;
        this.group.children[i].y += this.offPut.y;
        
        this.justPressed.push(false);
        this.justReleased.push(false);
        this.previousPressed.push(false);
    }

    for (var i = 0; i < this.group.children.length; i++){
        this.pressed.push(false);
    }
}

function pressurePlates_update(){
    //check collisions with certain objects
    for (var i = 0; i < this.group.children.length; i++){
        this.pressed[i] = false;
        if (checkOverlap(this.group.children[i].getBounds(), max.sprite.getBounds(), 0, 0)){
            this.pressed[i] = true;
        }
        else if (checkOverlap(this.group.children[i].getBounds(), jak.sprite.getBounds(), 0, 0)){
            this.pressed[i] = true;
        }
        for (var a = 0; a < crates.group.children.length; a++){
            if (checkOverlap(this.group.children[i].getBounds(), crates.group.children[a].getBounds(), 0, 0)){
                this.pressed[i] = true;
            }
        }
    }
    
    //check for just released and just pressed
    for (var i = 0; i < this.group.children.length; i++){
        if (this.previousPressed[i] != this.pressed[i]){
            if (this.pressed[i] == true){
                this.justPressed[i] = true;
            }
            else{
                this.justReleased[i] = true;
            }
        }
        else{
            this.justPressed[i] = false;
            this.justReleased[i] = false;
        }
    }
    
    //set the previous pressed state
    for (var i = 0; i < this.group.children.length; i++){
        this.previousPressed[i] = this.pressed[i];
    }
    
    //change the sprite index when pressureplate is down
    for (var i = 0; i < this.group.children.length; i++){
        if (this.pressed[i]){
            this.group.children[i].frame = 1;
        }
        else{
            this.group.children[i].frame = 0;
        }
    }
}