<!--
 * @Descripttion:新增、编辑活动
 * @Author:
 * @Date: 2019-11-07 18:03:59
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-02-13 11:39:42
 -->
<template>
  <div id="edit-event">
    <div class="title">基本信息</div>
    <el-form
      style="width:700px"
      ref="formInfo"
      :rules="rules"
      :model="formInfo"
      label-width="80px"
      size="medium"
    >
      <el-form-item label="活动名称" prop="activityName">
        <el-input
          placeholder="请输入活动名称，最多不超过50个字"
          show-word-limit
          :maxlength="50"
          v-model="formInfo.activityName"
        ></el-input>
      </el-form-item>
      <el-form-item label="活动封面" prop="activityIndexPic">
        <div style="display:flex;align-items:center;">
          <div v-show="formInfo.activityIndexPic" class="avatars">
            <img
              :src="
                $store.state.config.systemConfig[0].dictionaryValue +
                  formInfo.activityIndexPic
              "
              alt
            />
            <Input
              v-model="
                $store.state.config.systemConfig[0].dictionaryValue +
                  formInfo.activityIndexPic
              "
              style="display:none"
            />
          </div>
          <el-upload
            action="apii/public/img"
            :show-file-list="false"
            :before-upload="uploadImg"
            accept="image/*"
          >
            <el-button type="primary" icon="ios-cloud-upload-outline">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="活动时间" prop="eventTime">
        <el-date-picker
          v-model="formInfo.eventTime"
          @change="handleTime"
          type="datetimerange"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="活动地点" prop="activityAddress">
        <el-input
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5 }"
          placeholder="请输入活动地点，最多不超过68个字"
          v-model="formInfo.activityAddress"
        ></el-input>
      </el-form-item>
      <el-form-item label="活动详情">
        <UEditor v-model="formInfo.activityDesc"></UEditor>
      </el-form-item>
      <div class="title">活动信息</div>
      <el-form-item label="所属机构" prop="orgId">
        <el-cascader
          clearable
          @change="formInfo.orgServiceProviderList = [];formInfo.activityRoomId = '';formInfo.orgServiceProductIdList = []"
          :props="{ value: 'orgId', label: 'orgName', emitPath: false }"
          :options="orgTree"
          v-model="formInfo.orgId"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="活动室" prop="activityRoomId">
        <el-select
          :disabled="formInfo.orgId ? formInfo.orgId.length == 0 : true"
          clearable
          v-model="formInfo.activityRoomId"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in eventRoomList"
            :key="index"
            :label="item.activityRoomName"
            :value="item.activityRoomId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务产品" prop="orgServiceProductIdList">
        <el-select
          clearable
          :disabled="formInfo.orgId ? formInfo.orgId.length == 0 : true"
          multiple
          collapse-tags
          v-model="formInfo.orgServiceProductIdList"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in productList"
            :key="index"
            :label="item.orgServiceProductName"
            :value="item.orgServiceProductId"
          ></el-option>
        </el-select>
        <!-- <el-select clearable v-model="formInfo.serviceProductId" placeholder="请选择"></el-select> -->
      </el-form-item>
      <el-form-item label="服务人员" prop="orgServiceProviderList">
        <el-button
          :disabled="formInfo.orgId ? formInfo.orgId.length == 0 : true"
          @click="dialogServiceUser = true"
          icon="el-icon-plus"
        >选择人员</el-button>
        <el-card style="margin-top:10px;" shadow="never">
          <el-tag
            style="margin-right:10px"
            @close="formInfo.orgServiceProviderList.splice(index, 1)"
            v-for="(item, index) in formInfo.orgServiceProviderList"
            :key="index"
            closable
          >
            <el-avatar
              :size="22"
              style="vertical-align: middle;margin-right:5px"
              :src="$store.state.config.systemConfig[0].dictionaryValue+item.indexPic"
            ></el-avatar>
            <span style="vertical-align: middle;">{{ item.orgServiceProviderName }}</span>
          </el-tag>
        </el-card>
      </el-form-item>
      <el-form-item label="参加对象" prop="Object">
        <el-button @click="dialogServiceObject = true" icon="el-icon-plus">选择人员</el-button>
        <el-card style="margin-top:10px;" shadow="never">
          <el-tag
            style="margin-right:10px"
            @close="formInfo.serviceCustomerList.splice(index, 1)"
            v-for="(item, index) in formInfo.serviceCustomerList"
            :key="index"
            closable
          >
            <el-avatar
              :size="22"
              style="vertical-align: middle;margin-right:5px"
              :src="$store.state.config.systemConfig[0].dictionaryValue+item.avatar"
            ></el-avatar>
            <span style="vertical-align: middle;">{{ item.serviceCustomerName }}</span>
          </el-tag>
        </el-card>
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
      title="选择服务对象"
      :visible.sync="dialogServiceObject"
    >
      <!-- :isSelected="formInfo.serviceCustomerList" -->

      <selectServiceObject :isSelected="formInfo.serviceCustomerList" @selectObject="selectObject"></selectServiceObject>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            dialogServiceObject = false;
            selectObjectList = [];
          "
        >取 消</el-button>
        <el-button type="primary" @click="handleSaveSelectObject">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      width="60%"
      destroy-on-close
      lock-scroll
      title="选择服务人员"
      :visible.sync="dialogServiceUser"
    >
      <!-- :isSelected="formInfo.orgServiceProviderList" -->

      <selectServiceUser
        :isSelected="formInfo.orgServiceProviderList"
        @selectUser="selectUser"
        :orgId="formInfo.orgId"
      ></selectServiceUser>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            dialogServiceUser = false;
            selectUserList = [];
          "
        >取 消</el-button>
        <el-button type="primary" @click="handleSaveSelectUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import selectServiceObject from '../../../components/SelectTable/selectServiceObject.vue'
