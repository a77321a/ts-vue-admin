<!--
 * @Descripttion:服务类型
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors:
 * @LastEditTime: 2019-12-21 23:05:29
 -->
<template>
  <div class="service-product">
    <el-row :gutter="20">
      <OrgTreeList @filterOrg="filterOrg" @toggleChange="toggleChange"></OrgTreeList>
      <!-- 筛选 -->
      <el-col :span="toggleWidth" style="padding-left: 20px;">
        <el-form inline ref="form" label-width="80px" size="small">
          <el-form-item label="类型名称">
            <el-input placeholder="请输入类型名称关键字" v-model="searchData.orgServiceTypeName"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              size="small"
              type="primary"
              @click="searchRefresh = !searchRefresh"
              icon="el-icon-search"
            >搜索</el-button>
            <el-button
              @click="searchData = {orgId:searchData.orgId };searchRefresh = !searchRefresh"
              size="small"
            >重置</el-button>
          </el-form-item>
        </el-form>
        <el-button
          @click="dialogFormVisible = true"
          style="margin-bottom:15px"
          size="small"
          type="primary"
          v-has="'serviceTypeAdd'"
        >新增类型</el-button>

        <!-- 列表 -->
        <Table
          :searchRefresh="searchRefresh"
          :searchObj="searchData"
          :columns="tableColumns"
          api="/org/service/type/pageSearch"
          method="post"
        >
          <template slot-scope="{row}" slot="action">
            <el-button
              v-has="'serviceTypeEdit'"
              @click="handleEdit(row)"
              type="text"
              size="small"
            >编辑</el-button>

            <el-button
              v-has="'serviceTypeDelete'"
              @click="handleDelete(row)"
              type="text"
              size="small"
            >删除</el-button>
          </template>
        </Table>
      </el-col>
    </el-row>
    <el-dialog
      :title="formInfo.orgServiceTypeId ? '编辑分类' :'新增分类'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :rules="rules" ref="formInfo" label-width="80px" :model="formInfo">
        <el-form-item label="所属机构" v-if="!formInfo.orgServiceTypeId" prop="orgId">
          <el-cascader
            clearable
            :props="{value:'orgId',label:'orgName',emitPath:false}"
            :options="orgTree"
            v-model="formInfo.orgId"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="分类名称" prop="orgServiceTypeName">
          <el-input
            placeholder="分类名称最多可输入20个字"
            show-word-limit
            :maxlength="20"
            v-model="formInfo.orgServiceTypeName"
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
import OrgTreeList from '@/components/OrgTreeList/OrgTreeList'

export default {
  name: 'serviceType',
  components: {
    OrgTreeList
  },
  data () {
    return {
      toggleWidth: 19,
      searchRefresh: true,
      searchData: {},
      dialogFormVisible: false,
      tableColumns: [
        { label: '类型名称', prop: 'orgServiceTypeName', minWidth: 200 },
        { label: '服务产品数量', prop: 'productNum', minWidth: 100 },
        {
          label: '操作',
          slot: 'action',
          fixed: 'right',
          width: 100
        }
      ],
      formInfo: {},
      rules: {
        orgId: [
          { required: true, message: '请选择所属机构', trigger: 'change' }
        ],
        orgServiceTypeName: [
          { required: true, message: '请输入类型名称', trigger: 'blur' }
        ]
      },
      orgTree: []
    }
  },
  created () {
    this.getOrgList()
  },
  methods: {
    getOrgList () {
      this.$http.post('/org/tree').then(res => {
        if (res.code === SUCCESS) {
          this.orgTree = res.payload
          this.orgTree.forEach(i => {
            if (i.children.length > 0) {
              i.children.forEach(j => {
                delete j.children
              })
            }
          })
        }
      })
    },
    handleEdit (row) {
      this.formInfo = row
      this.dialogFormVisible = true
    },
    handleSaveForm () {
      this.$refs['formInfo'].validate(valid => {
        if (!valid) return
        let url = this.formInfo.orgServiceTypeId
          ? '/org/service/type/update'
          : '/org/service/type/add'
        this.$http
          .post(url, {
            orgServiceTypeId: this.formInfo.orgServiceTypeId,
            orgId: this.formInfo.orgId,
            orgServiceTypeName: this.formInfo.orgServiceTypeName
          })
          .then(res => {
            if (res.code === SUCCESS) {
              this.$message.success('操作成功')
              this.dialogFormVisible = false
              this.formInfo = {}
              this.searchRefresh = !this.searchRefresh
            }
          })
      })
    },
    filterOrg (val) {
      this.searchData.orgId = val
      this.searchRefresh = !this.searchRefresh
    },
    toggleChange (val) {
      this.toggleWidth = val
    },
    handleDelete (row) {
      if (row.productNum > 0) {
        this.$message.error('当前分类下含有产品，无法删除')
        return
      }
      let id = row ? [row.orgServiceTypeId] : ''
      this.$confirm('确定要删除该分类吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/org/service/type/delete', { orgServiceTypeIds: id })
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
.service-product {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 193px;
  }
  .el-input--small {
    width: 193px;
  }
  /deep/ .el-collapse-item__header {
    padding-left: 10px;
  }
  .checked {
    width: calc(100% - 30px);
    padding-left: 20px;
    height: 34px;
    line-height: 34px;
    margin: 10px 0;
    border-left: 5px solid #409eff;
    background-color: #fff;
    position: relative;
    &::after {
      position: absolute;
      top: -1px;
      right: -8px;
      display: block;
      width: 0;
      height: 0;
      content: ' ';
      border-color: transparent transparent transparent #fff;
      border-style: solid;
      border-width: 18px 0 18px 8px;
    }
  }
}
</style>
