import { API_ADPTER } from 'src/common/adapters/index'

const getStorageSync = (key) => API_ADPTER.getStorageSync(key)
const setStorageSync = (params) => API_ADPTER.setStorageSync(params.key, params.data)
const removeStorageSync = (key) => API_ADPTER.removeStorageSync(key)

const request = params => API_ADPTER.request(params)

const triggerEvent = (context, eventName, params = {}) => {
  return context.triggerEvent(eventName, params)
}

const showToast = params => {
  API_ADPTER.showToast(params)
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

const getClipboardData = options => API_ADPTER.getClipboardData(options)

// 设置标题 （原生/自定义）
const setTitle = (context, app, titleOptions) => {
  let { title, isNavBarCustom } = titleOptions

  // 该参数非必传
  isNavBarCustom = isNavBarCustom || app.globalData.isNavBarCustom

  if (isNavBarCustom) {
    context.setData({ title })
  } else {
    API_ADPTER.setNavigationBarTitle({ title })
  }
}

export { getStorageSync, setStorageSync, removeStorageSync, request, triggerEvent, showToast, setIncludePoints, getClipboardData, setTitle }
