import track from './node/track-mini-program'

track.init({
  logType: '***-log',
  debug: false,
  name: '***小程序',
  version: '0.0.0',
})

let appConfig = {
  onLaunch: function () {},
  globalData: {
    // domain: 'https://toc.ndev.imdada.cn/toc/corp/',
    // domain: 'https://toc.qa.imdada.cn/toc/corp/',
    domain: 'https://t.imdada.cn/toc/corp/',
  },
}

appConfig = track.trackOnLaunch(appConfig)

// app.js
App(appConfig)
