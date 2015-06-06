# [_base][repo-url]

[![Release Version][release-badge]][release-url]
[![David devDependencies Status][david-devDeps-badge]][david-devDeps-url]
[![Travis Status][travis-badge]][travis-url]
[![Codacy Badge][codacy-badge]][codacy-url]

> Minimal front-end framework/boilerplate and build process to quickly get projects going.

[Test][home-url]

## Requirements

- Install [node.js][nodejs-url]. (see [nvm][nvm-url])
- Install [gulp][gulp-url] task runner and [bower][bower-url] package manager globally.

```sh
npm install -g gulp bower
```

## Installation

Clone the project and install dependencies. 

```sh
git clone https://bymathias@github.com/bymathias/_base.git project
cd project

npm install
bower install
```

## Usage

Start hacking away, available commands.

```sh
# gulp <task> [options]
#
# Options:
# 
#    --production    Minify CSS, JS, HTML
#    --homepage      Production homepage (pkg.homepage)
#    --dest <DIR>    Overrides destination directory

gulp
gulp watch
gulp bundle

# List all --tasks
gulp -T
```

```sh
# Bump version
# npm run bump [ patch|minor|major|prerelease|prepatch|preminor|premajor|<newversion> ]
npm run bump patch

# Release and deploy (gh-pages)
npm run release
```

## Test

Run [mocha][mocha-url] tests.

```sh
npm test
```

## Contributing

Anyone and everyone is welcome to [contribute][pulls-url].

## License

- Third-party libraries, licensed under their respective licenses.
- Custom bits, licensed under the [MIT License][license-url].


[repo-url]: https://github.com/bymathias/_base
[home-url]: https://bymathias.github.io/_base
[license-url]: https://raw.githubusercontent.com/bymathias/_base/master/LICENSE
[pulls-url]: https://github.com/bymathias/_base/pulls

[nodejs-url]: https://nodejs.org
[nvm-url]: https://github.com/creationix/nvm
[gulp-url]: http://gulpjs.com
[bower-url]: http://bower.io
[mocha-url]: http://mochajs.org

[release-badge]: https://img.shields.io/github/release/bymathias/_base.svg?style=flat-square
[release-url]: https://github.com/bymathias/_base/releases

[david-devDeps-badge]: http://img.shields.io/david/dev/bymathias/_base.svg?style=flat-square
[david-devDeps-url]: https://david-dm.org/bymathias/_base#info=devDependencies

[travis-badge]: http://img.shields.io/travis/bymathias/_base.svg?style=flat-square
[travis-url]: https://travis-ci.org/bymathias/_base

[codacy-badge]: https://img.shields.io/codacy/e6879d52d61f43939f351bcb6617e8e4.svg?style=flat-square
[codacy-url]: https://www.codacy.com/app/bymathias/_base
