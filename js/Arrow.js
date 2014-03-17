define(['BasicShape'],function(BasicShape) {
    "use strict";
    function Arrow(world, stage, shapeInfo){
        var contact = false;
        if (!(this instanceof Arrow)) {
            throw new TypeError("Arrow constructor cannot be called as a function.");
        }
        BasicShape.call(this, world, stage, shapeInfo);

        //var angle = Math.atan2(-200,Math.random() * 500 + 700);
        this.view.body.SetLinearVelocity(new this.b2Vec2(shapeInfo.power*Math.cos(shapeInfo.angle),shapeInfo.power*Math.sin(shapeInfo.angle)));
        this.view.body.SetAngle(shapeInfo.angle);
        this.view.contact = false;
        this.complete = false;
        this.view.kills = 0;
        this.view.points = 0;
        this.blockHits = 0;
        this.view.maxW = stage.canvas.width;
        this.view.toBeRemoved = false;
        this.launched = false;
        console.log(this.view.body);
        this.name = "arrow";
        setTimeout(function(scope){
            scope.complete = true;
        },7000,this);
        setTimeout(function(scope){
            console.log(scope.launched)
            scope.launched = true;
            console.log(scope.launched)
        },100,this)
    }
    Arrow.prototype = new BasicShape();
    Arrow.prototype.constructor = Arrow;
    Arrow.prototype.contact = false;
    Arrow.prototype.skinit = function() {
         this.view = new createjs.Shape();
         this.view.snapToPixel = true;
         var gr = this.view.graphics;
         gr.beginStroke("#000000");
         gr.moveTo(0,this.h * .5);
         gr.lineTo(this.w, this.h * .5);
         gr.moveTo(15, this.h * .5);
         gr.lineTo(8, 8);
         gr.moveTo(12, this.h * .5);
         gr.lineTo(5, 8);
         gr.moveTo(9, this.h * .5);
         gr.lineTo(3, 8);
         gr.moveTo(6, this.h * .5);
         gr.lineTo(-2, 8);

         gr.moveTo(15, -this.h * .1);
         gr.lineTo(8, -5);
         gr.moveTo(12, -this.h * .1);
         gr.lineTo(5, -5);
         gr.moveTo(9, -this.h * .1);
         gr.lineTo(3, -5);
         gr.moveTo(6, -this.h * .1);
         gr.lineTo(-2, -5);
        this.view.width = this.w;
        this.view.height = this.h;
        this.view.regX = this.w * .5;
        this.view.regY = this.h * .5;    
        this.view.cache(0,-5,this.w, 12);
    }
    Arrow.prototype.tick = function(){
        if (this.complete) return;
        if (this.x < 0 || this.x > this.maxW) {

            this.complete = true;
            this.toBeRemoved = true;
            this.dispatchEvent(new createjs.Event("tallyScore"));
        }
        if (this.contact == false){

            var body = this.body;
            var flyingAngle = Math.atan2(body.GetLinearVelocity().y,body.GetLinearVelocity().x);
            body.SetAngle(flyingAngle);
        }
        BasicShape.prototype.tick.call(this);
    }
    Arrow.prototype.setPoints = function(i) {
        this.view.kills++;
        this.view.points += i;
        //console.log("this.view.points",this.view.points)
    }
    Arrow.prototype.reactToHit = function(item, impulse){

        if (item.name == "block") {
            this.blockHits++;
            if (this.blockHits > 200) {
                this.view.toBeRemoved = true;
            }
        }
        if (this.complete) return;

        if (item.name == "floor_wall" 
            || item.name == "block" 
            || (item.name == "balloon" && item.contact && item.getPosition().y > this.stage.canvas.height - 150) 
            || (item.name == "arrow" && item.complete && item.getPosition().y > this.stage.canvas.height - 150)
            ) {
            var f = this.view.body.GetFixtureList()
            console.log(f);
            this.complete = true;
            this.view.dispatchEvent(new createjs.Event("tallyScore"));
        
            //alert(this.kills)
        }
        
        if (item.name == "balloon" && !item.contact) {
        }
            //console.log("item.name", item.name);
        if (item.name.indexOf("wall") != -1 && !this.view.contact) {

            this.view.body.SetActive(false);
            this.complete = true;
        }
        if (item.name == "character" && this.launched) {
            console.log(this.view.body.SetLinearVelocity(new this.b2Vec2(Math.round(Math.random()) == 1 ? 10 : -10,-10)));
        }
        if (item.name != "character") {   
            this.view.contact = true;
        }
        
    }
    
    return Arrow;
});