// Box2d vars
var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

// important box2d scale and speed vars
var SCALE = 30, STEP = 20, TIMESTEP = 1/STEP;

var world, stage;

function init(){
     stage = new createjs.Stage(document.getElementById("game-canvas"));

    createjs.Ticker.on('tick', tick);
    createjs.Ticker.setFPS(60);
    createjs.Ticker.useRAF = true;
    setInterval(addBall,500);
    initPhysics();

}
function initPhysics(){
    world = new b2World(new b2Vec2(0,50), true);

    var fixDef = new b2FixtureDef();
    fixDef.density = 1;
    fixDef.friction = .5;
    fixDef.restitution = .5;
    var bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = 400 / SCALE;
    bodyDef.position.y = 600 / SCALE;
    fixDef.shape = new b2PolygonShape();
    fixDef.shape.SetAsBox(400 / SCALE,20 / SCALE);
    world.CreateBody(bodyDef).CreateFixture(fixDef);

    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(stage.canvas.getContext('2d'));
    debugDraw.SetDrawScale(SCALE);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    world.SetDebugDraw(debugDraw);

    addBall();
}
function addBall() {
    var b = new Ball(world, Math.random()*50,'#'+(Math.random()*0xFFFFFF<<0).toString(16));
    stage.addChild(b.view);
    
}
function tick(e) {
    stage.update();
    //world.DrawDebugData();
    world.Step(1/60, 10, 10);
    world.ClearForces();
    
}