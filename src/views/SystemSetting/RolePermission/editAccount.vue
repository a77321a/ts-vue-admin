<!--
 * @Descripttion:新增、编辑角色
 * @Author:
 * @Date: 2019-11-07 18:03:59
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-16 10:17:03
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
      <el-form-item label="人员类型">
        <el-radio-group
          @change="formInfo.account = '';formInfo.mobile='';formInfo.nickName= ''"
          v-model="formInfo.accountType"
        >
          <el-radio-button style="box-shadow: none;" :label="1">内部服务人员</el-radio-button>
          <el-radio-button style="box-shadow: none;" :label="2">外部人员</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input
          :disabled="formInfo.accountType == 1"
          style="width:300px;margin-right:10px"
          maxlength="10"
          show-word-limit
          placeholder="请输入用户昵称，最多不超过10个字"
          v-model="formInfo.nickName"
        ></el-input>
        <el-button
          v-if="formInfo.accountType == 1"
          size="small"
          @click="dialogServiceObject = true"
          icon="el-icon-plus"
        >选择人员</el-button>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input
          :disabled="formInfo.accountType == 1"
          maxlength="11"
          show-word-limit
          placeholder="请输入手机号，可用于登录管理平台"
          type="text"
          v-model="formInfo.mobile"
        ></el-input>
      </el-form-item>
      <el-form-item label="登录密码" :prop="$route.query.uid ? '':'password'">
        <el-input type="text" placeholder="请输入密码" v-model="formInfo.password"></el-input>
      </el-form-item>
      <div class="title">资源设置</div>
      <el-form-item label="管理范围" required>
        <el-radio-group v-model="formInfo.limit">
          <div class="vert-radio">
            <el-radio :label="1">超级管理员</el-radio>
            <el-input style="visibility:hidden;width:70px;"></el-input>
          </div>
          <div class="vert-radio">
            <el-radio :label="2">社区</el-radio>
            <el-cascader
              style="vertical-align:sub"
              v-if="formInfo.limit == 2"
              clearable
              :props="{value:'regionId',label:'addressName',}"
              :options="spaceTree"
              v-model="formInfo.addressList"
            ></el-cascader>
          </div>
          <div class="vert-radio">
            <el-radio :label="3">机构</el-radio>
            <el-cascader
              style="vertical-align:sub;width:300px"
              v-if="formInfo.limit == 3"
              clearable
              collapse-tags
              :props="{value:'orgId',label:'orgName',multiple:true}"
              :options="orgList"
              v-model="formInfo.orgIds"
            ></el-cascader>
            <!-- <el-select
              v-if="formInfo.limit == 3"
              clearable
              multiple
              collapse-tags
              v-model="formInfo.orgIds"
              placeholder="请选择"
            >
              <el-option
                v-for="(item, index) in orgList"
                :key="index"
                :label="item.orgName"
                :value="item.orgId"
              ></el-option>
            </el-select>-->
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="formInfo.limit !== 1" label="角色" prop="roleIds">
        <el-checkbox-group v-model="formInfo.roleIds">
          <el-checkbox
            v-for="(item, index) in roleList"
            :key="index"
            :label="item.roleId"
          >{{item.roleName}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-divider></el-divider>
      <el-form-item size="large">
        <el-button @click="handleSave" type="primary">立即创建</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      width="60%"
      lock-scroll
      destroy-on-close
      title="选择内部服务人员"
      :visible.sync="dialogServiceObject"
    >
      <selectServiceUser :single="true" @selectObject="selectObject"></selectServiceUser>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogServiceObject = false;checkedObject={}">取 消</el-button>
        <el-button type="primary" @click="handleSaveSelectObject">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import selectServiceUser from '../../../components/SelectTable/selectServiceUser.vue'

export default {
  name: 'eventCenterEdit',
  components: {
    selectServiceUser
  },
  data () {
    const validataPhone = (rule, value, callback) => {
      let reg = /^1[123456789]\d{9}$/
      console.log(value)
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!reg.test(value)) {
        callback(new Error('手机格式不正确'))
      } else {
        callback()
      }
    }
    return {
      dialogServiceObject: false,
      formInfo: {
        account: '',
        accountType: 1,
        limit: 1,
        roleIds: [],
        nickName: '',
        mobile: ''
      },
      roleList: [],
      rules: {
        nickName: [
          { required: true, message: '请输入账号昵称', trigger: 'blur' }
        ],
        mobile: [
          { required: true, validator: validataPhone, trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入账号密码', trigger: 'blur' }
        ],
        roleIds: [{ required: true, message: '请选择角色', trigger: 'change' }]
      },
      spaceTree: [],
      orgList: [],
      templateObj: {}
    }
  },
  created () {
    if (this.$route.query.uid) {
      this.getAccountInfo()
    }
    this.getTree()
    this.getOrg()
    this.getRole()
  },
  methods: {
    getOrg () {
      // this.$http
      //   .post('/org/tree', { pageSize: MAXSIZE, level: 2 })
      //   .then(res => {
      //     if (res.code === SUCCESS) {
      //       this.orgList = res.payload.records
      //     }
      //   })
      this.$http.post('/org/tree').then(res => {
        if (res.code === SUCCESS) {
          let arr = res.payload
          arr.forEach(i => {
            if (i.children.length > 0) {
              this.orgList.push(i)
            }
          })
          this.orgList.forEach(i => {
            if (i.children.length > 0) {
              i.children.forEach(j => {
                delete j.children
              })
            }
          })
          console.log(this.orgList)
        }
      })
    },
    getRole () {
      this.$http.post('/role/pageSearch', { pageSize: MAXSIZE }).then(res => {
        if (res.code === SUCCESS) {
          this.roleList = res.payload.records
        }
      })
    },
    /**
     * @descripttion: 选择服务对象
     * @param {type}
     * @return:
     */
    selectObject (data) {
      this.templateObj = data
    },
    handleSaveSelectObject () {
      if (!this.templateObj.orgServiceProviderId) {
        this.$message.error('请选择一条记录')
        return
      }
      // this.formInfo.account = this.templateObj.orgServiceProviderId
      this.$set(this.formInfo, 'account', this.templateObj.orgServiceProviderId)
      this.$set(
        this.formInfo,
        'nickName',
        this.templateObj.orgServiceProviderName
      )
      this.$set(this.formInfo, 'mobile', this.templateObj.telephoneNum)
      // this.formInfo.nickName = this.templateObj.orgServiceProviderName
      // this.formInfo.mobile = this.templateObj.telephoneNum
      this.dialogServiceObject = false
    },
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
    getTree () {
      this.$http.post('/address/tree').then(res => {
        if (res.code === SUCCESS) {
          this.spaceTree = res.payload
          for (let i in this.spaceTree) {
            if (this.spaceTree[i].depth == 0) {
              this.spaceTree.splice(i, 1)
            }
          }
        }
      })
    },
    getAccountInfo () {
      this.$http.get('/user/get?userId=' + this.$route.query.uid).then(res => {
        if (res.code === SUCCESS) {
          this.formInfo = res.payload
          this.formInfo.password = ''
          if (res.payload.scopeDepth) {
            this.$set(
              this.formInfo,
              'addressList',
              res.payload.scopeDepth.split('-')
            )
          }
          if (res.payload.orgEntities && res.payload.orgEntities.length > 0) {
            let orgIds = []
            res.payload.orgEntities.forEach(i => {
              orgIds.push([i.parentOrgId, i.orgId])
            })
            this.$set(this.formInfo, 'orgIds', orgIds)
          }
          this.$set(this.formInfo, 'roleIds', [])
          if (
            res.payload.roleInfo.roleList &&
            res.payload.roleInfo.roleList.length > 0
          ) {
            res.payload.roleInfo.roleList.forEach(i => {
              this.formInfo.roleIds.push(i.roleId)
            })
          }
          this.$set(
            this.formInfo,
            'limit',
            res.payload.superAdmin ? 1 : res.payload.orgIds ? 3 : 2
          )
        }
      })
    },
    handleSave () {
      let orgIds = []
      if (this.formInfo.limit === 3) {
        for (let i = 0; i < this.formInfo.orgIds.length; i++) {
          orgIds.push(this.formInfo.orgIds[i][0])
          orgIds.push(this.formInfo.orgIds[i][1])
        }
      }
      orgIds = [...new Set(orgIds)]
      this.$refs['formInfo'].validate(valid => {
        if (!valid) return
        let url = this.$route.query.uid ? '/user/update' : '/user/add'
        this.$http
          .post(url, {
            userId: this.$route.query.uid,
            account: this.formInfo.account,
            accountType: this.formInfo.accountType,
            mobile: this.formInfo.mobile,
            nickName: this.formInfo.nickName,
            orgIds: this.formInfo.limit === 3 ? orgIds : null,
            password: this.formInfo.password,
            roleIds: this.formInfo.roleIds,
            scopeDepth:
              this.formInfo.limit === 2
                ? this.formInfo.addressList.join('-')
                : null,
            superAdmin: this.formInfo.limit === 1,
            userStatus: 1
          })
          .then(res => {
            if (res.code === SUCCESS) {
              this.$message.success('操作成功')
              this.$router.go(-1)
            }
          })
      })
    }
  }
}
</script>
<style lang="scss">
#edit-role {
  .vert-radio {
    height: 45px;
    line-height: 45px;
  }
}
</style>
