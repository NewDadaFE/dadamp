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

    if (this.isUpgrade) {
      this.log(yosay('its gonna upgrade!'))
    }
  }

  prompting() {
    this.log(
      yosay(
        `Welcome to the neat ${chalk.red(
          'dadamp'
        )} generator!`
      )
    )

    const appPackage = this.fs.readJSON(this.destinationPath('package.json'))
    const prompts = [
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
        type: 'confirm',
        name: 'dadaMPAdapter',
        message: 'Would you like to use functional difference adaptions for DADA company?',
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
    const { name, description, weapp, swan, aliapp, dadaMPAdapter } = this.props

    // Copy example code
    if (!this.isUpgrade) {
      this.fs.copy(this.templatePath('src/pages/**'), this.destinationPath('src/pages'))
      // Copy dot files of src
      this.fs.copy(this.templatePath('src/.*'), this.destinationRoot())
    }

    // copy adtapter files
    if (weapp) {
      this.fs.copy(this.templatePath('config/project.config.json'), this.destinationPath('config/project.config.json'))
      this.fs.copy(this.templatePath('src/adapters/common/weapp/**'), this.destinationPath('src/adapters/weapp'))
    }
    if (swan) {
      this.fs.copy(this.templatePath('config/project.swan.json'), this.destinationPath('config/project.swan.json'))
      this.fs.copy(this.templatePath('src/adapters/common/swan/**'), this.destinationPath('src/adapters/swan'))
    }
    if (aliapp) {
      this.fs.copy(this.templatePath('config/project.aliapp.json'), this.destinationPath('config/project.aliapp.json'))
      this.fs.copy(this.templatePath('src/adapters/common/aliapp/**'), this.destinationPath('src/adapters/aliapp'))
    }

    
    // Copy dot files of templates
    this.fs.copy(this.templatePath('.*'), this.destinationRoot())

     // Copy package.json
     let templatePackage = R.merge(
      this.fs.readJSON(this.templatePath('package.json')),
      { name, description }
    )
    if (this.isUpgrade) {
      const config = R.pick(
        ['version', 'dependencies'],
        this.fs.readJSON(this.destinationPath('package.json'))
      )
      templatePackage = R.merge(templatePackage, config)
    }
    this.fs.writeJSON(this.destinationPath('package.json'), templatePackage)

    // Copy README
    this.fs.copyTpl(
      this.templatePath('README.md'),
      this.destinationPath('README.md'),
      { name, description }
    )

    // Copy JS
    this.fs.copy(this.templatePath('*.js'), this.destinationRoot())

    // clone adtapter unique files
    if (dadaMPAdapter) {
      try {
        execSync(`git clone git@git.corp.imdada.cn:fe/dadaMPAdapter.git src/adapters/unique`)
        this.log('正在尝试下载达达公司独有业务适配代码...')
      } catch (e) {
        this.log('尝试下载达达公司独有业务适配代码失败！请检查自己的git权限和git配置。')
      }
    }
  }

  install() {
    this.log(yosay(`WOW! I'm all ${chalk.red('done')}!`))

    if (!this.props.install) return

    return shouldUseYarn() ? this.yarnInstall() : this.npmInstall()
  }
}
