(function(window){
    var view;
    function Ball(w, r, h) {
        this.view = new createjs.Shape();
        console.log(h);
        this.view.graphics.beginFill(h);
        this.view.graphics.drawCircle(0,0,r);
        this.view.cache(-r,-r,r * 2,r * 2);

        var fixDef = new b2FixtureDef();
        fixDef.density = r/10;
        fixDef.friction = .5;
        fixDef.resitution = 1;
        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_dynamicBody;
        bodyDef.position.x = Math.random() * 800 / SCALE;
        bodyDef.position.y = 0;
        fixDef.shape = new b2CircleShape(r / SCALE);
        this.view.body = world.CreateBody(bodyDef);
        this.view.body.CreateFixture(fixDef);

        this.view.on('tick', tick, this.view);
    }
    function tick(e) {
        this.x = this.body.GetPosition().x * SCALE;
        this.y = this.body.GetPosition().y * SCALE;
        this.rotation = this.body.GetAngle() * (180/Math.PI);
    }
    window.Ball = Ball;
})(window);