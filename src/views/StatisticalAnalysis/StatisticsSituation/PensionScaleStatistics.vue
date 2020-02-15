<!--
 * @Descripttion:养老规模统计
 * @Author:
 * @Date: 2019-11-06 22:31:31
 * @LastEditors:
 * @LastEditTime: 2019-12-03 14:44:04
 -->
<template>
  <div id="pension-scale">
    <div class="title">资源概况</div>
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="8">
        <el-card class="box-card">
          <H2>
            <countTo :startVal="0" :endVal="pensionScaleInfo.activityRoomNum" :duration="1500"></countTo>
          </H2>
          <div>活动室</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <H2>
            <countTo
              :startVal="0"
              :endVal="pensionScaleInfo.orgServiceProviderNum"
              :duration="1500"
            ></countTo>
          </H2>
          <div>服务人员数</div>
        </el-card>
      </el-col>
    </el-row>
    <div class="title">机构概况</div>
    <el-row type="flex" class="row-bg" justify="space-around">
      <el-col :span="6">
        <el-card class="box-card">
          <H2>
            <countTo :startVal="0" :endVal="pensionScaleInfo.orgNum" :duration="1500"></countTo>
          </H2>
          <div>养老机构数</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <H2>
            <countTo :startVal="0" :endVal="pensionScaleInfo.societyOrgNum" :duration="1500"></countTo>
          </H2>
          <div>社会化运营机构数</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="box-card">
          <H2>
            <countTo :startVal="0" :endVal="pensionScaleInfo.relatedOrgNum" :duration="1500"></countTo>
          </H2>
          <div>涉老机构数</div>
        </el-card>
      </el-col>
    </el-row>
    <div style="min-height:240px" id="barChart"></div>
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
      pensionScaleInfo: {
        activityRoomNum: 0,
        orgNum: 0,
        orgServiceProviderNum: 0,
        relatedOrgNum: 0,
        societyOrgNum: 0
      },
      barChart: null
    }
  },
  mounted () {
    this.getPensionInfo()
  },
  methods: {
    getPensionInfo () {
      this.$http.get('/stats/pension').then(res => {
        if (res.code === SUCCESS) {
          this.pensionScaleInfo = res.payload
          this.barChart = echarts.init(document.getElementById('barChart'))
          let option = {
            color: ['#3398DB'],
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: [
              {
                type: 'category',
                data: ['养老机构数', '社会化运营机构数', '涉老机构数'],
                axisTick: {
                  alignWithLabel: true
                }
              }
            ],
            yAxis: [
              {
                type: 'value'
              }
            ],
            series: [
              {
                name: '数量',
                type: 'bar',
                barWidth: '60%',
                data: [
                  this.pensionScaleInfo.orgNum,
                  this.pensionScaleInfo.societyOrgNum,
                  this.pensionScaleInfo.relatedOrgNum
                ]
              }
            ]
          }
          this.barChart.clear()
          this.barChart.setOption(option)
          window.onresize = () => {
            this.barChart.resize()
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/common/css/variable.scss';
#pension-scale {
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
