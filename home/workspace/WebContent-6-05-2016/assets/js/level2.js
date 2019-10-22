var level2 = {
    preload : function(){
            //load assets
        game.load.tilemap("level2", "./assets/tilemaps/level2.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.image("tiles", "./assets/images/tileSprites.png");
        game.load.spritesheet("max", "./assets/images/spr_max.png", 16, 48, 3);
        game.load.spritesheet("jak", "./assets/images/spr_jak.png", 16, 16, 3);
        game.load.image("crate", "./assets/images/spr_crate.png");
        game.load.image("chute", "./assets/images/spr_chute.png");
        game.load.image("slideDoor", './assets/images/spr_slideDoor.png');
        game.load.image("endDoor", './assets/images/spr_endDoor.png');
        game.load.spritesheet("pressurePlate", "./assets/images/spr_pressurePlate.png", 32, 6, 2);
        game.load.image("light", "./assets/images/light.png");
        game.load.image("pauseButton", "./assets/images/spr_pauseButton.png");
        game.load.image("restartButton", "./assets/images/spr_restartButton.png");
        game.load.image("button", "./assets/images/spr_menuButton.png");
        game.load.image("overlay", "./assets/images/blankOverlay.png");
        game.load.spritesheet("charSelect", "./assets/images/spr_charSelect.png", 128, 64, 2);
        
            //load sounds
        game.load.audio("snd_slidingDoorDown", "./assets/sounds/slidingDoor.mp3")
        game.load.audio("snd_slidingDoor", "./assets/sounds/slidingDoorDown.mp3")
    },
    
    create : function(){
        game.stage.backgroundColor = "rgb(100, 100, 100)" //medium grey
        resetVariables(); //resets the game state variables and other things, ensures that when restarting the level, everything runs smoothly
        
            //create all objects
        max = new maxObj(96, 90);
        jak = new jakObj(96, 90);
        crates = new cratesObj(8, -16);
        pressurePlates = new pressurePlatesObj(16, 6);
        slideDoors = new slideDoorsObj(6, 32);
        endDoors = new endDoorsObj(16, 64);
        
            //set up physics
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.gravity.y = 1100;
        
        map = game.add.tilemap("level2");
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
        
            //rotate doors to make them platforms
        rotateDoor(0, 90, 26, 38);
        rotateDoor(2, 90, 26, 38);
        
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
        //SLIDING DOORS//
        moveDoorUp(0, 1, 64, 2); //pressure plate index -- door index -- amount moved -- speed
        moveDoorUp(2, 3, 64, 2);
        moveDoorRight(1, 0, 64, 2);
        moveDoorRight(2, 2, 64, 2);
        
        //handle sounds
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