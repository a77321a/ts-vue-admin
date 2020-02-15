<!--
 * @Descripttion:就餐记录
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors:
 * @LastEditTime : 2019-12-19 16:04:04
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
      api="/service/customerDinnerRecord/pageSearch"
      method="post"
    >
      <template slot="customerName" slot-scope="{row}">
        <div class="flex-t-u">
          <span class="f-title">{{row.customerName}}</span>
        </div>
      </template>
      <template slot="foodSnapshotList" slot-scope="{row}">
        <span v-for="(item, index) in row.foodSnapshotList" :key="index">
          {{item.foodName}}
          <span v-if="index !=row.foodSnapshotList.length - 1">、</span>
        </span>
      </template>
      <template slot-scope="{row}" slot="action">
        <el-button @click="handlePreview(row)" type="text" size="small">查看</el-button>

        <el-button
          @click="$router.push({name:'mealCenterEdit',query:{mid:row.recordId}})"
          type="text"
          size="small"
        >编辑</el-button>

        <el-button @click="handleDelete(row)" type="text" size="small">删除</el-button>
      </template>
    </Table>
    <el-dialog title="查看助餐明细" :visible.sync="dialogFormVisible">
      <el-form ref="formInfo" label-width="80px" :model="formInfo">
        <el-form-item label="助餐人：">
          <div class="flex-t-u">
            <span class="f-title">{{formInfo.customerName}}</span>
          </div>
        </el-form-item>
        <el-form-item label="助餐时间">{{formInfo.dinnerTime}}</el-form-item>
        <el-form-item label="助餐详情">
          <el-timeline>
            <el-timeline-item v-for="(item, index) in formInfo.foodSnapshotList" :key="index">
              <div class="flex-t-l">
                <img
                  class="course-avatar"
                  :src="$store.state.config.systemConfig[0].dictionaryValue+item.indexPic"
                  alt
                />
                <div style="line-height:20px;" class="flex-column-t">
                  <span class="f-title">{{item.foodName}}</span>
                  <p class="sm-title">￥{{item.price}}</p>
                </div>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-form-item>
        <el-form-item label="共计消费">{{formInfo.priceSum}}</el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'eventRecords',
  data () {
    return {
      searchData: {
        serviceCustomerId: this.serviceCustomerId
      },
      searchRefresh: true,
      formInfo: {},
      dialogFormVisible: false,
      tableColumns: [
        { label: '助餐人员', slot: 'customerName', minWidth: 200 },
        { label: '助餐明细', slot: 'foodSnapshotList', minWidth: 100 },
        { label: '助餐金额', prop: 'priceSum', minWidth: 100 },
        {
          label: '助餐时间',
          prop: 'dinnerTime',
          minWidth: 140
        },
        {
          label: '操作',
          slot: 'action',
          fixed: 'right',
          minWidth: 100
        }
      ]
    }
  },
  created () {},
  props: ['serviceCustomerId'],
  methods: {
    handlePreview (row) {
      this.formInfo = row
      this.dialogFormVisible = true
    },
    rowsForamtter (row) {
      row.forEach(i => {
        if (i.foodSnapshotList && i.foodSnapshotList.length > 0) {
          let sum = 0
          i.foodSnapshotList.forEach(j => {
            sum += j.price
          })
          i.priceSum = '￥' + sum.toFixed(2)
        }
      })
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
