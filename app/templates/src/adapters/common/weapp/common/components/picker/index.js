import { triggerEvent } from 'src/common/utils/commonApiDiff'

Component({
  properties: {
    options: {
      type: Object,
      value: {}
    }
  },
  methods: {
    // 关于点击事件对象e的传递
    // 支付宝：dataset对象，组件能获取到，但父对象获取不到
    // 微信/百度：dataset对象，组件不能获取到，但父对象能获取到
    handleValueChange(e) {
      triggerEvent(this, 'valuechange', e.detail)
    },
    handleConfirm(e) {
      triggerEvent(this, 'confirm', e.detail)
    },
    handleCancel(e) {
      triggerEvent(this, 'cancel', e.detail)
    }
  },
})
