define([
    'entity',
],function(
    Entity,
){

    /**************
    GameBoard class

    
    **************/
    class GameBoard extends Entity.Entity {

        // so this prototype.call() is calling the Entity constructor with (game=null, x=0, y=0)
        constructor () {
            super(null, 0, 0);
            this.constructor = GameBoard;
            // GameBoard.prototype = new Entity();
            // GameBoard.prototype.constructor = GameBoard;
            // is this really what was intended?
        }

        update () {
            super.update(this)
            // Entity.Entity.prototype.update.call(this);
        }

        draw (ctx) {
        }

    } // end GameBoard class

    return GameBoard;

});