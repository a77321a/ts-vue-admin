<!--
 * @Descripttion:活动中心
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors:
 * @LastEditTime: 2019-12-21 23:22:29
 -->
<template>
  <div class="dictionare-config">
    <!-- 筛选 -->
    <el-form inline ref="form" label-width="80px" size="small">
      <el-form-item label="字典名称">
        <el-input placeholder="请输入字典名称关键字" v-model="searchData.dictionaryLabel"></el-input>
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
      type="primary"
      v-has="'dictionaryConfigAdd'"
    >新增目录</el-button>
    <!-- 列表 -->
    <Table
      rowKey="RowIndex"
      :rowsForamtter="rowsForamtter"
      :searchRefresh="searchRefresh"
      :searchObj="searchData"
      :columns="tableColumns"
      :treeProps="{children:'dictionaries'}"
      api="/dictionary/tree"
      method="post"
    >
      <template slot-scope="{row}" slot="handleColumn">
        <el-button
          @click="$router.push({name:'dictionaryConfigAdd',query:{parent:row.dictCatalogKey}})"
          v-if="row.dictionaries"
          type="text"
          size="small"
          v-has="'dictionaryConfigAdd'"
        >新增字典</el-button>
        <el-button
          v-if="row.dictionaries"
          @click="formInfo = row;dialogFormVisible = true"
          type="text"
          v-has="'dictionaryConfigEdit'"
          size="small"
        >编辑</el-button>
        <el-button
          v-else
          v-has="'dictionaryConfigEdit'"
          @click="$router.push({name:'dictionaryConfigEdit',query:{did:row.dictionaryId,parent:row.parent}})"
          type="text"
          size="small"
        >编辑</el-button>

        <el-button
          v-has="'dictionaryConfigDelete'"
          @click="handleDelete(row,row.dictionaries?true:false)"
          type="text"
          size="small"
        >删除</el-button>
      </template>
    </Table>
    <el-dialog
      destroy-on-close
      :title="formInfo.dictCatalogId ? '编辑目录' :'新增目录'"
      :visible.sync="dialogFormVisible"
    >
      <el-form :rules="rules" ref="formInfo" label-width="80px" :model="formInfo">
        <el-form-item label="目录名称" prop="dictCatalogName">
          <el-input
            :maxlength="20"
            show-word-limit
            v-model="formInfo.dictCatalogName"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="目录标识" prop="dictCatalogKey">
          <el-input
            :disabled="formInfo.dictCatalogId"
            v-model="formInfo.dictCatalogKey"
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
  name: 'dictionaryConfig',
  data () {
    return {
      searchRefresh: true,
      searchData: {},
      formInfo: { name: '' },
      rules: {
        dictCatalogName: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
        ],
        dictCatalogKey: [
          { required: true, message: '请输入字典标识', trigger: 'blur' }
        ]
      },
      tableColumns: [
        {
          label: '字典名称',
          align: 'left',
          prop: 'dictCatalogName',
          minWidth: 100
        },
        { label: '字典标识', prop: 'dictCatalogKey', minWidth: 150 },
        {
          label: '字典值',
          prop: 'dictionaryValue',
          minWidth: 100
        },
        // {
        //   label: '模块类型',
        //   prop: 'dictCatalogKey',
        //   minWidth: 150
        // },
        {
          label: '更新时间',
          prop: 'updateTime',
          minWidth: 150
        },
        {
          label: '操作',
          slot: 'handleColumn',
          fixed: 'right',
          minWidth: 140
        }
      ],
      dialogFormVisible: false
    }
  },
  created () {},
  methods: {
    rowsForamtter (rows) {
      let RowIndex = 1
      rows.forEach(row => {
        row.RowIndex = RowIndex
        RowIndex++
        if (Array.isArray(row.dictionaries) && row.dictionaries.length > 0) {
          row.dictionaries.forEach(j => {
            j.RowIndex = RowIndex
            RowIndex++
            j.dictCatalogName = j.dictionaryLabel
            j.parent = j.dictCatalogKey
            j.dictCatalogKey = j.dictionaryKey
          })
        }
      })
    },
    handleSaveForm () {
      this.$refs['formInfo'].validate(valid => {
        if (!valid) return
        if (this.formInfo.dictCatalogId) {
          this.$http
            .post('/dictionaryType/update', {
              dictCatalogId: this.formInfo.dictCatalogId,
              dictCatalogName: this.formInfo.dictCatalogName
            })
            .then(res => {
              if (res.code === SUCCESS) {
                this.$message.success('操作成功')
                this.dialogFormVisible = false
                this.searchRefresh = !this.searchRefresh
              }
            })
        } else {
          this.$http.post('/dictionaryType/add', this.formInfo).then(res => {
            if (res.code === SUCCESS) {
              this.$message.success('操作成功')
              this.dialogFormVisible = false
              this.searchRefresh = !this.searchRefresh
            }
          })
        }
      })
    },
    handleDelete (row, parent) {
      let id = parent ? [row.dictCatalogId] : [row.dictionaryId]
      if (parent && row.dictionaries.length > 0) {
        this.$message.error('当前目录下含有字典，无法删除')
        return
      }
      this.$confirm(
        '删除后，与该字典关联的数据值都将被清空，是否确认？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          if (parent) {
            this.$http
              .post('/dictionaryType/delete', { dictionaryTypeIds: id })
              .then(res => {
                if (res.code === SUCCESS) {
                  this.$message.success('操作成功')
                  this.searchRefresh = !this.searchRefresh
                }
              })
          } else {
            this.$http
              .post('/dictionary/delete', { dictionaryIds: id })
              .then(res => {
                if (res.code === SUCCESS) {
                  this.$message.success('操作成功')
                  this.searchRefresh = !this.searchRefresh
                }
              })
          }
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
.dictionare-config {
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
