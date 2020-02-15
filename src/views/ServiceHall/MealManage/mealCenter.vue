<!--
 * @Descripttion:助餐中心
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-15 23:09:29
 -->
<template>
  <div class="meal-center">
    <!-- 筛选 -->
    <el-row class="row-span" :gutter="40">
      <OrgTreeList
        @filterOrg="filterOrg"
        @toggleChange="toggleChange"
      ></OrgTreeList>
      <el-col class="col-span" :span="toggleWidth">
        <div class="grid-content bg-purple">
          <el-form inline ref="form" label-width="80px" size="small">
            <el-form-item label="助餐时间">
              <el-date-picker
                v-model="searchData.rangeTime"
                style="width:360px;"
                type="datetimerange"
                range-separator="至"
                @change="handlTime"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="姓名">
              <el-input
                style="width:200px"
                placeholder="请输入姓名关键字"
                v-model="searchData.serviceCustomerName"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                size="small"
                type="primary"
                @click="searchRefresh = !searchRefresh"
                icon="el-icon-search"
                >搜索</el-button
              >
              <el-button
                @click="
                  searchData = { orgId: searchData.orgId };
                  searchRefresh = !searchRefresh;
                "
                size="small"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
          <el-button
            @click="$router.push({ name: 'mealCenterAdd' })"
            v-has="'mealCenterAdd'"
            style="margin-bottom:15px"
            size="small"
            type="primary"
            >新增助餐记录</el-button
          >
          <el-button
            @click="handleExport"
            v-has="'mealCenterExport'"
            style="margin-bottom:15px"
            size="small"
            >导出助餐记录</el-button
          >
          <!-- 列表 -->
          <Table
            :rowsForamtter="rowsForamtter"
            :searchRefresh="searchRefresh"
            :searchObj="searchData"
            :columns="tableColumns"
            api="/service/customerDinnerRecord/pageSearch"
            method="post"
          >
            <template slot="customerName" slot-scope="{ row }">
              <div class="flex-t-u">
                <el-avatar
                  class="avatar"
                  size="medium"
                  :src="
                    $store.state.config.systemConfig[0].dictionaryValue +
                      row.avatar
                  "
                ></el-avatar>
                <span class="f-title">{{ row.customerName }}</span>
              </div>
            </template>
            <template slot="foodSnapshotList" slot-scope="{ row }">
              <span v-for="(item, index) in row.foodSnapshotList" :key="index">
                {{ item.foodName }}
                <span v-if="index != row.foodSnapshotList.length - 1">、</span>
              </span>
            </template>
            <template slot-scope="{ row }" slot="action">
              <el-button
                v-has="'mealCenterPreview'"
                @click="handlePreview(row)"
                type="text"
                size="small"
                >查看</el-button
              >

              <el-button
                @click="
                  $router.push({
                    name: 'mealCenterEdit',
                    query: { mid: row.recordId }
                  })
                "
                type="text"
                size="small"
                v-has="'mealCenterEdit'"
                >编辑</el-button
              >

              <el-button
                v-has="'mealCenterDelete'"
                @click="handleDelete(row)"
                type="text"
                size="small"
                >删除</el-button
              >
            </template>
          </Table>
        </div>
      </el-col>
    </el-row>
    <el-dialog title="查看助餐明细" :visible.sync="dialogFormVisible">
      <el-form
        label-suffix="："
        ref="formInfo"
        label-width="100px"
        :model="formInfo"
      >
        <el-form-item label="助餐人">
          <div class="flex-t-u">
            <el-avatar
              class="avatar"
              size="medium"
              :src="
                $store.state.config.systemConfig[0].dictionaryValue +
                  formInfo.avatar
              "
            ></el-avatar>
            <span class="f-title">{{ formInfo.customerName }}</span>
          </div>
          <!-- <div class="flex-t-u">
            <span class="f-title">{{formInfo.customerName}}</span>
          </div>-->
        </el-form-item>
        <el-form-item label="助餐时间">{{ formInfo.dinnerTime }}</el-form-item>
        <el-form-item label="助餐详情">
          <!-- <el-timeline> -->
          <!-- <el-timeline-item v-for="(item, index) in formInfo.foodSnapshotList" :key="index"> -->
          <div
            v-for="(item, index) in formInfo.foodSnapshotList"
            :key="index"
            class="flex-t-l"
          >
            <img
              class="course-avatar"
              :src="
                $store.state.config.systemConfig[0].dictionaryValue +
                  item.indexPic
              "
              alt
            />
            <div style="line-height:20px;" class="flex-column-t">
              <span class="f-title">{{ item.foodName }}</span>
              <p class="sm-title">￥{{ item.price }}</p>
            </div>
          </div>
          <!-- </el-timeline-item> -->
          <!-- </el-timeline> -->
        </el-form-item>
        <el-form-item label="共计消费">{{ formInfo.priceSum }}</el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import OrgTreeList from '@/components/OrgTreeList/OrgTreeList';

export default {
  name: 'mealCenter',
  components: {
    OrgTreeList
  },
  data () {
    return {
      toggleWidth: 19,
      searchRefresh: true,
      formInfo: {},
      dialogFormVisible: false,
      searchData: {},
      tableColumns: [
        { label: '助餐人员', slot: 'customerName', minWidth: 120 },
        { label: '助餐明细', slot: 'foodSnapshotList', minWidth: 300 },
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
          minWidth: 120
        }
      ],
      activeNames: '',
      selectActivity: []
    }
  },
  created () {},
  methods: {
    handleExport () {
      window.open(
        `${ctx}service/customerDinnerRecord/export?X-Resource=${this.$router
          .name || ''}&serviceCustomerName=${this.searchData
          .serviceCustomerName || ''}&startTime=${this.searchData.startTime ||
          ''}&endTime=${this.searchData.endTime || ''}&orgId=${this.searchData
          .orgId || ''}&token=${this.$store.state.token}`
      )
    },
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
    },
    handlTime (date) {
      if (date) {
        this.searchData.startTime = date[0]
        this.searchData.endTime = date[1]
      } else {
        this.searchData.startTime = '';
        this.searchData.endTime = '';
      }
    },
    filterOrg (val) {
      this.searchData.orgId = val
      this.searchRefresh = !this.searchRefresh
    },
    toggleChange (val) {
      this.toggleWidth = val
    },
    handleDelete (row) {
      let id = row ? [row.recordId] : []
      this.$confirm('删除后，该数据将无法恢复，是否确认？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/service/customerDinnerRecord/delete', { recordIds: id })
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
.meal-center {
  /deep/ .el-collapse-item__header {
    padding-left: 10px;
  }
  .checked {
    width: calc(100% - 30px);
    padding-left: 20px;
    height: 34px;
    line-height: 34px;
    margin: 10px 0;
    border-left: 5px solid #409eff;
    background-color: #fff;
    position: relative;
    &::after {
      position: absolute;
      top: -1px;
      right: -8px;
      display: block;
      width: 0;
      height: 0;
      content: " ";
      border-color: transparent transparent transparent #fff;
      border-style: solid;
      border-width: 18px 0 18px 8px;
    }
  }
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
