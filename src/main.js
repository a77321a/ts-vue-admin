/*
 * @Descripttion:
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-02-15 17:21:36
 */
import Vue from 'vue'
import App from './App.vue'
// Vue-router
import router from './router/router'
// Vuex
import store from './store/store'
// import { library } from '@fortawesome/fontawesome-svg-core'
// import { faUserSecret } from '@fortawesome/free-solid-svg-icons'
// import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
// elementui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// 封装表格组件
import Table from './components/Table/Table.vue'
import UEditor from './components/UEditor/UEditor.vue'
import 'font-awesome/css/font-awesome.css'
import './common/css/variable.scss'
import axios from './common/js/axios'
import func from './common/js/utils'
import btnControl from './common/js/btnControls'
// 配置NProgress进度条选项  —— 动画效果
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
// 高德地图
import VueAMap from 'vue-amap'
// library.add(faUserSecret)
// Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.use(btnControl)
Vue.prototype.$func = func
NProgress.configure({ showSpinner: false })
Vue.use(VueAMap)
// VueAMap.initAMapApiLoader({
//   key: '307510b98ac36649578b31a1c86cb116',
//   plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor', 'AMap.Geolocation'],
//   v: '1.4.4'
// })
window.SUCCESS = '00000000'
window.MAXSIZE = 999
// import buildConfig from './build/' + process.env.BUILD_ENV + '.js'
// console.log(buildConfig)
// window.ctx = func.baseUrl

window.docTitle = document.title
Vue.component('Table', Table)
Vue.component('UEditor', UEditor)

Vue.use(ElementUI)
Vue.prototype.$http = axios
// 大屏
// Vue.prototype.$screen = 'https://chongqing.hengshan.hk952183.com:8078/'
// 添加错误日志处理
// 准备添加ts
Vue.config.productionTip = false
router.beforeEach((to, from, next) => {
  NProgress.start()
  store.commit('setPath', to.fullPath)
  if (!localStorage.webToken && to.name !== 'Login') {
    router.push({ name: 'Login' })
  }
  let superAdmin = store.state.userInfo.superAdmin
  if (!superAdmin) {
    if (from.name == null && to.name === 'Index') {
      if (localStorage.routerList) {
        let routerList = JSON.parse(localStorage.routerList)
        for (let i in routerList) {
          if (routerList[i].url === 'Home') {
            router.push({
              name: 'Home'
            })
            break
          }
        }
        router.push({
          name: JSON.parse(localStorage.routerList)[0].children[0].children[0].url
        })
      } else {
        router.push({
          name: 'Login'
        })
      }
      next()
    }
  }
  if (to.meta.title) {
    document.title = window.docTitle + ' - ' + to.meta.title
  }
  if (to.name !== 'Login' && to.name !== 'lostPassword' && to.name !== '404') {
    if (to.meta.root) {
      store.commit('setBreadList', [{ url: to.name, title: to.meta.title }])
    } else {
      store.commit('addBread', { url: to.name, title: to.meta.title, query: to.query })
      let breadList = store.state.breadList
      let arr = []
      for (let i = 0; i < breadList.length; i++) {
        arr.push(breadList[i])
        if (breadList[i].url === to.name) {
          store.commit('setBreadList', arr)
          breadList = arr
          break
        }
      }
    }
  }
  if (to.name === 'Index') {
    router.push({
      name: 'Home'
    })
  }
  next()
})
router.afterEach(transition => {
  NProgress.done()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
