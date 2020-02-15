<template>
  <div class="header">
    <div class="logo">
      <img src="../../common/image/logo@2x.png" alt />
    </div>
    <div class="header-wrap">
      <div
        class="header-item"
        :class="activeLink.indexOf(item.active) > -1 ? 'active' : ''"
        :data-src="item.active"
        :key="index"
        @click="setNavList(item)"
        v-for="(item, index) in routerList"
      >
        <!-- <font-awesome-icon
          :icon="['fas', 'fa-' + item.icon]"
        ></font-awesome-icon>-->
        <i style="vertical-align:initial;font-size:14px" class="fa" :class="'fa-' + item.icon"></i>
        <span class="width-none">{{ item.name }}</span>
      </div>
    </div>
    <div class="tool-bar">
      <ul style="float:right" class="bar-list">
        <li v-click-outside="closeDialog">
          <!-- <el-button
            style="cursor:pointer"
            @click.native="infoBlock = !infoBlock"
            type="info"
            icon="el-icon-s-custom"
            circle
          ></el-button>-->
          <el-avatar
            @click.native="infoBlock = !infoBlock"
            style="cursor:pointer;vertical-align:middle"
            :size="40"
            icon="el-icon-user-solid"
            :src="avatar"
          ></el-avatar>
          <i
            color="#fff"
            style="vertical-align:middle"
            @click.native="infoBlock = !infoBlock"
            size="30"
            class="el-icon-caret-bottom"
          />
          <transition name="name">
            <div v-show="infoBlock" class="tdui-user-body" id="userinfo">
              <div class="tdui-user-body-list tdui-user-body-list-first">
                <div class="tdui-user-body-list-start">
                  <!-- <el-button type="info" icon="el-icon-s-custom" circle></el-button> -->
                  <el-avatar
                    icon="el-icon-user-solid"
                    style="margin-top:12px"
                    :size="40"
                    :src="avatar"
                  ></el-avatar>
                </div>
                <div
                  name="user-login-email"
                  class="tdui-user-body-list-first-end"
                >{{ $store.state.userInfo.nickName }}</div>
              </div>
              <div
                @click="
                  $router.push({ name: 'accountInfo' });
                  $store.commit('setNavList', []);
                  infoBlock = !infoBlock
                "
                class="tdui-user-body-list"
              >
                <div class="tdui-user-body-list-start">
                  <i color="#aaa" size="20" class="el-icon-setting" />
                </div>
                <div class="tdui-user-body-list-end" name="account-setting">账号设置</div>
              </div>
              <div @click="loginOut" class="tdui-user-body-list">
                <div class="tdui-user-body-list-start">
                  <i color="#aaa" size="20" class="el-icon-s-promotion" />
                </div>
                <div class="tdui-user-body-list-end" name="account-exit">退出登录</div>
              </div>
            </div>
          </transition>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
