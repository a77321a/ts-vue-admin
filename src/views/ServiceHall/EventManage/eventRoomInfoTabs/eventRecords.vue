<!--
 * @Descripttion:活动中心
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-21 13:52:39
 -->
<template>
  <div class="user-manage">
    <!-- 筛选 -->
    <el-form inline ref="form" label-width="80px" size="small">
      <el-form-item label="活动状态">
        <el-select
          style="width:200px"
          clearable
          v-model="searchData.activityStatus"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in $store.state.config.activityStatus"
            :key="index"
            :label="item.dictionaryLabel"
            :value="item.dictionaryValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="活动时间">
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
      <el-form-item label="活动名称">
        <el-input style="width:200px" placeholder="请输入活动名称关键字" v-model="searchData.activityName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          @click="searchRefresh = !searchRefresh"
          icon="el-icon-search"
        >搜索</el-button>
        <el-button
          @click="searchData = {activityRoomId: activityRoomId};searchRefresh = !searchRefresh"
          size="small"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 列表 -->
    <Table
      @commitSelection="commitSelection"
      :searchRefresh="searchRefresh"
      :rowsForamtter="rowsForamtter"
      :searchObj="searchData"
      :selection="true"
      :columns="tableColumns"
      api="/activity/pageSearch"
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
      >{{$func.transLabel($store.state.config.activityStatus,row.activityStatus)}}</template>
      <template slot="number" slot-scope="{row}">{{row.actualCustomerNum}}/{{row.customerNum}}</template>
      <template slot-scope="{row}" slot="handleColumn">
        <el-button
          @click="$router.push({name:'eventCenterPreview',query:{aid:row.activityId}})"
          type="text"
          size="small"
        >查看</el-button>

        <el-button
          v-if="row.activityStatus < 2"
          @click="$router.push({name:'eventCenterEdit',query:{aid:row.activityId}})"
          type="text"
          size="small"
        >编辑</el-button>

        <el-button
          v-if="row.activityStatus == 1"
          @click="handleCloseActivity(row)"
          type="text"
          size="small"
        >结束活动</el-button>
        <span v-if="row.activityStatus==1">-</span>
        <el-button
          @click="$router.push({name:'eventCenterSummary',query:{aid:row.activityId}})"
          v-if="row.activityStatus > 1"
          type="text"
          size="small"
        >总结活动</el-button>
        <el-button @click="handleDelete(row)" type="text" size="small">删除</el-button>
      </template>
      <template slot="footer-left">
        <el-button :disabled="selectActivity.length == 0" @click="handleDelete(null)" type="text">删除</el-button>
      </template>
    </Table>
  </div>
</template>
<script>
export default {
  name: 'eventRecords',
  data () {
    return {
      searchRefresh: true,
      searchData: {
        activityRoomId: this.activityRoomId
      },
      tableColumns: [
        { label: '活动名称', slot: 'activityName', minWidth: 150 },
        { label: '活动时间', prop: 'activityTime', minWidth: 260 },
        {
          label: '参与人员',
          slot: 'number',
          minWidth: 100
        },
        {
          label: '活动状态',
          slot: 'activityStatus',
          minWidth: 150
        },
        {
          label: '创建人',
          prop: 'createUserName',
          minWidth: 150
        },
        {
          label: '操作',
          slot: 'handleColumn',
          fixed: 'right',
          minWidth: 240
        }
      ],
      userList: [],
      limit: 10,
      limit2: 10,
      dialogVisible: false,
      searchCourse: {},
      mobile: '',
      selectActivity: []
    }
  },
  created () {},
  props: ['activityRoomId'],
  methods: {
    rowsForamtter (rows) {
      rows.forEach(row => {
        row.activityTime = row.startTime + '~' + row.endTime
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
    },
    commitSelection (data) {
      let arr = []
      data.forEach(i => {
        arr.push(i.activityId)
      })
      this.selectActivity = arr
    },
    handleDelete (row) {
      let id = row ? [row.activityId] : this.selectActivity
      this.$confirm('删除后，该数据将数据将无法恢复，是否确认？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http.post('/activity/delete', { activityIds: id }).then(res => {
            if (res.code === 200) {
              this.$message.success('操作成功')
              this.searchRefresh = !this.searchRefresh
            }
          })
        })
        .catch(() => {})
    },
    handleCloseActivity (row) {
      let id = row ? [row.activityId] : this.selectActivity.join(',')
      let content = '是否要提前结束活动？'
      this.$confirm(content, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post(`/activity/close`, {
              activityIdList: id
            })
            .then(res => {
              if (res.code === SUCCESS) {
                this.$message({
                  type: 'success',
                  message: '操作成功!'
                })
              }
            })
        })
        .catch(() => {})
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
