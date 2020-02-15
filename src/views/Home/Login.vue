<!--
 * @Descripttion: 登陆界面
 * @Date: 2019-08-13 17:09:55
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-12-18 11:19:36
 * @Auther: XXN
 -->
<template>
  <el-row
    type="flex"
    justify="center"
    align="middle"
    class="login"
    @keydown.enter.native="submitLogin"
  >
    <el-col :xs="{span:22}" style="width: 368px;">
      <el-row class="header">
        <img src="../../assets/login-logo.png" style="width:100%" />
        <!-- <div class="description">企业主后台</div> -->
      </el-row>
      <div class="major">管理平台</div>
      <el-row class="login-form">
        <el-form ref="usernameLoginForm" :model="form" :rules="rules" class="form">
          <el-form-item prop="username">
            <el-input
              v-model="form.account"
              prefix-icon="el-icon-user"
              size="large"
              clearable
              placeholder="请输入手机号"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item style="margin-bottom:10px" prop="password">
            <el-input
              type="password"
              v-model="form.password"
              show-password
              prefix-icon="el-icon-lock"
              size="large"
              clearable
              placeholder="请输入密码"
              autocomplete="off"
            />
          </el-form-item>
        </el-form>
        <el-button
          class="lost-password"
          @click="$router.push({name:'lostPassword'})"
          type="text"
        >忘记密码</el-button>

        <el-row>
          <el-button
            :loading="loading"
            class="login-btn"
            type="primary"
            size="large"
            @click="submitLogin"
          >{{loading?'登录中...':'登录'}}</el-button>
        </el-row>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  data() {
    return {
      loginBg: require('@/assets/login_bg.png'),
      loading: false,
      sending: false,
      sended: false,
      maxLength: 6,
      errorCode: '',
      form: {
        account: '',
        password: ''
      },
      rules: {
        account: [
          {
            required: true,
            message: '账号不能为空'
          }
        ],
        password: [
          {
            required: true,
            message: '密码不能为空'
          }
        ]
      }
    }
  },
  created() {
    sessionStorage.clear()
    this.$store.commit('setNavList', [])
  },
  methods: {
    submitLogin() {
      this.loading = true
      this.$http
        .post('/admin/login', {
          account: this.form.account,
          password: this.form.password
        })
        .then(res => {
          console.log(res)
          if (res.code === SUCCESS) {
            this.$store.commit('setToken', res.payload.token)
            this.$store.commit('setUserInfo', res.payload)
            this.$store.commit('setUserId', res.payload.userId)
            this.$store.commit('setPermList', res.payload.permissionList)
            let permBtn = []
            res.payload.permissionList.forEach(i => {
              if (i.permissionDepth === 4) {
                permBtn.push(i.permissionUrl)
              }
            })
            this.$store.commit('setPermBtnList', permBtn)
            // this.$store.dispatch('get_menu', { router: this.$router,permissionList:res.payloadpermissionList })
            this.$store.dispatch('getDictionaryManagement', {
              router: this.$router,
              permissionList: res.payloadpermissionList
            })
          } else {
            this.loading = false
          }
        })
    }
  },
  mounted() {}
}
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  background: url('../../assets/login_bg.png');
  background-size: 100% 100%;
  .header {
    margin-bottom: 3vh;
    text-align: center;
    .description {
      font-size: 14px;
      color: rgba(0, 0, 0, 0.45);
      margin-top: 1vh;
    }
  }
  .major {
    font-size: 20px;
    margin-bottom: 20px;
    text-align: center;
    color: #2d8cf0;
  }
  .login-form {
    margin-bottom: 16vh;
  }
  .ivu-tabs-nav-container {
    line-height: 2;
    font-size: 17px;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    position: relative;
    zoom: 1;
  }
  .form {
    padding-top: 1vh;
    .el-input-verify {
      width: 70%;
    }
    .count-verify,
    .send-verify {
      width: 100px;
    }
  }
  .forget-pass,
  .other-way {
    font-size: 14px;
  }
  .login-btn {
    display: block;
    width: 100%;
    margin-top: 1vh;
  }
  .icons {
    display: flex;
    align-items: center;
  }
  .other-icon {
    cursor: pointer;
    margin-left: 10px;
    display: flex;
    align-items: center;
    color: rgba(0, 0, 0, 0.2);
    :hover {
      color: #2d8cf0;
    }
  }
  .foot {
    margin-bottom: 2vh;
    color: rgba(0, 0, 0, 0.45);
    font-size: 14px;
    .help {
      margin: 0 auto 1vh;
      width: 60%;
      .item {
        color: rgba(0, 0, 0, 0.45);
      }
      :hover {
        color: rgba(0, 0, 0, 0.65);
      }
    }
  }
}

.ivu-tabs-nav .ivu-tabs-tab .ivu-icon {
  width: 14px;
  height: 14px;
  margin-right: 8px;
  margin-bottom: 5px;
}
.lost-password {
  color: #2d8cf0;
  padding-left: 0;
}
</style>
