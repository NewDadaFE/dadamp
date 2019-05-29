let API_ADPTER = null
let APP_TYPE = ''

try {
  API_ADPTER = wx
  APP_TYPE = 'weapp'
} catch (e) {
  try {
    API_ADPTER = swan
    APP_TYPE = 'swan'
  } catch (e) {
    API_ADPTER = my
    APP_TYPE = 'aliapp'
  }
}

export { API_ADPTER, APP_TYPE }
