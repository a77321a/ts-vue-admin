<!--
 * @Descripttion:服务人员
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors:
 * @LastEditTime: 2019-12-21 23:02:04
 -->
<template>
  <div class="Participants">
    <!-- 筛选 -->
    <!-- 列表 -->
    <Table
      :searchRefresh="searchRefresh"
      :searchObj="searchData"
      :columns="tableColumns"
      api="/org/service/product/pageSearch"
      method="post"
    >
      <template slot-scope="{row}" slot="orgServiceProductName">
        <div class="flex-t-l">
          <img
            class="course-avatar"
            :src="$store.state.config.systemConfig[0].dictionaryValue+row.indexPic"
            alt
          />
          <div class="flex-column-t">
            <span class="f-title">{{row.orgServiceProductName}}</span>
            <p class="sm-title">￥{{row.orgPrice||'免费'}}</p>
          </div>
        </div>
      </template>
      <template slot-scope="{row}" slot="action">
        <el-button
          @click="$router.push({name:'serviceProductEdit',query:{pid:row.orgServiceProductId}})"
          type="text"
          size="small"
        >编辑</el-button>
        <el-button @click="handleDelete(row)" type="text" size="small">删除</el-button>
      </template>
    </Table>
  </div>
</template>
<script>
export default {
  name: 'ServicePerson',
  data () {
    return {
      searchRefresh: true,
      searchData: { orgId: this.orgId },
      tableColumns: [
        { label: '产品名称', slot: 'orgServiceProductName', minWidth: 360 },
        { label: '服务类型', prop: 'orgServiceTypeName', minWidth: 200 },
        {
          label: '创建人',
          prop: 'nickName',
          minWidth: 100
        },
        {
          label: '创建时间',
          prop: 'createTime',
          minWidth: 120
        },
        {
          label: '操作',
          slot: 'action',
          fixed: 'right',
          minWidth: 80
        }
      ]
    }
  },
  props: ['orgId'],

  created () {},
  methods: {
    handleDelete (row) {
      let id = row ? [row.orgServiceProductId] : []
      this.$confirm('删除后，该产品将无法投入运营使用，是否确认？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/org/service/product/delete', { orgServiceProductIds: id })
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
.Participants {
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
