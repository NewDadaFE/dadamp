import { API_ADPTER } from 'src/common/adapters/index'

Page({
  name: '项目升级示例',
  data: {
    options: ['hello world', 'damn world', 'good bye world'],
  },
  say(e) {
    API_ADPTER.showToast({ e.word || e.detail.word})
  },
})
