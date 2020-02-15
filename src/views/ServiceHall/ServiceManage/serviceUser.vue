<!--
 * @Descripttion:服务人员
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-15 09:52:04
 -->
<template>
  <div class="service-user">
    <!-- 筛选 -->
    <el-row class="row-span" :gutter="40">
      <OrgTreeList @filterOrg="filterOrg" @toggleChange="toggleChange"></OrgTreeList>
      <el-col :span="toggleWidth">
        <div class="grid-content bg-purple">
          <el-form inline ref="form" label-width="80px" size="small">
            <el-form-item label="姓名">
              <el-input placeholder="请输入姓名关键字" v-model="searchData.orgServiceProviderName"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input placeholder="请输入手机号" v-model="searchData.telephoneNum"></el-input>
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
          <el-button
            @click="$router.push({name:'serviceUserEdit'})"
            style="margin-bottom:15px"
            size="small"
            type="primary"
            v-has="'serviceUserAdd'"
          >新增人员</el-button>
          <!-- 列表 -->
          <Table
            @commitSelection="commitSelection"
            :searchRefresh="searchRefresh"
            :searchObj="searchData"
            :selection="true"
            :columns="tableColumns"
            api="/org/service/provider/pageSearch"
            method="post"
          >
            <template slot-scope="{row}" slot="orgServiceProviderName">
              <div class="flex-t-u">
                <el-avatar
                  class="avatar"
                  size="medium"
                  :src="$store.state.config.systemConfig[0].dictionaryValue+row.indexPic"
                ></el-avatar>
                <span class="f-title">{{row.orgServiceProviderName}}</span>
              </div>
            </template>
            <template slot="sex" slot-scope="{row}">{{row.sex == 1 ?'男':'女'}}</template>
            <template slot-scope="{row}" slot="action">
              <el-button
                v-has="'serviceUserDetail'"
                @click="$router.push({name:'serviceUserDetail',query:{uid:row.orgServiceProviderId}})"
                type="text"
                size="small"
              >详情</el-button>

              <el-button
                v-has="'serviceUserEdit'"
                @click="$router.push({name:'serviceUserEdit',query:{uid:row.orgServiceProviderId}})"
                type="text"
                size="small"
              >编辑</el-button>

              <el-button
                v-has="'serviceUserDelete'"
                @click="handleDelete(row)"
                type="text"
                size="small"
              >删除</el-button>
            </template>
            <template slot="footer-left">
              <el-button
                :disabled="selectServiceUser.length == 0"
                v-has="'serviceUserDelete'"
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
  name: 'serviceUser',
  components: {
    OrgTreeList
  },
  data () {
    return {
      toggleWidth: 19,
      searchRefresh: true,
      searchData: {},
      tableColumns: [
        { label: '姓名', slot: 'orgServiceProviderName', minWidth: 140 },
        { label: '性别', slot: 'sex', minWidth: 100 },
        { label: '手机号', prop: 'telephoneNum', minWidth: 100 },
        { label: '所属机构', prop: 'orgName', minWidth: 100 },
        { label: '创建人', prop: 'createUserName', minWidth: 100 },
        { label: '创建时间', prop: 'createTime', minWidth: 140 },
        {
          label: '操作',
          slot: 'action',
          fixed: 'right',
          minWidth: 140
        }
      ],
      activeNames: '',
      selectServiceUser: []
    }
  },
  created () {
    console.log(JSON.parse(localStorage.config))
  },
  methods: {
    filterOrg (val) {
      this.searchData.orgId = val
      this.searchRefresh = !this.searchRefresh
    },
    toggleChange (val) {
      this.toggleWidth = val
    },
    // 多选  同所有表格
    commitSelection (data) {
      let arr = []
      data.forEach(i => {
        arr.push(i.orgServiceProviderId)
      })
      this.selectServiceUser = arr
    },
    // 删除
    handleDelete (row) {
      let id = row ? [row.orgServiceProviderId] : this.selectServiceUser
      this.$confirm('删除后，该服务人员将无法被关联使用，是否确认？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$http
            .post('/org/service/provider/delete', { orgServiceProviderIds: id })
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
.service-user {
  /deep/ .el-collapse-item__header {
    padding-left: 10px;
  }
  .checked {
    width: calc(100% - 30px);
    padding-left: 20px;
    height: 34px;
    line-height: 34px;
    margin: 10px 0;
    border-left: 5px solid #409eff;
    background-color: #fff;
    position: relative;
    &::after {
      position: absolute;
      top: -1px;
      right: -8px;
      display: block;
      width: 0;
      height: 0;
      content: ' ';
      border-color: transparent transparent transparent #fff;
      border-style: solid;
      border-width: 18px 0 18px 8px;
    }
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
