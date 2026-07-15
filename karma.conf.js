// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function ( config ) {
	config.set ( {
		basePath                 : '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins                  : [
			require ( 'karma-jasmine' ),
			require ( 'karma-chrome-launcher' ),
			require ( 'karma-jasmine-html-reporter' ),
			require ( 'karma-coverage-istanbul-reporter' ),
			require ( '@angular-devkit/build-angular/plugins/karma' ),
			require ( 'karma-sourcemap-loader' ),
			require('karma-htmlfile-reporter'),
			require('karma-verbose-reporter'),
		],
		client                   : {
			clearContext : false // leave Jasmine Spec Runner output visible in browser
		},
		htmlReporter : {
			// https://github.com/matthias-schuetz/karma-htmlfile-reporter
				  outputFile : 'reports/unit-tests/index.html',
			 
			// Optional
				  pageTitle       : 'Unit Tests',
			// subPageTitle: 'A sample project description',
				  groupSuites     : true,
				  useCompactStyle : true,
				  useLegacyStyle  : true,
				  showOnlyFailed  : false
				},
		coverageIstanbulReporter : {
			dir : require ( 'path' ).join ( __dirname, 'reports/unit-test-coverage' ),

			// reports can be any that are listed here: https://github.com/istanbuljs/istanbuljs/tree/aae256fb8b9a3d19414dcf069c592e88712c32c6/packages/istanbul-reports/lib
			reports: ['html', 'lcovonly', 'text-summary'],

			verbose: true,	 // output config used by istanbul for debugging

			// Combines coverage information from multiple browsers into one report rather than outputting a report
			// for each browser.
			combineBrowserReports: true,

			// if using webpack and pre-loaders, work around webpack breaking the source path
			fixWebpackSourcePaths: true,

			// Omit files with no statements, no functions and no branches from the report
			skipFilesWithNoCoverage: true,

			// Most reporters accept additional config options. You can pass these through the `report-config` option
			/* works but not used since we expect all unit tests to pass. And thresholds will occur inside SonarQube
				// enforce percentage thresholds
				// anything under these percentages will cause karma to fail with an exit code of 1 if not running in watch mode
				thresholds: {
					emitWarning: false, // set to `true` to not fail the test command when thresholds are not met
					// thresholds for all files
					global: {
						statements: 82,
						lines: 82,
						branches: 82,
						functions: 82
					},
					// thresholds per file
					each: {
						statements: 82,
						lines: 82,
						branches: 100,
						functions: 82,
						overrides: {
			*/
			//				'myTest/component/**/*.js': {
			/*
								statements: 98
							}
						}
					}
				}
			*/
		},
		
		preprocessors: {
			'src/tests.js': [ 'sourcemap' ]
		},
		reporters: ['verbose', 'progress', 'kjhtml', 'html'],
		browserConsoleLogOptions : {
			level    : 'log',
			format   : '%b %T: %m',
			terminal : true
		},
		port                     : 9876,
		colors                   : true,
		logLevel                 : config.LOG_INFO,
		autoWatch                : true,
		singleRun                : false,
		browsers: ['ChromeHeadlessNoSandbox'],
		customLaunchers : {
		  ChromeHeadlessNoSandbox : {
			base  : 'ChromeHeadless',
			flags : [ '--headless', '--no-sandbox', '--disable-dev-shm-usage' ]
		  }
		}
	} );
};
