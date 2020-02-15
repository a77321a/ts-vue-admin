<!--
 * @Descripttion:
 * @Author:
 * @Date: 2019-11-11 14:52:54
 * @LastEditors:
 * @LastEditTime: 2019-11-18 21:02:03
 -->
<template>
  <div id="edit-dictionary">
    <div class="title">基本信息</div>
    <el-form
      style="width:700px"
      ref="formInfo"
      :rules="rules"
      :model="formInfo"
      label-width="80px"
      size="medium"
    >
      <el-form-item label="字典名称" prop="dictionaryLabel">
        <el-input
          :maxlength="10"
          show-word-limit
          placeholder="请输入字典名称，最多不超过10个字"
          v-model="formInfo.dictionaryLabel"
        ></el-input>
      </el-form-item>
      <el-form-item label="key" prop="dictionaryKey">
        <el-input placeholder="请输入字典key" v-model="formInfo.dictionaryKey"></el-input>
      </el-form-item>
      <el-form-item label="字典值" prop="dictionaryValue">
        <el-input placeholder="请输入字典值" v-model="formInfo.dictionaryValue"></el-input>
      </el-form-item>
      <!-- <el-form-item label="字典类型" prop="status">
        <el-select clearable v-model="formInfo.status" style="width:220px" placeholder="请选择">
          <el-option label="全部" :value="-1"></el-option>
          <el-option label="启用" :value="1"></el-option>
          <el-option label="禁用" :value="0"></el-option>
        </el-select>
      </el-form-item>-->
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
  name: 'editDictionary',
  data () {
    return {
      formInfo: {},
      rules: {
        dictionaryLabel: [
          { required: true, message: '请输入字典名称', trigger: 'blur' }
        ],
        dictionaryKey: [
          { required: true, message: '请输入字典key', trigger: 'blur' }
        ],
        dictionaryValue: [
          { required: true, message: '请输入字典值', trigger: 'blur' }
        ]
        // status: [
        //   { required: true, message: '请选择字典类型', trigger: 'change' }
        // ]
      }
    }
  },
  created () {
    if (this.$route.query.did) {
      this.getDictionaryInfo()
    }
  },
  methods: {
    getDictionaryInfo () {
      this.$http
        .get('/dictionary/get?dictionaryId=' + this.$route.query.did)
        .then(res => {
          if (res.code === SUCCESS) {
            this.formInfo = res.payload
          }
        })
    },
    handleSave () {
      this.$refs['formInfo'].validate(valid => {
        if (!valid) return
        if (this.$route.query.did) {
          this.$http.post('/dictionary/update', this.formInfo).then(res => {
            if (res.code === SUCCESS) {
              this.$message.success('操作成功')
              this.$router.go(-1)
            }
          })
        } else {
          this.$http
            .post(
              '/dictionary/add',
              Object.assign(
                { dictCatalogKey: this.$route.query.parent },
                this.formInfo
              )
            )
            .then(res => {
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
<style lang="scss" scoped>
#edit-dictionary {
}
</style>
