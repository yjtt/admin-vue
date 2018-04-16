import axios from 'axios'
import {getToken} from './auth'

const http = axios.create({
  baseURL: 'http://localhost:8888/api/private/v1'
})

// 添加请求拦截器
// 拦截器的本身就是一个方法
// 该方法什么 时候执行
// 拦截器函数接收一个参数config
// config 就是你当前请求的配置对象
// 当你使用axios发起请求时，name就会先经过这个拦截器
// 也就是说在请求拦截器内部的请求还没有发出去
// 我们可以在这里定制请求之前的行为
http.interceptors.request.use(function (config) {
  // 如果本次请求的不是/login接口，则我们就加入请求头
  if (config.url !== '/login') {
    config.headers['Authorization'] = getToken()
  }
  // return config 就好比next()允许 通过
  // 通过之后才要真正的发起请求
  return config
}, function (error) {
  // 当请求出错的时候会调用到第二个参数函数
  return Promise.reject(error)
})

// 通过定义插件的配置来扩展Vue本身
// 1. 定义一个插件对象
const httpPlugin = {}
// 2. 为插件对象添加一个成员：install
// install是一个函数，该函数接收两个参数：Vue、options
// Vue.use(httpPlugin)会来调用install方法
httpPlugin.install = function (Vue, options) {
  // 3. 添加实例方法
  Vue.prototype.$http = http
}

// 4. 导出插件对象
export default httpPlugin

// 5. 在入门文件模块main.js加载使用插件
