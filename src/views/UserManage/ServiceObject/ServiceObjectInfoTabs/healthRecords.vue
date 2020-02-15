<!--
 * @Descripttion:服务记录
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors:
 * @LastEditTime: 2019-12-11 20:25:15
 -->
<template>
  <div class="user-manage">
    <!-- 筛选 -->
    <el-form inline ref="form" label-width="80px" size="small"></el-form>
    <!-- 列表 -->
    <Table
      :searchRefresh="searchRefresh"
      :rowsForamtter="rowsForamtter"
      :searchObj="searchData"
      :selection="false"
      :columns="tableColumns"
      api="/service/customer/health/pageSearch"
      method="post"
    >
      <template
        slot="Pressure"
        slot-scope="{row}"
      >{{row.lowBloodPressure}}/{{row.highBloodPressure}}（mmHg）</template>
      <template slot="heartRate" slot-scope="{row}">{{row.heartRate}}次/min</template>
      <template slot="bloodSugar" slot-scope="{row}">{{row.bloodSugar}}mmol/l</template>

      <template slot="action" slot-scope="{row}">
        <el-button
          @click="formInfo = JSON.parse(JSON.stringify(row));dialogFormVisible = true"
          type="text"
        >编辑</el-button>
      </template>
    </Table>
    <el-dialog title="编辑健康记录" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="formInfo" label-width="80px" size="small" :model="formInfo">
        <el-form-item label="服务对象">
          <div class="flex-t-u">
            <el-avatar class="avatar" size="medium" :src="customer.avatar"></el-avatar>
            <span class="f-title">{{customer.serviceCustomerName}}</span>
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
            :max="formInfo.highBloodPressure"
          ></el-input-number>
          <span style="margin:0 5px">-</span>
          <el-input-number
            :precision="0"
            v-model="formInfo.highBloodPressure"
            controls-position="right"
            :min="formInfo.lowBloodPressure"
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
  name: 'eventRecords',
  data () {
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
      searchData: {
        serviceCustomerId: this.serviceCustomerId
      },
      tableColumns: [
        { label: '记录时间', prop: 'recordTime', minWidth: 150 },
        { label: '血压', slot: 'Pressure', minWidth: 150 },
        { label: '心率', slot: 'heartRate', minWidth: 60 },
        { label: '血糖', slot: 'bloodSugar', minWidth: 60 },
        {
          label: '操作',
          slot: 'action',
          minWidth: 60
        }
      ]
    }
  },
  created () {},
  props: ['serviceCustomerId', 'customer'],
  methods: {
    handleSaveForm () {
      this.$refs['formInfo'].validate(valid => {
        if (!valid) return
        this.$http
          .post('/service/customer/health/update', {
            bloodSugar: this.formInfo.bloodSugar,
            heartRate: this.formInfo.heartRate,
            highBloodPressure: this.formInfo.highBloodPressure,
            lowBloodPressure: this.formInfo.lowBloodPressure,
            recordTime: this.formInfo.recordTime,
            serviceCustomerHealthId: this.formInfo.serviceCustomerHealthId
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
    rowsForamtter (rows) {
      rows.forEach(row => {})
    }
  }
}
</script>
<style lang="scss" scoped>
.user-manage {
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
