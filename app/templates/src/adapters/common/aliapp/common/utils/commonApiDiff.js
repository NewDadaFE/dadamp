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

export { getStorageSync, setStorageSync, removeStorageSync, request, triggerEvent, showToast, setIncludePoints, getClipboardData, setTitle }
