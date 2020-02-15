<!--
 * @Descripttion:活动总结
 * @Author:
 * @Date: 2019-11-13 14:43:57
 * @LastEditors:
 * @LastEditTime: 2019-12-08 11:33:10
 -->
<template>
  <div id="active-summary">
    <div class="header">
      <el-button
        @click="$router.push({name:'eventCenterSummary',query:{aid:$route.query.aid}})"
        class="btn"
        type="text"
      >重新编辑</el-button>
    </div>
    <div class="content">
      <div v-if="htmlStr" v-html="htmlStr"></div>
      <div v-else style="width:200px;margin:0 auto">活动尚未总结</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ActivitySummary',
  data () {
    return {}
  },
  props: ['htmlStr', 'status']
}
</script>
<style lang="scss" scoped>
.header {
  overflow: auto;
  .btn {
    float: right;
    margin-right: 15px;
  }
}
</style>
