import axios from 'axios'
import { message } from 'ant-design-vue'

// 区分开发和生产环境
const DEV_BASE_URL = 'http://localhost:8124'
const PROD_BASE_URL = ''
const BASE_URL = import.meta.env.MODE === 'development' ? DEV_BASE_URL : PROD_BASE_URL

// 创建 Axios 实例
const myAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  withCredentials: true,
})

// 全局请求拦截器
myAxios.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error)
  },
)

// 全局响应拦截器
myAxios.interceptors.response.use(
  function (response) {
    const { data } = response
    // 未登录
    if (data.code === 40100) {
      // 不是获取用户信息的请求，并且用户目前不是已经在用户登录页面，则跳转到登录页面
      const inLoginPage = window.location.hash.includes('/user/login')
      if (
        !response.request.responseURL.includes('user/get/login') &&
        !inLoginPage
      ) {
        message.warning('请先登录')
        const redirect = encodeURIComponent(window.location.href)
        window.location.href = `/#/user/login?redirect=${redirect}`
      }
    }
    return response
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error)
  },
)

export default myAxios
