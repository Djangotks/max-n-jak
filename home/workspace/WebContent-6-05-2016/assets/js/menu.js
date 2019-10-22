var menu = {
    preload : function(){
            //load assets
        game.load.image("mapImage1", "./assets/images/mapImage1.png");
        game.load.spritesheet("jak", "./assets/images/spr_jak.png", 16, 16, 1);
        game.load.spritesheet("max", "./assets/images/spr_max.png", 16, 42, 1);
        
        game.load.tilemap("level1", "./assets/tilemaps/level1.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap("level2", "./assets/tilemaps/level2.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.tilemap("level3", "./assets/tilemaps/level3.json", null, Phaser.Tilemap.TILED_JSON);
        game.load.image("tiles", "./assets/images/tileSprites.png");
        game.load.image("crate", "./assets/images/spr_crate.png");
        game.load.image("slideDoor", './assets/images/spr_slideDoor.png');
        game.load.image("endDoor", './assets/images/spr_endDoor.png');
        game.load.spritesheet("pressurePlate", "./assets/images/spr_pressurePlate.png", 32, 6, 2);
        game.load.image("pauseButton", "./assets/images/spr_pauseButton.png");
        game.load.image("restartButton", "./assets/images/spr_restartButton.png");
        game.load.image("button", "./assets/images/spr_menuButton.png");
        game.load.image("overlay", "./assets/images/blankOverlay.png");
        game.load.spritesheet("charSelect", "./assets/images/spr_charSelect.png", 128, 64, 2);
        
        game.load.image("button", "./assets/images/spr_menuButton.png");
        game.load.image("backButton", "./assets/images/spr_backButton.png");
        game.load.image("timeBorder", "./assets/images/timeBorder.png");
        game.load.image("mapImage2", "./assets/images/mapImage2.png");
        //game.load.image("light", "./assets/images/light.png");
        
            //load sounds
        game.load.audio("music", "./assets/sounds/music.mp3");
    },

    create : function(){
        //DECORATION//
            //back image
        this.backImage = game.add.sprite(64, game.world.height - 32, "mapImage1");
        this.backImage.anchor.set(0, 1);
        this.backImage.scale.set(32);
        this.backImage.smoothed = false;
            //jak
        this.jakImage = game.add.sprite(190, game.world.height - 352, "jak");
        this.jakImage.anchor.set(0, 1)
            //light
        this.light = game.add.sprite(this.jakImage.x, this.jakImage.y, "light");
        this.light.scale.set(20, 20);
        this.light.anchor.set(0.5);
            //big title
        this.titleY = 64;
        this.titleText = game.add.text(game.world.centerX, this.titleY, " Max & Jak", { font: "normal 90px Courier"})
        this.titleText.anchor.set(0.5);
        this.titleText.addColor("#363636", 0); //dark grey
            //back ground colour
        game.stage.backgroundColor = "rgb(100, 100, 100)"; //medium grey
        
        //BUTTONS//
            //variables, changing these will easily change aspects of all the buttons
        this.menuNum = 2;
        this.buttonScale = 1;
        this.buttonY = 210;
        this.buttonX = 300;
        this.buttonDif = 125;
        
        this.textDifX = 0;
        this.textDifY = 2;
        
            //create array holders for the buttons sprites and texts
        this.buttons = new Array(this.menuNum);
        this.texts = new Array(this.menuNum);
        
        for (var i = 0; i < this.menuNum; i++){ //cycle through every button
                //create the button sprites and set all their properties
            this.buttons[i] = game.add.sprite(game.world.centerX, this.buttonY + (i*this.buttonDif), "button");
            this.buttons[i].anchor.set(0.5);
            this.buttons[i].smoothed = false;
            this.buttons[i].scale.set(this.buttonScale);
            this.buttons[i].inputEnabled = true;
                //create the texts and set all their properties
            this.texts[i] = game.add.text(game.world.centerX+this.textDifX, this.buttonY + (i*this.buttonDif) + this.textDifY, "unset", { font: "normal 35px Courier"});
            this.texts[i].anchor.set(0.5)
            this.texts[i].addColor("#D1D1D1", 0);
            
                //specific properties that need to be set for each button
            if (i == 0){
                this.buttons[i].events.onInputDown.add(gotoLevelSelector, game);
                this.texts[i].setText("levels");
            }
            else if (i == 1){
                this.buttons[i].events.onInputDown.add(destroyGame, game);
                this.texts[i].setText("exit");
            }
        }
        
        //music
        var music = game.add.audio("music");
        music.play();
        music.loop = true;
        music.volume = 0.0;
    },

    update : function(){
        
    }
};