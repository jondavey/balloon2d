define(['box2d'],function(box2d) {
    "use strict";

    var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

    function Base(world, stage){
        if (world == undefined) return;
        if (!(this instanceof Base)) {
            throw new TypeError("Base constructor cannot be called as a function.");
        }
        this.b2Vec2 = Box2D.Common.Math.b2Vec2;
        this.b2BodyDef = Box2D.Dynamics.b2BodyDef;
        this.b2Body = Box2D.Dynamics.b2Body;
        this.b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
        this.b2Fixture = Box2D.Dynamics.b2Fixture;
        this.b2World = Box2D.Dynamics.b2World;
        this.b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
        this.b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
        this.b2MassData = Box2D.Collision.Shapes.b2MassData;
        this.name = "base";
        this.world = world;
        this.stage = stage;
        this.SCALE = 30;

    }

    Base.prototype = {
        constructor: Base,
        getName: function(){
            return( this.name );
        },
        setName: function(name){
            this.name = name;
        }
        
    };
    return Base;
});