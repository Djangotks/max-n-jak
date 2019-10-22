function jakObj(startX, startY){
    this.startPos = new Phaser.Point(startX, startY);
    this.load = jak_load;
    this.update = jak_update;
}

function jak_load(){
    //basics
    this.sprite = game.add.sprite(this.startPos.x, this.startPos.y, "jak");
    this.sprite.smoothed = false;
    /*this.light = game.add.sprite(this.startPos.x, this.startPos.y, "light")
    this.light.anchor.set(0.5, 0.5);
    this.light.scale.set(10, 10);
    this.light.smoothed = true;*/
    
    //animations
    this.sprite.animations.add("blink");
    
    //physics
    game.physics.p2.enable(this.sprite);
    this.sprite.body.setCollisionGroup(characterCollisionGroup);
    this.sprite.body.collides([worldCollisionGroup]);
}

function jak_update(){
    //movement
    this.sprite.body.velocity.x = 0;
    if (isJak == true){
        if (moveRight){
            this.sprite.body.velocity.x = 100;
            
        }
        else if (moveLeft){
            this.sprite.body.velocity.x = -100;
        }
        if (moveLeft || moveRight){
            this.sprite.body.mass = 0.001;
        }
        else{
            this.sprite.body.mass = 0.1;
        }
    }
    
    //randomly play the blink animation
    if (Math.random() > 0.99){
        this.sprite.animations.play("blink", 3, false);
    }

    //the light
    /*this.light.x = this.sprite.x;
    this.light.y = this.sprite.y;*/
    
    //physics
    this.sprite.body.angle -= this.sprite.body.angle;
    
    //camera
    game.camera.focusOnXY(this.sprite.x, this.sprite.y);
}
