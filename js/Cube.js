define(['easeljs', 'box2d'], function(easeljs, box2d) {
    "use strict";
    var b2AABB = Box2D.Collision.b2AABB;
    var b2Vec2 = Box2D.Common.Math.b2Vec2;
    var b2BodyDef = Box2D.Dynamics.b2BodyDef;
    var b2Body = Box2D.Dynamics.b2Body;
    var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
    var b2Fixture = Box2D.Dynamics.b2Fixture;
    var b2World = Box2D.Dynamics.b2World;
    var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
    var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
    var b2RevoluteJointDef = Box2D.Dynamics.Joints.b2RevoluteJointDef
    var b2MouseJointDef =  Box2D.Dynamics.Joints.b2MouseJointDef
    var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;
    var b2ContactListener = Box2D.Dynamics.b2ContactListener;

    var SCALE = 30;
    var world, 
        stage;

    function Cube(world, stage){
        if (!(this instanceof Cube)) {
            throw new TypeError("Cube constructor cannot be called as a function.");
        }
        world = world;
        stage = stage;

        var fixDef = new b2FixtureDef();
        fixDef.density = 1;
        fixDef.friction = 2;
        fixDef.restitution = .3;
        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_staticBody;
        bodyDef.position.x = 400 / SCALE;
        bodyDef.position.y = 600 / SCALE;
        bodyDef.userData = "Floor";
        fixDef.shape = new b2PolygonShape();
        fixDef.shape.SetAsBox(400 / SCALE,20 / SCALE);
        world.CreateBody(bodyDef).CreateFixture(fixDef);
    }
    Cube.prototype = {
        constructor: Cube
    };
    return Cube;
});