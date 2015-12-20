import path from 'path';
import gulp from 'gulp';
import gutil from 'gulp-util';
import del from 'del';
import runSequence from 'run-sequence';
import browserSync from 'browser-sync';
import gulpLoadPlugins from 'gulp-load-plugins';
import swPrecache from 'sw-precache';
import ghPages from 'gh-pages';
import pkg from './package.json';
import webpackconfig from './webpack.config.js';
import config from './config.js';

const $ = gulpLoadPlugins();
const reload = browserSync.reload;

// Postcss
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer-core';
import fmt from 'cssfmt';
import ps_import from 'postcss-import';
import mqpacker from 'css-mqpacker';
import crip from 'postcss-crip';
import ps_nested from 'postcss-nested';
import ps_simplevars from 'postcss-simple-vars';
import lost from 'lost';
import reporter from 'postcss-reporter';
import stylelint from 'stylelint';

var processors = [
  crip,
  fmt,
  autoprefixer({browsers: ['last 4 version']}),
  stylelint({
	  "rules": {
	    "declaration-colon-space-before": [2, "never"]
	  }
	}),
  reporter,
  mqpacker,
  ps_import,
  ps_nested,
  ps_simplevars,
  lost
];

var banner = [
    '/*!\n' +
    ' * <%= package.name %>\n' +
    ' * <%= package.description %>\n' +
    ' * <%= package.homepage %>\n' +
    ' * @author <%= package.author %>\n' +
    ' * @version <%= package.version %>\n' +
    ' * Copyright ' + new Date().getFullYear() + '. <%= package.license %> licensed.\n' +
    ' */',
    '\n'
  ].join('');

gulp.task('clean', cb => del([ './build/**' ], {
  read: false,
  dot: true,
  force: true
}, cb));

gulp.task('copy', () => {
  return gulp.src([
    'node_modules/apache-server-configs/dist/.htaccess',
    './CNAME'
  ], {
    dot: true
  }).pipe(gulp.dest(config.paths.build))
    .pipe($.size({title: 'copy'}));
});

gulp.task('serve', () => {
	browserSync(config.browsersync);

	gulp.watch(config.paths.html.src, ['html', reload]);
	gulp.watch(config.paths.css.all, ['style']);
	gulp.watch(config.paths.js.all, ['webpack', reload]);
});

gulp.task('html', () => {
	gulp.src([
			!config.paths.src + '/htdocs/layout.html',
			config.paths.html.src
		])
		.pipe($.data(config.template))
		.pipe($.swig({ defaults: { cache: false } }))
		// .pipe($.consolidate('swig', config.template, { cache: false }))
		.pipe($.htmlmin({collapseWhitespace: true}))
		.pipe(gulp.dest(config.paths.html.dest))
    .pipe($.size({title: 'html'}))
		.on('end', reload);
});

gulp.task('style', () => {
  gulp.src([config.paths.css.src])
    .pipe($.plumber())
    .pipe($.sourcemaps.init())
    .pipe(postcss(processors))
    .pipe($.concat('main.css'))
    .pipe($.rename({ suffix: '.min' }))
    .pipe($.cssmin())
    .pipe($.header(banner, {
      package: pkg
    }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(config.paths.css.dest))
    .pipe(browserSync.stream())
    .pipe($.size({title: 'css'}));
});

gulp.task('webpack', () => {
  gulp.src([config.paths.js.src])
    .pipe($.plumber())
    .pipe($.webpack(webpackconfig))
    .pipe($.eslint())
    .pipe($.header(banner, {
      package: pkg
    }))
    .pipe(gulp.dest(config.paths.js.dest))
    .pipe($.size({title: 'scripts'}));
});

gulp.task('fonts', () => {
	gulp.src([config.paths.font.src])
		.pipe(gulp.dest(config.paths.font.dest))
    .pipe($.size({title: 'fonts'}));
});

gulp.task('images', () => {
  gulp.src([config.paths.images.src])
    .pipe($.imagemin())
    .pipe(gulp.dest(config.paths.images.dest))
    .pipe($.size({title: 'images'}));
});

gulp.task('gh-pages', ['build'], cb => {
	ghPages.publish(path.join(__dirname, config.paths.build + '/**/*'), cb);
});

gulp.task('default', ['clean'], cb => {
  runSequence(['serve'], 'html', 'webpack', 'style', 'fonts', 'images', 'copy', 'generate-service-worker-dist', cb);
});

gulp.task('build', ['clean'], cb => {
  runSequence('html', 'webpack', 'style', 'fonts', 'images', 'copy', cb);
});



/**
 * Generate service worker code that will precache specific resources.
 */

var writeServiceWorkerFile = (rootDir, handleFetch, callback) => {
  var swconfig = {
    cacheId: pkg.name || 'fitnesscollection-landing',
    handleFetch: handleFetch,
    logger: $.util.log,
    staticFileGlobs: [
      rootDir + '/dist/font/**.*',
      rootDir + '/dist/images/**.*',
      rootDir + '/dist/**.js',
      rootDir + '/dist/**.css',
      rootDir + '/dist/**.css.map',
      rootDir + '/**.html'
    ],
    stripPrefix: rootDir + '/',
    // verbose defaults to false, but for the purposes of this demo, log more.
    verbose: true
  };

  swPrecache.write(path.join(rootDir, 'service-worker.js'), config, callback);
};

gulp.task('generate-service-worker-dev', cb => {
  writeServiceWorkerFile(config.paths.src, false, cb);
});

gulp.task('generate-service-worker-dist', cb => {
  writeServiceWorkerFile(config.paths.build, true, cb);
});
