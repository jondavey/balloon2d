define(['BasicShape','AssetsLoader'],function(BasicShape, AssetsLoader) {
    "use strict";
    var ldr = require('AssetsLoader');
    function Character(world, stage, shapeInfo){
        if (!(this instanceof Character)) {
            throw new TypeError("Character constructor cannot be called as a function.");
        }
        BasicShape.call(this, world, stage, shapeInfo)

    }
    Character.prototype = new BasicShape();
    Character.prototype.constructor = Character;
    Character.prototype.skinit = function(w, h){
        this.view = new createjs.Container();

        var bm = new createjs.Bitmap(ldr.getItemById("stickman").tag);
        bm.width = w;
        bm.height = h;
        bm.regX = w * .5;
        bm.regY = h * .5;
        this.view.addChild(bm);

        var hitArea = new createjs.Shape();
        hitArea.graphics.beginFill("rgba(255,255,255,.01)").drawRect(-w * .5,-h * .5,w,h);
        this.view.addChild(hitArea);
    }

        

    return Character;
});