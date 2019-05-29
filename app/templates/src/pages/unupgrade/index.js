import { showToast } from 'src/common/utils/commonApiDiff'

const app = getApp()

Page({
  name: '项目初始化示例',
  data: {
    options: ['hello world', 'damn world', 'good bye world'],
  },
  say(e) {
    showToast({ e.word || e.detail.word})
  },
})
