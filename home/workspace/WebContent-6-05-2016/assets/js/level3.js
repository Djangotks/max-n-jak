var level3 = {
    preload : function(){
            //load assets
    },
    
    create : function(){
        game.stage.backgroundColor = "rgb(100, 100, 100)" //medium grey
        resetVariables(); //resets the game state variables and other things, ensures that when restarting the level, everything runs smoothly
            //create all objects
        max = new maxObj(96, 150);
        jak = new jakObj(96, 150);
        crates = new cratesObj(8, -16);
        pressurePlates = new pressurePlatesObj(16, 6);
        slideDoors = new slideDoorsObj(6, 32);
        endDoors = new endDoorsObj(16, 64);
        
            //set up physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.gravity.y = 1100;
        
        map = game.add.tilemap("level3");
        map.addTilesetImage("tileSprites", "tiles");
        layer = map.createLayer("tiles");
        map.setCollisionBetween(0, 4);
        
            //physics collision groups - used to allow some things to collide but not others
        worldCollisionGroup = game.physics.p2.createCollisionGroup();
        characterCollisionGroup = game.physics.p2.createCollisionGroup();
        
        tiles = game.physics.p2.convertTilemap(map, layer);
        
        for (var i = 0, len = tiles.length; i < len; i++){ //decide what collides with what
            tiles[i].setCollisionGroup(worldCollisionGroup);
            tiles[i].collides([characterCollisionGroup, worldCollisionGroup]);
        }
        
            // load objects
        crates.load();
        pressurePlates.load();
        slideDoors.load();
        endDoors.load();
        max.load();
        jak.load();
        
            //timer
        startTime = game.time.time;
        
            //keyboard input - PC only
        this.eKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
        this.eKey.onUp.add(toggleJak, game);
        
            //allow the camera to go anywhere in space
        game.camera.bounds = null;
        
            //load hud
        loadHud();
    },
    
    update : function(){
        //SLIDING DOORS
        
        /*for (var i = 0; i < pressurePlates.group.children.length; i++){
            game.debug.text(i + ": " + pressurePlates.group.children[i].x, 32, (i+3)*32);
        }
        for (var i = 0; i < slideDoors.group.children.length; i++){
            game.debug.text(i + ": " + slideDoors.group.children[i].x, 128, (i+3)*32);
        }*/
        
        moveDoorUp(0, 0, 64, 2); // PP, Door, amount, speed
        moveDoorUp(0, 2, 64, 2);
        moveDoorUp(1, 1, 64, 2);
        
        //moveDoorUp(2, 2, 64, 2);
        moveDoorUp(2, 3, 64, 2);
        
        handleSounds();
        
            //handle controls
        handleControls();
            //handle the stuff that ends the level (death or completion)
        handleLevelEnd();
            //update hud
        updateHud();
            //timer
        updateCounter();
        
            //finally update objects
        max.update();
        jak.update();
        crates.update();
        slideDoors.update();
        pressurePlates.update();
    }
};