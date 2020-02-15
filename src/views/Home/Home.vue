<!--
 * @Descripttion:主页
 * @Author:
 * @Date: 2019-11-05 10:27:14
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-21 13:56:37
 -->
<template>
  <div class="Home">
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>今日接待人数</span>
          </div>
          <el-col :span="16">
            <H4 style="text-align:center;display:inline-block;width:90%">
              <countTo :startVal="0" :endVal="data.serviceRecordNumInfo.todayNum" :duration="1500"></countTo>
            </H4>
            <el-divider direction="vertical"></el-divider>
          </el-col>
          <el-col style="line-height:30px;font-size:12px;" :span="8">
            <div>
              比昨天
              <span
                :class="
                  data.serviceRecordNumInfo.yesterdayNum -
                    data.serviceRecordNumInfo.todayNum >
                  0
                    ? 'down'
                    : 'rise'
                "
              >
                <i
                  :class="
                    data.serviceRecordNumInfo.yesterdayNum -
                      data.serviceRecordNumInfo.todayNum >
                    0
                      ? 'el-icon-caret-bottom'
                      : 'el-icon-caret-top'
                  "
                ></i>
                {{
                data.serviceRecordNumInfo.todayNum -
                data.serviceRecordNumInfo.yesterdayNum
                }}
              </span>
            </div>
            <div>
              比七日
              <span
                :class="
                  data.serviceRecordNumInfo.sevenDaysNum -
                    data.serviceRecordNumInfo.todayNum >
                  0
                    ? 'down'
                    : 'rise'
                "
              >
                <i
                  :class="
                    data.serviceRecordNumInfo.sevenDaysNum -
                      data.serviceRecordNumInfo.todayNum >
                    0
                      ? 'el-icon-caret-bottom'
                      : 'el-icon-caret-top'
                  "
                ></i>
                {{
                Math.abs(
                data.serviceRecordNumInfo.todayNum -
                data.serviceRecordNumInfo.sevenDaysNum
                )
                }}
              </span>
            </div>
          </el-col>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>今日参与活动人数</span>
          </div>
          <el-col :span="16">
            <H4 style="text-align:center;display:inline-block;width:90%">
              <countTo :startVal="0" :endVal="data.activityPartNumInfo.todayNum" :duration="1500"></countTo>
            </H4>
            <el-divider direction="vertical"></el-divider>
          </el-col>
          <el-col style="line-height:30px;font-size:12px;" :span="8">
            <div>
              比昨天
              <span
                :class="
                  data.activityPartNumInfo.yesterdayNum -
                    data.activityPartNumInfo.todayNum >
                  0
                    ? 'down'
                    : 'rise'
                "
              >
                <i
                  :class="
                    data.activityPartNumInfo.yesterdayNum -
                      data.activityPartNumInfo.todayNum >
                    0
                      ? 'el-icon-caret-bottom'
                      : 'el-icon-caret-top'
                  "
                ></i>
                {{
                data.activityPartNumInfo.todayNum -
                data.activityPartNumInfo.yesterdayNum
                }}
              </span>
            </div>
            <div>
              比七日
              <span
                :class="
                  data.activityPartNumInfo.sevenDaysNum -
                    data.activityPartNumInfo.todayNum >
                  0
                    ? 'down'
                    : 'rise'
                "
              >
                <i
                  :class="
                    data.activityPartNumInfo.sevenDaysNum -
                      data.activityPartNumInfo.todayNum >
                    0
                      ? 'el-icon-caret-bottom'
                      : 'el-icon-caret-top'
                  "
                ></i>
                {{
                Math.abs(
                data.activityPartNumInfo.todayNum -
                data.activityPartNumInfo.sevenDaysNum
                )
                }}
              </span>
            </div>
          </el-col>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>今日助餐人次</span>
          </div>
          <el-col :span="16">
            <H4 style="text-align:center;display:inline-block;width:90%">
              <countTo
                :startVal="0"
                :endVal="
                  data.customerDinnerNumInfo
                    ? data.customerDinnerNumInfo.todayNum
                    : 0
                "
                :duration="1500"
              ></countTo>
            </H4>
            <el-divider direction="vertical"></el-divider>
          </el-col>
          <el-col
            v-if="data.customerDinnerNumInfo"
            style="line-height:30px;font-size:12px;"
            :span="8"
          >
            <div>
              比昨天
              <span
                :class="
                  data.customerDinnerNumInfo.yesterdayNum -
                    data.customerDinnerNumInfo.todayNum >
                  0
                    ? 'down'
                    : 'rise'
                "
              >
                <i
                  :class="
                    data.customerDinnerNumInfo.yesterdayNum -
                      data.customerDinnerNumInfo.todayNum >
                    0
                      ? 'el-icon-caret-bottom'
                      : 'el-icon-caret-top'
                  "
                ></i>
                {{
                data.customerDinnerNumInfo.todayNum -
                data.customerDinnerNumInfo.yesterdayNum
                }}
              </span>
            </div>
            <div>
              比七日
              <span
                :class="
                  data.customerDinnerNumInfo.sevenDaysNum -
                    data.customerDinnerNumInfo.todayNum >
                  0
                    ? 'down'
                    : 'rise'
                "
              >
                <i
                  :class="
                    data.customerDinnerNumInfo.sevenDaysNum -
                      data.customerDinnerNumInfo.todayNum >
                    0
                      ? 'el-icon-caret-bottom'
                      : 'el-icon-caret-top'
                  "
                ></i>
                {{
                Math.abs(
                data.customerDinnerNumInfo.todayNum -
                data.customerDinnerNumInfo.sevenDaysNum
                )
                }}
              </span>
            </div>
          </el-col>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>本周活动开展次数</span>
          </div>
          <el-col :span="11">
            <H4 style="text-align:center;display:inline-block;width:90%">
              已开展
              <countTo :startVal="0" :endVal="data.activityNumCarriedOutWeek" :duration="1500"></countTo>
            </H4>
          </el-col>
          <el-col :span="2">
            <el-divider style="float:left" direction="vertical"></el-divider>
          </el-col>
          <el-col :span="11">
            <H4 style="text-align:center;display:inline-block;width:90%">
              待开展
              <countTo :startVal="0" :endVal="data.activityNumToBeCarriedOutWeek" :duration="1500"></countTo>
            </H4>
          </el-col>
        </el-card>
      </el-col>
    </el-row>
    <!-- 第二排统计 -->
    <el-row :gutter="20" style="margin-top:20px" type="flex">
      <el-col :span="14">
        <el-row :gutter="20" type="flex" style="margin-bottom:20px;" justify="space-between">
          <el-col :span="8">
            <el-card :body-style="{ padding: '45px 0px' }">
              <el-row type="flex" class="row-bg" justify="center">
                <el-col style="font-size:30px;" :span="6">
                  <i style="margin-top:5px" class="el-icon-office-building"></i>
                </el-col>
                <el-col :span="12">
                  <h2>
                    <countTo
                      style="font-size:30px"
                      :startVal="0"
                      :endVal="data.orgNum"
                      :duration="1500"
                    ></countTo>
                  </h2>
                  <div style="font-size:14px">社会化运营机构数</div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card :body-style="{ padding: '45px 0px' }">
              <el-row type="flex" class="row-bg" justify="center">
                <el-col style="font-size:30px;" :span="6">
                  <i style="margin-top:5px" class="el-icon-office-building"></i>
                </el-col>
                <el-col :span="12">
                  <h2>
                    <countTo
                      style="font-size:30px"
                      :startVal="0"
                      :endVal="data.societyOrgNum"
                      :duration="1500"
                    ></countTo>
                  </h2>
                  <div style="font-size:14px">养老机构数</div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card :body-style="{ padding: '45px 0px' }">
              <el-row type="flex" class="row-bg" justify="center">
                <el-col style="font-size:30px;" :span="6">
                  <i style="margin-top:5px" class="el-icon-office-building"></i>
                </el-col>
                <el-col :span="12">
                  <h2>
                    <countTo
                      style="font-size:30px"
                      :startVal="0"
                      :endVal="data.relatedOrgNum"
                      :duration="1500"
                    ></countTo>
                  </h2>
                  <div style="font-size:14px">涉老机构数</div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex" justify="space-between">
          <el-col :span="8">
            <el-card :body-style="{ padding: '45px 0px' }">
              <el-row type="flex" class="row-bg" justify="center">
                <el-col style="font-size:30px;" :span="6">
                  <i style="margin-top:5px" class="el-icon-office-building"></i>
                </el-col>
                <el-col :span="12">
                  <h2>
                    <countTo
                      style="font-size:30px"
                      :startVal="0"
                      :endVal="data.activityRoomNum"
                      :duration="1500"
                    ></countTo>
                  </h2>
                  <div style="font-size:14px">活动室数</div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card :body-style="{ padding: '45px 0px' }">
              <el-row type="flex" class="row-bg" justify="center">
                <el-col style="font-size:30px;" :span="6">
                  <i style="margin-top:5px" class="el-icon-office-building"></i>
                </el-col>
                <el-col :span="12">
                  <h2>
                    <countTo
                      style="font-size:30px"
                      :startVal="0"
                      :endVal="data.orgServiceProductNum"
                      :duration="1500"
                    ></countTo>
                  </h2>
                  <div style="font-size:14px">服务产品数</div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card :body-style="{ padding: '45px 0px' }">
              <el-row type="flex" class="row-bg" justify="center">
                <el-col style="font-size:30px;" :span="6">
                  <i style="margin-top:5px" class="el-icon-office-building"></i>
                </el-col>
                <el-col :span="12">
                  <h2>
                    <countTo
                      style="font-size:30px"
                      :startVal="0"
                      :endVal="data.orgServiceProviderNum"
                      :duration="1500"
                    ></countTo>
                  </h2>
                  <div style="font-size:14px">服务人员数</div>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="10">
        <el-card :body-style="{ minHeight: '212px' }">
          <div slot="header">
            <span>本周活动</span>
            <el-button
              @click="$router.push({ name: 'eventCenter' })"
              style="float: right; padding: 3px 0"
              type="text"
            >更多</el-button>
          </div>
          <div
            v-if="index < 4"
            v-for="(row, index) in eventList"
            :key="index"
            class="flex-t-l"
            @click="
            $router.push({ name: 'eventCenterPreview', query: { aid: row.activityId } })
          "
          >
            <img
              class="course-avatar"
              :src="
                $store.state.config.systemConfig[0].dictionaryValue +
                  row.activityIndexPic
              "
              alt
            />
            <div class="flex-column-t">
              <span class="f-title">{{ row.activityName }}</span>
              <p>{{ row.startTime }} ~ {{ row.endTime }}</p>
            </div>
          </div>
          <div v-if="eventList.length == 0" style="text-align:center">暂无活动</div>
          <!-- <el-carousel height="105px" direction="vertical" :interval="2000" :autoplay="true">
            <el-carousel-item style="padding:10px 0" v-for="(item,index) in eventList" :key="index">
              <div class="flex-t-l">
                <img
                  class="course-avatar"
                  style="height:60px"
                  :src="$store.state.config.systemConfig[0].dictionaryValue+item.activityIndexPic"
                  alt
                />
                <div class="flex-column-t">
                  <span class="f-title">{{item.activityName}}</span>
                  <p class="sm-title">活动时间：{{item.startTime}}-{{item.endTime}}</p>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>-->
        </el-card>
      </el-col>
    </el-row>
    <!-- 视频 -->
    <el-row
      :gutter="20"
      style="margin-top:20px;min-height:200px"
      type="flex"
      justify="space-between"
    >
      <el-col :span="12">
        <el-card style="min-height:300px">
          <div class="title">机构视频1</div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card style="min-height:300px">
          <div class="title">机构视频2</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import countTo from 'vue-count-to'
