<!--
 * @Descripttion:
 * @Author:
 * @Date: 2019-11-16 18:41:35
 * @LastEditors:
 * @LastEditTime: 2019-12-10 22:37:44
 -->
<template>
  <el-col
    id="org-tree-list-aside"
    :class="toggleShow ? 'border' : 'no-padding'"
    :span="toggleShow ? 5 : 1"
  >
    <transition name="moveL">
      <div class="trans" v-show="toggleShow">
        <el-input
          style="margin:10px 0;"
          size="small"
          placeholder="请输入内容"
          v-model="orgName"
          class="input-with-select"
        >
          <el-button @click="getOrgList" slot="append" icon="el-icon-search"></el-button>
        </el-input>
        <div class="checked">
          {{ checkedOrg.orgName || "所有机构" }}
          <i
            @click="filterOrg(null, true)"
            style="float:right"
            v-if="checkedOrg.orgId"
            class="el-icon-error closeFilter"
          ></i>
        </div>
        <div>
          <el-collapse value="0">
            <el-collapse-item
              :key="index"
              v-for="(item, index) in orgList"
              :title="item.orgName"
              :name="index"
            >
              <template slot="title">
                <div class="org-title">{{item.orgName}}</div>
              </template>
              <div
                :class="son.orgId == checkedOrg.orgId ? 'select' : ''"
                class="son-list"
                @click="filterOrg(son)"
                v-for="(son, index) in item.children"
                v-if="son.orgId"
                :key="index"
              >{{ son.orgName }}</div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </transition>
    <span :class="!toggleShow ? 'center' : ''" @click="changeToggleShow" class="toggle-span">
      <i :class="toggleShow ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
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
      orgList: [],
      checkedOrg: {
        orgId: '',
        orgName: ''
      }
    }
  },
  created () {
    this.getOrgList()
  },
  methods: {
    filterOrg (son, reset) {
      if (reset) {
        this.checkedOrg = {
          orgId: '',
          orgName: ''
        }
      } else {
        this.checkedOrg = son
      }
      this.$emit('filterOrg', this.checkedOrg.orgId)
    },
    getOrgList () {
      this.$http
        .post('/org/tree', {
          orgName: this.orgName
        })
        .then(res => {
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
    },
    changeToggleShow () {
      this.toggleShow = !this.toggleShow
      this.$emit('toggleChange', this.toggleShow ? 19 : 23)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/common/css/variable.scss';
.select {
  color: $theme-color;
}
.no-padding {
  padding: 0 !important;
  width: 1%;
}
.org-title {
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
.moveL-leave-to {
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
    cursor: pointer;
    height: 32px;
    line-height: 32px;
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
    border-left: 5px solid $theme-color;
    position: relative;
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
        color: $theme-color;
        transition: color 0.1s ease-out;
      }
    }
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
