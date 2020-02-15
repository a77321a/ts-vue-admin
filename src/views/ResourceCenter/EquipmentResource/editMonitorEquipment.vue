<!--
 * @Descripttion:新增、编辑监控设备
 * @Author:
 * @Date: 2019-11-07 18:03:59
 * @LastEditors:
 * @LastEditTime: 2019-12-08 11:13:18
 -->
<template>
  <div id="edit-agency">
    <div class="title">基本信息</div>
    <el-form
      style="width:700px"
      ref="formInfo"
      :rules="rules"
      :model="formInfo"
      label-width="110px"
      size="medium"
    >
      <el-form-item label="设备名称" prop="deviceName">
        <el-input
          :maxlength="28"
          placeholder="请输入设备名称，最多不超过28个字，如活动室摄像头1"
          show-word-limit
          v-model="formInfo.deviceName"
        ></el-input>
      </el-form-item>
      <el-form-item label="设备厂家" prop="factory">
        <el-input
          :maxlength="28"
          placeholder="请输入设备厂家，最多不超过28个字"
          show-word-limit
          v-model="formInfo.factory"
        ></el-input>
      </el-form-item>
      <el-form-item label="设备型号" prop="model">
        <el-input
          :maxlength="28"
          placeholder="请输入设备型号，最多不超过28个字，"
          show-word-limit
          v-model="formInfo.model"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="$route.query.deviceType != 1" label="数据同步地址" prop="dataSyncAddress">
        <el-input placeholder="请输入计数设备数据同步地址" v-model="formInfo.dataSyncAddress"></el-input>
      </el-form-item>
      <el-form-item v-if="$route.query.deviceType == 1" label="视频信息" prop="type">
        <el-radio-group v-model="formInfo.type">
          <el-radio style="margin:10px 0;" :label="0">视频流地址</el-radio>
          <el-input
            v-show="formInfo.type == 0"
            placeholder="请输入监控视频流地址"
            v-model="formInfo.videoStreamAddress"
          ></el-input>
          <div>
            <el-radio style="margin:10px 0;" :label="1">视频接口地址</el-radio>
            <el-input
              v-show="formInfo.type == 1"
              placeholder="请输入视频接口地址"
              v-model="formInfo.videoInterfaceAddress"
            ></el-input>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="$route.query.deviceType != 3" label="所在区域" prop="areaType">
        <el-radio-group v-model="formInfo.areaType">
          <div>
            <el-radio style="margin:10px;" :label="0">机构内</el-radio>
            <el-button v-if="formInfo.areaType == 0" @click="dialogOrg = true">选择机构</el-button>
            <span
              v-if="checkedObj.orgId && formInfo.areaType == 0"
              style="margin-left:5px;font-size:12px"
            >已选：{{ checkedObj.orgName }}</span>
          </div>
          <div>
            <el-radio style="margin:10px;" :label="1">活动室</el-radio>
            <el-button
              v-if="formInfo.areaType == 1"
              @click="
                dialogEventRoom = true;
                templateObj = {};
              "
            >选择活动室</el-button>
            <span
              v-if="checkRoom.activityRoomId && formInfo.areaType == 1"
              style="margin-left:5px;font-size:12px"
            >已选：{{ checkRoom.activityRoomName }}</span>
          </div>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-else label="所在机构" prop="orgId">
        <el-button
          v-if="formInfo.areaType == 0"
          @click="
            dialogOrg = true;
            templateObj = {};
          "
        >选择机构</el-button>
        <span
          v-if="checkedObj.orgId && formInfo.areaType == 0"
          style="margin-left:5px;font-size:12px"
        >已选：{{ checkedObj.orgName }}</span>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item size="large">
        <el-button @click="handleSave" type="primary">立即创建</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog width="60%" destroy-on-close lock-scroll title="选择机构" :visible.sync="dialogOrg">
      <selectOrg single @selectObject="selectObject"></selectOrg>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            dialogOrg = false;
            templateObj = {};
          "
        >取 消</el-button>
        <el-button type="primary" @click="handleSaveSelectOrg">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      width="60%"
      destroy-on-close
      lock-scroll
      title="选择活动室"
      :visible.sync="dialogEventRoom"
    >
      <selectEventRoom single @selectObject="selectObjectRoom"></selectEventRoom>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            dialogEventRoom = false;
            templateObj = {};
          "
        >取 消</el-button>
        <el-button type="primary" @click="handleSaveSelectRoom">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import selectOrg from '../../../components/SelectTable/selectOrg.vue'
import selectEventRoom from '../../../components/SelectTable/selectEventRoom.vue'

