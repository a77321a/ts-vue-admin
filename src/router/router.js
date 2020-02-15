/*
 * @Descripttion:router
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors:
 * @LastEditTime: 2019-12-12 11:46:37
 */
import Vue from 'vue'
import Router from 'vue-router'

import ServiceHall from './ServiceHall'
import ResourceCenter from './ResourceCenter'
import UserManage from './UserManage'
import StatisticalAnalysis from './StatisticalAnalysis'
import SystemSetting from './SystemSetting'
Vue.use(Router)
const syncRoute = [
  {
    path: '/',
    name: 'Index',
    // redirect: '/Home',
    component: () => import('@/Layout.vue'),
    children: [
      {
        path: '/Home',
        name: 'Home',
        component: () => import('@/views/Home/Home.vue'),
        meta: {
          title: '首页',
          root: true
        }
      },
      {
        path: 'Home/accountInfo',
        name: 'accountInfo',
        component: () => import('@/views/Home/accountInfo.vue'),
        meta: {
          parent: 'Home',
          title: '个人信息'
        }
      },
      ...ServiceHall,
      ...ResourceCenter,
      ...UserManage,
      ...StatisticalAnalysis,
      ...SystemSetting
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Home/Login.vue')
  },
  {
    path: '/lostPassword',
    name: 'lostPassword',
    component: () => import('@/views/Home/lostPassword.vue')
  },
  {
    path: '*',
    name: '404',
    component: () => import('@/views/404.vue')
  }

]
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior (to, from, savedPosition) {
    if (to.hash) {
      return {
        selector: to.hash
      }
    }
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: syncRoute
})
