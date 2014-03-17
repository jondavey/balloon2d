define(['easeljs'], function(easeljs){
    var instance = null;
   
    function AssetsLoader(){
        if(instance !== null){
            throw new Error("Cannot instantiate more than one AssetsLoader, use AssetsLoader.getInstance()");
        } 
        
        this.initialize();
    }

    AssetsLoader.prototype = {
        initialize: function(){
            // summary:
            //      Initializes the singleton.
            
            this.foo = 0;
            this.bar = 1;
            var manifest = [
                {src:"images/BowAndArrow.png", id:"bow"},
                {src:"images/stickman2.png", id:"stickman"},
                {src:"images/trunk.jpg", id:"trunk"},
                {src:"images/block2.png", id:"block"},
                {src:"images/cloud.png", id:"cloud"},
                {src:"images/tree_top.png", id:"tree_top"},
                {src:"images/instructions.gif", id:"instructions"},
                {src:"sounds/pop_1.ogg", id:"pop1"},
                {src:"sounds/pop_2.ogg", id:"pop2"},
                {src:"sounds/pop_3.ogg", id:"pop3"},
                {src:"sounds/pop_4.ogg", id:"pop4"},
                {src:"sounds/star.ogg", id:"star"}
            ];
            this.loader = new createjs.LoadQueue();
            createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.FlashPlugin]);
            createjs.Sound.alternateExtensions = ["mp3"];
            this.loader.installPlugin(createjs.Sound);
            this.loader.loadManifest(manifest);

            
        },
        getItemById: function(id) {
            return this.loader._loadItemsById[id];
        },
        loader: null
    };
    AssetsLoader.getInstance = function(){
        // summary:
        //      Gets an instance of the singleton. It is better to use 
        if(instance === null){
            instance = new AssetsLoader();
        }
        return instance;
    };

    return AssetsLoader.getInstance();
});