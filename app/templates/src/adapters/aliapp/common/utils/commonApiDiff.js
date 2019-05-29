import { API_ADPTER } from 'src/common/adapters/index'

const getStorageSync = key => API_ADPTER.getStorageSync({ key }).data
const setStorageSync = params => API_ADPTER.setStorageSync(params)
const removeStorageSync = key => API_ADPTER.removeStorageSync({ key })

const request = params => {
  params.headers = params.header
  params.header = {}
  return API_ADPTER.request(params)
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
  API_ADPTER.showToast({
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

const getClipboardData = options => API_ADPTER.getClipboard(options)

// 设置标题 （原生/自定义）
const setTitle = (context, app, titleOptions) => {
  let { title, isNavBarCustom } = titleOptions

  // 该参数非必传
  isNavBarCustom = isNavBarCustom || app.globalData.isNavBarCustom

  if (isNavBarCustom) {
    context.setData({ title })
  } else {
    API_ADPTER.setNavigationBar({ title })
  }
}

export { getStorageSync, setStorageSync, removeStorageSync, request, triggerEvent, showToast, setIncludePoints, getClipboardData, setTitle }
