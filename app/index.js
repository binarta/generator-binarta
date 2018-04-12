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
      'You can create your own namespace and login by going to \n' +
      '"http://binarta.app.binarta.demo.thinkerit.be/enlistment?template=jade". \n' +
      'When finished, you\'ll see the namespace in the url of your newly created application, ' +
      'e.g. http://' + chalk.blue.bold('my-namespace') + '.app.binarta.demo.thinkerit.be.\n\n');


    var askForNamespace = {
      type: 'input',
      name: 'namespace',
      message: 'What is your Binarta namespace?'
    };

    return this.prompt([askForNamespace]).then(function (answers) {
      this.namespace = answers.namespace;
      this.subscription = 'professional';
    }.bind(this));
  },

  writing: {
    projectFiles: function () {
      this.fs.copy(this.templatePath('gitignore'), this.destinationPath('.gitignore'));
      this.fs.copy(this.templatePath('files'), this.destinationPath());
      this.fs.copy(this.templatePath('config.json'), this.destinationPath('config.json'));
    },

    templates: function () {
      var variables = {
        namespace: this.namespace,
        subscription: this.subscription,
        year: new Date().getFullYear()
      };

      this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath('package.json'), variables);
      this.fs.copyTpl(this.templatePath('_bower.json.template'), this.destinationPath('bower.json.template'), variables);
      this.fs.copyTpl(this.templatePath('_user-config.json'), this.destinationPath('user-config.json'), variables);
      this.fs.copyTpl(this.templatePath('_user-config-prod.json'), this.destinationPath('user-config-prod.json'), variables);
      this.fs.copyTpl(this.templatePath('build.gradle'), this.destinationPath('build.gradle'), variables);
    }
  },

  install: function () {
    this.spawnCommandSync('npm', ['update']);
    this.spawnCommandSync('gulp', ['update']);
  },

  end: function () {
    this.log('\n\nAll done! Just run "' + chalk.blue.bold('gulp serve') + '" to view your new app.\n');
  }
});
