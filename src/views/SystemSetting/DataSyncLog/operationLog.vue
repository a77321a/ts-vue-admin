<!--
 * @Descripttion:同步日志
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors:
 * @LastEditTime: 2019-12-09 15:34:58
 -->
<template>
  <div class="event-center">
    <!-- 筛选 -->
    <el-form inline ref="form" label-width="80px" size="small">
      <el-form-item label="操作人">
        <el-select style="width:200px" clearable v-model="searchData.operUserId" placeholder="请选择">
          <el-option
            v-for="(item, index) in userList"
            :key="index"
            :label="item.nickName"
            :value="item.userId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作模块">
        <el-select style="width:200px" clearable v-model="searchData.operModule" placeholder="请选择">
          <el-option
            v-for="(item, index) in operaModule"
            :key="index"
            :label="item.value"
            :value="item.key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="操作时间">
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
      api="/opertionLog/pageSearch "
      method="post"
    >
      <template slot-scope="{row}" slot="operUserName">{{row.operUserName}}</template>
      <template slot-scope="{row}" slot="operDesc">{{row.operDesc}}</template>

      <template slot-scope="{row}" slot="operModule">{{transLabel(operaModule,row.operModule)}}</template>
    </Table>
  </div>
</template>
<script>
export default {
  name: 'operationLog',
  data () {
    return {
      searchRefresh: true,
      searchData: {},
      tableColumns: [
        {
          label: '操作人',
          align: 'left',
          slot: 'operUserName',
          minWidth: 120
        },
        { label: '操作时间', prop: 'createTime', minWidth: 140 },
        {
          label: '操作模块',
          slot: 'operModule',
          minWidth: 100
        },
        {
          label: '操作内容',
          slot: 'operDesc',
          minWidth: 150
        }
      ],
      userList: [],
      operaModule: []
    }
  },
  created () {
    this.getUserList()
    this.getOperaModule()
  },
  methods: {
    transLabel (arr, key) {
      for (let i in arr) {
        if (arr[i].key === key) {
          return arr[i].value
        }
      }
    },
    getUserList () {
      this.$http.post('/user/pageSearch', { pageSize: MAXSIZE }).then(res => {
        if (res.code === SUCCESS) {
          this.userList = res.payload.records
        }
      })
    },
    getOperaModule () {
      this.$http.get('/opertionLog/logModules').then(res => {
        if (res.code === SUCCESS) {
          let module = res.payload.logModules
          let keys = Object.keys(module)
          let values = Object.values(module)
          this.operaModule = []
          for (let i = 0; i < keys.length; i++) {
            this.operaModule.push({ key: keys[i], value: values[i] })
          }
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
