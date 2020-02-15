<!--
 * @Descripttion:助餐中心
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors:
 * @LastEditTime: 2019-12-21 22:57:54
 -->
<template>
  <div class="service-center">
    <el-row class="row-span" :gutter="40">
      <OrgTreeList @filterOrg="filterOrg" @toggleChange="toggleChange"></OrgTreeList>
      <el-col :span="toggleWidth">
        <!-- 筛选 -->
        <el-form inline ref="form" label-width="80px" size="small">
          <el-form-item label="活动室">
            <el-select clearable v-model="searchData.activityRoomId" placeholder="请选择">
              <el-option
                v-for="(item, index) in eventRoomList"
                :key="index"
                :label="item.activityRoomName"
                :value="item.activityRoomId"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="服务名称">
            <el-input placeholder="请输入服务名称关键字" v-model="searchData.serviceRecordName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              size="small"
              type="primary"
              @click="searchRefresh = !searchRefresh"
              icon="el-icon-search"
            >搜索</el-button>
            <el-button
              @click="searchData = {orgIdList:searchData.orgIdList};searchRefresh = !searchRefresh"
              size="small"
            >重置</el-button>
          </el-form-item>
        </el-form>
        <el-button
          @click="$router.push({name:'serviceCenterAdd'})"
          style="margin-bottom:15px"
          v-has="'serviceCenterAdd'"
          size="small"
          type="primary"
        >新增服务</el-button>

        <!-- 列表 -->
        <Table
          :searchRefresh="searchRefresh"
          :searchObj="searchData"
          :columns="tableColumns"
          api="/service/record/pageSearch"
          method="post"
        >
          <template slot="customerNum" slot-scope="{row}">{{row.customerNum}}人</template>
          <template slot="action" slot-scope="{row}">
            <el-button
              v-has="'serviceCenterEdit'"
              @click="$router.push({name:'serviceCenterEdit',query:{sid:row.serviceRecordId}})"
              type="text"
            >编辑</el-button>
            <el-button v-has="'serviceCenterDelete'" @click="handleDelete(row)" type="text">删除</el-button>
          </template>
        </Table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import OrgTreeList from '@/components/OrgTreeList/OrgTreeList'

export default {
  name: 'serviceCenter',
  components: {
    OrgTreeList
  },
  data () {
    return {
      toggleWidth: 19,
      searchRefresh: true,
      searchData: {},
      tableColumns: [
        { label: '服务名称', prop: 'serviceRecordName', minWidth: 200 },
        { label: '服务老人', slot: 'customerNum', minWidth: 150 },
        {
          label: '所在活动室',
          prop: 'activityRoomName',
          minWidth: 100
        },
        {
          label: '创建人',
          prop: 'createUserName',
          width: 150
        },
        {
          label: '创建时间',
          prop: 'createTime',
          minWidth: 150
        },
        {
          label: '操作',
          slot: 'action',
          fixed: 'right',
          minWidth: 100
        }
      ],
      eventRoomList: []
    }
  },
  created () {
    this.getEventRoomList()
  },
  methods: {
    filterOrg (val) {
      this.searchData.orgIdList = val ? [val] : undefined
      this.searchRefresh = !this.searchRefresh
    },
    getEventRoomList () {
      this.$http
        .post('/activity/room/pageSearch', { pageSize: 99999 })
        .then(res => {
          this.eventRoomList = res.payload.records
        })
    },
    toggleChange (val) {
      this.toggleWidth = val
    },
    handleDelete (row) {
      let id = row ? [row.serviceRecordId] : []
      this.$confirm('删除后，该数据将数据将无法恢复，是否确认？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/service/record/delete', { serviceRecordIdList: id })
            .then(res => {
              if (res.code === SUCCESS) {
                this.$message.success('操作成功')
                this.searchRefresh = !this.searchRefresh
              }
            })
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.service-center {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 193px;
  }
  .el-input--small {
    width: 193px;
  }
}
</style>
