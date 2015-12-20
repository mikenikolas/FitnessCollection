var SRC_DIR = './src';
var BUILD_DIR = './build';

module.exports = {
	paths: {
		src: SRC_DIR,
		build: BUILD_DIR,
		html: {
			src: SRC_DIR + '/htdocs/**/*.html',
			dest: BUILD_DIR
		},
		css: {
			src: SRC_DIR + '/assets/style/style.css',
			all: SRC_DIR + '/assets/style/**/*.css',
			dest: BUILD_DIR + '/dist'
		},
		js: {
			src: SRC_DIR + '/assets/js/entry.js',
			all: SRC_DIR + '/assets/js/**/*.{js,jsx}',
			dest: BUILD_DIR + '/dist'
		},
		font: {
			src: SRC_DIR + '/assets/font/*',
			dest: BUILD_DIR + '/dist/font'
		},
		images: {
			src: SRC_DIR + '/assets/images/**/*',
			dest: BUILD_DIR + '/dist/images'
		}
	},
	browsersync: {
		notify: false,
		port: 2000,
		open: false,
		server: {
			baseDir: BUILD_DIR
		}
	},
	template: {
		name: 'FitnessCollection',
		slogan: 'Hundratals klasser. Ett träningskort.',
		gtag: 'GTM-KHS2QW',
		menu: [
			{ name: 'Hem', url: 'index.html' },
			{ name: 'För partners', url: 'for-partners.html' },
			{ name: 'Om oss', url: 'om-oss.html' }
		]
	}
}
