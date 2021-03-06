import { triggerEvent } from 'src/common/utils/commonApiDiff'
import { setAnimationPure } from 'src/common/utils/animation'

Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    // 是否显示
    show: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
        if (newVal) {
          setTimeout(
            function () {
              this.setOpacity(1)
            }.bind(this),
            100,
          )
        }
      },
    },
    title: String,
    ok: {
      type: Function,
    },
    cancel: {
      type: Function,
    },
    showBorder: {
      type: Boolean,
      value: true,
    },
    modalOtherStyle: {
      type: String,
      value: '',
    },
  },
  data: {
    maskAnimation: {},
  },
  methods: {
    handleOkClick: function (e) {
      this.setOpacity(0)

      setTimeout(
        function () {
          triggerEvent(this, 'ok', e)
        },
        100,
      )
    },
    handleCancelClick: function (e) {
      this.setOpacity(0)

      setTimeout(
        function () {
          triggerEvent(this, 'cancel', e)
        },
        100,
      )
    },
    // 设置淡入动画
    setOpacity: function (value) {
      const animations = [
        {
          animationName: 'maskAnimation',
          propertyOptions: [{
            key: 'opacity',
            value
          }]
        }
      ]
      setAnimationPure(this, animations)
    },
  },
})
