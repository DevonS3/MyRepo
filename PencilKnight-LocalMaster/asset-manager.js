define([

],function(

){
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
            // console.log(path.toString());
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
                img.addEventListener("load", function () {
                    // console.log("dun: " + this.src.toString());
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
    
    return AssetManager;
});
