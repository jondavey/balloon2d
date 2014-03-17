define(['BasicShape', 'Arrow'],function(BasicShape, Arrow) {
    "use strict";

    var drawIt;
    var colors = ["#FE2C0C","#400C7A","#FF0D89","#BDF271","#FF3B77","#E60045","#418F3D","#CA11DB"]
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
        this.hex = colors[Math.floor(Math.random() * colors.length)];
        this.view.on('tick', this.scaleIt, this);
        this.name = "balloon";
       this.view.hex = this.hex;
       this.view.body.m_angularDamping = 100.15;
       this.view.body.m_linearDamping = .01;
       this.radius = 60
       this.drawIt();
       this.view.scaleX = this.view.scaleY = .1;
    }
    Balloon.prototype = new BasicShape();
    Balloon.prototype.constructor = Balloon;
    Balloon.prototype.scaleIt = function(){
        if (this.view.body.GetPosition().y * this.SCALE < 0 ){
            this.toBeRemoved = true;
        }
        if (this.view.scaleX < 1 && !this.contact) {
            this.view.scaleX = this.view.scaleY += .01;
        }
        var fixture = this.view.body.GetFixtureList();
        var shape = fixture.GetShape();
        shape.SetRadius(this.radius * .5 / this.SCALE);
        if (this.contact == false){
            this.view.body.SetLinearVelocity(this.vect);

        } else {
            if (this.radius > 15){
                this.radius-=5;
            }
        }
    };
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
        gr.endStroke();
        gr.beginFill('rgba(255,255,255,.5)',.2);
        gr.moveTo(-15,-15); 
        gr.curveTo(-8,-20,5,-15); 
        gr.curveTo(0,-9,0,5); 
        gr.curveTo(-15,0,-20,5); 
        gr.curveTo(-19,-15,-15,-15); 
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
       if (this.contact) return;
        if (item instanceof Arrow){
            if (item.complete == true) return;
            this.view.points = Math.round(((500 * (this.view.y / this.stage.canvas.height))/50))*50;
            item.setPoints(this.view.points);
            this.contact = true;
            this.view.body.m_angularDamping = 100.15;
            this.vect = new this.b2Vec2(0,0);
            createjs.Tween.get(this.view).to({scaleX:2.2,scaleY:2.2,alpha:.3,delay:.05},50);
            createjs.Tween.get(this.view).wait(50).to({scaleX:.2,scaleY:.2,alpha:1,delay:.05},500);
            this.view.dispatchEvent(new createjs.Event("Hit"));
            setTimeout(function(that){

            that.toBeRemoved = true;
            },4000,this)

        }
       
    }
    return Balloon;
});