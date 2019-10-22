function endDoorsObj(offPutX, offPutY){
    this.load = endDoors_load;
    this.update = endDoors_update;
    this.offPut = new Phaser.Point(offPutX, offPutY);
}

function endDoors_load(){
    //basics
    this.group = game.add.group();
    map.createFromObjects("endDoors", 11, "endDoor", 0, true, false, this.group);
    
    for (var i = 0; i < this.group.children.length; i++){
        this.group.children[i].anchor.set(0.5, 1);
        this.group.children[i].smoothed = true
        
        this.group.children[i].x += this.offPut.x;
        this.group.children[i].y += this.offPut.y;
    }
}

function endDoors_update(){
}