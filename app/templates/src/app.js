import { COMMON_ADDRESS } from './common/constants/addr'
import { COUPON_INFO } from './common/constants/coupon'
import { ORDER_FEE_INFO } from './common/constants/feeInfo'
import { ORDER_DETAIL_INFO } from './common/constants/orderDetail'
import { PAY_BILL_INFO } from './common/constants/payBill'
import { ORDER_BILL_INFO } from './pages/index/constant'
import { ACTIVITY_BASE_INFO } from './common/constants/activityBaseInfo'
import { CONSULT_INFO } from 'src/pages/consult/constant'
import track from './node/track-mini-program'
import { getUuid } from 'src/common/utils/uuid'
import { API_ADPTER, APP_TYPE } from 'src/common/adapters/index'
import { getSystemInfoSync } from 'src/common/utils/commonApi'

track.init({
  logType: '***-log',
  debug: false,
  name: '***小程序',
  version: '0.0.0',
})

let appConfig = {
  onLaunch: function () {},
  globalData: {
    // domain: 'https://toc.ndev.imdada.cn/toc/corp/',
    // domain: 'https://toc.qa.imdada.cn/toc/corp/',
    domain: 'https://t.imdada.cn/toc/corp/',
  },
}

appConfig = track.trackOnLaunch(appConfig)

// app.js
App(appConfig)
