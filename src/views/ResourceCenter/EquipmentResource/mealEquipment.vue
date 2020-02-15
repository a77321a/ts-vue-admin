<!--
 * @Descripttion:计数
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors:
 * @LastEditTime : 2019-12-19 15:58:02
 -->
<template>
  <div class="event-center">
    <!-- 筛选 -->
    <el-form inline ref="form" label-width="80px" size="small">
      <el-form-item label="所属机构">
        <el-cascader
          clearable
          :props="{value:'orgId',label:'orgName',emitPath:false}"
          :options="orgTree"
          v-model="searchData.orgId"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="设备名称">
        <el-input style="width:200px" placeholder="请输入设备名称关键字" v-model="searchData.deviceName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          @click="searchRefresh = !searchRefresh"
          icon="el-icon-search"
        >搜索</el-button>
        <el-button
          @click="searchData = {deviceType:3};searchRefresh = !searchRefresh"
          size="small"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <el-button
      @click="$router.push({name:'mealEquipmentAdd',query:{deviceType:3}})"
      style="margin-bottom:15px"
      size="small"
      type="primary"
      v-has="'mealEquipmentAdd'"
    >新增设备</el-button>
    <!-- 列表 -->
    <Table
      @commitSelection="commitSelection"
      :searchRefresh="searchRefresh"
      :searchObj="searchData"
      :selection="true"
      :columns="tableColumns"
      api="/device/pageSearch"
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
      <template slot-scope="{row}" slot="handleColumn">
        <el-button
          type="text"
          v-has="'mealEquipmentEdit'"
          @click="$router.push({name:'mealEquipmentEdit',query:{deviceType:3,deviceId:row.deviceId}})"
          size="small"
        >编辑</el-button>
        <el-button
          v-has="'mealEquipmentDelete'"
          @click="handleDelete(row)"
          type="text"
          size="small"
        >删除</el-button>
      </template>
      <template slot="footer-left">
        <el-button
          :disabled="selectDevice.length == 0"
          v-has="'mealEquipmentDelete'"
          @click="handleDelete(null)"
          type="text"
        >删除</el-button>
      </template>
    </Table>
  </div>
</template>
<script>
export default {
  name: 'userManage',
  data () {
    return {
      searchRefresh: true,
      selectType: 1,
      searchData: { deviceType: 3 },
      tableColumns: [
        {
          label: '设备名称',
          prop: 'deviceName',
          minWidth: 200
        },
        { label: '设备厂家', prop: 'factory', minWidth: 260 },
        {
          label: '设备型号',
          prop: 'model',
          minWidth: 100
        },
        {
          label: '数据同步地址',
          prop: 'dataSyncAddress',
          minWidth: 150
        },
        {
          label: '所在位置',
          prop: 'orgName',
          minWidth: 150
        },
        {
          label: '创建人',
          prop: 'createUserName',
          minWidth: 100
        },
        {
          label: '创建时间',
          prop: 'createTime',
          minWidth: 150
        },
        {
          label: '操作',
          slot: 'handleColumn',
          fixed: 'right',
          minWidth: 100
        }
      ],
      selectDevice: [],
      orgTree: []
    }
  },
  created () {
    this.getOrgTree()

    // this.$store.dispatch('getDictionaryManagement')
  },
  watch: {
    selectType () {
      this.$set(this.searchData, 'orgName', '')
      this.$set(this.searchData, 'activityRoomName', '')
    }
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
          console.log(this.orgTree)
        }
      })
    },
    commitSelection (data) {
      let arr = []
      data.forEach(i => {
        arr.push(i.deviceId)
      })
      this.selectDevice = arr
    },
    handleDelete (row) {
      let id = row ? [row.deviceId] : this.selectDevice
      this.$confirm(
        '删除后，该设备所属机构无法同步助餐人员记录信息，是否确认？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$http.post('/device/delete', { deviceIds: id }).then(res => {
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
