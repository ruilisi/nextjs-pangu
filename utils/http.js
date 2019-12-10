import { get } from './request'
import dns from './dns'

export const getGoods = async () => {
  const res = await get('inapp/all_goods')
  return res
}

export const getSystemData = async () => {
  const res = await get('system_data')
  return res
}

export const authPing = async token => {
  const res = await fetch(`${dns.API_ROOT}/auth_ping`, {
    method: 'POST',
    headers: {
      Authorization: token,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  })
  const body = await res.text()
  return body
}
