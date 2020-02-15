<!--
 * @Descripttion:
 * @Author:
 * @Date: 2019-11-16 18:41:35
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-01-07 15:43:18
 -->
<template>
  <el-col
    id="org-tree-list-aside"
    :class="toggleShow?'border':'no-padding'"
    :span="toggleShow ? 4 :1"
  >
    <transition name="moveL">
      <div class="trans" v-show="toggleShow">
        <el-input
          style="margin:10px 0;"
          size="small"
          placeholder="请输入内容"
          v-model="pensionServiceTypeName"
          class="input-with-select"
        >
          <el-button @click="getServiceTypeList" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <div class="checked">
          <span>{{checkType.pensionServiceTypeName||'所有类型'}}</span>
          <i
            v-if="checkType.pensionServiceTypeId"
            @click="filterOrg (null, true)"
            style="float:right"
            class="el-icon-error closeFilter"
          ></i>
        </div>
        <div>
          <div
            :class="son.pensionServiceTypeId == checkType.pensionServiceTypeId ? 'isCheck':''"
            class="son-list"
            @click="filterOrg(son)"
            v-for="(son, index) in serviceTypeList"
            :key="index"
          >{{son.pensionServiceTypeName}}</div>
        </div>
      </div>
    </transition>
    <span :class="!toggleShow? 'center' :''" @click="changeToggleShow" class="toggle-span">
      <i :class="toggleShow ? 'el-icon-arrow-left':'el-icon-arrow-right'"></i>
    </span>
  </el-col>
</template>
<script>
export default {
  name: 'OrgTreeList',
  data () {
    return {
      activeNames: '',
      toggleShow: true,
      orgName: '',
      serviceTypeList: [],
      checkType: {
        pensionServiceTypeId: '',
        pensionServiceTypeName: ''
      },
      pensionServiceTypeName: ''
    }
  },
  created () {
    this.getServiceTypeList()
  },
  methods: {
    filterOrg (son, reset) {
      if (reset) {
        this.checkType = {
          pensionServiceTypeId: '',
          pensionServiceTypeName: ''
        }
      } else {
        this.checkType = son
      }
      this.$emit('filterOrg', this.checkType.pensionServiceTypeId)
    },
    getServiceTypeList () {
      this.$http
        .post('/pension/service/type/pageSerach', {
          pageSize: MAXSIZE,
          pageNum: 1,
          pensionServiceTypeName: this.pensionServiceTypeName
        })
        .then(res => {
          if (res.code === SUCCESS) {
            this.serviceTypeList = res.payload.records
            // this.orgList.forEach(i => {
            //   if (i.children.length > 0) {
            //     i.children.forEach(j => {
            //       delete j.children
            //     })
            //   }
            // })
          }
        })
    },
    changeToggleShow () {
      this.toggleShow = !this.toggleShow
      this.$emit('toggleChange', this.toggleShow ? 20 : 23)
    }
  }
}
</script>
<style lang="scss" scoped>
.no-padding {
  padding: 0 !important;
  width: 1%;
}
.border {
  border: 1px solid #dcdfe6;
}
.moveL-enter-active {
  transition: transform 0.1s linear;
  transform: translateX(0%);
}
.moveL-leave-active {
  display: none;
}
.moveL-enter {
  transform: translateX(-100%);
}
#org-tree-list-aside {
  position: relative;
  height: calc(100vh - 175px);
  // background-color: #f5f5f5;
  .trans {
    // transition: all 0.3s;
  }
  /deep/ .el-collapse-item__header {
    padding-left: 10px;
  }
  /deep/ .el-collapse-item__content {
    padding: 0;
  }
  .son-list {
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
    height: 32px;
    line-height: 32px;
    font-size: 13px;
    font-weight: 500;
    transition: background 0.2s ease-in;
    padding: 0 15px;
    &:hover {
      transition: background 0.2s ease-in;
      background-color: rgba(192, 196, 204, 0.3);
    }
  }
  .checked {
    background-color: #f9f9f9;

    width: calc(100% - 30px);

    padding-left: 20px;
    height: 34px;
    line-height: 34px;
    margin: 10px 0;
    border-left: 5px solid #409eff;
    position: relative;
    span {
      display: inline-block;
      width: calc(100% - 20px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &::after {
      position: absolute;
      top: -1px;
      right: -8px;
      display: block;
      width: 0;
      height: 0;
      content: ' ';
      border-color: transparent transparent transparent #f9f9f9;
      border-style: solid;
      border-width: 18px 0 18px 8px;
    }
    .closeFilter {
      cursor: pointer;
      margin-top: 10px;
      transition: color 0.1s ease-out;
      &:hover {
        color: #409eff;
        transition: color 0.1s ease-out;
      }
    }
  }
  .isCheck {
    color: #409eff;
  }
  .toggle-span {
    position: absolute;
    top: 0;
    right: -17px;
    bottom: 0;
    width: 12px;
    cursor: pointer;
    background: 0;
    border-radius: 5px;
    -webkit-transition: background-color 0.2s;
    -o-transition: background-color 0.2s;
    transition: background-color 0.2s;
    &:hover {
      background-color: rgba(0, 0, 0, 0.1);
      transition: background-color 0.2s;
    }
    i {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 12px;
      height: 30px;
      margin-top: -10px;
      line-height: 30px;
      color: #fff;
      text-align: center;
      background: #79cdfb;
      border-radius: 6px;
      display: inline-block;
      &::before {
        position: absolute;
        left: -1px;
      }
    }
  }
  .center {
    right: -5px;
  }
}
</style>