// import routerList from './routerList'
export default {
  name: 'vheader',
  data () {
    return {
      infoBlock: false
    }
  },
  computed: {
    routerList () {
      return this.$store.state.routerList
    },
    activeLink () {
      return this.$store.state.fullPath
    },
    avatar () {
      return (
        this.$store.state.config.systemConfig[0].dictionaryValue +
        this.$store.state.userInfo.avatar
      )
    }
  },
  created () {
    console.log(this.routerList, this.activeLink)
    let serviceHall = []
    let statisticalAnalysis = []
    let UserManage = []
    let systemSetting = []
    let resourceCenter = []
    if (this.routerList && this.routerList.length > 0) {
      this.routerList.forEach(i => {
        if (i.url === 'serviceHall') {
          serviceHall = i.children
        }
        if (i.url === 'ResourceCenter') {
          resourceCenter = i.children
        }
        if (i.url === 'UserManage') {
          UserManage = i.children
        }
        if (i.url === 'StatisticalAnalysis') {
          statisticalAnalysis = i.children
        }
        if (i.url === 'SystemSetting') {
          systemSetting = i.children
        }
      })
    }
    if (this.activeLink.indexOf('/Home') > -1) {
      this.$store.commit('setNavList', [])
    }
    if (this.activeLink.indexOf('/serviceHall/') > -1) {
      this.$store.commit('setNavList', serviceHall)
    }
    if (this.activeLink.indexOf('/ResourceCenter/') > -1) {
      this.$store.commit('setNavList', resourceCenter)
    }
    if (this.activeLink.indexOf('/UserManage/') > -1) {
      this.$store.commit('setNavList', UserManage)
    }
    if (this.activeLink.indexOf('/StatisticalAnalysis/') > -1) {
      this.$store.commit('setNavList', statisticalAnalysis)
    }
    if (this.activeLink.indexOf('/SystemSetting/') > -1) {
      this.$store.commit('setNavList', systemSetting)
    }
  },
  watch: {
    $route () {
      let serviceHall = []
      let statisticalAnalysis = []
      let UserManage = []
      let systemSetting = []
      let resourceCenter = []
      if (this.routerList && this.routerList.length > 0) {
        this.routerList.forEach(i => {
          if (i.url === 'serviceHall') {
            serviceHall = i.children
          }
          if (i.url === 'ResourceCenter') {
            resourceCenter = i.children
          }
          if (i.url === 'UserManage') {
            UserManage = i.children
          }
          if (i.url === 'StatisticalAnalysis') {
            statisticalAnalysis = i.children
          }
          if (i.url === 'SystemSetting') {
            systemSetting = i.children
          }
        })
      }
      if (this.activeLink.indexOf('/Home') > -1) {
        this.$store.commit('setNavList', [])
      }
      if (this.activeLink.indexOf('/serviceHall/') > -1) {
        this.$store.commit('setNavList', serviceHall)
      }
      if (this.activeLink.indexOf('/ResourceCenter/') > -1) {
        this.$store.commit('setNavList', resourceCenter)
      }
      if (this.activeLink.indexOf('/UserManage/') > -1) {
        this.$store.commit('setNavList', UserManage)
      }
      if (this.activeLink.indexOf('/StatisticalAnalysis/') > -1) {
        this.$store.commit('setNavList', statisticalAnalysis)
      }
      if (this.activeLink.indexOf('/SystemSetting/') > -1) {
        this.$store.commit('setNavList', systemSetting)
      }
    }
  },
  created () {
    // this.getUserInfo()
  },
  methods: {
    loginOut () {
      this.$http.post('/admin/logout').then(res => {})
      this.$router.push({
        name: 'Login'
      })
    },
    closeDialog (event) {
      this.infoBlock = false
    },
    setNavList (item) {
      if (item.hasOwnProperty('children') && item.children.length > 0) {
        if (Array.isArray(item.children)) {
          this.$store.commit('setNavList', item.children)
          this.$store.commit('setOpenName', item.children[0].name)
        } else {
          this.$store.commit('setNavList', [])
        }
        this.$router.push({
          name: item.children[0].children[0].url
        })
      } else {
        this.$store.commit('setNavList', [])
        this.$router.push({
          name: item.url
        })
      }
    }
  },
  directives: {
    clickOutside: {
      bind (el, binding, vnode) {
        function clickHandler (e) {
          // 这里判断点击的元素是否是本身，是本身，则返回
          if (el.contains(e.target)) {
            return false
          }
          // 判断指令中是否绑定了函数
          if (binding.expression) {
            // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
            binding.value(e)
          }
        }
        // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
        el.__vueClickOutside__ = clickHandler
        document.addEventListener('click', clickHandler)
      },
      update () {},
      unbind (el, binding) {
        // 解除事件监听
        document.removeEventListener('click', el.__vueClickOutside__)
        delete el.__vueClickOutside__
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  background-color: #fff;
  height: 65px;
  .logo {
    float: left;
    height: 65px;
    line-height: 65px;
    width: 200px;
    text-align: center;
    img {
      display: inline-block;
      width: 140px;
      height: 40px;
      vertical-align: middle;
    }
  }
  background-color: #2b83f9;
  background-image: linear-gradient(143deg, #2945cb 20%, #2b83f9 81%, #3a9dff);
  .header-wrap {
    padding: 0 20px;
    display: inline-block;
    height: 100%;
    .header-item {
      display: inline-block;
      margin-right: 40px;
      position: relative;
      height: 65px;
      line-height: 65px;
      font-size: 14px;
      color: #fff;
      opacity: 0.69;
      cursor: pointer;
      min-width: 30px;
      text-align: center;
      transition: all 0.2s ease-in-out;
      i {
        display: inline-block;
        width: 14px;
        height: 14px;
        margin-right: 4px;
        vertical-align: initial;
      }
    }
    .header-item.active,
    .header-item:hover {
      color: #fff;
      opacity: 1;
    }
    .active::after {
      content: '';
      display: block;
      width: 100%;
      height: 4px;
      background-color: #4fe3c1;
      position: absolute;
      bottom: 0;
      left: 0;
    }
  }
  .tool-bar {
    width: 280px;
    // padding-right: 10px;
    float: right;
    .bar-list {
      line-height: 64px;
      display: inline-block;
      li {
        display: inline-block;
        float: left;
        list-style-type: none;
        padding: 0px 13px;
        position: relative;
        & > i {
          cursor: pointer;
          margin-left: 5px;
          transition: all 0.3s ease-in;
          &:hover {
            // transform: scale(1.2);
            transition: all 0.3s ease-out;
          }
        }
        .tdui-user-body {
          position: absolute;
          width: 240px;
          top: 70px;
          right: 5px;
          background: #ffffff;
          box-shadow: 0 4px 24px -1px rgba(0, 0, 0, 0.25);
          border-radius: 4px;
          z-index: 99999999;
          .tdui-user-body-list {
            height: 48px;
            display: flex;
            line-height: 48px;
            cursor: pointer;
            &:hover {
              background-color: #f1f1f1;
            }
            .tdui-user-body-list-start {
              width: 68px;
              text-align: center;
            }
            .tdui-user-body-list-first-end {
              flex: 1;
              font-size: 14px;
              color: #2185f0;
              white-space: nowrap;
              overflow: hidden;
            }
          }
          .tdui-user-body-list-first {
            cursor: default;
            display: flex;
            height: 64px;
            line-height: 64px;
            border-bottom: solid 1px rgba(23, 35, 61, 0.1);
            &:hover {
              background-color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
