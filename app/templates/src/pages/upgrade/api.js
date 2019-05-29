import { post, oldPost } from 'src/common/utils/request'
import track from 'track-mini-program'
import { getLocationByIp } from 'src/common/utils/map'

// for 内部引用
const getRegisterParams = (payload, options) => {
  const channelCode = track.getChannel()

  return {
    url: 'applet/register',
    otherInfo: {
      ...payload,
      channelCode: payload.channelCode ? payload.channelCode : channelCode,
    },
    options,
  }
}
// for 内部引用
const postRegisterInfo = (params) => {
  return getLocationByIp().then(
    res => oldPost(params.url, { ...params.otherInfo, adCode: res.adCode }, params.options),
    () => {
      oldPost(params.url, params.otherInfo, params.options)
    }
  )
}

export const register = (payload, options = { toast: true }) => {
  return postRegisterInfo(getRegisterParams(payload, options))
}

export const sendCode = payload => {
  return oldPost('applet/sendCode', payload)
}

// 生成formid
export const saveFormAndPrePay = payload => {
  return post('applet/message/saveFormAndPrePay', payload).then(res => {
    return res
  })
}
