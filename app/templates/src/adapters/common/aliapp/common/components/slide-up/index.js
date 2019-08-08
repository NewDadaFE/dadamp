import { triggerEvent } from 'src/common/utils/commonApiDiff'
import { setAndClearAnimation } from 'src/common/utils/animation'

Component({
  data: {
    maskAnimation: {},
    contentAnimation: {},
  },
  properties: {
    // 是否显示1
    show: {
      type: Boolean,
      value: false
    },
    title: String,
    onlyClose: {
      type: Boolean,
      value: false,
    },
    ok: {
      type: Function,
    },
    cancel: {
      type: Function,
    },
  },
  // 支付宝小程序 不支持 observer 监听属性 用didUpdate钩子代替
  didUpdate(prevProps) {
    const show = this.props.show && (this.props.show !== prevProps.show)
    const animations = [
      {
        animationName: 'maskAnimation',
        propertyOptions: [{
          key: 'opacity',
          value: 1
        }]
      },
      {
        animationName: 'contentAnimation',
        propertyOptions: [{
          key: 'translateY',
          value: '0%'
        }]
      }
    ]

    setAndClearAnimation(this, show, animations)
  },
  methods: {
    handleOkClick(e) {
      triggerEvent(this, 'ok', e)
    },
    handleCancelClick(e) {
      triggerEvent(this, 'cancel', e)
    },
    // 防止滚动穿透
    handleCatch() {},
  },
})
