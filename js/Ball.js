define(['easeljs', 'box2d'],function(easeljs, box2d) {
    "use strict";
    // Box2d vars
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2Body = Box2D.Dynamics.b2Body;
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    var b2Fixture = Box2D.Dynamics.b2Fixture;
    var b2World = Box2D.Dynamics.b2World;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    var b2MassData = Box2D.Collision.Shapes.b2MassData;
    var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

     var SCALE = 30, STEP = 20, TIMESTEP = 1/STEP;

    var world;
    var stage;
    var p;
    var self;
    var reactToHit;

    var _disabled;

    function Ball(world, stage){
        if (!(this instanceof Ball)) {
            throw new TypeError("Ball constructor cannot be called as a function.");
        }
        self = this;
        this.world = world;
        this.stage = stage;
        this.view = new createjs.Bitmap("images/bird.png");
        this.view.regX = 24;
        this.view.regY = 24;
        this.view.disabled = false;
        this.view.mouseEnabled = true;
        this.toBeRemoved = false;
        this.hitCount = 0;
        this.dragging = false;
        // this.view.on("pressmove", onMouseDown);
        // this.view.on("pressup", onMouseUp)


        var fixDef = new b2FixtureDef();
        fixDef.density = 5;
        fixDef.friction = 2000;
        fixDef.resitution = 0;

        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.x = Math.random() * 800 / SCALE;
        bodyDef.position.y = 0;
        bodyDef.userData = self;
        
        fixDef.shape = new b2CircleShape(25 / SCALE);

        this.view.body = world.CreateBody(bodyDef)


        //this.view.body.ApplyTorque(5000);

        this.view.body.CreateFixture(fixDef);
        //this.view.body.SetGravityScale(0);

        this.view.on('tick', p.tick, this.view);
        this.view.body.m_sweep.localCenter.y = .15;
        this.view.body.m_linearDamping = 1.15;
        this.view.body.m_force = new b2Vec2(0, -50);


    }
    p = Ball.prototype = {
        constructor: Ball
        
    };
    // var onMouseDown = function(evt) {
    //     this.body.SetActive(false);
    //     this.dragging = true;
    //     evt.target.x = evt.stageX;
    //     evt.target.y = evt.stageY;
    // }
    // var onMouseUp = function(evt){

    //     this.x = this.body.SetPosition(new b2Vec2(evt.target.x / SCALE, evt.target.y / SCALE));
    //     this.body.SetActive(true);
    //     this.disabled = false;
    //     this.dragging = false;
    //     console.log("up"); 

    // }
    p.cleanUp = function() {
        this.view.body.SetUserData(null);
        this.world.DestroyBody(this.view.body);
    }
    p.reactToHit = function(impulse) {
        this.hitCount += i*.001;
        this.view.alpha -= i*.0001
        if (this.hitCount > 10){
            this.toBeRemoved = true;
        }
    }
    p.thrust = function(x, y) {
        var body = this.view.body;
        body.ApplyImpulse(new b2Vec2(0,
                                 300),
                                 body.GetWorldCenter());
       
        console.log('_');
    }
    p.disabled = function(d) {
        //console.log(this.view.disabled)
        this.view.body.SetActive(false);
        this.view.disabled = d;
        //console.log(this.view.body.SetActive(true));
    }
    p.tick = function(e) {
        //this.body.ApplyForce(new b2Vec2(0,this.body.GetMass() * -50 + .5),this.body.GetWorldCenter())

        if (this.disabled){

            this.body.m_force = new b2Vec2(0, this.body.GetMass() * -50);
        }
        if (!this.dragging){

            this.x = this.body.GetPosition().x * SCALE;
            this.y = this.body.GetPosition().y * SCALE;
            this.rotation = this.body.GetAngle() * (180/Math.PI);
        }

    }
    return Ball;
});