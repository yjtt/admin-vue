import Vue from 'vue'
import Router from 'vue-router'
import {getUserInfo} from '@/assets/js/auth'

import Login from '@/components/login/login'
import Home from '@/components/home/home'

// 用户管理组件
import UserList from '@/components/user-list/user-list'
Vue.use(Router)

const router = new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      // 我们可以通过配置自路由的方式让某个组件渲染到父路由组件
      // 1. 在父路由组件中添加 <router-view></router-view> 出口标记
      // 2. 在父路由中通过 children 来声明自路由
      //    children 是一个数组
      //    children 数组中配置一个一个子路由对象
      // 当你访问 user-list 组件的时候，则路由会先渲染它的父路由组件
      // 然后将 user-list 组件渲染到父路由的 router-view 标记中
      children: [
        {
          name: 'user-list',
          path: '/users',
          component: UserList
        }
      ]
    }
  ]
})

// 添加路由拦截器（导航钩子，守卫）
// 接下来所有的视图导航都必须经过这道官卡
// 一旦进入这道关卡，你得告诉守卫路由
// to 我要去那
// from 我从哪来
// next 用来放行的
router.beforeEach((to, from, next) => {
  // 1. 添加全局路由导航守卫
  // 2. 拿到当前请求的视图路径标识
  // 2.1 如果是登录组件，则直接放行
  // 2.2 如果是非登录组件，则检查Token令牌
  // 2.2.1 有令牌就过去
  // 2.2.2 无令牌，则让其登录去
  if (to.name === 'login') {
    // 2.1 如果是登录组件，则直接放行
    next()
  } else {
    // 检查是否具有当前登录的用户信息状态
    if (!getUserInfo()) {
      // 无令牌，去登陆
      next({
        name: 'login'
      })
    } else {
      // 有令牌，通过
      next()
    }
  }
})

export default router
