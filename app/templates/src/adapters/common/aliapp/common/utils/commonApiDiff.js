const getStorageSync = key => my.getStorageSync({ key }).data
const setStorageSync = params => my.setStorageSync(params)
const removeStorageSync = key => my.removeStorageSync({ key })

const request = params => {
  params.headers = params.header
  params.header = {}
  return my.request(params)
}

const triggerEvent = (context, eventName, params = {}) => {
  if (!eventName) {
    console.log('事件名不可为空')
    return
  }
  const prop = 'on' + eventName.slice(0,1).toUpperCase() + eventName.slice(1)
  return context.props[prop](params)
}

const showToast = params => {
  my.showToast({
    content: params.title,
    type: params.icon,
    ...params
  })
}

// params = { includePoints, includePadding }
const setIncludePoints = (context, params) => {
  context.setData({
    ...params
  })
}

const getClipboardData = options => my.getClipboard(options)

// 设置标题 （原生/自定义）
const setTitle = (context, app, titleOptions) => {
  let { title, isNavBarCustom } = titleOptions

  // 该参数非必传
  isNavBarCustom = isNavBarCustom || app.globalData.isNavBarCustom

  if (isNavBarCustom) {
    context.setData({ title })
  } else {
    my.setNavigationBar({ title })
  }
}

// 微信showModal支持‘是否显示取消按钮’，以及按钮颜色设置
// 支付宝通过适配支持‘是否显示取消按钮’，但按钮颜色不支持修改
const showModal = options => {
  if (options.showCancel) {
    my.confirm({
      ...options,
      confirmButtonText: options.confirmText,
      cancelButtonText: options.cancelText,
    })
  } else {
    my.alert({
      ...options,
      buttonText: options.confirmText,
    })
  }
}

const requestPayment = options => my.tradePay(options)

const makePhoneCall = options => {
  options.number = options.phoneNumber
  my.makePhoneCall(options)
}

/* eslint-disable */
/**
 * 支付宝参数要求
 * @param {*} options 
 * 属性	         类型	    默认值	必填	说明
 * appId	      string		       是	要打开的小程序 appId
 * path	        string		       否	打开的页面路径，如果为空则打开首页。path 中 ? 后面的部分会成为 query，在小程序的 App.onLaunch、App.onShow 和 Page.onLoad 的回调函数或小游戏的 my.onShow 回调函数、wx.getLaunchOptionsSync 中可以获取到 query 数据。对于小游戏，可以只传入 query 部分，来实现传参效果，如：传入 "?foo=bar"。
 * extraData	  object		       否	需要传递给目标小程序的数据，目标小程序可在 App.onLaunch，App.onShow 中获取到这份数据。如果跳转的是小游戏，可以在 my.onShow、wx.getLaunchOptionsSync 中可以获取到这份数据数据。
 * success	    function		     否	接口调用成功的回调函数
 * fail	        function		     否	接口调用失败的回调函数
 * complete	    function		     否	接口调用结束的回调函数（调用成功、失败都会执行）
 */
const navigateToMiniProgram = options => my.navigateToMiniProgram(options)

export { getStorageSync, setStorageSync, removeStorageSync, request, triggerEvent, showToast, setIncludePoints, getClipboardData, setTitle, showModal, requestPayment, makePhoneCall, navigateToMiniProgram }
