define(['easeljs','Base','AssetsLoader'],function(easeljs, Base, AssetsLoader) {
    "use strict";
    var ldr = require('AssetsLoader');
    function TreeRight(world, stage){
        if (!(this instanceof TreeRight)) {
            throw new TypeError("TreeRight constructor cannot be called as a function.");
        }
        console.log();
        Base.call(this, world, stage);
        var img1 = new Image();
        img1.src = 'images/trunk.jpg';
        var tree_top = new createjs.Bitmap(ldr.getItemById("tree_top").tag);
        tree_top.x = 3;
        var tree_trunk = new createjs.Shape();

        this.view = new createjs.Container();
        this.view.addChild(tree_top);
        this.view.addChild(tree_trunk);
        img1.onload = function() {
            tree_trunk.graphics.beginBitmapFill(ldr.getItemById("trunk").tag,"repeat-y");
            tree_trunk.graphics.drawRect(0,0,20,stage.canvas.height-160)
            tree_trunk.x = 82;
            tree_trunk.y = 88;
            stage.update();
        }

        var fixDef = new this.b2FixtureDef();
        var fixDef2 = new this.b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 0;
        fixDef.restitution = .2;
        fixDef2.density = 1;
        fixDef2.friction = 0;
        fixDef2.restitution = .1;
        var bodyDef = new this.b2BodyDef();
        bodyDef.type = this.b2Body.b2_staticBody;
        bodyDef.position.x = (stage.canvas.width - 102) / this.SCALE;
        bodyDef.position.y = 0;
        bodyDef.userData = this;
        fixDef.shape = new this.b2PolygonShape();
        fixDef2.shape = new this.b2PolygonShape();
        // fixDef2.shape.SetAsBox(10 / this.SCALE, 400 / this.SCALE, new this.b2Vec2(-1 + 0.5, 1));

        // var polyDef = new this.b2PolygonShape();

        var points = [{x:0,y:0},
                        {x:85,y:0},
                        {x:85,y:85}];

        var p = [];

        for (var i = 0; i < points.length; i++) {
            var vec = new this.b2Vec2();
            vec.Set(points[i].x / this.SCALE, points[i].y / this.SCALE);
            p[i] = vec;
        }
        fixDef.shape.SetAsArray(p,p.length);
        var points2 = [{x:85,y:0},
                        {x:100,y:0},
                        {x:100,y:stage.canvas.height-140},
                        {x:85,y:stage.canvas.height-140}];
        var p2 = [];

        for (var i = 0; i < points2.length; i++) {
            var vec = new this.b2Vec2();
            vec.Set(points2[i].x / this.SCALE, points2[i].y / this.SCALE);
            p2[i] = vec;
        }
        fixDef2.shape.SetAsArray(p2,p2.length);
        this.view.body = this.world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);
        this.view.body.CreateFixture(fixDef2);
        //this.view.body.CreateShape(polyDef);

        this.view.on('tick', this.tick, this.view);
    }
    TreeRight.prototype = new Base();
    TreeRight.prototype.constructor = TreeRight;

    TreeRight.prototype.tick = function() {
        this.x = this.body.GetPosition().x * 30;
        this.y = this.body.GetPosition().y * 30;
        this.rotation = this.body.GetAngle() * (180/Math.PI);

    }
    TreeRight.prototype.reactToHit = function(item, impulse) {
       // console.log("ouch!")
    }
    TreeRight.prototype.setPosition = function(x, y){
        this.view.body.SetPosition(new this.b2Vec2(x / this.SCALE, y / this.SCALE));
    }
    return TreeRight;
});