define(['easeljs'],function(easeljs) {
    "use strict";
    var p;
    function BalloonPoints(stage, target){
        if (!(this instanceof BalloonPoints)) {
            throw new TypeError("BalloonPoints constructor cannot be called as a function.");
        }
        this.Container_Init();
        console.log(this)
        var bonusStar = new createjs.Shape();
        bonusStar.graphics.beginFill("#3786A6")
                            .drawPolyStar(0, 0, 50, 8, 0.6, 25)
                            .beginFill(target.hex)
                            .drawPolyStar(0, 0, 40, 8, 0.6, -90);
        // bonusStar.x = target.x;
        // bonusStar.y = target.y;
        bonusStar.scaleX = bonusStar.scaleY = bonusStar.alpha = 0;
        bonusStar.cache(-150,-150,300,300)
        this.addChild(bonusStar);

        createjs.Tween.get(bonusStar)
                        .to({alpha:1,scaleX:1,scaleY:.8},500,createjs.Ease.backOut)
                        .wait(900)
                        .to({alpha:0,scaleX:.2,scaleY:.2},500,createjs.Ease.backIn);

        var points = Math.round(target.y/50)*50;
        var pointsText = new createjs.Text(String(target.points),"30px Arial", getContrastYIQ(target.hex));
        pointsText.regY = -10;
        // pointsText.x = target.x; 
        // pointsText.y = target.y; 
        pointsText.textBaseline = "center";
        pointsText.textAlign = "center";
        this.addChild(pointsText);
        pointsText.scaleX = pointsText.scaleY = 0;
        createjs.Tween.get(pointsText)
                        .wait(100)
                        .to({scaleX:1, scaleY:1},500, createjs.Ease.backOut)
                        .wait(1000,false)
                        .to({scaleX:.2, scaleY:.2},300, createjs.Ease.backOut)
                        .call(removeText,[pointsText, this]);
        function removeText(t,scope){
            //scope.removeChild(t);
            scope.dispatchEvent(new createjs.Event("remove"));
        } 
    }
    function getContrastYIQ(hexcolor){
        var r = parseInt(hexcolor.substr(1,2),16);
        var g = parseInt(hexcolor.substr(3,2),16);
        var b = parseInt(hexcolor.substr(5,2),16);
        var yiq = ((r*299)+(g*587)+(b*114))/1000;
        return (yiq >= 128) ? '#000' : '#FFF';
    }
    p = BalloonPoints.prototype = new createjs.Container();
    p.Container_Init = BalloonPoints.prototype.initialize;
    p.constructor = BalloonPoints;
    return BalloonPoints;
});