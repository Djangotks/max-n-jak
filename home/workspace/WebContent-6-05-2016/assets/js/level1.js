var level1 = {
    preload : function(){
            //load assets
        
    },
    
    create : function(){
        game.stage.backgroundColor = "rgb(100, 100, 100)" //medium grey
        resetVariables(); //resets the game state variables and other things, ensures that when restarting the level, everything runs smoothly
        
            //create all objects
        max = new maxObj(180, 90);
        jak = new jakObj(180, 90);
        crates = new cratesObj(8, -16);
        pressurePlates = new pressurePlatesObj(16, 6);
        slideDoors = new slideDoorsObj(6, 32);
        endDoors = new endDoorsObj(16, 64);
            //set up physics
        setupPhysics();
            //tilemaps
        map = game.add.tilemap("level1");
        map.addTilesetImage("tileSprites", "tiles");
        layer = map.createLayer("tiles");
        map.setCollisionBetween(0, 4);
            //physics collision groups - used to allow some things to collide but not others
        worldCollisionGroup = game.physics.p2.createCollisionGroup();
        characterCollisionGroup = game.physics.p2.createCollisionGroup();
        
        tiles = game.physics.p2.convertTilemap(map, layer); //convert the tilemap into objects that can be collided with
        
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
            //set up controls
        setupControls();
            //allow the camera to go anywhere in space
        game.camera.bounds = null;
            //load hud
        loadHud();
    },
    
    update : function(){
        //SLIDING DOORS//
        moveDoorUp(0, 0, 64, 2); //pressureplate, door, distance, speed
        moveDoorUp(1, 1, 64, 2);
        
        handleSounds();
        
            //handle controls
        handleControls();
            //handle the stuf that ends the level (death or completion)
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