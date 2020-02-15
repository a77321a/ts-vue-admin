<!--
 * @Descripttion:新增、编辑角色
 * @Author:
 * @Date: 2019-11-07 18:03:59
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2019-12-30 17:22:33
 -->
<template>
  <div id="edit-role">
    <div class="title">基本信息</div>
    <el-form
      style="width:700px"
      :rules="rules"
      ref="formInfo"
      :model="formInfo"
      label-width="80px"
      size="medium"
    >
      <el-form-item label="名称" prop="roleName">
        <el-input
          maxlength="10"
          show-word-limit
          placeholder="请输入角色名称，最多不超过10个字"
          v-model="formInfo.roleName"
        ></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input
          maxlength="50"
          show-word-limit
          placeholder="请输入角色描述，最多不超过50个字"
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5}"
          v-model="formInfo.roleDesc"
        ></el-input>
      </el-form-item>

      <div class="title">
        设置权限
        <el-checkbox style="float:right" v-model="checkAll">全选</el-checkbox>
      </div>
      <el-tree
        v-loading="loading"
        ref="permissionTree"
        style="margin:20px;"
        :default-checked-keys="defaultKey"
        show-checkbox
        :data="data"
        node-key="permissionId"
        default-expand-all
      >
        <div class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ data.permissionName }}</span>
          <span style="margin-left:10px" v-if="data.permissionDepth == 3">
            <el-checkbox-group style="display:inline-block" v-model="checkButtonList">
              <el-checkbox
                v-for="(item, index) in data.child"
                :key="index"
                :label="item.permissionId"
              >{{item.permissionName}}</el-checkbox>
            </el-checkbox-group>
          </span>
        </div>
        <!-- <div class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ data.permissionName }}</span>
        </div>-->
      </el-tree>
      <el-divider></el-divider>
      <el-form-item size="large">
        <el-button @click="handleSave" type="primary">立即创建</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  name: 'editRole',
  data () {
    return {
      checkAll: false,
      formInfo: {
        roleName: '',
        roleDesc: '',
        permissionIds: []
      },
      checkButtonList: [],
      defaultKey: [],
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请选择角色描述', trigger: 'blur' }
        ]
      },
      data: [],
      loading: false,
      allBtnList: []
    }
  },
  created () {
    this.getTree()
  },
  watch: {
    checkAll (val) {
      if (val) {
        let arr = []
        this.data.forEach(i => {
          arr.push(i.permissionId)
        })
        this.checkButtonList = this.allBtnList
        this.defaultKey = arr
      } else {
        console.log(val)
        this.defaultKey.length = []
        this.$refs.permissionTree.setCheckedKeys([])
        this.checkButtonList = []
      }
    }
  },
  methods: {
    getTree () {
      this.loading = true
      this.$http.post('/permission/getTree', {}).then(res => {
        if (res.code === SUCCESS) {
          this.data = res.payload
          this.allBtnList = []

          for (let i = 0; i < this.data.length; i++) {
            if (this.data[i].permissionUrl == 'Home') {
            } else if (Array.isArray(this.data[i].children)) {
              for (let j = 0; j < this.data[i].children.length; j++) {
                if (Array.isArray(this.data[i].children[j].children)) {
                  for (
                    let n = 0;
                    n < this.data[i].children[j].children.length;
                    n++
                  ) {
                    if (
                      this.data[i].children[j].children[n].permissionDepth == 3
                    ) {
                      this.data[i].children[j].children[n].child = this.data[
                        i
                      ].children[j].children[n].children
                      this.data[i].children[j].children[n].children.forEach(
                        item => {
                          this.allBtnList.push(item.permissionId)
                        }
                      )
                      delete this.data[i].children[j].children[n].children
                    }
                  }
                }
              }
            }
          }
        }
        this.loading = false
        if (this.$route.query.id) {
          this.getRoleInfo()
        }
      })
    },
    getRoleInfo () {
      this.$http.get('/role/edit?roleId=' + this.$route.query.id).then(res => {
        if (res.code === SUCCESS) {
          this.formInfo = res.payload
          let checked = (data, key, newArr) => {
            data.forEach(i => {
              if (i.permissionId === key) {
                if (i.permissionUrl == 'Home') {
                  newArr.push(i.permissionId)
                }
                if (i.permissionDepth == 3) {
                  newArr.push(i.permissionId)
                }
              } else {
                if (i.children && i.children.length !== 0) {
                  checked(i.children, key, newArr)
                }
              }
            })
          }
          let arr = []
          this.formInfo.permissionsList.forEach(i => {
            checked(this.data, i.permissionId, arr)
            if (i.permissionDepth == 4) {
              this.checkButtonList.push(i.permissionId)
            }
          })
          this.defaultKey = arr
          delete this.formInfo.isVisible
          delete this.formInfo.createTime
          delete this.formInfo.updateTime
          delete this.formInfo.permissionsList
          delete this.formInfo.userList
        }
      })
    },
    uploadImg (file) {
      let formdata = new FormData()
      formdata.append('file', this.file)
      this.$http.postForm('', formdata).then(res => {
        if (res.code === 200) {
          this.formInfo.cover = res.data.path
        }
      })
      return false
    },
    handleSave () {
      let nodeList = this.$refs['permissionTree'].getCheckedNodes(false, true)
      let nodeKey = []
      console.log(nodeList)
      nodeList.forEach(i => {
        nodeKey.push(i.permissionId)
      })
      nodeKey = [...new Set(nodeKey.concat(this.checkButtonList))]
      this.formInfo.permissionIds = nodeKey
      this.$refs['formInfo'].validate(valid => {
        if (!valid) return
        if (this.$route.query.id) {
          this.$http.post('/role/update', this.formInfo).then(res => {
            if (res.code === SUCCESS) {
              this.$message.success('操作成功')
              this.$router.go(-1)
            }
          })
        } else {
          this.$http.post('/role/add', this.formInfo).then(res => {
            if (res.code === SUCCESS) {
              this.$message.success('操作成功')
              this.$router.go(-1)
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
#edit-role {
  .custom-tree-node {
    padding-right: 20px;
    // min-height: 40px !important;
    width: 100%;
  }
  /deep/ .el-tree-node__content {
    height: 40px !important;
    line-height: 40px;
  }
}
</style>
