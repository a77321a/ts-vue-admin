<!--
 * @Descripttion:选择服务对象
 * @Author:
 * @Date: 2019-11-11 10:37:53
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-16 14:08:43
 -->
<template>
  <div id="select-service-object">
    <el-form>
      <el-form inline ref="form" label-width="80px" size="small">
        <el-form-item label="名称">
          <el-input placeholder="请输入服务对象名字" v-model="searchData.serviceCustomerName"></el-input>
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
    </el-form>
    <!-- :selectable="selectable" -->

    <Table
      :highlightCurrentRow="single"
      @commitSelection="commitSelection"
      :selectable="selectable"
      :height="$store.state.dialogHeight - 200"
      :searchRefresh="searchRefresh"
      :rowsForamtter="rowsForamtter"
      :searchObj="searchData"
      :selection="single ? false : true"
      :columns="tableColumns"
      :currentChange="singleSelect"
      api="/service/customer/pageSearch "
      method="post"
    >
      <template slot="userInfo" slot-scope="{row}">
        <div class="flex-t-u">
          <el-avatar
            class="avatar"
            size="medium"
            :src="$store.state.config.systemConfig[0].dictionaryValue+row.avatar"
          ></el-avatar>
          <span class="f-title">{{row.serviceCustomerName}}</span>
        </div>
      </template>
      <template
        slot="streetName"
        slot-scope="{row}"
      >{{row.cityName}}{{row.districtName}}{{row.communityName}}{{row.streetName}}</template>
    </Table>
  </div>
</template>
<script>
export default {
  name: 'selectServiceObject',
  data () {
    return {
      name: '',
      searchRefresh: true,
      selectData: [],
      searchData: { orgId: this.orgId },
      tableColumns: [
        { label: '人员姓名', slot: 'userInfo', minWidth: 100 },
        { label: '所在区域', slot: 'streetName', minWidth: 150 }
      ]
    }
  },
  props: {
    clearList: {},
    orgId: {},
    single: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    isSelected: {
      type: Array,
      default: function () {
        return []
      }
    }
  },
  watch: {
    clearList () {
      this.searchRefresh = !this.searchRefresh
    }
  },
  methods: {
    selectable (row, index) {
      if (this.isSelected && this.isSelected.length === 0) {
        return 1
      }
      if (
        this.isSelected.some(el => {
          return el.serviceCustomerId === row.serviceCustomerId
        })
      ) {
        return false
      } else {
        return true
      }
      // for (let i in this.isSelected) {
      //   if (
      //     this.isSelected[i].serviceCustomerId &&
      //     this.isSelected[i].serviceCustomerId === row.serviceCustomerId
      //   ) {
      //     return 0
      //   } else {
      //     return 1
      //   }
      // }
    },
    commitSelection (data) {
      this.$emit('selectObject', data)
    },
    singleSelect (row, orow) {
      this.$emit('selectObject', row)
    },
    rowsForamtter (row) {}
  }
}
</script>
<style lang="scss" scoped>
</style>
