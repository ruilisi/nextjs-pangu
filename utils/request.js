import fetch from 'isomorphic-unfetch'
import localStorage from 'localStorage'

export const API_ROOT = 'http://192.168.1.6:88'
const DEVICE_TYPE = 'WEB'
export const setToken = s => {
  return localStorage.setItem(`Token`, s)
}

export const getToken = () => {
  return localStorage.getItem('Token')
}

export const clearToken = () => {
  return localStorage.removeItem('Token')
}

const headers = () => {
  return {
    Authorization: getToken(),
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
}

const body = data => {
  return {
    DEVICE_TYPE,
    ORIGIN: global.location.origin,
    ...data
  }
}

const parseResponse = async res => {
  if (res.headers.get('Authorization')) {
    setToken(res.headers.get('Authorization'))
  }
  try {
    const json = await res.json()
    if (res.status >= 400) {
      json.status = res.status
    }
    return json
  } catch (error) {
    console.info('ping')
  }
  return false
}

export const get = async (path, data = {}) => {
  const params = body(data)
  const query = Object.keys(params)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
    .join('&')
  const res = await fetch(`${API_ROOT}/${path}?${query}`, {
    method: 'GET',
    headers: headers()
  })
  const content = await parseResponse(res)
  return content
}

const requestMethod = method => async (path, data) => {
  const res = await fetch(`${API_ROOT}/${path}`, {
    method,
    headers: headers(),
    body: JSON.stringify(body(data))
  })
  const content = await parseResponse(res)
  return content
}

export const post = requestMethod('POST')
export const put = requestMethod('PUT')
export const httpDelete = requestMethod('DELETE')
