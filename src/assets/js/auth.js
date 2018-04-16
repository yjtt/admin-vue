// 封装和用户相关授权相关的函数
const userInfoKey = 'user-info'

// 保存登录用户信息到本地存储
// @param  {Object} userInfo 用户登陆成功的信息对象
// @return {undefined}     无返回值
export function saveUserInfo (userInfo = {}) {
  window.localStorage.setItem(userInfoKey, JSON.stringify(userInfo))
}

// 从本地存储中获取当前登录用户信息
// @return {string}当前登录用户信息对象字符串
export function getUserInfo () {
  return window.localStorage.getItem(userInfoKey)
}

// 获取本地存储中用户信息的Token令牌
// @return {string} 用户的Token令牌
export function getToken () {
  return JSON.parse(getUserInfo()).token
}

// 删除本地存储的用户登录信息
// @return {undefined}无返回值
export function removeUserInfo () {
  window.localStorage.removeItem(userInfoKey)
}
