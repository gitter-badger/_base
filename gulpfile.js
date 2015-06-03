/* _base Gulpfile | github.com/bymathias/_base */

'use strict';

// Requirements

var gulp = require('gulp');
var gp   = require('gulp-load-plugins')();
var fs   = require('fs');
var path = require('path');
var _    = require('underscore');
var es   = require('event-stream');
// Temporary solution until gulp 4
var runSequence = require('run-sequence');

var browserSync = require('browser-sync');
var reload      = browserSync.reload;

var pkg  = require('./package');
var dirs = pkg.directories;
// Overrides dest using `--dest DIR`
dirs.dest = gp.util.env.dest || dirs.dest;

// Optimize for production using `--env production`
var debug = (process.env.NODE_ENV || gp.util.env.env) !== 'production';

/**
 * ===============================================================
 *  CONFIGURATION
 * ===============================================================
 */

var cf = {

    main: {
        // CSS files to compile using `@import`
        css: ['main.css'],

        // JS files to concatenate to `main.js`
        js: [
            'helper.js',
            'main.js'
        ]
    },

    // CSS/JS files to concatenate to `bundle.{css,js}`.
    bundles: {
        css: [
            'normalize*.css',
            '!(main)*.css',
            'main*.css'
        ],
        js: [
            '!(main)*.js',
            'main*.js'
        ]
    },

    // CSS/JS/.. components files to copy
    components: [
        {
            'assets/css': [
                'bower_components/normalize-css/normalize.css'
            ]
        },
        {
            'assets/js/libs': [
                'bower_components/modernizr/modernizr.js',
                'bower_components/jquery/dist/jquery.min.js'
            ]
        }
    ],

    // Paths to project folders
    paths: {
        src: {
            css:  dirs.src + '/styles',
            js:   dirs.src + '/scripts',
            img:  dirs.src + '/images',
            font: dirs.src + '/fonts',
            file: dirs.src + '/files',
            view: dirs.src + '/views'
        },
        dest: {
            css:  dirs.dest + '/assets/css',
            js:   dirs.dest + '/assets/js',
            img:  dirs.dest + '/assets/img',
            font: dirs.dest + '/assets/font'
        }
    },

    // Glob patterns
    globs: {
        css:  '**/*.css',
        js:   '**/*.js',
        img:  '**/!(_)*.{png,jpg,jpeg,gif,svg}',
        font: '**/!(_)*.{eot,svg,ttf,woff,woff2}',
        file: '**/!(_)*',
        view: '**/!(_)*.{html,php}'
    },

    /**
     * Myth settings
     * (npmjs.com/package/gulp-myth)
     */
    myth: {
        // sourcemap: true,
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
    },

    /**
     * CSSO settings
     * (npmjs.com/package/gulp-csso)
     * Set to `true` to disable structure minimization
     */
    csso: false,

    /**
     * Uglify settings
     * (npmjs.com/package/gulp-uglify)
     */
    uglify: {
        // Pass false to skip mangling names
        // mangle: true,
        // Specify additional output options
        // output: {},
        // Preserve comments that start with a bang (!)
        // or include a Closure Compiler directive
        preserveComments: 'some'
    },

    /**
     * HtmlMin settings
     * (npmjs.com/package/gulp-htmlmin)
     */
    htmlmin: {
        // Strip HTML comments
        removeComments: true,
        // Collapse white space that contributes
        // to text nodes in a document tree
        collapseWhitespace: true,
        // Minify Javascript in script elements and on* attributes
        minifyJS: true,
        // Minify CSS in style elements and style attributes
        minifyCSS: true
    },

    /**
     * BrowserSync settings
     * (npmjs.com/package/browser-sync)
     */
    browserSync: {
        // logLevel: 'debug',
        browser: [
            // 'firefox',
            // 'google chrome',
            'google chrome canary'
        ],
        // https: true,
        port: 3000,
        server: {
            baseDir: dirs.dest  // Web root dir
        }
        // OR
        // proxy: 'local.dev'
    }

};

/**
 * ===============================================================
 *  HELPERS
 * ===============================================================
 */

var today = gp.util.date(new Date(), 'yyyy-mm-dd');
var chalk = gp.util.colors;
var noop  = gp.util.noop;
var log   = gp.util.log;

log.file = function(name, file, status, err) {
    return log(
        chalk.yellow('[' + name + '] ') +
        chalk.magenta(path.basename(file)) + ' ' +
        (status === 'Fail' ? chalk.red('✖ ' + status) : chalk.blue('✔ ' + status)) + ' ' +
        chalk.gray(err === 0 ? '' : ('(' + err + ' problem' + (err === 1 ? '' : 's') + ')'))
    );
};

