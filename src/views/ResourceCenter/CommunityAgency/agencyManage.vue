<!--
 * @Descripttion:机构管理
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors:
 * @LastEditTime: 2019-12-21 23:10:36
 -->
<template>
  <div class="angecy-manage">
    <!-- 筛选 -->
    <el-form inline ref="form" label-width="80px" size="small">
      <el-form-item label="机构状态">
        <el-select clearable v-model="searchData.status" placeholder="请选择">
          <el-option label="正常运营" value="1"></el-option>
          <el-option label="已注销" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机构类型">
        <el-select clearable v-model="searchData.orgType" placeholder="请选择">
          <el-option
            v-for="(item, index) in $store.state.config.orgType"
            :key="index"
            :label="item.dictionaryLabel"
            :value="item.dictionaryValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务类型">
        <el-select clearable v-model="searchData.serviceType" placeholder="请选择">
          <el-option
            v-for="(item, index) in $store.state.config.serviceType"
            :key="index"
            :label="item.dictionaryLabel"
            :value="item.dictionaryValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机构名称">
        <el-input placeholder="请输入机构名称关键字" v-model="searchData.orgName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          @click="searchRefresh = !searchRefresh"
          icon="el-icon-search"
        >搜索</el-button>
        <el-button
          @click="
            searchData = {}
            searchRefresh = !searchRefresh
          "
          size="small"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <el-button
      v-has="'agencyManageAdd'"
      @click="$router.push({ name: 'agencyManageAdd' })"
      style="margin-bottom:15px"
      size="small"
      type="primary"
    >新增机构</el-button>
    <el-button
      v-has="'agencyManageExport'"
      @click="exportExcel"
      style="margin-bottom:15px"
      size="small"
    >导出数据</el-button>
    <!-- 列表 -->
    <Table
      rowKey="orgId"
      :searchRefresh="searchRefresh"
      :searchObj="searchData"
      :selection="false"
      :columns="tableColumns"
      :treeProps="{children: 'children'}"
      api="/org/tree"
      method="post"
    >
      <template
        slot="orgType"
        slot-scope="{row}"
      >{{$func.transLabel($store.state.config.orgType,row.orgType)}}</template>
      <template
        slot="serviceType"
        slot-scope="{row}"
      >{{$func.transLabel($store.state.config.serviceType,row.serviceType)}}</template>
      <template slot="status" slot-scope="{row}">{{row.status == 1 ?'正常运营':'已注销'}}</template>
      <template slot="handleColumn" slot-scope="{ row }">
        <el-button
          @click="handleAppend(row)"
          v-if="row.parentOrgId == 0"
          v-has="'agencyManageAdd'"
          type="text"
          size="small"
        >新增分部</el-button>
        <el-button
          v-has="'agencyManageLogout'"
          @click="handleStatus(row)"
          v-else
          type="text"
          size="small"
        >{{row.status == 1?'注销机构':'重新入网'}}</el-button>
        <!-- <el-button
          @click="handleStatus(row)"
          v-if="!row.children"
          type="text"
          size="small"
        >{{ row.status === 1 ? '注销机构' : '重新入网' }}</el-button>-->
        <el-button
          type="text"
          v-has="'agencyManagePreview'"
          size="small"
          @click="$router.push({ name: 'agencyInfo', query: { oid: row.orgId}})"
        >详情</el-button>
        <el-button
          v-has="'agencyManageEdit'"
          type="text"
          size="small"
          @click="$router.push({ name: 'agencyManageEdit', query: { oid: row.orgId,parent:row.parentOrgId == 0 ? '' :row.parentOrgId }})"
        >编辑</el-button>
        <el-button
          v-has="'agencyManageDelete'"
          @click="handleDelete(row)"
          type="text"
          size="small"
        >删除</el-button>
      </template>
    </Table>
  </div>
</template>
<script>
export default {
  name: 'agencyManage',
  data () {
    return {
      searchRefresh: true,
      searchData: {},
      tableColumns: [
        { label: '机构名称', prop: 'orgName', minWidth: 250 },
        { label: '服务范围', prop: 'communityRegionName', minWidth: 300 },
        {
          label: '机构类型',
          slot: 'orgType',
          minWidth: 120
        },
        {
          label: '服务类型',
          slot: 'serviceType',
          minWidth: 120
        },
        {
          label: '机构状态',
          slot: 'status',
          minWidth: 100
        },
        {
          label: '操作',
          slot: 'handleColumn',
          fixed: 'right',
          minWidth: 200
        }
      ],
      orgTypeList: [],
      serviceTypeList: [],
      operationModeList: []
    }
  },
  created () {
    // this.getOrgType()
    // this.getServiceType()
    // this.getOperationMode()
  },
  methods: {
    exportExcel () {
      window.open(
        `${ctx}/org/export?orgName=${this.searchData.orgName ||
          ''}&orgType=${this.searchData.orgType || ''}&serviceType=${this
          .searchData.serviceType || ''}&status=${this.searchData.status ||
          ''}&token=${this.$store.state.token}`
      )
    },
    handleAppend (row) {
      this.$router.push({
        name: 'agencyManageEdit',
        query: {
          parent: row.orgId
        }
      })
    },
    getServiceType () {
      this.$http.get('/org/serviceType').then(res => {
        if (res.code === SUCCESS) {
          this.serviceTypeList = res.payload
        }
      })
    },
    getOrgType () {
      this.$http.get('/org/orgType').then(res => {
        if (res.code === SUCCESS) {
          this.orgTypeList = res.payload
        }
      })
    },
    getOperationMode () {
      this.$http.get('/org/operationMode').then(res => {
        if (res.code === SUCCESS) {
          this.operationModeList = res.payload
        }
      })
    },

    handleStatus (row) {
      console.log(1)
      let content =
        row.status === 1
          ? '注销后，与该机构管理的旧数据不受影响，新增数据时，将无法关联该机构，同时仅与该机构关联的管理员，将无法登录平台，是否确认？'
          : '确认要对该机构重新入网吗？'
      this.$confirm(content, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/org/changStauts', {
              orgId: row.orgId,
              status: row.status === 1 ? 0 : 1
            })
            .then(res => {
              if (res.code === SUCCESS) {
                this.searchRefresh = !this.searchRefresh
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              }
            })
        })
        .catch(() => {})
    },
    handleDelete (row) {
      if (row.parentOrgId == 0 && row.children.length > 0) {
        this.$message.error('当前机构下含有分部站点，无法删除')
        return
      }
      let id = [row.orgId]
      this.$confirm(
        '删除后，与该机构相关的数据将被取消关联，同时仅与该机构关联的管理员，将无法登录平台，是否确认？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$http.post('/org/delete', { orgIds: id }).then(res => {
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
.angecy-manage {
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
