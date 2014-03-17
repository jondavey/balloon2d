define(['jquery', 'easeljs', 'box2d', 'BasicShape', 'Arrow', 'Balloon', 'Character', 'Bow','PowerArrow','TreeRight', 'TreeLeft','BalloonPoints', 'Background','CSSPlugin','AssetsLoader'],
    function($, easeljs, box2d, BasicShape, Arrow, Balloon, Character, Bow, PowerArrow,TreeRight,TreeLeft,BalloonPoints,Background,CSSPlugin,AssetsLoader) {
    "use strict";

    // Box2d vars
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

    // important box2d scale and speed vars
    var SCALE = 30, STEP = 20, TIMESTEP = 1/STEP;
    var balloons = [];
    var blocks = [];
    var arrows = [];
    var blockInt;
    var balloonInt;
    var totalBalloons = 20;
    var remainingBalloons;
    var arrowsUsed = 0;
    var gameOver = true;
    var ldr = require("AssetsLoader");
    var world, 
        stage, 
        canvas, 
        debug, 
        mouseX, 
        mouseY,
        mouseJoint,
        character,
        floor,
        bow,
        bg_image,
        powerArrow,
        treeRight,
        treeLeft,
        score,
        bonusText,
        bonusStar;

    var isMouseDown = false;

    function GameStage(){
        if (!(this instanceof GameStage)) {
            throw new TypeError("GameStage constructor cannot be called as a function.");
        }
        canvas = document.getElementById("game-canvas");
        stage = new createjs.Stage(canvas);
        debug = document.getElementById("debug");
        createjs.Touch.enable(stage);

        bg_image = new createjs.Shape();
        stage.addChild(bg_image);

        // var bg = new Background(stage);
        // stage.addChild(bg);
        createjs.CSSPlugin.install(createjs.Tween);
        createjs.Ticker.addEventListener("tick", tick); 
        createjs.Ticker.setFPS(60);
        if (window.deviceType == "phone" || window.deviceType == "tablet") {

            createjs.Ticker.useRAF = true;
        }


        initWorld();
        initStageGraphics();
        //initGame();

        
    }
    
    GameStage.prototype = {
        constructor: GameStage
        
    };
    GameStage.prototype.resize = function() {
        var w = window.deviceType == "phone" ? $(window).width() : Math.min($(window).width(), 1000);
        var h = window.deviceType == "phone" ? $(window).height() : Math.min($(window).height(), 600);
        $('#game-canvas').attr('width',w);
        $('#game-canvas').attr('height',h);
        $('#debug').attr('width',Math.min($(window).width(), 1000));
        $('#debug').attr('height',Math.min($(window).width(), 600));
        character.setPosition(stage.canvas.width * .5,stage.canvas.height - 140) ;
        floor.setPosition(stage.canvas.width * .5,stage.canvas.height-70) ;
        treeRight.setPosition(stage.canvas.width - 102,0) ;
        bow.x = stage.canvas.width * .5;
        bow.y = stage.canvas.height - 155;
        bg_image.graphics.clear();
        bg_image.graphics.beginLinearGradientFill(["#388ae7","#89d7ff", "#00CC00", "#00BB00"],[0, .7, .8, .9], 0, 0, 0, stage.canvas.height);
        bg_image.graphics.drawRect(0,0,stage.canvas.width,stage.canvas.height);
        score.x = window.innerWidth*.5;
    }
    function initWorld(){
        world = new b2World(new b2Vec2(0,50), true);
        var listener = new b2ContactListener();
        listener.BeginContact = function(contact) {
        }
        listener.PostSolve = function(contact, impulse) {
            var a = contact.GetFixtureA().GetBody().GetUserData();
            var b = contact.GetFixtureB().GetBody().GetUserData();
            // console.log(contact.GetFixtureA().GetBody().GetUserData().name);
            // console.log(contact.GetFixtureB().GetBody().GetUserData().name);

            var impulse = impulse.normalImpulses[0];
                //if (impulse < 2) return;
          
            a.reactToHit(b, impulse);
            b.reactToHit(a, impulse);
            //console.log(impulse);
            // var entityA = world[idA];
            // var entityB = world[idB];
            // entityA.hit(impulse, entityB);
            // entityB.hit(impulse, entityA);
            
        };
        world.SetContactListener(listener);

        var debugDraw = new b2DebugDraw();
        debugDraw.SetSprite(debug.getContext('2d'));
        debugDraw.SetDrawScale(SCALE);
        debugDraw.SetFillAlpha(.5);
        debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
        world.SetDebugDraw(debugDraw);
    }
    function initStageGraphics(){
        floor = new BasicShape(world, stage, {type: "static",  
                                                shape: "square", 
                                                width: stage.canvas.width, 
                                                height: 50, 
                                                x: stage.canvas.width * .5,
                                                y: stage.canvas.height-50});
        floor.setName("floor_wall");

        treeRight = new TreeRight(world, stage);
        stage.addChild(treeRight.view);
        treeRight.setName("wall_right");

        treeLeft = new TreeLeft(world, stage);
        stage.addChild(treeLeft.view);
        treeLeft.setName("wall_left");

        character = new Character(world, stage, {type: "static",  
                                                shape: "square", 
                                                width: 62, 
                                                height: 94, 
                                                x: stage.canvas.width * .5,
                                                y: stage.canvas.height - 60});
        character.setName("character");
        character.view.mouseEnabled = true;
        stage.addChild(character.view);


        bow = new Bow();
        bow.x = stage.canvas.width * .5;
        bow.y = stage.canvas.height - 80;
        stage.addChild(bow);


        score = new createjs.DOMElement(document.getElementById("scoreboard"));

        score.visible = true;
        score.regX = 160;
        addCloud();
        //cloudInt = setInterval(addCloud,6000);
        // },500);
    }
    GameStage.prototype.initGame = function(){
        stage.addChild(score);
        $("#scoreboard").css('display','block');
        $("body").addClass("inactive");
        var sb = $('#scoreboard')[0];
        createjs.Tween.get(sb).to({top:-90},0,createjs.Ease.sineOut).wait(1000).to({top:0},300,createjs.Ease.sineOut);

        remainingBalloons = totalBalloons;
        arrowsUsed = 0;
        $('#score p').text("0");
        $('#arrows p').text(arrowsUsed);
        $("#balloons p").text(remainingBalloons);

        addBlock();
        var delay = window.deviceType == "phone" ? 5000 : 10000;
        blockInt = setInterval(
            addBlock, delay
        )

        balloonInt = setInterval(
            addBalloon, 4000
        )
        addBalloon();

        character.view.on("mousedown", handleMouseDown);

        getHighScores();
        gameOver = false;
    }
    function killGame() {

        $("body").removeClass("inactive");
        gameOver = true;
        clearInterval(blockInt);
        while (arrows.length > 0) {
            stage.removeChild(arrows[0].view);
            arrows[0].cleanUp()
            arrows.splice(0,1);

        }
        while (blocks.length > 0) {
            stage.removeChild(blocks[0].view);
            blocks[0].cleanUp()
            blocks.splice(0,1);

        }

        character.view.removeAllEventListeners("mousedown");

        createjs.Tween.get(document.getElementById("scoreboard")).to({height:window.deviceType == "phone" ? 520 : 430},1000,createjs.Ease.backOut);
        $("#scoreboard").append('<div id="game-over"></input>');
        $("#game-over").append('<input type="text" id="username" name="name" maxlength="10" value="Your Name"></input><br><input id="post-score" type="submit" value="Submit Score">');
        $("#game-over").append('<p><a id="play-again" href="#">PLAY AGAIN</a></p>');
        // $("#game-over").append('<p><a  href="#">POST SCORE</a></p>');
        $("#play-again").click(function(){
            $("#game-over").remove();
            createjs.Tween.get(document.getElementById("scoreboard")).to({height:60},500,createjs.Ease.sineOut);
            GameStage.prototype.initGame();
            return false;
        });
        $("#username").focus(function(){
            if ($(this).val() == "Your Name"){
                $(this).val("");
            }
        }).blur(function(){
            if ($(this).val() == ""){

                $(this).val("Your Name");
            }
            
        });
        $("#post-score").click(function(){
            submitHighScore();
            $("#post-score").attr('disabled','disabled');
        });
        setTimeout(getHighScores, 500)
        //getHighScores();
    }
    function submitHighScore(){
        if ($("#username").val() == "" || $("#username").val() == "Your Name") return;
        $.ajax({
           url: 'service.php',
           type: 'POST',
           data: {
            "action": "submitscore",
            "name": $("#username").val(),
            "score": $('#score p').text(),
            "arrows": arrowsUsed
            },
           dataType: 'json',
           success: function(response, textStatus, jqXHR) {
            makeHighScoreList(response.list);
            removeScoreSubmitElements();
             //alert(response.list);
           },
           error: function(jqXHR, textStatus, errorThrown){
             alert(textStatus, errorThrown);
          }
        });
    }
    function removeScoreSubmitElements(){
        $('#post-score').remove();
        $("#username").remove();
    }
    function getHighScores(){
        /* retrieve prescribed dose info */
        $.ajax({
           url: 'service.php',
           type: 'POST',
           data: {
            "action": "gethighscores"
            },
           dataType: 'json',
           success: function(response, textStatus, jqXHR) {
            makeHighScoreList(response.list);
             //alert(response.list);
           },
           error: function(jqXHR, textStatus, errorThrown){
             alert(textStatus, errorThrown);
          }
        });
        
        /* end retrieve */
    }
    function makeHighScoreList(list){
        if ($("#hs-list").length > 0) $("#hs-list").remove();
        var table = '<div id="hs-list" class="scoretable"><div class="scoretable" >';
            table += '<table>';
            table += '  <tr>';
            table += '      <td>Name</td>';
            table += '      <td>Score</td>';
            table += '      <td>Arrows Used</td>';
            table += '  </tr>';
        var i = 1;
        list.forEach(function(l){
            table += '  <tr>';
            $("#hs-list").append(i+". "+l.name+":"+l.score+"<br/>");
            table += '      <td>'+l.name+'</td>';
            table += '      <td>'+l.score+'</td>';
            table += '      <td>'+l.arrows+'</td>';
            //i++;
            table += '  </tr>';
        })
        $("#game-over").append(table);
        if (parseInt($('#score p').text()) < list[list.length-1].score && list.length == 10){
            removeScoreSubmitElements();
        }
        $("table tr").each(function(){
            var el = $(this)[0];
            createjs.Tween.get(el).set({opacity:0},el.style).wait(50 * $(this).index()).to({opacity:1},500,createjs.Ease.sineOut);

        })
    }
    function handleMouseDown(e) {
        isMouseDown = true;
        handleMouseMove(e);
        

        addPowerArrow();


        //console.log(e.pageX);
        document.addEventListener(Modernizr.touch ? "touchmove" : "mousemove", handleMouseMove, true);
        document.addEventListener(Modernizr.touch ? "touchend" : "mouseup", handleMouseUp, false);
    
    }
    function handleMouseMove(e) {
        // if (isMouseDown == false) return;

        mouseX = 0;
        mouseY = 0;
        if (Modernizr.touch) {
            mouseX = e.pageX;
            mouseY = e.pageY;
        } else {

            mouseX = (e.clientX - canvas.getBoundingClientRect().left);
            mouseY = (e.clientY - canvas.getBoundingClientRect().top);
        }
        
        var angle = Math.atan2(((mouseY * -1))+ (stage.canvas.height - 150),((mouseX * -1)) + (stage.canvas.width * .5));

        var power = Math.max(Math.abs((mouseY) - (stage.canvas.height - 150)),Math.abs((mouseX) - (stage.canvas.width * .5))) * .8;
        if (((mouseX * -1)) + (stage.canvas.width * .5) < 0) {
            bow.scaleX = -1;
            character.view.scaleX = -1;
        } else {
            bow.scaleX = 1;
            character.view.scaleX = 1;
        }
        bow.gotoFrame(29 * Math.min(1,(power/100)));
        if (powerArrow) {
            powerArrow.rotation = bow.rotation = angle * (180 / Math.PI) + 90;
            powerArrow.scaleX = powerArrow.scaleY = Math.max(1,1 + (power/100));
        }
        //e.preventDefault();
    };
    function handleMouseUp(e) {
        //return false;
        //document.removeEventListener("mousemove", handleMouseMove, true);
        removePowerArrow();
        bow.gotoFrame(1);

        
        document.removeEventListener(Modernizr.touch ? "touchend" : "mouseup", handleMouseUp);
        document.removeEventListener(Modernizr.touch ? "touchmove" : "mousemove", handleMouseMove);
        isMouseDown = false;
        if (!mouseX) return;
        var angle = Math.atan2(((mouseY * -1))+ (stage.canvas.height - 150),((mouseX * -1)) + (stage.canvas.width * .5));
        var power = Math.max(Math.abs((mouseY) - (stage.canvas.height - 150)),Math.abs((mouseX) - (stage.canvas.width * .5))) * .8;
        console.log(power)
        mouseX = undefined;
        mouseY = undefined;
        // return;
        // if (power == NaN) 
        addArrow(angle, power);
        if (mouseJoint){
            world.DestroyJoint(mouseJoint);
            mouseJoint = null;
        }

    }
    function addCloud(){
        var c = new createjs.Bitmap(AssetsLoader.getItemById("cloud").tag);
        stage.addChild(c);  
        c.regX = c.image.width * .5;

        stage.setChildIndex(c,1);

        var scaleFactor = Math.random();
        c.scaleX = Math.round(Math.random()) == 1 ? scaleFactor : -scaleFactor;
        c.scaleY = scaleFactor;
        c.y = 400 - (400 * scaleFactor);
        c.alpha = scaleFactor + .2;
        c.x = -(c.image.width * scaleFactor) * .5;
        createjs.Tween.get(c)
                .to({x:stage.canvas.width + (c.image.width * scaleFactor) * .5},90000 - (50000 * scaleFactor))
                .call(function(){
                        stage.removeChild(this); 
                    },[], c);

        setTimeout(addCloud,12000 + Math.random()*6000);
        //clouds.push(c);
  
    }

    function addBlock() {

        var rand = blocks.length % 2 == 0 ? stage.canvas.width * .3 : stage.canvas.width * .7
        var block = new BasicShape(world, stage, {type: "dynamic",  
                                        shape: "square", 
                                        width: window.deviceType == "phone" ? 50 : 100, 
                                        height: window.deviceType == "phone" ? 50 : 100,
                                        skinScale: window.deviceType == "phone" ? .5 : 1,
                                        friction:0,
                                        density:5,
                                        restitution: 0,
                                        skin: ldr.getItemById("block").tag, 
                                        x: rand,
                                        y: 200});
        block.setName("block");
        stage.addChild(block.view);
        blocks.push(block);
        var max = window.deviceType == "phone" ? 8 : 4;
        if (blocks.length == max) {
            clearInterval(blockInt);
        }
    }
    function removePowerArrow() {
        stage.removeChild(powerArrow);
        powerArrow = null;
    }
    function addPowerArrow() {
        powerArrow = new PowerArrow();
        stage.addChild(powerArrow);
        powerArrow.x = stage.canvas.width * .5;
        powerArrow.y = stage.canvas.height - 140;
        powerArrow.regY = 50;
        
    }
    function addArrow(angle, power){
        
        arrowsUsed++;
        $('#arrows p').text(arrowsUsed);
        var arrow = new Arrow(world, stage, {type: "dynamic",  
                                            shape: "square", 
                                            angle: angle, 
                                            power: power, 
                                            width: 50, 
                                            height:3,
                                            restitution:0, 
                                            friction:0, 
                                            density:5, 
                                            x: stage.canvas.width * .5, 
                                            y: stage.canvas.height - 160});
        stage.addChild(arrow.view);
        arrows.push(arrow);
        arrow.view.on("tallyScore",tallyArrowScore,null,false);
        console.log(arrows.length)
        if (arrows.length > 10) {
            stage.removeChild(arrows[0].view);
            arrows[0].cleanUp();
            arrows.splice(0,1);
        } 
    }
    function tallyArrowScore(e){
        
        var newScore = parseInt($('#score p').text()) + (e.target.points * e.target.kills);
        $('#score p').text(newScore);
        if (e.target.points > 0) {

            score.scaleY = .9;
            score.alpha = .5;
            createjs.Tween.get(score).to({alpha:1,scaleY:1},300,createjs.Ease.backOut);
            //TweenMax.to(score,.3,{alpha:1,scaleY:1,ease:Back.easeOut});
        }
        if (e.target.kills > 1) {
            addBonus(e.target.kills);
        }

    }
    function addBonus(i) {
        createjs.Sound.play("star");
        bonusStar = new createjs.Shape();
        bonusStar.graphics.beginFill("#3786A6")
                            .drawPolyStar(0, 0, 120, 8, 0.6, 25)
                            .beginFill("#20638C")
                            .drawPolyStar(0, 0, 150, 8, 0.6, -90);
        bonusStar.x = stage.canvas.width * .5;
        bonusStar.y = stage.canvas.height * .35;
        bonusStar.scaleX = bonusStar.scaleY = bonusStar.alpha = 0;
        bonusStar.cache(-150,-150,300,300)
        stage.addChild(bonusStar);
       
        //var bonusText = $('<div id="bonus">'+i+'x Bonus!</div>');
        var bonusText = new createjs.Text(i+"x Bonus!","bold 50px Arial", "#FFF");
        bonusText.textBaseline = "center";
        bonusText.textAlign = "center";
        bonusText.scaleX = bonusText.scaleY = 0;
        bonusText.x = stage.canvas.width * .5;
        bonusText.y = stage.canvas.height * .35;
        stage.addChild(bonusText);

        var frame = new createjs.Shape();
        frame.graphics.beginFill("#FF0").drawRect(0,0,3,2);
        frame.regX = 0;
        frame.regY = 0;

       
        createjs.Tween.get(bonusText)
                        .wait(200)
                        .to({alpha:1,scaleX:1,scaleY:1},500,createjs.Ease.backOut)
                        .wait(1000)
                        .to({alpha:0,scaleX:.2,scaleY:.2},500,createjs.Ease.backIn)
                        .call(function(){
                            if (!bonusText) return;
                            stage.removeChild(bonusText);
                            stage.removeChild(bonusStar);
                            bonusText = null;  
                            bonusStar = null;  
                        });
        createjs.Tween.get(bonusStar)
                        .to({alpha:1,scaleX:1,scaleY:.8},500,createjs.Ease.backOut)
                        .wait(900)
                        .to({alpha:0,scaleX:.2,scaleY:.2},500,createjs.Ease.backIn);
        //TweenMax.to(bonusText,.5,{alpha:1,scaleX:1,scaleY:1,ease:Back.easeOut});
        setTimeout(function(){
            
        },1500)
    }
    function addBalloon() {
        remainingBalloons--;
        $("#balloons p").text(remainingBalloons);
        if (remainingBalloons == 0) {
            clearInterval(balloonInt)
        }
        var i = Math.round(Math.random());
        var rand = i == 0 ? Math.random() * stage.canvas.width * .2 + 20:
                            Math.random() * stage.canvas.width * .2 + stage.canvas.width * .8 - 20;
        var balloon = new Balloon(world, stage, {type: "dynamic",  
                                            shape: "circle", 
                                            width: 10, 
                                            restitution:.1,
                                            x: rand, 
                                            y: stage.canvas.height - 150});
        stage.addChild(balloon.view);
        balloon.view.addEventListener("Hit", onHit);
        balloons.push(balloon);
        if (balloons.length > 10) {
            stage.removeChild(balloons[0].view);
            balloons[0].cleanUp();
            balloons.splice(0,1);
        } 
        //addText(balloon.view);
    }
    function onHit(e) {
        addText(e.target)
        e.target.removeEventListener("Hit", onHit);
        console.log("HIT");
        var pStr = String(Math.ceil(Math.random()*3));
        console.log("pStr",pStr);
        createjs.Sound.play("pop" + pStr);
    }
    function addText(target) {

        var points = new BalloonPoints(stage, target);
        stage.addChild(points);
        console.log("points",points)
        console.log("points.x",points.x)
        points.x = target.x;
        points.y = target.y;
        points.on("remove",removeText);
        console.log("target.x",points.x)
        console.log("points.x",points.x)
        //createjs.Tween.get(pointsText);
        //TweenMax.to(pointsText,2.5,{scaleX:1, scaleY:1, ease:Elastic.easeOut});
        //TweenMax.to(pointsText,2.5,{scaleX:.2, scaleY:.2, delay:1, ease:Elastic.easeIn, onComplete:removeText, onCompleteParams:[pointsText]});
    }
    function removeText(e){
        stage.removeChild(e.target);
        e.target.off("remove",removeText);

    }
    function addBall() {
        var b = new Ball(world, stage);
        stage.addEventListener("remove",removeBall);
        stage.addChild(b.view);
        //balloons.push(b);
        
    }
    function removeBall(e){
        console.log(e)
    }
    function tick(e) {
        //console.log("sadf")

        // var increase = Math.PI * 2 / 100;
        // console.log(Math.cos( counter ) / 2 + 0.5;
        // counter += increase;
        // if (isMouseDown) {
        //     if (!mouseJoint) {
        //          var body = getBodyAt(mouseX / SCALE, mouseY / SCALE);
        //          if (body) {
        //             var md = new b2MouseJointDef();
        //             md.bodyA = world.GetGroundBody();
        //             md.bodyB = body;
        //             md.target.Set(mouseX / SCALE, mouseY / SCALE);
        //             md.collideConnected = true;
        //             md.maxForce = 100 * body.GetMass();
        //             mouseJoint = world.CreateJoint(md);
        //             body.SetAwake(true);
        //          }
        //       } else {
        //           mouseJoint.SetTarget(new b2Vec2(mouseX / SCALE, mouseY / SCALE));
        //       }
            
        // }
        //world.DrawDebugData();
        if (!gameOver) {
            stage.update();

            world.Step(1/60, 10, 10);
            world.ClearForces();
        }
        if (remainingBalloons == 0 && balloons.length == 0 && getIncompleteArrows().length == 0 && gameOver == false) {
            killGame();
        }
        balloons.forEach(function(o){
            if(o.toBeRemoved === true) {
                console.log("REMOVE");
                stage.removeChild(o.view);
                o.cleanUp()
                balloons.splice(balloons.indexOf(o),1);
                
            }
        })
        arrows.forEach(function(o){
          
            if(o.view.toBeRemoved === true) {
                console.log("REMOVE");
                stage.removeChild(o.view);
                o.cleanUp()
                arrows.splice(arrows.indexOf(o),1);
            }
        })
    }
    function getIncompleteArrows(){
        var aList = [];
        arrows.forEach(function(a){
            if (!a.complete) aList.push(a);
        });
        return aList;
    }
    function getBodyAt(x, y) {
       var mousePVec = new b2Vec2(x, y);
       var aabb = new b2AABB();
       aabb.lowerBound.Set(x - 0.001, y - 0.001);
       aabb.upperBound.Set(x + 0.001, y + 0.001);
       
       // Query the world for overlapping shapes.

       var selectedBody = null;
       world.QueryAABB(function(fixture) {
         if(fixture.GetBody().GetType() != b2Body.b2_staticBody) {
            if(fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
               selectedBody = fixture.GetBody();
               return false;
            }
         }
         return true;
       }, aabb);
       return selectedBody;
    }
    return GameStage;
});