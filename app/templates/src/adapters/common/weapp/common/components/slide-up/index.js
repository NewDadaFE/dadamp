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
              key: 'translateY',
              value: '0%'
            }]
          }
        ]

        setAndClearAnimation(this, newVal, animations)
      },
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
