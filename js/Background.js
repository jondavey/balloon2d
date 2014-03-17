define(['easeljs'], function(easeljs) {
    "use strict";
    var p;
    var maskImage;
    var image;
    function Background(stage){
        if (!(this instanceof Background)) {
            throw new TypeError("Background constructor cannot be called as a function.");
        }
        p.Container_Init();

        image = new createjs.Bitmap('images/texture.jpg');
        maskImage = new createjs.Bitmap('images/cloud.png');
        maskImage.x = 300;
        var amf = new createjs.AlphaMaskFilter(maskImage.image);
        image.filters = [amf];
        image.cache(0, 0, maskImage.image.width, maskImage.image.height);
        image.alpha = .4;

        this.addChild(image);
        this.on('tick', this.tick);
    }
    p = Background.prototype = new createjs.Container();
    p.Container_Init = Background.prototype.initialize;
    p.constructor = Background;
    p.tick = function(){
        
        //amf.applyFilter(e.target.canvas,0, 0, maskImage.image.width, maskImage.image.height,200,0)
        maskImage.x += 1;
        image.cache(0, 0, maskImage.image.width, maskImage.image.height);
    }
    return Background;
});