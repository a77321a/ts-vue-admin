<!--
 * @Descripttion:新增、编辑助餐记录
 * @Author:
 * @Date: 2019-11-07 18:03:59
 * @LastEditors:
 * @LastEditTime: 2019-12-10 20:53:11
 -->
<template>
  <div id="edit-event">
    <div class="title">基本信息</div>
    <el-form
      style="width:900px"
      ref="formInfo"
      :rules="rules"
      :model="formInfo"
      label-width="100px"
      size="medium"
    >
      <el-form-item label="助餐人员" prop="customerId">
        <el-tag v-show="checkedObject.serviceCustomerId" style="margin-right:10px" closable>
          <img
            :size="22"
            style="vertical-align: middle;margin-right:5px;width:22px;height:22px;border-radius: 50%;"
            :src="
              $store.state.config.systemConfig[0].dictionaryValue +
                checkedObject.avatar
            "
          />
          <span style="vertical-align: middle;">
            {{
            checkedObject.serviceCustomerName
            }}
          </span>
        </el-tag>
        <el-button size="small" @click="dialogServiceObject = true" icon="el-icon-plus">
          {{
          checkedObject.serviceCustomerId ? "重新选择人员" : "选择人员"
          }}
        </el-button>
      </el-form-item>
      <el-form-item label="助餐机构" prop="orgId">
        <el-cascader
          clearable
          :props="{ value: 'orgId', label: 'orgName', emitPath: false }"
          :options="orgTree"
          v-model="formInfo.orgId"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="助餐时间" prop="dinnerTime">
        <el-date-picker
          class="datepicker"
          style="width:200px;margin-right:5px;"
          v-model="formInfo.dinnerTime"
          type="datetime"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="选择日期"
        ></el-date-picker>
        <el-select style="width:150px;" v-model="formInfo.dinnerType" placeholder="请选择助餐时段">
          <el-option label="早餐" :value="1"></el-option>
          <el-option label="中餐" :value="2"></el-option>
          <el-option label="晚餐" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="助餐详情" prop="foodSnapshotList">
        <el-button @click="dialogFood = true" type="primary">新增助餐</el-button>
        <Table style="margin:5px 0;" :dataArray="formInfo.foodSnapshotList" :columns="tableColumns">
          <template slot-scope="{ row }" slot="foodName">
            <div class="flex-t-l">
              <img
                class="course-avatar"
                :src="
                  $store.state.config.systemConfig[0].dictionaryValue +
                    row.indexPic
                "
                alt
              />
              <div class="flex-column-t">
                <span class="f-title">{{ row.foodName }}</span>
                <p class="sm-title">￥{{ row.price }}</p>
              </div>
            </div>
          </template>
          <template slot="foodType" slot-scope="{ row }">
            {{
            $func.transLabel($store.state.config.foodType, row.foodType)
            }}
          </template>
          <template slot="action" slot-scope="{ row, index }">
            <el-button size="small" @click="handleRemove(index)" type="text">删除</el-button>
          </template>
        </Table>
        <span v-if="formInfo.foodSnapshotList.length">共计消费：￥{{ this.priceSum.toFixed(2) }}</span>
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
        :single="true"
        :isSelected="[checkedObject]"
        @selectObject="selectObject"
      ></selectServiceObject>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            dialogServiceObject = false;
            checkedObject = {};
          "
        >取 消</el-button>
        <el-button type="primary" @click="handleSaveSelectObject">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog width="60%" lock-scroll destroy-on-close title="选择菜品" :visible.sync="dialogFood">
      <selectFood @selectFood="selectFood"></selectFood>
      <span slot="footer" class="dialog-footer">
        <el-button
          @click="
            dialogFood = false;
            selectFoodList = {};
          "
        >取 消</el-button>
        <el-button type="primary" @click="handleSaveSelectFood">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import selectServiceObject from '../../../components/SelectTable/selectServiceObject.vue'
import selectFood from '../../../components/SelectTable/selectFood.vue'

