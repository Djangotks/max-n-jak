//Phaser functions
var levelSelector = {
    preload : function(){
            //load assets
    },

    create : function(){
        //DECORATION//
            //back image
        this.backImage = game.add.sprite(0, game.world.height - 32, "mapImage2");
        this.backImage.anchor.set(0, 1);
        this.backImage.scale.set(32);
        this.backImage.smoothed = false;
            //light
        this.light = game.add.sprite(-game.world.width, -100, "light");
        this.light.scale.set(20, 20);
            //max picture
        this.max = game.add.sprite(816, 486, "max");
        this.max.scale.set(-1, 1);
    
        
        //BUTTONS//
            //back button
        this.backButton = game.add.sprite(32, 32, "backButton");
        this.backButton.anchor.set(0, 0)
        this.backButton.inputEnabled = true;
        this.backButton.events.onInputDown.add(gotoMenu, game);
        
            //menu buttons
        this.menuNum = 3;
        this.buttonScale = 1;
        this.buttonY = 95;
        this.buttonX = game.world.width-365;
        this.buttonDif = 130;
        
        this.textDifX = 0;
        this.textDifY = -4;
        
        this.tTextDifX = -70;
        this.tTextDifY = 22;
        
            //create array place holders for all buttons, texts and button decoration
        this.buttons = new Array(this.menuNum);
        this.levelTexts = new Array(this.menuNUm);
        this.timeTexts = new Array(this.menuNum);
        this.timeBorders = new Array(this.menuNum);

        for (var i = 0; i < this.menuNum; i++){
                //create and set properties for buttons, texts and button decoration
            this.buttons[i] = game.add.sprite(this.buttonX, this.buttonY + (i*this.buttonDif), "button");
            this.buttons[i].anchor.set(0.5);
            this.buttons[i].scale.set(this.buttonScale);
            this.buttons[i].smoothed = false;
            this.buttons[i].inputEnabled = true;
            
            this.levelTexts[i] = game.add.text(this.buttonX+this.textDifX, this.buttonY + (i*this.buttonDif) + this.textDifY, "level " + (i+1), { font: "normal 35px Courier"});
            this.levelTexts[i].anchor.set(0.5);
            this.levelTexts[i].addColor("#D1D1D1", 0);
            
            this.timeTexts[i] = game.add.text(this.buttonX+this.tTextDifX, this.buttonY + (i*this.buttonDif) + this.tTextDifY, "unset", { font: "normal 15px Courier"});
            this.timeTexts[i].anchor.set(0, 0.5);
            this.timeTexts[i].addColor("#DBDBDB", 0);
            
            this.timeBorders[i] = game.add.sprite(this.buttonX, this.buttonY + (i*this.buttonDif) + 10, "timeBorder");
            this.timeBorders[i].anchor.set(0.5);
            this.timeBorders[i].scale.set(this.buttonScale);
            this.timeBorders[i].tint = 0x919191; //as sprite is white this will set the colour
            
                //specific properties that have to be set uniquely for each button
            if (i == 0){
                if (localStorage.getItem("level1Time") !== null){ //check that there is high score set
                    this.timeTexts[i].setText(convertTime(localStorage.getItem("level1Time"))); //make the text display that time
                }
                else{ //if no high score...
                    this.timeTexts[i].setText("incomplete");
                }
                this.buttons[i].events.onInputDown.add(gotoLevel1, game);
            }
            else if (i == 1){
                if (localStorage.getItem("level2Time") !== null){
                    this.timeTexts[i].setText(convertTime(localStorage.getItem("level2Time")));
                }
                else{
                    this.timeTexts[i].setText("incomplete");
                }
                this.buttons[i].events.onInputDown.add(gotoLevel2, game);
            }
            else if (i == 2){
                if (localStorage.getItem("level3Time") !== null){
                    this.timeTexts[i].setText(convertTime(localStorage.getItem("level3Time")));
                }
                else{
                    this.timeTexts[i].setText("incomplete");
                }
                this.buttons[i].events.onInputDown.add(gotoLevel3, game);
            }
        }
    },

    update : function(){
        
    }
};