log.error = function(line, col, msg, code) {
    return log(
        chalk.cyan('[line ' + line + ' - col ' + col + '] ') +
        chalk.dim(msg) + ' ' +
        chalk.gray(code)
    );
};

// Custom reporter

var reporter = function(type) {
    return es.map(function(file, cb) {
        var ft = file[type];

        if (!ft.success) {
            var errors = (type === 'jshint') ? ft.results.length : ft.errorCount;
            log.file(type, file.path, 'Fail', errors);

            var results = (type === 'htmlhint' ? ft.messages : ft.results);
            results.forEach(function(res) {
                var err = res.error;

                if (type === 'jshint') {
                    log.error(err.line, err.character, err.reason, err.code);
                } else {
                    log.error(err.line, err.col, err.message, err.rule.id);
                }

            });
        } else {
            log.file(type, file.path, 'Success', 0);
        }

        cb(null, file);
    });
};

// Handle errors

var onError = function(err) {
    gp.util.beep();
    log.file(err.plugin, err.fileName || '?', 'Fail', 0);
    log(JSON.stringify(err, null, ' '));
};

// Title case a string

var titleCase = function(str) {
    return str.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

/**
 * ===============================================================
 *  TASKS Development
 * ===============================================================
 */

// Compile CSS

gulp.task('styles', function() {
    return gulp
        .src(cf.main.css, { cwd: cf.paths.src.css })
        .pipe(gp.plumber({ errorHandler: onError }))
        .pipe(gp.myth(cf.myth))
        .pipe(gp.csscomb())
        .pipe(gp.csslint('.csslintrc'))
        .pipe(reporter('csslint'))
        .pipe(debug ? noop() : gp.csso(cf.csso))
        .pipe(debug ? noop() : gp.rename({ suffix: '.min' }))
        .pipe(gulp.dest(cf.paths.dest.css))
        .pipe(reload({ stream: true }));
});

// Compile JS

gulp.task('scripts', function() {
    return gulp
        .src(cf.main.js, { cwd: cf.paths.src.js })
        .pipe(gp.plumber({ errorHandler: onError }))
        .pipe(gp.concat('main.js'))
        .pipe(gp.jscs('.jscsrc'))
        .pipe(gp.jshint('.jshintrc'))
        .pipe(reporter('jshint'))
        .pipe(debug ? noop() : gp.uglify(cf.uglify))
        .pipe(debug ? noop() : gp.rename({ suffix: '.min' }))
        .pipe(gulp.dest(cf.paths.dest.js))
        .pipe(reload({ stream: true }));
});

// Copy images and svg

gulp.task('images', function() {
    return gulp
        .src(cf.globs.img, { cwd: cf.paths.src.img })
        .pipe(gulp.dest(cf.paths.dest.img));
});

// Copy fonts

gulp.task('fonts', function() {
    return gulp
        .src(cf.globs.font, { cwd: cf.paths.src.font })
        .pipe(gulp.dest(cf.paths.dest.font));
});

// Copy components

gulp.task('components', function() {
    var tasks = [];

    cf.components.forEach(function(cptGrp) {
        var cptDir   = Object.keys(cptGrp)[0];
        var cptFiles = cptGrp[cptDir];

        cptFiles.forEach(function(cpt) {
            var noMin        = '!**/*min*';
            var cssMinFilter = gp.filter([cf.globs.css, noMin]);
            var jsMinFilter  = gp.filter([cf.globs.js, noMin]);

            tasks.push(
                gulp
                    .src(cpt, { cwd: '.' })
                    .pipe(cssMinFilter)
                    .pipe(debug ? noop() : gp.csso(cf.csso))
                    .pipe(debug ? noop() : gp.rename({ suffix: '.min' }))
                    .pipe(cssMinFilter.restore())
                    .pipe(jsMinFilter)
                    .pipe(debug ? noop() : gp.uglify(cf.uglify))
                    .pipe(debug ? noop() : gp.rename({ suffix: '.min' }))
                    .pipe(jsMinFilter.restore())
                    .pipe(gulp.dest(path.join(dirs.dest, cptDir)))
            );

        });

    });

    return es.merge(tasks);
});

// Copy license

gulp.task('license', function() {
    return gulp
        .src('LICENSE.md', { cwd: '.' })
        .pipe(gp.rename('license.txt'))
        .pipe(gulp.dest(dirs.dest));
});

// Compile views and files

gulp.task('htdocs', function() {
    var localUrl = cf.browserSync.proxy || 'http://localhost:' + cf.browserSync.port;
    var baseUrl  = (gp.util.env.url !== 'production') ? localUrl : pkg.homepage;

    var fileFilter = gp.filter(['**/*.{html,php,hbs,xml,txt}', 'CNAME']);
    var htmlFilter = gp.filter('**/*.html');

    var data     = {};
    var dataPath = dirs.src + '/data.json';

    try {
        data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch (err) {
        log('Couldn\'t access \'' + chalk.cyan(dataPath) + '\'');
    }

    var fileHtdocs = gulp
        .src(cf.globs.file, { cwd: cf.paths.src.file });

    var viewHtdocs = gulp
        .src(cf.globs.view, { cwd: cf.paths.src.view });

    return es.merge(fileHtdocs, viewHtdocs)
        .pipe(gp.plumber({ errorHandler: onError }))
        .pipe(gp.changed(dirs.dest))
        .pipe(fileFilter)
        .pipe(gp.replaceTask({
            variables: {
                'today':  today,
                'title':  titleCase(pkg.name),
                'url':    baseUrl,
                'domain': baseUrl.replace(/.*?:\/\//g, ''),
                'min':    debug ? '' : '.min',
                'vJQ':    require('./bower').dependencies.jquery
            },
            patterns: [
                { json: _.extend(pkg, data) }
            ]
        }))
        .pipe(fileFilter.restore())
        .pipe(htmlFilter)
        .pipe(_.first(gp.util.env._) === 'bundle' ? gp.processhtml({ commentMarker: 'bundle' }) : noop())
        .pipe(gp.htmlhint())
        .pipe(debug ? noop() : gp.htmlmin(cf.htmlmin))
        .pipe(reporter('htmlhint'))
        .pipe(htmlFilter.restore())
        .pipe(gulp.dest(dirs.dest))
        .pipe(reload({ stream: true }));
});

// Clean built files

gulp.task('clean', function(done) {
    require('del')([
        cf.paths.dest.css,
        cf.paths.dest.js,
        cf.paths.dest.img,
        cf.paths.dest.font,
        dirs.dest + '/license.*',
        dirs.dest + '/{' + fs.readdirSync(cf.paths.src.file) + '}',
        dirs.dest + '/{' + fs.readdirSync(cf.paths.src.view) + '}'
    ], done);
});

// Launches the BrowserSync server

gulp.task('serve', function() {
    browserSync(cf.browserSync);
});

// WATCH Task

gulp.task('watch', function() {
    runSequence('default', 'serve', function() {
        gulp.watch([path.join(cf.paths.src.css, cf.globs.css), '.csslintrc'], ['styles']);
        gulp.watch([path.join(cf.paths.src.js, cf.globs.js), '.jscsrc', '.jshintrc'], ['scripts']);

        gulp.watch([
            path.join(cf.paths.src.file, cf.globs.file),
            path.join(cf.paths.src.view, cf.globs.view),
            dirs.src + '/data.json'
        ], ['htdocs']);
    });
});

// DEFAULT Task

gulp.task('default', ['clean'], function(done) {
    runSequence(
        ['images', 'fonts', 'components', 'license'],
        'htdocs',
        'styles',
        'scripts',
        done
    );
});

// BUNDLE Task

gulp.task('bundle', ['default'], function() {
    var bdName = 'bundle.' + pkg.version + (debug ? '' : '.min');

    // Template for banner to add to file headers
    var banner = ['/** ' + today,
        ' * ' + titleCase(pkg.name),
        ' * @version v' + pkg.version,
        ' * @author ' + pkg.author,
        ' * @license ' + pkg.license,
        ' * Copyrights (c) 2015 */\n',
        ''].join('\n');

    var bundleCss = gulp
        .src(cf.bundles.css, { cwd: cf.paths.dest.css })
        .pipe(gp.concat(bdName + '.css'))
        .pipe(debug ? gp.csscomb() : noop())
        .pipe(gp.insert.prepend(banner))
        .pipe(gulp.dest(cf.paths.dest.css));

    var bundleJs = gulp
        .src(cf.bundles.js, { cwd: cf.paths.dest.js })
        .pipe(gp.concat(bdName + '.js'))
        .pipe(gp.insert.prepend(banner))
        .pipe(gulp.dest(cf.paths.dest.js));

    return es.merge(bundleCss, bundleJs);
});

/**
 * ===============================================================
 *  TASKS Deployment
 * ===============================================================
 */

// GH-PAGES Task

gulp.task('gh-pages', function(done) {
    require('gh-pages').publish(dirs.dest, {
        dotfiles: true,
        branch: 'gh-pages',
        message: 'Release gh-pages v' + pkg.version,
        // repo: pkg.repository.url,
        logger: function(msg) {
            log(msg);
        }
    }, done);
});

// gulp.task('test', function() {
//     var exec = require('child_process').exec;

//     exec('ls', function(err, stdout) {
//         if (err) { throw err; }
//         log('Test: ' + stdout);
//     });
// });
