const getStorageSync = (key) => wx.getStorageSync(key)
const setStorageSync = (params) => wx.setStorageSync(params.key, params.data)
const removeStorageSync = (key) => wx.removeStorageSync(key)

const request = params => wx.request(params)

const triggerEvent = (context, eventName, params = {}) => {
  return context.triggerEvent(eventName, params)
}

const showToast = params => {
  wx.showToast(params)
}

// params = { includePoints, includePadding, success, fail, complete }
//
const setIncludePoints = (context, params) => {
  const paddingTemp = params['map.includePadding']
  let padding = null

  if (paddingTemp) {
    padding = [paddingTemp.top, paddingTemp.right, paddingTemp.bottom, paddingTemp.left]
  }

  context.mapCtx.includePoints({
    points: params['map.includePoints'],
    padding,
    ...params
  })
}

const getClipboardData = options => wx.getClipboardData(options)

// 设置标题 （原生/自定义）
const setTitle = (context, app, titleOptions) => {
  let { title, isNavBarCustom } = titleOptions

  // 该参数非必传
  isNavBarCustom = isNavBarCustom || app.globalData.isNavBarCustom

  if (isNavBarCustom) {
    context.setData({ title })
  } else {
    wx.setNavigationBarTitle({ title })
  }
}

/* eslint-disable */
/**
 * 微信参数要求
 * @param {*} options 
 * 属性	         类型	    默认值	必填	说明
 * appId	      string		       是	要打开的小程序 appId
 * path	        string		       否	打开的页面路径，如果为空则打开首页。path 中 ? 后面的部分会成为 query，在小程序的 App.onLaunch、App.onShow 和 Page.onLoad 的回调函数或小游戏的 wx.onShow 回调函数、wx.getLaunchOptionsSync 中可以获取到 query 数据。对于小游戏，可以只传入 query 部分，来实现传参效果，如：传入 "?foo=bar"。
 * extraData	  object		       否	需要传递给目标小程序的数据，目标小程序可在 App.onLaunch，App.onShow 中获取到这份数据。如果跳转的是小游戏，可以在 wx.onShow、wx.getLaunchOptionsSync 中可以获取到这份数据数据。
 * envVersion	  string	release	 否	要打开的小程序版本。仅在当前小程序为开发版或体验版时此参数有效。如果当前小程序是正式版，则打开的小程序必定是正式版。
 * success	    function		     否	接口调用成功的回调函数
 * fail	        function		     否	接口调用失败的回调函数
 * complete	    function		     否	接口调用结束的回调函数（调用成功、失败都会执行）
 */
const navigateToMiniProgram = options => wx.navigateToMiniProgram(options)

export { getStorageSync, setStorageSync, removeStorageSync, request, triggerEvent, showToast, setIncludePoints, getClipboardData, setTitle, navigateToMiniProgram }
