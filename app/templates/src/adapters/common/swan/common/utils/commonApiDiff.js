
const getStorageSync = (key) => swan.getStorageSync(key)
const setStorageSync = (params) => swan.setStorageSync(params.key, params.data)
const removeStorageSync = (key) => swan.removeStorageSync(key)

const request = params => swan.request(params)

const triggerEvent = (context, eventName, params = {}) => {
  return context.triggerEvent(eventName, params)
}

const showToast = params => {
  swan.showToast(params)
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

const getClipboardData = options => swan.getClipboardData(options)

// 设置标题 （原生/自定义）
const setTitle = (context, app, titleOptions) => {
  let { title, isNavBarCustom } = titleOptions

  // 该参数非必传
  isNavBarCustom = isNavBarCustom || app.globalData.isNavBarCustom

  if (isNavBarCustom) {
    context.setData({ title })
  } else {
    swan.setNavigationBarTitle({ title })
  }
}

/* eslint-disable */
/**
 * 百度参数要求
 * @param {*} options 
 * 参数名	        类型	必填 默认值	说明
 * appKey	     String	  是	-	要打开的小程序App Key 。
 * path	       String	  否	-	打开的页面路径，如果为空则打开首页。path 中 ? 后面的部分会成为 query，在小程序的 App.onLaunch、App.onShow 和 Page.onLoad 的回调函数中可以获取到 query 数据。
 * extraData	 Object  	否	-	需要传递给目标小程序的数据，目标小程序可在 App.onLaunch()，App.onShow() 中获取到这份数据。
 * success	   Function	否	-	接口调用成功的回调函数
 * fail	       Function	否	-	接口调用失败的回调函数
 * complete	   Function	否	-	接口调用结束的回调函数（调用成功、失败都会执行）
 * 
 */
const navigateToMiniProgram = options => {
  options.appKey = options.appId
  swan.navigateToSmartProgram(options)
}

export { getStorageSync, setStorageSync, removeStorageSync, request, triggerEvent, showToast, setIncludePoints, getClipboardData, setTitle, navigateToMiniProgram }
