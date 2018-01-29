// require.config({
//     paths: {
//         jquery: 'vendor/jquery-1.11.3.min',
//         underscore: 'vendor/underscore-min',
//     },

//     shim: {
//         underscore: {
//             exports: '_'
//         },
//     }
// });
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

require(['core'], function(Core) {
    Core.init();
});