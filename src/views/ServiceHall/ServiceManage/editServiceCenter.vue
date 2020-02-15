<!--
 * @Descripttion:新增、编辑服务人员
 * @Author:
 * @Date: 2019-11-11 16:49:56
 * @LastEditors:
 * @LastEditTime: 2019-12-15 15:20:44
 -->
<template>
  <div id="editServiceCenter">
    <div class="title">基本信息</div>
    <el-form
      style="width:700px"
      ref="formInfo"
      :rules="rules"
      :model="formInfo"
      label-width="80px"
      size="medium"
    >
      <el-form-item label="服务标题" prop="serviceRecordName">
        <el-input
          show-word-limit
          placeholder="请输入服务标题，最多不超过10个字"
          :maxlength="10"
          v-model="formInfo.serviceRecordName"
        ></el-input>
      </el-form-item>
      <el-form-item label="图片" prop="serviceRecordPicList">
        <div>
          <div
            style="position:relative"
            v-for="(item, index) in formInfo.serviceRecordPicList"
            :key="index"
            v-show="formInfo.serviceRecordPicList.length > 0"
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
              v-if="formInfo.serviceRecordPicList.length < 9"
              type="primary"
              icon="ios-cloud-upload-outline"
            >选择文件</el-button>
            <div slot="tip" class="el-upload__tip">支持PNG、JPG、GIF、JPEG格式，小于5M，最多可添加9张</div>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="服务时间" prop="serviceTime">
        <el-date-picker
          v-model="formInfo.serviceTime"
          type="datetimerange"
          range-separator="至"
          @change="selectTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="服务内容" prop="serviceContent">
        <UEditor v-model="formInfo.serviceContent"></UEditor>
      </el-form-item>
      <div class="title">服务信息</div>
      <el-form-item label="所属机构" prop="orgId">
        <el-cascader
          clearable
          :props="{ value: 'orgId', label: 'orgName', emitPath: false }"
          :options="orgList"
          v-model="formInfo.orgId"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="活动室" prop="activityRoomId">
        <el-select clearable v-model="formInfo.activityRoomId" placeholder="请选择">
          <el-option
            v-for="(item, index) in eventRoomList"
            :key="index"
            :label="item.activityRoomName"
            :value="item.activityRoomId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务对象" prop="serviceCustomerList">
        <el-button @click="dialogServiceObject = true" icon="el-icon-plus">选择人员</el-button>
        <el-card style="margin-top:10px;" shadow="never">
          <el-tag
            style="margin-right:10px"
            disable-transitions
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
            <span style="vertical-align: middle;">
              {{
              item.serviceCustomerName
              }}
            </span>
          </el-tag>
        </el-card>
      </el-form-item>
      <el-form-item label="服务总结" prop="serviceSummary">
        <el-input
          type="textarea"
          :maxlength="1000"
          placeholder="请输入服务总结，最多不超过1000个字"
          :autosize="{ minRows: 5, maxRows: 10 }"
          show-word-limit
          v-model="formInfo.serviceSummary"
        ></el-input>
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
  </div>
</template>
<script>
import selectServiceObject from '../../../components/SelectTable/selectServiceObject.vue'

export default {
  name: 'editServiceCenter',
  components: { selectServiceObject },
  data () {
    return {
      formInfo: {
        activityRoomId: '',
        endTime: '',
        orgId: [],
        serviceContent: '',
        serviceCustomerIdList: [],
        serviceRecordName: '',
        serviceRecordPicList: [],
        serviceCustomerList: [],
        serviceSummary: '',
        startTime: '',
        serviceTime: []
      },
      dialogServiceObject: false,
      rules: {
        serviceRecordName: [
          { required: true, message: '请输入服务名称', trigger: 'blur' }
        ],
        orgId: [
          { required: true, message: '请选择服务机构', trigger: 'change' }
        ],
        serviceRecordPicList: [
          {
            required: true,
            message: '请上次服务图片',
            trigger: 'change',
            type: 'array'
          }
        ],
        activityRoomId: [
          { required: true, message: '请选择活动室', trigger: 'change' }
        ],
        serviceSummary: [
          { required: true, message: '请输入服务总结', trigger: 'blur' }
        ],
        serviceCustomerList: [
          { required: true, message: '请选择服务对象', trigger: 'change' }
        ],
        serviceTime: [
          { required: true, message: '请选择服务时间', trigger: 'change' }
        ]
      },
      orgList: [],
      eventRoomList: [],
      tempObjectList: [],
      selectObjectList: []
    }
  },
  created () {
    if (this.$route.query.sid) {
      this.getServiceInfo()
    }
    this.getEventRoomList()
    this.getOrgList()
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
      this.formInfo.serviceCustomerList = this.formInfo.serviceCustomerList.concat(
        this.selectObjectList
      )
      this.selectObjectList = []
      this.dialogServiceObject = false
    },
    selectTime (date) {
      this.formInfo.startTime = date ? date[0] : ''
      this.formInfo.endTime = date ? date[1] : ''
    },
    getOrgList () {
      this.$http.post('/org/tree').then(res => {
        if (res.code === SUCCESS) {
          this.orgList = res.payload
          this.orgList.forEach(i => {
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
    /**
     * @descripttion: 图片自定义上传 同所有单照片表单
     * @param {type}   file
     */
    uploadImg (file) {
      let formdata = new FormData()
      formdata.append('file', file)
      this.$http.postForm('/file/upload', formdata).then(res => {
        if (res.code === SUCCESS) {
          this.formInfo.serviceRecordPicList.push(res.payload)
          if (this.formInfo.serviceRecordPicList.length > 9) {
            this.formInfo.serviceRecordPicList = this.formInfo.serviceRecordPicList.splice(
              0,
              9
            )
          }
        }
      })
      return false
    },
    handleRemove (index) {
      this.formInfo.serviceRecordPicList.splice(index, 1)
    },
    /**
     * @descripttion: 获取服务人员信息
     * @return: 信息
     */
    getServiceInfo () {
      this.$http
        .get('/service/record/get?serviceRecordId=' + this.$route.query.sid)
        .then(res => {
          if (res.code === SUCCESS) {
            this.formInfo = res.payload
            this.$set(this.formInfo, 'serviceTime', [
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
        let url = this.$route.query.sid
          ? '/service/record/update'
          : '/service/record/add'
        let arr = []
        this.formInfo.serviceCustomerList.forEach(i => {
          arr.push(i.serviceCustomerId)
        })
        this.formInfo.serviceCustomerIdList = arr
        this.$http.post(url, this.formInfo).then(res => {
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
<style lang="scss" scoped>
.delete-img {
  display: none;
  cursor: pointer;
  position: absolute;
  font-size: 18px;
  right: -8px;
  top: -8px;
}
</style>
