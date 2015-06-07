[![Release Version][release-badge]][release-url]
[![Tag Version][tag-badge]][tag-url]
[![David devDependencies Status][david-devDeps-badge]][david-devDeps-url]
[![Travis Status][travis-badge]][travis-url]
[![Codacy Badge][codacy-badge]][codacy-url]

> Minimal front-end framework/boilerplate and build process to quickly get projects going.

[Test][home-url]

## Requirements

[![Join the chat at https://gitter.im/bymathias/_base](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/bymathias/_base?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

- [Node.js][nodejs-url] and [npm][npm-url]. (see [nvm][nvm-url])
- [Editorconfig][editorconfig-url].

## Installation

Install [gulp][gulp-url] task runner and [bower][bower-url] package manager globally.

```sh
npm install -g gulp bower
```

Get the repository.

```sh
# Using Git
git clone https://bymathias@github.com/bymathias/_base.git project
cd project

# Or using Curl
cd project
curl -#L https://github.com/bymathias/_base/tarball/master | tar -xzv --strip-components 1
```

Install local [npm][npm-url] and [bower][bower-url] dependencies. 

```sh
npm install
bower install
```

## Installation (one-line)

```sh
bash <(curl -s https://raw.githubusercontent.com/bymathias/_base/install/init.sh)>
```

## Usage

See available [gulp][gulp-url] tasks.

```sh
gulp ?
```

## Test

Lint config/test and run [mocha-phantomjs][mocha-phantomjs-url] tests.

```sh
npm test
```

## License

- Third-party libraries, licensed under their respective licenses.
- Custom bits, licensed under the [MIT License][license-url].

[home-url]: https://bymathias.github.io/_base
[license-url]: https://raw.githubusercontent.com/bymathias/_base/master/LICENSE
[pulls-url]: https://github.com/bymathias/_base/pulls

[nodejs-url]: https://nodejs.org
[npm-url]: https://www.npmjs.com
[nvm-url]: https://github.com/creationix/nvm
[editorconfig-url]: http://editorconfig.org "Help make the world a better place"

[gulp-url]: http://gulpjs.com
[bower-url]: http://bower.io
[mocha-phantomjs-url]: http://metaskills.net/mocha-phantomjs

[release-badge]: https://img.shields.io/github/release/bymathias/_base.svg?style=flat-square
[release-url]: https://github.com/bymathias/_base/releases

[tag-badge]: https://img.shields.io/github/tag/bymathias/_base.svg?style=flat-square
[tag-url]: https://github.com/bymathias/_base/tags

[david-devDeps-badge]: http://img.shields.io/david/dev/bymathias/_base.svg?style=flat-square
[david-devDeps-url]: https://david-dm.org/bymathias/_base#info=devDependencies

[travis-badge]: http://img.shields.io/travis/bymathias/_base.svg?style=flat-square
[travis-url]: https://travis-ci.org/bymathias/_base

[codacy-badge]: https://img.shields.io/codacy/e6879d52d61f43939f351bcb6617e8e4.svg?style=flat-square
[codacy-url]: https://www.codacy.com/app/bymathias/_base
