<!--
 * @Descripttion:账号管理
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2019-12-26 12:11:52
 -->
<template>
  <div class="account-setting">
    <!-- 筛选 -->
    <el-form inline ref="form" label-width="80px" size="small">
      <el-form-item label="人员类型">
        <el-select clearable v-model="searchData.accountType" placeholder="请选择">
          <el-option label="内部服务人员" value="1"></el-option>
          <el-option label="外部人员" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="管理范围">
        <el-select clearable v-model="searchData.adminScope" placeholder="请选择">
          <el-option label="超级管理员" value="1"></el-option>
          <el-option label="社区管理员" value="2"></el-option>
          <el-option label="机构管理员" value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="昵称">
        <el-input placeholder="请输入昵称关键字" v-model="searchData.nickName"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input placeholder="请输入手机号" v-model="searchData.mobile"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          @click="searchRefresh = !searchRefresh"
          icon="el-icon-search"
        >搜索</el-button>
        <el-button @click="searchData = {};searchRefresh = !searchRefresh" size="small">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button
      @click="$router.push({name:'accountSettingAdd'})"
      style="margin-bottom:15px"
      size="small"
      type="primary"
      v-has="'accountSettingAdd'"
    >新增账号</el-button>
    <!-- 列表 -->
    <Table
      :rowsForamtter="rowsForamtter"
      @commitSelection="commitSelection"
      :searchRefresh="searchRefresh"
      :searchObj="searchData"
      :selection="true"
      :columns="tableColumns"
      api="/user/pageSearch"
      method="post"
    >
      <template slot-scope="{row}" slot="accountType">{{row.accountType == 1 ? '内部服务人员':'外部人员'}}</template>
      <template slot-scope="{row}" slot="nickName">{{row.nickName}}（{{row.mobile}}）</template>

      <template slot-scope="{row}" slot="handleColumn">
        <el-button
          v-has="'accountSettingEdit'"
          @click="$router.push({name:'accountSettingEdit',query:{uid:row.userId}})"
          type="text"
          size="small"
        >编辑</el-button>
        <el-button
          v-has="'accountSettingDelete'"
          @click="handleDelete(row)"
          type="text"
          size="small"
        >删除</el-button>
      </template>
      <template slot="footer-left">
        <el-button
          :disabled="selectAccount.length == 0"
          v-has="'accountSettingDelete'"
          @click="handleDelete(null)"
          type="text"
        >删除</el-button>
      </template>
    </Table>
  </div>
</template>
<script>
export default {
  name: 'accountSetting',
  data () {
    return {
      searchRefresh: true,
      searchData: {},
      tableColumns: [
        { label: '昵称', slot: 'nickName', minWidth: 200 },
        // { label: '角色', prop: 'account', minWidth: 200 },
        {
          label: '人员类型',
          slot: 'accountType',
          minWidth: 120
        },
        {
          label: '管理范围',
          prop: 'superAdmin',
          minWidth: 120
        },
        {
          label: '更新时间',
          prop: 'updateTime',
          minWidth: 140
        },
        {
          label: '操作',
          slot: 'handleColumn',
          fixed: 'right',
          minWidth: 80
        }
      ],

      selectAccount: []
    }
  },
  created () {},
  methods: {
    rowsForamtter (rows) {
      rows.forEach(row => {
        row.superAdmin = row.superAdmin
          ? '超级管理员'
          : row.scopeDepth
            ? '社区管理员'
            : '机构管理员'
      })
    },
    commitSelection (data) {
      let arr = []
      data.forEach(i => {
        arr.push(i.userId)
      })
      this.selectAccount = arr
    },
    handleStatus (row) {
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
    handleDelete (row) {
      let id = row ? [row.userId] : this.selectAccount
      let content = '删除后，该手机号将无法登录后台，是否确定？'
      this.$confirm(content, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/user/delete', {
              userIds: id
            })
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
.account-setting {
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
