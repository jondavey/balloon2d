require.config({
    baseUrl: "js",
    shim: {
        BasicShape: {
            deps: ['Base'],
            exports: 'BasicShape'
        },
        Arrow: {
            deps: ['BasicShape', 'Base'],
            exports: 'Arrow'
        }
    },
    paths: (function() {
        return {
            easeljs     : 'libs/easeljs/createjs-2013.12.12.min',
            CSSPlugin   : 'libs/tweenjs/CSSPlugin',
            box2d       : 'libs/box2d/Box2dWeb-2.1.a.3.min',
            jquery      : 'libs/jquery/jquery-1.7.1.min',
        };
    })()
});

var dependencies = [
    'jquery',
    'GameStage',
    'AssetsLoader'
];
require(dependencies, function($, GameStage, AssetsLoader) {
    window.requestAnimFrame = (function(){
          return  window.requestAnimationFrame       || 
                  window.webkitRequestAnimationFrame || 
                  window.mozRequestAnimationFrame    || 
                  window.oRequestAnimationFrame      || 
                  window.msRequestAnimationFrame     || 
                  function(/* function */ callback, /* DOMElement */ element){
                    window.setTimeout(callback, 1000 / 60);
                  };
    })();
    $("document").ready(function(){
        var resizeTimer;
        var gs;
        AssetsLoader.loader.on("complete", onCompleteLoad)
        AssetsLoader.loader.on("progress", onProgressLoad)

        function resize(e){
            gs.resize();
        }
        
        
        function onProgressLoad(e){

            $("#preload-bar").css('width',100 * e.progress + '%');
            $("#preload-bar").css('left', String(50 - (50 * e.progress)) + '%');
        }
        function onCompleteLoad(){
            $("#game-canvas").css('display','inline');
            $("#preload-bar").remove();
            // console.log(AssetsLoader.loader);
            // console.log(AssetsLoader.loader);
            gs = new GameStage();

            $(window).resize(function () { clearTimeout(resizeTimer);
                resizeTimer = setTimeout(resize, 100); 
            });
            resize();
            //createjs.Sound.play("star");
            var img = $("body").prepend('<div id="overlay" style="height:100%;"><h2>HOW TO PLAY!</h2><br><img src="'+AssetsLoader.getItemById("instructions").src+'"><p><a href="#" id="play">PLAY!</a></p></div>');
            $("#play").click(function(){
                $("#overlay").remove();
                gs.initGame();
                return false;
            })

        }
    });
});