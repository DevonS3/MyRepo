// This game shell was happily copied from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();


/*****************
AssetManager class

successCount - the number of successes fetching assets
errorCount - the number of failures fetching assets
cache - the asset cache
downloadQueue - the queue of assets to download
*****************/
class AssetManager {

    constructor (downloadQueue = []) {
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = [];
        this.downloadQueue = downloadQueue;
    }

    /*
    Adds an asset path to the download queue
    */
    queueDownload (path) {
        console.log(path.toString());
        this.downloadQueue.push(path);
    }

    /*
    Checks if all assets have been responded to (either success or failure)
    */
    isDone () {
        return (this.downloadQueue.length == this.successCount + this.errorCount);
    }

    /*
    Attempts to download each asset in the queue
    */
    downloadAll (callback) {
        if (this.downloadQueue.length === 0) window.setTimeout(callback, 100);
        for (let i = 0; i < this.downloadQueue.length; i++) {
            let path = this.downloadQueue[i];
            let img = new Image();
            let that = this;

            ///// can use promises here
            img.addEventListener("load", function () {
                console.log("dun: " + this.src.toString());
                that.successCount += 1;
                if (that.isDone()) { callback(); }
            });
            img.addEventListener("error", function () {
                that.errorCount += 1;
                if (that.isDone()) { callback(); }
            });
            img.src = path;
            this.cache[path] = img;
        }
    }

    /*
    Gets an asset
    */
    getAsset (path) {
        //console.log(path.toString());
        return this.cache[path];
    }
    
} // end of AssetManager


/***************
GameEngine class
****************/
class GameEngine {

    constructor () {
        this.entities = [];
        this.ctx = null;
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.surfaceWidth = null;
        this.surfaceHeight = null;
    }

    /*
    Initializes the game engine
    */
    init (ctx) {
        this.ctx = ctx;
        this.surfaceWidth = this.ctx.canvas.width;
        this.surfaceHeight = this.ctx.canvas.height;
        this.startInput();

        console.log('game initialized');
    }

    /*
    Starts the game engine
    */
    start () {
        console.log("starting game");
        let that = this;
        (function gameLoop() {
            that.loop();
            requestAnimFrame(gameLoop, that.ctx.canvas);
        })();
    }

    /*
    Input handling, initializes listeners
    */
    startInput () {
        console.log('Starting input');

        let getXandY = function (e) {
            let x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
            let y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

            if (x < 1024) {
                x = Math.floor(x / 32);
                y = Math.floor(y / 32);
            }

            return { x: x, y: y };
        }

        let that = this;

        this.ctx.canvas.addEventListener("click", function (e) {
            that.click = getXandY(e);
        }, false);

        this.ctx.canvas.addEventListener("mousemove", function (e) {
            that.mouse = getXandY(e);
        }, false);


        this.ctx.canvas.addEventListener("mousewheel", function (e) {
            that.wheel = e;
        }, false);
        console.log('Input started');
    }

    /*
    Adds an entity to the game
    */
    addEntity (entity) {
        console.log('added entity');
        this.entities.push(entity);
    }


    /*
    Draws all entities in the list
    */
    draw (drawCallback) {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.save();
        for (let i = 0; i < this.entities.length; i++) {
            this.entities[i].draw(this.ctx);
        }
        if (drawCallback) {
            drawCallback(this);
        }
        this.ctx.restore();
    }

    /*
    Updates all entities, calls their update methods
    */
    update () {
        let entitiesCount = this.entities.length;

        for (let i = 0; i < entitiesCount; i++) {
            let entity = this.entities[i];

            if (!entity.removeFromWorld) {
                entity.update();
            }
        }

        for (let i = this.entities.length - 1; i >= 0; --i) {
            if (this.entities[i].removeFromWorld) {
                // todo: what does this do?
                this.entities.splice(i, 1);
            }
        }
    }

    /*
    Defines the game loop
    */
    loop () {
        this.update();
        this.draw();
        this.click = null;
        this.wheel = null;
    }

} // end of GameEngine


/***********
Entity class

game - a reference to the game in which this entity exists
x, y - entity's coordinates
removeFromWorld - a flag that denotes when to remove this entity from the game
************/
class Entity {

    constructor (game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.removeFromWorld = false;
    }

    /*
    Updates the entity each game loop
    i.e. what does this entity do?
    */
    update () {
    }

    /*
    Draws this entity
    */
    draw (ctx) {
        if (this.game.showOutlines && this.radius) {
            ctx.beginPath();
            ctx.strokeStyle = "green";
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            ctx.stroke();
            ctx.closePath();
        }
    }

    /*
    todo: what does this do?
    */
    rotateAndCache (image, angle) {
        let offscreenCanvas = document.createElement('canvas');
        let size = Math.max(image.width, image.height);
        offscreenCanvas.width = size;
        offscreenCanvas.height = size;
        let offscreenCtx = offscreenCanvas.getContext('2d');
        offscreenCtx.save();
        offscreenCtx.translate(size / 2, size / 2);
        offscreenCtx.rotate(angle);
        offscreenCtx.translate(0, 0);
        offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
        offscreenCtx.restore();
        //offscreenCtx.strokeStyle = "red";
        //offscreenCtx.strokeRect(0,0,size,size);
        return offscreenCanvas;
    }


} // end of Entity class


/**************
GameBoard class
**************/
class GameBoard extends Entity {

    // so this prototype.call() is calling the Entity constructor with (game=null, x=0, y=0)
    constructor () {
        super(null, 0, 0);
        this.constructor = GameBoard;
        // GameBoard.prototype = new Entity();
        // GameBoard.prototype.constructor = GameBoard;
        // is this really what was intended?
    }

    update () {
        Entity.prototype.update.call(this);
    }

    draw (ctx) {
    }

}



// the "main" code begins here

let ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    let canvas = document.getElementById('gameWorld');
    let ctx = canvas.getContext('2d');

    let gameEngine = new GameEngine();
    let gameboard = new GameBoard();

    gameEngine.addEntity(gameboard);
 
    gameEngine.init(ctx);
    gameEngine.start();
});
