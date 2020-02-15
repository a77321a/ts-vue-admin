<!--
 * @Descripttion:新增、编辑活动室
 * @Author:
 * @Date: 2019-11-07 18:03:59
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-07 15:37:26
 -->
<template>
  <div id="edit-event">
    <div class="title">基本信息</div>
    <el-form
      :rules="rules"
      style="width:700px"
      ref="formInfo"
      :model="formInfo"
      label-width="100px"
      size="medium"
    >
      <el-form-item label="活动室名称" prop="activityRoomName">
        <el-input
          :maxlength="28"
          show-word-limit
          placeholder="请输入活动室名称，最多不超过28个字"
          v-model="formInfo.activityRoomName"
        ></el-input>
      </el-form-item>
      <el-form-item label="活动室编号" prop="activityRoomCode">
        <el-input
          :maxlength="16"
          show-word-limit
          placeholder="请输入活动室编号，最多不超过16个字"
          v-model="formInfo.activityRoomCode"
        ></el-input>
      </el-form-item>
      <el-form-item label="活动室介绍" prop="activityRoomDesc">
        <el-input
          :maxlength="68"
          show-word-limit
          type="textarea"
          :autosize="{ minRows: 2, maxRows: 5}"
          placeholder="请输入活动室介绍，最多不超过68个字"
          v-model="formInfo.activityRoomDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="所属机构" prop="orgId">
        <el-cascader
          :props="{ value: 'orgId',label:'orgName',emitPath:false }"
          v-model="formInfo.orgId"
          clearable
          :options="orgTree"
        ></el-cascader>
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
  name: 'eventCenterEdit',
  data() {
    return {
      formInfo: {},
      orgTree: [],
      rules: {
        activityRoomName: [
          { required: true, message: '请输入活动室名称', trigger: 'blur' }
        ],
        activityRoomCode: [
          { required: true, message: '请输入活动室编号', trigger: 'blur' }
        ],
        activityRoomDesc: [
          { required: true, message: '请输入活动室介绍', trigger: 'blur' }
        ],
        orgId: [{ required: true, message: '请选择机构', trigger: 'change' }]
        // 海康威视
        // orgId: [
        //   { required: true, message: '请选择机构', trigger: 'change' }
        // ],
      }
    }
  },
  created() {
    this.getOrgList()
    if (!this.$route.query.aid) {
      let userInfo = this.$store.state.userInfo
      if (Array.isArray(userInfo.orgIds) && userInfo.orgIds.length > 0) {
        this.formInfo.orgId = userInfo.orgIds[0]
      }
    }
  },
  methods: {
    getOrgList() {
      this.$http.post('/org/tree').then(res => {
        this.orgTree = res.payload
        this.orgTree.forEach(i => {
          if (i.children.length > 0) {
            i.children.forEach(j => {
              delete j.children
            })
          } else {
            delete i.children
          }
        })
        if (this.$route.query.aid) {
          this.geteventRoomPreview()
        }
      })
    },
    uploadImg(file) {
      let formdata = new FormData()
      formdata.append('file', this.file)
      this.$http.postForm('', formdata).then(res => {
        if (res.code === 200) {
          this.formInfo.cover = res.data.path
        }
      })
      return false
    },
    /**
     * @descripttion: 获取信息
     * @return: 信息
     */
    geteventRoomPreview() {
      this.$http
        .get('/activity/room/get?activityRoomId=' + this.$route.query.aid)
        .then(res => {
          if (res.code === SUCCESS) {
            this.formInfo = res.payload
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
          }
        })
    },
    // 保存按钮
    handleSave() {
      this.$refs['formInfo'].validate(valid => {
        if (!valid) return
        let form = JSON.parse(JSON.stringify(this.formInfo))
        if (this.$route.query.aid) {
          this.$http.post('/activity/room/update', form).then(res => {
            if (res.code === SUCCESS) {
              this.$message.success('操作成功')
              this.$router.go(-1)
            }
          })
        } else {
          this.$http.post('/activity/room/add', form).then(res => {
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
</style>
