import gulp from 'gulp';
import loadPlugins from 'gulp-load-plugins';
import path from 'path';
import del from 'del';

// Load the gulp plugins into the `plugins` variable
const plugins = loadPlugins();

var restart_called = false;
const paths = {
  js: ['./**/*.js', '!dist/**', '!node_modules/**'],
  proto:['./**/*.proto', '!dist/**', '!node_modules/**']
};

gulp.task('clean', () => {
  return del('dist/**');
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
  }
).on('start', function() {
    console.clear();
   }).on('restart', function() {
    restart_called = true;
    console.clear();
   })
);
// Gulp clean will remove the dist directory where we keep all our transpiled javascript code
gulp.task('clean', () => {
  return del('dist/**');
});


// Gulp set-env will set the NODE_ENV var to “test” while the gulp pipeline is being executed
gulp.task('set-env', () => {
  plugins.env({
    vars: {
      NODE_ENV: 'test'
    }
  });
});

// Gulp clean will remove the dist directory where we keep all our transpiled javascript code
gulp.task('clean', () => {
  return del('dist/**');
});
// Gulp clean will remove the dist directory where we keep all our transpiled javascript code
gulp.task('clean', () => {
  return del('dist/**');
});


gulp.on('exit', function () {

  if (!restart_called) {
    console.log("KILLING NODEMON PROCESS ID:" + process.pid);
    process.kill(process.pid);
    return;
  }

  restart_called = false;
});
// Gulp set-env will set the NODE_ENV var to “test” while the gulp pipeline is being executed
gulp.task('set-env', () => {
  plugins.env({
    vars: {
      NODE_ENV: 'test'
    }
  });
});

