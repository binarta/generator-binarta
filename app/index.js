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
    }, {
      type: 'confirm',
      name: 'sidebar',
      message: 'Would you like to use a mobile sidebar menu?',
      default: true
    }];

    this.prompt(prompts, function (props) {
      this.appname = props.name;
      this.useSidebar = props.sidebar;

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
        {appname: this.appname, useSidebar: this.useSidebar})
      ;
      this.fs.copyTpl(
        this.templatePath('config.js.template'),
        this.destinationPath('src/web/scripts/config.js.template'),
        {appname: this.appname}
      );
      this.fs.copyTpl(
        this.templatePath('index.html.template'),
        this.destinationPath('src/web/index.html.template'),
        {appname: this.appname, useSidebar: this.useSidebar}
      );
      if(this.useSidebar) {
        this.fs.copyTpl(
          this.templatePath('header-sidebar.html'),
          this.destinationPath('src/web/partials/header.html'),
          {appname: this.appname}
        );
        this.fs.copyTpl(
          this.templatePath('sidebar/sidebar.html'),
          this.destinationPath('src/web/partials/nav/sidebar.html'),
          {appname: this.appname}
        );
        this.fs.copy(
          this.templatePath('sidebar/menu.html'),
          this.destinationPath('src/web/partials/nav/menu.html')
        );
        this.fs.copy(
          this.templatePath('styles/sidebar/navbar-toggle.less'),
          this.destinationPath('src/web/styles/navbar-toggle.less')
        );
      } else {
        this.fs.copyTpl(
          this.templatePath('header-default.html'),
          this.destinationPath('src/web/partials/header.html'),
          {appname: this.appname}
        );
      }
      this.fs.copyTpl(
        this.templatePath('footer.html'),
        this.destinationPath('src/web/partials/footer.html'),
        {appname: this.appname}
      );
      this.fs.copyTpl(
        this.templatePath('styles/main.less'),
        this.destinationPath('src/web/styles/main.less'),
        {useSidebar: this.useSidebar}
      );
      this.fs.copyTpl(
        this.templatePath('styles/nav.less'),
        this.destinationPath('src/web/styles/nav.less'),
        {useSidebar: this.useSidebar}
      );
      this.fs.copyTpl(
        this.templatePath('styles/combined.less'),
        this.destinationPath('src/web/styles/combined.less'),
        {useSidebar: this.useSidebar}
      );
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
