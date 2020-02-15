<!--
 * @Descripttion:活动总结
 * @Author:
 * @Date: 2019-11-07 18:03:59
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-16 14:05:35
 -->
<template>
  <div id="edit-event">
    <div class="title">基本信息</div>
    <el-form
      style="width:700px"
      ref="formInfo"
      :rules="rules"
      :model="formInfo"
      label-width="120px"
      size="medium"
    >
      <el-form-item label="活动名称：" prop="activityName">
        <span>{{ formInfo.activityName }}</span>
      </el-form-item>
      <el-form-item label="活动封面：" prop="activityIndexPic">
        <div style="display:flex;align-items:center;">
          <div v-show="formInfo.activityIndexPic" class="avatars">
            <img
              :src="
                $store.state.config.systemConfig[0].dictionaryValue +
                  formInfo.activityIndexPic
              "
              alt
            />
          </div>
        </div>
      </el-form-item>
      <el-form-item label="活动时间：" prop="eventTime">
        <span>{{ formInfo.eventTime.join("~") }}</span>
      </el-form-item>
      <el-form-item label="活动地点：" prop="activityAddress">
        <span>{{ formInfo.activityAddress }}</span>
      </el-form-item>
      <el-form-item label="活动详情：">
        <span v-html="formInfo.activityDesc"></span>
      </el-form-item>
      <el-form-item label="所属机构：" prop="orgId">
        <span>{{ formInfo.orgName }}</span>
      </el-form-item>
      <el-form-item label="活动室：" prop="activityRoomId">
        <span>{{ formInfo.activityRoomName }}</span>
      </el-form-item>
      <el-form-item label="服务产品：" prop="orgServiceProductIdList">
        <span v-for="(item, index) in formInfo.orgServiceProductList" :key="index">
          {{ item.orgServiceProductName }}
          <span
            v-if="index != formInfo.orgServiceProductList.length - 1"
          >、</span>
        </span>
      </el-form-item>
      <div class="title">活动总结</div>
      <el-form-item label="服务人员" prop="actualOrgServiceProviderList">
        <el-button
          :disabled="formInfo.orgId ? formInfo.orgId.length == 0 : true"
          @click="dialogServiceUser = true"
          icon="el-icon-plus"
        >选择人员</el-button>
      </el-form-item>
      <el-form-item label="实际服务人员">
        <template slot="label">
          <span style="color:#999">实际服务人员</span>
        </template>
        <el-card style="margin-top:10px;" shadow="never">
          <el-tag
            style="margin-right:10px"
            @close="formInfo.actualOrgServiceProviderList.splice(index, 1)"
            v-for="(item, index) in formInfo.actualOrgServiceProviderList"
            :key="index"
            closable
          >
            <el-avatar
              :size="22"
              style="vertical-align: middle;margin-right:5px"
              :src="$store.state.config.systemConfig[0].dictionaryValue+item.indexPic"
            ></el-avatar>
            <span style="vertical-align: middle;">
              {{
              item.orgServiceProviderName
              }}
            </span>
          </el-tag>
        </el-card>
      </el-form-item>
      <el-form-item label="参加对象" prop="actualServiceCustomerList">
        <el-button @click="dialogServiceObject = true" icon="el-icon-plus">选择人员</el-button>
      </el-form-item>
      <el-form-item label="实际参与对象">
        <template slot="label">
          <span style="color:#999">实际参与对象</span>
        </template>
        <el-card style="margin-top:10px;" shadow="never">
          <el-tag
            style="margin-right:10px"
            @close="formInfo.actualServiceCustomerList.splice(index, 1)"
            v-for="(item, index) in formInfo.actualServiceCustomerList"
            :key="index"
            closable
          >
            <el-avatar
              :size="22"
              style="vertical-align: middle;margin-right:5px"
              :src="$store.state.config.systemConfig[0].dictionaryValue+item.avatar"
            ></el-avatar>
            <span style="vertical-align: middle;">
              {{
              item.serviceCustomerName
              }}
            </span>
          </el-tag>
        </el-card>
      </el-form-item>
      <el-form-item label="活动照片">
        <div>
          <div
            style="position:relative"
            v-for="(item, index) in formInfo.activityPicList"
            :key="index"
            v-show="formInfo.activityPicList.length > 0"
            class="avatars"
          >
            <i size="24" @click="handleRemove(index)" class="el-icon-circle-close delete-img"></i>
            <img :src="$store.state.config.systemConfig[0].dictionaryValue + item" alt />
          </div>
          <el-upload
            multiple
            action="apii/public/img"
            :show-file-list="false"
            :before-upload="uploadImg"
            accept="image/*"
          >
            <el-button
              v-if="formInfo.activityPicList.length < 9"
              type="primary"
              icon="ios-cloud-upload-outline"
            >选择文件</el-button>
            <div slot="tip" class="el-upload__tip">支持PNG、JPG、GIF、JPEG格式，小于5M，最多可添加9张</div>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="活动内容总结" prop="activitySummary">
        <UEditor v-model="formInfo.activitySummary"></UEditor>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item size="large">
        <el-button @click="handleSave" type="primary">保存</el-button>
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
      <selectServiceObject
        :isSelected="formInfo.actualServiceCustomerList"
        @selectObject="selectObject"
      ></selectServiceObject>
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
      <selectServiceUser
        :isSelected="formInfo.actualOrgServiceProviderList"
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
        actualServiceCustomerList: [],
        activityPicList: []
      },
      rules: {
        activitySummary: [
          { required: true, message: '请输入活动总结', trigger: 'blur' }
        ],
        activityPicList: [
          { required: true, message: '请上传活动图片', trigger: 'change' }
        ],
        actualServiceCustomerList: [
          {
            required: true,
            message: '请选择实际参加人员',
            trigger: 'change'
          }
        ],
        actualOrgServiceProviderList: [
          {
            required: true,
            message: '请选择实际服务人员',
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
      this.formInfo.actualServiceCustomerList = this.formInfo.actualServiceCustomerList.concat(
        this.selectObjectList
      )
      let obj = {}
      this.formInfo.actualServiceCustomerList = this.formInfo.actualServiceCustomerList.reduce(
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
      console.log(this.selectUserList)
      this.formInfo.actualOrgServiceProviderList = this.formInfo.actualOrgServiceProviderList.concat(
        this.selectUserList
      )
      let obj = {}
      this.formInfo.actualOrgServiceProviderList = this.formInfo.actualOrgServiceProviderList.reduce(
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
            this.formInfo.actualOrgServiceProviderList = this.formInfo
              .actualOrgServiceProviderList
              ? this.formInfo.actualOrgServiceProviderList
              : []
            this.formInfo.actualServiceCustomerList = this.formInfo
              .actualServiceCustomerList
              ? this.formInfo.actualServiceCustomerList
              : []
            this.formInfo.serviceCustomerList = this.formInfo
              .serviceCustomerList
              ? this.formInfo.serviceCustomerList
              : []
            this.formInfo.activityPicList = this.formInfo.activityPicList
              ? this.formInfo.activityPicList
              : []

            if (Array.isArray(this.orgTree)) {
              this.orgTree.forEach(i => {
                if (Array.isArray(i.children)) {
                  i.children.forEach(j => {
                    if (j.orgId === this.formInfo.orgId) {
                      this.$set(this.formInfo, 'orgId', [
                        j.parentOrgId,
                        j.orgId
                      ])
                    }
                  })
                }
              })
            }
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
        this.formInfo.actualServiceCustomerList.forEach(i => {
          proObject.push(i.serviceCustomerId)
        })
        this.formInfo.actualOrgServiceProviderList.forEach(i => {
          provider.push(i.orgServiceProviderId)
        })
        this.formInfo.actualOrgServiceProviderIdList = provider
        this.formInfo.actualServiceCustomerIdList = proObject
        let form = JSON.parse(JSON.stringify(this.formInfo))
        form.orgId = this.formInfo.orgId[this.formInfo.orgId.length - 1]
        if (this.$route.query.aid) {
          this.$http
            .post('/activity/summary', {
              activityId: this.$route.query.aid,
              activityPicList: this.formInfo.activityPicList,
              activitySummary: this.formInfo.activitySummary,
              actualOrgServiceProviderIdList: this.formInfo
                .actualOrgServiceProviderIdList,
              actualServiceCustomerIdList: this.formInfo
                .actualServiceCustomerIdList
            })
            .then(res => {
              if (res.code === SUCCESS) {
                this.$message.success('操作成功')
                this.$router.go(-1)
              }
            })
        } else {
          this.$http.post('/activity/summary', form).then(res => {
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
          this.formInfo.activityPicList.push(res.payload)
          if (this.formInfo.activityPicList.length > 9) {
            this.formInfo.activityPicList = this.formInfo.activityPicList.splice(
              0,
              9
            )
          }
        }
      })
      return false
    },
    handleRemove (index) {
      this.formInfo.activityPicList.splice(index, 1)
    }
  }
}
</script>
<style lang="scss">
/deep/ .el-cascader-node__prefix {
  top: 10px !important;
}
.delete-img {
  display: none;
  cursor: pointer;
  position: absolute;
  font-size: 18px;
  right: -8px;
  top: -8px;
}
</style>
