<!--
 * @Descripttion:活动室
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors:
 * @LastEditTime: 2019-12-21 22:41:25
 -->
<template>
  <div class="event-room">
    <!-- 筛选 -->
    <el-row class="row-span" :gutter="40">
      <OrgTreeList @filterOrg="filterOrg" @toggleChange="toggleChange"></OrgTreeList>
      <el-col class="col-span" :span="toggleWidth">
        <div class="grid-content bg-purple">
          <el-form inline ref="form" label-width="90px" size="small">
            <el-form-item label="活动室名称">
              <el-input placeholder="请输入活动室名称关键字" v-model="searchData.activityRoomName"></el-input>
            </el-form-item>
            <el-form-item label="活动室编号">
              <el-input placeholder="请输入活动室编号关键字" v-model="searchData.activityRoomCode"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                size="small"
                type="primary"
                @click="searchRefresh = !searchRefresh"
                icon="el-icon-search"
              >搜索</el-button>
              <el-button
                @click="searchData = {orgId:searchData.orgId};searchRefresh = !searchRefresh"
                size="small"
              >重置</el-button>
            </el-form-item>
          </el-form>
          <el-button
            @click="$router.push({name:'eventRoomAdd'})"
            style="margin-bottom:15px"
            size="small"
            v-has="'eventRoomAdd'"
            type="primary"
          >新增活动室</el-button>
          <!-- 列表 -->
          <Table
            :searchRefresh="searchRefresh"
            :searchObj="searchData"
            :columns="tableColumns"
            api="/activity/room/pageSearch"
            method="post"
          >
            <template
              slot="activityRoomName"
              slot-scope="{row}"
            >{{row.activityRoomName}}（{{row.activityRoomCode}}）</template>
            <template slot-scope="{row}" slot="action">
              <el-button
                @click="$router.push({name:'eventRoomPreview',query:{aid:row.activityRoomId}})"
                type="text"
                size="small"
                v-has="'eventRoomPreview'"
              >查看</el-button>

              <el-button
                @click="$router.push({name:'eventRoomEdit',query:{aid:row.activityRoomId}})"
                type="text"
                size="small"
                v-has="'eventRoomEdit'"
              >编辑</el-button>

              <el-button
                v-has="'eventRoomDelete'"
                @click="handleDelete(row)"
                type="text"
                size="small"
              >删除</el-button>
            </template>
            <template slot="footer-left">
              <el-button
                :disabled="selectRoom.length == 0"
                v-has="'eventRoomDelete'"
                @click="handleDelete(null)"
                type="text"
              >删除</el-button>
            </template>
          </Table>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import OrgTreeList from '@/components/OrgTreeList/OrgTreeList'
export default {
  name: 'eventRoom',
  components: {
    OrgTreeList
  },
  data () {
    return {
      toggleWidth: 19,
      searchRefresh: true,
      searchData: {},
      tableColumns: [
        { label: '活动室名称', slot: 'activityRoomName', minWidth: 200 },
        { label: '所属机构', prop: 'orgName', minWidth: 100 },
        {
          label: '创建人',
          prop: 'createUserName',
          minWidth: 100
        },
        {
          label: '创建时间',
          prop: 'createTime',
          minWidth: 100
        },
        {
          label: '操作',
          slot: 'action',
          fixed: 'right',
          minWidth: 100
        }
      ],
      activeNames: '',
      selectRoom: []
    }
  },
  created () {},
  methods: {
    filterOrg (val) {
      this.searchData.orgId = val
      this.searchRefresh = !this.searchRefresh
    },
    toggleChange (val) {
      this.toggleWidth = val
    },
    handleDelete (row) {
      let id = row ? [row.activityRoomId] : this.selectRoom
      this.$confirm('删除后，该活动室将无法投入运营使用，是否确认？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/activity/room/delete', { activityRoomIdList: id })
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
.event-room {
  .row-span {
    margin: 0 !important;
  }
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
