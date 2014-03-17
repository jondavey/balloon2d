define(['easeljs'],function(easeljs) {
    "use strict";
    var p;
    var gr;
    function PowerArrow(){
        if (!(this instanceof PowerArrow)) {
            throw new TypeError("PowerArrow constructor cannot be called as a function.");
        }

        this.Shape_initialize();
        gr = this.graphics;
        this.update();
    }
    p = PowerArrow.prototype = new createjs.Shape();
    p.constructor = PowerArrow;
    p.shapeInit = PowerArrow.prototype.initialize();
    p.Shape_initialize = p.initialize;
    p.update = function() {
        gr.setStrokeStyle(1,"round").beginFill('#0385DB');
        gr.lineTo(-2,0);
        gr.lineTo(-6,-35);
        gr.lineTo(-18,-30);
        gr.lineTo(0,-55);
        gr.lineTo(18,-30);
        gr.lineTo(6,-35);
        gr.lineTo(2,0);
    }

    return PowerArrow;
});