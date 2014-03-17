define(['BasicShape'],function(BasicShape) {
    "use strict";
    var p;
    var world, stage, x;
    function Ball2(world, stg, w, h, x, y){
        if (!(this instanceof Ball2)) {
            throw new TypeError("Ball2 constructor cannot be called as a function.");
        }
        world = wrld;
        stage = stg;
        x = x;

    }
    p = Ball2.prototype = new BasicShape();
    p.basic_init = p.init();
    p.init = function() {
        p.basic_init(world, stage, x);
    }
    return Ball2;
});