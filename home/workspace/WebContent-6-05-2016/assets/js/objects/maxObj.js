function maxObj(startX, startY){
    this.startPos = new Phaser.Point(startX, startY);
    this.load = max_load;
    this.update = max_update;
}

function max_load(){
    //basics
    this.sprite = game.add.sprite(this.startPos.x, this.startPos.y, "max");
    this.sprite.smoothed = false;
    this.sprite.anchor.set(0.5, 1);
    
    //animations
    this.sprite.animations.add("look");
    
    //physics
    game.physics.p2.enable(this.sprite);
    this.sprite.body.setCollisionGroup(characterCollisionGroup);
    this.sprite.body.collides([worldCollisionGroup]);
    
    this.sprite.body.angularDamping = 0.3;
    this.sprite.body.friction = 0;
}

function max_update(){
        //movement
    this.sprite.body.velocity.x = 0;
    if (isJak == false){
        if (moveRight){
            this.sprite.body.velocity.x = 250;
        }
        else if (moveLeft){
            this.sprite.body.velocity.x = -250;
        }
        if (jump){
            if (touchingDown(this.sprite.body)){
                this.sprite.body.velocity.y = -410
            }
        }
    }
    
        //physics
    this.sprite.body.angle -= this.sprite.body.angle;
    
        //randomly play the look animation
    if (Math.random() > 0.99){
        this.sprite.animations.play("look", 2, false);
    }
    
    
    //game.camera.focusOnXY(this.sprite.x, this.sprite.y);
}