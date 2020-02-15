<!--
 * @Descripttion: 活动室详情
 * @Author:
 * @Date: 2019-11-07 19:28:01
 * @LastEditors:
 * @LastEditTime: 2019-12-16 20:33:19
 -->
<template>
  <div id="event-room-info">
    <el-card shadow="never" class="box-card">
      <H2 style="margin-bottom:15px">{{roleInfo.roleName}}</H2>
      <div>{{roleInfo.roleDesc}}</div>
    </el-card>
    <el-tabs value="first" style="margin-top:20px;">
      <el-tab-pane label="用户人员" name="first">
        <usersLIst @searchList="getRoleInfo" :userList="roleInfo.userList"></usersLIst>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import usersLIst from './roleInfoTabs/usersLIst'
export default {
  name: 'roleInfo',
  components: {
    usersLIst
  },
  data () {
    return {
      roleInfo: {
        userList: []
      }
    }
  },
  created () {
    this.getRoleInfo({})
  },
  methods: {
    getRoleInfo (val) {
      this.$http
        .get(
          '/role/get?roleId=' + this.$route.query.rid,
          !val.nickName ? {} : val
        )
        .then(res => {
          if (res.code === SUCCESS) {
            this.roleInfo = res.payload
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
