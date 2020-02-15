<!--
 * @Descripttion:选择养老产品
 * @Author:
 * @Date: 2019-11-11 10:37:53
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-07 15:27:14
 -->
<template>
  <div id="select-service-object">
    <el-form>
      <el-form inline ref="form" label-width="80px" size="small">
        <el-form-item label="名称">
          <el-input placeholder="请输入养老产品名称关键字" v-model="searchData.pensionServiceProductName"></el-input>
        </el-form-item>
        <el-form-item label="产品类型">
          <el-cascader
            clearable
            :props="{value:'pensionServiceTypeId',label:'pensionServiceTypeName',emitPath:false}"
            :options="typeTree"
            v-model="searchData.pensionServiceTypeId"
          ></el-cascader>
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
    <Table
      :selectable="selectable"
      :highlightCurrentRow="single"
      @commitSelection="commitSelection"
      :height="$store.state.dialogHeight - 200"
      :searchRefresh="searchRefresh"
      :rowsForamtter="rowsForamtter"
      :searchObj="searchData"
      :selection="single ? false : true"
      :columns="tableColumns"
      :currentChange="singleSelect"
      api="/pension/service/product/pageSearch "
      method="post"
    >
      <template slot="pensionServiceProductName" slot-scope="{row}">
        <div class="flex-t-l">
          <img
            class="course-avatar"
            :src="$store.state.config.systemConfig[0].dictionaryValue+row.indexPic"
            alt
          />
          <div class="flex-column-t">
            <span class="f-title">{{row.pensionServiceProductName}}</span>
            <p class="sm-title">￥{{row.pensionPrice}}</p>
          </div>
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
      searchData: { pageSize: MAXSIZE },
      tableColumns: [
        { label: '产品名称', slot: 'pensionServiceProductName', minWidth: 200 },
        { label: '服务类型', prop: 'pensionServiceTypeName', minWidth: 100 }
      ],
      typeTree: []
    }
  },
  props: {
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
  created () {
    this.getTree()
  },
  methods: {
    selectable (row, index) {
      if (this.isSelected.length === 0) {
        return 1
      }
      for (let i in this.isSelected) {
        if (this.isSelected[i].serviceCustomerId === row.serviceCustomerId) {
          return 0
        } else {
          return 1
        }
      }
    },
    getTree () {
      this.$http.post('/pension/service/type/tree', {}).then(res => {
        if (res.code === SUCCESS) {
          this.typeTree = res.payload
          this.typeTree.forEach(i => {
            // i第一层
            if (i.children.length > 0) {
              i.children.forEach(j => {
                if (j.children.length > 0) {
                  j.children.forEach(n => {
                    delete n.children
                  })
                }
              })
            }
          })
        }
      })
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
