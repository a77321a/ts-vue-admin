<!--
 * @Descripttion: 新增 、 编辑菜品
 * @Author:
 * @Date: 2019-11-11 15:21:28
 * @LastEditors:
 * @LastEditTime: 2019-12-21 23:24:55
 -->
<template>
  <div id="edit-dish">
    <div class="title">基本信息</div>
    <el-form
      style="width:700px"
      ref="formInfo"
      :rules="rules"
      :model="formInfo"
      label-width="80px"
      size="medium"
    >
      <el-form-item label="菜品名称" prop="foodName">
        <el-input
          show-word-limit
          placeholder="请输入菜品名称，最多不超过28个字"
          :maxlength="28"
          v-model="formInfo.foodName"
        ></el-input>
      </el-form-item>
      <el-form-item label="菜品介绍" prop="foodDescription">
        <el-input
          type="textarea"
          show-word-limit
          :autosize="{ minRows: 2, maxRows: 5}"
          placeholder="请输入菜品介绍，最多不超过68个字"
          :maxlength="68"
          v-model="formInfo.foodDescription"
        ></el-input>
      </el-form-item>
      <el-form-item label="菜品封面" prop="indexPic">
        <div style="display:flex;align-items:center;">
          <div v-show="formInfo.indexPic" class="avatars">
            <img :src="$store.state.config.systemConfig[0].dictionaryValue+formInfo.indexPic" alt />
            <Input
              v-model="$store.state.config.systemConfig[0].dictionaryValue+formInfo.indexPic"
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
            <div slot="tip" class="el-upload__tip">900*900像素或1:1，支持PNG、JPG、GIF、JPEG格式，小于5M</div>
          </el-upload>
        </div>
      </el-form-item>
      <div class="title">上架信息</div>
      <el-form-item label="所属机构" prop="orgId">
        <el-cascader
          clearable
          :props="{value:'orgId',label:'orgName',emitPath:false}"
          :options="orgTree"
          v-model="formInfo.orgId"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="菜品类型" prop="foodType">
        <el-select clearable v-model="formInfo.foodType" placeholder="请选择">
          <el-option
            v-for="(item, index) in $store.state.config.foodType"
            :key="index"
            :label="item.dictionaryLabel"
            :value="item.dictionaryValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="适应季节" prop="season">
        <el-select clearable v-model="formInfo.season" placeholder="请选择">
          <el-option
            v-for="(item, index) in $store.state.config.seasonStatus"
            :key="index"
            :label="item.dictionaryLabel"
            :value="item.dictionaryValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input-number
          placeholder="0.01~500000"
          v-model="formInfo.price"
          :precision="2"
          controls-position="right"
          :min="0"
        ></el-input-number>元
      </el-form-item>
      <el-form-item label="划线价">
        <el-input-number
          placeholder="0.01~500000"
          v-model="formInfo.lineationPrice"
          :precision="2"
          controls-position="right"
          :min="0"
        ></el-input-number>元
      </el-form-item>
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
  name: 'editDish',
  data () {
    return {
      formInfo: {
        indexPic: '',
        price: 0,
        salePrice: 0,
        foodDescription: '',
        foodName: '',
        foodType: '',
        season: '',
        lineationPrice: 0
      },
      rules: {
        foodName: [
          { required: true, message: '请输入菜品名称', trigger: 'blur' }
        ],
        price: [{ required: true, message: '请输入菜品价格', trigger: 'blur' }],
        lineationPrice: [
          { required: true, message: '请输入划线价格', trigger: 'blur' }
        ],
        foodType: [
          { required: true, message: '请选择菜品类型', trigger: 'change' }
        ],
        indexPic: [
          { required: true, message: '请选择菜品图片', trigger: 'change' }
        ],
        foodDescription: [
          { required: true, message: '请输入菜品介绍', trigger: 'blur' }
        ],
        season: [
          { required: true, message: '请选择菜品适用季节', trigger: 'change' }
        ],
        orgId: [
          { required: true, message: '请选择所属机构', trigger: 'change' }
        ]
      },
      orgTree: []
    }
  },
  created () {
    this.getOrgList()
  },
  methods: {
    getOrgList () {
      this.$http.post('/org/tree').then(res => {
        if (this.$route.query.fid) {
          this.getFoodInfo()
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
    uploadImg (file) {
      let formdata = new FormData()
      formdata.append('file', file)
      this.$http.postForm('/file/upload', formdata).then(res => {
        if (res.code === SUCCESS) {
          this.formInfo.indexPic = res.payload
        }
      })
      return false
    },
    handleRemove () {},
    handleSave () {
      this.$refs['formInfo'].validate(valid => {
        if (!valid) return
        if (this.$route.query.fid) {
          this.$http.post('/food/update', this.formInfo).then(res => {
            if (res.code === SUCCESS) {
              this.$message.success('操作成功')
              this.$router.go(-1)
            }
          })
        } else {
          this.$http.post('/food/add', this.formInfo).then(res => {
            if (res.code === SUCCESS) {
              this.$message.success('操作成功')
              this.$router.go(-1)
            }
          })
        }
      })
    },
    getFoodInfo () {
      this.$http
        .get('/food/detail?foodId=' + this.$route.query.fid)
        .then(res => {
          if (res.code === SUCCESS) {
            this.formInfo = res.payload
            this.$set(this.formInfo, 'orgId', res.payload.orgDetail.orgId)
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
