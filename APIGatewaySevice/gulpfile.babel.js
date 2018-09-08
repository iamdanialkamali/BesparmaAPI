import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import path from 'path';
import del from 'del';
import runSequence from 'run-sequence';
import babelCompiler from 'babel-core/register';

// Load the gulp plugins into the `plugins` variable
const plugins = loadPlugins();

const paths = {
  js: ['./**/*.js', '!dist/**', '!node_modules/**'],
  tests: ['./server/test/**/*.test.js'],
  proto: ['./**/*.proto', '!dist/**', '!node_modules/**'],
  
};

gulp.task('clean', () => {
  return del('dist/**');
});


// Set environment variables
gulp.task('set-env', () => {
  plugins.env({
    vars: {
      NODE_ENV: 'test'
    }
  });
});


// Compile all Babel Javascript into ES5 and put it into the dist dir
gulp.task('babel', () => {
  return gulp.src(paths.js, { base: '.' })
    .pipe(plugins.babel())
    .pipe(gulp.dest('dist'));
});
gulp.task('proto', () => {
  return gulp.src(paths.proto, { base: '.' })
    .pipe(gulp.dest('dist'));
});

// Start server with restart on file change events
gulp.task('nodemon', ['babel','proto'], () =>
  plugins.nodemon({
    script: path.join('dist', 'index.js'),
    ext: 'js',
    ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
    tasks: ['babel']
  }).on('start', function() {
    console.clear();
   }).on('restart', function() {
    console.clear();
   })
);

// triggers mocha tests
gulp.task('test', ['set-env'], () => {
  let exitCode = 0;
  
  return gulp.src('./server/test/**/*.test.js', { read: false })
    .pipe(plugins.plumber())
    .pipe(plugins.mocha({
      reporter:'spec',
      ui: 'bdd',
      timeout: 2000,
      compilers: {
        js: babelCompiler
      }
    }))
    .once('error', (err) => {
      console.log(err);
      exitCode = 1;
    })
    .once('end', () => {
      process.exit(exitCode);
    });
});


gulp.task('mocha', ['clean'], () => {
  return runSequence('babel', 'test');
 });