export default {
  name: 'editMonitorEquipment',
  components: {
    selectOrg,
    selectEventRoom
  },
  data() {
    const checkAddress = (rule, value, callback) => {
      if (this.formInfo.type === 0) {
        if (!this.formInfo.videoStreamAddress) {
          callback(new Error('请输入视频流地址'))
        } else {
          callback()
        }
      } else if (this.formInfo.type === 1) {
        if (!this.formInfo.videoInterfaceAddress) {
          callback(new Error('请输入视频接口地址'))
        } else {
          callback()
        }
      }
    }
    const checkArea = (rule, value, callback) => {
      if (this.formInfo.areaType === 0) {
        if (!this.formInfo.orgId) {
          callback(new Error('请选择机构'))
        } else {
          callback()
        }
      } else if (this.formInfo.areaType === 1) {
        if (!this.formInfo.activityRoomId) {
          callback(new Error('请选择活动室'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      dialogOrg: false,
      dialogEventRoom: false,
      formInfo: {
        deviceName: '',
        activityRoomId: '',
        dataSyncAddress: '',
        factory: '',
        model: '',
        orgId: '',
        videoInterfaceAddress: '',
        videoStreamAddress: '',
        type: 0,
        areaType: 0
      },
      rules: {
        orgId: [{ required: true, message: '请选择机构', trigger: 'change' }],
        deviceName: [
          { required: true, message: '请输入设备名称', trigger: 'blur' }
        ],
        factory: [
          { required: true, message: '请输入设备厂家', trigger: 'blur' }
        ],
        dataSyncAddress: [
          {
            required: true,
            message: '请输入计数设备数据同步地址',
            trigger: 'blur'
          }
        ],
        model: [{ required: true, message: '请输入设备型号', trigger: 'blur' }],
        type: [{ required: true, validator: checkAddress }],
        areaType: [{ required: true, validator: checkArea }]
      },
      templateObj: {},
      checkedObj: {},
      checkRoom: {}
    }
  },
  created() {
    if (this.$route.query.deviceId) {
      this.getDeviceInfo()
    }
  },
  methods: {
    getDeviceInfo() {
      this.$http
        .get('/device/get?deviceId=' + this.$route.query.deviceId)
        .then(res => {
          if (res.code === SUCCESS) {
            this.formInfo = res.payload
            this.$set(
              this.formInfo,
              'type',
              res.payload.videoStreamAddress ? 0 : 1
            )
            this.$set(this.formInfo, 'areaType', res.payload.orgId ? 0 : 1)
            this.checkedObj = {
              orgId: res.payload.orgId,
              orgName: res.payload.orgName
            }
            this.checkRoom = {
              activityRoomId: res.payload.activityRoomId,
              activityRoomName: res.payload.activityRoomName
            }
          }
        })
    },
    selectObject(data) {
      this.templateObj = data
    },
    handleSaveSelectOrg() {
      if (!this.templateObj.orgId) {
        this.$message.error('请选择一个机构')
        return false
      }
      this.checkedObj = this.templateObj
      this.formInfo.orgId = this.templateObj.orgId
      this.templateObj = {}
      this.dialogOrg = false
    },
    selectObjectRoom(data) {
      this.templateObj = data
    },
    handleSaveSelectRoom() {
      if (!this.templateObj.activityRoomId) {
        this.$message.error('请选择一个活动室')
        return false
      }
      this.checkRoom = this.templateObj
      this.formInfo.activityRoomId = this.templateObj.activityRoomId
      this.templateObj = {}
      this.dialogEventRoom = false
    },
    handleSave() {
      this.$refs['formInfo'].validate(valid => {
        if (!valid) return
        let url = this.$route.query.deviceId ? '/device/update' : '/device/add'
        this.$http
          .post(url, {
            deviceId: this.$route.query.deviceId,
            activityRoomId:
              this.formInfo.areaType === 0
                ? null
                : this.formInfo.activityRoomId,
            dataSyncAddress: this.formInfo.dataSyncAddress,
            deviceName: this.formInfo.deviceName,
            deviceType: this.$route.query.deviceType,
            factory: this.formInfo.factory,
            model: this.formInfo.model,
            orgId: this.formInfo.areaType === 0 ? this.formInfo.orgId : null,
            videoInterfaceAddress:
              this.formInfo.type === 1
                ? this.formInfo.videoInterfaceAddress
                : undefined,
            videoStreamAddress:
              this.formInfo.type === 1
                ? undefined
                : this.formInfo.videoStreamAddress
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
<style lang="scss" scoped></style>
