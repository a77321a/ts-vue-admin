<!--
 * @Descripttion:服务对象
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-02-13 12:00:42
 -->
<template>
  <div class="serviceObject">
    <!-- 筛选 -->
    <el-form inline ref="form" label-width="80px" size="small">
      <el-form-item label="所在区域">
        <el-cascader
          clearable
          @change="changeArea"
          :props="{value:'regionId',label:'addressName',}"
          :options="spaceTree"
          v-model="searchData.addressList"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input placeholder="请输入姓名关键字" v-model="searchData.serviceCustomerName"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input placeholder="请输入活动名称关键字" v-model="searchData.mobile"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          @click="searchRefresh = !searchRefresh"
          icon="el-icon-search"
        >搜索</el-button>
        <el-button @click="searchData = {};searchRefresh = !searchRefresh" size="small">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button
      @click="$router.push({name:'serviceObjectAdd'})"
      style="margin-bottom:15px"
      size="small"
      type="primary"
      v-has="'serviceObjectAdd'"
    >新增对象</el-button>
    <el-button v-has="'serviceObjectExport'" @click="exportExcel" size="small">导出数据</el-button>
    <!-- 列表 -->
    <Table
      @commitSelection="commitSelection"
      :rowsForamtter="rowsForamtter"
      :searchRefresh="searchRefresh"
      :searchObj="searchData"
      :selection="true"
      :columns="tableColumns"
      api="/service/customer/pageSearch"
      method="post"
    >
      <template slot-scope="{row}" slot="serviceCustomerName">
        <div class="flex-t-u">
          <el-avatar
            class="avatar"
            size="medium"
            :src="$store.state.config.systemConfig[0].dictionaryValue+row.avatar"
          ></el-avatar>
          <span class="f-title">{{row.serviceCustomerName}}</span>
        </div>
      </template>
      <template slot-scope="{row}" slot="gender">
        <div>{{row.gender == 1 ?'男':'女'}}</div>
      </template>
      <template slot-scope="{row}" slot="streetName">
        <div>{{row.cityName+row.districtName+row.communityName+row.streetName+row.address}}</div>
      </template>
      <template slot-scope="{row}" slot="emergencyList">
        <span v-for="(item, index) in row.emergencyList" :key="index">
          <span>{{item.mobile}}</span>
          <span v-if="index !=row.emergencyList.length -1">、</span>
        </span>
      </template>
      <template slot-scope="{row}" slot="handleColumn">
        <el-button
          @click="$router.push({name:'serviceObjectDetail',query:{sid:row.serviceCustomerId}})"
          type="text"
          size="small"
          v-has="'serviceObjectDetail'"
        >详情</el-button>
        <el-button
          v-has="'agencyManageHealthy'"
          @click="formInfo = row;dialogFormVisible = true"
          type="text"
          size="small"
        >健康管理</el-button>
        <el-button
          @click="$router.push({name:'serviceObjectEdit',query:{sid:row.serviceCustomerId}})"
          type="text"
          size="small"
          v-has="'serviceObjectEdit'"
        >编辑</el-button>
        <el-button
          type="text"
          v-has="'serviceObjectDelete'"
          @click="handleDelete(row)"
          size="small"
        >删除</el-button>
      </template>
      <template slot="footer-left">
        <el-button
          :disabled="selectServiceObject.length == 0"
          @click="handleDelete(null)"
          v-has="'serviceObjectDelete'"
          type="text"
        >删除</el-button>
      </template>
    </Table>
    <el-dialog title="添加健康记录" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="formInfo" label-width="80px" size="small" :model="formInfo">
        <el-form-item label="服务对象">
          <div class="flex-t-u">
            <el-avatar
              class="avatar"
              size="medium"
              :src="$store.state.config.systemConfig[0].dictionaryValue+formInfo.avatar"
            ></el-avatar>
            <span class="f-title">{{formInfo.serviceCustomerName}}</span>
          </div>
        </el-form-item>
        <el-form-item label="记录时间" prop="recordTime">
          <el-date-picker
            v-model="formInfo.recordTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="血压" prop="highBloodPressure">
          <el-input-number
            :precision="0"
            v-model="formInfo.lowBloodPressure"
            controls-position="right"
            :min="0"
          ></el-input-number>
          <span style="margin:0 5px">-</span>
          <el-input-number
            :precision="0"
            v-model="formInfo.highBloodPressure"
            controls-position="right"
            :min="0"
          ></el-input-number>mmHg
        </el-form-item>
        <el-form-item label="心率" prop="heartRate">
          <el-input-number
            :precision="0"
            v-model="formInfo.heartRate"
            controls-position="right"
            :min="0"
          ></el-input-number>次/min
        </el-form-item>
        <el-form-item label="血糖" prop="bloodSugar">
          <el-input-number
            :precision="1"
            v-model="formInfo.bloodSugar"
            controls-position="right"
            :min="0"
          ></el-input-number>mmol/l
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
export default {
  name: 'serviceObject',
  data() {
    const validBlood = (rules, value, callback) => {
      if (!this.formInfo.highBloodPressure || !this.formInfo.lowBloodPressure) {
        callback(new Error('请输入血压信息'))
      } else {
        callback()
      }
    }
    return {
      dialogFormVisible: false,
      formInfo: {},
      rules: {
        highBloodPressure: [
          { required: true, validator: validBlood, trigger: 'blur' }
        ],
        heartRate: [
          { required: true, message: '请输入心率信息', trigger: 'blur' }
        ],
        recordTime: [
          { required: true, message: '请选择记录时间', trigger: 'change' }
        ],
        bloodSugar: [
          { required: true, message: '请输入血糖信息', trigger: 'blur' }
        ]
      },
      searchRefresh: true,
      searchData: {},
      tableColumns: [
        { label: '姓名', slot: 'serviceCustomerName', minWidth: 200 },
        { label: '性别', slot: 'gender', minWidth: 150 },
        {
          label: '手机号',
          prop: 'mobile',
          minWidth: 100
        },
        // {
        //   label: '状态',
        //   prop: 'mobile',
        //   minWidth: 100
        // },
        {
          label: '紧急联系电话',
          prop: 'emergencyMobile',
          minWidth: 150
        },
        {
          label: '所在区域',
          slot: 'streetName',
          minWidth: 150
        },
        {
          label: '创建人',
          prop: 'createUserName',
          minWidth: 100
        },
        {
          label: '创建时间',
          prop: 'createTime',
          minWidth: 150
        },
        {
          label: '操作',
          slot: 'handleColumn',
          fixed: 'right',
          minWidth: 200
        }
      ],

      selectServiceObject: [],
      spaceTree: []
    }
  },
  created() {
    this.getTree()
  },
  methods: {
    rowsForamtter(rows) {
      rows.forEach(i => {
        console.log(JSON.parse(i.emergencySelect))
        if (JSON.parse(i.emergencySelect).length == 0) {
          console.log(i.emergencyManual)
          i.emergencyMobile = JSON.parse(i.emergencyManual)[0].mobile
        }
      })
    },
    exportExcel() {
      window.open(
        `${ctx}/service/customer/export?serviceCustomerName=${this.searchData
          .serviceCustomerName || ''}&mobile=${this.searchData.mobile ||
          ''}&cityId=${this.searchData.cityId || ''}&districtId=${this
          .searchData.districtId || ''}&streetId=${this.searchData.streetId ||
          ''}&communityId=${this.searchData.communityId || ''}&token=${
          this.$store.state.token
        }`
      )
    },
    changeArea(area) {
      if (area) {
        this.searchData.cityId = area[0]
        this.searchData.districtId = area[1]
        this.searchData.communityId = area[2]
      } else {
        this.searchData.cityId = ''
        this.searchData.districtId = ''
        this.searchData.communityId = ''
      }
    },
    getTree() {
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
    handleSaveForm() {
      this.$refs['formInfo'].validate(valid => {
        if (!valid) return
        this.$http
          .post('/service/customer/health/add', {
            bloodSugar: this.formInfo.bloodSugar,
            heartRate: this.formInfo.heartRate,
            highBloodPressure: this.formInfo.highBloodPressure,
            lowBloodPressure: this.formInfo.lowBloodPressure,
            recordTime: this.formInfo.recordTime,
            serviceCustomerId: this.formInfo.serviceCustomerId
          })
          .then(res => {
            if (res.code === SUCCESS) {
              this.$message.success('操作成功')
              this.searchRefresh = !this.searchRefresh
              this.dialogFormVisible = false
            }
          })
      })
    },
    commitSelection(data) {
      let arr = []
      data.forEach(i => {
        arr.push(i.serviceCustomerId)
      })
      this.selectServiceObject = arr
    },
    handleDelete(row) {
      let id = row ? [row.serviceCustomerId] : this.selectServiceObject
      this.$confirm('删除后，该服务对象将被移除，是否确认？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/service/customer/delete', {
              serviceCustomerIdList: id
            })
            .then(res => {
              if (res.code === SUCCESS) {
                this.$message.success('操作成功')
                this.searchRefresh = !this.searchRefresh
              }
            })
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.serviceObject {
  .el-date-editor.el-input,
  .el-date-editor.el-input__inner {
    width: 193px;
  }
  .el-input--small {
    width: 193px;
  }
  .pages {
    text-align: center;
    margin: 15px 0;
  }
  .warning-row {
    background-color: #f2f2f2;
  }
}
</style>
