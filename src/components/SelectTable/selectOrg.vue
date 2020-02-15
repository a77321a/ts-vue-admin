<!--
 * @Descripttion:选择机构
 * @Author:
 * @Date: 2019-11-11 10:37:53
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-02-13 11:43:10
 -->
<template>
  <div id="select-org">
    <el-form>
      <el-form inline ref="form" label-width="80px" size="small">
        <el-form-item label="所在区域">
          <el-cascader
            clearable
            :props="{value:'regionId',label:'addressName',emitPath:false}"
            :options="spaceTree"
            v-model="searchData.communityRegionId"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="机构名称">
          <el-input placeholder="请输入机构名称" v-model="searchData.orgName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            @click="searchRefresh = !searchRefresh"
            icon="el-icon-search"
          >搜索</el-button>
          <el-button @click="searchData = {level:2};searchRefresh = !searchRefresh" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </el-form>
    <Table
      :selectable="selectable"
      :highlightCurrentRow="single"
      :height="$store.state.dialogHeight -100"
      :searchRefresh="searchRefresh"
      :rowsForamtter="rowsForamtter"
      :searchObj="searchData"
      :selection="single ? false : true"
      :columns="tableColumns"
      :currentChange="singleSelect"
      api="/org/pageSearch"
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
      spaceTree: [],
      searchData: { level: 2 },
      tableColumns: [
        { label: '机构名称', prop: 'orgName', align: 'left', minWidth: 100 },
        { label: '所在区域', prop: 'communityRegionName', minWidth: 150 }
      ]
    }
  },
  props: {
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
  created () {
    console.log(1)
    this.getTree()
  },
  methods: {
    getTree () {
      this.$http
        .post('/address/tree', {
          addressName: this.searchData.addressName
        })
        .then(res => {
          if (res.code === SUCCESS) {
            this.spaceTree = res.payload
          }
        })
    },
    selectable (row, index) {
      if (this.isSelected.length === 0) {
        return 1
      }
      for (let i in this.isSelected) {
        console.log(row)
        if (this.isSelected[i].serviceCustomerId === row.serviceCustomerId) {
          return 0
        } else {
          return 1
        }
      }
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
