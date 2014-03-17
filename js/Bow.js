define(['easeljs'],function(easeljs) {
    "use strict";
    var p;
    function Bow(){
        if (!(this instanceof Bow)) {
            throw new TypeError("Bow constructor cannot be called as a function.");
        }
        this.initialize();     
    }
    p = Bow.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;
    p.character;
    p.playing;
    p.ice;
    p.initialize = function() {
        p.Container_initialize();
        var spriteSheet = {
            "framerate":24,
            "images":["images/BowAndArrow.png"],
            "frames":[
                    [0, 0, 64, 128, 0, -14, -3],
                    [64, 0, 64, 128, 0, -14, -3],
                    [128, 0, 64, 128, 0, -14, -3],
                    [192, 0, 64, 128, 0, -14, -3],
                    [256, 0, 64, 128, 0, -14, -3],
                    [320, 0, 64, 128, 0, -14, -3],
                    [384, 0, 64, 128, 0, -14, -3],
                    [448, 0, 64, 128, 0, -14, -3],
                    [512, 0, 64, 128, 0, -14, -3],
                    [576, 0, 64, 128, 0, -14, -3],
                    [640, 0, 64, 128, 0, -14, -3],
                    [704, 0, 64, 128, 0, -14, -3],
                    [768, 0, 64, 128, 0, -14, -3],
                    [832, 0, 64, 128, 0, -14, -3],
                    [896, 0, 64, 128, 0, -14, -3],
                    [0, 128, 64, 128, 0, -14, -3],
                    [64, 128, 64, 128, 0, -14, -3],
                    [128, 128, 64, 128, 0, -14, -3],
                    [192, 128, 64, 128, 0, -14, -3],
                    [256, 128, 64, 128, 0, -14, -3],
                    [320, 128, 64, 128, 0, -14, -3],
                    [384, 128, 64, 128, 0, -14, -3],
                    [448, 128, 64, 128, 0, -14, -3],
                    [512, 128, 64, 128, 0, -14, -3],
                    [576, 128, 64, 128, 0, -14, -3],
                    [640, 128, 64, 128, 0, -14, -3],
                    [704, 128, 64, 128, 0, -14, -3],
                    [768, 128, 64, 128, 0, -14, -3],
                    [832, 128, 64, 128, 0, -14, -3],
                    [896, 128, 64, 128, 0, -14, -3]
            ],
            "animations":{}
        };
        // Spritesheet creation
        var ss = new createjs.SpriteSheet(spriteSheet);

        // BitmaAnimation 
        this.bow = new createjs.Sprite(ss);
        this.bow.regX = 35;
        this.bow.regY = 60;
        this.addChild(this.bow);
    }
    p.gotoFrame = function(n) {
        this.bow.gotoAndStop(n)
    }


    return Bow;
});