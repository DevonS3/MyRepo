define([
    'asset-manager',
    'game-engine',
    'game-board',
    'entity',
], function(
    AssetManager,
    GameEngine,
    GameBoard,
    Entity,
) {

    let init = function() {
        console.log("init")
    };

    // the "main" code begins here

    toload = [
        "img/ZXe.png",
        "img/Leo.png",
        "img/EnemySheet1.png",
    ];

    let ASSET_MANAGER = new AssetManager(toload);

    ASSET_MANAGER.downloadAll(function () {
        console.log("starting up da sheild");
        let canvas = document.getElementById('gameWorld');
        let ctx = canvas.getContext('2d');

        let gameEngine = new GameEngine();

        // gameEngine.showOutlines = true;
        // let gameboard = new GameBoard();

        // gameEngine.addEntity(gameboard);
        // console.log(hero);
        //(game, x, y, img=null, ctx=null, scale=3, spriteWidth=50, spriteHeight=50)
        gameEngine.addEntity(new Entity.Hero(gameEngine, 200, 500, ASSET_MANAGER.getAsset("img/ZXe.png"), ctx));
        gameEngine.addEntity(new Entity.Leo(gameEngine, 200, 150, ASSET_MANAGER.getAsset("img/Leo.png"), ctx));
        gameEngine.addEntity(new Entity.Flames(gameEngine, 200, 700, ASSET_MANAGER.getAsset("img/Leo.png"), ctx));
        gameEngine.addEntity(new Entity.Soldier(gameEngine, 200, 50, ASSET_MANAGER.getAsset("img/EnemySheet1.png"), ctx));

        gameEngine.init(ctx);
        gameEngine.start();
    });

    return {
        init: init
    };

});

