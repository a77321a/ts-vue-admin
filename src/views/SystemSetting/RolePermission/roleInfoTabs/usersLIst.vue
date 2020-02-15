<!--
 * @Descripttion:账号管理
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors:
 * @LastEditTime: 2019-12-16 20:32:52
 -->
<template>
  <div class="account-setting">
    <!-- 筛选 -->
    <el-form inline ref="form" label-width="80px" size="small">
      <el-form-item label="昵称">
        <el-input placeholder="请输入昵称关键字" v-model="searchData.nickName"></el-input>
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
    <!-- 列表 -->
    <Table
      :searchRefresh="searchRefresh"
      :searchObj="searchData"
      :selection="false"
      :columns="tableColumns"
      :dataArray="userList"
      method="post"
    >
      <template slot-scope="{row}" slot="nickName">{{row.nickName}}（{{row.mobile}}）</template>
      <template slot-scope="{row}" slot="handleColumn">
        <el-button
          @click="dialogFormVisible = true;formInfo.userId = row.userId"
          type="text"
          size="small"
        >重置密码</el-button>
      </template>
    </Table>
    <el-dialog destroy-on-close title="修改密码" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="formInfo" label-width="100px" :model="formInfo">
        <el-form-item label="新密码" prop="newPassword">
          <el-input placeholder="请输入新密码" show-password v-model="formInfo.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmNewPassword">
          <el-input placeholder="确认新密码" show-password v-model="formInfo.confirmNewPassword"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSaveForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'accountSetting',
  props: ['userList'],
  data () {
    const validPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入确认新密码'))
      } else if (
        this.formInfo.confirmNewPassword !== this.formInfo.newPassword
      ) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      searchRefresh: true,
      searchData: {},
      dialogFormVisible: false,
      formInfo: {},
      tableColumns: [
        { label: '昵称', slot: 'nickName', minWidth: 200 },
        {
          label: '更新时间',
          prop: 'updateTime',
          minWidth: 140
        },
        {
          label: '操作',
          slot: 'handleColumn',
          fixed: 'right',
          width: 100
        }
      ],
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        confirmNewPassword: [
          { required: true, validator: validPass, trigger: 'blur' }
        ]
      },
      dialogVisible: false
    }
  },
  created () {},
  watch: {
    searchRefresh () {
      this.$emit('searchList', this.searchData)
    }
  },
  methods: {
    handleSaveForm () {
      this.$refs['formInfo'].validate(valid => {
        if (!valid) return
        this.$http
          .post('/user/adminResetPwd', {
            newPassword: this.formInfo.newPassword,
            userId: this.formInfo.userId
          })
          .then(res => {
            if (res.code === SUCCESS) {
              this.$message.success('操作成功')
              this.dialogFormVisible = false
              this.formInfo = {}
            }
          })
      })
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
