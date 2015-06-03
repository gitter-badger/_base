/* main.js ----------- */


var appBase = (function() {
    'use strict';

    var config = {
        helloMsg: 'Hello World !'
    };

    var app = {

        // Initialisation logic
        init: function(options) {

            // Custom config via init()
            $.extend(config, options);

            // this.sayHello(config.helloMsg);
        },

        sayHello: function(str) {
            console.log(str);
        }
    };

    return app;

})();

$(document).ready(function() {
    appBase.init();
});
