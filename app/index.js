'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the sensational ' + chalk.red('Binarta') + ' generator!'
    ));

    this.appname = this._.slugify(this.appname);

    var prompts = [{
      type: 'input',
      name: 'name',
      message: 'Your project name',
      default: this.appname
    }];

    this.prompt(prompts, function (props) {
      this.appname = props.name;

      done();
    }.bind(this));
  },

  writing: {
    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
      this.fs.copy(
        this.templatePath('gitignore'),
        this.destinationPath('.gitignore')
      );
      this.fs.copy(
        this.templatePath('files'),
        this.destinationPath()
      );
    },

    templates: function () {
      this.fs.copyTpl(
        this.templatePath('_package.json'),
        this.destinationPath('package.json'),
        {appname: this.appname}
      );
      this.fs.copyTpl(
        this.templatePath('_bower.json'),
        this.destinationPath('bower.json'),
        {appname: this.appname}
      );
      this.fs.copyTpl(
        this.templatePath('app.js'),
        this.destinationPath('src/web/scripts/app.js'),
        {appname: this.appname})
      ;
      this.fs.copyTpl(
        this.templatePath('config.js.template'),
        this.destinationPath('src/web/scripts/config.js.template'),
        {appname: this.appname}
      );
      this.fs.copyTpl(
        this.templatePath('index.html.template'),
        this.destinationPath('src/web/index.html.template'),
        {appname: this.appname}
      );
      this.fs.copyTpl(
        this.templatePath('header.html'),
        this.destinationPath('src/web/partials/header.html'),
        {appname: this.appname}
      );
      this.fs.copyTpl(
        this.templatePath('footer.html'),
        this.destinationPath('src/web/partials/footer.html'),
        {appname: this.appname}
      );
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
