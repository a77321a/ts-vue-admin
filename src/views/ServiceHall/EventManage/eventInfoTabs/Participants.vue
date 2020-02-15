<!--
 * @Descripttion:参与人员
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-07 14:58:46
 -->
<template>
  <div class="Participants">
    <!-- 筛选 -->
    <el-form inline ref="form" label-width="80px" size="small">
      <el-form-item label="老人类型">
        <el-select
          style="width:200px"
          clearable
          v-model="searchData.customerCategory"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in $store.state.config.pensionTypeList"
            :key="index"
            :label="item.dictionaryLabel"
            :value="item.dictionaryValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老人名称">
        <el-input
          style="width:200px"
          placeholder="请输入老人名称关键字"
          v-model="searchData.serviceCustomerName"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          @click="searchRefresh = !searchRefresh"
          icon="el-icon-search"
        >搜索</el-button>
        <el-button
          @click="searchData = {activityId:searchData.activityId};searchRefresh = !searchRefresh"
          size="small"
        >重置</el-button>
        <span></span>
      </el-form-item>
      <el-form-item style="float:right">
        <span>参加人员：{{actualCustomerNum}}/{{customerNum}}</span>
        <el-button type="text" @click="exportExcel" size="small">导出数据</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <Table
      :searchRefresh="searchRefresh"
      :rowsForamtter="rowsForamtter"
      :searchObj="searchData"
      :emptyText="'暂无数据'"
      :columns="tableColumns"
      api="/activity/customer/pageSearch"
      method="post"
    >
      <template slot="serviceCustomerName" slot-scope="{row}">
        <div class="flex-t-u">
          <el-avatar
            class="avatar"
            size="medium"
            :src="$store.state.config.systemConfig[0].dictionaryValue+row.avatar"
          ></el-avatar>
          <span class="f-title">{{row.serviceCustomerName}}</span>
        </div>
      </template>
      <template slot="emergencyList" slot-scope="{row}">
        <div v-if="row.emergencyList">
          <span v-for="(item, index) in row.emergencyList" :key="index">
            {{item.mobile}}
            <span v-if="index !=row.emergencyList.length - 1">、</span>
          </span>
        </div>
        <div v-else>--</div>
      </template>
      <template slot="customerCategoryList" slot-scope="{row}">
        <span v-for="(item, index) in row.customerCategoryList" :key="index">
          {{$func.transLabel($store.state.config.pensionTypeList,item)}}
          <span
            v-if="index !=row.customerCategoryList.length - 1"
          >、</span>
        </span>
      </template>
      <template slot-scope="{row}" slot="handleColumn">
        <el-button
          @click="$router.push({name:'serviceObjectDetail',query:{sid:row.serviceCustomerId}})"
          type="text"
          size="small"
        >查看</el-button>
      </template>
    </Table>
  </div>
</template>
<script>
export default {
  name: 'Participants',
  data () {
    return {
      searchRefresh: true,
      searchData: { activityId: this.activityId },
      tableColumns: [
        { label: '姓名', slot: 'serviceCustomerName', minWidth: 150 },
        { label: '紧急联系人电话', prop: 'emergencyMobile', minWidth: 260 },
        {
          label: '老人类别',
          slot: 'customerCategoryList',
          minWidth: 100
        },
        {
          label: '操作',
          slot: 'handleColumn',
          fixed: 'right',
          minWidth: 60
        }
      ]
    }
  },
  props: ['activityId', 'actualCustomerNum', 'customerNum'],
  created () {},
  methods: {
    exportExcel () {
      window.open(
        `${ctx}/activity/customer/export?activityId=${this.searchData
          .activityId || ''}&customerCategory=${this.searchData
          .customerCategory || ''}&serviceCustomerName=${this.searchData
          .serviceCustomerName || ''}&token=${this.$store.state.token}`
      )
    },
    rowsForamtter (rows) {
      rows.forEach(row => {
        row.activityTime = row.startTime + '~' + row.endTime
      })
    },
    handlTime (date) {
      if (date) {
        this.searchData.startTime = date[0]
        this.searchData.endTime = date[1]
      } else {
        this.searchData.startTime = ''
        this.searchData.endTime = ''
      }
    },
    commitSelection (data) {
      let arr = []
      data.forEach(i => {
        arr.push(i.activityId)
      })
      this.selectActivity = arr
    },
    handleDelete (row) {
      let id = row ? [row.activityId] : this.selectActivity
      this.$confirm('删除后，该数据将数据将无法恢复，是否确认？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.post('/activity/delete', id).then(res => {
            if (res.code === 200) {
              this.$message.success('操作成功')
              this.searchRefresh = !this.searchRefresh
            }
          })
        })
        .catch(() => {})
    },
    handleCloseActivity (row) {
      let id = row ? row.activityId : this.selectActivity.join(',')
      let content = '是否要提前结束活动？'
      this.$confirm(content, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post(`/activity/close?activityIdList=${id}`, {
              activityIdList: id
            })
            .then(res => {
              if (res.code === SUCCESS) {
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              }
            })
        })
        .catch(() => {})
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
