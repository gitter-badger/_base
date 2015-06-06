/* jshint mocha: true, expr: true */


(function() {
    'use strict';

    var chai   = require('chai');
    var expect = chai.expect;
    // var should = chai.should();

    var pkg = require('./../package.json');


    describe('\'Package.json\' Tests', function() {

        it('name', function() {
            var name = pkg.name;
            expect(name).to.have.length.below(45);
        });

        it('description', function() {
            var description = pkg.description;
            expect(description).to.have.length.of.at.least(55);
            expect(description).to.have.length.below(155);
        });

        it('license', function() {
            expect(pkg.license).to.be.a('string');
        });

        it('author', function() {
            expect(pkg.author).to.be.a('string');
        });

        it('repository', function() {
            expect(pkg.repository).to.include.keys('type', 'url');
        });

        it('directory', function() {
            expect(pkg.directories).to.include.keys('src', 'dest', 'test');
        });

    });

    // describe('', function() {
    //     it('', function() {
    //     });
    // });

})();
