<!--
 * @Descripttion: 活动室详情
 * @Author:
 * @Date: 2019-11-07 19:28:01
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-15 09:47:31
 -->
<template>
  <div id="event-room-info">
    <el-card shadow="never" class="box-card">
      <el-row style="margin-bottom:20px" :gutter="20">
        <el-col :span="8">活动室：{{eventRoomPreview.activityRoomName}}</el-col>
        <el-col :span="8">活动室编号：{{eventRoomPreview.activityRoomCode}}</el-col>
        <el-col :span="8">所属机构：{{eventRoomPreview.orgName}}</el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="24">简介：{{eventRoomPreview.activityRoomDesc}}</el-col>
      </el-row>
    </el-card>
    <el-tabs value="first" style="margin-top:20px;">
      <el-tab-pane label="活动记录" name="first">
        <eventRecords :activityRoomId="$route.query.aid"></eventRecords>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import eventRecords from './eventRoomInfoTabs/eventRecords'
export default {
  name: 'eventRoomPreview',
  components: {
    eventRecords
  },
  data () {
    return {
      eventRoomPreview: {}
    }
  },
  created () {
    this.getActivityRoomInfo()
  },
  methods: {
    getActivityRoomInfo () {
      this.$http
        .get('/activity/room/get?activityRoomId=' + this.$route.query.aid)
        .then(res => {
          if (res.code === SUCCESS) {
            this.eventRoomPreview = res.payload
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