import selectServiceUser from '../../../components/SelectTable/selectServiceUser.vue'

export default {
  name: 'eventCenterEdit',
  components: {
    selectServiceObject,
    selectServiceUser
  },
  data () {
    return {
      formInfo: {
        orgId: [],
        eventTime: [],
        activityRoomId: '',
        activityIndexPic: '',
        activityName: '',
        activityAddress: '',
        orgServiceProductIdList: [],
        orgServiceProviderList: [],
        serviceCustomerList: [],
        startTime: '',
        endTime: ''
      },
      rules: {
        activityName: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        eventTime: [
          { required: true, message: '请选择活动时间', trigger: 'change' }
        ],
        activityAddress: [
          { required: true, message: '请输入活动地点', trigger: 'change' }
        ],
        activityIndexPic: [
          { required: true, message: '请上传活动封面', trigger: 'change' }
        ],
        orgId: [
          { required: true, message: '请选择所属机构', trigger: 'change' }
        ],
        activityRoomId: [
          { required: true, message: '请选择活动室', trigger: 'change' }
        ],
        orgServiceProductIdList: [
          { required: true, message: '请选择服务产品', trigger: 'change' }
        ],
        orgServiceProviderList: [
          {
            required: true,
            message: '请选择服务人员',
            trigger: 'change'
          }
        ]
      },
      dialogServiceObject: false,
      dialogServiceUser: false,
      eventRoomList: [],
      orgTree: [],
      productList: [],
      selectUserList: [],
      selectObjectList: []
    }
  },
  created () {
    // if (this.$route.query.aid) {
    //   this.getActivityInfo()
    // }
    this.getEventRoomList()
    this.getOrgList()
    this.getProductList()
  },
  methods: {
    handleTime (date) {
      this.formInfo.startTime = date ? date[0] : ''
      this.formInfo.endTime = date ? date[1] : ''
    },
    arrSplice (arr, index) {
      arr.splice(index, 1)
      console.log(this.formInfo)
    },
    /**
     * @descripttion: 选择服务对象
     * @param {type}
     * @return:
     */
    selectObject (data) {
      this.selectObjectList = data
    },
    handleSaveSelectObject () {
      if (this.selectObjectList.length === 0) {
        this.$message.error('请至少选择一个服务对象')
        return false
      }
      this.formInfo.serviceCustomerList = this.formInfo.serviceCustomerList.concat(
        this.selectObjectList
      )
      let obj = {}
      this.formInfo.serviceCustomerList = this.formInfo.serviceCustomerList.reduce(
        (cur, next) => {
          obj[next.serviceCustomerId]
            ? ''
            : (obj[next.serviceCustomerId] = true && cur.push(next))
          return cur
        },
        []
      )
      this.selectObjectList = []
      this.dialogServiceObject = false
    },
    /**
     * @descripttion: 选择服务人员
     * @param {type}
     * @return:
     */
    selectUser (data) {
      this.selectUserList = data
    },
    handleSaveSelectUser () {
      if (this.selectUserList.length === 0) {
        this.$message.error('请至少选择一个服务人员')
        return false
      }
      this.formInfo.orgServiceProviderList = this.formInfo.orgServiceProviderList.concat(
        this.selectUserList
      )
      let obj = {}
      this.formInfo.orgServiceProviderList = this.formInfo.orgServiceProviderList.reduce(
        (cur, next) => {
          obj[next.orgServiceProviderId]
            ? ''
            : (obj[next.orgServiceProviderId] = true && cur.push(next))
          return cur
        },
        []
      )
      this.selectUserList = []
      this.dialogServiceUser = false
    },
    getProductList () {
      this.$http
        .post('/org/service/product/pageSearch', {
          pageSize: MAXSIZE,
          orgId: this.formInfo.orgId[this.formInfo.orgId.length - 1]
        })
        .then(res => {
          this.productList = res.payload.records
        })
    },
    getOrgList () {
      this.$http.post('/org/tree').then(res => {
        if (this.$route.query.aid) {
          this.getActivityInfo()
        }
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
    getEventRoomList () {
      this.$http
        .post('/activity/room/pageSearch', { pageSize: 99999 })
        .then(res => {
          this.eventRoomList = res.payload.records
        })
    },
    getActivityInfo () {
      this.$http
        .get('/activity/get?activityId=' + this.$route.query.aid)
        .then(res => {
          if (res.code === SUCCESS) {
            this.formInfo = res.payload
            this.formInfo.orgServiceProviderList = this.formInfo
              .orgServiceProviderList
              ? this.formInfo.orgServiceProviderList
              : []
            this.formInfo.serviceCustomerList = this.formInfo
              .serviceCustomerList
              ? this.formInfo.serviceCustomerList
              : []
            // if (Array.isArray(this.orgTree)) {
            //   this.orgTree.forEach(i => {
            //     if (Array.isArray(i.children)) {
            //       i.children.forEach(j => {
            //         if (j.orgId === this.formInfo.orgId) {
            //           this.$set(this.formInfo, 'orgId', [
            //             j.parentOrgId,
            //             j.orgId
            //           ])
            //         }
            //       })
            //     }
            //   })
            // }
            console.log(this.formInfo.orgId)
            this.$set(this.formInfo, 'eventTime', [
              res.payload.startTime,
              res.payload.endTime
            ])
          }
        })
    },
    // 保存按钮
    handleSave () {
      this.$refs['formInfo'].validate(valid => {
        if (!valid) return
        let provider = []
        let proObject = []
        this.formInfo.serviceCustomerList.forEach(i => {
          proObject.push(i.serviceCustomerId)
        })
        this.formInfo.orgServiceProviderList.forEach(i => {
          provider.push(i.orgServiceProviderId)
        })
        this.formInfo.orgServiceProviderIdList = provider
        this.formInfo.serviceCustomerIdList = proObject
        let form = JSON.parse(JSON.stringify(this.formInfo))
        if (this.$route.query.aid) {
          this.$http.post('/activity/update', form).then(res => {
            if (res.code === SUCCESS) {
              this.$message.success('操作成功')
              this.$router.go(-1)
            }
          })
        } else {
          this.$http.post('/activity/add', form).then(res => {
            if (res.code === SUCCESS) {
              this.$message.success('操作成功')
              this.$router.go(-1)
            }
          })
        }
      })
    },
    uploadImg (file) {
      let formdata = new FormData()
      formdata.append('file', file)
      this.$http.postForm('/file/upload', formdata).then(res => {
        if (res.code === SUCCESS) {
          this.formInfo.activityIndexPic = res.payload
        }
      })
      return false
    }
  }
}
</script>
<style lang="scss">
/deep/ .el-cascader-node__prefix {
  top: 10px !important;
}
</style>
