<!--
 * @Descripttion:表格组件
 * @Author:
 * @Date: 2019-11-05 10:42:51
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2019-12-25 16:20:36
 -->
<template>
  <div>
    <el-table
      style="width: 100%;border:1px solid #EBEEF5;border-bottom:none"
      :highlight-current-row="highlightCurrentRow"
      @current-change="currentChange"
      :row-key="rowKey"
      @cell-mouse-enter="cellMouseEnter"
      @cell-mouse-leave="cellMouseLeave"
      v-loading="loading"
      default-expand-all
      :height="height"
      :span-method="spanMethod"
      :data="dataSource"
      :tree-props="treeProps"
      :size="size"
      :empty-text="emptyText"
      :border="border"
      :stripe="stripe"
      :header-cell-style="headerCellStyle"
      @selection-change="handleSelectionChange"
    >
      <slot name="empty"></slot>
      <!--选择-->
      <el-table-column
        :selectable="selectable"
        :reserve-selection="false"
        align="center"
        v-if="selection"
        type="selection"
        width="55"
      ></el-table-column>
      <!--序号-->
      <!-- <el-table-column v-if="hasIndex" type="index" width="55"></el-table-column> -->
      <!--数据源-->
      <el-table-column
        v-for="column in columns"
        :sortable="column.sortable"
        :class-name="column.className"
        :column-key="columns.columnKey"
        :key="column.index"
        :header-align="column.headerAlign || 'left'"
        :prop="column.prop"
        :label="column.label"
        :min-width="column.minWidth"
        :width="column.width"
        :fixed="column.fixed"
        :render-header="column.renderHeader"
        :show-overflow-tooltip="columns.showOverflowTooltip"
        :align="column.align || 'left'"
        :resizable="resizable"
      >
        <template slot-scope="scope">
          <slot
            v-if="column.slot"
            :row="scope.row"
            :scope="scope"
            :index="scope.$index"
            :name="column.slot"
          >{{ column.slot }}</slot>
          <span>{{ scope.row[column.prop] }}</span>
        </template>
      </el-table-column>
      <!--操作-->
    </el-table>
    <div class="pagination-wrap">
      <div style="float:left;margin-top:-5px">
        <slot name="footer-left"></slot>
      </div>
      <!-- hide-on-single-page -->

      <el-pagination
        hide-on-single-page
        style="margin-top:5px;"
        @current-change="handlePage"
        @size-change="handleSizeChange"
        :total="total"
        :page-size="pageSize"
        :current-page="page"
        background
        layout="total,prev, pager, next,sizes,jumper"
        :page-sizes="[10, 20, 30, 40, 50]"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
// import MockData from './Mock'
export default {
  name: 'Table',
  data () {
    return {
      loading: false,
      resizable: false,
      selectionArr: [],
      headerCellStyle: {
        background: '#f8f8f9'
      },
      page: 1,
      total: 0,
      pageSize: 10,
      rowList: [],
      spanArr: [],
      position: 0,
      listData: [],
      dataList: this.dataArray
    }
  },
  props: {
    emptyText: {},
    dataArray: {
      type: Array,
      default: function () {
        return []
      }
    },
    stripe: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    currentChange: {
      type: Function,
      default: function () {
        return function () {}
      }
    },
    cellMouseEnter: {
      type: Function,
      default: function () {
        return function () {}
      }
    },
    cellMouseLeave: {
      type: Function,
      default: function () {
        return function () {}
      }
    },

    highlightCurrentRow: { type: Boolean },
    selectable: { type: Function },
    treeProps: {
      type: Object
    },
    getSpanArr: {
      type: Function
    },
    height: {
      type: Number
    },
    rowKey: {
      type: String
    },
    menuFor: {
      type: Function
    },
    rowsForamtter: {
      type: Function
    },
    spanMethod: {
      type: Function
    },
    searchRefresh: {
      type: Boolean
    },
    // 请求api
    api: {
      type: String,
      default: function () {
        return ''
      }
    },
    // 表格尺寸
    size: {
      type: String,
      default: function () {
        return 'small'
      }
    },
    // 是否可以选择
    selection: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    // 是否有序列项
    hasIndex: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    // 这是相应的字段展示
    columns: {
      type: Array,
      default: function () {
        return []
      },
      required: true
    },
    // 纵向边框
    border: {
      type: Boolean,
      default: function () {
        return false
      }
    },
    // 请求方式
    method: {
      type: String,
      default: function () {
        return 'get'
      }
    },
    // 请求参数
    searchObj: {
      type: Object,
      default: function () {
        return {}
      }
    },
    selectRefresh: {
      type: Boolean
    }
  },
  created () {
    if (this.api) {
      this.getList()
    }
  },
  computed: {
    dataSource: {
      get () {
        if (this.dataArray && this.dataArray.length > 0) {
          return this.dataArray
        }
        return this.dataList
      },
      set (arr) {
        this.dataList = arr
      }
    }
  },
  methods: {
    /**
     * @descripttion: 获取数据
     * @param {param} 是否重置分页
     * @return: list
     */
    getList (param) {
      this.loading = true
      if (param) {
        this.page = 1
      }
      if (this.searchObj.pageSize) {
        this.pageSize = this.searchObj.pageSize
      }
      if (this.searchObj.orgId) {
        this.searchObj.orgId = Array.isArray(this.searchObj.orgId)
          ? this.searchObj.orgId[this.searchObj.orgId.length - 1] + ''
          : this.searchObj.orgId
      }
      this.$http[this.method](
        this.api,
        Object.assign(
          {
            pageNum: this.page,
            pageSize: this.pageSize
          },
          this.searchObj
        )
      )
        .then(res => {
          this.loading = false
          if (res.code === SUCCESS) {
            this.dataSource = res.payload.records
              ? res.payload.records
              : res.payload
            if (this.menuFor) {
              this.dataSource = this.menuFor(this.dataSource)
            }
            if (this.rowsForamtter) {
              this.rowsForamtter(this.dataSource)
            }
            if (this.getSpanArr) {
              this.getSpanArr(res.payload)
            }
            this.total = Number(res.payload.total)
          }
        })
        .catch(err => {
          this.loading = false
        })
    },
    // 将选中的行发送到父组件
    handleSelectionChange (val) {
      this.selectionArr = []
      val.forEach(el => {
        this.selectionArr.push(el)
      })
      this.$emit('commitSelection', this.selectionArr)
    },
    // 分页
    handlePage (val) {
      this.page = val
      this.getList()
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getList(true)
    }
  },
  watch: {
    searchRefresh () {
      // this.selectionArr = []
      this.getList(true)
    },
    selectRefresh () {
      this.selectionArr = []
      this.getList(true)
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination-wrap {
  text-align: right;
  margin-top: 15px;
}
</style>
