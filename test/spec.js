/* jshint mocha: true */
/* global appBase, expect */


(function() {
    'use strict';

    var app = appBase;

    describe('Spec Tests', function() {

        it('should be an object', function() {
            expect(app).to.be.an('object');
        });

        it('should have the property', function() {
            expect(app).to.have.property('init');
        });

    });

    // describe('Give it some context..', function() {
    //     it('Simple Test', function() {
    //         expect(1).to.equal(1);
    //     });
    // });

})();