export default {
  name: 'mealCenterEdit',
  components: {
    selectServiceObject,
    selectFood
  },
  data () {
    const validatorTime = (rule, value, callback) => {
      if (this.formInfo.dinnerTime !== '' && this.formInfo.dinnerType === '') {
        callback(new Error('请选择助餐时段'))
      } else if (this.formInfo.dinnerTime === '') {
        callback(new Error('请选择助餐时间'))
      } else {
        callback()
      }
    }
    return {
      tableColumns: [
        { label: '菜品名称', slot: 'foodName', minWidth: 300 },
        { label: '菜品类型', slot: 'foodType', minWidth: 150 },
        { label: '操作', slot: 'action', minWidth: 60 }
      ],
      formInfo: {
        checkedObject: {},
        foodSnapshotList: [],
        customerId: '',
        dinnerTime: '',
        dinnerType: 1,
        orgId: ''
      },
      priceSum: 0,
      rules: {
        customerId: [
          { required: true, message: '请选择助餐对象', trigger: 'change' }
        ],
        dinnerTime: [{ required: true, validator: validatorTime }],
        orgId: [
          { required: true, message: '请选择所属机构', trigger: 'change' }
        ],
        foodSnapshotList: [
          { required: true, message: '请添加助餐记录', trigger: 'change' }
        ]
      },
      dialogServiceObject: false,
      dialogFood: false,
      checkedObject: {},
      templateObj: {},
      orgTree: [],
      selectFoodList: []
    }
  },
  created () {
    if (this.$route.query.mid) {
      this.getMealInfo()
    }
    this.getOrgList()
  },
  methods: {
    getMealInfo () {
      this.$http
        .get(
          '/service/customerDinnerRecord/get?recordId=' + this.$route.query.mid
        )
        .then(res => {
          if (res.code === SUCCESS) {
            this.formInfo = res.payload
            this.checkedObject = res.payload.customerEntity
            this.formInfo.customerId =
              res.payload.customerEntity.serviceCustomerId
            this.priceSum = 0
            this.formInfo.foodSnapshotList.forEach(i => {
              this.priceSum = i.price * 10 + this.priceSum
            })
            this.priceSum = this.priceSum / 10
          }
        })
    },
    handleRemove (index) {
      this.formInfo.foodSnapshotList.splice(index, 1)
      this.priceSum = 0
      this.formInfo.foodSnapshotList.forEach(i => {
        this.priceSum = i.price * 10 + this.priceSum
      })
      this.priceSum = this.priceSum / 10
    },
    selectFood (data) {
      this.selectFoodList = data
    },
    handleSaveSelectFood () {
      if (this.selectFoodList.length === 0) {
        this.$message.error('请至少选择一个菜品')
        return false
      }
      this.formInfo.foodSnapshotList = this.formInfo.foodSnapshotList.concat(
        this.selectFoodList
      )
      this.priceSum = 0
      this.formInfo.foodSnapshotList.forEach(i => {
        this.priceSum = i.price * 10 + this.priceSum
      })
      this.priceSum = this.priceSum / 10
      this.dialogFood = false
      console.log(this.formInfo)
    },
    getOrgList () {
      this.$http.post('/org/tree').then(res => {
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
    /**
     * @descripttion: 选择服务对象
     * @param {type}
     * @return:
     */
    selectObject (data) {
      this.templateObj = data
    },
    handleSaveSelectObject () {
      if (!this.templateObj.serviceCustomerId) {
        this.$message.error('请选择服务对象')
        return false
      }
      this.checkedObject = this.templateObj
      this.formInfo.customerId = this.templateObj.serviceCustomerId
      this.dialogServiceObject = false
    },
    uploadImg (file) {
      let formdata = new FormData()
      formdata.append('file', this.file)
      this.$http.postForm('', formdata).then(res => {
        if (res.code === 200) {
          this.formInfo.cover = res.data.path
        }
      })
      return false
    },
    // 保存按钮
    handleSave () {
      this.$refs['formInfo'].validate(valid => {
        if (!valid) return
        let foodIds = []
        let url = this.$route.query.mid
          ? '/service/customerDinnerRecord/update'
          : '/service/customerDinnerRecord/add'
        this.formInfo.foodSnapshotList.forEach(i => {
          foodIds.push(i.foodId)
        })
        this.$http
          .post(url, {
            recordId: this.$route.query.mid,
            customerId: this.formInfo.customerId,
            dinnerTime: this.formInfo.dinnerTime,
            dinnerType: this.formInfo.dinnerType,
            foodIds: foodIds,
            orgId: this.formInfo.orgId
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
/deep/ .el-table__header th {
  padding: 0 !important;
  height: 40px;
}
</style>
