<!--
 * @Descripttion:活动记录
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors:
 * @LastEditTime: 2019-12-08 12:20:44
 -->
<template>
  <div class="user-manage">
    <!-- 筛选 -->
    <el-form inline ref="form" label-width="80px" size="small"></el-form>
    <!-- 列表 -->
    <Table
      :searchRefresh="searchRefresh"
      :rowsForamtter="rowsForamtter"
      :searchObj="searchData"
      :selection="false"
      :columns="tableColumns"
      api="/service/customer/activity/pageSearch"
      method="post"
    >
      <template
        slot="activityStatus"
        slot-scope="{row}"
      >{{$store.state.config.activityStatus[row.activityStatus].dictionaryLabel}}</template>
      <template slot="action" slot-scope="{row}">
        <el-button
          @click="$router.push({name:'eventCenterPreview',query:{aid:row.activityId}})"
          type="text"
        >查看</el-button>
      </template>
    </Table>
  </div>
</template>
<script>
export default {
  name: 'eventRecords',
  data () {
    return {
      searchRefresh: true,
      searchData: {
        serviceCustomerId: this.serviceCustomerId
      },
      tableColumns: [
        { label: '活动名称', prop: 'activityName', minWidth: 150 },
        { label: '活动时间', prop: 'activityTime', minWidth: 260 },
        {
          label: '操作',
          slot: 'action',
          fixed: 'right',
          minWidth: 60
        }
      ],
      userList: [],
      limit: 10,
      limit2: 10,
      dialogVisible: false,
      searchCourse: {},
      mobile: '',
      selectActivity: []
    }
  },
  created () {},
  props: ['serviceCustomerId'],
  methods: {
    rowsForamtter (rows) {
      rows.forEach(row => {
        row.activityTime = row.startTime + '~' + row.endTime
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.user-manage {
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
