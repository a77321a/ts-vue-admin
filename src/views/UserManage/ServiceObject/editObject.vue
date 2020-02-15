<!--
 * @Descripttion:新增、编辑养老产品
 * @Author:
 * @Date: 2019-11-07 18:03:59
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-02-13 11:57:28
 -->
<template>
  <div id="edit-event">
    <!-- label-suffix="：" -->
    <div class="title">基本信息</div>
    <el-form
      style="width:700px"
      ref="formInfo"
      :rules="rules"
      :model="formInfo"
      label-width="110px"
      size="medium"
    >
      <el-form-item label="姓名" prop="serviceCustomerName">
        <el-input
          placeholder="请输入服务对象姓名，最多不超过10个字"
          :maxlength="10"
          show-word-limit
          v-model="formInfo.serviceCustomerName"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input type="text" :maxlength="11" placeholder="请输入服务对象手机号" v-model="formInfo.mobile"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <div style="display:flex;align-items:center;">
          <div v-show="formInfo.avatar" class="avatars">
            <img
              :src="
                $store.state.config.systemConfig[0].dictionaryValue +
                  formInfo.avatar
              "
              alt
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
      <el-form-item label="照片" prop="serviceCustomerPicList">
        <div>
          <div
            style="position:relative"
            v-for="(item, index) in formInfo.serviceCustomerPicList"
            :key="index"
            v-show="formInfo.serviceCustomerPicList.length > 0"
            class="avatars"
          >
            <i size="24" @click="handleRemove(index)" class="el-icon-circle-close delete-img"></i>
            <img :src="$store.state.config.systemConfig[0].dictionaryValue + item" alt />
          </div>
          <el-upload
            action="apii/public/img"
            multiple
            :show-file-list="false"
            :before-upload="uploadImgList"
            accept="image/*"
          >
            <el-button
              v-if="formInfo.serviceCustomerPicList.length < 9"
              type="primary"
              icon="ios-cloud-upload-outline"
            >选择文件</el-button>
            <div slot="tip" class="el-upload__tip">支持PNG、JPG、GIF、JPEG格式，小于5M，最多可添加9张</div>
          </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="性别" prop="gender">
        <el-select clearable v-model="formInfo.gender" style="width:220px" placeholder="请选择">
          <el-option label="女" :value="0"></el-option>
          <el-option label="男" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="婚姻状态" prop="maritalStatus">
        <el-select clearable v-model="formInfo.maritalStatus" style="width:220px" placeholder="请选择">
          <el-option label="未婚" :value="0"></el-option>
          <el-option label="已婚" :value="1"></el-option>
          <el-option label="离异" :value="2"></el-option>
          <el-option label="再婚" :value="3"></el-option>
          <el-option label="丧偶" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老人居住状况" prop="liveStatus">
        <el-select clearable v-model="formInfo.liveStatus" style="width:220px" placeholder="请选择">
          <el-option label="与子女同住" :value="0"></el-option>
          <el-option label="独自居住" :value="1"></el-option>
          <el-option label="配偶居住" :value="2"></el-option>
          <el-option label="其他 " :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="民族" prop="ethnic">
        <el-select clearable v-model="formInfo.ethnic" style="width:220px" placeholder="请选择">
          <el-option
            v-for="(item, index) in $store.state.config.nationList"
            :key="index"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="出生日期" prop="birthday">
        <el-date-picker
          v-model="formInfo.birthday"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="证件信息" prop="idCard">
        <div style="margin-bottom:10px">
          身份证：
          <el-input placeholder="请输入服务对象身份证信息" v-model="formInfo.idCard" style="width:300px"></el-input>
        </div>市民卡：
        <el-input placeholder="请输入服务对象市民卡信息" v-model="formInfo.citizenCard" style="width:300px"></el-input>
      </el-form-item>
      <el-form-item label="所在区域" prop="addressList">
        <el-cascader
          clearable
          :props="{ value: 'regionId', label: 'addressName' }"
          :options="spaceTree"
          v-model="formInfo.addressList"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址" prop="address">
        <el-input placeholder="请输入服务对象详细住址，最多不超过60个字" show-word-limit v-model="formInfo.address"></el-input>
      </el-form-item>
      <div class="title">紧急联系人</div>
      <el-form-item label="紧急联系人" prop="emergencySelectList">
        <el-button type="primary" @click="dialogServiceObject = true">选择人员</el-button>
        <el-button @click="dialogFormVisible = true">手动添加</el-button>
      </el-form-item>
      <el-form-item style="color:#666" label="已选人员">
        <el-card style="margin-top:10px;" shadow="never">
          <el-tag
            style="margin-right:10px"
            @close="formInfo.emergencySelectList.splice(index, 1)"
            v-for="(item, index) in formInfo.emergencySelectList"
            :key="index"
            closable
          >
            <el-avatar
              :size="22"
              style="vertical-align: middle;margin-right:5px"
              icon="el-icon-user-solid"
              :src="item.indexPic ? $store.state.config.systemConfig[0].dictionaryValue +
                  item.indexPic:$store.state.config.systemConfig[0].dictionaryValue +
                  item.avatar"
            ></el-avatar>
            <span style="vertical-align: middle;">
              {{
              item.serviceCustomerName ||
              item.orgServiceProviderName ||
              item.name
              }}
            </span>
          </el-tag>
        </el-card>
      </el-form-item>
      <el-form-item style="color:#666" label="已添加人员">
        <el-card style="margin-top:10px;" shadow="never">
          <el-tag
            style="margin-right:10px"
            @close="formInfo.emergencyManualList.splice(index, 1)"
            v-for="(item, index) in formInfo.emergencyManualList"
            :key="index"
            closable
          >
            <el-avatar
              :size="22"
              style="vertical-align: middle;margin-right:5px"
              icon="el-icon-user-solid"
              :src="item.indexPic ? $store.state.config.systemConfig[0].dictionaryValue +
                  item.indexPic:$store.state.config.systemConfig[0].dictionaryValue +
                  item.avatar"
            ></el-avatar>
            <span style="vertical-align: middle;">{{ item.name }}</span>
          </el-tag>
        </el-card>
      </el-form-item>
      <div class="title">扩展信息</div>
      <el-form-item label="期望养老方式" prop="pensionModeList">
        <el-select
          multiple
          clearable
          v-model="formInfo.pensionModeList"
          style="width:220px"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in $store.state.config.pensionModeList"
            :key="index"
            :label="item.dictionaryLabel"
            :value="item.dictionaryValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="期望养老服务" prop="pensionServiceList">
        <el-select
          multiple
          clearable
          v-model="formInfo.pensionServiceList"
          style="width:220px"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in $store.state.config.pensionServiceList"
            :key="index"
            :label="item.dictionaryLabel"
            :value="item.dictionaryValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="政府购买类型" prop="purchaseTypeList">
        <el-select
          multiple
          clearable
          v-model="formInfo.purchaseTypeList"
          style="width:220px"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in $store.state.config.govBuyTypeList"
            :key="index"
            :label="item.dictionaryLabel"
            :value="item.dictionaryValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老人类别" prop="customerCategoryList">
        <el-select
          multiple
          clearable
          v-model="formInfo.customerCategoryList"
          style="width:220px"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in $store.state.config.pensionTypeList"
            :key="index"
            :label="item.dictionaryLabel"
            :value="item.dictionaryValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="老人喜好" prop="customerHobbyList">
        <el-select
          multiple
          clearable
          v-model="formInfo.customerHobbyList"
          style="width:220px"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in $store.state.config.hobbyList"
            :key="index"
            :label="item.dictionaryLabel"
            :value="item.dictionaryValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item size="large">
        <el-button @click="handleSave" type="primary">立即创建</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
    <el-dialog width="60%" lock-scroll title="选择紧急联系人" :visible.sync="dialogServiceObject">
      <el-tabs value="first" type="card" @tab-click="handleClick">
        <el-tab-pane label="服务人员" name="first">
          <selectServiceUser :clearList="clearList" @selectUser="selectObject"></selectServiceUser>
        </el-tab-pane>
        <el-tab-pane label="服务对象" name="second">
          <selectServiceObject :clearList="clearList" @selectObject="selectObject"></selectServiceObject>
        </el-tab-pane>
      </el-tabs>

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
    <el-dialog title="添加紧急联系人" :visible.sync="dialogFormVisible">
      <el-form :rules="rulesForm" ref="rulesForm" label-width="80px" :model="contractUser">
        <el-form-item label="名字" prop="name">
          <el-input v-model="contractUser.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="contractUser.mobile" autocomplete="off"></el-input>
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
import selectServiceObject from '../../../components/SelectTable/selectServiceObject.vue'
import selectServiceUser from '../../../components/SelectTable/selectServiceUser.vue'

