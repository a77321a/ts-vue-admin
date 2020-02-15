<!--
 * @Descripttion: 活动详情
 * @Author:
 * @Date: 2019-11-07 19:28:01
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-15 10:22:26
 -->
<template>
  <div id="event-info">
    <el-card shadow="never" class="box-card">
      <div class="flex-t-l">
        <div style="display:block">
          <img
            style="height:130px;"
            :src="
            $store.state.config.systemConfig[0].dictionaryValue +
              orgInfo.indexPic
          "
            alt
          />
        </div>
        <div class="flex-column-t">
          <h4 style="margin-bottom:10px;margin-top:5px">
            {{ orgInfo.orgName }}
            <el-tag
              style="margin-right:5px"
              size="mini"
              type="info"
            >{{$func.transLabel($store.state.config.orgType,orgInfo.orgType)}}</el-tag>
            <el-tag
              style="margin-right:5px"
              size="mini"
              type="info"
            >{{$func.transLabel($store.state.config.serviceType,orgInfo.serviceType)}}</el-tag>
            <el-tag
              style="margin-right:5px"
              size="mini"
              type="info"
            >{{$func.transLabel($store.state.config.operationModeList,orgInfo.operationMode)}}</el-tag>
          </h4>
          <el-form
            label-suffix="："
            label-position="left"
            ref="form"
            :model="orgInfo"
            label-width="100px"
          >
            <el-form-item label="服务范围">
              {{ orgInfo.cityRegionName }}
              {{ orgInfo.districtRegionName }}
              {{ orgInfo.streetRegionName }}
              {{ orgInfo.communityRegionName }}
            </el-form-item>
            <el-form-item label="机构联系人">
              {{ orgInfo.contact }}
              <span style="margin:0 20px 0 30px">联系电话：</span>
              <!-- <el-form-item label="联系电话">{{ orgInfo.tel }}</el-form-item> -->
              {{ orgInfo.tel }}
            </el-form-item>
            <el-form-item label="机构地址">{{ orgInfo.orgAddress }}</el-form-item>
            <el-form-item label="机构介绍">{{ orgInfo.orgDesc }}</el-form-item>
          </el-form>
        </div>
      </div>
      <el-button @click="dialogVisible = true" style="margin-left:74px" type="text">查看照片</el-button>
    </el-card>
    <el-tabs value="first" style="margin-top:20px;">
      <el-tab-pane label="服务人员" name="first">
        <ServicePerson :orgId="$route.query.oid"></ServicePerson>
      </el-tab-pane>
      <el-tab-pane label="服务产品" name="second">
        <ServiceProduct :orgId="$route.query.oid"></ServiceProduct>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="机构照片" :visible.sync="dialogVisible" width="50%">
      <el-carousel
        arrow="always"
        indicator-position="outside"
        :autoplay="false"
        trigger="click"
        height="450px"
      >
        <el-carousel-item v-for="item in orgInfo.orgPicList" :key="item">
          <img
            style="width:100%;height:100%;"
            :src="$store.state.config.systemConfig[0].dictionaryValue+item"
            alt
          />
        </el-carousel-item>
      </el-carousel>
    </el-dialog>
  </div>
</template>
<script>
// import Participants from './orgInfoTabs/Participants';
import ServicePerson from './orgInfoTabs/ServicePerson'
import ServiceProduct from './orgInfoTabs/ServiceProduct'

// import ActivitySummary from './orgInfoTabs/ActivitySummary';
// import summary from '@/common/image/summary.png';
// import going from '@/common/image/going.png';

export default {
  name: 'orgInfo',
  components: {
    ServiceProduct,
    ServicePerson
    // ActivitySummary
  },
  data () {
    return {
      dialogVisible: false,
      orgInfo: {}
    }
  },
  created () {
    this.getActivityInfo()
  },
  methods: {
    getActivityInfo () {
      this.$http.get('/org/get?orgId=' + this.$route.query.oid).then(res => {
        if (res.code === SUCCESS) {
          this.orgInfo = res.payload
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
