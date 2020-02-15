<!--
 * @Descripttion:
 * @Author:
 * @Date: 2019-12-01 19:08:10
 * @LastEditors:
 * @LastEditTime: 2019-12-01 19:19:43
 -->
<template>
  <div class="event-center">
    <el-form inline ref="form" label-width="80px" size="small">
      <el-form-item label="所在区域">
        <el-cascader
          clearable
          :props="{value:'regionId',label:'addressName',emitPath:false}"
          :options="spaceTree"
          v-model="searchData.address"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="同步时间">
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
    <!-- 列表 -->
    <Table
      :searchRefresh="searchRefresh"
      :searchObj="searchData"
      :selection="false"
      :columns="tableColumns"
      api
      method="post"
    >
      <template slot-scope="{row}" slot="activityName">
        <div class="flex-t-l">
          <img
            class="course-avatar"
            :src="$store.state.config.systemConfig[0].dictionaryValue+row.activityIndexPic"
            alt
          />
          <div class="flex-column-t">
            <span class="f-title">{{row.activityName}}</span>
          </div>
        </div>
      </template>
      <template
        slot="activityStatus"
        slot-scope="{row}"
      >{{$store.state.config.activityStatus[row.activityStatus].dictionaryLabel}}</template>
      <template slot="joinUser" slot-scope="{row}">{{row.actualCustomerNum}}/{{row.customerNum}}</template>
    </Table>
  </div>
</template>
<script>
export default {
  name: 'mealSyncLog',
  data () {
    return {
      searchRefresh: true,
      searchData: {},
      tableColumns: [
        {
          label: '所在机构/活动室',
          key: 'activityName',
          minWidth: 200
        },
        { label: '同步任务创建时间', prop: 'activityTime', minWidth: 260 },
        {
          label: '同步任务完成时间',
          key: 'joinUser',
          minWidth: 100
        },
        {
          label: '同步结果',
          slot: 'activityStatus',
          minWidth: 150
        },
        {
          label: '同步内容',
          prop: 'createUserName',
          minWidth: 150
        }
      ],
      spaceTree: []
    }
  },
  created () {
    // this.$store.dispatch('getDictionaryManagement')
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
    handlTime (date) {
      if (date) {
        this.searchData.startTime = date[0]
        this.searchData.endTime = date[1]
      } else {
        this.searchData.startTime = ''
        this.searchData.endTime = ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.event-center {
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