export default {
  name: 'editObject',
  components: {
    selectServiceObject,
    selectServiceUser
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
    // zhushi
    // mingt
    // kaigong
    const validCard = (rule, value, callback) => {
      if (this.formInfo.idCard == '' && this.formInfo.idCard == '') {
        callback(new Error('请输入证件信息'))
      } else {
        callback()
      }
    }
    const validList = (rule, value, callback) => {
      if (
        this.formInfo.emergencySelectList.length == 0 &&
        this.formInfo.emergencyManualList.length == 0
      ) {
        callback(new Error('请添加紧急联系人'))
      } else {
        callback()
      }
    }
    return {
      contractUser: {},
      contarctList: [],
      tabsType: 'first',
      dialogServiceObject: false,
      dialogFormVisible: false,
      rulesForm: {
        name: [
          { required: true, message: '请输入联系人名称', trigger: 'blur' }
        ],
        mobile: [
          {
            required: true,
            validator: validMobile
          }
        ]
      },
      selectObjectList: [],
      formInfo: {
        serviceCustomerName: '',
        mobile: '',
        avatar: '',
        serviceCustomerPicList: [],
        emergencyList: [],
        gender: '',
        maritalStatus: '',
        liveStatus: '',
        ethnic: '',
        idCard: '',
        birthday: '',
        citizenCard: '',
        communityId: '',
        cityId: '',
        districtId: '',
        streetId: '',
        address: '',
        customerCategoryList: [],
        customerHobbyList: [],
        purchaseTypeList: [],
        pensionServiceList: [],
        pensionModeList: [],
        addressList: [],
        emergencySelectList: [],
        emergencyManualList: []
      },
      rules: {
        addressList: [
          { required: true, message: '请选择服务范围', trigger: 'change' }
        ],
        birthday: [
          { required: true, message: '请选择出生日期', trigger: 'change' }
        ],
        serviceCustomerName: [
          { required: true, message: '请输入服务对象名称', trigger: 'blur' }
        ],
        mobile: [
          {
            required: true,
            message: '请输入服务对象手机号',
            validator: validMobile
          }
        ],
        avatar: [
          { required: true, message: '请上传服务对象头像', trigger: 'change' }
        ],
        serviceCustomerPicList: [
          {
            required: true,
            message: '请上传服务对象照片',
            trigger: 'change',
            type: 'array'
          }
        ],
        emergencySelectList: [
          { required: true, message: '请添加紧急联系人', validator: validList }
        ],
        gender: [
          { required: true, message: '请输入服务对象名称', trigger: 'blur' }
        ],
        maritalStatus: [
          { required: true, message: '请选择婚姻状态', trigger: 'change' }
        ],
        liveStatus: [
          { required: true, message: '请选择老人居住状况', trigger: 'blur' }
        ],
        ethnic: [{ required: true, message: '请选择民族', trigger: 'change' }],
        idCard: [{ required: true, validator: validCard, trigger: 'blur' }],
        communityId: [
          { required: true, message: '请选择服务对象区域', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        customerCategoryList: [
          {
            required: true,
            message: '请选择老人类别',
            trigger: 'change',
            type: 'array'
          }
        ],
        customerHobbyList: [
          {
            required: true,
            message: '请选择老人喜好',
            trigger: 'change',
            type: 'array'
          }
        ],
        purchaseTypeList: [
          {
            required: true,
            message: '请选择政府购买类型',
            trigger: 'change',
            type: 'array'
          }
        ],
        pensionServiceList: [
          {
            required: true,
            message: '请选择期望养老服务',
            trigger: 'change',
            type: 'array'
          }
        ],
        pensionModeList: [
          {
            required: true,
            message: '请输入期望养老方式',
            trigger: 'change',
            type: 'array'
          }
        ]
      },
      spaceTree: [],
      clearList: false
    }
  },
  created () {
    if (this.$route.query.sid) {
      this.getServiceUserInfo()
    }
    this.getTree()
  },
  methods: {
    handleSaveForm () {
      this.formInfo.emergencyManualList.push(this.contractUser)
      console.log(this.formInfo.emergencyManualList)
      this.contractUser = {}
      this.dialogFormVisible = false
    },
    handleClick (tab, event) {
      this.clearList = !this.clearList
      this.selectObjectList = []
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
      this.formInfo.emergencySelectList = this.formInfo.emergencySelectList.concat(
        this.selectObjectList
      )
      this.clearList = !this.clearList

      this.selectObjectList = []
      this.dialogServiceObject = false
    },
    uploadImg (file) {
      let formdata = new FormData()
      formdata.append('file', file)
      this.$http.postForm('/file/upload', formdata).then(res => {
        if (res.code === SUCCESS) {
          this.formInfo.avatar = res.payload
        }
      })
      return false
    },
    handleRemove (index) {
      this.formInfo.serviceCustomerPicList.splice(index, 1)
    },
    uploadImgList (file) {
      let formdata = new FormData()
      formdata.append('file', file)
      this.$http.postForm('/file/upload', formdata).then(res => {
        if (res.code === SUCCESS) {
          this.formInfo.serviceCustomerPicList.push(res.payload)
          if (this.formInfo.serviceCustomerPicList.length > 9) {
            this.formInfo.serviceCustomerPicList = this.formInfo.serviceCustomerPicList.splice(
              0,
              9
            )
          }
        }
      })
      return false
    },
    /**
     * @descripttion: 获取服务对象信息
     * @return: 信息
     */
    getServiceUserInfo () {
      this.$http
        .get('/service/customer/get?serviceCustomerId=' + this.$route.query.sid)
        .then(res => {
          if (res.code === SUCCESS) {
            this.formInfo = res.payload
            this.$set(
              this.formInfo,
              'emergencyManualList',
              this.formInfo.emergencyManualList
                ? this.formInfo.emergencyManualList
                : []
            )
            this.$set(this.formInfo, 'addressList', [
              res.payload.cityId,
              res.payload.districtId,
              res.payload.communityId,
              res.payload.streetId
            ])
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
    // 保存按钮
    handleSave () {
      this.$refs['formInfo'].validate(valid => {
        if (!valid) return
        let arr = []
        this.formInfo.emergencySelectList.forEach(i => {
          arr.push({
            id: i.orgServiceProviderId || i.serviceCustomerId || i.id,
            mobile: i.mobile || i.telephoneNum,
            name: i.serviceCustomerName || i.orgServiceProviderName || i.name,
            avatar: i.avatar || i.indexPic
          })
        })
        // arr = arr.concat(this.contarctList)
        let url = this.$route.query.sid
          ? '/service/customer/update'
          : '/service/customer/add'
        this.$http
          .post(url, {
            serviceCustomerId: this.$route.query.sid,
            cityId: this.formInfo.addressList[0],
            districtId: this.formInfo.addressList[1],
            communityId: this.formInfo.addressList[2],
            streetId: this.formInfo.addressList[3],
            address: this.formInfo.address,
            avatar: this.formInfo.avatar,
            birthday: this.formInfo.birthday,
            citizenCard: this.formInfo.citizenCard,
            customerCategoryList: this.formInfo.customerCategoryList,
            customerHobbyList: this.formInfo.customerHobbyList,
            emergencySelectList: arr,
            emergencyManualList: this.formInfo.emergencyManualList,
            ethnic: this.formInfo.ethnic,
            gender: this.formInfo.gender,
            idCard: this.formInfo.idCard,
            liveStatus: this.formInfo.liveStatus,
            maritalStatus: this.formInfo.maritalStatus,
            mobile: this.formInfo.mobile,
            pensionModeList: this.formInfo.pensionModeList,
            pensionServiceList: this.formInfo.pensionServiceList,
            purchaseTypeList: this.formInfo.purchaseTypeList,
            serviceCustomerName: this.formInfo.serviceCustomerName,
            serviceCustomerPicList: this.formInfo.serviceCustomerPicList
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
<style lang="scss" scoped>
.delete-img {
  cursor: pointer;
  display: none;
  position: absolute;
  font-size: 18px;
  right: -8px;
  top: -8px;
}
</style>
