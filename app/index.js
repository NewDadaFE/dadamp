const R = require('ramda')
const Generator = require('yeoman-generator')
const chalk = require('chalk')
const yosay = require('yosay')
const path = require('path')
const mkdirp = require('mkdirp')
const execSync = require('child_process').execSync

const shouldUseYarn = () => {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' })
    return true
  } catch (e) {
    return false
  }
}

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)

    this.option('upgrade')

    this.isUpgrade = Boolean(this.options.upgrade)
  }

  prompting() {
    this.log(
      yosay(
        `Welcome to the neat ${chalk.red(
          'generator-multi-miniprogram'
        )} generator!`
      )
    )

    const appPackage = this.fs.readJSON(this.destinationPath('package.json'))
    const prompts = [
      {
        type: 'confirm',
        name: 'weapp',
        message: 'Would you like to use functional difference adaptions for weapp of wechat?',
      },
      {
        type: 'confirm',
        name: 'swan',
        message: 'Would you like to use functional difference adaptions for swan of baidu?',
      },
      {
        type: 'confirm',
        name: 'aliapp',
        message: 'Would you like to use functional difference adaptions for aliapp of alipay?',
      },
      {
        type: 'input',
        name: 'name',
        message: 'Your project name:',
        default: this.isUpgrade ? appPackage.name : this.appname,
      },
      {
        type: 'input',
        name: 'description',
        message: 'Your project description:',
        default: this.isUpgrade ? appPackage.description : this.appname,
      },
      {
        type: 'confirm',
        name: 'install',
        message: 'Would you like to install dependencies?',
      },
    ]

    return this.prompt(prompts).then(props => {
      this.props = props
    })
  }

  defaults() {
    if (path.basename(this.destinationPath()) !== this.props.name) {
      this.log(
        'Your generator must be inside a folder named ' +
          this.props.name +
          '\n' +
          "I'll automatically create this folder."
      )
      mkdirp(this.props.name)
      this.destinationRoot(this.destinationPath(this.props.name))
    }
  }

  writing() {
    const { name, description, weapp, swan, aliapp } = this.props

    // Copy example code
    if (!this.isUpgrade) {
      this.fs.copy(this.templatePath('src/pages/*'), this.destinationPath('src'))
      // Copy dot files of src
      this.fs.copy(this.templatePath('src/.*'), this.destinationRoot())
    }

    if (weapp) {
      this.fs.copy(this.templatePath('src/adapters/weapp/*'), this.destinationPath('src'))
      this.fs.copy(this.templatePath('config/project.config.json'), this.destinationPath('config'))
    }
    if (swan) {
      this.fs.copy(this.templatePath('src/adapters/swan/*'), this.destinationPath('src'))
      this.fs.copy(this.templatePath('config/project.swan.json'), this.destinationPath('config'))
    }
    if (aliapp) {
      this.fs.copy(this.templatePath('src/adapters/aliapp/*'), this.destinationPath('src'))
      this.fs.copy(this.templatePath('config/project.aliapp.json'), this.destinationPath('config'))
    }

    // Copy dot files of templates
    this.fs.copy(this.templatePath('.*'), this.destinationRoot())

    // Copy package.json
    let templatePackage = R.merge(
      this.fs.readJSON(this.templatePath('package.json')),
      { name, description }
    )

    

    // Copy README
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      { name, description }
    )

    // Copy JS
    this.fs.copy(this.templatePath('*.js'), this.destinationRoot())
  }

  install() {
    this.log(yosay(`WOW! I'm all ${chalk.red('done')}!`))

    if (!this.props.install) return

    return shouldUseYarn() ? this.yarnInstall() : this.npmInstall()
  }
}