export default {
  name: 'Home',
  components: {
    countTo
  },
  data() {
    return {
      data: {
        serviceRecordNumInfo: {},
        customerDinnerNumInfo: {},
        activityPartNumInfo: {},
        activityNumCarriedOutWeek: 0,
        activityNumToBeCarriedOutWeek: 0,
        orgNum: 0,
        orgServiceProductNum: 0,
        orgServiceProviderNum: 0,
        relatedOrgNum: 0,
        societyOrgNum: 0
      },
      eventList: []
    }
  },
  created() {
    this.getData()
    this.getEventList()
    console.log(typeof (this.$store.state.dialogHeight - 200))
  },
  methods: {
    getData() {
      this.$http.get('/stats/home').then(res => {
        if (res.code === SUCCESS) {
          this.data = res.payload
        }
      })
    },
    getEventList() {
      this.$http.get('/activity/thisWeek').then(res => {
        if (res.code === SUCCESS) {
          this.eventList = res.payload
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.clearfix {
  text-align: center;
}
.rise {
  color: #67c23a;
}
.down {
  color: #f56c6c;
}

/deep/ .el-card__header {
  padding: 10px;
}
.box-card /deep/ .el-card__body {
  overflow: hidden;
  padding: 0;
  height: 60px;
  line-height: 60px;
}
/deep/.el-divider--vertical {
  height: 60px !important;
}
.sta-module {
  height: 100%;
  padding: 15px 30px;
  line-height: 0;
  i {
    float: left;
  }
}
.row-bg {
  text-align: center;
  div {
    font-size: 12px;
  }
}
.sm-title {
  font-size: 14px;
}
</style>
