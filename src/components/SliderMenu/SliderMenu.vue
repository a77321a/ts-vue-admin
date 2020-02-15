<!--
 * @Descripttion:左侧菜单
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2019-12-20 15:23:09
 -->
<template>
  <div class="slider-menu">
    <el-menu
      :default-active="active"
      :default-openeds="opens"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-submenu
        v-for="(item, index) in routerList"
        :key="index"
        :index="item.name"
        v-if="$store.state.userInfo.superAdmin || $store.state.permNameList.includes(item.url)"
      >
        <template slot="title">
          <i style="margin-right:5px" class="fa" :class="'fa-' + item.icon"></i>
          <span>{{ item.name }}</span>
        </template>
        <el-menu-item
          @click="handleClick(son)"
          v-for="son in item.children"
          v-if="$store.state.userInfo.superAdmin || $store.state.permNameList.includes(son.url)"
          :key="son.url"
          :index="son.url"
        >{{ son.name }}</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
// import { routerList } from '@/config/config'
export default {
  name: 'sliderMenu',
  data () {
    return {
      active: '',
      opens: []
    }
  },
  created () {
    this.active = this.$route.meta.parent
      ? this.$route.meta.parent
      : this.$route.name
    this.opens = this.$store.state.opens
  },
  computed: {
    routerList () {
      return this.$store.state.navList
    }
  },
  watch: {
    $route (val) {
      this.active = val.meta.parent ? val.meta.parent : val.name
      this.opens = this.$store.state.opens
      this.$forceUpdate()
    }
  },
  methods: {
    handleOpen (key, keyPath) {
      this.$store.commit('setOpenName', key)
    },
    handleClose (key, keyPath) {
      this.$store.commit('delOpenName', key)
      this.opens = this.$store.state.opens
    },
    handleClick (son) {
      this.$router.push({
        name: son.url
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::-webkit-scrollbar {
  width: 2px;
}

.el-submenu {
  width: 200px;
}
.el-menu-vertical-demo {
  height: 100%;
}
.el-menu-item.is-active {
  background-color: rgba(64, 158, 255, 0.1) !important;
}
</style>
