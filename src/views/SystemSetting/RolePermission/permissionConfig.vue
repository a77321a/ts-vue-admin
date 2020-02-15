<!--
 * @Descripttion:空间资源
 * @Author:
 * @Date: 2019-11-06 22:19:24
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2019-12-26 14:57:20
 -->
<template>
  <div id="space-resource">
    <el-form inline ref="form" label-width="80px" size="small">
      <el-form-item label="权限名称">
        <el-input placeholder="请输入权限名称关键字" v-model="searchData.permissionName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="getTree()" icon="el-icon-search">搜索</el-button>
        <el-button @click="searchData = {};getTree()" size="small">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button
      @click="getMenuTree();dialogFormVisible = true;dialogType = true; formInfo = { permissionList: {} }"
      style="margin-bottom:15px"
      size="small"
      v-has="'permissionConfigAdd'"
      type="primary"
    >新增权限</el-button>
    <div class="tree-title">
      <span class="left">权限名称</span>
      <span class="right">操作</span>
      <span style="float:right;margin-right:280px">更新时间</span>
      <span style="float:right;margin-right:100px">权限类型</span>
      <span style="float:right;margin-right:180px">描述</span>
    </div>
    <el-tree
      v-loading="loading"
      :expand-on-click-node="false"
      :data="data"
      node-key="regionId"
      default-expand-all
    >
      <div class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ data.permissionName }}</span>
        <span style="float:right">
          <el-button
            v-has="'permissionConfigAdd'"
            type="text"
            size="mini"
            :class="data.permissionDepth == 4 ? 'hidden':''"
            @click="() => handleAppend(node,data)"
          >{{data.permissionDepth == 1 ? '新增菜单权限' : data.permissionDepth == 2 ? '新增菜单权限' : data.permissionDepth ==3 ?'新增按钮权限':'新增按钮权限'}}</el-button>
          <el-button
            v-has="'permissionConfigEdit'"
            type="text"
            size="mini"
            @click="() => handleEdit(node, data)"
          >编辑</el-button>
          <el-button
            v-has="'permissionConfigDelete'"
            type="text"
            size="mini"
            @click="() => handleDelete(node, data)"
          >删除</el-button>
        </span>
        <span style="float:right;margin-right:75px;">{{data.updateTime}}</span>

        <span style="float:right;margin-right:125px;">{{data.permissionDepth == 4 ? '按钮':'菜单'}}</span>
        <span
          class="desc"
          :title="data.permissionDesc"
          style="float:right;margin-right:102px;width:100px;display:inline-block"
        >{{data.permissionDesc}}</span>
      </div>
    </el-tree>
    <el-dialog
      destroy-on-close
      :title="dialogType ? '添加权限' :'修改权限'"
      :visible.sync="dialogFormVisible"
      width="70%"
    >
      <el-form :rules="rules" ref="formInfo" label-width="80px" :model="formInfo">
        <el-form-item v-if="dialogType" label="菜单" prop="permissionList">
          <el-select
            style="width:200px"
            clearable
            collapse-tags
            @change="selectTag"
            v-model="formInfo.permissionList"
            placeholder="请选择"
            value-key="menuId"
          >
            <el-option
              v-for="(item, index) in depthOneList"
              :key="index"
              :label="item.name"
              :value="item"
            ></el-option>
          </el-select>
          <!-- <el-select
            style="width:200px"
            clearable
            v-model="searchData.permissionList"
            placeholder="请选择"
            value-key="menuId"
          >
            <el-option
              v-for="(item, index) in depthOneList"
              :key="index"
              :label="item.name"
              :value="item"
            ></el-option>
          </el-select>-->
        </el-form-item>
        <el-form-item label="描述" prop="permissionDesc">
          <el-input
            type="textarea"
            :maxlength="50"
            show-word-limit
            :rows="3"
            placeholder="请输入权限描述，最多不超过50个字"
            v-model="formInfo.permissionDesc"
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
  name: 'spaceResource',
  components: {},
  data () {
    return {
      dialogType: true,
      loading: false,
      data: [],
      searchData: {},
      tempObj: {},
      formInfo: {},
      rules: {
        permissionList: [{ required: true, message: '菜单或按钮必须选择' }],
        permissionDesc: [{ required: true, message: '请输入权限描述' }]
      },
      dialogFormVisible: false,
      depthOneList: [],
      selectList: [],
      menuTree: []
    }
  },
  created () {
    this.getTree()
    this.getMenuTree()
  },
  methods: {
    selectTag (val) {
      this.formInfo.permissionList = val
    },
    handleEdit (node, data) {
      this.dialogType = false
      this.formInfo = data
      this.$set(this.formInfo, 'permissionList', { url: data.permissionUrl })
      this.dialogFormVisible = true
    },
    handleSaveForm () {
      console.log(this.formInfo)
      if (
        !this.formInfo.permissionList ||
        !this.formInfo.permissionList.hasOwnProperty('url')
      ) {
        this.$message.error('请选择菜单')
        return
      }
      this.$refs['formInfo'].validate(valid => {
        if (!valid) return
        // let url = this.dialogType ? '/permission/add':'/permission/update'
        if (this.dialogType) {
          this.$http
            .post('/permission/add', {
              parentId: this.formInfo.permissionId
                ? this.formInfo.permissionId
                : 0,
              permissionDepth: this.formInfo.permissionDepth
                ? this.formInfo.permissionDepth + 1
                : 0,
              permissionDesc: this.formInfo.permissionDesc,
              permissionName: this.formInfo.permissionList.name,
              permissionType: this.formInfo.permissionDepth == 3 ? 3 : 2,
              permissionUrl: this.formInfo.permissionList.url
                ? this.formInfo.permissionList.url
                : this.formInfo.permissionList.name
            })
            .then(res => {
              if (res.code === SUCCESS) {
                this.$message.success('操作成功')
                this.dialogFormVisible = false
                this.getTree()
              }
            })
        } else {
          this.$http
            .post('/permission/update', {
              permissionId: this.formInfo.permissionId,
              parentId: this.formInfo.parentId,
              permissionDepth: this.formInfo.permissionDepth,
              permissionDesc: this.formInfo.permissionDesc,
              permissionName: this.formInfo.permissionName,
              permissionType: this.formInfo.permissionType,
              permissionUrl: this.formInfo.permissionUrl
            })
            .then(res => {
              if (res.code === SUCCESS) {
                this.$message.success('操作成功')
                this.dialogFormVisible = false
                this.getTree()
              }
            })
        }
        this.formInfo = { permissionList: {} }
      })
    },
    getMenuTree () {
      this.depthOneList = []
      this.$http.post('/menu/tree').then(res => {
        if (res.code === SUCCESS) {
          this.menuTree = res.payload
          this.depthOneList = res.payload
        }
      })
    },
    getTree () {
      this.loading = true
      this.$http
        .post('/permission/getTree', {
          permissionName: this.searchData.permissionName
        })
        .then(res => {
          this.loading = false
          if (res.code === SUCCESS) {
            this.data = res.payload
          }
        })
    },
    handleDelete (node, data) {
      // if (data.children && data.children.length > 0) {
      //   this.$message.error('当前区域下含有子级数据，无法删除')
      //   return
      // }
      this.$confirm('删除后，该权限将无法恢复，是否确定？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/permission/delete', {
              permissionIds: [data.permissionId]
            })
            .then(res => {
              if (res.code === SUCCESS) {
                this.$message.success('操作成功')
                this.getTree()
              }
            })
        })
        .catch(() => {})
    },

    handleAppend (node, data) {
      this.dialogType = true
      if (data.permissionDepth == 3) {
        this.$http
          .get('/menu/children', {
            url: data.permissionUrl
          })
          .then(res => {
            if (res.code === SUCCESS) {
              this.depthOneList = res.payload
            }
          })
      } else {
        let getMenuList = (name, arr) => {
          for (let i in arr) {
            if (name === arr[i].name) {
              this.depthOneList = arr[i].children
              return
            }
            if (arr[i].children && Array.isArray(arr[i].children)) {
              getMenuList(name, arr[i].children)
            }
          }
        }
        getMenuList(data.permissionName, this.menuTree)
      }
      this.formInfo.permissionId = data.permissionId
      this.dialogFormVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
#space-resource {
  /deep/ .el-dialog__body {
    padding: 15px;
    padding-top: 0;
  }
  .tree-title {
    display: block;
    height: 40px;
    line-height: 40px;
    font-size: 13px;
    font-weight: 700;
    background-color: rgb(241, 241, 241);
    padding: 0px 20px;
    text-align: center;
    .left {
      float: left;
    }
    .right {
      float: right;
    }
  }
  .custom-tree-node {
    padding-right: 20px;
    width: 100%;
  }
  /deep/ .el-tree-node__content {
    height: 40px;
    line-height: 40px;
  }
  .desc {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
.hidden {
  visibility: hidden;
}
</style>
