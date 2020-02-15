<!--
 * @Descripttion: 服务人员详情
 * @Author:
 * @Date: 2019-11-07 19:28:01
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2019-12-30 17:12:28
 -->
<template>
  <div id="event-room-info">
    <el-card shadow="never" class="box-card">
      <el-row :gutter="20">
        <el-col style="text-align:center" :span="4">
          <el-avatar
            v-if="serviceUserInfo.indexPic"
            :size="60"
            :src="$store.state.config.systemConfig[0].dictionaryValue + serviceUserInfo.indexPic"
          ></el-avatar>
        </el-col>
        <el-col :span="20">
          <el-row style="margin-bottom:20px" :gutter="20">
            <el-col :span="6">姓名：{{serviceUserInfo.orgServiceProviderName}}</el-col>
            <el-col :span="6">手机号：{{serviceUserInfo.telephoneNum}}</el-col>
            <el-col :span="6">性别：{{serviceUserInfo.sex == 1 ?'男':'女'}}</el-col>
            <el-col :span="6">服务范围:{{serviceUserInfo.streetName}}</el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">所属机构：{{serviceUserInfo.orgDetail.orgName}}</el-col>
            <el-col :span="6">
              服务类型：
              <span
                v-for="(item, index) in serviceUserInfo.orgServiceTypes"
                :key="index"
              >{{item.orgServiceTypeName}}</span>
            </el-col>
            <el-col :span="12">
              服务产品：
              <el-tag
                style="margin-right:5px"
                size="mini"
                v-for="(item, index) in serviceUserInfo.orgServiceProducts"
                :key="index"
                type="info"
              >{{item.orgServiceProductName}}</el-tag>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <el-tabs value="first" style="margin-top:20px;">
      <el-tab-pane label="服务活动记录" name="first">
        <eventRecords :orgServiceProviderId="$route.query.uid"></eventRecords>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import eventRecords from './serviceUserInfoTabs/eventRecords'
export default {
  name: 'serviceUserInfo',
  components: {
    eventRecords
  },
  data () {
    return {
      serviceUserInfo: {
        orgDetail: {},
        indexPic: ''
      }
    }
  },
  created () {
    this.getActivityRoomInfo()
  },
  methods: {
    getActivityRoomInfo () {
      this.$http
        .get(
          '/org/service/provider/detail?serviceProviderId=' +
            this.$route.query.uid
        )
        .then(res => {
          if (res.code === SUCCESS) {
            this.serviceUserInfo = res.payload
          }
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form-item {
  margin-bottom: 0;
  /deep/.el-form-item__label,
  /deep/.el-form-item__content {
    height: 30px !important;
    line-height: 30px !important;
  }
}
/deep/ .box-card .flex-t-l {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  img {
    float: left;
    width: 210px;
    height: 160px;
    margin-right: 15px;
    vertical-align: middle;
    flex-shrink: 0;
    object-fit: cover;
  }
  .flex-column-t {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
