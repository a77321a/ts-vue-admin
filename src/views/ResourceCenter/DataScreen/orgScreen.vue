<!--
 * @Descripttion:
 * @Author:
 * @Date: 2019-12-25 16:05:37
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2019-12-26 16:40:04
 -->
<template>
  <div id="org-srceen">
    <el-row :gutter="10" justify="space-around">
      <el-col
        v-for="(item, index) in orgList"
        :key="index"
        :xs="11"
        :sm="7"
        :md="7"
        :lg="7"
        :xl="7"
      >
        <el-card :body-style="{ padding: '0px' }" class="box-card">
          <el-image :src="item.indexPic" class="box-image"></el-image>
          <h2>{{item.orgName}}</h2>
          <el-link class="link" :underline="false" @click="openScreenUrl(item)" type="primary">点击查看</el-link>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import orgIcon from '@/common/image/org_icon.png'
export default {
  name: 'orgScreen',
  data () {
    return {
      orgList: [],
      orgIcon
    }
  },
  created () {
    let userInfo = JSON.parse(localStorage.userInfo)
    let userType = userInfo.superAdmin
    if (userType) {
      this.orgList = [
        {
          orgName: '机构大屏',
          indexPic: orgIcon,
          url: `${this.$screen}#/?x-token=${userInfo.token}`
        }
      ]
    } else {
      this.$http.get('/org/authorizedList').then(res => {
        let data = res.payload
        let arr = []
        data.forEach(i => {
          arr.push({
            orgName: i.orgName,
            indexPic:
              this.$store.state.config.systemConfig[0].dictionaryValue +
              '' +
              i.cad,
            url: `${this.$screen}#/secondpage?orgId=${i.orgId}&x-token=${
              userInfo.token
            }`
          })
        })
        this.orgList = arr
      })
    }
  },
  methods: {
    openScreenUrl (item) {
      window.open(item.url, '_target')
    }
  }
}
</script>
<style lang="scss" scoped>
.box-card {
  text-align: center;
  h2 {
    margin-top: 10px;
    margin-bottom: 20px;
  }
  .link {
    margin-bottom: 5px;
  }
  .box-image {
    display: block;
    height: 100px;
  }
}
</style>
