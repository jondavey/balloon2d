define(['easeljs', 'box2d', 'Base'], function(easeljs, box2d, Base) {
    "use strict";

    var p;
    var SCALE = 30;
    var defShape;
    var defType;
    var skin;
    function BasicShape(world, stage, shapeInfo){
        if (!world) return;
        if (!(this instanceof BasicShape)) {
            throw new TypeError("BasicShape constructor cannot be called as a function.");
        }
        // shapeInfo = {
        //     defType : , 
        //     defShape : ,
        //     w : ,
        //     h : ,
        //     x : ,
        //     y :
        // }
        Base.call(this, world, stage);
        defShape = shapeInfo.shape;
        defType = shapeInfo.type;
        skin = shapeInfo.skin || "images/bird.png";
        this.w = shapeInfo.width;
        this.h = shapeInfo.height;
        this.skinScale = shapeInfo.skinScale || 1;
        this.stage = stage;

        this.skinit(this.w, this.h);
        

        var fixDef = new this.b2FixtureDef();
        fixDef.density = shapeInfo.density || 1;
        fixDef.friction = shapeInfo.friction || 1;
        fixDef.restitution = shapeInfo.restitution || 0;
        var bodyDef = new this.b2BodyDef();
        bodyDef.type = defType == "static" ? this.b2Body.b2_staticBody : this.b2Body.b2_dynamicBody;
        bodyDef.position.x = shapeInfo.x / SCALE || Math.random() * 800 / this.SCALE;
        bodyDef.position.y = shapeInfo.y / SCALE || 0;
        bodyDef.userData = this;
        if (defShape == "circle") {

            fixDef.shape = new this.b2CircleShape((this.w * .5) / this.SCALE);
        } else if (defShape == "square"){
            fixDef.shape = new this.b2PolygonShape();
            fixDef.shape.SetAsBox((this.w * .5) / SCALE, (this.h * .5) / SCALE);
        } else if (shapeInfo.points) {
            fixDef.shape = new this.b2PolygonShape();
            var points = [];

            for (var i = 0; i < shapeInfo.points.length; i++) {
                var vec = new this.b2Vec2();
                vec.Set(shapeInfo.points[i].x / SCALE, shapeInfo.points[i].y / SCALE);
                points[i] = vec;
            }
            fixDef.shape.SetAsArray(points,points.length);
        }
        
        if (this.view) {

            this.view.body = this.world.CreateBody(bodyDef)


            //this.view.body.ApplyTorque(5000);
            this.view.body.m_linearDamping = 1.15;
            this.view.body.CreateFixture(fixDef);
            //this.view.body.SetGravityScale(0);

        }
            this.view.on('tick', this.tick, this.view);
    }
    BasicShape.prototype = new Base();
    BasicShape.prototype.constructor = BasicShape;
        
    BasicShape.prototype.init = function() {

    }
    BasicShape.prototype.skinit = function(w, h) {
        this.view = new createjs.Bitmap(skin);
        this.view.width = w;
        this.view.height = h;

        this.view.regX = window.deviceType == "phone" ? (w * 1) : (w * .5);
        this.view.regY = window.deviceType == "phone" ? (h * 1) : (w * .5);
        this.view.scaleX = this.skinScale;
        this.view.scaleY = this.skinScale;
    }
    BasicShape.prototype.tick = function() {
        this.x = this.body.GetPosition().x * SCALE;
        this.y = this.body.GetPosition().y * SCALE;
        this.rotation = this.body.GetAngle() * (180/Math.PI);

    }
    BasicShape.prototype.reactToHit = function(item, impulse) {
       // console.log("ouch!")
    }
    BasicShape.prototype.cleanUp = function() {
        this.view.off('tick', this.tick);
        this.view.body.SetUserData(null);
        this.world.DestroyBody(this.view.body);
    }
    BasicShape.prototype.setPosition = function(x, y){
        this.view.body.SetPosition(new this.b2Vec2(x / this.SCALE, y / this.SCALE));
    }
    BasicShape.prototype.getPosition = function(){
        return {
            x: this.view.body.GetPosition().x * this.SCALE,
            y: this.view.body.GetPosition().y * this.SCALE
        }
    }


   
    
    return BasicShape;
});