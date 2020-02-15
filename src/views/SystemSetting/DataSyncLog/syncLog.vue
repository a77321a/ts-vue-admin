<!--
 * @Descripttion:同步日志
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors:
 * @LastEditTime: 2019-12-01 19:18:37
 -->
<template>
  <div class="event-center">
    <!-- 筛选 -->
    <el-tabs value="first" type="card" @tab-click="handleClick">
      <el-tab-pane label="助餐同步记录" name="first">
        <mealSyncLog></mealSyncLog>
      </el-tab-pane>
      <el-tab-pane label="服务对象同步记录" name="second">
        <serviceObjSyncLog></serviceObjSyncLog>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import mealSyncLog from './syncLogTabs/mealSyncLog'
import serviceObjSyncLog from './syncLogTabs/serviceObjSyncLog'
export default {
  name: 'syncLog',
  components: {
    mealSyncLog,
    serviceObjSyncLog
  },
  data () {
    return {}
  },
  created () {
    // this.$store.dispatch('getDictionaryManagement')
  },
  methods: {
    handleClick () {}
  }
}
</script>
<style lang="scss" scoped>
.event-center {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 193px;
  }
  .el-input--small {
    width: 193px;
  }
  .pages {
    text-align: center;
    margin: 15px 0;
  }
  .warning-row {
    background-color: #f2f2f2;
  }
}
</style>
