import { triggerEvent } from 'src/common/utils/commonApiDiff'

Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    // 是否可点击，显示箭头
    hasArrow: {
      type: Boolean,
      value: true,
    },
    size: {
      type: String,
    },
    hasBorder: {
      type: Boolean,
      value: true,
    },
    to: {
      type: String,
    },
    expansion: {
      type: Boolean,
    },
    cellStyle: {
      type: String,
    },
  },
  methods: {
    // 关于点击事件对象e的传递
    // 支付宝：dataset对象，组件能获取到，但父对象获取不到
    // 微信/百度：dataset对象，组件不能获取到，但父对象能获取到
    cellClick() {
      if (this.data.to) {
        return wx.navigateTo({
          url: this.data.to,
        })
      }

      // 触发tab事件 会导致父对象接收到两次点击事件
      triggerEvent(this, 'cellClick', this.dataset)
    },
    cellPress() {
      triggerEvent(this, 'cellPress', this.dataset)
    },
  },
})
