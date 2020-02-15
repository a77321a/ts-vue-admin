
import axios from 'axios'
import { Message, Loading } from 'element-ui'
import router from '@/router/router'
import store from '@/store/store'
import NProgress from 'nprogress'
import Vue from 'vue'
import func from './utils'
NProgress.configure({ showSpinner: false })
// 全局定义loading
let loading
function startLoading () {
  // loading = Loading.service({
  //   target: document.querySelector('#load-wrap'),
  //   lock: true,
  //   text: '加载中……',
  //   background: 'rgba(0, 0, 0, .1)'
  // })
  // store.commit('toggleLoading', true)
}

let name = ''
router.beforeEach((to, from, next) => {
  name = to.name
  next()
})

function endLoading () {
  // store.commit('toggleLoading', false)
  Vue.prototype.$nextTick(() => { // 以服务的方式调用的 Loading 需要异步关闭
    loading.close()
  })
}
// 防抖实现函数
// function debounce (action, idle) {
//   var last
//   return function () {
//     var ctx = this; var args = arguments
//     clearTimeout(last)
//     last = setTimeout(function () {
//       action.apply(ctx, args)
//     }, idle)
//   }
// }
// 一段时间内的请求共用一个loading
let needLoadingRequestCount = 0
export function showFullScreenLoading () {
  if (needLoadingRequestCount === 0) {
    startLoading()
  }
  needLoadingRequestCount++
}
export function tryHideFullScreenLoading () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (needLoadingRequestCount === 0) {
    // 是否一段时间内共用一个loading
    endLoading()
  }
}
// 合并相同请求
const requestList = []
const CancelToken = axios.CancelToken
let sources = {}

// http request 拦截器
axios.interceptors.request.use(
  config => {
    const request = JSON.stringify(config.url) + JSON.stringify(config.method) + JSON.stringify(config.data || '')
    config.cancelToken = new CancelToken((cancel) => {
      sources[request] = cancel
    })
    // if (requestList.includes(request)) {
    //   sources[request]('取消重复请求')
    // } else {
    requestList.push(request)
    if (config.loading) {
      // showFullScreenLoading()
      startLoading()
      NProgress.start()
    };
    // }
    return config
  }, err => {
    return Promise.reject(err)
  }
)
// http response 拦截器
axios.interceptors.response.use(
  (response) => {
    const request = JSON.stringify(response.config.url) + JSON.stringify(response.config.method) + JSON.stringify(response.config.data || '')
    requestList.splice(requestList.findIndex(item => item === request), 1)
    if (loading) {
      // tryHideFullScreenLoading()
      endLoading()
    };
    if (response.data.code === '00000000') {
      // || response.data.code === '11111111'
    } else if (response.data.code === '00001111') {
      Message.error(response.data.message)
      localStorage.clear()
      sessionStorage.clear()
      store.commit('setUser', {})
      router.push({
        name: 'Login'
      })
    } else {
      Message.error(response.data.message)
      endLoading()
    };
    NProgress.done()
    return response
  },
  (error) => {
    if (loading !== undefined) {
      loading.close()
    };
    requestList.length = 0
    // Message.error('网络异常,请稍后再试');
    // throw new axios.Cancel('cancel request');
    return Promise.reject(error)
  }
)

// 封装get方法

function get (url, params = {}, loading = true) {
  return new Promise((resolve, reject) => {
    if (loading) startLoading()
    axios.get(url, {
      params: params,
      loading,
      headers: {
        'X-Token': localStorage.webToken,
        'X-Resource': name
      }
    })
      .then(response => {
        resolve(response.data)
      })
      .catch(err => {
        reject(err)
      })
  })
}

// 封装post请求

function post (url, data = {}, loading = false) {
  return new Promise((resolve, reject) => {
    axios.post(url, data, {
      loading: loading,
      headers: {
        'X-Token': localStorage.webToken,
        'X-Resource': name
      }
    })
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

// 封装patch请求

function patch (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}
// 封装 formData 表单提交
function postForm (url, formData, loading = true) {
  return new Promise((resolve, reject) => {
    axios.post(url, formData, {
      timeout: 0,
      loading,
      headers: {
        'X-Token': localStorage.webToken,
        'X-Resource': name,
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}
// 封装put请求

function put (url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data, {
      headers: {
        'X-Token': localStorage.webToken,
        'X-Resource': name
      }
    })
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}
// 封装delete请求

function todelete (url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, { params: params })
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}
const buildConfig = require('../../build/' + process.env.BUILD_ENV + '.js')
window.ctx = buildConfig.BASE_URL
Vue.prototype.$screen = buildConfig.screen
axios.defaults.timeout = 0
axios.defaults.baseURL = buildConfig.BASE_URL
axios.defaults.headers.Authorization = ''
// axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'

export default { get, post, patch, put, todelete, postForm }
