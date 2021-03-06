import { triggerEvent } from 'src/common/utils/commonApiDiff'
import { setAndClearAnimation } from 'src/common/utils/animation'

Component({
  data: {
    maskAnimation: {},
    contentAnimation: {},
  },
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    // 是否显示
    show: {
      type: Boolean,
      value: false,
    },
    title: String,
    close: {
      type: Function,
    },
    closable: {
      type: Boolean,
      value: false,
    },
  },
  didMount() {
    this.setAndClearAnimation(this.props.show)
  },
  // 支付宝小程序 不支持 observer 监听属性 用didUpdate钩子代替
  didUpdate(prevProps) {
    const show = this.props.show && (this.props.show !== prevProps.show)

    this.setAndClearAnimation(show)
  },
  methods: {
    setAndClearAnimation(show) {
      const animations = [
        {
          animationName: 'maskAnimation',
          propertyOptions: [{
            key: 'opacity',
            value: 1,
          }],
        },
        {
          animationName: 'contentAnimation',
          propertyOptions: [{
            key: 'scale',
            value: 1,
          }],
        },
      ]

      setAndClearAnimation(this, show, animations)
    },
    handleCloseClick() {
      triggerEvent(this, 'close', this.props || this.dataset)
    },
    handleCatch() {},
  },
})
