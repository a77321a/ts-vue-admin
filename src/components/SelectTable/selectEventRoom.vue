<!--
 * @Descripttion:选择机构
 * @Author:
 * @Date: 2019-11-11 10:37:53
 * @LastEditors:
 * @LastEditTime: 2019-11-24 13:12:17
 -->
<template>
  <div id="select-org">
    <el-form>
      <el-form inline ref="form" label-width="80px" size="small">
        <el-form-item label="所属机构">
          <el-cascader
            clearable
            :props="{value:'orgId',label:'orgName',emitPath:false}"
            :options="orgTree"
            v-model="searchData.orgId"
          ></el-cascader>
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
      :height="$store.state.dialogHeight - 200"
      :searchRefresh="searchRefresh"
      :rowsForamtter="rowsForamtter"
      :searchObj="searchData"
      :selection="single ? false : true"
      :columns="tableColumns"
      :currentChange="singleSelect"
      api="/activity/room/pageSearch"
      method="post"
    ></Table>
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
        {
          label: '活动室名称',
          prop: 'activityRoomName',
          align: 'left',
          minWidth: 100
        },
        { label: '所属机构', prop: 'orgName', minWidth: 150 }
      ],
      orgTree: []
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
    this.getOrgTree()
  },
  methods: {
    getOrgTree () {
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
