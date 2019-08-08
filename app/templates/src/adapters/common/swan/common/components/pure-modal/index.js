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
      observer: function (newVal, oldVal) {
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
              key: 'scale',
              value: 1
            }]
          }
        ]

        setAndClearAnimation(this, newVal, animations)
      },
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
  methods: {
    handleCloseClick() {
      triggerEvent(this, 'close', this.props || this.dataset)
    },
    handleCatch() {},
  },
})
