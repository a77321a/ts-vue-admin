<!--
 * @Descripttion: 活动详情
 * @Author:
 * @Date: 2019-11-07 19:28:01
 * @LastEditors:
 * @LastEditTime: 2019-12-08 11:38:07
 -->
<template>
  <div id="event-info">
    <el-card shadow="never" class="box-card">
      <img
        class="status-img"
        :src="
          eventCenterPreview.activityStatus == 2
            ? summary
            : eventCenterPreview.activityStatus == 1
            ? going
            : ''
        "
        alt
      />
      <div class="flex-t-l">
        <img
          :src="
            $store.state.config.systemConfig[0].dictionaryValue +
              eventCenterPreview.activityIndexPic
          "
          alt
        />
        <div class="flex-column-t">
          <h4 style="margin-bottom:10px;margin-top:5px">{{ eventCenterPreview.activityName }}</h4>
          <el-form label-position="left" ref="form" :model="eventCenterPreview" label-width="100px">
            <el-form-item>
              <template slot="label">
                <i class="el-icon-alarm-clock"></i>活动时间：
              </template>
              {{ eventCenterPreview.startTime }}~{{ eventCenterPreview.endTime }}
            </el-form-item>
            <el-form-item>
              <template slot="label">
                <i class="el-icon-location-outline"></i>活动地点：
              </template>
              {{ eventCenterPreview.activityAddress }}
            </el-form-item>
            <el-form-item>
              <template slot="label">
                <i class="el-icon-office-building"></i>所在机构：
              </template>
              {{ eventCenterPreview.orgName }}
            </el-form-item>
            <el-form-item>
              <template slot="label">
                <i class="el-icon-house"></i>活动室：
              </template>
              {{ eventCenterPreview.activityRoomName }}
            </el-form-item>
            <el-form-item>
              <template slot="label">
                <i class="el-icon-files"></i>服务产品：
              </template>
              <span v-for="(item, index) in eventCenterPreview.orgServiceProductList" :key="index">
                {{ item.orgServiceProductName }}
                <el-divider direction="vertical"></el-divider>
              </span>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
    <el-tabs value="first" style="margin-top:20px;">
      <el-tab-pane label="参与对象" name="first">
        <Participants
          :customerNum="eventCenterPreview.customerNum"
          :actualCustomerNum="eventCenterPreview.actualCustomerNum"
          :activityId="$route.query.aid"
        ></Participants>
      </el-tab-pane>
      <el-tab-pane label="服务人员" name="second">
        <ServicePerson :activityId="$route.query.aid"></ServicePerson>
      </el-tab-pane>
      <el-tab-pane label="活动总结" name="third">
        <ActivitySummary :status="eventCenterPreview.activityStatus" :htmlStr="eventCenterPreview.activitySummary"></ActivitySummary>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Participants from './eventInfoTabs/Participants'
import ServicePerson from './eventInfoTabs/ServicePerson'
import ActivitySummary from './eventInfoTabs/ActivitySummary'
import summary from '@/common/image/summary.png'
import going from '@/common/image/going.png'

export default {
  name: 'eventCenterPreview',
  components: {
    Participants,
    ServicePerson,
    ActivitySummary
  },
  data () {
    return {
      summary,
      going,
      eventCenterPreview: {
        cover: ''
      }
    }
  },
  created () {
    this.getActivityInfo()
  },
  methods: {
    getActivityInfo () {
      this.$http
        .get('/activity/get?activityId=' + this.$route.query.aid)
        .then(res => {
          if (res.code === SUCCESS) {
            this.eventCenterPreview = res.payload
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
.box-card {
  position: relative;
  .status-img {
    height: 100px;
    position: absolute;
    right: 30px;
    top: 30px;
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
