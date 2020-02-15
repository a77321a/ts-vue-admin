<!--
 * @Descripttion:养老产品目录
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-15 16:15:48
 -->
<template>
  <div class="account-setting">
    <!-- 筛选 -->
    <el-form inline ref="form" label-width="80px" size="small">
      <el-form-item label="类型名称">
        <el-input placeholder="请输入类型名称关键字" v-model="searchData.pensionServiceTypeName"></el-input>
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
      @click="formInfo = {};dialogFormVisible = true"
      style="margin-bottom:15px"
      size="small"
      v-has="'productTypeAdd'"
      type="primary"
    >新增类型</el-button>
    <!-- 列表 -->
    <Table
      rowKey="pensionServiceTypeId"
      :searchRefresh="searchRefresh"
      :searchObj="searchData"
      :selection="false"
      :columns="tableColumns"
      :treeProps="{children: 'children'}"
      api="/pension/service/type/tree"
      method="post"
    >
      <template slot-scope="{row}" slot="handleColumn">
        <el-button
          :class="row.depth ==3 ?'hidden':''"
          v-has="'productTypeAdd'"
          @click="handleAddType(row)"
          type="text"
          size="small"
        >新增</el-button>
        <el-button
          v-has="'productTypeEdit'"
          @click="formInfo = row;dialogFormVisible = true"
          type="text"
          size="small"
        >编辑</el-button>

        <el-button
          v-has="'productTypeDelete'"
          @click="handleDelete(row)"
          type="text"
          size="small"
        >删除</el-button>
      </template>
    </Table>
    <el-dialog
      :title="formInfo.pensionServiceTypeId ? '编辑产品目录' :'新增产品目录'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :rules="rules" ref="formInfo" label-width="80px" :model="formInfo">
        <el-form-item label="类型名称" prop="pensionServiceTypeName">
          <el-input
            placeholder="类型名称最多可输入20个字"
            :maxlength="20"
            show-word-limit
            v-model="formInfo.pensionServiceTypeName"
            autocomplete="off"
          ></el-input>
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
  name: 'productType',
  data () {
    return {
      searchRefresh: true,
      searchData: {},
      tableColumns: [
        { label: '类型名称', prop: 'pensionServiceTypeName', minWidth: 400 },
        { label: '服务产品数量', prop: 'productNum', minWidth: 100 },

        {
          label: '操作',
          slot: 'handleColumn',
          fixed: 'right',
          minWidth: 90
        }
      ],
      rules: {
        pensionServiceTypeName: [
          { required: true, message: '请输入目录名称', trigger: 'blur' }
        ]
      },
      formInfo: {},
      dialogFormVisible: false
    }
  },
  created () {},
  methods: {
    handleAddType (row) {
      this.formInfo = {
        parentId: row.pensionServiceTypeId
      }
      this.dialogFormVisible = true
    },
    handleSaveForm () {
      this.$refs['formInfo'].validate(valid => {
        if (!valid) return
        let url = this.formInfo.pensionServiceTypeId
          ? '/pension/service/type/update'
          : '/pension/service/type/add'
        this.$http
          .post(url, {
            parentId: this.formInfo.pensionServiceTypeId
              ? ''
              : this.formInfo.parentId,
            pensionServiceTypeId: this.formInfo.pensionServiceTypeId,
            pensionServiceTypeName: this.formInfo.pensionServiceTypeName
          })
          .then(res => {
            if (res.code === SUCCESS) {
              this.$message.success('操作成功')
              this.dialogFormVisible = false
              this.searchRefresh = !this.searchRefresh
            }
          })
      })
    },
    rowsForamtter (rows) {
      rows.forEach(row => {
        row.accountType = row.superAdmin ? '超级管理员' : '--'
      })
    },
    handleDelete (row) {
      if (row.productNum > 0) {
        this.$message.error('当前分类下含有产品，无法删除')
        return
      }
      let id = row ? [row.pensionServiceTypeId] : this.selectAccount.join(',')
      let content = '确定要删除该分类吗？'
      this.$confirm(content, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/pension/service/type/delete', { pensionServiceTypeIds: id })
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
  .hidden {
    visibility: hidden;
  }
}
</style>
