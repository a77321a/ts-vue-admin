<!--
 * @Descripttion:新增、编辑机构
 * @Author:
 * @Date: 2019-11-07 18:03:59
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-15 10:20:33
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
      <el-form-item label="机构名称" prop="orgName">
        <el-input
          :maxlength="28"
          placeholder="请输入机构名称，最多不超过28个字"
          show-word-limit
          v-model="formInfo.orgName"
        ></el-input>
      </el-form-item>
      <el-form-item label="机构简介" prop="orgDesc">
        <el-input
          :maxlength="68"
          placeholder="请输入机构简介，最多不超过68个字"
          type="textarea"
          show-word-limit
          v-model="formInfo.orgDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="机构图片" prop="orgPicList">
        <div>
          <div
            style="position:relative"
            v-for="(item, index) in formInfo.orgPicList"
            :key="index"
            v-show="formInfo.orgPicList.length > 0"
            class="avatars"
          >
            <i
              size="24"
              @click="handleRemove(index)"
              color="#ccc"
              class="el-icon-circle-close delete-img"
            ></i>
            <img :src="$store.state.config.systemConfig[0].dictionaryValue+item" alt />
          </div>
          <el-upload
            multiple
            action="apii/public/img"
            :show-file-list="false"
            :before-upload="uploadImg"
            accept="image/*"
          >
            <el-button
              v-if="formInfo.orgPicList.length < 9"
              type="primary"
              icon="ios-cloud-upload-outline"
            >选择文件</el-button>
            <div slot="tip" class="el-upload__tip">支持PNG、JPG、GIF、JPEG格式，小于5M，最多可添加9张</div>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="机构类型" prop="orgType">
        <el-select clearable v-model="formInfo.orgType" style="width:220px" placeholder="请选择">
          <el-option
            v-for="(item, index) in $store.state.config.orgType"
            :key="index"
            :label="item.dictionaryLabel"
            :value="item.dictionaryValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运营模式" prop="operationMode">
        <el-select clearable v-model="formInfo.operationMode" style="width:220px" placeholder="请选择">
          <el-option
            v-for="(item, index) in $store.state.config.operationModeList"
            :key="index"
            :label="item.dictionaryLabel"
            :value="item.dictionaryValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务类型" prop="serviceType">
        <el-select clearable v-model="formInfo.serviceType" style="width:220px" placeholder="请选择">
          <el-option
            v-for="(item, index) in $store.state.config.serviceType"
            :key="index"
            :label="item.dictionaryLabel"
            :value="item.dictionaryValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="服务范围" prop="addressList">
        <el-cascader
          clearable
          :props="{value:'regionId',label:'addressName'}"
          :options="spaceTree"
          v-model="formInfo.addressList"
        ></el-cascader>
      </el-form-item>

      <div class="title">其他信息</div>
      <el-form-item label="机构位置" prop="latitude">
        <el-input style="width:472px" readonly v-model="formInfo.latLong"></el-input>
        <el-button style="margin-left:20px" @click="openMap">选择位置</el-button>
      </el-form-item>
      <el-form-item label="详细地址" prop="orgAddress">
        <el-input v-model="formInfo.orgAddress"></el-input>
      </el-form-item>
      <el-form-item label="机构联系人" prop="contact">
        <el-input :maxlength="10" show-word-limit v-model="formInfo.contact"></el-input>
      </el-form-item>
      <el-form-item label="机构联系电话" prop="tel">
        <el-input v-model="formInfo.tel"></el-input>
      </el-form-item>
      <el-form-item v-if="!$route.query.parent" label="机构平面图" prop="cad">
        <div style="display:flex;align-items:center;">
          <div v-show="formInfo.cad" class="avatars">
            <img
              :src="
                $store.state.config.systemConfig[0].dictionaryValue +
                  formInfo.cad
              "
              alt
            />
          </div>
          <el-upload
            action="apii/public/img"
            :show-file-list="false"
            :before-upload="uploadImgcad"
            accept="image/*"
          >
            <el-button type="primary" icon="ios-cloud-upload-outline">选择文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </div>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item size="large">
        <el-button @click="handleSave" type="primary">立即创建</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="选择地点" :visible.sync="mapShow" width="70%">
      <GdMap ref="gdmap"></GdMap>
      <span slot="footer" class="dialog-footer">
        <el-button @click="mapShow = false">取 消</el-button>
        <el-button type="primary" @click="selectArea">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import GdMap from '@/components/GDMAP/GdMap'
