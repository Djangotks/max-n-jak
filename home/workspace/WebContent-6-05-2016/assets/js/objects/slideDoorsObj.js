function slideDoorsObj(offPutX, offPutY){
    this.load = slideDoors_load;
    this.update = slideDoors_update;
    this.offPut = new Phaser.Point(offPutX, offPutY);
}

function slideDoors_load(){
    //basics
    this.group = game.add.group();
    this.startPos = new Array();
    this.velocityX = new Array();
    this.velocityY = new Array();
    map.createFromObjects("slideDoors", 7, "slideDoor", 0, true, false, this.group);
    
    for (var i = 0; i < this.group.children.length; i++){
        this.group.children[i].anchor.set(0.5, 1);
        this.group.children[i].smoothed = true
        
        this.group.children[i].x += this.offPut.x;
        this.group.children[i].y += this.offPut.y;
        
        this.startPos.push(new Phaser.Point(this.group.children[i].x, this.group.children[i].y));
        this.velocityX.push(false);
        this.velocityY.push(false);
    }
    
    //physics
    for (var i = 0; i < this.group.children.length; i++){
        game.physics.p2.enable(this.group.children[i]);
        this.group.children[i].body.setCollisionGroup(worldCollisionGroup);
        this.group.children[i].body.collides([worldCollisionGroup, characterCollisionGroup]);
        this.group.children[i].body.static = true;
    }
}

function slideDoors_update(){
    for (var i = 0; i < this.group.children.length; i++){
        this.group.children[i].body.x += this.velocityX[i];
        this.group.children[i].body.y += this.velocityY[i];
    }
}