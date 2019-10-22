function cratesObj(offPutX, offPutY){
    this.load = crates_load;
    this.update = crates_update;
    this.offPut = new Phaser.Point(offPutX, offPutY);
}

function crates_load(){
    //basics
    this.group = game.add.group();
    map.createFromObjects("crates", 3, "crate", 0, true, false, this.group);
    
    for (var i = 0; i < this.group.children.length; i++){
        this.group.children[i].anchor.set(0.5, 1);
        this.group.children[i].smoothed = true
        
        this.group.children[i].x += this.offPut.x;
        this.group.children[i].y += this.offPut.y;
    }
    
    //physics
    for (var i = 0; i < this.group.children.length; i++){
        game.physics.p2.enable(this.group.children[i]);
        this.group.children[i].body.setCollisionGroup(worldCollisionGroup);
        this.group.children[i].body.collides([worldCollisionGroup, characterCollisionGroup]);
        this.group.children[i].body.mass = 1;
        this.group.children[i].body.static = false;
    }
}

function crates_update(){
    for (var i = 0; i < this.group.children.length; i++){
        this.group.children[i].body.angle -= this.group.children[i].body.angle/1.5;
        this.group.children[i].body.velocity.x -= this.group.children[i].body.velocity.x/7.5;
    }
}