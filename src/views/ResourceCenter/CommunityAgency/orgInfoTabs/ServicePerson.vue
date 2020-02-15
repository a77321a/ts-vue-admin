<!--
 * @Descripttion:服务人员
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-16 10:38:15
 -->
<template>
  <div class="Participants">
    <!-- 筛选 -->
    <!-- 列表 -->
    <Table
      :searchRefresh="searchRefresh"
      :rowsForamtter="rowsForamtter"
      :searchObj="searchData"
      :columns="tableColumns"
      api="/org/service/provider/pageSearch "
      method="post"
    >
      <template slot="orgServiceProviderName" slot-scope="{ row }">
        <div class="flex-t-u">
          <el-avatar
            class="avatar"
            size="medium"
            :src="
              $store.state.config.systemConfig[0].dictionaryValue + row.indexPic
            "
          ></el-avatar>
          <span class="f-title">{{ row.orgServiceProviderName }}</span>
        </div>
      </template>
      <!-- <template slot="orgServiceProductList" slot-scope="{ row }">{{row.sex == 1 ?'男':'男'}}</template> -->

      <template slot="sex" slot-scope="{ row }">{{row.sex == 1 ?'男':'男'}}</template>
      <template slot-scope="{ row }" slot="handleColumn">
        <el-button
          @click="$router.push({name:'serviceUserDetail',query:{uid:row.orgServiceProviderId}})"
          type="text"
          size="small"
        >查看</el-button>
      </template>
    </Table>
  </div>
</template>
<script>
export default {
  name: 'ServicePerson',
  data () {
    return {
      searchRefresh: true,
      searchData: { orgId: this.orgId },
      tableColumns: [
        { label: '人员姓名', slot: 'orgServiceProviderName', minWidth: 100 },
        { label: '服务产品', prop: 'orgServiceProducts', minWidth: 300 },
        { label: '性别', slot: 'sex', minWidth: 100 },
        { label: '联系人电话', prop: 'telephoneNum', minWidth: 100 },
        { label: '操作', slot: 'handleColumn', fixed: 'right', minWidth: 60 }
      ]
    }
  },
  props: ['orgId'],

  created () {},
  methods: {
    exportExcel () {
      window.open(
        `${ctx}/activity/provider/export?orgId=${this.searchData.orgId ||
          ''}&orgServiceProviderName=${this.searchData.orgServiceProviderName ||
          ''}&token=${this.$store.state.token}`
      )
    },
    rowsForamtter (rows) {
      rows.forEach(row => {
        row.activityTime = row.startTime + '~' + row.endTime
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.Participants {
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
