define(['BasicShape','Arrow'],function(BasicShape, Arrow) {
    "use strict";

    var drawIt;
    function Balloon(world, stage, shapeInfo){
        if (!(this instanceof Balloon)) {
            throw new TypeError("Balloon constructor cannot be called as a function.");
        }
        this.radius = shapeInfo.width;
        BasicShape.call(this, world, stage, shapeInfo);
        this.vect = new this.b2Vec2(0,-2);
        this.contact = false;
        this.toBeRemoved = false;
        this.view.body.SetLinearVelocity(new this.b2Vec2(0,55));
        this.radius;
        this.hex = '#'+(Math.random()*0xFFFFFF<<0).toString(16);
       this.view.on('tick', this.drawIt, this);
       this.view.hex = this.hex;
       this.view.body.m_angularDamping = 100.15;
       this.view.body.m_linearDamping = .01;
       console.log(this.view.body)
    }
    Balloon.prototype = new BasicShape();
    Balloon.prototype.constructor = Balloon;
    Balloon.prototype.drawIt = function(){
        //console.log(this.view.body.GetPosition().y);
        if (this.view.body.GetPosition().y * this.SCALE < 0 ){
            this.toBeRemoved = true;
        }
        if (this.radius < 60 && this.contact == false){
            this.radius+=.4;
        }
        if (this.contact == false){
            this.view.body.SetLinearVelocity(this.vect);

        } else {
            this.radius-=5;
        }
        if (this.radius < 15) {
            return;
            //this.toBeRemoved = true;
        }
       var fixture = this.view.body.GetFixtureList();
       var shape = fixture.GetShape();
       shape.SetRadius(this.radius * .5 / this.SCALE);
       // console.log(this.view.body.ApplyTorque(2))
        var gr = this.view.graphics,
        x = 0,
        y = 0,
        r = this.radius/2,
        c1 = 0.4142,
        c2 = 0.7071;
        gr.clear();
        gr.setStrokeStyle(1,"round").beginFill(this.hex);

        gr.moveTo(x+r, y); 
        // start drawing circle CCW at positive x-axis, at distance r from center(x+r)
        // 1st anchor point...x:(x+r), y:y
        gr.curveTo(r+x,-c1*r+y,c2*r+x,-c2*r+y);
        // control point...x:radius+x offset, y:tan(pi/8)*radius+y offset 
        // 2nd anchor point...x:cos(pi/4)*radius+x offset, y:sin(pi/4)*radius+y offset
        // becomes 1st anchor point for next curveTo
        gr.curveTo(c1*r+x,-r+y,x,-r+y);
        // control point...x:cot(3pi/8)*radius+x offset, y:-radius+ y offset
        // 2nd anchor point...x:x offset,y:-radius+y offset
        // etc...
        gr.curveTo(-c1*r+x,-r+y,-c2*r+x,-c2*r+y);
        gr.curveTo(-r+x,-c1*r+y,-r+x, y);
        gr.curveTo(-r+x,c1*r+y,-c2*r+x,c2*r+y);
        gr.curveTo(-c1*r+x,r+y,x,(r+y)*1.3);
        gr.lineTo(x-2,(r+y)*1.3);
        gr.lineTo(x+2,(r+y)*1.3);
        gr.curveTo(c1*r+x,r+y,c2*r+x,c2*r+y);
        gr.curveTo(r+x,c1*r+y,r+x,y);
        this.view.cache(-70,-70,140,140)
    }
    Balloon.prototype.skinit = function() {
         this.view = new createjs.Shape();
         //var gr = this.view.graphics,
        //this.drawIt(this.view);
        //this.drawIt();

    }
    Balloon.prototype.tick = function() {
        
        BasicShape.prototype.tick.call(this);
    }
    Balloon.prototype.reactToHit = function(item, impulse) {
       // this.toBeRemoved = true;
       if (item instanceof Arrow){
        this.contact = true;
        this.view.body.m_angularDamping = 100.15;
        this.vect = new this.b2Vec2(0,0);

        this.view.dispatchEvent(new createjs.Event("Hit"));

       }
       
    }
    return Balloon;
});