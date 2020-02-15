<!--
 * @Descripttion:服务开展统计
 * @Author:
 * @Date: 2019-11-06 22:31:31
 * @LastEditors:
 * @LastEditTime: 2019-12-08 19:57:41
 -->
<template>
  <div id="ServiceDevelopmentStatistics">
    <div class="title">活动概况</div>
    <el-form inline ref="form" label-width="80px" size="small">
      <el-form-item label="开展机构">
        <el-cascader
          clearable
          :props="{ value: 'orgId', label: 'orgName', emitPath: false }"
          :options="orgList"
          v-model="searchData.orgId"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="开展时间">
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
        <el-button
          @click="
            searchData = {};
            searchRefresh = !searchRefresh;
          "
          size="small"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="6">
        <el-card class="box-card">
          <H2>
            <countTo :startVal="0" :endVal="activityInfo.activityNum" :duration="1500"></countTo>
          </H2>
          <div>活动开展次数</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <H2>
            <countTo :startVal="0" :endVal="activityInfo.serviceCustomerNum" :duration="1500"></countTo>
          </H2>
          <div>参加活动老人数</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <div style="height:100%" id="activityPie"></div>
      </el-col>
    </el-row>
    <div class="title">服务概况</div>
    <el-form inline ref="form" label-width="80px" size="small">
      <el-form-item label="开展机构">
        <el-cascader
          clearable
          :props="{ value: 'orgId', label: 'orgName', emitPath: false }"
          :options="orgList"
          v-model="serviceDataSearch.orgId"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="开展时间">
        <el-date-picker
          v-model="serviceDataSearch.startDate"
          :picker-options="{ firstDayOfWeek: 1 }"
          type="week"
          format="yyyy 第 WW 周"
          value-format="yyyy-MM-dd"
          placeholder="选择周"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          @click="searchServiceRefresh = !searchServiceRefresh"
          icon="el-icon-search"
        >搜索</el-button>
        <el-button
          @click="
            serviceDataSearch = {};
            searchServiceRefresh = !searchServiceRefresh;
          "
          size="small"
        >重置</el-button>
      </el-form-item>
    </el-form>
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="6">
        <el-card class="box-card">
          <H2>
            <countTo :startVal="0" :endVal="serviceInfo.customerDinnerNum" :duration="1500"></countTo>
          </H2>
          <div>助餐人次</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <H2>
            <countTo :startVal="0" :endVal="serviceInfo.serviceRecordCustomerNum" :duration="1500"></countTo>
          </H2>
          <div>享受服务人次</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <div style="height:100%" id="servicePie"></div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import countTo from 'vue-count-to'
