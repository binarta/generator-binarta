var gulp = require('gulp'),
  template = require('gulp-template'),
  data = require('gulp-data'),
  rename = require('gulp-rename'),
  del = require('del'),
  version = new Date().getTime(),
  minimist = require('minimist'),
  bower = require('gulp-bower'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  less = require('gulp-less'),
  csso = require('gulp-csso'),
  path = require('path'),
  autoprefixer = require('gulp-autoprefixer'),
  livereload = require('gulp-livereload'),
  gulpif = require('gulp-if'),
  mainBowerFiles = require('main-bower-files'),
  filter = require('gulp-filter'),
  minifyHTML = require('gulp-minify-html'),
  file = require('gulp-file');

var knownOptions = {
  string: 'env',
  default: {env: process.env.NODE_ENV || 'dev'}
};
var options = minimist(process.argv.slice(2), knownOptions);

var context = require('./config.json');
context.version = version;

Object.keys(context.environments[options.env]).forEach(function (k) {
  context[k] = context.environments[options.env][k];
});

try {
  var userContext = require('./user-config.json');
  Object.keys(userContext).forEach(function (k) {
    context[k] = userContext[k];
  });
} catch (ignored) {
}

context.metadata = require('./src/web/metadata.json');
context.generators = {
  i18n: function (code) {
    return code + '" default="' + context.metadata.msgs.default[code]
  },
  link: function (code) {
    return code + '" default-url="' + context.metadata.msgs.default[code]
  }
};

var src = {
  patterns: {
    sources: ['src/web/**/*', '!src/web/**/*.html', '!src/web/**/*.less'],
    watch: ['src/web/**/*.html', 'src/web/**/*.js', '!src/web/**/*.template', '!src/web/**/*.less']
  }
};

gulp.task('clean', function (cb) {
  del(['build'], cb);
});

function BowerTask() {
  return bower({cmd: 'update'}).pipe(gulp.dest('build/libs'));
}
gulp.task('bower', BowerTask);
gulp.task('clean.bower', ['clean'], BowerTask);

function ScriptsTask() {
  return gulp.src(mainBowerFiles().concat(context.sources))
    .pipe(filter('**/*.js'))
    .pipe(gulpif(options.env == 'dev', concat('libs.js')))
    .pipe(gulpif(options.env == 'dev', gulp.dest('build/dist/scripts')))
    .pipe(gulpif(options.env != 'dev', concat('libs.min.js')))
    .pipe(gulpif(options.env != 'dev', uglify()))
    .pipe(gulpif(options.env != 'dev', gulp.dest('build/dist/scripts')));
}
gulp.task('scripts', ['bower'], ScriptsTask);
gulp.task('clean.scripts', ['clean.bower'], ScriptsTask);
gulp.task('fast.scripts', ScriptsTask);

function CopyBootstrapVariablesTask() {
  return gulp.src('src/web/styles/variables.less')
    .pipe(gulp.dest('bower_components/bootstrap/less'));
}
gulp.task('copy.bootstrap.variables', ['bower'], CopyBootstrapVariablesTask);
gulp.task('clean.copy.bootstrap.variables', ['clean.bower'], CopyBootstrapVariablesTask);
gulp.task('dirty.copy.bootstrap.variables', CopyBootstrapVariablesTask);

function StylesTask() {
  return gulp.src(mainBowerFiles().concat(context.sources))
    .pipe(filter(['**/*.css', '**/*.less']))
    .pipe(less({paths: [path.join(__dirname, 'less', 'includes')]}))
    .pipe(concat('app.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(csso())
    .pipe(gulp.dest('build/dist/styles'));
}
gulp.task('styles', ['bower', 'copy.bootstrap.variables'], StylesTask);
gulp.task('fast.styles', ['dirty.copy.bootstrap.variables'], StylesTask);
gulp.task('clean.styles', ['clean.bower', 'clean.copy.bootstrap.variables'], StylesTask);
gulp.task('dirty.styles', ['dirty.copy.bootstrap.variables'], function () {
  return StylesTask().pipe(livereload());
});

function SourcesTask() {
  var sources = [];
  context.sources.forEach(function (el) {
    sources.push('!' + el);
  });
  sources = src.patterns.sources.concat(sources);
  return gulp.src(sources)
    .pipe(file('version.json', '{"version":' + version + '}'))
    .pipe(gulp.dest('build/dist'));
}
gulp.task('sources', SourcesTask);
gulp.task('clean.sources', ['clean'], SourcesTask);
gulp.task('livereload.sources', function () {
  return SourcesTask().pipe(livereload());
});

function CompileWebTemplatesTask() {
  return gulp.src('src/web/**/*.html')
    .pipe(data(context))
    .pipe(template())
    .pipe(minifyHTML({
      conditionals: true,
      spare:true,
      empty: true,
      quotes: true
    }))
    .pipe(gulp.dest('build/dist'));
}
gulp.task('compile.web.templates', CompileWebTemplatesTask);
gulp.task('clean.compile.web.templates', ['clean'], CompileWebTemplatesTask);
gulp.task('livereload.compile.web.templates', function () {
  return CompileWebTemplatesTask().pipe(livereload());
});

gulp.task('templates', ['compile.web.templates']);
gulp.task('clean.templates', ['clean.compile.web.templates']);
gulp.task('livereload.templates', ['livereload.compile.web.templates']);

function CopyBootstrapFontsTask() {
  return gulp.src('bower_components/bootstrap/fonts/*')
    .pipe(gulp.dest('build/dist/fonts'));
}
gulp.task('copy.bootstrap.fonts', ['bower'], CopyBootstrapFontsTask);
gulp.task('clean.copy.bootstrap.fonts', ['clean.bower'], CopyBootstrapFontsTask);

gulp.task('build', ['sources', 'templates', 'scripts', 'styles', 'copy.bootstrap.fonts']);
gulp.task('fast.build', ['sources', 'templates', 'fast.scripts', 'fast.styles']);
gulp.task('clean.build', ['clean.sources', 'clean.templates', 'clean.scripts', 'clean.styles', 'clean.copy.bootstrap.fonts']);

gulp.task('default', ['clean.build']);

function DeployTask() {
  return gulp.src('build/dist/**/*.template')
    .pipe(data(context))
    .pipe(template())
    .pipe(rename(function (path) {
      path.extname = '';
    }))
    .pipe(minifyHTML({
      conditionals: true,
      spare:true,
      empty: true,
      quotes: true
    }))
    .pipe(gulp.dest('build/dist'));
}
gulp.task('dirty.deploy', ['livereload.templates'], DeployTask);
gulp.task('fast.deploy', ['fast.build'], DeployTask);
gulp.task('deploy', ['clean.build'], DeployTask);

function WatchTask() {
  livereload.listen();

  gulp.watch('src/web/**/*.less', ['dirty.styles']);
  gulp.watch(src.patterns.watch, ['livereload.sources']);
  gulp.watch(['src/web/**/*.template', 'src/web/**/*.html', 'user-config.json'], ['dirty.deploy']);
  gulp.watch(['config.json'], ['clean.scripts']);
}
gulp.task('watch', ['deploy'], WatchTask);
gulp.task('fast.watch', ['fast.deploy'], WatchTask);
