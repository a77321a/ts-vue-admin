<!--
 * @Descripttion:
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors:
 * @LastEditTime: 2019-12-12 16:58:16
 -->
<template>
  <div class="layout">
    <el-container class="main-content">
      <el-header style="height:65px;" class="l-header">
        <v-header></v-header>
      </el-header>
      <el-container>
        <el-aside v-if="showSideNav" class="slider" width="200px">
          <slider-menu></slider-menu>
        </el-aside>
        <el-main class="content">
          <BreadCrumb></BreadCrumb>
          <!-- v-loading="$store.state.getLoading" -->
          <div class="padding" id="load-wrap">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import sliderMenu from './components/SliderMenu/SliderMenu.vue'
import VHeader from './components/Header/VHeader.vue'
import BreadCrumb from './components/BreadCrumb/BreadCrumb.vue'
export default {
  name: 'layout',
  components: {
    sliderMenu,
    VHeader,
    BreadCrumb
  },
  created () {
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
  computed: {
    routerList () {
      return this.$store.state.routerList
    },
    activeLink () {
      return this.$store.state.fullPath
    },
    showSideNav () {
      console.log(this.$route.name)
      return (
        this.$store.state.navList.length !== 0 && this.$route.name !== 'Home'
      )
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/ .has-sidebar {
}
.layout {
  overflow: hidden;
  .el-main {
    padding: 15px;
  }
  /deep/.el-submenu .el-menu {
    border-right: 1px solid #e6e6e6 !important;
  }
  .main-content {
    min-height: 100vh;
    overflow: hidden;
    .slider {
      height: calc(100vh - 60px);
      background-color: #fff;
      .slider-menu {
        height: 100%;
        .el-menu {
          height: 100%;
        }
      }
    }
    .l-header {
      padding: 0;
    }
    .content {
      padding: 0;
      background-color: #fff;
      height: calc(100vh - 65px);
      overflow-y: hidden;
      overflow-x: hidden;
      .padding {
        padding: 15px;
        height: calc(100vh - 165px);
        overflow: auto;
        background-color: #fff;
      }
    }
  }
}
::-webkit-scrollbar {
  width: 2px;
  height: 0;
  background-color: #eee;
}
::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.2);
}
::-webkit-scrollbar-track {
  background: #fff;
}
</style>