import echarts from 'echarts'
export default {
  name: 'PensionScaleStatistics',
  components: {
    countTo
  },
  data () {
    return {
      searchData: {},
      serviceDataSearch: {},
      searchServiceRefresh: false,
      searchRefresh: false,
      orgList: [],
      activityPieChart: null,
      servicePieChart: null,
      activityInfo: {
        activityNum: 0,
        activityNumCarriedOut: 0,
        activityNumCarriedOutPercent: '',
        activityNumToBeCarriedOut: 0,
        activityNumToBeCarriedOutPercent: '',
        serviceCustomerNum: 0
      },
      serviceInfo: {
        customerDinnerNum: 0,
        customerDinnerNumList: [],
        serviceCustomerPercent: '',
        serviceRecordCustomerNum: 0,
        serviceRecordCustomerNumList: []
      }
    }
  },
  created () {
    this.getOrgList()
  },
  mounted () {
    this.getStaInfo()
    this.getServiceStaInfo()
  },
  watch: {
    searchServiceRefresh () {
      this.getServiceStaInfo()
    },
    searchRefresh () {
      this.getStaInfo()
    }
  },
  methods: {
    handlTime (date) {
      if (date) {
        this.searchData.startTime = date[0]
        this.searchData.endTime = date[1]
      } else {
        this.searchData.startTime = ''
        this.searchData.endTime = ''
      }
    },
    getStaInfo () {
      this.$http
        .post('/stats/serviceActivityStats', {
          orgId: this.searchData.orgId,
          startDate: this.searchData.startTime,
          endDat: this.searchData.endTime
        })
        .then(res => {
          if (res.code === SUCCESS) {
            this.activityInfo = res.payload
            this.activityPieChart = echarts.init(
              document.getElementById('activityPie')
            )

            let option = {
              title: {
                show: true,
                text: '活动开展情况',
                left: 'center',
                textStyle: {
                  fontSize: '18px'
                }
              },
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b}: {c} ({d}%)',
                // formatter: function (param) {
                //   return (
                //     '<div>' +
                //     param.name +
                //     '</div><div>' +
                //     param.data.value +
                //     '个 &nbsp;&nbsp;&nbsp;占比' +
                //     param.percent +
                //     '%</div>'
                //   )
                // },
                backgroundColor: 'rgba(255,255,255,.6)',
                borderColor: '#ccc',
                borderWidth: 1,
                textStyle: {
                  color: '#333'
                },
                extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
              },
              legend: {
                orient: 'vertical',
                top: 'middle',
                itemWidth: 15,
                left: 0
              },
              series: [
                {
                  name: '访问来源',
                  type: 'pie',
                  radius: ['30%', '60%'],
                  center: ['60%', '50%'],
                  avoidLabelOverlap: false,
                  label: {
                    normal: {
                      show: false,
                      position: 'center'
                    },
                    emphasis: {
                      show: false,
                      textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                      }
                    }
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  data: [
                    {
                      value: res.payload.activityNumCarriedOut,
                      name: '已开展次数'
                    },
                    {
                      value: res.payload.activityNumToBeCarriedOut,
                      name: '未开展次数'
                    }
                  ]
                }
              ]
            }
            this.activityPieChart.clear()
            this.activityPieChart.setOption(option)
            window.onresize = () => {
              this.activityPieChart.resize()
            }
          }
        })
    },
    getServiceStaInfo () {
      this.$http
        .post('/stats/serviceRecordStats', {
          orgId: this.serviceDataSearch.orgId,
          startDate: this.serviceDataSearch.startDate
        })
        .then(res => {
          if (res.code === SUCCESS) {
            this.serviceInfo = res.payload
            this.servicePieChart = echarts.init(
              document.getElementById('servicePie')
            )

            let option = {
              title: {
                show: true,
                text: '老人占比情况',
                left: 'center',
                textStyle: {
                  fontSize: '18px'
                }
              },
              tooltip: {
                trigger: 'item',
                formatter: function (param) {
                  if (param.name) {
                    return (
                      '<div>' +
                      param.name +
                      '</div><div>' +
                      '&nbsp;&nbsp;&nbsp;占比' +
                      param.data.value * 100 +
                      '%</div>'
                    )
                  }
                },
                backgroundColor: 'rgba(255,255,255,.6)',
                borderColor: '#ccc',
                borderWidth: 1,
                textStyle: {
                  color: '#333'
                },
                extraCssText: 'box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);'
              },
              color: ['#409eff', '#ccc'],
              legend: {
                orient: 'vertical',
                top: 'middle',
                itemWidth: 15,
                left: 0
              },
              series: [
                {
                  name: '访问来源',
                  type: 'pie',
                  radius: ['30%', '60%'],
                  center: ['70%', '50%'],
                  avoidLabelOverlap: false,
                  label: {
                    normal: {
                      show: false,
                      position: 'center'
                    },
                    emphasis: {
                      show: false,
                      textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                      }
                    }
                  },
                  labelLine: {
                    normal: {
                      show: false
                    }
                  },
                  data: [
                    {
                      value:
                        res.payload.serviceCustomerPercent.replace('%', '') /
                        100,
                      name: '享受服务的老人'
                    },
                    {
                      value:
                        1 -
                        res.payload.serviceCustomerPercent.replace('%', '') /
                          100
                    }
                  ]
                }
              ]
            }
            this.servicePieChart.clear()
            this.servicePieChart.setOption(option)
            window.onresize = () => {
              this.servicePieChart.resize()
            }
          }
        })
    },
    getOrgList () {
      this.$http.post('/org/tree').then(res => {
        if (res.code === SUCCESS) {
          this.orgList = res.payload
          this.orgList.forEach(i => {
            if (i.children.length > 0) {
              i.children.forEach(j => {
                delete j.children
              })
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/common/css/variable.scss';

#ServiceDevelopmentStatistics {
  .row-bg {
    margin-bottom: 10px;
  }
  .box-card {
    text-align: center;
    h2 {
      font-size: 30px;
      font-weight: 700;
      color: $theme-color;
    }
  }
}
</style>
