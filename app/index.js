'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    this.log(yosay(
      'Welcome to the ' + chalk.blue.bold('Binarta') + ' app generator!'
    ));

    this.log('To get started, make sure you have a Binarta namespace.\n\n' +
      'You can easily create your own namespace by going to "https://binarta.com/template-selection".\n\n' +
      'Choose a design (doesn\'t matter which one) and choose a name for your application.\n' +
      'When finished, you\'ll see the namespace in the url of your newly created application, ' +
      'e.g. http://' + chalk.blue.bold('my-namespace') + '.app.binarta.com.\n\n');


    var askForNamespace = {
      type: 'input',
      name: 'namespace',
      message: 'What is your Binarta namespace?'
    };

    return this.prompt([askForNamespace]).then(function (answers) {
      this.namespace = answers.namespace;
      this.subscription = 'essential';
    }.bind(this));
  },

  writing: {
    projectFiles: function () {
      this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));
      this.fs.copy(this.templatePath('files'), this.destinationPath());
    },

    templates: function () {
      var variables = {
        namespace: this.namespace,
        subscription: this.subscription,
        year: new Date().getFullYear()
      };

      this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), variables);
      this.fs.copyTpl(this.templatePath('_bower.json.template'), this.destinationPath('bower.json.template'), variables);
      this.fs.copyTpl(this.templatePath('_config.json'), this.destinationPath('config.json'), variables);
      this.fs.copyTpl(this.templatePath('_user-config.json'), this.destinationPath('user-config.json'), variables);
      this.fs.copyTpl(this.templatePath('build.gradle'), this.destinationPath('build.gradle'), variables);
      this.fs.copyTpl(this.templatePath('app.js'), this.destinationPath('src/web/scripts/app.js'), variables);
      this.fs.copyTpl(this.templatePath('config.js.template.template'), this.destinationPath('src/web/scripts/config.js.template.template'), variables);
      this.fs.copyTpl(this.templatePath('index.html.template.template'), this.destinationPath('src/web/index.html.template.template'), variables);
      this.fs.copyTpl(this.templatePath('robots.txt.template.template'), this.destinationPath('src/web/robots.txt.template.template'), variables);
      this.fs.copyTpl(this.templatePath('header.html'), this.destinationPath('src/web/partials/header.html'), variables);
      this.fs.copyTpl(this.templatePath('sidebar.html'), this.destinationPath('src/web/partials/nav/sidebar.html'), variables);
      this.fs.copyTpl(this.templatePath('footer.html'), this.destinationPath('src/web/partials/footer.html'), variables);
    }
  },

  install: function () {
    this.spawnCommandSync('npm', ['update']);
    this.spawnCommandSync('gulp', ['update']);
  },

  end: function () {
    this.log(
      '\n\nAll done! ' +
      'Just run "' + chalk.blue.bold('gulp serve') + '" to view your new app.\n');
  }
});
