<!--
 * @Descripttion:选择服务人员
 * @Author:
 * @Date: 2019-11-11 10:37:53
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-16 09:57:39
 -->
<template>
  <div id="select-service-object">
    <el-form>
      <el-form inline ref="form" label-width="80px" size="small">
        <el-form-item label="名称">
          <el-input placeholder="请输入服务人员名称" v-model="searchData.orgServiceProviderName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            @click="searchRefresh = !searchRefresh"
            icon="el-icon-search"
          >搜索</el-button>
          <el-button
            @click="
              searchData.orgServiceProviderName = '';
              searchRefresh = !searchRefresh;
            "
            size="small"
          >重置</el-button>
        </el-form-item>
      </el-form>
    </el-form>
    <!-- :selectable="selectable" -->

    <Table
      :highlightCurrentRow="single"
      @commitSelection="commitSelection"
      :selectable="selectable"
      :currentChange="singleSelect"
      :height="$store.state.dialogHeight - 200"
      :searchRefresh="searchRefresh"
      :rowsForamtter="rowsForamtter"
      :searchObj="searchData"
      :selection="single ? false : true"
      :columns="tableColumns"
      api="/org/service/provider/pageSearch"
      method="post"
    >
      <template slot="userInfo" slot-scope="{ row }">
        <div class="flex-t-u">
          <el-avatar
            class="avatar"
            size="medium"
            :src="
              $store.state.config.systemConfig[0].dictionaryValue + row.indexPic
            "
          ></el-avatar>
          <span class="f-title">{{ row.orgServiceProviderName }}</span>
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
      searchData: {
        orgId: Array.isArray(this.orgId)
          ? this.orgId[this.orgId.length - 1]
          : this.orgId
      },
      tableColumns: [
        { label: '服务人员', slot: 'userInfo', minWidth: 200 },
        { label: '所属机构', prop: 'orgName', minWidth: 150 }
      ]
    }
  },
  watch: {
    clearList () {
      this.searchRefresh = !this.searchRefresh
      this.selectable()
    },
    orgId (val) {
      this.searchData.orgId = val
      this.searchRefresh = !this.searchRefresh
    }
  },
  props: {
    orgId: {},
    clearList: {},
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
  methods: {
    singleSelect (row, orow) {
      this.$emit('selectObject', row)
    },
    selectable (row, index) {
      if (this.isSelected.length === 0) {
        return true
      }
      if (
        this.isSelected.some(el => {
          return el.orgServiceProviderId === row.orgServiceProviderId
        })
      ) {
        return false
      } else {
        return true
      }
      // for (let i in this.isSelected) {
      //   console.log(this.isSelected[i])

      //   if (
      //     this.isSelected[i].orgServiceProviderId &&
      //     this.isSelected[i].orgServiceProviderId === row.orgServiceProviderId
      //   ) {
      //     return 0
      //   } else {
      //     return 1
      //   }
      // }
    },
    commitSelection (data) {
      this.selectData = data
      this.$emit('selectUser', data)
    },
    rowsForamtter (row) {}
  }
}
</script>
<style lang="scss" scoped></style>
