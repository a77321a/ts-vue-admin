/*
 * @Descripttion:
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-05 19:02:48
 */
import Vue from 'vue'
import Vuex from 'vuex'
import http from '@/common/js/axios'
import config from '../config/config'

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    permBtn: localStorage.permBtn ? JSON.parse(localStorage.permBtn) : [],
    permList: localStorage.permList ? JSON.parse(localStorage.permList) : [],
    permNameList: localStorage.permNameList ? JSON.parse(localStorage.permNameList) : [],
    userInfo: localStorage.userInfo ? JSON.parse(localStorage.userInfo) : {},
    userId: localStorage.userId,
    token: localStorage.webToken || '', // token
    fullPath: '',
    navList: localStorage.navList ? JSON.parse(localStorage.navList) : [],
    routerList: localStorage.routerList ? JSON.parse(localStorage.routerList) : [],
    breadList: sessionStorage.breadList ? JSON.parse(sessionStorage.breadList) : [],
    opens: sessionStorage.opens ? JSON.parse(sessionStorage.opens) : [],
    dialogHeight: `${(document.documentElement.clientHeight) - 330}`,
    config: localStorage.config ? JSON.parse(localStorage.config) : {},
    // config: config
    getLoading: false
  },
  mutations: {

    toggleLoading (state, data) {
      state.getLoading = data
    },
    setRouterList (state, data) {
      state.routerList = data
      localStorage.setItem('routerList', JSON.stringify(data))
    },
    setBreadList (state, breadList) {
      state.breadList = breadList
      sessionStorage.setItem('breadList', JSON.stringify(breadList))
    },
    addBread (state, breadList) {
      state.breadList.push(breadList)
      sessionStorage.setItem('breadList', JSON.stringify(state.breadList))
    },
    setUserInfo (state, data) {
      state.userInfo = data
      localStorage.setItem('userInfo', JSON.stringify(data))
    },
    setUserId (state, data) {
      state.userId = data
      localStorage.setItem('userId', data)
    },
    setToken (state, token) {
      state.token = token
      localStorage.setItem('webToken', token)
    },
    setNavList (state, data) {
      localStorage.setItem('navList', JSON.stringify(data))
      state.navList = data
    },
    setPath (state, data) {
      state.fullPath = data
    },
    delOpenName (state, data) {
      let arr = new Set(state.opens)
      if (arr.has(data)) {
        arr.delete(data)
      }
      let newArr = [...arr]
      state.opens = newArr
      sessionStorage.setItem('opens', JSON.stringify(newArr))
    },
    setOpenName (state, data) {
      // let arr = new Set(state.opens)
      // if (!arr.has(data)) {
      //   arr.add(data)
      // }
      let arr = state.opens
      arr.push(data)
      // let newArr = [...arr]
      state.opens = arr
      sessionStorage.setItem('opens', JSON.stringify(arr))
    },
    setDict (state, data) {
      state.config = data
      localStorage.setItem('config', JSON.stringify(data))
    },
    setPermList (state, data) {
      state.permList = data
      localStorage.setItem('permList', JSON.stringify(data))
    },
    setPermName (state, data) {
      state.permNameList = data
      localStorage.setItem('permNameList', JSON.stringify(data))
    },
    setPermBtnList (state, data) {
      state.permBtn = data
      localStorage.setItem('permBtn', JSON.stringify(data))
    }
  },
  actions: {
    // 获取用户信息
    get_menu (context, { router, list }) {
      http.post('/menu/tree').then(res => {
        if (res.code === SUCCESS) {
          let arr = res.payload
          arr.forEach(i => {
            i.active = i.url
          })
          let list = context.state.permList
          let obj = {}
          list = list.reduce(
            (cur, next) => {
              obj[next.permissionId]
                ? ''
                : (obj[next.permissionId] = true && cur.push(next))
              return cur
            },
            []
          )
          if (context.state.userInfo.superAdmin) {
            context.commit('setRouterList', arr)
            router.push({
              name: 'Home'
            })
            return
          }
          let tree = []
          for (let i = 0; i < arr.length; i++) {
            list.forEach(j => {
              if (j.permissionDepth == 1) {
                if (j.permissionUrl === arr[i].url) {
                  tree.push(arr[i])
                }
              }
            })
          }
          let permList = []
          list.forEach(i => {
            permList.push(i.permissionUrl)
          })
          for (let i = 0; i < list.length; i++) {
            if (list[i].permissionDepth == 3) {
              router.push({ name: list[i].permissionUrl })
              context.commit('setPermName', permList)

              context.commit('setRouterList', tree)
              return
            }
          }
        }
      })
    },
    getDictionaryManagement (context, { router, list }) {
      // 活动状态枚举值
      const configObj = {}
      http.get('/dictionary/getDictByCatalogKey', {
        dictCatalogKey: 'ACTIVITY_STATUS'
      }).then((res) => {
        configObj.activityStatus = res.payload
        context.commit('setDict', configObj)
        if (Object.keys(configObj).length === 14) {
          context.dispatch('get_menu', { router, list })
        }
      })
      // 季节状态枚举值
      http.get('/dictionary/getDictByCatalogKey', {
        dictCatalogKey: 'SEASON'
      }).then((res) => {
        configObj.seasonStatus = res.payload
        context.commit('setDict', configObj)
        if (Object.keys(configObj).length === 14) {
          context.dispatch('get_menu', { router, list })
        }
      })
      // 图片域名
      http.get('/dictionary/getDictByCatalogKey', {
        dictCatalogKey: 'SYSTEM_CONFIG'
      }).then((res) => {
        configObj.systemConfig = res.payload
        context.commit('setDict', configObj)
        console.log(context)
        if (Object.keys(configObj).length === 14) {
          context.dispatch('get_menu', { router, list })
        }
      })
      // FOOD_TYPE菜品类型
      http.get('/dictionary/getDictByCatalogKey', {
        dictCatalogKey: 'FOOD_TYPE'
      }).then((res) => {
        configObj.foodType = res.payload
        context.commit('setDict', configObj)
        if (Object.keys(configObj).length === 14) {
          context.dispatch('get_menu', { router, list })
        }
      })
      // 职位
      http.get('/dictionary/getDictByCatalogKey', {
        dictCatalogKey: 'TITLE'
      }).then((res) => {
        configObj.position = res.payload
        context.commit('setDict', configObj)
        if (Object.keys(configObj).length === 14) {
          context.dispatch('get_menu', { router, list })
        }
      })
      // 机构类型
      http.get('/dictionary/getDictByCatalogKey', {
        dictCatalogKey: 'ORG_TYPE'
      }).then((res) => {
        configObj.orgType = res.payload
        context.commit('setDict', configObj)
        if (Object.keys(configObj).length === 14) {
          context.dispatch('get_menu', { router, list })
        }
      })
      // 运营模式
      http.get('/dictionary/getDictByCatalogKey', {
        dictCatalogKey: 'OPERATION_MODE'
      }).then((res) => {
        configObj.operationModeList = res.payload
        context.commit('setDict', configObj)
        if (Object.keys(configObj).length === 14) {
          context.dispatch('get_menu', { router, list })
        }
      })
      // 服务类型
      http.get('/dictionary/getDictByCatalogKey', {
        dictCatalogKey: 'SERVICE_TYPE'
      }).then((res) => {
        configObj.serviceType = res.payload
        context.commit('setDict', configObj)
        if (Object.keys(configObj).length === 14) {
          context.dispatch('get_menu', { router, list })
        }
      })
      // 养老模式
      http.get('/dictionary/getDictByCatalogKey', {
        dictCatalogKey: 'PENSION_MODE'
      }).then((res) => {
        configObj.pensionModeList = res.payload
        context.commit('setDict', configObj)
        if (Object.keys(configObj).length === 14) {
          context.dispatch('get_menu', { router, list })
        }
      })
      // 养老服务
      http.get('/dictionary/getDictByCatalogKey', {
        dictCatalogKey: 'PENSION_SERVICE'
      }).then((res) => {
        configObj.pensionServiceList = res.payload
        context.commit('setDict', configObj)
        if (Object.keys(configObj).length === 14) {
          context.dispatch('get_menu', { router, list })
        }
      })
      // 政府购买类型
      http.get('/dictionary/getDictByCatalogKey', {
        dictCatalogKey: 'GOV_BUY_TYPE'
      }).then((res) => {
        configObj.govBuyTypeList = res.payload
        context.commit('setDict', configObj)
        if (Object.keys(configObj).length === 14) {
          context.dispatch('get_menu', { router, list })
        }
      })
      // 老人类别
      http.get('/dictionary/getDictByCatalogKey', {
        dictCatalogKey: 'PENSION_TYPE'
      }).then((res) => {
        configObj.pensionTypeList = res.payload
        context.commit('setDict', configObj)
        if (Object.keys(configObj).length === 14) {
          context.dispatch('get_menu', { router, list })
        }
      })
      // 爱好
      http.get('/dictionary/getDictByCatalogKey', {
        dictCatalogKey: 'HOBBY'
      }).then((res) => {
        configObj.hobbyList = res.payload
        context.commit('setDict', configObj)
        if (Object.keys(configObj).length === 14) {
          context.dispatch('get_menu', { router, list })
        }
      })
      // 民族
      let nationList = [
        { name: '汉族' },
        { name: '蒙古族' },
        { name: '回族' },
        { name: '藏族' },
        { name: '维吾尔族' },
        { name: '苗族' },
        { name: '彝族' },
        { name: '壮族' },
        { name: '布依族' },
        { name: '朝鲜族' },
        { name: '满族' },
        { name: '侗族' },
        { name: '瑶族' },
        { name: '白族' },
        { name: '土家族' },
        { name: '哈尼族' },
        { name: '哈萨克族' },
        { name: '傣族' },
        { name: '黎族' },
        { name: '傈僳族' },
        { name: '佤族' },
        { name: '畲族' },
        { name: '高山族' },
        { name: '拉祜族' },
        { name: '水族' },
        { name: '东乡族' },
        { name: '纳西族' },
        { name: '景颇族' },
        { name: '柯尔克孜族' },
        { name: '土族' },
        { name: '达翰尔族' },
        { name: '么佬族' },
        { name: '羌族' },
        { name: '布朗族' },
        { name: '撒拉族' },
        { name: '毛南族' },
        { name: '仡佬族' },
        { name: '锡伯族' },
        { name: '阿昌族' },
        { name: '普米族' },
        { name: '塔吉克族' },
        { name: '怒族' },
        { name: '乌孜别克族' },
        { name: '俄罗斯族' },
        { name: '鄂温克族' },
        { name: '德昂族' },
        { name: '保安族' },
        { name: '裕固族' },
        { name: '京族' },
        { name: '塔塔尔族' },
        { name: '独龙族' },
        { name: '鄂伦春族' },
        { name: '赫哲族' },
        { name: '门巴族' },
        { name: '珞巴族' },
        { name: '基诺族' }
      ]
      configObj.nationList = nationList
      context.commit('setDict', configObj)
      if (Object.keys(configObj).length === 14) {
        context.dispatch('get_menu', { router, list })
      }
    }
  }
})
export default store