export default {
  name: 'editAgency',
  components: {
    GdMap
  },
  data () {
    const validMobile = (rule, value, callback) => {
      let reg = /^1[123456789]\d{9}$/
      if (!value) {
        callback(new Error('请输入手机号'))
      } else if (!reg.test(value)) {
        callback(new Error('手机格式不正确'))
      } else {
        callback()
      }
    }
    return {
      formInfo: {
        orgDesc: '',
        orgPicList: [],
        latLong: '',
        orgName: '',
        latitude: '',
        longitude: '',
        contact: '',
        addressList: [],
        operationMode: '',
        cad: '',
        mapAddress: ''
      },
      rules: {
        cad: [
          { required: true, message: '请上传机构平面图', trigger: 'change' }
        ],
        orgName: [
          { required: true, message: '请输入机构名称', trigger: 'blur' }
        ],
        orgDesc: [
          { required: true, message: '请输入机构简介', trigger: 'blur' }
        ],
        orgPicList: [
          { required: true, message: '请上传机构图片', trigger: 'change' }
        ],
        orgType: [
          { required: true, message: '请选择机构类型', trigger: 'change' }
        ],
        operationMode: [
          { required: true, message: '请选择服务模式', trigger: 'change' }
        ],
        serviceType: [
          { required: true, message: '请选择服务类型', trigger: 'change' }
        ],
        addressList: [
          { required: true, message: '请选择服务范围', trigger: 'change' }
        ],
        latitude: [
          { required: true, message: '请选择服务位置', trigger: 'change' }
        ],
        orgAddress: [
          { required: true, message: '请输入机构详细地址', trigger: 'blur' }
        ],
        tel: [
          { required: true, message: '请输入机构联系电话', trigger: 'blur' }
        ],
        contact: [
          { required: true, message: '请输入机构联系人姓名', trigger: 'blur' }
        ]
      },
      orgTypeList: [],
      serviceTypeList: [],
      operationModeList: [],
      mapShow: false,
      spaceTree: []
    }
  },
  created () {
    // this.getOrgType()
    // this.getServiceType()
    // this.getOperationMode()
    this.getTree()
    if (this.$route.query.oid) {
      this.getOrgInfo()
    }
  },
  methods: {
    openMap () {
      this.mapShow = true
    },
    getOrgInfo () {
      this.$http.get('/org/get?orgId=' + this.$route.query.oid).then(res => {
        if (res.code === SUCCESS) {
          this.formInfo = res.payload
          this.$set(
            this.formInfo,
            'latLong',
            `${res.payload.mapAddress}（${res.payload.longitude}，${res.payload.latitude}）`
          )
          this.$set(this.formInfo, 'addressList', [
            res.payload.cityRegionId ? res.payload.cityRegionId : '',
            res.payload.districtRegionId ? res.payload.districtRegionId : '',
            res.payload.streetRegionId ? res.payload.streetRegionId : '',
            res.payload.communityRegionId ? res.payload.communityRegionId : ''
          ])
        }
      })
    },
    selectArea () {
      let row = this.$refs.gdmap.open()
      this.formInfo.latitude = row.position[1]
      this.formInfo.longitude = row.position[0]
      this.formInfo.mapAddress = row.address
      this.formInfo.latLong = `${row.address}（${row.position[0]}，${row.position[1]}）`
      this.mapShow = false
    },
    handleData (arr) {
      for (let i in arr) {
        if (arr[i].depth !== 4 && !Array.isArray(arr[i].children)) {
          arr[i].children = []
        }
        this.handleData(arr[i].children)
      }
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
          this.handleData(this.spaceTree)
        }
      })
    },
    getOperationMode () {
      this.$http.get('/org/operationMode').then(res => {
        if (res.code === SUCCESS) {
          this.operationModeList = res.payload
        }
      })
    },
    getServiceType () {
      this.$http.get('/org/serviceType').then(res => {
        if (res.code === SUCCESS) {
          this.serviceTypeList = res.payload
        }
      })
    },
    getOrgType () {
      this.$http.get('/org/orgType').then(res => {
        if (res.code === SUCCESS) {
          this.orgTypeList = res.payload
        }
      })
    },
    handleRemove () {},
    // 保存按钮
    handleSave () {
      if (this.formInfo.addressList.length < 4) {
        this.$message.error('选择的服务范围有误')
        return
      }
      this.$refs['formInfo'].validate(valid => {
        console.log(valid)
        if (!valid) return
        let url = this.$route.query.oid ? '/org/update' : '/org/add'
        this.$http
          .post(url, {
            cityRegionId: this.formInfo.addressList[0],
            districtRegionId: this.formInfo.addressList[1],
            streetRegionId: this.formInfo.addressList[2],
            communityRegionId: this.formInfo.addressList[3],
            mapAddress:this.formInfo.mapAddress,
            contact: this.formInfo.contact,
            latitude: this.formInfo.latitude,
            longitude: this.formInfo.longitude,
            operationMode: this.formInfo.operationMode,
            orgAddress: this.formInfo.orgAddress,
            orgName: this.formInfo.orgName,
            orgPicList: this.formInfo.orgPicList,
            orgDesc: this.formInfo.orgDesc,
            orgType: this.formInfo.orgType,
            parentOrgId: this.$route.query.parent || 0,
            serviceType: this.formInfo.serviceType,
            tel: this.formInfo.tel,
            orgId: this.$route.query.oid,
            cad: this.formInfo.cad
          })
          .then(res => {
            if (res.code === SUCCESS) {
              this.$message.success('操作成功')
              this.$router.go(-1)
            }
          })
      })
    },
    uploadImgcad (file) {
      let formdata = new FormData()
      formdata.append('file', file)
      this.$http.postForm('/file/upload', formdata).then(res => {
        if (res.code === SUCCESS) {
          this.formInfo.cad = res.payload
        }
      })
      return false
    },
    uploadImg (file) {
      let formdata = new FormData()
      formdata.append('file', file)
      this.$http.postForm('/file/upload', formdata).then(res => {
        if (res.code === SUCCESS) {
          this.formInfo.orgPicList.push(res.payload)
          if (this.formInfo.orgPicList.length > 9) {
            this.formInfo.orgPicList = this.formInfo.orgPicList.splice(0, 9)
          }
        }
      })
      return false
    },
    handleRemove (index) {
      this.formInfo.orgPicList.splice(index, 1)
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
