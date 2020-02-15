<!--
 * @Descripttion:角色管理
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-15 09:54:39
 -->
<template>
  <div class="role-manage">
    <!-- 筛选 -->
    <el-form inline ref="form" label-width="80px" size="small">
      <el-form-item label="角色名称">
        <el-input placeholder="请输入角色名称关键字" v-model="searchData.roleName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          @click="searchRefresh = !searchRefresh"
          icon="el-icon-search"
        >搜索</el-button>
        <el-button
          @click="searchData = {pageSize:20};searchRefresh = !searchRefresh"
          size="small"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <el-button
      @click="$router.push({name:'roleManageAdd'})"
      style="margin-bottom:15px"
      size="small"
      type="primary"
      v-has="'roleManageAdd'"
    >新增角色</el-button>
    <!-- 列表 -->
    <Table
      @commitSelection="commitSelection"
      :searchRefresh="searchRefresh"
      :searchObj="searchData"
      :selection="true"
      :columns="tableColumns"
      api="/role/pageSearch"
      method="post"
    >
      <template slot-scope="{row}" slot="handleColumn">
        <el-button
          v-has="'roleManagePreview'"
          @click="$router.push({name:'roleManagePreview',query:{rid:row.roleId}})"
          type="text"
          size="small"
        >查看</el-button>
        <el-button
          v-has="'roleManageEdit'"
          @click="$router.push({name:'roleManageEdit',query:{id:row.roleId}})"
          type="text"
          size="small"
        >编辑</el-button>
        <el-button v-has="'roleManageDelete'" @click="handleDelete(row)" type="text" size="small">删除</el-button>
      </template>
      <template slot="footer-left">
        <el-button
          :disabled="selectRole.length == 0"
          v-has="'roleManageDelete'"
          @click="handleDelete(null)"
          type="text"
        >删除</el-button>
      </template>
    </Table>
  </div>
</template>
<script>
export default {
  name: 'userManage',
  data() {
    return {
      searchRefresh: true,
      searchData: { pageSize: 20 },
      tableColumns: [
        { label: '角色名称', prop: 'roleName', minWidth: 200 },
        { label: '角色描述', prop: 'roleDesc', minWidth: 200 },
        {
          label: '更新时间',
          prop: 'updateTime',
          minWidth: 120
        },
        {
          label: '操作',
          slot: 'handleColumn',
          fixed: 'right',
          minWidth: 100
        }
      ],

      selectRole: []
    }
  },
  created() {},
  methods: {
    clickInfo(row) {
      console.log(row)
    },
    commitSelection(data) {
      let arr = []
      data.forEach(i => {
        arr.push(i.roleId)
      })
      this.selectRole = arr
    },
    handleStatus(row) {
      let content =
        row.status === 1 ? '您确定禁用此学员？' : '您确定启用此学员？'
      this.$confirm(content, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.post('/api/user/status', { id: row.id }).then(res => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '操作成功!'
              })
            }
          })
        })
        .catch(() => {})
    },
    handleDelete(row) {
      let id = row ? [row.roleId] : this.selectRole
      let content = '删除后，该角色将无法恢复，是否确定？'
      this.$confirm(content, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/role/delete', {
              roleIds: id
            })
            .then(res => {
              if (res.code === SUCCESS) {
                this.$message.success('操作成功')
                this.searchRefresh = !this.searchRefresh
              }
            })
        })
        .catch(() => {})
    },
    purchasedCourse(row) {
      this.dialogVisible = true
      this.mobile = row.mobile
      this.getCouseList(true)
    }
  }
}
</script>
<style lang="scss" scoped>
.role-manage {
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
