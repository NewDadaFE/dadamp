import { showToast } from '../../common/utils/commonApiDiff'

Page({
  name: '项目升级示例',
  data: {
    options: ['hello world', 'damn world', 'good bye world'],
  },
  say(e) {
    showToast({ 'title': e.currentTarget.dataset.word })
  },
})
